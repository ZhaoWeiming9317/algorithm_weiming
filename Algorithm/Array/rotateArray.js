/**
 * 189. 轮转数组 (Rotate Array)
 * 
 * 题目：给你一个数组，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。
 * 
 * 示例：
 * 输入：nums = [1,2,3,4,5,6,7], k = 3
 * 输出：[5,6,7,1,2,3,4]
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */

// 方法1：使用额外数组 - 简单易懂
function rotateWithExtraSpace(nums, k) {
  const n = nums.length;
  k = k % n; // 处理 k > n 的情况
  
  const result = new Array(n);
  
  for (let i = 0; i < n; i++) {
    result[(i + k) % n] = nums[i];
  }
  
  // 将结果复制回原数组
  for (let i = 0; i < n; i++) {
    nums[i] = result[i];
  }
}

// 方法2：三次反转 - 空间复杂度 O(1)
function rotate(nums, k) {
  const n = nums.length;
  k = k % n;
  
  // 反转整个数组
  reverse(nums, 0, n - 1);
  // 反转前 k 个元素
  reverse(nums, 0, k - 1);
  // 反转后 n-k 个元素
  reverse(nums, k, n - 1);
}

// 辅助函数：反转数组的指定区间
function reverse(nums, start, end) {
  while (start < end) {
    const temp = nums[start];
    nums[start] = nums[end];
    nums[end] = temp;
    start++;
    end--;
  }
}

// 方法3：环状替换 - 理解较难但效率高
function rotateCyclic(nums, k) {
  const n = nums.length;
  k = k % n;
  let count = 0;
  
  for (let start = 0; count < n; start++) {
    let current = start;
    let prev = nums[start];
    
    do {
      const next = (current + k) % n;
      const temp = nums[next];
      nums[next] = prev;
      prev = temp;
      current = next;
      count++;
    } while (start !== current);
  }
}

// 测试用例
console.log('=== 轮转数组测试 ===');

// 测试方法1
let nums1 = [1, 2, 3, 4, 5, 6, 7];
rotateWithExtraSpace(nums1, 3);
console.log('方法1结果:', nums1); // [5,6,7,1,2,3,4]

// 测试方法2
let nums2 = [1, 2, 3, 4, 5, 6, 7];
rotate(nums2, 3);
console.log('方法2结果:', nums2); // [5,6,7,1,2,3,4]

// 测试方法3
let nums3 = [1, 2, 3, 4, 5, 6, 7];
rotateCyclic(nums3, 3);
console.log('方法3结果:', nums3); // [5,6,7,1,2,3,4]

module.exports = { rotate, rotateWithExtraSpace, rotateCyclic };
