# JavaScript 数组操作指南

## 目录
1. [数组创建](#数组创建)
2. [添加元素](#添加元素)
3. [删除元素](#删除元素)
4. [查找元素](#查找元素)
5. [截取与复制](#截取与复制)
6. [数组遍历](#数组遍历)
7. [数组变换](#数组变换)
8. [数组判断](#数组判断)
9. [排序与倒序](#排序与倒序)
10. [常用高级操作](#常用高级操作)

---

## 数组创建

### 1. 字面量创建
```javascript
const arr1 = [1, 2, 3];
const arr2 = []; // 空数组
const arr3 = ['a', 'b', 'c'];
```

### 2. Array 构造函数
```javascript
const arr1 = new Array(); // 空数组 []
const arr2 = new Array(5); // [empty × 5]
const arr3 = new Array(1, 2, 3); // [1, 2, 3]
```

### 3. Array.of()
```javascript
const arr1 = Array.of(); // []
const arr2 = Array.of(7); // [7]
const arr3 = Array.of(1, 2, 3); // [1, 2, 3]
```

### 4. Array.from()
```javascript
// 从类数组对象创建
const arr1 = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
const arr2 = Array.from({length: 5}, (_, i) => i); // [0, 1, 2, 3, 4]

// 从Set/Map创建
const set = new Set([1, 2, 3]);
const arr3 = Array.from(set); // [1, 2, 3]
```

---

## 添加元素

### 1. push() - 末尾添加
```javascript
const arr = [1, 2];
arr.push(3); // [1, 2, 3]
arr.push(4, 5); // [1, 2, 3, 4, 5]
```

### 2. unshift() - 开头添加
```javascript
const arr = [2, 3];
arr.unshift(1); // [1, 2, 3]
arr.unshift(-1, 0); // [-1, 0, 1, 2, 3]
```

### 3. splice() - 任意位置添加
```javascript
const arr = [1, 2, 3];
arr.splice(1, 0, 'a', 'b'); // [1, 'a', 'b', 2, 3]
console.log(arr); // [1, 'a', 'b', 2, 3]

// splice(start, deleteCount, item1, item2, ...)
```

---

## 删除元素

### 1. pop() - 删除最后一个元素
```javascript
const arr = [1, 2, 3];
const removed = arr.pop(); // removed = 3, arr = [1, 2]
```

### 2. shift() - 删除第一个元素
```javascript
const arr = [1, 2, 3];
const removed = arr.shift(); // removed = 1, arr = [2, 3]
```

### 3. splice() - 删除任意位置元素
```javascript
const arr = [1, 2, 3, 4, 5];
arr.splice(1, 2); // 从索引1开始删除2个元素
console.log(arr); // [1, 4, 5]

// 删除开头2个元素
arr.splice(0, 2); // [4, 5]

// 只删除，不添加
arr.splice(-1, 1); // 删除最后一个元素
```

### 4. delete - 删除元素但保留位置
```javascript
const arr = [1, 2, 3, 4];
delete arr[1]; 
console.log(arr); // [1, empty, 3, 4]
console.log(arr.length); // 4 (长度不变)
```

---

## 查找元素

### 1. indexOf() - 查找元素索引
```javascript
const arr = ['a', 'b', 'c', 'b'];
console.log(arr.indexOf('b')); // 1
console.log(arr.indexOf('b', 2)); // 3 (从索引2开始查找)
console.log(arr.indexOf('x')); // -1 (未找到)
```

### 2. lastIndexOf() - 从后往前查找
```javascript
const arr = ['a', 'b', 'c', 'b'];
console.log(arr.lastIndexOf('b')); // 3
console.log(arr.lastIndexOf('b', 2)); // 1
```

### 3. includes() - 判断是否包含
```javascript
const arr = [1, 2, 3];
console.log(arr.includes(2)); // true
console.log(arr.includes(4)); // false
console.log(arr.includes(2, 2)); // false (从索引2开始查找)
```

### 4. find() - 查找符合条件的元素
```javascript
const users = [
    {id: 1, name: 'Alice'},
    {id: 2, name: 'Bob'},
    {id: 3, name: 'Charlie'}
];

const user = users.find(u => u.name === 'Bob'); // {id: 2, name: 'Bob'}
```

### 5. findIndex() - 查找符合条件的元素索引
```javascript
const arr = [1, 2, 3, 4, 5];
const index = arr.findIndex(x => x > 3); // 3
```

---

## 截取与复制

### 1. slice() - 截取数组片段（不修改原数组）
```javascript
const arr = [1, 2, 3, 4, 5];
const subArr = arr.slice(); // [1, 2, 3, 4, 5] (浅拷贝)
const subArr2 = arr.slice(1); // [2, 3, 4, 5]
const subArr3 = arr.slice(1, 3); // [2, 3]
const subArr4 = arr.slice(-2); // [4, 5]
const subArr5 = arr.slice(1, -1); // [2, 3, 4]
```

### 2. copyWithin() - 复制数组内部元素
```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3); // [4, 5, 3, 4, 5] (从索引3开始复制到索引0)

const arr2 = [1, 2, 3, 4, 5];
arr2.copyWithin(2, 0, 2); // [1, 2, 1, 2, 5] (复制索引0-1到索引2)
```

### 3. concat() - 合并数组
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = arr1.concat(arr2); // [1, 2, 3, 4]
const combined2 = arr1.concat([5], [6, 7]); // [1, 2, 5, 6, 7]
```

---

## 数组遍历

### 1. forEach() - 遍历执行函数
```javascript
const arr = [1, 2, 3];
arr.forEach((item, index, array) => {
    console.log(`${index}: ${item}`);
});
// 0: 1
// 1: 2
// 2: 3
```

### 2. map() - 映射变换
```javascript
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2); // [2, 4, 6]
const strings = arr.map(x => `num: ${x}`); // ['num: 1', 'num: 2', 'num: 3']
```

### 3. filter() - 过滤数组
```javascript
const arr = [1, 2, 3, 4, 5, 6];
const evens = arr.filter(x => x % 2 === 0); // [2, 4, 6]
const big = arr.filter(x => x > 3); // [4, 5, 6]
```

### 4. reduce() - 累积计算
```javascript
const arr = [1, 2, 3, 4];
const sum = arr.reduce((acc, curr) => acc + curr, 0); // 10
const product = arr.reduce((acc, curr) => acc * curr, 1); // 24

// 复杂对象累积
const max = arr.reduce((acc, curr) => Math.max(acc, curr)); // 4
```

### 5. reduceRight() - 从右往左累积
```javascript
const arr = ['a', 'b', 'c'];
const reversed = arr.reduceRight((acc, curr) => acc + curr, ''); // 'cba'
```

---

## 数组变换

### 1. flat() - 扁平化数组
```javascript
const arr = [1, [2, 3], [4, [5, 6]]];
console.log(arr.flat()); // [1, 2, 3, 4, [5, 6]]
console.log(arr.flat(2)); // [1, 2, 3, 4, 5, 6]
console.log(arr.flat(Infinity)); // [1, 2, 3, 4, 5, 6]
```

### 2. flatMap() - 映射后扁平化
```javascript
const arr = [1, 2, 3];
const doubled = arr.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

### 3. fill() - 填充数组
```javascript
const arr = new Array(5).fill(0); // [0, 0, 0, 0, 0]
const arr2 = [1, 2, 3, 4, 5];
arr2.fill('*', 1, 4); // [1, '*', '*', '*', 5]
```

### 4. join() - 数组连接字符串
```javascript
const arr = ['a', 'b', 'c'];
console.log(arr.join()); // 'a,b,c'
console.log(arr.join('-')); // 'a-b-c'
console.log(arr.join('')); // 'abc'
```

---

## 数组判断

### 1. every() - 是否所有元素满足条件
```javascript
const arr = [2, 4, 6, 8];
console.log(arr.every(x => x % 2 === 0)); // true
console.log(arr.every(x => x > 5)); // false
```

### 2. some() - 是否有元素满足条件
```javascript
const arr = [1, 3, 5, 6];
console.log(arr.some(x => x % 2 === 0)); // true
console.log(arr.some(x => x > 10)); // false
```

---

## 排序与倒序

### 1. sort() - 数组排序
```javascript
const arr = [3, 1, 4, 1, 5];
arr.sort(); // [1, 1, 3, 4, 5]

// 自定义排序
arr.sort((a, b) => a - b); // 升序
arr.sort((a, b) => b - a); // 降序

// 对象排庯
const users = [
    {name: 'Alice', age: 30},
    {name: 'Bob', age: 25},
    {name: 'Charlie', age: 35}
];
users.sort((a, b) => a.age - b.age); // 按年龄升序排序
```

### 2. reverse() - 数组倒序
```javascript
const arr = [1, 2, 3];
arr.reverse(); // [3, 2, 1]
```

---

## 常用高级操作

### 1. 数组去重
```javascript
const arr = [1, 2, 2, 3, 3, 3];

// 使用Set
const unique1 = [...new Set(arr)]; // [1, 2, 3]

// 使用filter + indexOf
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);

// 使用reduce
const unique3 = arr.reduce((acc, curr) => {
    if (!acc.includes(curr)) acc.push(curr);
    return acc;
}, []);
```

### 2. 数组合并去重
```javascript
const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4];
const merged = [...new Set([...arr1, ...arr2])]; // [1, 2, 3, 4]
```

### 3. 返回随机数组元素
```javascript
const arr = [1, 2, 3, 4, 5];

// 随机选择
const random = arr[Math.floor(Math.random() * arr.length)];

// 随机打乱数组
const shuffled = arr.sort(() => Math.random() - 0.5);

// Fisher-Yates洗牌算法
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
```

### 4. 数组合并或拆分
```javascript
const users = [
    {id: 1, name: 'Alice', skills: ['JS', 'React']},
    {id: 2, name: 'Bob', skills: ['Python', 'Django']},
];

// 展平所有技能
const allSkills = users.flatMap(user => user.skills);
// ['JS', 'React', 'Python', 'Django']

// 按技能分組
const groupBy = users.reduce((acc, user) => {
    user.skills.forEach(skill => {
        if (!acc[skill]) acc[skill] = [];
        acc[skill].push(user.name);
    });
    return acc;
}, {});
```

### 5. 数组比较
```javascript
// 数组内容相同性检查
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// 深度比较
function deepEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}
```

### 6. 数组交集、差集、并集
```javascript
const set1 = new Set([1, 2, 3]);
const set2 = new Set([2, 3, 4]);

// 交集
const intersection = [...set1].filter(x => set2.has(x)); // [2, 3]

// 差集
const difference1 = [...set1].filter(x => !set2.has(x)); // [1]
const difference2 = [...set2].filter(x => !set1.has(x)); // [4]

// 并集
const union = [...new Set([...set1, ...set2])]; // [1, 2, 3, 4]
```

---

## 性能对比

### 循环方法性能排序
| 方法          | 性能等级 | 时间复杂度 | 空间复杂度 | 是否改变原数组 | 可中断 | 用途         |
|--------------|---------|-----------|-----------|-------------|--------|-------------|
| for          | ⭐⭐⭐⭐⭐ | O(n)      | O(1)      | ❓          | ✅     | 高性能遍历   |
| for...of     | ⭐⭐⭐⭐   | O(n)      | O(1)      | ❓          | ✅     | 简洁遍历     |
| forEach      | ⭐⭐⭐     | O(n)      | O(1)      | ❓          | ❌     | 函数式遍历   |
| map          | ⭐⭐       | O(n)      | O(n)      | ❌          | ❌     | 数据转换     |
| filter       | ⭐⭐       | O(n)      | O(n)      | ❌          | ❌     | 数据过滤     |
| reduce       | ⭐⭐       | O(n)      | O(1)      | ❓          | ❌     | 累计计算     |

### 其他方法性能
| 方法          | 时空复杂度     | 是否改变原数组   | 用途         |
|--------------|---------------|--------------- |-------------|
| push/pop     | O(1)          | ✅             | 栈操作       |
| shift/unshift| O(n)          | ✅             | 队列操作      |
| splice       | O(n)          | ✅             | 任意位置增删  |
| slice        | O(k)          | ❌             | 数组截取     |
| concat       | O(n+m)        | ❌             | 数组合并     |
| sort         | O(n log n)    | ✅             | 排序        |

> **性能提示**: 对于大数组操作，优先使用 `for` 循环；对于小数组或可读性优先的场景，可以使用 `forEach`、`map` 等方法。详细性能分析请参考 [循环性能对比文档](../../performance/loop-performance.md)。

---

## 最佳实践

1. **优先使用不变方法**：slice()、map()、filter()等不改变原数组
2. **注意引用类型**：数组方法对引用类型做浅拷贝
3. **性能考虑**：大数组合并时使用concat()优于多次push()
4. **防御性编程**：使用前检查数组是否存在和为空
5. **清晰语义**：根据用途选择最合适的方法
