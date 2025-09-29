/**
 * this 指向问题的各种场景和解决方案
 */

// ==================== 1. this 指向的基本规则 ====================

console.log('=== 1. 基本 this 指向规则 ===');

// 1.1 全局环境中的 this
console.log('全局 this:', this); // 浏览器中是 window，Node.js 中是 global

// 1.2 普通函数调用
function normalFunction() {
  console.log('普通函数 this:', this); // 严格模式下是 undefined，非严格模式是全局对象
}
normalFunction();

// 1.3 对象方法调用
const obj = {
  name: 'Object',
  sayHello: function() {
    console.log('对象方法 this.name:', this.name); // this 指向 obj
  }
};
obj.sayHello(); // "Object"

// ==================== 2. this 丢失的常见问题 ====================

console.log('\n=== 2. this 丢失问题 ===');

// 2.1 方法赋值给变量
const sayHello = obj.sayHello;
// sayHello(); // this.name 是 undefined，因为 this 丢失了

// 2.2 回调函数中的 this 丢失
const button = {
  text: 'Click me',
  handleClick: function() {
    console.log('按钮文本:', this.text);
  }
};

// 模拟事件回调
function simulateClick(callback) {
  callback(); // this 丢失
}

console.log('回调中的 this 丢失:');
// simulateClick(button.handleClick); // this.text 是 undefined

// ==================== 3. 解决 this 指向问题的方法 ====================

console.log('\n=== 3. 解决 this 指向问题 ===');

// 3.1 使用 bind 方法
const boundSayHello = obj.sayHello.bind(obj);
boundSayHello(); // 正确输出 "Object"

// 3.2 使用箭头函数
const arrowObj = {
  name: 'Arrow Object',
  sayHello: function() {
    // 箭头函数继承外层 this
    const innerArrow = () => {
      console.log('箭头函数 this.name:', this.name);
    };
    innerArrow();
  }
};
arrowObj.sayHello(); // "Arrow Object"

// 3.3 使用 call 和 apply
function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: 'Alice' };
greet.call(person, 'Hello', '!'); // "Hello, Alice!"
greet.apply(person, ['Hi', '?']); // "Hi, Alice?"

// ==================== 4. 手写实现 call, apply, bind ====================

console.log('\n=== 4. 手写实现 call, apply, bind ===');

// 4.1 手写 call
Function.prototype.myCall = function(context, ...args) {
  // 如果没有传入 context，默认为全局对象
  context = context || globalThis;
  
  // 创建一个唯一的属性名，避免覆盖原有属性
  const fnSymbol = Symbol('fn');
  
  // 将函数作为 context 的方法
  context[fnSymbol] = this;
  
  // 调用函数并获取结果
  const result = context[fnSymbol](...args);
  
  // 删除临时属性
  delete context[fnSymbol];
  
  return result;
};

// 4.2 手写 apply
Function.prototype.myApply = function(context, argsArray) {
  context = context || globalThis;
  const fnSymbol = Symbol('fn');
  context[fnSymbol] = this;
  
  const result = argsArray ? context[fnSymbol](...argsArray) : context[fnSymbol]();
  
  delete context[fnSymbol];
  return result;
};

// 4.3 手写 bind
Function.prototype.myBind = function(context, ...args) {
  const fn = this;
  
  return function(...newArgs) {
    // 合并参数
    const allArgs = args.concat(newArgs);
    
    // 如果是通过 new 调用，this 指向新创建的对象
    if (new.target) {
      return new fn(...allArgs);
    }

    // 否则使用 apply 改变 this 指向
    return fn.apply(context, allArgs);
  };
};

// ==================== 5. 测试手写的方法 ====================

console.log('\n=== 5. 测试手写方法 ===');

function testFunction(a, b) {
  console.log(`this.name: ${this.name}, a: ${a}, b: ${b}`);
  return this.name + a + b;
}

const testObj = { name: 'Test' };

console.log('原生 call:', testFunction.call(testObj, 1, 2));
console.log('手写 myCall:', testFunction.myCall(testObj, 1, 2));

console.log('原生 apply:', testFunction.apply(testObj, [3, 4]));
console.log('手写 myApply:', testFunction.myApply(testObj, [3, 4]));

const boundFn = testFunction.myBind(testObj, 5);
console.log('手写 myBind:', boundFn(6));

// ==================== 6. 构造函数中的 this ====================

console.log('\n=== 6. 构造函数中的 this ===');

function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayInfo = function() {
    console.log(`我是 ${this.name}，今年 ${this.age} 岁`);
  };
}

const person1 = new Person('张三', 25);
person1.sayInfo(); // this 指向 person1 实例

// ==================== 7. 类中的 this ====================

console.log('\n=== 7. 类中的 this ===');

class MyClass {
  constructor(name) {
    this.name = name;
  }
  
  normalMethod() {
    console.log('普通方法 this.name:', this.name);
  }
  
  // 箭头函数方法，this 永远指向实例
  arrowMethod = () => {
    console.log('箭头函数方法 this.name:', this.name);
  }
}

const instance = new MyClass('实例');
instance.normalMethod(); // "实例"
instance.arrowMethod();  // "实例"

// 方法赋值测试
const normalFn = instance.normalMethod;
const arrowFn = instance.arrowMethod;

console.log('方法赋值后:');
// normalFn(); // this 丢失
arrowFn();    // 箭头函数 this 不丢失

// ==================== 8. 实际应用场景 ====================

console.log('\n=== 8. 实际应用场景 ===');

// 8.1 事件处理器
class Button {
  constructor(text) {
    this.text = text;
  }
  
  // 问题：普通方法作为事件处理器时 this 会丢失
  handleClick() {
    console.log('按钮被点击:', this.text);
  }
  
  // 解决方案1：箭头函数
  handleClickArrow = () => {
    console.log('箭头函数处理点击:', this.text);
  }
  
  // 解决方案2：在构造函数中 bind
  constructor2(text) {
    this.text = text;
    this.handleClick = this.handleClick.bind(this);
  }
}

const btn = new Button('提交');
const clickHandler = btn.handleClickArrow;
clickHandler(); // 正确输出

// 8.2 定时器中的 this
class Timer {
  constructor(name) {
    this.name = name;
  }
  
  start() {
    // 问题：setTimeout 中的 this 丢失
    setTimeout(function() {
      // console.log('定时器:', this.name); // undefined
    }, 1000);
    
    // 解决方案：箭头函数
    setTimeout(() => {
      console.log('定时器（箭头函数）:', this.name);
    }, 100);
  }
}

const timer = new Timer('我的定时器');
timer.start();

module.exports = {
  // 导出手写的方法供其他地方使用
  myCall: Function.prototype.myCall,
  myApply: Function.prototype.myApply,
  myBind: Function.prototype.myBind
};
