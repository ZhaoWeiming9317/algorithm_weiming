/**
 * 动态规划经典问题实现
 */

// 1. 斐波那契数列
function fibonacci(n) {
    if (n <= 1) return n;

    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;

    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

// 2. 爬楼梯
function climbStairs(n) {
    if (n <= 2) return n;

    const dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;

    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

// 3. 最长递增子序列
function lengthOfLIS(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(1);

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    return Math.max(...dp);
}

// 4. 0-1背包问题
function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    return dp[n][capacity];
}

// 5. 最长公共子序列
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[m][n];
}

// 6. 编辑距离
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // 初始化
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,     // 删除
                    dp[i][j - 1] + 1,     // 插入
                    dp[i - 1][j - 1] + 1    // 替换
                );
            }
        }
    }

    return dp[m][n];
}

// 7. 最大子数组和
function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];

    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }

    return maxSoFar;
}

// 8. 不同路径
function uniquePaths(m, n) {
    const dp = Array(m).fill().map(() => Array(n).fill(1));

    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    return dp[m - 1][n - 1];
}

// 测试用例
function test() {
    console.log('斐波那契数列:', fibonacci(10));
    console.log('爬楼梯:', climbStairs(5));
    console.log('最长递增子序列:', lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));
    console.log('0-1背包:', knapsack([2, 3, 4, 5], [3, 4, 5, 6], 8));
    console.log('最长公共子序列:', longestCommonSubsequence('abcde', 'ace'));
    console.log('编辑距离:', minDistance('horse', 'ros'));
    console.log('最大子数组和:', maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
    console.log('不同路径:', uniquePaths(3, 7));
}

// test();
module.exports = {
    fibonacci,
    climbStairs,
    lengthOfLIS,
    knapsack,
    longestCommonSubsequence,
    minDistance,
    maxSubArray,
    uniquePaths
};
