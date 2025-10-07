# ES6 面试速记手册

> 快速记忆版本，适合面试前复习

## 🔥 核心考点速记

### 1. let/const/var 三句话记忆

```
var：函数作用域、变量提升、可重复声明
let：块级作用域、暂时性死区、不可重复声明
const：块级作用域、暂时性死区、不可重新赋值（对象属性可变）
```

**经典面试题**：
```javascript
// for 循环中的闭包问题
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3, 3, 3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j)); // 0, 1, 2
}
```

---

### 2. 箭头函数 vs 普通函数

| 特性 | 箭头函数 | 普通函数 |
|------|---------|---------|
| this | 继承外层作用域 | 调用时决定 |
| arguments | 没有 | 有 |
| 构造函数 | 不能用 new | 可以用 new |
| prototype | 没有 | 有 |
| call/apply/bind | 无法改变 this | 可以改变 this |

**记忆口诀**：箭头函数 = 词法 this + 没有 arguments + 不能 new

**经典面试题**：
```javascript
const obj = {
  name: 'obj',
  normal: function() { console.log(this.name); },
  arrow: () => { console.log(this.name); }
};
obj.normal(); // 'obj'
obj.arrow();  // undefined（this 指向外层）
```

---

### 3. Promise 核心要点

**三种状态**：
- pending（进行中）
- fulfilled（已成功）
- rejected（已失败）

**状态转换**：pending → fulfilled/rejected（不可逆）

**核心方法**：
```javascript
// 实例方法
promise.then(onFulfilled, onRejected)
promise.catch(onRejected)
promise.finally(onFinally)

// 静态方法
Promise.all([p1, p2])      // 全部成功才成功
Promise.race([p1, p2])     // 第一个完成决定结果
Promise.allSettled([p1, p2]) // 等待全部完成（不管成功失败）
Promise.any([p1, p2])      // 第一个成功决定结果
```

**面试必考**：手写 Promise.all
```javascript
Promise.all = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++count === promises.length) resolve(results);
      }).catch(reject);
    });
  });
};
```

---

### 4. async/await 三要点

1. **async 函数返回 Promise**
2. **await 等待 Promise resolve**
3. **await 后面的代码相当于 Promise.then**

**串行 vs 并行**：
```javascript
// 串行（慢）：总耗时 = 累加
async function serial() {
  const a = await fetch('/api/a'); // 100ms
  const b = await fetch('/api/b'); // 100ms
  // 总耗时：200ms
}

// 并行（快）：总耗时 = 最大值
async function parallel() {
  const [a, b] = await Promise.all([
    fetch('/api/a'), // 100ms
    fetch('/api/b')  // 100ms
  ]);
  // 总耗时：100ms
}
```

---

### 5. 解构赋值速记

**数组解构**：
```javascript
const [a, b, ...rest] = [1, 2, 3, 4];
const [x, y = 2] = [1]; // 默认值
const [, , third] = [1, 2, 3]; // 跳过元素
```

**对象解构**：
```javascript
const { name, age } = obj;
const { name: userName } = obj; // 重命名
const { name, age = 18 } = obj; // 默认值
const { a: { b } } = obj; // 嵌套解构
```

**函数参数解构**：
```javascript
function fn({ name, age = 18 } = {}) {
  console.log(name, age);
}
```

---

### 6. 展开运算符 (...)

**三大用途**：
1. **数组展开**：`[...arr1, ...arr2]`
2. **对象展开**：`{ ...obj1, ...obj2 }`
3. **剩余参数**：`function fn(...args) {}`

**注意**：展开运算符是**浅拷贝**！

```javascript
const obj = { a: 1, b: { c: 2 } };
const copy = { ...obj };
copy.b.c = 3; // 原对象的 b.c 也变成 3
```

---

### 7. Class 类

**基本语法**：
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() { // 实例方法
    return `Hello, ${this.name}`;
  }
  
  static create() { // 静态方法
    return new Person('default');
  }
}

class Student extends Person {
  constructor(name, grade) {
    super(name); // 必须先调用 super
    this.grade = grade;
  }
}
```

**记忆要点**：
- constructor 是构造函数
- extends 继承，super 调用父类
- static 静态方法，通过类名调用
- 私有字段用 `#` 前缀（ES2022）

---

### 8. Map vs Object、Set vs Array

| 对比 | Map | Object |
|------|-----|--------|
| 键类型 | 任意类型 | 字符串/Symbol |
| 键顺序 | 插入顺序 | 无序（部分有序）|
| 性能 | 频繁增删更好 | 静态数据更好 |
| 遍历 | for...of | for...in |

| 对比 | Set | Array |
|------|-----|-------|
| 唯一性 | 值唯一 | 可重复 |
| 查找 | has() O(1) | includes() O(n) |
| 用途 | 去重、判断存在 | 有序列表 |

**经典应用**：
```javascript
// 数组去重
const unique = [...new Set(array)];

// 对象作为键
const map = new Map();
const obj = {};
map.set(obj, 'value');
```

---

### 9. Symbol 三个用途

1. **创建唯一标识符**
```javascript
const id = Symbol('id');
```

2. **对象私有属性**
```javascript
const _private = Symbol('private');
obj[_private] = 'secret';
```

3. **内置 Symbol**
```javascript
Symbol.iterator  // 迭代器
Symbol.toPrimitive // 类型转换
Symbol.toStringTag // toString 标签
```

---

### 10. 模块化 import/export

**导出方式**：
```javascript
// 命名导出
export const name = 'value';
export function fn() {}

// 默认导出
export default class {}
```

**导入方式**：
```javascript
// 命名导入
import { name, fn } from './module';

// 默认导入
import MyClass from './module';

// 全部导入
import * as module from './module';

// 动态导入
const module = await import('./module');
```

---

## 🎯 高频手写题

### 1. 手写 Promise
```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];
    
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.callbacks.forEach(cb => cb.onFulfilled(value));
      }
    };
    
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.value = reason;
        this.callbacks.forEach(cb => cb.onRejected(reason));
      }
    };
    
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        try {
          if (this.state === 'fulfilled') {
            const result = onFulfilled ? onFulfilled(this.value) : this.value;
            resolve(result);
          } else if (this.state === 'rejected') {
            const result = onRejected ? onRejected(this.value) : this.value;
            onRejected ? resolve(result) : reject(result);
          }
        } catch (err) {
          reject(err);
        }
      };
      
      if (this.state === 'pending') {
        this.callbacks.push({ onFulfilled: handle, onRejected: handle });
      } else {
        setTimeout(handle, 0);
      }
    });
  }
}
```

### 2. 手写 Promise.all
```javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }
    
    const results = [];
    let count = 0;
    
    if (promises.length === 0) {
      return resolve(results);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        value => {
          results[index] = value;
          count++;
          if (count === promises.length) {
            resolve(results);
          }
        },
        reason => {
          reject(reason);
        }
      );
    });
  });
};
```

### 3. 手写 Promise.race
```javascript
Promise.myRace = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('参数必须是数组'));
    }
    
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve, reject);
    });
  });
};
```

### 4. 手写 async/await（使用 Generator）
```javascript
function asyncToGenerator(generatorFunc) {
  return function() {
    const gen = generatorFunc.apply(this, arguments);
    
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let result;
        try {
          result = gen[key](arg);
        } catch (err) {
          return reject(err);
        }
        
        const { value, done } = result;
        
        if (done) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            val => step('next', val),
            err => step('throw', err)
          );
        }
      }
      
      step('next');
    });
  };
}
```

---

## 💡 面试答题技巧

### 回答模板

**问：let/const/var 的区别？**

答：主要有三个方面的区别：
1. **作用域**：var 是函数作用域，let/const 是块级作用域
2. **变量提升**：var 有变量提升，let/const 有暂时性死区
3. **重新赋值**：var/let 可以，const 不可以

然后举例说明 for 循环中的闭包问题...

---

**问：箭头函数和普通函数的区别？**

答：主要有四个区别：
1. **this 绑定**：箭头函数继承外层作用域的 this，普通函数由调用方式决定
2. **arguments**：箭头函数没有 arguments 对象
3. **构造函数**：箭头函数不能用作构造函数
4. **原型**：箭头函数没有 prototype 属性

然后举例说明在 React 组件中的应用...

---

**问：Promise 有哪些方法？**

答：分为实例方法和静态方法：

**实例方法**：
- then：处理成功和失败
- catch：处理失败
- finally：无论成功失败都执行

**静态方法**：
- Promise.all：全部成功才成功
- Promise.race：第一个完成决定结果
- Promise.allSettled：等待全部完成
- Promise.any：第一个成功决定结果

然后说明各自的应用场景...

---

## 🚀 记忆口诀

**let/const/var**：
```
var 函数提升可重复
let 块级死区不重复
const 块级死区不可变
```

**箭头函数**：
```
词法 this 不可变
没有 arguments 和 prototype
不能当作构造函数用
```

**Promise 状态**：
```
pending 等待中
fulfilled 已成功
rejected 已失败
状态一旦改变不可逆
```

**async/await**：
```
async 返回 Promise
await 等待 resolve
串行累加并行取最大
```

---

## 📝 快速自测

1. ✅ for 循环中 var 和 let 的区别？
2. ✅ 箭头函数能用 call 改变 this 吗？
3. ✅ Promise.all 中一个失败会怎样？
4. ✅ await 会阻塞主线程吗？
5. ✅ 展开运算符是深拷贝还是浅拷贝？
6. ✅ const 定义的对象能修改属性吗？
7. ✅ Map 和 Object 的主要区别？
8. ✅ Symbol 的主要用途？
9. ✅ class 中的 static 方法如何调用？
10. ✅ import 和 require 的区别？

---

**最后更新时间：2025-10-07**
