<script lang="ts">
	let { title, subtitle, paragraphs, target } = $props();
</script>

<section class="intro-section">
	<div class="container">
		<div class="grid">
			<div class="content-side">
				<span class="label">Onboarding</span>
				<h2>{title}</h2>
				<p class="subtitle">{subtitle}</p>
				
				<div class="description">
					{#each paragraphs as p}
						<p>{p}</p>
					{/each}
				</div>
			</div>

			<div class="target-side">
				<div class="target-card">
					<h3>{target.title}</h3>
					<div class="target-list">
						{#each target.items as item}
							<div class="target-item">
								<div class="item-icon">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
								</div>
								<div class="item-text">
									<strong>{item.label}</strong>
									<span>{item.desc}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
.intro-section {
	padding: var(--space-xl) 0;
	background: linear-gradient(to bottom, transparent, var(--color-bg-alt));
}

.grid {
	display: grid;
	grid-template-columns: 1.2fr 1fr;
	gap: var(--space-xl);
	align-items: center;
}

.label {
	display: inline-block;
	font-weight: 800;
	text-transform: uppercase;
	font-size: 0.85rem;
	letter-spacing: 0.2em;
	color: var(--color-purple);
	margin-bottom: var(--space-sm);
}

h2 {
	font-size: 3rem;
	margin-bottom: var(--space-sm);
	letter-spacing: -0.03em;
}

.subtitle {
	font-size: 1.5rem;
	color: var(--color-purple);
	font-weight: 700;
	margin-bottom: var(--space-lg);
	line-height: 1.2;
}

.description p {
	font-size: 1.2rem;
	line-height: 1.7;
	color: var(--color-text-muted);
	margin-bottom: var(--space-md);
}

.target-card {
	background: white;
	padding: var(--space-lg);
	border-radius: var(--radius-lg);
	border: 1px solid var(--color-border);
	box-shadow: var(--shadow-lg);
	position: relative;
}

.target-card::before {
	content: '';
	position: absolute;
	inset: -2px;
	background: linear-gradient(to bottom right, var(--color-purple), var(--color-green));
	border-radius: calc(var(--radius-lg) + 2px);
	z-index: -1;
	opacity: 0.3;
}

h3 {
	margin-bottom: var(--space-lg);
	font-size: 1.5rem;
	text-align: center;
}

.target-list {
	display: flex;
	flex-direction: column;
	gap: var(--space-md);
}

.target-item {
	display: flex;
	gap: 1rem;
	align-items: flex-start;
}

.item-icon {
	background: var(--color-bg-alt);
	color: var(--color-green);
	width: 32px;
	height: 32px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.item-text {
	display: flex;
	flex-direction: column;
}

.item-text strong {
	font-size: 1.1rem;
	color: var(--color-text);
}

.item-text span {
	font-size: 0.95rem;
	color: var(--color-text-muted);
}

@media (max-width: 968px) {
	.grid {
		grid-template-columns: 1fr;
	}
	
	h2 {
		font-size: 2.5rem;
	}
}
</style>
