# JavaScript 继承方式详解 - Q5 深度剖析

## 目录
1. [原型链继承](#1-原型链继承)
2. [构造函数继承](#2-构造函数继承借用构造函数)
3. [组合继承](#3-组合继承)
4. [原型式继承](#4-原型式继承)
5. [寄生式继承](#5-寄生式继承)
6. [寄生组合式继承](#6-寄生组合式继承最佳)
7. [ES6 Class 继承](#7-es6-class-继承现代推荐)
8. [对比总结](#8-继承方式对比总结)

---

## 1. 原型链继承

### 1.1 实现原理

通过将子类的原型指向父类的实例来实现继承。

```javascript
function Parent() {
  this.name = 'parent';
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child() {
  this.age = 10;
}

// 核心：将 Child 的原型指向 Parent 的实例
Child.prototype = new Parent();

const child1 = new Child();
const child2 = new Child();

console.log(child1.getName()); // 'parent'
console.log(child1.hobbies);   // ['reading', 'coding']
```

### 1.2 原型链结构

```
child1
  ├── age: 10
  └── __proto__ → Child.prototype (Parent 的实例)
        ├── name: 'parent'
        ├── hobbies: ['reading', 'coding']
        └── __proto__ → Parent.prototype
              ├── getName: function
              └── __proto__ → Object.prototype
```

### 1.3 优点

```javascript
// ✅ 简单易懂
Child.prototype = new Parent();

// ✅ 可以继承父类原型的方法
child1.getName(); // 'parent'

// ✅ instanceof 和 isPrototypeOf 正常工作
console.log(child1 instanceof Child);  // true
console.log(child1 instanceof Parent); // true
```

### 1.4 缺点

#### 缺点 1: 引用类型属性被所有实例共享

```javascript
child1.hobbies.push('gaming');
console.log(child1.hobbies); // ['reading', 'coding', 'gaming']
console.log(child2.hobbies); // ['reading', 'coding', 'gaming'] ← 被影响了！

// 原因：hobbies 在 Child.prototype 上，所有实例共享
```

#### 缺点 2: 创建子类实例时无法向父类传参

```javascript
function Parent(name) {
  this.name = name;
}

function Child() {}

Child.prototype = new Parent(); // ❌ 无法传入 name

const child = new Child();
console.log(child.name); // undefined
```

### 1.5 适用场景

- ❌ 不推荐在实际项目中使用
- 仅用于理解原型链概念

---

## 2. 构造函数继承（借用构造函数）

### 2.1 实现原理

在子类构造函数中调用父类构造函数，使用 `call` 或 `apply` 改变 `this` 指向。

```javascript
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  // 核心：调用父类构造函数，继承属性
  Parent.call(this, name);
  this.age = age;
}

const child1 = new Child('Alice', 10);
const child2 = new Child('Bob', 12);

console.log(child1.name); // 'Alice'
console.log(child2.name); // 'Bob'
```

### 2.2 执行流程

```javascript
// 当执行 new Child('Alice', 10) 时：

// 1. 创建新对象
const child1 = {};

// 2. 设置原型
child1.__proto__ = Child.prototype;

// 3. 执行 Child 构造函数
function Child(name, age) {
  // 4. 调用 Parent.call(this, name)
  // this 指向 child1
  Parent.call(child1, 'Alice');
  // 等价于：
  // child1.name = 'Alice';
  // child1.hobbies = ['reading', 'coding'];
  
  // 5. 设置子类自己的属性
  child1.age = 10;
}

// 6. 返回 child1
```

### 2.3 优点

#### 优点 1: 可以向父类传参

```javascript
function Parent(name, age) {
  this.name = name;
  this.age = age;
}

function Child(name, age, grade) {
  Parent.call(this, name, age); // ✅ 可以传参
  this.grade = grade;
}

const child = new Child('Alice', 10, 5);
console.log(child.name);  // 'Alice'
console.log(child.age);   // 10
console.log(child.grade); // 5
```

#### 优点 2: 引用类型属性不共享

```javascript
child1.hobbies.push('gaming');
console.log(child1.hobbies); // ['reading', 'coding', 'gaming']
console.log(child2.hobbies); // ['reading', 'coding'] ← 不受影响
```

### 2.4 缺点

#### 缺点 1: 无法继承父类原型的方法

```javascript
console.log(child1.getName); // undefined ← 无法访问父类原型方法

// 原因：只调用了父类构造函数，没有设置原型链
```

#### 缺点 2: 方法都在构造函数中定义，无法复用

```javascript
function Parent() {
  this.sayHello = function() { // 每个实例都会创建新函数
    console.log('Hello');
  };
}

const parent1 = new Parent();
const parent2 = new Parent();

console.log(parent1.sayHello === parent2.sayHello); // false ← 不是同一个函数
```

### 2.5 适用场景

- 只需要继承父类的属性，不需要继承方法
- 父类没有原型方法

---

## 3. 组合继承

### 3.1 实现原理

结合原型链继承和构造函数继承，既继承属性又继承方法。

```javascript
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  // 1. 构造函数继承：继承属性
  Parent.call(this, name); // 第二次调用 Parent
  this.age = age;
}

// 2. 原型链继承：继承方法
Child.prototype = new Parent(); // 第一次调用 Parent
Child.prototype.constructor = Child;

const child1 = new Child('Alice', 10);
const child2 = new Child('Bob', 12);

// ✅ 可以继承方法
console.log(child1.getName()); // 'Alice'

// ✅ 引用类型不共享
child1.hobbies.push('gaming');
console.log(child1.hobbies); // ['reading', 'coding', 'gaming']
console.log(child2.hobbies); // ['reading', 'coding']
```

### 3.2 执行流程

```javascript
// 第一次调用 Parent：设置原型
Child.prototype = new Parent();
// Child.prototype = {
//   name: 'parent',
//   hobbies: ['reading', 'coding'],
//   __proto__: Parent.prototype
// }

// 第二次调用 Parent：创建实例时
const child1 = new Child('Alice', 10);
// 在 Child 构造函数中调用 Parent.call(this, 'Alice')
// child1 = {
//   name: 'Alice',
//   hobbies: ['reading', 'coding'],
//   age: 10,
//   __proto__: Child.prototype
// }
```

### 3.3 优点

```javascript
// ✅ 结合了两者的优点
// 1. 可以继承属性和方法
console.log(child1.getName()); // 'Alice'

// 2. 可以向父类传参
const child = new Child('Alice', 10);

// 3. 引用类型不共享
child1.hobbies.push('gaming');
console.log(child2.hobbies); // 不受影响

// 4. instanceof 正常工作
console.log(child1 instanceof Child);  // true
console.log(child1 instanceof Parent); // true
```

### 3.4 缺点

#### 缺点：调用了两次父类构造函数

```javascript
// 第一次：设置原型
Child.prototype = new Parent(); // 创建了 name 和 hobbies

// 第二次：创建实例
Parent.call(this, name); // 又创建了 name 和 hobbies

// 结果：实例上有一份属性，原型上也有一份（浪费内存）
console.log(child1);
// {
//   name: 'Alice',        ← 实例属性
//   hobbies: [...],       ← 实例属性
//   age: 10,
//   __proto__: {
//     name: 'parent',     ← 原型属性（多余）
//     hobbies: [...],     ← 原型属性（多余）
//   }
// }
```

### 3.5 适用场景

- 需要继承属性和方法
- 不在意调用两次父类构造函数的性能损耗
- ES5 环境下的常用方案

---

## 4. 原型式继承

### 4.1 实现原理

基于已有对象创建新对象，不需要构造函数。

```javascript
// 手动实现 Object.create
function createObject(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}

// ES5 提供的 Object.create
const parent = {
  name: 'parent',
  hobbies: ['reading', 'coding'],
  getName: function() {
    return this.name;
  }
};

const child1 = Object.create(parent);
const child2 = Object.create(parent);

console.log(child1.getName()); // 'parent'
```

### 4.2 原型链结构

```
child1
  └── __proto__ → parent
        ├── name: 'parent'
        ├── hobbies: ['reading', 'coding']
        ├── getName: function
        └── __proto__ → Object.prototype
```

### 4.3 优点

```javascript
// ✅ 简单，不需要构造函数
const child = Object.create(parent);

// ✅ 适合创建相似对象
const child1 = Object.create(parent);
const child2 = Object.create(parent);
```

### 4.4 缺点

#### 缺点：引用类型属性被所有实例共享

```javascript
child1.hobbies.push('gaming');
console.log(child1.hobbies); // ['reading', 'coding', 'gaming']
console.log(child2.hobbies); // ['reading', 'coding', 'gaming'] ← 被影响
```

### 4.5 适用场景

- 创建简单的对象副本
- 不需要独立的引用类型属性

---

## 5. 寄生式继承

### 5.1 实现原理

在原型式继承的基础上，增强对象（添加方法）。

```javascript
function createChild(parent) {
  // 1. 创建对象
  const child = Object.create(parent);
  
  // 2. 增强对象
  child.sayHello = function() {
    console.log('Hello');
  };
  
  child.getAge = function() {
    return this.age;
  };
  
  // 3. 返回对象
  return child;
}

const parent = {
  name: 'parent',
  age: 50
};

const child1 = createChild(parent);
const child2 = createChild(parent);

child1.sayHello(); // 'Hello'
console.log(child1.name); // 'parent'
```

### 5.2 优点

```javascript
// ✅ 可以在创建对象时添加方法
const child = createChild(parent);
child.sayHello();
```

### 5.3 缺点

#### 缺点：无法复用函数

```javascript
const child1 = createChild(parent);
const child2 = createChild(parent);

console.log(child1.sayHello === child2.sayHello); // false
// 每次创建都会创建新函数，无法复用
```

### 5.4 适用场景

- 需要在创建对象时添加特定方法
- 不在意函数复用问题

---

## 6. 寄生组合式继承（最佳）

### 6.1 实现原理

解决组合继承调用两次父类构造函数的问题。

```javascript
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  // 1. 继承属性
  Parent.call(this, name); // 只调用一次 Parent
  this.age = age;
}

// 2. 继承方法（关键：使用 Object.create）
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.getAge = function() {
  return this.age;
};

const child = new Child('Alice', 10);
console.log(child.getName()); // 'Alice'
console.log(child.getAge());  // 10
```

### 6.2 与组合继承的区别

```javascript
// 组合继承
Child.prototype = new Parent(); // ❌ 调用父类构造函数，创建多余属性

// 寄生组合式继承
Child.prototype = Object.create(Parent.prototype); // ✅ 只继承原型，不调用构造函数
```

### 6.3 原型链结构

```
child
  ├── name: 'Alice'
  ├── hobbies: ['reading', 'coding']
  ├── age: 10
  └── __proto__ → Child.prototype
        ├── constructor: Child
        ├── getAge: function
        └── __proto__ → Parent.prototype
              ├── getName: function
              └── __proto__ → Object.prototype
```

### 6.4 封装继承函数

```javascript
function inheritPrototype(Child, Parent) {
  // 1. 创建父类原型的副本
  const prototype = Object.create(Parent.prototype);
  
  // 2. 修正 constructor
  prototype.constructor = Child;
  
  // 3. 设置子类原型
  Child.prototype = prototype;
}

// 使用
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inheritPrototype(Child, Parent);

Child.prototype.getAge = function() {
  return this.age;
};
```

### 6.5 优点

```javascript
// ✅ 只调用一次父类构造函数
// ✅ 原型链保持不变
// ✅ instanceof 和 isPrototypeOf 正常工作
// ✅ 没有多余的属性

const child = new Child('Alice', 10);
console.log(child.getName()); // 'Alice'
console.log(child.getAge());  // 10
console.log(child instanceof Child);  // true
console.log(child instanceof Parent); // true
```

### 6.6 适用场景

- ⭐⭐⭐⭐⭐ ES5 环境下的最佳继承方案
- 需要完美继承且注重性能

---

## 7. ES6 Class 继承（现代推荐）

### 7.1 实现原理

使用 ES6 的 `class` 和 `extends` 关键字。

```javascript
class Parent {
  constructor(name) {
    this.name = name;
    this.hobbies = ['reading', 'coding'];
  }
  
  getName() {
    return this.name;
  }
  
  static getType() {
    return 'Parent';
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }
  
  getAge() {
    return this.age;
  }
  
  // 重写父类方法
  getName() {
    return `Child: ${super.getName()}`;
  }
}

const child = new Child('Alice', 10);
console.log(child.getName()); // 'Child: Alice'
console.log(child.getAge());  // 10
```

### 7.2 super 关键字

```javascript
class Child extends Parent {
  constructor(name, age) {
    // super() 调用父类构造函数
    super(name);
    this.age = age;
  }
  
  getName() {
    // super.method() 调用父类方法
    return `Child: ${super.getName()}`;
  }
  
  static getType() {
    // 静态方法中也可以使用 super
    return `${super.getType()} -> Child`;
  }
}
```

### 7.3 原型链结构

```
child
  ├── name: 'Alice'
  ├── hobbies: ['reading', 'coding']
  ├── age: 10
  └── __proto__ → Child.prototype
        ├── constructor: Child
        ├── getName: function
        ├── getAge: function
        └── __proto__ → Parent.prototype
              ├── constructor: Parent
              ├── getName: function
              └── __proto__ → Object.prototype
```

### 7.4 优点

```javascript
// ✅ 语法清晰，易于理解
class Child extends Parent {}

// ✅ 自动设置原型链
// ✅ 支持 super 关键字
// ✅ 支持静态方法继承
console.log(Child.getType()); // 'Parent -> Child'

// ✅ 更好的错误提示
class Child extends Parent {
  constructor(name, age) {
    // super() 必须在 this 之前调用
    this.age = age; // ❌ ReferenceError
    super(name);
  }
}
```

### 7.5 注意事项

```javascript
// 1. 必须调用 super()
class Child extends Parent {
  constructor(name, age) {
    // super(name); // ❌ 如果不调用，会报错
    this.age = age;
  }
}

// 2. super() 必须在 this 之前
class Child extends Parent {
  constructor(name, age) {
    this.age = age; // ❌ ReferenceError
    super(name);
  }
}

// 3. 如果不定义 constructor，会自动调用 super
class Child extends Parent {
  // 等价于：
  // constructor(...args) {
  //   super(...args);
  // }
}
```

### 7.6 适用场景

- ⭐⭐⭐⭐⭐ ES6+ 环境下的首选方案
- 现代项目的标准继承方式

---

## 8. 继承方式对比总结

### 8.1 对比表

| 继承方式 | 优点 | 缺点 | 推荐度 | 适用场景 |
|---------|------|------|--------|---------|
| **原型链继承** | 简单 | 引用类型共享、无法传参 | ⭐ | 学习原型链概念 |
| **构造函数继承** | 可传参、引用类型独立 | 无法继承原型方法 | ⭐⭐ | 只需继承属性 |
| **组合继承** | 结合两者优点 | 调用两次父类构造函数 | ⭐⭐⭐⭐ | ES5 常用方案 |
| **原型式继承** | 简单 | 引用类型共享 | ⭐⭐ | 创建简单对象副本 |
| **寄生式继承** | 可增强对象 | 无法复用函数 | ⭐⭐ | 需要添加特定方法 |
| **寄生组合式** | 完美解决组合继承问题 | 实现稍复杂 | ⭐⭐⭐⭐⭐ | ES5 最佳方案 |
| **ES6 Class** | 语法清晰、易维护 | 需要 ES6 支持 | ⭐⭐⭐⭐⭐ | 现代项目首选 |

### 8.2 选择建议

```javascript
// ES6+ 环境
class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}

// ES5 环境
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

### 8.3 核心要点

1. **原型链**：理解 `prototype` 和 `__proto__` 的关系
2. **构造函数**：使用 `call/apply` 继承属性
3. **Object.create**：创建干净的原型链
4. **super**：ES6 Class 的关键字
5. **性能**：避免调用多次父类构造函数

### 8.4 最佳实践

```javascript
// ✅ 推荐：ES6 Class
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    console.log('Woof!');
  }
}

// ✅ 推荐：寄生组合式（ES5）
function inheritPrototype(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}
```
