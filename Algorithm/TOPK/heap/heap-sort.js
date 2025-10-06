/**
 * TOPK 算法 - 堆排序实现
 * 手写堆排序，用于TOPK问题
 * 
 * 时间复杂度：O(nlogn)
 * 空间复杂度：O(1)
 */

// ==================== 堆排序实现 ====================

/**
 * 堆排序主函数
 * @param {number[]} arr - 待排序数组
 * @param {boolean} ascending - 是否升序排列，默认true
 * @returns {number[]} 排序后的数组
 */
function heapSort(arr, ascending = true) {
  const n = arr.length;
  
  // 构建最大堆（或最小堆）
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, ascending);
  }
  
  // 逐个提取元素
  for (let i = n - 1; i > 0; i--) {
    // 将堆顶元素与最后一个元素交换
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // 重新调整堆
    heapify(arr, i, 0, ascending);
  }
  
  return arr;
}

/**
 * 堆化函数
 * @param {number[]} arr - 数组
 * @param {number} n - 堆的大小
 * @param {number} i - 当前节点索引
 * @param {boolean} ascending - 是否升序
 */
function heapify(arr, n, i, ascending) {
  let largest = i; // 假设当前节点最大
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  // 比较左子节点
  if (left < n && compare(arr[left], arr[largest], ascending)) {
    largest = left;
  }
  
  // 比较右子节点
  if (right < n && compare(arr[right], arr[largest], ascending)) {
    largest = right;
  }
  
  // 如果最大值不是当前节点，交换并继续堆化
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest, ascending);
  }
}

/**
 * 比较函数
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @param {boolean} ascending - 是否升序
 * @returns {boolean} 比较结果
 */
function compare(a, b, ascending) {
  return ascending ? a > b : a < b;
}

// ==================== 堆的维护操作 ====================

/**
 * 向上调整堆（用于插入元素）
 * @param {number[]} heap - 堆数组
 * @param {number} index - 当前节点索引
 * @param {boolean} ascending - 是否升序
 */
function heapifyUp(heap, index, ascending = true) {
  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2);
    
    if (compare(heap[index], heap[parentIndex], ascending)) {
      [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
      index = parentIndex;
    } else {
      break;
    }
  }
}

/**
 * 向下调整堆（用于删除元素）
 * @param {number[]} heap - 堆数组
 * @param {number} index - 当前节点索引
 * @param {boolean} ascending - 是否升序
 */
function heapifyDown(heap, index, ascending = true) {
  const n = heap.length;
  
  while (index < n) {
    let target = index;
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    
    // 比较左子节点
    if (left < n && compare(heap[left], heap[target], ascending)) {
      target = left;
    }
    
    // 比较右子节点
    if (right < n && compare(heap[right], heap[target], ascending)) {
      target = right;
    }
    
    if (target === index) break;
    
    [heap[index], heap[target]] = [heap[target], heap[index]];
    index = target;
  }
}

// ==================== 堆的基本操作 ====================

/**
 * 插入元素到堆中
 * @param {number[]} heap - 堆数组
 * @param {number} value - 要插入的值
 * @param {boolean} ascending - 是否升序
 */
function heapInsert(heap, value, ascending = true) {
  heap.push(value);
  heapifyUp(heap, heap.length - 1, ascending);
}

/**
 * 从堆中删除堆顶元素
 * @param {number[]} heap - 堆数组
 * @param {boolean} ascending - 是否升序
 * @returns {number} 删除的元素
 */
function heapExtract(heap, ascending = true) {
  if (heap.length === 0) {
    throw new Error('Heap is empty');
  }
  
  const max = heap[0];
  const last = heap.pop();
  
  if (heap.length > 0) {
    heap[0] = last;
    heapifyDown(heap, 0, ascending);
  }
  
  return max;
}

/**
 * 获取堆顶元素（不删除）
 * @param {number[]} heap - 堆数组
 * @returns {number} 堆顶元素
 */
function heapPeek(heap) {
  if (heap.length === 0) {
    throw new Error('Heap is empty');
  }
  return heap[0];
}

// ==================== TOPK 应用 ====================

/**
 * 使用堆找前K个最大元素
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number[]} 前K个最大元素
 */
function topKLargestHeap(nums, k) {
  const minHeap = []; // 维护最小堆
  
  for (let num of nums) {
    if (minHeap.length < k) {
      heapInsert(minHeap, num, true); // 升序堆
    } else if (num > heapPeek(minHeap)) {
      heapExtract(minHeap, true);
      heapInsert(minHeap, num, true);
    }
  }
  
  return minHeap.sort((a, b) => b - a); // 降序返回
}

/**
 * 使用堆找前K个最小元素
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number[]} 前K个最小元素
 */
function topKSmallestHeap(nums, k) {
  const maxHeap = []; // 维护最大堆
  
  for (let num of nums) {
    if (maxHeap.length < k) {
      heapInsert(maxHeap, num, false); // 降序堆
    } else if (num < heapPeek(maxHeap)) {
      heapExtract(maxHeap, false);
      heapInsert(maxHeap, num, false);
    }
  }
  
  return maxHeap.sort((a, b) => a - b); // 升序返回
}

// ==================== 测试用例 ====================

function testHeapSort() {
  console.log('=== 堆排序测试 ===');
  
  const testCases = [
    [64, 34, 25, 12, 22, 11, 90],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [1],
    [3, 1, 4, 1, 5, 9, 2, 6]
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n测试用例 ${index + 1}:`);
    console.log(`原数组: [${testCase.join(', ')}]`);
    
    // 升序排序
    const ascending = heapSort([...testCase], true);
    console.log(`升序排序: [${ascending.join(', ')}]`);
    
    // 降序排序
    const descending = heapSort([...testCase], false);
    console.log(`降序排序: [${descending.join(', ')}]`);
  });
}

function testHeapOperations() {
  console.log('\n=== 堆操作测试 ===');
  
  const heap = [];
  
  // 插入元素
  console.log('插入元素: 5, 3, 8, 1, 9');
  heapInsert(heap, 5, true);
  heapInsert(heap, 3, true);
  heapInsert(heap, 8, true);
  heapInsert(heap, 1, true);
  heapInsert(heap, 9, true);
  console.log(`堆: [${heap.join(', ')}]`);
  
  // 查看堆顶
  console.log(`堆顶元素: ${heapPeek(heap)}`);
  
  // 删除堆顶
  const extracted = heapExtract(heap, true);
  console.log(`删除的元素: ${extracted}`);
  console.log(`删除后堆: [${heap.join(', ')}]`);
}

function testTopK() {
  console.log('\n=== TOPK测试 ===');
  
  const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  const k = 3;
  
  console.log(`数组: [${nums.join(', ')}]`);
  console.log(`k: ${k}`);
  
  // 前K个最大元素
  const topKLargest = topKLargestHeap([...nums], k);
  console.log(`前${k}个最大元素: [${topKLargest.join(', ')}]`);
  
  // 前K个最小元素
  const topKSmallest = topKSmallestHeap([...nums], k);
  console.log(`前${k}个最小元素: [${topKSmallest.join(', ')}]`);
}

// ==================== 性能测试 ====================

function performanceTest() {
  console.log('\n=== 性能测试 ===');
  
  const sizes = [1000, 10000, 100000];
  
  sizes.forEach(size => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    
    console.log(`\n数组大小: ${size}`);
    
    // 测试堆排序
    const start = Date.now();
    heapSort([...arr]);
    const time = Date.now() - start;
    console.log(`堆排序耗时: ${time}ms`);
  });
}

// ==================== 复杂度分析 ====================

/*
时间复杂度分析：
1. 构建堆：O(n)
   - 从最后一个非叶子节点开始，向上调整
   - 每个节点最多调整O(logn)次
   - 总时间复杂度：O(n)

2. 排序过程：O(nlogn)
   - 执行n-1次提取操作
   - 每次提取需要O(logn)时间
   - 总时间复杂度：O(nlogn)

3. 总时间复杂度：O(nlogn)

空间复杂度分析：
- 原地排序：O(1)
- 递归调用栈：O(logn)
- 总空间复杂度：O(logn)

堆排序的特点：
- 不稳定排序
- 原地排序
- 时间复杂度稳定为O(nlogn)
- 适合大数据量排序
*/

// 运行测试
testHeapSort();
testHeapOperations();
testTopK();
performanceTest();

// 导出函数
export {
  heapSort,
  heapifyUp,
  heapifyDown,
  heapInsert,
  heapExtract,
  heapPeek,
  topKLargestHeap,
  topKSmallestHeap
};
