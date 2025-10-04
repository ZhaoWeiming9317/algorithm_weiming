# 路径搜索问题 (Path Search)

## 概述

路径搜索问题是回溯算法在图和网格上的重要应用。这类问题通常涉及在二维网格或图结构中寻找满足特定条件的路径或遍历方案。

## 核心特点

- **空间遍历**：在二维网格或图中进行搜索
- **路径约束**：需要满足特定的路径条件
- **状态标记**：避免重复访问同一位置
- **方向探索**：通常支持四个或八个方向的移动

## 基本框架

```javascript
function pathSearch(grid, start, target) {
    const directions = [[-1,0], [1,0], [0,-1], [0,1]]; // 四个方向
    const visited = Array(m).fill().map(() => Array(n).fill(false));
    
    function backtrack(row, col, path) {
        // 边界检查
        if (row < 0 || row >= m || col < 0 || col >= n) {
            return false;
        }
        
        // 访问检查
        if (visited[row][col]) {
            return false;
        }
        
        // 障碍检查
        if (grid[row][col] === obstacle) {
            return false;
        }
        
        // 终止条件
        if (reachTarget(row, col)) {
            return true;
        }
        
        // 标记访问
        visited[row][col] = true;
        path.push([row, col]);
        
        // 四个方向探索
        for (let [dx, dy] of directions) {
            if (backtrack(row + dx, col + dy, path)) {
                return true;
            }
        }
        
        // 回溯
        visited[row][col] = false;
        path.pop();
        
        return false;
    }
    
    return backtrack(start[0], start[1], []);
}
```

## 问题分类

### 1. 单词搜索 (Word Search)

**问题描述**：在字母网格中搜索给定单词，路径可以上下左右移动，但不能重复使用同一个格子。

**解题要点**：
- 从每个位置开始尝试
- 逐字符匹配
- 标记已访问位置

```javascript
function exist(board, word) {
    const m = board.length, n = board[0].length;
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    
    function backtrack(row, col, index) {
        if (index === word.length) return true;
        
        if (row < 0 || row >= m || col < 0 || col >= n || 
            board[row][col] !== word[index]) {
            return false;
        }
        
        const temp = board[row][col];
        board[row][col] = '#'; // 标记已访问
        
        for (let [dx, dy] of directions) {
            if (backtrack(row + dx, col + dy, index + 1)) {
                return true;
            }
        }
        
        board[row][col] = temp; // 恢复
        return false;
    }
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (backtrack(i, j, 0)) return true;
        }
    }
    
    return false;
}
```

### 2. 单词搜索 II (Word Search II)

**问题描述**：在网格中同时搜索多个单词。

**优化策略**：
- 使用Trie数据结构
- 一次遍历找到所有单词
- 避免重复搜索

```javascript
class TrieNode {
    constructor() {
        this.children = {};
        this.word = null;
    }
}

function findWords(board, words) {
    // 构建Trie
    const root = new TrieNode();
    for (let word of words) {
        let node = root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.word = word;
    }
    
    const result = [];
    const m = board.length, n = board[0].length;
    
    function backtrack(row, col, node) {
        if (row < 0 || row >= m || col < 0 || col >= n) return;
        
        const char = board[row][col];
        if (char === '#' || !node.children[char]) return;
        
        node = node.children[char];
        if (node.word) {
            result.push(node.word);
            node.word = null; // 避免重复
        }
        
        board[row][col] = '#';
        
        for (let [dx, dy] of [[-1,0], [1,0], [0,-1], [0,1]]) {
            backtrack(row + dx, col + dy, node);
        }
        
        board[row][col] = char;
    }
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            backtrack(i, j, root);
        }
    }
    
    return result;
}
```

### 3. 机器人运动范围

**问题描述**：机器人从(0,0)开始移动，不能进入行坐标和列坐标数位之和大于k的格子。

**解题要点**：
- 计算坐标数位和
- 从起点开始DFS
- 统计可达格子数

### 4. 黄金矿工

**问题描述**：在网格中寻找能收集最多黄金的路径，每个格子只能访问一次。

**解题要点**：
- 从每个有黄金的格子开始
- 尝试所有可能路径
- 记录最大黄金数

### 5. 不同路径 III

**问题描述**：从起点到终点，必须经过所有空格子。

**解题要点**：
- 统计空格子数量
- 确保路径经过所有空格
- 到达终点时检查是否遍历完所有空格

## 优化策略

### 1. 剪枝优化

```javascript
// 提前终止不可能的路径
if (remainingSteps > maxPossibleSteps) {
    return; // 剪枝
}

// 距离剪枝
if (manhattanDistance(current, target) > remainingSteps) {
    return; // 不可能到达
}
```

### 2. 状态压缩

```javascript
// 使用位运算表示访问状态
let visited = 0;

// 标记位置(i,j)已访问
visited |= (1 << (i * n + j));

// 检查位置(i,j)是否已访问
if (visited & (1 << (i * n + j))) {
    return; // 已访问
}
```

### 3. 记忆化搜索

```javascript
const memo = new Map();

function dfs(row, col, state) {
    const key = `${row},${col},${state}`;
    if (memo.has(key)) {
        return memo.get(key);
    }
    
    const result = backtrack(row, col, state);
    memo.set(key, result);
    return result;
}
```

## 问题列表

### 1. 单词搜索 (Word Search)
- **难度**：中等
- **特点**：基础路径搜索问题

### 2. 单词搜索 II (Word Search II)
- **难度**：困难
- **特点**：多目标搜索，Trie优化

### 3. 机器人的运动范围
- **难度**：中等
- **特点**：带约束的连通性问题

### 4. 黄金矿工 (Path with Maximum Gold)
- **难度**：中等
- **特点**：最优路径搜索

### 5. 不同路径 III (Unique Paths III)
- **难度**：困难
- **特点**：必须遍历所有空格的路径计数

## 时间复杂度

| 问题类型 | 时间复杂度 | 空间复杂度 | 备注 |
|----------|------------|------------|------|
| 单词搜索 | O(M×N×4^L) | O(L) | L为单词长度 |
| 单词搜索II | O(M×N×∑L) | O(∑L) | ∑L为所有单词长度和 |
| 路径计数 | O(4^(M×N)) | O(M×N) | 最坏情况 |
| 最优路径 | O(4^(M×N)) | O(M×N) | 需要尝试所有路径 |

## 应用场景

1. **游戏开发**：
   - 迷宫求解
   - 路径规划
   - 地图探索

2. **机器人导航**：
   - 路径规划
   - 障碍避免
   - 区域覆盖

3. **图像处理**：
   - 连通区域检测
   - 边界追踪
   - 模式识别

4. **网络分析**：
   - 社交网络分析
   - 信息传播路径
   - 网络连通性

## 调试技巧

1. **可视化路径**：打印搜索过程中的路径
2. **状态追踪**：记录访问状态的变化
3. **边界测试**：验证边界条件处理
4. **性能分析**：统计搜索节点数和剪枝效果

掌握路径搜索问题的解法，能够解决大量实际的导航和遍历问题！
