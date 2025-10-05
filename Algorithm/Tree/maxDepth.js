/**
 * 104. 二叉树的最大深度 (Maximum Depth of Binary Tree)
 * 
 * 题目：给定一个二叉树，找出其最大深度。
 * 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
 * 
 * 示例：
 * 输入：root = [3,9,20,null,null,15,7]
 * 输出：3
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(h)，h为树的高度
 */

const { TreeNode } = require('./inorderTraversal');

// 方法1：递归解法（DFS）
function maxDepth(root) {
  if (!root) return 0;
  
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  
  return Math.max(leftDepth, rightDepth) + 1;
}

// 方法2：迭代解法（BFS）
function maxDepthIterative(root) {
  if (!root) return 0;
  
  const queue = [root];
  let depth = 0;
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    depth++;
    
    // 处理当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return depth;
}

// 方法3：迭代解法（使用栈）
function maxDepthStack(root) {
  if (!root) return 0;
  
  const stack = [{ node: root, depth: 1 }];
  let maxDepth = 0;
  
  while (stack.length > 0) {
    const { node, depth } = stack.pop();
    maxDepth = Math.max(maxDepth, depth);
    
    if (node.left) {
      stack.push({ node: node.left, depth: depth + 1 });
    }
    
    if (node.right) {
      stack.push({ node: node.right, depth: depth + 1 });
    }
  }
  
  return maxDepth;
}

// 方法4：最小深度
function minDepth(root) {
  if (!root) return 0;
  
  // 如果没有子节点，深度为1
  if (!root.left && !root.right) return 1;
  
  let min = Infinity;
  
  if (root.left) {
    min = Math.min(min, minDepth(root.left));
  }
  
  if (root.right) {
    min = Math.min(min, minDepth(root.right));
  }
  
  return min + 1;
}

// 创建测试用的二叉树
function createTestTree() {
  const root = new TreeNode(3);
  root.left = new TreeNode(9);
  root.right = new TreeNode(20);
  root.right.left = new TreeNode(15);
  root.right.right = new TreeNode(7);
  root.right.right.left = new TreeNode(1);
  return root;
}

// 测试用例
console.log('=== 二叉树最大深度测试 ===');

const root = createTestTree();
console.log('测试树结构:');
console.log('    3');
console.log('   / \\');
console.log('  9   20');
console.log('     /  \\');
console.log('    15   7');
console.log('         /');
console.log('        1');

console.log('递归解法:', maxDepth(root));           // 4
console.log('BFS解法:', maxDepthIterative(root));   // 4
console.log('栈解法:', maxDepthStack(root));        // 4
console.log('最小深度:', minDepth(root));           // 2

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空树:', maxDepth(null));                    // 0
console.log('单节点:', maxDepth(new TreeNode(1)));       // 1

// 测试最小深度
const minDepthRoot = new TreeNode(1);
minDepthRoot.left = new TreeNode(2);
console.log('最小深度测试:', minDepth(minDepthRoot));    // 2

module.exports = { 
  maxDepth, 
  maxDepthIterative, 
  maxDepthStack,
  minDepth 
};
