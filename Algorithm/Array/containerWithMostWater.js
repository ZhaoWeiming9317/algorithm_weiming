/**
 * 11. 盛最多水的容器 (Container With Most Water)
 * 
 * 题目：给定一个长度为 n 的整数数组 height，有 n 条垂线，
 * 第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。
 * 找出其中的两条线，使得它们与 x 轴构成的容器可以容纳最多的水。
 * 
 * 示例：
 * 输入：height = [1,8,6,2,5,4,8,3,7]
 * 输出：49
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */

// 方法1：暴力解法 - O(n²)
function maxAreaBruteForce(height) {
  let maxWater = 0;
  
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const width = j - i;
      const h = Math.min(height[i], height[j]);
      const area = width * h;
      maxWater = Math.max(maxWater, area);
    }
  }
  
  return maxWater;
}

// 方法2：双指针 - O(n) - 推荐
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  
  while (left < right) {
    // 计算当前面积
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    const area = width * h;
    maxWater = Math.max(maxWater, area);
    
    // 移动较短的指针（贪心策略）
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  
  return maxWater;
}

// 测试用例
console.log('=== 盛最多水的容器测试 ===');
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                       // 1
console.log(maxArea([4, 3, 2, 1, 4]));             // 16

module.exports = { maxArea, maxAreaBruteForce };
