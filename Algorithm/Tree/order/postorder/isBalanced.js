/**
 * 判断平衡二叉树 - 后序遍历应用
 * 
 * 题目：给定一个二叉树，判断它是否是高度平衡的二叉树
 * 
 * 平衡二叉树定义：
 * 一个二叉树每个节点的左右两个子树的高度差的绝对值不超过1
 * 
 * 后序遍历特点：左 → 右 → 根
 * 适合判断平衡性，因为需要先知道左右子树的高度和平衡性，
 * 才能判断当前节点是否平衡
 */

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 方法1：朴素递归（效率较低）
 * @param {TreeNode} root
 * @return {boolean}
 */
export function isBalanced_Naive(root) {
    if (!root) return true;
    
    // 计算左右子树高度
    const leftHeight = getHeight(root.left);
    const rightHeight = getHeight(root.right);
    
    // 检查当前节点是否平衡，以及左右子树是否平衡
    return Math.abs(leftHeight - rightHeight) <= 1 &&
           isBalanced_Naive(root.left) &&
           isBalanced_Naive(root.right);
}

/**
 * 辅助函数：计算树的高度
 */
function getHeight(root) {
    if (!root) return 0;
    return Math.max(getHeight(root.left), getHeight(root.right)) + 1;
}

/**
 * 方法2：优化的后序遍历（推荐）
 * @param {TreeNode} root
 * @return {boolean}
 */
export function isBalanced_Optimized(root) {
    function checkBalance(node) {
        if (!node) return 0; // 空节点高度为0
        
        // 后序遍历：先检查左右子树
        const leftHeight = checkBalance(node.left);
        if (leftHeight === -1) return -1; // 左子树不平衡
        
        const rightHeight = checkBalance(node.right);
        if (rightHeight === -1) return -1; // 右子树不平衡
        
        // 检查当前节点是否平衡
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1; // 当前节点不平衡
        }
        
        // 返回当前节点的高度
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    return checkBalance(root) !== -1;
}

/**
 * 方法3：使用对象返回多个值
 * @param {TreeNode} root
 * @return {boolean}
 */
export function isBalanced_Object(root) {
    function checkBalanceAndHeight(node) {
        if (!node) {
            return { isBalanced: true, height: 0 };
        }
        
        // 后序遍历：先检查左右子树
        const left = checkBalanceAndHeight(node.left);
        if (!left.isBalanced) return { isBalanced: false, height: 0 };
        
        const right = checkBalanceAndHeight(node.right);
        if (!right.isBalanced) return { isBalanced: false, height: 0 };
        
        // 检查当前节点是否平衡
        const heightDiff = Math.abs(left.height - right.height);
        const currentHeight = Math.max(left.height, right.height) + 1;
        
        return {
            isBalanced: heightDiff <= 1,
            height: currentHeight
        };
    }
    
    return checkBalanceAndHeight(root).isBalanced;
}

/**
 * 扩展：获取每个节点的平衡因子
 * @param {TreeNode} root
 * @return {Map} 节点值到平衡因子的映射
 */
export function getBalanceFactors(root) {
    const balanceFactors = new Map();
    
    function postorder(node) {
        if (!node) return 0;
        
        const leftHeight = postorder(node.left);
        const rightHeight = postorder(node.right);
        
        // 平衡因子 = 左子树高度 - 右子树高度
        const balanceFactor = leftHeight - rightHeight;
        balanceFactors.set(node.val, balanceFactor);
        
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    postorder(root);
    return balanceFactors;
}

/**
 * 扩展：找出所有不平衡的节点
 * @param {TreeNode} root
 * @return {Array} 不平衡节点的值数组
 */
export function findUnbalancedNodes(root) {
    const unbalancedNodes = [];
    
    function checkBalance(node) {
        if (!node) return 0;
        
        const leftHeight = checkBalance(node.left);
        const rightHeight = checkBalance(node.right);
        
        if (Math.abs(leftHeight - rightHeight) > 1) {
            unbalancedNodes.push(node.val);
        }
        
        return Math.max(leftHeight, rightHeight) + 1;
    }
    
    checkBalance(root);
    return unbalancedNodes;
}

/**
 * 创建测试树
 */
function createTestTrees() {
    // 平衡树1：完全二叉树
    //       3
    //      / \
    //     9   20
    //        /  \
    //       15   7
    const balancedTree1 = new TreeNode(3);
    balancedTree1.left = new TreeNode(9);
    balancedTree1.right = new TreeNode(20);
    balancedTree1.right.left = new TreeNode(15);
    balancedTree1.right.right = new TreeNode(7);
    
    // 平衡树2：满二叉树
    //       1
    //      / \
    //     2   3
    //    / \ / \
    //   4  5 6  7
    const balancedTree2 = new TreeNode(1);
    balancedTree2.left = new TreeNode(2);
    balancedTree2.right = new TreeNode(3);
    balancedTree2.left.left = new TreeNode(4);
    balancedTree2.left.right = new TreeNode(5);
    balancedTree2.right.left = new TreeNode(6);
    balancedTree2.right.right = new TreeNode(7);
    
    // 不平衡树1：左偏树
    //   1
    //  /
    // 2
    ///
    //3
    const unbalancedTree1 = new TreeNode(1);
    unbalancedTree1.left = new TreeNode(2);
    unbalancedTree1.left.left = new TreeNode(3);
    
    // 不平衡树2：复杂不平衡
    //       1
    //      / \
    //     2   3
    //    /
    //   4
    //  /
    // 5
    const unbalancedTree2 = new TreeNode(1);
    unbalancedTree2.left = new TreeNode(2);
    unbalancedTree2.right = new TreeNode(3);
    unbalancedTree2.left.left = new TreeNode(4);
    unbalancedTree2.left.left.left = new TreeNode(5);
    
    return { balancedTree1, balancedTree2, unbalancedTree1, unbalancedTree2 };
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
 * 可视化平衡信息
 */
function visualizeBalanceInfo(root) {
    if (!root) return;
    
    const balanceFactors = getBalanceFactors(root);
    const unbalancedNodes = findUnbalancedNodes(root);
    
    console.log('节点平衡因子信息：');
    console.log('节点值 | 平衡因子 | 状态');
    console.log('------|----------|------');
    
    function traverse(node) {
        if (!node) return;
        
        const factor = balanceFactors.get(node.val);
        const status = Math.abs(factor) <= 1 ? '平衡' : '不平衡';
        console.log(`  ${node.val}   |    ${factor}     | ${status}`);
        
        traverse(node.left);
        traverse(node.right);
    }
    
    traverse(root);
    
    if (unbalancedNodes.length > 0) {
        console.log('不平衡节点：', unbalancedNodes);
    }
}

// 测试用例
console.log('=== 判断平衡二叉树测试 ===');

const { balancedTree1, balancedTree2, unbalancedTree1, unbalancedTree2 } = createTestTrees();

// 测试平衡树1
console.log('\n测试用例1：平衡树（完全二叉树）');
printTree(balancedTree1);
console.log('朴素方法：', isBalanced_Naive(balancedTree1));
console.log('优化方法：', isBalanced_Optimized(balancedTree1));
console.log('对象方法：', isBalanced_Object(balancedTree1));
visualizeBalanceInfo(balancedTree1);

// 测试平衡树2
console.log('\n测试用例2：平衡树（满二叉树）');
printTree(balancedTree2);
console.log('优化方法：', isBalanced_Optimized(balancedTree2));
visualizeBalanceInfo(balancedTree2);

// 测试不平衡树1
console.log('\n测试用例3：不平衡树（左偏）');
printTree(unbalancedTree1);
console.log('朴素方法：', isBalanced_Naive(unbalancedTree1));
console.log('优化方法：', isBalanced_Optimized(unbalancedTree1));
console.log('对象方法：', isBalanced_Object(unbalancedTree1));
visualizeBalanceInfo(unbalancedTree1);

// 测试不平衡树2
console.log('\n测试用例4：不平衡树（复杂）');
printTree(unbalancedTree2);
console.log('优化方法：', isBalanced_Optimized(unbalancedTree2));
visualizeBalanceInfo(unbalancedTree2);

console.log('\n=== 算法分析 ===');
console.log('方法1 - 朴素递归：');
console.log('  时间复杂度：O(n²) - 每个节点都要计算高度');
console.log('  空间复杂度：O(n) - 递归栈');
console.log('  缺点：重复计算子树高度');

console.log('\n方法2 - 优化后序遍历：');
console.log('  时间复杂度：O(n) - 每个节点访问一次');
console.log('  空间复杂度：O(h) - 递归栈深度');
console.log('  优点：一次遍历，提前终止');

console.log('\n方法3 - 对象返回：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(h)');
console.log('  优点：代码清晰，易于理解');

console.log('\n后序遍历的优势：');
console.log('- 自底向上检查，符合平衡性的定义');
console.log('- 可以提前发现不平衡并终止');
console.log('- 一次遍历同时获得高度和平衡性信息');
