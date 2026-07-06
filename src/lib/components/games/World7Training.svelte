<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { world7TriviaQuestions, type World7TriviaQuestion } from '$lib/content/world7Trivia';
	import { supabase } from '$lib/supabase';

	let { 
		world, 
		player, 
		onGameComplete, 
		onUpdateCoins 
	}: { 
		world: any; 
		player: any; 
		onGameComplete: (results: any) => void; 
		onUpdateCoins: (newCoinsCount: number, newState: any) => void 
	} = $props();

	const shuffled = [...world7TriviaQuestions];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	let activeQuestions = $state<World7TriviaQuestion[]>(shuffled);

	let currentQuestionIndex = $state(0);
	let selectedAnswer = $state<string | null>(null);
	let isAnswered = $state(false);
	let isCorrect = $state(false);

	let totalCorrect = $state(0);
	let totalIncorrect = $state(0);
	let blockCorrect = $state({ A: 0, B: 0, C: 0 });

	let likedIdeas = $state<string[]>(player.game_state?.liked_ideas || []);

	function isIdeaLiked(id: string) {
		return likedIdeas.includes(id);
	}

	async function toggleIdea(question: World7TriviaQuestion) {
		let currentLiked = [...likedIdeas];
		const state = { ...player.game_state };
		if (!state.ideas) state.ideas = [];

		if (currentLiked.includes(question.id)) {
			currentLiked = currentLiked.filter(id => id !== question.id);
			state.ideas = state.ideas.filter((i: any) => i.id !== question.id);
		} else {
			currentLiked.push(question.id);
			state.ideas.push({
				id: question.id,
				driver: `Mundo 7: ${question.blockName}`,
				scenario: question.scenario,
				explanation: question.explanation,
				likedAt: new Date().toISOString()
			});
		}

		likedIdeas = currentLiked;
		state.liked_ideas = likedIdeas;
		player.game_state = state;
		onUpdateCoins(player.coins, state);

		if (supabase && player.id) {
			await supabase.from('course_players').update({ game_state: state }).eq('id', player.id);
		}
	}

	$effect(() => {
		currentQuestionIndex;
		isAnswered;
		tick().then(() => {
			document.querySelector('.training-game-wrapper')?.scrollTo({ top: 0, behavior: 'instant' });
			window.scrollTo({ top: 0, behavior: 'instant' });
		});
	});

	const netScore = $derived(totalCorrect - totalIncorrect);
	const currentQ = $derived(activeQuestions[currentQuestionIndex]);

	function selectOption(optionIndex: number) {
		if (isAnswered) return;
		const letters = ['A', 'B', 'C', 'D'];
		selectedAnswer = letters[optionIndex];
	}

	function submitAnswer() {
		if (!selectedAnswer || isAnswered) return;
		isAnswered = true;
		isCorrect = selectedAnswer === currentQ.correct;
		if (isCorrect) {
			totalCorrect++;
			blockCorrect[currentQ.block]++;
		} else {
			totalIncorrect++;
		}
	}

	function nextQuestion() {
		if (currentQuestionIndex < activeQuestions.length - 1) {
			currentQuestionIndex++;
			selectedAnswer = null;
			isAnswered = false;
		} else {
			onGameComplete({ totalCorrect, totalIncorrect, blockCorrect });
		}
	}
</script>

<div class="training-game-wrapper" in:fade>
	<div class="flex justify-between items-center mb-4">
		<span class="q-progress">
			Pregunta {currentQuestionIndex + 1} de {activeQuestions.length}
		</span>
		<div class="flex items-center gap-2">
			<span class="text-xs font-bold text-solar-text-muted">CALIBRACIÓN:</span>
			<span class="net-score-indicator" class:negative={netScore < 0}>
				{netScore >= 0 ? '+' : ''}{netScore} NETO
			</span>
		</div>
	</div>

	<div class="w-full bg-gray-200 h-2 rounded-full mb-6 overflow-hidden">
		<div class="training-progress-fill h-full" style="width: {(currentQuestionIndex / activeQuestions.length) * 100}%"></div>
	</div>

	{#if currentQ}
		<div class="quiz-screen">
			{#if !isAnswered}
				<div class="question-card text-left" in:fade>
					<span class="q-label">{currentQ.blockName}</span>
					<h3 class="scenario-text">"{currentQ.scenario}"</h3>
					<p class="question-text-prompt mt-4 mb-6">{currentQ.question}</p>

					<div class="choices-grid">
						{#each currentQ.options as option, idx}
							{@const letters = ['A', 'B', 'C', 'D']}
							<button
								type="button"
								class="choice-btn"
								class:selected={selectedAnswer === letters[idx]}
								onclick={() => selectOption(idx)}
							>
								<span class="choice-indicator">{letters[idx]}</span>
								<span class="choice-text">{option}</span>
							</button>
						{/each}
					</div>

					<div class="board-footer flex justify-end mt-6 border-t pt-4 border-gray-100">
						<button
							type="button"
							class="btn-solar-accent"
							disabled={!selectedAnswer}
							onclick={submitAnswer}
						>
							Validar Elección ➔
						</button>
					</div>
				</div>
			{:else}
				<div class="feedback-response-box text-left" class:correct={isCorrect} class:incorrect={!isCorrect} in:fly={{ y: 20, duration: 400 }}>
					<div class="flex justify-between items-center border-b border-black/[0.08] pb-3 mb-5">
						<div class="flex flex-col gap-0.5">
							<span class="q-label text-[10px] tracking-widest opacity-80">CATEGORÍA</span>
							<span class="block-name-highlight text-sm font-extrabold text-solar-green-dark">{currentQ.blockName}</span>
						</div>
						<span class="feedback-badge-premium shadow-sm" class:correct-badge={isCorrect} class:incorrect-badge={!isCorrect}>
							{isCorrect ? '✓ Calibración Alineada' : '✗ Calibración Desalineada'}
						</span>
					</div>

					<div class="scenario-highlight-card mb-5">
						<span class="sub-title">CASO DE ESTUDIO</span>
						<p class="scenario-quote">"{currentQ.scenario}"</p>
					</div>

					<div class="comparison-grid gap-4 mb-5">
						<div class="response-pill-premium shadow-sm" class:user-wrong={!isCorrect} class:user-correct={isCorrect}>
							<div class="pill-header flex items-center gap-2 mb-2">
								<span class="pill-badge" class:user-wrong-badge={!isCorrect} class:user-correct-badge={isCorrect}>
									{isCorrect ? '✓' : '✗'} TU ELECCIÓN
								</span>
							</div>
							<div class="pill-body flex items-start gap-2">
								<span class="letter-badge">{selectedAnswer}</span>
								<p class="pill-text font-medium">
									{currentQ.options[['A', 'B', 'C', 'D'].indexOf(selectedAnswer || '')]}
								</p>
							</div>
						</div>

						{#if !isCorrect}
							<div class="response-pill-premium giochi-correct shadow-sm">
								<div class="pill-header flex items-center gap-2 mb-2">
									<span class="pill-badge giochi-correct-badge">⭐ ALINEACIÓN CORRECTA</span>
								</div>
								<div class="pill-body flex items-start gap-2">
									<span class="letter-badge giochi-letter">{currentQ.correct}</span>
									<p class="pill-text font-semibold">
										{currentQ.options[['A', 'B', 'C', 'D'].indexOf(currentQ.correct)]}
									</p>
								</div>
							</div>
						{/if}
					</div>

					<div class="explanation-box-modern">
						<span class="sub-title">🔬 ANÁLISIS GIOCHI</span>
						<p class="explanation-text">{currentQ.explanation}</p>
					</div>

					<div class="flex justify-between items-center mt-6 border-t pt-4 border-gray-100">
						<button type="button" class="like-btn-premium" class:liked={isIdeaLiked(currentQ.id)} onclick={() => toggleIdea(currentQ)}>
							{isIdeaLiked(currentQ.id) ? '❤️' : '🤍'} {isIdeaLiked(currentQ.id) ? 'Guardado en Bitácora' : 'Guardar en Bitácora'}
						</button>
						<button type="button" class="btn-solar-accent" onclick={nextQuestion}>
							{currentQuestionIndex < activeQuestions.length - 1 ? 'Siguiente Pregunta ➔' : 'Ver Resultados ➔'}
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.training-game-wrapper { max-width: 900px; margin: 0 auto; padding: 1rem 0; }
	.q-progress { font-size: 0.85rem; font-weight: 700; color: #6b7280; }
	.net-score-indicator { font-size: 0.75rem; font-weight: 800; color: #065f46; background: #d1fae5; padding: 0.2rem 0.6rem; border-radius: 20px; }
	.net-score-indicator.negative { color: #b91c1c; background: #fee2e2; }
	.training-progress-fill { background: linear-gradient(90deg, #3d8f68, #6ee7b7); border-radius: 999px; transition: width 0.4s ease; }
	.q-label { font-size: 0.65rem; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.08em; }
	.scenario-text { font-size: 1rem; font-weight: 600; color: #374151; line-height: 1.5; margin: 0.5rem 0; }
	.question-text-prompt { font-size: 0.95rem; font-weight: 500; color: #1e4533; }
	.choices-grid { display: flex; flex-direction: column; gap: 0.6rem; }
	.choice-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; background: white; border: 2px solid #e5e7eb; border-radius: 14px; cursor: pointer; transition: all 0.15s; text-align: left; width: 100%; }
	.choice-btn:hover { border-color: #3d8f68; background: #f0fdf4; }
	.choice-btn.selected { border-color: #3d8f68; background: #d1fae5; box-shadow: 0 0 0 2px rgba(61,143,104,0.2); }
	.choice-indicator { width: 28px; height: 28px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: #6b7280; flex-shrink: 0; }
	.choice-btn.selected .choice-indicator { background: #3d8f68; color: white; }
	.choice-text { font-size: 0.9rem; color: #374151; font-weight: 500; }
	.feedback-response-box { background: white; border-radius: 24px; padding: 1.5rem; border: 2px solid #e5e7eb; }
	.feedback-response-box.correct { border-color: #86efac; }
	.feedback-response-box.incorrect { border-color: #fca5a5; }
	.block-name-highlight { font-size: 0.95rem; }
	.feedback-badge-premium { font-size: 0.7rem; font-weight: 800; padding: 0.3rem 0.8rem; border-radius: 20px; }
	.correct-badge { background: #d1fae5; color: #065f46; }
	.incorrect-badge { background: #fee2e2; color: #b91c1c; }
	.scenario-highlight-card { background: #f9fafb; border-radius: 16px; padding: 1rem; border-left: 4px solid #0369a1; }
	.sub-title { font-size: 0.6rem; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; }
	.scenario-quote { font-size: 0.9rem; font-style: italic; color: #374151; margin-top: 0.25rem; }
	.comparison-grid { display: flex; flex-direction: column; gap: 0.75rem; }
	.response-pill-premium { background: white; border-radius: 16px; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; }
	.user-correct { border-color: #86efac; }
	.user-wrong { border-color: #fca5a5; }
	.pill-badge { font-size: 0.6rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 10px; background: #f3f4f6; color: #6b7280; }
	.user-correct-badge { background: #d1fae5; color: #065f46; }
	.user-wrong-badge { background: #fee2e2; color: #b91c1c; }
	.giochi-correct-badge { background: #fef3c7; color: #92400e; }
	.letter-badge { width: 26px; height: 26px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; color: #374151; flex-shrink: 0; }
	.giochi-letter { background: #fef3c7; color: #92400e; }
	.pill-text { font-size: 0.85rem; }
	.explanation-box-modern { background: #f0fdf4; border-radius: 16px; padding: 1rem; border-left: 4px solid #3d8f68; }
	.explanation-text { font-size: 0.85rem; line-height: 1.6; color: #374151; margin-top: 0.25rem; }
	.like-btn-premium { font-size: 0.8rem; font-weight: 600; color: #6b7280; background: none; border: 1px solid #e5e7eb; border-radius: 20px; padding: 0.4rem 1rem; cursor: pointer; transition: all 0.15s; }
	.like-btn-premium:hover { border-color: #f59e0b; background: #fffbeb; }
	.like-btn-premium.liked { color: #92400e; border-color: #f59e0b; background: #fef3c7; }
	.question-card { background: white; border-radius: 24px; padding: 1.5rem; border: 1px solid rgba(0,0,0,0.06); }
</style>
