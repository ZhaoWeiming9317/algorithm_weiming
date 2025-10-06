# ES6 变量声明 - let, const, var

## 📖 基础概念

ES6 引入了 `let` 和 `const` 两种新的变量声明方式，解决了 `var` 的一些问题。

## 🔍 三种声明方式对比

### var (ES5)
```javascript
// 函数作用域，变量提升
function example() {
  console.log(x); // undefined (变量提升)
  var x = 1;
  if (true) {
    var x = 2; // 覆盖了外层的 x
  }
  console.log(x); // 2
}
```

### let (ES6)
```javascript
// 块级作用域，无变量提升
function example() {
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 1;
  if (true) {
    let x = 2; // 独立的块级作用域
    console.log(x); // 2
  }
  console.log(x); // 1
}
```

### const (ES6)
```javascript
// 块级作用域，常量声明
function example() {
  const x = 1;
  // x = 2; // TypeError: Assignment to constant variable
  
  const obj = { name: 'test' };
  obj.name = 'changed'; // ✅ 可以修改对象属性
  // obj = {}; // ❌ 不能重新赋值
}
```

## 📊 详细对比表

| 特性 | var | let | const |
|------|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | ✅ (值为undefined) | ❌ (暂时性死区) | ❌ (暂时性死区) |
| 重复声明 | ✅ | ❌ | ❌ |
| 重新赋值 | ✅ | ✅ | ❌ |
| 循环中的表现 | 共享同一个变量 | 每次循环独立变量 | 每次循环独立变量 |

## 🎯 实际应用示例

### 1. 循环中的变量问题

```javascript
// var 的问题
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 输出: 3, 3, 3
  }, 100);
}

// let 的解决方案
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 输出: 0, 1, 2
  }, 100);
}
```

### 2. 条件语句中的作用域

```javascript
// var 的问题
if (true) {
  var message = 'hello';
}
console.log(message); // 'hello' (污染全局作用域)

// let/const 的解决方案
if (true) {
  let message = 'hello';
  const PI = 3.14;
}
console.log(message); // ReferenceError
console.log(PI); // ReferenceError
```

### 3. 常量声明

```javascript
// 使用 const 声明常量
const API_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
const CONFIG = {
  timeout: 5000,
  retries: 3
};

// 对象和数组的 const 声明
const users = [];
users.push('user1'); // ✅ 可以修改数组内容
// users = []; // ❌ 不能重新赋值

const settings = { theme: 'dark' };
settings.theme = 'light'; // ✅ 可以修改对象属性
// settings = {}; // ❌ 不能重新赋值
```

## ⚠️ 注意事项

### 1. 暂时性死区 (Temporal Dead Zone)
```javascript
console.log(typeof x); // ReferenceError (不是 undefined)
let x = 1;
```

### 2. 重复声明错误
```javascript
let x = 1;
let x = 2; // SyntaxError: Identifier 'x' has already been declared
```

### 3. const 的对象和数组
```javascript
const arr = [1, 2, 3];
arr.push(4); // ✅ 可以修改
arr[0] = 10; // ✅ 可以修改
// arr = []; // ❌ 不能重新赋值

const obj = { name: 'test' };
obj.name = 'new'; // ✅ 可以修改
obj.age = 20; // ✅ 可以添加属性
// obj = {}; // ❌ 不能重新赋值
```

## 🎪 最佳实践

### 1. 优先使用 const
```javascript
// ✅ 推荐：默认使用 const
const userName = 'john';
const userAge = 25;

// 只有在需要重新赋值时才使用 let
let currentUser = null;
currentUser = getUser();
```

### 2. 避免使用 var
```javascript
// ❌ 避免使用 var
var count = 0;

// ✅ 使用 let 或 const
let count = 0;
// 或者
const COUNT = 0;
```

### 3. 块级作用域的好处
```javascript
// ✅ 使用块级作用域隔离变量
{
  const temp = processData();
  // temp 只在这个块中有效
}
// temp 在这里不可访问，避免污染作用域
```

## 🚀 面试要点

### 1. 作用域问题
- var: 函数作用域
- let/const: 块级作用域

### 2. 变量提升问题
- var: 变量提升，值为 undefined
- let/const: 暂时性死区，访问会报错

### 3. 循环中的闭包问题
- var: 共享同一个变量
- let: 每次循环独立变量

### 4. 重复声明
- var: 可以重复声明
- let/const: 不能重复声明

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

### 2. 循环问题
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
```

### 3. 作用域问题
```javascript
{
  var x = 1;
  let y = 2;
  const z = 3;
}

console.log(x); // ?
console.log(y); // ?
console.log(z); // ?
```

## 💡 总结

- **优先使用 const**，只有在需要重新赋值时使用 let
- **避免使用 var**，除非有特殊需求
- **理解块级作用域**和暂时性死区
- **注意循环中的闭包问题**
- **掌握变量提升的差异**
