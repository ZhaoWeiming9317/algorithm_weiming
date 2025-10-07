/**
 * 作用域进阶题 - Level 5
 * 考点：this 绑定、箭头函数作用域
 */

console.log('=== 题目1：普通函数的 this ===');
const obj1 = {
  name: 'obj1',
  getName: function() {
    console.log(this.name);
  }
};

obj1.getName(); // obj1

const getName = obj1.getName;
getName(); // undefined（严格模式下）或 全局对象

console.log('\n=== 题目2：箭头函数的 this ===');
const obj2 = {
  name: 'obj2',
  getName: () => {
    console.log(this.name);
  }
};

obj2.getName(); // undefined（this 指向外层作用域）

console.log('\n=== 题目3：混合使用 ===');
const obj3 = {
  name: 'obj3',
  method1: function() {
    console.log('method1:', this.name);
    
    const inner = function() {
      console.log('inner function:', this.name);
    };
    inner();
    
    const arrow = () => {
      console.log('arrow function:', this.name);
    };
    arrow();
  }
};

obj3.method1();

console.log('\n=== 题目4：setTimeout 中的 this ===');
const obj4 = {
  name: 'obj4',
  method1: function() {
    setTimeout(function() {
      console.log('setTimeout function:', this.name);
    }, 100);
  },
  method2: function() {
    setTimeout(() => {
      console.log('setTimeout arrow:', this.name);
    }, 200);
  }
};

obj4.method1();
obj4.method2();

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * === 题目1：普通函数的 this ===
 * obj1
 * undefined
 * 
 * === 题目2：箭头函数的 this ===
 * undefined
 * 
 * === 题目3：混合使用 ===
 * method1: obj3
 * inner function: undefined
 * arrow function: obj3
 * 
 * === 题目4：setTimeout 中的 this ===
 * setTimeout function: undefined
 * setTimeout arrow: obj4
 * 
 * 解析：
 * 
 * 题目1：普通函数 this
 * - obj1.getName()：this 指向 obj1
 * - getName()：独立调用，this 指向全局（严格模式下是 undefined）
 * - 普通函数的 this 由调用方式决定
 * 
 * 题目2：箭头函数 this
 * - 箭头函数没有自己的 this
 * - this 继承自外层作用域（这里是全局）
 * - 即使通过 obj2 调用，this 也不会改变
 * 
 * 题目3：混合使用
 * - method1 的 this 指向 obj3
 * - inner 函数独立调用，this 指向全局
 * - arrow 函数继承 method1 的 this，指向 obj3
 * 
 * 题目4：setTimeout
 * - setTimeout 中的普通函数，this 指向全局
 * - setTimeout 中的箭头函数，this 继承外层（obj4）
 * - 这是 React 类组件中常用的模式
 * 
 * 关键点：
 * - 普通函数 this：谁调用指向谁
 * - 箭头函数 this：继承外层作用域
 * - 独立调用：this 指向全局（严格模式下是 undefined）
 * - 对象方法调用：this 指向对象
 * - 箭头函数的 this 无法通过 call/apply/bind 改变
 */

console.log('\n=== 题目5：call/apply/bind ===');
function greet() {
  console.log(this.name);
}

const person = { name: 'Alice' };

greet.call(person); // Alice
greet.apply(person); // Alice

const boundGreet = greet.bind(person);
boundGreet(); // Alice

// 箭头函数无法改变 this
const arrowGreet = () => {
  console.log(this.name);
};

arrowGreet.call(person); // undefined（this 不会改变）
