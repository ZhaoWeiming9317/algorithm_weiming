# 二叉树的右视图

## 问题描述

给定一个二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

**LeetCode 199: Binary Tree Right Side View**

## 示例

### 示例 1
```
输入: [1,2,3,null,5,null,4]

     1            <---
   /   \
  2     3         <---
   \     \
    5     4       <---

输出: [1, 3, 4]
解释: 从右侧看，能看到 1, 3, 4 这三个节点
```

### 示例 2
```
输入: [1,2,3,4,5,6,7]

       1          <---
     /   \
    2     3       <---
   / \   / \
  4   5 6   7     <---

输出: [1, 3, 7]
```

### 示例 3
```
输入: [1,2,null,3,null,4]

  1               <---
 /
2                 <---
 \
  3               <---
   \
    4             <---

输出: [1, 2, 3, 4]
解释: 虽然都是左子树，但从右侧看每层都能看到
```

## 解法分析

### 方法一：层序遍历（BFS）⭐ 推荐

**核心思路**：使用队列进行层序遍历，每层只保存最右边的节点。

```javascript
function rightSideViewBFS(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            // 如果是当前层的最后一个节点
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
}
```

**复杂度分析**：
- 时间复杂度：O(n)，需要遍历所有节点
- 空间复杂度：O(n)，队列最多存储一层的节点

**优点**：
- 思路直观，容易理解
- 代码清晰，便于调试
- 适合初学者

**缺点**：
- 需要额外的队列空间
- `shift()` 操作有性能开销

---

### 方法二：深度优先遍历（DFS）⭐⭐ 最优解

**核心思路**：先访问右子树，再访问左子树，每层第一个访问到的节点就是右视图能看到的节点。

```javascript
function rightSideViewDFS(root) {
    const result = [];
    
    function dfs(node, depth) {
        if (!node) return;
        
        // 如果当前深度第一次访问
        if (depth === result.length) {
            result.push(node.val);
        }
        
        // 先右后左
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    }
    
    dfs(root, 0);
    return result;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(h)，h 为树的高度（递归栈）

**优点**：
- 代码简洁优雅
- 空间复杂度更优（平衡树时 O(log n)）
- 推荐在面试中使用

**关键点**：
1. **先右后左**：确保优先访问右边的节点
2. **深度标记**：`depth === result.length` 判断是否第一次访问该层
3. **递归终止**：节点为空时返回

---

### 方法三：DFS 栈实现

**核心思路**：使用栈模拟 DFS 递归过程。

```javascript
function rightSideViewDFSStack(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [[root, 0]]; // [node, depth]
    
    while (stack.length > 0) {
        const [node, depth] = stack.pop();
        
        if (depth === result.length) {
            result.push(node.val);
        }
        
        // 先左后右入栈，出栈时就是先右后左
        if (node.left) stack.push([node.left, depth + 1]);
        if (node.right) stack.push([node.right, depth + 1]);
    }
    
    return result;
}
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(h)

**优点**：
- 避免递归，防止栈溢出
- 适合深度很大的树

---

### 方法四：优化的 BFS

**核心思路**：避免 `shift()` 操作的 O(n) 复杂度。

```javascript
function rightSideViewBFSOptimized(root) {
    if (!root) return [];
    
    const result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const nextQueue = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue[i];
            
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            if (node.left) nextQueue.push(node.left);
            if (node.right) nextQueue.push(node.right);
        }
        
        queue = nextQueue;
    }
    
    return result;
}
```

**优点**：
- 避免了 `shift()` 的性能开销
- 大数据量时性能更好

---

## 执行流程演示

以 `[1,2,3,null,5,null,4]` 为例：

```
     1
   /   \
  2     3
   \     \
    5     4
```

### BFS 执行流程：

```
第 1 层: [1]
  - 遍历 1，是最后一个 → 加入结果: [1]
  - 入队: [2, 3]

第 2 层: [2, 3]
  - 遍历 2
  - 遍历 3，是最后一个 → 加入结果: [1, 3]
  - 入队: [5, 4]

第 3 层: [5, 4]
  - 遍历 5
  - 遍历 4，是最后一个 → 加入结果: [1, 3, 4]
  - 队列为空，结束

结果: [1, 3, 4]
```

### DFS 执行流程：

```
dfs(1, depth=0)
  result.length = 0, depth = 0 → 加入 1: [1]
  
  dfs(3, depth=1)  // 先右
    result.length = 1, depth = 1 → 加入 3: [1, 3]
    
    dfs(4, depth=2)  // 先右
      result.length = 2, depth = 2 → 加入 4: [1, 3, 4]
      
    dfs(null, depth=2)  // 后左
  
  dfs(2, depth=1)  // 后左
    result.length = 3, depth = 1 → 不加入（该层已访问）
    
    dfs(null, depth=2)  // 先右
    dfs(5, depth=2)     // 后左
      result.length = 3, depth = 2 → 不加入（该层已访问）

结果: [1, 3, 4]
```

**关键观察**：
- DFS 先访问右子树，所以每层第一个访问到的就是最右边的节点
- `depth === result.length` 确保每层只记录第一个节点

---

## 边界情况

### 1. 空树
```javascript
输入: null
输出: []
```

### 2. 单节点
```javascript
输入: [1]
输出: [1]
```

### 3. 只有左子树
```javascript
输入: [1,2,null,3]
     1
    /
   2
  /
 3

输出: [1, 2, 3]
说明: 虽然都是左子树，但每层从右看都能看到
```

### 4. 只有右子树
```javascript
输入: [1,null,2,null,3]
  1
   \
    2
     \
      3

输出: [1, 2, 3]
```

### 5. 完全二叉树
```javascript
输入: [1,2,3,4,5,6,7]
       1
     /   \
    2     3
   / \   / \
  4   5 6   7

输出: [1, 3, 7]
```

---

## 面试要点

### 1. 为什么 DFS 要先右后左？

**答**：因为我们要找每层最右边的节点。先访问右子树，可以确保每层第一个访问到的节点就是最右边的节点。

```javascript
// 正确：先右后左
dfs(node.right, depth + 1);
dfs(node.left, depth + 1);

// 错误：先左后右
dfs(node.left, depth + 1);
dfs(node.right, depth + 1);
// 这样会导致先访问到左边的节点
```

### 2. 如何判断是否该层第一次访问？

**答**：使用 `depth === result.length`。

```javascript
if (depth === result.length) {
    result.push(node.val);
}
```

**原理**：
- `result.length` 表示已经访问的层数
- 当 `depth === result.length` 时，说明当前深度是新的一层
- 由于先访问右子树，所以这个节点就是该层最右边的节点

### 3. BFS 和 DFS 哪个更好？

**答**：各有优劣，看具体场景：

| 特性 | BFS | DFS |
|------|-----|-----|
| 代码简洁性 | 一般 | 优秀 |
| 空间复杂度 | O(n) | O(h) |
| 时间复杂度 | O(n) | O(n) |
| 推荐场景 | 初学者理解 | 面试推荐 |

**推荐**：面试中推荐使用 DFS 递归方法，代码最简洁。

### 4. 如果要求左视图呢？

**答**：只需要修改 DFS 的访问顺序，先左后右：

```javascript
function leftSideView(root) {
    const result = [];
    
    function dfs(node, depth) {
        if (!node) return;
        
        if (depth === result.length) {
            result.push(node.val);
        }
        
        // 先左后右
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
    
    dfs(root, 0);
    return result;
}
```

---

## 相关题目

1. **二叉树的层序遍历** (LeetCode 102)
2. **二叉树的锯齿形层序遍历** (LeetCode 103)
3. **二叉树的最大深度** (LeetCode 104)
4. **二叉树的最小深度** (LeetCode 111)
5. **填充每个节点的下一个右侧节点指针** (LeetCode 116)

---

## 总结

### 最佳实践

```javascript
// 面试推荐：DFS 递归
function rightSideView(root) {
    const result = [];
    
    function dfs(node, depth) {
        if (!node) return;
        if (depth === result.length) result.push(node.val);
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    }
    
    dfs(root, 0);
    return result;
}
```

### 记忆要点

1. **核心思路**：找每层最右边的节点
2. **BFS**：层序遍历，取每层最后一个
3. **DFS**：先右后左，每层第一个访问的就是答案
4. **判断条件**：`depth === result.length`
5. **复杂度**：O(n) 时间，O(h) 空间（DFS）

### 常见错误

1. ❌ DFS 先左后右（会得到左视图）
2. ❌ 忘记检查空节点
3. ❌ 深度从 1 开始（应该从 0 开始）
4. ❌ 没有处理空树的情况
