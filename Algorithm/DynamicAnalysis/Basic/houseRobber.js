/**
 * 打家劫舍 (House Robber)
 * 
 * 题目描述：
 * 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，
 * 如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 * 给定一个代表每个房屋存放金额的非负整数数组，计算你 在不触动警报装置的情况下，一夜之内能够偷窃到的最高金额。
 * 
 * 示例1：
 * 输入：[2,7,9,3,1]
 * 输出：12
 * 解释：偷窃 1 号房屋（金额 = 2），偷窃 3 号房屋（金额 = 9），接着偷窃 5 号房屋（金额 = 1）。
 * 偷窃到的最高金额 = 2 + 9 + 1 = 12 。
 * 
 * 示例2：
 * 输入：[1,2,3,1]
 * 输出：4
 * 解释：偷 4 号房屋（金额 = 1），偷 1 号和 3 号房屋（金额 = 1 + 3 = 4）。
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i] 表示从第0个房屋到第i个房屋能偷取的最大金额
 *    - 状态转移：dp[i] = max(dp[i-1], dp[i-2] + nums[i])
 *    - 解释：要么不偷第i个房屋（dp[i-1]），要么偷第i个房屋（dp[i-2] + nums[i]）
 */

// 方法1：基本动态规划
function rob(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    const n = nums.length;
    const dp = new Array(n);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    }
    
    return dp[n-1];
}

// 方法2：空间优化（滚动数组）
function robOptimized(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = nums[0];        // dp[i-2]
    let prev1 = Math.max(nums[0], nums[1]);  // dp[i-1]
    
    for (let i = 2; i < nums.length; i++) {
        const current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// 方法3：返回具体偷窃方案
function robWithPath(nums) {
    if (nums.length === 0) return { amount: 0, path: [] };
    if (nums.length === 1) return { amount: nums[0], path: [0] };
    
    const n = nums.length;
    const dp = new Array(n);
    const choose = new Array(n).fill(false);  // 记录每个房屋是否被选择
    
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    choose[1] = (nums[1] > nums[0]);
    
    for (let i = 2; i < n; i++) {
        if (dp[i-1] > dp[i-2] + nums[i]) {
            dp[i] = dp[i-1];
            choose[i] = false;
        } else {
            dp[i] = dp[i-2] + nums[i];
            choose[i] = true;
        }
    }
    
    // 回溯找出偷窃的房屋
    const path = [];
    let i = n - 1;
    while (i >= 0) {
        if (choose[i]) {
            path.unshift(i);
            i -= 2;  // 跳过相邻房屋
        } else {
            i--;
        }
    }
    
    return { amount: dp[n-1], path };
}

// 方法4：环形房屋版本
function robCircular(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    if (nums.length === 2) return Math.max(nums[0], nums[1]);
    
    // 情况1：不偷第一个房屋
    function robRange(start, end) {
        let prev2 = 0, prev1 = 0;
        
        for (let i = start; i <= end; i++) {
            const current = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
    
    // 不偷第一个房屋 vs 不偷最后一个房屋
    return Math.max(
        robRange(1, nums.length - 1),
        robRange(0, nums.length - 2)
    );
}

// 方法5：二叉树版本（房屋是二叉树结构）
function robTree(root) {
    function dfs(node) {
        if (!node) return [0, 0];  // [偷当前节点, 不偷当前节点]
        
        const left = dfs(node.left);
        const right = dfs(node.right);
        
        // 偷当前节点：不能偷子节点
        const robCurrent = node.val + left[1] + right[1];
        
        // 不偷当前节点：可以偷任意子节点组合
        const notRobCurrent = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
        
        return [robCurrent, notRobCurrent];
    }
    
    const [robRoot, notRobRoot] = dfs(root);
    return Math.max(robRoot, notRobRoot);
}

// 方法6：记忆化递归
function robMemo(nums) {
    const memo = new Map();
    
    function dfs(index) {
        if (index >= nums.length) return 0;
        
        if (memo.has(index)) {
            return memo.get(index);
        }
        
        // 选择1：偷当前房屋
        const robCurrent = nums[index] + dfs(index + 2);
        
        // 选择2：不偷当前房屋
        const skipCurrent = dfs(index + 1);
        
        const result = Math.max(robCurrent, skipCurrent);
        memo.set(index, result);
        
        return result;
    }
    
    return dfs(0);
}

// 测试
function testRob() {
    // 测试用例1：基本场景
    const nums1 = [2, 7, 9, 3, 1];
    console.log("测试用例1 - 基本场景：");
    console.log("动态规划:", rob(nums1));
    console.log("空间优化:", robOptimized(nums1));
    console.log("具体方案:", robWithPath(nums1));
    console.log("记忆化递归:", robMemo(nums1));
    
    // 测试用例2：环形房屋
    const nums2 = [2, 3, 2];
    console.log("\n测试用例2 - 环形房屋：");
    console.log("环形打家劫舍:", robCircular(nums2));
    
    // 测试用例3：边界情况
    const nums3 = [5];
    console.log("\n测试用例3 - 单个房屋：");
    console.log("动态规划:", rob(nums3));
    
    const nums4 = [1, 2];
    console.log("\n测试用例4 - 两个房屋：");
    console.log("动态规划:", rob(nums4));
}

module.exports = {
    rob,
    robOptimized,
    robWithPath,
    robCircular,
    robTree,
    robMemo
};
