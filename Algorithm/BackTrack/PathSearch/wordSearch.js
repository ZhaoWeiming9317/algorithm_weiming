/**
 * 单词搜索问题 (Word Search)
 * 
 * 题目描述：
 * 给定一个 m x n 二维字符网格 board 和一个字符串单词 word。
 * 如果 word 存在于网格中，返回 true；否则，返回 false。
 * 
 * 单词必须按照字母顺序，通过相邻的单元格内的字母构成，
 * 其中"相邻"单元格是那些水平相邻或垂直相邻的单元格。
 * 同一个单元格内的字母不允许被重复使用。
 */

/**
 * 单词搜索 - 基础版本
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
export function exist(board, word) {
    if (!board || board.length === 0 || !word) return false;
    
    const m = board.length;
    const n = board[0].length;
    const visited = Array(m).fill().map(() => Array(n).fill(false));
    
    // 四个方向：上、下、左、右
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function backtrack(row, col, index) {
        // 终止条件：找到了完整的单词
        if (index === word.length) {
            return true;
        }
        
        // 边界检查和字符匹配检查
        if (row < 0 || row >= m || col < 0 || col >= n || 
            visited[row][col] || board[row][col] !== word[index]) {
            return false;
        }
        
        // 标记当前位置为已访问
        visited[row][col] = true;
        
        // 在四个方向上继续搜索
        for (let [dx, dy] of directions) {
            if (backtrack(row + dx, col + dy, index + 1)) {
                return true;
            }
        }
        
        // 回溯：撤销访问标记
        visited[row][col] = false;
        
        return false;
    }
    
    // 从每个位置开始尝试
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (backtrack(i, j, 0)) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * 单词搜索 II
 * 
 * 题目描述：
 * 给定一个 m x n 二维字符网格 board 和一个单词列表 words，
 * 返回所有二维网格上的单词。
 * 
 * 单词必须按照字母顺序，通过相邻的单元格内的字母构成，
 * 其中"相邻"单元格是那些水平相邻或垂直相邻的单元格。
 * 同一个单元格内的字母在一个单词中不允许被重复使用。
 */

// Trie节点定义
class TrieNode {
    constructor() {
        this.children = {};
        this.word = null; // 如果这是一个单词的结尾，存储完整单词
    }
}

/**
 * 单词搜索 II - 使用Trie优化
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
export function findWords(board, words) {
    if (!board || board.length === 0 || !words || words.length === 0) {
        return [];
    }
    
    // 构建Trie
    const root = new TrieNode();
    for (let word of words) {
        let node = root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.word = word;
    }
    
    const result = [];
    const m = board.length;
    const n = board[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function backtrack(row, col, node) {
        // 边界检查
        if (row < 0 || row >= m || col < 0 || col >= n) {
            return;
        }
        
        const char = board[row][col];
        
        // 如果当前字符已被访问或不在Trie中
        if (char === '#' || !node.children[char]) {
            return;
        }
        
        node = node.children[char];
        
        // 如果找到一个完整单词
        if (node.word) {
            result.push(node.word);
            node.word = null; // 避免重复添加
        }
        
        // 标记当前位置为已访问
        board[row][col] = '#';
        
        // 在四个方向上继续搜索
        for (let [dx, dy] of directions) {
            backtrack(row + dx, col + dy, node);
        }
        
        // 回溯：恢复原字符
        board[row][col] = char;
    }
    
    // 从每个位置开始搜索
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            backtrack(i, j, root);
        }
    }
    
    return result;
}

/**
 * 机器人的运动范围
 * 
 * 题目描述：
 * 地上有一个m行n列的方格，从坐标 [0,0] 到坐标 [m-1,n-1]。
 * 一个机器人从坐标 [0, 0] 的格子开始移动，它每次可以向左、右、上、下移动一格，
 * 但不能进入行坐标和列坐标的数位之和大于k的格子。
 * 例如，当k为18时，机器人能够进入方格 [35, 37] ，因为3+5+3+7=18。
 * 但它不能进入方格 [35, 38]，因为3+5+3+8=19。
 * 请问该机器人能够到达多少个格子？
 */

/**
 * 机器人的运动范围
 * @param {number} m
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
export function movingCount(m, n, k) {
    const visited = Array(m).fill().map(() => Array(n).fill(false));
    
    // 计算数位之和
    function digitSum(num) {
        let sum = 0;
        while (num > 0) {
            sum += num % 10;
            num = Math.floor(num / 10);
        }
        return sum;
    }
    
    function backtrack(row, col) {
        // 边界检查和条件检查
        if (row < 0 || row >= m || col < 0 || col >= n || 
            visited[row][col] || digitSum(row) + digitSum(col) > k) {
            return 0;
        }
        
        // 标记为已访问
        visited[row][col] = true;
        
        // 计算当前格子 + 四个方向的格子数
        return 1 + 
               backtrack(row + 1, col) + 
               backtrack(row - 1, col) + 
               backtrack(row, col + 1) + 
               backtrack(row, col - 1);
    }
    
    return backtrack(0, 0);
}

/**
 * 黄金矿工
 * 
 * 题目描述：
 * 你要开发一座金矿，地质勘测学家已经探明了这座金矿中的资源分布，
 * 并用大小为 m * n 的网格 grid 进行了标注。每个单元格中的整数就表示这一单元格中的黄金数量；
 * 如果该单元格是空的，那么就是 0。
 * 
 * 为了使收益最大化，矿工需要按以下规则来开采黄金：
 * - 每当矿工进入一个单元，就会收集该单元格中的所有黄金。
 * - 矿工每次可以从当前位置向上下左右四个方向走到相邻的单元格内，但不能超出矿区的边界。
 * - 一个单元格只能被开采（进入）一次。
 * - 矿工可以从网格中任意一个有黄金的单元格开始或者结束开采。
 */

/**
 * 黄金矿工
 * @param {number[][]} grid
 * @return {number}
 */
export function getMaximumGold(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length;
    const n = grid[0].length;
    let maxGold = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    function backtrack(row, col) {
        // 边界检查和有效性检查
        if (row < 0 || row >= m || col < 0 || col >= n || grid[row][col] === 0) {
            return 0;
        }
        
        // 记录当前位置的黄金数量
        const gold = grid[row][col];
        
        // 标记当前位置为已访问（设为0）
        grid[row][col] = 0;
        
        let maxPath = 0;
        
        // 在四个方向上继续搜索
        for (let [dx, dy] of directions) {
            maxPath = Math.max(maxPath, backtrack(row + dx, col + dy));
        }
        
        // 回溯：恢复原值
        grid[row][col] = gold;
        
        return gold + maxPath;
    }
    
    // 从每个有黄金的位置开始尝试
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] > 0) {
                maxGold = Math.max(maxGold, backtrack(i, j));
            }
        }
    }
    
    return maxGold;
}

/**
 * 不同路径 III
 * 
 * 题目描述：
 * 在二维网格 grid 上，有 4 种类型的方格：
 * - 1 表示起始方格。且只有一个起始方格。
 * - 2 表示结束方格，且只有一个结束方格。
 * - 0 表示我们可以走过的空方格。
 * - -1 表示我们无法跨越的障碍。
 * 
 * 返回在四个方向（上、下、左、右）上行走时，
 * 从起始方格到结束方格的不同路径的数目。
 * 每一个无障碍方格都要通过一次。
 */

/**
 * 不同路径 III
 * @param {number[][]} grid
 * @return {number}
 */
export function uniquePathsIII(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const m = grid.length;
    const n = grid[0].length;
    let startRow = 0, startCol = 0;
    let emptyCount = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    // 找到起始位置并统计空方格数量
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 1) {
                startRow = i;
                startCol = j;
                emptyCount++; // 起始方格也要经过
            } else if (grid[i][j] === 0) {
                emptyCount++;
            }
        }
    }
    
    function backtrack(row, col, remaining) {
        // 边界检查
        if (row < 0 || row >= m || col < 0 || col >= n || grid[row][col] === -1) {
            return 0;
        }
        
        // 到达终点
        if (grid[row][col] === 2) {
            return remaining === 0 ? 1 : 0;
        }
        
        // 标记当前位置为已访问
        const temp = grid[row][col];
        grid[row][col] = -1;
        
        let paths = 0;
        
        // 在四个方向上继续搜索
        for (let [dx, dy] of directions) {
            paths += backtrack(row + dx, col + dy, remaining - 1);
        }
        
        // 回溯：恢复原值
        grid[row][col] = temp;
        
        return paths;
    }
    
    return backtrack(startRow, startCol, emptyCount);
}

// 测试用例
console.log('=== 单词搜索测试 ===');

const board1 = [
    ['A','B','C','E'],
    ['S','F','C','S'],
    ['A','D','E','E']
];

console.log('测试单词搜索:');
console.log('board:', board1);
console.log('搜索 "ABCCED":', exist(board1, "ABCCED")); // true
console.log('搜索 "SEE":', exist(board1, "SEE")); // true
console.log('搜索 "ABCB":', exist(board1, "ABCB")); // false

console.log('\n=== 单词搜索 II 测试 ===');
const board2 = [
    ['o','a','a','n'],
    ['e','t','a','e'],
    ['i','h','k','r'],
    ['i','f','l','v']
];
const words = ["oath","pea","eat","rain"];

console.log('board:', board2);
console.log('words:', words);
console.log('找到的单词:', findWords(board2, words));

console.log('\n=== 机器人运动范围测试 ===');
console.log('m=2, n=3, k=1:', movingCount(2, 3, 1)); // 3
console.log('m=3, n=1, k=0:', movingCount(3, 1, 0)); // 1

console.log('\n=== 黄金矿工测试 ===');
const goldGrid = [
    [0,6,0],
    [5,8,7],
    [0,9,0]
];
console.log('黄金网格:', goldGrid);
console.log('最大黄金数量:', getMaximumGold(goldGrid)); // 24

console.log('\n=== 不同路径 III 测试 ===');
const pathGrid = [
    [1,0,0,0],
    [0,0,0,0],
    [0,0,2,-1]
];
console.log('路径网格:', pathGrid);
console.log('不同路径数:', uniquePathsIII(pathGrid)); // 2
