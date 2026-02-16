import { solveDailyTemperaturesDDD } from './DailyTemperaturesDDD.js';
import { nextGreaterElement, nextGreaterElements } from './NextGreaterElementDDD.js';
import { StockSpanner } from './StockSpannerDDD.js';
import { largestRectangleArea } from './LargestRectangleDDD.js';

function assertArrayEquals(actual, expected, testName) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr === expectedStr) {
        console.log(`[PASS] ${testName}`);
    } else {
        console.log(`[FAIL] ${testName}`);
        console.log(`  Expected: ${expectedStr}`);
        console.log(`  Got:      ${actualStr}`);
        process.exitCode = 1;
    }
}

function assertEquals(actual, expected, testName) {
    if (actual === expected) {
        console.log(`[PASS] ${testName}`);
    } else {
        console.log(`[FAIL] ${testName}`);
        console.log(`  Expected: ${expected}`);
        console.log(`  Got:      ${actual}`);
        process.exitCode = 1;
    }
}

console.log('--- Daily Temperatures ---');
const dtTestCases = [
    { input: [73, 74, 75, 71, 69, 72, 76, 73], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
    { input: [30, 40, 50, 60], expected: [1, 1, 1, 0] },
    { input: [30, 60, 90], expected: [1, 1, 0] }
];
dtTestCases.forEach((test, index) => {
    assertArrayEquals(solveDailyTemperaturesDDD(test.input), test.expected, `DailyTemperatures Case ${index + 1}`);
});

console.log('\n--- Next Greater Element I ---');
const nge1TestCases = [
    { nums1: [4, 1, 2], nums2: [1, 3, 4, 2], expected: [-1, 3, -1] },
    { nums1: [2, 4], nums2: [1, 2, 3, 4], expected: [3, -1] }
];
nge1TestCases.forEach((test, index) => {
    assertArrayEquals(nextGreaterElement(test.nums1, test.nums2), test.expected, `NGE I Case ${index + 1}`);
});

console.log('\n--- Next Greater Element II ---');
const nge2TestCases = [
    { input: [1, 2, 1], expected: [2, -1, 2] },
    { input: [1, 2, 3, 4, 3], expected: [2, 3, 4, -1, 4] }
];
nge2TestCases.forEach((test, index) => {
    assertArrayEquals(nextGreaterElements(test.input), test.expected, `NGE II Case ${index + 1}`);
});

console.log('\n--- Stock Spanner ---');
const spanner = new StockSpanner();
const spannerPrices = [100, 80, 60, 70, 60, 75, 85];
const spannerExpected = [1, 1, 1, 2, 1, 4, 6];
spannerPrices.forEach((price, index) => {
    assertEquals(spanner.next(price), spannerExpected[index], `StockSpanner Day ${index + 1}`);
});

console.log('\n--- Largest Rectangle ---');
const lrTestCases = [
    { input: [2, 1, 5, 6, 2, 3], expected: 10 },
    { input: [2, 4], expected: 4 }
];
lrTestCases.forEach((test, index) => {
    assertEquals(largestRectangleArea(test.input), test.expected, `LargestRectangle Case ${index + 1}`);
});

if (process.exitCode === 1) {
    console.log("\nSome tests failed.");
    process.exit(1);
} else {
    console.log("\nAll tests passed!");
}
