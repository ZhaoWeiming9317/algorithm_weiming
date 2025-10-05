/**
 * 超简化版 EventEmitter - 面试背诵版本
 * 只保留核心4个方法：on, emit, off, once
 */
class EventEmitterSimple {
  constructor() {
    this.events = {};
  }

  // 1. 监听事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return this;
  }

  // 2. 触发事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return this;
    
    this.events[eventName].forEach(callback => {
      callback(...args);
    });
    return this;
  }

  // 3. 移除监听
  off(eventName, callback) {
    if (!this.events[eventName]) return this;
    
    if (!callback) {
      delete this.events[eventName];
    } else {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
      if (this.events[eventName].length === 0) {
        delete this.events[eventName];
      }
    }
    return this;
  }

  // 4. 一次性监听
  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
    return this;
  }
}

// 测试示例 - 演示闭包
const emitter = new EventEmitterSimple();

console.log('=== 闭包演示 ===');

// 演示闭包：外层变量被内层函数访问
function demonstrateClosure() {
  const outerVariable = '我是外层变量';
  
  // 这里创建了一个闭包
  const innerFunction = () => {
    console.log('内层函数访问外层变量:', outerVariable); // ← 闭包！
  };
  
  return innerFunction;
}

const closureFunc = demonstrateClosure();
closureFunc(); // 即使 demonstrateClosure 执行完毕，innerFunction 仍能访问 outerVariable

console.log('\n=== EventEmitter 中的闭包 ===');

// once 方法中的闭包演示
emitter.once('closure-demo', (msg) => {
  console.log('原始回调收到:', msg);
});

// 查看闭包效果
console.log('events 对象:', emitter.events['closure-demo']);
console.log('闭包中的函数:', emitter.events['closure-demo'][0].toString());

console.log('\n调用 emit:');
emitter.emit('closure-demo', '闭包测试');

export default EventEmitterSimple;

// 这里写一下背诵点
// 1. constructor 里面放一个 events 对象
// 2. events 对象里面根据 eventName 作为 key 值, value 放一个数组，数组里面放着回调函数
// 3. on 方法：如果没有事件就创建数组，然后push回调函数
// 4. emit 方法：如果没有事件就返回false，否则forEach执行所有回调，参数通过 ...args 传递
// 5. off 方法：如果没有回调就删除整个事件，否则filter过滤掉指定回调
// 6. once 方法关键点：创建包装函数，执行后自动调用off移除自己
//    - 参数传递：emit的...args → forEach调用 → onceCallback的...args → 原始callback的...args

// 闭包：函数能够访问其外层作用域中的变量，即使外层函数已经执行完毕。
