<script lang="ts">
	import '../styles/reset.css';
	import '../styles/variables.css';
	import '../styles/base.css';
	import { page } from '$app/state';

	let { children } = $props();

	const lang = $derived(page.params.lang ?? 'en');

	const switchLangPath = $derived.by(() => {
		const path = page.url.pathname;
		if (lang === 'en') {
			return path.startsWith('/en') ? path.replace('/en', '/es') : `/es${path === '/' ? '' : path}`;
		} else {
			return path.startsWith('/es') ? path.replace('/es', '/en') : `/en${path === '/' ? '' : path}`;
		}
	});

	const navLinks = $derived([
		{ 
			label: lang === 'en' ? 'Framework' : 'Marco',
			href: `/${lang}/framework`,
			submenu: [
				{ label: lang === 'en' ? 'Overview' : 'Visión General', href: `/${lang}/framework/overview` },
				{ label: lang === 'en' ? 'Mechanics' : 'Mecánicas', href: `/${lang}/framework/mechanics` },
				{ label: lang === 'en' ? 'Structure' : 'Estructura', href: `/${lang}/framework/structure` },
				{ label: lang === 'en' ? 'Case Studies' : 'Casos de Estudio', href: `/${lang}/framework/cases` }
			]
		},
		{ 
			label: lang === 'en' ? 'Learning' : 'Aprendizaje',
			href: `/${lang}/blog`,
			submenu: [
				{ label: lang === 'en' ? 'Blog' : 'Blog', href: `/${lang}/blog` },
				{ label: lang === 'en' ? 'Book' : 'Libro', href: `/${lang}/book` },
				{ label: lang === 'en' ? 'Workshops' : 'Talleres', href: `/${lang}/workshops` }
			]
		},
		{ 
			label: lang === 'en' ? 'Services' : 'Servicios',
			href: `/${lang}/services/consulting`,
			submenu: [
				{ label: lang === 'en' ? 'Consulting' : 'Consultoría', href: `/${lang}/services/consulting` },
				{ label: lang === 'en' ? 'Engagement' : 'Director de Compromiso', href: `/${lang}/services/engagement` },
				{ label: lang === 'en' ? 'Quote' : 'Cotización', href: `/${lang}/services/quote` }
			]
		},
		{ 
			label: lang === 'en' ? 'About' : 'Acerca de',
			href: `/${lang}/about`,
			submenu: [
				{ label: lang === 'en' ? 'Javier Velásquez' : 'Javier Velásquez', href: `/${lang}/about` },
				{ label: lang === 'en' ? 'Contact' : 'Contacto', href: `/${lang}/contact` }
			]
		}
	]);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<header class="site-header">
	<div class="container header-inner">
		<a href={`/${lang}`} class="logo">
			<img src="/bem-logo.png" alt="BEM Framework" />
		</a>

		<nav>
			{#each navLinks as link}
				<div class="nav-item">
					<a href={link.href} class="nav-link">{link.label}</a>
					{#if link.submenu}
						<div class="submenu">
							{#each link.submenu as sub}
								<a href={sub.href}>{sub.label}</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
			
			<a href={switchLangPath} class="lang">
				{lang === 'en' ? 'ES' : 'EN'}
			</a>
		</nav>
	</div>
</header>

<main>
	{@render children()}
</main>

<footer class="footer">
	<div class="container">
		<p>© {new Date().getFullYear()} BEM Framework</p>
	</div>
</footer>

<style>
.site-header {
	padding: 1.25rem 0;
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(20px);
	border-bottom: 1px solid var(--color-border);
	position: sticky;
	top: 0;
	z-index: 1000;
}

.header-inner {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.logo img {
	height: 36px;
	width: auto;
}

nav {
	display: flex;
	gap: 1.5rem;
	font-weight: 700;
	align-items: center;
}

.nav-item {
	position: relative;
}

.nav-link {
	color: var(--color-text);
	transition: var(--transition-normal);
	display: block;
	padding: 0.5rem 0;
	font-size: 0.95rem;
}

.nav-item:hover .nav-link {
	color: var(--color-purple);
	transform: translateY(-1px);
}

.submenu {
	position: absolute;
	top: calc(100% + 5px);
	left: 50%;
	transform: translateX(-50%) translateY(10px);
	background: white;
	min-width: 220px;
	border-radius: var(--radius-md);
	box-shadow: var(--shadow-lg);
	border: 1px solid var(--color-border);
	padding: 0.75rem;
	opacity: 0;
	visibility: hidden;
	transition: all var(--transition-normal);
	display: flex;
	flex-direction: column;
	z-index: 1000;
}

.nav-item:hover .submenu {
	opacity: 1;
	visibility: visible;
	transform: translateX(-50%) translateY(0);
}

.submenu a {
	padding: 0.85rem 1.25rem;
	font-size: 0.9rem;
	border-radius: var(--radius-sm);
	transition: var(--transition-fast);
	font-weight: 600;
	color: var(--color-text-muted);
}

.submenu a:hover {
	background: var(--color-bg-alt);
	color: var(--color-purple);
}

.lang {
	color: var(--color-purple);
	font-size: 0.85rem;
	font-weight: 800;
	padding: 0.5rem 1rem;
	border: 2px solid var(--color-purple);
	border-radius: var(--radius-full);
	margin-left: 1rem;
	transition: var(--transition-normal);
}

.lang:hover {
	background: var(--color-purple);
	color: white;
}

.footer {
	margin-top: var(--space-xl);
	padding: var(--space-xl) 0;
	background: var(--color-bg-alt);
	border-top: 1px solid var(--color-border);
	color: var(--color-text-muted);
	text-align: center;
}

.footer p {
	font-weight: 600;
	font-size: 0.9rem;
}
</style>
