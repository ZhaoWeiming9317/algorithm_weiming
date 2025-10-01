/**
 * 根据中序遍历构建二叉搜索树并进行层序遍历
 * 
 * 题目描述（推测）：
 * 给定一系列按中序遍历顺序的输入，构建二叉搜索树，
 * 然后按层序遍历的方式遍历并打印结果。
 * 
 * 关键理解：
 * 1. 中序遍历二叉搜索树的结果是有序的
 * 2. 可以通过递归分治的方法构建平衡的BST
 * 3. 然后用BFS进行层序遍历
 * 
 * 示例：
 * 输入：[1, 2, 3, 4, 5, 6, 7] (中序遍历序列)
 * 构建BST后层序遍历：[4, 2, 6, 1, 3, 5, 7]
 */

// 二叉树节点定义
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 方法1：根据有序数组构建平衡二叉搜索树
 * 时间复杂度：O(n)
 * 空间复杂度：O(log n) - 递归栈深度
 * 
 * @param {number[]} inorderArray - 中序遍历的有序数组
 * @return {TreeNode} - 构建的BST根节点
 */
export function buildBSTFromInorder(inorderArray) {
    if (!inorderArray || inorderArray.length === 0) {
        return null;
    }
    
    function buildTree(left, right) {
        if (left > right) {
            return null;
        }
        
        // 选择中间元素作为根节点，确保树的平衡
        const mid = Math.floor((left + right) / 2);
        const root = new TreeNode(inorderArray[mid]);
        
        // 递归构建左右子树
        root.left = buildTree(left, mid - 1);
        root.right = buildTree(mid + 1, right);
        
        return root;
    }
    
    return buildTree(0, inorderArray.length - 1);
}

/**
 * 层序遍历（BFS）
 * 时间复杂度：O(n)
 * 空间复杂度：O(w) - w是树的最大宽度
 * 
 * @param {TreeNode} root - 树的根节点
 * @return {number[]} - 层序遍历结果
 */
export function levelOrderTraversal(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node.val);
        
        if (node.left) {
            queue.push(node.left);
        }
        if (node.right) {
            queue.push(node.right);
        }
    }
    
    return result;
}

/**
 * 层序遍历（按层分组）
 * @param {TreeNode} root 
 * @return {number[][]} - 按层分组的结果
 */
export function levelOrderTraversalByLevels(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

/**
 * 主函数：完成整个流程
 * @param {number[]} inorderArray - 中序遍历输入
 * @return {number[]} - 层序遍历输出
 */
export function solveInorderToLevelOrder(inorderArray) {
    // 构建平衡BST
    const root = buildBSTFromInorder(inorderArray);
    
    // 进行层序遍历
    return levelOrderTraversal(root);
}

/**
 * 辅助函数：打印树的结构（用于调试）
 */
export function printTree(root, level = 0, prefix = "Root: ") {
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

/**
 * 验证是否为有效的BST
 */
export function isValidBST(root, min = -Infinity, max = Infinity) {
    if (!root) return true;
    
    if (root.val <= min || root.val >= max) {
        return false;
    }
    
    return isValidBST(root.left, min, root.val) && 
           isValidBST(root.right, root.val, max);
}

// 测试用例
console.log('=== 根据中序遍历构建BST并层序遍历 ===');

// 测试用例1：简单的有序数组
console.log('\n测试用例1：简单有序数组');
const test1 = [1, 2, 3, 4, 5, 6, 7];
console.log('输入（中序遍历）:', test1);

const tree1 = buildBSTFromInorder(test1);
console.log('构建的BST结构:');
printTree(tree1);

const levelOrder1 = levelOrderTraversal(tree1);
console.log('层序遍历结果:', levelOrder1);

const levelsByLevels1 = levelOrderTraversalByLevels(tree1);
console.log('按层分组结果:', levelsByLevels1);

console.log('是否为有效BST:', isValidBST(tree1));

// 测试用例2：单个元素
console.log('\n测试用例2：单个元素');
const test2 = [5];
const result2 = solveInorderToLevelOrder(test2);
console.log('输入:', test2);
console.log('输出:', result2);

// 测试用例3：两个元素
console.log('\n测试用例3：两个元素');
const test3 = [1, 2];
const tree3 = buildBSTFromInorder(test3);
console.log('输入:', test3);
console.log('构建的BST结构:');
printTree(tree3);
console.log('层序遍历:', levelOrderTraversal(tree3));

// 测试用例4：较大的数组
console.log('\n测试用例4：较大数组');
const test4 = [1, 3, 5, 7, 9, 11, 13, 15];
const result4 = solveInorderToLevelOrder(test4);
console.log('输入:', test4);
console.log('输出:', result4);

// 测试用例5：展示平衡BST的优势
console.log('\n测试用例5：平衡BST构建');
const test5 = [1, 2, 3, 4, 5];

console.log('输入:', test5);
console.log('✅ 使用平衡BST方法（推荐）');

const balancedTree = buildBSTFromInorder(test5);
console.log('\n构建的平衡BST结构:');
printTree(balancedTree);
console.log('层序遍历结果:', levelOrderTraversal(balancedTree));

console.log('\n平衡BST的优势:');
console.log('- 时间复杂度: O(n)');
console.log('- 树高度: O(log n)');
console.log('- 结构平衡，查找效率高');
console.log('- 代码简洁，易于理解');

// 测试用例6：空数组
console.log('\n测试用例6：边界情况');
console.log('空数组:', solveInorderToLevelOrder([]));
console.log('null输入:', solveInorderToLevelOrder(null));

console.log('\n=== 算法复杂度分析 ===');
console.log('构建平衡BST: 时间O(n), 空间O(log n)');
console.log('层序遍历: 时间O(n), 空间O(w) w为最大宽度');
console.log('总体: 时间O(n), 空间O(n)');
