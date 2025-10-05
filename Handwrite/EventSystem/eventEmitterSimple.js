/**
 * 简化版 EventEmitter 实现
 * 面试手写版本 - 核心功能，易于记忆
 */

class EventEmitterSimple {
  constructor() {
    // 存储事件和对应的监听器
    this.events = {};
  }

  /**
   * 添加事件监听器
   * @param {string} eventName 事件名
   * @param {Function} callback 回调函数
   */
  on(eventName, callback) {
    // 如果事件不存在，创建空数组
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    
    // 添加回调函数到事件数组
    this.events[eventName].push(callback);
  }

  /**
   * 添加一次性事件监听器
   * @param {string} eventName 事件名
   * @param {Function} callback 回调函数
   */
  once(eventName, callback) {
    // 包装回调函数，执行后自动移除
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    
    this.on(eventName, onceCallback);
  }

  /**
   * 触发事件
   * @param {string} eventName 事件名
   * @param {...any} args 传递给回调函数的参数
   */
  emit(eventName, ...args) {
    // 如果事件不存在，直接返回
    if (!this.events[eventName]) {
      return false;
    }
    
    // 执行所有回调函数
    this.events[eventName].forEach(callback => {
      callback(...args);
    });
    
    return true;
  }

  /**
   * 移除事件监听器
   * @param {string} eventName 事件名
   * @param {Function} callback 要移除的回调函数
   */
  off(eventName, callback) {
    // 如果事件不存在，直接返回
    if (!this.events[eventName]) {
      return this;
    }
    
    // 如果没有指定回调函数，移除所有监听器
    if (!callback) {
      delete this.events[eventName];
      return this;
    }
    
    // 移除指定的回调函数
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    
    // 如果数组为空，删除事件
    if (this.events[eventName].length === 0) {
      delete this.events[eventName];
    }
    
    return this;
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners(eventName) {
    if (eventName) {
      // 移除指定事件的所有监听器
      delete this.events[eventName];
    } else {
      // 移除所有事件的所有监听器
      this.events = {};
    }
    return this;
  }

  /**
   * 获取指定事件的监听器数量
   * @param {string} eventName 事件名
   * @returns {number} 监听器数量
   */
  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }
}

// 使用示例
const emitter = new EventEmitterSimple();

// 添加监听器
emitter.on('test', (data) => {
  console.log('收到数据:', data);
});

emitter.on('test', (data) => {
  console.log('另一个监听器:', data);
});

// 一次性监听器
emitter.once('once', () => {
  console.log('只会执行一次');
});

// 触发事件
emitter.emit('test', 'Hello World');
emitter.emit('once');
emitter.emit('once'); // 不会执行

// 移除监听器
emitter.off('test');

// 获取监听器数量
console.log(emitter.listenerCount('test')); // 0

module.exports = EventEmitterSimple;
