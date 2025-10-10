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
 * 解释：无论如何，总会到达下标为3的位置。但该下标的最大跳跃长度是0，所以永远不可能到达最后一个位置。
 * 
 * 解题思路：
 * 1. 贪心策略
 *    - 维护一个变量maxReach，表示能够到达的最远位置
 *    - 遍历数组，不断更新maxReach
 *    - 如果当前位置i大于maxReach，说明无法到达当前位置
 * 
 * 2. 为什么是贪心？
 *    - 每一步都尽可能往远处跳
 *    - 只关心能跳到的最远距离，不关心具体怎么跳
 */

// 方法1：判断是否能到达最后一个位置
function canJump(nums) {
    let maxReach = 0;

    for (let i = 0; i <= maxReach && maxReach < nums.length - 1; i++) {
        maxReach = Math.max(maxReach, i + nums[i]);
    }

    return maxReach >= nums.length - 1;
}

// 方法2：返回到达最后一个位置的最小跳跃次数
function minJumps(nums) {
    if (nums.length <= 1) return 0;

    let jumps = 0;
    let currentMax = 0;  // 当前能达到的最远位置
    let nextMax = 0;     // 下一步能达到的最远位置

    for (let i = 0; i < nums.length - 1; i++) {
        nextMax = Math.max(nextMax, i + nums[i]);

        if (i === currentMax) {
            jumps++;
            currentMax = nextMax;

            if (currentMax >= nums.length - 1) {
                break;
            }
        }
    }

    return jumps;
}

// 方法3：返回所有可能的跳跃路径
function getAllJumpPaths(nums) {
    const paths = [];

    function backtrack(pos, path) {
        if (pos >= nums.length - 1) {
            if (pos === nums.length - 1) {
                paths.push([...path]);
            }
            return;
        }

        for (let step = 1; step <= nums[pos]; step++) {
            path.push(pos + step);
            backtrack(pos + step, path);
            path.pop();
        }
    }

    backtrack(0, [0]);
    return paths;
}

// 方法4：返回最优跳跃路径（跳跃次数最少的路径）
function getOptimalJumpPath(nums) {
    if (nums.length <= 1) return [0];

    const n = nums.length;
    const dp = Array(n).fill(Infinity);  // dp[i]表示到达位置i的最小跳跃次数
    const prev = Array(n).fill(-1);      // prev[i]表示到达位置i的前一个位置
    
    dp[0] = 0;
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j <= i + nums[i] && j < n; j++) {
            if (dp[j] > dp[i] + 1) {
                dp[j] = dp[i] + 1;
                prev[j] = i;
            }
        }
    }
    
    // 构建最优路径
    const path = [];
    let pos = n - 1;
    while (pos !== -1) {
        path.unshift(pos);
        pos = prev[pos];
    }
    
    return path;
}

// 测试
function test() {
    // 测试用例1：基本场景
    const nums1 = [2,3,1,1,4];
    console.log("测试用例1 - 基本场景：");
    console.log("能否到达终点:", canJump(nums1));
    console.log("最小跳跃次数:", minJumps(nums1));
    console.log("所有可能路径:", getAllJumpPaths(nums1));
    console.log("最优跳跃路径:", getOptimalJumpPath(nums1));
    
    // 测试用例2：无法到达终点
    const nums2 = [3,2,1,0,4];
    console.log("\n测试用例2 - 无法到达终点：");
    console.log("能否到达终点:", canJump(nums2));
    
    // 测试用例3：刚好到达
    const nums3 = [1,1,1,1];
    console.log("\n测试用例3 - 刚好到达：");
    console.log("能否到达终点:", canJump(nums3));
    console.log("最小跳跃次数:", minJumps(nums3));
    console.log("所有可能路径:", getAllJumpPaths(nums3));
    console.log("最优跳跃路径:", getOptimalJumpPath(nums3));
}

module.exports = {
    canJump,
    minJumps,
    getAllJumpPaths,
    getOptimalJumpPath
};
