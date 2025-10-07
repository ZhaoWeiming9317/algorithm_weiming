# async/await 手写实现 - 快速参考卡片

## 一、核心代码（30秒版本）

```javascript
function asyncToGenerator(genFunc) {
    return function(...args) {
        const gen = genFunc.apply(this, args);
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                try {
                    const { value, done } = gen[key](arg);
                    if (done) return resolve(value);
                    Promise.resolve(value).then(
                        val => step('next', val),
                        err => step('throw', err)
                    );
                } catch (e) {
                    reject(e);
                }
            }
            step('next');
        });
    };
}
```

## 二、原理解释（1分钟版本）

### 核心思想
async/await = Generator + Promise + 自动执行器

### 工作流程
```
1. 创建 Generator 实例 (gen)
   ↓
2. 返回 Promise
   ↓
3. 执行 gen.next() → { value, done }
   ↓
4. done = true ? resolve(value) : 继续执行
   ↓
5. Promise.resolve(value) 处理异步
   ↓
6. 递归调用 step('next', result)
   ↓
7. 重复 3-6 直到 done = true
```

### 关键点
- `yield` → 暂停执行
- `gen.next(val)` → 恢复执行，传入值
- `gen.throw(err)` → 传递错误
- `Promise.resolve()` → 统一处理同步/异步

## 三、面试问答（3分钟版本）

### Q1: async/await 原理？
**A:** 基于 Generator 和 Promise 的语法糖。Generator 提供暂停恢复能力，自动执行器负责递归调用 next()，Promise 处理异步结果。

### Q2: 为什么需要 Promise.resolve()？
**A:** 因为 yield 后面可能是普通值，需要统一转换为 Promise。
```javascript
yield 42;  // 需要转换为 Promise.resolve(42)
```

### Q3: 错误如何处理？
**A:** 两种错误：
- **同步错误**: try/catch 捕获，直接 reject
- **异步错误**: Promise.catch 捕获，调用 gen.throw() 传回

### Q4: step 为什么要递归？
**A:** Generator 每次 yield 都会暂停，需要不断调用 next() 恢复执行，递归确保所有 yield 都被处理完。

### Q5: 串行和并行如何实现？
```javascript
// 串行：依次 await
const r1 = yield task1();
const r2 = yield task2();

// 并行：Promise.all
const [r1, r2] = yield Promise.all([task1(), task2()]);
```

## 四、代码变体

### 最精简版（面试推荐）
```javascript
function async(f) {
    return (...args) => {
        const g = f(...args);
        return new Promise((resolve, reject) => {
            const step = (k, a) => {
                const { value, done } = g[k](a);
                if (done) return resolve(value);
                Promise.resolve(value).then(
                    v => step('next', v),
                    e => step('throw', e)
                );
            };
            step('next');
        });
    };
}
```

### 带注释版（理解用）
```javascript
function asyncToGenerator(generatorFunc) {
    return function(...args) {
        // 1. 创建 Generator 实例
        const gen = generatorFunc.apply(this, args);
        
        // 2. 返回 Promise
        return new Promise((resolve, reject) => {
            
            function step(key, arg) {
                let result;
                
                // 3. 执行 Generator
                try {
                    result = gen[key](arg);
                } catch (error) {
                    return reject(error);  // 同步错误
                }
                
                const { value, done } = result;
                
                // 4. 检查是否完成
                if (done) {
                    return resolve(value);
                }
                
                // 5. 处理 Promise
                return Promise.resolve(value).then(
                    val => step('next', val),   // 继续
                    err => step('throw', err)   // 抛错
                );
            }
            
            step('next');
        });
    };
}
```

## 五、使用示例

### 基础用法
```javascript
const asyncFunc = asyncToGenerator(function* () {
    const r1 = yield Promise.resolve(1);
    const r2 = yield Promise.resolve(2);
    return r1 + r2;
});

asyncFunc().then(console.log);  // 3
```

### 错误处理
```javascript
const asyncFunc = asyncToGenerator(function* () {
    try {
        yield Promise.reject('error');
    } catch (e) {
        return 'recovered';
    }
});
```

### 串行执行
```javascript
const serial = asyncToGenerator(function* () {
    const r1 = yield delay(1000, 'a');  // 等待 1s
    const r2 = yield delay(1000, 'b');  // 等待 1s
    return [r1, r2];  // 总共 2s
});
```

### 并行执行
```javascript
const parallel = asyncToGenerator(function* () {
    const [r1, r2] = yield Promise.all([
        delay(1000, 'a'),  // 同时开始
        delay(1000, 'b')   // 同时开始
    ]);
    return [r1, r2];  // 总共 1s
});
```

## 六、常见错误

### ❌ 错误 1: 忘记 Promise.resolve
```javascript
// 错误：value 可能不是 Promise
value.then(...)

// 正确
Promise.resolve(value).then(...)
```

### ❌ 错误 2: 没有处理异步错误
```javascript
// 错误：只处理成功
Promise.resolve(value).then(val => step('next', val))

// 正确：同时处理失败
Promise.resolve(value).then(
    val => step('next', val),
    err => step('throw', err)
)
```

### ❌ 错误 3: this 丢失
```javascript
// 错误
const gen = generatorFunc(...args);

// 正确
const gen = generatorFunc.apply(this, args);
```

## 七、记忆口诀

```
Generator 生成器，暂停又恢复
自动执行器，递归调 next
Promise 包装值，统一处理异步
step 函数核心，成功 next 失败 throw
done 为真时，resolve 返回值
循环往复，直到完成为止
```

## 八、对比原生

```javascript
// 原生 async/await
async function demo() {
    const r1 = await promise1();
    const r2 = await promise2();
    return [r1, r2];
}

// 手写实现
const demo = asyncToGenerator(function* () {
    const r1 = yield promise1();
    const r2 = yield promise2();
    return [r1, r2];
});
```

## 九、性能测试

```javascript
// 串行：慢
async function serial() {
    const r1 = await delay(1000);  // 等 1s
    const r2 = await delay(1000);  // 等 1s
    return [r1, r2];  // 总共 2s
}

// 并行：快
async function parallel() {
    const [r1, r2] = await Promise.all([
        delay(1000),  // 同时开始
        delay(1000)   // 同时开始
    ]);
    return [r1, r2];  // 总共 1s
}
```

## 十、实战应用

### 接口请求
```javascript
const fetchData = asyncToGenerator(function* (id) {
    try {
        const user = yield fetch(`/api/users/${id}`);
        const posts = yield fetch(`/api/users/${id}/posts`);
        return { user, posts };
    } catch (error) {
        console.error(error);
        throw error;
    }
});
```

### 重试逻辑
```javascript
const retry = asyncToGenerator(function* (fn, times = 3) {
    for (let i = 0; i < times; i++) {
        try {
            return yield fn();
        } catch (e) {
            if (i === times - 1) throw e;
            yield delay(1000 * (i + 1));
        }
    }
});
```

### 并发控制
```javascript
const batchProcess = asyncToGenerator(function* (items, limit) {
    const results = [];
    for (let i = 0; i < items.length; i += limit) {
        const batch = items.slice(i, i + limit);
        const batchResults = yield Promise.all(
            batch.map(item => process(item))
        );
        results.push(...batchResults);
    }
    return results;
});
```

## 十一、总结检查清单

- [ ] 理解 Generator 的暂停恢复机制
- [ ] 掌握自动执行器的递归逻辑
- [ ] 知道如何处理同步和异步错误
- [ ] 能写出最精简版实现（< 15 行）
- [ ] 理解 Promise.resolve 的作用
- [ ] 知道串行和并行的区别
- [ ] 能解释 step('next') 和 step('throw')
- [ ] 了解实际应用场景
