# JavaScript 循环方法面试题总结

> 全面总结 for、for...in、for...of、forEach 等循环方法的八股文知识点

## 目录
1. [核心概念对比](#核心概念对比)
2. [高频面试题](#高频面试题)
3. [性能对比](#性能对比)
4. [实战应用](#实战应用)
5. [常见陷阱](#常见陷阱)

---

## 核心概念对比

### 循环方法速查表

| 循环方法 | 适用对象 | 可中断 | 返回值 | 性能 | 遍历内容 |
|---------|---------|--------|--------|------|---------|
| **for** | 任意 | ✅ (break/continue) | - | ⭐⭐⭐⭐⭐ | 索引/条件 |
| **for...in** | 对象/数组 | ✅ (break/continue) | - | ⭐⭐⭐ | 可枚举属性（含原型链） |
| **for...of** | 可迭代对象 | ✅ (break/continue) | - | ⭐⭐⭐⭐ | 值（不含原型链） |
| **forEach** | 数组 | ❌ | undefined | ⭐⭐⭐ | 值 + 索引 + 数组 |
| **map** | 数组 | ❌ | 新数组 | ⭐⭐ | 值 + 索引 + 数组 |
| **filter** | 数组 | ❌ | 新数组 | ⭐⭐ | 值 + 索引 + 数组 |
| **reduce** | 数组 | ❌ | 累积值 | ⭐⭐ | 值 + 索引 + 数组 |

### 详细对比

#### 1. for 循环
```javascript
// 最基础、性能最好的循环
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// 特点：
// ✅ 性能最优
// ✅ 可以 break/continue
// ✅ 可以访问索引
// ✅ 适用于任何场景
// ❌ 语法相对繁琐
```

#### 2. for...in 循环
```javascript
// 遍历对象的可枚举属性（包括原型链）
const obj = { a: 1, b: 2, c: 3 };
for (let key in obj) {
    console.log(key, obj[key]);
}

// 特点：
// ✅ 专门用于遍历对象属性
// ✅ 可以 break/continue
// ⚠️ 会遍历原型链上的可枚举属性
// ⚠️ 遍历顺序不保证
// ❌ 不推荐用于数组（会遍历到额外属性）
```

#### 3. for...of 循环
```javascript
// 遍历可迭代对象的值（ES6）
const arr = [1, 2, 3];
for (let value of arr) {
    console.log(value);
}

// 特点：
// ✅ 语法简洁
// ✅ 可以 break/continue
// ✅ 不会遍历原型链
// ✅ 适用于数组、字符串、Set、Map 等
// ❌ 不能直接获取索引
// ❌ 不适用于普通对象
```

#### 4. forEach 方法
```javascript
// 数组的高阶函数方法
arr.forEach((item, index, array) => {
    console.log(item, index);
});

// 特点：
// ✅ 语法简洁，函数式风格
// ✅ 自动传入 item、index、array
// ❌ 不能 break/continue（无法中断）
// ❌ 性能比 for 循环差
// ❌ 不能使用 return 跳过迭代
```

---

## 高频面试题

### Q1: for...in 和 for...of 的区别？⭐⭐⭐⭐⭐

**答案要点：**

1. **遍历对象不同**
   - `for...in`：遍历对象的**可枚举属性**（键名）
   - `for...of`：遍历**可迭代对象**的值

2. **原型链处理**
   - `for...in`：会遍历原型链上的可枚举属性
   - `for...of`：只遍历自身的值，不涉及原型链

3. **适用场景**
   - `for...in`：遍历对象属性
   - `for...of`：遍历数组、Set、Map、字符串等

**代码示例：**

```javascript
// 1. 遍历数组
const arr = ['a', 'b', 'c'];

// for...in 遍历索引（键名）
for (let key in arr) {
    console.log(key);  // '0', '1', '2' (字符串类型)
}

// for...of 遍历值
for (let value of arr) {
    console.log(value);  // 'a', 'b', 'c'
}

// 2. 遍历对象
const obj = { name: '张三', age: 25 };

// for...in 可以遍历对象
for (let key in obj) {
    console.log(key, obj[key]);  // 'name' '张三', 'age' 25
}

// for...of 不能直接遍历普通对象
// for (let value of obj) {}  // ❌ TypeError: obj is not iterable

// 需要使用 Object.keys/values/entries
for (let [key, value] of Object.entries(obj)) {
    console.log(key, value);  // ✅
}

// 3. 原型链问题
Array.prototype.customProp = 'custom';

const arr2 = [1, 2, 3];

// for...in 会遍历到原型链上的属性
for (let key in arr2) {
    console.log(key);  // '0', '1', '2', 'customProp' ⚠️
}

// for...of 不会遍历原型链
for (let value of arr2) {
    console.log(value);  // 1, 2, 3 ✅
}

// 解决方案：使用 hasOwnProperty
for (let key in arr2) {
    if (arr2.hasOwnProperty(key)) {
        console.log(key);  // '0', '1', '2' ✅
    }
}
```

**记忆口诀：**
- `for...in` 遍历 **in**dex（索引/键名），包括原型
- `for...of` 遍历 **of** value（值），不含原型

---

### Q2: forEach 和 for 循环的区别？⭐⭐⭐⭐⭐

**答案要点：**

1. **性能差异**
   - `for` 循环：性能最优（无函数调用开销）
   - `forEach`：每次迭代都有函数调用开销，性能较差

2. **中断能力**
   - `for` 循环：可以使用 `break`、`continue`、`return`
   - `forEach`：无法中断，必须遍历完整个数组

3. **this 绑定**
   - `for` 循环：无 this 问题
   - `forEach`：回调函数的 this 需要注意（可通过第二个参数指定）

4. **异步处理**
   - `for` 循环：可以正常使用 `await`
   - `forEach`：不能正确处理 `await`（回调函数是同步调用的）

**代码示例：**

```javascript
// 1. 性能对比
const arr = Array.from({ length: 1000000 }, (_, i) => i);

// for 循环：~2-5ms
console.time('for');
let sum1 = 0;
for (let i = 0; i < arr.length; i++) {
    sum1 += arr[i];
}
console.timeEnd('for');

// forEach：~8-15ms（慢 3-5 倍）
console.time('forEach');
let sum2 = 0;
arr.forEach(item => {
    sum2 += item;
});
console.timeEnd('forEach');

// 2. 中断能力
const arr2 = [1, 2, 3, 4, 5];

// for 循环可以中断
for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] === 3) break;  // ✅ 可以提前退出
    console.log(arr2[i]);  // 1, 2
}

// forEach 无法中断
arr2.forEach(item => {
    if (item === 3) return;  // ⚠️ 只是跳过当前迭代，不是退出循环
    console.log(item);  // 1, 2, 4, 5
});

// 3. 异步处理
const urls = ['url1', 'url2', 'url3'];

// ✅ for 循环可以正确处理 await（串行）
async function fetchWithFor() {
    for (let i = 0; i < urls.length; i++) {
        const data = await fetch(urls[i]);  // 等待每个请求完成
        console.log(data);
    }
}

// ❌ forEach 不能正确处理 await（并行但不等待）
async function fetchWithForEach() {
    urls.forEach(async (url) => {
        const data = await fetch(url);  // 不会等待
        console.log(data);
    });
    // 函数会立即返回，不等待请求完成
}

// ✅ 正确的异步处理方式
async function fetchCorrectly() {
    // 方式1：使用 for...of
    for (const url of urls) {
        const data = await fetch(url);
        console.log(data);
    }
    
    // 方式2：使用 Promise.all（并行）
    const promises = urls.map(url => fetch(url));
    const results = await Promise.all(promises);
    results.forEach(data => console.log(data));
}

// 4. this 绑定
class Counter {
    constructor() {
        this.count = 0;
    }
    
    // forEach 的 this 问题
    countWithForEach(arr) {
        // ❌ 箭头函数外的 this
        arr.forEach(function(item) {
            this.count += item;  // TypeError: Cannot read property 'count' of undefined
        });
        
        // ✅ 解决方案1：箭头函数
        arr.forEach(item => {
            this.count += item;  // 正确
        });
        
        // ✅ 解决方案2：bind
        arr.forEach(function(item) {
            this.count += item;
        }.bind(this));
        
        // ✅ 解决方案3：forEach 的第二个参数
        arr.forEach(function(item) {
            this.count += item;
        }, this);
    }
    
    // for 循环没有 this 问题
    countWithFor(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.count += arr[i];  // ✅ 正常工作
        }
    }
}
```

**性能差异原因：**
1. **函数调用开销**：forEach 每次迭代都要调用回调函数
2. **引擎优化**：for 循环更容易被 V8 引擎优化
3. **内存分配**：forEach 可能涉及闭包和执行上下文创建

---

### Q3: 为什么不推荐用 for...in 遍历数组？⭐⭐⭐⭐

**答案要点：**

1. **会遍历原型链上的属性**
2. **遍历顺序不保证**
3. **索引是字符串类型**
4. **性能较差**

**代码示例：**

```javascript
const arr = [10, 20, 30];

// 问题1：会遍历原型链上的属性
Array.prototype.customMethod = function() {};
Array.prototype.customProp = 'custom';

for (let key in arr) {
    console.log(key);  
    // '0', '1', '2', 'customMethod', 'customProp' ⚠️
}

// 解决方案：使用 hasOwnProperty
for (let key in arr) {
    if (arr.hasOwnProperty(key)) {
        console.log(key);  // '0', '1', '2' ✅
    }
}

// 问题2：索引是字符串类型
for (let index in arr) {
    console.log(typeof index);  // 'string' ⚠️
    console.log(index + 1);     // '01', '11', '21' ❌ 字符串拼接
    console.log(Number(index) + 1);  // 1, 2, 3 ✅
}

// 问题3：可能遍历到数组的额外属性
arr.customProp = 'extra';
for (let key in arr) {
    console.log(key);  // '0', '1', '2', 'customProp' ⚠️
}

// 推荐方案：
// 1. 使用 for 循环
for (let i = 0; i < arr.length; i++) {
    console.log(i, arr[i]);  // ✅
}

// 2. 使用 for...of
for (let value of arr) {
    console.log(value);  // ✅
}

// 3. 使用 forEach
arr.forEach((value, index) => {
    console.log(index, value);  // ✅
});
```

**记忆口诀：**
- `for...in` 是为对象设计的
- 数组用 `for`、`for...of`、`forEach`

---

### Q4: 如何选择合适的循环方法？⭐⭐⭐⭐⭐

**决策树：**

```
需要遍历什么？
├─ 数组
│  ├─ 需要最高性能？ → for 循环
│  ├─ 需要提前退出？ → for 或 for...of
│  ├─ 需要异步处理？ → for 或 for...of + await
│  ├─ 需要返回新数组？ → map
│  ├─ 需要过滤数据？ → filter
│  ├─ 需要累积计算？ → reduce
│  └─ 代码可读性优先？ → forEach
│
├─ 对象
│  ├─ 遍历自身属性？ → Object.keys/values/entries + forEach
│  ├─ 遍历所有属性（含原型）？ → for...in + hasOwnProperty
│  └─ 转换为数组遍历？ → Object.entries + for...of
│
├─ Set/Map
│  ├─ 遍历值？ → for...of
│  └─ 需要索引？ → Array.from + forEach
│
└─ 字符串
   └─ 遍历字符？ → for...of
```

**代码示例：**

```javascript
// 1. 性能敏感场景 → for 循环
function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// 2. 需要提前退出 → for 或 for...of
function findFirstEven(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) {
            return i;  // ✅ 找到后立即返回
        }
    }
    return -1;
}

// 或使用 for...of
function findFirstEven2(arr) {
    for (const num of arr) {
        if (num % 2 === 0) {
            return num;  // ✅
        }
    }
    return null;
}

// 3. 异步处理 → for 或 for...of
async function fetchSequentially(urls) {
    const results = [];
    for (const url of urls) {
        const data = await fetch(url);  // ✅ 串行执行
        results.push(data);
    }
    return results;
}

// 4. 数据转换 → map
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);  // [2, 4, 6, 8, 10]

// 5. 数据过滤 → filter
const evens = numbers.filter(x => x % 2 === 0);  // [2, 4]

// 6. 累积计算 → reduce
const sum = numbers.reduce((acc, curr) => acc + curr, 0);  // 15

// 7. 代码可读性优先 → forEach
users.forEach(user => {
    console.log(`User: ${user.name}`);
    updateUI(user);
    sendAnalytics(user);
});

// 8. 遍历对象 → Object.entries + for...of
const obj = { name: '张三', age: 25, city: '北京' };

for (const [key, value] of Object.entries(obj)) {
    console.log(`${key}: ${value}`);
}

// 9. 遍历 Set → for...of
const set = new Set([1, 2, 3, 4, 5]);
for (const value of set) {
    console.log(value);
}

// 10. 遍历 Map → for...of
const map = new Map([
    ['name', '张三'],
    ['age', 25]
]);

for (const [key, value] of map) {
    console.log(`${key}: ${value}`);
}
```

---

### Q5: forEach 能用 break 或 return 中断吗？⭐⭐⭐⭐

**答案：不能！**

**原因：**
- `forEach` 的回调函数中的 `return` 只是退出当前回调，不是退出整个循环
- `break` 和 `continue` 只能用在循环语句中，不能用在函数中

**代码示例：**

```javascript
const arr = [1, 2, 3, 4, 5];

// ❌ return 不能中断 forEach
arr.forEach(item => {
    if (item === 3) {
        return;  // 只是跳过当前迭代，继续下一个
    }
    console.log(item);  // 1, 2, 4, 5
});

// ❌ break 会报错
arr.forEach(item => {
    if (item === 3) {
        break;  // ❌ SyntaxError: Illegal break statement
    }
    console.log(item);
});

// ✅ 如果需要中断，使用 for 循环
for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 3) {
        break;  // ✅ 正确退出
    }
    console.log(arr[i]);  // 1, 2
}

// ✅ 或使用 for...of
for (const item of arr) {
    if (item === 3) {
        break;  // ✅ 正确退出
    }
    console.log(item);  // 1, 2
}

// ✅ 或使用 some/every（变通方法）
arr.some(item => {
    if (item === 3) {
        return true;  // 返回 true 会中断 some
    }
    console.log(item);  // 1, 2
    return false;
});

arr.every(item => {
    if (item === 3) {
        return false;  // 返回 false 会中断 every
    }
    console.log(item);  // 1, 2
    return true;
});

// ✅ 或使用 find/findIndex
const found = arr.find(item => {
    console.log(item);  // 1, 2, 3
    return item === 3;  // 找到后自动停止
});
```

**替代方案对比：**

| 需求 | 推荐方法 | 原因 |
|------|---------|------|
| 查找元素 | `find` / `findIndex` | 找到后自动停止 |
| 检查条件 | `some` / `every` | 可以提前返回 |
| 需要中断 | `for` / `for...of` | 支持 break/continue |
| 简单遍历 | `forEach` | 语法简洁 |

---

### Q6: 如何遍历对象的所有属性？⭐⭐⭐⭐

**答案：根据需求选择不同方法**

**代码示例：**

```javascript
const obj = {
    name: '张三',
    age: 25
};

// 添加不可枚举属性
Object.defineProperty(obj, 'password', {
    value: 'secret',
    enumerable: false
});

// 添加 Symbol 属性
const symKey = Symbol('id');
obj[symKey] = 123;

// 添加原型属性
Object.setPrototypeOf(obj, { inherited: 'parent' });

// 方法1：for...in（可枚举属性 + 原型链）
console.log('=== for...in ===');
for (let key in obj) {
    console.log(key, obj[key]);
    // 'name' '张三'
    // 'age' 25
    // 'inherited' 'parent' ⚠️ 包含原型属性
}

// 方法2：for...in + hasOwnProperty（只有自身可枚举属性）
console.log('=== for...in + hasOwnProperty ===');
for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
        console.log(key, obj[key]);
        // 'name' '张三'
        // 'age' 25
    }
}

// 方法3：Object.keys（自身可枚举属性）
console.log('=== Object.keys ===');
Object.keys(obj).forEach(key => {
    console.log(key, obj[key]);
    // 'name' '张三'
    // 'age' 25
});

// 方法4：Object.values（自身可枚举属性的值）
console.log('=== Object.values ===');
Object.values(obj).forEach(value => {
    console.log(value);
    // '张三'
    // 25
});

// 方法5：Object.entries（自身可枚举属性的键值对）
console.log('=== Object.entries ===');
for (const [key, value] of Object.entries(obj)) {
    console.log(key, value);
    // 'name' '张三'
    // 'age' 25
}

// 方法6：Object.getOwnPropertyNames（自身所有属性，包括不可枚举）
console.log('=== Object.getOwnPropertyNames ===');
Object.getOwnPropertyNames(obj).forEach(key => {
    console.log(key, obj[key]);
    // 'name' '张三'
    // 'age' 25
    // 'password' 'secret' ✅ 包含不可枚举
});

// 方法7：Object.getOwnPropertySymbols（自身 Symbol 属性）
console.log('=== Object.getOwnPropertySymbols ===');
Object.getOwnPropertySymbols(obj).forEach(key => {
    console.log(key, obj[key]);
    // Symbol(id) 123
});

// 方法8：Reflect.ownKeys（自身所有属性，包括 Symbol）
console.log('=== Reflect.ownKeys ===');
Reflect.ownKeys(obj).forEach(key => {
    console.log(key, obj[key]);
    // 'name' '张三'
    // 'age' 25
    // 'password' 'secret'
    // Symbol(id) 123
});
```

**对比表格：**

| 方法 | 可枚举 | 不可枚举 | Symbol | 原型链 |
|------|-------|---------|--------|--------|
| `for...in` | ✅ | ❌ | ❌ | ✅ |
| `Object.keys()` | ✅ | ❌ | ❌ | ❌ |
| `Object.values()` | ✅ | ❌ | ❌ | ❌ |
| `Object.entries()` | ✅ | ❌ | ❌ | ❌ |
| `Object.getOwnPropertyNames()` | ✅ | ✅ | ❌ | ❌ |
| `Object.getOwnPropertySymbols()` | ✅ | ✅ | ✅ | ❌ |
| `Reflect.ownKeys()` | ✅ | ✅ | ✅ | ❌ |

---

## 性能对比

### 性能测试结果

**测试环境：** 100万元素数组

| 循环方法 | 平均时间 | 性能等级 | 相对速度 |
|---------|---------|---------|---------|
| for | 2-5ms | ⭐⭐⭐⭐⭐ | 1x (基准) |
| for...of | 5-8ms | ⭐⭐⭐⭐ | 2x |
| forEach | 8-15ms | ⭐⭐⭐ | 3-5x |
| map | 15-25ms | ⭐⭐ | 5-8x |
| filter | 15-25ms | ⭐⭐ | 5-8x |
| reduce | 10-20ms | ⭐⭐ | 4-6x |

### 性能优化技巧

```javascript
const arr = Array.from({ length: 1000000 }, (_, i) => i);

// ❌ 低效：每次循环都计算 length
for (let i = 0; i < arr.length; i++) {
    // ...
}

// ✅ 高效：缓存 length
for (let i = 0, len = arr.length; i < len; i++) {
    // ...
}

// ✅ 更高效：倒序循环（比较操作更快）
for (let i = arr.length - 1; i >= 0; i--) {
    // ...
}

// ❌ 低效：链式调用多次遍历
const result = arr
    .filter(x => x > 0)
    .map(x => x * 2)
    .reduce((sum, x) => sum + x, 0);

// ✅ 高效：一次遍历完成
let result2 = 0;
for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 0) {
        result2 += arr[i] * 2;
    }
}
```

### 性能选择建议

**小数组（< 1000 元素）：**
- 性能差异不明显
- 优先考虑代码可读性
- 推荐：`forEach`、`map`、`filter`

**中等数组（1000-10000 元素）：**
- 性能开始有差异
- 平衡性能和可读性
- 推荐：`for...of`、`forEach`

**大数组（> 10000 元素）：**
- 性能差异明显
- 优先考虑性能
- 推荐：`for` 循环

**性能敏感场景：**
- 实时计算、游戏循环、大数据处理
- 必须使用：`for` 循环

---

## 实战应用

### 场景1：数组去重

```javascript
const arr = [1, 2, 2, 3, 3, 3, 4, 5];

// 方法1：使用 Set（最快）
const unique1 = [...new Set(arr)];

// 方法2：使用 filter + indexOf
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);

// 方法3：使用 reduce
const unique3 = arr.reduce((acc, curr) => {
    if (!acc.includes(curr)) {
        acc.push(curr);
    }
    return acc;
}, []);

// 方法4：使用 for 循环 + Set（性能最优）
function uniqueWithFor(arr) {
    const seen = new Set();
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (!seen.has(arr[i])) {
            seen.add(arr[i]);
            result.push(arr[i]);
        }
    }
    return result;
}

// 性能排序：方法4 > 方法1 > 方法3 > 方法2
```

### 场景2：查找元素

```javascript
const users = [
    { id: 1, name: '张三', age: 25 },
    { id: 2, name: '李四', age: 30 },
    { id: 3, name: '王五', age: 28 }
];

// 1. 查找单个元素
const user = users.find(u => u.id === 2);

// 2. 查找索引
const index = users.findIndex(u => u.name === '李四');

// 3. 检查是否存在
const exists = users.some(u => u.age > 25);

// 4. 检查是否全部满足
const allAdults = users.every(u => u.age >= 18);

// 5. 使用 for 循环（性能最优）
function findById(users, id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return users[i];  // 找到后立即返回
        }
    }
    return null;
}
```

### 场景3：数据转换

```javascript
const products = [
    { id: 1, name: '商品A', price: 100 },
    { id: 2, name: '商品B', price: 200 },
    { id: 3, name: '商品C', price: 150 }
];

// 1. 转换为 Map（按 id 索引）
const productMap = new Map(
    products.map(p => [p.id, p])
);

// 2. 分组
const grouped = products.reduce((acc, product) => {
    const priceRange = product.price < 150 ? 'cheap' : 'expensive';
    if (!acc[priceRange]) {
        acc[priceRange] = [];
    }
    acc[priceRange].push(product);
    return acc;
}, {});

// 3. 计算总价
const total = products.reduce((sum, p) => sum + p.price, 0);

// 4. 使用 for 循环（性能最优）
function groupByPrice(products) {
    const result = { cheap: [], expensive: [] };
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        if (product.price < 150) {
            result.cheap.push(product);
        } else {
            result.expensive.push(product);
        }
    }
    return result;
}
```

### 场景4：异步处理

```javascript
const urls = [
    'https://api.example.com/user/1',
    'https://api.example.com/user/2',
    'https://api.example.com/user/3'
];

// ❌ 错误：forEach 不能正确处理 async
async function fetchWrong() {
    urls.forEach(async (url) => {
        const data = await fetch(url);  // 不会等待
        console.log(data);
    });
    console.log('Done');  // 会先打印这个
}

// ✅ 正确：串行执行（一个接一个）
async function fetchSerial() {
    for (const url of urls) {
        const data = await fetch(url);  // 等待每个请求
        console.log(data);
    }
    console.log('Done');  // 最后打印
}

// ✅ 正确：并行执行（同时发起）
async function fetchParallel() {
    const promises = urls.map(url => fetch(url));
    const results = await Promise.all(promises);
    results.forEach(data => console.log(data));
    console.log('Done');
}

// ✅ 正确：并行但限制并发数
async function fetchWithLimit(urls, limit = 2) {
    const results = [];
    for (let i = 0; i < urls.length; i += limit) {
        const batch = urls.slice(i, i + limit);
        const batchResults = await Promise.all(
            batch.map(url => fetch(url))
        );
        results.push(...batchResults);
    }
    return results;
}
```

---

## 常见陷阱

### 陷阱1：for...in 遍历数组

```javascript
const arr = [10, 20, 30];
arr.customProp = 'extra';

// ❌ 错误：会遍历到额外属性
for (let key in arr) {
    console.log(key);  // '0', '1', '2', 'customProp'
}

// ✅ 正确：使用 for...of
for (let value of arr) {
    console.log(value);  // 10, 20, 30
}
```

### 陷阱2：forEach 中的 this

```javascript
const obj = {
    name: 'test',
    values: [1, 2, 3],
    
    // ❌ 错误：this 指向不对
    printWrong() {
        this.values.forEach(function(value) {
            console.log(this.name, value);  // undefined
        });
    },
    
    // ✅ 正确：使用箭头函数
    printCorrect1() {
        this.values.forEach(value => {
            console.log(this.name, value);  // 'test' 1, 'test' 2, ...
        });
    },
    
    // ✅ 正确：使用 bind
    printCorrect2() {
        this.values.forEach(function(value) {
            console.log(this.name, value);
        }.bind(this));
    },
    
    // ✅ 正确：forEach 的第二个参数
    printCorrect3() {
        this.values.forEach(function(value) {
            console.log(this.name, value);
        }, this);
    }
};
```

### 陷阱3：循环中的闭包

```javascript
// ❌ 错误：var 的作用域问题
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);  // 3, 3, 3
    }, 100);
}

// ✅ 正确：使用 let
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);  // 0, 1, 2
    }, 100);
}

// ✅ 正确：使用 IIFE
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(() => {
            console.log(j);  // 0, 1, 2
        }, 100);
    })(i);
}

// ✅ 正确：使用 forEach
[0, 1, 2].forEach(i => {
    setTimeout(() => {
        console.log(i);  // 0, 1, 2
    }, 100);
});
```

### 陷阱4：修改正在遍历的数组

```javascript
const arr = [1, 2, 3, 4, 5];

// ❌ 危险：遍历时删除元素
for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
        arr.splice(i, 1);  // 会跳过元素
    }
}

// ✅ 正确：倒序遍历
for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] % 2 === 0) {
        arr.splice(i, 1);
    }
}

// ✅ 更好：使用 filter（不修改原数组）
const filtered = arr.filter(x => x % 2 !== 0);
```

### 陷阱5：对象遍历顺序

```javascript
const obj = {
    '3': 'three',
    '1': 'one',
    'b': 'B',
    '2': 'two',
    'a': 'A'
};

// 遍历顺序：数字键（升序） → 字符串键（插入顺序）
for (let key in obj) {
    console.log(key);
    // '1', '2', '3', 'b', 'a'
}

// 如果需要保证顺序，使用 Map
const map = new Map([
    ['3', 'three'],
    ['1', 'one'],
    ['b', 'B'],
    ['2', 'two'],
    ['a', 'A']
]);

for (let [key, value] of map) {
    console.log(key);
    // '3', '1', 'b', '2', 'a' (插入顺序)
}
```

---

## 总结

### 快速记忆

**循环方法选择口诀：**
```
性能第一选 for
对象遍历 for...in
数组遍历 for...of
函数式用 forEach
转换用 map
过滤用 filter
累积用 reduce
```

**关键区别：**
1. **for** = 最快，最灵活，可中断
2. **for...in** = 遍历键名，含原型链，用于对象
3. **for...of** = 遍历值，不含原型链，用于数组
4. **forEach** = 函数式，不可中断，不能 await

### 面试高频考点

⭐⭐⭐⭐⭐ **必考：**
- for...in 和 for...of 的区别
- forEach 和 for 的区别
- 为什么不推荐用 for...in 遍历数组

⭐⭐⭐⭐ **常考：**
- 如何选择合适的循环方法
- forEach 能用 break 吗
- 循环中的异步处理

⭐⭐⭐ **可能考：**
- 循环性能对比
- 如何遍历对象的所有属性
- 循环中的常见陷阱

### 最佳实践

1. **性能敏感场景**：使用 `for` 循环
2. **代码可读性优先**：使用 `forEach`、`map`、`filter`
3. **需要提前退出**：使用 `for` 或 `for...of`
4. **异步处理**：使用 `for...of` + `await`
5. **遍历对象**：使用 `Object.entries` + `for...of`
6. **避免陷阱**：
   - 不用 `for...in` 遍历数组
   - `forEach` 中注意 `this` 绑定
   - 循环中使用 `let` 而不是 `var`
   - 不在遍历时修改数组

---

**最后更新：2025-10-09**
