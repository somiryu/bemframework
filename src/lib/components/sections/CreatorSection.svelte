<script lang="ts">
	let { name, about, skills, photo, linkedin, whatsapp } = $props();
</script>

<section class="section creator">
	<div class="container">
		<div class="creator-grid">
			<div class="creator-image">
				<img src={photo} alt={name} />
				<div class="image-accent"></div>
			</div>
			<div class="creator-content">
				<span class="label">The Founder</span>
				<h2>{name}</h2>
				<div class="about">
					{#each about as p}
						<p>{p}</p>
					{/each}
				</div>
				<div class="skills">
					<strong>Top Skills:</strong>
					<p>{skills}</p>
				</div>
				
				<div class="social-actions">
					{#if linkedin}
						<a href={linkedin} target="_blank" rel="noopener noreferrer" class="btn-social btn-linkedin">
							LinkedIn
						</a>
					{/if}
					
					{#if whatsapp}
						<a href={whatsapp} target="_blank" rel="noopener noreferrer" class="btn-social btn-whatsapp">
							WhatsApp
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
.creator {
	background: white;
}

.creator-grid {
	display: grid;
	grid-template-columns: 1fr 1.5fr;
	gap: var(--space-xl);
	align-items: center;
}

.creator-image {
	position: relative;
}

.creator-image img {
	width: 100%;
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	position: relative;
	z-index: 1;
	aspect-ratio: 1;
	object-fit: cover;
}

.image-accent {
	position: absolute;
	top: -20px;
	left: -20px;
	width: 100px;
	height: 100px;
	background: var(--color-purple);
	border-radius: var(--radius-md);
	opacity: 0.2;
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
	margin-bottom: var(--space-lg);
}

.about p {
	margin-bottom: var(--space-md);
	font-size: 1.1rem;
	line-height: 1.7;
}

.skills {
	margin-top: var(--space-lg);
	padding: var(--space-md);
	background: var(--color-bg-alt);
	border-radius: var(--radius-md);
	border-left: 4px solid var(--color-purple);
}

.skills strong {
	display: block;
	margin-bottom: 0.5rem;
	color: var(--color-text);
}

.skills p {
	margin: 0;
	font-size: 1rem;
	font-weight: 600;
}

.social-actions {
	display: flex;
	gap: 1rem;
	margin-top: var(--space-lg);
}

.btn-social {
	padding: 0.8rem 1.5rem;
	border-radius: var(--radius-md);
	font-weight: 700;
	text-decoration: none;
	transition: var(--transition-normal);
	font-size: 0.95rem;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}

.btn-linkedin {
	background: #0077b5;
	color: white;
}

.btn-whatsapp {
	background: #25d366;
	color: white;
}

.btn-social:hover {
	transform: translateY(-3px);
	box-shadow: var(--shadow-md);
	filter: brightness(1.1);
}

@media (max-width: 900px) {
	.creator-grid {
		grid-template-columns: 1fr;
		gap: var(--space-lg);
	}
	
	.creator-image {
		max-width: 400px;
		margin: 0 auto;
	}
}
</style>
