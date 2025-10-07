# ES6 面试题集合

## 🔥 高频面试题

### 1. let, const, var 的区别

**问题**：请解释 let, const, var 的区别

**答案要点**：
- **作用域**：var 是函数作用域，let/const 是块级作用域
- **变量提升**：var 有变量提升，let/const 有暂时性死区
- **重复声明**：var 可以重复声明，let/const 不可以
- **重新赋值**：var/let 可以重新赋值，const 不可以

**代码示例**：
```javascript
// 作用域差异
if (true) {
  var a = 1;
  let b = 2;
  const c = 3;
}
console.log(a); // 1
console.log(b); // ReferenceError
console.log(c); // ReferenceError

// 变量提升差异
console.log(x); // undefined
var x = 1;

console.log(y); // ReferenceError
let y = 2;

// 循环中的差异
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100); // 0, 1, 2
}
```

### 2. 箭头函数的 this 绑定

**问题**：箭头函数的 this 绑定有什么特点？

**答案要点**：
- **词法绑定**：箭头函数的 this 继承自外层作用域
- **不能改变**：call, apply, bind 无法改变箭头函数的 this
- **不能作为构造函数**：箭头函数没有自己的 this

**代码示例**：
```javascript
const obj = {
  name: 'test',
  method1: function() {
    console.log(this.name); // 'test'
  },
  method2: () => {
    console.log(this.name); // undefined (指向全局对象)
  }
};

obj.method1(); // 'test'
obj.method2(); // undefined

// 在类中的使用
class Component {
  constructor() {
    this.name = 'Component';
  }
  
  method1() {
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);
  }
  
  method2() {
    setTimeout(() => {
      console.log(this.name); // 'Component'
    }, 100);
  }
}
```

### 3. Promise 的使用

**问题**：请解释 Promise 的三种状态和使用方法

**答案要点**：
- **三种状态**：pending, fulfilled, rejected
- **状态转换**：pending → fulfilled/rejected（不可逆）
- **使用方法**：then, catch, finally
- **静态方法**：Promise.all, Promise.race, Promise.allSettled

**代码示例**：
```javascript
// 基本使用
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 1000);
});

promise
  .then(value => console.log(value))
  .catch(error => console.error(error))
  .finally(() => console.log('done'));

// Promise.all
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(values => console.log(values)); // [1, 2, 3]

// Promise.race
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('fast'), 100)),
  new Promise(resolve => setTimeout(() => resolve('slow'), 500))
])
.then(value => console.log(value)); // 'fast'
```

### 4. 解构赋值

**问题**：请演示数组和对象的解构赋值

**答案要点**：
- **数组解构**：按位置解构，支持默认值和剩余运算符
- **对象解构**：按属性名解构，支持重命名和默认值
- **嵌套解构**：可以解构嵌套的数组和对象

**代码示例**：
```javascript
// 数组解构
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4];
const [x, y = 2] = [1];

// 对象解构
const { name, age } = { name: 'John', age: 30 };
const { name: userName, age: userAge } = { name: 'John', age: 30 };
const { name, age, country = 'USA' } = { name: 'John', age: 30 };

// 嵌套解构
const { address: { city } } = { address: { city: 'New York' } };

// 函数参数解构
function greet({ name, age = 18 } = {}) {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}
```

### 5. 展开运算符

**问题**：请演示展开运算符的使用

**答案要点**：
- **数组展开**：合并数组，复制数组，函数参数传递
- **对象展开**：合并对象，复制对象，属性覆盖
- **浅拷贝**：展开运算符是浅拷贝，嵌套对象是引用

**代码示例**：
```javascript
// 数组展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
const copy = [...arr1];

// 对象展开
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
const copy = { ...obj1 };

// 函数参数
function sum(a, b, c) {
  return a + b + c;
}
const numbers = [1, 2, 3];
const result = sum(...numbers);

// 剩余参数
function myFunction(...args) {
  return args.reduce((sum, num) => sum + num, 0);
}
```

### 6. 模块化

**问题**：请解释 ES6 模块化的语法

**答案要点**：
- **导入**：import 语句，支持默认导入和命名导入
- **导出**：export 语句，支持默认导出和命名导出
- **动态导入**：import() 函数，返回 Promise

**代码示例**：
```javascript
// 命名导出
export const name = 'John';
export function greet() {
  return 'Hello!';
}

// 默认导出
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// 命名导入
import { name, greet } from './module.js';

// 默认导入
import User from './module.js';

// 混合导入
import User, { name, greet } from './module.js';

// 动态导入
async function loadModule() {
  const module = await import('./module.js');
  return module.default;
}
```

### 7. 类 (Class)

**问题**：请解释 ES6 类的语法和特性

**答案要点**：
- **基本语法**：class 关键字，constructor 方法
- **继承**：extends 关键字，super 调用
- **静态方法**：static 关键字
- **私有字段**：# 前缀（ES2022）

**代码示例**：
```javascript
// 基本类
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  static create(name) {
    return new Person(name, 0);
  }
}

// 继承
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
  
  study() {
    return `${this.name} is studying`;
  }
}

// 使用
const student = new Student('John', 20, 'A');
console.log(student.greet()); // Hello, I'm John
console.log(student.study()); // John is studying
```

### 8. Symbol

**问题**：请解释 Symbol 的作用和特性

**答案要点**：
- **唯一性**：每个 Symbol 都是唯一的
- **私有属性**：可以用作对象的私有属性
- **内置 Symbol**：如 Symbol.iterator, Symbol.toPrimitive

**代码示例**：
```javascript
// 基本使用
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false

// 作为对象属性
const obj = {
  [sym1]: 'value1',
  [sym2]: 'value2'
};

// 私有属性
const _name = Symbol('name');
class Person {
  constructor(name) {
    this[_name] = name;
  }
  
  getName() {
    return this[_name];
  }
}

// 内置 Symbol
const obj = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};

for (const value of obj) {
  console.log(value); // 1, 2, 3
}
```

### 9. Map 和 Set

**问题**：请解释 Map 和 Set 的用法

**答案要点**：
- **Map**：键值对集合，键可以是任意类型
- **Set**：值集合，值唯一
- **方法**：set, get, has, delete, clear

**代码示例**：
```javascript
// Map
const map = new Map();
map.set('name', 'John');
map.set(1, 'one');
map.set({}, 'object');

console.log(map.get('name')); // John
console.log(map.has(1)); // true
console.log(map.size); // 3

// Set
const set = new Set();
set.add(1);
set.add(2);
set.add(1); // 重复值，不会添加

console.log(set.size); // 2
console.log(set.has(1)); // true

// 数组去重
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3]
```

### 10. async/await

**问题**：请解释 async/await 的用法

**答案要点**：
- **语法糖**：基于 Promise 的语法糖
- **异步函数**：async 函数返回 Promise
- **等待异步**：await 等待 Promise 解决
- **错误处理**：使用 try-catch 处理错误

**代码示例**：
```javascript
// 基本使用
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 并发执行
async function fetchMultipleData() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
  ]);
  
  return {
    users: await users.json(),
    posts: await posts.json(),
    comments: await comments.json()
  };
}

// 错误处理
async function handleUserAction() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error);
    return null;
  }
}
```

## 🎯 进阶面试题

### 1. 手写 Promise

**问题**：请手写一个简单的 Promise 实现

**答案要点**：
- 三种状态：pending, fulfilled, rejected
- then 方法：处理成功和失败回调
- 链式调用：then 返回新的 Promise

**代码示例**：
```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];
    
    const resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.callbacks.forEach(cb => cb());
      }
    };
    
    const reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = reason;
        this.callbacks.forEach(cb => cb());
      }
    };
    
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        if (this.state === 'fulfilled') {
          const result = onFulfilled ? onFulfilled(this.value) : this.value;
          resolve(result);
        } else if (this.state === 'rejected') {
          if (onRejected) {
            const result = onRejected(this.value);
            resolve(result);
          } else {
            reject(this.value);
          }
        }
      };
      
      if (this.state === 'pending') {
        this.callbacks.push(handle);
      } else {
        handle();
      }
    });
  }
}
```

### 2. 手写 Promise.all

**问题**：请手写 Promise.all 方法

**答案要点**：
- 接收 Promise 数组
- 全部成功才成功
- 一个失败就失败

**代码示例**：
```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    
    const results = [];
    let completed = 0;
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
```

### 3. 手写 Promise.race

**问题**：请手写 Promise.race 方法

**答案要点**：
- 接收 Promise 数组
- 第一个完成的决定结果

**代码示例**：
```javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise)
        .then(resolve)
        .catch(reject);
    });
  });
}
```

### 4. 手写 Promise.retry

**问题**：请实现一个 Promise 重试机制

**答案要点**：
- 失败时重试
- 达到最大重试次数后失败
- 支持重试间隔

**代码示例**：
```javascript
function promiseRetry(fn, maxAttempts = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attempt() {
      attempts++;
      fn()
        .then(resolve)
        .catch(err => {
          if (attempts >= maxAttempts) {
            reject(err);
          } else {
            setTimeout(attempt, delay);
          }
        });
    }
    
    attempt();
  });
}
```

## 📚 练习题

### 1. 输出结果
```javascript
console.log(a); // ?
var a = 1;

console.log(b); // ?
let b = 2;

console.log(c); // ?
const c = 3;
```

### 2. 箭头函数 this
```javascript
const obj = {
  name: 'test',
  method: () => {
    console.log(this.name);
  }
};

obj.method(); // ?
```

### 3. 解构赋值
```javascript
const { name, age } = { name: 'John', age: 30 };
console.log(name, age); // ?
```

### 4. 展开运算符
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const result = [...arr1, ...arr2];
console.log(result); // ?
```

### 5. Promise 链式调用
```javascript
Promise.resolve(1)
  .then(x => x + 1)
  .then(x => x * 2)
  .then(console.log); // ?
```

## 💡 总结

ES6 面试重点：
- ✅ 变量声明（let, const, var）
- ✅ 箭头函数（this 绑定）
- ✅ Promise（异步编程）
- ✅ 解构赋值（数组、对象）
- ✅ 展开运算符（数组、对象）
- ✅ 模块化（import/export）
- ✅ 类（class 语法）
- ✅ Symbol（唯一标识符）
- ✅ Map/Set（新数据结构）
- ✅ async/await（异步编程语法糖）
