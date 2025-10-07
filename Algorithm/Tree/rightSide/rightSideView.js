/**
 * 二叉树的右视图
 * LeetCode 199: Binary Tree Right Side View
 * 
 * 问题描述：
 * 给定一个二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。
 * 
 * 示例：
 * 输入: [1,2,3,null,5,null,4]
 *      1            <---
 *    /   \
 *   2     3         <---
 *    \     \
 *     5     4       <---
 * 输出: [1, 3, 4]
 * 
 * 核心思路：
 * 1. 层序遍历：取每层最右边的节点
 * 2. 深度优先遍历：先访问右子树，每层只记录第一个访问的节点
 */

// 树节点定义
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 方法一：层序遍历（BFS）- 最直观
 * 
 * 思路：
 * 1. 使用队列进行层序遍历
 * 2. 每层只保存最右边的节点值
 * 
 * 时间复杂度：O(n)，需要遍历所有节点
 * 空间复杂度：O(n)，队列最多存储一层的节点
 */
function rightSideViewBFS(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        // 遍历当前层的所有节点
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            // 如果是当前层的最后一个节点（最右边），加入结果
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            // 将下一层节点加入队列
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
}

/**
 * 方法二：深度优先遍历（DFS）- 更优雅
 * 
 * 思路：
 * 1. 先访问右子树，再访问左子树
 * 2. 每层第一个访问到的节点就是右视图能看到的节点
 * 3. 使用深度标记，确保每层只记录第一个节点
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(h)，h 为树的高度（递归栈）
 */
function rightSideViewDFS(root) {
    const result = [];

    function dfs(node, depth) {
        if (!node) return;
        
        // 如果当前深度第一次访问，说明这是右视图能看到的节点
        if (depth === result.length) {
            result.push(node.val);
        }
        
        // 先右后左，确保优先访问右边的节点
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    }
    
    dfs(root, 0);
    return result;
}

/**
 * 方法三：DFS 变体 - 使用栈
 * 
 * 思路：模拟 DFS 的递归过程
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(h)
 */
function rightSideViewDFSStack(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [[root, 0]]; // [node, depth]
    const visited = new Set();
    
    while (stack.length > 0) {
        const [node, depth] = stack.pop();
        
        // 如果当前深度第一次访问
        if (depth === result.length) {
            result.push(node.val);
        }
        
        // 先左后右入栈，这样出栈时就是先右后左
        if (node.left) stack.push([node.left, depth + 1]);
        if (node.right) stack.push([node.right, depth + 1]);
    }
    
    return result;
}

/**
 * 方法四：优化的 BFS - 使用数组索引代替 shift
 * 
 * 优点：避免 shift() 操作的 O(n) 复杂度
 */
function rightSideViewBFSOptimized(root) {
    if (!root) return [];
    
    const result = [];
    let queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const nextQueue = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue[i];
            
            // 最右边的节点
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

/**
 * 方法五：反向思维 - 从右到左的层序遍历
 * 
 * 思路：每层只取第一个节点（最右边）
 */
function rightSideViewReverse(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            // 每层的第一个节点就是最右边的
            if (i === 0) {
                result.push(node.val);
            }
            
            // 先右后左入队
            if (node.right) queue.push(node.right);
            if (node.left) queue.push(node.left);
        }
    }
    
    return result;
}

// ==================== 辅助函数 ====================

/**
 * 从数组构建二叉树（层序遍历方式）
 */
function buildTree(arr) {
    if (!arr || arr.length === 0) return null;
    
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        
        // 左子节点
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        
        // 右子节点
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}

/**
 * 打印树的结构（用于调试）
 */
function printTree(root, prefix = '', isLeft = true) {
    if (!root) return;
    
    console.log(prefix + (isLeft ? '├── ' : '└── ') + root.val);
    
    if (root.left || root.right) {
        if (root.left) {
            printTree(root.left, prefix + (isLeft ? '│   ' : '    '), true);
        }
        if (root.right) {
            printTree(root.right, prefix + (isLeft ? '│   ' : '    '), false);
        }
    }
}

/**
 * 可视化右视图
 */
function visualizeRightView(root) {
    if (!root) {
        console.log('空树');
        return [];
    }
    
    console.log('\n树的结构：');
    printTree(root, '', false);
    
    const result = rightSideViewDFS(root);
    console.log('\n右视图：', result);
    console.log('说明：从右侧看，从上到下依次能看到这些节点\n');
    
    return result;
}

// ==================== 测试用例 ====================

console.log('=== 二叉树的右视图 ===\n');

// 测试用例 1：标准情况
console.log('测试 1: 标准二叉树');
const tree1 = buildTree([1, 2, 3, null, 5, null, 4]);
visualizeRightView(tree1);

// 测试用例 2：完全二叉树
console.log('测试 2: 完全二叉树');
const tree2 = buildTree([1, 2, 3, 4, 5, 6, 7]);
visualizeRightView(tree2);

// 测试用例 3：只有左子树
console.log('测试 3: 只有左子树');
const tree3 = buildTree([1, 2, null, 3, null, 4]);
visualizeRightView(tree3);

// 测试用例 4：只有右子树
console.log('测试 4: 只有右子树');
const tree4 = buildTree([1, null, 2, null, 3, null, 4]);
visualizeRightView(tree4);

// 测试用例 5：单节点
console.log('测试 5: 单节点');
const tree5 = buildTree([1]);
visualizeRightView(tree5);

// 测试用例 6：空树
console.log('测试 6: 空树');
visualizeRightView(null);

// 性能对比测试
console.log('=== 性能对比 ===\n');

const largeTree = buildTree([
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
    16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31
]);

console.time('BFS 方法');
const result1 = rightSideViewBFS(largeTree);
console.timeEnd('BFS 方法');

console.time('DFS 方法');
const result2 = rightSideViewDFS(largeTree);
console.timeEnd('DFS 方法');

console.time('DFS 栈方法');
const result3 = rightSideViewDFSStack(largeTree);
console.timeEnd('DFS 栈方法');

console.time('BFS 优化方法');
const result4 = rightSideViewBFSOptimized(largeTree);
console.timeEnd('BFS 优化方法');

console.time('反向遍历方法');
const result5 = rightSideViewReverse(largeTree);
console.timeEnd('反向遍历方法');

console.log('\n结果一致性检查：', 
    JSON.stringify(result1) === JSON.stringify(result2) &&
    JSON.stringify(result2) === JSON.stringify(result3) &&
    JSON.stringify(result3) === JSON.stringify(result4) &&
    JSON.stringify(result4) === JSON.stringify(result5)
);

// 方法对比
console.log('\n=== 方法对比 ===\n');
console.log(`
方法           | 时间复杂度 | 空间复杂度 | 特点
-------------- | ---------- | ---------- | ----
BFS 层序遍历   | O(n)       | O(n)       | 直观易懂，适合初学者
DFS 递归       | O(n)       | O(h)       | 代码简洁，推荐使用
DFS 栈         | O(n)       | O(h)       | 迭代版本，避免递归
BFS 优化       | O(n)       | O(n)       | 避免 shift 操作
反向遍历       | O(n)       | O(n)       | 思路新颖

注：h 为树的高度，最坏情况 h = n（链式树），最好情况 h = log(n)（平衡树）
`);

// 导出
export {
    rightSideViewBFS,
    rightSideViewDFS,
    rightSideViewDFSStack,
    rightSideViewBFSOptimized,
    rightSideViewReverse,
    buildTree,
    visualizeRightView,
    TreeNode
};

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rightSideViewBFS,
        rightSideViewDFS,
        rightSideViewDFSStack,
        rightSideViewBFSOptimized,
        rightSideViewReverse,
        buildTree,
        visualizeRightView,
        TreeNode
    };
}

