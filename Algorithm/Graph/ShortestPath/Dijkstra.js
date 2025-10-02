/**
 * Dijkstra算法实现 - 单源最短路径算法
 * 
 * 适用条件：
 * 1. 加权有向图或无向图
 * 2. 所有边的权重必须非负
 * 3. 图必须连通（对于要到达的顶点）
 * 
 * 核心思想：
 * 贪心算法，每次选择距离源点最近的未访问顶点，
 * 并更新其邻居的最短距离
 */

import { AdjacencyListGraph } from '../Foundation/GraphRepresentation.js';

/**
 * 简单优先队列实现（最小堆）
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    push(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }
    
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].distance <= this.heap[index].distance) break;
            
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    heapifyDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.heap.length && 
                this.heap[leftChild].distance < this.heap[minIndex].distance) {
                minIndex = leftChild;
            }
            
            if (rightChild < this.heap.length && 
                this.heap[rightChild].distance < this.heap[minIndex].distance) {
                minIndex = rightChild;
            }
            
            if (minIndex === index) break;
            
            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
}

/**
 * Dijkstra算法 - 朴素实现 O(V²)
 * @param {AdjacencyListGraph} graph - 加权图
 * @param {*} source - 源顶点
 * @return {Object} {distances, predecessors}
 */
export function dijkstraNaive(graph, source) {
    const vertices = graph.getVertices();
    const distances = new Map();
    const predecessors = new Map();
    const visited = new Set();
    
    // 初始化距离
    for (const vertex of vertices) {
        distances.set(vertex, vertex === source ? 0 : Infinity);
        predecessors.set(vertex, null);
    }
    
    console.log('=== Dijkstra朴素实现 ===');
    console.log(`源顶点: ${source}`);
    
    for (let i = 0; i < vertices.length; i++) {
        // 找到未访问顶点中距离最小的
        let minVertex = null;
        let minDistance = Infinity;
        
        for (const vertex of vertices) {
            if (!visited.has(vertex) && distances.get(vertex) < minDistance) {
                minDistance = distances.get(vertex);
                minVertex = vertex;
            }
        }
        
        if (minVertex === null) break; // 所有可达顶点已访问
        
        visited.add(minVertex);
        console.log(`第${i + 1}步: 选择顶点 ${minVertex}，距离 ${minDistance}`);
        
        // 松弛所有邻居
        for (const neighbor of graph.getNeighbors(minVertex)) {
            const neighborVertex = neighbor.vertex;
            const weight = neighbor.weight;
            const newDistance = distances.get(minVertex) + weight;
            
            if (newDistance < distances.get(neighborVertex)) {
                distances.set(neighborVertex, newDistance);
                predecessors.set(neighborVertex, minVertex);
                console.log(`  松弛: ${neighborVertex} 距离更新为 ${newDistance}`);
            }
        }
        
        // 打印当前距离状态
        console.log('  当前距离:', Array.from(distances.entries())
            .map(([v, d]) => `${v}:${d === Infinity ? '∞' : d}`)
            .join(', '));
    }
    
    return {distances, predecessors};
}

/**
 * Dijkstra算法 - 优先队列优化 O((V+E)logV)
 * @param {AdjacencyListGraph} graph - 加权图
 * @param {*} source - 源顶点
 * @return {Object} {distances, predecessors}
 */
export function dijkstraOptimized(graph, source) {
    const distances = new Map();
    const predecessors = new Map();
    const pq = new MinHeap();
    
    // 初始化
    for (const vertex of graph.getVertices()) {
        distances.set(vertex, vertex === source ? 0 : Infinity);
        predecessors.set(vertex, null);
    }
    
    pq.push({vertex: source, distance: 0});
    
    console.log('\n=== Dijkstra优化实现 ===');
    console.log(`源顶点: ${source}`);
    
    let step = 1;
    while (!pq.isEmpty()) {
        const {vertex: currentVertex, distance: currentDistance} = pq.pop();
        
        // 如果这个距离已经过时，跳过
        if (currentDistance > distances.get(currentVertex)) {
            continue;
        }
        
        console.log(`第${step++}步: 处理顶点 ${currentVertex}，距离 ${currentDistance}`);
        
        // 松弛所有邻居
        for (const neighbor of graph.getNeighbors(currentVertex)) {
            const neighborVertex = neighbor.vertex;
            const weight = neighbor.weight;
            const newDistance = currentDistance + weight;
            
            if (newDistance < distances.get(neighborVertex)) {
                distances.set(neighborVertex, newDistance);
                predecessors.set(neighborVertex, currentVertex);
                pq.push({vertex: neighborVertex, distance: newDistance});
                console.log(`  松弛: ${neighborVertex} 距离更新为 ${newDistance}`);
            }
        }
    }
    
    return {distances, predecessors};
}

/**
 * 单对最短路径 - 找到两个特定顶点间的最短路径
 * @param {AdjacencyListGraph} graph - 加权图
 * @param {*} source - 源顶点
 * @param {*} target - 目标顶点
 * @return {Object} {distance, path}
 */
export function dijkstraSinglePair(graph, source, target) {
    const distances = new Map();
    const predecessors = new Map();
    const pq = new MinHeap();
    
    // 初始化
    for (const vertex of graph.getVertices()) {
        distances.set(vertex, vertex === source ? 0 : Infinity);
        predecessors.set(vertex, null);
    }
    
    pq.push({vertex: source, distance: 0});
    
    while (!pq.isEmpty()) {
        const {vertex: currentVertex, distance: currentDistance} = pq.pop();
        
        // 找到目标就可以提前结束
        if (currentVertex === target) {
            const path = reconstructPath(predecessors, source, target);
            return {
                distance: currentDistance,
                path: path
            };
        }
        
        if (currentDistance > distances.get(currentVertex)) {
            continue;
        }
        
        // 松弛邻居
        for (const neighbor of graph.getNeighbors(currentVertex)) {
            const neighborVertex = neighbor.vertex;
            const weight = neighbor.weight;
            const newDistance = currentDistance + weight;
            
            if (newDistance < distances.get(neighborVertex)) {
                distances.set(neighborVertex, newDistance);
                predecessors.set(neighborVertex, currentVertex);
                pq.push({vertex: neighborVertex, distance: newDistance});
            }
        }
    }
    
    return {distance: Infinity, path: null}; // 无路径
}

/**
 * K短路径 - 找到前K条最短路径
 * @param {AdjacencyListGraph} graph - 加权图
 * @param {*} source - 源顶点
 * @param {*} target - 目标顶点
 * @param {number} k - 路径数量
 * @return {Array} K条最短路径
 */
export function kShortestPaths(graph, source, target, k) {
    const paths = [];
    const pq = new MinHeap();
    
    // 初始路径
    pq.push({
        vertex: source,
        distance: 0,
        path: [source],
        visited: new Set([source])
    });
    
    while (!pq.isEmpty() && paths.length < k) {
        const {vertex, distance, path, visited} = pq.pop();
        
        if (vertex === target) {
            paths.push({distance, path: [...path]});
            continue;
        }
        
        // 扩展到邻居
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                const newVisited = new Set(visited);
                newVisited.add(neighbor.vertex);
                
                pq.push({
                    vertex: neighbor.vertex,
                    distance: distance + neighbor.weight,
                    path: [...path, neighbor.vertex],
                    visited: newVisited
                });
            }
        }
    }
    
    return paths;
}

/**
 * 重建路径
 * @param {Map} predecessors - 前驱节点映射
 * @param {*} source - 源顶点
 * @param {*} target - 目标顶点
 * @return {Array|null} 路径数组
 */
function reconstructPath(predecessors, source, target) {
    const path = [];
    let current = target;
    
    while (current !== null) {
        path.unshift(current);
        current = predecessors.get(current);
    }
    
    return path[0] === source ? path : null;
}

/**
 * 打印最短路径结果
 * @param {*} source - 源顶点
 * @param {Map} distances - 距离映射
 * @param {Map} predecessors - 前驱映射
 */
function printShortestPaths(source, distances, predecessors) {
    console.log(`\n从顶点 ${source} 的最短路径:`);
    
    for (const [vertex, distance] of distances) {
        if (vertex !== source) {
            const path = reconstructPath(predecessors, source, vertex);
            const pathStr = path ? path.join(' -> ') : '无路径';
            const distStr = distance === Infinity ? '∞' : distance;
            console.log(`到 ${vertex}: 距离 ${distStr}, 路径: ${pathStr}`);
        }
    }
}

// 测试和演示
console.log('=== Dijkstra算法演示 ===\n');

// 创建加权图
//     1
//   0 → 1
//   ↓ ↙ ↓ 4
//   2 → 3 → 4
//     2   1
const graph = new AdjacencyListGraph(true);
graph.addEdge(0, 1, 1);
graph.addEdge(0, 2, 4);
graph.addEdge(1, 2, 2);
graph.addEdge(1, 3, 5);
graph.addEdge(2, 3, 1);
graph.addEdge(3, 4, 3);

console.log('测试图结构:');
graph.printAdjList();

// 测试朴素实现
const result1 = dijkstraNaive(graph, 0);
printShortestPaths(0, result1.distances, result1.predecessors);

// 测试优化实现
const result2 = dijkstraOptimized(graph, 0);
printShortestPaths(0, result2.distances, result2.predecessors);

// 测试单对最短路径
console.log('\n=== 单对最短路径 ===');
const singlePairResult = dijkstraSinglePair(graph, 0, 4);
console.log(`从0到4: 距离 ${singlePairResult.distance}, 路径: ${singlePairResult.path.join(' -> ')}`);

// 测试K短路径
console.log('\n=== K短路径 ===');
const kPaths = kShortestPaths(graph, 0, 4, 3);
console.log(`从0到4的前3条最短路径:`);
kPaths.forEach((pathInfo, index) => {
    console.log(`路径 ${index + 1}: 距离 ${pathInfo.distance}, 路径: ${pathInfo.path.join(' -> ')}`);
});

console.log('\n=== Dijkstra算法总结 ===');
console.log('1. 朴素实现: O(V²)，适合稠密图');
console.log('2. 优化实现: O((V+E)logV)，适合稀疏图');
console.log('3. 单对路径: 可以提前终止，提高效率');
console.log('4. K短路径: 扩展应用，找到多条路径');
console.log('5. 限制条件: 不能处理负权边');
console.log('6. 应用场景: GPS导航、网络路由、游戏寻路');
