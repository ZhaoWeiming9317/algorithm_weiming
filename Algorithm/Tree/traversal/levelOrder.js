// 递归
export function recursiveLevelOrder(root) {
    let result = []
    const traverse = (root, level) => {
        if (!root) {
            return;
        }
        if (result.length === level) {
            result.push([]);
        }
        result[level].push(root.val);
        traverse(root.left, level + 1);
        traverse(root.right, level + 1);
    }
    traverse(root, 0);
    return result;
}

export function iteratorLevelOrder(root) {
    let result = []
    let queue = []

    if (root) {
        queue.push(root);
    }

    while (queue.length) {
        const current = queue.shift();
        result.push(current.val);
        if (current.left) {
            queue.push(current.left);
        }
        if (current.right) {
            queue.push(current.right);
        }
    }
    return result;
}
