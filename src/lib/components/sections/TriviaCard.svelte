<script lang="ts">
	let { questions, lang } = $props();
	
	let currentIndex = $state(0);
	let selectedIndex = $state(-1);
	let revealed = $state(false);
	
	const current = $derived(questions[currentIndex]);
	
	const handleSelect = (index: number) => {
		if (revealed) return;
		selectedIndex = index;
		revealed = true;
	};

	const reset = () => {
		selectedIndex = -1;
		revealed = false;
	};

	const next = () => {
		currentIndex = (currentIndex + 1) % questions.length;
		reset();
	};
</script>

<section id="trivia" class="section trivia">
	<div class="container container-narrow">
		<div class="trivia-card" class:revealed>
			<span class="trivia-label">
				{lang === 'en' ? `Question ${currentIndex + 1} of ${questions.length}` : `Pregunta ${currentIndex + 1} de ${questions.length}`}
			</span>
			<h3>{current.question}</h3>
			
			<div class="options">
				{#each current.options as option, i}
					<button 
						class="btn-option" 
						class:correct={revealed && option.isCorrect}
						class:wrong={revealed && selectedIndex === i && !option.isCorrect}
						class:selected={selectedIndex === i}
						onclick={() => handleSelect(i)}
						disabled={revealed}
					>
						<span class="letter">{String.fromCharCode(65 + i)}</span>
						<span class="text">{option.text}</span>
					</button>
				{/each}
			</div>
			
			{#if revealed}
				<div class="feedback-area">
					<div class="status-box" class:is-correct={current.options[selectedIndex].isCorrect}>
						{current.options[selectedIndex].isCorrect ? 
							(lang === 'en' ? '✓ Correct' : '✓ Correcto') : 
							(lang === 'en' ? '✗ Incorrect' : '✗ Incorrecto')}
					</div>
					<p class="explanation">{current.explanation}</p>
					
					<div class="actions">
						<button class="btn-reset" onclick={reset}>
							{lang === 'en' ? 'Try another way' : 'Intentar de otra forma'}
						</button>
						{#if questions.length > 1}
							<button class="btn-next" onclick={next}>
								{lang === 'en' ? 'Another question' : 'Siguiente pregunta'} →
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
.trivia {
	background: var(--color-bg-alt);
}

.trivia-card {
	padding: 3rem;
	background: white;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	border-top: 6px solid var(--color-purple);
	transition: var(--transition-normal);
}

.trivia-label {
	display: inline-block;
	font-weight: 800;
	text-transform: uppercase;
	font-size: 0.8rem;
	letter-spacing: 0.15em;
	color: var(--color-purple);
	margin-bottom: var(--space-sm);
}

h3 {
	font-size: 1.8rem;
	margin-bottom: var(--space-xl);
	line-height: 1.3;
}

.options {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.btn-option {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	padding: 1.25rem;
	border: 2px solid var(--color-border);
	border-radius: var(--radius-md);
	background: white;
	cursor: pointer;
	text-align: left;
	transition: var(--transition-fast);
	font-size: 1.1rem;
	font-weight: 500;
}

.btn-option:not(:disabled):hover {
	border-color: var(--color-purple);
	background: var(--color-bg-alt);
}

.btn-option.selected {
	border-color: var(--color-purple);
}

.btn-option.correct {
	background: #dcfce7;
	border-color: #22c55e;
	color: #166534;
}

.btn-option.wrong {
	background: #fee2e2;
	border-color: #ef4444;
	color: #991b1b;
}

.letter {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	background: var(--color-bg-alt);
	border-radius: 6px;
	font-weight: 800;
	font-size: 0.9rem;
}

.correct .letter { background: #22c55e; color: white; }
.wrong .letter { background: #ef4444; color: white; }

.feedback-area {
	margin-top: var(--space-xl);
	padding-top: var(--space-xl);
	border-top: 1px solid var(--color-border);
	animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}

.status-box {
	display: inline-block;
	padding: 0.5rem 1rem;
	border-radius: var(--radius-sm);
	font-weight: 800;
	text-transform: uppercase;
	font-size: 0.85rem;
	margin-bottom: var(--space-md);
}

.status-box.is-correct { background: #dcfce7; color: #166534; }
.status-box:not(.is-correct) { background: #fee2e2; color: #991b1b; }

.explanation {
	font-size: 1.15rem;
	line-height: 1.6;
	color: var(--color-text);
	margin-bottom: var(--space-xl);
}

.actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

.btn-reset {
	background: transparent;
	border: none;
	color: var(--color-text-muted);
	font-weight: 600;
	cursor: pointer;
	text-decoration: underline;
	font-size: 0.9rem;
}

.btn-next {
	background: var(--color-purple);
	color: white;
	border: none;
	padding: 0.75rem 1.5rem;
	border-radius: var(--radius-md);
	font-weight: 700;
	cursor: pointer;
	transition: var(--transition-fast);
}

.btn-next:hover {
	transform: translateX(5px);
	filter: brightness(1.1);
}

@media (max-width: 600px) {
	.trivia-card { padding: 2rem; }
}
</style>
