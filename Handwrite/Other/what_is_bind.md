# Function.prototype.bind() 详解

## 1. 基本概念

`bind()` 方法创建一个新的函数，在调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

## 2. 语法

```javascript
function.bind(thisArg, arg1, arg2, ...)
```

- `thisArg`: 调用绑定函数时作为 `this` 参数传递给目标函数的值
- `arg1, arg2, ...`: 当目标函数被调用时，预先添加到绑定函数的参数列表中的参数

## 3. 核心特点

### 3.1 返回新函数
```javascript
const obj = {
  name: 'Alice',
  getName: function() {
    return this.name;
  }
};

const getName = obj.getName;
console.log(getName()); // undefined (this指向全局)

const boundGetName = obj.getName.bind(obj);
console.log(boundGetName()); // 'Alice' (this指向obj)
```

### 3.2 永久绑定 this
```javascript
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Bob' };

function greet() {
  return `Hello, ${this.name}`;
}

const boundGreet = greet.bind(obj1);
console.log(boundGreet()); // 'Hello, Alice'

// 即使通过其他对象调用，this也不会改变
console.log(boundGreet.call(obj2)); // 'Hello, Alice' (仍然是Alice)
```

### 3.3 参数预设
```javascript
function multiply(a, b, c) {
  return a * b * c;
}

const multiplyByTwo = multiply.bind(null, 2);
console.log(multiplyByTwo(3, 4)); // 24 (2 * 3 * 4)

const multiplyByTwoAndThree = multiply.bind(null, 2, 3);
console.log(multiplyByTwoAndThree(4)); // 24 (2 * 3 * 4)
```

## 4. 手动实现 bind

```javascript
Function.prototype.myBind = function(thisArg, ...args1) {
  const fn = this; // 保存原函数
  
  return function(...args2) {
    // 合并预设参数和调用参数
    const allArgs = args1.concat(args2);
    
    // 调用原函数，绑定this
    return fn.apply(thisArg, allArgs);
  };
};

// 测试
const obj = { name: 'Alice' };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const boundGreet = greet.myBind(obj, 'Hello');
console.log(boundGreet('!')); // 'Hello, Alice!'
```

## 5. bind vs call vs apply 对比

### 5.1 基本区别

| 方法 | 调用时机 | 返回值 | 参数传递 | this绑定 |
|------|----------|--------|----------|----------|
| `call` | 立即调用 | 函数执行结果 | 逐个传递 | 临时绑定 |
| `apply` | 立即调用 | 函数执行结果 | 数组传递 | 临时绑定 |
| `bind` | 延迟调用 | 新函数 | 预设+后续 | 永久绑定 |

### 5.2 代码对比

```javascript
const obj = { name: 'Alice' };

function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

// call: 立即调用，临时绑定this
const result1 = greet.call(obj, 'Hello', '!');
console.log(result1); // 'Hello, Alice!'

// apply: 立即调用，参数用数组传递
const result2 = greet.apply(obj, ['Hi', '?']);
console.log(result2); // 'Hi, Alice?'

// bind: 返回新函数，永久绑定this
const boundGreet = greet.bind(obj, 'Hey');
const result3 = boundGreet('!!!');
console.log(result3); // 'Hey, Alice!!!'
```

### 5.3 使用场景对比

```javascript
// 1. call: 临时改变this，立即执行
const arr1 = [1, 2, 3];
const max1 = Math.max.call(null, ...arr1); // 3

// 2. apply: 临时改变this，参数是数组
const arr2 = [1, 2, 3];
const max2 = Math.max.apply(null, arr2); // 3

// 3. bind: 创建新函数，用于事件处理、回调等
const button = document.getElementById('btn');
const handler = {
  name: 'ButtonHandler',
  handleClick: function(event) {
    console.log(`${this.name} clicked:`, event);
  }
};

// 使用bind绑定this
button.addEventListener('click', handler.handleClick.bind(handler));
```

## 6. 实际应用场景

### 6.1 事件处理
```javascript
class Button {
  constructor(name) {
    this.name = name;
  }
  
  handleClick() {
    console.log(`${this.name} clicked!`);
  }
  
  bindClick(element) {
    // 使用bind确保this指向Button实例
    element.addEventListener('click', this.handleClick.bind(this));
  }
}

const button = new Button('MyButton');
const element = document.getElementById('btn');
button.bindClick(element);
```

### 6.2 回调函数
```javascript
const obj = {
  name: 'Counter',
  count: 0,
  increment: function() {
    this.count++;
    console.log(`${this.name}: ${this.count}`);
  }
};

// 使用bind确保回调函数中的this正确
setTimeout(obj.increment.bind(obj), 1000);
```

### 6.3 函数柯里化
```javascript
function add(a, b, c) {
  return a + b + c;
}

// 使用bind实现柯里化
const addFive = add.bind(null, 5);
const addFiveAndTen = addFive.bind(null, 10);

console.log(addFiveAndTen(3)); // 18 (5 + 10 + 3)
```

## 7. 注意事项

### 7.1 箭头函数无法绑定this
```javascript
const obj = { name: 'Alice' };

const arrowFn = () => this.name;
const regularFn = function() { return this.name; };

// 箭头函数的this无法被bind改变
console.log(arrowFn.bind(obj)()); // undefined
console.log(regularFn.bind(obj)()); // 'Alice'
```

### 7.2 构造函数绑定
```javascript
function Person(name) {
  this.name = name;
}

const obj = {};
const BoundPerson = Person.bind(obj);

const person = new BoundPerson('Alice');
console.log(person.name); // 'Alice'
console.log(obj.name); // undefined (new操作符会忽略bind的this)
```

## 8. 面试要点

1. **bind返回新函数**，不立即执行
2. **永久绑定this**，无法再次改变
3. **支持参数预设**，实现函数柯里化
4. **常用于事件处理**和回调函数
5. **与call/apply的区别**：延迟调用 vs 立即调用

**记忆技巧：bind = 绑定 + 延迟 + 预设参数**
