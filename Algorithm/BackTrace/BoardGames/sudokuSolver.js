/**
 * 数独求解器 (Sudoku Solver)
 * 
 * 题目描述：
 * 编写一个程序，通过填充空格来解决数独问题。
 * 
 * 数独的解法需遵循如下规则：
 * 1. 数字 1-9 在每一行只能出现一次。
 * 2. 数字 1-9 在每一列只能出现一次。
 * 3. 数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。
 * 
 * 数独部分空格内已填入了数字，空白格用 '.' 表示。
 */

/**
 * 数独求解器
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
export function solveSudoku(board) {
    function isValid(board, row, col, num) {
        // 检查行是否有重复
        for (let j = 0; j < 9; j++) {
            if (board[row][j] === num) {
                return false;
            }
        }
        
        // 检查列是否有重复
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) {
                return false;
            }
        }
        
        // 检查3x3宫格是否有重复
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    function backtrack() {
        // 寻找下一个空格
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    // 尝试填入1-9
                    for (let num = '1'; num <= '9'; num++) {
                        if (isValid(board, i, j, num)) {
                            // 做选择
                            board[i][j] = num;
                            
                            // 递归求解
                            if (backtrack()) {
                                return true;
                            }
                            
                            // 撤销选择
                            board[i][j] = '.';
                        }
                    }
                    // 如果1-9都不能填入，说明无解
                    return false;
                }
            }
        }
        // 所有空格都填满了，找到解
        return true;
    }
    
    backtrack();
}

/**
 * 数独求解器 - 优化版本
 * 使用位运算和预处理来提高效率
 */

/**
 * 数独求解器 - 优化版本
 * @param {character[][]} board
 * @return {void}
 */
export function solveSudokuOptimized(board) {
    // 使用位运算记录每行、每列、每个宫格已使用的数字
    const rows = new Array(9).fill(0);
    const cols = new Array(9).fill(0);
    const boxes = new Array(9).fill(0);
    const spaces = [];
    
    // 初始化状态
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === '.') {
                spaces.push([i, j]);
            } else {
                const digit = parseInt(board[i][j]) - 1;
                const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
                rows[i] |= (1 << digit);
                cols[j] |= (1 << digit);
                boxes[boxIndex] |= (1 << digit);
            }
        }
    }
    
    function backtrack(pos) {
        if (pos === spaces.length) {
            return true;
        }
        
        const [row, col] = spaces[pos];
        const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        
        // 计算当前位置可以填入的数字
        const mask = rows[row] | cols[col] | boxes[boxIndex];
        
        for (let digit = 0; digit < 9; digit++) {
            if ((mask >> digit) & 1) {
                continue; // 该数字已被使用
            }
            
            // 做选择
            board[row][col] = String(digit + 1);
            rows[row] |= (1 << digit);
            cols[col] |= (1 << digit);
            boxes[boxIndex] |= (1 << digit);
            
            if (backtrack(pos + 1)) {
                return true;
            }
            
            // 撤销选择
            board[row][col] = '.';
            rows[row] &= ~(1 << digit);
            cols[col] &= ~(1 << digit);
            boxes[boxIndex] &= ~(1 << digit);
        }
        
        return false;
    }
    
    backtrack(0);
}

/**
 * 有效的数独
 * 
 * 题目描述：
 * 请你判断一个 9x9 的数独是否有效。只需要根据以下规则，验证已经填入的数字是否有效即可。
 */

/**
 * 有效的数独
 * @param {character[][]} board
 * @return {boolean}
 */
export function isValidSudoku(board) {
    const rows = Array(9).fill().map(() => new Set());
    const cols = Array(9).fill().map(() => new Set());
    const boxes = Array(9).fill().map(() => new Set());
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = board[i][j];
            if (num === '.') continue;
            
            const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            
            // 检查是否已存在
            if (rows[i].has(num) || cols[j].has(num) || boxes[boxIndex].has(num)) {
                return false;
            }
            
            // 添加到对应的集合中
            rows[i].add(num);
            cols[j].add(num);
            boxes[boxIndex].add(num);
        }
    }
    
    return true;
}

/**
 * 数独求解器 - 返回所有解
 * @param {character[][]} board
 * @return {character[][][]}
 */
export function solveSudokuAll(board) {
    const solutions = [];
    const originalBoard = board.map(row => [...row]);
    
    function isValid(board, row, col, num) {
        // 检查行
        for (let j = 0; j < 9; j++) {
            if (board[row][j] === num) return false;
        }
        
        // 检查列
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }
        
        // 检查3x3宫格
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        
        return true;
    }
    
    function backtrack() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    for (let num = '1'; num <= '9'; num++) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            backtrack();
                            board[i][j] = '.';
                        }
                    }
                    return;
                }
            }
        }
        // 找到一个解
        solutions.push(board.map(row => [...row]));
    }
    
    backtrack();
    
    // 恢复原始棋盘
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = originalBoard[i][j];
        }
    }
    
    return solutions;
}

/**
 * 打印数独棋盘
 * @param {character[][]} board
 */
export function printSudoku(board) {
    console.log('┌─────────┬─────────┬─────────┐');
    for (let i = 0; i < 9; i++) {
        let row = '│ ';
        for (let j = 0; j < 9; j++) {
            row += board[i][j] === '.' ? ' ' : board[i][j];
            if (j % 3 === 2) {
                row += ' │ ';
            } else {
                row += ' ';
            }
        }
        console.log(row);
        
        if (i % 3 === 2 && i < 8) {
            console.log('├─────────┼─────────┼─────────┤');
        }
    }
    console.log('└─────────┴─────────┴─────────┘');
}

/**
 * 生成数独题目
 * @param {number} difficulty - 难度等级 (1-5)
 * @return {character[][]}
 */
export function generateSudoku(difficulty = 3) {
    // 创建空棋盘
    const board = Array(9).fill().map(() => Array(9).fill('.'));
    
    // 填充对角线上的3x3宫格
    function fillDiagonal() {
        for (let i = 0; i < 9; i += 3) {
            fillBox(i, i);
        }
    }
    
    function fillBox(row, col) {
        const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        // 随机打乱数组
        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        
        let idx = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[row + i][col + j] = nums[idx++];
            }
        }
    }
    
    function isValid(row, col, num) {
        // 检查行
        for (let j = 0; j < 9; j++) {
            if (board[row][j] === num) return false;
        }
        
        // 检查列
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }
        
        // 检查3x3宫格
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        
        return true;
    }
    
    function fillRemaining(i, j) {
        if (j >= 9 && i < 8) {
            i++;
            j = 0;
        }
        if (i >= 9 && j >= 9) {
            return true;
        }
        
        if (i < 3) {
            if (j < 3) j = 3;
        } else if (i < 6) {
            if (j === Math.floor(i / 3) * 3) j += 3;
        } else {
            if (j === 6) {
                i++;
                j = 0;
                if (i >= 9) return true;
            }
        }
        
        for (let num = 1; num <= 9; num++) {
            if (isValid(i, j, String(num))) {
                board[i][j] = String(num);
                if (fillRemaining(i, j + 1)) {
                    return true;
                }
                board[i][j] = '.';
            }
        }
        return false;
    }
    
    // 生成完整的数独
    fillDiagonal();
    fillRemaining(0, 3);
    
    // 根据难度移除一些数字
    const cellsToRemove = Math.floor(81 * difficulty / 5 * 0.6); // 30% - 72%
    let removed = 0;
    
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (board[row][col] !== '.') {
            board[row][col] = '.';
            removed++;
        }
    }
    
    return board;
}

// 测试用例
console.log('=== 数独求解器测试 ===');

// 测试数独题目
const testBoard = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
];

console.log('原始数独题目:');
printSudoku(testBoard);

console.log('\n验证数独有效性:', isValidSudoku(testBoard));

// 复制棋盘用于求解
const boardCopy = testBoard.map(row => [...row]);
solveSudoku(boardCopy);

console.log('\n求解后的数独:');
printSudoku(boardCopy);

console.log('\n=== 生成数独题目测试 ===');
const generatedBoard = generateSudoku(2);
console.log('生成的数独题目 (难度2):');
printSudoku(generatedBoard);
