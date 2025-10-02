/**
 * 图的表示方法实现
 * 包括邻接矩阵、邻接表、边列表三种主要表示方法
 */

/**
 * 邻接矩阵表示的图
 */
export class AdjacencyMatrixGraph {
    constructor(numVertices, isDirected = false) {
        this.numVertices = numVertices;
        this.isDirected = isDirected;
        // 初始化邻接矩阵，0表示无边，1表示有边
        this.matrix = Array(numVertices).fill(null).map(() => 
            Array(numVertices).fill(0)
        );
    }

    /**
     * 添加边
     * @param {number} from - 起始顶点
     * @param {number} to - 目标顶点
     * @param {number} weight - 边的权重，默认为1
     */
    addEdge(from, to, weight = 1) {
        if (this.isValidVertex(from) && this.isValidVertex(to)) {
            this.matrix[from][to] = weight;
            if (!this.isDirected) {
                this.matrix[to][from] = weight; // 无向图需要双向添加
            }
        }
    }

    /**
     * 删除边
     */
    removeEdge(from, to) {
        if (this.isValidVertex(from) && this.isValidVertex(to)) {
            this.matrix[from][to] = 0;
            if (!this.isDirected) {
                this.matrix[to][from] = 0;
            }
        }
    }

    /**
     * 检查两个顶点是否相邻
     */
    hasEdge(from, to) {
        if (this.isValidVertex(from) && this.isValidVertex(to)) {
            return this.matrix[from][to] !== 0;
        }
        return false;
    }

    /**
     * 获取顶点的所有邻居
     */
    getNeighbors(vertex) {
        if (!this.isValidVertex(vertex)) return [];
        
        const neighbors = [];
        for (let i = 0; i < this.numVertices; i++) {
            if (this.matrix[vertex][i] !== 0) {
                neighbors.push({
                    vertex: i,
                    weight: this.matrix[vertex][i]
                });
            }
        }
        return neighbors;
    }

    /**
     * 获取顶点的度数
     */
    getDegree(vertex) {
        if (!this.isValidVertex(vertex)) return 0;
        
        if (this.isDirected) {
            // 有向图返回出度和入度
            const outDegree = this.matrix[vertex].reduce((sum, weight) => 
                sum + (weight !== 0 ? 1 : 0), 0);
            const inDegree = this.matrix.reduce((sum, row) => 
                sum + (row[vertex] !== 0 ? 1 : 0), 0);
            return { outDegree, inDegree };
        } else {
            // 无向图返回度数
            return this.matrix[vertex].reduce((sum, weight) => 
                sum + (weight !== 0 ? 1 : 0), 0);
        }
    }

    /**
     * 验证顶点是否有效
     */
    isValidVertex(vertex) {
        return vertex >= 0 && vertex < this.numVertices;
    }

    /**
     * 打印图的邻接矩阵
     */
    printMatrix() {
        console.log('邻接矩阵:');
        console.log('   ', Array.from({length: this.numVertices}, (_, i) => i).join(' '));
        this.matrix.forEach((row, i) => {
            console.log(`${i}: [${row.join(' ')}]`);
        });
    }

    /**
     * 获取边的总数
     */
    getEdgeCount() {
        let count = 0;
        for (let i = 0; i < this.numVertices; i++) {
            for (let j = 0; j < this.numVertices; j++) {
                if (this.matrix[i][j] !== 0) {
                    count++;
                }
            }
        }
        return this.isDirected ? count : count / 2;
    }
}

/**
 * 邻接表表示的图
 */
export class AdjacencyListGraph {
    constructor(isDirected = false) {
        this.isDirected = isDirected;
        this.adjList = new Map(); // 使用Map存储邻接表
    }

    /**
     * 添加顶点
     */
    addVertex(vertex) {
        if (!this.adjList.has(vertex)) {
            this.adjList.set(vertex, []);
        }
    }

    /**
     * 添加边
     */
    addEdge(from, to, weight = 1) {
        // 确保顶点存在
        this.addVertex(from);
        this.addVertex(to);

        // 添加边
        this.adjList.get(from).push({ vertex: to, weight });
        
        if (!this.isDirected) {
            this.adjList.get(to).push({ vertex: from, weight });
        }
    }

    /**
     * 删除边
     */
    removeEdge(from, to) {
        if (this.adjList.has(from)) {
            this.adjList.set(from, 
                this.adjList.get(from).filter(edge => edge.vertex !== to)
            );
        }
        
        if (!this.isDirected && this.adjList.has(to)) {
            this.adjList.set(to, 
                this.adjList.get(to).filter(edge => edge.vertex !== from)
            );
        }
    }

    /**
     * 删除顶点
     */
    removeVertex(vertex) {
        if (!this.adjList.has(vertex)) return;

        // 删除所有指向该顶点的边
        for (const [v, edges] of this.adjList) {
            this.adjList.set(v, edges.filter(edge => edge.vertex !== vertex));
        }

        // 删除该顶点
        this.adjList.delete(vertex);
    }

    /**
     * 检查边是否存在
     */
    hasEdge(from, to) {
        if (!this.adjList.has(from)) return false;
        return this.adjList.get(from).some(edge => edge.vertex === to);
    }

    /**
     * 获取顶点的邻居
     */
    getNeighbors(vertex) {
        return this.adjList.get(vertex) || [];
    }

    /**
     * 获取所有顶点
     */
    getVertices() {
        return Array.from(this.adjList.keys());
    }

    /**
     * 获取顶点数量
     */
    getVertexCount() {
        return this.adjList.size;
    }

    /**
     * 获取边数量
     */
    getEdgeCount() {
        let count = 0;
        for (const edges of this.adjList.values()) {
            count += edges.length;
        }
        return this.isDirected ? count : count / 2;
    }

    /**
     * 获取顶点的度数
     */
    getDegree(vertex) {
        if (!this.adjList.has(vertex)) return 0;

        if (this.isDirected) {
            const outDegree = this.adjList.get(vertex).length;
            let inDegree = 0;
            for (const [v, edges] of this.adjList) {
                if (v !== vertex) {
                    inDegree += edges.filter(edge => edge.vertex === vertex).length;
                }
            }
            return { outDegree, inDegree };
        } else {
            return this.adjList.get(vertex).length;
        }
    }

    /**
     * 打印邻接表
     */
    printAdjList() {
        console.log('邻接表:');
        for (const [vertex, edges] of this.adjList) {
            const edgeStr = edges.map(edge => 
                `${edge.vertex}(${edge.weight})`
            ).join(', ');
            console.log(`${vertex}: [${edgeStr}]`);
        }
    }
}

/**
 * 边列表表示的图
 */
export class EdgeListGraph {
    constructor(isDirected = false) {
        this.isDirected = isDirected;
        this.edges = []; // 存储所有边
        this.vertices = new Set(); // 存储所有顶点
    }

    /**
     * 添加边
     */
    addEdge(from, to, weight = 1) {
        this.edges.push({ from, to, weight });
        this.vertices.add(from);
        this.vertices.add(to);

        if (!this.isDirected) {
            // 无向图需要添加反向边（但在边列表中通常只存储一次）
            // 这里为了保持一致性，我们只存储一次，但在算法中需要考虑双向性
        }
    }

    /**
     * 删除边
     */
    removeEdge(from, to) {
        this.edges = this.edges.filter(edge => 
            !(edge.from === from && edge.to === to) &&
            !((!this.isDirected) && edge.from === to && edge.to === from)
        );
    }

    /**
     * 获取所有边
     */
    getEdges() {
        return [...this.edges];
    }

    /**
     * 获取所有顶点
     */
    getVertices() {
        return Array.from(this.vertices);
    }

    /**
     * 获取边数量
     */
    getEdgeCount() {
        return this.edges.length;
    }

    /**
     * 获取顶点数量
     */
    getVertexCount() {
        return this.vertices.size;
    }

    /**
     * 检查边是否存在
     */
    hasEdge(from, to) {
        return this.edges.some(edge => 
            (edge.from === from && edge.to === to) ||
            ((!this.isDirected) && edge.from === to && edge.to === from)
        );
    }

    /**
     * 获取顶点的所有邻居
     */
    getNeighbors(vertex) {
        const neighbors = [];
        
        for (const edge of this.edges) {
            if (edge.from === vertex) {
                neighbors.push({ vertex: edge.to, weight: edge.weight });
            } else if (!this.isDirected && edge.to === vertex) {
                neighbors.push({ vertex: edge.from, weight: edge.weight });
            }
        }
        
        return neighbors;
    }

    /**
     * 打印边列表
     */
    printEdges() {
        console.log('边列表:');
        this.edges.forEach((edge, index) => {
            const arrow = this.isDirected ? '->' : '--';
            console.log(`${index}: ${edge.from} ${arrow} ${edge.to} (${edge.weight})`);
        });
    }
}

/**
 * 图表示方法转换工具
 */
export class GraphConverter {
    /**
     * 邻接表转邻接矩阵
     */
    static adjListToMatrix(adjListGraph) {
        const vertices = adjListGraph.getVertices();
        const vertexMap = new Map();
        vertices.forEach((v, i) => vertexMap.set(v, i));
        
        const matrix = new AdjacencyMatrixGraph(vertices.length, adjListGraph.isDirected);
        
        for (const vertex of vertices) {
            const neighbors = adjListGraph.getNeighbors(vertex);
            for (const neighbor of neighbors) {
                matrix.addEdge(
                    vertexMap.get(vertex), 
                    vertexMap.get(neighbor.vertex), 
                    neighbor.weight
                );
            }
        }
        
        return { matrix, vertexMap };
    }

    /**
     * 边列表转邻接表
     */
    static edgeListToAdjList(edgeListGraph) {
        const adjList = new AdjacencyListGraph(edgeListGraph.isDirected);
        
        for (const edge of edgeListGraph.getEdges()) {
            adjList.addEdge(edge.from, edge.to, edge.weight);
        }
        
        return adjList;
    }

    /**
     * 邻接表转边列表
     */
    static adjListToEdgeList(adjListGraph) {
        const edgeList = new EdgeListGraph(adjListGraph.isDirected);
        
        for (const vertex of adjListGraph.getVertices()) {
            const neighbors = adjListGraph.getNeighbors(vertex);
            for (const neighbor of neighbors) {
                edgeList.addEdge(vertex, neighbor.vertex, neighbor.weight);
            }
        }
        
        return edgeList;
    }
}

// 测试和演示
console.log('=== 图的表示方法演示 ===\n');

// 创建一个简单的无向图进行测试
// 图结构：
//   0 --- 1
//   |     |
//   2 --- 3

console.log('1. 邻接矩阵表示：');
const matrixGraph = new AdjacencyMatrixGraph(4, false);
matrixGraph.addEdge(0, 1);
matrixGraph.addEdge(0, 2);
matrixGraph.addEdge(1, 3);
matrixGraph.addEdge(2, 3);
matrixGraph.printMatrix();
console.log(`边数: ${matrixGraph.getEdgeCount()}`);
console.log(`顶点0的邻居:`, matrixGraph.getNeighbors(0));
console.log(`顶点0的度数:`, matrixGraph.getDegree(0));

console.log('\n2. 邻接表表示：');
const adjListGraph = new AdjacencyListGraph(false);
adjListGraph.addEdge(0, 1);
adjListGraph.addEdge(0, 2);
adjListGraph.addEdge(1, 3);
adjListGraph.addEdge(2, 3);
adjListGraph.printAdjList();
console.log(`边数: ${adjListGraph.getEdgeCount()}`);
console.log(`顶点数: ${adjListGraph.getVertexCount()}`);

console.log('\n3. 边列表表示：');
const edgeListGraph = new EdgeListGraph(false);
edgeListGraph.addEdge(0, 1);
edgeListGraph.addEdge(0, 2);
edgeListGraph.addEdge(1, 3);
edgeListGraph.addEdge(2, 3);
edgeListGraph.printEdges();
console.log(`顶点0的邻居:`, edgeListGraph.getNeighbors(0));

console.log('\n4. 表示方法转换：');
const convertedAdjList = GraphConverter.edgeListToAdjList(edgeListGraph);
console.log('从边列表转换的邻接表：');
convertedAdjList.printAdjList();

console.log('\n=== 性能对比 ===');
console.log('邻接矩阵 - 空间: O(V²), 查询边: O(1), 遍历邻居: O(V)');
console.log('邻接表   - 空间: O(V+E), 查询边: O(degree), 遍历邻居: O(degree)');
console.log('边列表   - 空间: O(E), 查询边: O(E), 遍历邻居: O(E)');
console.log('\n推荐使用邻接表，适合大多数图算法！');
