# 生成括号 - 快速记忆指南

## 🎯 一句话总结

**给定 n，生成所有合法的 n 对括号组合，关键是控制左右括号的添加时机。**

---

## 🔥 核心代码（背诵版）

```javascript
function generateParenthesis(n) {
    const result = [];
    
    function backtrack(path, left, right) {
        // 1. 终止条件：左右括号都用完
        if (left === n && right === n) {
            result.push(path);
            return;
        }
        
        // 2. 剪枝：右括号多于左括号，不合法
        if (right > left) return;
        
        // 3. 选择1：添加左括号（还有剩余）
        if (left < n) {
            backtrack(path + '(', left + 1, right);
        }
        
        // 4. 选择2：添加右括号（不能超过左括号）
        if (right < left) {
            backtrack(path + ')', left, right + 1);
        }
    }
    
    backtrack('', 0, 0);
    return result;
}
```

---

## 📋 关键点速查表

| 项目 | 内容 |
|:-----|:-----|
| **参数** | `path` (当前字符串), `left` (已用左括号数), `right` (已用右括号数) |
| **终止条件** | `left === n && right === n` |
| **剪枝条件** | `right > left` (右括号不能多于左括号) |
| **添加 ( 条件** | `left < n` |
| **添加 ) 条件** | `right < left` |
| **时间复杂度** | O(4^n / √n) - 卡特兰数 |
| **空间复杂度** | O(n) - 递归栈深度 |

---

## 💡 三个关键问题

### Q1: 什么时候可以添加左括号 `(`？
**A: 只要左括号数量还没用完（`left < n`）就可以添加。**

### Q2: 什么时候可以添加右括号 `)`？
**A: 只要右括号数量少于左括号数量（`right < left`）就可以添加。**

### Q3: 为什么不需要撤销选择？
**A: 因为用的是字符串拼接（`path + '('`），每次递归都创建了新的字符串，不会影响其他分支。**

---

## 🌳 回溯树示例 (n = 2)

```
                    ""(0,0)
                      |
                  "("(1,0)
                  /      \
            "(("(2,0)   "()"(1,1)
                |           |
            "(()"(2,1)   "()(2,1)
                |           |
            "(())"(2,2) "()()"(2,2)
               ✅           ✅
```

**说明：**
- 括号内 `(left, right)` 表示已使用的左右括号数量
- ✅ 表示找到一个合法结果
- 每一层根据条件选择添加 `(` 或 `)`

---

## 🔄 执行流程（n = 2）

```
1. ("", 0, 0)        → 添加 (
   ├─ 2. ("(", 1, 0)    → 添加 (
   │   └─ 3. ("((", 2, 0)   → 只能添加 )
   │       └─ 4. ("(()", 2, 1)  → 只能添加 )
   │           └─ 5. "(())"(2, 2) ✅ 结果1
   │
   └─ 6. ("(", 1, 0)    → 添加 )
       └─ 7. ("()", 1, 1)   → 添加 (
           └─ 8. ("()(", 2, 1)  → 只能添加 )
               └─ 9. "()()"(2, 2) ✅ 结果2

最终结果: ["(())", "()()"]
```

---

## ⚡ 常见错误

### ❌ 错误1：忘记剪枝
```javascript
// 没有剪枝，会生成 )( 这种不合法的
function backtrack(path, left, right) {
    if (left === n && right === n) {
        result.push(path);
        return;
    }
    // ❌ 缺少 if (right > left) return;
    
    if (left < n) backtrack(path + '(', left + 1, right);
    if (right < n) backtrack(path + ')', left, right + 1); // ❌ 条件错误
}
```

### ❌ 错误2：右括号条件错误
```javascript
// ❌ 错误：条件应该是 right < left，不是 right < n
if (right < n) {  // 这会生成不合法的组合
    backtrack(path + ')', left, right + 1);
}

// ✅ 正确
if (right < left) {
    backtrack(path + ')', left, right + 1);
}
```

### ❌ 错误3：终止条件错误
```javascript
// ❌ 错误：只检查长度
if (path.length === 2 * n) {
    result.push(path);  // 可能包含不合法的组合
    return;
}

// ✅ 正确：检查左右括号数量
if (left === n && right === n) {
    result.push(path);
    return;
}
```

---

## 🆚 与其他回溯问题的区别

| 特性 | 组合/排列/子集 | 生成括号 |
|:-----|:-------------|:--------|
| **选择方式** | 遍历数组/列表 | 只有两个固定选择 `(` 或 `)` |
| **循环结构** | `for` 循环 | `if` 条件判断 |
| **防重复** | `start` 或 `used[]` | 通过 `left`/`right` 计数器 |
| **撤销选择** | 需要 `path.pop()` | 字符串拼接不需要撤销 |

---

## 💪 记忆口诀

```
左括号随便加，只要没用完 (left < n)
右括号要小心，不能超左边 (right < left)
两个都用完，收割一个解 (left === n && right === n)
右边超左边，立即要剪枝 (right > left)
```

---

## 🚀 快速测试

```javascript
console.log(generateParenthesis(1)); // ["()"]
console.log(generateParenthesis(2)); // ["(())", "()()"]
console.log(generateParenthesis(3)); 
// ["((()))","(()())","(())()","()(())","()()()"]
```

---

## 📝 面试时的思考步骤

1. **明确问题**：生成所有合法的 n 对括号组合
2. **确定参数**：需要跟踪 `path`、`left`、`right`
3. **终止条件**：左右括号都用完了
4. **剪枝条件**：右括号不能多于左括号
5. **递归逻辑**：
   - 可以添加左括号 → 递归
   - 可以添加右括号 → 递归
6. **复杂度分析**：O(4^n / √n)

---

## 🔗 相关题目

- LeetCode 20: 有效的括号（栈）
- LeetCode 32: 最长有效括号（DP）
- LeetCode 301: 删除无效的括号（BFS/回溯）
- LeetCode 678: 有效的括号字符串（贪心）

