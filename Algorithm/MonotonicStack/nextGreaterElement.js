/**
 * 下一个更大元素系列问题
 * 
 * 这类问题的核心思路：
 * 使用单调递减栈，当遇到更大元素时，栈中所有小于当前元素的都找到了下一个更大元素
 */

/**
 * 下一个更大元素 I (Next Greater Element I)
 * 
 * 题目描述：
 * nums1 中数字 x 的 下一个更大元素 是指 x 在 nums2 中对应位置 右侧 的 第一个 比 x 大的元素。
 * 给你两个 没有重复元素 的数组 nums1 和 nums2 ，下标从 0 开始计数，
 * 其中nums1 是 nums2 的子集。
 * 
 * 示例：
 * 输入：nums1 = [4,1,2], nums2 = [1,3,4,2]
 * 输出：[-1,3,-1]
 */
export function nextGreaterElement(nums1, nums2) {
    const stack = []; // 单调递减栈
    const map = new Map(); // 存储每个元素的下一个更大元素
    
    // 遍历nums2，找到每个元素的下一个更大元素
    for (let i = 0; i < nums2.length; i++) {
        while (stack.length > 0 && nums2[i] > stack[stack.length - 1]) {
            map.set(stack.pop(), nums2[i]);
        }
        stack.push(nums2[i]);
    }
    
    // 根据nums1查询结果
    return nums1.map(num => map.get(num) || -1);
}

/**
 * 下一个更大元素 II (Next Greater Element II)
 * 
 * 题目描述：
 * 给定一个循环数组（最后一个元素的下一个元素是数组的第一个元素），
 * 输出每个元素的下一个更大元素。
 * 
 * 示例：
 * 输入: nums = [1,2,1]
 * 输出: [2,-1,2]
 */
export function nextGreaterElements(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = []; // 存储索引
    
    // 遍历两遍数组来模拟循环数组
    // 为什么要遍历两遍？因为循环数组中，每个元素都可能在"下一轮"找到更大的元素
    for (let i = 0; i < 2 * n; i++) {
        const currentIndex = i % n; // 通过取模实现循环
        
        // 关键步骤：弹出所有小于当前元素的索引
        while (stack.length > 0 && nums[currentIndex] > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = nums[currentIndex]; // 找到了下一个更大元素！
        }

        // 关键理解：为什么只在第一遍时将索引入栈？
        // 1. 第一遍(i < n)：我们需要为每个位置寻找下一个更大元素，所以要入栈
        // 2. 第二遍(i >= n)：我们只是在"帮助"第一遍中还没找到答案的元素寻找答案
        //    不需要再为第二遍的元素寻找答案，因为它们就是第一遍元素的"重复"
        if (i < n) {
            stack.push(currentIndex);
        }
    }
    
    return result;
}

/**
 * 下一个更大元素 III (Next Greater Element III)
 * 
 * 题目描述：
 * 给你一个正整数 n ，请你找出符合条件的最小整数，其由重新排列 n 中存在的每位数字组成，
 * 并且其值大于 n 。如果不存在这样的正整数，则返回 -1 。
 * 
 * 示例：
 * 输入：n = 12
 * 输出：21
 */
export function nextGreaterElement3(n) {
    const digits = n.toString().split('');
    const len = digits.length;
    
    // 从右往左找到第一个递减的位置
    let i = len - 2;
    while (i >= 0 && digits[i] >= digits[i + 1]) {
        i--;
    }
    
    // 如果没找到，说明是递减序列，没有更大的排列
    if (i < 0) return -1;
    
    // 从右往左找到第一个大于digits[i]的数字
    let j = len - 1;
    while (digits[j] <= digits[i]) {
        j--;
    }
    
    // 交换digits[i]和digits[j]
    [digits[i], digits[j]] = [digits[j], digits[i]];
    
    // 将i+1到末尾的部分反转
    const left = digits.slice(0, i + 1);
    const right = digits.slice(i + 1).reverse();
    
    const result = parseInt(left.concat(right).join(''));
    
    // 检查是否超出32位整数范围
    return result > 2**31 - 1 ? -1 : result;
}

/**
 * 算法执行过程详解 - 以 nums = [1,2,1] 为例
 * 
 * 目标：找到每个元素的下一个更大元素
 * 期望输出：[2, -1, 2]
 * 
 * 执行过程：
 * 
 * 第一遍遍历 (i = 0 到 2)：
 * i=0, currentIndex=0, nums[0]=1:
 *   栈: [] → 1入栈 → 栈: [0]
 * 
 * i=1, currentIndex=1, nums[1]=2:
 *   栈: [0] → 2>1，弹出0，result[0]=2 → 栈: []
 *   2入栈 → 栈: [1]
 * 
 * i=2, currentIndex=2, nums[2]=1:
 *   栈: [1] → 1<2，不弹出 → 栈: [1]
 *   1入栈 → 栈: [1,2]
 * 
 * 第一遍结束：result = [2, -1, -1]，栈 = [1,2]
 * 
 * 第二遍遍历 (i = 3 到 5)：
 * i=3, currentIndex=0, nums[0]=1:
 *   栈: [1,2] → 1<2，不弹出 → 栈: [1,2]
 *   不入栈（i>=n）
 * 
 * i=4, currentIndex=1, nums[1]=2:
 *   栈: [1,2] → 2>1，弹出2，result[2]=2 → 栈: [1]
 *   → 2=2，不弹出 → 栈: [1]
 *   不入栈（i>=n）
 * 
 * i=5, currentIndex=2, nums[2]=1:
 *   栈: [1] → 1<2，不弹出 → 栈: [1]
 *   不入栈（i>=n）
 * 
 * 最终结果：[2, -1, 2] ✓
 * 
 * 关键理解：
 * 1. 栈中存储的是"还没找到下一个更大元素"的索引
 * 2. 第二遍不入栈是因为我们只需要为原数组的每个位置找答案
 * 3. 第二遍的作用是利用"循环"特性帮第一遍剩余的元素找到答案
 * 4. 栈不会为空是因为我们在第二遍中持续消费第一遍留下的"待处理"索引
 */

// 测试用例
console.log('=== 下一个更大元素 I ===');
const test1Cases = [
    { nums1: [4,1,2], nums2: [1,3,4,2] },
    { nums1: [2,4], nums2: [1,2,3,4] }
];

test1Cases.forEach((testCase, index) => {
    const result = nextGreaterElement(testCase.nums1, testCase.nums2);
    console.log(`测试用例 ${index + 1}:`);
    console.log(`nums1: [${testCase.nums1.join(',')}]`);
    console.log(`nums2: [${testCase.nums2.join(',')}]`);
    console.log(`输出: [${result.join(',')}]`);
    console.log('---');
});

console.log('=== 下一个更大元素 II ===');
const test2Cases = [
    [1,2,1],
    [1,2,3,4,3]
];

test2Cases.forEach((nums, index) => {
    const result = nextGreaterElements(nums);
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: [${nums.join(',')}]`);
    console.log(`输出: [${result.join(',')}]`);
    console.log('---');
});

console.log('=== 下一个更大元素 III ===');
const test3Cases = [12, 21, 12443322, 1234];

test3Cases.forEach((n, index) => {
    const result = nextGreaterElement3(n);
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: ${n}`);
    console.log(`输出: ${result}`);
    console.log('---');
});
