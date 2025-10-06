# 链表排序算法

## 📚 目录结构

### 🔥 核心算法
- [完整实现](./sortList.js) - 包含归并排序、快速排序、冒泡排序、选择排序
- [简化版本](./simple-sort.js) - 只包含归并排序，适合面试背诵

### 📖 理论文档
- [算法原理](./README.md) - 链表排序的原理和复杂度分析
- [面试要点](./interview-points.md) - 面试常考知识点

## 🎯 学习路径

### 基础路径
1. 归并排序 → 快慢指针找中点 → 合并有序链表
2. 理解分治法思想
3. 掌握链表操作技巧

### 进阶路径
1. 理解时间复杂度差异
2. 掌握不同排序算法的特点
3. 手写实现各种算法

## 📝 使用说明

每个文件都包含：
- 📖 问题描述
- 💡 解题思路
- 🔧 代码实现
- ⚠️ 注意事项
- 🚀 复杂度分析
- 📚 相关题目

## 🔥 快速索引

### 必学内容（面试高频）
- [归并排序](./simple-sort.js)
- [快慢指针找中点](./simple-sort.js)
- [合并有序链表](./simple-sort.js)

### 进阶内容
- [快速排序](./sortList.js)
- [冒泡排序](./sortList.js)
- [选择排序](./sortList.js)

## 💡 学习建议

1. **先学基础算法**：归并排序
2. **再学核心技巧**：快慢指针、合并链表
3. **然后学进阶算法**：快速排序
4. **最后学优化技巧**：不同场景的最优解法

## 🎪 面试准备

重点掌握：
- ✅ 归并排序的手写实现
- ✅ 快慢指针找中点
- ✅ 合并两个有序链表
- ✅ 链表的基本操作
- ✅ 边界条件处理

## 🚀 核心算法

### 归并排序（推荐）
```javascript
function sortList(head) {
  if (!head || !head.next) return head;
  
  const mid = findMiddle(head);
  const right = mid.next;
  mid.next = null;
  
  const left = sortList(head);
  const rightSorted = sortList(right);
  
  return mergeTwoLists(left, rightSorted);
}
```

### 快慢指针找中点
```javascript
function findMiddle(head) {
  let slow = head;
  let fast = head.next;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}
```

### 合并有序链表
```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  return dummy.next;
}
```

## 📊 复杂度对比

| 算法 | 时间复杂度 | 空间复杂度 | 稳定性 | 适用场景 |
|------|------------|------------|--------|----------|
| 归并排序 | O(n log n) | O(log n) | 稳定 | 链表排序 |
| 快速排序 | O(n log n) 平均 | O(log n) | 不稳定 | 链表排序 |
| 冒泡排序 | O(n²) | O(1) | 稳定 | 学习理解 |
| 选择排序 | O(n²) | O(1) | 不稳定 | 学习理解 |

## 🎯 选择建议

### 1. 根据场景选择
- **面试推荐**：归并排序
- **实际应用**：归并排序
- **学习理解**：冒泡排序、选择排序

### 2. 根据数据特点选择
- **链表结构**：归并排序
- **需要稳定排序**：归并排序
- **需要原地排序**：冒泡排序、选择排序

## 💡 总结

链表排序是算法面试中的高频题目，主要考察：

1. **算法基础**：归并排序、分治法
2. **链表操作**：快慢指针、节点操作
3. **实现能力**：手写算法实现
4. **优化思维**：不同场景的最优解法

掌握链表排序不仅有助于面试，在实际开发中也有广泛应用，如数据处理、算法优化等场景。
