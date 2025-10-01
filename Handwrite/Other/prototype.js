/**
 * 原型链原理详解
 * 根据图解说明 __proto__ 和 prototype 的区别
 */

// ==================== 原型链的基本概念 ====================

console.log('=== 原型链基本概念 ===');

/**
 * 关键概念：
 * 1. prototype：函数的属性，指向一个对象（原型对象）
 * 2. __proto__：所有对象的属性，指向创建该对象的构造函数的 prototype
 * 3. [p] 在图中表示 __proto__ 链接
 */

// ==================== 图解分析 ====================

console.log('\n=== 图解原型链 ===');

// 根据图中的层次结构：

// 1. 最顶层：null
console.log('1. 原型链的终点：');
console.log('Object.prototype.__proto__ ===', Object.prototype.__proto__); // null

// 2. No.1 层：Object.prototype（对象的祖先）
console.log('\n2. 对象的祖先 - Object.prototype：');
console.log('Object.prototype：', Object.prototype);

// 3. No.2 层：Function.prototype（函数的祖先）
console.log('\n3. 函数的祖先 - Function.prototype：');
console.log('Function.prototype：', Function.prototype);
console.log('Function.prototype.__proto__ === Object.prototype：', 
  Function.prototype.__proto__ === Object.prototype); // true

// 4. 底层：各种类型（String, Number, Boolean, Array）
console.log('\n4. 各种内置类型：');
console.log('String.prototype.__proto__ === Object.prototype：', 
  String.prototype.__proto__ === Object.prototype);
console.log('Array.prototype.__proto__ === Object.prototype：', 
  Array.prototype.__proto__ === Object.prototype);

// ==================== __proto__ vs prototype 的区别 ====================

console.log('\n=== __proto__ vs prototype 的区别 ===');

function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  return `Hello, I'm ${this.name}`;
};

const person = new Person('Alice');

console.log('\n1. prototype（函数才有）：');
console.log('Person.prototype：', Person.prototype);
console.log('person.prototype：', person.prototype); // undefined，实例没有 prototype

console.log('\n2. __proto__（所有对象都有）：');
console.log('person.__proto__：', person.__proto__);
console.log('Person.__proto__：', Person.__proto__);

console.log('\n3. 关键关系：');
console.log('person.__proto__ === Person.prototype：', 
  person.__proto__ === Person.prototype); // true

// ==================== 原型链查找过程 ====================

console.log('\n=== 原型链查找过程 ===');

// 模拟原型链查找
function findProperty(obj, propName) {
  console.log(`\n查找属性 "${propName}"：`);
  
  let current = obj;
  let step = 1;
  
  while (current) {
    console.log(`步骤 ${step}: 在`, current.constructor?.name || 'Object', '中查找');
    
    if (current.hasOwnProperty(propName)) {
      console.log(`✓ 找到了！在 ${current.constructor?.name || 'Object'} 中`);
      return current[propName];
    }
    
    console.log(`✗ 没找到，继续向上查找...`);
    current = current.__proto__;
    step++;
  }
  
  console.log('✗ 查找结束，未找到');
  return undefined;
}

// 测试原型链查找
const arr = [1, 2, 3];
findProperty(arr, 'length');     // 在实例中找到
findProperty(arr, 'push');       // 在 Array.prototype 中找到
findProperty(arr, 'toString');   // 在 Object.prototype 中找到
findProperty(arr, 'notExist');   // 找不到

// ==================== 完整的原型链展示 ====================

console.log('\n=== 完整原型链展示 ===');

function showPrototypeChain(obj, name) {
  console.log(`\n${name} 的原型链：`);
  
  let current = obj;
  let level = 0;
  
  while (current) {
    const indent = '  '.repeat(level);
    const constructorName = current.constructor?.name || 'Object';
    const isPrototype = current === current.constructor?.prototype;
    
    console.log(`${indent}${level}: ${constructorName}${isPrototype ? '.prototype' : ' 实例'}`);
    console.log(`${indent}   值:`, current);
    
    if (current.__proto__) {
      console.log(`${indent}   ↓ [__proto__]`);
    } else {
      console.log(`${indent}   ↓ null (原型链终点)`);
    }
    
    current = current.__proto__;
    level++;
  }
}

// 展示不同对象的原型链
showPrototypeChain(person, 'person');
showPrototypeChain([], 'Array实例');
showPrototypeChain(Person, 'Person函数');

// ==================== 图中 [p] 的含义 ====================

console.log('\n=== 图中 [p] 的含义 ===');

console.log('图中的 [p] 表示 __proto__ 链接：');
console.log('');

// 模拟图中的关系
const relationships = [
  'String.__proto__ → Function.prototype',
  'Number.__proto__ → Function.prototype', 
  'Boolean.__proto__ → Function.prototype',
  'Array.__proto__ → Function.prototype',
  'Function.prototype.__proto__ → Object.prototype',
  'Object.prototype.__proto__ → null'
];

relationships.forEach(rel => console.log(`[p] ${rel}`));

// ==================== 实际验证 ====================

console.log('\n=== 实际验证图中关系 ===');

console.log('String.__proto__ === Function.prototype:', 
  String.__proto__ === Function.prototype);
console.log('Array.__proto__ === Function.prototype:', 
  Array.__proto__ === Function.prototype);
console.log('Function.prototype.__proto__ === Object.prototype:', 
  Function.prototype.__proto__ === Object.prototype);
console.log('Object.prototype.__proto__ === null:', 
  Object.prototype.__proto__ === null);

// ==================== 原型链的实际应用 ====================

console.log('\n=== 原型链的实际应用 ===');

// 1. 继承
function Animal(type) {
  this.type = type;
}

Animal.prototype.eat = function() {
  return `${this.type} is eating`;
};

function Dog(name) {
  Animal.call(this, 'Dog');
  this.name = name;
}

// 设置继承关系
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} is barking`;
};

const dog = new Dog('Buddy');

console.log('\n继承示例：');
console.log('dog.eat():', dog.eat());     // 从 Animal.prototype 继承
console.log('dog.bark():', dog.bark());   // Dog.prototype 的方法
console.log('dog.toString():', dog.toString()); // 从 Object.prototype 继承

// 2. 方法查找顺序
console.log('\n方法查找顺序：');
console.log('1. dog 实例 → 2. Dog.prototype → 3. Animal.prototype → 4. Object.prototype → 5. null');

// ==================== 总结 ====================

console.log('\n=== 总结 ===');
console.log(`
核心区别：
1. prototype：
   - 只有函数才有
   - 指向一个对象（原型对象）
   - 用于实现继承

2. __proto__：
   - 所有对象都有
   - 指向创建该对象的构造函数的 prototype
   - 形成原型链

3. 图中 [p] 就是 __proto__ 链接：
   - 连接对象和它的原型
   - 形成从子到父的查找链条
   - 最终指向 null

原型链的本质：JavaScript 通过 __proto__ 链接实现属性和方法的继承查找机制
`);

// 导出工具函数
module.exports = {
  findProperty,
  showPrototypeChain
};
