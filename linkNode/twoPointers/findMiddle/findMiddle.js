/**
 * 找到链表的中间节点
 * 奇数个节点：中位数就是中间的那个节点。
 * 偶数个节点：可以区分为上中位数和下中位数：
 * 下中位数：中间两个节点中较小的那个。
 * 上中位数：中间两个节点中较大的那个。
 * 在本题中，对于偶数个节点，返回的是上中位数。
 */
export const findMiddle = (head) => {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
