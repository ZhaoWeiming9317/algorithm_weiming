# 回溯算法细节总结

## 目录
1. [回溯算法的基本模式](#回溯算法的基本模式)
2. [常见变种和细节](#常见变种和细节)
3. [典型问题分析](#典型问题分析)
4. [优化技巧](#优化技巧)

## 回溯算法的基本模式

### 基本框架
```javascript
function backtrack(path, choices, used) {
    // 1. 终止条件
    if (isEnd(path)) {
        result.push([...path]);
        return;
    }
    
    // 2. 遍历选择
    for (let i = 0; i < choices.length; i++) {
        // 3. 做选择
        path.push(choices[i]);
        
        // 4. 递归
        backtrack(path, choices, used);
        
        // 5. 撤销选择
        path.pop();
    }
}
```

## 常见变种和细节

### 1. used数组的使用场景

#### 何时需要used？
```javascript
// 1. 排列问题（元素不能重复使用）
function permute(nums) {
    const used = new Array(nums.length).fill(false);
    const path = [];
    
    function backtrack(path) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            // 已经使用过的元素不能再用
            if (used[i]) continue;
            
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }
}

// 2. 组合问题为什么用start而不用used？
function combine(nums, k) {
    // 假设用used的写法
    function backtrackWithUsed(path, used) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            backtrackWithUsed(path, used);
            path.pop();
            used[i] = false;
        }
    }
    // 问题：这样会产生重复组合！
    // 例如：[1,2] 和 [2,1] 在组合中应该算同一个
    
    // 正确的写法：使用start
    function backtrackWithStart(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        // 关键点：i从start开始，保证了：
        // 1. 只会往后取数，不会往前取
        // 2. 天然保证了组合的顺序性，避免重复
        // 3. 不需要used数组标记，因为不会重复使用同一个位置
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            // i + 1 意味着下一层只能从当前数字之后选择
            backtrackWithStart(i + 1, path);
            path.pop();
        }
    }
    
    /* 举例说明：nums = [1,2,3], k = 2
    used数组方式会产生：
    第一层选1：[1,2], [1,3]
    第一层选2：[2,1], [2,3]  // [2,1]是重复的！
    第一层选3：[3,1], [3,2]  // [3,1],[3,2]是重复的！
    
    start方式产生：
    第一层选1：[1,2], [1,3]
    第一层选2：[2,3]         // 不会往回选1
    第一层选3：空            // 不会往回选1,2
    */
    
    /* 决策树对比：
    used数组方式的决策树：
                    []
        1/          2|          \3
       [1]         [2]         [3]
    2/  \3      1/  \3      1/  \2
  [1,2][1,3]  [2,1][2,3]  [3,1][3,2]
    
    start方式的决策树：
                    []
        1/          2|          \3
       [1]         [2]         [3]
    2/  \3          \3          
  [1,2][1,3]       [2,3]        
    
    可以看到：
    1. used方式会产生重复组合，因为它允许在每一层选择任何未使用的数字
    2. start方式通过限制每层的选择范围，自然避免了重复
    3. start实际上是在enforcing一个"只能往后选"的规则
    */
}
```

### 2. 去重判断

#### 何时需要去重？
```javascript
// 1. 排列问题中的去重
function permuteUnique(nums) {
    nums.sort((a, b) => a - b);  // 先排序
    const used = new Array(nums.length).fill(false);
    
    function backtrack(path) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            // 关键的去重逻辑
            if (used[i]) continue;
            // 如果当前数字和前一个数字相同，且前一个数字还原了（未使用），说明这是一个重复分支
            if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;
            
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }
}

// 2. 组合问题中的去重
function subsetsWithDup(nums) {
    nums.sort((a, b) => a - b);  // 先排序
    
    function backtrack(start, path) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            // 同层级的重复元素要跳过
            if (i > start && nums[i] === nums[i-1]) continue;
            
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
}
```

### 3. start参数的使用

#### 何时需要start？
```javascript
// 1. 组合问题（需要start）
function combine(n, k) {
    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        // 使用start避免重复组合
        for (let i = start; i <= n; i++) {
            path.push(i);
            backtrack(i + 1, path);  // 从i+1开始
            path.pop();
        }
    }
}

// 2. 排列问题（不需要start）
function permute(nums) {
    function backtrack(path, used) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        // 每次都从头开始，用used数组控制
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            backtrack(path, used);
            path.pop();
            used[i] = false;
        }
    }
}
```

### 4. 组合问题：可以取重复值 vs 不可以取重复值

这是一个非常重要的区别！**关键在于下一次递归时传入的参数是 `i` 还是 `i + 1`**。

#### 情况1：不可以取重复值（每个元素只能用一次）

```javascript
// LeetCode 77: 组合
// 从 [1,2,3,4] 中选出 2 个数的组合
// 每个数字只能用一次

function combine(n, k) {
    const result = [];
    
    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i <= n; i++) {
            path.push(i);
            // ⭐ 关键：i + 1，下一层从 i+1 开始
            // 意味着当前数字 i 用过后，下次不能再用
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(1, []);
    return result;
}

// 示例：combine(4, 2)
// 决策树：
//                    []
//          ┌─────────┼──────┬─────┐
//          1         2      3     4
//        ┌─┼─┐      ┌┴┐    ┴
//       [1,2][1,3][1,4][2,3][2,4][3,4]
//
// 结果：[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
// 注意：没有 [1,1] 或 [2,2]，每个数字只用一次
```

#### 情况2：可以取重复值（每个元素可以无限次使用）

```javascript
// LeetCode 39: 组合总和
// 给定 candidates = [2,3,6,7], target = 7
// 找出所有相加之和为 target 的组合
// 每个数字可以无限次使用

function combinationSum(candidates, target) {
    const result = [];
    
    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        if (sum > target) return; // 剪枝
        
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            // ⭐ 关键：传入 i（不是 i + 1）
            // 意味着下一层还可以继续选择当前数字
            backtrack(i, path, sum + candidates[i]);
            path.pop();
        }
    }
    
    backtrack(0, [], 0);
    return result;
}

// 示例：combinationSum([2,3,6,7], 7)
// 决策树（部分）：
//                      []
//            ┌──────────┼──────────┐
//            2          3          6          7
//         ┌──┼──┐       ┼          
//        2,2 2,3 2,6   3,3
//        ↓              ↓
//      2,2,2          3,3,... (>7剪枝)
//      ↓
//    2,2,3 (=7✓)
//
// 结果：[[2,2,3],[7]]
// 注意：有 [2,2,3]，因为 2 可以重复使用
```

#### 对比：i 还是 i + 1？

```javascript
// ❌ 错误示例：可以重复使用，但传了 i + 1
function combinationSumWrong(candidates, target) {
    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            // ❌ 传入 i + 1，意味着下次不能用当前数字了
            backtrack(i + 1, path, sum + candidates[i]);
            path.pop();
        }
    }
}
// 结果：只能得到 [[7]]，得不到 [2,2,3]

// ✅ 正确示例：可以重复使用，传 i
function combinationSumCorrect(candidates, target) {
    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            // ✅ 传入 i，可以继续使用当前数字
            backtrack(i, path, sum + candidates[i]);
            path.pop();
        }
    }
}
// 结果：[[2,2,3],[7]]
```

#### 详细的决策树对比

**情况1：不可以重复（i + 1）**

```
candidates = [2,3], k = 2

                    []                    start=0
                ┌────┴────┐
                2         3               start=1,2
                ↓         
               [2,3]                      start=2 (✓)
               
结果：只有 [2,3]，因为选了2后，start变成1，不能再选2
```

**情况2：可以重复（i）**

```
candidates = [2,3], target = 6

                    []                    start=0, sum=0
                ┌────┴────┐
                2         3               start=0,1
            ┌───┴───┐     ↓
            2       3     3               start=0,1,1
        ┌───┴───┐   ↓     ↓
        2       3  [2,3,2] [3,3]          start=0,1
        ↓          (>6)    (=6✓)
      [2,2,2]
      (=6✓)
      
结果：[[2,2,2],[3,3]]，因为可以重复选择
```

#### 核心规律总结

| 特性 | 不可重复 | 可以重复 |
|------|---------|---------|
| **递归参数** | `backtrack(i + 1, ...)` | `backtrack(i, ...)` |
| **含义** | 下一层从 i+1 开始 | 下一层从 i 开始（包括自己）|
| **典型题目** | 组合、子集 | 组合总和 |
| **LeetCode** | 77, 78, 90 | 39, 40 |
| **示例结果** | [1,2], [1,3] | [2,2,3], [2,3,2] |

#### 实际代码对比

```javascript
// 1. 组合（不可重复）- LeetCode 77
function combine(n, k) {
    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        for (let i = start; i <= n; i++) {
            backtrack(i + 1, [...path, i]);  // ← i + 1
        }
    }
}

// 2. 组合总和（可以重复）- LeetCode 39
function combinationSum(candidates, target) {
    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        if (sum > target) return;
        
        for (let i = start; i < candidates.length; i++) {
            backtrack(i, [...path, candidates[i]], sum + candidates[i]);  // ← i
        }
    }
}

// 3. 组合总和 II（不可重复，但数组有重复）- LeetCode 40
function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);
    
    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        if (sum > target) return;
        
        for (let i = start; i < candidates.length; i++) {
            // 同一层级去重
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            
            backtrack(i + 1, [...path, candidates[i]], sum + candidates[i]);  // ← i + 1
        }
    }
}
```

#### 记忆口诀

```
i + 1：此数用完，下次从下一个开始（不可重复）
i    ：此数还能用，下次还从我开始（可以重复）
```

#### 常见错误

```javascript
// ❌ 错误1：题目要求可以重复，但写了 i + 1
function combinationSum(candidates, target) {
    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        for (let i = start; i < candidates.length; i++) {
            backtrack(i + 1, [...path, candidates[i]], sum + candidates[i]);
            //         ↑ 错误！应该是 i
        }
    }
}
// 结果：漏掉了很多可以重复使用的组合

// ❌ 错误2：题目要求不可重复，但写了 i
function combine(n, k) {
    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        for (let i = start; i <= n; i++) {
            backtrack(i, [...path, i]);
            //         ↑ 错误！应该是 i + 1
        }
    }
}
// 结果：会产生 [1,1,1] 这样的重复组合

// ✅ 正确判断方法
1. 看题目是否说"每个数字只能用一次" → 用 i + 1
2. 看题目是否说"可以无限次使用" → 用 i
3. 看示例中是否有重复数字 → 有重复用 i，没有用 i + 1
```

### 5. start参数和排序的独立性

#### start参数的作用
```javascript
// start参数的作用是纯粹的组合控制，即使不排序也能正确工作
function combine(nums) {
    // 假设nums = [3,2,6,7]（未排序）
    function backtrack(start, path) {
        // start=0时从3开始，后续只能用[3,2,6,7]
        // start=1时从2开始，后续只能用[2,6,7]
        // start=2时从6开始，后续只能用[6,7]
        
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);  // 用i+1确保每个数字只用一次
            path.pop();
        }
    }
}
```

#### 排序的作用
```javascript
// 排序主要用于优化剪枝效率，与start参数的组合控制无关
function combinationSum(candidates, target) {
    candidates.sort((a, b) => a - b);  // 排序用于优化剪枝
    
    function backtrack(start, sum) {
        for (let i = start; i < candidates.length; i++) {
            if (sum + candidates[i] > target) {
                break;  // 因为已排序，后面更大，可以直接break
                // 如果没排序，这里就只能用continue
            }
            // ... 递归逻辑
        }
    }
}
```

#### 两者的组合使用
虽然start参数和排序是两个独立的机制，但它们经常一起使用：
1. start参数保证组合不重复
2. 排序让剪枝更高效

这种组合在实际问题中能达到最优的效果：
- 需要去重时：必须排序 + 使用start
- 需要剪枝时：最好排序 + 使用start
- 只需要组合控制时：只需要start，不需要排序

### 5. 排序的必要性

#### 何时需要排序？
```javascript
// 1. 需要去重的情况
function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);  // 必须排序
    
    function backtrack(start, target, path) {
        if (target === 0) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // 去重需要依赖排序
            if (i > start && candidates[i] === candidates[i-1]) continue;
            if (candidates[i] > target) break;  // 剪枝也需要依赖排序
            
            path.push(candidates[i]);
            backtrack(i + 1, target - candidates[i], path);
            path.pop();
        }
    }
}

// 2. 需要剪枝的情况
function combinationSum(candidates, target) {
    candidates.sort((a, b) => a - b);  // 为了剪枝必须排序
    
    function backtrack(start, target, path) {
        if (target === 0) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // 排序后可以提前结束
            if (candidates[i] > target) break;  // 注意这里是break而不是continue
            /* 为什么用break而不是continue？
               因为数组已经排序，如果当前数字已经使sum超过target，
               那么后面的数字一定更大，一定也会超过target，
               所以可以直接结束当前层的循环，不用继续检查后面的数字。
               
               如果数组没有排序：
               比如[3,2,6,7]，当sum=4时遇到6，
               发现4+6>7(target)，但不能break，
               因为后面可能还有更小的数字(比如2)需要尝试，
               这时就只能continue跳过当前数字。
               
               排序后变成[2,3,6,7]：
               当sum=4时遇到6，发现4+6>7(target)，
               因为已经排序，所以知道后面的数字都更大，
               可以直接break，不用继续检查了。
            */
            
            path.push(candidates[i]);
            backtrack(i, target - candidates[i], path);  // 注意这里传入i而不是i+1
            /* 为什么传入i而不是i+1？
               这里传入i表示下一轮递归还可以使用当前的数字，
               这就是"可重复使用"的实现方式。
               
               如果要求每个数字只能用一次，就要传入i+1：
               backtrack(i + 1, target - candidates[i], path);
               
               这样可以保证：
               - 传入i：可以重复使用当前数字
               - 传入i+1：每个数字最多只能用一次
            */
            path.pop();
        }
    }
}
```

## 典型问题分析

### 1. 全排列问题
```javascript
// 特点：
// 1. 需要used数组
// 2. 有重复元素时需要排序和去重
// 3. 不需要start参数
function permuteUnique(nums) {
    const result = [];
    const used = new Array(nums.length).fill(false);
    nums.sort((a, b) => a - b);  // 排序用于去重
    
    function backtrack(path) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;
            
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack([]);
    return result;
}
```

### 2. 组合问题
```javascript
// 特点：
// 1. 需要start参数
// 2. 不需要used数组
// 3. 有重复元素时需要排序和去重
function combinationSum2(candidates, target) {
    const result = [];
    candidates.sort((a, b) => a - b);
    
    function backtrack(start, target, path) {
        if (target === 0) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] === candidates[i-1]) continue;
            if (candidates[i] > target) break;
            
            path.push(candidates[i]);
            backtrack(i + 1, target - candidates[i], path);
            path.pop();
        }
    }
    
    backtrack(0, target, []);
    return result;
}
```

### 3. 子集问题
```javascript
// 特点：
// 1. 需要start参数
// 2. 每个节点都是一个解
// 3. 有重复元素时需要排序和去重
function subsetsWithDup(nums) {
    const result = [];
    nums.sort((a, b) => a - b);
    
    function backtrack(start, path) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            if (i > start && nums[i] === nums[i-1]) continue;
            
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}
```

## 优化技巧

### 1. 剪枝优化
```javascript
// 1. 基于排序的剪枝
if (candidates[i] > target) break;

// 2. 基于路径的剪枝
if (path.length > maxLength) return;

// 3. 基于已知条件的剪枝
if (sum + candidates[i] > target) continue;
```

### 2. 状态传递优化
```javascript
// 1. 传递累加和
function backtrack(start, sum, path) {
    // 比每次计算path的和要高效
}

// 2. 传递字符串
function backtrack(start, str) {
    // 比操作数组更高效
}
```

### 3. 记忆化优化
```javascript
// 适用于有重叠子问题的场景
const memo = new Map();

function backtrack(state) {
    const key = JSON.stringify(state);
    if (memo.has(key)) return memo.get(key);
    
    // 计算结果
    const result = ...;
    
    memo.set(key, result);
    return result;
}
```

## 总结

### 使用要点对照表

| 特性 | 排列问题 | 组合问题 | 子集问题 |
|------|----------|----------|----------|
| used数组 | ✅ | ❌ | ❌ |
| start参数 | ❌ | ✅ | ✅ |
| 排序去重 | 需要时 | 需要时 | 需要时 |
| 路径处理 | 长度等于n | 长度等于k | 所有长度 |

### 重复元素处理的不同

#### 全排列vs组合的重复元素处理对比
```javascript
// 全排列（排列2）：不需要传入start
function permuteUnique(nums) {
    nums.sort((a, b) => a - b);  // 都需要排序
    const used = new Array(nums.length).fill(false);
    
    function backtrack(path) {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            // 重复元素的判断
            if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;
            /* 这个!used[i-1]的判断非常巧妙：
               
               以[1,1,2]为例，假设两个1分别为1a和1b：
               
               第一层：选了1a
               ↓
               第二层：可以选1b（因为used[i-1]=true，这个条件不会阻止）
               
               但是！
               
               第一层：选了1b
               ↓
               第二层：不能选1a（因为used[i-1]=false，这个条件会阻止）
               
               这样就保证了：对于相同的数字，我们总是按照它们在数组中的顺序使用。
               1a → 1b 可以
               1b → 1a 不行
               
               如果没有这个条件：
               - 1a,1b,2 和 1b,1a,2 会被当作不同的排列
               - 但实际上这两个排列是重复的
               
               如果用used[i-1]而不是!used[i-1]：
               - 会错过一些合法的排列
               - 因为这样会阻止在同一层的相邻相同数字的使用
            
               决策树分析：
               nums = [1a,1b,2]  // 两个1分别标记为1a和1b
               
               不使用!used[i-1]判断时：
                        []
                   /    |    \
                 1a    1b     2
                /  \   /  \   /  \
               1b  2  1a  2  1a  1b
                |   |   |   |   |   |
                2  1b   2  1a  1b  1a
               
               结果会包含：[1a,1b,2] 和 [1b,1a,2]（重复！）
               
               使用!used[i-1]判断时：
                        []
                   /    ×    \
                 1a         2
                /  \       /  ×
               1b  2     1a
                |   |     |
                2  1b    1b
               
               × 表示被!used[i-1]剪掉的分支
               结果只保留：[1a,1b,2]
               
               关键点：
               1. 相同数字只能按顺序使用（1a→1b允许，1b→1a禁止）
               2. !used[i-1]保证了这个顺序性
               3. 这样就避免了重复排列
            */
            
            used[i] = true;
            path.push(nums[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }
}

// 组合（组合2）：需要传入start
function combinationSum2(nums, target) {
    nums.sort((a, b) => a - b);  // 都需要排序
    
    function backtrack(start, target, path) {
        if (target === 0) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            // 重复元素的判断：i > start表示在当前层遇到重复数字
            if (i > start && nums[i] === nums[i-1]) continue;
            if (nums[i] > target) break;
            
            path.push(nums[i]);
            backtrack(i + 1, target - nums[i], path);
            path.pop();
        }
    }
}
```

#### 为什么这么不同？

1. **本质区别**：
   - 排列：需要用到所有位置，每个位置都要填一个数，所以必须要有"全局视角"
     - 每个数字最终都要被用一次
     - 每个位置都要被填一次
     - 所以需要used数组来记录"全局"哪些数字被用过
   
   - 组合：只关心选哪些数，不关心顺序，所以用"局部视角"就够了
     - 不需要每个数都用到
     - 不需要填满所有位置
     - 所以用start参数限制"只能往后取"就能避免重复

2. **重复判断的时机**：
   - 排列：`!used[i-1]` 判断是否在"同一层"重复使用相同的数字
   - 组合：`i > start` 判断是否在"同一层"重复使用相同的数字

3. **举例说明**：
```javascript
nums = [1,1,2]  // 已排序

排列的决策树（未剪枝）：
                    []
           ┌────────┼────────┐
           1        1        2
           ↓        ↓        ↓
          [1]      [1]      [2]
      ┌────┼────┐  │  ┌─────┼─────┐
      1    2    1  2  1     1     2
      ↓    ↓    ↓  ↓  ↓     ↓     ↓
   [1,1] [1,2] [1,1][1,2] [2,1] [2,1] [2,2]
     │     │     │    │     │     │     │
    ...   ...   ...  ...   ...   ...   ...

排列的决策树（剪枝后）：
                    []
           ┌────────┼────────┐
           1        ×        2
           ↓                 ↓
          [1]               [2]
      ┌────┼────┐      ┌────┼────┐
      1    2    ×      1    ×    ×
      ↓    ↓           ↓
   [1,1] [1,2]       [2,1]
   
剪枝说明：
× : 表示被剪掉的分支
- 第一个1后面的1被剪掉：因为前面的1还没用过(!used[i-1])
- [2]节点下的第二个1被剪掉：因为已经在前面用过了(used[i])

组合的决策树（未剪枝）：
                    []
           ┌────────┼────────┐
           1        1        2
           ↓        ↓        ↓
          [1]      [1]      [2]
           │        │
           2        2
           ↓        ↓
         [1,2]    [1,2]

组合的决策树（剪枝后）：
                    []
           ┌────────┼────────┐
           1        ×        2
           ↓                 ↓
          [1]               [2]
           │
           2
           ↓
         [1,2]

剪枝说明：
× : 表示被剪掉的分支
- 第一个1后面的1被剪掉：因为在同一层遇到相同数字(i > start && nums[i] === nums[i-1])
- 每个节点都只能往后取数：因为start参数限制
```

4. **为什么排列问题不用start**：
   - 排列需要"全局"视角，每个数字都可能放在任何位置
   - used数组记录全局使用情况
   - 重复数字的处理依赖于"前一个数是否使用"

5. **为什么组合问题用start**：
   - 组合只需要"局部"视角，只关心"从这个数开始往后取"
   - start参数自然限制了"不能回头取"
   - 重复数字的处理只需要看"当前层是否重复使用"

6. **代码模式总结**：
```javascript
// 排列模式（需要位置信息）：
- 使用used数组
- 重复判断：!used[i-1]
- 每层都从头开始选择

// 组合模式（不需要位置信息）：
- 使用start参数
- 重复判断：i > start
- 每层都从start开始选择
```

### Path参数的传递方式

#### 两种常见的path处理方式
```javascript
// 1. path作为全局变量
function permute(nums) {
    const result = [];
    const path = [];  // path在外面定义
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {  // 不传path
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            path.push(nums[i]);  // 直接修改全局path
            used[i] = true;
            backtrack();         // 不需要传path
            path.pop();          // 回溯时弹出
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

// 2. path作为参数传递
function permute(nums) {
    const result = [];
    
    function backtrack(path) {  // path作为参数
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            backtrack([...path, nums[i]]);  // 创建新数组传入
        }
    }
    
    backtrack([]);  // 初始传入空数组
    return result;
}
```

#### 两种方式的对比

1. **全局变量方式**：
   - **优点**：
     - 空间效率更高（复用同一个数组）
     - 代码更简洁（不需要每次创建新数组）
     - 回溯操作更直观（push/pop对应）
   
   - **缺点**：
     - 需要手动维护回溯状态
     - 可能在多线程环境下有问题
     - 代码不够函数式

2. **参数传递方式**：
   - **优点**：
     - 更函数式的写法
     - 状态更清晰（每个递归调用有自己的path）
     - 不需要手动回溯（创建新数组自动保持状态）
   
   - **缺点**：
     - 空间效率较低（每次递归都创建新数组）
     - 在数据量大时可能有性能影响

#### 选择建议

1. **使用全局变量的场景**：
   - 性能敏感的场景
   - 数据量较大的情况
   - 需要频繁修改path的场景

2. **使用参数传递的场景**：
   - 代码可读性要求高
   - 数据量较小
   - 需要函数式编程风格

3. **实际例子**：
```javascript
// 数据量大的场景（建议用全局变量）
function largeDataPermute(nums) {  // nums很大
    const result = [];
    const path = [];
    // ... 使用全局path
}

// 数据量小的场景（可以用参数传递）
function smallDataPermute(nums) {  // nums较小
    const result = [];
    function backtrack(path) {
        // ... 使用参数path
    }
}
```

### 关键判断点
1. **是否需要used数组？**
   - 元素不能重复使用时需要
   - 排列问题通常需要
   - 组合/子集问题用start代替

2. **是否需要start参数？**
   - 组合/子集问题需要
   - 排列问题不需要
   - 避免重复组合时需要

3. **是否需要排序？**
   - 需要去重时必须排序
   - 需要剪枝时建议排序
   - 需要按序输出时必须排序

4. **是否需要去重？**
   - 输入有重复元素且要求不重复解时
   - 排列问题：used[i-1]判断
   - 组合问题：i > start判断
