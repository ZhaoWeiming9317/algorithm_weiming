# 贪心算法 (Greedy Algorithm)

## 1. 什么是贪心算法

贪心算法是一种在每一步选择中都采取在当前状态下最好或最优（即最有利）的选择，从而希望导致结果是最好或最优的算法。

## 2. 贪心算法的特点

### 核心特征
1. **贪心选择性质**：每一步都做出在当前看来最好的选择
2. **最优子结构**：问题的最优解包含子问题的最优解
3. **无后效性**：一旦做出选择，就不会再改变

### 解题思路
1. **建立数学模型**：将问题抽象为数学模型
2. **选择贪心策略**：确定每一步的贪心选择
3. **证明贪心选择**：证明贪心选择能导致全局最优解
4. **实现算法**：根据贪心策略实现算法

## 3. 经典问题

### 3.1 活动选择问题
```javascript
// 问题：选择最多的不重叠活动
// 策略：按结束时间排序，选择结束时间最早的活动

function activitySelection(activities) {
    // 按结束时间排序
    activities.sort((a, b) => a.end - b.end);
    
    const selected = [activities[0]];
    let lastEndTime = activities[0].end;
    
    for (let i = 1; i < activities.length; i++) {
        if (activities[i].start >= lastEndTime) {
            selected.push(activities[i]);
            lastEndTime = activities[i].end;
        }
    }
    
    return selected;
}
```

### 3.2 找零钱问题
```javascript
// 问题：用最少的硬币找零
// 策略：优先使用面值大的硬币

function coinChange(coins, amount) {
    coins.sort((a, b) => b - a); // 降序排列
    const result = [];
    
    for (const coin of coins) {
        while (amount >= coin) {
            result.push(coin);
            amount -= coin;
        }
    }
    
    return amount === 0 ? result : null;
}
```

### 3.3 区间调度问题
```javascript
// 问题：移除最少的区间使剩余区间不重叠
// 策略：按结束时间排序，移除重叠的区间

function eraseOverlapIntervals(intervals) {
    if (intervals.length === 0) return 0;
    
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 0;
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < end) {
            count++; // 移除重叠区间
        } else {
            end = intervals[i][1];
        }
    }
    
    return count;
}
```

## 4. 贪心 vs 动态规划

### 贪心算法
- **特点**：每步都做局部最优选择
- **适用**：问题具有贪心选择性质
- **复杂度**：通常较低
- **缺点**：不保证全局最优

### 动态规划
- **特点**：考虑所有可能的选择
- **适用**：问题具有最优子结构
- **复杂度**：通常较高
- **优点**：保证全局最优

## 5. 何时使用贪心算法

### 适用场景
1. **最优化问题**：求最大值、最小值
2. **调度问题**：任务调度、资源分配
3. **图论问题**：最小生成树、最短路径
4. **排序问题**：区间调度、任务安排

### 判断标准
1. **贪心选择性质**：局部最优能导致全局最优
2. **最优子结构**：问题可以分解为子问题
3. **无后效性**：当前选择不影响后续选择

### 经典题型
- 活动选择问题
- 找零钱问题
- 区间调度问题
- 最小生成树（Kruskal、Prim）
- 最短路径（Dijkstra）
- 任务调度问题

## 6. 贪心算法的局限性

### 不适用的情况
1. **需要全局信息**：当前选择需要知道后续所有信息
2. **有后效性**：当前选择会影响后续选择
3. **无贪心选择性质**：局部最优不能导致全局最优

### 典型反例
```javascript
// 找零钱问题：硬币面值为 [1, 3, 4]，找零6
// 贪心策略：[4, 1, 1] = 3个硬币
// 最优解：[3, 3] = 2个硬币
// 贪心策略失效！
```

## 7. 解题模板

```javascript
function greedySolution() {
    // 1. 排序（如果需要）
    data.sort(comparator);
    
    // 2. 贪心选择
    const result = [];
    for (const item of data) {
        if (isValidChoice(item)) {
            result.push(item);
            updateState(item);
        }
    }
    
    return result;
}
```
