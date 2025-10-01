/**
 * 买卖股票的最佳时机含手续费 (Best Time to Buy and Sell Stock with Transaction Fee)
 * 
 * 题目描述：
 * 给定一个整数数组 prices，其中 prices[i]表示第 i 天的股票价格 ；整数 fee 代表了交易股票的手续费用。
 * 你可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一只股票，在卖出它之前你就不能再继续购买股票了。
 * 返回获得利润的最大值。
 * 
 * 注意：这里的一笔交易指买入持有并卖出股票的整个过程，每笔交易你只需要为此支付一次手续费。
 * 
 * 示例：
 * 输入：prices = [1, 3, 2, 8, 4, 9], fee = 2
 * 输出：8
 * 解释：能够达到的最大利润:  
 * 在此处买入 prices[0] = 1
 * 在此处卖出 prices[3] = 8
 * 在此处买入 prices[4] = 4
 * 在此处卖出 prices[5] = 9
 * 总利润: ((8 - 1) - 2) + ((9 - 4) - 2) = 8
 */

// 方法1：动态规划 - 两种状态
export function maxProfitWithFee(prices, fee) {
    if (prices.length <= 1) return 0;
    
    // hold: 持有股票的最大利润
    // sold: 不持有股票的最大利润
    let hold = -prices[0]; // 第一天买入
    let sold = 0;          // 第一天不持有
    
    for (let i = 1; i < prices.length; i++) {
        // 持有股票：之前就持有 或 今天买入
        const newHold = Math.max(hold, sold - prices[i]);
        // 不持有股票：之前就不持有 或 今天卖出（需要支付手续费）
        const newSold = Math.max(sold, hold + prices[i] - fee);
        
        hold = newHold;
        sold = newSold;
    }
    
    return sold; // 最后应该不持有股票
}

// 方法2：动态规划 - 二维数组
export function maxProfitWithFeeDP(prices, fee) {
    if (prices.length <= 1) return 0;
    
    const n = prices.length;
    // dp[i][0]: 第i天不持有股票的最大利润
    // dp[i][1]: 第i天持有股票的最大利润
    const dp = Array(n).fill(null).map(() => [0, 0]);
    
    dp[0][0] = 0;           // 第一天不持有
    dp[0][1] = -prices[0];  // 第一天买入
    
    for (let i = 1; i < n; i++) {
        // 不持有股票：之前就不持有 或 今天卖出（扣除手续费）
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][1] + prices[i] - fee);
        // 持有股票：之前就持有 或 今天买入
        dp[i][1] = Math.max(dp[i-1][1], dp[i-1][0] - prices[i]);
    }
    
    return dp[n-1][0];
}

// 方法3：贪心算法思路
export function maxProfitWithFeeGreedy(prices, fee) {
    if (prices.length <= 1) return 0;
    
    let maxProfit = 0;
    let minPrice = prices[0]; // 当前持有股票的成本价
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            // 发现更低的价格，更新买入价格
            minPrice = prices[i];
        } else if (prices[i] > minPrice + fee) {
            // 当前价格减去手续费后仍有利润，卖出
            maxProfit += prices[i] - minPrice - fee;
            // 更新买入价格为当前价格减去手续费（相当于重新买入的成本）
            minPrice = prices[i] - fee;
        }
    }
    
    return maxProfit;
}

// 方法4：状态机 - 考虑买入和卖出时机
export function maxProfitWithFeeStateMachine(prices, fee) {
    if (prices.length <= 1) return 0;
    
    let buy = -prices[0];   // 买入状态
    let sell = 0;           // 卖出状态
    
    for (let i = 1; i < prices.length; i++) {
        // 买入状态：保持买入 或 今天买入
        buy = Math.max(buy, sell - prices[i]);
        // 卖出状态：保持卖出 或 今天卖出（扣除手续费）
        sell = Math.max(sell, buy + prices[i] - fee);
    }
    
    return sell;
}

// 测试用例
const testCases = [
    { prices: [1, 3, 2, 8, 4, 9], fee: 2, expected: 8 },
    { prices: [1, 3, 7, 5, 10, 3], fee: 3, expected: 6 },
    { prices: [1, 4, 6, 2, 8, 3, 10, 14], fee: 3, expected: 13 },
    { prices: [1, 2], fee: 1, expected: 0 },
    { prices: [1, 2], fee: 2, expected: 0 },
    { prices: [2, 1], fee: 1, expected: 0 },
    { prices: [1], fee: 1, expected: 0 },
    { prices: [], fee: 1, expected: 0 }
];

console.log('=== 买卖股票的最佳时机含手续费测试 ===');
testCases.forEach((testCase, index) => {
    const { prices, fee, expected } = testCase;
    const result1 = maxProfitWithFee(prices, fee);
    const result2 = maxProfitWithFeeDP(prices, fee);
    const result3 = maxProfitWithFeeGreedy(prices, fee);
    const result4 = maxProfitWithFeeStateMachine(prices, fee);
    
    console.log(`测试用例 ${index + 1}:`);
    console.log(`prices=[${prices.join(',')}], fee=${fee}`);
    console.log(`期望输出: ${expected}`);
    console.log(`状态DP: ${result1}`);
    console.log(`二维DP: ${result2}`);
    console.log(`贪心算法: ${result3}`);
    console.log(`状态机: ${result4}`);
    console.log(`结果正确: ${result1 === expected && result2 === expected && result3 === expected && result4 === expected}`);
    console.log('---');
});
