/**
 * BFS最短路径应用 - 无权图中的最短路径问题
 * 
 * BFS在无权图中的优势：
 * 1. 第一次到达目标就是最短路径
 * 2. 保证找到距离最小的路径
 * 3. 适用于各种网格和图的最短路径问题
 */

import { AdjacencyListGraph } from '../Foundation/GraphRepresentation.js';

/**
 * 单源最短路径 - 从一个起点到所有其他点的最短距离
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Object} {distances, paths}
 */
export function singleSourceShortestPath(graph, start) {
    const distances = new Map();
    const predecessors = new Map();
    const visited = new Set();
    const queue = [start];
    
    distances.set(start, 0);
    predecessors.set(start, null);
    visited.add(start);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex);
                distances.set(neighbor.vertex, distances.get(vertex) + 1);
                predecessors.set(neighbor.vertex, vertex);
                queue.push(neighbor.vertex);
            }
        }
    }
    
    // 构建所有路径
    const paths = new Map();
    for (const [vertex, distance] of distances) {
        if (vertex !== start) {
            const path = reconstructPath(predecessors, start, vertex);
            paths.set(vertex, path);
        }
    }
    
    return {distances, paths};
}

/**
 * 两点间最短路径
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @param {*} target - 目标顶点
 * @return {Object|null} {distance, path} 或 null
 */
export function shortestPath(graph, start, target) {
    if (start === target) {
        return {distance: 0, path: [start]};
    }
    
    const visited = new Set();
    const queue = [{vertex: start, distance: 0, path: [start]}];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const {vertex, distance, path} = queue.shift();
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (neighbor.vertex === target) {
                // 找到目标，返回路径
                return {
                    distance: distance + 1,
                    path: [...path, target]
                };
            }
            
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex);
                queue.push({
                    vertex: neighbor.vertex,
                    distance: distance + 1,
                    path: [...path, neighbor.vertex]
                });
            }
        }
    }
    
    return null; // 无路径
}

/**
 * 网格中的最短路径 - 经典应用
 * @param {number[][]} grid - 网格，0表示可通行，1表示障碍
 * @param {Array} start - 起始坐标 [row, col]
 * @param {Array} target - 目标坐标 [row, col]
 * @return {Object|null} {distance, path} 或 null
 */
export function shortestPathInGrid(grid, start, target) {
    const rows = grid.length;
    const cols = grid[0].length;
    const [startRow, startCol] = start;
    const [targetRow, targetCol] = target;
    
    // 检查起点和终点是否有效
    if (grid[startRow][startCol] === 1 || grid[targetRow][targetCol] === 1) {
        return null;
    }
    
    if (startRow === targetRow && startCol === targetCol) {
        return {distance: 0, path: [start]};
    }
    
    const visited = new Set();
    const queue = [{
        row: startRow, 
        col: startCol, 
        distance: 0, 
        path: [[startRow, startCol]]
    }];
    
    visited.add(`${startRow},${startCol}`);
    
    // 四个方向：上、下、左、右
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (queue.length > 0) {
        const {row, col, distance, path} = queue.shift();
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const key = `${newRow},${newCol}`;
            
            // 检查边界和障碍
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                grid[newRow][newCol] === 0 && 
                !visited.has(key)) {
                
                // 检查是否到达目标
                if (newRow === targetRow && newCol === targetCol) {
                    return {
                        distance: distance + 1,
                        path: [...path, [newRow, newCol]]
                    };
                }
                
                visited.add(key);
                queue.push({
                    row: newRow,
                    col: newCol,
                    distance: distance + 1,
                    path: [...path, [newRow, newCol]]
                });
            }
        }
    }
    
    return null; // 无路径
}

/**
 * 多源BFS - 从多个起点同时开始的最短路径
 * 应用：腐烂的橘子、01矩阵等问题
 * @param {number[][]} grid - 网格
 * @param {Array} sources - 起始点数组 [[row, col], ...]
 * @param {number} targetValue - 目标值
 * @return {number[][]} 距离矩阵
 */
export function multiSourceBFS(grid, sources, targetValue = 0) {
    const rows = grid.length;
    const cols = grid[0].length;
    const distances = Array(rows).fill(null).map(() => Array(cols).fill(Infinity));
    const queue = [];
    
    // 初始化所有源点
    for (const [row, col] of sources) {
        distances[row][col] = 0;
        queue.push({row, col, distance: 0});
    }
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    while (queue.length > 0) {
        const {row, col, distance} = queue.shift();
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                grid[newRow][newCol] === targetValue &&
                distances[newRow][newCol] > distance + 1) {
                
                distances[newRow][newCol] = distance + 1;
                queue.push({
                    row: newRow,
                    col: newCol,
                    distance: distance + 1
                });
            }
        }
    }
    
    return distances;
}

/**
 * 单词接龙问题 - 字符串变换的最短步数
 * @param {string} beginWord - 起始单词
 * @param {string} endWord - 目标单词
 * @param {string[]} wordList - 单词列表
 * @return {number} 最短变换步数，无法变换返回0
 */
export function ladderLength(beginWord, endWord, wordList) {
    if (!wordList.includes(endWord)) return 0;
    
    const wordSet = new Set(wordList);
    const visited = new Set();
    const queue = [{word: beginWord, steps: 1}];
    
    visited.add(beginWord);
    
    while (queue.length > 0) {
        const {word, steps} = queue.shift();
        
        if (word === endWord) {
            return steps;
        }
        
        // 尝试改变每个位置的字符
        for (let i = 0; i < word.length; i++) {
            for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
                const char = String.fromCharCode(c);
                if (char !== word[i]) {
                    const newWord = word.slice(0, i) + char + word.slice(i + 1);
                    
                    if (wordSet.has(newWord) && !visited.has(newWord)) {
                        visited.add(newWord);
                        queue.push({word: newWord, steps: steps + 1});
                    }
                }
            }
        }
    }
    
    return 0; // 无法变换
}

/**
 * 重建路径的辅助函数
 */
function reconstructPath(predecessors, start, target) {
    if (!predecessors.has(target)) return null;
    
    const path = [];
    let current = target;
    
    while (current !== null) {
        path.unshift(current);
        current = predecessors.get(current);
    }
    
    return path[0] === start ? path : null;
}

/**
 * 打印网格路径
 */
function printGridPath(grid, path) {
    const rows = grid.length;
    const cols = grid[0].length;
    const display = Array(rows).fill(null).map(() => Array(cols).fill('.'));
    
    // 标记障碍
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                display[i][j] = '#';
            }
        }
    }
    
    // 标记路径
    if (path) {
        path.forEach(([row, col], index) => {
            if (index === 0) {
                display[row][col] = 'S'; // 起点
            } else if (index === path.length - 1) {
                display[row][col] = 'E'; // 终点
            } else {
                display[row][col] = '*'; // 路径
            }
        });
    }
    
    // 打印网格
    display.forEach(row => {
        console.log(row.join(' '));
    });
}

// 测试和演示
console.log('=== BFS最短路径应用演示 ===\n');

// 1. 图中的最短路径
console.log('1. 图中的最短路径：');
const graph = new AdjacencyListGraph(false);
// 创建一个简单的图
//   0 --- 1 --- 4
//   |     |     |
//   2 --- 3 --- 5
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(2, 3);
graph.addEdge(3, 5);
graph.addEdge(4, 5);

console.log('图结构：');
graph.printAdjList();

const result1 = shortestPath(graph, 0, 5);
console.log(`从0到5的最短路径: ${result1 ? result1.path.join(' -> ') : '无路径'}`);
console.log(`距离: ${result1 ? result1.distance : '无限'}`);

// 单源最短路径
console.log('\n从顶点0到所有其他顶点的最短路径：');
const {distances, paths} = singleSourceShortestPath(graph, 0);
for (const [vertex, distance] of distances) {
    if (vertex !== 0) {
        const path = paths.get(vertex);
        console.log(`到顶点${vertex}: 距离${distance}, 路径: ${path.join(' -> ')}`);
    }
}

// 2. 网格中的最短路径
console.log('\n2. 网格中的最短路径：');
const grid = [
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0]
];

console.log('原始网格 (0=可通行, 1=障碍):');
grid.forEach(row => console.log(row.join(' ')));

const gridResult = shortestPathInGrid(grid, [0, 0], [4, 4]);
console.log(`\n从(0,0)到(4,4)的最短距离: ${gridResult ? gridResult.distance : '无路径'}`);

if (gridResult) {
    console.log('路径可视化 (S=起点, E=终点, *=路径, #=障碍):');
    printGridPath(grid, gridResult.path);
}

// 3. 多源BFS示例
console.log('\n3. 多源BFS - 01矩阵问题：');
const binaryGrid = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1]
];

console.log('二进制网格:');
binaryGrid.forEach(row => console.log(row.join(' ')));

// 找到所有0的位置作为源点
const sources = [];
for (let i = 0; i < binaryGrid.length; i++) {
    for (let j = 0; j < binaryGrid[0].length; j++) {
        if (binaryGrid[i][j] === 0) {
            sources.push([i, j]);
        }
    }
}

const distanceMatrix = multiSourceBFS(binaryGrid, sources, 1);
console.log('\n到最近0的距离矩阵:');
distanceMatrix.forEach(row => {
    console.log(row.map(d => d === Infinity ? '∞' : d).join(' '));
});

// 4. 单词接龙
console.log('\n4. 单词接龙问题：');
const beginWord = "hit";
const endWord = "cog";
const wordList = ["hot","dot","dog","lot","log","cog"];

const steps = ladderLength(beginWord, endWord, wordList);
console.log(`从 "${beginWord}" 到 "${endWord}" 的最短变换步数: ${steps}`);

console.log('\n=== BFS最短路径算法总结 ===');
console.log('1. 无权图最短路径: BFS保证第一次到达就是最短');
console.log('2. 网格路径问题: 将网格转换为图，使用BFS');
console.log('3. 多源BFS: 同时从多个起点开始，适合"最近距离"问题');
console.log('4. 字符串变换: 将字符串看作图中的节点');
console.log('5. 时间复杂度: O(V + E)，空间复杂度: O(V)');
