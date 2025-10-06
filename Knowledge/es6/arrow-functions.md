# ES6 箭头函数 (Arrow Functions)

## 📖 基础概念

箭头函数是 ES6 引入的一种新的函数语法，提供了更简洁的函数定义方式，并且改变了 `this` 的绑定规则。

## 🔍 语法对比

### 传统函数
```javascript
// 函数声明
function add(a, b) {
  return a + b;
}

// 函数表达式
const add = function(a, b) {
  return a + b;
};
```

### 箭头函数
```javascript
// 基本语法
const add = (a, b) => {
  return a + b;
};

// 简化语法
const add = (a, b) => a + b;

// 单个参数
const square = x => x * x;

// 无参数
const greet = () => 'Hello!';
```

## 🎯 this 绑定差异

### 传统函数的 this
```javascript
const obj = {
  name: 'John',
  greet: function() {
    console.log(this.name); // 'John'
    
    setTimeout(function() {
      console.log(this.name); // undefined (this 指向 window)
    }, 1000);
  }
};

obj.greet();
```

### 箭头函数的 this
```javascript
const obj = {
  name: 'John',
  greet: function() {
    console.log(this.name); // 'John'
    
    setTimeout(() => {
      console.log(this.name); // 'John' (this 继承自外层作用域)
    }, 1000);
  }
};

obj.greet();
```

## 📊 详细对比表

| 特性 | 传统函数 | 箭头函数 |
|------|----------|----------|
| 语法 | function() {} | () => {} |
| this 绑定 | 动态绑定 | 词法绑定 |
| arguments | ✅ 有 | ❌ 无 |
| 构造函数 | ✅ 可以 | ❌ 不可以 |
| 原型 | ✅ 有 | ❌ 无 |
| 提升 | ✅ 函数提升 | ❌ 变量提升 |

## 🎪 实际应用示例

### 1. 数组方法
```javascript
const numbers = [1, 2, 3, 4, 5];

// 传统写法
const doubled = numbers.map(function(num) {
  return num * 2;
});

// 箭头函数写法
const doubled = numbers.map(num => num * 2);

// 过滤偶数
const evens = numbers.filter(num => num % 2 === 0);

// 求和
const sum = numbers.reduce((acc, num) => acc + num, 0);
```

### 2. 事件处理
```javascript
// 传统写法
button.addEventListener('click', function(event) {
  console.log('Button clicked:', this);
  // this 指向 button 元素
});

// 箭头函数写法
button.addEventListener('click', (event) => {
  console.log('Button clicked:', event.target);
  // this 指向外层作用域
});
```

### 3. Promise 链式调用
```javascript
// 传统写法
fetch('/api/data')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.error(error);
  });

// 箭头函数写法
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 4. 对象方法
```javascript
const calculator = {
  value: 0,
  
  // 传统方法 - this 正确绑定
  add: function(num) {
    this.value += num;
    return this;
  },
  
  // 箭头函数 - this 继承自外层作用域
  multiply: (num) => {
    // this.value 会报错，因为 this 不指向 calculator
    return this;
  }
};
```

## ⚠️ 注意事项

### 1. this 绑定
```javascript
const obj = {
  name: 'test',
  
  // 传统函数
  method1: function() {
    return this.name; // 'test'
  },
  
  // 箭头函数
  method2: () => {
    return this.name; // undefined (指向全局对象)
  }
};
```

### 2. 不能作为构造函数
```javascript
// 传统函数
function Person(name) {
  this.name = name;
}
const person1 = new Person('John'); // ✅ 可以

// 箭头函数
const Person = (name) => {
  this.name = name;
};
const person2 = new Person('John'); // ❌ TypeError
```

### 3. 没有 arguments 对象
```javascript
// 传统函数
function sum() {
  return Array.from(arguments).reduce((a, b) => a + b);
}

// 箭头函数需要使用剩余参数
const sum = (...args) => args.reduce((a, b) => a + b);
```

### 4. 没有原型
```javascript
// 传统函数
function MyClass() {}
MyClass.prototype.method = function() {};

// 箭头函数没有原型
const MyClass = () => {};
MyClass.prototype.method = function() {}; // 没有意义
```

## 🎯 最佳实践

### 1. 何时使用箭头函数
```javascript
// ✅ 适合使用箭头函数的场景

// 1. 数组方法
const users = data.map(user => user.name);

// 2. 简单的回调函数
setTimeout(() => console.log('done'), 1000);

// 3. Promise 链式调用
fetch('/api').then(res => res.json());

// 4. 需要保持 this 绑定的场景
class Component {
  constructor() {
    this.handleClick = () => {
      // this 指向组件实例
      this.render();
    };
  }
}
```

### 2. 何时不使用箭头函数
```javascript
// ❌ 不适合使用箭头函数的场景

// 1. 对象方法
const obj = {
  name: 'test',
  greet: function() { // 使用传统函数
    return `Hello, ${this.name}`;
  }
};

// 2. 构造函数
function User(name) { // 使用传统函数
  this.name = name;
}

// 3. 需要 arguments 的函数
function dynamicSum() { // 使用传统函数
  return Array.from(arguments).reduce((a, b) => a + b);
}

// 4. 需要动态 this 绑定的函数
function handler() { // 使用传统函数
  console.log(this); // 根据调用方式动态绑定
}
```

## 🚀 面试要点

### 1. this 绑定问题
```javascript
const obj = {
  name: 'test',
  method: () => {
    console.log(this.name); // undefined
  }
};
```

### 2. 不能作为构造函数
```javascript
const Person = () => {};
new Person(); // TypeError: Person is not a constructor
```

### 3. 没有 arguments
```javascript
const func = () => {
  console.log(arguments); // ReferenceError
};
```

### 4. 语法简化
```javascript
// 这些写法是等价的
const add = (a, b) => a + b;
const add = (a, b) => { return a + b; };
```

## 📚 练习题

### 1. 输出结果
```javascript
const obj = {
  name: 'test',
  method: () => {
    console.log(this.name);
  }
};

obj.method(); // ?
```

### 2. this 绑定
```javascript
class Component {
  constructor() {
    this.name = 'Component';
  }
  
  method1() {
    setTimeout(function() {
      console.log(this.name); // ?
    }, 100);
  }
  
  method2() {
    setTimeout(() => {
      console.log(this.name); // ?
    }, 100);
  }
}

const comp = new Component();
comp.method1();
comp.method2();
```

### 3. 数组方法
```javascript
const numbers = [1, 2, 3, 4, 5];

const result = numbers
  .filter(n => n > 2)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0);

console.log(result); // ?
```

## 💡 总结

- **箭头函数语法更简洁**，适合简单的函数
- **this 绑定规则不同**，箭头函数继承外层作用域的 this
- **不能作为构造函数**，没有原型和 arguments
- **适合数组方法、回调函数**等场景
- **不适合对象方法、构造函数**等需要动态 this 的场景
