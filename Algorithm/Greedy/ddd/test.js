import { activitySelection, eraseOverlapIntervals, findMinArrowShots, mergeIntervals } from './IntervalGreedy.js';
import { canJump, jump } from './JumpGameGreedy.js';

function runTest(name, actual, expected) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log(`[PASS] ${name}`);
    } else {
        console.error(`[FAIL] ${name}`);
        console.error(`Expected: ${JSON.stringify(expected)}`);
        console.error(`Actual:   ${JSON.stringify(actual)}`);
        process.exitCode = 1;
    }
}

console.log('--- Activity Selection & Intervals ---');

// Activity Selection
const activities = [
    { start: 1, end: 3 },
    { start: 2, end: 5 },
    { start: 0, end: 6 },
    { start: 5, end: 7 },
    { start: 8, end: 9 },
    { start: 5, end: 9 }
];
// Max is 1,3 then 5,7 then 8,9. Total 3.
const resultActivity = activitySelection(activities);
runTest('Activity Selection Count', resultActivity.length, 3);


// Non-overlapping Intervals (LeetCode 435)
// Max non-overlapping = 3 (from [1,2],[2,3],[3,4]). Total 4. Remove = 1.
runTest('Erase Overlap Intervals', eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]), 1);


// Min Arrow Shots (LeetCode 452)
runTest('Find Min Arrow Shots', findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]]), 2);


// Merge Intervals (LeetCode 56)
console.log('\n--- Merge Intervals ---');
const merged = mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]);
const mergedArrays = merged.map(i => [i.start, i.end]);
runTest('Merge Intervals', mergedArrays, [[1, 6], [8, 10], [15, 18]]);


console.log('\n--- Jump Game ---');

// Can Jump
runTest('Can Jump (True)', canJump([2, 3, 1, 1, 4]), true);
runTest('Can Jump (False)', canJump([3, 2, 1, 0, 4]), false);

// Jump II
runTest('Min Jumps', jump([2, 3, 1, 1, 4]), 2);
