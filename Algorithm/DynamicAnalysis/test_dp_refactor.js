
// Wrapper to run tests in ESM environment
import {
    fibonacci,
    climbStairs,
    lengthOfLIS,
    knapsack,
    longestCommonSubsequence,
    minDistance,
    maxSubArray,
    uniquePaths
} from './dpProblems.js';

console.log('--- Top-Down DP Refactor Verify ---');
console.log('Fib(10):', fibonacci(10));
console.log('Climb(5):', climbStairs(5));
console.log('LIS:', lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));
console.log('Knapsack:', knapsack([2, 3, 4, 5], [3, 4, 5, 6], 8));
console.log('LCS:', longestCommonSubsequence('abcde', 'ace'));
console.log('EditDist:', minDistance('horse', 'ros'));
console.log('MaxSubArray:', maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log('UniquePaths:', uniquePaths(3, 7));
