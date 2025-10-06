# 如何实现最小堆 - 通俗易懂版

## 🤔 什么是堆？

**堆就像一个特殊的数组，但有一个重要的特点：**
- **最小堆**：父节点总是比子节点小
- **最大堆**：父节点总是比子节点大

**想象成一座金字塔**：
```
      1
     / \
    2   3
   / \ / \
  4  5 6  7
```
- 1 比 2、3 都小
- 2 比 4、5 都小
- 3 比 6、7 都小

## 📚 堆的核心概念

### 1. 数组表示
```javascript
// 堆用数组存储，索引从 0 开始
const heap = [1, 2, 3, 4, 5, 6, 7];

// 索引关系：
// 父节点索引 = Math.floor((子节点索引 - 1) / 2)
// 左子节点索引 = 父节点索引 * 2 + 1
// 右子节点索引 = 父节点索引 * 2 + 2
```

### 2. 索引关系示例
```javascript
// 数组：[1, 2, 3, 4, 5, 6, 7]
// 索引： 0  1  2  3  4  5  6

// 节点 1 (索引 0) 的子节点：
// - 左子节点：2 (索引 1) = 2*0+1
// - 右子节点：3 (索引 2) = 2*0+2

// 节点 2 (索引 1) 的子节点：
// - 左子节点：4 (索引 3) = 2*1+1
// - 右子节点：5 (索引 4) = 2*1+2

// 节点 3 (索引 2) 的子节点：
// - 左子节点：6 (索引 5) = 2*2+1
// - 右子节点：7 (索引 6) = 2*2+2

// 反向关系（子节点找父节点）：
// - 节点 1 的父节点：索引 0 = Math.floor((1-1)/2)
// - 节点 2 的父节点：索引 0 = Math.floor((2-1)/2)
// - 节点 3 的父节点：索引 1 = Math.floor((3-1)/2)
// - 节点 4 的父节点：索引 1 = Math.floor((4-1)/2)
```

## 🔧 最小堆的核心操作

### 1. 上浮（向上调整）
**什么时候用**：插入新元素后，如果新元素比父节点小，需要向上调整

```javascript
/**
 * 上浮操作（向上调整）
 * @param {Array} heap - 堆数组，存储所有元素
 * @param {number} index - 需要调整的节点索引
 * 
 * 参数说明：
 * - heap: 堆的数组表示，例如 [1, 3, 2, 4, 5]
 * - index: 当前需要向上调整的节点位置，通常是最后一个元素的索引
 * 
 * 重要提示：
 * - 插入元素时，通常用 push() 添加到数组末尾
 * - 所以 index 通常是 heap.length - 1（最后一个元素的索引）
 * - 例如：heap.push(5) 后，调用 heapifyUp(heap, heap.length - 1)
 * 
 * 示例：
 * heap = [1, 3, 2, 4]
 * heap.push(5)  // heap = [1, 3, 2, 4, 5]
 * heapifyUp(heap, 4)  // 调整索引4的元素5
 */
function heapifyUp(heap, index) {
  // 如果已经是根节点，不需要调整
  if (index === 0) return;
  
  // 计算父节点索引
  // 公式：parentIndex = Math.floor((index - 1) / 2)
  // 
  // 为什么是这个公式？
  // 1. 数组索引从0开始：0, 1, 2, 3, 4, 5, 6...
  // 2. 堆的父子关系：
  //    - 节点0的子节点：1, 2
  //    - 节点1的子节点：3, 4  
  //    - 节点2的子节点：5, 6
  //    - 节点3的子节点：7, 8
  // 3. 观察规律：
  //    - 节点1的父节点：(1-1)/2 = 0
  //    - 节点2的父节点：(2-1)/2 = 0
  //    - 节点3的父节点：(3-1)/2 = 1
  //    - 节点4的父节点：(4-1)/2 = 1
  //    - 节点5的父节点：(5-1)/2 = 2
  //    - 节点6的父节点：(6-1)/2 = 2
  // 4. 通用公式：parentIndex = Math.floor((childIndex - 1) / 2)
  const parentIndex = Math.floor((index - 1) / 2);
  
  // 如果当前节点比父节点小，交换
  if (heap[index] < heap[parentIndex]) {
    [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
    // 递归向上调整
    heapifyUp(heap, parentIndex);
  }
}
```

**通俗理解**：
- 就像气泡一样，小的元素会"浮"到上面
- 每次比较父节点，如果更小就交换位置
- 直到找到合适的位置

### 2. 下沉（向下调整）
**什么时候用**：删除根节点后，用最后一个元素替换根节点，然后向下调整

```javascript
/**
 * 下沉操作（向下调整）
 * @param {Array} heap - 堆数组，存储所有元素
 * @param {number} index - 需要调整的节点索引
 * @param {number} size - 堆的有效大小（可选，默认为 heap.length）
 * 
 * 参数说明：
 * - heap: 堆的数组表示，例如 [1, 3, 2, 4, 5]
 * - index: 当前需要向下调整的节点位置，例如 0（根节点）
 * - size: 堆的有效大小，用于边界检查，例如 5
 * 
 * 示例：
 * heap = [5, 3, 2, 4, 1]
 * index = 0, size = 5
 * 表示要将根节点5向下调整到合适位置
 */
function heapifyDown(heap, index, size) {
  let smallest = index;
  
  // 计算子节点索引
  // 公式：leftChild = 2 * index + 1, rightChild = 2 * index + 2
  // 
  // 为什么是这个公式？
  // 1. 数组索引从0开始：0, 1, 2, 3, 4, 5, 6...
  // 2. 堆的父子关系：
  //    - 节点0的子节点：1, 2
  //    - 节点1的子节点：3, 4  
  //    - 节点2的子节点：5, 6
  //    - 节点3的子节点：7, 8
  // 3. 观察规律：
  //    - 节点0的左子节点：2*0+1 = 1, 右子节点：2*0+2 = 2
  //    - 节点1的左子节点：2*1+1 = 3, 右子节点：2*1+2 = 4
  //    - 节点2的左子节点：2*2+1 = 5, 右子节点：2*2+2 = 6
  //    - 节点3的左子节点：2*3+1 = 7, 右子节点：2*3+2 = 8
  // 4. 通用公式：leftChild = 2*index+1, rightChild = 2*index+2
  const leftChild = 2 * index + 1;
  const rightChild = 2 * index + 2;
  
  // 找到当前节点和两个子节点中的最小值
  if (leftChild < size && heap[leftChild] < heap[smallest]) {
    smallest = leftChild;
  }
  
  if (rightChild < size && heap[rightChild] < heap[smallest]) {
    smallest = rightChild;
  }
  
  // 如果最小值不是当前节点，交换并继续下沉
  if (smallest !== index) {
    [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
    heapifyDown(heap, smallest, size);
  }
}
```

**通俗理解**：
- 就像石头一样，大的元素会"沉"到下面
- 每次比较子节点，找到最小的交换
- 直到找到合适的位置

## 🏗️ 完整的最小堆实现

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  // 获取父节点索引
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  
  // 获取左子节点索引
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  
  // 获取右子节点索引
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  
  // 交换两个元素
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }
  
  // 插入元素
  insert(value) {
    // 1. 将新元素添加到数组末尾
    this.heap.push(value);
    
    // 2. 向上调整，保持堆的性质
    // 注意：传入最后一个元素的索引（heap.length - 1）
    this.heapifyUp(this.heap.length - 1);
  }
  
  // 删除最小值（根节点）
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    // 1. 保存最小值
    const min = this.heap[0];
    
    // 2. 用最后一个元素替换根节点
    this.heap[0] = this.heap.pop();
    
    // 3. 向下调整，保持堆的性质
    this.heapifyDown(0);
    
    return min;
  }
  
  // 向上调整
  heapifyUp(index) {
    if (index === 0) return;
    
    const parentIndex = this.getParentIndex(index);
    
    if (this.heap[index] < this.heap[parentIndex]) {
      this.swap(index, parentIndex);
      this.heapifyUp(parentIndex);
    }
  }
  
  // 向下调整
  heapifyDown(index) {
    const leftChild = this.getLeftChildIndex(index);
    const rightChild = this.getRightChildIndex(index);
    let smallest = index;
    
    if (leftChild < this.heap.length && this.heap[leftChild] < this.heap[smallest]) {
      smallest = leftChild;
    }
    
    if (rightChild < this.heap.length && this.heap[rightChild] < this.heap[smallest]) {
      smallest = rightChild;
    }
    
    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }
  
  // 获取最小值（不删除）
  peek() {
    return this.heap[0] || null;
  }
  
  // 获取堆的大小
  size() {
    return this.heap.length;
  }
  
  // 检查堆是否为空
  isEmpty() {
    return this.heap.length === 0;
  }
}
```

## 🎯 使用示例

```javascript
// 创建最小堆
const minHeap = new MinHeap();

// 插入元素
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(8);
minHeap.insert(1);
minHeap.insert(9);

console.log('堆内容:', minHeap.heap); // [1, 3, 8, 5, 9]

// 获取最小值
console.log('最小值:', minHeap.peek()); // 1

// 删除最小值
console.log('删除的最小值:', minHeap.extractMin()); // 1
console.log('删除后的堆:', minHeap.heap); // [3, 5, 8, 9]
```

## 🔍 插入过程详解

**插入元素 1 的过程**：

```
初始堆：[5, 3, 8]
插入 1：heap.push(1) → [5, 3, 8, 1]
调用 heapifyUp(heap, 3)  // 注意：传入最后一个元素的索引

步骤 1：索引3的元素1与父节点8（索引1）比较，1 < 8，交换
[5, 1, 8, 3]

步骤 2：索引1的元素1与父节点5（索引0）比较，1 < 5，交换
[1, 5, 8, 3]

步骤 3：索引0的元素1已经是根节点，停止调整

最终结果：[1, 5, 8, 3]
```

**关键点**：
- 插入时总是 `push()` 到数组末尾
- 调用 `heapifyUp(heap, heap.length - 1)` 调整最后一个元素
- 索引计算：父节点索引 = Math.floor((子节点索引 - 1) / 2)

### smallest 变量详解

**smallest 的作用**：记录当前节点、左子节点、右子节点中的**最小值索引**

**示例**：
```javascript
heap = [5, 3, 2, 4, 1]  // 索引0的元素5需要下沉
index = 0

// 计算子节点索引
leftChild = 2*0+1 = 1   // 元素3
rightChild = 2*0+2 = 2  // 元素2

// 比较过程
smallest = 0           // 初始假设索引0最小
heap[0] = 5, heap[1] = 3, heap[2] = 2

// 比较左子节点
if (heap[1] < heap[0]) // 3 < 5，true
  smallest = 1         // 更新为索引1

// 比较右子节点  
if (heap[2] < heap[1]) // 2 < 3，true
  smallest = 2         // 更新为索引2

// 最终结果
smallest = 2           // 索引2的元素2是最小的
// 需要交换 heap[0] 和 heap[2]
```

**总结**：`smallest` 就是"三个节点中最小值的索引"

## 🔍 删除过程详解

**删除最小值的过程**：

```
初始堆：[1, 5, 3, 8]
删除 1：用最后一个元素 8 替换根节点
[8, 5, 3]

步骤 1：8 与子节点 5, 3 比较，3 最小，交换
[3, 5, 8]

步骤 2：3 与子节点比较，已经是最小，停止
最终结果：[3, 5, 8]
```

## ⚡ 时间复杂度

| 操作 | 时间复杂度 | 说明 |
|------|------------|------|
| 插入 | O(log n) | 最多需要向上调整 log n 次 |
| 删除 | O(log n) | 最多需要向下调整 log n 次 |
| 查找最小值 | O(1) | 直接返回根节点 |
| 构建堆 | O(n) | 从数组构建堆 |

## 🎯 实际应用

### 1. 优先队列
```javascript
// 任务调度，优先级高的先执行
const taskQueue = new MinHeap();
taskQueue.insert({ priority: 1, task: '紧急任务' });
taskQueue.insert({ priority: 3, task: '普通任务' });
taskQueue.insert({ priority: 2, task: '重要任务' });

// 按优先级执行任务
while (!taskQueue.isEmpty()) {
  const task = taskQueue.extractMin();
  console.log('执行任务:', task.task);
}
```

### 2. 合并有序数组
```javascript
// 合并多个有序数组
function mergeSortedArrays(arrays) {
  const minHeap = new MinHeap();
  const result = [];
  
  // 将每个数组的第一个元素加入堆
  arrays.forEach((arr, index) => {
    if (arr.length > 0) {
      minHeap.insert({ value: arr[0], arrayIndex: index, elementIndex: 0 });
    }
  });
  
  // 不断取出最小值
  while (!minHeap.isEmpty()) {
    const { value, arrayIndex, elementIndex } = minHeap.extractMin();
    result.push(value);
    
    // 如果该数组还有元素，加入下一个
    if (elementIndex + 1 < arrays[arrayIndex].length) {
      minHeap.insert({
        value: arrays[arrayIndex][elementIndex + 1],
        arrayIndex,
        elementIndex: elementIndex + 1
      });
    }
  }
  
  return result;
}
```

## 💡 关键要点

1. **堆的性质**：父节点总是比子节点小（最小堆）
2. **数组存储**：用数组存储，通过索引关系访问父子节点
3. **两个核心操作**：上浮（插入时）和下沉（删除时）
4. **时间复杂度**：插入和删除都是 O(log n)
5. **应用场景**：优先队列、堆排序、Top K 问题等

## 🎯 背诵要点（面试必备）

### 1. 索引计算公式（必背）
```javascript
// 父节点找子节点
leftChild = 2 * parentIndex + 1
rightChild = 2 * parentIndex + 2

// 子节点找父节点
parentIndex = Math.floor((childIndex - 1) / 2)
```

### 2. 核心操作流程（必背）
```javascript
// 插入操作
insert(value) {
  heap.push(value);                    // 1. 添加到末尾
  heapifyUp(heap.length - 1);         // 2. 向上调整
}

// 删除操作
extractMin() {
  const min = heap[0];                 // 1. 保存最小值
  heap[0] = heap.pop();                // 2. 用最后元素替换根节点
  heapifyDown(0);                      // 3. 向下调整
  return min;                          // 4. 返回最小值
}
```

### 3. 调整操作（必背）
```javascript
// 上浮（向上调整）
heapifyUp(index) {
  if (index === 0) return;             // 边界：已是根节点
  const parentIndex = Math.floor((index - 1) / 2);
  if (heap[index] < heap[parentIndex]) {
    swap(index, parentIndex);           // 交换
    heapifyUp(parentIndex);            // 递归调整
  }
}

// 下沉（向下调整）
heapifyDown(index) {
  const leftChild = 2 * index + 1;
  const rightChild = 2 * index + 2;
  
  // smallest 记录当前节点、左子节点、右子节点中的最小值索引
  // 初始假设当前节点就是最小的
  let smallest = index;
  
  // 比较左子节点，如果更小就更新 smallest
  if (leftChild < size && heap[leftChild] < heap[smallest]) {
    smallest = leftChild;
  }
  
  // 比较右子节点，如果更小就更新 smallest
  if (rightChild < size && heap[rightChild] < heap[smallest]) {
    smallest = rightChild;
  }
  
  // 如果最小值不是当前节点，说明需要交换
  if (smallest !== index) {
    swap(index, smallest);              // 交换
    heapifyDown(smallest);             // 递归调整
  }
}
```

### 4. 面试常问问题（必背）
```javascript
// Q: 堆的时间复杂度？
// A: 插入O(log n)，删除O(log n)，查找最小值O(1)

// Q: 堆的空间复杂度？
// A: O(n)，n个元素需要n个存储空间

// Q: 堆排序的时间复杂度？
// A: O(n log n)，构建堆O(n)，每次删除O(log n)

// Q: 堆的用途？
// A: 优先队列、堆排序、Top K问题、中位数查找
```

### 5. 记忆口诀
```
堆是数组，父子关系：
父找子：2*i+1, 2*i+2
子找父：(i-1)/2 向下取整

插入操作：push + heapifyUp
删除操作：pop + heapifyDown

最小堆：父小，最大堆：父大
时间复杂度：插入删除都是O(log n)
```

**记住**：堆就像一个"自动排序"的数组，最小值总是在最上面！
