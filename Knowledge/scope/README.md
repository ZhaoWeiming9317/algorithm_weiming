# JavaScript 作用域练习题集

> 从基础到进阶，全面掌握 JavaScript 作用域机制

## 📚 题目列表

### Level 1 - 基础入门
- **01-basic-scope.js** - 作用域基础
  - 考点：全局作用域、函数作用域、变量提升
  - 难度：⭐
  - 适合：理解作用域基本概念

### Level 2 - 块级作用域
- **02-block-scope.js** - 块级作用域
  - 考点：let/const、暂时性死区、for 循环
  - 难度：⭐⭐
  - 适合：理解 ES6 块级作用域

### Level 3 - 闭包
- **03-closure.js** - 闭包基础
  - 考点：闭包、循环中的闭包、IIFE
  - 难度：⭐⭐⭐
  - 适合：理解闭包原理和应用

### Level 4 - 作用域链
- **04-scope-chain.js** - 作用域链
  - 考点：作用域链、词法作用域、变量查找
  - 难度：⭐⭐⭐
  - 适合：理解作用域链机制

### Level 5 - this 绑定
- **05-this-scope.js** - this 与作用域
  - 考点：this 绑定、箭头函数、call/apply/bind
  - 难度：⭐⭐⭐⭐
  - 适合：理解 this 的不同绑定方式

### Level 6 - 变量提升
- **06-hoisting.js** - 变量提升
  - 考点：变量提升、函数提升、执行上下文
  - 难度：⭐⭐⭐⭐
  - 适合：理解提升机制

### Level 7 - 综合应用
- **07-comprehensive.js** - 综合题
  - 考点：所有知识点综合
  - 难度：⭐⭐⭐⭐⭐
  - 适合：面试准备、全面测试

---

## 🎯 核心知识点

### 1. 作用域类型

**全局作用域**：
- 在任何函数外部声明的变量
- 在整个程序中都可以访问

**函数作用域**：
- 在函数内部声明的变量
- 只能在函数内部访问
- var 声明的变量是函数作用域

**块级作用域**：
- 在 {} 内部声明的变量
- 只能在块内部访问
- let/const 声明的变量是块级作用域

---

### 2. 变量声明对比

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 是 | 否（暂时性死区）| 否（暂时性死区）|
| 重复声明 | 可以 | 不可以 | 不可以 |
| 重新赋值 | 可以 | 可以 | 不可以 |
| 全局对象属性 | 是 | 否 | 否 |

---

### 3. 闭包

**定义**：函数 + 函数能访问的外部变量

**特点**：
- 内部函数可以访问外部函数的变量
- 外部函数执行完后，变量不会被销毁
- 每次调用外部函数都会创建新的闭包

**应用场景**：
1. 数据私有化（模块模式）
2. 函数柯里化
3. 防抖节流
4. 回调函数

**经典问题**：
```javascript
// 问题：循环中的闭包
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// 解决方案1：使用 let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}

// 解决方案2：使用 IIFE
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100); // 0, 1, 2
  })(i);
}
```

---

### 4. 作用域链

**定义**：变量查找的路径

**查找规则**：
1. 先在当前作用域查找
2. 找不到就去外层作用域查找
3. 一直找到全局作用域
4. 还找不到就报 ReferenceError

**词法作用域**：
- 函数的作用域在**定义时**确定，不是调用时
- JavaScript 使用词法作用域（静态作用域）

```javascript
var x = 10;

function foo() {
  console.log(x); // 10
}

function bar() {
  var x = 20;
  foo(); // 输出 10，不是 20
}

bar();
```

---

### 5. this 绑定

**普通函数的 this**：
- 独立调用：指向全局对象（严格模式下是 undefined）
- 对象方法调用：指向调用对象
- 构造函数调用：指向新创建的对象
- call/apply/bind：指向指定对象

**箭头函数的 this**：
- 没有自己的 this
- 继承外层作用域的 this
- 无法通过 call/apply/bind 改变

```javascript
const obj = {
  name: 'obj',
  normal: function() {
    console.log(this.name); // 'obj'
  },
  arrow: () => {
    console.log(this.name); // undefined
  }
};
```

---

### 6. 变量提升

**var 变量提升**：
- 声明提升到作用域顶部
- 赋值不提升
- 初始值为 undefined

**函数提升**：
- 函数声明整体提升
- 函数表达式只提升变量名
- 函数声明优先级 > 变量声明

**let/const 不提升**：
- 有暂时性死区（TDZ）
- 声明前访问会报错

```javascript
console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError
let b = 2;

foo(); // 'function'
function foo() {
  console.log('function');
}

bar(); // TypeError: bar is not a function
var bar = function() {
  console.log('expression');
};
```

---

## 🔥 面试高频考点

### 1. var/let/const 的区别

**答题要点**：
1. 作用域：var 函数作用域，let/const 块级作用域
2. 变量提升：var 有提升，let/const 有暂时性死区
3. 重新赋值：var/let 可以，const 不可以
4. 重复声明：var 可以，let/const 不可以

---

### 2. 什么是闭包？

**答题要点**：
1. 定义：函数 + 函数能访问的外部变量
2. 特点：可以访问外部函数的变量，变量不会被销毁
3. 应用：数据私有化、柯里化、防抖节流
4. 缺点：可能导致内存泄漏

---

### 3. 什么是作用域链？

**答题要点**：
1. 定义：变量查找的路径
2. 查找规则：从内到外，直到全局
3. 词法作用域：函数定义时确定，不是调用时
4. 作用：实现变量的层级访问

---

### 4. 箭头函数和普通函数的区别？

**答题要点**：
1. this 绑定：箭头函数继承外层，普通函数看调用
2. arguments：箭头函数没有
3. 构造函数：箭头函数不能用 new
4. prototype：箭头函数没有

---

### 5. 如何解决循环中的闭包问题？

**答题要点**：
1. 使用 let 替代 var
2. 使用 IIFE 创建独立作用域
3. 使用 forEach 等方法
4. 使用 bind 绑定参数

---

## 💡 记忆口诀

### 作用域三兄弟
```
全局作用域：到处都能访问
函数作用域：var 的地盘
块级作用域：let/const 的家
```

### 变量声明三剑客
```
var：函数作用域，会提升，能重复
let：块级作用域，有死区，不重复
const：块级作用域，有死区，不可变
```

### 闭包三要素
```
外部函数 + 内部函数 + 外部变量
内部访问外部变量
外部执行完变量不销毁
```

### this 绑定四规则
```
独立调用指向全局
对象调用指向对象
构造调用指向实例
箭头函数看外层
```

---

## 📝 学习建议

### 1. 循序渐进
- 按照题目顺序从 Level 1 到 Level 7
- 每道题先自己分析，再看答案
- 理解原理比记住答案更重要

### 2. 动手验证
```bash
# 运行任意题目验证答案
node 01-basic-scope.js
node 02-block-scope.js
# ... 以此类推
```

### 3. 画图分析
- 画出作用域链
- 标注变量查找路径
- 理解闭包的内存结构

### 4. 总结规律
- 作用域：全局 → 函数 → 块级
- 查找：内 → 外 → 全局
- 提升：var 和函数声明会提升
- 闭包：内部函数 + 外部变量

---

## 🚀 进阶学习

- Event Loop：`../eventloop/`
- 浏览器进程和线程：`../browser/process-and-thread.md`
- ES6 特性：`../es6/`
- 执行上下文和调用栈
- 内存管理和垃圾回收

---

## 🎓 实战应用

### 1. 模块模式（闭包应用）
```javascript
const module = (function() {
  let privateVar = 0;
  
  return {
    increment() {
      return ++privateVar;
    },
    getValue() {
      return privateVar;
    }
  };
})();
```

### 2. 函数柯里化
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
```

### 3. 防抖函数
```javascript
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

---

**最后更新时间：2025-10-07**
