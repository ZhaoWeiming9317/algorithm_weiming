/**
 * 全排列问题 (Permutations)
 * 
 * 题目描述：
 * 给定一个不含重复数字的数组 nums ，返回其所有可能的全排列。
 * 
 * 示例：
 * 输入: nums = [1,2,3]
 * 输出: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 */

/**
 * 全排列 - 基础版本
 * @param {number[]} nums
 * @return {number[][]}
 */
export function permute(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        // 终止条件：路径长度等于数组长度
        if (path.length === nums.length) {
            result.push([...path]); // 注意要拷贝
            return;
        }
        
        // 遍历选择列表
        for (let i = 0; i < nums.length; i++) {
            // 跳过已使用的元素
            if (used[i]) continue;
            
            // 做选择
            path.push(nums[i]);
            used[i] = true;
            
            // 递归
            backtrack();
            
            // 撤销选择
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

/**
 * 全排列 II - 包含重复数字
 * 
 * 题目描述：
 * 给定一个可包含重复数字的序列 nums，按任意顺序返回所有不重复的全排列。
 * 
 * 示例：
 * 输入: nums = [1,1,2]
 * 输出: [[1,1,2],[1,2,1],[2,1,1]]
 */

/**
 * 全排列 II - 去重版本
 * @param {number[]} nums
 * @return {number[][]}
 */
export function permuteUnique(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);
    
    // 先排序，便于去重
    nums.sort((a, b) => a - b);
    
    function backtrack() {
        // 终止条件
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            // 跳过已使用的元素
            if (used[i]) continue;
            
            // 去重逻辑：如果当前元素与前一个元素相同，且前一个元素未被使用，则跳过
            // 这样可以保证相同元素的使用顺序，避免重复
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                continue;
            }
            
            // 做选择
            path.push(nums[i]);
            used[i] = true;
            
            // 递归
            backtrack();
            
            // 撤销选择
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

/**
 * 字符串的排列
 * 
 * 题目描述：
 * 输入一个字符串，打印出该字符串中字符的所有排列。
 * 
 * 示例：
 * 输入: s = "abc"
 * 输出: ["abc","acb","bac","bca","cab","cba"]
 */

/**
 * 字符串排列
 * @param {string} s
 * @return {string[]}
 */
export function permutation(s) {
    const chars = s.split('').sort(); // 转换为字符数组并排序
    const result = [];
    const path = [];
    const used = new Array(chars.length).fill(false);
    
    function backtrack() {
        if (path.length === chars.length) {
            result.push(path.join(''));
            return;
        }
        
        for (let i = 0; i < chars.length; i++) {
            if (used[i]) continue;
            
            // 去重：相同字符只能按顺序使用
            if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) {
                continue;
            }
            
            path.push(chars[i]);
            used[i] = true;
            
            backtrack();
            
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

/**
 * 下一个排列
 * 
 * 题目描述：
 * 实现获取下一个排列的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列。
 * 如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。
 */

/**
 * 下一个排列
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
export function nextPermutation(nums) {
    let i = nums.length - 2;
    
    // 1. 从右向左找到第一个升序对 (i, i+1)
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    
    if (i >= 0) {
        // 2. 从右向左找到第一个大于 nums[i] 的数
        let j = nums.length - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        
        // 3. 交换 nums[i] 和 nums[j]
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    
    // 4. 反转 i+1 到末尾的部分
    reverse(nums, i + 1);
}

function reverse(nums, start) {
    let end = nums.length - 1;
    while (start < end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start++;
        end--;
    }
}

// 测试用例
console.log('=== 全排列测试 ===');
console.log('输入: [1,2,3]');
console.log('输出:', permute([1, 2, 3]));

console.log('\n=== 全排列 II 测试 ===');
console.log('输入: [1,1,2]');
console.log('输出:', permuteUnique([1, 1, 2]));

console.log('\n=== 字符串排列测试 ===');
console.log('输入: "abc"');
console.log('输出:', permutation("abc"));

console.log('\n=== 下一个排列测试 ===');
const testArray = [1, 2, 3];
console.log('输入:', [...testArray]);
nextPermutation(testArray);
console.log('下一个排列:', testArray);
