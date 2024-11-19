/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
export const deleteNode = function(node) {
    node.val = node.next.val;
    node.next = node.next.next;
};

export const deleteDuplicateNode = function(node) {
    
}
