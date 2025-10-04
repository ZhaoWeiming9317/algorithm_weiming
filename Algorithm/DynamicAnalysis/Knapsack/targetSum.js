/**
 * 目标和 (Target Sum)
 * 
 * 题目描述：
 * 给你一个整数数组 nums 和一个整数 target。向数组中的每个整数前添加 '+' 或 '-'，然后串联起所有整数，可以构造一个新的表达式。
 * 例如，nums = [2, 1]，可以在 2 之前添加 '+'，在 1 之前添加 '-'，然后串联起来得到表达式 "+2-1"。
 * 返回可以通过上述方法构造的、运算结果等于 target 的不同表达式的数目。
 * 
 * 示例1：
 * 输入：nums = [1,1,1,1,1], target = 3
 * 输出：5
 * 解释：一共有5种方法让最终目标和为3
 * -1+1+1+1+1 = 3
 * +1-1+1+1+1 = 3
 * +1+1-1+1+1 = 3
 * +1+1+1-1+1 = 3
 * +1+1+1+1-1 = 3
 * 
 * 解题思路：
 * 1. 回溯法
 * 2. 动态规划（背包问题变种）
 *    - 设正数和为P，负数和为N，有P + N = sum(nums)，P - N = target
 *    - 因此：P = (sum(nums) + target) / 2
 *    - 问题转化为：从nums中选择若干个数，使其和为P的方案数
 */

// 方法1：回溯法（会超时）
function findTargetSumWays(nums, target) {
    let count = 0;
    
    function backtrack(index, sum) {
        if (index === nums.length) {
            if (sum === target) {
                count++;
            }
            return;
        }
        
        // 尝试 +nums[index]
        backtrack(index + 1, sum + nums[index]);
        // 尝试 -nums[index]
        backtrack(index + 1, sum - nums[index]);
    }
    
    backtrack(0, 0);
    return count;
}

// 方法2：动态规划（背包问题）
function findTargetSumWaysDP(nums, target) {
    const sum = nums.reduce((a, b) => a + b, 0);
    
    // 特殊情况处理
    if (target > sum || target < -sum || (sum + target) % 2 !== 0) {
        return 0;
    }
    
    const p = (sum + target) / 2;  // 正数部分的和
    const n = nums.length;
    
    // dp[i][j] 表示前i个数选择若干个数和为j的方案数
    const dp = Array(n + 1).fill().map(() => Array(p + 1).fill(0));
    
    // 初始化：和为0的方案数为1（都不选择）
    for (let i = 0; i <= n; i++) {
        dp[i][0] = 1;
    }
    
    // 填充dp数组
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= p; j++) {
            // 不选择当前数字
            dp[i][j] = dp[i-1][j];
            
            // 选择当前数字
            if (j >= nums[i-1]) {
                dp[i][j] += dp[i-1][j - nums[i-1]];
            }
        }
    }
    
    return dp[n][p];
}

// 方法3：空间优化的动态规划
function findTargetSumWaysOptimized(nums, target) {
    const sum = nums.reduce((a, b) => a + b, 0);
    
    if (target > sum || target < -sum || (sum + target) % 2 !== 0) {
        return 0;
    }
    
    const p = (sum + target) / 2;
    
    // 只使用一维数组
    const dp = Array(p + 1).fill(0);
    dp[0] = 1;  // 和为0的方案数为1
    
    // 遍历每个数字
    for (const num of nums) {
        // 逆序遍历，避免重复计算
        for (let j = p; j >= num; j--) {
            dp[j] += dp[j - num];
        }
    }
    
    return dp[p];
}

// 方法4：记忆化递归
function findTargetSumWaysMemo(nums, target) {
    const memo = new Map();
    
    function dfs(index, sum) {
        if (index === nums.length) {
            return sum === target ? 1 : 0;
        }
        
        const key = `${index}-${sum}`;
        if (memo.has(key)) {
            return memo.get(key);
        }
        
        const result = dfs(index + 1, sum + nums[index]) + 
                      dfes(index + 1, sum - nums[index]);
        
        memo.set(key, result);
        return result;
    }
    
    return dfs(0, 0);
}

// 测试
function testTargetSum() {
    const nums1 = [1, 1, 1, 1, 1];
    const target1 = 3;
    
    console.log("测试用例1 - 基本场景：");
    console.log("回溯法:", findTargetSumWays(nums1, target1));
    console.log("动态规划:", findTargetSumWaysDP(nums1, target1));
    console.log("空间优化:", findTargetSumWaysOptimized(nums1, target1));
    
    const nums2 = [1];
    const target2 = 2;
    console.log("\n测试用例2 - 单个元素：");
    console.log("动态规划:", findTargetSumWaysDP(nums2, target2));
}

module.exports = {
    findTargetSumWays,
    findTargetSumWaysDP,
    findTargetSumWaysOptimized,
    findTargetSumWaysMemo
};
