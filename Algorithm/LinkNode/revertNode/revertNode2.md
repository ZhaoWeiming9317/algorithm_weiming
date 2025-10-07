# 反转部分链表详解

## 📌 题目描述

**LeetCode 92: 反转链表 II**

给你单链表的头指针 `head` 和两个整数 `left` 和 `right`，其中 `left <= right`。请你反转从位置 `left` 到位置 `right` 的链表节点，返回**反转后的链表**。

**示例**：
```
输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
```

---

## 🎯 核心思路

### 方法一：头插法（推荐！）

**核心思想**：不断将后面的节点插入到反转区间的开头

#### 图解过程

```
原链表：1 -> 2 -> 3 -> 4 -> 5
反转位置 2-4

dummy -> 1 -> 2 -> 3 -> 4 -> 5
        pre  start

步骤1：把 3 插到 2 前面
dummy -> 1 -> 3 -> 2 -> 4 -> 5
        pre       start

步骤2：把 4 插到 3 前面
dummy -> 1 -> 4 -> 3 -> 2 -> 5
        pre            start

完成！
结果：1 -> 4 -> 3 -> 2 -> 5
```

#### 代码实现

```javascript
var reverseBetween = function(head, left, right) {
  const dummy = new ListNode(0, head);
  
  // 1. 找到反转区间的前一个节点
  let pre = dummy;
  for (let i = 1; i < left; i++) {
    pre = pre.next;
  }
  
  // 2. 头插法反转
  let start = pre.next;
  
  for (let i = 0; i < right - left; i++) {
    const next = start.next;    // 要插入的节点
    start.next = next.next;     // start 跳过 next
    next.next = pre.next;       // next 插到最前面
    pre.next = next;            // pre 指向新的头节点
  }
  
  return dummy.next;
};
```

#### 关键点

- **循环次数**：`right - left` 次（不是 `right - left + 1`）
- **start 不变**：始终指向原来的第一个节点（反转后的最后一个）
- **pre.next 变化**：每次指向新插入的节点

---

### 方法二：完全反转法（最易理解！）

**核心思想**：先找到区间，反转区间内的链表，再重新连接

#### 图解过程

```
原链表：1 -> 2 -> 3 -> 4 -> 5
反转位置 2-4

步骤1：找到 pre（位置1的节点）
dummy -> 1 -> 2 -> 3 -> 4 -> 5
        pre  start

步骤2：反转区间 [2,3,4]
        2 <- 3 <- 4    5
start        prev  curr

步骤3：重新连接
dummy -> 1 -> 4 -> 3 -> 2 -> 5
        pre  prev       start curr

完成！
```

#### 代码实现

```javascript
var reverseBetween2 = function(head, left, right) {
  const dummy = new ListNode(0, head);
  
  // 1. 找到反转区间的前一个节点
  let pre = dummy;
  for (let i = 1; i < left; i++) {
    pre = pre.next;
  }
  
  // 2. 反转区间（标准链表反转）
  let start = pre.next;
  let prev = null;
  let curr = start;
  
  for (let i = 0; i < right - left + 1; i++) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  // 3. 重新连接
  pre.next = prev;    // pre -> 反转后的头节点
  start.next = curr;  // 原头节点 -> 后继节点
  
  return dummy.next;
};
```

#### 关键点

- **循环次数**：`right - left + 1` 次（反转所有节点）
- **三个关键指针**：
  - `prev`：反转后的头节点
  - `start`：原来的头节点（反转后的尾节点）
  - `curr`：后继节点

---

### 方法三：递归法（进阶）

**核心思想**：
- 如果 `left = 1`，就是反转前 N 个节点
- 否则递归处理下一个节点，位置都减1

#### 代码实现

```javascript
var reverseBetween3 = function(head, left, right) {
  if (left === 1) {
    return reverseN(head, right);
  }
  head.next = reverseBetween3(head.next, left - 1, right - 1);
  return head;
};

// 反转前 N 个节点
let successor = null;
function reverseN(head, n) {
  if (n === 1) {
    successor = head.next;
    return head;
  }
  const last = reverseN(head.next, n - 1);
  head.next.next = head;
  head.next = successor;
  return last;
}
```

---

## 📊 三种方法对比

| 方法 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **头插法** | 代码简洁，一次遍历 | 理解稍难 | 面试、实际开发 |
| **完全反转** | 最容易理解 | 代码稍长 | 初学者 |
| **递归** | 代码优雅 | 空间复杂度O(n) | 炫技 |

---

## 🔥 面试必背要点

### 1. 虚拟头节点技巧

```javascript
const dummy = new ListNode(0, head);
// 好处：统一处理 left = 1 的情况
```

### 2. 头插法核心代码（4行）

```javascript
const next = start.next;    // 1. 保存要插入的节点
start.next = next.next;     // 2. start 跳过它
next.next = pre.next;       // 3. 插到最前面
pre.next = next;            // 4. pre 指向新头
```

### 3. 循环次数陷阱

- **头插法**：循环 `right - left` 次
- **完全反转**：循环 `right - left + 1` 次

### 4. 边界条件

- `left = 1`：从头开始反转
- `left = right`：只有一个节点，不用反转
- 空链表：返回 null

---

## 💡 扩展题目

1. **反转链表** (LeetCode 206)
2. **K 个一组翻转链表** (LeetCode 25)
3. **回文链表** (LeetCode 234)

---

## 🎯 面试话术（直接背）

**面试官**："如何反转部分链表？"

**你**：
```
"我用头插法，核心思路是不断将后面的节点插入到反转区间的开头。

步骤：
1. 用虚拟头节点简化边界处理
2. 找到反转区间的前一个节点 pre
3. 循环 right - left 次，每次把 start 后面的节点插到最前面
4. 返回 dummy.next

时间复杂度 O(n)，空间复杂度 O(1)。

这个方法的优点是代码简洁，只需要一次遍历。"
```

---

## ⚡ 快速记忆

**口诀**：
```
找 pre，定 start
循环插，不断前
次数记，left 减 right
最后返，dummy next
```

**4行核心**：
```javascript
next = start.next
start.next = next.next
next.next = pre.next
pre.next = next
```

记住这4行，反转部分链表就拿下了！🚀

