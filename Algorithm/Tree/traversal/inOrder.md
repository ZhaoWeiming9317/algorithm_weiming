## 什么情况下 stack 为空，当时 root 不为空呢
在中序遍历的过程中，可能会出现 stack 为空而 root 不为空的情况，通常发生在以下场景：
1. 初始阶段：
当你开始遍历时，stack 是空的，而 root 是树的根节点。
你会进入第一个 while (root) 循环，将根节点及其所有左子节点压入 stack，直到 root 变为 null。
2. 处理右子树：
当你从 stack 中弹出一个节点并访问它后，你会将 root 设置为该节点的右子节点。
如果该右子节点存在，root 将不为空，而此时 stack 可能已经为空（特别是在处理完最左子树后）。