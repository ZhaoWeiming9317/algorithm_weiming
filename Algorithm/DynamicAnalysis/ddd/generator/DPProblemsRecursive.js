/**
 * 动态规划经典问题实现 - Top-Down (递归 + 记忆化) 版
 * 
 * 核心思想：
 * 动态规划 (DP) 有两种等价流派：
 * 1. Bottom-Up (自底向上/填表)：从 dp[0] 循环推导到 dp[n]。
 * 2. Top-Down (自顶向下/记忆化搜索)：从 solve(n) 递归求解，配合 Memo (备忘录)。
 * 
 * 本文件采用 **Top-Down** 风格，核心在于 "Recursion + Memoization"。
 * 只要加上 Memo，递归就拥有了多项式级的时间复杂度，不会栈溢出 (在合理深度下)。
 */

/**
 * 记忆化递归通用包装器 (Helper)
 * 将 memo 的 check/set 逻辑封装起来，让核心算法只关注业务逻辑。
 * 
 * @param {Function} algorithm - 核心算法，形式为 (recurse, ...args) => result
 * @returns {Function} - 封装后的入口函数
 */
function withMemo(algorithm, keyFn) {
    const cache = new Map();
    const wrapper = (...args) => {
        const key = keyFn ? keyFn(...args) : args.join(',');
        if (cache.has(key)) return cache.get(key);

        const result = algorithm(wrapper, ...args);

        cache.set(key, result);
        return result;
    };
    return wrapper;
}

// 1. 斐波那契数列
// solve(n) = solve(n-1) + solve(n-2)
function fibonacci(n) {
    return withMemo(
        (solve, i) => {
            if (i <= 1) return i;
            return solve(i - 1) + solve(i - 2);
        },
        (i) => i // State: [i]
    )(n);
}

// 2. 爬楼梯
// solve(n) = solve(n-1) + solve(n-2)
function climbStairs(n) {
    return withMemo(
        (solve, i) => {
            if (i <= 2) return i;
            return solve(i - 1) + solve(i - 2);
        },
        (i) => i // State: [i]
    )(n);
}

// 3. 最长递增子序列
// LIS 的递归定义: 以 index 结尾的 LIS 长度
// solve(i) = max(solve(j) + 1) for all j < i if nums[j] < nums[i]
function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;

    // 注意：这里需要一个外部循环来求全局最大值，因为 LIS 可能以任意位置结尾
    const solve = withMemo(
        (recurse, i) => {
            let maxLen = 1;
            for (let j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    maxLen = Math.max(maxLen, recurse(j) + 1);
                }
            }
            return maxLen;
        },
        (i) => i // State: [Current Index]
    );

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

    return withMemo(
        (solve, i, w) => {
            if (i < 0 || w <= 0) return 0;

            const valueIfSkip = solve(i - 1, w);
            let valueIfTake = -1;

            if (weights[i] <= w) {
                valueIfTake = solve(i - 1, w - weights[i]) + values[i];
            }

            return Math.max(valueIfSkip, valueIfTake);
        },
        (i, w) => `${i}:${w}` // State: [Item Index, Remaining Capacity]
    )(n - 1, capacity);
}

// 5. 最长公共子序列
// solve(i, j) = match ? 1+solve(i-1, j-1) : max(solve(i-1, j), solve(i, j-1))
function longestCommonSubsequence(text1, text2) {
    return withMemo(
        (solve, i, j) => {
            if (i < 0 || j < 0) return 0;

            if (text1[i] === text2[j]) {
                return 1 + solve(i - 1, j - 1);
            } else {
                return Math.max(
                    solve(i - 1, j),
                    solve(i, j - 1)
                );
            }
        },
        (i, j) => `${i}:${j}` // State: [Index 1, Index 2]
    )(text1.length - 1, text2.length - 1);
}

// 6. 编辑距离
// solve(i, j) = match ? solve(i-1, j-1) : 1 + min(insert, delete, replace)
function minDistance(word1, word2) {
    return withMemo(
        (solve, i, j) => {
            if (i < 0) return j + 1; // Insert remaining
            if (j < 0) return i + 1; // Delete remaining

            if (word1[i] === word2[j]) {
                return solve(i - 1, j - 1);
            } else {
                return 1 + Math.min(
                    solve(i - 1, j),    // Delete
                    solve(i, j - 1),    // Insert
                    solve(i - 1, j - 1) // Replace
                );
            }
        },
        (i, j) => `${i}:${j}` // State: [I, J]
    )(word1.length - 1, word2.length - 1);
}

// 7. 最大子数组和
// Kadane's Algorithm 本质也是 DP
// solve(i) = max(nums[i], nums[i] + solve(i-1))
function maxSubArray(nums) {
    if (nums.length === 0) return 0;

    const solve = withMemo(
        (recurse, i) => {
            if (i === 0) return nums[0];
            // 只有当前面的累积和 > 0 时，才加上前面的，否则另起炉灶
            const prev = recurse(i - 1);
            return Math.max(nums[i], nums[i] + prev);
        },
        (i) => i // State: [i]
    );

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
    return withMemo(
        (solve, i, j) => {
            if (i === 0 && j === 0) return 1;
            if (i < 0 || j < 0) return 0;

            return solve(i - 1, j) + solve(i, j - 1);
        },
        (i, j) => `${i}:${j}` // State: [Row, Col]
    )(m - 1, n - 1);
}

// 测试用例
function test() {
    console.log('--- Top-Down DP Tests ---');
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
    uniquePaths
};
