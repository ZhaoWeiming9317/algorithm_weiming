/**
 * 手写实现 new 操作符
 * 
 * new 操作符做了什么：
 * 1. 创建一个新的空对象
 * 2. 将这个对象的原型指向构造函数的 prototype
 * 3. 将构造函数的 this 绑定到这个新对象
 * 4. 执行构造函数
 * 5. 如果构造函数返回对象，就返回该对象；否则返回新创建的对象
 */

// ==================== 手写 new 的实现 ====================

function myNew(constructor, ...args) {
  // 1. 创建一个新的空对象
  const obj = {};
  
  // 2. 将新对象的原型指向构造函数的 prototype
  Object.setPrototypeOf(obj, constructor.prototype);
  // 或者：obj.__proto__ = constructor.prototype;
  
  // 3. 将构造函数的 this 绑定到新对象，并执行构造函数
  const result = constructor.apply(obj, args);
  
  // 4. 如果构造函数返回对象，就返回该对象；否则返回新创建的对象
  return result instanceof Object ? result : obj;
}

function myNews(constructor, ...args) {
  const obj = {};
  Object.setPrototypeOf(obj, constructor.prototype);

  const result = constructor.apply(obj, args);

  return result instanceof Object ? result : obj;
}

// ==================== 更简洁的实现 ====================

function simpleNew(constructor, ...args) {
  // 使用 Object.create 直接创建带原型的对象
  const obj = Object.create(constructor.prototype);
  
  // 执行构造函数
  const result = constructor.apply(obj, args);
  
  // 返回对象或新实例
  return result instanceof Object ? result : obj;
}

// ==================== 完整版实现（处理边界情况）====================

function completeNew(constructor, ...args) {
  // 检查 constructor 是否为函数
  if (typeof constructor !== 'function') {
    throw new TypeError('constructor must be a function');
  }
  
  // 创建新对象，原型指向构造函数的 prototype
  const obj = Object.create(constructor.prototype);
  
  // 执行构造函数，绑定 this 到新对象
  const result = constructor.apply(obj, args);
  
  // 如果构造函数返回对象类型，就返回该对象
  // 否则返回新创建的对象
  return (result !== null && typeof result === 'object') || typeof result === 'function' 
    ? result 
    : obj;
}

// ==================== 测试用例 ====================

console.log('=== 测试手写 new 实现 ===');

// 1. 基本构造函数测试
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}, ${this.age} years old.`;
};

// 原生 new
const person1 = new Person('Alice', 25);
console.log('原生 new:', person1);
console.log('原生 new 方法调用:', person1.sayHello());

// 手写 myNew
const person2 = myNew(Person, 'Bob', 30);
console.log('手写 myNew:', person2);
console.log('手写 myNew 方法调用:', person2.sayHello());

// 2. 构造函数返回对象的情况
function PersonWithReturn(name) {
  this.name = name;
  
  // 构造函数主动返回一个对象
  return {
    name: name + ' (returned)',
    type: 'custom object'
  };
}

const person3 = new PersonWithReturn('Charlie');
const person4 = myNew(PersonWithReturn, 'Charlie');

console.log('\n构造函数返回对象测试:');
console.log('原生 new:', person3);
console.log('手写 myNew:', person4);

// 3. 构造函数返回基本类型的情况
function PersonWithPrimitiveReturn(name) {
  this.name = name;
  return 'some string'; // 返回基本类型会被忽略
}

const person5 = new PersonWithPrimitiveReturn('David');
const person6 = myNew(PersonWithPrimitiveReturn, 'David');

console.log('\n构造函数返回基本类型测试:');
console.log('原生 new:', person5);
console.log('手写 myNew:', person6);

// 4. 继承测试
function Animal(type) {
  this.type = type;
}

Animal.prototype.getType = function() {
  return this.type;
};

function Dog(name, breed) {
  Animal.call(this, 'Dog');
  this.name = name;
  this.breed = breed;
}

// 设置继承关系
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} says woof!`;
};

const dog1 = new Dog('Buddy', 'Golden Retriever');
const dog2 = myNew(Dog, 'Max', 'Labrador');

console.log('\n继承测试:');
console.log('原生 new:', dog1);
console.log('原生 new 方法:', dog1.bark(), dog1.getType());
console.log('手写 myNew:', dog2);
console.log('手写 myNew 方法:', dog2.bark(), dog2.getType());

// 5. 原型链验证
console.log('\n原型链验证:');
console.log('person2 instanceof Person:', person2 instanceof Person);
console.log('person2.__proto__ === Person.prototype:', person2.__proto__ === Person.prototype);
console.log('dog2 instanceof Dog:', dog2 instanceof Dog);
console.log('dog2 instanceof Animal:', dog2 instanceof Animal);

// ==================== ES6 类的测试 ====================

console.log('\n=== ES6 类测试 ===');

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
  
  getInfo() {
    return `${this.username} - ${this.email}`;
  }
}

const user1 = new User('john', 'john@example.com');
const user2 = myNew(User, 'jane', 'jane@example.com');

console.log('原生 new (ES6类):', user1);
console.log('手写 myNew (ES6类):', user2);
console.log('ES6类方法调用:', user2.getInfo());

// ==================== 性能对比测试 ====================

console.log('\n=== 性能对比 ===');

function SimpleConstructor(value) {
  this.value = value;
}

const iterations = 100000;

// 测试原生 new
console.time('原生 new');
for (let i = 0; i < iterations; i++) {
  new SimpleConstructor(i);
}
console.timeEnd('原生 new');

// 测试手写 myNew
console.time('手写 myNew');
for (let i = 0; i < iterations; i++) {
  myNew(SimpleConstructor, i);
}
console.timeEnd('手写 myNew');

// ==================== 工具函数 ====================

// 检查对象是否由特定构造函数创建
function isInstanceOf(obj, constructor) {
  let proto = Object.getPrototypeOf(obj);
  
  while (proto) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  
  return false;
}

console.log('\n=== 自定义 instanceof 测试 ===');
console.log('isInstanceOf(person2, Person):', isInstanceOf(person2, Person));
console.log('isInstanceOf(dog2, Animal):', isInstanceOf(dog2, Animal));

// 导出函数
module.exports = {
  myNew,
  simpleNew,
  completeNew,
  isInstanceOf
};
