/**
 * 53. 最大子数组和 (Maximum Subarray)
 * 
 * 题目：给你一个整数数组 nums，请你找出一个具有最大和的连续子数组
 * （子数组最少包含一个元素），返回其最大和。
 * 
 * 示例：
 * 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
 * 输出：6
 * 解释：连续子数组 [4,-1,2,1] 的和最大，为 6。
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */

// 动态规划 - Kadane 算法
function maxSubArray(nums) {
  if (nums.length === 0) return 0;
  
  let maxSum = nums[0]; // 全局最大值
  let currentSum = nums[0]; // 当前子数组和
  
  for (let i = 1; i < nums.length; i++) {
    // 核心思想：要么加入当前元素，要么重新开始
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

// 返回最大子数组的版本
function maxSubArrayWithIndex(nums) {
  if (nums.length === 0) return { sum: 0, start: 0, end: 0 };
  
  let maxSum = nums[0];
  let currentSum = nums[0];
  let start = 0, end = 0;
  let tempStart = 0;
  
  for (let i = 1; i < nums.length; i++) {
    if (currentSum < 0) {
      // 重新开始
      currentSum = nums[i];
      tempStart = i;
    } else {
      // 加入当前元素
      currentSum += nums[i];
    }
    
    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }
  
  return { sum: maxSum, start, end };
}

// 测试用例
console.log('=== 最大子数组和测试 ===');
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArray([1]));                               // 1
console.log(maxSubArray([5, 4, -1, 7, 8]));                 // 23

// 测试带索引的版本
const result = maxSubArrayWithIndex([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
console.log('最大子数组:', result); // { sum: 6, start: 3, end: 6 }

module.exports = { maxSubArray, maxSubArrayWithIndex };
