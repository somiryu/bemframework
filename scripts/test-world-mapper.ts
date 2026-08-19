import { formatActiveWorlds, formatSingleWorld, extractCleanTitle } from '../src/lib/utils/worldMapper';

const sampleWorlds = [
	{ id: 1, order_index: 1, title: 'Misión 1: Iniciación en la OMIE y los 7 Drivers BEM', narrative_place: 'Base OMIE', narrative_mentor: 'Sara', narrative_objective: 'Aprender los 7 drivers' },
	{ id: 2, order_index: 2, title: 'Misión 2: El Modelo GFR y la Teoría de la Autodeterminación', narrative_place: 'Laboratorio GFR', narrative_mentor: 'Kira', narrative_objective: 'Comprender GFR' },
	{ id: 3, order_index: 3, title: 'Misión 3: Ciclos Interactivos de Aprendizaje', narrative_place: 'Taller de Relojería', narrative_mentor: 'John Wilkins', narrative_objective: 'Dominar bucles' },
	{ id: 4, order_index: 4, title: 'Misión 4: Arquitectura de Metas y Expectativas', narrative_place: 'Torre de Metas', narrative_mentor: 'Kira', narrative_objective: 'Diseñar objetivos' },
	{ id: 5, order_index: 5, title: 'Misión 5: Llamados a la Acción y Capturadores de Atención', narrative_place: 'Centro de Alertas', narrative_mentor: 'Sara', narrative_objective: 'Estructurar señales' },
	{ id: 6, order_index: 6, title: 'Misión 6: Psicología de la toma de decisión y la toma de acción', narrative_place: 'Cámara de Decisiones', narrative_mentor: 'Sara', narrative_objective: 'Heurísticas' },
	{ id: 7, order_index: 7, title: 'Misión 7: Evaluación e Incentivos', narrative_place: 'Ágora Evaluativa', narrative_mentor: 'Kira', narrative_objective: 'Evaluar e incentivar' }
];

console.log('🧪 Testing World Mapper Logic...\n');

// TEST 1: Instance with [1, 3, 6, 7]
console.log('--- TEST 1: Instance with unlocked [1, 3, 6, 7] (TEST instance) ---');
const result1 = formatActiveWorlds(sampleWorlds, [1, 3, 6, 7]);
console.log(`Active count: ${result1.length} (Expected 4)`);
result1.forEach(w => {
	console.log(`  - Canonical ID ${w.canonicalId} => [${w.displayWorldNumber}] "${w.displayTitle}"`);
});

if (
	result1.length === 4 &&
	result1[0].displayNumber === 1 && result1[0].canonicalId === 1 && result1[0].displayTitle.startsWith('Misión 1:') &&
	result1[1].displayNumber === 2 && result1[1].canonicalId === 3 && result1[1].displayTitle.startsWith('Misión 2:') &&
	result1[2].displayNumber === 3 && result1[2].canonicalId === 6 && result1[2].displayTitle.startsWith('Misión 3:') &&
	result1[3].displayNumber === 4 && result1[3].canonicalId === 7 && result1[3].displayTitle.startsWith('Misión 4:')
) {
	console.log('✅ TEST 1 PASSED!\n');
} else {
	console.error('❌ TEST 1 FAILED!');
	process.exit(1);
}

// TEST 2: Instance with [1, 5] (OASIS instance)
console.log('--- TEST 2: Instance with unlocked [1, 5] (OASIS instance) ---');
const result2 = formatActiveWorlds(sampleWorlds, [1, 5]);
console.log(`Active count: ${result2.length} (Expected 2)`);
result2.forEach(w => {
	console.log(`  - Canonical ID ${w.canonicalId} => [${w.displayWorldNumber}] "${w.displayTitle}"`);
});

if (
	result2.length === 2 &&
	result2[0].displayNumber === 1 && result2[0].canonicalId === 1 &&
	result2[1].displayNumber === 2 && result2[1].canonicalId === 5 && result2[1].displayTitle.startsWith('Misión 2:')
) {
	console.log('✅ TEST 2 PASSED!\n');
} else {
	console.error('❌ TEST 2 FAILED!');
	process.exit(1);
}

// TEST 3: Instance with [3, 6] (Discontinuous non-1 start)
console.log('--- TEST 3: Instance with unlocked [3, 6] ---');
const result3 = formatActiveWorlds(sampleWorlds, [3, 6]);
console.log(`Active count: ${result3.length} (Expected 2)`);
result3.forEach(w => {
	console.log(`  - Canonical ID ${w.canonicalId} => [${w.displayWorldNumber}] "${w.displayTitle}"`);
});

if (
	result3.length === 2 &&
	result3[0].displayNumber === 1 && result3[0].canonicalId === 3 && result3[0].displayTitle.startsWith('Misión 1:') &&
	result3[1].displayNumber === 2 && result3[1].canonicalId === 6 && result3[1].displayTitle.startsWith('Misión 2:')
) {
	console.log('✅ TEST 3 PASSED!\n');
} else {
	console.error('❌ TEST 3 FAILED!');
	process.exit(1);
}

console.log('🎉 ALL WORLD MAPPER UNIT TESTS PASSED WITH 100% SUCCESS!');
