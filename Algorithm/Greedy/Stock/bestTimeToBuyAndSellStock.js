/**
 * 买卖股票的最佳时机 (Best Time to Buy and Sell Stock)
 * 
 * 题目描述：
 * 给定一个数组 prices，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
 * 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。
 * 设计一个算法来计算你所能获取的最大利润。
 * 
 * 示例1：
 * 输入：prices = [7,1,5,3,6,4]
 * 输出：5
 * 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5。
 * 
 * 示例2：
 * 输入：prices = [7,6,4,3,1]
 * 输出：0
 * 解释：在这种情况下, 没有交易完成, 所以最大利润为 0。
 * 
 * 解题思路：
 * 1. 贪心策略
 *    - 记录遍历过程中的最低价格
 *    - 计算当前价格与最低价格的差值，更新最大利润
 * 
 * 2. 动态规划
 *    - 状态定义：dp[i] 表示前i天的最大利润
 *    - 状态转移：dp[i] = max(dp[i-1], prices[i] - minPrice)
 *    - 初始状态：dp[0] = 0
 */

// 方法1：贪心算法
function maxProfit(prices) {
    if (!prices || prices.length < 2) return 0;
    
    let minPrice = prices[0];
    let maxProfit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        // 更新最低价格
        minPrice = Math.min(minPrice, prices[i]);
        // 更新最大利润
        maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
    
    return maxProfit;
}

// 方法2：动态规划
function maxProfitDP(prices) {
    if (!prices || prices.length < 2) return 0;
    
    const n = prices.length;
    const dp = Array(n).fill(0);
    let minPrice = prices[0];
    
    for (let i = 1; i < n; i++) {
        minPrice = Math.min(minPrice, prices[i]);
        dp[i] = Math.max(dp[i-1], prices[i] - minPrice);
    }
    
    return dp[n-1];
}

// 方法3：返回买入卖出的具体日期
function getBestDays(prices) {
    if (!prices || prices.length < 2) {
        return {
            maxProfit: 0,
            buyDay: -1,
            sellDay: -1
        };
    }
    
    let minPrice = prices[0];
    let maxProfit = 0;
    let minDay = 0;
    let bestBuyDay = -1;
    let bestSellDay = -1;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            minDay = i;
        } else {
            const currentProfit = prices[i] - minPrice;
            if (currentProfit > maxProfit) {
                maxProfit = currentProfit;
                bestBuyDay = minDay;
                bestSellDay = i;
            }
        }
    }
    
    return {
        maxProfit,
        buyDay: bestBuyDay,
        sellDay: bestSellDay
    };
}

// 方法4：允许多次交易（不限次数）
function maxProfitMultiple(prices) {
    if (!prices || prices.length < 2) return 0;
    
    let totalProfit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        // 只要今天价格比昨天高，就可以赚取差价
        if (prices[i] > prices[i-1]) {
            totalProfit += prices[i] - prices[i-1];
        }
    }
    
    return totalProfit;
}

// 方法5：最多允许两次交易
function maxProfitTwoTransactions(prices) {
    if (!prices || prices.length < 2) return 0;
    
    const n = prices.length;
    // dp[i][k][0/1] 表示第i天，最多进行k次交易，0表示不持有股票，1表示持有股票
    const dp = Array(n).fill().map(() => 
        Array(3).fill().map(() => Array(2).fill(0))
    );
    
    // 初始化第一天
    for (let k = 0; k <= 2; k++) {
        dp[0][k][0] = 0;
        dp[0][k][1] = -prices[0];
    }
    
    // 遍历每一天
    for (let i = 1; i < n; i++) {
        for (let k = 1; k <= 2; k++) {
            // 不持有股票：前一天不持有 或 前一天持有今天卖出
            dp[i][k][0] = Math.max(dp[i-1][k][0], dp[i-1][k][1] + prices[i]);
            // 持有股票：前一天持有 或 前一天不持有今天买入
            dp[i][k][1] = Math.max(dp[i-1][k][1], dp[i-1][k-1][0] - prices[i]);
        }
    }
    
    return dp[n-1][2][0];
}

// 方法6：带冷却期的交易（卖出后要等一天才能买入）
function maxProfitWithCooldown(prices) {
    if (!prices || prices.length < 2) return 0;
    
    const n = prices.length;
    // dp[i][0]: 持有股票的最大利润
    // dp[i][1]: 不持有股票，且处于冷却期的最大利润
    // dp[i][2]: 不持有股票，且不处于冷却期的最大利润
    const dp = Array(n).fill().map(() => Array(3).fill(0));
    
    dp[0][0] = -prices[0];
    
    for (let i = 1; i < n; i++) {
        // 持有股票：前一天持有 或 前一天不持有且不在冷却期今天买入
        dp[i][0] = Math.max(dp[i-1][0], dp[i-1][2] - prices[i]);
        // 不持有股票，冷却期：前一天持有今天卖出
        dp[i][1] = dp[i-1][0] + prices[i];
        // 不持有股票，非冷却期：前一天不持有（可能在冷却期也可能不在）
        dp[i][2] = Math.max(dp[i-1][1], dp[i-1][2]);
    }
    
    return Math.max(dp[n-1][1], dp[n-1][2]);
}

// 测试
function test() {
    // 测试用例1：基本场景
    const prices1 = [7,1,5,3,6,4];
    console.log("测试用例1 - 基本场景：");
    console.log("贪心算法:", maxProfit(prices1));
    console.log("动态规划:", maxProfitDP(prices1));
    console.log("最佳交易日:", getBestDays(prices1));
    
    // 测试用例2：持续下跌
    const prices2 = [7,6,4,3,1];
    console.log("\n测试用例2 - 持续下跌：");
    console.log("贪心算法:", maxProfit(prices2));
    console.log("最佳交易日:", getBestDays(prices2));
    
    // 测试用例3：多次交易
    const prices3 = [7,1,5,3,6,4,8];
    console.log("\n测试用例3 - 多次交易：");
    console.log("不限次数交易:", maxProfitMultiple(prices3));
    console.log("最多两次交易:", maxProfitTwoTransactions(prices3));
    
    // 测试用例4：带冷却期
    const prices4 = [1,2,3,0,2];
    console.log("\n测试用例4 - 带冷却期：");
    console.log("带冷却期交易:", maxProfitWithCooldown(prices4));
}

module.exports = {
    maxProfit,
    maxProfitDP,
    getBestDays,
    maxProfitMultiple,
    maxProfitTwoTransactions,
    maxProfitWithCooldown
};
