/**
 * 验证二叉搜索树 - 中序遍历应用
 * 
 * 题目：给定一个二叉树，判断其是否是一个有效的二叉搜索树
 * 
 * BST定义：
 * - 节点的左子树只包含小于当前节点的数
 * - 节点的右子树只包含大于当前节点的数
 * - 所有左子树和右子树自身必须也是二叉搜索树
 * 
 * 中序遍历特点：BST的中序遍历结果是严格递增的有序序列
 */

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 方法1：中序遍历 + 数组存储
 * @param {TreeNode} root
 * @return {boolean}
 */
export function isValidBST_Array(root) {
    const inorderResult = [];
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        inorderResult.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    
    // 检查数组是否严格递增
    for (let i = 1; i < inorderResult.length; i++) {
        if (inorderResult[i] <= inorderResult[i - 1]) {
            return false;
        }
    }
    
    return true;
}

/**
 * 方法2：中序遍历 + 前驱节点比较（优化空间）
 * @param {TreeNode} root
 * @return {boolean}
 */
export function isValidBST_Optimized(root) {
    let prev = null;
    
    function inorder(node) {
        if (!node) return true;
        
        // 递归检查左子树
        if (!inorder(node.left)) return false;
        
        // 检查当前节点
        if (prev !== null && node.val <= prev) {
            return false;
        }
        prev = node.val;
        
        // 递归检查右子树
        return inorder(node.right);
    }
    
    return inorder(root);
}

/**
 * 方法3：递归 + 边界检查（经典方法）
 * @param {TreeNode} root
 * @return {boolean}
 */
export function isValidBST_Bounds(root) {
    function validate(node, min, max) {
        if (!node) return true;
        
        if (node.val <= min || node.val >= max) {
            return false;
        }
        
        return validate(node.left, min, node.val) && 
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}

/**
 * 方法4：迭代中序遍历
 * @param {TreeNode} root
 * @return {boolean}
 */
export function isValidBST_Iterative(root) {
    const stack = [];
    let current = root;
    let prev = null;
    
    while (stack.length > 0 || current) {
        // 一直往左走
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // 处理栈顶节点
        current = stack.pop();
        
        // 检查中序遍历的顺序
        if (prev !== null && current.val <= prev) {
            return false;
        }
        prev = current.val;
        
        // 转向右子树
        current = current.right;
    }
    
    return true;
}

/**
 * 辅助函数：创建测试树
 */
function createTestTrees() {
    // 有效BST: 
    //     5
    //    / \
    //   3   8
    //  / \ / \
    // 2  4 7  9
    const validBST = new TreeNode(5);
    validBST.left = new TreeNode(3);
    validBST.right = new TreeNode(8);
    validBST.left.left = new TreeNode(2);
    validBST.left.right = new TreeNode(4);
    validBST.right.left = new TreeNode(7);
    validBST.right.right = new TreeNode(9);
    
    // 无效BST:
    //     5
    //    / \
    //   3   8
    //  / \ / \
    // 2  6 7  9  (6 > 5，违反BST性质)
    const invalidBST = new TreeNode(5);
    invalidBST.left = new TreeNode(3);
    invalidBST.right = new TreeNode(8);
    invalidBST.left.left = new TreeNode(2);
    invalidBST.left.right = new TreeNode(6); // 错误：6 > 5
    invalidBST.right.left = new TreeNode(7);
    invalidBST.right.right = new TreeNode(9);
    
    // 边界情况：单节点
    const singleNode = new TreeNode(1);
    
    // 边界情况：空树
    const emptyTree = null;
    
    return { validBST, invalidBST, singleNode, emptyTree };
}

/**
 * 打印树结构
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

/**
 * 获取中序遍历结果（用于验证）
 */
function getInorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (!node) return;
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}

// 测试用例
console.log('=== 验证二叉搜索树测试 ===');

const { validBST, invalidBST, singleNode, emptyTree } = createTestTrees();

// 测试有效BST
console.log('\n测试用例1：有效BST');
printTree(validBST);
console.log('中序遍历结果：', getInorderTraversal(validBST));
console.log('方法1（数组）：', isValidBST_Array(validBST));
console.log('方法2（优化）：', isValidBST_Optimized(validBST));
console.log('方法3（边界）：', isValidBST_Bounds(validBST));
console.log('方法4（迭代）：', isValidBST_Iterative(validBST));

// 测试无效BST
console.log('\n测试用例2：无效BST');
printTree(invalidBST);
console.log('中序遍历结果：', getInorderTraversal(invalidBST));
console.log('方法1（数组）：', isValidBST_Array(invalidBST));
console.log('方法2（优化）：', isValidBST_Optimized(invalidBST));
console.log('方法3（边界）：', isValidBST_Bounds(invalidBST));
console.log('方法4（迭代）：', isValidBST_Iterative(invalidBST));

// 测试边界情况
console.log('\n测试用例3：单节点');
console.log('方法2结果：', isValidBST_Optimized(singleNode));

console.log('\n测试用例4：空树');
console.log('方法2结果：', isValidBST_Optimized(emptyTree));

console.log('\n=== 算法分析 ===');
console.log('方法1 - 中序遍历+数组：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(n) - 存储中序遍历结果');

console.log('方法2 - 中序遍历+前驱比较：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(h) - 递归栈深度');

console.log('方法3 - 递归+边界检查：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(h) - 递归栈深度');

console.log('方法4 - 迭代中序遍历：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(h) - 显式栈');

console.log('\n中序遍历的优势：');
console.log('- BST的中序遍历天然有序');
console.log('- 只需检查相邻元素的大小关系');
console.log('- 直观易懂，符合BST的定义');
