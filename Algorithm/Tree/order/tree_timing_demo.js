/**
 * 二叉树遍历：处理时机的本质
 * 为什么前序在前、中序在中、后序在后？
 */

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 创建测试树
//       1
//      / \
//     2   3
//    / \
//   4   5
function createTestTree() {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    return root;
}

console.log('=== 二叉树遍历：处理时机的本质 ===\n');

// ==================== 例子1：构建新树（前序的优势）====================
console.log('例子1：构建新树 - 为什么前序遍历适合？');

/**
 * 前序遍历：先处理根，再处理子树
 * 这样可以先创建父节点，再创建子节点
 */
function cloneTreePreorder(root) {
    if (!root) return null;
    
    // 🔥 在递归前处理：先创建当前节点
    console.log(`创建节点 ${root.val}`);
    const newNode = new TreeNode(root.val);
    
    // 然后递归创建子树
    newNode.left = cloneTreePreorder(root.left);
    newNode.right = cloneTreePreorder(root.right);
    
    return newNode;
}

/**
 * 如果用后序遍历克隆会怎样？
 */
function cloneTreePostorder(root) {
    if (!root) return null;
    
    // 先递归处理子树
    const leftChild = cloneTreePostorder(root.left);
    const rightChild = cloneTreePostorder(root.right);
    
    // 🔥 在递归后处理：最后创建当前节点
    console.log(`创建节点 ${root.val}`);
    const newNode = new TreeNode(root.val);
    newNode.left = leftChild;
    newNode.right = rightChild;
    
    return newNode;
}

const tree1 = createTestTree();
console.log('前序遍历克隆（自顶向下）:');
cloneTreePreorder(tree1);

console.log('\n后序遍历克隆（自底向上）:');
cloneTreePostorder(tree1);

console.log('\n' + '='.repeat(50) + '\n');

// ==================== 例子2：计算树高度（后序的优势）====================
console.log('例子2：计算树高度 - 为什么后序遍历适合？');

/**
 * 后序遍历：先处理子树，再处理根
 * 需要先知道子树高度，才能计算当前节点高度
 */
function getHeightPostorder(root) {
    if (!root) return 0;
    
    // 🔥 先递归获取子树高度
    const leftHeight = getHeightPostorder(root.left);
    const rightHeight = getHeightPostorder(root.right);
    
    // 🔥 在递归后处理：基于子树高度计算当前高度
    const currentHeight = Math.max(leftHeight, rightHeight) + 1;
    console.log(`节点 ${root.val}: 左子树高度=${leftHeight}, 右子树高度=${rightHeight}, 当前高度=${currentHeight}`);
    
    return currentHeight;
}

/**
 * 如果用前序遍历计算高度会怎样？（不可行）
 */
function getHeightPreorder(root, currentDepth = 1) {
    if (!root) return 0;
    
    // 🔥 在递归前处理：只能知道当前深度，不知道最终高度
    console.log(`节点 ${root.val}: 当前深度=${currentDepth}`);
    
    // 无法在这里确定最终高度，因为还没遍历子树
    const leftHeight = getHeightPreorder(root.left, currentDepth + 1);
    const rightHeight = getHeightPreorder(root.right, currentDepth + 1);
    
    return Math.max(leftHeight, rightHeight, currentDepth);
}

const tree2 = createTestTree();
console.log('后序遍历计算高度（自底向上汇聚信息）:');
const height1 = getHeightPostorder(tree2);
console.log(`树的总高度: ${height1}\n`);

console.log('前序遍历计算高度（只能知道深度，不够优雅）:');
const height2 = getHeightPreorder(tree2);
console.log(`树的总高度: ${height2}`);

console.log('\n' + '='.repeat(50) + '\n');

// ==================== 例子3：BST中序遍历（中序的优势）====================
console.log('例子3：BST验证 - 为什么中序遍历适合？');

// 创建BST
//       4
//      / \
//     2   6
//    / \ / \
//   1  3 5  7
function createBST() {
    const root = new TreeNode(4);
    root.left = new TreeNode(2);
    root.right = new TreeNode(6);
    root.left.left = new TreeNode(1);
    root.left.right = new TreeNode(3);
    root.right.left = new TreeNode(5);
    root.right.right = new TreeNode(7);
    return root;
}

/**
 * 中序遍历：左 → 根 → 右
 * 对于BST，这样遍历得到的是有序序列
 */
function validateBSTInorder(root) {
    const result = [];
    
    function inorder(node) {
        if (!node) return;
        
        // 先处理左子树
        inorder(node.left);
        
        // 🔥 在中间处理：访问根节点
        console.log(`访问节点 ${node.val}`);
        result.push(node.val);
        
        // 再处理右子树
        inorder(node.right);
    }
    
    inorder(root);
    
    // 检查是否有序
    for (let i = 1; i < result.length; i++) {
        if (result[i] <= result[i-1]) {
            return false;
        }
    }
    return true;
}

/**
 * 如果用前序遍历验证BST？
 */
function validateBSTPreorder(root, min = -Infinity, max = Infinity) {
    if (!root) return true;
    
    // 🔥 在递归前处理：检查当前节点
    console.log(`检查节点 ${root.val}, 范围: (${min}, ${max})`);
    if (root.val <= min || root.val >= max) {
        return false;
    }
    
    // 递归检查子树
    return validateBSTPreorder(root.left, min, root.val) &&
           validateBSTPreorder(root.right, root.val, max);
}

const bst = createBST();
console.log('中序遍历验证BST（利用有序性）:');
const isValid1 = validateBSTInorder(bst);
console.log(`BST有效: ${isValid1}\n`);

console.log('前序遍历验证BST（需要传递边界信息）:');
const isValid2 = validateBSTPreorder(bst);
console.log(`BST有效: ${isValid2}`);

console.log('\n' + '='.repeat(50) + '\n');

// ==================== 核心总结 ====================
console.log('🎯 为什么处理时机不同？');
console.log('');
console.log('🔥 前序遍历（递归前处理）:');
console.log('- 时机：根 → 左 → 右');
console.log('- 特点：自顶向下，先有父节点，再有子节点');
console.log('- 适用：构建、复制、序列化等需要"先确定根"的场景');
console.log('- 本质：信息从根向叶子传递');
console.log('');
console.log('🔥 中序遍历（递归中处理）:');
console.log('- 时机：左 → 根 → 右');
console.log('- 特点：利用左子树信息，处理根，为右子树准备');
console.log('- 适用：BST操作，需要有序访问的场景');
console.log('- 本质：按照某种顺序（如大小顺序）处理节点');
console.log('');
console.log('🔥 后序遍历（递归后处理）:');
console.log('- 时机：左 → 右 → 根');
console.log('- 特点：自底向上，先有子节点信息，再处理父节点');
console.log('- 适用：计算属性、删除、验证等需要"汇聚子树信息"的场景');
console.log('- 本质：信息从叶子向根汇聚');
console.log('');
console.log('💡 总结：处理时机决定了信息流向！');
console.log('- 前序：信息向下流（父→子）');
console.log('- 中序：信息按序流（左→根→右）');
console.log('- 后序：信息向上流（子→父）');
