// 前序遍历
export function preIterator(root) {
    let result = []
    let stack = []
    if (root) {
        stack.push(root)
    }
    while (stack.length > 0) {
        let node = stack.pop()
        result.push(node.val)
        if (node.right) {
            stack.push(node.right)
        }
        if (node.left) {
            stack.push(node.left)
        }
    }
    return result
}

export function preRecursive(root) {
    let result = []

    let traverse = (root) => {
        if (!root) {
            return null;
        }
        result.push(root.val)
        traverse(root.left)
        traverse(root.right)
    }
    traverse(root)
    return result;
}
