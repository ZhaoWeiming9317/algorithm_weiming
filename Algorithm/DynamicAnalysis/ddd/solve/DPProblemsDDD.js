
import { solveDP1D, solveDP2D, solveDPStateCompressed } from '../DynamicProgramming.js';

/**
 * 1. 斐波那契数列 (Fibonacci)
 * 状态定义: dp[i] = dp[i-1] + dp[i-2]
 */
export function fibonacci(n) {
    if (n <= 1) return n;

    // 使用状态压缩优化
    return solveDPStateCompressed(
        [0, 1], // 初始状态 [prev2, prev1]
        n - 1,  // 需要迭代 n-1 次
        (state) => {
            const [prev2, prev1] = state;
            return [prev1, prev1 + prev2];
        }
    )[1];
}

/**
 * 2. 爬楼梯 (Climb Stairs)
 * 状态定义: dp[i] = dp[i-1] + dp[i-2]
 */
export function climbStairs(n) {
    if (n <= 2) return n;

    // 类似于斐波那契，使用状态压缩
    return solveDPStateCompressed(
        [1, 2], // 初始状态: dp[1]=1, dp[2]=2
        n - 2,  // 从第3阶开始计算
        (state) => {
            const [prev2, prev1] = state;
            return [prev1, prev1 + prev2];
        }
    )[1];
}

/**
 * 3. 最长递增子序列 (LIS)
 * 状态定义: dp[i] 表示以 nums[i] 结尾的最长递增子序列长度
 * 转移方程: dp[i] = max(dp[j]) + 1, where 0 <= j < i and nums[j] < nums[i]
 */
export function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;

    const dp = solveDP1D(nums.length, {
        transition: (i, table) => {
            let maxLen = 1;
            for (let j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    maxLen = Math.max(maxLen, table[j] + 1);
                }
            }
            return maxLen;
        }
    });

    return Math.max(...dp);
}

/**
 * 4. 0-1背包问题 (Knapsack)
 * 状态定义: dp[i][w] 表示前 i 个物品在容量为 w 时的最大价值
 */
export function knapsack(weights, values, capacity) {
    const n = weights.length;

    // 我们需要由 n 行，capacity+1 列
    // 注意：为了方便，这里使用滚动数组或者直接用 2D 数组
    // 这里演示使用标准 2D 数组，行数 n+1，列数 capacity+1
    const dp = solveDP2D(n + 1, capacity + 1, {
        init: (table) => {
            // 第一行和第一列默认为 0 (已经由 solveDP2D 初始化为 null，需要显式置 0)
            for (let i = 0; i <= n; i++) table[i][0] = 0;
            for (let w = 0; w <= capacity; w++) table[0][w] = 0;
        },
        transition: (i, w, table) => {
            // i 是物品索引 (1-based), w 是容量
            if (i === 0 || w === 0) return 0;

            const weight = weights[i - 1];
            const value = values[i - 1];

            if (weight <= w) {
                return Math.max(
                    table[i - 1][w],
                    table[i - 1][w - weight] + value
                );
            } else {
                return table[i - 1][w];
            }
        }
    });

    return dp[n][capacity];
}

/**
 * 5. 最长公共子序列 (LCS)
 * 状态定义: dp[i][j] 表示 text1[0...i-1] 和 text2[0...j-1] 的 LCS
 */
export function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;

    const dp = solveDP2D(m + 1, n + 1, {
        init: (table) => {
            for (let i = 0; i <= m; i++) table[i][0] = 0;
            for (let j = 0; j <= n; j++) table[0][j] = 0;
        },
        transition: (i, j, table) => {
            if (i === 0 || j === 0) return 0;

            if (text1[i - 1] === text2[j - 1]) {
                return table[i - 1][j - 1] + 1;
            } else {
                return Math.max(table[i - 1][j], table[i][j - 1]);
            }
        }
    });

    return dp[m][n];
}

/**
 * 6. 编辑距离 (Edit Distance)
 * 状态定义: dp[i][j] 表示 word1[0...i-1] 转换到 word2[0...j-1] 的最小操作数
 */
export function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;

    const dp = solveDP2D(m + 1, n + 1, {
        init: (table) => {
            for (let i = 0; i <= m; i++) table[i][0] = i;
            for (let j = 0; j <= n; j++) table[0][j] = j;
        },
        transition: (i, j, table) => {
            if (i === 0) return j; // 已经由 init 处理，但为了完整性
            if (j === 0) return i;

            if (word1[i - 1] === word2[j - 1]) {
                return table[i - 1][j - 1];
            } else {
                return Math.min(
                    table[i - 1][j] + 1,     // 删除
                    table[i][j - 1] + 1,     // 插入
                    table[i - 1][j - 1] + 1    // 替换
                );
            }
        }
    });

    return dp[m][n];
}

/**
 * 7. 最大子数组和 (Max SubArray)
 * 状态定义: dp[i] 表示以 nums[i] 结尾的最大子数组和
 * 优化: 只需要前一个状态，可以使用 Kadane 算法 (状态压缩)
 */
export function maxSubArray(nums) {
    if (nums.length === 0) return 0;

    let globalMax = nums[0];

    solveDPStateCompressed(
        nums[0], // 初始 maxEndingHere
        nums.length - 1, // 迭代次数
        (currentMaxEndingHere, i) => {
            // 注意: solveDPStateCompressed 的 i 是从 0 开始的迭代码，
            // 对应 nums 的索引应该是 i + 1
            const num = nums[i + 1];
            const nextMaxEndingHere = Math.max(num, currentMaxEndingHere + num);
            globalMax = Math.max(globalMax, nextMaxEndingHere);
            return nextMaxEndingHere;
        }
    );

    return globalMax;
}

/**
 * 8. 不同路径 (Unique Paths)
 * 状态定义: dp[i][j] 表示到达 (i, j) 的路径数
 */
export function uniquePaths(m, n) {
    const dp = solveDP2D(m, n, {
        init: (table) => {
            for (let i = 0; i < m; i++) table[i][0] = 1;
            for (let j = 0; j < n; j++) table[0][j] = 1;
        },
        transition: (i, j, table) => {
            if (i === 0 || j === 0) return 1;
            return table[i - 1][j] + table[i][j - 1];
        }
    });

    return dp[m - 1][n - 1];
}
