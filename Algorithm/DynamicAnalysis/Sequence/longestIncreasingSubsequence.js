/**
 * 最长递增子序列 (Longest Increasing Subsequence)
 * 
 * 题目描述：
 * 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。
 * 子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。
 * 
 * 示例：
 * 输入：nums = [10,9,2,5,3,7,101,18]
 * 输出：4
 * 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4。
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度
 *    - 状态转移：dp[i] = max(dp[j] + 1) for all j < i and nums[j] < nums[i]
 *    - 初始状态：dp[i] = 1，因为每个数字本身就是长度为1的子序列
 *    - 时间复杂度：O(n^2)
 * 
 * 2. 二分查找优化
 *    - 维护一个 tails 数组，tails[i] 表示长度为 i+1 的所有上升子序列的结尾的最小值
 *    - 对于每个 nums[i]，二分查找 tails 中第一个大于它的数，更新那个位置
 *    - 时间复杂度：O(nlogn)
 */

// 方法1：动态规划
function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;
    
    const n = nums.length;
    // dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度
    const dp = new Array(n).fill(1);
    let maxLen = 1;
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    return maxLen;
}

// 方法2：二分查找优化
function lengthOfLISOptimized(nums) {
    if (nums.length === 0) return 0;
    
    // tails[i] 表示长度为i+1的所有上升子序列中，结尾最小的数
    const tails = [nums[0]];
    
    for (let i = 1; i < nums.length; i++) {
        // 如果当前数大于所有tails中的数，直接添加
        if (nums[i] > tails[tails.length - 1]) {
            tails.push(nums[i]);
            continue;
        }
        
        // 二分查找第一个大于nums[i]的位置
        let left = 0;
        let right = tails.length - 1;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < nums[i]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // 更新tails数组
        tails[left] = nums[i];
    }
    
    return tails.length;
}

// 测试
function test() {
    const testCases = [
        [10,9,2,5,3,7,101,18],
        [0,1,0,3,2,3],
        [7,7,7,7,7,7,7],
        [1,3,6,7,9,4,10,5,6]
    ];
    
    console.log("动态规划解法：");
    testCases.forEach(nums => {
        console.log(`输入: ${nums}`);
        console.log(`输出: ${lengthOfLIS(nums)}\n`);
    });
    
    console.log("二分查找优化解法：");
    testCases.forEach(nums => {
        console.log(`输入: ${nums}`);
        console.log(`输出: ${lengthOfLISOptimized(nums)}\n`);
    });
}

module.exports = {
    lengthOfLIS,
    lengthOfLISOptimized
};
