/**
 * 拓扑排序基础实现
 * 
 * 包含两种主要算法：
 * 1. Kahn算法(BFS) - 基于入度的拓扑排序
 * 2. DFS算法 - 基于深度优先搜索的拓扑排序
 */

import { AdjacencyListGraph } from '../Foundation/GraphRepresentation.js';

/**
 * Kahn算法 - 基于入度的拓扑排序(BFS实现)
 * 
 * 算法步骤：
 * 1. 计算所有顶点的入度
 * 2. 将入度为0的顶点加入队列
 * 3. 不断取出入度为0的顶点，减少其邻居的入度
 * 4. 重复直到队列为空
 * 
 * @param {AdjacencyListGraph} graph - 有向图
 * @return {Object} {topologicalOrder, hasCycle}
 */
export function topologicalSortKahn(graph) {
    const vertices = graph.getVertices();
    const inDegree = new Map();
    const queue = [];
    const result = [];
    
    // 1. 初始化所有顶点的入度为0
    for (const vertex of vertices) {
        inDegree.set(vertex, 0);
    }
    
    // 2. 计算每个顶点的入度
    for (const vertex of vertices) {
        for (const neighbor of graph.getNeighbors(vertex)) {
            inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) + 1);
        }
    }
    
    console.log('初始入度:');
    for (const [vertex, degree] of inDegree) {
        console.log(`顶点 ${vertex}: 入度 ${degree}`);
    }
    
    // 3. 将所有入度为0的顶点加入队列
    for (const [vertex, degree] of inDegree) {
        if (degree === 0) {
            queue.push(vertex);
            console.log(`将入度为0的顶点 ${vertex} 加入队列`);
        }
    }
    
    // 4. BFS处理
    while (queue.length > 0) {
        const vertex = queue.shift();
        result.push(vertex);
        console.log(`处理顶点 ${vertex}，当前结果: [${result.join(', ')}]`);
        
        // 减少所有邻居的入度
        for (const neighbor of graph.getNeighbors(vertex)) {
            const neighborVertex = neighbor.vertex;
            inDegree.set(neighborVertex, inDegree.get(neighborVertex) - 1);
            console.log(`  顶点 ${neighborVertex} 的入度减为 ${inDegree.get(neighborVertex)}`);
            
            // 如果邻居的入度变为0，加入队列
            if (inDegree.get(neighborVertex) === 0) {
                queue.push(neighborVertex);
                console.log(`  将顶点 ${neighborVertex} 加入队列`);
            }
        }
        
        console.log(`  当前队列: [${queue.join(', ')}]`);
    }
    
    // 检查是否存在环
    const hasCycle = result.length !== vertices.length;
    
    return {
        topologicalOrder: hasCycle ? [] : result,
        hasCycle,
        processedCount: result.length,
        totalCount: vertices.length
    };
}

/**
 * DFS算法 - 基于深度优先搜索的拓扑排序
 * 
 * 算法步骤：
 * 1. 对每个未访问的顶点进行DFS
 * 2. 在DFS的后序位置将顶点加入结果
 * 3. 反转结果得到拓扑排序
 * 
 * @param {AdjacencyListGraph} graph - 有向图
 * @return {Object} {topologicalOrder, hasCycle}
 */
export function topologicalSortDFS(graph) {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const colors = new Map();
    const result = [];
    let hasCycle = false;
    
    // 初始化所有顶点为白色
    for (const vertex of graph.getVertices()) {
        colors.set(vertex, WHITE);
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
                hasCycle = true;
                return;
            } else if (neighborColor === WHITE) {
                dfs(neighborVertex);
                if (hasCycle) return; // 提前终止
            }
        }
        
        colors.set(vertex, BLACK);
        result.push(vertex); // 在后序位置添加到结果
        console.log(`完成访问顶点 ${vertex} (黑色)，加入结果`);
    }
    
    // 对所有白色顶点进行DFS
    for (const vertex of graph.getVertices()) {
        if (colors.get(vertex) === WHITE) {
            dfs(vertex);
            if (hasCycle) break; // 发现环就停止
        }
    }
    
    return {
        topologicalOrder: hasCycle ? [] : result.reverse(),
        hasCycle
    };
}

/**
 * 字典序最小的拓扑排序 - 使用优先队列
 * @param {AdjacencyListGraph} graph - 有向图
 * @return {Array} 字典序最小的拓扑排序
 */
export function topologicalSortLexicographical(graph) {
    const vertices = graph.getVertices();
    const inDegree = new Map();
    const result = [];
    
    // 计算入度
    for (const vertex of vertices) {
        inDegree.set(vertex, 0);
    }
    
    for (const vertex of vertices) {
        for (const neighbor of graph.getNeighbors(vertex)) {
            inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) + 1);
        }
    }
    
    // 使用最小堆(这里用数组模拟，每次取最小值)
    while (result.length < vertices.length) {
        // 找到入度为0且值最小的顶点
        let minVertex = null;
        for (const [vertex, degree] of inDegree) {
            if (degree === 0 && (minVertex === null || vertex < minVertex)) {
                minVertex = vertex;
            }
        }
        
        if (minVertex === null) {
            // 没有入度为0的顶点，存在环
            return [];
        }
        
        // 处理选中的顶点
        result.push(minVertex);
        inDegree.delete(minVertex);
        
        // 减少其邻居的入度
        for (const neighbor of graph.getNeighbors(minVertex)) {
            if (inDegree.has(neighbor.vertex)) {
                inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) - 1);
            }
        }
    }
    
    return result;
}

/**
 * 生成所有可能的拓扑排序 - 回溯算法
 * @param {AdjacencyListGraph} graph - 有向图
 * @return {Array} 所有可能的拓扑排序
 */
export function allTopologicalSorts(graph) {
    const vertices = graph.getVertices();
    const inDegree = new Map();
    const allSorts = [];
    
    // 计算入度
    for (const vertex of vertices) {
        inDegree.set(vertex, 0);
    }
    
    for (const vertex of vertices) {
        for (const neighbor of graph.getNeighbors(vertex)) {
            inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) + 1);
        }
    }
    
    function backtrack(currentSort) {
        if (currentSort.length === vertices.length) {
            allSorts.push([...currentSort]);
            return;
        }
        
        // 找到所有入度为0的顶点
        const candidates = [];
        for (const [vertex, degree] of inDegree) {
            if (degree === 0) {
                candidates.push(vertex);
            }
        }
        
        // 尝试每个候选顶点
        for (const vertex of candidates) {
            // 选择
            currentSort.push(vertex);
            inDegree.delete(vertex);
            
            // 减少邻居的入度
            const neighbors = graph.getNeighbors(vertex);
            for (const neighbor of neighbors) {
                if (inDegree.has(neighbor.vertex)) {
                    inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) - 1);
                }
            }
            
            // 递归
            backtrack(currentSort);
            
            // 回溯
            currentSort.pop();
            inDegree.set(vertex, 0);
            
            // 恢复邻居的入度
            for (const neighbor of neighbors) {
                if (inDegree.has(neighbor.vertex)) {
                    inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) + 1);
                }
            }
        }
    }
    
    backtrack([]);
    return allSorts;
}

/**
 * 检测图是否为DAG(有向无环图)
 * @param {AdjacencyListGraph} graph - 有向图
 * @return {boolean} 是否为DAG
 */
export function isDAG(graph) {
    const result = topologicalSortKahn(graph);
    return !result.hasCycle;
}

/**
 * 拓扑排序的逆序 - 找到依赖关系的逆序
 * @param {Array} topologicalOrder - 拓扑排序结果
 * @return {Array} 逆拓扑排序
 */
export function reverseTopologicalOrder(topologicalOrder) {
    return [...topologicalOrder].reverse();
}

// 测试和演示
console.log('=== 拓扑排序算法演示 ===\n');

// 创建测试DAG
// 图结构：
//   0 -> 1 -> 3
//   |    |
//   v    v
//   2 -> 4
console.log('1. 测试DAG（有向无环图）：');
const dag = new AdjacencyListGraph(true);
dag.addEdge(0, 1);
dag.addEdge(0, 2);
dag.addEdge(1, 3);
dag.addEdge(1, 4);
dag.addEdge(2, 4);

console.log('DAG结构：');
dag.printAdjList();

console.log('\nKahn算法结果：');
const kahnResult = topologicalSortKahn(dag);
console.log(`拓扑排序: [${kahnResult.topologicalOrder.join(', ')}]`);
console.log(`是否有环: ${kahnResult.hasCycle}`);

console.log('\nDFS算法结果：');
const dfsResult = topologicalSortDFS(dag);
console.log(`拓扑排序: [${dfsResult.topologicalOrder.join(', ')}]`);
console.log(`是否有环: ${dfsResult.hasCycle}`);

console.log('\n字典序最小的拓扑排序：');
const lexResult = topologicalSortLexicographical(dag);
console.log(`字典序最小: [${lexResult.join(', ')}]`);

console.log('\n所有可能的拓扑排序：');
const allSorts = allTopologicalSorts(dag);
console.log(`总共 ${allSorts.length} 种拓扑排序：`);
allSorts.forEach((sort, index) => {
    console.log(`  ${index + 1}: [${sort.join(', ')}]`);
});

// 创建有环图测试
console.log('\n2. 测试有环图：');
const cyclicGraph = new AdjacencyListGraph(true);
cyclicGraph.addEdge(0, 1);
cyclicGraph.addEdge(1, 2);
cyclicGraph.addEdge(2, 0); // 形成环

console.log('有环图结构：');
cyclicGraph.printAdjList();

console.log('\nKahn算法检测环：');
const cyclicKahnResult = topologicalSortKahn(cyclicGraph);
console.log(`是否有环: ${cyclicKahnResult.hasCycle}`);
console.log(`处理顶点数: ${cyclicKahnResult.processedCount}/${cyclicKahnResult.totalCount}`);

console.log('\nDFS算法检测环：');
const cyclicDfsResult = topologicalSortDFS(cyclicGraph);
console.log(`是否有环: ${cyclicDfsResult.hasCycle}`);

console.log('\n3. DAG检测：');
console.log(`第一个图是DAG: ${isDAG(dag)}`);
console.log(`第二个图是DAG: ${isDAG(cyclicGraph)}`);

console.log('\n=== 拓扑排序算法总结 ===');
console.log('1. Kahn算法(BFS): 基于入度，直观易懂，便于检测环');
console.log('2. DFS算法: 基于后序遍历，递归实现简洁');
console.log('3. 字典序最小: 使用优先队列保证字典序');
console.log('4. 所有排序: 回溯算法枚举所有可能');
console.log('5. 时间复杂度: O(V + E)');
console.log('6. 空间复杂度: O(V)');
console.log('7. 应用: 课程安排、任务调度、依赖关系分析');
