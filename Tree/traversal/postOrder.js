// 后序遍历
export function postIterator(root) {
    let result = [];
    let stack = [];
    let visited = null;

    while (stack.length > 0 || root) {
        // 将 root 的所有左子节点压入 stack
        while (root) {
            stack.push(root)
            root = root.left
        }
        // 查看栈顶节点
        root = stack[stack.length - 1]

        // 如果栈顶节点的右子节点为空，或者右子节点已经被访问过，则访问栈顶节点
        if (root.right === null || root.right === visited) {
            result.push(root.val)
            stack.pop()
            visited = root
            root = null
        } else {
            // 否则，访问右子节点
            root = root.right
        }
    }
    return result
}

