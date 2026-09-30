<script lang="ts">
	import HostLive from './HostLive.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Facilitador · Sala {data.code}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<HostLive code={data.code} initialView={data.view} />
