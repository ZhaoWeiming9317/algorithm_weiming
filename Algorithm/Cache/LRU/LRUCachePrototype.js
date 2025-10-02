/**
 * 双向链表节点
 * @param {number} key
 * @param {number} value
 */
var Node = function(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
};

/**
 * LRU 缓存
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    // 初始化属性
    this.capacity = capacity;
    this.cache = new Map();
    
    // 创建虚拟头尾节点
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
};

/**
 * 将节点移动到头部（最近使用）
 * @param {Node} node
 */
LRUCache.prototype.moveToHead = function(node) {
    // 先删除节点
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
    
    // 再添加到头部
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
};

/**
 * 添加节点到头部
 * @param {Node} node
 */
LRUCache.prototype.addToHead = function(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
};

/**
 * 删除尾部节点（最久未使用）
 * @return {Node}
 */
LRUCache.prototype.removeTail = function() {
    const node = this.tail.prev;
    node.prev.next = this.tail;
    this.tail.prev = node.prev;
    node.prev = null;
    node.next = null;
    return node;
};

/** 
 * 获取缓存中的值
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (this.cache.has(key)) {
        const node = this.cache.get(key);
        // 将访问的节点移到头部
        this.moveToHead(node);
        return node.value;
    }
    return -1;
};

/** 
 * 放入或更新缓存
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
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
};

/** 
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

// 使用示例
function example() {
    // 创建容量为2的LRU缓存
    const cache = new LRUCache(2);
    
    // 测试操作
    cache.put(1, 1);    // 缓存是 {1=1}
    cache.put(2, 2);    // 缓存是 {1=1, 2=2}
    console.log(cache.get(1));     // 返回 1
    cache.put(3, 3);    // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
    console.log(cache.get(2));     // 返回 -1 (未找到)
    cache.put(4, 4);    // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
    console.log(cache.get(1));     // 返回 -1 (未找到)
    console.log(cache.get(3));     // 返回 3
    console.log(cache.get(4));     // 返回 4
}

// 运行示例
example();
