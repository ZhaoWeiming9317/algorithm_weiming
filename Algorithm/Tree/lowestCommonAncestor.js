/**
 * 236. 二叉树的最近公共祖先 (Lowest Common Ancestor of a Binary Tree)
 * 
 * 题目：给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
 * 最近公共祖先的定义为："对于有根树 T 的两个节点 p、q，
 * 最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大
 * （一个节点也可以是它自己的祖先）。"
 * 
 * 示例：
 * 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 * 输出：3
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(h)，h为树的高度
 */

const { TreeNode } = require('./inorderTraversal');

// 方法1：递归解法（经典解法）
function lowestCommonAncestor(root, p, q) {
  // 如果根节点为空或者是p或q中的一个，直接返回
  if (!root || root === p || root === q) {
    return root;
  }
  
  // 在左子树中查找
  const left = lowestCommonAncestor(root.left, p, q);
  // 在右子树中查找
  const right = lowestCommonAncestor(root.right, p, q);
  
  // 如果左右子树都找到了，说明当前节点就是最近公共祖先
  if (left && right) {
    return root;
  }
  
  // 如果只有一边找到了，返回找到的那一边
  return left || right;
}

// 方法2：存储父节点路径
function lowestCommonAncestorWithPath(root, p, q) {
  if (!root) return null;
  
  // 存储每个节点的父节点
  const parent = new Map();
  const visited = new Set();
  
  // BFS遍历，记录每个节点的父节点
  const queue = [root];
  while (queue.length > 0) {
    const node = queue.shift();
    
    if (node.left) {
      parent.set(node.left, node);
      queue.push(node.left);
    }
    
    if (node.right) {
      parent.set(node.right, node);
      queue.push(node.right);
    }
  }
  
  // 从p开始向上遍历，标记访问过的节点
  while (p) {
    visited.add(p);
    p = parent.get(p);
  }
  
  // 从q开始向上遍历，找到第一个被访问过的节点
  while (q) {
    if (visited.has(q)) {
      return q;
    }
    q = parent.get(q);
  }
  
  return null;
}

// 方法3：递归解法（带路径记录）
function lowestCommonAncestorWithTracking(root, p, q) {
  let result = null;
  
  function dfs(node) {
    if (!node) return false;
    
    // 检查当前节点是否是p或q
    const isCurrent = node === p || node === q;
    
    // 递归检查左右子树
    const isLeft = dfs(node.left);
    const isRight = dfs(node.right);
    
    // 如果满足以下条件之一，当前节点就是LCA：
    // 1. 当前节点是p或q，且左右子树中有另一个节点
    // 2. 左右子树分别包含p和q
    if ((isCurrent && (isLeft || isRight)) || (isLeft && isRight)) {
      result = node;
    }
    
    // 返回当前节点或其子树是否包含p或q
    return isCurrent || isLeft || isRight;
  }
  
  dfs(root);
  return result;
}

// 创建测试用的二叉树
function createTestTree() {
  const root = new TreeNode(3);
  root.left = new TreeNode(5);
  root.right = new TreeNode(1);
  root.left.left = new TreeNode(6);
  root.left.right = new TreeNode(2);
  root.right.left = new TreeNode(0);
  root.right.right = new TreeNode(8);
  root.left.right.left = new TreeNode(7);
  root.left.right.right = new TreeNode(4);
  
  return {
    root,
    p: root.left,      // 节点5
    q: root.right      // 节点1
  };
}

// 辅助函数：打印树结构
function printTreeStructure(root, prefix = '', isLast = true) {
  if (!root) return;
  
  console.log(prefix + (isLast ? '└── ' : '├── ') + root.val);
  
  const children = [];
  if (root.left) children.push(root.left);
  if (root.right) children.push(root.right);
  
  children.forEach((child, index) => {
    const isLastChild = index === children.length - 1;
    printTreeStructure(child, prefix + (isLast ? '    ' : '│   '), isLastChild);
  });
}

// 测试用例
console.log('=== 二叉树最近公共祖先测试 ===');

const { root, p, q } = createTestTree();
console.log('测试树结构:');
console.log('      3');
console.log('     / \\');
console.log('    5   1');
console.log('   / \\ / \\');
console.log('  6  2 0  8');
console.log('    / \\');
console.log('   7   4');

console.log('节点p (5), 节点q (1)');
console.log('递归解法:', lowestCommonAncestor(root, p, q).val);           // 3
console.log('路径解法:', lowestCommonAncestorWithPath(root, p, q).val);    // 3
console.log('追踪解法:', lowestCommonAncestorWithTracking(root, p, q).val); // 3

// 测试其他情况
const test2 = createTestTree();
console.log('\n测试节点p (5), 节点q (4)');
console.log('LCA:', lowestCommonAncestor(test2.root, test2.p, test2.root.left.right.right).val); // 5

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空树:', lowestCommonAncestor(null, p, q));                    // null
console.log('相同节点:', lowestCommonAncestor(root, p, p).val);             // 5

module.exports = { 
  lowestCommonAncestor, 
  lowestCommonAncestorWithPath, 
  lowestCommonAncestorWithTracking 
};
