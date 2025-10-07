# 回溯树可视化详解

## 核心问题：为什么有些节点记录，有些不记录？

答案取决于**问题类型**：
- **子集问题**：每个节点都记录（包括中间节点）
- **排列/组合问题**：只有叶子节点记录

---

## 一、子集问题的回溯树

### 输入: [1, 2, 3]

### 完整的决策树（带执行顺序）

```
执行顺序：按照深度优先遍历

步骤1: backtrack(0, [])
       记录: []                                    ← ✅ 第1个结果
       │
       ├── 选择1
       ↓
步骤2: backtrack(1, [1])
       记录: [1]                                   ← ✅ 第2个结果
       │
       ├── 选择2
       ↓
步骤3: backtrack(2, [1,2])
       记录: [1,2]                                 ← ✅ 第3个结果
       │
       ├── 选择3
       ↓
步骤4: backtrack(3, [1,2,3])
       记录: [1,2,3]                               ← ✅ 第4个结果
       │
       └── start=3 >= nums.length，返回
       
步骤5: 回溯到步骤3，撤销选择3
       继续循环，但 i=3 >= nums.length，返回
       
步骤6: 回溯到步骤2，撤销选择2
       继续循环，选择3
       ↓
步骤7: backtrack(3, [1,3])
       记录: [1,3]                                 ← ✅ 第5个结果
       │
       └── start=3 >= nums.length，返回
       
步骤8: 回溯到步骤2，循环结束，返回

步骤9: 回溯到步骤1，撤销选择1
       继续循环，选择2
       ↓
步骤10: backtrack(2, [2])
        记录: [2]                                  ← ✅ 第6个结果
        │
        ├── 选择3
        ↓
步骤11: backtrack(3, [2,3])
        记录: [2,3]                                ← ✅ 第7个结果
        │
        └── 返回

步骤12: 回溯到步骤1，撤销选择2
        继续循环，选择3
        ↓
步骤13: backtrack(3, [3])
        记录: [3]                                  ← ✅ 第8个结果
        │
        └── 返回

最终结果: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

### 树形结构可视化

```
                              []                    ← 记录
                              │
              ┌───────────────┼───────────────┐
              │               │               │
            选1             选2             选3
              ↓               ↓               ↓
             [1]             [2]             [3]    ← 记录
              │               │
        ┌─────┴─────┐         │
        │           │         │
      选2         选3       选3
        ↓           ↓         ↓
      [1,2]       [1,3]     [2,3]                  ← 记录
        │
        │
      选3
        ↓
     [1,2,3]                                       ← 记录
```

### 代码执行轨迹

```javascript
function subsets(nums) {
    const result = [];
    const path = [];
    
    function backtrack(start) {
        console.log(`进入节点: start=${start}, path=[${path}]`);
        
        // ⭐ 关键：每次进入都记录
        result.push([...path]);
        console.log(`✅ 记录: [${path}]`);
        
        for (let i = start; i < nums.length; i++) {
            console.log(`  尝试选择 nums[${i}]=${nums[i]}`);
            path.push(nums[i]);
            backtrack(i + 1);
            path.pop();
            console.log(`  撤销选择 nums[${i}]=${nums[i]}`);
        }
        
        console.log(`离开节点: start=${start}, path=[${path}]`);
    }
    
    backtrack(0);
    return result;
}

// 执行 subsets([1,2,3])
```

### 输出日志

```
进入节点: start=0, path=[]
✅ 记录: []
  尝试选择 nums[0]=1
进入节点: start=1, path=[1]
✅ 记录: [1]
  尝试选择 nums[1]=2
进入节点: start=2, path=[1,2]
✅ 记录: [1,2]
  尝试选择 nums[2]=3
进入节点: start=3, path=[1,2,3]
✅ 记录: [1,2,3]
离开节点: start=3, path=[1,2,3]
  撤销选择 nums[2]=3
离开节点: start=2, path=[1,2]
  撤销选择 nums[1]=2
  尝试选择 nums[2]=3
进入节点: start=3, path=[1,3]
✅ 记录: [1,3]
离开节点: start=3, path=[1,3]
  撤销选择 nums[2]=3
离开节点: start=1, path=[1]
  撤销选择 nums[0]=1
  尝试选择 nums[1]=2
进入节点: start=2, path=[2]
✅ 记录: [2]
  尝试选择 nums[2]=3
进入节点: start=3, path=[2,3]
✅ 记录: [2,3]
离开节点: start=3, path=[2,3]
  撤销选择 nums[2]=3
离开节点: start=2, path=[2]
  撤销选择 nums[1]=2
  尝试选择 nums[2]=3
进入节点: start=3, path=[3]
✅ 记录: [3]
离开节点: start=3, path=[3]
  撤销选择 nums[2]=3
离开节点: start=0, path=[]
```

---

## 二、排列问题的回溯树

### 输入: [1, 2, 3]

### 树形结构（只记录叶子节点）

```
                              []                    ← 不记录（中间节点）
                              │
              ┌───────────────┼───────────────┐
              │               │               │
            选1             选2             选3
              ↓               ↓               ↓
             [1]             [2]             [3]    ← 不记录（中间节点）
              │               │               │
        ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
        │           │   │           │   │           │
      选2         选3 选1         选3 选1         选2
        ↓           ↓   ↓           ↓   ↓           ↓
      [1,2]       [1,3][2,1]      [2,3][3,1]      [3,2]  ← 不记录（中间节点）
        │           │   │           │   │           │
      选3         选2 选3         选1 选2         选1
        ↓           ↓   ↓           ↓   ↓           ↓
     [1,2,3]     [1,3,2][2,1,3]  [2,3,1][3,1,2]  [3,2,1] ← ✅ 记录（叶子节点）
```

### 代码执行轨迹

```javascript
function permute(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        console.log(`进入节点: path=[${path}]`);
        
        // ⭐ 关键：只有到达叶子节点才记录
        if (path.length === nums.length) {
            result.push([...path]);
            console.log(`✅ 记录: [${path}]（叶子节点）`);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            console.log(`  尝试选择 nums[${i}]=${nums[i]}`);
            path.push(nums[i]);
            used[i] = true;
            backtrack();
            path.pop();
            used[i] = false;
            console.log(`  撤销选择 nums[${i}]=${nums[i]}`);
        }
        
        console.log(`❌ 不记录: [${path}]（中间节点）`);
    }
    
    backtrack();
    return result;
}
```

---

## 三、组合问题的回溯树

### 输入: n=4, k=2 (从1到4中选2个数的组合)

### 树形结构

```
                              []                    ← 不记录（长度不足）
                              │
              ┌───────────────┼───────────────┬─────────┐
              │               │               │         │
            选1             选2             选3       选4
              ↓               ↓               ↓         ↓
             [1]             [2]             [3]       [4]  ← 不记录（长度不足）
              │               │               │
        ┌─────┼─────┬───┐     │               │
        │     │     │   │     │               │
      选2   选3   选4       选3             选4
        ↓     ↓     ↓         ↓               ↓
      [1,2] [1,3] [1,4]     [2,3]           [3,4]      ← ✅ 记录（长度=k）
```

### 代码

```javascript
function combine(n, k) {
    const result = [];
    
    function backtrack(start, path) {
        console.log(`进入节点: start=${start}, path=[${path}]`);
        
        // ⭐ 关键：只有长度为k时才记录
        if (path.length === k) {
            result.push([...path]);
            console.log(`✅ 记录: [${path}]（长度=k）`);
            return;
        }
        
        for (let i = start; i <= n; i++) {
            console.log(`  尝试选择 ${i}`);
            backtrack(i + 1, [...path, i]);
            console.log(`  撤销选择 ${i}`);
        }
        
        console.log(`❌ 不记录: [${path}]（长度<k）`);
    }
    
    backtrack(1, []);
    return result;
}
```

---

## 四、三种问题的对比表

| 特性 | 子集 | 排列 | 组合 |
|------|------|------|------|
| **记录时机** | 每个节点 | 叶子节点 | 特定深度 |
| **判断条件** | 无 | `path.length === n` | `path.length === k` |
| **树的深度** | 0 ~ n | n | k |
| **结果数量** | 2^n | n! | C(n,k) |
| **是否剪枝** | 否 | 否 | 是 |

### 代码对比（关键部分）

```javascript
// 子集：进入就记录
function subsets(nums) {
    function backtrack(start, path) {
        result.push([...path]);  // ← 无条件记录
        for (let i = start; i < nums.length; i++) {
            backtrack(i + 1, [...path, nums[i]]);
        }
    }
}

// 排列：叶子节点记录
function permute(nums) {
    function backtrack(path, used) {
        if (path.length === nums.length) {  // ← 叶子节点判断
            result.push([...path]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            backtrack([...path, nums[i]], {...used, [i]: true});
        }
    }
}

// 组合：特定深度记录
function combine(n, k) {
    function backtrack(start, path) {
        if (path.length === k) {  // ← 深度k判断
            result.push([...path]);
            return;
        }
        for (let i = start; i <= n; i++) {
            backtrack(i + 1, [...path, i]);
        }
    }
}
```

---

## 五、记忆口诀

```
子集问题走到哪，记到哪
排列问题到叶子，才记录
组合问题看深度，够了记
```

### 判断方法

```
1. 看题目要求：
   - 所有子集 → 每个节点都记录
   - 所有排列 → 只有叶子节点记录
   - 特定长度 → 只有到达该长度记录

2. 看记录条件：
   - result.push([...path]) 在函数开头 → 子集
   - result.push([...path]) 在 if 判断里 → 排列/组合

3. 看树的形态：
   - 每层选择递减 → 子集/组合
   - 每层选择固定 → 排列
```

---

## 六、实际例子

### 例子1：电商商品推荐

```javascript
// 场景：推荐商品的所有可能组合（子集）
const products = ['手机', '耳机', '充电器'];

// 使用子集算法
function getAllRecommendations(products) {
    const result = [];
    function backtrack(start, combo) {
        result.push([...combo]);  // 每种组合都推荐
        for (let i = start; i < products.length; i++) {
            backtrack(i + 1, [...combo, products[i]]);
        }
    }
    backtrack(0, []);
    return result;
}

// 结果：
// [], ['手机'], ['手机','耳机'], ['手机','耳机','充电器'],
// ['手机','充电器'], ['耳机'], ['耳机','充电器'], ['充电器']
```

### 例子2：密码锁组合

```javascript
// 场景：生成所有4位密码（排列）
const digits = [1, 2, 3, 4];

function getAllPasswords(digits) {
    const result = [];
    function backtrack(path, used) {
        if (path.length === 4) {  // 只有4位数才是有效密码
            result.push([...path]);
            return;
        }
        for (let i = 0; i < digits.length; i++) {
            if (used[i]) continue;
            backtrack([...path, digits[i]], {...used, [i]: true});
        }
    }
    backtrack([], {});
    return result;
}

// 结果只有24个完整的4位数
```

---

## 总结

**核心理解**：
1. **子集**：每个节点都是一个有效的子集，所以**进入就记录**
2. **排列/组合**：只有满足特定条件的节点才是有效结果，所以**有条件记录**

这就是为什么有些节点记录，有些不记录的根本原因！
