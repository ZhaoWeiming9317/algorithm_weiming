# JavaScript 原型（Prototype）面试题详解

## 目录
1. [原型基础概念](#1-原型基础概念)
2. [原型链](#2-原型链)
3. [继承实现](#3-继承实现)
4. [原型方法](#4-原型方法)
5. [经典面试题](#5-经典面试题)
6. [手写实现](#6-手写实现)

---

## 1. 原型基础概念

### Q1: 什么是原型？prototype 和 __proto__ 的区别？

**A:**

#### 原型的定义
- **原型（prototype）**：每个函数都有一个 `prototype` 属性，指向一个对象
- **原型对象**：用于存放共享的属性和方法
- **原型链**：对象通过 `__proto__` 连接起来的链条

#### prototype vs __proto__

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const person = new Person('Alice');

// 1. prototype - 函数的属性
console.log(Person.prototype); 
// { sayHello: [Function], constructor: Person }

// 2. __proto__ - 对象的属性（实例的原型）
console.log(person.__proto__ === Person.prototype); // true

// 3. 关系图
/*
Person (函数)
  ├── prototype ────────┐
  │                     ▼
  │              { sayHello, constructor }
  │                     ▲
  │                     │
person (实例)           │
  └── __proto__ ────────┘
*/
```

#### 关键区别

| 特性 | prototype | __proto__ |
|-----|-----------|-----------|
| **属于** | 函数对象 | 所有对象 |
| **作用** | 定义共享属性/方法 | 访问原型对象 |
| **可修改** | ✅ 可以 | ⚠️ 不推荐 |
| **标准** | ES 标准 | 非标准（但广泛支持） |

```javascript
// prototype 只有函数有
function Foo() {}
console.log(Foo.prototype); // { constructor: Foo }
console.log({}.prototype);  // undefined

// __proto__ 所有对象都有
console.log(person.__proto__);     // Person.prototype
console.log([1, 2].__proto__);     // Array.prototype
console.log(Foo.__proto__);        // Function.prototype
```

#### 标准访问方式

```javascript
// ❌ 不推荐：直接使用 __proto__
person.__proto__ = someObject;

// ✅ 推荐：使用标准方法
Object.getPrototypeOf(person);           // 获取原型
Object.setPrototypeOf(person, newProto); // 设置原型
Object.create(proto);                    // 创建对象并指定原型
```

---

### Q2: constructor 属性是什么？

**A:**

#### 基本概念

```javascript
function Person(name) {
  this.name = name;
}

// constructor 指向构造函数本身
console.log(Person.prototype.constructor === Person); // true

const person = new Person('Alice');
console.log(person.constructor === Person); // true
```

#### constructor 的作用

```javascript
// 1. 识别对象类型
function Animal() {}
function Dog() {}

const dog = new Dog();
console.log(dog.constructor === Dog); // true
console.log(dog.constructor === Animal); // false

// 2. 创建同类型的新对象
function Car(model) {
  this.model = model;
}

const car1 = new Car('Tesla');
const car2 = new car1.constructor('BMW'); // 使用 constructor 创建新实例
console.log(car2.model); // 'BMW'

// 3. 判断实例类型
console.log(car1.constructor.name); // 'Car'
```

#### 常见陷阱

```javascript
function Person() {}

// ❌ 错误：直接覆盖 prototype，丢失 constructor
Person.prototype = {
  sayHello: function() {
    console.log('Hello');
  }
};

const person = new Person();
console.log(person.constructor === Person); // false
console.log(person.constructor === Object); // true（指向 Object）

// ✅ 正确：重新指定 constructor
Person.prototype = {
  constructor: Person, // 手动添加
  sayHello: function() {
    console.log('Hello');
  }
};

// ✅ 或者：不覆盖，逐个添加
Person.prototype.sayHello = function() {
  console.log('Hello');
};
```

---

## 2. 原型链

### Q3: 什么是原型链？如何查找属性？

**A:**

#### 原型链的定义

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log('Hello');
};

const person = new Person('Alice');

// 原型链：
// person → Person.prototype → Object.prototype → null
console.log(Object.getPrototypeOf(person)); // Person.prototype
console.log(Object.getPrototypeOf(Person.prototype)); // Object.prototype
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

#### 属性查找机制

```javascript
const person = {
  name: 'Alice',
  age: 25
};

// 查找顺序：
// 1. 自身属性
console.log(person.name); // 'Alice' - 找到，停止查找

// 2. 原型属性
console.log(person.toString); // [Function] - 在 Object.prototype 找到

// 3. 找不到返回 undefined
console.log(person.notExist); // undefined

// 完整查找过程：
/*
person.toString 查找过程：
1. person 自身 → 没有 toString
2. person.__proto__ (Object.prototype) → 找到 toString ✅
3. 返回 Object.prototype.toString
*/
```

#### 原型链示例

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// 建立原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log('Woof!');
};

const dog = new Dog('Buddy', 'Golden Retriever');

// 原型链：
// dog → Dog.prototype → Animal.prototype → Object.prototype → null

dog.bark();  // 'Woof!' - 在 Dog.prototype 找到
dog.eat();   // 'Buddy is eating' - 在 Animal.prototype 找到
dog.toString(); // '[object Object]' - 在 Object.prototype 找到
```

#### 原型链的终点

```javascript
// 所有原型链的终点都是 null
console.log(Object.getPrototypeOf(Object.prototype)); // null

// 特殊情况：Object.create(null) 创建的对象没有原型
const obj = Object.create(null);
console.log(Object.getPrototypeOf(obj)); // null
console.log(obj.toString); // undefined（没有原型链）
```

---

### Q4: instanceof 的原理是什么？

**A:**

#### 基本用法

```javascript
function Person() {}
const person = new Person();

console.log(person instanceof Person); // true
console.log(person instanceof Object); // true
console.log(person instanceof Array);  // false
```

#### instanceof 的原理

```javascript
// instanceof 检查：
// 右边的 prototype 是否在左边的原型链上

function myInstanceof(obj, constructor) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(obj);
  
  // 获取构造函数的 prototype
  const prototype = constructor.prototype;
  
  // 沿着原型链查找
  while (proto) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  
  return false;
}

// 测试
function Person() {}
const person = new Person();

console.log(myInstanceof(person, Person)); // true
console.log(myInstanceof(person, Object)); // true
console.log(myInstanceof(person, Array));  // false
```

#### instanceof 的陷阱

```javascript
// 1. 原型链被修改
function Person() {}
const person = new Person();

console.log(person instanceof Person); // true

// 修改原型
Person.prototype = {};

console.log(person instanceof Person); // false（原型链断了）

// 2. 跨 iframe 问题
// iframe 中的数组不是父页面的 Array 实例
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const iframeArray = iframe.contentWindow.Array;

const arr = new iframeArray();
console.log(arr instanceof Array); // false
console.log(Array.isArray(arr));   // true（推荐使用）

// 3. 基本类型
console.log(1 instanceof Number);        // false
console.log(new Number(1) instanceof Number); // true
console.log('hello' instanceof String);  // false
console.log(new String('hello') instanceof String); // true
```

---

## 3. 继承实现

### Q5: JavaScript 有哪些继承方式？

**A:**

#### 1. 原型链继承

```javascript
function Parent() {
  this.name = 'parent';
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child() {}

// 继承
Child.prototype = new Parent();

const child1 = new Child();
const child2 = new Child();

// ✅ 优点：简单，能继承原型方法
console.log(child1.getName()); // 'parent'

// ❌ 缺点1：引用类型共享
child1.hobbies.push('gaming');
console.log(child2.hobbies); // ['reading', 'coding', 'gaming']

// ❌ 缺点2：无法向父类传参
```

#### 2. 构造函数继承（借用构造函数）

```javascript
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  // 继承属性
  Parent.call(this, name);
  this.age = age;
}

const child1 = new Child('Alice', 10);
const child2 = new Child('Bob', 12);

// ✅ 优点1：可以向父类传参
console.log(child1.name); // 'Alice'

// ✅ 优点2：引用类型不共享
child1.hobbies.push('gaming');
console.log(child2.hobbies); // ['reading', 'coding']

// ❌ 缺点：无法继承原型方法
console.log(child1.getName); // undefined
```

#### 3. 组合继承（推荐 ⭐⭐⭐⭐）

```javascript
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  // 继承属性
  Parent.call(this, name); // 第二次调用 Parent
  this.age = age;
}

// 继承方法
Child.prototype = new Parent(); // 第一次调用 Parent
Child.prototype.constructor = Child;

const child1 = new Child('Alice', 10);
const child2 = new Child('Bob', 12);

// ✅ 优点：结合了两者的优点
console.log(child1.getName()); // 'Alice'
child1.hobbies.push('gaming');
console.log(child2.hobbies); // ['reading', 'coding']

// ❌ 缺点：调用了两次父类构造函数
```

#### 4. 原型式继承

```javascript
function createObject(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}

// 或使用 ES5 的 Object.create
const parent = {
  name: 'parent',
  hobbies: ['reading', 'coding'],
  getName: function() {
    return this.name;
  }
};

const child1 = Object.create(parent);
const child2 = Object.create(parent);

// ✅ 优点：简单
console.log(child1.getName()); // 'parent'

// ❌ 缺点：引用类型共享
child1.hobbies.push('gaming');
console.log(child2.hobbies); // ['reading', 'coding', 'gaming']
```

#### 5. 寄生式继承

```javascript
function createChild(parent) {
  const child = Object.create(parent);
  
  // 增强对象
  child.sayHello = function() {
    console.log('Hello');
  };
  
  return child;
}

const parent = {
  name: 'parent'
};

const child = createChild(parent);
child.sayHello(); // 'Hello'

// ❌ 缺点：无法复用函数（每次创建都会创建新函数）
```

#### 6. 寄生组合式继承（最佳 ⭐⭐⭐⭐⭐）

```javascript
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name); // 只调用一次 Parent
  this.age = age;
}

// 关键：使用 Object.create 而不是 new Parent()
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.getAge = function() {
  return this.age;
};

const child = new Child('Alice', 10);

// ✅ 优点：
// 1. 只调用一次父类构造函数
// 2. 原型链保持不变
// 3. 能正常使用 instanceof 和 isPrototypeOf
console.log(child.getName()); // 'Alice'
console.log(child.getAge());  // 10
console.log(child instanceof Child);  // true
console.log(child instanceof Parent); // true
```

#### 7. ES6 Class 继承（现代推荐 ⭐⭐⭐⭐⭐）

```javascript
class Parent {
  constructor(name) {
    this.name = name;
    this.hobbies = ['reading', 'coding'];
  }
  
  getName() {
    return this.name;
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
}

const child = new Child('Alice', 10);

// ✅ 优点：
// 1. 语法清晰
// 2. 自动设置原型链
// 3. 支持 super 关键字
console.log(child.getName()); // 'Alice'
console.log(child.getAge());  // 10
```

#### 继承方式对比

| 继承方式 | 优点 | 缺点 | 推荐度 |
|---------|------|------|--------|
| **原型链继承** | 简单 | 引用类型共享、无法传参 | ⭐ |
| **构造函数继承** | 可传参、引用类型独立 | 无法继承原型方法 | ⭐⭐ |
| **组合继承** | 结合两者优点 | 调用两次父类构造函数 | ⭐⭐⭐⭐ |
| **原型式继承** | 简单 | 引用类型共享 | ⭐⭐ |
| **寄生式继承** | 可增强对象 | 无法复用函数 | ⭐⭐ |
| **寄生组合式** | 完美解决组合继承的问题 | 实现稍复杂 | ⭐⭐⭐⭐⭐ |
| **ES6 Class** | 语法清晰、易维护 | 需要 ES6 支持 | ⭐⭐⭐⭐⭐ |

---

## 4. 原型方法

### Q6: hasOwnProperty、in、for...in 的区别？

**A:**

#### 快速对比表

| 方法/操作符 | 检查自身属性 | 检查原型属性 | 检查不可枚举属性 | 返回值 |
|-----------|------------|------------|----------------|--------|
| **hasOwnProperty()** | ✅ | ❌ | ✅ | boolean |
| **in 操作符** | ✅ | ✅ | ✅ | boolean |
| **for...in** | ✅ | ✅ | ❌ | 遍历键名 |
| **Object.keys()** | ✅ | ❌ | ❌ | 数组 |
| **Object.getOwnPropertyNames()** | ✅ | ❌ | ✅ | 数组 |
| **Object.getOwnPropertySymbols()** | ✅（Symbol） | ❌ | ✅ | 数组 |

#### 详细示例

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.age = 25;

const person = new Person('Alice');

// 1. hasOwnProperty - 只检查自身属性
console.log(person.hasOwnProperty('name')); // true
console.log(person.hasOwnProperty('age'));  // false（原型属性）

// 2. in 操作符 - 检查自身和原型链
console.log('name' in person); // true
console.log('age' in person);  // true
console.log('toString' in person); // true（Object.prototype）

// 3. for...in - 遍历可枚举的自身和原型属性
for (let key in person) {
  console.log(key); // 'name', 'age'（不包括 toString，因为不可枚举）
}

// 4. 只遍历自身属性
for (let key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(key); // 'name'
  }
}

// 5. Object.keys - 只返回自身可枚举属性
console.log(Object.keys(person)); // ['name']

// 6. Object.getOwnPropertyNames - 返回所有自身属性（包括不可枚举）
console.log(Object.getOwnPropertyNames(person)); // ['name']
```

#### 完整对比示例

```javascript
const obj = Object.create({ inherited: 'value' });
obj.own = 'own value';

Object.defineProperty(obj, 'nonEnum', {
  value: 'non-enumerable',
  enumerable: false
});

// hasOwnProperty
console.log(obj.hasOwnProperty('own'));       // true
console.log(obj.hasOwnProperty('inherited')); // false
console.log(obj.hasOwnProperty('nonEnum'));   // true

// in
console.log('own' in obj);       // true
console.log('inherited' in obj); // true
console.log('nonEnum' in obj);   // true

// for...in
for (let key in obj) {
  console.log(key); // 'own', 'inherited'（不包括 nonEnum）
}

// Object.keys
console.log(Object.keys(obj)); // ['own']

// Object.getOwnPropertyNames
console.log(Object.getOwnPropertyNames(obj)); // ['own', 'nonEnum']
```

#### 使用场景建议

| 场景 | 推荐方法 |
|-----|---------|
| **判断对象自身是否有某属性** | `hasOwnProperty()` |
| **判断对象是否可访问某属性（含原型）** | `in` 操作符 |
| **遍历对象所有可访问属性** | `for...in` + `hasOwnProperty()` |
| **获取对象自身可枚举属性** | `Object.keys()` |
| **获取对象所有自身属性** | `Object.getOwnPropertyNames()` |
| **复制对象（浅拷贝）** | `Object.keys()` + 赋值 |

---

## 5. 经典面试题

### Q7: 以下代码输出什么？

```javascript
function Person() {}
Person.prototype.name = 'Alice';

const person1 = new Person();
const person2 = new Person();

person1.name = 'Bob';

console.log(person1.name); // ?
console.log(person2.name); // ?

delete person1.name;

console.log(person1.name); // ?
console.log(person2.name); // ?
```

**答案：**

```javascript
console.log(person1.name); // 'Bob' - 自身属性
console.log(person2.name); // 'Alice' - 原型属性

delete person1.name; // 删除自身属性

console.log(person1.name); // 'Alice' - 回退到原型属性
console.log(person2.name); // 'Alice' - 原型属性
```

**解析：**
- 给对象赋值会在对象自身创建属性，不会修改原型
- `delete` 只能删除自身属性，不能删除原型属性
- 删除自身属性后，会沿原型链查找

---

### Q8: 以下代码输出什么？

```javascript
function Foo() {
  getName = function() {
    console.log(1);
  };
  return this;
}

Foo.getName = function() {
  console.log(2);
};

Foo.prototype.getName = function() {
  console.log(3);
};

var getName = function() {
  console.log(4);
};

function getName() {
  console.log(5);
}

// 请写出以下输出结果：
Foo.getName();           // ?
getName();               // ?
Foo().getName();         // ?
getName();               // ?
new Foo.getName();       // ?
new Foo().getName();     // ?
new new Foo().getName(); // ?
```

**答案：**

```javascript
Foo.getName();           // 2 - 调用 Foo 的静态方法
getName();               // 4 - 函数声明被函数表达式覆盖
Foo().getName();         // 1 - Foo() 执行后，全局 getName 被修改为 1
getName();               // 1 - 全局 getName 已被修改
new Foo.getName();       // 2 - 相当于 new (Foo.getName)()
new Foo().getName();     // 3 - 调用实例的原型方法
new new Foo().getName(); // 3 - 相当于 new ((new Foo()).getName)()
```

**详细解析：**

```javascript
// 1. Foo.getName() → 2
// 直接调用 Foo 对象的静态方法

// 2. getName() → 4
// 函数声明提升，但被函数表达式覆盖
// var getName = function() { console.log(4); }

// 3. Foo().getName() → 1
// Foo() 执行：
//   - getName = function() { console.log(1); } (修改全局 getName)
//   - return this (this 指向 window)
// window.getName() → 1

// 4. getName() → 1
// 全局 getName 已被修改为 1

// 5. new Foo.getName() → 2
// 运算符优先级：成员访问 > new
// 相当于：new (Foo.getName)()
// 执行 Foo.getName 并作为构造函数

// 6. new Foo().getName() → 3
// 运算符优先级：new (带参数) > 成员访问
// 相当于：(new Foo()).getName()
// 调用实例的原型方法

// 7. new new Foo().getName() → 3
// 相当于：new ((new Foo()).getName)()
// 先 new Foo() 创建实例
// 再调用实例的 getName 方法作为构造函数
```

---

### Q9: 实现一个 new 操作符

**A:**

```javascript
function myNew(constructor, ...args) {
  // 1. 创建一个新对象，原型指向构造函数的 prototype
  const obj = Object.create(constructor.prototype);
  
  // 2. 执行构造函数，绑定 this
  const result = constructor.apply(obj, args);
  
  // 3. 如果构造函数返回对象，则返回该对象；否则返回新创建的对象
  return result instanceof Object ? result : obj;
}

// 测试
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const person = myNew(Person, 'Alice', 25);
console.log(person.name); // 'Alice'
person.sayHello(); // 'Hello, I'm Alice'
console.log(person instanceof Person); // true
```

**new 的执行步骤：**

```javascript
// 1. 创建新对象
const obj = {};

// 2. 设置原型
obj.__proto__ = Constructor.prototype;
// 或
const obj = Object.create(Constructor.prototype);

// 3. 执行构造函数
const result = Constructor.apply(obj, args);

// 4. 返回对象
return typeof result === 'object' && result !== null ? result : obj;
```

---

## 6. 手写实现

### Q10: 手写 instanceof

**A:**

```javascript
function myInstanceof(obj, constructor) {
  // 基本类型直接返回 false
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  // 获取对象的原型
  let proto = Object.getPrototypeOf(obj);
  
  // 获取构造函数的 prototype
  const prototype = constructor.prototype;
  
  // 沿着原型链查找
  while (proto) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  
  return false;
}

// 测试
function Person() {}
const person = new Person();

console.log(myInstanceof(person, Person)); // true
console.log(myInstanceof(person, Object)); // true
console.log(myInstanceof(person, Array));  // false
console.log(myInstanceof([], Array));      // true
console.log(myInstanceof([], Object));     // true
console.log(myInstanceof(null, Object));   // false
console.log(myInstanceof(1, Number));      // false
```

---

### Q11: 手写 Object.create

**A:**

```javascript
function myCreate(proto, propertiesObject) {
  // 参数校验
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null');
  }
  
  // 创建一个临时构造函数
  function F() {}
  
  // 设置原型
  F.prototype = proto;
  
  // 创建实例
  const obj = new F();
  
  // 如果有第二个参数，定义属性
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }
  
  return obj;
}

// 测试
const parent = {
  name: 'parent',
  sayHello: function() {
    console.log('Hello');
  }
};

const child = myCreate(parent, {
  age: {
    value: 10,
    writable: true,
    enumerable: true,
    configurable: true
  }
});

console.log(child.name); // 'parent'
console.log(child.age);  // 10
child.sayHello();        // 'Hello'
console.log(Object.getPrototypeOf(child) === parent); // true
```

---

### Q12: 手写寄生组合式继承

**A:**

```javascript
function inheritPrototype(Child, Parent) {
  // 创建父类原型的副本
  const prototype = Object.create(Parent.prototype);
  
  // 修正 constructor
  prototype.constructor = Child;
  
  // 设置子类原型
  Child.prototype = prototype;
}

// 使用
function Parent(name) {
  this.name = name;
  this.hobbies = ['reading', 'coding'];
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  // 继承属性
  Parent.call(this, name);
  this.age = age;
}

// 继承方法
inheritPrototype(Child, Parent);

Child.prototype.getAge = function() {
  return this.age;
};

// 测试
const child1 = new Child('Alice', 10);
const child2 = new Child('Bob', 12);

console.log(child1.getName()); // 'Alice'
console.log(child1.getAge());  // 10

child1.hobbies.push('gaming');
console.log(child1.hobbies); // ['reading', 'coding', 'gaming']
console.log(child2.hobbies); // ['reading', 'coding']

console.log(child1 instanceof Child);  // true
console.log(child1 instanceof Parent); // true
```

---

### Q13: 实现一个深拷贝（考虑原型链）

**A:**

```javascript
function deepClone(obj, hash = new WeakMap()) {
  // null 或非对象直接返回
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  
  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  // 处理正则
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    const arrCopy = [];
    hash.set(obj, arrCopy);
    obj.forEach((item, index) => {
      arrCopy[index] = deepClone(item, hash);
    });
    return arrCopy;
  }
  
  // 处理对象（保持原型链）
  const objCopy = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, objCopy);
  
  // 拷贝所有自身属性（包括不可枚举属性）
  Object.getOwnPropertyNames(obj).forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor.value !== undefined) {
      descriptor.value = deepClone(descriptor.value, hash);
    }
    Object.defineProperty(objCopy, key, descriptor);
  });
  
  // 拷贝 Symbol 属性
  Object.getOwnPropertySymbols(obj).forEach(symbol => {
    objCopy[symbol] = deepClone(obj[symbol], hash);
  });
  
  return objCopy;
}

// 测试
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const person1 = new Person('Alice');
person1.hobbies = ['reading', 'coding'];

const person2 = deepClone(person1);

console.log(person2.name); // 'Alice'
console.log(person2.hobbies); // ['reading', 'coding']
person2.sayHello(); // 'Hello, I'm Alice'

// 修改不影响原对象
person2.hobbies.push('gaming');
console.log(person1.hobbies); // ['reading', 'coding']
console.log(person2.hobbies); // ['reading', 'coding', 'gaming']

// 原型链保持
console.log(person2 instanceof Person); // true
console.log(Object.getPrototypeOf(person2) === Person.prototype); // true
```

---

## 总结

### 核心概念

1. **prototype**：函数的属性，指向原型对象
2. **__proto__**：对象的属性，指向其原型
3. **constructor**：原型对象的属性，指向构造函数
4. **原型链**：对象通过 `__proto__` 连接形成的链条

### 关键关系

```javascript
function Person() {}
const person = new Person();

// 三角关系
Person.prototype.constructor === Person; // true
person.__proto__ === Person.prototype;   // true
person.constructor === Person;           // true

// 原型链
person.__proto__ === Person.prototype;
Person.prototype.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;
```

### 最佳实践

1. **继承**：使用 ES6 Class 或寄生组合式继承
2. **属性检查**：使用 `hasOwnProperty` 区分自身和原型属性
3. **类型判断**：使用 `instanceof` 或 `Object.prototype.toString.call()`
4. **原型访问**：使用 `Object.getPrototypeOf()` 而不是 `__proto__`
5. **创建对象**：使用 `Object.create()` 指定原型

### 常见陷阱

1. 直接修改 `prototype` 会丢失 `constructor`
2. 引用类型的原型属性会被所有实例共享
3. `instanceof` 在跨 iframe 时可能失效
4. `delete` 只能删除自身属性，不能删除原型属性
5. `for...in` 会遍历原型链上的可枚举属性
