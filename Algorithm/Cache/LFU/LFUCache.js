/**
 * LFU (Least Frequently Used) 缓存实现
 * 特点：淘汰访问频率最低的数据，如果频率相同，淘汰最旧的数据
 */
class LFUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();  // 存储键值对
        this.freqMap = new Map();  // 存储频率到节点集合的映射
        this.keyFreq = new Map();  // 存储键到频率的映射
        this.minFreq = 0;  // 当前最小频率
    }

    /**
     * 获取值
     * @param {number} key
     * @return {number}
     */
    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }

        // 更新频率
        const value = this.cache.get(key);
        const oldFreq = this.keyFreq.get(key);
        const newFreq = oldFreq + 1;

        // 从旧频率集合中移除
        this.freqMap.get(oldFreq).delete(key);
        if (this.freqMap.get(oldFreq).size === 0) {
            this.freqMap.delete(oldFreq);
            // 如果是最小频率且该频率没有其他元素，更新最小频率
            if (this.minFreq === oldFreq) {
                this.minFreq = newFreq;
            }
        }

        // 添加到新频率集合
        if (!this.freqMap.has(newFreq)) {
            this.freqMap.set(newFreq, new Set());
        }
        this.freqMap.get(newFreq).add(key);
        this.keyFreq.set(key, newFreq);

        return value;
    }

    /**
     * 放入值
     * @param {number} key
     * @param {number} value
     * @return {void}
     */
    put(key, value) {
        if (this.capacity <= 0) return;

        // 如果key已存在，更新值和频率
        if (this.cache.has(key)) {
            this.cache.set(key, value);
            this.get(key); // 更新频率
            return;
        }

        // 如果缓存已满，删除访问频率最低的元素
        if (this.cache.size >= this.capacity) {
            // 获取最小频率的集合
            const minFreqKeys = this.freqMap.get(this.minFreq);
            // 获取第一个key（最旧的）
            const keyToDelete = minFreqKeys.values().next().value;
            
            // 删除相关数据
            minFreqKeys.delete(keyToDelete);
            if (minFreqKeys.size === 0) {
                this.freqMap.delete(this.minFreq);
            }
            this.cache.delete(keyToDelete);
            this.keyFreq.delete(keyToDelete);
        }

        // 插入新值
        this.cache.set(key, value);
        this.keyFreq.set(key, 1);
        if (!this.freqMap.has(1)) {
            this.freqMap.set(1, new Set());
        }
        this.freqMap.get(1).add(key);
        this.minFreq = 1;
    }
}

// 测试用例
function test() {
    const cache = new LFUCache(2);
    
    // 测试基本操作
    cache.put(1, 1);   // 缓存 {1=1}
    cache.put(2, 2);   // 缓存 {1=1, 2=2}
    console.log(cache.get(1));      // 返回 1
    cache.put(3, 3);   // 去除键 2，缓存 {1=1, 3=3}
    console.log(cache.get(2));      // 返回 -1（未找到）
    console.log(cache.get(3));      // 返回 3
    cache.put(4, 4);   // 去除键 1，缓存 {4=4, 3=3}
    console.log(cache.get(1));      // 返回 -1（未找到）
    console.log(cache.get(3));      // 返回 3
    console.log(cache.get(4));      // 返回 4
}

// test();
module.exports = LFUCache;
