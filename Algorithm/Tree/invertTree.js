/**
 * 226. 翻转二叉树 (Invert Binary Tree)
 * 
 * 题目：给你一棵二叉树的根节点 root，翻转这棵二叉树，并返回其根节点。
 * 
 * 示例：
 * 输入：root = [4,2,7,1,3,6,9]
 * 输出：[4,7,2,9,6,3,1]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(h)，h为树的高度
 */

const { TreeNode } = require('./inorderTraversal');

// 方法1：递归解法
function invertTree(root) {
  if (!root) return null;
  
  // 递归翻转左右子树
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  
  // 交换左右子树
  root.left = right;
  root.right = left;
  
  return root;
}

// 方法2：迭代解法（使用队列）
function invertTreeIterative(root) {
  if (!root) return null;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    // 交换左右子节点
    const temp = node.left;
    node.left = node.right;
    node.right = temp;
    
    // 将子节点加入队列
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return root;
}

// 方法3：迭代解法（使用栈）
function invertTreeStack(root) {
  if (!root) return null;
  
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    // 交换左右子节点
    const temp = node.left;
    node.left = node.right;
    node.right = temp;
    
    // 将子节点加入栈
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  
  return root;
}

// 辅助函数：打印二叉树（层序遍历）
function printTree(root) {
  if (!root) return;
  
  const queue = [root];
  const result = [];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.val);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
}

// 创建测试用的二叉树
function createTestTree() {
  const root = new TreeNode(4);
  root.left = new TreeNode(2);
  root.right = new TreeNode(7);
  root.left.left = new TreeNode(1);
  root.left.right = new TreeNode(3);
  root.right.left = new TreeNode(6);
  root.right.right = new TreeNode(9);
  return root;
}

// 测试用例
console.log('=== 翻转二叉树测试 ===');

const root = createTestTree();
console.log('原始树结构:');
console.log('      4');
console.log('     / \\');
console.log('    2   7');
console.log('   / \\ / \\');
console.log('  1  3 6  9');

console.log('原始树层序遍历:', printTree(root)); // [4,2,7,1,3,6,9]

// 测试递归解法
const root1 = createTestTree();
invertTree(root1);
console.log('递归翻转后:', printTree(root1)); // [4,7,2,9,6,3,1]

// 测试迭代解法
const root2 = createTestTree();
invertTreeIterative(root2);
console.log('迭代翻转后:', printTree(root2)); // [4,7,2,9,6,3,1]

// 测试栈解法
const root3 = createTestTree();
invertTreeStack(root3);
console.log('栈翻转后:', printTree(root3)); // [4,7,2,9,6,3,1]

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空树:', invertTree(null));                    // null
console.log('单节点:', printTree(invertTree(new TreeNode(1)))); // [1]

module.exports = { 
  invertTree, 
  invertTreeIterative, 
  invertTreeStack,
  printTree 
};
