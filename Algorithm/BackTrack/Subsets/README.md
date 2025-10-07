# 子集问题 (Subsets)

## 概述

子集问题是回溯算法的经典应用，也称为幂集问题。给定一个集合，求出它的所有子集（包括空集和自身）。

## 核心特点

- **包含空集**：空集是任何集合的子集
- **包含自身**：集合本身也是自己的子集
- **幂集性质**：n个元素的集合有2^n个子集
- **顺序无关**：子集内部元素顺序不重要

## 基本思路

对于每个元素，我们有两种选择：
1. **包含**该元素到当前子集中
2. **不包含**该元素

## 回溯决策树详解

### 以 [1, 2, 3] 为例的完整决策树

```
                        []                           ← 根节点（空集）
                    /   |   \
                   /    |    \
                  1     2     3                      ← 第1层：单个元素
               /  |    |                             
              /   |    |                             
            1,2  1,3   2,3                           ← 第2层：两个元素
            /                                        
           /                                         
         1,2,3                                       ← 第3层：三个元素
```

### 回溯树的层级遍历形式（更清晰）

```
输入: nums = [1, 2, 3]

                          []                         start=0, path=[]
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
       [1]               [2]               [3]      start=1,2,3
        ↓                 ↓
    ┌───┴───┐         ┌───┴───┐
    ↓       ↓         ↓       ↓
  [1,2]   [1,3]     [2,3]                            start=2,3
    ↓
  [1,2,3]                                            start=4 (结束)
```

### 详细的递归过程（回溯树展开）

```
输入: [1, 2, 3]

                                []                                    ← 记录 []
                    ┌───────────┼───────────┐
                    ↓           ↓           ↓
        选1 →      [1]         [2]         [3]                       ← 记录 [1], [2], [3]
              ┌─────┼─────┐     ┼──┐
              ↓     ↓     ↓     ↓  ↓
    选2 →   [1,2] [1,3]       [2,3]                                 ← 记录 [1,2], [1,3], [2,3]
            ↓
  选3 →   [1,2,3]                                                   ← 记录 [1,2,3]

最终结果: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

### 为什么有些节点有值，有些没有？

**关键理解**：在子集问题中，**每个节点都是一个有效的子集**！

```javascript
function subsets(nums) {
    const result = [];
    const path = [];
    
    function backtrack(start) {
        // ⭐ 关键：这里每次都记录当前路径
        // 所以每个节点（包括中间节点）都会被记录
        result.push([...path]);  // 每个节点都有值！
        
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);      // 做选择
            backtrack(i + 1);        // 递归
            path.pop();              // 撤销选择
        }
    }
    
    backtrack(0);
    return result;
}
```

### 对比：排列问题（只有叶子节点有值）

```javascript
// 排列问题：只在叶子节点记录结果
function permute(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        // ⭐ 只有到达叶子节点（path长度等于nums长度）才记录
        if (path.length === nums.length) {
            result.push([...path]);  // 只有叶子节点有值！
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            path.push(nums[i]);
            used[i] = true;
            backtrack();
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}
```

### 排列树 vs 子集树对比

#### 排列树 [1,2,3]：只有叶子节点是结果

```
                    []                    ← 不记录（中间节点）
          ┌─────────┼─────────┐
          ↓         ↓         ↓
         [1]       [2]       [3]          ← 不记录（中间节点）
        ┌─┴─┐     ┌─┴─┐     ┌─┴─┐
        ↓   ↓     ↓   ↓     ↓   ↓
      [1,2][1,3][2,1][2,3][3,1][3,2]     ← 不记录（中间节点）
        ↓   ↓     ↓   ↓     ↓   ↓
     [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]  ← ✅ 记录（叶子节点）

结果: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

#### 子集树 [1,2,3]：每个节点都是结果

```
                    []                    ← ✅ 记录
          ┌─────────┼─────────┐
          ↓         ↓         ↓
         [1]       [2]       [3]          ← ✅ 记录
        ┌─┴─┐       ↓
        ↓   ↓      [2,3]                 ← ✅ 记录
      [1,2][1,3]
        ↓
     [1,2,3]                              ← ✅ 记录

结果: [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]
```

### 核心区别总结

| 特性 | 子集问题 | 排列/组合问题 |
|------|----------|--------------|
| 记录时机 | **每个节点** | **叶子节点** |
| 判断条件 | 无（进入就记录）| `path.length === n` |
| 树的特点 | 每层递减 | 每层固定 |
| 结果数量 | 2^n | n! 或 C(n,k) |

### 代码对比

```javascript
// 子集：每个节点都记录
function subsets(nums) {
    const result = [];
    function backtrack(start, path) {
        result.push([...path]);  // ← 进入就记录，无条件
        for (let i = start; i < nums.length; i++) {
            backtrack(i + 1, [...path, nums[i]]);
        }
    }
    backtrack(0, []);
    return result;
}

// 排列：只有叶子节点记录
function permute(nums) {
    const result = [];
    function backtrack(path, used) {
        if (path.length === nums.length) {  // ← 有条件判断
            result.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            backtrack([...path, nums[i]], {...used, [i]: true});
        }
    }
    backtrack([], {});
    return result;
}

// 组合：只有满足长度的记录
function combine(n, k) {
    const result = [];
    function backtrack(start, path) {
        if (path.length === k) {  // ← 有条件判断
            result.push([...path]);
            return;
        }
        for (let i = start; i <= n; i++) {
            backtrack(i + 1, [...path, i]);
        }
    }
    backtrack(1, []);
    return result;
}
```

## 解法对比

### 1. 回溯法
```javascript
function subsets(nums) {
    const result = [];
    const path = [];
    
    function backtrack(start) {
        // 每个节点都是一个有效子集
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1);
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
}
```

### 2. 迭代法
```javascript
function subsetsIterative(nums) {
    const result = [[]]; // 从空集开始
    
    for (let num of nums) {
        const newSubsets = [];
        for (let subset of result) {
            newSubsets.push([...subset, num]);
        }
        result.push(...newSubsets);
    }
    
    return result;
}
```

### 3. 位运算法
```javascript
function subsetsBitMask(nums) {
    const result = [];
    const n = nums.length;
    
    // 遍历从0到2^n-1的所有数字
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }
        result.push(subset);
    }
    
    return result;
}
```

## 去重策略

对于包含重复元素的子集问题：

```javascript
function subsetsWithDup(nums) {
    nums.sort((a, b) => a - b); // 先排序
    const result = [];
    const path = [];
    
    function backtrack(start) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            // 跳过同一层级的重复元素
            if (i > start && nums[i] === nums[i - 1]) {
                continue;
            }
            
            path.push(nums[i]);
            backtrack(i + 1);
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
}
```

## 问题列表

### 1. 子集 (Subsets)
- **难度**：中等
- **特点**：基础子集问题，无重复元素

### 2. 子集 II (Subsets II)
- **难度**：中等
- **特点**：包含重复元素，需要去重

### 3. 递增子序列 (Increasing Subsequences)
- **难度**：中等
- **特点**：有序约束的子集问题

### 4. 最大长度连续子序列
- **难度**：中等
- **特点**：无重复字符约束的子集

## 时间复杂度分析

| 方法 | 时间复杂度 | 空间复杂度 | 特点 |
|------|------------|------------|------|
| 回溯法 | O(2^n × n) | O(n) | 递归实现，易理解 |
| 迭代法 | O(2^n × n) | O(2^n × n) | 迭代实现，空间较大 |
| 位运算法 | O(2^n × n) | O(1) | 最省空间，但不易扩展 |

## 应用场景

1. **特征选择**：机器学习中选择特征子集
2. **商品推荐**：推荐商品的不同组合
3. **测试用例**：生成所有可能的测试场景
4. **配置管理**：系统配置的所有可能组合

## 与组合的关系

子集问题可以看作是所有长度的组合问题的合集：
- 长度为0的组合：空集
- 长度为1的组合：所有单元素子集
- 长度为2的组合：所有双元素子集
- ...
- 长度为n的组合：原集合本身

## 优化技巧

### 1. 提前终止
```javascript
// 对于有特殊约束的子集问题，可以提前终止
if (不满足约束条件) {
    return; // 剪枝
}
```

### 2. 去重优化
```javascript
// 使用Set在当前层去重，避免重复计算
const used = new Set();
for (let i = start; i < nums.length; i++) {
    if (used.has(nums[i])) continue;
    used.add(nums[i]);
    // ... 递归处理
}
```

### 3. 位运算优化
对于小规模问题（n ≤ 20），位运算法是最高效的。

## 扩展问题

1. **子集和问题**：找到和为特定值的子集
2. **最大子集**：在满足某些约束下找最大子集
3. **子集计数**：统计满足条件的子集数量

掌握子集问题的多种解法，有助于理解回溯算法的本质和位运算的应用！
