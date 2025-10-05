/**
 * 15. 三数之和 (3Sum)
 * 
 * 题目：给你一个包含 n 个整数的数组 nums，
 * 判断 nums 中是否存在三个元素 a，b，c，使得 a + b + c = 0？
 * 请你找出所有和为 0 且不重复的三元组。
 * 
 * 示例：
 * 输入：nums = [-1,0,1,2,-1,-4]
 * 输出：[[-1,-1,2],[-1,0,1]]
 * 
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 */

// 排序 + 双指针
function threeSum(nums) {
  const result = [];
  
  // 1. 先排序
  nums.sort((a, b) => a - b);
  
  // 2. 固定第一个数，用双指针找另外两个数
  for (let i = 0; i < nums.length - 2; i++) {
    // 跳过重复的第一个数
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }
    
    let left = i + 1;
    let right = nums.length - 1;
    const target = -nums[i]; // 要找的两数之和
    
    while (left < right) {
      const sum = nums[left] + nums[right];
      
      if (sum === target) {
        // 找到三数之和为0
        result.push([nums[i], nums[left], nums[right]]);
        
        // 跳过重复的数字
        while (left < right && nums[left] === nums[left + 1]) {
          left++;
        }
        while (left < right && nums[right] === nums[right - 1]) {
          right--;
        }
        
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
  
  return result;
}

// 测试用例
console.log('=== 三数之和测试 ===');
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
console.log(threeSum([0, 1, 1]));             // []
console.log(threeSum([0, 0, 0]));             // [[0,0,0]]

module.exports = { threeSum };
