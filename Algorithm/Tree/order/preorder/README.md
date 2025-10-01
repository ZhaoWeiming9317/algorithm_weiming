# 前序遍历应用题集合

## 🎯 前序遍历特点
**顺序：根 → 左 → 右**
- 先访问根节点，再递归遍历左右子树
- 第一个元素一定是根节点
- 适合自顶向下的算法

## 📚 应用场景分类

### 1. 树的复制和序列化
- [树的克隆](./cloneTree.js) - 复制整棵二叉树
- [二叉树序列化](./serialize.js) - 将树转换为字符串
- [二叉树反序列化](./deserialize.js) - 从字符串重建树

### 2. 树结构分析
- [打印树结构](./printTree.js) - 可视化显示树的层次结构
- [计算树的深度](./maxDepth.js) - 自顶向下计算最大深度
- [路径总和](./pathSum.js) - 判断是否存在根到叶子的路径和

### 3. 表达式树处理
- [前缀表达式求值](./prefixExpression.js) - 计算前缀表达式的值
- [构建表达式树](./buildExpressionTree.js) - 从前缀表达式构建树

### 4. 文件系统模拟
- [目录遍历](./directoryTraversal.js) - 模拟文件系统的前序遍历

## 🔥 核心模板

```javascript
// 前序遍历基本模板
function preorderTraversal(root) {
    if (!root) return;
    
    // 1. 处理当前节点（根）
    console.log(root.val);
    
    // 2. 递归处理左子树
    preorderTraversal(root.left);
    
    // 3. 递归处理右子树
    preorderTraversal(root.right);
}
```

## 💡 记忆要点
- **自顶向下**：先处理父节点，再处理子节点
- **构建优先**：适合复制、创建、序列化等操作
- **根节点优先**：第一个访问的总是根节点
