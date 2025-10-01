# 股票买卖问题全解析

## 概述

股票买卖问题是动态规划的经典应用，通过不同的约束条件形成了一系列相关题目。这类问题的核心是在给定的价格序列中，通过买卖股票获得最大利润。

## 问题分类

### 1. 按交易次数分类
- **一次交易**：买卖股票的最佳时机 I
- **无限次交易**：买卖股票的最佳时机 II
- **最多k次交易**：买卖股票的最佳时机 III (k=2) 和 IV (任意k)

### 2. 按约束条件分类
- **无额外约束**：基础的买卖股票问题
- **冷冻期约束**：卖出后需要冷冻一天
- **手续费约束**：每次交易需要支付手续费

## 核心思想

### 状态定义
对于股票问题，通常定义以下状态：
- `hold[i]` 或 `buy[i]`：第i天持有股票的最大利润
- `sold[i]` 或 `sell[i]`：第i天不持有股票的最大利润

### 状态转移
```javascript
// 基本转移方程
hold[i] = Math.max(hold[i-1], sold[i-1] - prices[i]); // 保持持有 或 今天买入
sold[i] = Math.max(sold[i-1], hold[i-1] + prices[i]); // 保持不持有 或 今天卖出
```

## 详细题目解析

### 1. 买卖股票的最佳时机 I
**限制**：只能进行一次交易

**特点**：
- 最简单的股票问题
- 可以用贪心算法：记录最低价格，计算每天卖出的最大利润
- 时间复杂度：O(n)，空间复杂度：O(1)

**核心思路**：
```javascript
let minPrice = prices[0];
let maxProfit = 0;
for (let i = 1; i < prices.length; i++) {
    minPrice = Math.min(minPrice, prices[i]);
    maxProfit = Math.max(maxProfit, prices[i] - minPrice);
}
```

### 2. 买卖股票的最佳时机 II
**限制**：可以进行无限次交易，但不能同时持有多只股票

**特点**：
- 贪心策略：只要第二天价格比今天高就交易
- 等价于累加所有上涨区间的利润
- 时间复杂度：O(n)，空间复杂度：O(1)

**核心思路**：
```javascript
let maxProfit = 0;
for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i-1]) {
        maxProfit += prices[i] - prices[i-1];
    }
}
```

### 3. 买卖股票的最佳时机 III
**限制**：最多进行2次交易

**特点**：
- 需要跟踪4个状态：第一次买入、第一次卖出、第二次买入、第二次卖出
- 可以用分治法：将数组分为两部分，每部分最多一次交易
- 时间复杂度：O(n)，空间复杂度：O(1)

**核心思路**：
```javascript
let buy1 = -prices[0], sell1 = 0;
let buy2 = -prices[0], sell2 = 0;
for (let i = 1; i < prices.length; i++) {
    sell2 = Math.max(sell2, buy2 + prices[i]);
    buy2 = Math.max(buy2, sell1 - prices[i]);
    sell1 = Math.max(sell1, buy1 + prices[i]);
    buy1 = Math.max(buy1, -prices[i]);
}
```

### 4. 买卖股票的最佳时机 IV
**限制**：最多进行k次交易

**特点**：
- 当k >= n/2时，等价于无限次交易
- 使用三维DP：`dp[i][j][0/1]` 表示第i天完成j次交易时的最大利润
- 时间复杂度：O(nk)，空间复杂度：O(nk)

**优化**：
- 空间优化：只需要记录每次交易的买入和卖出状态
- 滚动数组：进一步优化空间复杂度

### 5. 买卖股票的最佳时机含冷冻期
**限制**：卖出股票后，无法在第二天买入股票（冷冻期为1天）

**特点**：
- 需要跟踪3个状态：持有、卖出（冷冻期）、休息
- 买入只能从休息状态转移而来
- 时间复杂度：O(n)，空间复杂度：O(1)

**状态转移**：
```javascript
hold = Math.max(hold, rest - prices[i]);  // 从休息状态买入
sold = hold + prices[i];                  // 卖出进入冷冻期
rest = Math.max(rest, sold);              // 从冷冻期恢复
```

### 6. 买卖股票的最佳时机含手续费
**限制**：每次交易需要支付手续费

**特点**：
- 在卖出时扣除手续费
- 可以用贪心算法：只有利润大于手续费时才交易
- 时间复杂度：O(n)，空间复杂度：O(1)

**核心思路**：
```javascript
hold = Math.max(hold, sold - prices[i]);      // 买入
sold = Math.max(sold, hold + prices[i] - fee); // 卖出扣费
```

## 解题模板

### 通用DP模板
```javascript
function maxProfit(prices, constraints) {
    if (prices.length <= 1) return 0;
    
    // 定义状态
    let hold = -prices[0];  // 持有股票
    let sold = 0;           // 不持有股票
    
    for (let i = 1; i < prices.length; i++) {
        const newHold = Math.max(hold, /* 买入条件 */);
        const newSold = Math.max(sold, /* 卖出条件 */);
        
        hold = newHold;
        sold = newSold;
    }
    
    return sold; // 最终不持有股票
}
```

### 多次交易模板
```javascript
function maxProfitKTransactions(prices, k) {
    if (k >= Math.floor(prices.length / 2)) {
        // 无限次交易
        return maxProfitUnlimited(prices);
    }
    
    const buy = new Array(k + 1).fill(-prices[0]);
    const sell = new Array(k + 1).fill(0);
    
    for (let i = 1; i < prices.length; i++) {
        for (let j = k; j >= 1; j--) {
            sell[j] = Math.max(sell[j], buy[j] + prices[i]);
            buy[j] = Math.max(buy[j], sell[j-1] - prices[i]);
        }
    }
    
    return sell[k];
}
```

## 时间空间复杂度总结

| 问题 | 时间复杂度 | 空间复杂度 | 主要算法 |
|------|------------|------------|----------|
| 股票 I | O(n) | O(1) | 贪心算法 |
| 股票 II | O(n) | O(1) | 贪心算法 |
| 股票 III | O(n) | O(1) | 状态机DP |
| 股票 IV | O(nk) | O(k) | 动态规划 |
| 含冷冻期 | O(n) | O(1) | 状态机DP |
| 含手续费 | O(n) | O(1) | 状态机DP |

## 解题技巧

### 1. 状态设计
- **明确状态含义**：持有/不持有股票，完成的交易次数
- **考虑约束条件**：冷冻期、手续费、交易次数限制
- **状态数量最小化**：避免冗余状态

### 2. 转移方程
- **买入条件**：从哪个状态可以买入
- **卖出条件**：卖出时需要考虑的约束
- **边界处理**：第一天的初始状态

### 3. 优化策略
- **空间优化**：使用滚动变量代替数组
- **特殊情况**：k过大时转为无限次交易
- **贪心优化**：某些问题可以用贪心算法简化

## 实战建议

### 解题步骤
1. **理解约束**：明确交易次数、冷冻期、手续费等限制
2. **设计状态**：根据约束设计最少的状态
3. **推导转移**：写出状态转移方程
4. **处理边界**：初始化第一天的状态
5. **优化空间**：用变量代替数组（如果可能）

### 常见陷阱
- **交易定义**：一次完整交易包括买入和卖出
- **状态初始化**：第一天买入股票的利润是负数
- **最终状态**：通常最后一天应该不持有股票
- **约束处理**：冷冻期和手续费的正确处理

## 扩展问题

1. **多只股票**：同时考虑多只股票的买卖
2. **股票预测**：结合机器学习预测股票价格
3. **实际约束**：考虑印花税、佣金等实际交易成本
4. **风险控制**：加入止损、止盈等风险控制机制

通过掌握这些股票买卖问题的解法，可以很好地理解动态规划在实际问题中的应用，同时这些技巧也可以扩展到其他类似的优化问题中。
