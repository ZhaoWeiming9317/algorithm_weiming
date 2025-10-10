/**
 * 反转链表 递归做法
 */
var recursionReverseList = function(head) {
    if (head.next === null || head === null) {
        return head;
    }

    const newHead = recursionReverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
};

/**
 * 反转链表 迭代做法
 */
var iterationReverseList = function(head) {
    let prev = null;
    let curr = head;

    while (curr !== null) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }

    return prev;
}
