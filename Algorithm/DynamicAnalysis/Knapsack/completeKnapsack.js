/**
 * 完全背包问题 (Unbounded Knapsack Problem)
 * 
 * 题目描述：
 * 给定n个物品，每个物品有重量weight和价值value。
 * 现有一个容量为capacity的背包，问如何选择物品放入背包，使得总价值最大？
 * 每个物品可以使用无限次。
 * 
 * 示例：
 * 输入：weights = [2,3,4,5], values = [3,4,5,6], capacity = 8
 * 输出：12
 * 解释：选择重量为2的物品3次，总重量为6，总价值为9
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i][w] 表示前i个物品，容量为w时的最大价值
 *    - 状态转移：
 *      - 不选第i个物品：dp[i][w] = dp[i-1][w]
 *      - 选k个第i个物品：dp[i][w] = max(dp[i-1][w - k*weight[i]] + k*value[i])
 *    - 初始状态：dp[0][w] = 0, dp[i][0] = 0
 * 
 * 2. 空间优化
 *    - 使用一维数组
 *    - 正序遍历容量（与0-1背包的区别）
 */

// 方法1：二维动态规划
function completeKnapsack(weights, values, capacity) {
    const n = weights.length;
    // dp[i][w] 表示前i个物品，容量为w时的最大价值
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    // 遍历每个物品
    for (let i = 1; i <= n; i++) {
        // 遍历每个容量
        for (let w = 1; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                // 可以选择第i个物品
                dp[i][w] = Math.max(
                    dp[i-1][w],  // 不选
                    dp[i][w - weights[i-1]] + values[i-1]  // 选（注意这里是dp[i]而不是dp[i-1]）
                );
            } else {
                // 不能选择第i个物品
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    return dp[n][capacity];
}

// 方法2：空间优化版本
function completeKnapsackOptimized(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        // 正序遍历容量（与0-1背包不同）
        for (let w = weights[i]; w <= capacity; w++) {
            dp[w] = Math.max(
                dp[w],
                dp[w - weights[i]] + values[i]
            );
        }
    }
    
    return dp[capacity];
}

// 方法3：返回选择的物品
function completeKnapsackWithItems(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    // 记录选择
    const count = Array(n).fill(0);
    
    // 计算dp表
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(
                    dp[i-1][w],
                    dp[i][w - weights[i-1]] + values[i-1]
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    // 回溯找出选择的物品
    let i = n, w = capacity;
    while (i > 0 && w > 0) {
        while (dp[i][w] === dp[i][w - weights[i-1]] + values[i-1] && w >= weights[i-1]) {
            count[i-1]++;
            w -= weights[i-1];
        }
        i--;
    }
    
    return {
        maxValue: dp[n][capacity],
        itemCounts: count
    };
}

// 方法4：多重背包问题（每个物品有特定的数量限制）
function multipleKnapsack(weights, values, counts, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        // 二进制优化
        let num = counts[i];
        let k = 1;
        while (k <= num) {
            // 按照2的幂次拆分物品
            for (let w = capacity; w >= k * weights[i]; w--) {
                dp[w] = Math.max(
                    dp[w],
                    dp[w - k * weights[i]] + k * values[i]
                );
            }
            num -= k;
            k *= 2;
        }
        if (num > 0) {
            // 处理剩余数量
            for (let w = capacity; w >= num * weights[i]; w--) {
                dp[w] = Math.max(
                    dp[w],
                    dp[w - num * weights[i]] + num * values[i]
                );
            }
        }
    }
    
    return dp[capacity];
}

// 测试
function test() {
    // 测试用例1：基本场景
    const weights1 = [2, 3, 4, 5];
    const values1 = [3, 4, 5, 6];
    const capacity1 = 8;
    
    console.log("测试用例1 - 基本场景：");
    console.log("二维DP:", completeKnapsack(weights1, values1, capacity1));
    console.log("空间优化:", completeKnapsackOptimized(weights1, values1, capacity1));
    console.log("选择的物品:", completeKnapsackWithItems(weights1, values1, capacity1));
    
    // 测试用例2：单一最优物品
    const weights2 = [2, 3, 4];
    const values2 = [3, 4, 5];
    const capacity2 = 10;
    
    console.log("\n测试用例2 - 单一最优物品：");
    console.log("二维DP:", completeKnapsack(weights2, values2, capacity2));
    console.log("空间优化:", completeKnapsackOptimized(weights2, values2, capacity2));
    console.log("选择的物品:", completeKnapsackWithItems(weights2, values2, capacity2));
    
    // 测试用例3：多重背包
    const weights3 = [2, 3, 4];
    const values3 = [3, 4, 5];
    const counts3 = [4, 2, 3];
    const capacity3 = 10;
    
    console.log("\n测试用例3 - 多重背包：");
    console.log("多重背包:", multipleKnapsack(weights3, values3, counts3, capacity3));
}

module.exports = {
    completeKnapsack,
    completeKnapsackOptimized,
    completeKnapsackWithItems,
    multipleKnapsack
};
