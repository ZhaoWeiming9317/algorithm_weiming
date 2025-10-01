/**
 * 买卖股票的最佳时机 IV (Best Time to Buy and Sell Stock IV)
 * 
 * 题目描述：
 * 给定一个整数数组 prices ，它的第 i 个元素 prices[i] 是一支给定的股票在第 i 天的价格。
 * 设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。
 * 
 * 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
 * 
 * 限制：最多完成k次交易
 * 
 * 示例：
 * 输入：k = 2, prices = [2,4,1]
 * 输出：2
 * 解释：在第 1 天 (股票价格 = 2) 的时候买入，在第 2 天 (股票价格 = 4) 的时候卖出，这笔交易所能获得利润 = 4-2 = 2
 */

// 方法1：动态规划 - 通用解法
export function maxProfit4(k, prices) {
    if (prices.length <= 1 || k === 0) return 0;
    
    const n = prices.length;
    
    // 如果k >= n/2，相当于可以进行无限次交易（股票II的情况）
    if (k >= Math.floor(n / 2)) {
        return maxProfitUnlimited(prices);
    }
    
    // dp[i][j][0] 表示第i天，完成了j次交易，不持有股票的最大利润
    // dp[i][j][1] 表示第i天，完成了j次交易，持有股票的最大利润
    const dp = Array(n).fill(null).map(() => 
        Array(k + 1).fill(null).map(() => [0, 0])
    );
    
    // 初始化第一天
    for (let j = 0; j <= k; j++) {
        dp[0][j][0] = 0;
        dp[0][j][1] = -prices[0];
    }
    
    for (let i = 1; i < n; i++) {
        for (let j = 1; j <= k; j++) {
            // 不持有股票：保持不持有 或 今天卖出
            dp[i][j][0] = Math.max(dp[i-1][j][0], dp[i-1][j][1] + prices[i]);
            // 持有股票：保持持有 或 今天买入（买入时交易次数+1）
            dp[i][j][1] = Math.max(dp[i-1][j][1], dp[i-1][j-1][0] - prices[i]);
        }
    }
    
    return dp[n-1][k][0];
}

// 辅助函数：无限次交易的情况
function maxProfitUnlimited(prices) {
    let maxProfit = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            maxProfit += prices[i] - prices[i - 1];
        }
    }
    return maxProfit;
}

// 方法2：空间优化版本
export function maxProfit4Optimized(k, prices) {
    if (prices.length <= 1 || k === 0) return 0;
    
    const n = prices.length;
    
    if (k >= Math.floor(n / 2)) {
        return maxProfitUnlimited(prices);
    }
    
    // 只需要记录每次交易的买入和卖出状态
    const buy = new Array(k + 1).fill(-prices[0]);
    const sell = new Array(k + 1).fill(0);
    
    for (let i = 1; i < n; i++) {
        for (let j = k; j >= 1; j--) {
            // 第j次卖出：保持之前状态 或 今天卖出第j次
            sell[j] = Math.max(sell[j], buy[j] + prices[i]);
            // 第j次买入：保持之前状态 或 今天买入第j次
            buy[j] = Math.max(buy[j], sell[j-1] - prices[i]);
        }
    }
    
    return sell[k];
}

// 方法3：状态压缩 - 滚动数组
export function maxProfit4RollingArray(k, prices) {
    if (prices.length <= 1 || k === 0) return 0;
    
    const n = prices.length;
    
    if (k >= Math.floor(n / 2)) {
        return maxProfitUnlimited(prices);
    }
    
    // 使用滚动数组优化空间
    let prev = Array(k + 1).fill(null).map(() => [0, 0]);
    let curr = Array(k + 1).fill(null).map(() => [0, 0]);
    
    // 初始化第一天
    for (let j = 0; j <= k; j++) {
        prev[j][0] = 0;
        prev[j][1] = -prices[0];
    }
    
    for (let i = 1; i < n; i++) {
        for (let j = 1; j <= k; j++) {
            curr[j][0] = Math.max(prev[j][0], prev[j][1] + prices[i]);
            curr[j][1] = Math.max(prev[j][1], prev[j-1][0] - prices[i]);
        }
        
        // 交换数组
        [prev, curr] = [curr, prev];
    }
    
    return prev[k][0];
}

// 测试用例
const testCases = [
    { k: 2, prices: [2,4,1], expected: 2 },
    { k: 2, prices: [3,2,6,5,0,3], expected: 7 },
    { k: 1, prices: [1,2,3,4,5], expected: 4 },
    { k: 2, prices: [1,2,3,4,5], expected: 4 },
    { k: 3, prices: [1,2,3,4,5], expected: 4 },
    { k: 2, prices: [7,6,4,3,1], expected: 0 },
    { k: 0, prices: [1,2,3,4,5], expected: 0 },
    { k: 2, prices: [1], expected: 0 },
    { k: 2, prices: [], expected: 0 }
];

console.log('=== 买卖股票的最佳时机 IV 测试 ===');
testCases.forEach((testCase, index) => {
    const { k, prices, expected } = testCase;
    const result1 = maxProfit4(k, prices);
    const result2 = maxProfit4Optimized(k, prices);
    const result3 = maxProfit4RollingArray(k, prices);
    
    console.log(`测试用例 ${index + 1}:`);
    console.log(`k=${k}, prices=[${prices.join(',')}]`);
    console.log(`期望输出: ${expected}`);
    console.log(`三维DP: ${result1}`);
    console.log(`空间优化: ${result2}`);
    console.log(`滚动数组: ${result3}`);
    console.log(`结果正确: ${result1 === expected && result2 === expected && result3 === expected}`);
    console.log('---');
});
