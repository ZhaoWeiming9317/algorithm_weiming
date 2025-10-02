/**
 * 并查集基础实现 - 从朴素到优化的完整演进
 * 
 * 并查集的核心操作：
 * 1. Find(x) - 查找x所属集合的代表
 * 2. Union(x, y) - 合并x和y所在的集合
 * 3. Connected(x, y) - 判断x和y是否连通
 */

/**
 * 朴素并查集实现 - 基础版本
 * 时间复杂度：Find O(n), Union O(n)
 */
export class NaiveUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.count = n; // 连通分量数量
    }
    
    /**
     * 查找根节点 - 朴素实现
     */
    find(x) {
        while (this.parent[x] !== x) {
            x = this.parent[x];
        }
        return x;
    }
    
    /**
     * 合并两个集合 - 朴素实现
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            this.parent[rootX] = rootY; // 简单地将一个根指向另一个
            this.count--;
        }
    }
    
    /**
     * 判断是否连通
     */
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    /**
     * 获取连通分量数量
     */
    getCount() {
        return this.count;
    }
}

/**
 * 路径压缩优化的并查集
 * 时间复杂度：Find O(logn), Union O(logn)
 */
export class PathCompressionUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.count = n;
    }
    
    /**
     * 查找根节点 - 路径压缩优化
     */
    find(x) {
        if (this.parent[x] !== x) {
            // 路径压缩：将路径上的所有节点直接连到根节点
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            this.parent[rootX] = rootY;
            this.count--;
        }
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getCount() {
        return this.count;
    }
}

/**
 * 按秩合并优化的并查集
 * 时间复杂度：Find O(logn), Union O(logn)
 */
export class UnionByRankUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0); // 树的高度（秩）
        this.count = n;
    }
    
    find(x) {
        while (this.parent[x] !== x) {
            x = this.parent[x];
        }
        return x;
    }
    
    /**
     * 按秩合并 - 总是将较矮的树连到较高的树上
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                // 秩相等时，任选一个作为根，并增加其秩
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
            this.count--;
        }
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getCount() {
        return this.count;
    }
}

/**
 * 完全优化的并查集 - 路径压缩 + 按秩合并
 * 时间复杂度：Find O(α(n)), Union O(α(n))
 * α(n) 是阿克曼函数的反函数，实际应用中可视为常数
 */
export class OptimizedUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.count = n;
    }
    
    /**
     * 查找根节点 - 路径压缩
     */
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // 路径压缩
        }
        return this.parent[x];
    }
    
    /**
     * 合并集合 - 按秩合并
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            // 按秩合并
            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
            this.count--;
        }
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getCount() {
        return this.count;
    }
    
    /**
     * 获取集合大小 - 需要额外维护size数组
     */
    getSize(x) {
        // 这里简化实现，实际需要维护size数组
        const root = this.find(x);
        let size = 0;
        for (let i = 0; i < this.parent.length; i++) {
            if (this.find(i) === root) {
                size++;
            }
        }
        return size;
    }
}

/**
 * 按大小合并的并查集 - 另一种启发式策略
 */
export class UnionBySizeUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.size = new Array(n).fill(1); // 集合大小
        this.count = n;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    /**
     * 按大小合并 - 将小集合合并到大集合
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX !== rootY) {
            // 按大小合并
            if (this.size[rootX] < this.size[rootY]) {
                this.parent[rootX] = rootY;
                this.size[rootY] += this.size[rootX];
            } else {
                this.parent[rootY] = rootX;
                this.size[rootX] += this.size[rootY];
            }
            this.count--;
        }
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getCount() {
        return this.count;
    }
    
    /**
     * 获取集合大小
     */
    getSize(x) {
        return this.size[this.find(x)];
    }
}

/**
 * 支持任意类型元素的并查集
 */
export class GenericUnionFind {
    constructor() {
        this.parent = new Map();
        this.rank = new Map();
        this.count = 0;
    }
    
    /**
     * 创建新集合
     */
    makeSet(x) {
        if (!this.parent.has(x)) {
            this.parent.set(x, x);
            this.rank.set(x, 0);
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
            const rankX = this.rank.get(rootX);
            const rankY = this.rank.get(rootY);
            
            if (rankX < rankY) {
                this.parent.set(rootX, rootY);
            } else if (rankX > rankY) {
                this.parent.set(rootY, rootX);
            } else {
                this.parent.set(rootY, rootX);
                this.rank.set(rootX, rankX + 1);
            }
            this.count--;
        }
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getCount() {
        return this.count;
    }
}

/**
 * 性能测试函数
 */
function performanceTest(UnionFindClass, n, operations) {
    console.log(`\n=== ${UnionFindClass.name} 性能测试 ===`);
    console.log(`元素数量: ${n}, 操作数量: ${operations}`);
    
    const uf = new UnionFindClass(n);
    const startTime = Date.now();
    
    // 随机执行union和find操作
    for (let i = 0; i < operations; i++) {
        const x = Math.floor(Math.random() * n);
        const y = Math.floor(Math.random() * n);
        
        if (Math.random() < 0.7) {
            uf.union(x, y);
        } else {
            uf.connected(x, y);
        }
    }
    
    const endTime = Date.now();
    console.log(`执行时间: ${endTime - startTime}ms`);
    console.log(`最终连通分量数: ${uf.getCount()}`);
}

/**
 * 可视化并查集状态
 */
function visualizeUnionFind(uf, n) {
    console.log('\n并查集状态可视化:');
    
    // 按根节点分组
    const groups = new Map();
    for (let i = 0; i < n; i++) {
        const root = uf.find(i);
        if (!groups.has(root)) {
            groups.set(root, []);
        }
        groups.get(root).push(i);
    }
    
    console.log('连通分量:');
    let groupIndex = 1;
    for (const [root, members] of groups) {
        console.log(`分量 ${groupIndex++}: [${members.join(', ')}] (根: ${root})`);
    }
}

// 测试和演示
console.log('=== 并查集实现演示 ===\n');

// 创建测试数据
const n = 10;
const testOperations = [
    ['union', 0, 1],
    ['union', 2, 3],
    ['union', 4, 5],
    ['union', 1, 2], // 连接两个分量
    ['connected', 0, 3],
    ['union', 6, 7],
    ['union', 8, 9],
    ['union', 5, 6], // 再次连接分量
    ['connected', 4, 7],
    ['connected', 0, 8]
];

console.log('测试操作序列:');
testOperations.forEach((op, i) => {
    console.log(`${i + 1}. ${op[0]}(${op.slice(1).join(', ')})`);
});

// 测试不同的并查集实现
const implementations = [
    NaiveUnionFind,
    PathCompressionUnionFind,
    UnionByRankUnionFind,
    OptimizedUnionFind,
    UnionBySizeUnionFind
];

implementations.forEach(UnionFindClass => {
    console.log(`\n=== ${UnionFindClass.name} 测试 ===`);
    
    const uf = new UnionFindClass(n);
    console.log(`初始连通分量数: ${uf.getCount()}`);
    
    testOperations.forEach((op, i) => {
        if (op[0] === 'union') {
            uf.union(op[1], op[2]);
            console.log(`${i + 1}. union(${op[1]}, ${op[2]}) -> 分量数: ${uf.getCount()}`);
        } else if (op[0] === 'connected') {
            const result = uf.connected(op[1], op[2]);
            console.log(`${i + 1}. connected(${op[1]}, ${op[2]}) -> ${result}`);
        }
    });
    
    visualizeUnionFind(uf, n);
});

// 测试泛型并查集
console.log('\n=== GenericUnionFind 测试 ===');
const genericUF = new GenericUnionFind();

const stringOperations = [
    ['union', 'Alice', 'Bob'],
    ['union', 'Charlie', 'David'],
    ['union', 'Bob', 'Charlie'],
    ['connected', 'Alice', 'David'],
    ['union', 'Eve', 'Frank'],
    ['connected', 'Alice', 'Eve']
];

stringOperations.forEach(op => {
    if (op[0] === 'union') {
        genericUF.union(op[1], op[2]);
        console.log(`union(${op[1]}, ${op[2]}) -> 分量数: ${genericUF.getCount()}`);
    } else if (op[0] === 'connected') {
        const result = genericUF.connected(op[1], op[2]);
        console.log(`connected(${op[1]}, ${op[2]}) -> ${result}`);
    }
});

// 性能对比测试
console.log('\n=== 性能对比测试 ===');
const testSize = 1000;
const testOps = 5000;

performanceTest(NaiveUnionFind, testSize, testOps);
performanceTest(PathCompressionUnionFind, testSize, testOps);
performanceTest(OptimizedUnionFind, testSize, testOps);

console.log('\n=== 并查集实现总结 ===');
console.log('1. 朴素实现: 简单但效率低，O(n)');
console.log('2. 路径压缩: 显著提升查找效率，O(logn)');
console.log('3. 按秩合并: 保持树的平衡，O(logn)');
console.log('4. 完全优化: 路径压缩+按秩合并，O(α(n))');
console.log('5. 按大小合并: 另一种启发式策略');
console.log('6. 泛型实现: 支持任意类型元素');
console.log('7. 实际应用: 连通性问题、图算法、动态等价类');
