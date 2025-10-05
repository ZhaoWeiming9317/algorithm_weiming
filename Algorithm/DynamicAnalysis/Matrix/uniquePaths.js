/**
 * 62. 不同路径 (Unique Paths)
 * 
 * 题目：一个机器人位于一个 m x n 网格的左上角，
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角。
 * 问总共有多少条不同的路径？
 * 
 * 示例：
 * 输入：m = 3, n = 7
 * 输出：28
 * 
 * 时间复杂度：O(m * n)
 * 空间复杂度：O(m * n)
 */

// 方法1：动态规划（正确版本）
function uniquePaths(m, n) {
    // dp[i][j] 表示从(0,0)到(i,j)的路径数
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // 初始化第一行和第一列
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1;
    }
    
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1;
    }
    
    // 填充其他位置
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {  // 注意：这里应该是 j = 1
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}

// 方法2：空间优化版本
function uniquePathsOptimized(m, n) {
    // 只需要一维数组，因为每次只需要上一行的数据
    const dp = Array(n).fill(1);
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] = dp[j] + dp[j - 1];
        }
    }
    
    return dp[n - 1];
}

// 方法3：数学公式（组合数）
function uniquePathsMath(m, n) {
    // 从起点到终点需要走 (m-1) + (n-1) = m+n-2 步
    // 其中向下走 m-1 步，向右走 n-1 步
    // 总路径数 = C(m+n-2, m-1) = C(m+n-2, n-1)
    
    let result = 1;
    for (let i = 1; i < m; i++) {
        result = result * (n + i - 1) / i;
    }
    return Math.round(result);
}

// 你的代码（有问题）
function uniquePathsWrong(m, n) {
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // 初始化正确
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1;
    }
    
    for (let i = 0; i < n; i++) {
        dp[0][i] = 1;
    }
    
    // 问题1：内层循环的起始位置错误
    for (let i = 1; i < m; i++) {
        for (let j = i; j < n; j++) {  // ❌ 应该是 j = 1
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}

// 测试用例
console.log('=== 不同路径测试 ===');

const m = 3, n = 7;
console.log(`网格大小: ${m} x ${n}`);

console.log('正确版本:', uniquePaths(m, n));           // 28
console.log('优化版本:', uniquePathsOptimized(m, n));   // 28
console.log('数学版本:', uniquePathsMath(m, n));        // 28
console.log('错误版本:', uniquePathsWrong(m, n));       // 错误结果

// 小规模测试
console.log('\n=== 小规模测试 ===');
console.log('2x2:', uniquePaths(2, 2));  // 2
console.log('3x2:', uniquePaths(3, 2));  // 3
console.log('3x3:', uniquePaths(3, 3));  // 6

module.exports = { 
    uniquePaths, 
    uniquePathsOptimized, 
    uniquePathsMath,
    uniquePathsWrong 
};