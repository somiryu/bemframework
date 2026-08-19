import { describe, it, expect } from 'vitest';
import { extractCleanTitle, formatActiveWorlds, type CanonicalWorld } from './worldMapper';

function world(overrides: Partial<CanonicalWorld> & { id: number }): CanonicalWorld {
	return {
		order_index: overrides.id,
		title: `Misión ${overrides.id}: Mundo de Prueba ${overrides.id}`,
		narrative_place: 'Lugar',
		narrative_mentor: 'Mentor',
		narrative_objective: 'Objetivo',
		...overrides
	};
}

describe('extractCleanTitle', () => {
	it('strips a "Misión N:" prefix', () => {
		expect(extractCleanTitle('Misión 3: Ciclos Interactivos')).toBe('Ciclos Interactivos');
	});

	it('strips an accent-free "Mision N:" prefix', () => {
		expect(extractCleanTitle('Mision 3: Ciclos Interactivos')).toBe('Ciclos Interactivos');
	});

	it('strips a "Mission N:" prefix', () => {
		expect(extractCleanTitle('Mission 4: Goal Architecture')).toBe('Goal Architecture');
	});

	it('strips a "Mundo N:" prefix', () => {
		expect(extractCleanTitle('Mundo 1: Iniciación en la OMIE')).toBe('Iniciación en la OMIE');
	});

	it('strips a "World N:" prefix', () => {
		expect(extractCleanTitle('World 1: OMIE Initiation')).toBe('OMIE Initiation');
	});

	it('accepts dash and em-dash separators, not just colons', () => {
		expect(extractCleanTitle('Misión 2 - El Modelo GFR')).toBe('El Modelo GFR');
		expect(extractCleanTitle('Misión 2 – El Modelo GFR')).toBe('El Modelo GFR');
		expect(extractCleanTitle('Misión 2 — El Modelo GFR')).toBe('El Modelo GFR');
	});

	it('leaves a title with no recognized prefix untouched', () => {
		expect(extractCleanTitle('Ciclos Interactivos de Aprendizaje')).toBe('Ciclos Interactivos de Aprendizaje');
	});

	it('trims trailing whitespace and collapses space after the separator', () => {
		expect(extractCleanTitle('Misión 1:   Iniciación   ')).toBe('Iniciación');
	});

	it('does not match the prefix pattern when the title has leading whitespace', () => {
		// The regex is anchored to the very start of the string (^), so a
		// title that isn't already left-trimmed passes through unchanged.
		expect(extractCleanTitle('  Misión 1: Iniciación')).toBe('Misión 1: Iniciación');
	});

	it('returns an empty string for falsy input', () => {
		expect(extractCleanTitle('')).toBe('');
		expect(extractCleanTitle(undefined as unknown as string)).toBe('');
	});
});

describe('formatActiveWorlds', () => {
	it('returns an empty array when there are no worlds', () => {
		expect(formatActiveWorlds([], [1])).toEqual([]);
		expect(formatActiveWorlds(undefined, [1])).toEqual([]);
	});

	it('filters to only the unlocked worlds', () => {
		const worlds = [1, 2, 3, 4].map((id) => world({ id }));
		const result = formatActiveWorlds(worlds, [1, 3]);
		expect(result.map((w) => w.canonicalId)).toEqual([1, 3]);
	});

	// This is the exact bug fixed in the /learn audit: a short course that
	// only unlocks worlds 1, 3, 6 and 7 must read as Misión 1/2/3/4 — never
	// jump straight to "Misión 3" with no 1 or 2 in sight, and never leak
	// the canonical order_index into the number the student sees.
	it('numbers unlocked worlds sequentially with no gaps, regardless of canonical id spacing', () => {
		const worlds = [1, 2, 3, 4, 5, 6, 7].map((id) => world({ id }));
		const result = formatActiveWorlds(worlds, [1, 3, 6, 7]);

		expect(result.map((w) => w.displayNumber)).toEqual([1, 2, 3, 4]);
		expect(result.map((w) => w.displayWorldNumber)).toEqual(['MUNDO 1', 'MUNDO 2', 'MUNDO 3', 'MUNDO 4']);
		// canonical identity must still be recoverable even though the
		// display number no longer matches it
		expect(result.map((w) => w.canonicalId)).toEqual([1, 3, 6, 7]);
	});

	it('orders by order_index, not by unlocked_worlds insertion order', () => {
		const worlds = [1, 2, 3].map((id) => world({ id }));
		// unlocked_worlds listed out of order — output must still follow
		// the worlds' own order_index, not this array's order
		const result = formatActiveWorlds(worlds, [3, 1, 2]);
		expect(result.map((w) => w.canonicalId)).toEqual([1, 2, 3]);
	});

	it('falls back to the first master world when nothing is unlocked', () => {
		const worlds = [1, 2, 3].map((id) => world({ id }));
		const result = formatActiveWorlds(worlds, []);
		expect(result).toHaveLength(1);
		expect(result[0].canonicalId).toBe(1);
	});

	it('silently ignores an unlocked id that has no matching world', () => {
		const worlds = [1, 2].map((id) => world({ id }));
		const result = formatActiveWorlds(worlds, [1, 99, 2]);
		expect(result.map((w) => w.canonicalId)).toEqual([1, 2]);
		expect(result.map((w) => w.displayNumber)).toEqual([1, 2]);
	});

	it('builds a Spanish displayTitle by default', () => {
		const worlds = [world({ id: 1, title: 'Misión 1: Iniciación en la OMIE' })];
		const result = formatActiveWorlds(worlds, [1]);
		expect(result[0].displayTitle).toBe('Misión 1: Iniciación en la OMIE');
		expect(result[0].displayWorldNumber).toBe('MUNDO 1');
	});

	it('builds an English displayTitle when the source title starts with "Mission"', () => {
		const worlds = [world({ id: 1, title: 'Mission 1: OMIE Initiation' })];
		const result = formatActiveWorlds(worlds, [1]);
		expect(result[0].displayTitle).toBe('Mission 1: OMIE Initiation');
		expect(result[0].displayWorldNumber).toBe('WORLD 1');
	});

	it('omits the trailing ": " when the title has no clean remainder', () => {
		// extractCleanTitle only strips the prefix when a separator (:-–—)
		// follows the number, so a bare "Misión 1" title has nothing to
		// strip — rawClean falls back to the full original string.
		const worlds = [world({ id: 1, title: 'Misión 1:' })];
		const result = formatActiveWorlds(worlds, [1]);
		expect(result[0].displayTitle).toBe('Misión 1');
	});

	it('doubles the prefix when the source title has no separator to strip', () => {
		// Documents the real (if surprising) behavior for a title with no
		// ":"/"-" after the number — not something this test suite invents.
		const worlds = [world({ id: 1, title: 'Misión 1' })];
		const result = formatActiveWorlds(worlds, [1]);
		expect(result[0].displayTitle).toBe('Misión 1: Misión 1');
	});

	it('preserves canonicalOrderIndex separately from the relative displayNumber', () => {
		const worlds = [world({ id: 5, order_index: 5 }), world({ id: 7, order_index: 7 })];
		const result = formatActiveWorlds(worlds, [5, 7]);
		expect(result[0]).toMatchObject({ canonicalId: 5, canonicalOrderIndex: 5, displayNumber: 1 });
		expect(result[1]).toMatchObject({ canonicalId: 7, canonicalOrderIndex: 7, displayNumber: 2 });
	});
});
