<script lang="ts">
	import '../styles/reset.css';
	import '../styles/variables.css';
	import '../styles/base.css';
	import { page } from '$app/state';
	import DiscipleWidget from '$lib/components/DiscipleWidget.svelte';

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

	let isMobileMenuOpen = $state(false);
 
	const navLinks = $derived([
		{ 
			label: lang === 'en' ? 'Framework' : 'Marco',
			href: `/${lang}/framework`,
			submenu: [
				{ label: lang === 'en' ? 'Foundations' : 'Fundamentos', href: `/${lang}/framework/foundations` },
				{ label: lang === 'en' ? 'Subframeworks' : 'Subframeworks', href: `/${lang}/framework/subframeworks` },
				{ label: lang === 'en' ? 'Experiments' : 'Experimentos', href: `/${lang}/framework/experiments` },
				{ label: lang === 'en' ? 'Compare BEM' : 'Comparar BEM', href: `/${lang}/framework/compare` }
			]
		},
		{ 
			label: lang === 'en' ? 'Learning' : 'Aprendizaje',
			href: `/${lang}/learning`,
			submenu: [
				{ label: lang === 'en' ? 'Overview' : 'Visión General', href: `/${lang}/learning` },
				{ label: lang === 'en' ? 'Learning as Interaction' : 'Aprendizaje como Interacción', href: `/${lang}/learning/interaction` },
				{ label: lang === 'en' ? 'Learning Cycles' : 'Ciclos de Aprendizaje', href: `/${lang}/learning/cycles` },
				{ label: lang === 'en' ? 'Designing Objectives' : 'Diseño de Objetivos', href: `/${lang}/learning/objectives` },
				{ label: lang === 'en' ? 'Interfaces & Points' : 'Interfaces y Puntos', href: `/${lang}/learning/feedback` }
			]
		},
		{ 
			label: lang === 'en' ? 'Resources' : 'Recursos',
			href: `/${lang}/resources`,
			submenu: [
				{ label: lang === 'en' ? 'Tools' : 'Herramientas', href: `/${lang}/resources/tools` },
				{ label: lang === 'en' ? 'Play & Learn' : 'Jugar y Aprender', href: `/${lang}/resources/play-and-learn` },
				{ label: lang === 'en' ? 'Blog' : 'Blog', href: `/${lang}/blog` },
				{ label: lang === 'en' ? 'Books' : 'Libros', href: `/${lang}/book` }
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

		<nav class="desktop-nav">
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
 
		<button 
			class="mobile-menu-toggle" 
			onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
			aria-label="Toggle menu"
		>
			<div class="hamburger" class:open={isMobileMenuOpen}>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</button>
	</div>
</header>
 
{#if isMobileMenuOpen}
	<div class="mobile-menu-overlay" onclick={() => isMobileMenuOpen = false}>
		<nav class="mobile-nav" onclick={(e) => e.stopPropagation()}>
			<div class="mobile-nav-header">
				<a href={switchLangPath} class="lang" onclick={() => isMobileMenuOpen = false}>
					{lang === 'en' ? 'ES' : 'EN'}
				</a>
			</div>
			
			<div class="mobile-links">
				{#each navLinks as link}
					<div class="mobile-nav-group">
						<a href={link.href} class="mobile-parent-link" onclick={() => isMobileMenuOpen = false}>
							{link.label}
						</a>
						{#if link.submenu}
							<div class="mobile-submenu">
								{#each link.submenu as sub}
									<a href={sub.href} onclick={() => isMobileMenuOpen = false}>{sub.label}</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</nav>
	</div>
{/if}

<main>
	{@render children()}
</main>

<DiscipleWidget />

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

.desktop-nav {
	display: flex;
	gap: 1.5rem;
	font-weight: 700;
	align-items: center;
}
 
@media (max-width: 1024px) {
	.desktop-nav {
		display: none;
	}
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
	text-decoration: none;
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
	text-decoration: none;
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
	text-decoration: none;
}
 
.lang:hover {
	background: var(--color-purple);
	color: white;
}
 
/* Mobile Nav Styles */
.mobile-menu-toggle {
	display: none;
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	z-index: 2000;
}
 
@media (max-width: 1024px) {
	.mobile-menu-toggle {
		display: block;
	}
}
 
.hamburger {
	width: 24px;
	height: 20px;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
 
.hamburger span {
	display: block;
	height: 2px;
	width: 100%;
	background: var(--color-text);
	border-radius: 2px;
	transition: all 0.3s ease;
}
 
.hamburger.open span:nth-child(1) {
	transform: translateY(9px) rotate(45deg);
}
 
.hamburger.open span:nth-child(2) {
	opacity: 0;
}
 
.hamburger.open span:nth-child(3) {
	transform: translateY(-9px) rotate(-45deg);
}
 
.mobile-menu-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.5);
	backdrop-filter: blur(5px);
	z-index: 1500;
	display: flex;
	justify-content: flex-end;
}
 
.mobile-nav {
	width: 85%;
	max-width: 350px;
	height: 100%;
	background: white;
	padding: var(--space-xl) var(--space-md);
	overflow-y: auto;
	box-shadow: -10px 0 30px rgba(0,0,0,0.1);
}
 
.mobile-nav-header {
	margin-bottom: var(--space-xl);
	display: flex;
	justify-content: flex-end;
}
 
.mobile-links {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
 
.mobile-parent-link {
	display: block;
	font-size: 1.5rem;
	font-weight: 800;
	color: var(--color-text);
	text-decoration: none;
	margin-bottom: 1rem;
}
 
.mobile-submenu {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding-left: 1rem;
	border-left: 2px solid var(--color-border);
}
 
.mobile-submenu a {
	font-size: 1rem;
	font-weight: 600;
	color: var(--color-text-muted);
	text-decoration: none;
	padding: 0.25rem 0;
}
 
.mobile-submenu a:hover {
	color: var(--color-purple);
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
