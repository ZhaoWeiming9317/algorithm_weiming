# JavaScript 垃圾回收机制详解

## 目录
1. [垃圾回收基础概念](#垃圾回收基础概念)
2. [V8 引擎垃圾回收](#v8-引擎垃圾回收)
3. [垃圾回收算法](#垃圾回收算法)
4. [内存管理策略](#内存管理策略)
5. [内存泄漏检测和预防](#内存泄漏检测和预防)
6. [性能优化技巧](#性能优化技巧)
7. [面试题解析](#面试题解析)

---

## 垃圾回收基础概念

### 1. 什么是垃圾回收？

垃圾回收（Garbage Collection，GC）是自动内存管理的一种形式，用于自动释放不再使用的内存：

```javascript
// 垃圾回收示例
function createObject() {
    const obj = { name: 'test', data: new Array(1000).fill(0) };
    return obj; // obj 被返回，不会被回收
}

function createGarbage() {
    const obj = { name: 'garbage', data: new Array(1000).fill(0) };
    // obj 没有被返回或引用，会被垃圾回收
}

const result = createObject(); // result 持有对象引用
createGarbage(); // 函数执行完后，内部对象被回收
```

### 2. 内存生命周期

```javascript
// 内存生命周期
class MemoryLifecycle {
    // 1. 分配内存
    allocateMemory() {
        const obj = new Object();
        const arr = new Array(1000);
        return { obj, arr };
    }
    
    // 2. 使用内存
    useMemory(data) {
        data.obj.name = 'test';
        data.arr.push(1, 2, 3);
        return data;
    }
    
    // 3. 释放内存（自动）
    releaseMemory(data) {
        // 当 data 不再被引用时，垃圾回收器会自动释放内存
        data = null; // 显式清除引用
    }
}
```

### 3. 可达性分析

```javascript
// 可达性分析
class ReachabilityAnalysis {
    constructor() {
        this.root = null;
        this.objects = new Map();
    }
    
    // 根对象（全局变量、函数参数等）
    setRoot(obj) {
        this.root = obj;
    }
    
    // 添加对象引用
    addReference(from, to) {
        if (!this.objects.has(from)) {
            this.objects.set(from, new Set());
        }
        this.objects.get(from).add(to);
    }
    
    // 检查对象是否可达
    isReachable(obj) {
        const visited = new Set();
        const queue = [this.root];
        
        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current)) continue;
            
            visited.add(current);
            if (current === obj) return true;
            
            const references = this.objects.get(current);
            if (references) {
                queue.push(...references);
            }
        }
        
        return false;
    }
}
```

---

## V8 引擎垃圾回收

### 1. V8 内存结构

```javascript
// V8 内存结构
class V8MemoryStructure {
    constructor() {
        // 新生代（Young Generation）
        this.newSpace = {
            fromSpace: [], // 使用中的空间
            toSpace: []    // 空闲空间
        };
        
        // 老生代（Old Generation）
        this.oldSpace = [];        // 老生代对象
        this.codeSpace = [];       // 代码对象
        this.mapSpace = [];        // Map 对象
        this.largeObjectSpace = []; // 大对象空间
        
        // 其他空间
        this.readOnlySpace = [];   // 只读空间
        this.sharedSpace = [];     // 共享空间
    }
    
    // 分配内存
    allocate(size, type = 'new') {
        if (type === 'new') {
            return this.allocateInNewSpace(size);
        } else {
            return this.allocateInOldSpace(size);
        }
    }
    
    // 在新生代分配
    allocateInNewSpace(size) {
        if (this.newSpace.fromSpace.length + size > this.newSpaceLimit) {
            this.minorGC(); // 触发新生代垃圾回收
        }
        
        const obj = { size, data: new Array(size) };
        this.newSpace.fromSpace.push(obj);
        return obj;
    }
    
    // 在老生代分配
    allocateInOldSpace(size) {
        const obj = { size, data: new Array(size) };
        this.oldSpace.push(obj);
        return obj;
    }
}
```

### 2. 新生代垃圾回收（Minor GC）

```javascript
// 新生代垃圾回收
class MinorGC {
    constructor() {
        this.fromSpace = [];
        this.toSpace = [];
        this.scavengeCount = 0;
    }
    
    // Scavenge 算法
    scavenge() {
        console.log('开始新生代垃圾回收');
        this.scavengeCount++;
        
        // 1. 扫描根对象
        const roots = this.getRoots();
        const survivors = new Set();
        
        // 2. 复制存活对象
        for (const root of roots) {
            this.copyObject(root, survivors);
        }
        
        // 3. 交换空间
        [this.fromSpace, this.toSpace] = [this.toSpace, this.fromSpace];
        
        // 4. 清空 toSpace
        this.toSpace.length = 0;
        
        console.log(`新生代垃圾回收完成，存活对象: ${survivors.size}`);
        return survivors.size;
    }
    
    // 复制对象
    copyObject(obj, survivors) {
        if (survivors.has(obj)) return;
        
        survivors.add(obj);
        this.toSpace.push(obj);
        
        // 递归复制引用的对象
        if (obj.references) {
            for (const ref of obj.references) {
                this.copyObject(ref, survivors);
            }
        }
    }
    
    // 获取根对象
    getRoots() {
        // 全局变量、函数参数、局部变量等
        return [
            globalThis,
            ...this.getLocalVariables(),
            ...this.getFunctionParameters()
        ];
    }
}
```

### 3. 老生代垃圾回收（Major GC）

```javascript
// 老生代垃圾回收
class MajorGC {
    constructor() {
        this.oldSpace = [];
        this.markCount = 0;
        this.sweepCount = 0;
    }
    
    // Mark-Sweep 算法
    markSweep() {
        console.log('开始老生代垃圾回收');
        
        // 1. 标记阶段
        const marked = this.mark();
        
        // 2. 清除阶段
        const swept = this.sweep(marked);
        
        console.log(`老生代垃圾回收完成，回收对象: ${swept}`);
        return swept;
    }
    
    // 标记阶段
    mark() {
        const marked = new Set();
        const roots = this.getRoots();
        
        // 从根对象开始标记
        for (const root of roots) {
            this.markObject(root, marked);
        }
        
        return marked;
    }
    
    // 标记对象
    markObject(obj, marked) {
        if (marked.has(obj)) return;
        
        marked.add(obj);
        
        // 递归标记引用的对象
        if (obj.references) {
            for (const ref of obj.references) {
                this.markObject(ref, marked);
            }
        }
    }
    
    // 清除阶段
    sweep(marked) {
        let sweptCount = 0;
        
        for (let i = this.oldSpace.length - 1; i >= 0; i--) {
            const obj = this.oldSpace[i];
            
            if (!marked.has(obj)) {
                // 回收未标记的对象
                this.oldSpace.splice(i, 1);
                sweptCount++;
            }
        }
        
        return sweptCount;
    }
}
```

### 4. 增量标记和并发标记

```javascript
// 增量标记
class IncrementalMarking {
    constructor() {
        this.markingStack = [];
        this.isMarking = false;
        this.markingBudget = 1000; // 每次标记的对象数量
    }
    
    // 开始增量标记
    startIncrementalMarking() {
        this.isMarking = true;
        this.markingStack = [...this.getRoots()];
        console.log('开始增量标记');
    }
    
    // 增量标记步骤
    incrementalMarkStep() {
        if (!this.isMarking) return false;
        
        let processed = 0;
        
        while (this.markingStack.length > 0 && processed < this.markingBudget) {
            const obj = this.markingStack.pop();
            this.markObject(obj);
            processed++;
        }
        
        if (this.markingStack.length === 0) {
            this.finishIncrementalMarking();
            return true; // 标记完成
        }
        
        return false; // 标记未完成
    }
    
    // 完成增量标记
    finishIncrementalMarking() {
        this.isMarking = false;
        console.log('增量标记完成');
        this.sweep(); // 开始清除阶段
    }
}

// 并发标记
class ConcurrentMarking {
    constructor() {
        this.worker = null;
        this.isConcurrent = false;
    }
    
    // 开始并发标记
    startConcurrentMarking() {
        this.isConcurrent = true;
        
        // 在 Web Worker 中执行标记
        this.worker = new Worker('marking-worker.js');
        this.worker.postMessage({ action: 'startMarking' });
        
        this.worker.onmessage = (event) => {
            if (event.data.action === 'markingComplete') {
                this.finishConcurrentMarking();
            }
        };
    }
    
    // 完成并发标记
    finishConcurrentMarking() {
        this.isConcurrent = false;
        this.worker.terminate();
        console.log('并发标记完成');
    }
}
```

---

## 垃圾回收算法

### 1. 引用计数算法

```javascript
// 引用计数算法
class ReferenceCounting {
    constructor() {
        this.referenceCounts = new WeakMap();
        this.objects = new Set();
    }
    
    // 创建对象
    createObject(data) {
        const obj = { data, references: new Set() };
        this.referenceCounts.set(obj, 0);
        this.objects.add(obj);
        return obj;
    }
    
    // 添加引用
    addReference(obj) {
        const count = this.referenceCounts.get(obj) || 0;
        this.referenceCounts.set(obj, count + 1);
        console.log(`对象引用计数: ${count + 1}`);
    }
    
    // 移除引用
    removeReference(obj) {
        const count = this.referenceCounts.get(obj) || 0;
        if (count > 0) {
            this.referenceCounts.set(obj, count - 1);
            console.log(`对象引用计数: ${count - 1}`);
            
            // 引用计数为 0 时回收
            if (count - 1 === 0) {
                this.collectObject(obj);
            }
        }
    }
    
    // 回收对象
    collectObject(obj) {
        console.log('回收对象:', obj);
        this.objects.delete(obj);
        this.referenceCounts.delete(obj);
        
        // 递归回收引用的对象
        if (obj.references) {
            for (const ref of obj.references) {
                this.removeReference(ref);
            }
        }
    }
    
    // 循环引用示例
    createCircularReference() {
        const obj1 = this.createObject('obj1');
        const obj2 = this.createObject('obj2');
        
        // 创建循环引用
        obj1.references.add(obj2);
        obj2.references.add(obj1);
        
        this.addReference(obj1);
        this.addReference(obj2);
        
        // 移除引用，但由于循环引用，对象不会被回收
        this.removeReference(obj1);
        this.removeReference(obj2);
        
        return { obj1, obj2 };
    }
}
```

### 2. 标记清除算法

```javascript
// 标记清除算法
class MarkSweep {
    constructor() {
        this.objects = new Set();
        this.marked = new Set();
    }
    
    // 创建对象
    createObject(data) {
        const obj = { data, references: new Set() };
        this.objects.add(obj);
        return obj;
    }
    
    // 标记阶段
    mark() {
        console.log('开始标记阶段');
        this.marked.clear();
        
        const roots = this.getRoots();
        for (const root of roots) {
            this.markObject(root);
        }
    }
    
    // 标记对象
    markObject(obj) {
        if (this.marked.has(obj)) return;
        
        this.marked.add(obj);
        console.log('标记对象:', obj.data);
        
        // 递归标记引用的对象
        if (obj.references) {
            for (const ref of obj.references) {
                this.markObject(ref);
            }
        }
    }
    
    // 清除阶段
    sweep() {
        console.log('开始清除阶段');
        let sweptCount = 0;
        
        for (const obj of this.objects) {
            if (!this.marked.has(obj)) {
                console.log('回收对象:', obj.data);
                this.objects.delete(obj);
                sweptCount++;
            }
        }
        
        console.log(`清除完成，回收对象数量: ${sweptCount}`);
        return sweptCount;
    }
    
    // 垃圾回收
    collect() {
        this.mark();
        return this.sweep();
    }
    
    // 获取根对象
    getRoots() {
        // 模拟根对象（全局变量等）
        return Array.from(this.objects).filter(obj => obj.isRoot);
    }
}
```

### 3. 复制算法

```javascript
// 复制算法
class CopyingGC {
    constructor() {
        this.fromSpace = [];
        this.toSpace = [];
        this.allocPtr = 0;
    }
    
    // 分配内存
    allocate(size) {
        if (this.allocPtr + size > this.toSpace.length) {
            this.collect(); // 触发垃圾回收
        }
        
        const obj = {
            size,
            data: new Array(size),
            references: new Set()
        };
        
        this.toSpace.push(obj);
        this.allocPtr += size;
        
        return obj;
    }
    
    // 垃圾回收
    collect() {
        console.log('开始复制垃圾回收');
        
        // 1. 扫描根对象
        const roots = this.getRoots();
        const survivors = new Set();
        
        // 2. 复制存活对象
        for (const root of roots) {
            this.copyObject(root, survivors);
        }
        
        // 3. 交换空间
        [this.fromSpace, this.toSpace] = [this.toSpace, this.fromSpace];
        
        // 4. 重置分配指针
        this.allocPtr = 0;
        
        console.log(`复制垃圾回收完成，存活对象: ${survivors.size}`);
        return survivors.size;
    }
    
    // 复制对象
    copyObject(obj, survivors) {
        if (survivors.has(obj)) return;
        
        // 创建新对象
        const newObj = {
            size: obj.size,
            data: [...obj.data],
            references: new Set()
        };
        
        survivors.add(newObj);
        this.toSpace.push(newObj);
        
        // 递归复制引用的对象
        if (obj.references) {
            for (const ref of obj.references) {
                const newRef = this.copyObject(ref, survivors);
                newObj.references.add(newRef);
            }
        }
        
        return newObj;
    }
}
```

---

## 内存管理策略

### 1. 内存分配策略

```javascript
// 内存分配策略
class MemoryAllocationStrategy {
    constructor() {
        this.smallObjects = []; // 小对象池
        this.largeObjects = []; // 大对象池
        this.objectPools = new Map(); // 对象池
    }
    
    // 分配小对象
    allocateSmall(size) {
        if (size <= 1024) { // 1KB 以下为小对象
            return this.allocateFromPool('small', size);
        }
        return this.allocateDirect(size);
    }
    
    // 分配大对象
    allocateLarge(size) {
        if (size > 1024 * 1024) { // 1MB 以上为大对象
            return this.allocateFromPool('large', size);
        }
        return this.allocateDirect(size);
    }
    
    // 从对象池分配
    allocateFromPool(type, size) {
        if (!this.objectPools.has(type)) {
            this.objectPools.set(type, []);
        }
        
        const pool = this.objectPools.get(type);
        
        // 尝试从池中获取
        for (let i = 0; i < pool.length; i++) {
            if (pool[i].size >= size) {
                return pool.splice(i, 1)[0];
            }
        }
        
        // 池中没有合适的对象，创建新的
        return this.createObject(size);
    }
    
    // 回收对象到池
    recycleObject(obj) {
        const type = obj.size <= 1024 ? 'small' : 'large';
        const pool = this.objectPools.get(type) || [];
        pool.push(obj);
        this.objectPools.set(type, pool);
    }
    
    // 直接分配
    allocateDirect(size) {
        return {
            size,
            data: new Array(size),
            references: new Set()
        };
    }
    
    // 创建对象
    createObject(size) {
        return {
            size,
            data: new Array(size),
            references: new Set(),
            timestamp: Date.now()
        };
    }
}
```

### 2. 内存监控

```javascript
// 内存监控
class MemoryMonitor {
    constructor() {
        this.memoryStats = [];
        this.monitoringInterval = null;
    }
    
    // 开始监控
    startMonitoring(interval = 1000) {
        this.monitoringInterval = setInterval(() => {
            this.collectMemoryStats();
        }, interval);
        
        console.log('开始内存监控');
    }
    
    // 停止监控
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        console.log('停止内存监控');
    }
    
    // 收集内存统计
    collectMemoryStats() {
        if (performance.memory) {
            const stats = {
                timestamp: Date.now(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
            
            this.memoryStats.push(stats);
            
            // 检查内存使用率
            const usageRatio = stats.usedJSHeapSize / stats.jsHeapSizeLimit;
            if (usageRatio > 0.8) {
                console.warn('内存使用率过高:', usageRatio);
            }
        }
    }
    
    // 获取内存报告
    getMemoryReport() {
        if (this.memoryStats.length === 0) {
            return '没有内存统计数据';
        }
        
        const latest = this.memoryStats[this.memoryStats.length - 1];
        const average = this.calculateAverage();
        
        return {
            current: latest,
            average: average,
            trend: this.calculateTrend(),
            recommendations: this.getRecommendations(latest)
        };
    }
    
    // 计算平均值
    calculateAverage() {
        const sum = this.memoryStats.reduce((acc, stat) => {
            return {
                usedJSHeapSize: acc.usedJSHeapSize + stat.usedJSHeapSize,
                totalJSHeapSize: acc.totalJSHeapSize + stat.totalJSHeapSize
            };
        }, { usedJSHeapSize: 0, totalJSHeapSize: 0 });
        
        const count = this.memoryStats.length;
        return {
            usedJSHeapSize: sum.usedJSHeapSize / count,
            totalJSHeapSize: sum.totalJSHeapSize / count
        };
    }
    
    // 计算趋势
    calculateTrend() {
        if (this.memoryStats.length < 2) return 'stable';
        
        const recent = this.memoryStats.slice(-10);
        const trend = recent.reduce((acc, stat, index) => {
            if (index === 0) return acc;
            return acc + (stat.usedJSHeapSize - recent[index - 1].usedJSHeapSize);
        }, 0);
        
        if (trend > 0) return 'increasing';
        if (trend < 0) return 'decreasing';
        return 'stable';
    }
    
    // 获取建议
    getRecommendations(stats) {
        const recommendations = [];
        const usageRatio = stats.usedJSHeapSize / stats.jsHeapSizeLimit;
        
        if (usageRatio > 0.8) {
            recommendations.push('内存使用率过高，建议检查内存泄漏');
        }
        
        if (usageRatio > 0.9) {
            recommendations.push('内存使用率极高，建议立即优化');
        }
        
        return recommendations;
    }
}
```

---

## 内存泄漏检测和预防

### 1. 常见内存泄漏类型

```javascript
// 常见内存泄漏类型
class MemoryLeakTypes {
    // 1. 全局变量泄漏
    globalVariableLeak() {
        // ❌ 错误：创建全局变量
        window.leakedData = new Array(1000000).fill(0);
        
        // ✅ 正确：使用局部变量
        const localData = new Array(1000000).fill(0);
        return localData;
    }
    
    // 2. 闭包泄漏
    closureLeak() {
        // ❌ 错误：闭包持有大对象引用
        const largeObject = new Array(1000000).fill(0);
        return function() {
            console.log('闭包函数');
            // largeObject 不会被回收
        };
        
        // ✅ 正确：及时释放引用
        const largeObject = new Array(1000000).fill(0);
        const result = function() {
            console.log('闭包函数');
        };
        largeObject = null; // 释放引用
        return result;
    }
    
    // 3. 事件监听器泄漏
    eventListenerLeak() {
        // ❌ 错误：没有移除事件监听器
        const element = document.createElement('div');
        element.addEventListener('click', function() {
            console.log('点击事件');
        });
        
        // ✅ 正确：移除事件监听器
        const element = document.createElement('div');
        const handler = function() {
            console.log('点击事件');
        };
        element.addEventListener('click', handler);
        
        // 在不需要时移除
        element.removeEventListener('click', handler);
    }
    
    // 4. DOM 引用泄漏
    domReferenceLeak() {
        // ❌ 错误：持有 DOM 元素引用
        const elements = [];
        for (let i = 0; i < 1000; i++) {
            const element = document.createElement('div');
            elements.push(element);
        }
        
        // ✅ 正确：及时清理 DOM 引用
        const elements = [];
        for (let i = 0; i < 1000; i++) {
            const element = document.createElement('div');
            elements.push(element);
        }
        
        // 使用完后清理
        elements.length = 0;
    }
    
    // 5. 定时器泄漏
    timerLeak() {
        // ❌ 错误：没有清除定时器
        const timer = setInterval(() => {
            console.log('定时器执行');
        }, 1000);
        
        // ✅ 正确：清除定时器
        const timer = setInterval(() => {
            console.log('定时器执行');
        }, 1000);
        
        // 在不需要时清除
        clearInterval(timer);
    }
}
```

### 2. 内存泄漏检测工具

```javascript
// 内存泄漏检测工具
class MemoryLeakDetector {
    constructor() {
        this.snapshots = [];
        this.leakPatterns = new Map();
        this.monitoring = false;
    }
    
    // 开始检测
    startDetection() {
        this.monitoring = true;
        console.log('开始内存泄漏检测');
        
        // 定期创建堆快照
        setInterval(() => {
            if (this.monitoring) {
                this.createHeapSnapshot();
            }
        }, 5000);
    }
    
    // 停止检测
    stopDetection() {
        this.monitoring = false;
        console.log('停止内存泄漏检测');
    }
    
    // 创建堆快照
    createHeapSnapshot() {
        if (performance.memory) {
            const snapshot = {
                timestamp: Date.now(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
            
            this.snapshots.push(snapshot);
            
            // 检查内存泄漏
            this.checkForLeaks();
        }
    }
    
    // 检查内存泄漏
    checkForLeaks() {
        if (this.snapshots.length < 2) return;
        
        const recent = this.snapshots.slice(-10);
        const trend = this.calculateMemoryTrend(recent);
        
        if (trend > 0.1) { // 内存增长超过 10%
            console.warn('检测到潜在内存泄漏');
            this.analyzeLeakPattern();
        }
    }
    
    // 计算内存趋势
    calculateMemoryTrend(snapshots) {
        if (snapshots.length < 2) return 0;
        
        const first = snapshots[0];
        const last = snapshots[snapshots.length - 1];
        
        return (last.usedJSHeapSize - first.usedJSHeapSize) / first.usedJSHeapSize;
    }
    
    // 分析泄漏模式
    analyzeLeakPattern() {
        const patterns = [
            '全局变量泄漏',
            '闭包泄漏',
            '事件监听器泄漏',
            'DOM 引用泄漏',
            '定时器泄漏'
        ];
        
        for (const pattern of patterns) {
            if (this.detectPattern(pattern)) {
                console.warn(`检测到 ${pattern}`);
            }
        }
    }
    
    // 检测特定模式
    detectPattern(pattern) {
        switch (pattern) {
            case '全局变量泄漏':
                return this.detectGlobalVariableLeak();
            case '闭包泄漏':
                return this.detectClosureLeak();
            case '事件监听器泄漏':
                return this.detectEventListenerLeak();
            case 'DOM 引用泄漏':
                return this.detectDOMReferenceLeak();
            case '定时器泄漏':
                return this.detectTimerLeak();
            default:
                return false;
        }
    }
    
    // 检测全局变量泄漏
    detectGlobalVariableLeak() {
        const globalProps = Object.getOwnPropertyNames(window);
        return globalProps.length > 100; // 全局属性过多
    }
    
    // 检测闭包泄漏
    detectClosureLeak() {
        // 检查函数作用域链
        const functions = this.getAllFunctions();
        return functions.some(func => func.closureSize > 1000);
    }
    
    // 检测事件监听器泄漏
    detectEventListenerLeak() {
        const elements = document.querySelectorAll('*');
        let totalListeners = 0;
        
        elements.forEach(element => {
            totalListeners += this.getEventListenerCount(element);
        });
        
        return totalListeners > 1000; // 事件监听器过多
    }
    
    // 检测 DOM 引用泄漏
    detectDOMReferenceLeak() {
        const elements = document.querySelectorAll('*');
        return elements.length > 10000; // DOM 元素过多
    }
    
    // 检测定时器泄漏
    detectTimerLeak() {
        // 检查活跃的定时器数量
        return this.getActiveTimerCount() > 100;
    }
    
    // 获取所有函数
    getAllFunctions() {
        const functions = [];
        const objects = this.getAllObjects();
        
        objects.forEach(obj => {
            if (typeof obj === 'function') {
                functions.push(obj);
            }
        });
        
        return functions;
    }
    
    // 获取所有对象
    getAllObjects() {
        const objects = [];
        const visited = new Set();
        
        const traverse = (obj) => {
            if (visited.has(obj)) return;
            visited.add(obj);
            
            objects.push(obj);
            
            if (typeof obj === 'object' && obj !== null) {
                Object.values(obj).forEach(value => {
                    if (typeof value === 'object' && value !== null) {
                        traverse(value);
                    }
                });
            }
        };
        
        traverse(window);
        return objects;
    }
    
    // 获取事件监听器数量
    getEventListenerCount(element) {
        // 这是一个简化的实现，实际实现会更复杂
        return element._listeners ? element._listeners.length : 0;
    }
    
    // 获取活跃定时器数量
    getActiveTimerCount() {
        // 这是一个简化的实现，实际实现会更复杂
        return 0;
    }
}
```

### 3. 内存泄漏预防

```javascript
// 内存泄漏预防
class MemoryLeakPrevention {
    constructor() {
        this.cleanupFunctions = new Set();
        this.resourceRegistry = new Map();
    }
    
    // 注册清理函数
    registerCleanup(cleanupFn) {
        this.cleanupFunctions.add(cleanupFn);
    }
    
    // 注册资源
    registerResource(id, resource) {
        this.resourceRegistry.set(id, resource);
    }
    
    // 清理所有资源
    cleanup() {
        console.log('开始清理资源');
        
        // 执行清理函数
        for (const cleanupFn of this.cleanupFunctions) {
            try {
                cleanupFn();
            } catch (error) {
                console.error('清理函数执行失败:', error);
            }
        }
        
        // 清理资源
        for (const [id, resource] of this.resourceRegistry) {
            try {
                this.cleanupResource(resource);
            } catch (error) {
                console.error(`资源 ${id} 清理失败:`, error);
            }
        }
        
        // 清空注册表
        this.cleanupFunctions.clear();
        this.resourceRegistry.clear();
        
        console.log('资源清理完成');
    }
    
    // 清理资源
    cleanupResource(resource) {
        if (resource.cleanup) {
            resource.cleanup();
        } else if (resource.close) {
            resource.close();
        } else if (resource.destroy) {
            resource.destroy();
        }
    }
    
    // 创建可清理的对象
    createCleanableObject(data) {
        const obj = {
            data,
            cleanup: () => {
                obj.data = null;
                console.log('对象已清理');
            }
        };
        
        this.registerResource(`obj_${Date.now()}`, obj);
        return obj;
    }
    
    // 创建可清理的事件监听器
    createCleanableEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        const cleanup = () => {
            element.removeEventListener(event, handler);
            console.log('事件监听器已清理');
        };
        
        this.registerCleanup(cleanup);
        return cleanup;
    }
    
    // 创建可清理的定时器
    createCleanableTimer(callback, delay) {
        const timer = setInterval(callback, delay);
        
        const cleanup = () => {
            clearInterval(timer);
            console.log('定时器已清理');
        };
        
        this.registerCleanup(cleanup);
        return cleanup;
    }
}
```

---

## 性能优化技巧

### 1. 对象池模式

```javascript
// 对象池模式
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = new Set();
        
        // 预创建对象
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    // 获取对象
    acquire() {
        let obj;
        
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        
        this.active.add(obj);
        return obj;
    }
    
    // 释放对象
    release(obj) {
        if (this.active.has(obj)) {
            this.active.delete(obj);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }
    
    // 清理池
    clear() {
        this.pool.length = 0;
        this.active.clear();
    }
}

// 使用对象池
class ParticleSystem {
    constructor() {
        this.particlePool = new ObjectPool(
            () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0 }),
            (particle) => {
                particle.x = 0;
                particle.y = 0;
                particle.vx = 0;
                particle.vy = 0;
                particle.life = 0;
            }
        );
        
        this.particles = [];
    }
    
    // 创建粒子
    createParticle(x, y, vx, vy) {
        const particle = this.particlePool.acquire();
        particle.x = x;
        particle.y = y;
        particle.vx = vx;
        particle.vy = vy;
        particle.life = 1.0;
        
        this.particles.push(particle);
        return particle;
    }
    
    // 更新粒子
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            particle.life -= deltaTime;
            
            if (particle.life <= 0) {
                this.particlePool.release(particle);
                this.particles.splice(i, 1);
            }
        }
    }
}
```

### 2. 内存预分配

```javascript
// 内存预分配
class MemoryPreAllocator {
    constructor() {
        this.preAllocatedArrays = [];
        this.preAllocatedObjects = [];
        this.arrayPool = new Map();
        this.objectPool = new Map();
    }
    
    // 预分配数组
    preAllocateArrays(count, size) {
        for (let i = 0; i < count; i++) {
            const arr = new Array(size);
            this.preAllocatedArrays.push(arr);
        }
    }
    
    // 预分配对象
    preAllocateObjects(count, template) {
        for (let i = 0; i < count; i++) {
            const obj = { ...template };
            this.preAllocatedObjects.push(obj);
        }
    }
    
    // 获取预分配的数组
    getArray(size) {
        const key = size.toString();
        
        if (!this.arrayPool.has(key)) {
            this.arrayPool.set(key, []);
        }
        
        const pool = this.arrayPool.get(key);
        
        if (pool.length > 0) {
            return pool.pop();
        }
        
        return new Array(size);
    }
    
    // 释放数组
    releaseArray(arr) {
        const key = arr.length.toString();
        
        if (!this.arrayPool.has(key)) {
            this.arrayPool.set(key, []);
        }
        
        const pool = this.arrayPool.get(key);
        
        // 清空数组
        arr.length = 0;
        pool.push(arr);
    }
    
    // 获取预分配的对象
    getObject(template) {
        const key = JSON.stringify(template);
        
        if (!this.objectPool.has(key)) {
            this.objectPool.set(key, []);
        }
        
        const pool = this.objectPool.get(key);
        
        if (pool.length > 0) {
            return pool.pop();
        }
        
        return { ...template };
    }
    
    // 释放对象
    releaseObject(obj, template) {
        const key = JSON.stringify(template);
        
        if (!this.objectPool.has(key)) {
            this.objectPool.set(key, []);
        }
        
        const pool = this.objectPool.get(key);
        
        // 重置对象
        Object.keys(template).forEach(key => {
            obj[key] = template[key];
        });
        
        pool.push(obj);
    }
}
```

### 3. 延迟加载

```javascript
// 延迟加载
class LazyLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
    }
    
    // 延迟加载模块
    async loadModule(moduleName, loader) {
        // 检查是否已加载
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }
        
        // 检查是否正在加载
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }
        
        // 开始加载
        const loadingPromise = loader().then(module => {
            this.loadedModules.set(moduleName, module);
            this.loadingPromises.delete(moduleName);
            return module;
        });
        
        this.loadingPromises.set(moduleName, loadingPromise);
        return loadingPromise;
    }
    
    // 预加载模块
    async preloadModule(moduleName, loader) {
        if (!this.loadedModules.has(moduleName) && !this.loadingPromises.has(moduleName)) {
            return this.loadModule(moduleName, loader);
        }
    }
    
    // 卸载模块
    unloadModule(moduleName) {
        this.loadedModules.delete(moduleName);
        this.loadingPromises.delete(moduleName);
    }
    
    // 清理所有模块
    cleanup() {
        this.loadedModules.clear();
        this.loadingPromises.clear();
    }
}

// 使用延迟加载
class LazyComponentLoader {
    constructor() {
        this.loader = new LazyLoader();
    }
    
    // 加载组件
    async loadComponent(componentName) {
        return this.loader.loadModule(componentName, () => {
            return import(`./components/${componentName}.js`);
        });
    }
    
    // 预加载组件
    async preloadComponent(componentName) {
        return this.loader.preloadModule(componentName, () => {
            return import(`./components/${componentName}.js`);
        });
    }
}
```

---

## 面试题解析

### 1. 基础题

**Q: JavaScript 的垃圾回收机制是怎样的？**

**A:** JavaScript 使用自动垃圾回收机制，主要特点：
- **自动管理**：无需手动释放内存
- **可达性分析**：基于对象是否可达判断是否需要回收
- **分代回收**：分为新生代和老生代，使用不同回收策略
- **增量回收**：避免长时间阻塞主线程

### 2. V8 引擎题

**Q: V8 引擎的垃圾回收算法是什么？**

**A:** V8 引擎使用分代垃圾回收：
- **新生代**：使用 Scavenge 算法，快速回收短期对象
- **老生代**：使用 Mark-Sweep 和 Mark-Compact 算法
- **增量标记**：避免长时间阻塞
- **并发标记**：在后台线程执行标记

### 3. 内存泄漏题

**Q: 如何检测和预防内存泄漏？**

**A:** 检测和预防方法：
- **检测工具**：Chrome DevTools、内存监控工具
- **常见类型**：全局变量、闭包、事件监听器、DOM 引用、定时器
- **预防措施**：及时清理引用、使用对象池、避免循环引用
- **监控指标**：内存使用率、对象数量、GC 频率

### 4. 性能优化题

**Q: 如何优化 JavaScript 内存使用？**

**A:** 优化策略：
- **对象池**：复用对象，减少创建和销毁开销
- **内存预分配**：提前分配内存，避免运行时分配
- **延迟加载**：按需加载模块和资源
- **及时清理**：释放不再使用的引用
- **监控内存**：实时监控内存使用情况

### 5. 实际应用题

**Q: 在大型应用中如何管理内存？**

**A:** 管理策略：
- **模块化设计**：按功能模块管理内存
- **生命周期管理**：明确对象的创建和销毁时机
- **资源池**：使用资源池管理频繁创建的对象
- **监控告警**：设置内存使用阈值和告警
- **定期清理**：定期执行内存清理和优化

---

## 总结

1. **垃圾回收机制**：自动管理内存，基于可达性分析
2. **V8 引擎**：分代回收，新生代和老生代使用不同策略
3. **内存泄漏**：常见类型包括全局变量、闭包、事件监听器等
4. **性能优化**：使用对象池、内存预分配、延迟加载等技术
5. **监控管理**：实时监控内存使用，及时发现问题

记住：**理解垃圾回收机制对编写高性能 JavaScript 代码至关重要**。
