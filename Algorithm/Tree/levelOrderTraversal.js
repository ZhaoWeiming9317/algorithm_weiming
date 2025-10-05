/**
 * 102. 二叉树的层序遍历 (Binary Tree Level Order Traversal)
 * 
 * 题目：给你二叉树的根节点 root，返回其节点值的层序遍历。
 * （即逐层地，从左到右访问所有节点）。
 * 
 * 示例：
 * 输入：root = [3,9,20,null,null,15,7]
 * 输出：[[3],[9,20],[15,7]]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(w)，w为树的最大宽度
 */

const { TreeNode } = require('./inorderTraversal');

// 方法1：队列解法（BFS）
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    // 处理当前层的所有节点
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      // 将子节点加入队列
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}

// 方法2：递归解法（DFS）
function levelOrderRecursive(root) {
  const result = [];
  
  function dfs(node, level) {
    if (!node) return;
    
    // 如果当前层还没有数组，创建一个
    if (!result[level]) {
      result[level] = [];
    }
    
    // 添加当前节点到对应层
    result[level].push(node.val);
    
    // 递归处理子节点
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  
  dfs(root, 0);
  return result;
}

// 方法3：Z字形层序遍历
function levelOrderZigzag(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  let leftToRight = true;
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      
      if (leftToRight) {
        currentLevel.push(node.val);
      } else {
        currentLevel.unshift(node.val);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
    leftToRight = !leftToRight;
  }
  
  return result;
}

// 方法4：层序遍历求每层的最大值
function largestValues(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    let maxVal = -Infinity;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      maxVal = Math.max(maxVal, node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(maxVal);
  }
  
  return result;
}

// 创建测试用的二叉树
function createTestTree() {
  const root = new TreeNode(3);
  root.left = new TreeNode(9);
  root.right = new TreeNode(20);
  root.right.left = new TreeNode(15);
  root.right.right = new TreeNode(7);
  return root;
}

// 测试用例
console.log('=== 二叉树层序遍历测试 ===');

const root = createTestTree();
console.log('测试树结构:');
console.log('    3');
console.log('   / \\');
console.log('  9   20');
console.log('     /  \\');
console.log('    15   7');

console.log('队列解法:', levelOrder(root));           // [[3],[9,20],[15,7]]
console.log('递归解法:', levelOrderRecursive(root));  // [[3],[9,20],[15,7]]
console.log('Z字形遍历:', levelOrderZigzag(root));    // [[3],[20,9],[15,7]]
console.log('每层最大值:', largestValues(root));      // [3,20,15]

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空树:', levelOrder(null));                    // []
console.log('单节点:', levelOrder(new TreeNode(1)));       // [[1]]

module.exports = { 
  levelOrder, 
  levelOrderRecursive, 
  levelOrderZigzag,
  largestValues 
};
