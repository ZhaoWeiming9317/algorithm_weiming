/**
 * 链表排序算法实现
 * 题目：给定链表的头结点 head，请将其按升序排列并返回排序后的链表
 * 
 * 解法1：归并排序 - O(n log n)
 * 解法2：快速排序 - O(n log n) 平均情况
 * 解法3：冒泡排序 - O(n²)
 * 解法4：选择排序 - O(n²)
 */

// ==================== 链表节点定义 ====================

/**
 * 链表节点
 * @param {number} val - 节点值
 * @param {ListNode} next - 下一个节点
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

// ==================== 解法1：归并排序（推荐）====================

/**
 * 归并排序链表
 * 核心思想：分治法，将链表分成两半，分别排序后合并
 * 
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(log n) - 递归调用栈
 * 
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 */
function sortListMergeSort(head) {
  // 边界条件
  if (!head || !head.next) {
    return head;
  }
  
  // 找到链表中点
  const mid = findMiddle(head);
  const right = mid.next;
  mid.next = null; // 断开链表
  
  // 递归排序左右两部分
  const left = sortListMergeSort(head);
  const rightSorted = sortListMergeSort(right);
  
  // 合并两个有序链表
  return mergeTwoLists(left, rightSorted);
}

/**
 * 找到链表中点（快慢指针）
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 中点节点
 */
function findMiddle(head) {
  let slow = head;
  let fast = head.next;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

/**
 * 合并两个有序链表
 * @param {ListNode} l1 - 第一个有序链表
 * @param {ListNode} l2 - 第二个有序链表
 * @returns {ListNode} 合并后的有序链表
 */
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  // 连接剩余节点
  current.next = l1 || l2;
  
  return dummy.next;
}

// ==================== 解法2：快速排序 ====================

/**
 * 快速排序链表
 * 核心思想：选择基准值，将链表分为小于基准和大于基准两部分
 * 
 * 时间复杂度：O(n log n) 平均情况，O(n²) 最坏情况
 * 空间复杂度：O(log n) - 递归调用栈
 * 
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 */
function sortListQuickSort(head) {
  if (!head || !head.next) {
    return head;
  }
  
  // 选择第一个节点作为基准
  const pivot = head.val;
  
  // 分割链表
  const { left, right, equal } = partition(head, pivot);
  
  // 递归排序左右两部分
  const leftSorted = sortListQuickSort(left);
  const rightSorted = sortListQuickSort(right);
  
  // 合并结果
  return concatenate(leftSorted, equal, rightSorted);
}

/**
 * 分割链表
 * @param {ListNode} head - 链表头节点
 * @param {number} pivot - 基准值
 * @returns {Object} 包含left、right、equal三个链表的对象
 */
function partition(head, pivot) {
  const leftDummy = new ListNode(0);
  const rightDummy = new ListNode(0);
  const equalDummy = new ListNode(0);
  
  let left = leftDummy;
  let right = rightDummy;
  let equal = equalDummy;
  
  let current = head;
  
  while (current) {
    if (current.val < pivot) {
      left.next = current;
      left = left.next;
    } else if (current.val > pivot) {
      right.next = current;
      right = right.next;
    } else {
      equal.next = current;
      equal = equal.next;
    }
    current = current.next;
  }
  
  // 断开链表
  left.next = null;
  right.next = null;
  equal.next = null;
  
  return {
    left: leftDummy.next,
    right: rightDummy.next,
    equal: equalDummy.next
  };
}

/**
 * 连接三个链表
 * @param {ListNode} left - 左链表
 * @param {ListNode} equal - 等于链表
 * @param {ListNode} right - 右链表
 * @returns {ListNode} 连接后的链表
 */
function concatenate(left, equal, right) {
  const dummy = new ListNode(0);
  let current = dummy;
  
  // 连接左链表
  if (left) {
    current.next = left;
    while (current.next) {
      current = current.next;
    }
  }
  
  // 连接等于链表
  if (equal) {
    current.next = equal;
    while (current.next) {
      current = current.next;
    }
  }
  
  // 连接右链表
  if (right) {
    current.next = right;
  }
  
  return dummy.next;
}

// ==================== 解法3：冒泡排序 ====================

/**
 * 冒泡排序链表
 * 核心思想：相邻节点比较，较大的向后移动
 * 
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 */
function sortListBubbleSort(head) {
  if (!head || !head.next) {
    return head;
  }
  
  let dummy = new ListNode(0);
  dummy.next = head;
  
  let swapped = true;
  
  while (swapped) {
    swapped = false;
    let prev = dummy;
    let current = dummy.next;
    
    while (current && current.next) {
      if (current.val > current.next.val) {
        // 交换节点
        const next = current.next;
        current.next = next.next;
        next.next = current;
        prev.next = next;
        
        swapped = true;
      }
      prev = prev.next;
      current = prev.next;
    }
  }
  
  return dummy.next;
}

// ==================== 解法4：选择排序 ====================

/**
 * 选择排序链表
 * 核心思想：每次找到最小值节点，放到已排序部分的末尾
 * 
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的链表头节点
 */
function sortListSelectionSort(head) {
  if (!head || !head.next) {
    return head;
  }
  
  let dummy = new ListNode(0);
  dummy.next = head;
  
  let sorted = dummy;
  
  while (sorted.next) {
    let min = sorted.next;
    let current = sorted.next;
    
    // 找到最小值节点
    while (current.next) {
      if (current.next.val < min.val) {
        min = current.next;
      }
      current = current.next;
    }
    
    // 将最小值节点移到已排序部分的末尾
    if (min !== sorted.next) {
      // 从原位置删除
      let prev = sorted;
      while (prev.next !== min) {
        prev = prev.next;
      }
      prev.next = min.next;
      
      // 插入到已排序部分的末尾
      min.next = sorted.next;
      sorted.next = min;
    }
    
    sorted = sorted.next;
  }
  
  return dummy.next;
}

// ==================== 工具函数 ====================

/**
 * 创建链表
 * @param {number[]} arr - 数组
 * @returns {ListNode} 链表头节点
 */
function createList(arr) {
  if (!arr || arr.length === 0) {
    return null;
  }
  
  const head = new ListNode(arr[0]);
  let current = head;
  
  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i]);
    current = current.next;
  }
  
  return head;
}

/**
 * 链表转数组
 * @param {ListNode} head - 链表头节点
 * @returns {number[]} 数组
 */
function listToArray(head) {
  const result = [];
  let current = head;
  
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  
  return result;
}

/**
 * 打印链表
 * @param {ListNode} head - 链表头节点
 */
function printList(head) {
  const arr = listToArray(head);
  console.log(arr.join(' -> '));
}

// ==================== 测试用例 ====================

function testSortList() {
  console.log('=== 链表排序测试 ===');
  
  const testCases = [
    [4, 2, 1, 3],
    [-1, 5, 3, 4, 0],
    [1],
    [2, 1],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1],
    [3, 2, 4, 1, 5]
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n测试用例 ${index + 1}:`);
    console.log(`原数组: [${testCase.join(', ')}]`);
    
    // 测试归并排序
    const head1 = createList([...testCase]);
    const sorted1 = sortListMergeSort(head1);
    console.log(`归并排序: [${listToArray(sorted1).join(', ')}]`);
    
    // 测试快速排序
    const head2 = createList([...testCase]);
    const sorted2 = sortListQuickSort(head2);
    console.log(`快速排序: [${listToArray(sorted2).join(', ')}]`);
    
    // 测试冒泡排序
    const head3 = createList([...testCase]);
    const sorted3 = sortListBubbleSort(head3);
    console.log(`冒泡排序: [${listToArray(sorted3).join(', ')}]`);
    
    // 测试选择排序
    const head4 = createList([...testCase]);
    const sorted4 = sortListSelectionSort(head4);
    console.log(`选择排序: [${listToArray(sorted4).join(', ')}]`);
  });
}

// ==================== 性能测试 ====================

function performanceTest() {
  console.log('\n=== 性能测试 ===');
  
  const sizes = [100, 1000, 5000];
  
  sizes.forEach(size => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    
    console.log(`\n数组大小: ${size}`);
    
    // 测试归并排序
    const start1 = Date.now();
    const head1 = createList([...arr]);
    sortListMergeSort(head1);
    const time1 = Date.now() - start1;
    console.log(`归并排序耗时: ${time1}ms`);
    
    // 测试快速排序
    const start2 = Date.now();
    const head2 = createList([...arr]);
    sortListQuickSort(head2);
    const time2 = Date.now() - start2;
    console.log(`快速排序耗时: ${time2}ms`);
    
    // 测试冒泡排序（小数据量）
    if (size <= 1000) {
      const start3 = Date.now();
      const head3 = createList([...arr]);
      sortListBubbleSort(head3);
      const time3 = Date.now() - start3;
      console.log(`冒泡排序耗时: ${time3}ms`);
    }
  });
}

// ==================== 复杂度分析 ====================

/*
时间复杂度分析：
1. 归并排序：O(n log n)
   - 分割：O(log n)
   - 合并：O(n)
   - 总时间复杂度：O(n log n)

2. 快速排序：O(n log n) 平均情况，O(n²) 最坏情况
   - 平均情况：每次分割减少一半元素
   - 最坏情况：每次分割只减少一个元素

3. 冒泡排序：O(n²)
   - 外层循环：O(n)
   - 内层循环：O(n)
   - 总时间复杂度：O(n²)

4. 选择排序：O(n²)
   - 外层循环：O(n)
   - 内层循环：O(n)
   - 总时间复杂度：O(n²)

空间复杂度分析：
1. 归并排序：O(log n) - 递归调用栈
2. 快速排序：O(log n) - 递归调用栈
3. 冒泡排序：O(1) - 原地排序
4. 选择排序：O(1) - 原地排序

选择建议：
- 面试推荐：归并排序
- 实际应用：归并排序
- 学习理解：冒泡排序、选择排序
*/

// ==================== 面试要点 ====================

/*
🎯 面试要点：

1. 归并排序（推荐）：
   - 时间复杂度稳定：O(n log n)
   - 空间复杂度：O(log n)
   - 适合链表排序

2. 关键步骤：
   - 找到链表中点（快慢指针）
   - 递归排序左右两部分
   - 合并两个有序链表

3. 快慢指针找中点：
   ```javascript
   let slow = head;
   let fast = head.next;
   while (fast && fast.next) {
     slow = slow.next;
     fast = fast.next.next;
   }
   ```

4. 合并有序链表：
   ```javascript
   const dummy = new ListNode(0);
   let current = dummy;
   while (l1 && l2) {
     if (l1.val <= l2.val) {
       current.next = l1;
       l1 = l1.next;
     } else {
       current.next = l2;
       l2 = l2.next;
     }
     current = current.next;
   }
   current.next = l1 || l2;
   ```

💡 记忆要点：
- 归并排序是链表排序的最佳选择
- 快慢指针找中点
- 合并有序链表
- 时间复杂度：O(n log n)
*/

// 运行测试
testSortList();
performanceTest();

// 导出函数
export {
  ListNode,
  sortListMergeSort,
  sortListQuickSort,
  sortListBubbleSort,
  sortListSelectionSort,
  createList,
  listToArray,
  printList
};
