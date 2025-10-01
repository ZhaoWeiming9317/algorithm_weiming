# 拓扑排序 (Topological Sort)

拓扑排序是对有向无环图（DAG）的顶点进行线性排序，使得对于任何有向边 (u, v)，顶点 u 在排序中都出现在顶点 v 之前。

## 📚 核心概念

### 什么是拓扑排序？
- **定义**：对有向无环图的所有顶点进行线性排序
- **前提条件**：图必须是有向无环图（DAG）
- **结果**：如果存在边 u → v，则 u 在拓扑序列中必须出现在 v 之前

### 应用场景
1. **任务调度**：确定任务执行顺序（有依赖关系的任务）
2. **课程安排**：确定课程学习顺序（先修课程关系）
3. **编译顺序**：确定源文件编译顺序（依赖关系）
4. **项目管理**：确定项目任务执行顺序
5. **字典序问题**：根据字符间的顺序关系确定字母表顺序

## 🔧 算法实现

### 1. Kahn算法（BFS实现）

**核心思想**：不断移除入度为0的顶点

```javascript
function topologicalSortBFS(graph, numVertices) {
    // 1. 计算所有顶点的入度
    const inDegree = new Array(numVertices).fill(0);
    for (let u = 0; u < numVertices; u++) {
        for (const v of graph[u]) {
            inDegree[v]++;
        }
    }
    
    // 2. 将所有入度为0的顶点加入队列
    const queue = [];
    for (let i = 0; i < numVertices; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    // 3. BFS处理
    const result = [];
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        
        // 移除当前顶点，更新邻接顶点的入度
        for (const neighbor of graph[current]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // 4. 检查是否存在环
    return result.length === numVertices ? result : [];
}
```

**时间复杂度**：O(V + E)  
**空间复杂度**：O(V)

### 2. DFS实现（后序遍历）

**核心思想**：使用DFS的后序遍历，完成访问的顶点按逆序排列

```javascript
function topologicalSortDFS(graph, numVertices) {
    const colors = new Array(numVertices).fill(0); // 0:未访问 1:访问中 2:已完成
    const result = [];
    let hasCycle = false;
    
    function dfs(node) {
        if (colors[node] === 1) {
            hasCycle = true; // 发现环
            return;
        }
        if (colors[node] === 2) {
            return; // 已访问过
        }
        
        colors[node] = 1; // 标记为访问中
        
        for (const neighbor of graph[node]) {
            if (hasCycle) return;
            dfs(neighbor);
        }
        
        colors[node] = 2; // 标记为已完成
        result.push(node); // 后序遍历
    }
    
    for (let i = 0; i < numVertices; i++) {
        if (colors[i] === 0) {
            dfs(i);
            if (hasCycle) return [];
        }
    }
    
    return result.reverse(); // 逆序得到拓扑序列
}
```

**时间复杂度**：O(V + E)  
**空间复杂度**：O(V)

## 🎯 经典题目

### 1. 课程表 (Course Schedule)
- **LeetCode 207**
- **问题**：判断是否能完成所有课程（检测有向图中是否有环）
- **解法**：使用拓扑排序，如果能处理所有顶点则无环

### 2. 课程表 II (Course Schedule II)
- **LeetCode 210**
- **问题**：返回完成所有课程的顺序
- **解法**：拓扑排序，返回排序结果

### 3. 外星人字典 (Alien Dictionary)
- **LeetCode 269**
- **问题**：根据外星语言的词典顺序推导字母顺序
- **解法**：构建字符间的有向图，进行拓扑排序

## 🔍 算法对比

| 算法 | 实现方式 | 优点 | 缺点 | 适用场景 |
|------|----------|------|------|----------|
| Kahn算法 | BFS + 入度表 | 直观易懂，便于理解 | 需要额外空间存储入度 | 在线算法，适合动态添加边 |
| DFS算法 | DFS + 后序遍历 | 空间效率高 | 需要处理递归栈 | 离线算法，适合静态图 |

## 💡 解题技巧

### 1. 识别拓扑排序问题
- 关键词：**依赖关系**、**先后顺序**、**前置条件**
- 图特征：**有向图**、**需要检测环**

### 2. 构建图的技巧
```javascript
// 方法1：邻接表
const graph = Array.from({ length: n }, () => []);
for (const [from, to] of edges) {
    graph[from].push(to);
}

// 方法2：邻接矩阵（适合稠密图）
const graph = Array.from({ length: n }, () => new Array(n).fill(false));
for (const [from, to] of edges) {
    graph[from][to] = true;
}
```

### 3. 环检测
- **Kahn算法**：最终处理的顶点数 < 总顶点数
- **DFS算法**：访问过程中遇到正在访问的顶点

### 4. 边界情况处理
- 空图：返回所有顶点的任意排列
- 单个顶点：直接返回该顶点
- 存在环：返回空数组或报错

## 🚀 优化技巧

### 1. 空间优化
```javascript
// 使用位运算优化颜色标记
const WHITE = 0, GRAY = 1, BLACK = 2;
const colors = new Array(n).fill(WHITE);
```

### 2. 早期终止
```javascript
// 在DFS中一旦发现环就立即返回
if (hasCycle) return [];
```

### 3. 批量处理
```javascript
// 一次性处理所有入度为0的顶点
while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
        // 处理当前层的所有顶点
    }
}
```

## 📝 常见错误

1. **忘记检测环**：拓扑排序的前提是无环图
2. **边的方向错误**：注意依赖关系的方向
3. **重复边处理**：避免在图中添加重复的边
4. **边界情况遗漏**：空图、单顶点图等特殊情况

## 🔗 相关算法

- **强连通分量**：Tarjan算法、Kosaraju算法
- **最短路径**：在DAG上的最短路径可以用拓扑排序优化
- **关键路径**：项目管理中的关键路径问题

## 📚 扩展阅读

- 图论基础
- 有向无环图（DAG）的性质
- 图的遍历算法（BFS、DFS）
- 强连通分量算法
