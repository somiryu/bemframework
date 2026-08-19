<script lang="ts">
	import { page } from '$app/state';

	const lang = $derived((page.params.lang as 'es' | 'en') ?? 'es');
	const status = $derived(page.status);

	const copy = $derived(
		lang === 'es'
			? {
					eyebrow: 'OMIE CENTRAL',
					title: status === 404 ? 'Señal perdida' : 'Turbulencia en el sistema',
					body:
						status === 404
							? 'GIOCHI no encuentra esta coordenada en el mapa de la Academia.'
							: 'Algo falló al cargar tu misión. El equipo de la OMIE ya lo está revisando.',
					cta: '🌱 Volver al Mapa'
				}
			: {
					eyebrow: 'OMIE CENTRAL',
					title: status === 404 ? 'Signal lost' : 'System turbulence',
					body:
						status === 404
							? "GIOCHI can't find this coordinate on the Academy map."
							: 'Something failed while loading your mission. The OMIE team is already on it.',
					cta: '🌱 Back to the Map'
				}
	);
</script>

<div class="learn-error-shell">
	<div class="error-card">
		<span class="solar-glow">🤖</span>
		<span class="eyebrow">{copy.eyebrow} · {status}</span>
		<h1>{copy.title}</h1>
		<p>{copy.body}</p>
		<a href="/{lang}/learn" class="btn-solar-primary">{copy.cta}</a>
	</div>
</div>

<style>
	.learn-error-shell {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-solar-bg, #faf9f6);
		padding: 2rem;
		font-family: var(--font-solar-body);
	}

	.error-card {
		max-width: 420px;
		width: 100%;
		text-align: center;
		background: white;
		border: 1px solid var(--color-solar-card-border, #e5e7eb);
		border-radius: var(--radius-solar-lg, 32px);
		box-shadow: var(--shadow-solar-md);
		padding: 3rem 2.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.solar-glow {
		font-size: 3rem;
		filter: drop-shadow(0 0 10px rgba(255, 209, 102, 0.4));
		margin-bottom: 0.25rem;
	}

	.eyebrow {
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--color-solar-green-medium, #3d8f68);
	}

	h1 {
		font-family: var(--font-solar-header);
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-solar-green-dark, #1e4533);
		margin: 0;
	}

	p {
		font-size: 0.95rem;
		color: var(--color-solar-text-muted, #6b7280);
		margin: 0 0 0.5rem;
		line-height: 1.5;
	}
</style>
