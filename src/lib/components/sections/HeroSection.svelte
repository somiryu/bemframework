<script lang="ts">
	let { title, description, buttons = [] } = $props();
</script>

<section class="hero">
	<div class="container">
		<div class="hero-content">
			<h1>{title}</h1>
			<p>{description}</p>
			{#if buttons.length > 0}
				<div class="hero-actions">
					{#each buttons as btn}
						<a href={btn.link} class={`btn btn-${btn.type || 'primary'}`}>
							{btn.text}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
.hero {
	padding: var(--space-xl) 0 var(--space-lg);
	text-align: center;
	background: radial-gradient(circle at 70% 30%, hsla(262, 52%, 47%, 0.08), transparent 40%),
	            radial-gradient(circle at 30% 70%, hsla(142, 71%, 45%, 0.08), transparent 40%);
	position: relative;
	overflow: hidden;
}

.hero::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
	background-size: 40px 40px;
	opacity: 0.3;
	mask-image: radial-gradient(circle at center, black, transparent 80%);
}

.hero-content {
	position: relative;
	z-index: 1;
	max-width: 900px;
	margin: 0 auto;
}

.hero h1 {
	background: linear-gradient(to bottom right, var(--color-text) 50%, var(--color-purple));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	margin-bottom: var(--space-lg);
}

.hero p {
	font-size: 1.4rem;
	margin-bottom: var(--space-lg);
	color: var(--color-text-muted);
}

.hero-actions {
	display: flex;
	gap: 1.5rem;
	justify-content: center;
}

.btn-secondary {
	background: white;
	color: var(--color-text);
	border: 2px solid var(--color-border);
}

.btn-secondary:hover {
	border-color: var(--color-purple);
	color: var(--color-purple);
	transform: translateY(-3px);
}
</style>
