/**
 * 编辑距离 (Edit Distance)
 * 
 * 题目描述：
 * 给你两个单词 word1 和 word2，请返回将 word1 转换成 word2 所使用的最少操作数。
 * 你可以对一个单词进行如下三种操作：
 * 1. 插入一个字符
 * 2. 删除一个字符
 * 3. 替换一个字符
 * 
 * 示例1：
 * 输入：word1 = "horse", word2 = "ros"
 * 输出：3
 * 解释：
 * horse -> rorse (将 'h' 替换为 'r')
 * rorse -> rose (删除 'r')
 * rose -> ros (删除 'e')
 * 
 * 示例2：
 * 输入：word1 = "intention", word2 = "execution"
 * 输出：5
 * 解释：
 * intention -> inention (删除 't')
 * inention -> enention (将 'i' 替换为 'e')
 * enention -> exention (将 'n' 替换为 'x')
 * exention -> exection (将 'n' 替换为 'c')
 * exection -> execution (插入 'u')
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i][j] 表示 word1 的前i个字符转换到 word2 的前j个字符需要的最少操作数
 *    - 状态转移：
 *      - 如果 word1[i-1] === word2[j-1]，则 dp[i][j] = dp[i-1][j-1]
 *      - 否则，dp[i][j] = min(
 *          dp[i-1][j] + 1,   // 删除
 *          dp[i][j-1] + 1,   // 插入
 *          dp[i-1][j-1] + 1  // 替换
 *        )
 *    - 初始状态：
 *      - dp[i][0] = i  // 删除i个字符
 *      - dp[0][j] = j  // 插入j个字符
 */

// 方法1：基本动态规划
function minDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // 创建dp数组并初始化
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // 初始化边界
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    // 填充dp数组
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = Math.min(
                    dp[i-1][j] + 1,    // 删除
                    dp[i][j-1] + 1,    // 插入
                    dp[i-1][j-1] + 1   // 替换
                );
            }
        }
    }
    
    return dp[m][n];
}

// 方法2：空间优化版本
function minDistanceOptimized(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // 确保word1是较短的字符串
    if (m > n) {
        return minDistanceOptimized(word2, word1);
    }
    
    // 只使用一行dp数组
    let prev = Array(n + 1).fill(0);
    let curr = Array(n + 1).fill(0);
    
    // 初始化第一行
    for (let j = 0; j <= n; j++) {
        prev[j] = j;
    }
    
    // 填充dp数组
    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                curr[j] = prev[j-1];
            } else {
                curr[j] = Math.min(
                    prev[j] + 1,      // 删除
                    curr[j-1] + 1,    // 插入
                    prev[j-1] + 1     // 替换
                );
            }
        }
        [prev, curr] = [curr, prev];
    }
    
    return prev[n];
}

// 方法3：返回具体的编辑操作
function getEditOperations(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // dp数组
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    // 操作记录数组
    const operations = Array(m + 1).fill().map(() => Array(n + 1).fill(''));
    
    // 初始化边界
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
        if (i > 0) operations[i][0] = `Delete ${word1[i-1]}`;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
        if (j > 0) operations[0][j] = `Insert ${word2[j-1]}`;
    }
    
    // 填充dp数组和操作记录
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i-1] === word2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
                operations[i][j] = 'No change';
            } else {
                const del = dp[i-1][j] + 1;
                const ins = dp[i][j-1] + 1;
                const rep = dp[i-1][j-1] + 1;
                
                dp[i][j] = Math.min(del, ins, rep);
                
                if (dp[i][j] === del) {
                    operations[i][j] = `Delete ${word1[i-1]}`;
                } else if (dp[i][j] === ins) {
                    operations[i][j] = `Insert ${word2[j-1]}`;
                } else {
                    operations[i][j] = `Replace ${word1[i-1]} with ${word2[j-1]}`;
                }
            }
        }
    }
    
    // 回溯找出所有操作
    const steps = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (operations[i][j] !== 'No change') {
            steps.unshift(operations[i][j]);
        }
        if (i > 0 && j > 0 && word1[i-1] === word2[j-1]) {
            i--; j--;
        } else if (i > 0 && dp[i][j] === dp[i-1][j] + 1) {
            i--;
        } else if (j > 0 && dp[i][j] === dp[i][j-1] + 1) {
            j--;
        } else {
            i--; j--;
        }
    }
    
    return {
        distance: dp[m][n],
        operations: steps
    };
}

// 测试
function test() {
    // 测试用例1：基本场景
    const word1 = "horse";
    const word2 = "ros";
    
    console.log("测试用例1 - 基本场景：");
    console.log("最小编辑距离:", minDistance(word1, word2));
    console.log("空间优化版本:", minDistanceOptimized(word1, word2));
    console.log("编辑操作:", getEditOperations(word1, word2));
    
    // 测试用例2：完全不同的字符串
    const word3 = "intention";
    const word4 = "execution";
    
    console.log("\n测试用例2 - 完全不同的字符串：");
    console.log("最小编辑距离:", minDistance(word3, word4));
    console.log("空间优化版本:", minDistanceOptimized(word3, word4));
    console.log("编辑操作:", getEditOperations(word3, word4));
    
    // 测试用例3：空字符串
    console.log("\n测试用例3 - 空字符串：");
    console.log("最小编辑距离:", minDistance("", "abc"));
    console.log("空间优化版本:", minDistanceOptimized("", "abc"));
    console.log("编辑操作:", getEditOperations("", "abc"));
}

module.exports = {
    minDistance,
    minDistanceOptimized,
    getEditOperations
};
