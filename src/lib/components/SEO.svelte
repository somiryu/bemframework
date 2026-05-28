<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		title: string;
		description: string;
		keywords?: string;
		image?: string;
		ogType?: string;
		lang: 'en' | 'es';
		faq?: Array<{ question: string; answer: string }>;
	}

	let { 
		title, 
		description, 
		keywords = '', 
		image = '/bem-logo.png', 
		ogType = 'website',
		lang,
		faq
	}: Props = $props();

	const url = $derived(page.url.href);
	const siteName = 'BEM Framework';
	const twitterHandle = '@javiervelasquez'; // Assuming based on creator section

	const alternateLang = $derived(lang === 'en' ? 'es' : 'en');
	const alternateUrl = $derived.by(() => {
		const currentPath = page.url.pathname;
		if (lang === 'en') {
			return currentPath.replace('/en', '/es');
		} else {
			return currentPath.replace('/es', '/en');
		}
	});

	// Structured Data for AEO
	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: siteName,
		description: description,
		url: url,
		inLanguage: lang,
		author: {
			'@type': 'Person',
			name: 'Javier Velásquez',
			jobTitle: 'Gamification Designer',
			url: 'https://www.linkedin.com/in/javier-velasquez-game/'
		},
		publisher: {
			'@type': 'Organization',
			name: siteName,
			logo: {
				'@type': 'ImageObject',
				url: `${page.url.origin}/bem-logo.png`
			}
		}
	});

	// Structured Data for FAQ Page (AEO / AI optimization)
	const faqJsonLd = $derived(
		faq && faq.length > 0
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faq.map((item) => ({
						'@type': 'Question',
						name: item.question,
						acceptedAnswer: {
							'@type': 'Answer',
							text: item.answer
						}
					}))
			  }
			: null
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<link rel="canonical" href={url} />

	<!-- Hreflang for SEO -->
	<link rel="alternate" hreflang={lang} href={url} />
	<link rel="alternate" hreflang={alternateLang} href={`${page.url.origin}${alternateUrl}`} />
	<link rel="alternate" hreflang="x-default" href={`${page.url.origin}/en`} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={`${page.url.origin}${image}`} />
	<meta property="og:site_name" content={siteName} />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={`${page.url.origin}${image}`} />
	{#if twitterHandle}
		<meta property="twitter:creator" content={twitterHandle} />
	{/if}

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
	{#if faqJsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(faqJsonLd)}<\/script>`}
	{/if}
</svelte:head>
