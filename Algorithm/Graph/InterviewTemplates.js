/**
 * 面试中的图算法简化模板
 * 
 * 大多数图题都可以用这几个模板解决！
 * 不需要从头构建复杂的图结构
 */

console.log('=== 面试图算法万能模板 ===\n');

// ==================== 模板1：网格DFS/BFS ====================
console.log('🏝️ 模板1：网格问题（岛屿数量、腐烂橘子等）');
console.log('适用：二维网格中的连通性问题\n');

/**
 * 网格DFS模板 - 解决90%的网格问题
 */
function gridDFS(grid, row, col, visited) {
    // 边界检查
    // row 是判断 grid 本身的length，col 是判断 grid[0]的length
    if (row < 0 || row >= grid.length || 
        col < 0 || col >= grid[0].length || 
        visited[row][col] || grid[row][col] === 0) {
        return;
    }

    visited[row][col] = true;

    // 四个方向递归
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    for (const [dr, dc] of directions) {
        gridDFS(grid, row + dr, col + dc, visited);
    }
}

/**
 * 岛屿数量 - 经典应用
 */
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    let count = 0;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1 && !visited[i][j]) {
                gridDFS(grid, i, j, visited);
                count++; // 发现新岛屿
            }
        }
    }
    
    return count;
}

// 测试岛屿数量
const islandGrid = [
    [1,1,0,0,0],
    [1,1,0,0,0],
    [0,0,1,0,0],
    [0,0,0,1,1]
];
console.log('网格:');
islandGrid.forEach(row => console.log(row.join(' ')));
console.log(`岛屿数量: ${numIslands(islandGrid)}\n`);

// ==================== 模板2：图的连通性 ====================
console.log('🤝 模板2：连通性问题（朋友圈、省份数量等）');
console.log('适用：判断有多少个连通分量\n');

/**
 * 简化的并查集 - 解决连通性问题
 */
class SimpleUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.count = n;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // 路径压缩
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            this.parent[rootX] = rootY;
            this.count--;
        }
    }
    
    getCount() {
        return this.count;
    }
}

/**
 * 朋友圈数量 - 经典应用
 */
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const uf = new SimpleUnionFind(n);
    
    // 遍历邻接矩阵的上三角
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }
    
    return uf.getCount();
}

// 测试朋友圈
const friendships = [
    [1,1,0],
    [1,1,0],
    [0,0,1]
];
console.log('朋友关系矩阵:');
friendships.forEach(row => console.log(row.join(' ')));
console.log(`朋友圈数量: ${findCircleNum(friendships)}\n`);

// ==================== 模板3：拓扑排序 ====================
console.log('📋 模板3：拓扑排序（课程安排、任务调度等）');
console.log('适用：有依赖关系的排序问题\n');

/**
 * 简化的拓扑排序 - Kahn算法
 */
function canFinishCourses(numCourses, prerequisites) {
    // 🏗️ 第一步：构建图的数据结构
    // graph[i] 存储所有以课程i为先修课程的后续课程列表
    // 例如：如果课程1需要先修课程0，则 graph[0] 包含 1
    const graph = Array(numCourses).fill(null).map(() => []); // 邻接表，每个课程都有独立的数组
    
    // inDegree[i] 存储课程i的入度（需要多少门先修课程）
    // 入度为0意味着该课程没有先修要求，可以直接学习
    const inDegree = new Array(numCourses).fill(0);
    
    // 🔗 第二步：根据先修关系构建图
    // prerequisites格式：[课程, 先修课程]，表示要学"课程"必须先学"先修课程"
    for (const [course, prereq] of prerequisites) {
        // 在先修课程的邻接表中添加后续课程
        // 含义：学完prereq课程后，可以解锁course课程
        graph[prereq].push(course);
        
        // 增加course课程的入度计数
        // 含义：course课程又多了一个先修要求
        inDegree[course]++;
    }
    
    // 🚀 第三步：Kahn算法 - BFS拓扑排序
    // 初始化队列，放入所有入度为0的课程（没有先修要求的课程）
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i); // 这些课程可以立即开始学习
        }
    }
    
    // 记录已完成的课程数量
    let completed = 0;
    
    // 🔄 第四步：逐步"学习"课程，模拟拓扑排序过程
    while (queue.length > 0) {
        // 从队列中取出一门可以学习的课程
        const course = queue.shift();
        completed++; // 完成课程计数+1
        
        // 🎓 学完这门课程后，检查它能解锁哪些后续课程
        for (const nextCourse of graph[course]) {
            // 将后续课程的入度减1（因为一个先修要求已满足）
            inDegree[nextCourse]--;
            
            // 如果某个后续课程的入度变为0，说明它的所有先修课程都已完成
            // 可以将其加入队列，准备学习
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    // 🎯 第五步：判断是否能完成所有课程
    // 如果完成的课程数等于总课程数，说明没有环，可以完成所有课程
    // 如果小于总课程数，说明存在环（循环依赖），无法完成所有课程
    return completed === numCourses;
}

// 📚 测试课程安排
const courses = 4;
const prereqs = [[1,0], [2,0], [3,1], [3,2]];
// 先修关系解读：
// [1,0]: 课程1需要先修课程0
// [2,0]: 课程2需要先修课程0  
// [3,1]: 课程3需要先修课程1
// [3,2]: 课程3需要先修课程2
// 
// 依赖关系图：
//     0 (基础课程)
//    / \
//   1   2 (都依赖课程0)
//    \ /
//     3 (依赖课程1和2)
//
// 可能的学习顺序：0 → 1 → 2 → 3 或 0 → 2 → 1 → 3

console.log(`课程数: ${courses}`);
console.log('先修关系:', prereqs);
console.log('依赖分析: 课程0是基础课程，课程1和2都需要先学课程0，课程3需要先学课程1和2');
console.log(`能否完成所有课程: ${canFinishCourses(courses, prereqs)}\n`);

// ==================== 模板4：最短路径 ====================
console.log('🛣️ 模板4：最短路径（迷宫、网格最短路径等）');
console.log('适用：无权图的最短路径问题\n');

/**
 * BFS最短路径模板
 */
function shortestPath(grid, start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const rows = grid.length;
    const cols = grid[0].length;
    
    if (grid[startRow][startCol] === 1 || grid[endRow][endCol] === 1) {
        return -1; // 起点或终点被阻挡
    }
    
    const queue = [[startRow, startCol, 0]]; // [row, col, distance]
    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    visited[startRow][startCol] = true;
    
    const directions = [[-1,0], [1,0], [0,-1], [0,1]];
    
    while (queue.length > 0) {
        const [row, col, dist] = queue.shift();
        
        if (row === endRow && col === endCol) {
            return dist; // 找到终点
        }
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                grid[newRow][newCol] === 0 && 
                !visited[newRow][newCol]) {
                
                visited[newRow][newCol] = true;
                queue.push([newRow, newCol, dist + 1]);
            }
        }
    }
    
    return -1; // 无路径
}

// 测试最短路径
const maze = [
    [0,0,1,0,0],
    [0,1,0,0,0],
    [0,0,0,1,0],
    [1,0,0,0,0],
    [0,0,1,0,0]
];
console.log('迷宫 (0=通路, 1=墙):');
maze.forEach(row => console.log(row.join(' ')));
const distance = shortestPath(maze, [0,0], [4,4]);
console.log(`从(0,0)到(4,4)的最短距离: ${distance}\n`);

// ==================== 总结 ====================
console.log('🎯 面试图算法总结:');
console.log('1. 网格问题 → DFS/BFS遍历');
console.log('2. 连通性问题 → 并查集');
console.log('3. 依赖关系 → 拓扑排序');
console.log('4. 最短路径 → BFS');
console.log('5. 90%的图题都能用这4个模板解决！');
console.log('\n💡 关键：不要被复杂的图结构吓到，');
console.log('大多数面试题都有固定套路！');
