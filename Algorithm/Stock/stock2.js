/**
 * 买卖股票的最佳时机 II (Best Time to Buy and Sell Stock II)
 * 
 * 题目描述：
 * 给定一个数组 prices ，其中 prices[i] 是一支给定股票第 i 天的价格。
 * 设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。
 * 
 * 注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
 * 
 * 限制：可以进行多次交易，但不能同时持有多只股票
 * 
 * 示例：
 * 输入：prices = [7,1,5,3,6,4]
 * 输出：7
 * 解释：在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4
 *      随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3
 */

// 方法1：贪心算法 - 只要有利润就交易
export function maxProfit2(prices) {
    if (prices.length <= 1) return 0;
    
    let maxProfit = 0;
    
    // 只要第二天价格比今天高，就在今天买入明天卖出
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            maxProfit += prices[i] - prices[i - 1];
        }
    }
    
    return maxProfit;
}

// 方法2：动态规划
export function maxProfit2DP(prices) {
    if (prices.length <= 1) return 0;
    
    // dp[i][0] 表示第i天不持有股票的最大利润
    // dp[i][1] 表示第i天持有股票的最大利润
    let hold = -prices[0];    // 持有股票
    let notHold = 0;          // 不持有股票
    
    for (let i = 1; i < prices.length; i++) {
        // 今天不持有股票：要么昨天就不持有，要么今天卖出
        const newNotHold = Math.max(notHold, hold + prices[i]);
        // 今天持有股票：要么昨天就持有，要么今天买入
        const newHold = Math.max(hold, notHold - prices[i]);
        
        notHold = newNotHold;
        hold = newHold;
    }
    
    return notHold;
}

// 方法3：状态机思路
export function maxProfit2StateMachine(prices) {
    if (prices.length <= 1) return 0;
    
    let buy = -prices[0];   // 买入状态的最大利润
    let sell = 0;           // 卖出状态的最大利润
    
    for (let i = 1; i < prices.length; i++) {
        // 更新买入状态：保持之前的买入状态 或 今天买入
        const newBuy = Math.max(buy, sell - prices[i]);
        // 更新卖出状态：保持之前的卖出状态 或 今天卖出
        const newSell = Math.max(sell, buy + prices[i]);
        
        buy = newBuy;
        sell = newSell;
    }
    
    return sell; // 最终应该是卖出状态
}

// 方法4：找到所有上升区间
export function maxProfit2Intervals(prices) {
    if (prices.length <= 1) return 0;
    
    let maxProfit = 0;
    let i = 0;
    
    while (i < prices.length - 1) {
        // 找到局部最小值（买入点）
        while (i < prices.length - 1 && prices[i + 1] <= prices[i]) {
            i++;
        }
        
        if (i === prices.length - 1) break; // 已到末尾
        
        const buyPrice = prices[i++]; // 买入价格
        
        // 找到局部最大值（卖出点）
        while (i < prices.length - 1 && prices[i + 1] >= prices[i]) {
            i++;
        }
        
        const sellPrice = prices[i]; // 卖出价格
        maxProfit += sellPrice - buyPrice;
    }
    
    return maxProfit;
}

// 测试用例
const testCases = [
    [7,1,5,3,6,4],  // 期望输出: 7
    [1,2,3,4,5],    // 期望输出: 4
    [7,6,4,3,1],    // 期望输出: 0
    [1,2,1,2],      // 期望输出: 2
    [2,1,2,0,1],    // 期望输出: 2
    [1],            // 期望输出: 0
    []              // 期望输出: 0
];

console.log('=== 买卖股票的最佳时机 II 测试 ===');
testCases.forEach((prices, index) => {
    const result1 = maxProfit2(prices);
    const result2 = maxProfit2DP(prices);
    const result3 = maxProfit2StateMachine(prices);
    const result4 = maxProfit2Intervals(prices);
    
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: [${prices.join(',')}]`);
    console.log(`贪心算法: ${result1}`);
    console.log(`动态规划: ${result2}`);
    console.log(`状态机: ${result3}`);
    console.log(`区间法: ${result4}`);
    console.log(`结果一致: ${result1 === result2 && result2 === result3 && result3 === result4}`);
    console.log('---');
});
