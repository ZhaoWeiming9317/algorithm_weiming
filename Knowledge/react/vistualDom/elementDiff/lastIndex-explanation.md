# lastIndex 机制详解

## 1. 基本概念

1. **oldIndex**：
   - 节点在旧列表中的位置索引
   - 通过 key 在旧列表中查找得到
   - 固定值，不会改变

2. **lastIndex**：
   - 当前已处理节点中的最大索引值
   - 会在每次节点处理后更新
   - 更新规则：lastIndex = Math.max(当前lastIndex, 当前节点的oldIndex)

## 2. 详细处理流程

```javascript
// 初始列表
[A:1] -> [B:2] -> [C:3]
  0       1        2     // oldIndex 值

// 目标列表
[A:1] -> [C:3] -> [B:2]

// 遍历过程：

// 1. 处理 A(key=1)
oldIndex = 0  // A在旧列表中的索引
lastIndex = 0 // 初始值为0
比较：0 = 0，不需要移动
更新：lastIndex = Math.max(0, 0) = 0

// 2. 处理 C(key=3)
oldIndex = 2  // C在旧列表中的索引
lastIndex = 0 // 使用处理完 A 后的 lastIndex
比较：2 > 0，不需要移动
更新：lastIndex = Math.max(0, 2) = 2

// 3. 处理 B(key=2)
oldIndex = 1  // B在旧列表中的索引
lastIndex = 2 // 使用处理完 C 后的 lastIndex
比较：1 < 2，需要移动
```

## 3. lastIndex 更新机制

```javascript
function updateChildren(prevChildren, nextChildren) {
  let lastIndex = 0; // 初始值为0
  
  for (let nextChild of nextChildren) {
    const key = nextChild.key;
    const oldIndex = prevChildren.findIndex(child => child.key === key);
    
    if (oldIndex >= 0) {
      // 找到可复用的节点
      if (oldIndex < lastIndex) {
        // 需要移动
        move(nextChild, container);
      } else {
        // 不需要移动，但要更新 lastIndex
        lastIndex = oldIndex;
      }
    } else {
      // 新节点，直接插入
      insert(nextChild, container);
    }
  }
}
```

## 4. 图解说明

```
初始状态：
[A:1] -> [B:2] -> [C:3]
  0       1        2

目标状态：
[A:1] -> [C:3] -> [B:2]

处理过程：
┌─────────────────────────────────┐
│ 1. 处理 A                       │
│    oldIndex = 0                 │
│    lastIndex = 0               │
│    比较：0 = 0 ✓ 不动          │
│    更新：lastIndex = 0          │
└─────────────────────────────────┘
          ↓
┌─────────────────────────────────┐
│ 2. 处理 C                       │
│    oldIndex = 2                 │
│    lastIndex = 0 (A处理后的值)  │
│    比较：2 > 0 ✓ 不动          │
│    更新：lastIndex = 2          │
└─────────────────────────────────┘
          ↓
┌─────────────────────────────────┐
│ 3. 处理 B                       │
│    oldIndex = 1                 │
│    lastIndex = 2 (C处理后的值)  │
│    比较：1 < 2 ✗ 需要移动      │
└─────────────────────────────────┘
```

## 5. 为什么这样设计？

1. **持续更新的 lastIndex**：
   - lastIndex 反映了"已处理节点中最大的索引位置"
   - 每处理一个节点都可能更新这个值
   - 用于后续节点的移动判断

2. **移动判断逻辑**：
   - 如果当前节点的 oldIndex < lastIndex，说明它需要移动
   - 这表示当前节点在之前处理过的某个节点的前面，但在新列表中排在后面
   - 因此需要将其移动到适当的位置

## 6. 面试要点

1. **核心概念**：
   - lastIndex 是动态更新的值，不是固定的
   - 每个节点处理后都可能更新 lastIndex
   - 用于判断后续节点是否需要移动

2. **判断逻辑**：
   ```javascript
   if (oldIndex < lastIndex) {
     // 需要移动
   } else {
     // 更新 lastIndex
     lastIndex = Math.max(lastIndex, oldIndex);
   }
   ```

3. **优化效果**：
   - 确保了最小的 DOM 操作次数
   - 只移动必要的节点
   - 避免了重复移动

4. **实际应用**：
   - 在处理列表重排序时特别有用
   - 是 React diff 算法性能优化的关键部分
   - 帮助实现 O(n) 的时间复杂度