# JavaScript 中 Class 和 Function 的区别

## 1. 基本语法对比

### Function 构造函数（ES5）
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const person1 = new Person('张三', 25);
person1.sayHello(); // Hello, I'm 张三
```

### Class 语法（ES6）
```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

const person1 = new Person('张三', 25);
person1.sayHello(); // Hello, I'm 张三
```

---

## 2. 核心区别

### 2.1 严格模式
```javascript
// Function: 非严格模式
function Person(name) {
  this.name = name;
  // 可以不使用 'use strict'
}

// Class: 自动严格模式
class Person {
  constructor(name) {
    this.name = name;
    // 自动在严格模式下运行
    // 例如：不能使用未声明的变量
  }
}
```

### 2.2 提升（Hoisting）
```javascript
// ✅ Function 会被提升
const p1 = new Person('张三'); // 正常工作

function Person(name) {
  this.name = name;
}

// ❌ Class 不会被提升（存在暂时性死区）
const p2 = new Person('李四'); // ReferenceError: Cannot access 'Person' before initialization

class Person {
  constructor(name) {
    this.name = name;
  }
}
```

### 2.3 必须使用 new 调用
```javascript
// Function: 可以直接调用（虽然不推荐）
function Person(name) {
  this.name = name;
}

Person('张三'); // 不报错，但 this 指向 window/global
const p1 = new Person('张三'); // 正确用法

// Class: 必须使用 new
class Person {
  constructor(name) {
    this.name = name;
  }
}

Person('张三'); // TypeError: Class constructor Person cannot be invoked without 'new'
const p2 = new Person('张三'); // 正确用法
```

### 2.4 方法的可枚举性
```javascript
// Function: 原型方法可枚举
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log('Hello');
};

console.log(Object.keys(Person.prototype)); // ['sayHello']

// Class: 原型方法不可枚举
class Person {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() {
    console.log('Hello');
  }
}

console.log(Object.keys(Person.prototype)); // []
console.log(Object.getOwnPropertyNames(Person.prototype)); // ['constructor', 'sayHello']
```

### 2.5 类型检查
```javascript
// Function
function Person() {}
console.log(typeof Person); // 'function'

// Class
class Person {}
console.log(typeof Person); // 'function' (本质上还是函数)
```

---

## 3. Class 的独有特性

### 3.1 静态方法
```javascript
// Function 方式
function Person(name) {
  this.name = name;
}

Person.staticMethod = function() {
  console.log('这是静态方法');
};

Person.staticMethod(); // 这是静态方法

// Class 方式（更清晰）
class Person {
  constructor(name) {
    this.name = name;
  }
  
  static staticMethod() {
    console.log('这是静态方法');
  }
  
  static create(name) {
    return new Person(name);
  }
}

Person.staticMethod(); // 这是静态方法
const p = Person.create('张三');
```

### 3.2 继承（更简洁）
```javascript
// Function 方式（复杂）
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name); // 调用父构造函数
  this.breed = breed;
}

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks`);
};

// Class 方式（简洁）
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 调用父构造函数
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('旺财', '柴犬');
dog.speak(); // 旺财 makes a sound
dog.bark();  // 旺财 barks
```

### 3.3 Getter 和 Setter
```javascript
// Function 方式
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

Object.defineProperty(Person.prototype, 'fullName', {
  get: function() {
    return `${this.firstName} ${this.lastName}`;
  },
  set: function(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
});

// Class 方式（更直观）
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
}

const person = new Person('张', '三');
console.log(person.fullName); // 张 三
person.fullName = '李 四';
console.log(person.firstName); // 李
```

### 3.4 私有字段（ES2022）
```javascript
// Class 支持私有字段
class BankAccount {
  #balance = 0; // 私有字段
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    this.#balance += amount;
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class

// Function 方式需要使用闭包模拟
function BankAccount(initialBalance) {
  let balance = initialBalance; // 通过闭包实现私有
  
  this.deposit = function(amount) {
    balance += amount;
  };
  
  this.getBalance = function() {
    return balance;
  };
}
```

---

## 4. 性能对比

### 内存占用
```javascript
// Function: 每个实例的方法如果定义在构造函数内，会占用额外内存
function Person(name) {
  this.name = name;
  this.sayHello = function() { // ❌ 每个实例都有一份副本
    console.log('Hello');
  };
}

// 应该定义在原型上
function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function() { // ✅ 所有实例共享
  console.log('Hello');
};

// Class: 方法自动定义在原型上
class Person {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() { // ✅ 自动在原型上，所有实例共享
    console.log('Hello');
  }
}
```

---

## 5. 实际应用场景

### 使用 Function 的场景
```javascript
// 1. 简单的工厂函数
function createUser(name, role) {
  return {
    name,
    role,
    hasPermission(permission) {
      return this.role === 'admin';
    }
  };
}

// 2. 函数式编程
function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

// 3. 回调函数
setTimeout(function() {
  console.log('延迟执行');
}, 1000);
```

### 使用 Class 的场景
```javascript
// 1. 复杂的对象模型
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  static fromJSON(json) {
    return new User(json.name, json.email);
  }
  
  toJSON() {
    return { name: this.name, email: this.email };
  }
}

// 2. 继承层次结构
class Shape {
  constructor(color) {
    this.color = color;
  }
  
  getArea() {
    throw new Error('Must implement getArea');
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  
  getArea() {
    return Math.PI * this.radius ** 2;
  }
}

// 3. React 组件（虽然现在更推荐函数组件）
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  render() {
    return <div>{this.state.count}</div>;
  }
}
```

---

## 6. 本质关系

```javascript
// Class 本质上是 Function 的语法糖
class Person {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() {
    console.log('Hello');
  }
}

// 等价于
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log('Hello');
};

// 验证
console.log(typeof Person); // 'function'
console.log(Person.prototype.constructor === Person); // true
```

---

## 7. 总结对比表

| 特性 | Function | Class |
|------|----------|-------|
| **语法** | ES5 传统语法 | ES6 新语法，更清晰 |
| **严格模式** | 默认非严格 | 自动严格模式 |
| **提升** | ✅ 函数提升 | ❌ 不提升（TDZ） |
| **直接调用** | ✅ 可以（不推荐） | ❌ 必须用 new |
| **方法可枚举** | ✅ 可枚举 | ❌ 不可枚举 |
| **继承** | 复杂（原型链） | 简单（extends） |
| **静态方法** | 手动添加 | static 关键字 |
| **私有字段** | 闭包模拟 | # 语法原生支持 |
| **Getter/Setter** | defineProperty | 直接语法支持 |
| **本质** | 函数 | 函数（语法糖） |

---

## 8. 最佳实践建议

### ✅ 推荐使用 Class
- 需要创建对象实例
- 需要继承
- 复杂的对象模型
- 团队代码风格统一

### ✅ 推荐使用 Function
- 简单的工具函数
- 回调函数
- 函数式编程
- 不需要实例化的场景

### 💡 现代开发趋势
```javascript
// 现代 JavaScript 更推荐：
// 1. 使用 Class 替代构造函数
// 2. 使用箭头函数替代普通函数表达式
// 3. 使用函数式编程思想

// 示例：组合使用
class DataService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }
  
  // 使用箭头函数保持 this 绑定
  fetchData = async (endpoint) => {
    const response = await fetch(`${this.apiUrl}/${endpoint}`);
    return response.json();
  }
  
  // 静态工具方法
  static formatData(data) {
    return data.map(item => ({
      ...item,
      timestamp: new Date().toISOString()
    }));
  }
}
```

---

## 9. 面试常见问题

### Q1: Class 是新的数据类型吗？
**A:** 不是。Class 本质上仍然是函数，是基于原型的语法糖。`typeof MyClass` 返回 `'function'`。

### Q2: 为什么 Class 不能直接调用？
**A:** 这是设计上的限制，强制使用 `new` 关键字，避免意外的 this 绑定问题，使代码更安全。

### Q3: Class 的性能比 Function 差吗？
**A:** 不会。Class 编译后就是普通的构造函数和原型方法，性能基本一致。

### Q4: 什么时候必须用 Class？
**A:** 没有"必须"的场景，但在需要继承、私有字段、或团队统一使用 Class 风格时，Class 是更好的选择。
