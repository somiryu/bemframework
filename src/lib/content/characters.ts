export interface Character {
	name: string;
	images: {
		base: string;
		[key: string]: string;
	};
}

export const characterRegistry: Record<string, Character> = {
	sara: {
		name: 'Sara Arbelaez',
		images: {
			base: '/learn_resources/characters/char_sara.png',
			animated: '/learn_resources/characters/char_sara_animated.gif'
		}
	},
	kira: {
		name: 'Kira Yamada',
		images: {
			base: '/learn_resources/characters/char_kira.png',
			animated: '/learn_resources/characters/char_kira_animated.gif'
		}
	},
	wilkins: {
		name: 'John Wilkins',
		images: {
			base: '/learn_resources/characters/char_wilkins.png',
			animated: '/learn_resources/characters/char_wilkins_animated.gif'
		}
	},
	giochi: {
		name: 'GIOCHI',
		images: {
			base: '/learn_resources/characters/char_giochi.gif'
		}
	}
};

export const locationRegistry: Record<string, { name: string; images: { base: string; [key: string]: string } }> = {
	omie: {
		name: 'Academia OMIE',
		images: {
			base: '/learn_resources/locations/omie academy.png'
		}
	},
	guidance_lighthouse: {
		name: 'El Faro de la Orientación',
		images: {
			base: '/learn_resources/locations/guidance_lighthouse.png'
		}
	},
	maze: {
		name: 'El Laberinto Cognitivo',
		images: {
			base: '/learn_resources/locations/maze.png'
		}
	}
};

// Helper to resolve character registry based on string name
export function resolveCharacterByName(name: string): Character | null {
	if (!name) return null;
	const lower = name.toLowerCase();
	if (lower.includes('sara')) return characterRegistry.sara;
	if (lower.includes('kira')) return characterRegistry.kira;
	if (lower.includes('john') || lower.includes('wilkins')) return characterRegistry.wilkins;
	if (lower.includes('giochi')) return characterRegistry.giochi;
	return null;
}
