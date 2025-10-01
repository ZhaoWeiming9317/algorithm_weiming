/**
 * 最佳买卖股票时机含冷冻期 (Best Time to Buy and Sell Stock with Cooldown)
 * 
 * 题目描述：
 * 给定一个整数数组prices，其中第 i 个元素代表了第 i 天的股票价格 。​
 * 设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）:
 * 卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。
 * 
 * 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
 * 
 * 示例：
 * 输入: prices = [1,2,3,0,2]
 * 输出: 3 
 * 解释: 对应的交易状态为: [买入, 卖出, 冷冻期, 买入, 卖出]
 */

// 方法1：动态规划 - 三种状态
export function maxProfitWithCooldown(prices) {
    if (prices.length <= 1) return 0;
    
    // 三种状态：
    // hold: 持有股票
    // sold: 刚卖出股票（进入冷冻期）
    // rest: 不持有股票且不在冷冻期
    let hold = -prices[0];  // 第一天买入
    let sold = 0;           // 第一天不可能卖出
    let rest = 0;           // 第一天休息
    
    for (let i = 1; i < prices.length; i++) {
        const prevHold = hold;
        const prevSold = sold;
        const prevRest = rest;
        
        // 持有股票：之前就持有 或 今天买入（只能从rest状态买入）
        hold = Math.max(prevHold, prevRest - prices[i]);
        // 卖出股票：今天卖出（从hold状态卖出）
        sold = prevHold + prices[i];
        // 休息状态：之前就在休息 或 冷冻期结束
        rest = Math.max(prevRest, prevSold);
    }
    
    // 最后一天应该不持有股票，在sold或rest状态
    return Math.max(sold, rest);
}

// 方法2：动态规划 - 二维数组
export function maxProfitWithCooldownDP(prices) {
    if (prices.length <= 1) return 0;
    
    const n = prices.length;
    // dp[i][0]: 第i天持有股票的最大利润
    // dp[i][1]: 第i天不持有股票且不在冷冻期的最大利润
    // dp[i][2]: 第i天不持有股票且在冷冻期的最大利润
    const dp = Array(n).fill(null).map(() => [0, 0, 0]);
    
    dp[0][0] = -prices[0]; // 第一天买入
    dp[0][1] = 0;          // 第一天不持有且不在冷冻期
    dp[0][2] = 0;          // 第一天不可能在冷冻期
    
    for (let i = 1; i < n; i++) {
        // 持有股票：之前就持有 或 今天买入（从不在冷冻期的状态买入）
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][1] - prices[i]);
        // 不持有且不在冷冻期：之前就不在冷冻期 或 冷冻期结束
        dp[i][1] = Math.max(dp[i-1][1], dp[i-1][2]);
        // 不持有且在冷冻期：今天卖出
        dp[i][2] = dp[i-1][0] + prices[i];
    }
    
    // 最后一天不应该持有股票
    return Math.max(dp[n-1][1], dp[n-1][2]);
}

// 方法3：状态机思路 - 更清晰的状态定义
export function maxProfitWithCooldownStateMachine(prices) {
    if (prices.length <= 1) return 0;
    
    // 四种状态：
    // buy: 买入状态（持有股票）
    // sell: 卖出状态（刚卖出，进入冷冻期）
    // cooldown: 冷冻期状态
    // hold: 持有现金状态（可以买入）
    
    let buy = -prices[0];
    let sell = 0;
    let cooldown = 0;
    let hold = 0;
    
    for (let i = 1; i < prices.length; i++) {
        const prevBuy = buy;
        const prevSell = sell;
        const prevCooldown = cooldown;
        const prevHold = hold;
        
        // 买入：从持有现金状态买入
        buy = Math.max(prevBuy, prevHold - prices[i]);
        // 卖出：从买入状态卖出
        sell = prevBuy + prices[i];
        // 冷冻期：从卖出状态进入
        cooldown = prevSell;
        // 持有现金：保持现金状态 或 从冷冻期恢复
        hold = Math.max(prevHold, prevCooldown);
    }
    
    return Math.max(sell, cooldown, hold);
}

// 测试用例
const testCases = [
    [1,2,3,0,2],    // 期望输出: 3
    [1],            // 期望输出: 0
    [1,2],          // 期望输出: 1
    [2,1],          // 期望输出: 0
    [1,2,4],        // 期望输出: 3
    [1,4,2],        // 期望输出: 3
    [2,1,4,5,2,9,7] // 期望输出: 11
];

console.log('=== 最佳买卖股票时机含冷冻期测试 ===');
testCases.forEach((prices, index) => {
    const result1 = maxProfitWithCooldown(prices);
    const result2 = maxProfitWithCooldownDP(prices);
    const result3 = maxProfitWithCooldownStateMachine(prices);
    
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: [${prices.join(',')}]`);
    console.log(`三状态DP: ${result1}`);
    console.log(`二维DP: ${result2}`);
    console.log(`状态机: ${result3}`);
    console.log(`结果一致: ${result1 === result2 && result2 === result3}`);
    console.log('---');
});
