/**
 * 使用快慢指针，快指针先走N步
 * 然后同时前进直到快指针到达末尾
 */
function removeNthFromEnd(head, n) {
    let dummy = new ListNode(0);
    dummy.next = head;
    let fast = dummy;
    let slow = dummy;
    
    // 快指针先走n步
    for (let i = 0; i < n; i++) {
        fast = fast.next;
    }
    
    // 同时前进直到快指针到达末尾
    while (fast.next) {
        fast = fast.next;
        slow = slow.next;
    }
    
    // 删除节点
    slow.next = slow.next.next;
    
    return dummy.next;
}
