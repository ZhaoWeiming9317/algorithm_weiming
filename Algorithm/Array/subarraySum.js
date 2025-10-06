/**
 * 和为 K 的子数组
 * 题目：给定一个整数数组和一个整数 k，你需要找到该数组中和为 k 的连续子数组的个数
 * 
 * 解法1：暴力枚举 - O(n²)
 * 解法2：前缀和 + 哈希表 - O(n)
 * 解法3：滑动窗口（仅适用于正数数组）- O(n)
 */

// ==================== 解法1：暴力枚举 ====================

/**
 * 暴力枚举所有子数组
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 
 * @param {number[]} nums - 数组
 * @param {number} k - 目标和
 * @returns {number} 子数组个数
 */
function subarraySumBruteForce(nums, k) {
  let count = 0;
  const n = nums.length;
  
  // 枚举所有子数组
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = i; j < n; j++) {
      sum += nums[j];
      if (sum === k) {
        count++;
      }
    }
  }
  
  return count;
}

// ==================== 解法2：前缀和 + 哈希表 ====================

/**
 * 使用前缀和和哈希表优化
 * 核心思想：如果 sum[i] - sum[j] = k，那么从 j+1 到 i 的子数组和为 k
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 * 前缀和记录了从开头到每个位置的和
    两个前缀和的差就是中间子数组的和
    不需要多个循环：因为前缀和已经包含了所有信息

 * @param {number[]} nums - 数组
 * @param {number} k - 目标和
 * @returns {number} 子数组个数
 */
function subarraySum(nums, k) {
  let count = 0;
  let sum = 0;
  
  // 哈希表：存储前缀和及其出现次数
  const prefixSumCount = new Map();
  prefixSumCount.set(0, 1); // 前缀和为0出现1次（空子数组）
  
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i]; // 计算当前前缀和
    
    // 如果存在前缀和 sum - k，说明存在子数组和为 k
    if (prefixSumCount.has(sum - k)) {
      count += prefixSumCount.get(sum - k);
    }
    
    // 更新当前前缀和的出现次数
    prefixSumCount.set(sum, (prefixSumCount.get(sum) || 0) + 1);
  }
  
  return count;
}

// ==================== 解法3：滑动窗口（仅适用于正数数组）====================

/**
 * 滑动窗口解法（仅适用于正数数组）
 * 当数组包含负数时，滑动窗口无法保证单调性
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * 
 * @param {number[]} nums - 正数数组
 * @param {number} k - 目标和
 * @returns {number} 子数组个数
 */
function subarraySumSlidingWindow(nums, k) {
  let count = 0;
  let left = 0;
  let sum = 0;
  
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    
    // 当窗口和大于等于k时，尝试缩小窗口
    while (sum >= k) {
      if (sum === k) {
        count++;
      }
      sum -= nums[left];
      left++;
    }
  }
  
  return count;
}

// ==================== 测试用例 ====================

function testSubarraySum() {
  console.log('=== 和为 K 的子数组测试 ===');
  
  const testCases = [
    { nums: [1, 1, 1], k: 2, expected: 2 },
    { nums: [1, 2, 3], k: 3, expected: 2 },
    { nums: [1, -1, 0], k: 0, expected: 3 },
    { nums: [1, 2, 3, 4, 5], k: 9, expected: 2 },
    { nums: [-1, -1, 1], k: 0, expected: 1 }
  ];
  
  testCases.forEach((testCase, index) => {
    const { nums, k, expected } = testCase;
    
    console.log(`\n测试用例 ${index + 1}:`);
    console.log(`数组: [${nums.join(', ')}], k: ${k}`);
    
    // 测试暴力解法
    const result1 = subarraySumBruteForce([...nums], k);
    console.log(`暴力解法: ${result1}, 期望: ${expected}, 正确: ${result1 === expected}`);
    
    // 测试前缀和 + 哈希表解法
    const result2 = subarraySum([...nums], k);
    console.log(`前缀和+哈希表: ${result2}, 期望: ${expected}, 正确: ${result2 === expected}`);
    
    // 测试滑动窗口解法（仅适用于正数数组）
    if (nums.every(num => num > 0)) {
      const result3 = subarraySumSlidingWindow([...nums], k);
      console.log(`滑动窗口: ${result3}, 期望: ${expected}, 正确: ${result3 === expected}`);
    } else {
      console.log(`滑动窗口: 不适用（数组包含非正数）`);
    }
  });
}

// ==================== 性能测试 ====================

function performanceTest() {
  console.log('\n=== 性能测试 ===');
  
  const sizes = [1000, 10000, 100000];
  
  sizes.forEach(size => {
    const nums = Array.from({ length: size }, () => Math.floor(Math.random() * 20) - 10);
    const k = Math.floor(Math.random() * 10);
    
    console.log(`\n数组大小: ${size}, k: ${k}`);
    
    // 测试暴力解法
    const start1 = Date.now();
    subarraySumBruteForce([...nums], k);
    const time1 = Date.now() - start1;
    console.log(`暴力解法耗时: ${time1}ms`);
    
    // 测试前缀和 + 哈希表解法
    const start2 = Date.now();
    subarraySum([...nums], k);
    const time2 = Date.now() - start2;
    console.log(`前缀和+哈希表耗时: ${time2}ms`);
  });
}

// ==================== 复杂度分析 ====================

/*
时间复杂度分析：
1. 暴力枚举：O(n²)
   - 外层循环：O(n)
   - 内层循环：O(n)
   - 总时间复杂度：O(n²)

2. 前缀和 + 哈希表：O(n)
   - 遍历数组：O(n)
   - 哈希表操作：O(1)
   - 总时间复杂度：O(n)

3. 滑动窗口：O(n)
   - 每个元素最多被访问两次
   - 总时间复杂度：O(n)

空间复杂度分析：
1. 暴力枚举：O(1)
   - 只使用常数额外空间

2. 前缀和 + 哈希表：O(n)
   - 哈希表存储前缀和
   - 最坏情况需要存储n个前缀和

3. 滑动窗口：O(1)
   - 只使用常数额外空间

选择建议：
- 当数组包含负数时，使用前缀和 + 哈希表
- 当数组只包含正数时，可以使用滑动窗口
- 面试时推荐使用前缀和 + 哈希表解法
*/

// ==================== 面试要点 ====================

/*
🎯 面试要点：

1. 核心思想：
   - 前缀和：sum[i] 表示从0到i的元素和
   - 子数组和：sum[i] - sum[j] = k 表示从j+1到i的子数组和为k
   - 哈希表：快速查找前缀和

2. 关键步骤：
   - 初始化：prefixSumCount.set(0, 1)
   - 计算前缀和：sum += nums[i]
   - 查找目标：prefixSumCount.has(sum - k)
   - 更新计数：prefixSumCount.set(sum, count + 1)

3. 边界处理：
   - 空子数组：前缀和为0
   - 负数处理：滑动窗口不适用
   - 重复前缀和：需要累加计数

4. 优化技巧：
   - 使用哈希表替代数组
   - 一次遍历完成计算
   - 避免重复计算

💡 记忆要点：
- 前缀和 + 哈希表是通用解法
- 滑动窗口仅适用于正数数组
- 时间复杂度：O(n)，空间复杂度：O(n)
- 关键公式：sum[i] - sum[j] = k
*/

// 运行测试
testSubarraySum();
performanceTest();

// 导出函数
export {
  subarraySum,
  subarraySumBruteForce,
  subarraySumSlidingWindow
};
