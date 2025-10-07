# JavaScript 性能优化相关问题集

## 目录
1. [循环性能问题](#循环性能问题)
2. [数组操作性能问题](#数组操作性能问题)
3. [对象操作性能问题](#对象操作性能问题)
4. [DOM 操作性能问题](#dom-操作性能问题)
5. [异步操作性能问题](#异步操作性能问题)
6. [内存管理性能问题](#内存管理性能问题)
7. [算法复杂度问题](#算法复杂度问题)

---

## 循环性能问题

### 1. 基础循环性能对比
**Q: for 循环、while 循环、do-while 循环哪个性能最好？**

**A:** 性能排序：for ≈ while > do-while
- `for` 和 `while` 性能基本相同
- `do-while` 稍慢，因为需要额外的条件检查
- 选择原则：根据代码可读性和逻辑需求选择

### 2. 循环优化技巧
**Q: 如何优化循环性能？**

**A:** 优化技巧：
```javascript
// ❌ 低效
for (let i = 0; i < arr.length; i++) {
    // 每次循环都计算 arr.length
}

// ✅ 高效
for (let i = 0, len = arr.length; i < len; i++) {
    // 缓存长度
}

// ✅ 更高效（倒序）
for (let i = arr.length - 1; i >= 0; i--) {
    // 倒序循环，比较操作更快
}
```

### 3. 循环中断性能
**Q: break、continue、return 在循环中的性能影响？**

**A:** 性能影响：
- `break`：立即退出循环，性能最优
- `continue`：跳过当前迭代，性能良好
- `return`：退出函数，性能良好
- 避免使用 `throw` 进行流程控制

---

## 数组操作性能问题

### 1. 数组方法性能对比
**Q: 数组的 push、unshift、splice 性能如何？**

**A:** 性能排序：push > splice > unshift
```javascript
// O(1) - 最快
arr.push(item);

// O(n) - 中等
arr.splice(index, 0, item);

// O(n) - 最慢（需要移动所有元素）
arr.unshift(item);
```

### 2. 数组查找性能
**Q: indexOf、includes、find 哪个查找性能最好？**

**A:** 性能排序：indexOf > includes > find
```javascript
// O(n) - 最快
arr.indexOf(item);

// O(n) - 稍慢
arr.includes(item);

// O(n) - 最慢（需要执行回调函数）
arr.find(x => x === item);
```

### 3. 数组去重性能
**Q: 多种数组去重方法的性能对比？**

**A:** 性能排序：Set > Map > filter + indexOf
```javascript
// O(n) - 最快
const unique1 = [...new Set(arr)];

// O(n) - 稍慢
const unique2 = [...new Map(arr.map(item => [item, item])).values()];

// O(n²) - 最慢
const unique3 = arr.filter((item, index) => arr.indexOf(item) === index);
```

---

## 对象操作性能问题

### 1. 对象属性访问性能
**Q: 点语法和方括号语法访问对象属性的性能差异？**

**A:** 性能差异：
```javascript
// 点语法 - 稍快（编译时优化）
obj.property;

// 方括号语法 - 稍慢（运行时计算）
obj['property'];
obj[variable]; // 动态属性名
```

### 2. 对象遍历性能
**Q: Object.keys、for...in、Object.entries 遍历性能对比？**

**A:** 性能排序：for...in > Object.keys > Object.entries
```javascript
// 最快
for (const key in obj) {
    console.log(key, obj[key]);
}

// 中等
Object.keys(obj).forEach(key => {
    console.log(key, obj[key]);
});

// 最慢
Object.entries(obj).forEach(([key, value]) => {
    console.log(key, value);
});
```

### 3. 对象深拷贝性能
**Q: 深拷贝方法的性能对比？**

**A:** 性能排序：structuredClone > JSON > 递归函数
```javascript
// 最快（现代浏览器）
const cloned = structuredClone(obj);

// 中等（有局限性）
const cloned = JSON.parse(JSON.stringify(obj));

// 最慢（但最灵活）
function deepClone(obj) {
    // 递归实现
}
```

---

## DOM 操作性能问题

### 1. DOM 查询性能
**Q: getElementById、querySelector、getElementsByClassName 性能对比？**

**A:** 性能排序：getElementById > getElementsByClassName > querySelector
```javascript
// 最快
document.getElementById('id');

// 中等
document.getElementsByClassName('class');

// 最慢
document.querySelector('#id');
document.querySelectorAll('.class');
```

### 2. DOM 操作优化
**Q: 如何优化 DOM 操作性能？**

**A:** 优化策略：
```javascript
// ❌ 低效 - 多次重排
element.style.width = '100px';
element.style.height = '100px';
element.style.backgroundColor = 'red';

// ✅ 高效 - 批量操作
element.style.cssText = 'width: 100px; height: 100px; background-color: red;';

// ✅ 更高效 - 使用 class
element.className = 'new-style';
```

### 3. 事件委托性能
**Q: 事件委托 vs 直接绑定事件的性能差异？**

**A:** 事件委托性能更好：
```javascript
// ❌ 低效 - 多个事件监听器
items.forEach(item => {
    item.addEventListener('click', handler);
});

// ✅ 高效 - 事件委托
container.addEventListener('click', (e) => {
    if (e.target.matches('.item')) {
        handler(e);
    }
});
```

---

## 异步操作性能问题

### 1. Promise 性能对比
**Q: Promise.all、Promise.allSettled、Promise.race 性能差异？**

**A:** 性能特点：
```javascript
// 最快 - 并行执行，任一失败即失败
Promise.all(promises);

// 中等 - 并行执行，等待所有完成
Promise.allSettled(promises);

// 最快 - 返回第一个完成的结果
Promise.race(promises);
```

### 2. async/await vs Promise
**Q: async/await 和 Promise.then 的性能差异？**

**A:** 性能差异：
- ``：稍快，直接执行
- `async/await`：稍慢，需要额外的函数调用和状态管理
- 选择原则：优先考虑代码可读性

### 3. 异步优化技巧
**Q: 如何优化异步操作性能？**

**A:** 优化技巧：
```javascript
// ❌ 低效 - 串行执行
for (const url of urls) {
    const data = await fetch(url);
    processData(data);
}

// ✅ 高效 - 并行执行
const promises = urls.map(url => fetch(url));
const results = await Promise.all(promises);
results.forEach(processData);
```

---

## 内存管理性能问题

### 1. 内存泄漏检测
**Q: 如何检测和避免内存泄漏？**

**A:** 检测方法：
```javascript
// 使用 Chrome DevTools
// 1. Memory 面板 - 堆快照
// 2. Performance 面板 - 内存使用趋势
// 3. console.memory - 查看内存使用

console.log(performance.memory);
```

### 2. 垃圾回收优化
**Q: 如何优化垃圾回收性能？**

**A:** 优化策略：
```javascript
// ❌ 低效 - 频繁创建对象
function processData() {
    const temp = { data: [] };
    // 处理逻辑
    return temp.data;
}

// ✅ 高效 - 复用对象
const temp = { data: [] };
function processData() {
    temp.data.length = 0; // 清空数组
    // 处理逻辑
    return temp.data;
}
```

### 3. 闭包内存管理
**Q: 闭包对内存的影响？**

**A:** 内存影响：
```javascript
// ❌ 可能导致内存泄漏
function createHandler() {
    const largeData = new Array(1000000).fill(0);
    return function() {
        // 闭包持有 largeData 引用
        console.log('handler');
    };
}

// ✅ 优化 - 及时释放引用
function createHandler() {
    const largeData = new Array(1000000).fill(0);
    return function() {
        console.log('handler');
        largeData = null; // 释放引用
    };
}
```

---

## 算法复杂度问题

### 1. 时间复杂度优化
**Q: 如何优化算法的时间复杂度？**

**A:** 优化策略：
```javascript
// O(n²) - 低效
function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}

// O(n) - 高效
function findDuplicates(arr) {
    const seen = new Set();
    const duplicates = [];
    for (const item of arr) {
        if (seen.has(item)) {
            duplicates.push(item);
        } else {
            seen.add(item);
        }
    }
    return duplicates;
}
```

### 2. 空间复杂度优化
**Q: 如何优化算法的空间复杂度？**

**A:** 优化策略：
```javascript
// O(n) 空间 - 低效
function reverseArray(arr) {
    const reversed = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        reversed.push(arr[i]);
    }
    return reversed;
}

// O(1) 空间 - 高效
function reverseArray(arr) {
    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    return arr;
}
```

### 3. 缓存优化
**Q: 如何使用缓存优化性能？**

**A:** 缓存策略：
```javascript
// 记忆化缓存
function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// 使用示例
const fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});
```

---

## 性能监控和调试

### 1. 性能测量工具
```javascript
// 使用 performance API
const start = performance.now();
// 执行代码
const end = performance.now();
console.log(`执行时间: ${end - start}ms`);

// 使用 console.time
console.time('operation');
// 执行代码
console.timeEnd('operation');
```

### 2. 性能分析技巧
```javascript
// 使用 requestAnimationFrame 优化动画
function animate() {
    // 动画逻辑
    requestAnimationFrame(animate);
}

// 使用 Web Workers 处理计算密集型任务
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = function(e) {
    console.log(e.data);
};
```

### 3. 性能最佳实践
1. **避免过早优化**：先确保代码正确性
2. **测量真实性能**：使用真实数据测试
3. **关注用户体验**：优化关键路径
4. **持续监控**：建立性能监控体系
5. **团队协作**：制定性能标准

---

## 总结

性能优化是一个系统性的工程，需要从多个维度考虑：

1. **算法层面**：选择合适的数据结构和算法
2. **代码层面**：避免不必要的计算和内存分配
3. **架构层面**：合理设计系统架构
4. **工具层面**：使用性能分析工具
5. **监控层面**：建立性能监控体系

记住：**性能优化是一个持续的过程，不是一次性的工作**。
