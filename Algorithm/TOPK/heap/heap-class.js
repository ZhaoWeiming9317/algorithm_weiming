/**
 * 最小堆实现 - 最简单版本
 * 只支持最小堆，根节点是最小值
 */

class Heap {
  constructor() {
    this.heap = [];
  }

  /**
   * 获取堆的大小
   */
  get size() {
    return this.heap.length;
  }

  /**
   * 判断堆是否为空
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * 获取堆顶元素（不删除）
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('Heap is empty');
    }
    return this.heap[0];
  }

  /**
   * 插入元素
   * @param {*} value - 要插入的值
   */
  push(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * 删除堆顶元素
   * @returns {*} 删除的元素
   */
  pop() {
    if (this.isEmpty()) {
      throw new Error('Heap is empty');
    }

    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      // 删除根节点后，把最后一个元素放到根节点位置
      // 注意：last 不是"最大值"，只是数组的最后一个元素
      // 这样做是为了保持数组紧凑，然后通过 heapifyDown 重新调整成最小堆
      // 例如：[1,3,2,5,4] -> 删除1后变成 [4,3,2,5] -> 把4放到根节点 [4,3,2,5] -> 调整后 [2,3,4,5]
      this.heap[0] = last;
      this.heapifyDown(0);
    }

    return top;
  }

  /**
   * 向上调整堆（递归版本）
   * @param {number} index - 当前节点索引
   */
  heapifyUp(index) {
    if (index <= 0) return;
    
    const parentIndex = Math.floor((index - 1) / 2);
    
    // 子节点 >= 父节点时停止（最小堆性质）
    if (this.heap[index] >= this.heap[parentIndex]) {
      return;
    }
    
    // 交换当前节点和父节点
    [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
    
    // 递归向上调整
    this.heapifyUp(parentIndex);
  }

  /**
   * 向下调整堆（递归版本）
   * @param {number} index - 当前节点索引
   */
  heapifyDown(index) {
    const n = this.heap.length;
    if (index >= n) return;
    
    let target = index;
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    
    // 找更小的子节点（最小堆）
    if (leftChild < n && this.heap[leftChild] < this.heap[target]) {
      target = leftChild;
    } else if (rightChild < n && this.heap[rightChild] < this.heap[target]) {
      target = rightChild;
    } else {
      return;
    }
    
    // 交换当前节点和目标节点
    [this.heap[index], this.heap[target]] = [this.heap[target], this.heap[index]];
    
    // 递归向下调整
    this.heapifyDown(target);
  }

  /**
   * 转换为数组（用于调试）
   */
  toArray() {
    return [...this.heap];
  }
}

// ==================== 便捷创建函数 ====================

/**
 * 创建最小堆
 * @returns {Heap} 最小堆实例
 */
function createMinHeap() {
  return new Heap((a, b) => a - b);
}

/**
 * 创建最大堆
 * @returns {Heap} 最大堆实例
 */
function createMaxHeap() {
  return new Heap((a, b) => b - a);
}

// ==================== 测试用例 ====================

function testHeap() {
  console.log('=== 堆测试 ===');
  
  // 测试最小堆
  console.log('\n--- 最小堆测试 ---');
  const minHeap = createMinHeap();
  
  minHeap.push(3);
  minHeap.push(1);
  minHeap.push(4);
  minHeap.push(1);
  minHeap.push(5);
  
  console.log('插入 3, 1, 4, 1, 5 后:');
  console.log('堆:', minHeap.toArray());
  console.log('堆顶:', minHeap.peek());
  
  console.log('删除堆顶:', minHeap.pop());
  console.log('删除后堆:', minHeap.toArray());
  
  console.log('删除堆顶:', minHeap.pop());
  console.log('删除后堆:', minHeap.toArray());
  
  // 测试最大堆
  console.log('\n--- 最大堆测试 ---');
  const maxHeap = createMaxHeap();
  
  maxHeap.push(3);
  maxHeap.push(1);
  maxHeap.push(4);
  maxHeap.push(1);
  maxHeap.push(5);
  
  console.log('插入 3, 1, 4, 1, 5 后:');
  console.log('堆:', maxHeap.toArray());
  console.log('堆顶:', maxHeap.peek());
  
  console.log('删除堆顶:', maxHeap.pop());
  console.log('删除后堆:', maxHeap.toArray());
  
  console.log('删除堆顶:', maxHeap.pop());
  console.log('删除后堆:', maxHeap.toArray());
}

// ==================== TOPK 应用示例 ====================

/**
 * 使用最小堆找第K大元素
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number} 第K大元素
 */
function findKthLargest(nums, k) {
  const minHeap = createMinHeap();
  
  for (let num of nums) {
    if (minHeap.size < k) {
      minHeap.push(num);
    } else if (num > minHeap.peek()) {
      minHeap.pop();
      minHeap.push(num);
    }
  }
  
  return minHeap.peek();
}

/**
 * 使用最大堆找第K小元素
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number} 第K小元素
 */
function findKthSmallest(nums, k) {
  const maxHeap = createMaxHeap();
  
  for (let num of nums) {
    if (maxHeap.size < k) {
      maxHeap.push(num);
    } else if (num < maxHeap.peek()) {
      maxHeap.pop();
      maxHeap.push(num);
    }
  }
  
  return maxHeap.peek();
}

function testTopK() {
  console.log('\n=== TOPK 测试 ===');
  
  const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  console.log('数组:', nums);
  
  // 测试第K大元素
  const kthLargest = findKthLargest([...nums], 3);
  console.log('第3大元素:', kthLargest);
  
  // 测试第K小元素
  const kthSmallest = findKthSmallest([...nums], 3);
  console.log('第3小元素:', kthSmallest);
}

// ==================== 性能测试 ====================

function performanceTest() {
  console.log('\n=== 性能测试 ===');
  
  const sizes = [1000, 10000, 100000];
  
  sizes.forEach(size => {
    const nums = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    const k = Math.floor(size / 2);
    
    console.log(`\n数组大小: ${size}, k: ${k}`);
    
    // 测试最小堆
    const start1 = Date.now();
    findKthLargest([...nums], k);
    const time1 = Date.now() - start1;
    console.log(`最小堆耗时: ${time1}ms`);
    
    // 测试最大堆
    const start2 = Date.now();
    findKthSmallest([...nums], k);
    const time2 = Date.now() - start2;
    console.log(`最大堆耗时: ${time2}ms`);
  });
}

// ==================== 背诵要点 ====================

/*
🧠 背诵要点：

1. 核心属性：
   - heap: 存储堆的数组
   - compare: 比较函数

2. 核心方法：
   - push: 插入元素，向上调整
   - pop: 删除堆顶，向下调整
   - peek: 查看堆顶
   - heapifyUp: 向上调整堆
   - heapifyDown: 向下调整堆

3. 关键公式：
   - 父节点索引: Math.floor((index - 1) / 2)
   - 左子节点索引: 2 * index + 1
   - 右子节点索引: 2 * index + 2

4. 比较函数：
   - 最小堆: (a, b) => a - b
   - 最大堆: (a, b) => b - a

5. 调整逻辑：
   - 向上调整: 与父节点比较
   - 向下调整: 与子节点比较

🎯 面试技巧：
1. 先写构造函数和基本属性
2. 再写push和pop方法
3. 最后写heapifyUp和heapifyDown
4. 记住关键公式和比较逻辑
*/

// 运行测试
testHeap();
testTopK();
performanceTest();

// 导出
export {
  Heap,
  createMinHeap,
  createMaxHeap,
  findKthLargest,
  findKthSmallest
};
