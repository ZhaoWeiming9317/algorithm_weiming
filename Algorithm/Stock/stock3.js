/**
 * 买卖股票的最佳时机 III (Best Time to Buy and Sell Stock III)
 * 
 * 题目描述：
 * 给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。
 * 设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔 交易。
 * 
 * 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
 * 
 * 限制：最多完成2次交易
 * 
 * 示例：
 * 输入：prices = [3,3,5,0,0,3,1,4]
 * 输出：6
 * 解释：在第 4 天（股票价格 = 0）的时候买入，在第 6 天（股票价格 = 3）的时候卖出，这笔交易所能获得利润 = 3-0 = 3
 *      随后，在第 7 天（股票价格 = 1）的时候买入，在第 8 天（股票价格 = 4）的时候卖出，这笔交易所能获得利润 = 4-1 = 3
 */

// 方法1：动态规划 - 状态机
export function maxProfit3(prices) {
    if (prices.length <= 1) return 0;
    
    // 四个状态：
    // buy1: 第一次买入后的最大利润
    // sell1: 第一次卖出后的最大利润
    // buy2: 第二次买入后的最大利润
    // sell2: 第二次卖出后的最大利润
    let buy1 = -prices[0];
    let sell1 = 0;
    let buy2 = -prices[0];
    let sell2 = 0;
    
    for (let i = 1; i < prices.length; i++) {
        // 第二次卖出：保持之前状态 或 今天卖出第二次
        sell2 = Math.max(sell2, buy2 + prices[i]);
        // 第二次买入：保持之前状态 或 今天买入第二次
        buy2 = Math.max(buy2, sell1 - prices[i]);
        // 第一次卖出：保持之前状态 或 今天卖出第一次
        sell1 = Math.max(sell1, buy1 + prices[i]);
        // 第一次买入：保持之前状态 或 今天买入第一次
        buy1 = Math.max(buy1, -prices[i]);
    }
    
    return sell2; // 最终状态应该是完成所有交易
}

// 方法2：动态规划 - 二维数组
export function maxProfit3DP(prices) {
    if (prices.length <= 1) return 0;
    
    const n = prices.length;
    const k = 2; // 最多2次交易
    
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

// 方法3：分治法 - 将数组分为两部分
export function maxProfit3Divide(prices) {
    if (prices.length <= 1) return 0;
    
    const n = prices.length;
    
    // leftProfits[i] 表示在 [0, i] 区间内进行一次交易的最大利润
    const leftProfits = new Array(n).fill(0);
    let minPrice = prices[0];
    
    for (let i = 1; i < n; i++) {
        minPrice = Math.min(minPrice, prices[i]);
        leftProfits[i] = Math.max(leftProfits[i-1], prices[i] - minPrice);
    }
    
    // rightProfits[i] 表示在 [i, n-1] 区间内进行一次交易的最大利润
    const rightProfits = new Array(n).fill(0);
    let maxPrice = prices[n-1];
    
    for (let i = n - 2; i >= 0; i--) {
        maxPrice = Math.max(maxPrice, prices[i]);
        rightProfits[i] = Math.max(rightProfits[i+1], maxPrice - prices[i]);
    }
    
    // 找到最佳分割点
    let maxProfit = 0;
    for (let i = 0; i < n; i++) {
        maxProfit = Math.max(maxProfit, leftProfits[i] + rightProfits[i]);
    }
    
    return maxProfit;
}

// 测试用例
const testCases = [
    [3,3,5,0,0,3,1,4],  // 期望输出: 6
    [1,2,3,4,5],        // 期望输出: 4
    [7,6,4,3,1],        // 期望输出: 0
    [1,2,4,2,5,7,2,4,9,0], // 期望输出: 13
    [2,1,2,0,1],        // 期望输出: 2
    [1],                // 期望输出: 0
    []                  // 期望输出: 0
];

console.log('=== 买卖股票的最佳时机 III 测试 ===');
testCases.forEach((prices, index) => {
    const result1 = maxProfit3(prices);
    const result2 = maxProfit3DP(prices);
    const result3 = maxProfit3Divide(prices);
    
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: [${prices.join(',')}]`);
    console.log(`状态机DP: ${result1}`);
    console.log(`二维DP: ${result2}`);
    console.log(`分治法: ${result3}`);
    console.log(`结果一致: ${result1 === result2 && result2 === result3}`);
    console.log('---');
});
