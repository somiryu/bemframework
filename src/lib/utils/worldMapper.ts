export interface CanonicalWorld {
	id: number;
	order_index: number;
	title: string;
	narrative_place: string;
	narrative_mentor: string;
	narrative_objective: string;
	narrative_intro?: any[];
	narrative_outro?: any[];
	workshop_modules?: any;
	training_modules?: any;
	design_modules?: any;
	wiki_modules?: any[];
	[key: string]: any;
}

export interface DisplayWorld extends CanonicalWorld {
	canonicalId: number;
	canonicalOrderIndex: number;
	displayNumber: number;
	displayWorldNumber: string;
	displayTitle: string;
	rawCleanTitle: string;
}

/**
 * Strips any leading "Misión X:" or "Mission X:" or "Mundo X:" prefix from a title
 */
export function extractCleanTitle(rawTitle: string): string {
	if (!rawTitle) return '';
	return rawTitle
		.replace(/^(Misi[oó]n|Mission|Mundo|World)\s*\d+\s*[:\-–—]\s*/i, '')
		.trim();
}

/**
 * Filters the list of all master worlds to ONLY those unlocked in the course instance,
 * and attaches relative sequential numbering (Mundo 1, Mundo 2, ... Mundo N).
 */
export function formatActiveWorlds(allWorlds: CanonicalWorld[] = [], unlockedWorldIds: number[] = []): DisplayWorld[] {
	if (!Array.isArray(allWorlds) || allWorlds.length === 0) return [];
	
	const unlockedSet = new Set(Array.isArray(unlockedWorldIds) ? unlockedWorldIds : []);
	
	// Sort master worlds by their canonical order
	const sortedMaster = [...allWorlds].sort((a, b) => (a.order_index ?? a.id) - (b.order_index ?? b.id));
	
	// Filter to only unlocked worlds
	const activeList = sortedMaster.filter(w => unlockedSet.has(w.id));
	
	// If unlocked list is empty, return empty list or fallback to world 1
	const finalActive = activeList.length > 0 ? activeList : sortedMaster.slice(0, 1);
	
	return finalActive.map((world, idx) => {
		const relativeNumber = idx + 1;
		const rawClean = extractCleanTitle(world.title);
		const isEnglish = world.title?.toLowerCase().startsWith('mission');
		const missionPrefix = isEnglish ? `Mission ${relativeNumber}` : `Misión ${relativeNumber}`;
		const worldPrefix = isEnglish ? `WORLD ${relativeNumber}` : `MUNDO ${relativeNumber}`;
		const displayTitle = rawClean ? `${missionPrefix}: ${rawClean}` : `${missionPrefix}`;

		return {
			...world,
			canonicalId: world.id,
			canonicalOrderIndex: world.order_index,
			displayNumber: relativeNumber,
			displayWorldNumber: worldPrefix,
			displayTitle,
			rawCleanTitle: rawClean
		};
	});
}
