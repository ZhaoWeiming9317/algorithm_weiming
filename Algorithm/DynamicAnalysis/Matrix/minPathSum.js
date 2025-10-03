/**
 * 最小路径和 (Minimum Path Sum)
 * 
 * 题目描述：
 * 给定一个包含非负整数的 m x n 网格 grid，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。
 * 说明：每次只能向下或者向右移动一步。
 * 
 * 示例1：
 * 输入：grid = [
 *   [1,3,1],
 *   [1,5,1],
 *   [4,2,1]
 * ]
 * 输出：7
 * 解释：路径 1→3→1→1→1 的总和最小。
 * 
 * 解题思路：
 * 1. 动态规划
 *    - 状态定义：dp[i][j] 表示到达位置(i,j)的最小路径和
 *    - 状态转移：dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
 *    - 初始状态：
 *      - dp[0][j] = dp[0][j-1] + grid[0][j]  // 第一行
 *      - dp[i][0] = dp[i-1][0] + grid[i][0]  // 第一列
 * 
 * 2. 空间优化
 *    - 只需要一行dp数组
 *    - 每次更新当前位置时，左边的值代表新的dp[i][j-1]，上边的值代表旧的dp[i-1][j]
 */

// 方法1：动态规划
function minPathSum(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    
    // 初始化第一个位置
    dp[0][0] = grid[0][0];
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }
    
    // 填充dp数组
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }
    
    return dp[m-1][n-1];
}

// 方法2：空间优化版本
function minPathSumOptimized(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(n).fill(0);
    
    // 初始化第一行
    dp[0] = grid[0][0];
    for (let j = 1; j < n; j++) {
        dp[j] = dp[j-1] + grid[0][j];
    }
    
    // 更新dp数组
    for (let i = 1; i < m; i++) {
        dp[0] += grid[i][0];  // 更新第一列
        for (let j = 1; j < n; j++) {
            dp[j] = Math.min(dp[j], dp[j-1]) + grid[i][j];
        }
    }
    
    return dp[n-1];
}

// 方法3：返回最小路径
function getMinPath(grid) {
    if (!grid || grid.length === 0) return { sum: 0, path: [] };
    
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(m).fill().map(() => Array(n).fill(0));
    const path = Array(m).fill().map(() => Array(n).fill(null));
    
    // 初始化第一个位置
    dp[0][0] = grid[0][0];
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
        path[0][j] = 'left';
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
        path[i][0] = 'up';
    }
    
    // 填充dp数组和路径
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (dp[i-1][j] < dp[i][j-1]) {
                dp[i][j] = dp[i-1][j] + grid[i][j];
                path[i][j] = 'up';
            } else {
                dp[i][j] = dp[i][j-1] + grid[i][j];
                path[i][j] = 'left';
            }
        }
    }
    
    // 回溯找出路径
    const minPath = [];
    let i = m - 1, j = n - 1;
    
    while (i > 0 || j > 0) {
        minPath.unshift([i, j]);
        if (path[i][j] === 'up') {
            i--;
        } else {
            j--;
        }
    }
    minPath.unshift([0, 0]);
    
    return {
        sum: dp[m-1][n-1],
        path: minPath
    };
}

// 方法4：处理有障碍物的情况
function minPathSumWithObstacles(grid, obstacles) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(m).fill().map(() => Array(n).fill(Infinity));
    
    // 如果起点或终点是障碍物，直接返回-1
    if (obstacles[0][0] === 1 || obstacles[m-1][n-1] === 1) {
        return -1;
    }
    
    // 初始化第一个位置
    dp[0][0] = grid[0][0];
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        if (obstacles[0][j] === 1) break;
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        if (obstacles[i][0] === 1) break;
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }
    
    // 填充dp数组
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (obstacles[i][j] === 1) continue;
            dp[i][j] = Math.min(
                obstacles[i-1][j] === 1 ? Infinity : dp[i-1][j],
                obstacles[i][j-1] === 1 ? Infinity : dp[i][j-1]
            ) + grid[i][j];
        }
    }
    
    return dp[m-1][n-1] === Infinity ? -1 : dp[m-1][n-1];
}

// 测试
function test() {
    // 测试用例1：基本场景
    const grid1 = [
        [1,3,1],
        [1,5,1],
        [4,2,1]
    ];
    console.log("测试用例1 - 基本场景：");
    console.log("动态规划:", minPathSum(grid1));
    console.log("空间优化:", minPathSumOptimized(grid1));
    console.log("最小路径:", getMinPath(grid1));
    
    // 测试用例2：带障碍物
    const grid2 = [
        [1,3,1],
        [1,5,1],
        [4,2,1]
    ];
    const obstacles = [
        [0,0,0],
        [0,1,0],
        [0,0,0]
    ];
    console.log("\n测试用例2 - 带障碍物：");
    console.log("带障碍物的最小路径和:", minPathSumWithObstacles(grid2, obstacles));
    
    // 测试用例3：单行网格
    const grid3 = [[1,2,3,4]];
    console.log("\n测试用例3 - 单行网格：");
    console.log("动态规划:", minPathSum(grid3));
    console.log("最小路径:", getMinPath(grid3));
}

module.exports = {
    minPathSum,
    minPathSumOptimized,
    getMinPath,
    minPathSumWithObstacles
};
