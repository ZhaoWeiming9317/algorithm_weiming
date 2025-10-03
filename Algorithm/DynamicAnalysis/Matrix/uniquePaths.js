/**
 * 不同路径 (Unique Paths)
 * 
 * 题目描述：
 * 一个机器人位于一个 m x n 网格的左上角。
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角。
 * 问总共有多少条不同的路径？
 * 
 * 示例1：
 * 输入：m = 3, n = 7
 * 输出：28
 * 
 * 示例2：
 * 输入：m = 3, n = 2
 * 输出：3
 * 解释：从左上角开始，总共有3条路径可以到达右下角：
 * 1. 向右 -> 向右 -> 向下
 * 2. 向右 -> 向下 -> 向右
 * 3. 向下 -> 向右 -> 向右
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i][j] 表示到达位置(i,j)的不同路径数
 *    - 状态转移：dp[i][j] = dp[i-1][j] + dp[i][j-1]
 *    - 初始状态：
 *      - dp[0][j] = 1  // 第一行只能向右走
 *      - dp[i][0] = 1  // 第一列只能向下走
 * 
 * 2. 空间优化
 *    - 只需要一行dp数组
 *    - 每次更新当前位置时，左边的值代表新的dp[i][j-1]，上边的值代表旧的dp[i-1][j]
 * 
 * 3. 数学方法
 *    - 从左上角到右下角需要移动 m-1 步向下和 n-1 步向右
 *    - 总共需要移动 m+n-2 步，其中选择 m-1 步向下
 *    - 答案就是组合数 C(m+n-2, m-1) 或 C(m+n-2, n-1)
 */

// 方法1：动态规划
function uniquePaths(m, n) {
    // 创建dp数组并初始化
    const dp = Array(m).fill().map(() => Array(n).fill(1));
    
    // 填充dp数组
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
}

// 方法2：空间优化版本
function uniquePathsOptimized(m, n) {
    const dp = Array(n).fill(1);
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] += dp[j-1];
        }
    }
    
    return dp[n-1];
}

// 方法3：数学方法（组合数）
function uniquePathsMath(m, n) {
    // 计算组合数 C(m+n-2, min(m-1, n-1))
    const small = Math.min(m-1, n-1);
    const total = m + n - 2;
    
    let result = 1;
    // 计算 C(total, small) = total!/(small!*(total-small)!)
    for (let i = 1; i <= small; i++) {
        result = result * (total - small + i) / i;
    }
    
    return Math.round(result);  // 处理浮点数精度问题
}

// 方法4：带障碍物的路径数
function uniquePathsWithObstacles(obstacleGrid) {
    const m = obstacleGrid.length;
    const n = obstacleGrid[0].length;
    
    // 如果起点或终点有障碍物，直接返回0
    if (obstacleGrid[0][0] === 1 || obstacleGrid[m-1][n-1] === 1) {
        return 0;
    }
    
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // 初始化第一行
    for (let j = 0; j < n; j++) {
        if (obstacleGrid[0][j] === 1) break;
        dp[0][j] = 1;
    }
    
    // 初始化第一列
    for (let i = 0; i < m; i++) {
        if (obstacleGrid[i][0] === 1) break;
        dp[i][0] = 1;
    }
    
    // 填充dp数组
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacleGrid[i][j] === 0) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
    }
    
    return dp[m-1][n-1];
}

// 方法5：返回所有可能的路径
function getAllPaths(m, n) {
    const paths = [];
    
    function backtrack(i, j, path) {
        if (i === m-1 && j === n-1) {
            paths.push([...path]);
            return;
        }
        
        // 向右移动
        if (j < n-1) {
            path.push('right');
            backtrack(i, j+1, path);
            path.pop();
        }
        
        // 向下移动
        if (i < m-1) {
            path.push('down');
            backtrack(i+1, j, path);
            path.pop();
        }
    }
    
    backtrack(0, 0, []);
    return paths;
}

// 测试
function test() {
    // 测试用例1：基本场景
    const m1 = 3, n1 = 7;
    console.log("测试用例1 - 基本场景：");
    console.log("动态规划:", uniquePaths(m1, n1));
    console.log("空间优化:", uniquePathsOptimized(m1, n1));
    console.log("数学方法:", uniquePathsMath(m1, n1));
    
    // 测试用例2：小网格
    const m2 = 3, n2 = 2;
    console.log("\n测试用例2 - 小网格：");
    console.log("动态规划:", uniquePaths(m2, n2));
    console.log("所有路径:", getAllPaths(m2, n2));
    
    // 测试用例3：带障碍物
    const obstacleGrid = [
        [0,0,0],
        [0,1,0],
        [0,0,0]
    ];
    console.log("\n测试用例3 - 带障碍物：");
    console.log("带障碍物的路径数:", uniquePathsWithObstacles(obstacleGrid));
}

module.exports = {
    uniquePaths,
    uniquePathsOptimized,
    uniquePathsMath,
    uniquePathsWithObstacles,
    getAllPaths
};
