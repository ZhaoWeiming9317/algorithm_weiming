/**
 * 爬楼梯 (Climbing Stairs)
 * 
 * 题目描述：
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 * 
 * 示例1：
 * 输入：n = 2
 * 输出：2
 * 解释：有两种方法可以爬到楼顶。
 * 1. 1 阶 + 1 阶
 * 2. 2 阶
 * 
 * 示例2：
 * 输入：n = 3
 * 输出：3
 * 解释：有三种方法可以爬到楼顶。
 * 1. 1 阶 + 1 阶 + 1 阶
 * 2. 1 阶 + 2 阶
 * 3. 2 阶 + 1 阶
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i] 表示爬到第i阶的方法数
 *    - 状态转移：dp[i] = dp[i-1] + dp[i-2]
 *    - 初始状态：dp[1] = 1, dp[2] = 2
 * 
 * 2. 递归（自顶向下）
 *    - 直接按照定义实现
 *    - 存在重复计算
 * 
 * 3. 数学方法
 *    - 实际上是斐波那契数列
 *    - 可以用通项公式直接计算
 */

// 方法1：动态规划
function climbStairs(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}

// 方法2：空间优化的动态规划
function climbStairsOptimized(n) {
    if (n <= 2) return n;
    
    let prev2 = 1;  // dp[i-2]
    let prev1 = 2;  // dp[i-1]
    let curr = 2;   // dp[i]
    
    for (let i = 3; i <= n; i++) {
        curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return curr;
}

// 方法3：递归
function climbStairsRecursive(n) {
    const memo = new Array(n + 1).fill(-1);

    function climb(i) {
        if (i <= 2) return i;
        if (memo[i] !== -1) return memo[i];

        memo[i] = climb(i-1) + climb(i-2);
        return memo[i];
    }

    return climb(n);
}

// 方法4：数学方法（通项公式）
function climbStairsMath(n) {
    const sqrt5 = Math.sqrt(5);
    const phi = (1 + sqrt5) / 2;
    const psi = (1 - sqrt5) / 2;
    
    return Math.round((Math.pow(phi, n + 1) - Math.pow(psi, n + 1)) / sqrt5);
}

// 方法5：返回所有可能的路径
function getAllPaths(n) {
    const paths = [];
    
    function backtrack(remaining, path) {
        if (remaining === 0) {
            paths.push([...path]);
            return;
        }
        if (remaining < 0) return;
        
        // 尝试爬1阶
        path.push(1);
        backtrack(remaining - 1, path);
        path.pop();
        
        // 尝试爬2阶
        path.push(2);
        backtrack(remaining - 2, path);
        path.pop();
    }
    
    backtrack(n, []);
    return paths;
}

// 方法6：扩展到k阶
function climbStairsK(n, k) {
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= k && j <= i; j++) {
            dp[i] += dp[i-j];
        }
    }
    
    return dp[n];
}

// 方法7：带cost的爬楼梯
function minCostClimbingStairs(cost) {
    const n = cost.length;
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 0;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = Math.min(
            dp[i-1] + cost[i-1],
            dp[i-2] + cost[i-2]
        );
    }
    
    return dp[n];
}

// 测试
function test() {
    // 测试用例1：基本场景
    const n1 = 4;
    console.log("测试用例1 - 基本场景 (n=4)：");
    console.log("动态规划:", climbStairs(n1));
    console.log("空间优化:", climbStairsOptimized(n1));
    console.log("递归:", climbStairsRecursive(n1));
    console.log("数学方法:", climbStairsMath(n1));
    console.log("所有路径:", getAllPaths(n1));
    
    // 测试用例2：扩展到k阶
    const n2 = 4, k2 = 3;
    console.log("\n测试用例2 - k阶场景 (n=4, k=3)：");
    console.log("k阶方法数:", climbStairsK(n2, k2));
    
    // 测试用例3：带cost的爬楼梯
    const cost = [10, 15, 20];
    console.log("\n测试用例3 - 带cost的爬楼梯：");
    console.log("最小花费:", minCostClimbingStairs(cost));
    
    // 测试用例4：性能对比
    const n4 = 40;
    console.log("\n测试用例4 - 性能对比 (n=40)：");
    
    console.time("动态规划");
    const dp = climbStairs(n4);
    console.timeEnd("动态规划");
    
    console.time("空间优化");
    const opt = climbStairsOptimized(n4);
    console.timeEnd("空间优化");
    
    console.time("数学方法");
    const math = climbStairsMath(n4);
    console.timeEnd("数学方法");
    
    console.log("结果对比:", { dp, opt, math });
}

module.exports = {
    climbStairs,
    climbStairsOptimized,
    climbStairsRecursive,
    climbStairsMath,
    getAllPaths,
    climbStairsK,
    minCostClimbingStairs
};
