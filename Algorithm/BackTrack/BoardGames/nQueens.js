/**
 * N皇后问题 (N-Queens)
 * 
 * 题目描述：
 * n 皇后问题 研究的是如何将 n 个皇后放置在 n×n 的棋盘上，并且使皇后彼此之间不能相互攻击。
 * 给你一个整数 n ，返回所有不同的 n 皇后问题 的解决方案。
 * 
 * 每一种解法包含一个不同的 n 皇后问题 的棋子放置方案，该方案中 'Q' 和 '.' 分别代表了皇后和空位。
 * 
 * 皇后的攻击范围：
 * - 同一行
 * - 同一列  
 * - 同一对角线（主对角线和副对角线）
 */

/**
 * N皇后问题 - 返回所有解决方案
 * @param {number} n
 * @return {string[][]}
 */
export function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function isValid(row, col) {
        // 检查同一列是否有皇后
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') {
                return false;
            }
        }
        
        // 检查左上对角线是否有皇后
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') {
                return false;
            }
        }
        
        // 检查右上对角线是否有皇后
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') {
                return false;
            }
        }
        
        return true;
    }
    
    function backtrack(row) {
        // 终止条件：所有行都放置了皇后
        if (row === n) {
            // 将当前棋盘状态转换为字符串数组
            const solution = board.map(row => row.join(''));
            result.push(solution);
            return;
        }
        
        // 尝试在当前行的每一列放置皇后
        for (let col = 0; col < n; col++) {
            if (isValid(row, col)) {
                // 放置皇后
                board[row][col] = 'Q';
                
                // 递归处理下一行
                backtrack(row + 1);
                
                // 撤销选择
                board[row][col] = '.';
            }
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * N皇后问题 II - 返回解决方案的数量
 * @param {number} n
 * @return {number}
 */
export function totalNQueens(n) {
    let count = 0;
    const cols = new Set();        // 记录被占用的列
    const diag1 = new Set();       // 记录被占用的主对角线 (row - col)
    const diag2 = new Set();       // 记录被占用的副对角线 (row + col)
    
    function backtrack(row) {
        if (row === n) {
            count++;
            return;
        }
        
        for (let col = 0; col < n; col++) {
            // 检查当前位置是否冲突
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                continue;
            }
            
            // 放置皇后
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            
            // 递归
            backtrack(row + 1);
            
            // 撤销选择
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }
    
    backtrack(0);
    return count;
}

/**
 * N皇后问题 - 位运算优化版本
 * 
 * 使用位运算来表示列和对角线的占用情况，提高效率
 */

/**
 * N皇后问题 - 位运算版本
 * @param {number} n
 * @return {number}
 */
export function totalNQueensBitwise(n) {
    let count = 0;
    
    function backtrack(row, cols, diag1, diag2) {
        if (row === n) {
            count++;
            return;
        }
        
        // 计算当前行可以放置皇后的位置
        // availablePositions的二进制表示中，1表示可以放置皇后的位置
        let availablePositions = ((1 << n) - 1) & (~(cols | diag1 | diag2));
        
        while (availablePositions) {
            // 获取最右边的1的位置
            const position = availablePositions & (-availablePositions);
            
            // 清除这个位置的1
            availablePositions &= (availablePositions - 1);
            
            // 递归到下一行
            backtrack(
                row + 1,
                cols | position,              // 更新列占用情况
                (diag1 | position) << 1,      // 更新主对角线占用情况
                (diag2 | position) >> 1       // 更新副对角线占用情况
            );
        }
    }
    
    backtrack(0, 0, 0, 0);
    return count;
}

/**
 * 打印N皇后解决方案
 * @param {string[][]} solutions
 */
export function printNQueensSolutions(solutions) {
    console.log(`找到 ${solutions.length} 种解决方案：\n`);
    
    solutions.forEach((solution, index) => {
        console.log(`解决方案 ${index + 1}:`);
        solution.forEach(row => {
            console.log(row);
        });
        console.log('');
    });
}

/**
 * 检查N皇后解决方案是否有效
 * @param {string[]} solution
 * @return {boolean}
 */
export function isValidNQueensSolution(solution) {
    const n = solution.length;
    const queens = [];
    
    // 找到所有皇后的位置
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (solution[i][j] === 'Q') {
                queens.push([i, j]);
            }
        }
    }
    
    // 检查是否有n个皇后
    if (queens.length !== n) {
        return false;
    }
    
    // 检查任意两个皇后是否冲突
    for (let i = 0; i < queens.length; i++) {
        for (let j = i + 1; j < queens.length; j++) {
            const [r1, c1] = queens[i];
            const [r2, c2] = queens[j];
            
            // 检查同行、同列、同对角线
            if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * 可以攻击国王的皇后
 * 
 * 题目描述：
 * 在一个 8x8 的棋盘上，放置着若干「黑皇后」和一个「白国王」。
 * 给定两个数组 queens 和 king ，其中 queens[i] = [xi, yi] 为第 i 个黑皇后的位置，
 * king = [x, y] 为白国王的位置。
 * 返回可以攻击到国王的所有黑皇后的坐标。
 */

/**
 * 可以攻击国王的皇后
 * @param {number[][]} queens
 * @param {number[]} king
 * @return {number[][]}
 */
export function queensAttacktheKing(queens, king) {
    const result = [];
    const queenSet = new Set();
    
    // 将皇后位置存入Set，便于快速查找
    for (let [x, y] of queens) {
        queenSet.add(`${x},${y}`);
    }
    
    // 8个方向：上下左右和4个对角线
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],    // 上下左右
        [-1, -1], [-1, 1], [1, -1], [1, 1]   // 4个对角线
    ];
    
    const [kingX, kingY] = king;
    
    // 在每个方向上寻找最近的皇后
    for (let [dx, dy] of directions) {
        let x = kingX + dx;
        let y = kingY + dy;
        
        // 沿着当前方向移动，直到找到皇后或越界
        while (x >= 0 && x < 8 && y >= 0 && y < 8) {
            if (queenSet.has(`${x},${y}`)) {
                result.push([x, y]);
                break; // 找到最近的皇后，停止在这个方向上搜索
            }
            x += dx;
            y += dy;
        }
    }
    
    return result;
}

// 测试用例
console.log('=== N皇后问题测试 ===');

console.log('4皇后问题的所有解：');
const solutions4 = solveNQueens(4);
printNQueensSolutions(solutions4);

console.log('8皇后问题的解的数量：');
console.log('普通方法:', totalNQueens(8));
console.log('位运算方法:', totalNQueensBitwise(8));

console.log('\n=== 验证解的有效性 ===');
if (solutions4.length > 0) {
    console.log('第一个解是否有效:', isValidNQueensSolution(solutions4[0]));
}

console.log('\n=== 可以攻击国王的皇后测试 ===');
const queens = [[0,1],[1,0],[4,0],[0,4],[3,3],[2,4]];
const king = [0,0];
console.log('输入: queens =', queens, ', king =', king);
console.log('输出:', queensAttacktheKing(queens, king));
