<script lang="ts">
	let { title, intro, areasTitle, areasIntro, areas, skillsTitle, skillsIntro, skills } = $props();
</script>

<section class="section discipline-section">
	<div class="container container-narrow">
		<span class="label">The Philosophy</span>
		<h2>{title}</h2>
		<p class="intro">{intro}</p>
	</div>

	<div class="container">
		<div class="areas-header">
			<h3>{areasTitle}</h3>
			<p>{areasIntro}</p>
		</div>
		<div class="areas-grid">
			{#each areas as area}
				<div class="area-item">
					<h4>{area.title}</h4>
					<p>{area.description}</p>
				</div>
			{/each}
		</div>

		<div class="skills-section">
			<div class="skills-header">
				<h3>{skillsTitle}</h3>
				<p>{skillsIntro}</p>
			</div>
			<div class="skills-grid">
				{#each skills as skill}
					<div class="skill-card">
						<div class="skill-icon"></div>
						<div class="skill-info">
							<h4>{skill.title}</h4>
							<p>{skill.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
.discipline-section {
	background: white;
}

.intro {
	font-size: 1.4rem;
	line-height: 1.7;
	color: var(--color-text);
	margin-top: var(--space-lg);
}

.areas-header, .skills-header {
	margin-top: var(--space-2xl);
	margin-bottom: var(--space-xl);
}

.areas-header h3, .skills-header h3 {
	font-size: 2rem;
	margin-bottom: var(--space-sm);
	color: var(--color-purple);
}

.areas-header p, .skills-header p {
	font-size: 1.2rem;
	color: var(--color-text-muted);
}

.areas-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 2rem;
}

.area-item {
	padding: 1.5rem;
	border-bottom: 2px solid var(--color-bg-alt);
}

.area-item h4 {
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
	color: var(--color-text);
}

.area-item p {
	font-size: 1rem;
	color: var(--color-text-muted);
}

.skills-section {
	margin-top: var(--space-2xl);
	padding-top: var(--space-2xl);
	border-top: 1px solid var(--color-border);
}

.skills-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
	gap: 2rem;
}

.skill-card {
	display: flex;
	gap: 1.5rem;
	padding: 2rem;
	background: var(--color-bg-alt);
	border-radius: var(--radius-lg);
	transition: var(--transition-normal);
}

.skill-card:hover {
	background: white;
	box-shadow: var(--shadow-md);
}

.skill-icon {
	width: 40px;
	height: 40px;
	background: var(--color-purple);
	border-radius: 50%;
	flex-shrink: 0;
	opacity: 0.2;
}

.skill-info h4 {
	font-size: 1.3rem;
	margin-bottom: 0.5rem;
}

.skill-info p {
	font-size: 1.05rem;
	line-height: 1.6;
	color: var(--color-text-muted);
}

@media (max-width: 768px) {
	.skills-grid {
		grid-template-columns: 1fr;
	}
}
</style>
