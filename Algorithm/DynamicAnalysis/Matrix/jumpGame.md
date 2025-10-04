# 矩阵相关动态规划问题

## 跳跃游戏 (Jump Game)

### 什么是跳跃游戏？
给定一个非负整数数组，每个元素表示在该位置可以跳跃的最大长度。判断是否能够从第一个位置到达最后一个位置。

### 解题思路对比

#### 1. 贪心算法（最优解）
```javascript
function canJumpGreedy(nums) {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;  // 当前位置无法到达
        maxReach = Math.max(maxReach, i + nums[i]);  // 更新最远可达位置
    }
    
    return true;
}
```

**优点**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)
- 一次遍历解决问题

**核心思想**：记录从当前位置能到达的最远位置，如果当前位置超出了最远位置，则无法到达。

#### 2. 动态规划解法

##### 自顶向下（记忆化递归）
```javascript
function canJumpDP(nums) {
    const memo = new Array(nums.length).fill(-1);
    
    function dfs(i) {
        if (i >= nums.length - 1) return 1;
        if (memo[i] !== -1) return memo[i];
        
        for (let step = 1; step <= nums[i]; step++) {
            if (dfs(i + step) === 1) {
                return memo[i] = 1;
            }
        }
        return memo[i] = 0;
    }
    
    return dfs(0) === 1;
}
```

##### 自底向上（表格法）
```javascript
function canJumpDPBottomUp(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(false);
    
    dp[n - 1] = true;  // 最后一个位置肯定可达
    
    // 从右往左填充
    for (let i = n - 2; i >= 0; i--) {
        for (let step = 1; step <= nums[i]; step++) {
            const nextPos = i + step;
            if (nextPos < n && dp[nextPos]) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[0];
}
```

#### 3. BFS解法
```javascript
function canJumpBFS(nums) {
    const queue = [0];
    const visited = new Set([0]);
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        for (let step = 1; step <= nums[current]; step++) {
            const nextPos = current + step;
            if (nextPos >= nums.length - 1) return true;
            
            if (!visited.has(nextPos)) {
                visited.add(nextPos);
                queue.push(nextPos);
            }
        }
    }
    
    return false;
}
```

### 复杂度对比

| 方法 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|------------|------------|----------|
| 贪心算法 | O(n) | O(1) | **最优解法** | 
| DP(记忆化) | O(n²) | O(n) | 理解DP思想 |
| DP(表格) | O(n²) | O(n) | 系统性DP实现 |
| BFS | O(n²) | O(n) | 图论思维 |

### 为什么这道题更适合贪心算法？

1. **问题特性**：
   - 只需要判断是否能到达，不需要具体路径
   - 具有"局部最优性"：当前位置的最远可达距离确定了后续的搜索范围

2. **贪心选择性质**：
   - 每一步都尽可能跳到最远的位置
   - 这个策略能保证找到最优解

3. **DP的劣势**：
   - DP会尝试所有可能的跳跃方案
   - 时间复杂度过高（O(n²) vs O(n)）

### 变种问题

1. **最少跳跃次数**：
   ```javascript
   function minJumps(nums) {
       let jumps = 0;
       let currentEnd = 0;
       let farthest = 0;
       
       for (let i = 0; i < nums.length - 1; i++) {
           farthest = Math.max(farthest, i + nums[i]);
           if (i === currentEnd) {
               jumps++;
               currentEnd = farthest;
           }
       }
       return jumps;
   }
   ```

2. **跳跃游戏II（最少步数）**
3. **跳跃游戏III（带方向）**
4. **青蛙过河（类似跳跃游戏）**

### 学习价值

虽然这道题贪心算法是最优解，但学习DP解法仍然有价值：

1. **理解问题本质**：DP帮助我们理解问题的所有可能解
2. **掌握DP思想**：自顶向下、自底向上等不同思路
3. **扩展能力**：很多跳跃游戏的变种需要用DP解决
4. **算法思维**：同一个问题可以有多种解法思路
