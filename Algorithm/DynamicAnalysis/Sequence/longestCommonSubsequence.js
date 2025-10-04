/**
 * 最长公共子序列 (Longest Common Subsequence)
 * 
 * 题目描述：
 * 给定两个字符串 text1 和 text2，返回这两个字符串的最长公共子序列的长度。
 * 一个字符串的子序列是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
 * 
 * 示例：
 * 输入：text1 = "abcde", text2 = "ace" 
 * 输出：3  
 * 解释：最长公共子序列是 "ace"，它的长度为 3。
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i][j] 表示 text1[0...i-1] 和 text2[0...j-1] 的最长公共子序列长度
 *    - 状态转移：
 *      - 如果 text1[i-1] === text2[j-1]，则 dp[i][j] = dp[i-1][j-1] + 1
 *      - 否则，dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
 *    - 初始状态：dp[0][j] = dp[i][0] = 0
 *    - 时间复杂度：O(mn)，空间复杂度：O(mn)
 * 
 * 2. 空间优化
 *    - 由于dp[i][j]只依赖于dp[i-1][j-1], dp[i-1][j], dp[i][j-1]
 *    - 可以使用滚动数组优化空间复杂度到O(min(m,n))
 */

// 方法1：动态规划
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;

    // dp[i][j] 表示text1[0...i-1]和text2[0...j-1]的最长公共子序列长度
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    return dp[m][n];
}

// 方法2：空间优化版本
function longestCommonSubsequenceOptimized(text1, text2) {
    // 确保text1是较短的字符串
    if (text1.length > text2.length) {
        [text1, text2] = [text2, text1];
    }
    
    const m = text1.length;
    const n = text2.length;
    
    // 只使用两行dp数组
    let prev = Array(m + 1).fill(0);
    let curr = Array(m + 1).fill(0);
    
    for (let j = 1; j <= n; j++) {
        for (let i = 1; i <= m; i++) {
            if (text1[i-1] === text2[j-1]) {
                curr[i] = prev[i-1] + 1;
            } else {
                curr[i] = Math.max(prev[i], curr[i-1]);
            }
        }
        // 交换prev和curr
        [prev, curr] = [curr, prev];
    }
    
    return prev[m];
}

// 方法3：返回最长公共子序列（不仅仅是长度）
function getLCS(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // 构建dp表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    
    // 回溯构建最长公共子序列
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i-1] === text2[j-1]) {
            lcs = text1[i-1] + lcs;
            i--;
            j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return lcs;
}

// 测试
function test() {
    const testCases = [
        ["abcde", "ace"],
        ["abc", "abc"],
        ["abc", "def"],
        ["bsbininm", "jmjkbkjkv"],
        ["", "abc"]
    ];
    
    console.log("基本动态规划解法：");
    testCases.forEach(([text1, text2]) => {
        console.log(`输入: text1 = "${text1}", text2 = "${text2}"`);
        console.log(`输出: ${longestCommonSubsequence(text1, text2)}\n`);
    });
    
    console.log("空间优化解法：");
    testCases.forEach(([text1, text2]) => {
        console.log(`输入: text1 = "${text1}", text2 = "${text2}"`);
        console.log(`输出: ${longestCommonSubsequenceOptimized(text1, text2)}\n`);
    });
    
    console.log("获取最长公共子序列：");
    testCases.forEach(([text1, text2]) => {
        console.log(`输入: text1 = "${text1}", text2 = "${text2}"`);
        console.log(`最长公共子序列: ${getLCS(text1, text2)}\n`);
    });
}

module.exports = {
    longestCommonSubsequence,
    longestCommonSubsequenceOptimized,
    getLCS
};
