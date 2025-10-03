/**
 * 0-1背包问题 (0/1 Knapsack Problem)
 * 
 * 题目描述：
 * 给定n个物品，每个物品有重量weight和价值value。
 * 现有一个容量为capacity的背包，问如何选择物品放入背包，使得总价值最大？
 * 每个物品只能使用一次（0-1）。
 * 
 * 示例：
 * 输入：weights = [2,3,4,5], values = [3,4,5,6], capacity = 8
 * 输出：10
 * 解释：选择重量为2和3的物品，价值分别为3和4，总重量为5，总价值为7
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i][w] 表示前i个物品，容量为w时的最大价值
 *    - 状态转移：
 *      - 不选第i个物品：dp[i][w] = dp[i-1][w]
 *      - 选第i个物品：dp[i][w] = dp[i-1][w-weight[i]] + value[i]
 *    - 初始状态：dp[0][w] = 0, dp[i][0] = 0
 * 
 * 2. 空间优化
 *    - 使用一维数组
 *    - 逆序遍历容量，避免覆盖需要的值
 */

// 方法1：二维动态规划
function knapsack(weights, values, capacity) {
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
                    dp[i-1][w - weights[i-1]] + values[i-1]  // 选
                );
            } else {
                // 不能选择第i个物品
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    // 返回最大价值
    return dp[n][capacity];
}

// 方法2：空间优化版本
function knapsackOptimized(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        // 必须逆序遍历容量
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(
                dp[w],
                dp[w - weights[i]] + values[i]
            );
        }
    }
    
    return dp[capacity];
}

// 方法3：返回选择的物品
function knapsackWithItems(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    // 计算dp表
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i-1] <= w) {
                dp[i][w] = Math.max(
                    dp[i-1][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]
                );
            } else {
                dp[i][w] = dp[i-1][w];
            }
        }
    }
    
    // 回溯找出选择的物品
    const selected = [];
    let i = n, w = capacity;
    
    while (i > 0 && w > 0) {
        if (dp[i][w] !== dp[i-1][w]) {
            selected.unshift(i-1);  // 物品索引从0开始
            w -= weights[i-1];
        }
        i--;
    }
    
    return {
        maxValue: dp[n][capacity],
        selected
    };
}

// 方法4：处理物品有数量限制的情况
function boundedKnapsack(weights, values, counts, capacity) {
    const n = weights.length;
    const dp = Array(capacity + 1).fill(0);
    
    for (let i = 0; i < n; i++) {
        // 对每个物品，考虑其可用的数量
        for (let k = 1; k <= counts[i]; k++) {
            // 逆序遍历容量
            for (let w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(
                    dp[w],
                    dp[w - weights[i]] + values[i]
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
    console.log("二维DP:", knapsack(weights1, values1, capacity1));
    console.log("空间优化:", knapsackOptimized(weights1, values1, capacity1));
    console.log("选择的物品:", knapsackWithItems(weights1, values1, capacity1));
    
    // 测试用例2：容量刚好
    const weights2 = [1, 2, 3];
    const values2 = [6, 10, 12];
    const capacity2 = 5;
    
    console.log("\n测试用例2 - 容量刚好：");
    console.log("二维DP:", knapsack(weights2, values2, capacity2));
    console.log("空间优化:", knapsackOptimized(weights2, values2, capacity2));
    console.log("选择的物品:", knapsackWithItems(weights2, values2, capacity2));
    
    // 测试用例3：有数量限制
    const weights3 = [2, 3, 4];
    const values3 = [3, 4, 5];
    const counts3 = [2, 1, 3];
    const capacity3 = 10;
    
    console.log("\n测试用例3 - 有数量限制：");
    console.log("有限制的背包:", boundedKnapsack(weights3, values3, counts3, capacity3));
}

module.exports = {
    knapsack,
    knapsackOptimized,
    knapsackWithItems,
    boundedKnapsack
};
