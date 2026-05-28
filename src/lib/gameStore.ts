import { writable, derived } from 'svelte/store';

export interface GameState {
	xp: number;
	unlockedCardIds: number[];
	completedTriviaIds: string[];
	hasSubmittedLeaderboard: boolean;
	discoveredLandingSlots: number[];
	xpHistory: { amount: number; reason: string; timestamp: number }[];
}

const DEFAULT_STATE: GameState = {
	xp: 0,
	unlockedCardIds: [],
	completedTriviaIds: [],
	hasSubmittedLeaderboard: false,
	discoveredLandingSlots: [],
	xpHistory: []
};

// Load initial state from localStorage safely
const getInitialState = (): GameState => {
	if (typeof window === 'undefined') return DEFAULT_STATE;
	try {
		const saved = localStorage.getItem('bem_gamestate');
		if (saved) {
			const parsed = JSON.parse(saved);
			return { ...DEFAULT_STATE, ...parsed };
		}
	} catch (e) {
		console.error('Failed to load BEM gamestate:', e);
	}
	return DEFAULT_STATE;
};

// Base writable store
export const gameState = writable<GameState>(getInitialState());

// Subscribe to save changes to localStorage
if (typeof window !== 'undefined') {
	gameState.subscribe((state) => {
		try {
			localStorage.setItem('bem_gamestate', JSON.stringify(state));
		} catch (e) {
			console.error('Failed to save BEM gamestate:', e);
		}
	});
}

// Derived store for level calculations
export const userLevel = derived(gameState, ($state) => {
	const xp = $state.xp;
	// Level 1: 0-99 XP
	// Level 2: 100-199 XP, etc.
	const level = Math.floor(xp / 100) + 1;
	const xpInCurrentLevel = xp % 100;
	const xpForNextLevel = 100;
	const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpForNextLevel) * 100));

	return {
		level,
		xpInCurrentLevel,
		xpForNextLevel,
		progressPercent
	};
});

// Custom actions helper
export const gameActions = {
	/**
	 * Adds XP to the user's score with a descriptive action name.
	 */
	addXP: (amount: number, reason: string) => {
		gameState.update((state) => {
			// Avoid duplicate XP for the same one-time events
			const alreadyHasReason = state.xpHistory.some(
				(h) => h.reason === reason && (reason.startsWith('trivia_') || reason.startsWith('card_'))
			);
			if (alreadyHasReason) return state;

			const newHistory = [
				{ amount, reason, timestamp: Date.now() },
				...state.xpHistory
			].slice(0, 50); // limit history size to 50 items

			// Trigger custom event for notifications
			if (typeof window !== 'undefined') {
				window.dispatchEvent(
					new CustomEvent('bem-xp-gain', {
						detail: { amount, reason }
					})
				);
			}

			return {
				...state,
				xp: state.xp + amount,
				xpHistory: newHistory
			};
		});
	},

	/**
	 * Unlocks a specific BEM Card and awards bonus XP.
	 */
	unlockCard: (cardId: number, cardTitle: string) => {
		let newlyUnlocked = false;
		gameState.update((state) => {
			if (state.unlockedCardIds.includes(cardId)) return state;
			
			newlyUnlocked = true;
			const updatedIds = [...state.unlockedCardIds, cardId];

			// Trigger custom event for card unlock
			if (typeof window !== 'undefined') {
				window.dispatchEvent(
					new CustomEvent('bem-card-unlock', {
						detail: { id: cardId, title: cardTitle }
					})
				);
			}

			return {
				...state,
				unlockedCardIds: updatedIds
			};
		});

		// Award 75 XP for discovering a new card
		if (newlyUnlocked) {
			gameActions.addXP(75, `card_discovered_${cardId}`);
		}
	},

	/**
	 * Completes a specific trivia question.
	 */
	completeTrivia: (triviaId: string, isCorrect: boolean) => {
		let newlyCompleted = false;
		gameState.update((state) => {
			if (state.completedTriviaIds.includes(triviaId)) return state;
			newlyCompleted = true;
			return {
				...state,
				completedTriviaIds: [...state.completedTriviaIds, triviaId]
			};
		});

		if (newlyCompleted && isCorrect) {
			gameActions.addXP(100, `trivia_${triviaId}`);
		}
	},

	/**
	 * Discovers a specific BEM Card slot on the landing page.
	 */
	discoverSlot: (slotIndex: number) => {
		let allDiscovered = false;
		gameState.update((state) => {
			if (state.discoveredLandingSlots.includes(slotIndex)) return state;
			
			const updatedSlots = [...state.discoveredLandingSlots, slotIndex];
			if (updatedSlots.length === 6) {
				allDiscovered = true;
			}
			return {
				...state,
				discoveredLandingSlots: updatedSlots
			};
		});

		// Award 30 XP for finding a slot
		gameActions.addXP(30, `slot_discovered_${slotIndex}`);

		// If all 6 are discovered, reward a massive +200 XP bonus!
		if (allDiscovered) {
			gameActions.addXP(200, 'all_landing_slots_discovered');
		}
	},

	/**
	 * Resets the entire game state.
	 */
	resetGame: () => {
		gameState.set({
			xp: 0,
			unlockedCardIds: [],
			completedTriviaIds: [],
			hasSubmittedLeaderboard: false,
			discoveredLandingSlots: [],
			xpHistory: []
		});
	},

	/**
	 * Marks that the leaderboard has been successfully updated.
	 */
	setLeaderboardSubmitted: () => {
		gameState.update((state) => ({
			...state,
			hasSubmittedLeaderboard: true
		}));
	}
};
