/**
 * 1. 两数之和 (Two Sum)
 * 
 * 题目：给定一个整数数组 nums 和一个整数目标值 target，
 * 请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。
 * 
 * 示例：
 * 输入：nums = [2,7,11,15], target = 9
 * 输出：[0,1]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */

// 方法1：暴力解法 - O(n²)
function twoSumBruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// 方法2：哈希表优化 - O(n) - 推荐
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    // 如果补数在哈希表中，说明找到了
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    // 将当前数字和索引存入哈希表
    map.set(nums[i], i);
  }
  
  return [];
}

// 测试用例
console.log('=== 两数之和测试 ===');
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]
console.log(twoSum([3, 3], 6));         // [0, 1]

module.exports = { twoSum, twoSumBruteForce };
