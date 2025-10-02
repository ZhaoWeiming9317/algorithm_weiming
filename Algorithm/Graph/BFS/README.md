# 广度优先搜索(BFS)专题

## 🎯 BFS核心思想

广度优先搜索(Breadth-First Search)是一种图遍历算法，采用"层序扩展"的策略：
- 从起始顶点开始
- 先访问所有距离为1的顶点
- 再访问所有距离为2的顶点
- 依此类推...

## 🔥 BFS的特点

### 优势
- ✅ **最短路径**：在无权图中找到最短路径
- ✅ **层序遍历**：按距离从近到远访问
- ✅ **完整性**：能访问到所有可达顶点
- ✅ **最优性**：第一次到达目标就是最短路径

### 适用场景
- 无权图的最短路径
- 层序遍历问题
- 连通性检测
- 二分图判断
- 拓扑排序(Kahn算法)

## 🚀 BFS算法模板

### 基础模板
```javascript
function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const vertex = queue.shift();
        result.push(vertex);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                visited.add(neighbor.vertex);
                queue.push(neighbor.vertex);
            }
        }
    }
    
    return result;
}
```

### 最短路径模板
```javascript
function bfsShortestPath(graph, start, target) {
    const visited = new Set();
    const queue = [{vertex: start, distance: 0, path: [start]}];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const {vertex, distance, path} = queue.shift();
        
        if (vertex === target) {
            return {distance, path};
        }
        
        for (const neighbor of graph.getNeighbors(vertex)) {
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
```

## 📚 BFS应用分类

### 1. 基础遍历
- [基础BFS实现](./BasicBFS.js) - BFS的各种实现方式
- 图的遍历和访问
- 连通分量检测

### 2. 最短路径
- [无权图最短路径](./ShortestPath.js) - BFS求最短路径
- 迷宫问题
- 网格中的最短路径

### 3. 层序问题
- [层序遍历应用](./LevelOrder.js) - 按层处理问题
- 二叉树层序遍历
- 多源BFS

### 4. 图的性质
- [二分图判断](./BipartiteGraph.js) - 使用BFS判断二分图
- 图的着色问题
- 奇偶性检测

## 🎯 BFS vs DFS对比

| 特性 | BFS | DFS |
|------|-----|-----|
| **数据结构** | 队列(Queue) | 栈(Stack) |
| **遍历顺序** | 层序(广度优先) | 深度优先 |
| **最短路径** | ✅ 无权图最优 | ❌ 不保证最优 |
| **空间复杂度** | O(V) | O(h) |
| **应用场景** | 最短路径、层序 | 路径查找、回溯 |

## 💡 BFS实现要点

### 1. 队列管理
- 使用队列保证先进先出
- JavaScript中可用数组的shift()和push()
- 也可使用双端队列优化

### 2. 访问标记
- 防止重复访问形成死循环
- 在**入队时**标记，而不是出队时
- 可用Set、Map或数组标记

### 3. 路径记录
- 记录前驱节点重建路径
- 或在队列中直接存储路径
- 权衡空间和时间复杂度

### 4. 多源BFS
- 同时从多个起点开始
- 适用于"最近距离"问题
- 如腐烂的橘子、01矩阵等

## 🔥 经典BFS问题

### 基础问题
1. **图的遍历** - 访问所有可达顶点
2. **连通性检测** - 判断两点是否连通
3. **连通分量** - 统计连通分量数量

### 最短路径问题
1. **迷宫最短路径** - 网格中的路径查找
2. **单词接龙** - 字符串变换的最短步数
3. **跳跃游戏** - 数组中的最短跳跃次数

### 层序问题
1. **二叉树层序遍历** - 按层访问树节点
2. **腐烂的橘子** - 多源扩散问题
3. **01矩阵** - 到最近0的距离

### 图性质问题
1. **二分图检测** - 判断图是否为二分图
2. **图着色** - 用最少颜色给图着色
3. **拓扑排序** - Kahn算法实现

## 🎯 时间空间复杂度

### 时间复杂度
- **邻接表**: O(V + E) - 每个顶点和边访问一次
- **邻接矩阵**: O(V²) - 需要检查所有可能的边

### 空间复杂度
- **队列空间**: O(V) - 最坏情况下所有顶点入队
- **访问标记**: O(V) - 标记所有顶点
- **总空间**: O(V)

## 💡 BFS优化技巧

### 1. 双向BFS
- 从起点和终点同时搜索
- 适用于有明确目标的搜索
- 可以显著减少搜索空间

### 2. A*搜索
- BFS + 启发式函数
- 优先扩展更有希望的节点
- 适用于有距离估计的问题

### 3. 多源BFS
- 同时从多个起点开始
- 适用于"最近距离"类问题
- 如腐烂橘子、01矩阵等

---

**BFS是解决最短路径和层序问题的利器！**
