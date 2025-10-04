/**
 * 最大子数组和 (Maximum Subarray Sum)
 * 
 * 题目描述：
 * 给你一个整数数组 nums，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
 * 
 * 示例1：
 * 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
 * 输出：6
 * 解释：连续子数组 [4,-1,2,1] 的和最大，为 6。
 * 
 * 示例2：
 * 输入：nums = [1]
 * 输出：1
 * 
 * 解题思路：
 * 1. 动态规划（空间优化版本）
 *    - 状态定义：maxEndingHere 表示以当前元素结尾的最大子数组和
 *    - 状态转移：maxEndingHere = max(nums[i], maxEndingHere + nums[i])
 *    - 全局最优：maxSoFar 表示全局最大子数组和
 *    - 时间复杂度：O(n)，空间复杂度：O(1)
 * 
 * 2. 分治法
 *    - 将数组分为左半部分、右半部分、跨越中点的部分
 *    - 递归求解左半部分和右半部分的最大子数组和
 *    - 计算跨越中点的最大子数组和
 *    - 时间复杂度：O(nlogn)，空间复杂度：O(logn)
 */

// 方法1：动态规划（空间优化）
function maxSubArray(nums) {
    if (nums.length === 0) return -Infinity;
    
    let maxEndingHere = nums[0];  // 以当前元素结尾的最大子数组和
    let maxSoFar = nums[0];      // 全局最大子数组和
    
    for (let i = 1; i < nums.length; i++) {
        // 状态转移：要么把当前元素加入之前的子数组，要么重新开始一个新的子数组
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        // 更新全局最大值
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// 方法2：二维dp（便于理解）
function maxSubArrayDP(nums) {
    const n = nums.length;
    if (n === 0) return -Infinity;
    
    // dp[i] 表示以nums[i]结尾的最大子数组和
    const dp = new Array(n);
    dp[0] = nums[0];
    let maxSum = dp[0];
    
    for (let i = 1; i < n; i++) {
        // 状态转移：要么接上前面的子数组，要么重新开始
        dp[i] = Math.max(nums[i], dp[i-1] + nums[i]);
        maxSum = Math.max(maxSum, dp[i]);
    }
    
    return maxSum;
}

// 方法3：分治法
function maxSubArrayDivideConquer(nums) {
    function divideConquer(left, right) {
        if (left === right) return nums[left];
        
        const mid = Math.floor((left + right) / 2);
        
        // 递归计算左半部分和右半部分的最大子数组和
        const leftMax = divideConquer(left, mid);
        const rightMax = divideConquer(mid + 1, right);
        
        // 计算跨越中点的最大子数组和
        let leftSum = -Infinity;
        let sum = 0;
        for (let i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = Math.max(leftSum, sum);
        }
        
        let rightSum = -Infinity;
        sum = 0;
        for (let i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = Math.max(rightSum, sum);
        }
        
        const crossMax = leftSum + rightSum;
        
        return Math.max(leftMax, rightMax, crossMax);
    }
    
    return divideConquer(0, nums.length - 1);
}

// 方法4：返回具体的子数组（不只是最大和）
function getMaxSubArray(nums) {
    if (nums.length === 0) return { sum: -Infinity, start: -1, stop: -1 };
    
    let maxEndingHere = nums[0];
    let maxSoFar = nums[0];
    let start = 0, end = 0, tempStart = 0;
    
    for (let i = 1; i < nums.length; i++) {
        if (maxEndingHere < 0) {
            // 如果之前的总和为负数，重新开始
            maxEndingHere = nums[i];
            tempStart = i;
        } else {
            // 继续累加
            maxEndingHere += nums[i];
        }
        
        if (maxEndingHere > maxSoFar) {
            maxSoFar = maxEndingHere;
            start = tempStart;
            end = i;
        }
    }
    
    return {
        sum: maxSoFar,
        start,
        stop: end,
        array: nums.slice(start, end + 1)
    };
}

// 方法5：处理环形数组的最大子数组和
function maxSubArrayCircular(nums) {
    const n = nums.length;
    
    // 情况1：最大子数组不跨越边界（普通的最大子数组问题）
    const linearMax = maxSubArray(nums);
    
    // 情况2：最大子数组跨越边界
    // 这等价于：总和 - 最小子数组和
    let totalSum = 0;
    let minEndingHere = nums[0];
    let minSoFar = nums[0];
    
    for (let i = 0; i < n; i++) {
        totalSum += nums[i];
        
        if (i > 0) {
            minEndingHere = Math.min(nums[i], minEndingHere + nums[i]);
            minSoFar = Math.min(minSoFar, minEndingHere);
        }
    }
    
    const circularMax = totalSum - minSoFar;
    
    // 特殊情况：如果所有元素都是负数，需要避免空子数组
    if (circularMax === 0 && linearMax < 0) {
        return linearMax;
    }
    
    return Math.max(linearMax, circularMax);
}

// 测试
function test() {
    // 测试用例1：基本场景
    const nums1 = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    console.log("测试用例1 - 基本场景：");
    console.log("动态规划:", maxSubArray(nums1));
    console.log("二维DP:", maxSubArrayDP(nums1));
    console.log("分治法:", maxSubArrayDivideConquer(nums1));
    console.log("具体子数组:", getMaxSubArray(nums1));
    
    // 测试用例2：全负数
    const nums2 = [-5, -2, -8, -1];
    console.log("\n测试用例2 - 全负数：");
    console.log("动态规划:", maxSubArray(nums2));
    console.log("具体子数组:", getMaxSubArray(nums2));
    
    // 测试用例3：全正数
    const nums3 = [1, 2, 3, 4, 5];
    console.log("\n测试用例3 - 全正数：");
    console.log("动态规划:", maxSubArray(nums3));
    console.log("具体子数组:", getMaxSubArray(nums3));
    
    // 测试用例4：环形数组
    const nums4 = [5, -3, 5];
    console.log("\n测试用例4 - 环形数组：");
    console.log("环形最大子数组:", maxSubArrayCircular(nums4));
}

module.exports = {
    maxSubArray,
    maxSubArrayDP,
    maxSubArrayDivideConquer,
    getMaxSubArray,
    maxSubArrayCircular
};
