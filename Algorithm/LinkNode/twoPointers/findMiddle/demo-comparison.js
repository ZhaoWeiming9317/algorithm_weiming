/**
 * 演示 fast = head 和 fast = head.next 的区别
 */

// 链表节点定义
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

// 辅助函数：创建链表
function createList(arr) {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

// 辅助函数：打印链表
function printList(head) {
    const values = [];
    let current = head;
    while (current) {
        values.push(current.val);
        current = current.next;
    }
    return values.join(' -> ');
}

// ==================== 方法1: fast = head ====================

/**
 * 找中点（偶数时返回第2个中点 - 上中位数）
 */
function findMiddle_Method1(head) {
    let slow = head;
    let fast = head;
    
    console.log('  初始: slow = head, fast = head');
    console.log(`        slow -> ${slow?.val}, fast -> ${fast?.val}`);
    
    let step = 0;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        step++;
        console.log(`  步骤${step}: slow -> ${slow?.val}, fast -> ${fast?.val}`);
    }
    
    console.log(`  ✅ 返回: ${slow?.val}\n`);
    return slow;
}

// ==================== 方法2: fast = head.next ====================

/**
 * 找中点（偶数时返回第1个中点 - 下中位数）
 */
function findMiddle_Method2(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head.next;
    
    console.log('  初始: slow = head, fast = head.next');
    console.log(`        slow -> ${slow?.val}, fast -> ${fast?.val}`);
    
    let step = 0;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        step++;
        console.log(`  步骤${step}: slow -> ${slow?.val}, fast -> ${fast?.val}`);
    }
    
    console.log(`  ✅ 返回: ${slow?.val}\n`);
    return slow;
}

// ==================== 测试用例 ====================

console.log('='.repeat(70));
console.log('链表找中点：fast = head vs fast = head.next');
console.log('='.repeat(70));
console.log();

// 测试数据
const testCases = [
    { arr: [1], desc: '长度=1（奇数）' },
    { arr: [1, 2], desc: '长度=2（偶数）⚠️' },
    { arr: [1, 2, 3], desc: '长度=3（奇数）' },
    { arr: [1, 2, 3, 4], desc: '长度=4（偶数）⚠️' },
    { arr: [1, 2, 3, 4, 5], desc: '长度=5（奇数）' },
    { arr: [1, 2, 3, 4, 5, 6], desc: '长度=6（偶数）⚠️' },
];

testCases.forEach(({ arr, desc }, index) => {
    console.log(`📌 测试用例 ${index + 1}: ${desc}`);
    console.log(`   链表: ${arr.join(' -> ')}`);
    console.log();
    
    const list1 = createList(arr);
    const list2 = createList(arr);
    
    console.log('【方法1】fast = head:');
    const result1 = findMiddle_Method1(list1);
    
    console.log('【方法2】fast = head.next:');
    const result2 = findMiddle_Method2(list2);
    
    // 比较结果
    if (result1?.val === result2?.val) {
        console.log(`💡 结果相同: ${result1?.val}`);
    } else {
        console.log(`⚠️  结果不同: 方法1 返回 ${result1?.val}, 方法2 返回 ${result2?.val}`);
        console.log(`   → 方法1 返回第2个中点（上中位数）`);
        console.log(`   → 方法2 返回第1个中点（下中位数）`);
    }
    
    console.log();
    console.log('-'.repeat(70));
    console.log();
});

// ==================== 总结表格 ====================

console.log();
console.log('📊 结果总结表:');
console.log();
console.log('┌────────┬───────────────┬──────────────┬──────────────┬────────┐');
console.log('│ 长度   │ 链表          │ fast=head    │ fast=head.next│ 是否相同│');
console.log('├────────┼───────────────┼──────────────┼──────────────┼────────┤');

testCases.forEach(({ arr }) => {
    const list1 = createList(arr);
    const list2 = createList(arr);
    const result1 = findMiddle_Method1_Silent(list1);
    const result2 = findMiddle_Method2_Silent(list2);
    const same = result1?.val === result2?.val ? '✅' : '❌';
    const listStr = arr.join('->').padEnd(13);
    const r1 = String(result1?.val).padEnd(12);
    const r2 = String(result2?.val).padEnd(12);
    console.log(`│ ${String(arr.length).padEnd(6)} │ ${listStr} │ ${r1} │ ${r2} │ ${same}    │`);
});

console.log('└────────┴───────────────┴──────────────┴──────────────┴────────┘');
console.log();

// 静默版本（不打印过程）
function findMiddle_Method1_Silent(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}

function findMiddle_Method2_Silent(head) {
    if (!head) return null;
    let slow = head, fast = head.next;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}

// ==================== 应用场景示例 ====================

console.log();
console.log('🎯 应用场景示例:');
console.log();

console.log('1️⃣  链表归并排序（需要第2个中点）');
console.log('   使用 fast = head');
console.log('   例: [1,2,3,4] → 前半: [1,2], 后半: [3,4]');
console.log();

console.log('2️⃣  回文链表判断（需要第2个中点）');
console.log('   使用 fast = head');
console.log('   例: [1,2,3,4] → 前半: [1,2,3], 后半: [4]（反转后对比）');
console.log();

console.log('3️⃣  删除中间节点（需要第1个中点）');
console.log('   使用 fast = head.next');
console.log('   例: [1,2,3,4] → 删除 2（第1个中点）');
console.log();

console.log('4️⃣  将链表均分（需要第1个中点）');
console.log('   使用 fast = head.next');
console.log('   例: [1,2,3,4] → 前半: [1,2], 后半: [3,4]（长度相等）');
console.log();

console.log('='.repeat(70));
console.log('💡 记忆口诀:');
console.log('   fast = head → 偏右（第2个中点）→ 更常用');
console.log('   fast = head.next → 偏左（第1个中点）→ 特殊需求');
console.log('='.repeat(70));

