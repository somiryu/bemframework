<script lang="ts">
	let { compact = false }: { compact?: boolean } = $props();
</script>

<section class="intro tl-stack" class:compact>
	<h1 class="title">Hablemos de centauros</h1>

	<div class="trio">
		<figure>
			<img src="/taller/kasparov.webp" alt="Garri Kaspárov con una pieza de ajedrez" width="403" height="526" />
			<figcaption>Garri Kaspárov</figcaption>
		</figure>
		<div class="centaurs" aria-hidden="true">
			<img src="/taller/centauro.png" alt="" />
			<img src="/taller/centauro.png" alt="" class="flip" />
		</div>
		<figure>
			<img src="/taller/doctorow.webp" alt="Cory Doctorow" width="388" height="526" />
			<figcaption>Cory Doctorow</figcaption>
		</figure>
	</div>

	<div class="poles">
		<div class="pole h">
			<b>Centauro</b>
			<p>
				En 1998 Kaspárov propuso el <em>ajedrez avanzado</em>: una persona jugando con una computadora al
				lado. Cabeza humana, cuerpo de máquina.
			</p>
		</div>
		<div class="pole m">
			<b>Centauro invertido</b>
			<p>
				Cory Doctorow nombró lo contrario: la máquina decide y la persona le presta el cuerpo.
			</p>
		</div>
	</div>

	<p class="question">Una sola pregunta para todo el taller: <strong>¿quién hizo el pensamiento creativo?</strong></p>
	<p class="tl-muted">
		Vamos a ver seis usos de la IA hechos por docentes. En cada uno te preguntaremos si ya lo has hecho y
		dónde lo ubicas entre esas dos criaturas. No hay respuesta correcta: queremos ver cómo lo lee el grupo.
	</p>
</section>

<style>
	.title {
		text-align: center;
	}

	.trio {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: clamp(12px, 4vw, 48px);
		align-items: start;
		max-width: 900px;
		margin: 8px auto 0;
		width: 100%;
	}

	figure {
		margin: 0;
		display: grid;
		gap: 12px;
		justify-items: center;
	}

	figure img {
		width: 100%;
		max-width: 300px;
		height: auto;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		display: block;
	}

	figcaption {
		color: var(--tl-purple);
		font-size: clamp(1rem, 2.4vw, 1.6rem);
		font-weight: 400;
		text-align: center;
	}

	.centaurs {
		display: grid;
		gap: 6px;
		align-self: center;
		width: clamp(70px, 14vw, 170px);
	}

	.centaurs img {
		width: 100%;
		height: auto;
		display: block;
	}

	.centaurs .flip {
		transform: rotate(180deg);
	}

	.poles {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border: 1px solid var(--tl-line);
		border-radius: 14px;
		overflow: hidden;
	}

	.pole {
		padding: 18px 20px;
		display: grid;
		gap: 6px;
		align-content: start;
	}

	.pole b {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.pole.h {
		background: var(--tl-human-soft);
	}
	.pole.h b {
		color: var(--tl-human);
	}
	.pole.m {
		background: var(--tl-machine-soft);
	}
	.pole.m b {
		color: var(--tl-machine);
	}

	.question {
		font-size: clamp(1.15rem, 2.6vw, 1.45rem);
		text-align: center;
		text-wrap: balance;
	}

	.question strong {
		color: var(--tl-purple-ink);
		font-weight: 600;
	}

	.compact .trio {
		max-width: 520px;
	}

	@media (max-width: 640px) {
		.poles {
			grid-template-columns: 1fr;
		}
	}
</style>
