# 图算法完整体系

## 🎯 项目概述

本项目系统性地整理了图算法的各个方面，从基础的图表示到高级的图算法应用，帮助全面掌握图论知识。

## 📁 目录结构

```
Algorithm/Graph/
├── README.md                    # 总体介绍和学习指南
├── Foundation/                  # 图的基础 ✅
│   ├── README.md               # 图的基础知识
│   └── GraphRepresentation.js  # 图的表示方法（邻接矩阵、邻接表、边列表）
├── BFS/                        # 广度优先搜索 ✅
│   ├── README.md               # BFS基础和应用场景
│   ├── BasicBFS.js             # 基础BFS实现和连通性检测
│   └── ShortestPath.js         # 无权图最短路径、网格路径、多源BFS
├── DFS/                        # 深度优先搜索 ✅
│   ├── README.md               # DFS基础和应用场景
│   ├── BasicDFS.js             # 基础DFS实现和路径查找
│   └── CycleDetection.js       # 环检测（有向图、无向图、Union-Find）
├── Topology/                   # 拓扑排序 ✅
│   ├── README.md               # 拓扑排序专题
│   ├── BasicTopologicalSort.js # Kahn算法和DFS算法实现
│   ├── courseSchedule.js       # 课程安排问题
│   ├── courseScheduleII.js     # 课程安排II
│   └── alienDictionary.js      # 外星词典
├── ShortestPath/               # 最短路径算法 ✅
│   ├── README.md               # 最短路径专题
│   ├── Dijkstra.js             # Dijkstra算法（朴素、优化、K短路径）
│   └── BellmanFord.js          # Bellman-Ford、SPFA、差分约束、汇率套利
└── UnionFind/                  # 并查集 ✅
    ├── README.md               # 并查集专题
    └── BasicUnionFind.js       # 各种优化的并查集实现
```

### 🎯 已实现的核心功能

#### Foundation - 图的基础
- ✅ 邻接矩阵、邻接表、边列表三种表示方法
- ✅ 图的基本操作（添加顶点、边，查询邻居等）
- ✅ 表示方法之间的转换工具

#### BFS - 广度优先搜索
- ✅ 基础BFS遍历（递归和迭代）
- ✅ 连通性检测和连通分量统计
- ✅ 无权图最短路径算法
- ✅ 网格中的最短路径问题
- ✅ 多源BFS（腐烂橘子、01矩阵）
- ✅ 单词接龙问题

#### DFS - 深度优先搜索
- ✅ 基础DFS遍历（递归和迭代）
- ✅ 路径查找（单条路径、所有路径）
- ✅ 连通性检测和连通分量
- ✅ DFS时间戳和三色标记
- ✅ 无向图环检测
- ✅ 有向图环检测（三色DFS）
- ✅ Union-Find环检测
- ✅ 最小环检测

#### Topology - 拓扑排序
- ✅ Kahn算法（BFS实现）
- ✅ DFS算法实现
- ✅ 字典序最小的拓扑排序
- ✅ 所有可能的拓扑排序（回溯）
- ✅ 环检测和DAG验证

#### ShortestPath - 最短路径
- ✅ Dijkstra算法（朴素O(V²)和优化O((V+E)logV)）
- ✅ 单对最短路径和K短路径
- ✅ Bellman-Ford算法（标准实现）
- ✅ SPFA算法（队列优化）
- ✅ 负权环检测
- ✅ 差分约束系统求解
- ✅ 汇率套利检测

#### UnionFind - 并查集
- ✅ 朴素实现到完全优化的演进
- ✅ 路径压缩优化
- ✅ 按秩合并和按大小合并
- ✅ 支持任意类型元素的泛型实现
- ✅ 性能测试和可视化

## 🔥 图算法分类

### 📊 按算法类型分类

| 算法类型 | 核心思想 | 时间复杂度 | 典型应用 |
|---------|---------|-----------|---------|
| **BFS** | 层序扩展 | O(V+E) | 最短路径、层序遍历 |
| **DFS** | 深度探索 | O(V+E) | 环检测、路径查找 |
| **拓扑排序** | 依赖关系 | O(V+E) | 任务调度、课程安排 |
| **最短路径** | 路径优化 | O(V²)~O(VlogV) | 导航、网络路由 |
| **并查集** | 动态连通性 | O(α(n)) | 连通分量、集合合并 |
| **MST** | 最小连接 | O(ElogE) | 网络设计、聚类 |

### 🎯 按问题类型分类

#### 1. 遍历和搜索
- 图的遍历（BFS/DFS）
- 路径查找
- 连通性判断

#### 2. 最短路径
- 单源最短路径（Dijkstra、Bellman-Ford）
- 全源最短路径（Floyd-Warshall）
- 无权图最短路径（BFS）

#### 3. 拓扑和依赖
- 拓扑排序
- 强连通分量
- 依赖关系分析

#### 4. 连通性问题
- 连通分量
- 并查集应用
- 割点和桥

#### 5. 优化问题
- 最小生成树
- 最大流
- 图匹配

## 🚀 学习路径

### 🎯 基础阶段
1. **图的表示**：邻接矩阵、邻接表、边列表
2. **基础遍历**：BFS、DFS的实现和应用
3. **简单问题**：路径查找、连通性判断

### 🎯 进阶阶段
1. **拓扑排序**：有向无环图的应用
2. **最短路径**：Dijkstra、BFS最短路径
3. **并查集**：动态连通性问题

### 🎯 高级阶段
1. **复杂最短路径**：Bellman-Ford、Floyd-Warshall
2. **最小生成树**：Kruskal、Prim算法
3. **高级算法**：强连通分量、最大流

## 💡 核心概念

### 图的基本概念
- **顶点(Vertex)**：图中的节点
- **边(Edge)**：连接顶点的线
- **度(Degree)**：顶点连接的边数
- **路径(Path)**：顶点间的连接序列
- **环(Cycle)**：起点和终点相同的路径

### 图的分类
- **有向图 vs 无向图**
- **加权图 vs 无权图**
- **连通图 vs 非连通图**
- **稠密图 vs 稀疏图**

### 常用数据结构
- **邻接矩阵**：适合稠密图
- **邻接表**：适合稀疏图
- **边列表**：适合某些特定算法

## 🎯 面试重点

### 必须掌握
- ✅ BFS和DFS的实现
- ✅ 图的表示方法
- ✅ 拓扑排序
- ✅ 基础最短路径算法
- ✅ 并查集的基本操作

### 常考题型
1. **遍历问题**：岛屿数量、朋友圈
2. **路径问题**：最短路径、所有路径
3. **拓扑问题**：课程安排、任务调度
4. **连通性**：连通分量、冗余连接
5. **优化问题**：最小生成树、网络延迟

## 🎯 快速开始

### 1. 图的基础使用
```javascript
import { AdjacencyListGraph } from './Foundation/GraphRepresentation.js';

// 创建无向图
const graph = new AdjacencyListGraph(false);
graph.addEdge('A', 'B', 1);
graph.addEdge('B', 'C', 2);
graph.addEdge('A', 'C', 3);

console.log('图的邻接表表示：');
graph.printAdjList();
```

### 2. BFS最短路径
```javascript
import { shortestPath } from './BFS/ShortestPath.js';

const result = shortestPath(graph, 'A', 'C');
console.log(`最短距离: ${result.distance}`);
console.log(`最短路径: ${result.path.join(' -> ')}`);
```

### 3. DFS环检测
```javascript
import { detectCycleUndirected } from './DFS/CycleDetection.js';

const result = detectCycleUndirected(graph);
console.log(`是否存在环: ${result.hasCycle}`);
```

### 4. 拓扑排序
```javascript
import { topologicalSortKahn } from './Topology/BasicTopologicalSort.js';

const result = topologicalSortKahn(directedGraph);
console.log(`拓扑排序: ${result.topologicalOrder.join(' -> ')}`);
```

### 5. Dijkstra最短路径
```javascript
import { dijkstraOptimized } from './ShortestPath/Dijkstra.js';

const result = dijkstraOptimized(weightedGraph, 'start');
console.log('最短距离:', result.distances);
```

### 6. 并查集连通性
```javascript
import { OptimizedUnionFind } from './UnionFind/BasicUnionFind.js';

const uf = new OptimizedUnionFind(5);
uf.union(0, 1);
uf.union(2, 3);
console.log(`0和1连通: ${uf.connected(0, 1)}`);
console.log(`连通分量数: ${uf.getCount()}`);
```

## 🚀 实际应用示例

### 社交网络分析
```javascript
// 使用并查集分析朋友圈
const socialNetwork = new OptimizedUnionFind(users.length);
friendships.forEach(([user1, user2]) => {
    socialNetwork.union(user1, user2);
});
console.log(`朋友圈数量: ${socialNetwork.getCount()}`);
```

### GPS导航系统
```javascript
// 使用Dijkstra算法计算最短路径
const roadNetwork = buildRoadGraph(cities, roads);
const route = dijkstraSinglePair(roadNetwork, startCity, endCity);
console.log(`最短路线: ${route.path.join(' -> ')}`);
console.log(`总距离: ${route.distance}km`);
```

### 任务调度系统
```javascript
// 使用拓扑排序安排任务执行顺序
const taskGraph = buildTaskGraph(tasks, dependencies);
const schedule = topologicalSortKahn(taskGraph);
if (!schedule.hasCycle) {
    console.log(`执行顺序: ${schedule.topologicalOrder.join(' -> ')}`);
} else {
    console.log('任务依赖存在循环，无法调度');
}
```

## 📖 学习建议

### 🎯 循序渐进
1. **先理解概念**：图的基本概念和表示方法
2. **掌握基础算法**：BFS、DFS的实现和应用
3. **学习经典问题**：最短路径、拓扑排序、连通性
4. **练习实际应用**：结合具体问题场景

### 🔥 重点掌握
- **BFS**：无权图最短路径的首选
- **DFS**：路径查找和环检测的利器
- **拓扑排序**：处理依赖关系的标准方法
- **Dijkstra**：非负权图最短路径的经典算法
- **并查集**：动态连通性问题的最佳数据结构

### 💡 实践技巧
- 多画图理解算法执行过程
- 从简单例子开始，逐步增加复杂度
- 注意时间空间复杂度的权衡
- 结合实际问题场景加深理解

---

**图算法是算法面试的重点，也是实际应用最广泛的算法之一！掌握好图算法，你就掌握了解决复杂问题的强大工具。**
