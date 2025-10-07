/**
 * async/await 手写实现 - 面试精简版
 * 
 * 这是一个适合面试时手写的版本，代码简洁清晰
 */

/**
 * 核心实现 - 面试必备版本
 * 
 * @param {GeneratorFunction} generatorFunc - Generator 函数
 * @returns {Function} 返回一个返回 Promise 的函数
 */
function asyncToGenerator(generatorFunc) {
    // 返回一个函数
    return function(...args) {
        // 创建 Generator 实例
        const gen = generatorFunc.apply(this, args);
        
        // 返回 Promise
        return new Promise((resolve, reject) => {
            
            // 核心：递归执行 Generator
            function step(key, arg) {
                let result;
                
                // 1. 执行 Generator
                try {
                    result = gen[key](arg);
                } catch (error) {
                    return reject(error);
                }
                
                // 2. 解构结果
                const { value, done } = result;
                
                // 3. 判断是否完成
                if (done) {
                    return resolve(value);
                }
                
                // 4. 继续执行
                Promise.resolve(value).then(
                    val => step('next', val),   // 成功继续
                    err => step('throw', err)   // 失败抛出
                );
            }
            
            // 开始执行
            step('next');
        });
    };
}

/**
 * 面试问答指南
 */

// Q1: async/await 的原理是什么？
console.log('\n=== Q1: async/await 的原理 ===');
console.log(`
答：async/await 是基于 Generator 和 Promise 的语法糖。

核心机制：
1. Generator 函数提供暂停和恢复的能力（yield）
2. 自动执行器负责自动调用 next() 方法
3. Promise 处理异步操作的结果
4. 递归执行直到 Generator 完成

实现步骤：
1. 创建 Generator 实例
2. 返回一个 Promise
3. 递归调用 gen.next() 直到 done 为 true
4. 将 yield 的值转换为 Promise 并处理结果
`);

// Q2: 请手写一个 async/await 实现
console.log('\n=== Q2: 手写实现演示 ===');

// 测试函数
function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// 使用 Generator 模拟 async 函数
const test = asyncToGenerator(function* () {
    console.log('开始执行');
    
    const result1 = yield delay(100, 'Step 1');
    console.log('完成:', result1);
    
    const result2 = yield delay(100, 'Step 2');
    console.log('完成:', result2);
    
    return 'All Done!';
});

test().then(result => {
    console.log('最终结果:', result);
});

// Q3: async/await 和 Promise 的区别
console.log('\n=== Q3: async/await vs Promise ===');

// Promise 版本
function promiseVersion() {
    return delay(100, 'data1')
        .then(data1 => {
            console.log('Promise:', data1);
            return delay(100, 'data2');
        })
        .then(data2 => {
            console.log('Promise:', data2);
            return 'done';
        });
}

// async/await 版本
const asyncVersion = asyncToGenerator(function* () {
    const data1 = yield delay(100, 'data1');
    console.log('Async:', data1);
    
    const data2 = yield delay(100, 'data2');
    console.log('Async:', data2);
    
    return 'done';
});

console.log(`
区别：
1. 语法更简洁，代码更易读
2. 错误处理更方便（try/catch）
3. 调试更容易（堆栈更清晰）
4. 避免回调地狱和 Promise 链
`);

// Q4: 如何实现错误处理
console.log('\n=== Q4: 错误处理 ===');

const errorHandling = asyncToGenerator(function* () {
    try {
        // 正常操作
        const result1 = yield Promise.resolve('Success');
        console.log(result1);
        
        // 抛出错误
        const result2 = yield Promise.reject('Error!');
        console.log('这行不会执行');
        
    } catch (error) {
        console.log('捕获错误:', error);
        return 'Recovered';
    }
});

setTimeout(() => {
    errorHandling().then(result => {
        console.log('错误处理结果:', result);
    });
}, 500);

// Q5: 串行 vs 并行
console.log('\n=== Q5: 串行 vs 并行 ===');

// 串行执行
const serial = asyncToGenerator(function* () {
    console.log('串行开始');
    const r1 = yield delay(100, 'Task 1');
    const r2 = yield delay(100, 'Task 2');
    const r3 = yield delay(100, 'Task 3');
    console.log('串行完成:', [r1, r2, r3]);
    return [r1, r2, r3];
});

// 并行执行
const parallel = asyncToGenerator(function* () {
    console.log('并行开始');
    const results = yield Promise.all([
        delay(100, 'Task 1'),
        delay(100, 'Task 2'),
        delay(100, 'Task 3')
    ]);
    console.log('并行完成:', results);
    return results;
});

setTimeout(() => {
    console.time('串行耗时');
    serial().then(() => {
        console.timeEnd('串行耗时');
        
        console.time('并行耗时');
        parallel().then(() => {
            console.timeEnd('并行耗时');
        });
    });
}, 1000);

/**
 * 面试核心知识点总结
 */
console.log('\n=== 面试知识点总结 ===');
console.log(`
1. 原理理解：
   - Generator + Promise + 自动执行器
   - yield 暂停，next() 恢复
   - 递归处理直到完成

2. 关键实现：
   - gen[key](arg) 执行 Generator
   - Promise.resolve(value) 统一处理
   - step('next', val) 成功继续
   - step('throw', err) 失败抛出

3. 错误处理：
   - try/catch 捕获同步错误
   - Promise.catch 捕获异步错误
   - gen.throw() 传递错误

4. 性能优化：
   - 串行：依次 await
   - 并行：Promise.all
   - 并发控制：分批处理

5. 实际应用：
   - 接口请求
   - 数据处理
   - 异步流程控制
`);

/**
 * 简化版实现（更容易记忆）
 */
function simpleAsync(genFunc) {
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

/**
 * 最精简版（核心逻辑）
 */
function miniAsync(genFunc) {
    return (...args) => {
        const gen = genFunc(...args);
        return new Promise((resolve, reject) => {
            const step = (key, arg) => {
                const { value, done } = gen[key](arg);
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

/**
 * 验证实现
 */
console.log('\n=== 验证不同版本 ===');

const testFunc = function* () {
    const r1 = yield Promise.resolve(1);
    const r2 = yield Promise.resolve(2);
    return r1 + r2;
};

setTimeout(() => {
    Promise.all([
        asyncToGenerator(testFunc)(),
        simpleAsync(testFunc)(),
        miniAsync(testFunc)()
    ]).then(results => {
        console.log('完整版结果:', results[0]);
        console.log('简化版结果:', results[1]);
        console.log('精简版结果:', results[2]);
        console.log('所有版本结果一致:', results.every(r => r === 3));
    });
}, 2000);

/**
 * 导出
 */
export {
    asyncToGenerator,
    simpleAsync,
    miniAsync
};

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        asyncToGenerator,
        simpleAsync,
        miniAsync
    };
}

