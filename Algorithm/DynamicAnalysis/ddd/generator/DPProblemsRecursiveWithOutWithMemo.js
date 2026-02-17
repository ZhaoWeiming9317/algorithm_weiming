/**
 * 动态规划经典问题实现 - Top-Down (递归 + 显式Memo) 版
 * 
 * 核心思想：
 * 去除高阶函数 wrapper，直接在函数内部显式地声明 memo 和递归函数。
 * 这种写法比高阶函数更“白话”，逻辑流更清晰，更适合理解 recursive DP 的本质。
 * 
 * 结构模版：
 * function problem(params) {
 *     // 1. 初始化备忘录
 *     const memo = new Map(); 
 * 
 *     // 2. 定义递归函数 (State -> Value)
 *     function solve(state) {
 *         // a. Base Case
 *         if (base_case) return ...;
 * 
 *         // b. Check Memo
 *         const key = serialize(state);
 *         if (memo.has(key)) return memo.get(key);
 * 
 *         // c. Recurse & Calculate
 *         const result = ... solve(next_state) ...;
 * 
 *         // d. Write Memo
 *         memo.set(key, result);
 *         return result;
 *     }
 * 
 *     // 3. 入口调用
 *     return solve(initial_state);
 * }
 */

// 1. 斐波那契数列
// solve(n) = solve(n-1) + solve(n-2)
function fibonacci(n) {
    const memo = new Map();

    function solve(i) {
        if (i <= 1) return i;

        if (memo.has(i)) return memo.get(i);

        const result = solve(i - 1) + solve(i - 2);

        memo.set(i, result);
        return result;
    }

    return solve(n);
}

// 2. 爬楼梯
// solve(n) = solve(n-1) + solve(n-2)
function climbStairs(n) {
    const memo = new Map();

    function solve(i) {
        if (i <= 2) return i;

        if (memo.has(i)) return memo.get(i);

        const result = solve(i - 1) + solve(i - 2);

        memo.set(i, result);
        return result;
    }

    return solve(n);
}

// 3. 最长递增子序列
// LIS 的递归定义: 以 index 结尾的 LIS 长度
// solve(i) = max(solve(j) + 1) for all j < i if nums[j] < nums[i]
function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;
    const memo = new Map();

    // 定义：以 i 结尾的最长递增子序列长度
    function solve(i) {
        if (memo.has(i)) return memo.get(i);

        let maxLen = 1;
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                maxLen = Math.max(maxLen, solve(j) + 1);
            }
        }

        memo.set(i, maxLen);
        return maxLen;
    }

    // 注意：这里需要一个外部循环来求全局最大值，因为 LIS 可能以任意位置结尾
    let globalMax = 1;
    for (let i = 0; i < nums.length; i++) {
        globalMax = Math.max(globalMax, solve(i));
    }
    return globalMax;
}

// 4. 0-1背包问题
// solve(i, w) = max(solve(i-1, w), solve(i-1, w-wi) + vi)
function knapsack(weights, values, capacity) {
    const n = weights.length;
    const memo = new Map();

    function solve(i, w) {
        if (i < 0 || w <= 0) return 0;

        const key = `${i}:${w}`; // State: [Item Index, Remaining Capacity]
        if (memo.has(key)) return memo.get(key);

        const valueIfSkip = solve(i - 1, w);
        let valueIfTake = -1;

        if (weights[i] <= w) {
            valueIfTake = solve(i - 1, w - weights[i]) + values[i];
        }

        const result = Math.max(valueIfSkip, valueIfTake);

        memo.set(key, result);
        return result;
    }

    return solve(n - 1, capacity);
}

// 5. 最长公共子序列
// solve(i, j) = match ? 1+solve(i-1, j-1) : max(solve(i-1, j), solve(i, j-1))
function longestCommonSubsequence(text1, text2) {
    const memo = new Map();

    function solve(i, j) {
        if (i < 0 || j < 0) return 0;

        const key = `${i}:${j}`; // State: [Index 1, Index 2]
        if (memo.has(key)) return memo.get(key);

        let result;
        if (text1[i] === text2[j]) {
            result = 1 + solve(i - 1, j - 1);
        } else {
            result = Math.max(
                solve(i - 1, j),
                solve(i, j - 1)
            );
        }

        memo.set(key, result);
        return result;
    }

    return solve(text1.length - 1, text2.length - 1);
}

// 6. 编辑距离
// solve(i, j) = match ? solve(i-1, j-1) : 1 + min(insert, delete, replace)
function minDistance(word1, word2) {
    const memo = new Map();

    function solve(i, j) {
        if (i < 0) return j + 1; // Insert remaining (Base Case 1)
        if (j < 0) return i + 1; // Delete remaining (Base Case 2)

        const key = `${i}:${j}`;
        if (memo.has(key)) return memo.get(key);

        let result;
        if (word1[i] === word2[j]) {
            result = solve(i - 1, j - 1);
        } else {
            result = 1 + Math.min(
                solve(i - 1, j),    // Delete
                solve(i, j - 1),    // Insert
                solve(i - 1, j - 1) // Replace
            );
        }

        memo.set(key, result);
        return result;
    }

    return solve(word1.length - 1, word2.length - 1);
}

// 7. 最大子数组和
// solve(i) = max(nums[i], nums[i] + solve(i-1))
function maxSubArray(nums) {
    if (nums.length === 0) return 0;
    const memo = new Map();

    // 定义：以 i 结尾的最大子数组和
    function solve(i) {
        if (i === 0) return nums[0];

        if (memo.has(i)) return memo.get(i);

        // 只有当前面的累积和 > 0 时，才加上前面的，否则另起炉灶
        const prev = solve(i - 1);
        const result = Math.max(nums[i], nums[i] + prev);

        memo.set(i, result);
        return result;
    }

    // 同样需要外部遍历找最大值
    let globalMax = nums[0];
    for (let i = 0; i < nums.length; i++) {
        globalMax = Math.max(globalMax, solve(i));
    }
    return globalMax;
}

// 8. 不同路径
// solve(i, j) = solve(i-1, j) + solve(i, j-1)
function uniquePaths(m, n) {
    const memo = new Map();

    function solve(i, j) {
        if (i === 0 && j === 0) return 1;
        if (i < 0 || j < 0) return 0;

        const key = `${i}:${j}`;
        if (memo.has(key)) return memo.get(key);

        const result = solve(i - 1, j) + solve(i, j - 1);

        memo.set(key, result);
        return result;
    }

    return solve(m - 1, n - 1);
}

// 测试用例
function test() {
    console.log('--- Top-Down DP Tests (Explicit Memo) ---');
    console.log('斐波那契数列(10):', fibonacci(10)); // 55
    console.log('爬楼梯(5):', climbStairs(5)); // 8
    console.log('最长递增子序列:', lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4
    console.log('0-1背包:', knapsack([2, 3, 4, 5], [3, 4, 5, 6], 8)); // 10
    console.log('最长公共子序列:', longestCommonSubsequence('abcde', 'ace')); // 3
    console.log('编辑距离:', minDistance('horse', 'ros')); // 3
    console.log('最大子数组和:', maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
    console.log('不同路径(3,7):', uniquePaths(3, 7)); // 28
}

// Export functions directly
export {
    fibonacci,
    climbStairs,
    lengthOfLIS,
    knapsack,
    longestCommonSubsequence,
    minDistance,
    maxSubArray,
    uniquePaths,
    test
};
