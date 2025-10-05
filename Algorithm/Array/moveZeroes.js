/**
 * 283. 移动零 (Move Zeroes)
 * 
 * 题目：给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，
 * 同时保持非零元素的相对顺序。
 * 
 * 示例：
 * 输入：[0,1,0,3,12]
 * 输出：[1,3,12,0,0]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */

// 方法1：双指针 - 简单易懂
function moveZeroes(nums) {
  let writeIndex = 0; // 写入位置
  
  // 第一遍：将所有非零元素移到前面
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }
  
  // 第二遍：将剩余位置填充为0
  for (let i = writeIndex; i < nums.length; i++) {
    nums[i] = 0;
  }
}

// 方法2：双指针优化 - 一次遍历
function moveZeroesOptimized(nums) {
  let left = 0; // 指向下一个非零元素应该放置的位置
  
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] !== 0) {
      // 如果右指针指向非零元素，与左指针交换
      if (left !== right) {
        const temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
      }
      left++;
    }
  }
}

// 方法3：快慢指针 - 更直观
function moveZeroesSlowFast(nums) {
  let slow = 0;
  
  // 快指针遍历数组
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      // 如果快指针遇到非零元素，放到慢指针位置
      nums[slow] = nums[fast];
      slow++;
    }
  }
  
  // 慢指针之后的位置都设为0
  while (slow < nums.length) {
    nums[slow] = 0;
    slow++;
  }
}

// 测试用例
console.log('=== 移动零测试 ===');

// 测试方法1
let nums1 = [0, 1, 0, 3, 12];
moveZeroes(nums1);
console.log('方法1结果:', nums1); // [1,3,12,0,0]

// 测试方法2
let nums2 = [0, 1, 0, 3, 12];
moveZeroesOptimized(nums2);
console.log('方法2结果:', nums2); // [1,3,12,0,0]

// 测试方法3
let nums3 = [0, 1, 0, 3, 12];
moveZeroesSlowFast(nums3);
console.log('方法3结果:', nums3); // [1,3,12,0,0]

// 边界测试
let nums4 = [0];
moveZeroes(nums4);
console.log('单个0:', nums4); // [0]

let nums5 = [1, 0, 1];
moveZeroes(nums5);
console.log('0在中间:', nums5); // [1,1,0]

module.exports = { moveZeroes, moveZeroesOptimized, moveZeroesSlowFast };
