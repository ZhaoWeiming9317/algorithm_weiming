/**
 * LRU缓存的双向链表节点
 */
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

/**
 * LRU缓存实现
 * @param {number} capacity - 缓存容量
 */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // 哈希表：key -> Node
        
        // 创建虚拟头尾节点
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * 将节点移动到链表头部（最近使用）
     * @param {Node} node - 要移动的节点
     */
    moveToHead(node) {
        this.removeNode(node);
        this.addToHead(node);
    }

    /**
     * 从链表中删除节点
     * @param {Node} node - 要删除的节点
     */
    removeNode(node) {
        // 更新相邻节点的指针
        node.prev.next = node.next;
        node.next.prev = node.prev;
        
        // 断开当前节点的指针（可选但推荐）
        node.prev = null;
        node.next = null;
    }

    /**
     * 将节点添加到链表头部
     * @param {Node} node - 要添加的节点
     */
    addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    /**
     * 删除链表尾部节点（最久未使用）
     * @returns {Node} 被删除的节点
     */
    removeTail() {
        const node = this.tail.prev;
        this.removeNode(node);
        return node;
    }

    /**
     * 获取缓存中的值
     * @param {number} key - 键
     * @returns {number} 值，如果不存在返回-1
     */
    get(key) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            // 将访问的节点移到头部
            this.moveToHead(node);
            return node.value;
        }
        return -1;
    }

    /**
     * 放入或更新缓存
     * @param {number} key - 键
     * @param {number} value - 值
     */
    put(key, value) {
        if (this.cache.has(key)) {
            // 更新已存在的节点
            const node = this.cache.get(key);
            node.value = value;
            this.moveToHead(node);
        } else {
            // 创建新节点
            const newNode = new Node(key, value);
            this.cache.set(key, newNode);
            this.addToHead(newNode);
            
            // 检查是否超出容量
            if (this.cache.size > this.capacity) {
                // 删除最久未使用的节点
                const tail = this.removeTail();
                this.cache.delete(tail.key);
            }
        }
    }
}

// 使用示例
function example() {
    // 创建容量为2的LRU缓存
    const cache = new LRUCache(2);
    
    // 放入数据
    cache.put(1, 1); // 缓存是 {1=1}
    cache.put(2, 2); // 缓存是 {1=1, 2=2}
    console.log(cache.get(1));  // 返回 1
    
    // 放入新数据，导致淘汰最久未使用的数据
    cache.put(3, 3); // 删除key 2，缓存是 {1=1, 3=3}
    console.log(cache.get(2));  // 返回 -1 (未找到)
    
    // 继续放入新数据
    cache.put(4, 4); // 删除key 1，缓存是 {4=4, 3=3}
    console.log(cache.get(1));  // 返回 -1 (未找到)
    console.log(cache.get(3));  // 返回 3
    console.log(cache.get(4));  // 返回 4
}

// 运行示例
example();

module.exports = LRUCache;
