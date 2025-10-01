/**
 * 树的克隆 - 前序遍历应用
 * 
 * 题目：给定一个二叉树，返回其克隆树
 * 
 * 前序遍历特点：根 → 左 → 右
 * 适合复制树结构，因为需要先创建根节点，再复制子树
 */

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 克隆二叉树 - 前序遍历实现
 * @param {TreeNode} root - 原始树的根节点
 * @return {TreeNode} - 克隆树的根节点
 */
export function cloneTree(root) {
    // 基础情况：空节点
    if (!root) return null;
    
    // 前序遍历：先处理根节点
    const newNode = new TreeNode(root.val);
    
    // 递归克隆左子树
    newNode.left = cloneTree(root.left);
    
    // 递归克隆右子树
    newNode.right = cloneTree(root.right);
    
    return newNode;
}

/**
 * 深度克隆（包含额外属性）
 */
export function deepCloneTree(root) {
    if (!root) return null;
    
    // 创建新节点并复制所有属性
    const newNode = new TreeNode(root.val);
    
    // 如果有其他属性，也要复制
    if (root.hasOwnProperty('extra')) {
        newNode.extra = root.extra;
    }
    
    newNode.left = deepCloneTree(root.left);
    newNode.right = deepCloneTree(root.right);
    
    return newNode;
}

/**
 * 验证两棵树是否相同
 */
export function isSameTree(p, q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    
    return p.val === q.val && 
           isSameTree(p.left, q.left) && 
           isSameTree(p.right, q.right);
}

/**
 * 打印树结构（用于测试）
 */
function printTree(root, level = 0, prefix = "Root: ") {
    if (!root) return;
    
    console.log(" ".repeat(level * 4) + prefix + root.val);
    
    if (root.left || root.right) {
        if (root.left) {
            printTree(root.left, level + 1, "L--- ");
        } else {
            console.log(" ".repeat((level + 1) * 4) + "L--- null");
        }
        
        if (root.right) {
            printTree(root.right, level + 1, "R--- ");
        } else {
            console.log(" ".repeat((level + 1) * 4) + "R--- null");
        }
    }
}

// 测试用例
console.log('=== 树的克隆测试 ===');

// 创建测试树
//       1
//      / \
//     2   3
//    / \
//   4   5
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

console.log('\n原始树结构：');
printTree(root);

// 克隆树
const clonedTree = cloneTree(root);

console.log('\n克隆树结构：');
printTree(clonedTree);

// 验证克隆是否成功
console.log('\n验证结果：');
console.log('两棵树结构相同：', isSameTree(root, clonedTree));
console.log('两棵树是不同对象：', root !== clonedTree);
console.log('根节点是不同对象：', root !== clonedTree);
console.log('左子树是不同对象：', root.left !== clonedTree.left);

// 修改原树，验证克隆树不受影响
console.log('\n修改原树后：');
root.val = 999;
console.log('原树根节点值：', root.val);
console.log('克隆树根节点值：', clonedTree.val);
console.log('克隆树未受影响：', clonedTree.val === 1);

console.log('\n=== 算法分析 ===');
console.log('时间复杂度：O(n) - 需要访问每个节点');
console.log('空间复杂度：O(h) - 递归栈深度，h为树的高度');
console.log('前序遍历优势：先创建根节点，符合构建树的自然顺序');
