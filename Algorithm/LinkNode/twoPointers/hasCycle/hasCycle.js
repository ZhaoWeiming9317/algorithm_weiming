/**
 * 判断链表是否有环
 */
export const hasCycle = (head) => {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            return true;
        }
    }

    return false;
}


export const findCycleStart = (head) => {
    let slow = head;
    let fast = head;

    // 找到相遇点
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            slow = head;
            // 找到环的入口
            while (slow !== fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow;
        }
    }
    return null;
}