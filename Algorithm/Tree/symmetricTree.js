/**
 * 101. 对称二叉树 (Symmetric Tree)
 * 
 * 题目：给你一个二叉树的根节点 root，检查它是否轴对称。
 * 
 * 示例：
 * 输入：root = [1,2,2,3,4,4,3]
 * 输出：true
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(h)，h为树的高度
 */

const { TreeNode } = require('./inorderTraversal');

// 方法1：递归解法
function isSymmetric(root) {
  if (!root) return true;
  
  function isMirror(left, right) {
    // 都为空
    if (!left && !right) return true;
    
    // 只有一个为空
    if (!left || !right) return false;
    
    // 值不相等
    if (left.val !== right.val) return false;
    
    // 递归检查：左的左子树与右的右子树，左的右子树与右的左子树
    return isMirror(left.left, right.right) && isMirror(left.right, right.left);
  }
  
  return isMirror(root.left, root.right);
}

// 方法2：迭代解法（使用队列）
function isSymmetricIterative(root) {
  if (!root) return true;
  
  const queue = [root.left, root.right];
  
  while (queue.length > 0) {
    const left = queue.shift();
    const right = queue.shift();
    
    // 都为空，继续
    if (!left && !right) continue;
    
    // 只有一个为空
    if (!left || !right) return false;
    
    // 值不相等
    if (left.val !== right.val) return false;
    
    // 按对称顺序加入队列
    queue.push(left.left, right.right);
    queue.push(left.right, right.left);
  }
  
  return true;
}

// 方法3：迭代解法（使用栈）
function isSymmetricStack(root) {
  if (!root) return true;
  
  const stack = [root.left, root.right];
  
  while (stack.length > 0) {
    const right = stack.pop();
    const left = stack.pop();
    
    // 都为空，继续
    if (!left && !right) continue;
    
    // 只有一个为空
    if (!left || !right) return false;
    
    // 值不相等
    if (left.val !== right.val) return false;
    
    // 按对称顺序加入栈
    stack.push(left.left, right.right);
    stack.push(left.right, right.left);
  }
  
  return true;
}

// 创建测试用的对称二叉树
function createSymmetricTree() {
  const root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.right = new TreeNode(2);
  root.left.left = new TreeNode(3);
  root.left.right = new TreeNode(4);
  root.right.left = new TreeNode(4);
  root.right.right = new TreeNode(3);
  return root;
}

// 创建测试用的非对称二叉树
function createAsymmetricTree() {
  const root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.right = new TreeNode(2);
  root.left.right = new TreeNode(3);
  root.right.right = new TreeNode(3);
  return root;
}

// 测试用例
console.log('=== 对称二叉树测试 ===');

// 测试对称树
const symmetricRoot = createSymmetricTree();
console.log('对称树结构:');
console.log('      1');
console.log('     / \\');
console.log('    2   2');
console.log('   / \\ / \\');
console.log('  3  4 4  3');

console.log('递归解法:', isSymmetric(symmetricRoot));           // true
console.log('队列迭代:', isSymmetricIterative(symmetricRoot));  // true
console.log('栈迭代:', isSymmetricStack(symmetricRoot));        // true

// 测试非对称树
const asymmetricRoot = createAsymmetricTree();
console.log('\n非对称树结构:');
console.log('    1');
console.log('   / \\');
console.log('  2   2');
console.log('   \\   \\');
console.log('    3   3');

console.log('递归解法:', isSymmetric(asymmetricRoot));           // false
console.log('队列迭代:', isSymmetricIterative(asymmetricRoot));  // false
console.log('栈迭代:', isSymmetricStack(asymmetricRoot));        // false

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空树:', isSymmetric(null));                    // true
console.log('单节点:', isSymmetric(new TreeNode(1)));       // true

module.exports = { 
  isSymmetric, 
  isSymmetricIterative, 
  isSymmetricStack 
};
