/**
 * 实现一个基本的事件发射器
 * 支持：订阅事件(on)、触发事件(emit)、一次性订阅(once)、取消订阅(off)
 * 
 * 注意点：
 * 1. 事件存储：使用对象存储事件回调数组
 * 2. 链式调用：支持方法链式调用
 * 3. 上下文绑定：确保回调函数的 this 指向正确
 * 4. 错误处理：处理各种异常情况
 */
class EventEmitter {
  constructor() {
    // 使用对象存储事件和回调函数的映射
    this.events = {};
  }

  /**
   * 订阅事件
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   * @returns {EventEmitter} 返回实例以支持链式调用
   */
  on(eventName, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return this;
  }

  /**
   * 触发事件
   * @param {string} eventName 事件名称
   * @param {...any} args 传递给回调函数的参数
   * @returns {EventEmitter} 返回实例以支持链式调用
   */
  emit(eventName, ...args) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      // 创建副本避免回调中的取消订阅影响遍历
      [...callbacks].forEach(callback => {
        try {
          callback.apply(this, args);
        } catch (err) {
          console.error('Error in event handler:', err);
        }
      });
    }
    return this;
  }

  /**
   * 一次性订阅事件
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   * @returns {EventEmitter} 返回实例以支持链式调用
   */
  once(eventName, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    // 创建包装函数，执行后自动取消订阅
    const wrapper = (...args) => {
      callback.apply(this, args);
      this.off(eventName, wrapper);
    };
    // 保存原始函数的引用，用于后续可能的取消订阅
    wrapper.original = callback;
    
    return this.on(eventName, wrapper);
  }

  /**
   * 取消订阅
   * @param {string} eventName 事件名称
   * @param {Function} [callback] 可选的回调函数，如果不提供则取消该事件的所有订阅
   * @returns {EventEmitter} 返回实例以支持链式调用
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return this;

    if (!callback) {
      // 如果没有提供回调，删除整个事件
      delete this.events[eventName];
    } else {
      // 过滤掉要取消的回调（包括 once 包装的回调）
      this.events[eventName] = this.events[eventName].filter(cb => {
        return cb !== callback && cb.original !== callback;
      });
      
      // 如果没有回调了，删除事件
      if (this.events[eventName].length === 0) {
        delete this.events[eventName];
      }
    }
    return this;
  }
}

/**
 * 实现发布订阅模式
 * 区别于 EventEmitter：
 * 1. 更注重于解耦发布者和订阅者
 * 2. 通常用于跨组件/模块通信
 * 3. 提供取消订阅的函数返回值
 */
class PubSub {
  constructor() {
    this.subscribers = {};
  }

  /**
   * 订阅主题
   * @param {string} topic 主题名称
   * @param {Function} callback 回调函数
   * @returns {Function} 返回取消订阅的函数
   */
  subscribe(topic, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(callback);

    // 返回取消订阅的函数
    return () => this.unsubscribe(topic, callback);
  }

  /**
   * 发布消息到主题
   * @param {string} topic 主题名称
   * @param {*} data 要发布的数据
   */
  publish(topic, data) {
    if (!this.subscribers[topic]) return;

    this.subscribers[topic].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error('Error in subscriber:', err);
      }
    });
  }

  /**
   * 取消订阅
   * @param {string} topic 主题名称
   * @param {Function} [callback] 可选的回调函数
   */
  unsubscribe(topic, callback) {
    if (!this.subscribers[topic]) return;

    if (!callback) {
      delete this.subscribers[topic];
    } else {
      this.subscribers[topic] = this.subscribers[topic].filter(cb => cb !== callback);
      if (this.subscribers[topic].length === 0) {
        delete this.subscribers[topic];
      }
    }
  }
}