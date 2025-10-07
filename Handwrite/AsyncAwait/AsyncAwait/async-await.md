# 手写 async/await 实现详解

## 核心原理

### 1. async/await 是什么？

`async/await` 是 ES2017 引入的语法糖，基于 Promise 和 Generator 实现，用于更优雅地处理异步操作。

```javascript
// 传统 Promise 链
function getData() {
    return fetchUser()
        .then(user => fetchPosts(user.id))
        .then(posts => processPosts(posts))
        .catch(error => handleError(error));
}

// async/await 语法
async function getData() {
    try {
        const user = await fetchUser();
        const posts = await fetchPosts(user.id);
        return processPosts(posts);
    } catch (error) {
        handleError(error);
    }
}
```

### 2. 实现原理

async/await 本质上是 **Generator + 自动执行器** 的语法糖：

```javascript
// async 函数
async function example() {
    const result = await someAsyncOperation();
    return result;
}

// 等价于
function example() {
    return asyncToGenerator(function* () {
        const result = yield someAsyncOperation();
        return result;
    })();
}
```

## 核心实现

### 方法一：完整版实现

```javascript
function asyncToGenerator(generatorFunc) {
    // 返回一个函数，该函数返回 Promise
    return function(...args) {
        // 创建 Generator 实例
        const gen = generatorFunc.apply(this, args);
        
        // 返回一个 Promise
        return new Promise((resolve, reject) => {
            
            // 递归执行 Generator
            function step(key, arg) {
                let result;
                
                try {
                    // 执行 Generator 的 next 或 throw 方法
                    result = gen[key](arg);
                } catch (error) {
                    // Generator 执行出错，直接 reject
                    return reject(error);
                }
                
                // 获取 Generator 的返回值
                const { value, done } = result;
                
                if (done) {
                    // Generator 执行完毕，resolve 最终结果
                    return resolve(value);
                } else {
                    // Generator 未执行完毕
                    // 将 value 转换为 Promise（可能是普通值）
                    return Promise.resolve(value).then(
                        // 成功：继续执行 next
                        val => step('next', val),
                        // 失败：抛出错误
                        err => step('throw', err)
                    );
                }
            }
            
            // 开始执行
            step('next');
        });
    };
}
```

### 方法二：简化版实现

```javascript
function simpleAsync(generatorFunc) {
    return function(...args) {
        const gen = generatorFunc.apply(this, args);
        
        return new Promise((resolve, reject) => {
            function next(value) {
                const result = gen.next(value);
                
                if (result.done) {
                    resolve(result.value);
                } else {
                    Promise.resolve(result.value)
                        .then(next)
                        .catch(reject);
                }
            }
            
            next();
        });
    };
}
```

## 使用示例

### 1. 基础使用

```javascript
const asyncFunc = asyncToGenerator(function* () {
    const result1 = yield Promise.resolve('First');
    console.log(result1); // 'First'
    
    const result2 = yield Promise.resolve('Second');
    console.log(result2); // 'Second'
    
    return 'Done!';
});

asyncFunc().then(result => {
    console.log(result); // 'Done!'
});
```

### 2. 错误处理

```javascript
const asyncFunc = asyncToGenerator(function* () {
    try {
        const result = yield Promise.reject('Error occurred');
    } catch (error) {
        console.log('Caught:', error); // 'Caught: Error occurred'
        return 'Recovered';
    }
});

asyncFunc().then(result => {
    console.log(result); // 'Recovered'
});
```

### 3. 串行执行

```javascript
const serialAsync = asyncToGenerator(function* () {
    const task1 = yield delay(1000, 'Task 1');
    const task2 = yield delay(1000, 'Task 2');
    const task3 = yield delay(1000, 'Task 3');
    
    return [task1, task2, task3];
});

// 总共需要 3 秒
serialAsync().then(results => {
    console.log(results); // ['Task 1', 'Task 2', 'Task 3']
});
```

### 4. 并行执行

```javascript
const parallelAsync = asyncToGenerator(function* () {
    // 使用 Promise.all 实现并行
    const results = yield Promise.all([
        delay(1000, 'Task 1'),
        delay(1000, 'Task 2'),
        delay(1000, 'Task 3')
    ]);
    
    return results;
});

// 总共只需要 1 秒
parallelAsync().then(results => {
    console.log(results); // ['Task 1', 'Task 2', 'Task 3']
});
```

## 实现细节

### 1. Generator 函数

Generator 函数是实现 async/await 的基础：

```javascript
function* generatorFunc() {
    console.log('Step 1');
    const result1 = yield 'value1';
    console.log('Step 2, got:', result1);
    const result2 = yield 'value2';
    console.log('Step 3, got:', result2);
    return 'final';
}

const gen = generatorFunc();
console.log(gen.next());      // Step 1, { value: 'value1', done: false }
console.log(gen.next('a'));   // Step 2, { value: 'value2', done: false }
console.log(gen.next('b'));   // Step 3, { value: 'final', done: true }
```

### 2. 自动执行器的作用

自动执行器负责：
1. **自动调用 next()**：不需要手动调用 `gen.next()`
2. **处理 Promise**：将 yield 的 Promise 结果传回 Generator
3. **错误处理**：捕获错误并通过 `gen.throw()` 传递
4. **返回 Promise**：将整个执行流程封装为 Promise

### 3. 关键步骤解析

```javascript
function step(key, arg) {
    let result;
    
    try {
        // 1. 执行 Generator
        result = gen[key](arg);
    } catch (error) {
        // 2. 同步错误处理
        return reject(error);
    }
    
    const { value, done } = result;
    
    if (done) {
        // 3. Generator 执行完毕
        return resolve(value);
    }
    
    // 4. 处理 yield 的值
    return Promise.resolve(value).then(
        val => step('next', val),    // 成功：继续执行
        err => step('throw', err)    // 失败：抛出错误
    );
}
```

## 面试要点

### 1. async/await 的原理是什么？

**答案**：
- async/await 是 Generator + 自动执行器的语法糖
- async 函数返回一个 Promise
- await 暂停函数执行，等待 Promise 完成
- 通过 Generator 的 yield 实现暂停，通过自动执行器实现恢复

### 2. async/await 和 Promise 的区别？

**答案**：
```javascript
// Promise 链式调用
fetchUser()
    .then(user => fetchPosts(user.id))
    .then(posts => console.log(posts))
    .catch(error => console.error(error));

// async/await - 更直观
async function getData() {
    try {
        const user = await fetchUser();
        const posts = await fetchPosts(user.id);
        console.log(posts);
    } catch (error) {
        console.error(error);
    }
}
```

优势：
- 代码更简洁易读
- 错误处理更方便（try/catch）
- 调试更容易（堆栈信息更清晰）

### 3. await 后面跟非 Promise 会怎样？

**答案**：
```javascript
async function test() {
    const result = await 42;  // 自动转换为 Promise.resolve(42)
    console.log(result);      // 42
}

// 在我们的实现中
Promise.resolve(value).then(...)  // 自动将非 Promise 值转换
```

### 4. 如何实现串行和并行？

**答案**：
```javascript
// 串行：依次 await
async function serial() {
    const r1 = await task1();  // 等待 task1
    const r2 = await task2();  // 等待 task2
    return [r1, r2];
}

// 并行：Promise.all
async function parallel() {
    const results = await Promise.all([
        task1(),  // 同时开始
        task2()   // 同时开始
    ]);
    return results;
}
```

### 5. 为什么需要 step 函数递归？

**答案**：
- Generator 每次 yield 都会暂停
- 需要不断调用 next() 来恢复执行
- 递归确保所有 yield 都被处理
- 直到 done 为 true 才结束

## 常见错误

### 1. 忘记处理非 Promise 值

```javascript
// ❌ 错误
function step(key, arg) {
    const { value, done } = gen[key](arg);
    if (!done) {
        value.then(...)  // value 可能不是 Promise
    }
}

// ✅ 正确
function step(key, arg) {
    const { value, done } = gen[key](arg);
    if (!done) {
        Promise.resolve(value).then(...)  // 确保是 Promise
    }
}
```

### 2. 错误处理不完整

```javascript
// ❌ 错误：只处理了异步错误
Promise.resolve(value).then(
    val => step('next', val)
);

// ✅ 正确：同时处理异步错误
Promise.resolve(value).then(
    val => step('next', val),
    err => step('throw', err)  // 将错误传回 Generator
);
```

### 3. this 指向问题

```javascript
// ❌ 错误
function asyncToGenerator(generatorFunc) {
    return function(...args) {
        const gen = generatorFunc(...args);  // this 丢失
    };
}

// ✅ 正确
function asyncToGenerator(generatorFunc) {
    return function(...args) {
        const gen = generatorFunc.apply(this, args);  // 保留 this
    };
}
```

## 实际应用

### 1. 接口请求

```javascript
const fetchUserData = asyncToGenerator(function* (userId) {
    try {
        const user = yield fetch(`/api/users/${userId}`);
        const posts = yield fetch(`/api/users/${userId}/posts`);
        return { user, posts };
    } catch (error) {
        console.error('获取失败:', error);
        throw error;
    }
});
```

### 2. 并发控制

```javascript
const batchProcess = asyncToGenerator(function* (items, batchSize) {
    const results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = yield Promise.all(
            batch.map(item => processItem(item))
        );
        results.push(...batchResults);
    }
    
    return results;
});
```

### 3. 重试逻辑

```javascript
const retry = asyncToGenerator(function* (fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = yield fn();
            return result;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`重试 ${i + 1}/${maxRetries}`);
            yield delay(1000 * (i + 1));  // 指数退避
        }
    }
});
```

## 性能对比

```javascript
// 测试串行执行
console.time('串行');
await serial();
console.timeEnd('串行');  // ~3000ms

// 测试并行执行
console.time('并行');
await parallel();
console.timeEnd('并行');  // ~1000ms
```

## 总结

1. **核心原理**：Generator + 自动执行器
2. **关键步骤**：递归调用 next()，处理 Promise 结果
3. **错误处理**：try/catch 捕获同步错误，Promise.catch 捕获异步错误
4. **实际应用**：简化异步代码，提高可读性
5. **面试重点**：理解原理，能手写实现，知道优缺点
