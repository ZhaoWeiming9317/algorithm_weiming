# 组合问题 (Combinations)

## 概述

组合问题是回溯算法的重要应用领域。组合是指从n个不同元素中取出m个元素的所有可能方式，与排列不同的是，组合不考虑元素的顺序。

## 核心特点

- **顺序无关**：[1,2,3] 和 [3,2,1] 是同一个组合
- **元素不重复使用**：每个元素在一个组合中只能出现一次（除非题目特别说明）
- **避免重复**：通过控制选择顺序避免生成重复组合

## 基本思路

1. **有序选择**：按照一定顺序选择元素，避免重复
2. **递归构建**：逐步构建组合
3. **剪枝优化**：提前终止不可能的分支

## 模板代码

```javascript
function combine(n, k) {
    const result = [];
    const path = [];
    
    function backtrack(start) {
        // 终止条件
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        // 剪枝：剩余数字不够凑成k个数
        if (n - start + 1 < k - path.length) {
            return;
        }
        
        // 从start开始选择，避免重复
        for (let i = start; i <= n; i++) {
            path.push(i);
            backtrack(i + 1); // 下一层从i+1开始
            path.pop();
        }
    }
    
    backtrack(1);
    return result;
}
```

## 常见变种

### 1. 基础组合
- 从1到n中选择k个数的组合

### 2. 组合总和系列
- **组合总和 I**：元素可重复使用，找到和为target的组合
- **组合总和 II**：元素不可重复使用，数组中有重复元素
- **组合总和 III**：只使用1-9的数字，找k个数和为n

### 3. 特殊组合
- **电话号码字母组合**：多对多映射的组合问题

## 去重策略

对于包含重复元素的组合问题：

```javascript
// 先排序
candidates.sort((a, b) => a - b);

// 在同一层级跳过重复元素
if (i > start && candidates[i] === candidates[i - 1]) {
    continue;
}
```

## 剪枝优化

### 1. 数量剪枝
```javascript
// 剩余元素不够时提前返回
if (n - start + 1 < k - path.length) {
    return;
}
```

### 2. 数值剪枝
```javascript
// 当前和已经超过目标值时提前返回
if (sum > target) {
    return;
}

// 排序后，如果当前元素已经超过目标值，后续更大的元素也不用考虑
if (sum + candidates[i] > target) {
    break;
}
```

## 问题列表

### 1. 组合 (Combinations)
- **难度**：中等
- **特点**：基础组合问题

### 2. 组合总和 (Combination Sum)
- **难度**：中等
- **特点**：元素可重复使用

### 3. 组合总和 II (Combination Sum II)
- **难度**：中等
- **特点**：元素不可重复，需要去重

### 4. 组合总和 III (Combination Sum III)
- **难度**：中等
- **特点**：限制数字范围和个数

### 5. 电话号码的字母组合 (Letter Combinations of a Phone Number)
- **难度**：中等
- **特点**：多对多映射组合

## 时间复杂度

- **基础组合**：O(C(n,k) × k) - C(n,k)种组合，每种需要O(k)时间复制
- **组合总和**：O(2^n × target) - 最坏情况下的指数级复杂度
- **空间复杂度**：O(target) - 递归栈深度

## 应用场景

1. **资源分配**：从有限资源中选择最优组合
2. **投资组合**：选择股票或基金的组合
3. **菜单搭配**：餐厅菜品的组合推荐
4. **团队组建**：从候选人中选择团队成员

## 与排列的区别

| 特性 | 排列 | 组合 |
|------|------|------|
| 顺序 | 重要 | 不重要 |
| 数量 | P(n,k) = n!/(n-k)! | C(n,k) = n!/[k!(n-k)!] |
| 实现 | 需要used数组 | 使用start参数 |

掌握组合问题的各种变种，能够帮助解决大量实际应用问题！
