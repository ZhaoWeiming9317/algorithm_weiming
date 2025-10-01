# 二叉树遍历性质总结

## 🎯 核心定义（必须背诵）

### 前序遍历（Preorder）
**顺序：根 → 左 → 右**
- 先访问根节点
- 再递归遍历左子树
- 最后递归遍历右子树

### 中序遍历（Inorder）
**顺序：左 → 根 → 右**
- 先递归遍历左子树
- 再访问根节点
- 最后递归遍历右子树

### 后序遍历（Postorder）
**顺序：左 → 右 → 根**
- 先递归遍历左子树
- 再递归遍历右子树
- 最后访问根节点

## 🔥 关键性质（重点记忆）

### 1. 前序遍历的性质
- ✅ **第一个元素一定是根节点**
- ✅ 适合复制/序列化二叉树
- ✅ 可以快速确定树的结构轮廓
- 🎯 **构建树时：从前往后取值，先左后右递归**

### 2. 中序遍历的性质
- ✅ **对于BST，结果是有序数组**
- ✅ **提供左右子树的分割信息**
- ✅ 是构建树时的"分治依据"
- 🎯 **构建树时：用来分割左右子树边界**

### 3. 后序遍历的性质
- ✅ **最后一个元素一定是根节点**
- ✅ **适合删除/释放节点**（先处理子节点再处理父节点）
- ✅ **适合计算树的属性**（高度、节点数、路径和等）
- ✅ **适合自底向上的算法**（从叶子节点向根节点传递信息）
- ✅ **内存安全**（确保子节点先于父节点被处理）
- 🎯 **构建树时：从后往前取值，先右后左递归**

## 📊 构建二叉树的组合（必须记住）

### ✅ 可行的组合
1. **前序 + 中序** ← 最常用，最直观
2. **后序 + 中序** ← 需要逆向思维
3. **层序 + 中序** ← 较少使用

### ❌ 不可行的组合
1. **前序 + 后序** - 无法确定左右子树边界
2. **任何单独的遍历** - 信息不足
3. **前序 + 层序** - 无法准确分割
4. **后序 + 层序** - 无法准确分割

## 🎯 构建算法核心（背诵要点）

### 前序 + 中序构建
```javascript
// 关键模式
const root = new TreeNode(preorder[preorderIndex++]); // 从前往后
const rootIndex = inorderMap.get(root.val);           // 中序分割
root.left = buildTree(inorderStart, rootIndex - 1);  // 先左
root.right = buildTree(rootIndex + 1, inorderEnd);   // 后右
```

### 后序 + 中序构建
```javascript
// 关键模式
const root = new TreeNode(postorder[postorderIndex--]); // 从后往前
const rootIndex = inorderMap.get(root.val);            // 中序分割
root.right = buildTree(rootIndex + 1, inorderEnd);     // 先右！
root.left = buildTree(inorderStart, rootIndex - 1);    // 后左！
```

## 🚀 实际应用场景（重要性质）

### 前序遍历的典型应用
1. **树的复制/克隆**
   ```javascript
   // 前序遍历天然适合复制树结构
   function cloneTree(root) {
       if (!root) return null;
       const newNode = new TreeNode(root.val); // 先创建根
       newNode.left = cloneTree(root.left);    // 再复制左子树
       newNode.right = cloneTree(root.right);  // 最后复制右子树
       return newNode;
   }
   ```

2. **树的序列化**
   - 前序遍历的结果可以直接用于重建树
   - 第一个元素就是根，便于解析

3. **表达式树的前缀表示**
   - 前序遍历得到前缀表达式
   - 例如：`+ * a b c` 表示 `(a * b) + c`

4. **文件系统遍历**
   - 先访问目录，再访问子目录和文件
   - 符合人类的目录浏览习惯

### 中序遍历的典型应用
1. **二叉搜索树排序**
   ```javascript
   // BST的中序遍历直接得到有序序列
   function inorderSort(root, result = []) {
       if (!root) return result;
       inorderSort(root.left, result);
       result.push(root.val);           // 有序插入
       inorderSort(root.right, result);
       return result;
   }
   ```

2. **验证BST的有效性**
   - 中序遍历结果应该是严格递增的
   - 如果不是，则不是有效的BST

3. **寻找BST中的第K小元素**
   - 中序遍历到第K个元素就是答案
   - 时间复杂度O(K)

4. **BST转换为双向链表**
   - 中序遍历的顺序就是链表的顺序
   - 左指针指向前驱，右指针指向后继

### 后序遍历的典型应用
1. **计算树的高度**
   ```javascript
   function getHeight(root) {
       if (!root) return 0;
       const leftHeight = getHeight(root.left);   // 先算左子树高度
       const rightHeight = getHeight(root.right); // 再算右子树高度
       return Math.max(leftHeight, rightHeight) + 1; // 最后算当前节点
   }
   ```

2. **计算树的节点数**
   ```javascript
   function countNodes(root) {
       if (!root) return 0;
       const leftCount = countNodes(root.left);
       const rightCount = countNodes(root.right);
       return leftCount + rightCount + 1; // 左 + 右 + 根
   }
   ```

3. **删除树/释放内存**
   ```javascript
   function deleteTree(root) {
       if (!root) return;
       deleteTree(root.left);   // 先删除左子树
       deleteTree(root.right);  // 再删除右子树
       delete root;             // 最后删除根节点
   }
   ```

4. **计算路径和**
   ```javascript
   function pathSum(root, targetSum) {
       if (!root) return 0;
       const leftSum = pathSum(root.left, targetSum);
       const rightSum = pathSum(root.right, targetSum);
       // 在这里可以利用左右子树的结果计算当前节点的路径和
       return leftSum + rightSum + (root.val === targetSum ? 1 : 0);
   }
   ```

5. **判断平衡二叉树**
   ```javascript
   function isBalanced(root) {
       function getHeightAndCheck(node) {
           if (!node) return 0;
           const leftHeight = getHeightAndCheck(node.left);
           if (leftHeight === -1) return -1; // 左子树不平衡
           const rightHeight = getHeightAndCheck(node.right);
           if (rightHeight === -1) return -1; // 右子树不平衡
           
           if (Math.abs(leftHeight - rightHeight) > 1) return -1; // 当前不平衡
           return Math.max(leftHeight, rightHeight) + 1;
       }
       return getHeightAndCheck(root) !== -1;
   }
   ```

6. **表达式树求值**
   - 后序遍历天然适合计算表达式
   - 先算操作数，再算操作符

## 🎯 遍历选择策略

### 什么时候用前序？
- ✅ 需要先处理根节点的场景
- ✅ 复制、序列化树结构
- ✅ 自顶向下的算法

### 什么时候用中序？
- ✅ BST相关操作
- ✅ 需要有序访问节点
- ✅ 构建树时作为分割依据

### 什么时候用后序？
- ✅ 需要先处理子节点的场景
- ✅ 计算树的属性（高度、大小等）
- ✅ 删除、释放资源
- ✅ 自底向上的算法

## 💡 记忆技巧

### 1. 遍历顺序记忆
- **前序**：我先看根，再看左右 → 根左右
- **中序**：左边看完看根，再看右边 → 左根右  
- **后序**：左右都看完，最后看根 → 左右根

### 2. 构建方向记忆
- **前序**：正向思维，从前往后，先左后右
- **后序**：逆向思维，从后往前，先右后左
- **中序**：分治工具，提供分割点

### 3. 应用场景记忆
- **前序**：复制树、序列化、文件系统遍历、自顶向下算法
- **中序**：BST排序、验证BST、找第K小元素、分割左右子树
- **后序**：删除树、计算高度/节点数、判断平衡、自底向上算法

## 🔥 面试必背口诀

### 构建二叉树万能公式
> **"利用前序遍历或后序遍历获取根节点，利用中序遍历来分治"**

### 索引消费规律
- **前序**：`preorderIndex++`，先左后右
- **后序**：`postorderIndex--`，先右后左
- **中序**：提供 `inorderStart` 和 `inorderEnd` 边界

### 递归终止条件
```javascript
if (inorderStart > inorderEnd) return null;
```

## 🎯 常见考点

### 1. 给定遍历序列，画出树
- 前序确定根节点位置
- 中序确定左右子树范围
- 递归处理子树

### 2. 判断遍历序列是否合法
- 检查前序/后序与中序的一致性
- 验证BST的中序遍历是否有序

### 3. 根据遍历序列构建树
- 选择合适的遍历组合
- 正确处理索引消费顺序
- 处理边界条件

## 🏆 背诵清单

### 必须背诵的内容
1. ✅ 三种遍历的定义和顺序
2. ✅ 前序第一个是根，后序最后一个是根
3. ✅ 中序遍历BST得到有序序列
4. ✅ 构建树的可行组合：前序+中序，后序+中序
5. ✅ 前序从前往后，后序从后往前
6. ✅ 后序构建时先右后左的原因
7. ✅ 递归终止条件：`inorderStart > inorderEnd`
8. ✅ **应用场景选择**：
   - 前序：复制、序列化、自顶向下
   - 中序：BST操作、有序访问
   - 后序：计算属性、删除、自底向上

### 理解即可的内容
1. 具体的递归实现细节
2. 复杂树的手工遍历过程
3. 各种边界情况的处理

记住：**理解原理比死记硬背更重要！** 掌握了核心思想，代码自然就会写了。
