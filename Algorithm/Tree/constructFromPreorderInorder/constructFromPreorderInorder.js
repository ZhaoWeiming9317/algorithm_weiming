/**
 * 根据前序遍历和中序遍历构建二叉树
 * 
 * 🎯 核心思路（一句话总结）：
 * 利用前序遍历或后序遍历获取根节点，利用中序遍历来分治
 * 
 * 详细说明：
 * - 前序遍历：根 → 左 → 右（第一个元素是根）
 * - 中序遍历：左 → 根 → 右（根节点分割左右子树）
 * - 后序遍历：左 → 右 → 根（最后一个元素是根）
 * 
 * 算法步骤：
 * 1. 从前序/后序中确定根节点
 * 2. 在中序中找到根节点位置，分割左右子树
 * 3. 递归处理左右子树
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
 * 演示：为什么单个中序遍历不能唯一确定二叉树
 */
function demonstrateWhySingleInorderIsNotEnough() {
    console.log('=== 为什么单个中序遍历不够？ ===');
    console.log('\n问题：同一个中序遍历可以对应多种不同的二叉树结构');
    
    // 中序遍历都是 [1, 2, 3] 的不同二叉树
    console.log('\n中序遍历序列：[1, 2, 3]');
    console.log('可能的二叉树结构：');
    
    console.log('\n树1：');
    console.log('    2');
    console.log('   / \\');
    console.log('  1   3');
    
    console.log('\n树2：');
    console.log('  1');
    console.log('   \\');
    console.log('    2');
    console.log('     \\');
    console.log('      3');
    
    console.log('\n树3：');
    console.log('      3');
    console.log('     /');
    console.log('    2');
    console.log('   /');
    console.log('  1');
    
    console.log('\n树4：');
    console.log('    1');
    console.log('     \\');
    console.log('      3');
    console.log('     /');
    console.log('    2');
    
    console.log('\n树5：');
    console.log('      3');
    console.log('     /');
    console.log('    1');
    console.log('     \\');
    console.log('      2');
    
    console.log('\n所有这些树的中序遍历都是 [1, 2, 3]！');
    console.log('所以单个中序遍历无法唯一确定树的结构。');
}

/**
 * 根据前序遍历和中序遍历构建二叉树
 * 
 * 核心思路：
 * 1. 前序遍历的第一个元素一定是根节点
 * 2. 在中序遍历中找到根节点的位置，可以分割左右子树
 * 3. 递归处理左右子树
 * 
 * @param {number[]} preorder - 前序遍历序列
 * @param {number[]} inorder - 中序遍历序列
 * @return {TreeNode} - 构建的二叉树根节点
 */
export function buildTreeFromPreorderInorder(preorder, inorder) {
    if (!preorder || !inorder || preorder.length === 0 || inorder.length === 0) {
        return null;
    }
    
    // 创建中序遍历的值到索引的映射，提高查找效率
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }
    
    let preorderIndex = 0;
    
    function buildTree(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) {
            return null;
        }
        
        // 前序遍历的当前元素就是当前子树的根节点
        const rootVal = preorder[preorderIndex++];
        const root = new TreeNode(rootVal);
        
        // 在中序遍历中找到根节点的位置
        const rootIndex = inorderMap.get(rootVal);
        
        // 先构建左子树，再构建右子树（前序遍历的顺序）
        root.left = buildTree(inorderStart, rootIndex - 1);
        root.right = buildTree(rootIndex + 1, inorderEnd);
        
        return root;
    }
    
    return buildTree(0, inorder.length - 1);
}

/**
 * 根据后序遍历和中序遍历构建二叉树
 */
export function buildTreeFromPostorderInorder(postorder, inorder) {
    if (!postorder || !inorder || postorder.length === 0 || inorder.length === 0) {
        return null;
    }
    
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }
    
    let postorderIndex = postorder.length - 1;
    
    function buildTree(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) {
            return null;
        }
        
        // 后序遍历从后往前取元素
        const rootVal = postorder[postorderIndex--];
        const root = new TreeNode(rootVal);
        
        const rootIndex = inorderMap.get(rootVal);
        
        // 关键：后序遍历要先构建右子树，再构建左子树
        // 为什么？因为postorderIndex是从后往前消费的！
        root.right = buildTree(rootIndex + 1, inorderEnd);
        root.left = buildTree(inorderStart, rootIndex - 1);
        
        return root;
    }
    
    return buildTree(0, inorder.length - 1);
}

/**
 * 辅助函数：获取树的遍历序列
 */
function getPreorder(root) {
    if (!root) return [];
    return [root.val, ...getPreorder(root.left), ...getPreorder(root.right)];
}

function getInorder(root) {
    if (!root) return [];
    return [...getInorder(root.left), root.val, ...getInorder(root.right)];
}

function getPostorder(root) {
    if (!root) return [];
    return [...getPostorder(root.left), ...getPostorder(root.right), root.val];
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
 * 演示：为什么后序遍历必须先构建右子树
 */
function demonstrateWhyPostorderOrderMatters() {
    console.log('\n=== 为什么后序遍历构建顺序很重要？ ===');
    
    // 示例树结构
    console.log('示例树：');
    console.log('    3');
    console.log('   / \\');
    console.log('  9   20');
    console.log('     / \\');
    console.log('    15  7');
    
    const postorder = [9, 15, 7, 20, 3];
    const inorder = [9, 3, 15, 20, 7];
    
    console.log('\n后序遍历:', postorder);
    console.log('中序遍历:', inorder);
    
    console.log('\n后序遍历的特点：左 → 右 → 根');
    console.log('所以从后往前读取：根 → 右 → 左');
    
    console.log('\n模拟构建过程：');
    console.log('postorderIndex 从后往前消费：');
    
    let index = postorder.length - 1;
    console.log(`步骤1: postorder[${index}--] → 先取值${postorder[index]}，再减1 → index变为${index-1}`);
    index--;
    
    console.log('步骤2: 构建右子树 (20)');
    console.log(`  postorder[${index}--] → 先取值${postorder[index]}，再减1 → index变为${index-1}`);
    index--;
    
    console.log('步骤3: 构建20的右子树 (7)');
    console.log(`  postorder[${index}--] → 先取值${postorder[index]}，再减1 → index变为${index-1}`);
    index--;
    
    console.log('步骤4: 构建20的左子树 (15)');
    console.log(`  postorder[${index}--] → 先取值${postorder[index]}，再减1 → index变为${index-1}`);
    index--;
    
    console.log('步骤5: 构建3的左子树 (9)');
    console.log(`  postorder[${index}--] → 先取值${postorder[index]}，再减1 → index变为${index-1}`);
    
    console.log('\n关键理解：');
    console.log('postorder[postorderIndex--] 是先取值，再减1');
    console.log('这样每次都能正确获取当前需要的节点值');
    
    console.log('\n如果先构建左子树会怎样？');
    console.log('❌ 错误顺序：先左后右');
    console.log('会导致索引消费错乱，构建出错误的树！');
    
    console.log('\n✅ 正确顺序：先右后左');
    console.log('符合后序遍历从后往前的消费模式');
}

/**
 * 演示前缀和后缀运算符的区别
 */
function demonstratePrefixPostfixOperators() {
    console.log('\n=== 前缀 vs 后缀运算符 ===');
    
    console.log('测试 postorderIndex-- (后缀递减)：');
    let postorderIndex1 = 4;
    const arr = [9, 15, 7, 20, 3];
    
    console.log(`初始 postorderIndex1 = ${postorderIndex1}`);
    console.log(`arr[postorderIndex1--] = arr[${postorderIndex1}--]`);
    
    const val1 = arr[postorderIndex1--];
    console.log(`取到的值: ${val1}`);
    console.log(`执行后 postorderIndex1 = ${postorderIndex1}`);
    
    console.log('\n测试 --postorderIndex (前缀递减)：');
    let postorderIndex2 = 4;
    
    console.log(`初始 postorderIndex2 = ${postorderIndex2}`);
    console.log(`arr[--postorderIndex2] = arr[--${postorderIndex2}]`);
    
    const val2 = arr[--postorderIndex2];
    console.log(`取到的值: ${val2}`);
    console.log(`执行后 postorderIndex2 = ${postorderIndex2}`);
    
    console.log('\n结论：');
    console.log('- postorderIndex-- : 先用当前值，再减1');
    console.log('- --postorderIndex : 先减1，再用新值');
    console.log('- 对于后序遍历，我们需要先用当前值！');
}

/**
 * 对比前序和后序的构建顺序
 */
function comparePreorderPostorderOrder() {
    console.log('\n=== 前序 vs 后序构建顺序对比 ===');
    
    console.log('前序遍历：根 → 左 → 右');
    console.log('- 从前往后消费：preorderIndex++');
    console.log('- 构建顺序：先左后右 ✅');
    console.log('- 代码：root.left = ...; root.right = ...;');
    
    console.log('\n后序遍历：左 → 右 → 根');
    console.log('- 从后往前消费：postorderIndex--');
    console.log('- 构建顺序：先右后左 ✅');
    console.log('- 代码：root.right = ...; root.left = ...;');
    
    console.log('\n核心原理：');
    console.log('构建顺序必须与遍历序列的消费方向一致！');
}

/**
 * 演示错误顺序的后果
 */
function demonstrateWrongOrder() {
    console.log('\n=== 演示：错误顺序的后果 ===');
    
    // 创建一个错误版本的函数来对比
    function buildTreeFromPostorderInorderWrong(postorder, inorder) {
        const inorderMap = new Map();
        for (let i = 0; i < inorder.length; i++) {
            inorderMap.set(inorder[i], i);
        }
        
        let postorderIndex = postorder.length - 1;
        
        function buildTree(inorderStart, inorderEnd) {
            if (inorderStart > inorderEnd) {
                return null;
            }
            
            const rootVal = postorder[postorderIndex--];
            const root = new TreeNode(rootVal);
            const rootIndex = inorderMap.get(rootVal);
            
            // 错误：先构建左子树，再构建右子树
            root.left = buildTree(inorderStart, rootIndex - 1);
            root.right = buildTree(rootIndex + 1, inorderEnd);
            
            return root;
        }
        
        return buildTree(0, inorder.length - 1);
    }
    
    const postorder = [9, 15, 7, 20, 3];
    const inorder = [9, 3, 15, 20, 7];
    
    console.log('输入：');
    console.log('后序遍历:', postorder);
    console.log('中序遍历:', inorder);
    
    try {
        console.log('\n尝试用错误顺序构建...');
        const wrongTree = buildTreeFromPostorderInorderWrong(postorder, inorder);
        console.log('错误构建的树：');
        printTree(wrongTree);
        
        console.log('\n验证遍历序列：');
        console.log('后序遍历:', getPostorder(wrongTree));
        console.log('预期后序:', postorder);
        console.log('结果正确？', JSON.stringify(getPostorder(wrongTree)) === JSON.stringify(postorder));
        
    } catch (error) {
        console.log('构建失败！', error.message);
    }
}

/**
 * 演示不同遍历组合的效果
 */
function demonstrateTraversalCombinations() {
    console.log('\n=== 不同遍历组合的效果 ===');
    
    // 测试数据
    const preorder = [3, 9, 20, 15, 7];
    const inorder = [9, 3, 15, 20, 7];
    const postorder = [9, 15, 7, 20, 3];
    
    console.log('\n给定遍历序列：');
    console.log('前序遍历:', preorder);
    console.log('中序遍历:', inorder);
    console.log('后序遍历:', postorder);
    
    // 用前序+中序构建
    console.log('\n=== 用前序+中序构建二叉树 ===');
    const tree1 = buildTreeFromPreorderInorder(preorder, inorder);
    printTree(tree1);
    
    console.log('\n验证遍历序列：');
    console.log('前序遍历:', getPreorder(tree1));
    console.log('中序遍历:', getInorder(tree1));
    console.log('后序遍历:', getPostorder(tree1));
    
    // 用后序+中序构建
    console.log('\n=== 用后序+中序构建二叉树 ===');
    const tree2 = buildTreeFromPostorderInorder(postorder, inorder);
    printTree(tree2);
    
    console.log('\n验证遍历序列：');
    console.log('前序遍历:', getPreorder(tree2));
    console.log('中序遍历:', getInorder(tree2));
    console.log('后序遍历:', getPostorder(tree2));
    
    console.log('\n结论：两种方法构建出相同的树！');
}

/**
 * 解释为什么某些组合不行
 */
function explainWhyCertainCombinationsDontWork() {
    console.log('\n=== 为什么某些遍历组合不行？ ===');
    
    console.log('\n✅ 可行的组合：');
    console.log('1. 前序 + 中序');
    console.log('2. 后序 + 中序');
    console.log('3. 层序 + 中序');
    
    console.log('\n❌ 不可行的组合：');
    console.log('1. 前序 + 后序（无法确定左右子树边界）');
    console.log('2. 单独的前序遍历');
    console.log('3. 单独的后序遍历');
    console.log('4. 单独的层序遍历');
    
    console.log('\n核心原理：');
    console.log('- 中序遍历提供了左右子树的分割信息');
    console.log('- 前序/后序/层序遍历提供了根节点的信息');
    console.log('- 两者结合才能唯一确定树的结构');
    
    console.log('\n特殊情况：');
    console.log('- 如果是二叉搜索树，单个中序遍历可以构建平衡BST');
    console.log('- 但这不是唯一的，只是一种特定的构建方式');
}

// 运行演示
demonstrateWhySingleInorderIsNotEnough();
demonstrateWhyPostorderOrderMatters();
demonstratePrefixPostfixOperators();
comparePreorderPostorderOrder();
demonstrateWrongOrder();
demonstrateTraversalCombinations();
explainWhyCertainCombinationsDontWork();

console.log('\n=== 总结 ===');
console.log('为什么需要两个遍历序列：');
console.log('1. 单个遍历序列信息不足，无法唯一确定树结构');
console.log('2. 中序遍历提供左右子树分割信息');
console.log('3. 前序/后序遍历提供根节点位置信息');
console.log('4. 两者结合可以递归构建整棵树');
console.log('5. BST的特殊性：可以用单个中序构建平衡树，但不唯一');
