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
   * 获取父节点索引
   * @param {number} index - 当前节点索引
   * @returns {number} 父节点索引
   */
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  /**
   * 获取左子节点索引
   * @param {number} index - 当前节点索引
   * @returns {number} 左子节点索引
   */
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  /**
   * 获取右子节点索引
   * @param {number} index - 当前节点索引
   * @returns {number} 右子节点索引
   */
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  /**
   * 交换两个节点
   * @param {number} i - 第一个节点索引
   * @param {number} j - 第二个节点索引
   */
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  /**
   * 向上调整堆（迭代版本）
   * @param {number} index - 当前节点索引
   */
  heapifyUp(index) {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);

      // 子节点 >= 父节点时停止（最小堆性质）
      if (this.heap[currentIndex] >= this.heap[parentIndex]) {
        break;
      }

      // 交换当前节点和父节点
      this.swap(currentIndex, parentIndex);

      // 继续向上调整
      currentIndex = parentIndex;
    }
  }

  /**
   * 向下调整堆（迭代版本）
   * @param {number} index - 当前节点索引
   */
  heapifyDown(index) {
    const n = this.heap.length;
    let currentIndex = index;

    while (currentIndex < n) {
      let smallest = currentIndex;
      const leftChild = this.getLeftChildIndex(currentIndex);
      const rightChild = this.getRightChildIndex(currentIndex);

      // 找到最小的节点（最小堆）
      if (leftChild < n && this.heap[leftChild] < this.heap[smallest]) {
        smallest = leftChild;
      }

      if (rightChild < n && this.heap[rightChild] < this.heap[smallest]) {
        smallest = rightChild;
      }

      // 如果当前节点已经是最小的，停止调整
      if (smallest === currentIndex) {
        break;
      }

      // 交换当前节点和最小节点
      this.swap(currentIndex, smallest);

      // 继续向下调整
      currentIndex = smallest;
    }
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

/*
🎯 核心思想：为什么最小堆找第K大，最大堆找第K小？

1️⃣ 最小堆找第K大元素：
   - 维护一个大小为 K 的最小堆
   - 堆顶是这 K 个元素中最小的
   - 堆顶就是第 K 大元素
   
   例子：找第3大元素，数组 [3, 1, 4, 1, 5, 9, 2, 6]
   
   遍历过程：
   [3]           堆大小 < 3，直接加入
   [1, 3]        堆大小 < 3，直接加入
   [1, 3, 4]     堆大小 < 3，直接加入
   [1, 3, 4]     1 < 1，不加入（堆顶是1）
   [3, 4, 5]     5 > 1，删除1，加入5（堆顶是3）
   [5, 6, 9]     9 > 3，删除3，加入9（堆顶是5）
   [5, 6, 9]     2 < 5，不加入
   [5, 6, 9]     6 > 5，删除5，加入6（堆顶是6）
   
   最终堆顶 6 就是第3大元素！
   
   💡 关键理解：
   - 堆里保存的是"前K大"的元素
   - 用最小堆，堆顶是这K个元素中最小的
   - 新元素如果比堆顶大，说明它能进入"前K大"，踢掉当前最小的
   - 最后堆顶就是第K大元素

2️⃣ 最大堆找第K小元素：
   - 维护一个大小为 K 的最大堆
   - 堆顶是这 K 个元素中最大的
   - 堆顶就是第 K 小元素
   
   例子：找第3小元素，数组 [3, 1, 4, 1, 5, 9, 2, 6]
   
   遍历过程：
   [3]           堆大小 < 3，直接加入
   [3, 1]        堆大小 < 3，直接加入
   [4, 3, 1]     堆大小 < 3，直接加入（堆顶是4）
   [3, 1, 1]     1 < 4，删除4，加入1（堆顶是3）
   [3, 1, 1]     5 > 3，不加入
   [3, 1, 1]     9 > 3，不加入
   [2, 1, 1]     2 < 3，删除3，加入2（堆顶是2）
   [2, 1, 1]     6 > 2，不加入
   
   最终堆顶 2 就是第3小元素！
   
   💡 关键理解：
   - 堆里保存的是"前K小"的元素
   - 用最大堆，堆顶是这K个元素中最大的
   - 新元素如果比堆顶小，说明它能进入"前K小"，踢掉当前最大的
   - 最后堆顶就是第K小元素

3️⃣ 为什么用堆不用排序？

   方案对比：
   
   排序方案：
   - 时间复杂度：O(n log n)
   - 空间复杂度：O(1) 或 O(n)（取决于排序算法）
   - 需要对所有元素排序
   
   堆方案：
   - 时间复杂度：O(n log k)
   - 空间复杂度：O(k)
   - 只需要维护 k 个元素
   
   性能对比：
   数组大小 n = 1,000,000，k = 10
   
   排序：1,000,000 * log(1,000,000) ≈ 20,000,000 次操作
   堆：  1,000,000 * log(10) ≈ 3,300,000 次操作
   
   堆方案快 6 倍！
   
   💡 优势总结：
   1. 时间更优：当 k << n 时，log k << log n
   2. 空间更优：只需要 O(k) 空间，不需要存储所有元素
   3. 在线算法：可以处理流式数据，不需要一次性加载所有数据
   4. 提前终止：不需要对所有元素排序，只关心前K个

4️⃣ 记忆技巧：

   找第K大 → 用最小堆 → 保留"大"的，淘汰"小"的 → 堆顶是K个大数中最小的
   找第K小 → 用最大堆 → 保留"小"的，淘汰"大"的 → 堆顶是K个小数中最大的
   
   反向思维：
   - 要找大的，就用小堆（守门员是最小的，比守门员小的进不来）
   - 要找小的，就用大堆（守门员是最大的，比守门员大的进不来）
*/

/**
 * 使用最小堆找第K大元素
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number} 第K大元素
 * 
 * 时间复杂度：O(n log k)
 * 空间复杂度：O(k)
 */
function findKthLargest(nums, k) {
  const minHeap = createMinHeap();
  
  for (let num of nums) {
    if (minHeap.size < k) {
      // 堆未满，直接加入
      minHeap.push(num);
    } else if (num > minHeap.peek()) {
      // num 比堆顶大，说明它能进入"前K大"
      // 删除当前最小的（堆顶），加入新元素
      minHeap.pop();
      minHeap.push(num);
    }
    // 如果 num <= 堆顶，说明它不够大，不处理
  }
  
  // 堆顶就是第K大元素
  return minHeap.peek();
}

/**
 * 使用最大堆找第K小元素
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number} 第K小元素
 * 
 * 时间复杂度：O(n log k)
 * 空间复杂度：O(k)
 */
function findKthSmallest(nums, k) {
  const maxHeap = createMaxHeap();
  
  for (let num of nums) {
    if (maxHeap.size < k) {
      // 堆未满，直接加入
      maxHeap.push(num);
    } else if (num < maxHeap.peek()) {
      // num 比堆顶小，说明它能进入"前K小"
      // 删除当前最大的（堆顶），加入新元素
      maxHeap.pop();
      maxHeap.push(num);
    }
    // 如果 num >= 堆顶，说明它不够小，不处理
  }
  
  // 堆顶就是第K小元素
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
   - 父节点索引: getParentIndex(index) = Math.floor((index - 1) / 2)
   - 左子节点索引: getLeftChildIndex(index) = 2 * index + 1
   - 右子节点索引: getRightChildIndex(index) = 2 * index + 2

4. 比较函数：
   - 最小堆: (a, b) => a - b
   - 最大堆: (a, b) => b - a

5. 调整逻辑（迭代版本）：
   - 向上调整: 循环与父节点比较，直到满足堆性质
   - 向下调整: 循环与子节点比较，直到满足堆性质
   - 使用 while 循环替代递归，避免栈溢出

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
