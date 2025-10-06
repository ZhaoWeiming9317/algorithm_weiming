/**
 * 链表排序 - 面试背诵版本
 * 只保留核心的归并排序实现
 */

// ==================== 链表节点定义 ====================

function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

// ==================== 归并排序实现 ====================

/**
 * 归并排序链表
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(log n)
 */
function sortList(head) {
  // 边界条件
  if (!head || !head.next) {
    return head;
  }
  
  // 找到链表中点
  const mid = findMiddle(head);
  const right = mid.next;
  mid.next = null; // 断开链表
  
  // 递归排序左右两部分
  const left = sortList(head);
  const rightSorted = sortList(right);
  
  // 合并两个有序链表
  return mergeTwoLists(left, rightSorted);
}

/**
 * 找到链表中点（快慢指针）
 */
function findMiddle(head) {
  let slow = head;
  let fast = head.next; // 从 next 出发找中点才合理
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}

/**
 * 合并两个有序链表
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

// ==================== 工具函数 ====================

/**
 * 创建链表
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

// ==================== 测试 ====================

function test() {
  console.log('=== 链表排序测试 ===');
  
  const testCases = [
    [4, 2, 1, 3],
    [-1, 5, 3, 4, 0],
    [1],
    [2, 1],
    [1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1]
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n测试用例 ${index + 1}:`);
    console.log(`原数组: [${testCase.join(', ')}]`);
    
    const head = createList([...testCase]);
    const sorted = sortList(head);
    console.log(`排序后: [${listToArray(sorted).join(', ')}]`);
  });
}

// ==================== 背诵要点 ====================

/*
🧠 背诵要点：

1. 核心思想：
   - 分治法：将链表分成两半
   - 递归排序：分别排序左右两部分
   - 合并：合并两个有序链表

2. 关键步骤：
   - 找到链表中点（快慢指针）
   - 断开链表
   - 递归排序
   - 合并结果

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

5. 时间复杂度：O(n log n)
6. 空间复杂度：O(log n)

🎯 面试技巧：
1. 先写边界条件
2. 再写找中点函数
3. 然后写合并函数
4. 最后写主排序函数
5. 记住关键公式和步骤
*/

// 运行测试
test();

// 导出
export {
  ListNode,
  sortList,
  findMiddle,
  mergeTwoLists,
  createList,
  listToArray
};
