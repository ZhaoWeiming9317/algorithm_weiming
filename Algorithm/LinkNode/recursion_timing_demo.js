/**
 * 递归处理时机的差异演示
 * 通过链表例子说明"递归前处理"和"递归后处理"的本质区别
 */

class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// 创建测试链表: 1 -> 2 -> 3 -> 4 -> 5
function createTestList() {
    const head = new ListNode(1);
    head.next = new ListNode(2);
    head.next.next = new ListNode(3);
    head.next.next.next = new ListNode(4);
    head.next.next.next.next = new ListNode(5);
    return head;
}

console.log('=== 递归处理时机差异演示 ===\n');

// ==================== 例子1：打印链表 ====================
console.log('例子1：打印链表');

/**
 * 递归前处理：正向打印
 */
function printForward(head) {
    if (!head) return;
    
    // 🔥 在递归前处理 - 先处理当前节点，再递归
    console.log(head.val);
    printForward(head.next);
}

/**
 * 递归后处理：反向打印
 */
function printBackward(head) {
    if (!head) return;
    
    // 🔥 在递归后处理 - 先递归，再处理当前节点
    printBackward(head.next);
    console.log(head.val);
}

const list1 = createTestList();
console.log('原链表: 1 -> 2 -> 3 -> 4 -> 5');
console.log('递归前处理（正向）:');
printForward(list1);
console.log('递归后处理（反向）:');
printBackward(list1);

console.log('\n' + '='.repeat(50) + '\n');

// ==================== 例子2：计算链表长度 ====================
console.log('例子2：计算链表长度');

/**
 * 递归前处理：自顶向下计数
 */
function countForward(head, count = 0) {
    if (!head) return count;
    
    // 🔥 在递归前处理 - 先计数，再递归
    console.log(`访问节点 ${head.val}，当前计数: ${count + 1}`);
    return countForward(head.next, count + 1);
}

/**
 * 递归后处理：自底向上累加
 */
function countBackward(head) {
    if (!head) return 0;
    
    // 🔥 在递归后处理 - 先递归获取后续长度，再加1
    const restLength = countBackward(head.next);
    const currentLength = restLength + 1;
    console.log(`节点 ${head.val} 的子链表长度: ${restLength}，包含自己: ${currentLength}`);
    return currentLength;
}

const list2 = createTestList();
console.log('递归前处理（自顶向下计数）:');
const length1 = countForward(list2);
console.log(`总长度: ${length1}\n`);

console.log('递归后处理（自底向上累加）:');
const length2 = countBackward(list2);
console.log(`总长度: ${length2}`);

console.log('\n' + '='.repeat(50) + '\n');

// ==================== 例子3：反转链表 ====================
console.log('例子3：反转链表');

/**
 * 递归前处理：迭代式反转（模拟）
 */
function reverseIterative(head) {
    let prev = null;
    let current = head;
    
    console.log('迭代反转过程:');
    while (current) {
        console.log(`处理节点 ${current.val}`);
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}

/**
 * 递归后处理：递归式反转
 */
function reverseRecursive(head) {
    if (!head || !head.next) return head;
    
    // 🔥 先递归到底，获取新的头节点
    const newHead = reverseRecursive(head.next);
    
    // 🔥 在递归后处理 - 反转当前连接
    console.log(`反转节点 ${head.val} 和 ${head.next.val} 的连接`);
    head.next.next = head;
    head.next = null;
    
    return newHead;
}

// 测试反转
function printList(head, name) {
    const values = [];
    let current = head;
    while (current) {
        values.push(current.val);
        current = current.next;
    }
    console.log(`${name}: ${values.join(' -> ')}`);
}

const list3 = createTestList();
console.log('原链表:');
printList(list3, '原链表');

console.log('\n递归后处理（递归反转）:');
const reversed = reverseRecursive(list3);
printList(reversed, '反转后');

console.log('\n' + '='.repeat(50) + '\n');

// ==================== 核心总结 ====================
console.log('🎯 核心总结：');
console.log('');
console.log('递归前处理（类似前序遍历）:');
console.log('- 特点：自顶向下，先处理当前，再递归');
console.log('- 适用：需要传递信息给子问题');
console.log('- 例子：正向打印、计数传递、构建过程');
console.log('');
console.log('递归后处理（类似后序遍历）:');
console.log('- 特点：自底向上，先递归，再处理当前');
console.log('- 适用：需要收集子问题的结果');
console.log('- 例子：反向打印、长度累加、反转链表');
console.log('');
console.log('🔥 这就是为什么：');
console.log('- 前序遍历在递归前处理：适合构建、复制等自顶向下的操作');
console.log('- 中序遍历在中间处理：利用左子树信息，为右子树做准备');
console.log('- 后序遍历在递归后处理：需要汇聚左右子树的信息');
