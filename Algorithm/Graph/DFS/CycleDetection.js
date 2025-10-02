/**
 * 图中的环检测 - 使用DFS检测有向图和无向图中的环
 * 
 * 环检测的重要性：
 * 1. 拓扑排序的前提条件（DAG）
 * 2. 依赖关系验证
 * 3. 死锁检测
 * 4. 图的结构分析
 */

import { AdjacencyListGraph } from '../Foundation/GraphRepresentation.js';

/**
 * 无向图环检测 - 使用DFS
 * 
 * 原理：在无向图中，如果DFS过程中遇到一个已访问的顶点，
 * 且该顶点不是当前顶点的父节点，则存在环
 * 
 * @param {AdjacencyListGraph} graph - 无向图
 * @return {Object} {hasCycle, cycleEdge}
 */
export function detectCycleUndirected(graph) {
    const visited = new Set();
    let cycleEdge = null;
    
    function dfs(vertex, parent) {
        visited.add(vertex);
        console.log(`访问顶点 ${vertex}，父节点: ${parent}`);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            const neighborVertex = neighbor.vertex;
            
            if (!visited.has(neighborVertex)) {
                // 递归访问未访问的邻居
                if (dfs(neighborVertex, vertex)) {
                    return true;
                }
            } else if (neighborVertex !== parent) {
                // 发现环：访问到已访问的非父节点
                console.log(`发现环: ${vertex} -> ${neighborVertex}`);
                cycleEdge = [vertex, neighborVertex];
                return true;
            }
        }
        
        return false;
    }
    
    // 检查所有连通分量
    for (const vertex of graph.getVertices()) {
        if (!visited.has(vertex)) {
            if (dfs(vertex, null)) {
                return {hasCycle: true, cycleEdge};
            }
        }
    }
    
    return {hasCycle: false, cycleEdge: null};
}

/**
 * 有向图环检测 - 使用三色DFS
 * 
 * 原理：使用三种颜色标记顶点状态
 * - 白色(0)：未访问
 * - 灰色(1)：正在访问（在当前DFS路径中）
 * - 黑色(2)：已完成访问
 * 
 * 如果在DFS过程中遇到灰色顶点，说明存在后向边，即环
 * 
 * @param {AdjacencyListGraph} graph - 有向图
 * @return {Object} {hasCycle, cycle}
 */
export function detectCycleDirected(graph) {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const colors = new Map();
    const parent = new Map();
    let cycle = null;
    
    // 初始化所有顶点为白色
    for (const vertex of graph.getVertices()) {
        colors.set(vertex, WHITE);
        parent.set(vertex, null);
    }
    
    function dfs(vertex) {
        colors.set(vertex, GRAY);
        console.log(`开始访问顶点 ${vertex} (灰色)`);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            const neighborVertex = neighbor.vertex;
            const neighborColor = colors.get(neighborVertex);
            
            if (neighborColor === GRAY) {
                // 发现后向边，存在环
                console.log(`发现环: ${vertex} -> ${neighborVertex}`);
                cycle = reconstructCycle(parent, vertex, neighborVertex);
                return true;
            } else if (neighborColor === WHITE) {
                parent.set(neighborVertex, vertex);
                if (dfs(neighborVertex)) {
                    return true;
                }
            }
            // 黑色顶点表示已完成，不需要处理
        }
        
        colors.set(vertex, BLACK);
        console.log(`完成访问顶点 ${vertex} (黑色)`);
        return false;
    }
    
    // 检查所有白色顶点
    for (const vertex of graph.getVertices()) {
        if (colors.get(vertex) === WHITE) {
            if (dfs(vertex)) {
                return {hasCycle: true, cycle};
            }
        }
    }
    
    return {hasCycle: false, cycle: null};
}

/**
 * 重建环路径
 */
function reconstructCycle(parent, start, end) {
    const cycle = [end];
    let current = start;
    
    while (current !== end && current !== null) {
        cycle.unshift(current);
        current = parent.get(current);
    }
    
    cycle.unshift(end); // 闭合环
    return cycle;
}

/**
 * 使用Union-Find检测无向图中的环
 * 
 * 原理：对于无向图的每条边(u,v)，如果u和v已经在同一个集合中，
 * 说明添加这条边会形成环
 * 
 * @param {AdjacencyListGraph} graph - 无向图
 * @return {boolean} 是否存在环
 */
export function detectCycleUnionFind(graph) {
    const parent = new Map();
    const rank = new Map();
    
    // 初始化Union-Find
    function makeSet(vertex) {
        parent.set(vertex, vertex);
        rank.set(vertex, 0);
    }
    
    function find(vertex) {
        if (parent.get(vertex) !== vertex) {
            parent.set(vertex, find(parent.get(vertex))); // 路径压缩
        }
        return parent.get(vertex);
    }
    
    function union(u, v) {
        const rootU = find(u);
        const rootV = find(v);
        
        if (rootU === rootV) return false; // 已在同一集合，形成环
        
        // 按秩合并
        if (rank.get(rootU) < rank.get(rootV)) {
            parent.set(rootU, rootV);
        } else if (rank.get(rootU) > rank.get(rootV)) {
            parent.set(rootV, rootU);
        } else {
            parent.set(rootV, rootU);
            rank.set(rootU, rank.get(rootU) + 1);
        }
        
        return true;
    }
    
    // 初始化所有顶点
    for (const vertex of graph.getVertices()) {
        makeSet(vertex);
    }
    
    // 检查所有边
    const edges = new Set(); // 避免重复检查无向边
    
    for (const vertex of graph.getVertices()) {
        for (const neighbor of graph.getNeighbors(vertex)) {
            const edge = vertex < neighbor.vertex ? 
                `${vertex}-${neighbor.vertex}` : 
                `${neighbor.vertex}-${vertex}`;
            
            if (!edges.has(edge)) {
                edges.add(edge);
                
                if (!union(vertex, neighbor.vertex)) {
                    console.log(`发现环，边: ${vertex} - ${neighbor.vertex}`);
                    return true;
                }
            }
        }
    }
    
    return false;
}

/**
 * 检测图中所有的环 - 使用DFS
 * @param {AdjacencyListGraph} graph - 图对象
 * @return {Array} 所有环的数组
 */
export function findAllCycles(graph) {
    const visited = new Set();
    const path = [];
    const pathSet = new Set();
    const cycles = [];
    
    function dfs(vertex) {
        if (pathSet.has(vertex)) {
            // 发现环，提取环路径
            const cycleStart = path.indexOf(vertex);
            const cycle = path.slice(cycleStart);
            cycle.push(vertex); // 闭合环
            cycles.push([...cycle]);
            console.log(`发现环: ${cycle.join(' -> ')}`);
            return;
        }
        
        if (visited.has(vertex)) return;
        
        visited.add(vertex);
        path.push(vertex);
        pathSet.add(vertex);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            dfs(neighbor.vertex);
        }
        
        path.pop();
        pathSet.delete(vertex);
    }
    
    for (const vertex of graph.getVertices()) {
        if (!visited.has(vertex)) {
            dfs(vertex);
        }
    }
    
    return cycles;
}

/**
 * 检测最小环 - 在无权图中找到最小的环
 * @param {AdjacencyListGraph} graph - 图对象
 * @return {Object} {minCycleLength, minCycle}
 */
export function findMinimumCycle(graph) {
    let minCycleLength = Infinity;
    let minCycle = null;
    
    // 对每个顶点作为起点进行BFS
    for (const start of graph.getVertices()) {
        const distances = new Map();
        const parent = new Map();
        const queue = [start];
        
        distances.set(start, 0);
        parent.set(start, null);
        
        while (queue.length > 0) {
            const vertex = queue.shift();
            
            for (const neighbor of graph.getNeighbors(vertex)) {
                const neighborVertex = neighbor.vertex;
                
                if (!distances.has(neighborVertex)) {
                    distances.set(neighborVertex, distances.get(vertex) + 1);
                    parent.set(neighborVertex, vertex);
                    queue.push(neighborVertex);
                } else if (parent.get(vertex) !== neighborVertex) {
                    // 发现环
                    const cycleLength = distances.get(vertex) + distances.get(neighborVertex) + 1;
                    
                    if (cycleLength < minCycleLength) {
                        minCycleLength = cycleLength;
                        // 重建环路径
                        minCycle = reconstructMinCyclePath(parent, start, vertex, neighborVertex);
                    }
                }
            }
        }
    }
    
    return {
        minCycleLength: minCycleLength === Infinity ? -1 : minCycleLength,
        minCycle
    };
}

/**
 * 重建最小环路径
 */
function reconstructMinCyclePath(parent, start, u, v) {
    const pathU = [];
    const pathV = [];
    
    // 从u回溯到start
    let current = u;
    while (current !== start) {
        pathU.unshift(current);
        current = parent.get(current);
    }
    pathU.unshift(start);
    
    // 从v回溯到start
    current = v;
    while (current !== start) {
        pathV.unshift(current);
        current = parent.get(current);
    }
    pathV.unshift(start);
    
    // 合并路径形成环
    const cycle = [...pathU];
    for (let i = pathV.length - 2; i >= 0; i--) {
        cycle.push(pathV[i]);
    }
    
    return cycle;
}

// 测试和演示
console.log('=== 图中环检测算法演示 ===\n');

// 1. 无向图环检测
console.log('1. 无向图环检测：');

// 创建无环的无向图
const undirectedGraphNoCycle = new AdjacencyListGraph(false);
undirectedGraphNoCycle.addEdge(0, 1);
undirectedGraphNoCycle.addEdge(1, 2);
undirectedGraphNoCycle.addEdge(2, 3);

console.log('无环无向图：');
undirectedGraphNoCycle.printAdjList();
const result1 = detectCycleUndirected(undirectedGraphNoCycle);
console.log(`是否存在环: ${result1.hasCycle}`);

// 创建有环的无向图
const undirectedGraphWithCycle = new AdjacencyListGraph(false);
undirectedGraphWithCycle.addEdge(0, 1);
undirectedGraphWithCycle.addEdge(1, 2);
undirectedGraphWithCycle.addEdge(2, 3);
undirectedGraphWithCycle.addEdge(3, 0); // 形成环

console.log('\n有环无向图：');
undirectedGraphWithCycle.printAdjList();
const result2 = detectCycleUndirected(undirectedGraphWithCycle);
console.log(`是否存在环: ${result2.hasCycle}`);
if (result2.cycleEdge) {
    console.log(`环边: ${result2.cycleEdge.join(' - ')}`);
}

// 2. 有向图环检测
console.log('\n2. 有向图环检测：');

// 创建无环的有向图(DAG)
const directedGraphNoCycle = new AdjacencyListGraph(true);
directedGraphNoCycle.addEdge(0, 1);
directedGraphNoCycle.addEdge(1, 2);
directedGraphNoCycle.addEdge(2, 3);

console.log('无环有向图(DAG)：');
directedGraphNoCycle.printAdjList();
const result3 = detectCycleDirected(directedGraphNoCycle);
console.log(`是否存在环: ${result3.hasCycle}`);

// 创建有环的有向图
const directedGraphWithCycle = new AdjacencyListGraph(true);
directedGraphWithCycle.addEdge(0, 1);
directedGraphWithCycle.addEdge(1, 2);
directedGraphWithCycle.addEdge(2, 3);
directedGraphWithCycle.addEdge(3, 1); // 形成环

console.log('\n有环有向图：');
directedGraphWithCycle.printAdjList();
const result4 = detectCycleDirected(directedGraphWithCycle);
console.log(`是否存在环: ${result4.hasCycle}`);
if (result4.cycle) {
    console.log(`环路径: ${result4.cycle.join(' -> ')}`);
}

// 3. Union-Find环检测
console.log('\n3. Union-Find环检测：');
const result5 = detectCycleUnionFind(undirectedGraphWithCycle);
console.log(`Union-Find检测结果: ${result5}`);

// 4. 最小环检测
console.log('\n4. 最小环检测：');
const {minCycleLength, minCycle} = findMinimumCycle(undirectedGraphWithCycle);
console.log(`最小环长度: ${minCycleLength}`);
if (minCycle) {
    console.log(`最小环路径: ${minCycle.join(' -> ')}`);
}

console.log('\n=== 环检测算法总结 ===');
console.log('1. 无向图DFS: O(V+E)，检测父节点以外的已访问节点');
console.log('2. 有向图三色DFS: O(V+E)，检测后向边（灰色节点）');
console.log('3. Union-Find: O(E⋅α(V))，检测边连接的顶点是否在同一集合');
console.log('4. 最小环BFS: O(V⋅(V+E))，对每个顶点进行BFS');
console.log('5. 应用：拓扑排序前置条件、依赖关系验证、死锁检测');
