/**
 * 循环双向链表中找到断开的节点
 * 
 * 题目描述：
 * 给定一个循环双向链表，其中有一个节点的 next 或 prev 指针指向了错误的位置，
 * 找到这个断开的节点。
 * 
 * 在正常的循环双向链表中：
 * - 每个节点的 next.prev 应该指向自己
 * - 每个节点的 prev.next 应该指向自己
 * - 如果从任意节点开始遍历，应该能回到起始节点
 * 
 * 解题思路：
 * 1. 遍历链表，检查每个节点的 next.prev 是否等于当前节点
 * 2. 检查每个节点的 prev.next 是否等于当前节点
 * 3. 如果发现不一致，说明找到了断开的节点
 */

// 双向链表节点定义
class DoublyListNode {
    constructor(val = 0, next = null, prev = null) {
        this.val = val;
        this.next = next;
        this.prev = prev;
    }
}

/**
 * 方法1：检查指针一致性
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function findBrokenNode(head) {
    if (!head) return null;
    
    let current = head;
    
    do {
        // 检查 next 指针的一致性
        if (current.next && current.next.prev !== current) {
            return current; // 当前节点的 next 指针有问题
        }
        
        // 检查 prev 指针的一致性  
        if (current.prev && current.prev.next !== current) {
            return current; // 当前节点的 prev 指针有问题
        }
        
        current = current.next;
        
        // 关键判断：防止无限循环
        // 1. current && current !== head: 如果链表完整，会回到起始节点
        // 2. 如果 current 为 null，说明链表断开了（不是真正的循环）
        // 3. 如果 current === head，说明我们遍历了一圈，链表是完整的循环
    } while (current && current !== head);
    
    return null; // 没有找到断开的节点
}

/**
 * 方法1.5：更简单的版本 - 你说得对，这题确实很简单！
 * 既然我们知道这是一个"应该"循环的双向链表，
 * 我们只需要检查每个节点的指针一致性即可
 */
export function findBrokenNodeSimple(head) {
    if (!head) return null;
    
    let current = head;
    
    // 简单粗暴：遍历一遍，检查每个节点
    do {
        // 这就是核心逻辑：双向链表的不变性
        if (current.next?.prev !== current || current.prev?.next !== current) {
            return current;
        }
        current = current.next;
    } while (current && current !== head);
    
    return null;
}

/**
 * 方法2：使用Set检测循环完整性
 * 如果链表真的是循环的，从任意节点开始都应该能回到起始点
 */
export function findBrokenNodeV2(head) {
    if (!head) return null;
    
    const visited = new Set();
    let current = head;
    
    // 向前遍历
    while (current) {
        if (visited.has(current)) {
            // 如果回到了起始节点，说明循环完整
            if (current === head) {
                break;
            } else {
                // 如果回到了其他访问过的节点，说明有问题
                return current;
            }
        }
        
        visited.add(current);
        
        // 检查指针一致性
        if (current.next && current.next.prev !== current) {
            return current;
        }
        
        current = current.next;
    }
    
    // 检查是否真的形成了完整的循环
    if (current !== head) {
        // 没有回到起始节点，说明链表断开了
        // 找到最后一个有效节点
        current = head;
        while (current.next && current.next !== head) {
            if (current.next.prev !== current) {
                return current;
            }
            current = current.next;
        }
        return current;
    }
    
    return null; // 链表完整
}

/**
 * 方法3：双指针检测法
 * 使用快慢指针，如果链表真的是循环的，快指针应该能追上慢指针
 */
export function findBrokenNodeV3(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head;
    
    // 先检查是否能形成循环
    do {
        // 检查当前节点的指针一致性
        if (slow.next && slow.next.prev !== slow) {
            return slow;
        }
        if (slow.prev && slow.prev.next !== slow) {
            return slow;
        }
        
        slow = slow.next;
        
        // 快指针走两步
        if (fast.next) {
            fast = fast.next;
            if (fast.next) {
                fast = fast.next;
            } else {
                // 快指针到达了末尾，说明不是循环链表
                return fast;
            }
        } else {
            // 快指针到达了末尾，说明不是循环链表
            return fast;
        }
        
    } while (slow !== fast && slow && fast);
    
    // 如果没有相遇，说明链表有问题
    if (slow !== fast) {
        return slow; // 返回慢指针当前位置
    }
    
    return null; // 链表完整
}

/**
 * 创建测试用的循环双向链表
 */
export function createCircularDoublyLinkedList(values) {
    if (!values || values.length === 0) return null;
    
    const nodes = values.map(val => new DoublyListNode(val));
    
    // 连接所有节点
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].next = nodes[(i + 1) % nodes.length];
        nodes[i].prev = nodes[(i - 1 + nodes.length) % nodes.length];
    }
    
    return nodes[0];
}

/**
 * 打印循环双向链表（限制打印长度避免无限循环）
 */
export function printCircularDoublyList(head, maxNodes = 10) {
    if (!head) {
        console.log('Empty list');
        return;
    }
    
    const result = [];
    let current = head;
    let count = 0;
    
    do {
        result.push(`${current.val}(prev:${current.prev?.val}, next:${current.next?.val})`);
        current = current.next;
        count++;
    } while (current && current !== head && count < maxNodes);
    
    if (count >= maxNodes) {
        result.push('...(truncated)');
    }
    
    console.log(result.join(' -> '));
}

/**
 * 演示：为什么需要 current !== head 判断
 */
function demonstrateWhyNeedCheck() {
    console.log('\n=== 为什么需要 current !== head 判断？ ===');
    
    // 创建一个正常的循环链表
    const normalList = createCircularDoublyLinkedList([1, 2, 3]);
    
    console.log('正常循环链表的遍历过程：');
    let current = normalList;
    let step = 0;
    
    do {
        console.log(`步骤${step}: 当前节点=${current.val}, next=${current.next?.val}`);
        current = current.next;
        step++;
        
        // 如果没有 current !== head 判断，这里就会无限循环！
        if (step > 10) {
            console.log('...（如果没有终止条件会无限循环）');
            break;
        }
    } while (current && current !== normalList);
    
    console.log(`遍历结束：current === head? ${current === normalList}`);
}

// 先演示为什么需要判断
demonstrateWhyNeedCheck();

// 测试用例
console.log('=== 循环双向链表断开节点检测 ===');

// 测试用例1：正常的循环双向链表
console.log('\n测试用例1：正常的循环双向链表');
const normalList = createCircularDoublyLinkedList([1, 2, 3, 4]);
printCircularDoublyList(normalList);
console.log('断开节点:', findBrokenNode(normalList)?.val || '无');

// 测试用例2：断开的链表 - 修改某个节点的next指针
console.log('\n测试用例2：断开的链表 - next指针错误');
const brokenList1 = createCircularDoublyLinkedList([1, 2, 3, 4]);
// 让节点2的next指向节点4，跳过节点3
let node2 = brokenList1.next; // 节点2
let node4 = brokenList1.next.next.next; // 节点4
node2.next = node4;
printCircularDoublyList(brokenList1);
console.log('断开节点:', findBrokenNode(brokenList1)?.val || '无');

// 测试用例3：断开的链表 - 修改某个节点的prev指针
console.log('\n测试用例3：断开的链表 - prev指针错误');
const brokenList2 = createCircularDoublyLinkedList([1, 2, 3, 4]);
// 让节点3的prev指向节点1，跳过节点2
let node1 = brokenList2; // 节点1
let node3 = brokenList2.next.next; // 节点3
node3.prev = node1;
printCircularDoublyList(brokenList2);
console.log('断开节点:', findBrokenNode(brokenList2)?.val || '无');

// 测试用例4：完全断开的链表
console.log('\n测试用例4：完全断开的链表');
const brokenList3 = createCircularDoublyLinkedList([1, 2, 3]);
// 断开最后一个节点
let lastNode = brokenList3.prev; // 最后一个节点
lastNode.next = null; // 断开循环
printCircularDoublyList(brokenList3);
console.log('断开节点:', findBrokenNode(brokenList3)?.val || '无');
