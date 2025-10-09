# 栈（Stack）相关算法题

## 📚 目录

- [简化路径](#简化路径)

---

## 简化路径

**LeetCode 71 - 中等**

### 题目描述

给你一个字符串 `path`，表示指向某一文件或目录的 Unix 风格绝对路径（以 '/' 开头），请你将其转化为更加简洁的规范路径。

### Unix 路径规则

- `.` 表示当前目录
- `..` 表示上级目录
- 多个连续的 `/` 视为单个 `/`
- `...` 或更多点是有效的目录名

### 示例

```javascript
输入：path = "/home/"
输出："/home"

输入：path = "/home//foo/"
输出："/home/foo"

输入：path = "/home/user/Documents/../Pictures"
输出："/home/user/Pictures"

输入：path = "/../"
输出："/"

输入：path = "/.../a/../b/c/../d/./"
输出："/.../b/d"
```

### 解题思路

**方法：栈**

1. 将路径按 `/` 分割成多个部分
2. 遍历每个部分：
   - 如果是 `..` 且栈不为空，弹出栈顶（返回上级目录）
   - 如果是 `.` 或空字符串，跳过（当前目录或连续斜杠）
   - 其他情况，入栈（有效的目录名）
3. 将栈中的元素用 `/` 连接，前面加上 `/`

### 代码实现

```javascript
function simplifyPath(path) {
  const stack = [];
  const parts = path.split('/');
  
  for (const part of parts) {
    if (part === '..') {
      if (stack.length > 0) {
        stack.pop();
      }
    } else if (part === '.' || part === '') {
      continue;
    } else {
      stack.push(part);
    }
  }
  
  return '/' + stack.join('/');
}
```

### 复杂度分析

- **时间复杂度**：O(n)，n 是路径长度
- **空间复杂度**：O(n)，栈的空间

### 关键点

1. 使用栈模拟目录的进入和退出
2. 根目录没有上级，`..` 在根目录无效
3. `...` 或更多点是有效的目录名
4. 最终路径以 `/` 开头，不以 `/` 结尾（除非是根目录）

---

## 栈的经典应用场景

### 1. 括号匹配
- 有效的括号（LeetCode 20）
- 最长有效括号（LeetCode 32）

### 2. 表达式求值
- 逆波兰表达式求值（LeetCode 150）
- 基本计算器（LeetCode 224）

### 3. 路径处理
- 简化路径（LeetCode 71）
- 文件的最长绝对路径（LeetCode 388）

### 4. 单调栈
- 每日温度（LeetCode 739）
- 下一个更大元素（LeetCode 496）
- 柱状图中最大的矩形（LeetCode 84）

### 5. 其他应用
- 函数调用栈
- 浏览器前进后退
- 撤销/重做功能

---

## 栈的基本操作

```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  // 入栈
  push(element) {
    this.items.push(element);
  }
  
  // 出栈
  pop() {
    return this.items.pop();
  }
  
  // 查看栈顶
  peek() {
    return this.items[this.items.length - 1];
  }
  
  // 是否为空
  isEmpty() {
    return this.items.length === 0;
  }
  
  // 栈的大小
  size() {
    return this.items.length;
  }
  
  // 清空栈
  clear() {
    this.items = [];
  }
}
```

---

## 学习建议

1. **理解栈的特性**：后进先出（LIFO）
2. **掌握基本操作**：push、pop、peek
3. **识别应用场景**：
   - 需要记录历史状态
   - 需要回溯
   - 需要匹配配对元素
4. **练习经典题目**：从简单到困难，逐步提升

---

## 相关资源

- [单调栈专题](../MonotonicStack/README.md)
- [LeetCode 栈标签](https://leetcode.cn/tag/stack/)
