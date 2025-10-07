# 组合 vs 排列：核心区别与常见困惑解答

## 一、你的问题解答

### 问题1：电话号码字母组合中，为什么 `backtrack(index + 1)`？

```javascript
function letterCombinations(digits) {
    const phoneMap = {
        '2': 'abc',
        '3': 'def',
        // ...
    };
    
    function backtrack(index) {
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }
        
        const letters = phoneMap[digits[index]];
        
        for (let letter of letters) {
            path.push(letter);
            backtrack(index + 1);  // 为什么 +1？
            path.pop();
        }
    }
}
```

**答案：`index` 代表的是"我正在处理输入字符串的第几个数字"，不是数组索引！**

#### 详细解释

假设输入是 `digits = "23"`：

```
digits[0] = '2' -> 对应字母 'abc'
digits[1] = '3' -> 对应字母 'def'

回溯树：
                     root
                    /  |  \
                   a   b   c      (处理 digits[0]='2')
                 / | \ 
                d  e  f            (处理 digits[1]='3')
              
结果：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
```

- `index = 0`：处理第1个数字 '2'，遍历 'abc'
- `index = 1`：处理第2个数字 '3'，遍历 'def'
- `index = 2`：等于 `digits.length`，收集结果

**关键理解**：这道题是**纵向递进**，不是横向选择！
- 每一层处理一个固定的数字位置
- 不存在"跳过某个数字"的情况
- 所以必须 `index + 1`，移动到下一个数字位置

---

## 二、排列 vs 组合：本质区别

### 核心区别：是否考虑顺序

```javascript
// 例子：从 [1, 2, 3] 中选 2 个数

// 【组合】不考虑顺序
[1, 2] 和 [2, 1] 是同一个组合
结果：[1,2], [1,3], [2,3]  // 只有 3 个

// 【排列】考虑顺序
[1, 2] 和 [2, 1] 是不同的排列
结果：[1,2], [1,3], [2,1], [2,3], [3,1], [3,2]  // 有 6 个
```

### 代码对比

#### 组合代码
```javascript
function combine(n, k) {
    const result = [];
    const path = [];
    
    function backtrack(start) {  // ✅ 有 start 参数
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i <= n; i++) {  // ✅ 从 start 开始
            path.push(i);
            backtrack(i + 1);  // ✅ 传入 i+1，避免重复选择
            path.pop();
        }
    }
    
    backtrack(1);
    return result;
}

// combine(4, 2) → [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
```

#### 排列代码
```javascript
function permute(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);  // ✅ 使用 used 数组
    
    function backtrack() {  // ❌ 没有 start 参数
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {  // ✅ 每次都从 0 开始
            if (used[i]) continue;  // ✅ 跳过已使用的
            
            path.push(nums[i]);
            used[i] = true;
            backtrack();  // ✅ 不传 start，每次都遍历全部
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

// permute([1,2,3]) → [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

### 关键差异总结

| 特性           | 组合 (Combination)      | 排列 (Permutation)      |
|:--------------|:-----------------------|:-----------------------|
| **顺序**       | 不考虑顺序               | 考虑顺序                |
| **参数**       | 有 `start` 参数         | 没有 `start` 参数       |
| **循环起点**    | 从 `start` 开始         | 每次都从 `0` 开始        |
| **下层调用**    | `backtrack(i + 1)`     | `backtrack()`          |
| **防重复**      | 用 `start` 控制         | 用 `used[]` 数组        |
| **能否重复选**  | 看题目要求               | 通常不能                |
| **示例**       | [1,2] = [2,1]          | [1,2] ≠ [2,1]          |

---

## 三、"一个值只能选择一次"的含义

### 问题：组合是一个值只能选择一次吗？

**答案：不一定！取决于题目要求**

#### 情况1：每个值只能用一次（经典组合）

```javascript
function combine(n, k) {
    function backtrack(start) {
        // ...
        for (let i = start; i <= n; i++) {
            path.push(i);
            backtrack(i + 1);  // i+1 表示下一个数必须大于当前数
            path.pop();
        }
    }
}

// combine(4, 2) → [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
// 注意：没有 [1,1] 或 [2,2]
```

#### 情况2：每个值可以重复使用（组合总和）

```javascript
function combinationSum(candidates, target) {
    function backtrack(start, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            backtrack(i, sum + candidates[i]);  // 传入 i 而不是 i+1！
            path.pop();
        }
    }
}

// combinationSum([2,3,6,7], 7) → [[2,2,3], [7]]
// 注意：可以有 [2,2,3]，重复使用 2
```

**关键区别**：
- `backtrack(i + 1)`：下次从 i+1 开始，**不能再选 i**
- `backtrack(i)`：下次从 i 开始，**可以再选 i**

---

## 四、"去重"的两种不同含义

### 困惑：为什么排列和组合都有去重？

**答案：两种去重的场景完全不同！**

### 场景1：组合的去重（输入数组有重复元素）

```javascript
// 输入: candidates = [1, 1, 2], target = 3
// 期望输出: [[1, 2]] 
// 错误输出: [[1, 2], [1, 2]]  ← 两个 [1,2] 重复了！

function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);  // 先排序
    
    function backtrack(start, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // ✅ 同一层级跳过重复元素
            if (i > start && candidates[i] === candidates[i - 1]) {
                continue;
            }
            
            path.push(candidates[i]);
            backtrack(i + 1, sum + candidates[i]);
            path.pop();
        }
    }
}
```

**组合去重的目的**：避免结果集中出现重复的组合

```
输入: [1, 1, 2], 取2个数
不去重: [[1,1], [1,2], [1,2]]  ← 有两个 [1,2]
去重后: [[1,1], [1,2]]        ← 正确
```

### 场景2：排列的去重（输入数组有重复元素）

```javascript
// 输入: [1, 1, 2]
// 期望输出: [[1,1,2], [1,2,1], [2,1,1]]
// 错误输出: [[1,1,2], [1,2,1], [1,1,2], [1,2,1], [2,1,1], [2,1,1]]

function permuteUnique(nums) {
    nums.sort((a, b) => a - b);
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            // ✅ 去重：相同元素必须按顺序使用
            if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) {
                continue;
            }
            
            path.push(nums[i]);
            used[i] = true;
            backtrack();
            path.pop();
            used[i] = false;
        }
    }
}
```

**排列去重的目的**：避免结果集中出现重复的排列

```
输入: [1, 1, 2]
不去重: [[1,1,2], [1,2,1], [1,1,2], [1,2,1], [2,1,1], [2,1,1]]
去重后: [[1,1,2], [1,2,1], [2,1,1]]
```

### 去重逻辑对比

| 类型         | 去重条件                                          | 目的                  |
|:------------|:------------------------------------------------|:---------------------|
| **组合去重**  | `i > start && nums[i] === nums[i-1]`           | 同一层级跳过重复元素    |
| **排列去重**  | `i > 0 && nums[i] === nums[i-1] && !used[i-1]` | 相同元素按顺序使用      |
| **共同点**    | 都需要先排序                                      | 让相同元素相邻         |

---

## 五、图解：三种情况的递归树对比

### 1. 电话号码字母组合（纵向递进）

```
输入: "23"

                    root (index=0)
                   /  |  \
                  a   b   c         处理 digits[0]='2'
                / | \ 
               d  e  f              处理 digits[1]='3'
             
路径: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]

特点：
- index 纵向递进（0 → 1 → 2）
- 每层处理一个固定位置的数字
- 不存在"选不选"的问题，必须选
```

### 2. 组合（横向选择，start 控制）

```
输入: [1,2,3], k=2

                         []
                    /    |    \
                  [1]   [2]   [3]        start=1,2,3
                 / \      |
              [1,2] [1,3] [2,3]          start=2,3,3

结果: [[1,2], [1,3], [2,3]]

特点：
- start 控制横向选择范围
- 后面的数只能选更大的（i+1）
- 避免了 [2,1] 这种重复组合
```

### 3. 排列（横向选择，used 控制）

```
输入: [1,2,3]

                              []
                    /         |         \
                  [1]        [2]        [3]
                 /   \      /   \      /   \
              [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
               |     |     |     |     |     |
            [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]

结果: 6个排列

特点：
- 每层都从头遍历全部元素
- used[] 标记已使用的元素
- [1,2,3] 和 [1,3,2] 是不同结果
```

---

## 六、快速判断技巧

当你看到一道回溯题时，如何快速判断是组合还是排列？

### 判断标准

1. **题目要求顺序吗？**
   - 不要求顺序 → 组合（如：找和为target的组合）
   - 要求顺序 → 排列（如：生成所有排列）

2. **代码有 `start` 参数吗？**
   - 有 → 组合
   - 没有 → 排列

3. **递归调用传什么？**
   - `backtrack(i + 1)` → 组合（每个元素用一次）
   - `backtrack(i)` → 组合（元素可重复）
   - `backtrack()` → 排列

4. **用什么防重复？**
   - `start` 参数 → 组合
   - `used[]` 数组 → 排列

---

## 七、总结：一图胜千言

```
┌─────────────────────────────────────────────────────────┐
│                   回溯问题分类                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  电话号码字母组合                                         │
│  ├─ 特点: 纵向递进，处理不同位置                          │
│  ├─ 参数: index（位置索引）                               │
│  ├─ 递归: backtrack(index + 1)                           │
│  └─ 关键: index 代表"第几个数字"                          │
│                                                          │
│  ────────────────────────────────────                   │
│                                                          │
│  组合（Combination）                                     │
│  ├─ 特点: 不考虑顺序，[1,2]=[2,1]                        │
│  ├─ 参数: start（起始位置）                               │
│  ├─ 递归: backtrack(i+1) 或 backtrack(i)                 │
│  ├─ 防重: start 参数控制范围                              │
│  └─ 去重: i > start && nums[i] == nums[i-1]             │
│                                                          │
│  ────────────────────────────────────                   │
│                                                          │
│  排列（Permutation）                                     │
│  ├─ 特点: 考虑顺序，[1,2]≠[2,1]                          │
│  ├─ 参数: 无 start，每次全遍历                            │
│  ├─ 递归: backtrack()                                    │
│  ├─ 防重: used[] 数组标记                                 │
│  └─ 去重: !used[i-1] && nums[i]==nums[i-1]              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 八、练习建议

1. **先理解概念**：组合不考虑顺序，排列考虑顺序
2. **看代码结构**：有无 start 参数，递归传什么
3. **画递归树**：自己画一遍，理解 index/start 的作用
4. **对比练习**：同一个输入，分别用组合和排列解，看结果差异

希望这个文档能帮你彻底理解组合和排列的区别！🎯

