# 链表找中点：fast 初始化的区别

## 🎯 核心问题

**`fast = head` vs `fast = head.next` 对结果有什么影响？**

---

## 📊 结论总结

| 初始化方式 | 奇数长度链表 | 偶数长度链表 | 返回 |
|:----------|:-----------|:-----------|:-----|
| `fast = head` | 中间节点 | **第二个中点**（上中位数） | 偏右 |
| `fast = head.next` | 中间节点 | **第一个中点**（下中位数） | 偏左 |

---

## 🔍 详细图解

### 情况1：奇数长度链表 (长度 = 5)

```
链表: 1 -> 2 -> 3 -> 4 -> 5 -> null
                ↑
             中间节点
```

#### 方法1: fast = head

```
初始:  slow     fast
        ↓        ↓
        1 -> 2 -> 3 -> 4 -> 5 -> null

步骤1: slow = slow.next
       fast = fast.next.next
             slow     fast
              ↓        ↓
        1 -> 2 -> 3 -> 4 -> 5 -> null

步骤2: slow = slow.next
       fast = fast.next.next
                  slow          fast
                   ↓             ↓
        1 -> 2 -> 3 -> 4 -> 5 -> null
        
fast.next === null，循环结束
返回: 3 ✅
```

#### 方法2: fast = head.next

```
初始:  slow          fast
        ↓             ↓
        1 -> 2 -> 3 -> 4 -> 5 -> null

步骤1: slow = slow.next
       fast = fast.next.next
             slow          fast
              ↓             ↓
        1 -> 2 -> 3 -> 4 -> 5 -> null

步骤2: slow = slow.next
       fast = fast.next.next
                  slow               fast
                   ↓                  ↓
        1 -> 2 -> 3 -> 4 -> 5 -> null
        
fast === null，循环结束
返回: 3 ✅
```

**奇数长度时，两种方法结果相同！**

---

### 情况2：偶数长度链表 (长度 = 4) ⚠️ 关键区别

```
链表: 1 -> 2 -> 3 -> 4 -> null
           ↑    ↑
         第1个  第2个
         中点   中点
       (下中位数)(上中位数)
```

#### 方法1: fast = head （返回第2个中点）

```
初始:  slow     fast
        ↓        ↓
        1 -> 2 -> 3 -> 4 -> null

步骤1: slow = slow.next
       fast = fast.next.next
             slow     fast
              ↓        ↓
        1 -> 2 -> 3 -> 4 -> null

步骤2: slow = slow.next
       fast = fast.next.next
                  slow          fast
                   ↓             ↓
        1 -> 2 -> 3 -> 4 -> null
        
fast === null，循环结束
返回: 3 ✅ (第2个中点，上中位数)
```

#### 方法2: fast = head.next （返回第1个中点）

```
初始:  slow          fast
        ↓             ↓
        1 -> 2 -> 3 -> 4 -> null

步骤1: slow = slow.next
       fast = fast.next.next
             slow               fast
              ↓                  ↓
        1 -> 2 -> 3 -> 4 -> null
        
fast === null，循环结束
返回: 2 ✅ (第1个中点，下中位数)
```

**偶数长度时，结果不同！**

---

## 💡 本质原因

### 为什么会有区别？

关键在于 `fast` 指针的**移动次数**：

1. **`fast = head`**
   - 奇数长度 (5个节点)：fast 移动 2 次到达 null
   - 偶数长度 (4个节点)：fast 移动 2 次到达 null
   - slow 移动次数 = fast 移动次数 = 偏向右边

2. **`fast = head.next`**
   - 奇数长度 (5个节点)：fast 移动 2 次到达 null
   - 偶数长度 (4个节点)：fast 移动 1 次到达 null
   - slow 移动次数更少 = 偏向左边

---

## 🔢 更多例子

### 长度 = 6 的链表

```
链表: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> null
                ↑    ↑
              第1个  第2个
```

| 方法 | 返回值 |
|:-----|:------|
| `fast = head` | 4（第2个中点） |
| `fast = head.next` | 3（第1个中点） |

### 长度 = 2 的链表

```
链表: 1 -> 2 -> null
       ↑    ↑
     第1个  第2个
```

| 方法 | 返回值 |
|:-----|:------|
| `fast = head` | 2（第2个中点） |
| `fast = head.next` | 1（第1个中点） |

---

## 🎯 应用场景

### 1. 使用 `fast = head` 的场景

**需要第2个中点（上中位数）：**

✅ **链表排序（归并排序）**
```javascript
// 需要把链表分成两半
// 偶数时，前半部分少一个，后半部分多一个
function sortList(head) {
    if (!head || !head.next) return head;
    
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // slow 是第2个中点
    // 前半: 1->2  后半: 3->4
    // 这样分割更合理
}
```

✅ **回文链表判断**
```javascript
// 需要后半部分稍微多一点
function isPalindrome(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // 奇数长度时，slow 在中间（可以跳过）
    // 偶数长度时，slow 在第2个中点（正好是后半部分开始）
}
```

### 2. 使用 `fast = head.next` 的场景

**需要第1个中点（下中位数）：**

✅ **删除链表中间节点**
```javascript
// 需要找到中间节点的前一个
function deleteMiddle(head) {
    let slow = head, fast = head.next;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // 偶数时，slow 是第1个中点
    // 删除更靠左的中点
}
```

✅ **将链表分为前后两半（后半部分不包含中点）**
```javascript
function splitList(head) {
    let slow = head, fast = head.next;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    let secondHalf = slow.next;
    slow.next = null; // 断开
    
    // 1->2->3->4
    // 前半: 1->2  后半: 3->4 (相等)
}
```

---

## 📝 代码模板

### 模板1: 返回第2个中点（上中位数）

```javascript
function findMiddle(head) {
    let slow = head;
    let fast = head;
    
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow; // 偶数时返回第2个中点
}
```

### 模板2: 返回第1个中点（下中位数）

```javascript
function findMiddle(head) {
    let slow = head;
    let fast = head.next;
    
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow; // 偶数时返回第1个中点
}
```

### 模板3: 返回中点的前一个节点

```javascript
function findMiddlePrev(head) {
    let prev = null;
    let slow = head;
    let fast = head;
    
    while (fast !== null && fast.next !== null) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return prev; // 中点的前一个节点
}
```

---

## 🔑 记忆技巧

| 初始化 | 记忆方式 | 结果 |
|:------|:--------|:-----|
| `fast = head` | fast 和 slow 站在同一起跑线 | 偶数时返回**靠右**的中点 |
| `fast = head.next` | fast 先跑一步 | 偶数时返回**靠左**的中点 |

**口诀：**
```
fast = head → 偏右（更常用）
fast = head.next → 偏左（特殊需求）
```

---

## ⚠️ 注意事项

1. **空链表和单节点链表**
   - `fast = head`: 正常处理
   - `fast = head.next`: 需要先判断 `if (!head) return null`

2. **循环条件**
   - 必须是 `fast !== null && fast.next !== null`
   - 顺序不能反（先检查 fast 是否为 null）

3. **实际应用**
   - 80% 的情况用 `fast = head` 就够了
   - 特殊需求（如删除中点）才用 `fast = head.next`

---

## 🧪 测试验证

| 链表长度 | 链表内容 | `fast=head` | `fast=head.next` |
|:--------|:--------|:-----------|:----------------|
| 1 | [1] | 1 | 1 |
| 2 | [1,2] | 2 | 1 |
| 3 | [1,2,3] | 2 | 2 |
| 4 | [1,2,3,4] | 3 | 2 |
| 5 | [1,2,3,4,5] | 3 | 3 |
| 6 | [1,2,3,4,5,6] | 4 | 3 |

**规律：偶数长度时，两者相差 1**

---

## 📚 相关题目

- LeetCode 876: 链表的中间节点（基础）
- LeetCode 234: 回文链表（需要第2个中点）
- LeetCode 148: 排序链表（需要第2个中点）
- LeetCode 143: 重排链表（需要第1个中点）
- LeetCode 2095: 删除链表的中间节点（需要第1个中点）

