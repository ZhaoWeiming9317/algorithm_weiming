/**
 * Bellman-Ford算法实现 - 单源最短路径算法
 * 
 * 适用条件：
 * 1. 加权有向图或无向图
 * 2. 可以处理负权边
 * 3. 能检测负权环
 * 
 * 核心思想：
 * 动态规划思想，对所有边进行V-1次松弛操作，
 * 如果第V次松弛还能更新距离，说明存在负权环
 */

import { AdjacencyListGraph } from '../Foundation/GraphRepresentation.js';

/**
 * Bellman-Ford算法 - 标准实现
 * @param {AdjacencyListGraph} graph - 加权图
 * @param {*} source - 源顶点
 * @return {Object} {distances, predecessors, hasNegativeCycle}
 */
export function bellmanFord(graph, source) {
    const vertices = graph.getVertices();
    const distances = new Map();
    const predecessors = new Map();
    
    // 初始化距离
    for (const vertex of vertices) {
        distances.set(vertex, vertex === source ? 0 : Infinity);
        predecessors.set(vertex, null);
    }
    
    console.log('=== Bellman-Ford算法 ===');
    console.log(`源顶点: ${source}`);
    console.log(`顶点数: ${vertices.length}`);
    
    // 获取所有边
    const edges = [];
    for (const vertex of vertices) {
        for (const neighbor of graph.getNeighbors(vertex)) {
            edges.push({
                from: vertex,
                to: neighbor.vertex,
                weight: neighbor.weight
            });
        }
    }
    
    console.log(`边数: ${edges.length}`);
    console.log('所有边:', edges.map(e => `${e.from}->${e.to}(${e.weight})`).join(', '));
    
    // 进行V-1次松弛
    for (let i = 0; i < vertices.length - 1; i++) {
        let updated = false;
        console.log(`\n第 ${i + 1} 轮松弛:`);
        
        for (const edge of edges) {
            const {from, to, weight} = edge;
            
            if (distances.get(from) !== Infinity) {
                const newDistance = distances.get(from) + weight;
                
                if (newDistance < distances.get(to)) {
                    distances.set(to, newDistance);
                    predecessors.set(to, from);
                    updated = true;
                    console.log(`  松弛边 ${from}->${to}: 距离更新为 ${newDistance}`);
                }
            }
        }
        
        if (!updated) {
            console.log(`  本轮无更新，提前结束`);
            break;
        }
        
        // 打印当前距离
        console.log('  当前距离:', Array.from(distances.entries())
            .map(([v, d]) => `${v}:${d === Infinity ? '∞' : d}`)
            .join(', '));
    }
    
    // 检测负权环
    console.log('\n检测负权环:');
    let hasNegativeCycle = false;
    const negativeCycleVertices = new Set();
    
    for (const edge of edges) {
        const {from, to, weight} = edge;
        
        if (distances.get(from) !== Infinity) {
            const newDistance = distances.get(from) + weight;
            
            if (newDistance < distances.get(to)) {
                hasNegativeCycle = true;
                negativeCycleVertices.add(to);
                console.log(`发现负权环影响的顶点: ${to}`);
            }
        }
    }
    
    return {
        distances,
        predecessors,
        hasNegativeCycle,
        negativeCycleVertices
    };
}

/**
 * SPFA算法 - Bellman-Ford的队列优化
 * @param {AdjacencyListGraph} graph - 加权图
 * @param {*} source - 源顶点
 * @return {Object} {distances, predecessors, hasNegativeCycle}
 */
export function SPFA(graph, source) {
    const vertices = graph.getVertices();
    const distances = new Map();
    const predecessors = new Map();
    const inQueue = new Set();
    const relaxCount = new Map(); // 记录每个顶点被松弛的次数
    const queue = [source];
    
    // 初始化
    for (const vertex of vertices) {
        distances.set(vertex, vertex === source ? 0 : Infinity);
        predecessors.set(vertex, null);
        relaxCount.set(vertex, 0);
    }
    
    inQueue.add(source);
    
    console.log('\n=== SPFA算法 ===');
    console.log(`源顶点: ${source}`);
    
    let iteration = 0;
    while (queue.length > 0) {
        iteration++;
        const vertex = queue.shift();
        inQueue.delete(vertex);
        
        console.log(`第${iteration}次迭代: 处理顶点 ${vertex}`);
        
        // 松弛所有邻居
        for (const neighbor of graph.getNeighbors(vertex)) {
            const neighborVertex = neighbor.vertex;
            const weight = neighbor.weight;
            const newDistance = distances.get(vertex) + weight;
            
            if (newDistance < distances.get(neighborVertex)) {
                distances.set(neighborVertex, newDistance);
                predecessors.set(neighborVertex, vertex);
                relaxCount.set(neighborVertex, relaxCount.get(neighborVertex) + 1);
                
                console.log(`  松弛: ${neighborVertex} 距离更新为 ${newDistance}`);
                
                // 检测负权环：如果一个顶点被松弛超过V-1次，说明存在负权环
                if (relaxCount.get(neighborVertex) >= vertices.length) {
                    console.log(`检测到负权环: 顶点 ${neighborVertex} 被松弛 ${relaxCount.get(neighborVertex)} 次`);
                    return {
                        distances: new Map(),
                        predecessors: new Map(),
                        hasNegativeCycle: true
                    };
                }
                
                // 如果邻居不在队列中，加入队列
                if (!inQueue.has(neighborVertex)) {
                    queue.push(neighborVertex);
                    inQueue.add(neighborVertex);
                }
            }
        }
        
        console.log(`  当前队列: [${Array.from(queue).join(', ')}]`);
    }
    
    return {
        distances,
        predecessors,
        hasNegativeCycle: false
    };
}

/**
 * 差分约束系统求解
 * 将不等式组转换为最短路径问题
 * @param {Array} constraints - 约束条件 [{from, to, weight}]
 * @param {number} numVariables - 变量数量
 * @return {Object} {solution, feasible}
 */
export function solveDifferenceConstraints(constraints, numVariables) {
    // 创建图：添加超级源点
    const graph = new AdjacencyListGraph(true);
    const superSource = 's';
    
    // 添加超级源点到所有变量的边，权重为0
    for (let i = 0; i < numVariables; i++) {
        graph.addEdge(superSource, i, 0);
    }
    
    // 添加约束边：xi - xj <= c 转换为 xj -> xi 权重为 c
    for (const constraint of constraints) {
        graph.addEdge(constraint.to, constraint.from, constraint.weight);
    }
    
    console.log('\n=== 差分约束系统 ===');
    console.log('约束条件:');
    constraints.forEach((c, i) => {
        console.log(`  x${c.from} - x${c.to} <= ${c.weight}`);
    });
    
    // 使用Bellman-Ford求解
    const result = bellmanFord(graph, superSource);
    
    if (result.hasNegativeCycle) {
        console.log('系统无解：存在负权环');
        return {solution: null, feasible: false};
    }
    
    // 提取解
    const solution = [];
    for (let i = 0; i < numVariables; i++) {
        solution[i] = result.distances.get(i);
    }
    
    console.log('系统有解:');
    solution.forEach((val, i) => {
        console.log(`  x${i} = ${val}`);
    });
    
    return {solution, feasible: true};
}

/**
 * 汇率套利检测
 * 检测货币兑换中是否存在套利机会
 * @param {Array} currencies - 货币列表
 * @param {Array} rates - 汇率矩阵
 * @return {Object} {hasArbitrage, cycle}
 */
export function detectCurrencyArbitrage(currencies, rates) {
    const n = currencies.length;
    const graph = new AdjacencyListGraph(true);
    
    // 构建图：权重为 -log(汇率)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j && rates[i][j] > 0) {
                const weight = -Math.log(rates[i][j]);
                graph.addEdge(i, j, weight);
            }
        }
    }
    
    console.log('\n=== 汇率套利检测 ===');
    console.log('货币:', currencies);
    console.log('汇率矩阵:');
    rates.forEach((row, i) => {
        console.log(`  ${currencies[i]}: [${row.join(', ')}]`);
    });
    
    // 使用Bellman-Ford检测负权环
    const result = bellmanFord(graph, 0);
    
    if (result.hasNegativeCycle) {
        console.log('发现套利机会！存在负权环');
        return {hasArbitrage: true, cycle: findNegativeCycle(graph, result)};
    } else {
        console.log('无套利机会');
        return {hasArbitrage: false, cycle: null};
    }
}

/**
 * 查找负权环
 */
function findNegativeCycle(graph, bellmanResult) {
    // 简化实现：返回受负权环影响的顶点
    return Array.from(bellmanResult.negativeCycleVertices);
}

/**
 * 重建路径
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
console.log('=== Bellman-Ford算法演示 ===\n');

// 1. 测试正常图（无负权环）
console.log('1. 测试正常图:');
const graph1 = new AdjacencyListGraph(true);
graph1.addEdge(0, 1, -1);
graph1.addEdge(0, 2, 4);
graph1.addEdge(1, 2, 3);
graph1.addEdge(1, 3, 2);
graph1.addEdge(1, 4, 2);
graph1.addEdge(3, 2, 5);
graph1.addEdge(3, 1, 1);
graph1.addEdge(4, 3, -3);

console.log('图结构:');
graph1.printAdjList();

const result1 = bellmanFord(graph1, 0);
if (!result1.hasNegativeCycle) {
    printShortestPaths(0, result1.distances, result1.predecessors);
}

// 2. 测试SPFA算法
const result2 = SPFA(graph1, 0);
if (!result2.hasNegativeCycle) {
    printShortestPaths(0, result2.distances, result2.predecessors);
}

// 3. 测试负权环图
console.log('\n2. 测试负权环图:');
const graph2 = new AdjacencyListGraph(true);
graph2.addEdge(0, 1, 1);
graph2.addEdge(1, 2, -3);
graph2.addEdge(2, 3, 2);
graph2.addEdge(3, 1, -1); // 形成负权环

console.log('负权环图结构:');
graph2.printAdjList();

const result3 = bellmanFord(graph2, 0);
console.log(`存在负权环: ${result3.hasNegativeCycle}`);

// 4. 差分约束系统
console.log('\n3. 差分约束系统:');
// 约束: x1 - x0 <= 0, x0 - x1 <= 1, x2 - x0 <= 5
const constraints = [
    {from: 1, to: 0, weight: 0},   // x1 - x0 <= 0
    {from: 0, to: 1, weight: 1},   // x0 - x1 <= 1
    {from: 2, to: 0, weight: 5}    // x2 - x0 <= 5
];

solveDifferenceConstraints(constraints, 3);

// 5. 汇率套利检测
console.log('\n4. 汇率套利检测:');
const currencies = ['USD', 'EUR', 'GBP'];
const rates = [
    [1.0, 0.85, 0.75],    // USD to others
    [1.18, 1.0, 0.88],    // EUR to others  
    [1.33, 1.14, 1.0]     // GBP to others
];

detectCurrencyArbitrage(currencies, rates);

console.log('\n=== Bellman-Ford算法总结 ===');
console.log('1. 标准Bellman-Ford: O(VE)，能处理负权边和检测负权环');
console.log('2. SPFA优化: 平均O(E)，最坏O(VE)，实际性能更好');
console.log('3. 差分约束: 将不等式组转换为最短路径问题');
console.log('4. 汇率套利: 使用对数转换检测套利机会');
console.log('5. 应用场景: 金融套利、约束求解、网络路由');
