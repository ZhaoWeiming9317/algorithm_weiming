# 并查集(Union-Find)专题

## 🎯 并查集核心概念

并查集(Union-Find)，也称为不相交集合(Disjoint Set)，是一种用于处理动态连通性问题的数据结构。

### 主要操作
1. **Find(x)**：查找元素x所属的集合代表
2. **Union(x, y)**：合并元素x和y所在的集合
3. **Connected(x, y)**：判断x和y是否在同一集合中

### 核心思想
- 用树结构表示集合
- 树的根节点作为集合的代表
- 通过路径压缩和按秩合并优化性能

## 🚀 并查集的演进

### 1. 朴素实现
```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        // 初始化：每个节点的父节点都是自己
        // parent[0] = 0, parent[1] = 1, ..., parent[n-1] = n-1
        this.count = n; // 初始时每个节点都是独立的集合
    }
    
    // 详细解释 Array.from({length: n}, (_, i) => i)：
    // - Array.from() 创建一个新数组
    // - {length: n} 指定数组长度为n
    // - (_, i) => i 是映射函数，参数说明：
    //   - _ : 当前元素的值（这里被忽略，用_表示）
    //   - i : 当前元素的索引（0, 1, 2, ..., n-1）
    //   - => i : 返回索引值作为数组元素
    // 结果：[0, 1, 2, 3, ..., n-1]
    
    // 具体例子：当n=5时
    // Array.from({length: 5}, (_, i) => i) 的执行过程：
    // 第1次调用：(undefined, 0) => 0  // _=undefined, i=0, 返回0
    // 第2次调用：(undefined, 1) => 1  // _=undefined, i=1, 返回1
    // 第3次调用：(undefined, 2) => 2  // _=undefined, i=2, 返回2
    // 第4次调用：(undefined, 3) => 3  // _=undefined, i=3, 返回3
    // 第5次调用：(undefined, 4) => 4  // _=undefined, i=4, 返回4
    // 最终结果：[0, 1, 2, 3, 4]

    find(x) {
        while (this.parent[x] !== x) {
            x = this.parent[x];
        }
        return x;
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            this.parent[rootX] = rootY;
            this.count--; // 合并后集合数量减1
        }
    }
    
    // 获取当前独立集合的数量
    getCount() {
        return this.count;
    }
    
    // 判断两个节点是否连通
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
}
```

### 2. 路径压缩优化
```javascript
find(x) {
    if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
}
```

### 3. 按秩合并优化
```javascript
union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX !== rootY) {
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
    }
}
```

## 📊 时间复杂度

| 操作 | 朴素实现 | 路径压缩 | 按秩合并 | 路径压缩+按秩合并 |
|------|---------|---------|---------|-----------------|
| **Find** | O(n) | O(logn) | O(logn) | O(α(n)) |
| **Union** | O(n) | O(logn) | O(logn) | O(α(n)) |

*注：α(n)是阿克曼函数的反函数，实际应用中可视为常数*

## 💡 具体例子演示

让我们通过一个具体例子来理解Union-Find的工作原理：

```javascript
// 假设我们有5个节点：0, 1, 2, 3, 4
const uf = new UnionFind(5);

console.log("初始状态:");
console.log("parent:", uf.parent); // [0, 1, 2, 3, 4]
console.log("独立集合数量:", uf.getCount()); // 5

// 连接边：(0,1), (1,2), (3,4)
console.log("\n连接 (0,1):");
uf.union(0, 1);
console.log("parent:", uf.parent); // [1, 1, 2, 3, 4]
console.log("独立集合数量:", uf.getCount()); // 4

console.log("\n连接 (1,2):");
uf.union(1, 2);
console.log("parent:", uf.parent); // [1, 2, 2, 3, 4]
console.log("独立集合数量:", uf.getCount()); // 3

console.log("\n连接 (3,4):");
uf.union(3, 4);
console.log("parent:", uf.parent); // [1, 2, 2, 4, 4]
console.log("独立集合数量:", uf.getCount()); // 2

// 检查连通性
console.log("\n连通性检查:");
console.log("0和2是否连通:", uf.connected(0, 2)); // true
console.log("0和3是否连通:", uf.connected(0, 3)); // false
console.log("3和4是否连通:", uf.connected(3, 4)); // true

// 最终结果：2个独立模块
// 模块1：{0, 1, 2} - 通过边(0,1)和(1,2)连接
// 模块2：{3, 4} - 通过边(3,4)连接
```

**关键理解点**：
1. **初始状态**：每个节点都是独立的集合
2. **Union操作**：将两个集合合并，减少总集合数
3. **Find操作**：找到节点所属集合的代表（根节点）
4. **连通性**：两个节点连通当且仅当它们有相同的根节点

## 🔍 深入理解parent数组

### 最终parent数组的特点
```javascript
// 假设最终有2个独立模块
// 模块1：{0, 1, 2} - 根节点是2
// 模块2：{3, 4} - 根节点是4
// 最终parent数组：[2, 2, 2, 4, 4]

// 观察：parent数组中只有2种不同的值：2和4
// 这正好对应2个独立模块！
```

### Union顺序的影响
```javascript
// 例子1：按顺序union
const uf1 = new UnionFind(5);
uf1.union(0, 1); // parent: [1, 1, 2, 3, 4]
uf1.union(1, 2); // parent: [1, 2, 2, 3, 4]
uf1.union(3, 4); // parent: [1, 2, 2, 4, 4]
// 最终：2个独立模块，根节点是2和4

// 例子2：乱序union（结果相同！）
const uf2 = new UnionFind(5);
uf2.union(1, 2); // parent: [0, 2, 2, 3, 4]
uf2.union(3, 4); // parent: [0, 2, 2, 4, 4]
uf2.union(0, 1); // parent: [2, 2, 2, 4, 4]
// 最终：同样是2个独立模块，根节点是2和4

// 例子3：完全不同的union顺序
const uf3 = new UnionFind(5);
uf3.union(2, 0); // parent: [0, 1, 0, 3, 4]
uf3.union(4, 3); // parent: [0, 1, 0, 3, 3]
uf3.union(1, 2); // parent: [0, 0, 0, 3, 3]
// 最终：同样是2个独立模块，根节点是0和3
```

**重要结论**：
- ✅ **Union顺序不影响最终结果**：无论怎么union，连通性结果都一样
- ✅ **根节点可能不同**：不同的union顺序可能产生不同的根节点
- ✅ **独立模块数量相同**：最终都会得到相同数量的独立模块

## 🤔 关于节点编号的疑问

### 节点编号可以是不连续的！
```javascript
// 例子1：连续编号（常见情况）
const uf1 = new UnionFind(5); // 节点：0, 1, 2, 3, 4
uf1.union(0, 1);
uf1.union(2, 3);
// 结果：3个独立模块

// 例子2：不连续编号（完全没问题！）
const uf2 = new UnionFind(10); // 节点：0, 1, 2, 3, 4, 5, 6, 7, 8, 9
uf2.union(0, 5);  // 连接节点0和节点5
uf2.union(2, 7);  // 连接节点2和节点7
uf2.union(1, 9);  // 连接节点1和节点9
// 结果：7个独立模块

// 例子3：稀疏编号（也完全没问题！）
const uf3 = new UnionFind(100); // 节点：0, 1, 2, ..., 99
uf3.union(10, 20);  // 只连接节点10和20
uf3.union(30, 40);  // 只连接节点30和40
uf3.union(50, 60);  // 只连接节点50和60
// 结果：97个独立模块（100-3=97）
```

### 为什么可以有不连续的节点？
```javascript
// Union-Find只关心"哪些节点是连通的"，不关心节点编号的连续性
// 就像现实生活中的例子：

// 例子：城市网络
// 城市编号：北京(0), 上海(1), 广州(2), 深圳(3), 成都(4), 重庆(5)
const cityNetwork = new UnionFind(6);
cityNetwork.union(0, 1);  // 北京-上海有高铁
cityNetwork.union(2, 3);  // 广州-深圳有地铁
cityNetwork.union(4, 5);  // 成都-重庆有高铁
// 结果：3个独立的交通网络

// 例子：社交网络
// 用户ID：1001, 1002, 1003, 1004, 1005
const socialNetwork = new UnionFind(5);
// 我们需要将用户ID映射到数组索引
const userIdToIndex = {1001: 0, 1002: 1, 1003: 2, 1004: 3, 1005: 4};
socialNetwork.union(userIdToIndex[1001], userIdToIndex[1002]); // 1001和1002是朋友
socialNetwork.union(userIdToIndex[1003], userIdToIndex[1004]); // 1003和1004是朋友
// 结果：3个独立的朋友圈
```

### 处理非连续节点的方法
```javascript
// 方法1：使用Map（推荐）
class FlexibleUnionFind {
    constructor() {
        this.parent = new Map();
        this.count = 0;
    }
    
    makeSet(x) {
        if (!this.parent.has(x)) {
            this.parent.set(x, x);
            this.count++;
        }
    }
    
    find(x) {
        if (!this.parent.has(x)) {
            this.makeSet(x);
        }
        if (this.parent.get(x) !== x) {
            this.parent.set(x, this.find(this.parent.get(x)));
        }
        return this.parent.get(x);
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            this.parent.set(rootX, rootY);
            this.count--;
        }
    }
    
    getCount() {
        return this.count;
    }
}

// 使用示例
const uf = new FlexibleUnionFind();
uf.union(1001, 1002);  // 用户1001和1002
uf.union(2001, 2002);  // 用户2001和2002
uf.union(3001, 3002);  // 用户3001和3002
console.log("独立朋友圈数量:", uf.getCount()); // 3
```

## 🎯 如何正确设置Union-Find的大小

### 关键原则：数组大小 = 最大节点编号 + 1

```javascript
// 例子1：节点编号0-4
const nodes = [0, 1, 2, 3, 4];
const uf1 = new UnionFind(5); // 最大编号4，所以大小是5

// 例子2：节点编号1-5
const nodes2 = [1, 2, 3, 4, 5];
const uf2 = new UnionFind(6); // 最大编号5，所以大小是6

// 例子3：节点编号10-14
const nodes3 = [10, 11, 12, 13, 14];
const uf3 = new UnionFind(15); // 最大编号14，所以大小是15
```

### 常见题目中的情况

#### 情况1：明确给出节点数量
```javascript
// 题目：有n个节点，编号从0到n-1
function countComponents(edges, n) {
    const uf = new UnionFind(n); // 直接使用n
    for (const [u, v] of edges) {
        uf.union(u, v);
    }
    return uf.getCount();
}
```

#### 情况2：需要从边中推断最大节点编号
```javascript
// 题目：给出边数组，需要自己推断节点数量
function countComponentsFromEdges(edges) {
    // 方法1：遍历所有边找到最大编号
    let maxNode = 0;
    for (const [u, v] of edges) {
        maxNode = Math.max(maxNode, u, v);
    }
    const uf = new UnionFind(maxNode + 1);
    
    for (const [u, v] of edges) {
        uf.union(u, v);
    }
    return uf.getCount();
}

// 方法2：使用Set统计所有出现的节点
function countComponentsFromEdgesV2(edges) {
    const nodes = new Set();
    for (const [u, v] of edges) {
        nodes.add(u);
        nodes.add(v);
    }
    const maxNode = Math.max(...nodes);
    const uf = new UnionFind(maxNode + 1);
    
    for (const [u, v] of edges) {
        uf.union(u, v);
    }
    return uf.getCount();
}
```

#### 情况3：二维网格问题
```javascript
// 题目：m×n的网格，每个格子是一个节点
function numIslands(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const uf = new UnionFind(m * n); // 总共有m*n个节点
    
    // 将二维坐标转换为一维索引
    function getIndex(i, j) {
        return i * n + j;
    }
    
    // 处理网格中的连接
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === '1') {
                // 连接相邻的陆地
                if (i > 0 && grid[i-1][j] === '1') {
                    uf.union(getIndex(i, j), getIndex(i-1, j));
                }
                if (j > 0 && grid[i][j-1] === '1') {
                    uf.union(getIndex(i, j), getIndex(i, j-1));
                }
            }
        }
    }
    
    return uf.getCount();
}
```

### 实际题目示例

#### 题目1：朋友圈问题
```javascript
// 有n个学生，编号0到n-1，给出朋友关系
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const uf = new UnionFind(n); // n个学生
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }
    
    return uf.getCount();
}
```

#### 题目2：冗余连接
```javascript
// 有n个节点，编号1到n，给出边数组
function findRedundantConnection(edges) {
    const n = edges.length; // 边数等于节点数
    const uf = new UnionFind(n + 1); // 节点编号1到n，所以需要n+1大小
    
    for (const [u, v] of edges) {
        if (uf.connected(u, v)) {
            return [u, v]; // 发现环，返回这条边
        }
        uf.union(u, v);
    }
    
    return [];
}
```

### 常见错误和避免方法

```javascript
// ❌ 错误：大小设置过小
const edges = [[0, 1], [1, 2], [3, 4]];
const uf = new UnionFind(3); // 错误！最大编号是4，需要大小5

// ✅ 正确：大小设置正确
const edges = [[0, 1], [1, 2], [3, 4]];
const uf = new UnionFind(5); // 正确！最大编号4，需要大小5

// ❌ 错误：忘记+1
const maxNode = 4;
const uf = new UnionFind(maxNode); // 错误！应该是maxNode + 1

// ✅ 正确：记得+1
const maxNode = 4;
const uf = new UnionFind(maxNode + 1); // 正确！
```

## 🔥 并查集的应用

### 1. 连通性问题
- **岛屿数量**：统计二维网格中的岛屿数量
- **朋友圈**：计算社交网络中的朋友圈数量
- **连通分量**：动态维护图的连通分量

### 2. 图论问题
- **最小生成树**：Kruskal算法的核心数据结构
- **环检测**：检测无向图中是否存在环
- **动态连通性**：在线处理边的添加和连通性查询

### 3. 实际应用
- **网络连通性**：计算机网络的连通性分析
- **图像处理**：连通区域标记
- **社交网络**：社区发现和关系分析
- **游戏开发**：地形连通性检测

## 📚 经典问题分类

### 1. 基础连通性
- [基础并查集实现](./BasicUnionFind.js) - 各种优化的并查集实现
- 动态连通性查询
- 连通分量统计

### 2. 图的连通性
- [连通分量问题](./ConnectedComponents.js) - 图的连通分量相关问题
- 岛屿数量问题
- 朋友圈问题

### 3. 图的构建
- [冗余连接](./RedundantConnection.js) - 检测和移除冗余边
- 最小生成树构建
- 环检测问题

### 4. 复杂应用
- [账户合并](./AccountsMerge.js) - 基于邮箱的账户合并
- 相似字符串组
- 等式方程的可满足性

## 💡 并查集变种

### 1. 带权并查集
```javascript
// 维护节点到根的距离或权重关系
class WeightedUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.weight = new Array(n).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            const root = this.find(this.parent[x]);
            this.weight[x] += this.weight[this.parent[x]];
            this.parent[x] = root;
        }
        return this.parent[x];
    }
}
```

### 2. 可撤销并查集
```javascript
// 支持撤销操作的并查集
class UndoableUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.history = [];
    }
    
    union(x, y) {
        // 记录操作历史
        this.history.push({/* operation details */});
        // 执行合并
    }
    
    undo() {
        // 撤销最后一次操作
        const lastOp = this.history.pop();
        // 恢复状态
    }
}
```

### 3. 动态并查集
```javascript
// 支持删除操作的并查集
class DynamicUnionFind {
    // 通过重建或标记删除实现
}
```

## 🎯 实现要点

### 1. 路径压缩
- **目的**：减少查找路径长度
- **方法**：在查找过程中将路径上的节点直接连到根
- **效果**：显著提高后续查找效率

### 2. 按秩合并
- **目的**：保持树的平衡
- **方法**：总是将较小的树连到较大的树上
- **度量**：可以用高度(rank)或大小(size)

### 3. 初始化策略
```javascript
// 数组索引作为元素
constructor(n) {
    this.parent = Array.from({length: n}, (_, i) => i);
}

// 任意元素类型
constructor() {
    this.parent = new Map();
}

makeSet(x) {
    if (!this.parent.has(x)) {
        this.parent.set(x, x);
    }
}
```

## 🔥 经典问题模式

### 1. 连通性统计
```javascript
// 方法1：使用count属性（推荐）
function countComponents(edges, n) {
    const uf = new UnionFind(n);
    for (const [u, v] of edges) {
        uf.union(u, v);
    }
    return uf.getCount(); // 直接返回独立集合数量
}

// 方法2：手动统计根节点数量
function countComponentsManual(edges, n) {
    const uf = new UnionFind(n);
    for (const [u, v] of edges) {
        uf.union(u, v);
    }
    
    const roots = new Set();
    for (let i = 0; i < n; i++) {
        roots.add(uf.find(i)); // 收集所有不同的根节点
    }
    return roots.size;
}

// 使用示例
const edges = [[0,1], [1,2], [3,4]];
const n = 5;
console.log("独立模块数量:", countComponents(edges, n)); // 2

// 验证：通过parent数组统计不同值的数量
function countByParentArray(uf, n) {
    const uniqueRoots = new Set();
    for (let i = 0; i < n; i++) {
        uniqueRoots.add(uf.find(i)); // 或者直接用uf.parent[i]
    }
    return uniqueRoots.size;
}

// 演示
const uf = new UnionFind(5);
uf.union(0, 1);
uf.union(1, 2);
uf.union(3, 4);
console.log("parent数组:", uf.parent); // [1, 2, 2, 4, 4]
console.log("不同值的数量:", new Set(uf.parent).size); // 2
console.log("独立模块数量:", uf.getCount()); // 2
```

### 2. 环检测
```javascript
// 检测无向图中的环
function hasCycle(edges, n) {
    const uf = new UnionFind(n);
    for (const [u, v] of edges) {
        if (uf.connected(u, v)) {
            return true; // 发现环
        }
        uf.union(u, v);
    }
    return false;
}
```

### 3. 动态连通性
```javascript
// 处理连接和查询操作
function processQueries(queries) {
    const uf = new UnionFind();
    const results = [];
    
    for (const query of queries) {
        if (query.type === 'union') {
            uf.union(query.x, query.y);
        } else if (query.type === 'find') {
            results.push(uf.connected(query.x, query.y));
        }
    }
    
    return results;
}
```

## 🎯 优化技巧

### 1. 启发式合并
- 按大小合并：将小集合合并到大集合
- 按高度合并：将矮树合并到高树
- 选择合适的启发式策略

### 2. 路径分裂
```javascript
// 路径分裂：另一种路径压缩方法
find(x) {
    while (this.parent[x] !== x) {
        const next = this.parent[x];
        this.parent[x] = this.parent[next];
        x = next;
    }
    return x;
}
```

### 3. 路径减半
```javascript
// 路径减半：轻量级的路径压缩
find(x) {
    while (this.parent[x] !== x) {
        this.parent[x] = this.parent[this.parent[x]];
        x = this.parent[x];
    }
    return x;
}
```

## 🚀 高级应用

### 1. 离线算法
- 将查询操作离线处理
- 结合并查集实现高效算法
- 如离线LCA、离线连通性查询

### 2. 分治算法
- 在分治过程中使用并查集
- 合并子问题的结果
- 如CDQ分治中的应用

### 3. 数据结构维护
- 维护动态图的连通性
- 支持边的添加和删除
- 结合其他数据结构使用

---

**并查集是处理动态连通性问题的最佳数据结构！**
