/**
 * 树形结构转换 - 将扁平数组转换为树形结构
 * 
 * 问题描述：
 * 给定一个包含父子关系的扁平数组，将其转换为树形结构
 * 
 * 输入：扁平数组，每个元素包含 parentId 和 id 字段
 * 输出：树形结构，每个节点包含 children 数组
 */

/**
 * 方法一：递归实现（时间复杂度 O(n²)，空间复杂度 O(n)）
 * @param {Array} flatArray - 扁平数组
 * @param {number} parentId - 父节点ID，默认为 -1（根节点）
 * @returns {Array} 树形结构数组
 */
function arrayToTreeRecursive(flatArray, parentId = -1) {
    const result = [];
    
    for (const item of flatArray) {
        if (item.parentId === parentId) {
            const children = arrayToTreeRecursive(flatArray, item.id);
            result.push({
                ...item,
                children
            });
        }
    }
    
    return result;
}

/**
 * 方法二：Map优化实现（时间复杂度 O(n)，空间复杂度 O(n)）
 * @param {Array} flatArray - 扁平数组
 * @param {number} rootParentId - 根节点的parentId，默认为 -1
 * @returns {Array} 树形结构数组
 */
function arrayToTreeOptimized(flatArray, rootParentId = -1) {
    // 创建Map存储所有节点，以id为key
    const nodeMap = new Map();
    
    // 初始化所有节点
    flatArray.forEach(item => {
        nodeMap.set(item.id, {
            ...item,
            children: []
        });
    });
    
    const result = [];
    
    // 构建父子关系
    flatArray.forEach(item => {
        const node = nodeMap.get(item.id);
        
        if (item.parentId === rootParentId) {
            // 根节点
            result.push(node);
        } else {
            // 子节点，找到父节点并添加到其children中
            const parent = nodeMap.get(item.parentId);
            if (parent) {
                parent.children.push(node);
            }
        }
    });
    
    return result;
}

/**
 * 方法三：一次遍历实现（时间复杂度 O(n)，空间复杂度 O(n)）
 * @param {Array} flatArray - 扁平数组
 * @param {number} rootParentId - 根节点的parentId，默认为 -1
 * @returns {Array} 树形结构数组
 */
function arrayToTreeOnePass(flatArray, rootParentId = -1) {
    const nodeMap = new Map();
    const result = [];
    
    // 一次遍历完成所有操作
    flatArray.forEach(item => {
        // 创建当前节点
        const node = {
            ...item,
            children: []
        };
        
        // 将节点存储到Map中
        nodeMap.set(item.id, node);
        
        if (item.parentId === rootParentId) {
            // 根节点直接添加到结果中
            result.push(node);
        } else {
            // 子节点需要找到父节点
            const parent = nodeMap.get(item.parentId);
            if (parent) {
                parent.children.push(node);
            } else {
                // 父节点还未处理，先存储当前节点
                // 这种情况在数据顺序有问题时会出现
                console.warn(`Parent node with id ${item.parentId} not found for node ${item.id}`);
            }
        }
    });
    
    return result;
}

/**
 * 方法四：支持多种根节点标识的实现
 * @param {Array} flatArray - 扁平数组
 * @param {number|string|null|undefined} rootParentId - 根节点的parentId
 * @returns {Array} 树形结构数组
 */
function arrayToTreeFlexible(flatArray, rootParentId = -1) {
    const nodeMap = new Map();
    const result = [];
    
    flatArray.forEach(item => {
        const node = {
            ...item,
            children: []
        };
        
        nodeMap.set(item.id, node);
        
        // 灵活处理根节点的判断
        const isRoot = item.parentId === rootParentId || 
                      (rootParentId === null && item.parentId === null) ||
                      (rootParentId === undefined && item.parentId === undefined);
        
        if (isRoot) {
            result.push(node);
        } else {
            const parent = nodeMap.get(item.parentId);
            if (parent) {
                parent.children.push(node);
            } else {
                // 如果父节点不存在，可能是数据顺序问题
                // 可以选择抛出错误或者作为根节点处理
                console.warn(`Parent node with id ${item.parentId} not found for node ${item.id}`);
            }
        }
    });
    
    return result;
}

/**
 * 辅助函数：验证树形结构
 * @param {Array} tree - 树形结构数组
 * @param {number} expectedNodes - 期望的节点总数
 * @returns {boolean} 验证结果
 */
function validateTree(tree, expectedNodes) {
    let nodeCount = 0;
    
    function countNodes(nodes) {
        for (const node of nodes) {
            nodeCount++;
            if (node.children && node.children.length > 0) {
                countNodes(node.children);
            }
        }
    }
    
    countNodes(tree);
    return nodeCount === expectedNodes;
}

/**
 * 辅助函数：打印树形结构（用于调试）
 * @param {Array} tree - 树形结构数组
 * @param {number} depth - 当前深度
 */
function printTree(tree, depth = 0) {
    const indent = '  '.repeat(depth);
    tree.forEach(node => {
        console.log(`${indent}${node.name} (id: ${node.id})`);
        if (node.children && node.children.length > 0) {
            printTree(node.children, depth + 1);
        }
    });
}

// 测试用例
const testData = [
    { parentId: -1, id: 1, name: 'node1' },
    { parentId: 1, id: 2, name: 'node2' },
    { parentId: 1, id: 3, name: 'node3' },
    { parentId: 2, id: 4, name: 'node4' }
];

console.log('=== 测试用例 ===');
console.log('输入数据:', testData);

console.log('\n=== 方法一：递归实现 ===');
const result1 = arrayToTreeRecursive(testData);
console.log('结果:', JSON.stringify(result1, null, 2));
console.log('验证:', validateTree(result1, 4));

console.log('\n=== 方法二：Map优化实现 ===');
const result2 = arrayToTreeOptimized(testData);
console.log('结果:', JSON.stringify(result2, null, 2));
console.log('验证:', validateTree(result2, 4));

console.log('\n=== 方法三：一次遍历实现 ===');
const result3 = arrayToTreeOnePass(testData);
console.log('结果:', JSON.stringify(result3, null, 2));
console.log('验证:', validateTree(result3, 4));

console.log('\n=== 方法四：灵活实现 ===');
const result4 = arrayToTreeFlexible(testData);
console.log('结果:', JSON.stringify(result4, null, 2));
console.log('验证:', validateTree(result4, 4));

console.log('\n=== 树形结构可视化 ===');
printTree(result2);

// 导出所有方法
export {
    arrayToTreeRecursive,
    arrayToTreeOptimized,
    arrayToTreeOnePass,
    arrayToTreeFlexible,
    validateTree,
    printTree
};

// 默认导出最推荐的方法
export default arrayToTreeOptimized;
