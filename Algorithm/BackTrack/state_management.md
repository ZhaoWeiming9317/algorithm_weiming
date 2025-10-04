# 回溯中的状态变量处理

## 状态变量的两种处理方式

### 1. 作为参数传递
```javascript
function combinationSum(candidates, target) {
    const result = [];
    
    function backtrack(start, sum, path) {  // sum作为参数
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            if (sum + candidates[i] > target) continue;
            path.push(candidates[i]);
            backtrack(i, sum + candidates[i], path);  // 传递新的sum
            path.pop();
        }
    }
    
    backtrack(0, 0, []);
    return result;
}
```

### 2. 作为全局变量
```javascript
function combinationSum(candidates, target) {
    const result = [];
    const path = [];
    let sum = 0;  // sum作为全局变量
    
    function backtrack(start) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            if (sum + candidates[i] > target) continue;
            path.push(candidates[i]);
            sum += candidates[i];  // 修改全局sum
            backtrack(i);
            path.pop();
            sum -= candidates[i];  // 回溯时减回去
        }
    }
    
    backtrack(0);
    return result;
}
```

## 两种方式的对比

### 1. 参数传递方式
- **优点**：
  - 状态更清晰，每个递归调用有自己的sum
  - 不需要手动回溯状态
  - 函数更纯粹，便于测试和调试
  - 适合并行执行

- **缺点**：
  - 参数会随着递归调用不断创建新的副本
  - 在递归深度大时可能有性能影响
  - 代码可能看起来比较冗长

### 2. 全局变量方式
- **优点**：
  - 空间效率更高（复用同一个变量）
  - 代码更简洁
  - 状态修改和回溯更直观

- **缺点**：
  - 需要手动维护回溯状态
  - 容易忘记回溯
  - 在复杂情况下可能导致状态混乱
  - 不适合并行执行

## 选择建议

### 1. 使用参数传递的场景
```javascript
// 1. 状态简单，数据量小
function simpleBacktrack(n, k) {
    function backtrack(start, sum, path) {
        // sum作为参数传递
    }
}

// 2. 需要并行处理
async function parallelBacktrack(nums) {
    function backtrack(start, sum, path) {
        // 每个递归调用有独立的sum
    }
}
```

### 2. 使用全局变量的场景
```javascript
// 1. 状态复杂，需要频繁修改
function complexBacktrack(nums) {
    let sum = 0;
    let count = 0;
    let max = -Infinity;
    
    function backtrack(start) {
        // 多个状态变量一起维护
    }
}

// 2. 性能敏感场景
function performanceCritical(nums) {
    let sum = 0;
    
    function backtrack(start) {
        // 避免创建新的sum副本
    }
}
```

## 最佳实践

1. **状态简单时**：
   - 优先使用参数传递
   - 代码更清晰，不容易出错

2. **状态复杂时**：
   - 考虑使用全局变量
   - 但要注意维护好回溯状态

3. **关键点**：
   ```javascript
   // 参数传递：状态变化在参数中体现
   backtrack(start + 1, sum + num, [...path, num]);
   
   // 全局变量：需要手动回溯
   sum += num;
   backtrack(start + 1);
   sum -= num;  // 别忘了回溯！
   ```

4. **注意事项**：
   - 全局变量方式一定要记得回溯
   - 参数传递方式注意递归深度
   - 根据具体场景选择合适的方式
