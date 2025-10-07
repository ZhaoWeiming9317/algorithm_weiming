/**
 * LeetCode 22. 生成括号 (Generate Parentheses)
 * 
 * 题目描述：
 * 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且有效的括号组合。
 * 
 * 示例：
 * 输入：n = 3
 * 输出：["((()))","(()())","(())()","()(())","()()()"]
 * 
 * 输入：n = 1
 * 输出：["()"]
 * 
 * 输入：n = 2
 * 输出：["(())","()()"]
 */

// ==================== 方法一：回溯法（最优解） ====================

/**
 * 核心思路：
 * 1. 左括号可以随时添加，只要数量不超过 n
 * 2. 右括号只能在左括号数量 > 右括号数量时添加
 * 3. 当左右括号都用完时（各用了 n 个），得到一个合法组合
 * 
 * 时间复杂度：O(4^n / √n) - 卡特兰数
 * 空间复杂度：O(n) - 递归栈深度
 */
function generateParenthesis(n) {
    const result = [];
    
    function backtrack(path, left, right) {
        // 终止条件：左右括号都用完了
        if (left === n && right === n) {
            result.push(path);
            return;
        }
        
        // 剪枝：如果右括号数量大于左括号，说明不合法，直接返回
        if (right > left) return;
        
        // 选择1：添加左括号（只要左括号数量没用完）
        if (left < n) {
            backtrack(path + '(', left + 1, right);
        }
        
        // 选择2：添加右括号（只要右括号数量小于左括号）
        if (right < left) {
            backtrack(path + ')', left, right + 1);
        }
    }
    
    backtrack('', 0, 0);
    return result;
}

// ==================== 方法二：使用数组拼接（更符合标准回溯模板） ====================

/**
 * 这个版本更接近标准的回溯模板，使用数组来存储路径
 * 演示了"做选择 -> 递归 -> 撤销选择"的标准流程
 */
function generateParenthesisWithArray(n) {
    const result = [];
    const path = [];
    
    function backtrack(left, right) {
        // 终止条件
        if (left === n && right === n) {
            result.push(path.join(''));
            return;
        }
        
        // 剪枝
        if (right > left) return;
        
        // 选择1：添加左括号
        if (left < n) {
            path.push('(');              // 做选择
            backtrack(left + 1, right);  // 递归
            path.pop();                  // 撤销选择
        }
        
        // 选择2：添加右括号
        if (right < left) {
            path.push(')');              // 做选择
            backtrack(left, right + 1);  // 递归
            path.pop();                  // 撤销选择
        }
    }
    
    backtrack(0, 0);
    return result;
}

// ==================== 方法三：暴力法（不推荐，但有助于理解） ====================

/**
 * 先生成所有可能的括号组合，再过滤出合法的
 * 时间复杂度：O(2^(2n) * n) - 需要检查每个组合是否合法
 * 空间复杂度：O(2^(2n)) - 需要存储所有可能的组合
 */
function generateParenthesisBruteForce(n) {
    const result = [];
    
    // 生成所有可能的括号组合
    function generate(s) {
        if (s.length === 2 * n) {
            if (isValid(s)) {
                result.push(s);
            }
            return;
        }
        
        generate(s + '(');
        generate(s + ')');
    }
    
    // 检查括号组合是否合法
    function isValid(s) {
        let balance = 0;
        for (let char of s) {
            if (char === '(') {
                balance++;
            } else {
                balance--;
            }
            if (balance < 0) return false; // 右括号多了
        }
        return balance === 0; // 左右括号数量相等
    }
    
    generate('');
    return result;
}

// ==================== 测试用例 ====================

console.log('=== 测试用例 ===\n');

// 测试用例1：n = 1
console.log('n = 1:');
console.log(generateParenthesis(1));
// 输出: ["()"]

// 测试用例2：n = 2
console.log('\nn = 2:');
console.log(generateParenthesis(2));
// 输出: ["(())", "()()"]

// 测试用例3：n = 3
console.log('\nn = 3:');
console.log(generateParenthesis(3));
// 输出: ["((()))", "(()())", "(())()", "()(())", "()()()"]

// 测试用例4：n = 4
console.log('\nn = 4:');
console.log(generateParenthesis(4));

// 验证三种方法结果一致
console.log('\n=== 验证不同方法结果一致 ===');
const n = 3;
const result1 = generateParenthesis(n).sort();
const result2 = generateParenthesisWithArray(n).sort();
const result3 = generateParenthesisBruteForce(n).sort();

console.log('方法一和方法二结果一致:', JSON.stringify(result1) === JSON.stringify(result2));
console.log('方法一和方法三结果一致:', JSON.stringify(result1) === JSON.stringify(result3));

// ==================== 可视化回溯过程 ====================

/**
 * 带打印的版本，帮助理解回溯过程
 */
function generateParenthesisWithLog(n) {
    const result = [];
    let callCount = 0;
    
    function backtrack(path, left, right, depth) {
        callCount++;
        const indent = '  '.repeat(depth);
        console.log(`${indent}调用 backtrack("${path}", left=${left}, right=${right})`);
        
        // 终止条件
        if (left === n && right === n) {
            console.log(`${indent}✅ 找到结果: "${path}"`);
            result.push(path);
            return;
        }
        
        // 剪枝
        if (right > left) {
            console.log(`${indent}❌ 剪枝: right(${right}) > left(${left})`);
            return;
        }
        
        // 添加左括号
        if (left < n) {
            console.log(`${indent}→ 尝试添加 '('`);
            backtrack(path + '(', left + 1, right, depth + 1);
        }
        
        // 添加右括号
        if (right < left) {
            console.log(`${indent}→ 尝试添加 ')'`);
            backtrack(path + ')', left, right + 1, depth + 1);
        }
        
        console.log(`${indent}← 回溯`);
    }
    
    console.log(`\n=== 生成 ${n} 对括号的回溯过程 ===\n`);
    backtrack('', 0, 0, 0);
    console.log(`\n总共调用了 ${callCount} 次\n`);
    console.log('结果:', result);
    return result;
}

// 演示 n = 2 的回溯过程
console.log('\n=== 回溯过程演示 ===');
generateParenthesisWithLog(2);

// ==================== 导出 ====================

export {
    generateParenthesis,
    generateParenthesisWithArray,
    generateParenthesisBruteForce,
    generateParenthesisWithLog
};

