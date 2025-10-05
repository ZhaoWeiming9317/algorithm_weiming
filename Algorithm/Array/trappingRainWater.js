/**
 * 42. 接雨水 (Trapping Rain Water)
 * 
 * 题目：给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，
 * 计算按此排列的柱子，下雨之后能接多少雨水。
 * 
 * 示例：
 * 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
 * 输出：6
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */

// 方法1：动态规划 - 简单易懂
function trap(height) {
  if (height.length === 0) return 0;
  
  const n = height.length;
  
  // 1. 从左到右，记录每个位置左边的最大高度
  const leftMax = new Array(n);
  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  }
  
  // 2. 从右到左，记录每个位置右边的最大高度
  const rightMax = new Array(n);
  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  }
  
  // 3. 计算每个位置能接的雨水
  let water = 0;
  for (let i = 0; i < n; i++) {
    // 当前位置能接的雨水 = min(左边最大高度, 右边最大高度) - 当前高度
    water += Math.min(leftMax[i], rightMax[i]) - height[i];
  }
  
  return water;
}

// 方法2：双指针优化 - O(1) 空间复杂度
function trapOptimized(height) {
  if (height.length === 0) return 0;
  
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  
  while (left < right) {
    if (height[left] < height[right]) {
      // 处理左边
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      // 处理右边
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  
  return water;
}

// 测试用例
console.log('=== 接雨水测试 ===');
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trap([4, 2, 0, 3, 2, 5]));                   // 9
console.log(trap([3, 0, 2, 0, 4]));                      // 7

module.exports = { trap, trapOptimized };
