/**
 * 子集问题 (Subsets)
 * 
 * 题目描述：
 * 给你一个整数数组 nums ，数组中的元素互不相同。
 * 返回该数组所有可能的子集（幂集）。
 * 解集不能包含重复的子集。你可以按任意顺序返回解集。
 * 
 * 示例：
 * 输入: nums = [1,2,3]
 * 输出: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 */

/**
 * 子集 - 基础版本
 * @param {number[]} nums
 * @return {number[][]}
 */
export function subsets(nums) {
    const result = [];
    const path = [];
    
    function backtrack(start) {
        // 每个节点都是一个有效的子集
        result.push([...path]);
        
        // 从start开始遍历，避免重复
        for (let i = start; i < nums.length; i++) {
            // 做选择
            path.push(nums[i]);
            
            // 递归
            backtrack(i + 1);
            
            // 撤销选择
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * 子集 II - 包含重复数字
 * 
 * 题目描述：
 * 给你一个整数数组 nums ，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。
 * 解集不能包含重复的子集。返回的解集中，子集可以按任意顺序排列。
 * 
 * 示例：
 * 输入: nums = [1,2,2]
 * 输出: [[],[1],[1,2],[1,2,2],[2],[2,2]]
 */

/**
 * 子集 II - 去重版本
 * @param {number[]} nums
 * @return {number[][]}
 */
export function subsetsWithDup(nums) {
    const result = [];
    const path = [];
    
    // 先排序，便于去重
    nums.sort((a, b) => a - b);
    
    function backtrack(start) {
        // 每个节点都是一个有效的子集
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            // 去重：跳过同一层级的重复元素
            if (i > start && nums[i] === nums[i - 1]) {
                continue;
            }
            
            path.push(nums[i]);
            backtrack(i + 1);
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * 子集 - 迭代解法
 * 
 * 思路：
 * 对于每个元素，我们可以选择包含它或不包含它。
 * 从空集开始，每次添加一个新元素时，将现有的所有子集复制一份并加上新元素。
 */

/**
 * 子集 - 迭代版本
 * @param {number[]} nums
 * @return {number[][]}
 */
export function subsetsIterative(nums) {
    const result = [[]]; // 从空集开始
    
    for (let num of nums) {
        const newSubsets = [];
        // 对于每个现有子集，创建一个包含当前元素的新子集
        for (let subset of result) {
            newSubsets.push([...subset, num]);
        }
        // 将新子集添加到结果中
        result.push(...newSubsets);
    }
    
    return result;
}

/**
 * 子集 - 位运算解法
 * 
 * 思路：
 * n个元素的子集总共有2^n个。
 * 我们可以用0到2^n-1的每个数字的二进制表示来表示一个子集。
 * 二进制位为1表示包含对应位置的元素，为0表示不包含。
 */

/**
 * 子集 - 位运算版本
 * @param {number[]} nums
 * @return {number[][]}
 */
export function subsetsBitMask(nums) {
    const result = [];
    const n = nums.length;
    
    // 遍历从0到2^n-1的所有数字
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        
        // 检查每一位
        for (let i = 0; i < n; i++) {
            // 如果第i位为1，则包含nums[i]
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }
        
        result.push(subset);
    }
    
    return result;
}

/**
 * 递增子序列
 * 
 * 题目描述：
 * 给你一个整数数组 nums ，找出并返回所有该数组中不同的递增子序列，
 * 递增子序列中至少要有两个元素。你可以按任意顺序返回答案。
 * 
 * 示例：
 * 输入: nums = [4,6,7,7]
 * 输出: [[4,6],[4,6,7],[4,6,7,7],[4,7],[4,7,7],[6,7],[6,7,7],[7,7]]
 */

/**
 * 递增子序列
 * @param {number[]} nums
 * @return {number[][]}
 */
export function findSubsequences(nums) {
    const result = [];
    const path = [];
    
    function backtrack(start) {
        // 如果路径长度>=2，加入结果
        if (path.length >= 2) {
            result.push([...path]);
        }
        
        // 用Set记录当前层使用过的数字，避免重复
        const used = new Set();
        
        for (let i = start; i < nums.length; i++) {
            // 跳过当前层已使用的数字
            if (used.has(nums[i])) {
                continue;
            }
            
            // 保证递增：如果路径不为空且当前数字小于路径最后一个数字，跳过
            if (path.length > 0 && nums[i] < path[path.length - 1]) {
                continue;
            }
            
            used.add(nums[i]);
            path.push(nums[i]);
            backtrack(i + 1);
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * 最大长度连续子序列
 * 
 * 题目描述：
 * 给定一个字符串数组 arr，字符串 s 是将 arr 某一子序列字符串连接所得的字符串，
 * 如果 s 中的每一个字符都只出现过一次，那么它就是一个可行解。
 * 请返回所有可行解 s 中最长长度。
 */

/**
 * 最大长度连续子序列
 * @param {string[]} arr
 * @return {number}
 */
export function maxLength(arr) {
    let maxLen = 0;
    
    // 检查字符串是否有重复字符
    function hasUniqueChars(str) {
        const set = new Set();
        for (let char of str) {
            if (set.has(char)) return false;
            set.add(char);
        }
        return true;
    }
    
    // 检查两个字符串是否有公共字符
    function hasCommonChars(str1, str2) {
        const set = new Set(str1);
        for (let char of str2) {
            if (set.has(char)) return true;
        }
        return false;
    }
    
    function backtrack(start, current) {
        maxLen = Math.max(maxLen, current.length);
        
        for (let i = start; i < arr.length; i++) {
            const str = arr[i];
            
            // 跳过有重复字符的字符串
            if (!hasUniqueChars(str)) continue;
            
            // 跳过与当前字符串有公共字符的字符串
            if (hasCommonChars(current, str)) continue;
            
            backtrack(i + 1, current + str);
        }
    }
    
    backtrack(0, '');
    return maxLen;
}

// 测试用例
console.log('=== 子集测试 ===');
console.log('输入: [1,2,3]');
console.log('回溯法:', subsets([1, 2, 3]));
console.log('迭代法:', subsetsIterative([1, 2, 3]));
console.log('位运算法:', subsetsBitMask([1, 2, 3]));

console.log('\n=== 子集 II 测试 ===');
console.log('输入: [1,2,2]');
console.log('输出:', subsetsWithDup([1, 2, 2]));

console.log('\n=== 递增子序列测试 ===');
console.log('输入: [4,6,7,7]');
console.log('输出:', findSubsequences([4, 6, 7, 7]));

console.log('\n=== 最大长度连续子序列测试 ===');
console.log('输入: ["un","iq","ue"]');
console.log('输出:', maxLength(["un", "iq", "ue"]));
