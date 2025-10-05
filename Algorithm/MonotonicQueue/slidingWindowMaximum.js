/**
 * 239. 滑动窗口最大值 (Sliding Window Maximum)
 * 
 * 题目：给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到最右侧。
 * 你只能看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
 * 返回每个窗口中的最大值。
 * 
 * 示例：
 * 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
 * 输出：[3,3,5,5,6,7]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(k)
 */

// 方法1：单调队列 - 推荐
// 所以单调队列的核心是动态维护单调性，而不是排序！它通过移除"无用"元素来保证队列中始终保持着我们需要的单调性质。
function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // 存储数组索引，维护递减序列
  
  for (let i = 0; i < nums.length; i++) {
    // 1. 移除窗口外的元素（超出窗口范围的索引）
    while (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }
    
    // 2. 移除队列中所有小于当前元素的元素
    // 因为它们不可能成为最大值
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    
    // 3. 将当前元素索引加入队列
    deque.push(i);
    
    // 4. 当窗口大小达到 k 时，记录最大值
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  
  return result;
}

// 方法2：优先队列（堆） - 使用数组模拟
function maxSlidingWindowWithHeap(nums, k) {
  const result = [];
  const heap = []; // 最大堆，存储 [值, 索引]
  
  // 堆操作函数
  function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left][0] > arr[largest][0]) {
      largest = left;
    }
    
    if (right < n && arr[right][0] > arr[largest][0]) {
      largest = right;
    }
    
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }
  
  // 插入元素
  function insertHeap(value, index) {
    heap.push([value, index]);
    let i = heap.length - 1;
    
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent][0] >= heap[i][0]) break;
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      i = parent;
    }
  }
  
  // 移除堆顶
  function extractMax() {
    if (heap.length === 0) return null;
    
    const max = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    
    if (heap.length > 0) {
      heapify(heap, heap.length, 0);
    }
    
    return max;
  }
  
  // 滑动窗口
  for (let i = 0; i < nums.length; i++) {
    // 添加当前元素
    insertHeap(nums[i], i);
    
    // 移除超出窗口的元素
    while (heap.length > 0 && heap[0][1] <= i - k) {
      extractMax();
    }
    
    // 当窗口大小达到 k 时，记录最大值
    if (i >= k - 1) {
      result.push(heap[0][0]);
    }
  }
  
  return result;
}

// 方法3：暴力解法 - O(n*k) - 仅用于对比
function maxSlidingWindowBruteForce(nums, k) {
  const result = [];
  
  for (let i = 0; i <= nums.length - k; i++) {
    let max = nums[i];
    for (let j = i; j < i + k; j++) {
      max = Math.max(max, nums[j]);
    }
    result.push(max);
  }
  
  return result;
}

// 方法4：优化的单调队列 - 使用双端队列
class MonotonicDeque {
  constructor() {
    this.deque = [];
  }
  
  // 移除所有小于当前元素的元素
  push(value) {
    while (this.deque.length > 0 && this.deque[this.deque.length - 1] < value) {
      this.deque.pop();
    }
    this.deque.push(value);
  }
  
  // 移除窗口外的元素
  pop(value) {
    if (this.deque.length > 0 && this.deque[0] === value) {
      this.deque.shift();
    }
  }
  
  // 获取最大值
  max() {
    return this.deque[0];
  }
}

function maxSlidingWindowOptimized(nums, k) {
  const result = [];
  const window = new MonotonicDeque();
  
  // 初始化第一个窗口
  for (let i = 0; i < k; i++) {
    window.push(nums[i]);
  }
  result.push(window.max());
  
  // 滑动窗口
  for (let i = k; i < nums.length; i++) {
    // 移除窗口左边的元素
    window.pop(nums[i - k]);
    // 添加窗口右边的元素
    window.push(nums[i]);
    // 记录最大值
    result.push(window.max());
  }
  
  return result;
}

// 测试用例
console.log('=== 滑动窗口最大值测试 ===');

const nums = [1, 3, -1, -3, 5, 3, 6, 7];
const k = 3;

console.log('输入数组:', nums);
console.log('窗口大小:', k);

console.log('方法1 - 单调队列:', maxSlidingWindow(nums, k)); // [3,3,5,5,6,7]
console.log('方法2 - 优先队列:', maxSlidingWindowWithHeap(nums, k)); // [3,3,5,5,6,7]
console.log('方法3 - 暴力解法:', maxSlidingWindowBruteForce(nums, k)); // [3,3,5,5,6,7]
console.log('方法4 - 优化单调队列:', maxSlidingWindowOptimized(nums, k)); // [3,3,5,5,6,7]

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('单个元素:', maxSlidingWindow([1], 1)); // [1]
console.log('窗口大小等于数组长度:', maxSlidingWindow([1, 2, 3], 3)); // [3]
console.log('递减数组:', maxSlidingWindow([3, 2, 1], 2)); // [3, 2]

module.exports = { 
  maxSlidingWindow, 
  maxSlidingWindowWithHeap, 
  maxSlidingWindowBruteForce,
  maxSlidingWindowOptimized,
  MonotonicDeque 
};
