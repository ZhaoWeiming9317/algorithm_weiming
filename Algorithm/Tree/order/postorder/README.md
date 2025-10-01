# 后序遍历应用题集合

## 🎯 后序遍历特点
**顺序：左 → 右 → 根**
- 先递归遍历左右子树，最后访问根节点
- 最后一个元素一定是根节点
- 适合自底向上的算法，先处理子节点再处理父节点
- 内存安全，确保子节点先于父节点被处理

## 📚 应用场景分类

### 1. 树的属性计算
- [计算树的高度](./maxDepth.js) - 自底向上计算二叉树的最大深度
- [计算节点数](./countNodes.js) - 统计二叉树的节点总数
- [计算叶子节点数](./countLeaves.js) - 统计叶子节点的数量
- [树的直径](./diameterOfTree.js) - 计算二叉树中任意两节点间的最长路径

### 2. 树的验证和判断
- [判断平衡二叉树](./isBalanced.js) - 检查二叉树是否为平衡二叉树
- [判断完全二叉树](./isCompleteTree.js) - 检查是否为完全二叉树
- [相同的树](./isSameTree.js) - 判断两棵树是否相同
- [对称二叉树](./isSymmetric.js) - 判断二叉树是否对称

### 3. 路径和求和问题
- [路径总和](./hasPathSum.js) - 判断是否存在根到叶子的路径和
- [路径总和II](./pathSumII.js) - 找出所有根到叶子的路径和
- [二叉树的最大路径和](./maxPathSum.js) - 计算任意节点间的最大路径和
- [路径总和III](./pathSumIII.js) - 计算路径和等于目标值的路径数

### 4. 树的修改和删除
- [删除二叉树](./deleteTree.js) - 安全地删除整棵二叉树
- [修剪二叉树](./pruneTree.js) - 删除所有不包含1的子树
- [翻转二叉树](./invertTree.js) - 翻转二叉树的左右子树

### 5. 表达式树处理
- [表达式树求值](./evaluateExpressionTree.js) - 计算表达式树的值
- [构建表达式树](./buildExpressionTree.js) - 从后缀表达式构建表达式树

## 🔥 核心模板

```javascript
// 后序遍历基本模板
function postorderTraversal(root) {
    if (!root) return;
    
    // 1. 递归处理左子树
    postorderTraversal(root.left);
    
    // 2. 递归处理右子树
    postorderTraversal(root.right);
    
    // 3. 处理当前节点（根）
    console.log(root.val);
}

// 计算树属性的模板
function calculateTreeProperty(root) {
    if (!root) return 0; // 或其他基础值
    
    // 先获取左右子树的结果
    const leftResult = calculateTreeProperty(root.left);
    const rightResult = calculateTreeProperty(root.right);
    
    // 基于子树结果计算当前节点的结果
    return combineResults(leftResult, rightResult, root.val);
}

// 验证树性质的模板
function validateTreeProperty(root) {
    if (!root) return true; // 空树通常满足条件
    
    // 先验证左右子树
    const leftValid = validateTreeProperty(root.left);
    const rightValid = validateTreeProperty(root.right);
    
    // 基于子树验证结果和当前节点验证整体
    return leftValid && rightValid && checkCurrentNode(root);
}
```

## 💡 记忆要点
- **自底向上**：先处理子节点，再处理父节点
- **信息汇聚**：子树的信息向根节点汇聚
- **安全删除**：确保子节点先于父节点被处理
- **属性计算**：适合计算需要子树信息的属性
