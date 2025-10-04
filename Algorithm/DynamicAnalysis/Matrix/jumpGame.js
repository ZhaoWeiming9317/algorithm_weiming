/**
 * 跳跃游戏 (Jump Game)
 * 
 * 题目描述：
 * 给定一个非负整数数组 nums，你最初位于数组的第一个位置。
 * 数组中的每个元素代表你在该位置可以跳跃的最大长度。
 * 判断你是否能够到达最后一个位置。
 * 
 * 示例1：
 * 输入：nums = [2,3,1,1,4]
 * 输出：true
 * 解释：可以先跳1步，从下标0到1，然后再从下标1跳3步到达最后一个位置。
 * 
 * 示例2：
 * 输入：nums = [3,2,1,0,4]
 * 输出：false
 * 解释：无论怎样，总会到达下标为3的位置。但该下标的最大跳跃长度是0，
 * 所以永远不可能到达最后一个位置。
 * 
 * 解题思路：
 * 1. 贪心算法（最优解）
 * 2. 动态规划
 * 3. 回溯法
 * 4. BFS（广度优先搜索）
 */

// 方法1：贪心算法（最优解）
function canJumpGreedy(nums) {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        // 如果当前位置超过了能到达的最远位置
        if (i > maxReach) return false;
        
        // 更新能到达的最远位置
        maxReach = Math.max(maxReach, i + nums[i]);
        
        // 如果已经能到达最后一个位置
        if (maxReach >= nums.length - 1) return true;
    }
    
    return true;
}

// 方法2：动态规划（自顶向下）
function canJumpDP(nums) {
    const n = nums.length;
    const memo = new Array(n).fill(-1);  // -1: 未计算, 0: 不可达, 1: 可达
    
    function dfs(i) {
        // 边界条件
        if (i >= n - 1) return 1;
        
        // 记忆化
        if (memo[i] !== -1) return memo[i];
        
        // 尝试所有可能的跳跃步数
        for (let step = 1; step <= nums[i]; step++) {
            if (dfs(i + step) === 1) {
                return memo[i] = 1;
            }
        }
        
        return memo[i] = 0;
    }
    
    return dfs(0) === 1;
}

// 方法3：动态规划（自底向上）
function canJumpDPBottomUp(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(false);
    
    // 最后一个位置肯定可达
    dp[n - 1] = true;
    
    // 从右往左填充dp数组
    for (let i = n - 2; i >= 0; i--) {
        // 检查从当前位置能跳到的所有位置
        for (let step = 1; step <= nums[i]; step++) {
            const nextPos = i + step;
            if (nextPos < n && dp[nextPos]) {
                dp[i] = true;
                break;  // 找到一个可达位置就够了
            }
        }
    }
    
    return dp[0];
}

// 方法4：动态规划（优化版）
function canJumpDPOptimized(nums) {
    const n = nums.length;
    const dp = new Array(n).fill(false);
    
    dp[n - 1] = true;
    
    for (let i = n - 2; i >= 0; i--) {
        // 优化：直接检查能到达的最远位置
        const maxJump = Math.min(i + nums[i], n - 1);
        for (let j = i + 1; j <= maxJump; j++) {
            if (dp[j]) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[0];
}

// 方法5：返回最少跳跃次数
function minJumps(nums) {
    if (nums.length <= 1) return 0;
    
    let jumps = 0;
    let currentEnd = 0;  // 当前跳跃能到达的最远位置
    let farthest = 0;    // 所有跳跃能到达的最远位置
    
    for (let i = 0; i < nums.length - 1; i++) {
        // 更新能到达的最远位置
        farthest = Math.max(farthest, i + nums[i]);
        
        // 如果到达了当前跳跃的边界
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            
            // 如果已经能到达最后一个位置
            if (currentEnd >= nums.length - 1) break;
        }
    }
    
    return jumps;
}

// 方法6：返回所有可能的跳跃路径
function getAllJumpPaths(nums) {
    const paths = [];
    
    function backtrack(position, path) {
        if (position >= nums.length - 1) {
            if (position === nums.length - 1) {
                paths.push([...path]);
            }
            return;
        }
        
        // 尝试所有可能的跳跃步数
        for (let step = 1; step <= nums[position]; step++) {
            path.push(position + step);
            backtrack(position + step, path);
            path.pop();
        }
    }
    
    backtrack(0, [0]);
    return paths;
}

// 方法7：BFS解法
function canJumpBFS(nums) {
    if (nums.length <= 1) return true;
    
    const queue = [0];
    const visited = new Set([0]);
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        // 尝试所有可能的跳跃步数
        for (let step = 1; step <= nums[current]; step++) {
            const nextPos = current + step;
            
            if (nextPos >= nums.length - 1) {
                return true;  // 到达最后一个位置
            }
            
            if (!visited.has(nextPos)) {
                visited.add(nextPos);
                queue.push(nextPos);
            }
        }
    }
    
    return false;
}

// 方法8：带障碍的跳跃游戏
function canJumpWithObstacles(nums, obstacles) {
    const n = nums.length;
    const dp = new Array(n).fill(false);
    
    dp[0] = !obstacles[0];  // 第一个位置，如果不是障碍物就可达
    
    for (let i = 1; i < n; i++) {
        if (obstacles[i]) {
            dp[i] = false;  // 障碍物不可达
            continue;
        }
        
        // 检查从前面哪个位置能跳过来
        for (let j = 0; j < i; j++) {
            if (dp[j] && j + nums[j] >= i) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n - 1];
}

// 测试
function test() {
    // 测试用例1：能够到达
    const nums1 = [2, 3, 1, 1, 4];
    console.log("测试用例1 - 能够到达：");
    console.log("贪心算法:", canJumpGreedy(nums1));
    console.log("动态规划:", canJumpDP(nums1));
    console.log("自底向上:", canJumpDPBottomUp(nums1));
    console.log("BFS:", canJumpBFS(nums1));
    console.log("最少跳跃次数:", minJumps(nums1));
    
    // 测试用例2：无法到达
    const nums2 = [3, 2, 1, 0, 4];
    console.log("\n测试用例2 - 无法到达：");
    console.log("贪心算法:", canJumpGreedy(nums2));
    console.log("动态规划:", canJumpDP(nums2));
    console.log("自底向上:", canJumpDPBottomUp(nums2));
    
    // 测试用例3：单个元素
    const nums3 = [0];
    console.log("\n测试用例3 - 单个元素：");
    console.log("贪心算法:", canJumpGreedy(nums3));
    console.log("动态规划:", canJumpDP(nums3));
    
    // 测试用例4：带障碍
    const nums4 = [2, 3, 1, 1, 4];
    const obstacles4 = [false, false, true, false, false];
    console.log("\n测试用例4 - 带障碍：");
    console.log("带障碍跳跃:", canJumpWithObstacles(nums4, obstacles4));
}

module.exports = {
    canJumpGreedy,
    canJumpDP,
    canJumpDPBottomUp,
    canJumpDPOptimized,
    minJumps,
    getAllJumpPaths,
    canJumpBFS,
    canJumpWithObstacles
};
