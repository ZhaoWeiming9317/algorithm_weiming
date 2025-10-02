# 拓扑排序专题

## 🎯 拓扑排序核心概念

拓扑排序(Topological Sort)是对有向无环图(DAG)的顶点进行线性排序，使得对于任何有向边(u,v)，顶点u在排序中都出现在顶点v之前。

### 前提条件
- **必须是有向图**：无向图没有拓扑排序
- **必须是无环图(DAG)**：有环图无法进行拓扑排序
- **可能有多个解**：拓扑排序通常不唯一

## 🔥 拓扑排序的应用

### 实际应用场景
- **课程安排**：根据先修课程关系安排学习顺序
- **任务调度**：根据依赖关系安排任务执行顺序
- **编译顺序**：根据模块依赖确定编译顺序
- **项目管理**：根据任务依赖制定项目计划
- **数据库查询优化**：确定表连接顺序

### 经典问题
1. **课程安排问题**：判断是否能完成所有课程
2. **课程安排II**：返回具体的课程学习顺序
3. **外星词典**：根据单词顺序推导字母顺序
4. **任务调度器**：带冷却时间的任务调度

## 🚀 拓扑排序算法

### 1. Kahn算法(BFS实现)

**核心思想**：
1. 统计所有顶点的入度
2. 将入度为0的顶点加入队列
3. 不断取出入度为0的顶点，并减少其邻居的入度
4. 重复直到队列为空

```javascript
function topologicalSortKahn(graph) {
    const inDegree = new Map();
    const queue = [];
    const result = [];
    
    // 1. 计算所有顶点的入度
    for (const vertex of graph.getVertices()) {
        inDegree.set(vertex, 0);
    }
    
    for (const vertex of graph.getVertices()) {
        for (const neighbor of graph.getNeighbors(vertex)) {
            inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) + 1);
        }
    }
    
    // 2. 将入度为0的顶点加入队列
    for (const [vertex, degree] of inDegree) {
        if (degree === 0) {
            queue.push(vertex);
        }
    }
    
    // 3. BFS处理
    while (queue.length > 0) {
        const vertex = queue.shift();
        result.push(vertex);
        
        // 减少邻居的入度
        for (const neighbor of graph.getNeighbors(vertex)) {
            inDegree.set(neighbor.vertex, inDegree.get(neighbor.vertex) - 1);
            if (inDegree.get(neighbor.vertex) === 0) {
                queue.push(neighbor.vertex);
            }
        }
    }
    
    return result;
}
```

### 2. DFS算法

**核心思想**：
1. 使用DFS遍历图
2. 在完成顶点访问时将其加入结果
3. 反转结果得到拓扑排序

```javascript
function topologicalSortDFS(graph) {
    const visited = new Set();
    const result = [];
    
    function dfs(vertex) {
        visited.add(vertex);
        
        for (const neighbor of graph.getNeighbors(vertex)) {
            if (!visited.has(neighbor.vertex)) {
                dfs(neighbor.vertex);
            }
        }
        
        result.push(vertex); // 后序位置添加
    }
    
    for (const vertex of graph.getVertices()) {
        if (!visited.has(vertex)) {
            dfs(vertex);
        }
    }
    
    return result.reverse(); // 反转得到拓扑排序
}
```

## 📚 拓扑排序问题分类

### 1. 基础拓扑排序
- [基础实现](./BasicTopologicalSort.js) - Kahn和DFS两种实现
- 环检测与拓扑排序
- 多种拓扑排序的生成

### 2. 课程安排问题
- [课程安排I](./courseSchedule.js) - 判断是否能完成所有课程
- [课程安排II](./courseScheduleII.js) - 返回具体的学习顺序
- 带权重的课程安排

### 3. 字符串排序问题
- [外星词典](./alienDictionary.js) - 根据单词顺序推导字母顺序
- 字符串重排序
- 字典序问题

### 4. 任务调度问题
- 带依赖的任务调度
- 并行任务调度
- 带时间约束的调度

## 🎯 算法对比

| 算法 | 时间复杂度 | 空间复杂度 | 特点 | 适用场景 |
|------|-----------|-----------|------|---------|
| **Kahn(BFS)** | O(V+E) | O(V) | 直观易懂 | 需要逐步处理 |
| **DFS** | O(V+E) | O(V) | 递归实现 | 需要完整排序 |

## 💡 实现要点

### 1. 环检测
- 拓扑排序的前提是DAG
- Kahn算法：结果长度不等于顶点数
- DFS算法：使用三色标记检测环

### 2. 多解处理
- 拓扑排序通常不唯一
- 可以生成所有可能的拓扑排序
- 字典序最小的拓扑排序

### 3. 优先级处理
- 使用优先队列替代普通队列
- 按字典序或其他规则排序
- 满足特定约束条件

## 🔥 经典问题模式

### 1. 可行性判断
```javascript
// 判断是否存在拓扑排序（即是否为DAG）
function canFinish(numCourses, prerequisites) {
    // 构建图并使用Kahn算法
    // 如果处理的顶点数等于总顶点数，则可行
}
```

### 2. 求具体排序
```javascript
// 返回一个有效的拓扑排序
function findOrder(numCourses, prerequisites) {
    // 使用Kahn或DFS算法
    // 返回具体的排序结果
}
```

### 3. 字符顺序推导
```javascript
// 根据单词顺序推导字母顺序
function alienOrder(words) {
    // 1. 构建字符间的依赖关系图
    // 2. 使用拓扑排序得到字符顺序
}
```

## 🎯 常见陷阱

### 1. 环的存在
- **问题**：有环图无法拓扑排序
- **检测**：Kahn算法结果长度检查
- **处理**：返回空结果或错误信息

### 2. 输入验证
- **问题**：无效的边或顶点
- **检测**：边的合法性检查
- **处理**：预处理输入数据

### 3. 多解选择
- **问题**：多个有效的拓扑排序
- **策略**：字典序最小、优先级排序
- **实现**：使用优先队列

## 🚀 优化技巧

### 1. 字典序最小
```javascript
// 使用最小堆保证字典序最小的拓扑排序
const minHeap = new MinHeap();
// 将入度为0的顶点加入最小堆而非普通队列
```

### 2. 并行处理
```javascript
// 识别可以并行处理的顶点
// 同一层的顶点可以并行执行
```

### 3. 增量更新
```javascript
// 动态添加或删除边时的增量拓扑排序
// 避免重新计算整个拓扑排序
```

## 🎯 时间空间复杂度

### 时间复杂度
- **Kahn算法**: O(V + E) - 每个顶点和边处理一次
- **DFS算法**: O(V + E) - 标准DFS遍历

### 空间复杂度
- **入度数组**: O(V) - 存储每个顶点的入度
- **队列/栈**: O(V) - 最坏情况下存储所有顶点
- **结果数组**: O(V) - 存储拓扑排序结果

---

**拓扑排序是解决依赖关系和调度问题的核心算法！**