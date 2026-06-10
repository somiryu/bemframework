<script lang="ts">
	import { fade } from 'svelte/transition';

	let { 
		world, 
		player, 
		onComplete, 
		onUpdateCoins 
	}: { 
		world: any; 
		player: any; 
		onComplete: () => void; 
		onUpdateCoins: (newCoinsCount: number, newState: any) => void 
	} = $props();
</script>

<div class="wiki-game-wrapper text-center animate-fade max-w-xl mx-auto p-4" in:fade>
	<!-- GIOCHI Speech Bubble -->
	<div class="giochi-speech-bubble text-left mb-6 p-5 glass-card relative border-l-4 border-solar-sky">
		<div class="bubble-title font-bold text-solar-sky flex items-center gap-2">
			🤖 GIOCHI Biblioteca del Mundo 3:
		</div>
		<p class="text-xs text-solar-text mt-2">
			¡Saludos, agente! Actualmente los mentores de la OMIE están digitalizando y curando los manuales teóricos avanzados sobre la relojería de la interactividad. ¡Vuelve más tarde para canjear tus BEM Coins aquí!
		</p>
	</div>

	<!-- Empty Library Panel -->
	<div class="empty-library-panel glass-card p-8 text-center border-dashed border-2 border-gray-200">
		<span class="text-4xl block mb-2">📚</span>
		<h4 class="font-extrabold text-solar-green-dark">Biblioteca Temporalmente Vacía</h4>
		<p class="text-xs text-solar-text-muted mt-1 max-w-md mx-auto">
			No hay manuales o videos disponibles para desbloquear en este momento. Sigue acumulando BEM Coins en el Entrenamiento y el Canvas de Diseño.
		</p>

		<button type="button" class="btn-solar-primary mt-6 px-6 font-bold text-xs" onclick={onComplete}>
			Regresar al Mapa Principal
		</button>
	</div>
</div>

<style>
	.giochi-speech-bubble {
		background: rgba(255, 255, 255, 0.7);
	}
	.empty-library-panel {
		background: rgba(255, 255, 255, 0.5);
	}
</style>
