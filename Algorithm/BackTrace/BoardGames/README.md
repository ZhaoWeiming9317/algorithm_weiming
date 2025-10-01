# 棋盘游戏问题 (Board Games)

## 概述

棋盘游戏问题是回溯算法在二维网格上的经典应用。这类问题通常涉及在棋盘上放置棋子、求解谜题或寻找满足特定约束的配置。

## 核心特点

- **二维约束**：需要同时考虑行、列、区域等多维度约束
- **状态空间大**：可能的状态数量呈指数级增长
- **强剪枝**：通过约束检查大幅减少搜索空间
- **回溯关键**：错误选择需要能够完全撤销

## 通用解题框架

```javascript
function solveBoardGame(board) {
    function isValid(board, row, col, value) {
        // 检查当前位置放置value是否合法
        return checkConstraints(board, row, col, value);
    }
    
    function backtrack(position) {
        // 终止条件：找到解或无解
        if (isComplete(board)) {
            return true; // 找到解
        }
        
        // 尝试所有可能的选择
        for (let choice of getChoices(position)) {
            if (isValid(board, position, choice)) {
                // 做选择
                makeChoice(board, position, choice);
                
                // 递归求解
                if (backtrack(nextPosition)) {
                    return true;
                }
                
                // 撤销选择
                undoChoice(board, position, choice);
            }
        }
        
        return false; // 无解
    }
    
    return backtrack(startPosition);
}
```

## 问题分类

### 1. N皇后问题 (N-Queens)

**问题描述**：在N×N棋盘上放置N个皇后，使得它们互不攻击。

**约束条件**：
- 同一行不能有两个皇后
- 同一列不能有两个皇后  
- 同一对角线不能有两个皇后

**解题要点**：
- 逐行放置皇后
- 检查列和对角线冲突
- 使用位运算优化

```javascript
function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function isValid(row, col) {
        // 检查列冲突
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
        }
        
        // 检查对角线冲突
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') return false;
        }
        
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') return false;
        }
        
        return true;
    }
    
    function backtrack(row) {
        if (row === n) {
            result.push(board.map(row => row.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (isValid(row, col)) {
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
            }
        }
    }
    
    backtrack(0);
    return result;
}
```

### 2. 数独求解器 (Sudoku Solver)

**问题描述**：填充9×9数独网格，使每行、每列、每个3×3宫格都包含1-9的数字。

**约束条件**：
- 每行包含1-9各一次
- 每列包含1-9各一次
- 每个3×3宫格包含1-9各一次

**解题要点**：
- 寻找空格位置
- 尝试填入1-9
- 检查三重约束

```javascript
function solveSudoku(board) {
    function isValid(row, col, num) {
        // 检查行
        for (let j = 0; j < 9; j++) {
            if (board[row][j] === num) return false;
        }
        
        // 检查列
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }
        
        // 检查3x3宫格
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        
        return true;
    }
    
    function backtrack() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    for (let num = '1'; num <= '9'; num++) {
                        if (isValid(i, j, num)) {
                            board[i][j] = num;
                            if (backtrack()) return true;
                            board[i][j] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    backtrack();
}
```

## 优化策略

### 1. 约束传播 (Constraint Propagation)
- 预处理阶段消除明显不可能的选择
- 动态维护可选值集合

### 2. 启发式搜索
- **最少剩余值**：优先选择可选值最少的位置
- **度启发式**：优先选择约束最多变量的位置
- **最少约束值**：优先尝试约束其他变量最少的值

### 3. 位运算优化
```javascript
// 使用位运算表示可选数字
let available = (1 << 9) - 1; // 111111111 表示1-9都可选

// 检查数字k是否可选
if (available & (1 << (k - 1))) {
    // 数字k可选
}

// 标记数字k已使用
available &= ~(1 << (k - 1));
```

### 4. 对称性消除
- 利用问题的对称性减少搜索空间
- 例如N皇后问题可以只搜索一半解，另一半通过对称得到

## 问题列表

### 1. N皇后问题 (N-Queens)
- **文件**：`nQueens.js`
- **难度**：困难
- **变种**：N皇后II（只求数量）、可攻击国王的皇后

### 2. 数独求解器 (Sudoku Solver)
- **文件**：`sudokuSolver.js`
- **难度**：困难
- **变种**：有效数独验证、数独生成器

### 3. 其他棋盘问题
- **骑士巡游**：马在棋盘上走遍所有格子
- **八数码问题**：滑动拼图游戏
- **迷宫求解**：寻找从起点到终点的路径

## 时间复杂度

| 问题 | 最坏时间复杂度 | 平均时间复杂度 | 优化后 |
|------|----------------|----------------|--------|
| N皇后 | O(N!) | O(N^N) | O(N!) |
| 数独 | O(9^81) | O(9^k) k为空格数 | 大幅优化 |

## 应用场景

1. **游戏AI**：棋类游戏的走法生成和评估
2. **资源调度**：任务分配和时间安排
3. **电路设计**：芯片布局和布线
4. **密码学**：密钥搜索和破解

## 调试技巧

1. **可视化**：打印棋盘状态帮助理解
2. **步骤追踪**：记录每步的选择和撤销
3. **约束检查**：验证每步操作的正确性
4. **性能分析**：统计搜索节点数和剪枝效果

掌握棋盘游戏问题的解法，能够深入理解约束满足问题和搜索算法的精髓！
