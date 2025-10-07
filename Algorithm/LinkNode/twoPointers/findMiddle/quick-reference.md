# 链表找中点 - 快速参考卡

## 🎯 核心区别（一图胜千言）

```
链表: 1 -> 2 -> 3 -> 4 -> null
           ↑    ↑
         第1个  第2个
         中点   中点
```

| 初始化 | 偶数长度返回 | 代码 |
|:------|:-----------|:-----|
| `fast = head` | **第2个中点**（偏右）⭐ | 更常用 |
| `fast = head.next` | **第1个中点**（偏左） | 特殊需求 |

**奇数长度时两者结果相同！**

---

## 📝 代码模板

### ⭐ 方法1: 返回第2个中点（最常用）

```javascript
function findMiddle(head) {
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow; // 偶数时返回第2个中点
}
```

### 方法2: 返回第1个中点（特殊需求）

```javascript
function findMiddle(head) {
    let slow = head;
    let fast = head.next; // ← 唯一区别
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow; // 偶数时返回第1个中点
}
```

---

## 📊 结果对照表

| 链表 | fast=head | fast=head.next |
|:-----|:----------|:--------------|
| [1] | 1 | 1 |
| [1,2] | **2** | **1** ⚠️ |
| [1,2,3] | 2 | 2 |
| [1,2,3,4] | **3** | **2** ⚠️ |
| [1,2,3,4,5] | 3 | 3 |
| [1,2,3,4,5,6] | **4** | **3** ⚠️ |

**规律：偶数长度时，两者相差1个位置**

---

## 🎯 使用场景速查

### ✅ 用 `fast = head` 的场景（80%情况）

1. **链表排序（归并排序）**
   ```javascript
   // 需要后半部分稍微多一点
   [1,2,3,4] → mid=3 → 前[1,2] 后[3,4]
   ```

2. **回文链表**
   ```javascript
   // 需要第2个中点
   [1,2,3,4] → mid=3 → 反转后半部分[4]，对比前半部分
   ```

3. **重排链表**
   ```javascript
   // L0→L1→...→Ln-1→Ln 变成 L0→Ln→L1→Ln-1→...
   ```

### ✅ 用 `fast = head.next` 的场景（20%情况）

1. **删除中间节点**
   ```javascript
   // 需要第1个中点（偶数时删除靠左的）
   [1,2,3,4] → 删除2
   ```

2. **均分链表**
   ```javascript
   // 需要两半长度相等
   [1,2,3,4] → mid=2 → 前[1,2] 后[3,4]
   ```

---

## 🔑 记忆口诀

```
fast = head        → 同起跑线 → 偏右 → 更常用 ⭐
fast = head.next   → 先跑一步 → 偏左 → 特殊需求
```

---

## ⚡ 常见错误

### ❌ 错误1：循环条件顺序错误

```javascript
// ❌ 错误：可能空指针
while (fast.next && fast) { ... }

// ✅ 正确：先检查 fast
while (fast && fast.next) { ... }
```

### ❌ 错误2：忘记处理空链表

```javascript
// fast = head.next 时需要特别注意
function findMiddle(head) {
    if (!head) return null; // ✅ 必须加这个判断
    let slow = head;
    let fast = head.next; // 如果 head 为 null，这里会报错
    ...
}
```

### ❌ 错误3：混淆应用场景

```javascript
// 链表排序时用错了
function sortList(head) {
    let slow = head, fast = head.next; // ❌ 应该用 head
    ...
    // 这会导致分割不均匀
}
```

---

## 💡 判断技巧

**如何选择用哪种方法？**

1. **默认用 `fast = head`**（80%的题目都用这个）

2. **以下情况用 `fast = head.next`：**
   - 题目明确要求"第一个中点"
   - 需要删除中间节点
   - 需要将链表分成**长度相等**的两半

3. **不确定时看示例：**
   ```
   输入: [1,2,3,4]
   输出要求返回: 2 → 用 fast = head.next
   输出要求返回: 3 → 用 fast = head
   ```

---

## 📚 相关LeetCode题目

| 题号 | 题目 | 方法 |
|:-----|:-----|:-----|
| 876 | 链表的中间节点 | `fast = head` |
| 234 | 回文链表 | `fast = head` |
| 148 | 排序链表 | `fast = head` |
| 143 | 重排链表 | `fast = head` |
| 2095 | 删除链表的中间节点 | `fast = head.next` |
| 19 | 删除倒数第N个节点 | 根据需求 |

---

## 🧪 快速验证方法

```javascript
// 记住这个例子就够了
链表: [1, 2, 3, 4]

fast = head       → 返回 3 (第2个中点)
fast = head.next  → 返回 2 (第1个中点)
```

---

## 📖 扩展：找中点的前一个节点

```javascript
function findMiddlePrev(head) {
    let prev = null;
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return prev; // 返回中点的前一个节点
}

// 用途：删除中间节点
prev.next = slow.next;
```

---

## 🎓 面试提示

面试时如果遇到链表找中点问题：

1. **先问清楚需求**：
   - "偶数长度时，您希望返回第几个中点？"
   - "是第一个还是第二个？"

2. **说明选择理由**：
   - "我用 fast = head，因为大多数情况需要第2个中点"
   - "如果需要第1个，我可以改成 fast = head.next"

3. **考虑边界情况**：
   - 空链表
   - 单节点链表
   - 两节点链表

---

**最重要的一句话：**
> **默认用 `fast = head`，99% 的情况都对！** ⭐

