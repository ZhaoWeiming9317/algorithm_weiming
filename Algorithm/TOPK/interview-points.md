# TOPK 面试要点

## 🔥 高频面试题

### 1. 数组中第K大的元素

**题目**：给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

**解法**：
- 堆排序：O(nlogk)
- 快速选择：O(n) 平均情况
- 排序：O(nlogn)

**代码要点**：
```javascript
// 堆排序解法
function findKthLargest(nums, k) {
  const minHeap = [];
  for (let num of nums) {
    if (minHeap.length < k) {
      minHeap.push(num);
      heapifyUp(minHeap, minHeap.length - 1);
    } else if (num > minHeap[0]) {
      minHeap[0] = num;
      heapifyDown(minHeap, 0);
    }
  }
  return minHeap[0];
}
```

### 2. 前K个高频元素

**题目**：给定一个数组，返回前 k 个出现频率最高的元素。

**解法**：
- 堆排序：O(nlogk)
- 桶排序：O(n)
- 快速选择：O(n) 平均情况

**代码要点**：
```javascript
// 桶排序解法
function topKFrequent(nums, k) {
  const freqMap = new Map();
  for (let num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  
  const buckets = [];
  for (let [num, freq] of freqMap) {
    if (!buckets[freq]) buckets[freq] = [];
    buckets[freq].push(num);
  }
  
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    if (buckets[i]) result.push(...buckets[i]);
  }
  
  return result.slice(0, k);
}
```

### 3. 合并K个有序链表

**题目**：合并 k 个升序链表，返回合并后的升序链表。

**解法**：
- 堆排序：O(nlogk)
- 分治法：O(nlogk)
- 顺序合并：O(nk)

**代码要点**：
```javascript
// 堆排序解法
function mergeKLists(lists) {
  const minHeap = [];
  
  // 初始化堆
  for (let list of lists) {
    if (list) minHeap.push(list);
  }
  
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (minHeap.length > 0) {
    const node = heapExtract(minHeap);
    current.next = node;
    current = current.next;
    
    if (node.next) {
      heapInsert(minHeap, node.next);
    }
  }
  
  return dummy.next;
}
```

## 🎯 核心算法实现

### 1. 堆排序

**关键点**：
- 堆的构建：从最后一个非叶子节点开始
- 堆的维护：向上调整和向下调整
- 堆的性质：父节点总是大于（或小于）子节点

**实现要点**：
```javascript
// 堆化函数
function heapify(arr, n, i, ascending = true) {
  let target = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && compare(arr[left], arr[target], ascending)) {
    target = left;
  }
  if (right < n && compare(arr[right], arr[target], ascending)) {
    target = right;
  }
  
  if (target !== i) {
    [arr[i], arr[target]] = [arr[target], arr[i]];
    heapify(arr, n, target, ascending);
  }
}
```

### 2. 快速选择

**关键点**：
- 分区操作：将数组分为两部分
- 递归选择：只处理包含目标元素的分区
- 基准选择：影响算法性能

**实现要点**：
```javascript
// 分区函数
function partition(arr, left, right, findMax = true) {
  const pivot = arr[right];
  let i = left;
  
  for (let j = left; j < right; j++) {
    if (findMax ? arr[j] >= pivot : arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}
```

## 📊 复杂度分析

### 时间复杂度

| 算法 | 平均情况 | 最坏情况 | 最好情况 |
|------|----------|----------|----------|
| 堆排序 | O(nlogk) | O(nlogk) | O(nlogk) |
| 快速选择 | O(n) | O(n²) | O(n) |
| 排序 | O(nlogn) | O(nlogn) | O(nlogn) |
| 桶排序 | O(n) | O(n) | O(n) |

### 空间复杂度

| 算法 | 空间复杂度 | 说明 |
|------|------------|------|
| 堆排序 | O(k) | 维护大小为k的堆 |
| 快速选择 | O(1) | 原地操作 |
| 排序 | O(1) | 原地排序 |
| 桶排序 | O(n) | 频率映射和桶 |

## 🎪 面试技巧

### 1. 问题分析
- 先理解题目要求
- 分析数据特点
- 考虑边界情况

### 2. 解法选择
- 根据K值选择算法
- 根据查询次数选择
- 根据数据特点选择

### 3. 代码实现
- 先写伪代码
- 再写具体实现
- 注意边界处理

### 4. 复杂度分析
- 分析时间复杂度
- 分析空间复杂度
- 分析最坏情况

## ⚠️ 常见陷阱

### 1. 边界处理
```javascript
// 错误：没有处理空数组
function findKthLargest(nums, k) {
  return quickSelect(nums, 0, nums.length - 1, k - 1);
}

// 正确：处理边界情况
function findKthLargest(nums, k) {
  if (nums.length === 0 || k <= 0 || k > nums.length) {
    throw new Error('Invalid input');
  }
  return quickSelect(nums, 0, nums.length - 1, k - 1);
}
```

### 2. 索引问题
```javascript
// 错误：索引从1开始
function findKthLargest(nums, k) {
  return quickSelect(nums, 0, nums.length - 1, k);
}

// 正确：索引从0开始
function findKthLargest(nums, k) {
  return quickSelect(nums, 0, nums.length - 1, k - 1);
}
```

### 3. 堆的维护
```javascript
// 错误：没有正确维护堆
function heapInsert(heap, value) {
  heap.push(value);
  // 忘记调用heapifyUp
}

// 正确：正确维护堆
function heapInsert(heap, value) {
  heap.push(value);
  heapifyUp(heap, heap.length - 1);
}
```

## 🚀 优化技巧

### 1. 随机化选择
```javascript
// 随机选择基准元素，避免最坏情况
function quickSelectRandomized(nums, left, right, k) {
  const randomIndex = Math.floor(Math.random() * (right - left + 1)) + left;
  [nums[randomIndex], nums[right]] = [nums[right], nums[randomIndex]];
  return quickSelect(nums, left, right, k);
}
```

### 2. 三路分区
```javascript
// 处理重复元素，减少递归调用
function partition3Way(nums, left, right) {
  const pivot = nums[right];
  let lt = left, gt = right, i = left;
  
  while (i <= gt) {
    if (nums[i] > pivot) {
      [nums[i], nums[lt]] = [nums[lt], nums[i]];
      lt++; i++;
    } else if (nums[i] < pivot) {
      [nums[i], nums[gt]] = [nums[gt], nums[i]];
      gt--;
    } else {
      i++;
    }
  }
  
  return [lt, gt];
}
```

### 3. 堆的优化
```javascript
// 使用数组实现堆，减少内存分配
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }
  
  extract() {
    if (this.heap.length === 0) return null;
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    
    return min;
  }
}
```

## 📚 练习题

### 1. 基础题目
- 数组中第K大的元素
- 数组中第K小的元素
- 前K个最大元素
- 前K个最小元素

### 2. 进阶题目
- 前K个高频元素
- 前K个高频单词
- 合并K个有序链表
- 数据流中的第K大元素

### 3. 变形题目
- 二维数组中的第K大元素
- 链表中的第K个节点
- 二叉搜索树中的第K小元素

## 💡 总结

TOPK算法面试要点：

1. **掌握核心算法**：堆排序、快速选择
2. **理解复杂度**：时间复杂度和空间复杂度
3. **注意边界处理**：空数组、K值越界
4. **优化技巧**：随机化、三路分区
5. **实际应用**：推荐系统、排行榜

通过系统学习和练习，能够熟练应对TOPK相关的面试题目。
