# 中序遍历应用题集合

## 🎯 中序遍历特点
**顺序：左 → 根 → 右**
- 先递归遍历左子树，再访问根节点，最后递归遍历右子树
- 对于BST，中序遍历结果是有序数组
- 提供左右子树的分割信息，是构建树的分治依据

## 📚 应用场景分类

### 1. 二叉搜索树(BST)操作
- [BST排序](./bstSort.js) - 利用中序遍历对BST进行排序
- [验证BST](./validateBST.js) - 检查二叉树是否为有效的BST
- [第K小元素](./kthSmallest.js) - 找到BST中第K小的元素
- [BST转双向链表](./bstToDoublyList.js) - 将BST转换为排序的双向链表

### 2. 树的分析和修复
- [恢复BST](./recoverBST.js) - 恢复被错误交换的BST节点
- [BST中的众数](./findMode.js) - 找到BST中出现频率最高的元素
- [两数之和BST](./twoSumBST.js) - 在BST中查找两数之和

### 3. 构建和重建
- [有序数组转BST](./sortedArrayToBST.js) - 将有序数组转换为平衡BST
- [前序+中序构建树](./buildTreePreIn.js) - 利用前序和中序遍历构建树
- [后序+中序构建树](./buildTreePostIn.js) - 利用后序和中序遍历构建树

### 4. 范围查询
- [BST范围求和](./rangeSumBST.js) - 计算BST中指定范围内节点的和
- [修剪BST](./trimBST.js) - 修剪BST使所有节点都在指定范围内

## 🔥 核心模板

```javascript
// 中序遍历基本模板
function inorderTraversal(root) {
    if (!root) return;
    
    // 1. 递归处理左子树
    inorderTraversal(root.left);
    
    // 2. 处理当前节点（根）
    console.log(root.val);
    
    // 3. 递归处理右子树
    inorderTraversal(root.right);
}

// BST中序遍历模板（有序访问）
function inorderBST(root, callback) {
    if (!root) return;
    
    inorderBST(root.left, callback);
    callback(root.val);  // 按升序处理节点
    inorderBST(root.right, callback);
}
```

## 💡 记忆要点
- **有序性**：BST的中序遍历结果是有序的
- **分治性**：中序遍历提供左右子树的分割点
- **对称性**：左子树 → 根 → 右子树的对称结构
