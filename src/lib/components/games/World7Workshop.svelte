<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { supabase } from '$lib/supabase';
	import { createWorkshopSession } from '$lib/utils/workshop.svelte';
	import {
		world7WorkshopSlides,
		world7Criteria,
		world7PartNames,
		getWorld7ProximityScore,
		getWorld7SpeedScore,
		getWorld7TotalPV,
		getWorld7Stars,
		type WorkshopSlide7
	} from '$lib/content/world7WorkshopData';
	import confetti from 'canvas-confetti';
	import FacilitatorControlPanel from '$lib/components/workshop/FacilitatorControlPanel.svelte';

	let {
		player: initialPlayer,
		instance,
		onComplete
	}: {
		player: any;
		instance: any;
		onComplete: () => void;
	} = $props();

	const session = createWorkshopSession(initialPlayer, instance, 7, onComplete);

	let currentSlideId = $state<number>(1);
	let activeMode = $state<'rating' | 'feedback' | 'final_feedback'>('rating');
	let visitedSlideIds = $state<number[]>([]);
	let isPaused = $state(false);
	let countdown = $state(0);
	let countdownInterval: any;

	let activeCriteriaIds = $state<string[]>(['evaluacion_general']);
	let isSubmissionEnabled = $state(false);

	let localRatings = $state<Record<string, number>>({});
	let hasSubmitted = $state(false);
	let submissionTime = $state(0);
	let timerStarted = $state(false);

	const classVotes = $derived.by(() => {
		const votes: Record<string, Record<string, number>> = {};
		session.allClassPlayers.forEach(p => {
			const ans = p.game_state?.[7]?.workshop_answers?.[currentSlideId];
			if (ans && ans.ratings) {
				votes[p.id] = ans.ratings;
			}
		});
		return votes;
	});

	const classTimestamps = $derived.by(() => {
		const times: Record<string, number> = {};
		session.allClassPlayers.forEach(p => {
			const ans = p.game_state?.[7]?.workshop_answers?.[currentSlideId];
			if (ans && typeof ans.time === 'number') {
				times[p.id] = ans.time;
			}
		});
		return times;
	});

	const currentSlide = $derived(
		world7WorkshopSlides.find(s => s.id === currentSlideId) || world7WorkshopSlides[0]
	);

	const currentPartNum = $derived(currentSlide.part);
	const partName = $derived(world7PartNames[currentPartNum]);
	const slidesInPart = $derived(world7WorkshopSlides.filter(s => s.part === currentPartNum));
	const slideIdxInPart = $derived(slidesInPart.findIndex(s => s.id === currentSlideId) + 1);

	const totalSlides = $derived(world7WorkshopSlides.length);
	const isLastSlide = $derived(currentSlideId === world7WorkshopSlides[world7WorkshopSlides.length - 1].id);

	const groupAverages = $derived.by(() => {
		const sums: Record<string, number> = {};
		const counts: Record<string, number> = {};
		world7Criteria.forEach(c => { sums[c.id] = 0; counts[c.id] = 0; });
		Object.values(classVotes).forEach(votes => {
			world7Criteria.forEach(c => {
				if (typeof votes[c.id] === 'number') {
					sums[c.id] += votes[c.id];
					counts[c.id]++;
				}
			});
		});
		const result: Record<string, number> = {};
		world7Criteria.forEach(c => {
			result[c.id] = counts[c.id] > 0 ? +(sums[c.id] / counts[c.id]).toFixed(1) : 0;
		});
		return result;
	});

	const standardDeviations = $derived.by(() => {
		const result: Record<string, number> = {};
		world7Criteria.forEach(c => {
			const vals: number[] = [];
			Object.values(classVotes).forEach(votes => {
				if (typeof votes[c.id] === 'number') vals.push(votes[c.id]);
			});
			if (vals.length > 1) {
				const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
				const sqDiff = vals.reduce((a, b) => a + (b - avg) ** 2, 0);
				result[c.id] = +(Math.sqrt(sqDiff / vals.length)).toFixed(1);
			} else {
				result[c.id] = 0;
			}
		});
		return result;
	});

	const submittedCount = $derived(Object.keys(classVotes).length);

	const leaderboard = $derived.by(() => {
		const scoredSlideIds = visitedSlideIds.filter(id => {
			if (id === currentSlideId) {
				return activeMode === 'feedback';
			}
			return true;
		});

		// Build class-wide answers cache for all completed slides to find group averages
		const slideAveragesCache: Record<number, Record<string, number>> = {};
		scoredSlideIds.forEach(slideId => {
			const sums: Record<string, number> = {};
			const counts: Record<string, number> = {};
			world7Criteria.forEach(c => {
				sums[c.id] = 0;
				counts[c.id] = 0;
			});

			session.allClassPlayers.forEach(p => {
				const ans = p.game_state?.[7]?.workshop_answers?.[slideId];
				if (ans && ans.ratings) {
					world7Criteria.forEach(c => {
						if (typeof ans.ratings[c.id] === 'number') {
							sums[c.id] += ans.ratings[c.id];
							counts[c.id]++;
						}
					});
				}
			});

			slideAveragesCache[slideId] = {};
			world7Criteria.forEach(c => {
				slideAveragesCache[slideId][c.id] = counts[c.id] > 0 ? +(sums[c.id] / counts[c.id]).toFixed(1) : 0;
			});
		});

		const scores: Record<string, { name: string; totalPV: number; slideCount: number }> = {};
		session.allClassPlayers.forEach(p => {
			if (p.role === 'facilitator' || p.email === 'javier@f2p.co' || p.is_facilitator === true) return;
			
			let playerPV = 0;
			let completedCount = 0;

			scoredSlideIds.forEach(slideId => {
				const ans = p.game_state?.[7]?.workshop_answers?.[slideId];
				const slideAverages = slideAveragesCache[slideId];
				if (ans && ans.ratings && slideAverages) {
					let proximitySum = 0;
					let activeCount = 0;
					
					Object.keys(ans.ratings).forEach(criterionId => {
						const myVal = ans.ratings[criterionId];
						const avg = slideAverages[criterionId];
						if (typeof myVal === 'number' && typeof avg === 'number' && avg > 0) {
							proximitySum += getWorld7ProximityScore(myVal, avg);
							activeCount++;
						}
					});

					const speedScore = getWorld7SpeedScore(ans.time || 0);
					const slidePV = getWorld7TotalPV(proximitySum, speedScore);
					playerPV += slidePV;
					completedCount++;
				}
			});

			scores[p.id] = {
				name: p.alias || p.name || p.email,
				totalPV: playerPV,
				slideCount: completedCount
			};
		});

		return Object.entries(scores)
			.sort((a, b) => b[1].totalPV - a[1].totalPV)
			.map(([id, s]) => ({ ...s, id }));
	});

	function getClassTotalPV(sId: number) {
		let total = 0;
		// 1. Calculate group averages for this slide
		const sums: Record<string, number> = {};
		const counts: Record<string, number> = {};
		world7Criteria.forEach(c => {
			sums[c.id] = 0;
			counts[c.id] = 0;
		});

		session.allClassPlayers.forEach(p => {
			if (p.role === 'facilitator' || p.email === 'javier@f2p.co' || p.is_facilitator === true) return;
			const ans = p.game_state?.[7]?.workshop_answers?.[sId];
			if (ans && ans.ratings) {
				world7Criteria.forEach(c => {
					if (typeof ans.ratings[c.id] === 'number') {
						sums[c.id] += ans.ratings[c.id];
						counts[c.id]++;
					}
				});
			}
		});

		const slideAverages: Record<string, number> = {};
		world7Criteria.forEach(c => {
			slideAverages[c.id] = counts[c.id] > 0 ? +(sums[c.id] / counts[c.id]).toFixed(1) : 0;
		});

		// 2. Sum the PV scores of all students
		session.allClassPlayers.forEach(p => {
			if (p.role === 'facilitator' || p.email === 'javier@f2p.co' || p.is_facilitator === true) return;
			const ans = p.game_state?.[7]?.workshop_answers?.[sId];
			if (ans && ans.ratings) {
				let proximitySum = 0;
				Object.keys(ans.ratings).forEach(criterionId => {
					const myVal = ans.ratings[criterionId];
					const avg = slideAverages[criterionId];
					if (typeof myVal === 'number' && typeof avg === 'number' && avg > 0) {
						proximitySum += getWorld7ProximityScore(myVal, avg);
					}
				});

				const speedScore = getWorld7SpeedScore(ans.time || 0);
				const slidePV = getWorld7TotalPV(proximitySum, speedScore);
				total += slidePV;
			}
		});

		return total;
	}

	const currentRoundGroupPV = $derived(getClassTotalPV(currentSlideId));
	const prevRoundGroupPV = $derived(currentSlideId > 1 ? getClassTotalPV(currentSlideId - 1) : 0);
	const pvTrend = $derived.by(() => {
		if (currentSlideId <= 1 || prevRoundGroupPV === 0) return 'stable';
		if (currentRoundGroupPV > prevRoundGroupPV) return 'up';
		if (currentRoundGroupPV < prevRoundGroupPV) return 'down';
		return 'stable';
	});

	const myProximity = $derived.by(() => {
		if (!hasSubmitted) return 0;
		let total = 0;
		world7Criteria.forEach(c => {
			const myVal = localRatings[c.id];
			const avg = groupAverages[c.id];
			if (typeof myVal === 'number' && avg > 0) {
				total += getWorld7ProximityScore(myVal, avg);
			}
		});
		return total;
	});

	const mySpeedScore = $derived(hasSubmitted ? getWorld7SpeedScore(submissionTime) : 0);
	const myPV = $derived(hasSubmitted ? getWorld7TotalPV(myProximity, mySpeedScore) : 0);
	const myStars = $derived(getWorld7Stars(myPV, activeCriteriaIds.length));

	let showResultsModal = $state(false);
	let showRulesAccordion = $state(false);

	$effect(() => {
		if (isSubmissionEnabled && !session.isHost && !hasSubmitted && !timerStarted) {
			startTimer();
		}
	});

	function startTimer() {
		if (timerStarted) return;
		timerStarted = true;
		submissionTime = 0;
		countdown = 0;
		clearInterval(countdownInterval);
		countdownInterval = setInterval(() => {
			submissionTime++;
		}, 1000);
	}

	function setRating(criterionId: string, value: number) {
		if (hasSubmitted) return;
		localRatings = { ...localRatings, [criterionId]: value };
	}

	function isComplete() {
		return world7Criteria
			.filter(c => activeCriteriaIds.includes(c.id))
			.every(c => typeof localRatings[c.id] === 'number');
	}

	async function submitRating() {
		if (!isComplete() || !isSubmissionEnabled || hasSubmitted) return;
		hasSubmitted = true;
		clearInterval(countdownInterval);

		const state = JSON.parse(JSON.stringify(session.player.game_state || {}));
		if (!state[7]) state[7] = {};
		if (!state[7].workshop_answers) state[7].workshop_answers = {};
		state[7].workshop_answers[currentSlideId] = { ratings: localRatings, time: submissionTime };
		session.player.game_state = state;

		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'student-rating',
				payload: {
					studentId: session.player.id,
					ratings: localRatings,
					time: submissionTime
				}
			});
		}

		if (!visitedSlideIds.includes(currentSlideId)) {
			visitedSlideIds = [...visitedSlideIds, currentSlideId];
		}

		// Reactively update current student in allClassPlayers array
		const pIdx = session.allClassPlayers.findIndex(p => p.id === session.player.id);
		if (pIdx !== -1) {
			const playerObj = session.allClassPlayers[pIdx];
			if (!playerObj.game_state) playerObj.game_state = {};
			if (!playerObj.game_state[7]) playerObj.game_state[7] = {};
			if (!playerObj.game_state[7].workshop_answers) playerObj.game_state[7].workshop_answers = {};
			playerObj.game_state[7].workshop_answers[currentSlideId] = { ratings: localRatings, time: submissionTime };
		}

		await session.updatePlayerGameState(state);
	}

	function resetForNewSlide() {
		localRatings = {};
		hasSubmitted = false;
		submissionTime = 0;
		timerStarted = false;
		showResultsModal = false;
		clearInterval(countdownInterval);
	}

	// Host Operations
	async function writeToDatabaseState(newState: any) {
		if (!session.isHost || !supabase) return;
		await supabase
			.from('course_instances')
			.update({ current_workshop_state: newState })
			.eq('code', instance.code);
	}

	async function handleResetWorkshop() {
		if (!session.isHost) return;
		if (!confirm('¿Estás seguro de que deseas reiniciar el taller? Esto borrará todo el progreso actual de esta sesión.')) return;
		
		const newState = {
			world_id: 7,
			slide_index: 1,
			mode: 'rating' as const,
			visitedSlideIds: [1],
			isPaused: false,
			activeCriteriaIds: ['evaluacion_general'],
			isSubmissionEnabled: false
		};
		
		currentSlideId = 1;
		activeMode = 'rating';
		visitedSlideIds = [1];
		activeCriteriaIds = ['evaluacion_general'];
		isSubmissionEnabled = false;
		resetForNewSlide();
		
		await writeToDatabaseState(newState);
		session.safeSend('workshop-reset', {});
	}

	async function handlePrevSlide() {
		if (!session.isHost) return;
		if (currentSlideId > 1) {
			const prevId = currentSlideId - 1;
			resetForNewSlide();
			currentSlideId = prevId;
			activeMode = 'rating';
			activeCriteriaIds = ['evaluacion_general'];
			isSubmissionEnabled = false;
			
			const newState = {
				world_id: 7,
				slide_index: prevId,
				mode: 'rating' as const,
				visitedSlideIds,
				isPaused,
				activeCriteriaIds,
				isSubmissionEnabled
			};
			await writeToDatabaseState(newState);
			session.safeSend('slide-sync', { slideId: prevId, mode: 'rating', activeCriteriaIds, isSubmissionEnabled, visitedSlideIds });
		}
	}

	async function handleNextSlide() {
		if (!session.isHost) return;
		if (currentSlideId < totalSlides) {
			const nextId = currentSlideId + 1;
			resetForNewSlide();
			currentSlideId = nextId;
			activeMode = 'rating';
			
			if (!visitedSlideIds.includes(nextId)) {
				visitedSlideIds = [...visitedSlideIds, nextId];
			}
			
			activeCriteriaIds = ['evaluacion_general'];
			isSubmissionEnabled = false;
			
			const newState = {
				world_id: 7,
				slide_index: nextId,
				mode: 'rating' as const,
				visitedSlideIds,
				isPaused,
				activeCriteriaIds,
				isSubmissionEnabled
			};
			await writeToDatabaseState(newState);
			session.safeSend('slide-sync', { slideId: nextId, mode: 'rating', activeCriteriaIds, isSubmissionEnabled, visitedSlideIds });
		}
	}

	async function handleToggleMode(mode: 'rating' | 'feedback' | 'actividad') {
		if (!session.isHost) return;
		const targetMode = mode === 'actividad' ? 'rating' : 'feedback';
		activeMode = targetMode;
		const newState = {
			world_id: 7,
			slide_index: currentSlideId,
			mode: targetMode,
			visitedSlideIds,
			isPaused,
			activeCriteriaIds,
			isSubmissionEnabled
		};
		await writeToDatabaseState(newState);
		session.safeSend('slide-sync', { slideId: currentSlideId, mode: targetMode, activeCriteriaIds, isSubmissionEnabled, visitedSlideIds });
	}

	async function handleCompleteWorkshop() {
		if (!session.isHost) return;
		if (!confirm('¿Estás seguro de que deseas finalizar la sesión del taller? Esto dará por terminada la actividad y otorgará las monedas correspondientes.')) return;
		if (session.channel) {
			await session.channel.send({
				type: 'broadcast',
				event: 'workshop-complete',
				payload: {}
			});
		}
		onComplete();
	}

	async function handleToggleCriterion(id: string, checked: boolean) {
		if (!session.isHost) return;
		if (checked) {
			if (!activeCriteriaIds.includes(id)) {
				activeCriteriaIds = [...activeCriteriaIds, id];
			}
		} else {
			if (id === 'evaluacion_general') {
				alert('La Evaluación General no puede ser desactivada.');
				return;
			}
			activeCriteriaIds = activeCriteriaIds.filter(cid => cid !== id);
		}

		const newState = {
			world_id: 7,
			slide_index: currentSlideId,
			mode: activeMode,
			visitedSlideIds,
			isPaused,
			activeCriteriaIds,
			isSubmissionEnabled
		};
		await writeToDatabaseState(newState);
		session.safeSend('active-criteria-sync', { activeCriteriaIds });
	}

	async function handleToggleSubmission(enabled: boolean) {
		if (!session.isHost) return;
		isSubmissionEnabled = enabled;
		const newState = {
			world_id: 7,
			slide_index: currentSlideId,
			mode: activeMode,
			visitedSlideIds,
			isPaused,
			activeCriteriaIds,
			isSubmissionEnabled
		};
		await writeToDatabaseState(newState);
		session.safeSend('submission-toggle', { isSubmissionEnabled });
	}

	onMount(() => {
		session.loadAllClassPlayers();
		session.initConnection(async (event, payload) => {
			if (event === 'slide-sync') {
				if (payload.slideId !== currentSlideId) {
					resetForNewSlide();
				}
				currentSlideId = payload.slideId;
				activeMode = payload.mode;
				activeCriteriaIds = payload.activeCriteriaIds || ['evaluacion_general'];
				isSubmissionEnabled = payload.isSubmissionEnabled || false;
				visitedSlideIds = payload.visitedSlideIds || [1];
				const saved = session.player.game_state?.[7]?.workshop_answers?.[payload.slideId];
				if (saved) {
					localRatings = saved.ratings || {};
					submissionTime = saved.time || 0;
					hasSubmitted = true;
				}
			} else if (event === 'student-rating') {
				const playerIdx = session.allClassPlayers.findIndex(p => p.id === payload.studentId);
				if (playerIdx !== -1) {
					const p = session.allClassPlayers[playerIdx];
					if (!p.game_state) p.game_state = {};
					if (!p.game_state[7]) p.game_state[7] = {};
					if (!p.game_state[7].workshop_answers) p.game_state[7].workshop_answers = {};
					p.game_state[7].workshop_answers[currentSlideId] = { ratings: payload.ratings, time: payload.time };
				} else {
					session.loadAllClassPlayers();
				}
			} else if (event === 'active-criteria-sync') {
				if (payload.activeCriteriaIds) {
					activeCriteriaIds = payload.activeCriteriaIds;
				}
			} else if (event === 'submission-toggle') {
				if (payload.isSubmissionEnabled !== undefined) {
					isSubmissionEnabled = payload.isSubmissionEnabled;
				}
			} else if (event === 'workshop-complete') {
				if (!session.isHost) {
					const state = JSON.parse(JSON.stringify(session.player.game_state || {}));
					if (!state[7]) state[7] = {};
					state[7].workshop_completed = true;
					await session.updatePlayerGameState(state, { coins: session.player.coins + 25 });
				}
				onComplete();
			} else if (event === 'workshop-reset') {
				currentSlideId = 1;
				activeMode = 'rating';
				activeCriteriaIds = ['evaluacion_general'];
				isSubmissionEnabled = false;
				visitedSlideIds = [];
				resetForNewSlide();
				if (!session.isHost) {
					const state = JSON.parse(JSON.stringify(session.player.game_state || {}));
					if (state[7]) {
						state[7].workshop_answers = {};
						state[7].workshop_completed = false;
						session.player.game_state = state;
						await session.updatePlayerGameState(state);
					}
				}
			}
		});

		if (supabase) {
			supabase.from('course_instances')
				.select('current_workshop_state')
				.eq('code', instance.code)
				.single()
				.then(async ({ data: inst }) => {
					if (inst?.current_workshop_state && inst.current_workshop_state.world_id === 7) {
						const wst = inst.current_workshop_state;
						
						// Auto-clean stale answers on initial load if workshop is reset
						const isResetState = wst.slide_index === 1 && (wst.visitedSlideIds?.length === 1 && wst.visitedSlideIds[0] === 1);
						const hasStaleAnswers = session.player.game_state?.[7]?.workshop_answers && Object.keys(session.player.game_state[7].workshop_answers).length > 1;
						
						if (isResetState && hasStaleAnswers && !session.isHost) {
							const state = JSON.parse(JSON.stringify(session.player.game_state || {}));
							if (state[7]) {
								state[7].workshop_answers = {};
								state[7].workshop_completed = false;
								session.player.game_state = state;
								await session.updatePlayerGameState(state);
							}
						}

						currentSlideId = wst.slide_index || 1;
						activeMode = wst.mode || 'rating';
						activeCriteriaIds = wst.activeCriteriaIds || ['evaluacion_general'];
						isSubmissionEnabled = wst.isSubmissionEnabled || false;
						visitedSlideIds = wst.visitedSlideIds || [1];
						const saved = session.player.game_state?.[7]?.workshop_answers?.[currentSlideId];
						if (saved) {
							localRatings = saved.ratings || {};
							submissionTime = saved.time || 0;
							hasSubmitted = true;
						}
					}
				});
		}
	});

	onDestroy(() => {
		clearInterval(countdownInterval);
		session.cleanup();
	});
</script>

{#snippet distributionGrid()}
	<div class="class-distribution">
		<h3>Distribución de la Clase ({submittedCount} respuestas recibidas)</h3>
		<div class="distribution-grid">
			{#each world7Criteria.filter(c => activeCriteriaIds.includes(c.id)) as criterion}
				<div class="dist-item-container" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%; margin-bottom: 1.25rem;">
					<div class="dist-title" style="font-size: 1.05rem; font-weight: 800; color: #1e4533; margin-left: 101px; text-align: left;">
						{criterion.label}
					</div>
					<div class="dist-item" style="display: flex; align-items: center; gap: 1rem; width: 100%;">
						<span class="endpoint-label min-label" style="font-size: 0.75rem; color: #6b7280; font-weight: 600; width: 85px; text-align: right; flex-shrink: 0; line-height: 1.2;">
							{criterion.minLabel}
						</span>
						<div class="dist-bar-wrapper">
							<div class="dist-bar">
								{#each [1,2,3,4,5,6,7,8,9,10] as val}
									{@const pct = (() => {
										const count = Object.values(classVotes).filter(v => v[criterion.id] === val).length;
										const total = Object.keys(classVotes).length;
										return total > 0 ? (count / total) * 100 : 0;
									})()}
									<div class="dist-column">
										<div class="dist-column-fill" style="height: {pct}%"></div>
										<span class="dist-val">{val}</span>
									</div>
								{/each}
							</div>
							<div class="dist-avg-line" style="left: {(groupAverages[criterion.id] / 10) * 100}%">
								<span class="avg-marker">Prom</span>
							</div>
						</div>
						<span class="endpoint-label max-label" style="font-size: 0.75rem; color: #6b7280; font-weight: 600; width: 85px; text-align: left; flex-shrink: 0; line-height: 1.2;">
							{criterion.maxLabel}
						</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

<div class="workshop-wrapper" in:fade>
	<FacilitatorControlPanel
		isHost={session.isHost}
		onlineCount={session.onlinePlayers.length}
		submittedCount={submittedCount}
		isFirstStep={currentSlideId === 1}
		isLastStep={isLastSlide}
		activeMode={activeMode}
		onReset={handleResetWorkshop}
		onPrev={handlePrevSlide}
		onNext={handleNextSlide}
		onToggleMode={handleToggleMode}
		onComplete={handleCompleteWorkshop}
		coinsLabel="+25 BEM Coins"
		stepLabel="Slide"
	/>

	<main class="workshop-body">
		<div class="slide-header">
			<div class="slide-meta">
				<span class="part-badge">Parte {currentPartNum}: {partName}</span>
				<span class="slide-counter">Slide {slideIdxInPart}/{slidesInPart.length} · #{currentSlideId}/{totalSlides}</span>
			</div>
			<h2 class="slide-title">{currentSlide.title}</h2>
			{#if activeMode === 'feedback' || session.isHost}
				<div class="slide-trigger-badge" class:accion={currentSlide.triggerType === 'accion'} class:meta={currentSlide.triggerType === 'meta'} class:farmeable={currentSlide.triggerType === 'farmeable'}>
					{currentSlide.triggerType === 'accion' ? '⚡' : currentSlide.triggerType === 'meta' ? '🎯' : '🔁'} {currentSlide.triggerType === 'accion' ? 'Acción' : currentSlide.triggerType === 'meta' ? 'Meta' : 'Farmeable'}
				</div>
			{/if}
		</div>

		<div class="scenario-card glass-card" in:fade>
			<span class="scenario-label">📋 Caso de Estudio</span>
			<p class="scenario-text">"{currentSlide.scenario}"</p>
			{#if activeMode === 'feedback' || session.isHost}
				<div class="system-tag" style="margin-top: 0.5rem; display: inline-block;">
					{currentSlide.evaluationSystem.replace(/_/g, ' ')}
				</div>
			{/if}
		</div>

		{#if activeMode === 'rating'}

			{#if session.isHost}
				<div class="facilitator-criteria-config glass-card mb-6">
					<div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-3" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
						<h3>⚙ Configuración del Taller (Slide actual)</h3>
						<label class="checkbox-label font-bold" style="color: #ef4444;">
							<input
								type="checkbox"
								checked={isSubmissionEnabled}
								onchange={(e) => handleToggleSubmission(e.currentTarget.checked)}
							/>
							🟢 Habilitar envíos de la clase
						</label>
					</div>
					<div class="criteria-checkbox-group">
						{#each world7Criteria as criterion}
							<label class="checkbox-label" class:disabled-checkbox={criterion.id === 'evaluacion_general'}>
								<input
									type="checkbox"
									checked={activeCriteriaIds.includes(criterion.id)}
									disabled={criterion.id === 'evaluacion_general'}
									onchange={(e) => handleToggleCriterion(criterion.id, e.currentTarget.checked)}
								/>
								{criterion.label}
							</label>
						{/each}
					</div>
				</div>

				<div class="feedback-panel glass-card" in:fade>
					{@render distributionGrid()}
				</div>
			{:else if !hasSubmitted}
				<div class="criteria-grid" in:fade>
					{#each world7Criteria.filter(c => activeCriteriaIds.includes(c.id)) as criterion}
						<div class="criterion-card glass-card">
							<div class="criterion-header">
								<span class="criterion-label">{criterion.label}</span>
								<span class="criterion-value">{localRatings[criterion.id] || '—'}</span>
							</div>
							<p class="criterion-question">{criterion.question}</p>
							<div class="slider-row">
								<span class="slider-endpoint">{criterion.minLabel}</span>
								<input
									type="range"
									min="1"
									max="10"
									value={localRatings[criterion.id] || 5}
									oninput={(e) => setRating(criterion.id, parseInt(e.currentTarget.value))}
									class="criteria-slider"
								/>
								<span class="slider-endpoint">{criterion.maxLabel}</span>
							</div>
						</div>
					{/each}
				</div>

				<div class="action-bar">
					<div class="timer-display" class:timer-warning={submissionTime > 10 && submissionTime <= 15} class:timer-danger={submissionTime > 15}>
						⏱ {submissionTime}s ({getWorld7SpeedScore(submissionTime)} pts)
					</div>
					<button
						type="button"
						class="btn-submit"
						disabled={!isComplete() || !isSubmissionEnabled}
						onclick={submitRating}
					>
						{#if !isComplete()}
							Califica todos los criterios
						{:else if !isSubmissionEnabled}
							Esperando al facilitador...
						{:else}
							Enviar Evaluación ➔
						{/if}
					</button>
				</div>
			{:else}
				<div class="feedback-panel glass-card text-center" in:fade style="text-align: center; padding: 2.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;">
					<span class="feedback-badge" style="font-size: 0.9rem; font-weight: 700; color: #065f46; background: #d1fae5; padding: 0.4rem 1rem; border-radius: 20px;">✓ Evaluación Enviada</span>
					<p style="font-size: 1rem; color: #374151; font-weight: 600; max-width: 500px; margin: 0 auto;">
						Tus calificaciones han sido registradas exitosamente. Espera a que el facilitador active la retroalimentación para revelar los resultados grupales y tu calibración.
					</p>
				</div>
			{/if}
		{/if}

		{#if activeMode === 'feedback' && !session.isHost && hasSubmitted}
			<div class="flex justify-center" style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
				<button type="button" class="btn-submit" onclick={() => showResultsModal = true} style="background: #0369a1;">
					📊 Ver Mi Reporte de Calibración
				</button>
			</div>
		{/if}

		{#if activeMode === 'feedback'}
			<div class="feedback-mode glass-card" in:fade>
				<div class="giochi-feedback">
					<span class="giochi-tag">🤖 GIOCHI Analytics</span>
					<p class="giochi-text">{currentSlide.giochiFeedback}</p>
				</div>

				{@render distributionGrid()}

				<!-- SCOREBOARD DEL GRUPO & TABLA DE LÍDERES -->
				<div class="scoreboard-leaderboard-layout flex flex-col md:flex-row gap-6 mt-8" style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem;">
					<!-- Scoreboard Grupal -->
					<div class="group-scoreboard-card glass-card flex-1" style="flex: 1; padding: 1.5rem; border-left: 4px solid var(--color-solar-yellow, #eab308);">
						<div class="scoreboard-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
							<span class="scoreboard-icon" style="font-size: 1.5rem;">🎯</span>
							<h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #1e4533; text-transform: uppercase;">Desempeño Colectivo</h4>
						</div>
						<div class="scoreboard-body">
							<div class="pv-stat" style="margin-bottom: 0.75rem;">
								<span class="pv-value" style="font-size: 2rem; font-weight: 850; color: #0369a1;">{currentRoundGroupPV} PV</span>
								<span class="pv-label" style="display: block; font-size: 0.75rem; color: #6b7280; font-weight: 600;">Puntos Colectivos de esta ronda</span>
							</div>
							{#if currentSlideId > 1 && prevRoundGroupPV > 0}
								<div class="trend-indicator" class:up={pvTrend === 'up'} class:down={pvTrend === 'down'} style="font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;">
									{#if pvTrend === 'up'}
										<span style="color: #10b981;">▲</span> <span style="color: #065f46;">Más preciso que la ronda anterior ({prevRoundGroupPV} PV)</span>
									{:else if pvTrend === 'down'}
										<span style="color: #ef4444;">▼</span> <span style="color: #b91c1c;">Menos preciso que la ronda anterior ({prevRoundGroupPV} PV)</span>
									{:else}
										<span style="color: #6b7280;">●</span> <span style="color: #374151;">Igual precisión que la ronda anterior ({prevRoundGroupPV} PV)</span>
									{/if}
								</div>
							{/if}
						</div>
					</div>

					<!-- Tabla de Líderes -->
					<div class="leaderboard-card glass-card flex-1" style="flex: 1; padding: 1.5rem; border-left: 4px solid var(--color-solar-sky, #0369a1);">
						<div class="leaderboard-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
							<span class="leaderboard-icon" style="font-size: 1.5rem;">🏆</span>
							<h4 style="margin: 0; font-size: 1rem; font-weight: 800; color: #1e4533; text-transform: uppercase;">Tabla de Líderes del Taller</h4>
						</div>
						<div class="leaderboard-list" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 300px; overflow-y: auto;">
							{#if leaderboard.length === 0}
								<p style="font-size: 0.8rem; color: #9ca3af; text-align: center; margin: 1rem 0;">Esperando respuestas de los participantes...</p>
							{:else}
								{#each leaderboard as row, idx}
									<div class="leaderboard-row" class:self-row={row.id === session.player.id} style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.85rem; background: rgba(0,0,0,0.02);" class:self-row-bg={row.id === session.player.id}>
										<div style="display: flex; align-items: center; gap: 0.5rem;">
											<span style="font-weight: 800; min-width: 1.5rem; color: #6b7280;">#{idx + 1}</span>
											<span style="font-weight: 700; color: #374151;" class:self-bold={row.id === session.player.id}>{row.name}</span>
										</div>
										<div style="display: flex; align-items: center; gap: 1rem;">
											<span style="font-size: 0.7rem; color: #9ca3af;">{row.slideCount} slides</span>
											<span style="font-weight: 800; color: #0369a1;">{row.totalPV} PV</span>
										</div>
									</div>
								{/each}
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- MODAL DE RESULTADOS DETALLADOS -->
		{#if showResultsModal}
			<div class="modal-overlay" onclick={() => showResultsModal = false} style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000;" in:fade>
				<div class="modal-card glass-card" onclick={(e) => e.stopPropagation()} style="background: white; border-radius: 24px; max-width: 600px; width: 95%; max-height: 85vh; display: flex; flex-direction: column; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); position: relative; border: 1px solid rgba(0,0,0,0.1);" in:fly={{ y: 20, duration: 300 }}>
					<button type="button" class="modal-close-btn" onclick={() => showResultsModal = false} style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; z-index: 10;">&times;</button>
					
					<div class="feedback-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f3f4f6; padding-bottom: 1rem; margin-bottom: 1.5rem; flex-shrink: 0;">
						<h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e4533;">📊 Reporte de Calibración</h3>
						<div class="pv-display" style="display: flex; align-items: center; gap: 0.5rem;">
							<span class="pv-score" style="font-size: 1.25rem; font-weight: 850; color: #0369a1;">{myPV} PV</span>
							<span class="star-display" style="font-size: 1.25rem; color: #f59e0b;">{'★'.repeat(myStars)}{'☆'.repeat(3 - myStars)}</span>
						</div>
					</div>

					<!-- SCROLLABLE BODY CONTENT -->
					<div class="modal-body" style="overflow-y: auto; flex: 1; padding-right: 0.5rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
						<!-- Desglose por criterio -->
						<div class="comparison-table" style="overflow-x: auto;">
							<table style="width: 100%; border-collapse: collapse;">
								<thead>
									<tr>
										<th style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; padding: 0.5rem; border-bottom: 2px solid #e5e7eb; text-align: left;">Criterio</th>
										<th style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; padding: 0.5rem; border-bottom: 2px solid #e5e7eb; text-align: center;">Tu nota</th>
										<th style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; padding: 0.5rem; border-bottom: 2px solid #e5e7eb; text-align: center;">Promedio Clase</th>
										<th style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; padding: 0.5rem; border-bottom: 2px solid #e5e7eb; text-align: center;">Distancia</th>
										<th style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; padding: 0.5rem; border-bottom: 2px solid #e5e7eb; text-align: right;">Pts Proximidad</th>
									</tr>
								</thead>
								<tbody>
									{#each world7Criteria.filter(c => activeCriteriaIds.includes(c.id)) as criterion}
										{@const myVal = localRatings[criterion.id] || 0}
										{@const avg = groupAverages[criterion.id] || 0}
										{@const distVal = hasSubmitted ? Math.abs(myVal - avg).toFixed(1) : '0.0'}
										{@const proximityPoints = hasSubmitted ? getWorld7ProximityScore(myVal, avg) : 0}
										<tr>
											<td style="padding: 0.75rem 0.5rem; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; font-weight: 600; color: #374151;">{criterion.label}</td>
											<td class="my-val" style="padding: 0.75rem 0.5rem; border-bottom: 1px solid #f3f4f6; font-size: 0.95rem; font-weight: 800; color: #0369a1; text-align: center;">{localRatings[criterion.id] || '—'}</td>
											<td class="avg-val" style="padding: 0.75rem 0.5rem; border-bottom: 1px solid #f3f4f6; font-size: 0.95rem; font-weight: 700; color: #4b5563; text-align: center;">{groupAverages[criterion.id]}</td>
											<td style="padding: 0.75rem 0.5rem; border-bottom: 1px solid #f3f4f6; font-size: 0.95rem; font-weight: 700; color: #ef4444; text-align: center;">{distVal}</td>
											<td style="padding: 0.75rem 0.5rem; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; font-weight: 700; color: #059669; text-align: right;">+{proximityPoints} pts <span style="font-size: 0.7rem; color: #6b7280; font-weight: normal;">(max 20)</span></td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<!-- Tiempo y otros bonos -->
						<div class="modal-stats-footer" style="background: #f9fafb; border-radius: 12px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e7eb; flex-shrink: 0;">
							<div class="stat-group">
								<span style="display: block; font-size: 0.75rem; color: #6b7280; font-weight: 600;">Tiempo de respuesta</span>
								<span style="font-size: 1.1rem; font-weight: 800; color: #374151;">⏱ {submissionTime}s</span>
							</div>
							<div class="stat-group" style="text-align: right;">
								<span style="display: block; font-size: 0.75rem; color: #6b7280; font-weight: 600;">Puntos por tiempo</span>
								<span style="font-size: 1.1rem; font-weight: 800; color: #059669;">+{mySpeedScore} pts <span style="font-size: 0.75rem; color: #6b7280; font-weight: normal;">(max 10)</span></span>
							</div>
						</div>

						<!-- Acordeón para reglas de evaluación -->
						<div class="rules-accordion" style="border: 1px solid #bfdbfe; border-radius: 12px; overflow: hidden; background: #eff6ff; flex-shrink: 0;">
							<button type="button" onclick={() => showRulesAccordion = !showRulesAccordion} style="width: 100%; padding: 0.75rem 1rem; background: #eff6ff; border: none; font-size: 0.8rem; font-weight: 700; color: #1e40af; display: flex; justify-content: space-between; align-items: center; cursor: pointer; text-align: left;">
								<span>🧠 ¿Cómo se calculan tus Puntos de Victoria?</span>
								<span style="font-size: 0.9rem;">{showRulesAccordion ? '▲' : '▼'}</span>
							</button>
							
							{#if showRulesAccordion}
								<div class="math-explanation" style="font-size: 0.75rem; color: #4b5563; padding: 0 1rem 1rem 1rem; line-height: 1.4; display: flex; flex-direction: column; gap: 0.5rem; border-top: 1px dashed #bfdbfe; padding-top: 0.75rem;" in:slide>
									<ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.25rem; color: #374151;">
										<li><strong>Puntos de Proximidad (hasta 20 por criterio):</strong> Se calculan restando de 20 puntos, 1 punto por cada 0.1 de distancia absoluta entre tu calificación y el promedio del grupo.</li>
										<li><strong>Puntos de Tiempo (hasta 10):</strong> Los primeros 10 segundos no descuentan puntos (10 pts). A partir del segundo 11, se resta 1 punto por cada segundo adicional transcurrido.</li>
									</ul>

									<div style="border-top: 1px solid #dbeafe; padding-top: 0.5rem; margin-top: 0.25rem;">
										<strong>Fórmula General:</strong> <span style="color: #1e40af; font-weight: 700;">PV = Puntos Proximidad (Suma) + Puntos Tiempo</span>
									</div>
									<div style="font-family: monospace; font-size: 0.85rem; color: #1e3a8a; font-weight: 700; background: rgba(255,255,255,0.6); padding: 0.4rem 0.6rem; border-radius: 6px; border: 1px solid #dbeafe; display: inline-block; margin-top: 0.25rem;">
										PV = {myProximity} pts + {mySpeedScore} pts = {myPV} PV
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- FIXED FOOTER BUTTON -->
					<button type="button" class="btn-submit" onclick={() => showResultsModal = false} style="width: 100%; flex-shrink: 0; background: #374151; justify-content: center; display: flex;">
						Entendido
					</button>
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.workshop-wrapper { min-height: 100vh; background: var(--color-solar-bg, #FAF9F6); padding: 1.5rem; }
	.workshop-body { max-width: 1000px; margin: 0 auto; }
	.slide-header { margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
	.slide-meta { display: flex; align-items: center; gap: 0.75rem; width: 100%; }
	.part-badge { font-size: 0.7rem; font-weight: 800; color: #0369a1; background: #e0f2fe; padding: 0.2rem 0.6rem; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
	.slide-counter { font-size: 0.75rem; color: #6b7280; }
	.slide-title { font-size: 1.3rem; font-weight: 800; color: #1e4533; margin: 0; }
	.slide-trigger-badge { font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em; }
	.slide-trigger-badge.accion { background: #dbeafe; color: #1e40af; }
	.slide-trigger-badge.meta { background: #d1fae5; color: #065f46; }
	.slide-trigger-badge.farmeable { background: #fef3c7; color: #92400e; }

	.scenario-card { padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; }
	.scenario-label { font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
	.scenario-text { font-size: 1rem; line-height: 1.6; color: #374151; font-style: italic; margin: 0.75rem 0; }
	.system-tag { display: inline-block; font-size: 0.7rem; font-weight: 700; color: #7c3aed; background: #ede9fe; padding: 0.25rem 0.6rem; border-radius: 12px; text-transform: capitalize; }

	.facilitator-criteria-config { border-left: 4px solid var(--color-solar-yellow, #eab308); padding: 1.25rem; border-radius: 16px; }
	.facilitator-criteria-config h3 { font-size: 0.8rem; font-weight: 800; color: #1e4533; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
	.criteria-checkbox-group { display: flex; flex-wrap: wrap; gap: 1.5rem; margin-top: 0.75rem; }
	.checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: 700; font-size: 0.85rem; color: #374151; user-select: none; }
	.checkbox-label input { width: 1.1rem; height: 1.1rem; cursor: pointer; accent-color: #3d8f68; }
	.checkbox-label.disabled-checkbox { opacity: 0.5; cursor: not-allowed; }

	.criteria-grid { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
	.criterion-card { padding: 1.25rem; border-radius: 16px; }
	.criterion-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
	.criterion-label { font-size: 0.9rem; font-weight: 700; color: #1e4533; }
	.criterion-value { font-size: 1.5rem; font-weight: 800; color: #0369a1; min-width: 2rem; text-align: center; }
	.criterion-question { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.75rem; }
	.slider-row { display: flex; align-items: center; gap: 0.75rem; }
	.slider-endpoint { font-size: 0.65rem; color: #9ca3af; white-space: nowrap; width: 80px; }
	.slider-endpoint:last-child { text-align: right; }
	.criteria-slider { flex: 1; height: 6px; -webkit-appearance: none; appearance: none; background: #e5e7eb; border-radius: 3px; outline: none; }
	.criteria-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #3d8f68; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15); }

	.action-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 0; }
	.timer-display { font-size: 1.1rem; font-weight: 700; color: #6b7280; font-variant-numeric: tabular-nums; transition: color 0.3s; }
	.timer-display.timer-warning { color: #d97706 !important; }
	.timer-display.timer-danger { color: #dc2626 !important; }
	.btn-submit { padding: 0.75rem 2rem; background: #3d8f68; color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
	.btn-submit:disabled { background: #d1d5db; color: #9ca3af; cursor: not-allowed; }
	.btn-submit:hover:not(:disabled) { background: #2d6b4f; transform: translateY(-1px); }

	.feedback-panel { padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem; }
	.feedback-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
	.feedback-badge { font-size: 0.8rem; font-weight: 700; color: #065f46; background: #d1fae5; padding: 0.3rem 0.8rem; border-radius: 20px; }
	.pv-display { display: flex; align-items: center; gap: 0.75rem; }
	.pv-score { font-size: 1.2rem; font-weight: 800; color: #1e4533; }
	.star-display { font-size: 1.3rem; color: #f59e0b; letter-spacing: 2px; }
	.comparison-table table { width: 100%; border-collapse: collapse; }
	.comparison-table th { font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; text-align: left; padding: 0.5rem; border-bottom: 2px solid #e5e7eb; }
	.comparison-table td { padding: 0.5rem; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; }
	.my-val { font-weight: 700; color: #0369a1; }
	.avg-val { font-weight: 600; color: #374151; }
	.std-val { font-weight: 500; color: #6b7280; }

	.feedback-mode { padding: 1.5rem; border-radius: 16px; }
	.giochi-feedback { margin-bottom: 2rem; padding: 1.25rem; background: #f0fdf4; border-radius: 12px; border-left: 4px solid #3d8f68; }
	.giochi-tag { font-size: 0.7rem; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 0.05em; }
	.giochi-text { font-size: 0.9rem; line-height: 1.6; color: #374151; margin-top: 0.5rem; }

	.class-distribution h3 { font-size: 1rem; font-weight: 700; color: #1e4533; margin-bottom: 1.5rem; }
	.distribution-grid { display: flex; flex-direction: column; gap: 1.5rem; width: 100%; }
	.dist-item { display: flex; align-items: center; gap: 1.5rem; width: 100%; }
	.dist-label { font-size: 0.9rem; font-weight: 700; color: #1e4533; width: 160px; flex-shrink: 0; text-align: right; }
	.dist-bar-wrapper { flex: 1; position: relative; padding-top: 1.25rem; max-width: 450px; width: 100%; }
	.dist-bar { display: flex; align-items: flex-end; gap: 3px; height: 90px; background: #f9fafb; border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 12px; padding: 0.5rem; width: 100%; max-width: 450px; }
	.dist-column { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
	.dist-column-fill { width: 100%; background: #3d8f68; border-radius: 3px 3px 0 0; min-height: 2px; transition: height 0.3s; }
	.dist-val { font-size: 0.65rem; color: #9ca3af; margin-top: 2px; }
	.dist-avg-line { position: absolute; top: 1.25rem; bottom: 0; width: 2px; background: #ef4444; }
	.avg-marker { position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 0.6rem; font-weight: 700; color: #ef4444; white-space: nowrap; }

	.glass-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
	.self-row-bg { background: #e0f2fe !important; border: 1px solid #bae6fd !important; }
	.self-bold { color: #0369a1 !important; }
</style>
