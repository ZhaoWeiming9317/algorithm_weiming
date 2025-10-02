# 深度优先搜索(DFS)专题

## 🎯 DFS核心思想

深度优先搜索(Depth-First Search)是一种图遍历算法，采用"深度探索"的策略：
- 从起始顶点开始
- 沿着一条路径尽可能深入
- 直到无法继续时回溯
- 探索其他分支

## 🔥 DFS的特点

### 优势
- ✅ **路径查找**：能找到从起点到终点的路径
- ✅ **环检测**：能检测图中是否存在环
- ✅ **连通性**：判断图的连通性
- ✅ **拓扑排序**：有向无环图的拓扑排序
- ✅ **强连通分量**：找到有向图的强连通分量

### 适用场景
- 路径查找和枚举
- 环检测
- 拓扑排序
- 强连通分量
- 回溯算法
- 树的遍历

## 🚀 DFS算法模板

### 递归模板
```javascript
function dfsRecursive(graph, vertex, visited = new Set()) {
    visited.add(vertex);
    console.log(`访问顶点: ${vertex}`);
    
    for (const neighbor of graph.getNeighbors(vertex)) {
        if (!visited.has(neighbor.vertex)) {
            dfsRecursive(graph, neighbor.vertex, visited);
        }
    }
}
```

### 迭代模板
```javascript
function dfsIterative(graph, start) {
    const visited = new Set();
    const stack = [start];
    
    while (stack.length > 0) {
        const vertex = stack.pop();
        
        if (!visited.has(vertex)) {
            visited.add(vertex);
            console.log(`访问顶点: ${vertex}`);
            
            // 注意：为了保持与递归相同的访问顺序，需要逆序添加邻居
            const neighbors = graph.getNeighbors(vertex);
            for (let i = neighbors.length - 1; i >= 0; i--) {
                if (!visited.has(neighbors[i].vertex)) {
                    stack.push(neighbors[i].vertex);
                }
            }
        }
    }
}
```

### 路径查找模板
```javascript
function dfsPath(graph, start, target, path = [], visited = new Set()) {
    visited.add(start);
    path.push(start);
    
    if (start === target) {
        return [...path]; // 找到路径
    }
    
    for (const neighbor of graph.getNeighbors(start)) {
        if (!visited.has(neighbor.vertex)) {
            const result = dfsPath(graph, neighbor.vertex, target, path, visited);
            if (result) return result;
        }
    }
    
    path.pop(); // 回溯
    return null;
}
```

## 📚 DFS应用分类

### 1. 基础遍历
- [基础DFS实现](./BasicDFS.js) - DFS的各种实现方式
- 图的深度遍历
- 连通分量检测

### 2. 环检测
- [环检测算法](./CycleDetection.js) - 有向图和无向图的环检测
- 拓扑排序的前置条件
- 依赖关系验证

### 3. 路径查找
- [路径查找算法](./PathFinding.js) - 查找和枚举路径
- 所有路径枚举
- 路径存在性判断

### 4. 连通分量
- [连通分量算法](./ConnectedComponents.js) - 强连通分量和连通分量
- Tarjan算法
- Kosaraju算法

## 🎯 DFS vs BFS对比

| 特性 | DFS | BFS |
|------|-----|-----|
| **数据结构** | 栈(Stack) | 队列(Queue) |
| **遍历顺序** | 深度优先 | 层序(广度优先) |
| **最短路径** | ❌ 不保证最优 | ✅ 无权图最优 |
| **空间复杂度** | O(h) 递归深度 | O(V) 队列大小 |
| **应用场景** | 路径查找、环检测 | 最短路径、层序 |

## 💡 DFS实现要点

### 1. 递归 vs 迭代
- **递归**：代码简洁，但可能栈溢出
- **迭代**：使用显式栈，可控制栈大小
- **选择**：小图用递归，大图用迭代

### 2. 访问标记
- **全局标记**：防止重复访问
- **路径标记**：用于回溯算法
- **时机**：访问时标记，回溯时取消

### 3. 路径记录
- **递归参数**：传递当前路径
- **全局变量**：记录最佳路径
- **回溯**：及时撤销选择

### 4. 环检测
- **无向图**：检查是否回到父节点以外的已访问节点
- **有向图**：检查是否回到当前路径中的节点
- **三色标记**：白色(未访问)、灰色(正在访问)、黑色(已完成)

## 🔥 经典DFS问题

### 基础问题
1. **图的遍历** - 深度优先访问所有顶点
2. **连通性检测** - 判断两点是否连通
3. **连通分量** - 统计连通分量数量

### 环检测问题
1. **无向图环检测** - 检测无向图是否有环
2. **有向图环检测** - 检测有向图是否有环
3. **拓扑排序** - 基于DFS的拓扑排序

### 路径问题
1. **路径查找** - 找到从起点到终点的路径
2. **所有路径** - 枚举所有可能路径
3. **最长路径** - 在DAG中找最长路径

### 高级问题
1. **强连通分量** - Tarjan算法、Kosaraju算法
2. **割点和桥** - 找到图的关键节点和边
3. **二分图检测** - 使用DFS进行图着色

## 🎯 DFS的三种状态

在复杂的DFS应用中，常使用三色标记：

### 白色(White) - 未访问
- 节点还未被访问
- 初始状态

### 灰色(Gray) - 正在访问
- 节点已开始访问但未完成
- 当前递归路径中的节点
- 用于检测后向边(环)

### 黑色(Black) - 已完成
- 节点及其所有后代都已访问完成
- 不会再被访问

## 🎯 时间空间复杂度

### 时间复杂度
- **邻接表**: O(V + E) - 每个顶点和边访问一次
- **邻接矩阵**: O(V²) - 需要检查所有可能的边

### 空间复杂度
- **递归**: O(h) - 递归栈深度，h为图的深度
- **迭代**: O(V) - 显式栈的大小
- **访问标记**: O(V) - 标记所有顶点

## 💡 DFS优化技巧

### 1. 剪枝优化
- 提前终止无效分支
- 使用启发式函数
- 记忆化搜索

### 2. 迭代深化
- 限制搜索深度
- 逐步增加深度限制
- 适用于深度未知的情况

### 3. 双向搜索
- 从起点和终点同时搜索
- 减少搜索空间
- 适用于有明确目标的搜索

---

**DFS是解决路径查找和图结构分析的强大工具！**
