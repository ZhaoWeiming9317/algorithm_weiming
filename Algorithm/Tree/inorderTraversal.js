/**
 * 94. 二叉树的中序遍历 (Binary Tree Inorder Traversal)
 * 
 * 题目：给定一个二叉树的根节点 root，返回它的中序遍历。
 * 
 * 示例：
 * 输入：root = [1,null,2,3]
 * 输出：[1,3,2]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n) 或 O(h)，h为树的高度
 */

// 定义二叉树节点
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 方法1：递归解法
function inorderTraversal(root) {
  const result = [];
  
  function inorder(node) {
    if (node === null) return;
    
    inorder(node.left);   // 遍历左子树
    result.push(node.val); // 访问根节点
    inorder(node.right);  // 遍历右子树
  }
  
  inorder(root);
  return result;
}

// 方法2：迭代解法（使用栈）
function inorderTraversalIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length > 0) {
    // 一直向左走到底
    while (current) {
      stack.push(current);
      current = current.left;
    }
    
    // 弹出栈顶元素
    current = stack.pop();
    result.push(current.val);
    
    // 转向右子树
    current = current.right;
  }
  
  return result;
}

// 方法3：Morris 遍历 - O(1) 空间复杂度
function inorderTraversalMorris(root) {
  const result = [];
  let current = root;
  
  while (current) {
    if (!current.left) {
      // 没有左子树，直接访问当前节点
      result.push(current.val);
      current = current.right;
    } else {
      // 找到左子树的最右节点（前驱节点）
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }
      
      if (!predecessor.right) {
        // 建立线索
        predecessor.right = current;
        current = current.left;
      } else {
        // 断开线索
        predecessor.right = null;
        result.push(current.val);
        current = current.right;
      }
    }
  }
  
  return result;
}

// 创建测试用的二叉树
function createTestTree() {
  const root = new TreeNode(1);
  root.right = new TreeNode(2);
  root.right.left = new TreeNode(3);
  return root;
}

// 测试用例
console.log('=== 二叉树中序遍历测试 ===');

const root = createTestTree();
console.log('测试树结构:');
console.log('    1');
console.log('     \\');
console.log('      2');
console.log('     /');
console.log('    3');

console.log('递归解法:', inorderTraversal(root));           // [3, 1, 2]
console.log('迭代解法:', inorderTraversalIterative(root));  // [3, 1, 2]
console.log('Morris遍历:', inorderTraversalMorris(root));   // [3, 1, 2]

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空树递归:', inorderTraversal(null));           // []
console.log('空树迭代:', inorderTraversalIterative(null));  // []
console.log('单节点:', inorderTraversal(new TreeNode(1)));  // [1]

module.exports = { 
  inorderTraversal, 
  inorderTraversalIterative, 
  inorderTraversalMorris,
  TreeNode 
};
