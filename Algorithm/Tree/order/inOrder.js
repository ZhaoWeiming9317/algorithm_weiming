export function inIterator(root) {
    let result = []
    let stack = []

    // Q: 为什么需要 root 判断？
    // A: 就算是 stack 为空，root 也可能不为空，需要继续循环
    while (stack.length > 0 || root) {
        // Q: 为什么需要 while 循环？
        // A: 因为需要将 root 的所有左子节点压入 stack
        while (root) {
            stack.push(root)
            root = root.left
        }
        // 这个时候是 stack 的栈顶元素，也就是最左子节点
        root = stack.pop()
        // 当前这个最左子节点，相当于访问根节点
        result.push(root.val)
        // 访问右子节点
        root = root.right
    }
    return result
}

export function inRecursive(root) {
    let result = []
    let traverse = (root) => {
        if (!root) {
            return null;
        }
        traverse(root.left)
        result.push(root.val)
        traverse(root.right)
    }
    traverse(root)
    return result
}

