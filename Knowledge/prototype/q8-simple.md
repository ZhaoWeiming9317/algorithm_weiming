# Q8

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

## 核心答案

**没有 `var/let/const` 的赋值 = 修改全局变量**

---

## 问题代码

```javascript
function Foo() {
  getName = function() {  // ← 没有 var，修改全局
    console.log(1);
  };
  return this;
}

Foo.getName = function() { console.log(2); };
Foo.prototype.getName = function() { console.log(3); };
var getName = function() { console.log(4); };
function getName() { console.log(5); }

// 执行
Foo.getName();           // 2
getName();               // 4
Foo().getName();         // 1 ← 为什么？
getName();               // 1
```

---

## 为什么 `Foo().getName()` 输出 1？

### 3 步理解

```javascript
// 步骤 1: 执行 Foo()
Foo();  // 内部执行了 getName = function() { console.log(1); }

// 步骤 2: 等价于修改全局变量
window.getName = function() { console.log(1); };

// 步骤 3: Foo() 返回 window，调用 window.getName()
window.getName();  // 输出 1
```

### 对比：如果加上 var

```javascript
function Foo() {
  var getName = function() {  // 加上 var
    console.log(1);
  };
  return this;
}

Foo().getName();  // 输出 4（不是 1）
// 因为 var getName 是局部变量，不影响全局
```

---

## 两个知识点

### 1. 没有声明关键字 = 全局变量

```javascript
function test() {
  x = 1;  // 没有 var/let/const
}
test();
console.log(x);  // 1（全局变量）
```

### 2. 变量提升：函数声明 > 函数表达式

```javascript
var getName = function() { console.log(4); };
function getName() { console.log(5); }

// 提升后：
function getName() { console.log(5); }  // 函数声明提升
var getName;                             // 变量声明（被忽略）
getName = function() { console.log(4); }; // 赋值覆盖

// 最终 getName 是打印 4
```

---

## 完整答案

```javascript
// 1. Foo.getName() → 2
// 调用 Foo 的静态方法

// 2. getName() → 4  
// 全局 getName（函数表达式覆盖了函数声明）

// 3. Foo().getName() → 1
// Foo() 修改了全局 getName 为打印 1
// 然后调用 window.getName()

// 4. getName() → 1
// 全局 getName 已被修改

// 5. new Foo.getName() → 2
// new (Foo.getName)()

// 6. new Foo().getName() → 3  
// (new Foo()).getName()
// 调用原型方法

// 7. new new Foo().getName() → 3
// new ((new Foo()).getName)()
```

---

## 这道题的 5 个坑

### 坑 1：没有 var/let/const = 修改全局变量 ⭐⭐⭐⭐⭐

```javascript
function Foo() {
  getName = function() { console.log(1); };  // 修改全局
}
```

### 坑 2：函数声明被函数表达式覆盖 ⭐⭐⭐⭐

```javascript
var getName = function() { console.log(4); };  // 后执行，覆盖
function getName() { console.log(5); }         // 先提升
```

### 坑 3：this 指向 window（非严格模式） ⭐⭐⭐

```javascript
function Foo() {
  return this;  // 普通调用时，this 指向 window
}

Foo();  // 返回 window
```

**如果是严格模式：**
```javascript
'use strict';
function Foo() {
  return this;  // 严格模式下，this 是 undefined
}

Foo();  // 返回 undefined
Foo().getName();  // ❌ TypeError: Cannot read property 'getName' of undefined
```

### 坑 4：静态方法 vs 原型方法 ⭐⭐⭐

```javascript
// 静态方法（在构造函数上）
Foo.getName = function() { console.log(2); };

// 原型方法（在原型上）
Foo.prototype.getName = function() { console.log(3); };

// 区别：
Foo.getName();        // 2 - 调用静态方法
new Foo().getName();  // 3 - 调用原型方法
```

### 坑 5：运算符优先级 ⭐⭐⭐⭐

```javascript
// new Foo.getName()
// 优先级：. > new
// 等价于：new (Foo.getName)()
// 先访问 Foo.getName，再作为构造函数

// new Foo().getName()
// 优先级：new() > .
// 等价于：(new Foo()).getName()
// 先创建实例，再访问方法
```

---

## 额外的坑：如果改成箭头函数呢？

```javascript
// 如果 Foo 是箭头函数
const Foo = () => {
  getName = function() { console.log(1); };
  return this;
};

Foo().getName();  // ❌ TypeError
// 箭头函数的 this 继承自外层，不是 window
// 且箭头函数不能用 new 调用

new Foo();  // ❌ TypeError: Foo is not a constructor
```

---

## 如果在严格模式下？

```javascript
'use strict';

function Foo() {
  getName = function() { console.log(1); };  // ❌ ReferenceError
  // 严格模式下，没有声明的变量赋值会报错
  return this;
}

Foo().getName();  // 报错，无法执行
```

---

## 如果 getName 是 const？

```javascript
const getName = function() { console.log(4); };
function getName() { console.log(5); }  // ❌ SyntaxError

// const 不允许重复声明
// 会在编译阶段就报错
```

---

## 如果在 Foo 内部用 let？

```javascript
function Foo() {
  let getName = function() { console.log(1); };  // 局部变量
  return this;
}

Foo().getName();  // 输出 4（不是 1）
// let getName 是局部变量，不影响全局
```

---

## 总结：这道题的所有坑

| 坑 | 说明 | 重要度 |
|---|------|--------|
| **没有声明关键字** | 修改全局变量 | ⭐⭐⭐⭐⭐ |
| **函数声明 vs 表达式** | 提升优先级不同 | ⭐⭐⭐⭐ |
| **this 指向** | 普通调用指向 window | ⭐⭐⭐ |
| **静态方法 vs 原型方法** | 访问方式不同 | ⭐⭐⭐ |
| **运算符优先级** | new 和 . 的优先级 | ⭐⭐⭐⭐ |
| **严格模式** | 行为完全不同 | ⭐⭐⭐ |
| **箭头函数** | 不能用 new，this 不同 | ⭐⭐ |
| **const/let** | 不允许重复声明 | ⭐⭐ |

---

## 记住核心

**在函数内部，没有 `var/let/const` 的赋值会修改全局变量！**

```javascript
// ❌ 危险
function foo() {
  x = 1;  // 修改全局
}

// ✅ 安全
function foo() {
  const x = 1;  // 局部变量
}

// ✅ 或使用严格模式
'use strict';
function foo() {
  x = 1;  // ReferenceError
}
```
