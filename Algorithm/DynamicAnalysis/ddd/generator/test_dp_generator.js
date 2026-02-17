
import { knapsackGenerator, lcsGenerator } from './DPProblemsGenerator.js';

function runTest(name, actual, expected) {
    if (actual === expected) {
        console.log(`✅ ${name}: Passed (${actual})`);
    } else {
        console.error(`❌ ${name}: Failed (Expected ${expected}, but got ${actual})`);
    }
}

console.log('--- Testing Generator-based DP (Iterative Recursion, Simplified Runner) ---');

// 1. Knapsack
runTest('Knapsack Generator', knapsackGenerator([2, 3, 4, 5], [3, 4, 5, 6], 8), 10);

// 2. LCS
runTest('LCS Generator("abcde", "ace")', lcsGenerator('abcde', 'ace'), 3);

// 3. Stress Test
console.log('--- Stress Testing (Deep State) ---');
const largeWeights = Array(5000).fill(1).map((_, i) => i % 10 + 1);
const largeValues = Array(5000).fill(1).map((_, i) => i % 100);
try {
    const result = knapsackGenerator(largeWeights, largeValues, 50);
    console.log(`✅ Stress Test: Completed without Stack Overflow (Result: ${result})`);
} catch (e) {
    console.error(`❌ Stress Test: Failed (Crash!)`, e);
}

console.log('--- Test Completed ---');
