/**
 * 二叉树序列化 - 前序遍历应用
 * 
 * 题目：将二叉树序列化为字符串，并能够反序列化回原树
 * 
 * 前序遍历优势：
 * 1. 第一个元素是根节点，便于反序列化时确定根
 * 2. 序列化和反序列化都遵循相同的顺序
 */

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 序列化二叉树 - 前序遍历
 * @param {TreeNode} root - 树的根节点
 * @return {string} - 序列化后的字符串
 */
export function serialize(root) {
    const result = [];
    
    function preorderSerialize(node) {
        if (!node) {
            result.push('null');
            return;
        }
        
        // 前序：根 → 左 → 右
        result.push(node.val.toString());
        preorderSerialize(node.left);
        preorderSerialize(node.right);
    }
    
    preorderSerialize(root);
    return result.join(',');
}

/**
 * 反序列化二叉树 - 前序遍历
 * @param {string} data - 序列化的字符串
 * @return {TreeNode} - 重建的树根节点
 */
export function deserialize(data) {
    const values = data.split(',');
    let index = 0;
    
    function preorderDeserialize() {
        if (index >= values.length || values[index] === 'null') {
            index++;
            return null;
        }
        
        // 前序：先创建根节点
        const root = new TreeNode(parseInt(values[index++]));
        
        // 递归构建左右子树
        root.left = preorderDeserialize();
        root.right = preorderDeserialize();
        
        return root;
    }
    
    return preorderDeserialize();
}

/**
 * 另一种序列化方式：使用括号表示法
 */
export function serializeWithBrackets(root) {
    if (!root) return '';
    
    let result = root.val.toString();
    
    if (root.left || root.right) {
        result += '(';
        result += serializeWithBrackets(root.left);
        result += ')(';
        result += serializeWithBrackets(root.right);
        result += ')';
    }
    
    return result;
}

/**
 * 验证序列化和反序列化的正确性
 */
function isSameTree(p, q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    return p.val === q.val && 
           isSameTree(p.left, q.left) && 
           isSameTree(p.right, q.right);
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

// 测试用例
console.log('=== 二叉树序列化测试 ===');

// 测试用例1：完整的二叉树
console.log('\n测试用例1：完整二叉树');
//       1
//      / \
//     2   3
//    / \   \
//   4   5   6
const tree1 = new TreeNode(1);
tree1.left = new TreeNode(2);
tree1.right = new TreeNode(3);
tree1.left.left = new TreeNode(4);
tree1.left.right = new TreeNode(5);
tree1.right.right = new TreeNode(6);

console.log('原始树：');
printTree(tree1);

const serialized1 = serialize(tree1);
console.log('序列化结果：', serialized1);

const deserialized1 = deserialize(serialized1);
console.log('反序列化后的树：');
printTree(deserialized1);

console.log('序列化/反序列化正确：', isSameTree(tree1, deserialized1));

// 测试用例2：只有左子树
console.log('\n测试用例2：只有左子树');
//   1
//  /
// 2
const tree2 = new TreeNode(1);
tree2.left = new TreeNode(2);

console.log('原始树：');
printTree(tree2);

const serialized2 = serialize(tree2);
console.log('序列化结果：', serialized2);

const deserialized2 = deserialize(serialized2);
console.log('反序列化后的树：');
printTree(deserialized2);

console.log('序列化/反序列化正确：', isSameTree(tree2, deserialized2));

// 测试用例3：空树
console.log('\n测试用例3：空树');
const tree3 = null;

const serialized3 = serialize(tree3);
console.log('序列化结果：', serialized3);

const deserialized3 = deserialize(serialized3);
console.log('反序列化结果：', deserialized3);

console.log('空树处理正确：', deserialized3 === null);

// 测试括号表示法
console.log('\n=== 括号表示法测试 ===');
const bracketSerialized = serializeWithBrackets(tree1);
console.log('括号表示法：', bracketSerialized);

console.log('\n=== 算法分析 ===');
console.log('时间复杂度：O(n) - 需要访问每个节点');
console.log('空间复杂度：O(n) - 存储序列化字符串');
console.log('前序遍历优势：');
console.log('1. 第一个元素是根节点，便于反序列化');
console.log('2. 序列化和反序列化顺序一致');
console.log('3. 递归结构清晰，易于实现');
