/**
 * 买卖股票的最佳时机 I (Best Time to Buy and Sell Stock)
 * 
 * 题目描述：
 * 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
 * 你只能选择 某一天 买入这只股票，并选择在 未来的某一天 卖出该股票。
 * 设计一个算法来计算你所能获取的最大利润。
 * 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0。
 * 
 * 限制：只能进行一次交易（一次买入和一次卖出）
 * 
 * 示例：
 * 输入：prices = [7,1,5,3,6,4]
 * 输出：5
 * 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5
 */

// 方法1：贪心算法 - 一次遍历
export function maxProfit1(prices) {
    if (prices.length <= 1) return 0;
    
    let minPrice = prices[0];  // 记录到目前为止的最低价格
    let maxProfit = 0;         // 记录最大利润
    
    for (let i = 1; i < prices.length; i++) {
        // 如果当前价格更低，更新最低价格
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else {
            // 否则计算如果今天卖出的利润，并更新最大利润
            maxProfit = Math.max(maxProfit, prices[i] - minPrice);
        }
    }
    
    return maxProfit;
}

// 方法2：动态规划思路
export function maxProfit1DP(prices) {
    if (prices.length <= 1) return 0;
    
    // dp[i][0] 表示第i天不持有股票的最大利润
    // dp[i][1] 表示第i天持有股票的最大利润
    let hold = -prices[0];    // 持有股票（买入）
    let notHold = 0;          // 不持有股票
    
    for (let i = 1; i < prices.length; i++) {
        // 今天不持有股票：要么昨天就不持有，要么今天卖出
        const newNotHold = Math.max(notHold, hold + prices[i]);
        // 今天持有股票：要么昨天就持有，要么今天买入（只能买入一次）
        const newHold = Math.max(hold, -prices[i]);
        
        notHold = newNotHold;
        hold = newHold;
    }
    
    return notHold; // 最后一天不持有股票的利润最大
}

// 方法3：暴力解法（用于对比）
export function maxProfit1Brute(prices) {
    let maxProfit = 0;
    
    for (let i = 0; i < prices.length - 1; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            const profit = prices[j] - prices[i];
            maxProfit = Math.max(maxProfit, profit);
        }
    }
    
    return maxProfit;
}

// 测试用例
const testCases = [
    [7,1,5,3,6,4],  // 期望输出: 5
    [7,6,4,3,1],    // 期望输出: 0
    [1,2,3,4,5],    // 期望输出: 4
    [2,4,1],        // 期望输出: 2
    [1],            // 期望输出: 0
    []              // 期望输出: 0
];

console.log('=== 买卖股票的最佳时机 I 测试 ===');
testCases.forEach((prices, index) => {
    const result1 = maxProfit1(prices);
    const result2 = maxProfit1DP(prices);
    const result3 = maxProfit1Brute(prices);
    
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: [${prices.join(',')}]`);
    console.log(`贪心算法: ${result1}`);
    console.log(`动态规划: ${result2}`);
    console.log(`暴力解法: ${result3}`);
    console.log(`结果一致: ${result1 === result2 && result2 === result3}`);
    console.log('---');
});