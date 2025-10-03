# 动态规划 (Dynamic Programming)

## 1. 什么是动态规划

动态规划是一种通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。动态规划常常适用于有重叠子问题和最优子结构性质的问题。

## 2. 动态规划的特点

### 核心特征
1. **最优子结构**：问题的最优解包含子问题的最优解
2. **重叠子问题**：递归过程中会重复计算相同的子问题
3. **无后效性**：当前状态只依赖于之前的状态，不依赖于如何到达当前状态

### 解题思路
1. **状态定义**：dp[i] 表示什么
2. **状态转移**：dp[i] 如何从 dp[i-1] 或其他状态得到
3. **初始状态**：dp[0] 或边界条件
4. **计算顺序**：确保计算 dp[i] 时，依赖的状态已经计算过

## 3. 经典问题

### 3.1 斐波那契数列
```javascript
// 问题：求第n个斐波那契数
// 状态：dp[i] 表示第i个斐波那契数
// 转移：dp[i] = dp[i-1] + dp[i-2]

function fibonacci(n) {
    if (n <= 1) return n;
    
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}
```

### 3.2 爬楼梯
```javascript
// 问题：每次可以爬1或2个台阶，有多少种方法爬到第n阶
// 状态：dp[i] 表示爬到第i阶的方法数
// 转移：dp[i] = dp[i-1] + dp[i-2]

function climbStairs(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}
```

### 3.3 最长递增子序列
```javascript
// 问题：找到数组中最长递增子序列的长度
// 状态：dp[i] 表示以第i个元素结尾的最长递增子序列长度
// 转移：dp[i] = max(dp[j] + 1) for all j < i and nums[j] < nums[i]

function lengthOfLIS(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    
    return Math.max(...dp);
}
```

### 3.4 0-1背包问题
```javascript
// 问题：在容量为W的背包中装入价值最大的物品
// 状态：dp[i][w] 表示前i个物品在容量w下的最大价值
// 转移：dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])

function knapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
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
    
    return dp[n][capacity];
}
```

## 4. 动态规划 vs 递归

### 递归（自顶向下）
```javascript
// 递归实现斐波那契
function fibonacciRecursive(n) {
    if (n <= 1) return n;
    return fibonacciRecursive(n-1) + fibonacciRecursive(n-2);
}
// 问题：重复计算，时间复杂度O(2^n)
```

### 动态规划（自底向上）
```javascript
// DP实现斐波那契
function fibonacciDP(n) {
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
// 优势：每个子问题只计算一次，时间复杂度O(n)
```

## 5. 何时使用动态规划

### 适用场景
1. **最优化问题**：求最大值、最小值、最优解
2. **计数问题**：求方案数、路径数
3. **可行性问题**：判断是否存在某种方案

### 判断标准
1. **最优子结构**：问题可以分解为子问题
2. **重叠子问题**：子问题会被重复计算
3. **状态转移**：当前状态可以从之前的状态推导

### 经典题型
- 路径问题（不同路径、最小路径和）
- 序列问题（最长递增子序列、编辑距离）
- 背包问题（0-1背包、完全背包）
- 区间问题（矩阵链乘法、石子合并）
- 树形DP（二叉树最大路径和）

## 6. 解题模板

```javascript
function dpSolution() {
    // 1. 定义状态
    const dp = new Array(n).fill(0);
    
    // 2. 初始化状态
    dp[0] = initialValue;
    
    // 3. 状态转移
    for (let i = 1; i < n; i++) {
        dp[i] = calculateFromPrevious(dp, i);
    }
    
    // 4. 返回结果
    return dp[n-1];
}
```
