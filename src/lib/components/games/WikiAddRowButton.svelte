<script lang="ts">
	let { 
		onclick, 
		text 
	}: { 
		onclick: () => void; 
		text: string; 
	} = $props();
</script>

<button type="button" class="btn-add-row" {onclick}>
	{text}
</button>

<style>
	.btn-add-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.95rem;
		background: white;
		border: 1.5px dashed var(--color-solar-green-medium, #3d8f68);
		color: var(--color-solar-green-dark, #2b664a);
		border-radius: 12px;
		font-weight: 750;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
		box-sizing: border-box;
		margin-top: 1.5rem;
	}

	.btn-add-row:hover {
		background: var(--color-solar-green-light, rgba(61, 143, 104, 0.08));
		transform: translateY(-1px);
	}
</style>
