/**
 * 超简化堆实现 - 面试背诵版本
 * 只保留核心功能，易于记忆
 * 
 * 堆的核心原理：
 * 1. 完全二叉树：用数组存储，满足完全二叉树的性质
 * 2. 堆序性质：父节点总是大于（最大堆）或小于（最小堆）子节点
 * 3. 数组索引关系：
 *    - 父节点索引: Math.floor((index - 1) / 2)
 *    - 左子节点索引: 2 * index + 1
 *    - 右子节点索引: 2 * index + 2
 */

class SimpleHeap {
  constructor(isMinHeap = true) {
    this.heap = [];                    // 用数组存储堆
    this.isMinHeap = isMinHeap;        // true: 最小堆, false: 最大堆
  }

  /**
   * 获取堆的大小
   * 为什么用 getter？因为 size 是动态计算的属性
   */
  get size() {
    return this.heap.length;
  }

  /**
   * 判断堆是否为空
   * 空堆不能进行 pop 操作
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * 获取堆顶元素（不删除）
   * 堆顶元素是数组的第一个元素
   * 最小堆：堆顶是最小值
   * 最大堆：堆顶是最大值
   */
  peek() {
    return this.heap[0];
  }

  /**
   * 插入元素
   * 步骤：
   * 1. 将新元素添加到数组末尾
   * 2. 向上调整堆，恢复堆序性质
   * 
   * 时间复杂度：O(log n)
   */
  push(value) {
    this.heap.push(value);                    // 添加到末尾
    this.heapifyUp(this.heap.length - 1);     // 向上调整
  }

  /**
   * 删除堆顶元素
   * 步骤：
   * 1. 保存堆顶元素
   * 2. 将最后一个元素移到堆顶
   * 3. 向下调整堆，恢复堆序性质
   * 
   * 时间复杂度：O(log n)
   */
  pop() {
    const top = this.heap[0];                 // 保存堆顶
    const last = this.heap.pop();             // 取出最后一个元素
    
    if (this.heap.length > 0) {
      this.heap[0] = last;                    // 将最后一个元素移到堆顶
      this.heapifyDown(0);                    // 向下调整
    }
    
    return top;
  }

  /**
   * 向上调整堆（插入时使用）
   * 原理：新插入的元素可能违反堆序性质，需要向上调整
   * 
   * 步骤：
   * 1. 比较当前节点与父节点
   * 2. 如果违反堆序性质，交换位置
   * 3. 继续向上调整，直到满足堆序性质
   * 
   * 时间复杂度：O(log n)
   */
  heapifyUp(index) {
    while (index > 0) {                       // 直到到达根节点
      const parent = Math.floor((index - 1) / 2);  // 计算父节点索引
      
      if (this.shouldSwap(index, parent)) {   // 如果违反堆序性质
        [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];  // 交换
        index = parent;                       // 继续向上调整
      } else {
        break;                                // 满足堆序性质，退出
      }
    }
  }

  /**
   * 向下调整堆（删除时使用）
   * 原理：删除堆顶后，新的堆顶可能违反堆序性质，需要向下调整
   * 
   * 步骤：
   * 1. 比较当前节点与左右子节点
   * 2. 找到应该交换的子节点
   * 3. 交换位置，继续向下调整
   * 
   * 时间复杂度：O(log n)
   */
  heapifyDown(index) {
    const n = this.heap.length;
    
    while (index < n) {                       // 直到到达叶子节点
      let target = index;                     // 目标节点（当前节点）
      const left = 2 * index + 1;             // 左子节点索引
      const right = 2 * index + 2;            // 右子节点索引
      
      // 比较左子节点
      if (left < n && this.shouldSwap(left, target)) {
        target = left;
      }
      
      // 比较右子节点
      if (right < n && this.shouldSwap(right, target)) {
        target = right;
      }
      
      if (target === index) break;            // 满足堆序性质，退出
      
      // 交换位置
      [this.heap[index], this.heap[target]] = [this.heap[target], this.heap[index]];
      index = target;                         // 继续向下调整
    }
  }

  /**
   * 判断是否应该交换
   * 这是实现最大堆和最小堆的关键函数
   * 
   * 最小堆：子节点 < 父节点时交换
   * 最大堆：子节点 > 父节点时交换
   * 
   * 参数说明：
   * @param {number} child - 子节点索引
   * @param {number} parent - 父节点索引
   * @returns {boolean} 是否应该交换
   */
  shouldSwap(child, parent) {
    if (this.isMinHeap) {
      // 最小堆：子节点小于父节点时交换
      return this.heap[child] < this.heap[parent];
    } else {
      // 最大堆：子节点大于父节点时交换
      return this.heap[child] > this.heap[parent];
    }
  }
}

// ==================== 便捷创建函数 ====================

/**
 * 创建最小堆
 * 最小堆：父节点总是小于等于子节点
 * 堆顶元素是最小值
 * 
 * 应用场景：
 * - 找第K大元素
 * - 合并K个有序链表
 * - 优先队列（优先级小的先出）
 */
function createMinHeap() {
  return new SimpleHeap(true);
}

/**
 * 创建最大堆
 * 最大堆：父节点总是大于等于子节点
 * 堆顶元素是最大值
 * 
 * 应用场景：
 * - 找第K小元素
 * - 优先队列（优先级大的先出）
 * - 堆排序（升序）
 */
function createMaxHeap() {
  return new SimpleHeap(false);
}

// ==================== TOPK 应用 ====================

/**
 * 找第K大元素
 * 
 * 核心思想：维护一个大小为K的最小堆
 * 为什么用最小堆？
 * - 堆顶是当前K个元素中的最小值
 * - 如果新元素比堆顶大，说明它可能是第K大元素
 * - 替换堆顶后，堆顶仍然是第K大元素
 * 
 * 算法步骤：
 * 1. 遍历数组，维护大小为K的最小堆
 * 2. 如果堆未满，直接插入
 * 3. 如果堆已满且新元素比堆顶大，替换堆顶
 * 4. 最后堆顶就是第K大元素
 * 
 * 时间复杂度：O(n log k)
 * 空间复杂度：O(k)
 * 
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number} 第K大元素
 */
function findKthLargest(nums, k) {
  const minHeap = createMinHeap();  // 创建最小堆
  
  for (let num of nums) {
    if (minHeap.size < k) {
      // 堆未满，直接插入
      minHeap.push(num);
    } else if (num > minHeap.peek()) {
      // 堆已满且新元素比堆顶大，替换堆顶
      minHeap.pop();      // 删除堆顶（最小的元素）
      minHeap.push(num);  // 插入新元素
    }
    // 如果新元素 <= 堆顶，忽略（不可能是第K大）
  }
  
  return minHeap.peek();  // 堆顶就是第K大元素
}

/**
 * 找第K小元素
 * 
 * 核心思想：维护一个大小为K的最大堆
 * 为什么用最大堆？
 * - 堆顶是当前K个元素中的最大值
 * - 如果新元素比堆顶小，说明它可能是第K小元素
 * - 替换堆顶后，堆顶仍然是第K小元素
 * 
 * 算法步骤：
 * 1. 遍历数组，维护大小为K的最大堆
 * 2. 如果堆未满，直接插入
 * 3. 如果堆已满且新元素比堆顶小，替换堆顶
 * 4. 最后堆顶就是第K小元素
 * 
 * 时间复杂度：O(n log k)
 * 空间复杂度：O(k)
 * 
 * @param {number[]} nums - 数组
 * @param {number} k - K值
 * @returns {number} 第K小元素
 */
function findKthSmallest(nums, k) {
  const maxHeap = createMaxHeap();  // 创建最大堆
  
  for (let num of nums) {
    if (maxHeap.size < k) {
      // 堆未满，直接插入
      maxHeap.push(num);
    } else if (num < maxHeap.peek()) {
      // 堆已满且新元素比堆顶小，替换堆顶
      maxHeap.pop();      // 删除堆顶（最大的元素）
      maxHeap.push(num);  // 插入新元素
    }
    // 如果新元素 >= 堆顶，忽略（不可能是第K小）
  }
  
  return maxHeap.peek();  // 堆顶就是第K小元素
}

// ==================== 测试 ====================

/**
 * 测试堆的基本功能
 * 演示最小堆和最大堆的工作原理
 */
function test() {
  console.log('=== 超简化堆测试 ===');
  
  // 测试最小堆
  console.log('\n--- 最小堆测试 ---');
  const minHeap = createMinHeap();
  console.log('插入元素: 3, 1, 4, 1, 5');
  
  minHeap.push(3);  // 堆: [3]
  minHeap.push(1);  // 堆: [1, 3] (1向上调整到堆顶)
  minHeap.push(4);  // 堆: [1, 3, 4] (4不需要调整)
  minHeap.push(1);  // 堆: [1, 1, 4, 3] (第二个1向上调整)
  minHeap.push(5);  // 堆: [1, 1, 4, 3, 5] (5不需要调整)
  
  console.log('最小堆:', minHeap.heap);
  console.log('堆顶:', minHeap.peek());  // 应该是最小值 1
  console.log('删除堆顶:', minHeap.pop());  // 删除1，最后一个元素5移到堆顶
  console.log('删除后:', minHeap.heap);  // 堆: [1, 3, 4, 5] (5向下调整)
  
  // 测试最大堆
  console.log('\n--- 最大堆测试 ---');
  const maxHeap = createMaxHeap();
  console.log('插入元素: 3, 1, 4, 1, 5');
  
  maxHeap.push(3);  // 堆: [3]
  maxHeap.push(1);  // 堆: [3, 1] (1不需要调整)
  maxHeap.push(4);  // 堆: [4, 1, 3] (4向上调整到堆顶)
  maxHeap.push(1);  // 堆: [4, 1, 3, 1] (第二个1不需要调整)
  maxHeap.push(5);  // 堆: [5, 4, 3, 1, 1] (5向上调整到堆顶)
  
  console.log('最大堆:', maxHeap.heap);
  console.log('堆顶:', maxHeap.peek());  // 应该是最大值 5
  console.log('删除堆顶:', maxHeap.pop());  // 删除5，最后一个元素1移到堆顶
  console.log('删除后:', maxHeap.heap);  // 堆: [4, 1, 3, 1] (1向下调整)
  
  // 测试TOPK应用
  console.log('\n--- TOPK 测试 ---');
  const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  console.log('数组:', nums);
  console.log('第3大元素:', findKthLargest([...nums], 3));  // 应该是 5
  console.log('第3小元素:', findKthSmallest([...nums], 3));  // 应该是 2
}

// ==================== 背诵要点 ====================

/*
🧠 堆的核心概念：

1. 堆的定义：
   - 完全二叉树：用数组存储，满足完全二叉树的性质
   - 堆序性质：父节点总是大于（最大堆）或小于（最小堆）子节点
   - 堆顶：数组第一个元素，是最值

2. 数组索引关系（关键公式）：
   - 父节点索引: Math.floor((index - 1) / 2)
   - 左子节点索引: 2 * index + 1
   - 右子节点索引: 2 * index + 2

3. 堆的维护操作：
   - 插入：添加到末尾，向上调整
   - 删除：删除堆顶，将最后一个元素移到堆顶，向下调整
   - 向上调整：与父节点比较，违反堆序性质则交换
   - 向下调整：与子节点比较，找到应该交换的子节点

4. 最大堆 vs 最小堆：
   - 最大堆：父节点 >= 子节点，堆顶是最大值
   - 最小堆：父节点 <= 子节点，堆顶是最小值
   - 实现差异：shouldSwap 函数的比较逻辑不同

5. TOPK 应用原理：
   - 第K大元素：维护大小为K的最小堆
     * 堆顶是当前K个元素中的最小值
     * 新元素比堆顶大时，替换堆顶
     * 最后堆顶就是第K大元素
   - 第K小元素：维护大小为K的最大堆
     * 堆顶是当前K个元素中的最大值
     * 新元素比堆顶小时，替换堆顶
     * 最后堆顶就是第K小元素

🎯 面试背诵顺序：

1. 先写构造函数：
   ```javascript
   constructor(isMinHeap = true) {
     this.heap = [];
     this.isMinHeap = isMinHeap;
   }
   ```

2. 再写基本方法：
   ```javascript
   get size() { return this.heap.length; }
   isEmpty() { return this.heap.length === 0; }
   peek() { return this.heap[0]; }
   ```

3. 然后写核心操作：
   ```javascript
   push(value) {
     this.heap.push(value);
     this.heapifyUp(this.heap.length - 1);
   }
   
   pop() {
     const top = this.heap[0];
     const last = this.heap.pop();
     if (this.heap.length > 0) {
       this.heap[0] = last;
       this.heapifyDown(0);
     }
     return top;
   }
   ```

4. 接着写调整函数：
   ```javascript
   heapifyUp(index) {
     while (index > 0) {
       const parent = Math.floor((index - 1) / 2);
       if (this.shouldSwap(index, parent)) {
         [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
         index = parent;
       } else {
         break;
       }
     }
   }
   
   heapifyDown(index) {
     const n = this.heap.length;
     while (index < n) {
       let target = index;
       const left = 2 * index + 1;
       const right = 2 * index + 2;
       
       if (left < n && this.shouldSwap(left, target)) target = left;
       if (right < n && this.shouldSwap(right, target)) target = right;
       
       if (target === index) break;
       
       [this.heap[index], this.heap[target]] = [this.heap[target], this.heap[index]];
       index = target;
     }
   }
   ```

5. 最后写判断函数：
   ```javascript
   shouldSwap(child, parent) {
     if (this.isMinHeap) {
       return this.heap[child] < this.heap[parent];
     } else {
       return this.heap[child] > this.heap[parent];
     }
   }
   ```

6. TOPK 应用：
   ```javascript
   // 第K大元素
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
   ```

💡 记忆技巧：
1. 记住关键公式：父节点、子节点索引计算
2. 记住交换逻辑：最小堆 < 交换，最大堆 > 交换
3. 记住TOPK原理：第K大用最小堆，第K小用最大堆
4. 记住调整方向：插入向上调整，删除向下调整
5. 记住时间复杂度：O(log n) 调整，O(n log k) TOPK

🚀 面试优势：
- 代码简洁，逻辑清晰
- 注释详细，易于理解
- 应用广泛，实用性强
- 复杂度稳定，性能可靠
*/

// 运行测试
test();

// 导出
export {
  SimpleHeap,
  createMinHeap,
  createMaxHeap,
  findKthLargest,
  findKthSmallest
};
