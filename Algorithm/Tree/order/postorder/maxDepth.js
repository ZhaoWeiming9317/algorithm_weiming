/**
 * 计算二叉树的最大深度 - 后序遍历应用
 * 
 * 题目：给定一个二叉树，找出其最大深度
 * 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数
 * 
 * 后序遍历特点：左 → 右 → 根
 * 适合计算树的高度，因为需要先知道左右子树的高度，才能计算当前节点的高度
 */

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 方法1：递归后序遍历（经典方法）
 * @param {TreeNode} root
 * @return {number}
 */
export function maxDepth_Recursive(root) {
    if (!root) return 0;
    
    // 后序遍历：先计算左右子树的深度
    const leftDepth = maxDepth_Recursive(root.left);
    const rightDepth = maxDepth_Recursive(root.right);
    
    // 当前节点的深度 = max(左子树深度, 右子树深度) + 1
    return Math.max(leftDepth, rightDepth) + 1;
}

/**
 * 方法2：迭代 + 层序遍历（BFS）
 * @param {TreeNode} root
 * @return {number}
 */
export function maxDepth_BFS(root) {
    if (!root) return 0;
    
    const queue = [root];
    let depth = 0;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        depth++;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return depth;
}

/**
 * 方法3：迭代 + 深度优先搜索（DFS）
 * @param {TreeNode} root
 * @return {number}
 */
export function maxDepth_DFS(root) {
    if (!root) return 0;
    
    const stack = [[root, 1]]; // [节点, 当前深度]
    let maxDepth = 0;
    
    while (stack.length > 0) {
        const [node, depth] = stack.pop();
        maxDepth = Math.max(maxDepth, depth);
        
        if (node.left) stack.push([node.left, depth + 1]);
        if (node.right) stack.push([node.right, depth + 1]);
    }
    
    return maxDepth;
}

/**
 * 扩展：计算二叉树的最小深度
 * @param {TreeNode} root
 * @return {number}
 */
export function minDepth(root) {
    if (!root) return 0;
    
    // 如果是叶子节点
    if (!root.left && !root.right) return 1;
    
    let minDepth = Infinity;
    
    // 只考虑存在的子树
    if (root.left) {
        minDepth = Math.min(minDepth, minDepth(root.left));
    }
    if (root.right) {
        minDepth = Math.min(minDepth, minDepth(root.right));
    }
    
    return minDepth + 1;
}

/**
 * 扩展：计算每个节点的深度
 * @param {TreeNode} root
 * @return {Map} 节点值到深度的映射
 */
export function getNodeDepths(root) {
    const depths = new Map();
    
    function dfs(node, depth) {
        if (!node) return;
        
        depths.set(node.val, depth);
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
    
    dfs(root, 1);
    return depths;
}

/**
 * 扩展：计算每个节点的高度（到叶子节点的最大距离）
 * @param {TreeNode} root
 * @return {Map} 节点值到高度的映射
 */
export function getNodeHeights(root) {
    const heights = new Map();
    
    function postorder(node) {
        if (!node) return 0;
        
        // 后序遍历：先计算子树高度
        const leftHeight = postorder(node.left);
        const rightHeight = postorder(node.right);
        
        // 当前节点高度
        const height = Math.max(leftHeight, rightHeight) + 1;
        heights.set(node.val, height);
        
        return height;
    }
    
    postorder(root);
    return heights;
}

/**
 * 创建测试树
 */
function createTestTrees() {
    // 测试树1：完全二叉树
    //       3
    //      / \
    //     9   20
    //        /  \
    //       15   7
    const tree1 = new TreeNode(3);
    tree1.left = new TreeNode(9);
    tree1.right = new TreeNode(20);
    tree1.right.left = new TreeNode(15);
    tree1.right.right = new TreeNode(7);
    
    // 测试树2：不平衡树
    //   1
    //    \
    //     2
    //      \
    //       3
    //        \
    //         4
    const tree2 = new TreeNode(1);
    tree2.right = new TreeNode(2);
    tree2.right.right = new TreeNode(3);
    tree2.right.right.right = new TreeNode(4);
    
    // 测试树3：单节点
    const tree3 = new TreeNode(1);
    
    // 测试树4：空树
    const tree4 = null;
    
    return { tree1, tree2, tree3, tree4 };
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
 * 可视化深度信息
 */
function visualizeDepthInfo(root) {
    if (!root) return;
    
    const nodeDepths = getNodeDepths(root);
    const nodeHeights = getNodeHeights(root);
    
    console.log('节点深度和高度信息：');
    console.log('节点值 | 深度 | 高度');
    console.log('------|------|------');
    
    function traverse(node) {
        if (!node) return;
        
        const depth = nodeDepths.get(node.val);
        const height = nodeHeights.get(node.val);
        console.log(`  ${node.val}   |  ${depth}   |  ${height}`);
        
        traverse(node.left);
        traverse(node.right);
    }
    
    traverse(root);
}

// 测试用例
console.log('=== 二叉树最大深度测试 ===');

const { tree1, tree2, tree3, tree4 } = createTestTrees();

// 测试树1
console.log('\n测试用例1：完全二叉树');
printTree(tree1);
console.log('递归方法：', maxDepth_Recursive(tree1));
console.log('BFS方法：', maxDepth_BFS(tree1));
console.log('DFS方法：', maxDepth_DFS(tree1));
console.log('最小深度：', minDepth(tree1));
visualizeDepthInfo(tree1);

// 测试树2
console.log('\n测试用例2：不平衡树');
printTree(tree2);
console.log('递归方法：', maxDepth_Recursive(tree2));
console.log('BFS方法：', maxDepth_BFS(tree2));
console.log('DFS方法：', maxDepth_DFS(tree2));
console.log('最小深度：', minDepth(tree2));
visualizeDepthInfo(tree2);

// 测试树3
console.log('\n测试用例3：单节点');
printTree(tree3);
console.log('递归方法：', maxDepth_Recursive(tree3));

// 测试树4
console.log('\n测试用例4：空树');
console.log('递归方法：', maxDepth_Recursive(tree4));

console.log('\n=== 算法分析 ===');
console.log('方法1 - 递归后序遍历：');
console.log('  时间复杂度：O(n) - 访问每个节点一次');
console.log('  空间复杂度：O(h) - 递归栈深度，h为树高');
console.log('  优点：代码简洁，符合后序遍历的自然思维');

console.log('\n方法2 - BFS层序遍历：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(w) - w为树的最大宽度');
console.log('  优点：可以提前终止，适合求最小深度');

console.log('\n方法3 - DFS迭代：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(n) - 显式栈');
console.log('  优点：避免递归，可控制栈大小');

console.log('\n后序遍历的优势：');
console.log('- 自底向上计算，符合树高度的定义');
console.log('- 子树信息向根节点汇聚');
console.log('- 一次遍历即可得到结果');
