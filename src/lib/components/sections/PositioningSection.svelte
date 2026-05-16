<script lang="ts">
	export type Lang = 'en' | 'es';
	let { lang }: { lang: Lang } = $props();

	const content = {
		en: {
			title: 'Gamification Has a Structural Problem',
			p1: 'Most gamification systems rely on superficial mechanics layered over weak engagement models. They stimulate activity, but rarely create durable behavioral architecture.',
			p2: 'BEM reframes gamification as a structural discipline. It treats engagement as a layered system composed of mechanics, behavioral loops and motivational architecture.'
		},
		es: {
			title: 'La Gamificación Tiene un Problema Estructural',
			p1: 'La mayoría de los sistemas dependen de mecánicas superficiales sobre modelos débiles. Estimulan actividad, pero rara vez crean arquitectura conductual duradera.',
			p2: 'BEM replantea la gamificación como una disciplina estructural. Trata el engagement como un sistema en capas.'
		}
	};

	const t = $derived(content[lang]);
</script>

<section class="section">
	<div class="container centered">
		<div class="text-block">
      <h2>{t.title}</h2>
      <p>{t.p1}</p>
      <br />
      <p>{t.p2}</p>
    </div>
	</div>
</section>

<style>
	.section{
		background: #f0f2f5;
	}
.centered {
	display: flex;
	justify-content: center;
}

.text-block {
	max-width: 780px;
}
</style>
