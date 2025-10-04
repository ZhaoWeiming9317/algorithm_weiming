# 回溯中的剪枝策略

## 1. 基础剪枝 vs 高级剪枝

### 基础剪枝（必要的）
```javascript
// 1. 超出目标值就不用继续了
if (sum > target) return;

// 2. 使用过的元素不能再用
if (used[i]) continue;

// 3. 同层重复元素跳过
if (i > start && nums[i] === nums[i-1]) continue;
```

### 高级剪枝（可选的）
```javascript
// 1. 剩余数字不够用
if (n - start + 1 < k - path.length) return;
/*
解释：比如n=4, k=3
当start=3时，我们还需要选2个数(k-path.length=2)
但是只剩下2个数可选(n-start+1=2)
这种情况下继续递归也不可能找到解
*/

// 2. 剩余和达不到目标
if (sum + remain < target) return;

// 3. 排序后的提前返回
if (nums[i] > target/2) return;
```

## 2. 为什么有些剪枝难想？

### 以"剩余数字不够"为例
```javascript
n = 4, k = 3

不剪枝的决策树：
                []
        1/      2|      3\      4\
      [1]      [2]      [3]     [4]
   2/  3/  4/  3|  4\   4|    ×
[1,2][1,3][1,4][2,3][2,4][3,4]
  3|   4|   ×   4|   ×    ×
[1,2,3][1,3,4] [2,3,4]

剪枝后的决策树：
                []
        1/      2|      3\      ×
      [1]      [2]      [3]     
   2/  3/  ×   3|  ×    4|    
[1,2][1,3]   [2,3]    [3,4]
  3|   4|      4|       
[1,2,3][1,3,4][2,3,4]

× 表示剪掉的分支
```

### 3. 剪枝的取舍原则

1. **必要性**
   - 基础剪枝：影响结果正确性，必须要有
   - 高级剪枝：只影响效率，可以不要

2. **可读性 vs 效率**
   ```javascript
   // 不剪枝：代码简单直观
   function combine(n, k) {
       function backtrack(start, path) {
           if (path.length === k) {
               result.push([...path]);
               return;
           }
           
           for (let i = start; i <= n; i++) {
               path.push(i);
               backtrack(i + 1, path);
               path.pop();
           }
       }
   }

   // 加剪枝：代码不太直观
   function combine(n, k) {
       function backtrack(start, path) {
           if (path.length === k) {
               result.push([...path]);
               return;
           }
           
           // 这个剪枝虽然能提高效率
           // 但增加了代码复杂度
           if (n - start + 1 < k - path.length) {
               return;
           }
           
           for (let i = start; i <= n; i++) {
               path.push(i);
               backtrack(i + 1, path);
               path.pop();
           }
       }
   }
   ```

3. **建议**
   - 面试时先写基础版本
   - 如果面试官问优化，再谈剪枝
   - 解释清楚为什么这样剪枝是对的

4. **记忆方式**
   - 不要死记硬背剪枝条件
   - 理解问题本质，剪枝自然就懂
   - 比如"剩余数字不够"这个剪枝：
     - 需要x个数
     - 只剩y个数可选
     - 如果y < x，那肯定不可能完成任务

## 总结

1. **优先级**
   - 先把基本逻辑写对
   - 基础剪枝是必要的
   - 高级剪枝是锦上添花

2. **面试策略**
   - 先写无剪枝版本
   - 写完基础剪枝
   - 最后讨论优化剪枝

3. **代码质量**
   - 剪枝要加注释
   - 解释为什么这样剪是对的
   - 不要为了剪枝牺牲代码可读性
