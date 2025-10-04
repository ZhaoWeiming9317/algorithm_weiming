/**
 * 组合问题 (Combinations)
 * 
 * 题目描述：
 * 给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合。
 * 
 * 示例：
 * 输入: n = 4, k = 2
 * 输出: [[2,4],[3,4],[2,3],[1,2],[1,3],[1,4]]
 */

/**
 * 组合 - 基础版本
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
export function combine(n, k) {
    const result = [];
    const path = [];
    
    function backtrack(start) {
        // 终止条件：路径长度等于k
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        // 剪枝：如果剩余数字不够凑成k个数，直接返回
        // 需要的数字个数：k - path.length
        // 剩余数字个数：n - start + 1
        if (n - start + 1 < k - path.length) {
            return;
        }
        
        // 从start开始遍历，避免重复
        for (let i = start; i <= n; i++) {
            // 做选择
            path.push(i);
            
            // 递归，注意下一层从i+1开始
            backtrack(i + 1);
            
            // 撤销选择
            path.pop();
        }
    }
    
    backtrack(1);
    return result;
}

/**
 * 组合总和
 * 
 * 题目描述：
 * 给你一个无重复元素的整数数组 candidates 和一个目标整数 target，
 * 找出 candidates 中可以使数字和为目标数 target 的所有不同组合。
 * candidates 中的同一个数字可以无限制重复被选取。
 * 
 * 示例：
 * 输入: candidates = [2,3,6,7], target = 7
 * 输出: [[2,2,3],[7]]
 */

/**
 * 组合总和 - 可重复使用
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
export function combinationSum(candidates, target) {
    const result = [];
    const path = [];
    
    // 排序便于剪枝
    candidates.sort((a, b) => a - b);
    
    function backtrack(start, sum) {
        // 终止条件
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        // 剪枝：如果当前和已经超过目标值，直接返回
        if (sum > target) {
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // 剪枝：如果当前数字加上已有和超过目标值，后面的数字更大，直接跳出
            if (sum + candidates[i] > target) {
                break;
            }
            
            // 做选择
            path.push(candidates[i]);
            
            // 递归，注意可以重复使用当前数字，所以传入i而不是i+1
            backtrack(i, sum + candidates[i]);
            
            // 撤销选择
            path.pop();
        }
    }
    
    backtrack(0, 0);
    return result;
}

/**
 * 组合总和 II
 * 
 * 题目描述：
 * 给定一个候选人编号的集合 candidates 和一个目标数 target，
 * 找出 candidates 中所有可以使数字和为 target 的组合。
 * candidates 中的每个数字在每个组合中只能使用一次。
 * 
 * 示例：
 * 输入: candidates = [10,1,2,7,6,1,5], target = 8
 * 输出: [[1,1,6],[1,2,5],[1,7],[2,6]]
 */

/**
 * 组合总和 II - 去重版本
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
export function combinationSum2(candidates, target) {
    const result = [];
    const path = [];
    
    // 排序便于去重和剪枝
    candidates.sort((a, b) => a - b);
    
    function backtrack(start, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        
        if (sum > target) {
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // 去重：跳过同一层级的重复元素
            if (i > start && candidates[i] === candidates[i - 1]) {
                continue;
            }
            
            // 剪枝
            if (sum + candidates[i] > target) {
                break;
            }
            
            path.push(candidates[i]);
            
            // 递归，每个数字只能使用一次，所以传入i+1
            backtrack(i + 1, sum + candidates[i]);
            
            path.pop();
        }
    }
    
    backtrack(0, 0);
    return result;
}

/**
 * 组合总和 III
 * 
 * 题目描述：
 * 找出所有相加之和为 n 的 k 个数的组合，且满足下列条件：
 * - 只使用数字1到9
 * - 每个数字最多使用一次
 * 
 * 示例：
 * 输入: k = 3, n = 7
 * 输出: [[1,2,4]]
 */

/**
 * 组合总和 III
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
export function combinationSum3(k, n) {
    const result = [];
    const path = [];
    
    function backtrack(start, sum) {
        // 剪枝：如果路径长度已经等于k但和不等于n
        if (path.length === k) {
            if (sum === n) {
                result.push([...path]);
            }
            return;
        }
        
        // 剪枝：如果当前和已经超过目标值
        if (sum > n) {
            return;
        }
        
        // 剪枝：如果剩余数字不够凑成k个数
        if (9 - start + 1 < k - path.length) {
            return;
        }
        
        for (let i = start; i <= 9; i++) {
            // 剪枝：如果加上当前数字超过目标值
            if (sum + i > n) {
                break;
            }
            
            path.push(i);
            backtrack(i + 1, sum + i);
            path.pop();
        }
    }
    
    backtrack(1, 0);
    return result;
}

/**
 * 电话号码的字母组合
 * 
 * 题目描述：
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
 * 答案可以按任意顺序返回。
 * 
 * 示例：
 * 输入：digits = "23"
 * 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
 */

/**
 * 电话号码的字母组合
 * @param {string} digits
 * @return {string[]}
 */
export function letterCombinations(digits) {
    if (!digits) return [];
    
    const phoneMap = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };
    
    const result = [];
    const path = [];
    
    function backtrack(index) {
        // 终止条件：处理完所有数字
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }
        
        // 获取当前数字对应的字母
        const letters = phoneMap[digits[index]];
        
        for (let letter of letters) {
            path.push(letter);
            backtrack(index + 1);
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
}

// 测试用例
console.log('=== 组合测试 ===');
console.log('输入: n=4, k=2');
console.log('输出:', combine(4, 2));

console.log('\n=== 组合总和测试 ===');
console.log('输入: candidates=[2,3,6,7], target=7');
console.log('输出:', combinationSum([2, 3, 6, 7], 7));

console.log('\n=== 组合总和 II 测试 ===');
console.log('输入: candidates=[10,1,2,7,6,1,5], target=8');
console.log('输出:', combinationSum2([10, 1, 2, 7, 6, 1, 5], 8));

console.log('\n=== 组合总和 III 测试 ===');
console.log('输入: k=3, n=7');
console.log('输出:', combinationSum3(3, 7));

console.log('\n=== 电话号码字母组合测试 ===');
console.log('输入: digits="23"');
console.log('输出:', letterCombinations("23"));
