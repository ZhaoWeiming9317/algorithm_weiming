/**
 * DFS基础实现 - 深度优先搜索的各种实现方式
 * 
 * DFS核心思想：
 * 1. 使用栈(递归栈或显式栈)实现后进先出
 * 2. 从起始点开始，尽可能深入探索
 * 3. 无路可走时回溯，探索其他分支
 */

import { AdjacencyListGraph } from '../Foundation/GraphRepresentation.js';

/**
 * 递归DFS遍历 - 最经典的实现
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} vertex - 当前顶点
 * @param {Set} visited - 已访问顶点集合
 * @param {Array} result - 遍历结果
 */
export function dfsRecursive(graph, vertex, visited = new Set(), result = []) {
    visited.add(vertex);
    result.push(vertex);
    console.log(`访问顶点: ${vertex}`);
    
    // 递归访问所有未访问的邻居
    for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor.vertex)) {
            dfsRecursive(graph, neighbor.vertex, visited, result);
        }
    }
    
    return result;
}

/**
 * 迭代DFS遍历 - 使用显式栈
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Array} 遍历结果
 */
export function dfsIterative(graph, start) {
    const visited = new Set();
    const stack = [start];
    const result = [];
    
    while (stack.length > 0) {
        const vertex = stack.pop();
        
        if (!visited.has(vertex)) {
            visited.add(vertex);
            result.push(vertex);
            console.log(`访问顶点: ${vertex}`);
            
            // 为了保持与递归相同的访问顺序，需要逆序添加邻居
            const neighbors = graph.getNeighbors(vertex);
            for (let i = neighbors.length - 1; i >= 0; i--) {
                if (!visited.has(neighbors[i].vertex)) {
                    stack.push(neighbors[i].vertex);
                }
            }
            
            console.log(`  当前栈: [${stack.join(', ')}]`);
        }
    }
    
    return result;
}

/**
 * DFS路径查找 - 找到从起点到终点的一条路径
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @param {*} target - 目标顶点
 * @param {Array} path - 当前路径
 * @param {Set} visited - 已访问顶点
 * @return {Array|null} 路径数组或null
 */
export function dfsPath(graph, start, target, path = [], visited = new Set()) {
    visited.add(start);
    path.push(start);
    
    console.log(`当前路径: [${path.join(' -> ')}]`);
    
    if (start === target) {
        console.log(`找到目标! 路径: [${path.join(' -> ')}]`);
        return [...path]; // 返回路径副本
    }
    
    for (const neighbor of graph.getNeighbors(start)) {
        if (!visited.has(neighbor.vertex)) {
            const result = dfsPath(graph, neighbor.vertex, target, path, visited);
            if (result) return result; // 找到路径就返回
        }
    }
    
    // 回溯
    path.pop();
    visited.delete(start);
    console.log(`回溯，当前路径: [${path.join(' -> ')}]`);
    
    return null; // 未找到路径
}

/**
 * DFS查找所有路径 - 枚举从起点到终点的所有路径
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @param {*} target - 目标顶点
 * @param {Array} path - 当前路径
 * @param {Set} visited - 已访问顶点
 * @param {Array} allPaths - 所有路径
 * @return {Array} 所有路径的数组
 */
export function dfsAllPaths(graph, start, target, path = [], visited = new Set(), allPaths = []) {
    visited.add(start);
    path.push(start);
    
    if (start === target) {
        allPaths.push([...path]); // 保存路径副本
        console.log(`找到路径: [${path.join(' -> ')}]`);
    } else {
        for (const neighbor of graph.getNeighbors(start)) {
            if (!visited.has(neighbor.vertex)) {
                dfsAllPaths(graph, neighbor.vertex, target, path, visited, allPaths);
            }
        }
    }
    
    // 回溯
    path.pop();
    visited.delete(start);
    
    return allPaths;
}

/**
 * DFS连通性检测
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @param {*} target - 目标顶点
 * @return {boolean} 是否连通
 */
export function isConnectedDFS(graph, start, target) {
    if (start === target) return true;
    
    const visited = new Set();
    
    function dfs(vertex) {
        visited.add(vertex);
        
        if (vertex === target) return true;
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                if (dfs(neighbor.vertex)) return true;
            }
        }
        
        return false;
    }
    
    return dfs(start);
}

/**
 * DFS统计连通分量
 * @param {AdjacencyListGraph} graph - 图对象
 * @return {number} 连通分量数量
 */
export function countConnectedComponentsDFS(graph) {
    const visited = new Set();
    const vertices = graph.getVertices();
    let componentCount = 0;
    
    function dfs(vertex) {
        visited.add(vertex);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                dfs(neighbor.vertex);
            }
        }
    }
    
    for (const vertex of vertices) {
        if (!visited.has(vertex)) {
            componentCount++;
            console.log(`发现连通分量 ${componentCount}，起始顶点: ${vertex}`);
            dfs(vertex);
        }
    }
    
    return componentCount;
}

/**
 * DFS获取所有连通分量
 * @param {AdjacencyListGraph} graph - 图对象
 * @return {Array} 连通分量数组
 */
export function getConnectedComponentsDFS(graph) {
    const visited = new Set();
    const vertices = graph.getVertices();
    const components = [];
    
    function dfs(vertex, component) {
        visited.add(vertex);
        component.push(vertex);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                dfs(neighbor.vertex, component);
            }
        }
    }
    
    for (const vertex of vertices) {
        if (!visited.has(vertex)) {
            const component = [];
            dfs(vertex, component);
            components.push(component);
        }
    }
    
    return components;
}

/**
 * DFS遍历并记录时间戳 - 用于高级算法
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Object} {discoveryTime, finishTime}
 */
export function dfsWithTimestamp(graph, start) {
    const visited = new Set();
    const discoveryTime = new Map();
    const finishTime = new Map();
    let time = 0;
    
    function dfs(vertex) {
        visited.add(vertex);
        discoveryTime.set(vertex, ++time);
        console.log(`发现顶点 ${vertex}，时间: ${time}`);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                dfs(neighbor.vertex);
            }
        }
        
        finishTime.set(vertex, ++time);
        console.log(`完成顶点 ${vertex}，时间: ${time}`);
    }
    
    // 遍历所有连通分量
    for (const vertex of graph.getVertices()) {
        if (!visited.has(vertex)) {
            dfs(vertex);
        }
    }
    
    return {discoveryTime, finishTime};
}

/**
 * DFS三色标记 - 用于环检测等高级算法
 * @param {AdjacencyListGraph} graph - 图对象
 * @return {Object} {colors, hasCycle}
 */
export function dfsThreeColors(graph) {
    const WHITE = 0; // 未访问
    const GRAY = 1;  // 正在访问
    const BLACK = 2; // 已完成
    
    const colors = new Map();
    let hasCycle = false;
    
    // 初始化所有顶点为白色
    for (const vertex of graph.getVertices()) {
        colors.set(vertex, WHITE);
    }
    
    function dfs(vertex) {
        colors.set(vertex, GRAY);
        console.log(`开始访问顶点 ${vertex} (灰色)`);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            const neighborColor = colors.get(neighbor.vertex);
            
            if (neighborColor === GRAY) {
                // 发现后向边，存在环
                console.log(`发现环: ${vertex} -> ${neighbor.vertex}`);
                hasCycle = true;
            } else if (neighborColor === WHITE) {
                dfs(neighbor.vertex);
            }
        }
        
        colors.set(vertex, BLACK);
        console.log(`完成访问顶点 ${vertex} (黑色)`);
    }
    
    // 遍历所有白色顶点
    for (const vertex of graph.getVertices()) {
        if (colors.get(vertex) === WHITE) {
            dfs(vertex);
        }
    }
    
    return {colors, hasCycle};
}

// 测试和演示
console.log('=== DFS基础实现演示 ===\n');

// 创建测试图
// 图结构：
//   0 --- 1 --- 4
//   |     |
//   2 --- 3     5 --- 6
const graph = new AdjacencyListGraph(false);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(2, 3);
graph.addEdge(5, 6); // 独立的连通分量

console.log('测试图结构：');
graph.printAdjList();

console.log('\n1. 递归DFS遍历：');
const recursiveResult = dfsRecursive(graph, 0);
console.log('遍历结果:', recursiveResult);

console.log('\n2. 迭代DFS遍历：');
const iterativeResult = dfsIterative(graph, 0);
console.log('遍历结果:', iterativeResult);

console.log('\n3. DFS路径查找：');
const path = dfsPath(graph, 0, 4);
console.log('最终路径:', path ? path.join(' -> ') : '无路径');

console.log('\n4. DFS查找所有路径：');
const allPaths = dfsAllPaths(graph, 0, 3);
console.log('所有路径:');
allPaths.forEach((path, index) => {
    console.log(`路径 ${index + 1}: ${path.join(' -> ')}`);
});

console.log('\n5. DFS连通性检测：');
console.log(`0 和 4 连通: ${isConnectedDFS(graph, 0, 4)}`);
console.log(`0 和 5 连通: ${isConnectedDFS(graph, 0, 5)}`);

console.log('\n6. DFS连通分量分析：');
console.log(`连通分量数量: ${countConnectedComponentsDFS(graph)}`);
const components = getConnectedComponentsDFS(graph);
console.log('所有连通分量:');
components.forEach((component, index) => {
    console.log(`分量 ${index + 1}: [${component.join(', ')}]`);
});

console.log('\n7. DFS时间戳：');
const {discoveryTime, finishTime} = dfsWithTimestamp(graph, 0);
console.log('时间戳信息:');
for (const vertex of graph.getVertices()) {
    const discovery = discoveryTime.get(vertex) || '未访问';
    const finish = finishTime.get(vertex) || '未完成';
    console.log(`顶点 ${vertex}: 发现时间=${discovery}, 完成时间=${finish}`);
}

// 创建有向图测试环检测
console.log('\n8. DFS三色标记（环检测）：');
const directedGraph = new AdjacencyListGraph(true);
directedGraph.addEdge(0, 1);
directedGraph.addEdge(1, 2);
directedGraph.addEdge(2, 0); // 形成环

console.log('有向图结构（含环）：');
directedGraph.printAdjList();

const {colors, hasCycle} = dfsThreeColors(directedGraph);
console.log(`是否存在环: ${hasCycle}`);

console.log('\n=== DFS算法分析 ===');
console.log('时间复杂度: O(V + E) - 每个顶点和边访问一次');
console.log('空间复杂度: O(h) - 递归栈深度或显式栈');
console.log('适用场景: 路径查找、环检测、拓扑排序、强连通分量');
console.log('核心思想: 深度探索，回溯搜索');
