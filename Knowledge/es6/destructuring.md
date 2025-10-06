# ES6 解构赋值 (Destructuring Assignment)

## 📖 基础概念

解构赋值是 ES6 引入的一种语法，可以从数组或对象中提取值，并赋给变量。它提供了一种简洁的方式来访问和赋值。

## 🔍 数组解构

### 基本语法
```javascript
// 基本解构
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log(a, b, c); // 1, 2, 3

// 跳过元素
const [first, , third] = [1, 2, 3];
console.log(first, third); // 1, 3

// 剩余元素
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]
```

### 默认值
```javascript
// 提供默认值
const [a = 1, b = 2, c = 3] = [10];
console.log(a, b, c); // 10, 2, 3

// 默认值可以是表达式
const [x = getDefaultValue(), y = 2] = [1];
```

### 交换变量
```javascript
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```

## 🎯 对象解构

### 基本语法
```javascript
const user = {
  name: 'John',
  age: 30,
  city: 'New York'
};

// 基本解构
const { name, age, city } = user;
console.log(name, age, city); // John, 30, New York

// 重命名变量
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // John, 30

// 默认值
const { name, age, country = 'USA' } = user;
console.log(country); // USA
```

### 嵌套解构
```javascript
const user = {
  name: 'John',
  address: {
    street: '123 Main St',
    city: 'New York',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  }
};

// 嵌套解构
const { 
  name, 
  address: { 
    street, 
    city,
    coordinates: { lat, lng }
  } 
} = user;

console.log(name, street, city, lat, lng);
```

## 🎪 实际应用示例

### 1. 函数参数解构
```javascript
// 传统写法
function greet(user) {
  console.log(`Hello, ${user.name}! You are ${user.age} years old.`);
}

// 解构写法
function greet({ name, age }) {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

// 使用默认值
function greet({ name = 'Guest', age = 0 } = {}) {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

greet({ name: 'John', age: 30 });
greet(); // 使用默认值
```

### 2. 数组方法返回值
```javascript
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];

// 解构 map 返回值
const names = users.map(({ name }) => name);
console.log(names); // ['John', 'Jane']

// 解构 filter 返回值
const adults = users.filter(({ age }) => age >= 30);
console.log(adults); // [{ name: 'John', age: 30 }]
```

### 3. 模块导入
```javascript
// 从模块中解构导入
import { useState, useEffect } from 'react';
import { map, filter, reduce } from 'lodash';

// 默认导入和解构导入结合
import React, { Component } from 'react';
```

### 4. 配置对象
```javascript
// 配置对象解构
function createUser({
  name,
  email,
  age = 18,
  role = 'user',
  preferences = {}
} = {}) {
  return {
    name,
    email,
    age,
    role,
    preferences
  };
}

const user = createUser({
  name: 'John',
  email: 'john@example.com'
});
```

### 5. API 响应处理
```javascript
// 处理 API 响应
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const { data, status, message } = await response.json();
  
  if (status === 'success') {
    return data;
  } else {
    throw new Error(message);
  }
}
```

## ⚠️ 注意事项

### 1. 解构失败
```javascript
// 数组解构失败
const [a, b] = [1]; // b 为 undefined
console.log(b); // undefined

// 对象解构失败
const { name } = {}; // name 为 undefined
console.log(name); // undefined

// 使用默认值避免问题
const [a, b = 2] = [1]; // b 为 2
const { name = 'Guest' } = {}; // name 为 'Guest'
```

### 2. 嵌套解构的安全访问
```javascript
const user = {};

// 不安全的嵌套解构
// const { address: { street } } = user; // TypeError

// 安全的嵌套解构
const { address: { street } = {} } = user;
console.log(street); // undefined
```

### 3. 解构和剩余运算符
```javascript
// 数组剩余运算符
const [first, ...rest] = [1, 2, 3, 4];
console.log(rest); // [2, 3, 4]

// 对象剩余运算符
const { name, ...otherProps } = { name: 'John', age: 30, city: 'NY' };
console.log(otherProps); // { age: 30, city: 'NY' }
```

## 🎯 最佳实践

### 1. 函数参数解构
```javascript
// ✅ 推荐：使用解构和默认值
function processUser({ 
  name, 
  age = 18, 
  role = 'user' 
} = {}) {
  // 处理用户数据
}

// ❌ 避免：手动访问属性
function processUser(user) {
  const name = user.name;
  const age = user.age || 18;
  const role = user.role || 'user';
}
```

### 2. 数组解构
```javascript
// ✅ 推荐：使用解构交换变量
[a, b] = [b, a];

// ✅ 推荐：使用解构获取数组元素
const [first, second] = array;

// ✅ 推荐：使用剩余运算符
const [head, ...tail] = array;
```

### 3. 对象解构
```javascript
// ✅ 推荐：重命名变量
const { name: userName, age: userAge } = user;

// ✅ 推荐：使用默认值
const { theme = 'light', language = 'en' } = settings;

// ✅ 推荐：嵌套解构
const { address: { city } } = user;
```

## 🚀 面试要点

### 1. 基本语法
```javascript
// 数组解构
const [a, b, c] = [1, 2, 3];

// 对象解构
const { name, age } = { name: 'John', age: 30 };
```

### 2. 默认值
```javascript
const [a = 1, b = 2] = [10];
const { name = 'Guest' } = {};
```

### 3. 重命名
```javascript
const { name: userName } = { name: 'John' };
```

### 4. 剩余运算符
```javascript
const [first, ...rest] = [1, 2, 3, 4];
const { name, ...other } = { name: 'John', age: 30 };
```

## 📚 练习题

### 1. 数组解构
```javascript
const arr = [1, 2, 3, 4, 5];
const [a, , c, ...rest] = arr;
console.log(a, c, rest); // ?
```

### 2. 对象解构
```javascript
const user = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  }
};

const { name, address: { city } } = user;
console.log(name, city); // ?
```

### 3. 函数参数解构
```javascript
function process({ name, age = 18, role = 'user' } = {}) {
  console.log(name, age, role);
}

process({ name: 'John' }); // ?
process(); // ?
```

### 4. 嵌套解构
```javascript
const data = {
  users: [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
  ],
  total: 2
};

const { users: [{ name }], total } = data;
console.log(name, total); // ?
```

## 💡 总结

- **解构赋值提供简洁的语法**来提取数组和对象的值
- **支持默认值**，避免 undefined 问题
- **支持重命名**，提高代码可读性
- **支持嵌套解构**，处理复杂数据结构
- **适合函数参数**，使函数调用更清晰
- **与剩余运算符结合**，提供强大的数据处理能力
