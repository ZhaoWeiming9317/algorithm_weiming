/**
 * BFS基础实现 - 广度优先搜索的各种实现方式
 * 
 * BFS核心思想：
 * 1. 使用队列保证先进先出
 * 2. 从起始点开始，逐层扩展
 * 3. 先访问距离近的，再访问距离远的
 */

// 导入图的表示
import { AdjacencyListGraph } from '../Foundation/GraphRepresentation.js';

/**
 * 基础BFS遍历 - 访问所有可达顶点
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Array} 遍历顺序
 */
export function basicBFS(graph, start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const vertex = queue.shift(); // 出队
        result.push(vertex);
        
        console.log(`访问顶点: ${vertex}`);
        
        // 遍历所有邻居
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex); // 关键：入队时就标记访问
                queue.push(neighbor.vertex);
                console.log(`  将顶点 ${neighbor.vertex} 加入队列`);
            }
        }
        
        console.log(`  当前队列: [${queue.join(', ')}]`);
    }
    
    return result;
}

/**
 * BFS遍历 - 记录距离信息
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Map} 顶点到距离的映射
 */
export function bfsWithDistance(graph, start) {
    const visited = new Set();
    const distances = new Map();
    const queue = [{vertex: start, distance: 0}];
    
    visited.add(start);
    distances.set(start, 0);
    
    while (queue.length > 0) {
        const {vertex, distance} = queue.shift();
        
        console.log(`访问顶点 ${vertex}，距离: ${distance}`);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex);
                const newDistance = distance + 1;
                distances.set(neighbor.vertex, newDistance);
                queue.push({vertex: neighbor.vertex, distance: newDistance});
            }
        }
    }
    
    return distances;
}

/**
 * BFS遍历 - 记录路径信息
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Map} 顶点到路径的映射
 */
export function bfsWithPath(graph, start) {
    const visited = new Set();
    const paths = new Map();
    const queue = [{vertex: start, path: [start]}];
    
    visited.add(start);
    paths.set(start, [start]);
    
    while (queue.length > 0) {
        const {vertex, path} = queue.shift();
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex);
                const newPath = [...path, neighbor.vertex];
                paths.set(neighbor.vertex, newPath);
                queue.push({vertex: neighbor.vertex, path: newPath});
            }
        }
    }
    
    return paths;
}

/**
 * BFS遍历 - 使用前驱节点记录路径（更节省空间）
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Object} {distances, predecessors}
 */
export function bfsWithPredecessor(graph, start) {
    const visited = new Set();
    const distances = new Map();
    const predecessors = new Map();
    const queue = [start];
    
    visited.add(start);
    distances.set(start, 0);
    predecessors.set(start, null);
    
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
    
    return {distances, predecessors};
}

/**
 * 从前驱节点重建路径
 * @param {Map} predecessors - 前驱节点映射
 * @param {*} start - 起始顶点
 * @param {*} target - 目标顶点
 * @return {Array|null} 路径数组，如果无路径返回null
 */
export function reconstructPath(predecessors, start, target) {
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
 * BFS检测连通性
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @param {*} target - 目标顶点
 * @return {boolean} 是否连通
 */
export function isConnected(graph, start, target) {
    if (start === target) return true;
    
    const visited = new Set();
    const queue = [start];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (neighbor.vertex === target) {
                return true;
            }
            
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex);
                queue.push(neighbor.vertex);
            }
        }
    }
    
    return false;
}

/**
 * 统计连通分量数量
 * @param {AdjacencyListGraph} graph - 图对象
 * @return {number} 连通分量数量
 */
export function countConnectedComponents(graph) {
    const visited = new Set();
    const vertices = graph.getVertices();
    let componentCount = 0;
    
    for (const vertex of vertices) {
        if (!visited.has(vertex)) {
            // 发现新的连通分量
            componentCount++;
            
            // BFS遍历整个连通分量
            const queue = [vertex];
            visited.add(vertex);
            
            while (queue.length > 0) {
                const current = queue.shift();
                
                for (const neighbor of graph.getNeighbors(current)) {
                    if (!visited.has(neighbor.vertex)) {
                        visited.add(neighbor.vertex);
                        queue.push(neighbor.vertex);
                    }
                }
            }
        }
    }
    
    return componentCount;
}

/**
 * 获取所有连通分量
 * @param {AdjacencyListGraph} graph - 图对象
 * @return {Array} 连通分量数组
 */
export function getConnectedComponents(graph) {
    const visited = new Set();
    const vertices = graph.getVertices();
    const components = [];
    
    for (const vertex of vertices) {
        if (!visited.has(vertex)) {
            const component = [];
            const queue = [vertex];
            visited.add(vertex);
            
            while (queue.length > 0) {
                const current = queue.shift();
                component.push(current);
                
                for (const neighbor of graph.getNeighbors(current)) {
                    if (!visited.has(neighbor.vertex)) {
                        visited.add(neighbor.vertex);
                        queue.push(neighbor.vertex);
                    }
                }
            }
            
            components.push(component);
        }
    }
    
    return components;
}

/**
 * BFS层序遍历 - 按层返回结果
 * @param {AdjacencyListGraph} graph - 图对象
 * @param {*} start - 起始顶点
 * @return {Array} 按层分组的顶点数组
 */
export function bfsLevelOrder(graph, start) {
    const visited = new Set();
    const queue = [start];
    const levels = [];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const vertex = queue.shift();
            currentLevel.push(vertex);
            
            for (const neighbor of graph.getNeighbors(vertex)) {
                if (!visited.has(neighbor.vertex)) {
                    visited.add(neighbor.vertex);
                    queue.push(neighbor.vertex);
                }
            }
        }
        
        levels.push(currentLevel);
    }
    
    return levels;
}

// 测试和演示
console.log('=== BFS基础实现演示 ===\n');

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

console.log('\n1. 基础BFS遍历：');
const traversalResult = basicBFS(graph, 0);
console.log('遍历结果:', traversalResult);

console.log('\n2. BFS距离信息：');
const distances = bfsWithDistance(graph, 0);
console.log('距离信息:');
for (const [vertex, distance] of distances) {
    console.log(`顶点 ${vertex}: 距离 ${distance}`);
}

console.log('\n3. BFS路径信息：');
const paths = bfsWithPath(graph, 0);
console.log('路径信息:');
for (const [vertex, path] of paths) {
    console.log(`到顶点 ${vertex} 的路径: ${path.join(' -> ')}`);
}

console.log('\n4. 使用前驱节点记录路径：');
const {distances: dist2, predecessors} = bfsWithPredecessor(graph, 0);
console.log('重建路径:');
for (const vertex of [1, 2, 3, 4]) {
    const path = reconstructPath(predecessors, 0, vertex);
    console.log(`0 到 ${vertex}: ${path ? path.join(' -> ') : '无路径'}`);
}

console.log('\n5. 连通性检测：');
console.log(`0 和 4 连通: ${isConnected(graph, 0, 4)}`);
console.log(`0 和 5 连通: ${isConnected(graph, 0, 5)}`);

console.log('\n6. 连通分量分析：');
console.log(`连通分量数量: ${countConnectedComponents(graph)}`);
const components = getConnectedComponents(graph);
console.log('所有连通分量:');
components.forEach((component, index) => {
    console.log(`分量 ${index + 1}: [${component.join(', ')}]`);
});

console.log('\n7. 层序遍历：');
const levels = bfsLevelOrder(graph, 0);
console.log('按层遍历结果:');
levels.forEach((level, index) => {
    console.log(`第 ${index} 层: [${level.join(', ')}]`);
});

console.log('\n=== BFS算法分析 ===');
console.log('时间复杂度: O(V + E) - 每个顶点和边访问一次');
console.log('空间复杂度: O(V) - 队列和访问标记');
console.log('适用场景: 最短路径、层序遍历、连通性检测');
console.log('核心思想: 层序扩展，先近后远');
