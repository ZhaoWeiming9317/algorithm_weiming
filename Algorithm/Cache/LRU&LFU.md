# LRU vs LFU 详细对比

## 1. 基本概念

### LRU (Least Recently Used)
- 淘汰**最久未使用**的数据
- 关注**最后一次访问时间**
- 适合**最近访问的数据很快会再次被访问**的场景

### LFU (Least Frequently Used)
- 淘汰**访问频率最低**的数据
- 关注**历史访问频率**
- 适合**访问频率相对稳定**的场景

## 2. 实现差异

### LRU 实现
```javascript
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();        // key -> 节点
        this.head = new Node();        // 虚拟头节点
        this.tail = new Node();        // 虚拟尾节点
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        
        // 1. 获取节点
        const node = this.cache.get(key);
        // 2. 移动到头部（表示最近使用）
        this.moveToHead(node);
        // 3. 返回值
        return node.value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            // 1. 更新已存在的节点
            const node = this.cache.get(key);
            node.value = value;
            this.moveToHead(node);
        } else {
            // 2. 创建新节点
            const node = new Node(key, value);
            this.cache.set(key, node);
            this.addToHead(node);
            
            // 3. 检查容量
            if (this.cache.size > this.capacity) {
                // 删除最久未使用的节点（尾部）
                const tail = this.removeTail();
                this.cache.delete(tail.key);
            }
        }
    }
}
```

### LFU 实现
```javascript
class LFUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();        // key -> value
        this.freqMap = new Map();      // freq -> Set<key>
        this.keyFreq = new Map();      // key -> freq
        this.minFreq = 0;              // 当前最小频率
    }

    get(key) {
        if (!this.cache.has(key)) return -1;

        // 1. 获取当前频率
        const oldFreq = this.keyFreq.get(key);
        const newFreq = oldFreq + 1;
        
        // 2. 更新频率集合
        this.freqMap.get(oldFreq).delete(key);
        if (!this.freqMap.has(newFreq)) {
            this.freqMap.set(newFreq, new Set());
        }
        this.freqMap.get(newFreq).add(key);
        
        // 3. 更新最小频率
        if (this.freqMap.get(oldFreq).size === 0) {
            if (this.minFreq === oldFreq) {
                this.minFreq = newFreq;
            }
        }
        
        // 4. 更新key的频率
        this.keyFreq.set(key, newFreq);
        return this.cache.get(key);
    }

    put(key, value) {
        if (this.capacity <= 0) return;

        if (this.cache.has(key)) {
            this.cache.set(key, value);
            this.get(key); // 更新频率
            return;
        }

        if (this.cache.size >= this.capacity) {
            // 1. 获取最小频率的key集合
            const minFreqKeys = this.freqMap.get(this.minFreq);
            // 2. 删除第一个key（最早的）
            const keyToDelete = minFreqKeys.values().next().value;
            minFreqKeys.delete(keyToDelete);
            this.cache.delete(keyToDelete);
            this.keyFreq.delete(keyToDelete);
        }

        // 3. 插入新key
        this.cache.set(key, value);
        this.keyFreq.set(key, 1);
        if (!this.freqMap.has(1)) {
            this.freqMap.set(1, new Set());
        }
        this.freqMap.get(1).add(key);
        this.minFreq = 1;
    }
}
```

## 3. 关键区别

### 数据结构
- **LRU**：双向链表 + 哈希表
  - 链表：维护访问顺序
  - 哈希表：O(1)查找节点
- **LFU**：三个哈希表 + 最小频率
  - cache：存储值
  - freqMap：按频率分组
  - keyFreq：记录频率
  - minFreq：快速找到最小频率

### 淘汰策略
- **LRU**：
  - 直接删除链表尾部节点
  - 不需要额外计数
  - 实现简单直观
- **LFU**：
  - 删除最小频率集合中最早的节点
  - 需要维护频率计数
  - 实现相对复杂

### 更新操作
- **LRU**：
  - 访问/更新时移动节点到头部
  - 只需要改变节点位置
- **LFU**：
  - 访问/更新时增加频率
  - 需要维护频率集合和最小频率

## 4. 使用场景对比

### 适合 LRU 的场景
1. **浏览器前进/后退**：最近访问的页面很可能再次访问
2. **数据库缓存**：最近查询的数据可能会再次查询
3. **短期热点数据**：突发性的热点访问

### 适合 LFU 的场景
1. **内容推荐**：经常被访问的内容可能更有价值
2. **网站缓存**：高频访问的静态资源
3. **长期热点数据**：稳定的访问模式

## 5. 性能对比

### 时间复杂度
- **LRU**：所有操作 O(1)
- **LFU**：所有操作 O(1)，但常数时间更大

### 空间复杂度
- **LRU**：O(capacity)
  - Map: O(n)
  - 双向链表: O(n)
- **LFU**：O(capacity)
  - 三个Map: O(n)
  - 额外的频率信息: O(n)

### 实现复杂度
- **LRU**：
  - 实现简单
  - 维护成本低
  - 代码量少
- **LFU**：
  - 实现复杂
  - 维护成本高
  - 代码量大

## 6. 实际应用建议

1. **选择建议**：
   - 默认选择 LRU（实现简单，效果不错）
   - 有明确的频率需求时选择 LFU

2. **混合使用**：
   - 可以考虑同时使用两种策略
   - 根据数据特征动态选择

3. **注意事项**：
   - LRU 可能会误删除频繁使用但暂时未访问的数据
   - LFU 可能会保留历史高频但已不再使用的数据
