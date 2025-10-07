/**
 * 反转链表 II - 反转部分链表
 * LeetCode 92: https://leetcode.com/problems/reverse-linked-list-ii/
 * 
 * 给定链表：1 -> 2 -> 3 -> 4 -> 5
 * 反转位置 2 到 4：1 -> 4 -> 3 -> 2 -> 5
 */

// 链表节点定义
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 反转部分链表 - 头插法（推荐！代码简洁）
 * @param {ListNode} head 链表头节点
 * @param {number} left 反转起始位置（从1开始）
 * @param {number} right 反转结束位置
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
  // 虚拟头节点，简化边界处理
  const dummy = new ListNode(0, head);
  
  // 1. 找到反转区间的前一个节点
  let pre = dummy;
  for (let i = 1; i < left; i++) {
    pre = pre.next;
  }
  
  // 2. 头插法：不断将后面的节点插入到反转区间的开头
  // pre -> start -> next -> ...
  // 每次把 next 插到 start 前面
  
  let start = pre.next;  // 反转区间的第一个节点（反转后会成为最后一个）
  
  // 反转 right - left 次
  for (let i = 0; i < right - left; i++) {
    const next = start.next;    // 要插入的节点
    start.next = next.next;     // start 跳过 next，指向 next.next
    next.next = pre.next;       // next 插入到最前面
    pre.next = next;            // pre 指向新的第一个节点
  }
  
  return dummy.next;
};

/**
 * 反转部分链表 - 更易理解的版本（面试推荐）
 */
var reverseBetween2 = function(head, left, right) {
  const dummy = new ListNode(0, head);
  
  // 1. 找到反转区间的前一个节点
  let pre = dummy;
  for (let i = 1; i < left; i++) {
    pre = pre.next;
  }
  
  // 2. 反转区间
  // 保存反转区间的第一个节点（反转后会成为最后一个）
  let start = pre.next;
  let prev = null;
  let curr = start;
  
  // 反转 right - left + 1 个节点
  for (let i = 0; i < right - left + 1; i++) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  // 3. 重新连接
  pre.next = prev;   // pre 连接反转后的头节点
  start.next = curr; // 原来的第一个节点（现在是最后一个）连接后继节点
  
  return dummy.next;
};

/**
 * 递归法 - 进阶版（可选）
 */
var reverseBetween3 = function(head, left, right) {
  // 如果 left = 1，就是从头开始反转前 right 个节点
  if (left === 1) {
    return reverseN(head, right);
  }
  
  // 递归：从下一个节点开始，位置减 1
  head.next = reverseBetween3(head.next, left - 1, right - 1);
  return head;
};

// 辅助函数：反转链表的前 n 个节点
let successor = null; // 后继节点
function reverseN(head, n) {
  if (n === 1) {
    successor = head.next; // 记录第 n+1 个节点
    return head;
  }
  
  const last = reverseN(head.next, n - 1);
  head.next.next = head;
  head.next = successor; // 连接后继节点
  return last;
}

// ============ 测试代码 ============

// 辅助函数：创建链表
function createList(arr) {
  const dummy = new ListNode(0);
  let curr = dummy;
  for (const val of arr) {
    curr.next = new ListNode(val);
    curr = curr.next;
  }
  return dummy.next;
}

// 辅助函数：打印链表
function printList(head) {
  const arr = [];
  while (head) {
    arr.push(head.val);
    head = head.next;
  }
  return arr.join(' -> ');
}

// 测试
console.log('========== 反转部分链表测试 ==========\n');

const list1 = createList([1, 2, 3, 4, 5]);
console.log('原链表:', printList(list1));
console.log('反转位置 2-4:', printList(reverseBetween(list1, 2, 4)));
console.log('预期结果: 1 -> 4 -> 3 -> 2 -> 5\n');

const list2 = createList([1, 2, 3, 4, 5]);
console.log('原链表:', printList(list2));
console.log('反转位置 1-3:', printList(reverseBetween2(list2, 1, 3)));
console.log('预期结果: 3 -> 2 -> 1 -> 4 -> 5\n');

const list3 = createList([5]);
console.log('原链表:', printList(list3));
console.log('反转位置 1-1:', printList(reverseBetween3(list3, 1, 1)));
console.log('预期结果: 5\n');

// ============ 核心思路总结 ============
/**
 * 【方法一：头插法】（推荐！）
 * 思路：不断将后面的节点插入到反转区间的开头
 * 
 * 例：1 -> 2 -> 3 -> 4 -> 5，反转 2-4
 * 
 * 初始：1 -> 2 -> 3 -> 4 -> 5
 *       pre  start
 * 
 * 第1次：1 -> 3 -> 2 -> 4 -> 5  (把3插到2前面)
 *       pre       start
 * 
 * 第2次：1 -> 4 -> 3 -> 2 -> 5  (把4插到3前面)
 *       pre            start
 * 
 * 完成！
 * 
 * 
 * 【方法二：完全反转】（更直观）
 * 1. 找到反转区间的前一个节点 pre
 * 2. 反转区间内的链表（标准反转）
 * 3. 重新连接：
 *    - pre.next = 反转后的头节点
 *    - 原头节点.next = 后继节点
 * 
 * 
 * 【方法三：递归】
 * 1. 如果 left = 1，就是反转前 right 个节点
 * 2. 否则递归处理 head.next，位置都减1
 * 
 * 
 * 【面试建议】
 * - 初学者：方法二（完全反转）最容易理解
 * - 面试：方法一（头插法）代码最简洁
 * - 炫技：方法三（递归）最优雅
 */

