/**
 * BST中第K小的元素 - 中序遍历应用
 * 
 * 题目：给定一个二叉搜索树的根节点root和一个整数k，
 * 请找出其中第k个最小的元素（1 ≤ k ≤ BST中元素的个数）
 * 
 * 中序遍历特点：BST的中序遍历结果是有序的，
 * 所以第k小的元素就是中序遍历的第k个元素
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
 * @param {number} k
 * @return {number}
 */
export function kthSmallest_Array(root, k) {
    const inorderResult = [];
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        inorderResult.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return inorderResult[k - 1]; // 第k小是索引k-1
}

/**
 * 方法2：中序遍历 + 计数器（优化，提前终止）
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
export function kthSmallest_Counter(root, k) {
    let count = 0;
    let result = null;
    
    function inorder(node) {
        if (!node || result !== null) return;
        
        inorder(node.left);
        
        count++;
        if (count === k) {
            result = node.val;
            return;
        }
        
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}

/**
 * 方法3：迭代中序遍历
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
export function kthSmallest_Iterative(root, k) {
    const stack = [];
    let current = root;
    let count = 0;
    
    while (stack.length > 0 || current) {
        // 一直往左走
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // 处理栈顶节点
        current = stack.pop();
        count++;
        
        if (count === k) {
            return current.val;
        }
        
        // 转向右子树
        current = current.right;
    }
    
    return -1; // 不应该到达这里
}

/**
 * 方法4：Morris中序遍历（O(1)空间复杂度）
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
export function kthSmallest_Morris(root, k) {
    let current = root;
    let count = 0;
    
    while (current) {
        if (!current.left) {
            // 没有左子树，访问当前节点
            count++;
            if (count === k) {
                return current.val;
            }
            current = current.right;
        } else {
            // 有左子树，找到前驱节点
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                // 建立线索
                predecessor.right = current;
                current = current.left;
            } else {
                // 恢复树结构，访问当前节点
                predecessor.right = null;
                count++;
                if (count === k) {
                    return current.val;
                }
                current = current.right;
            }
        }
    }
    
    return -1;
}

/**
 * 扩展：找第K大的元素（反向中序遍历）
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
export function kthLargest(root, k) {
    let count = 0;
    let result = null;
    
    function reverseInorder(node) {
        if (!node || result !== null) return;
        
        reverseInorder(node.right);  // 先右子树
        
        count++;
        if (count === k) {
            result = node.val;
            return;
        }
        
        reverseInorder(node.left);   // 后左子树
    }
    
    reverseInorder(root);
    return result;
}

/**
 * 创建测试BST
 */
function createTestBST() {
    //       5
    //      / \
    //     3   7
    //    / \ / \
    //   2  4 6  8
    //  /
    // 1
    // 中序遍历：[1, 2, 3, 4, 5, 6, 7, 8]
    const root = new TreeNode(5);
    root.left = new TreeNode(3);
    root.right = new TreeNode(7);
    root.left.left = new TreeNode(2);
    root.left.right = new TreeNode(4);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(8);
    root.left.left.left = new TreeNode(1);
    
    return root;
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
 * 获取完整的中序遍历结果
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
console.log('=== BST中第K小元素测试 ===');

const root = createTestBST();

console.log('测试BST结构：');
printTree(root);

const inorderResult = getInorderTraversal(root);
console.log('中序遍历结果：', inorderResult);

// 测试不同的k值
const testK = [1, 3, 5, 8];

testK.forEach(k => {
    console.log(`\n第${k}小的元素：`);
    console.log('方法1（数组）：', kthSmallest_Array(root, k));
    console.log('方法2（计数器）：', kthSmallest_Counter(root, k));
    console.log('方法3（迭代）：', kthSmallest_Iterative(root, k));
    console.log('方法4（Morris）：', kthSmallest_Morris(root, k));
    console.log('预期结果：', inorderResult[k - 1]);
});

// 测试第K大元素
console.log('\n=== 第K大元素测试 ===');
testK.forEach(k => {
    console.log(`第${k}大的元素：`, kthLargest(root, k));
    console.log('预期结果：', inorderResult[inorderResult.length - k]);
});

console.log('\n=== 算法分析 ===');
console.log('方法1 - 中序遍历+数组：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(n)');
console.log('  优点：简单直观');
console.log('  缺点：需要遍历整棵树');

console.log('\n方法2 - 中序遍历+计数器：');
console.log('  时间复杂度：O(h + k)，h为树高');
console.log('  空间复杂度：O(h)');
console.log('  优点：可以提前终止');
console.log('  缺点：递归调用');

console.log('\n方法3 - 迭代中序遍历：');
console.log('  时间复杂度：O(h + k)');
console.log('  空间复杂度：O(h)');
console.log('  优点：迭代实现，可控制');
console.log('  缺点：需要显式栈');

console.log('\n方法4 - Morris遍历：');
console.log('  时间复杂度：O(n)');
console.log('  空间复杂度：O(1)');
console.log('  优点：常数空间');
console.log('  缺点：实现复杂，会临时修改树结构');

console.log('\n推荐使用：方法2或方法3，平衡了效率和可读性');
