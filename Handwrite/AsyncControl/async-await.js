/**
 * 手写 async/await 实现
 * 
 * 核心原理：
 * 1. async 函数返回一个 Promise
 * 2. await 会暂停函数执行，等待 Promise 完成
 * 3. 使用 Generator 函数 + 自动执行器实现
 */

/**
 * 方法一：使用 Generator 实现 async/await
 * 
 * 原理：Generator 函数可以暂停和恢复执行，配合自动执行器实现异步流程控制
 */

// 自动执行器 - 核心实现
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

/**
 * 使用示例
 */

// 模拟异步操作
function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    });
}

function fetchUser(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, name: `User${id}`, age: 20 + id });
        }, 1000);
    });
}

function fetchUserPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: 'Post 1', userId },
                { id: 2, title: 'Post 2', userId }
            ]);
        }, 800);
    });
}

// 使用 Generator 模拟 async 函数
const getUserData = asyncToGenerator(function* (userId) {
    console.log('开始获取用户数据...');
    
    try {
        // 模拟 await
        const user = yield fetchUser(userId);
        console.log('用户信息:', user);
        
        // 继续 await
        const posts = yield fetchUserPosts(userId);
        console.log('用户文章:', posts);
        
        return { user, posts };
    } catch (error) {
        console.error('获取数据失败:', error);
        throw error;
    }
});

/**
 * 方法二：简化版实现
 */
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
                        .catch(err => {
                            gen.throw(err);
                        });
                }
            }
            
            next();
        });
    };
}

/**
 * 方法三：完整版实现（支持错误处理）
 */
function fullAsync(generatorFunc) {
    return function(...args) {
        const gen = generatorFunc.apply(this, args);
        
        return new Promise((resolve, reject) => {
            
            function step(key, arg) {
                let result;
                
                try {
                    result = gen[key](arg);
                } catch (error) {
                    return reject(error);
                }
                
                const { value, done } = result;
                
                if (done) {
                    return resolve(value);
                }
                
                // 确保 value 是 Promise
                return Promise.resolve(value).then(
                    val => step('next', val),
                    err => step('throw', err)
                );
            }
            
            step('next');
        });
    };
}

/**
 * 测试用例
 */

console.log('=== 测试 1: 基础使用 ===');

const test1 = asyncToGenerator(function* () {
    const result1 = yield delay(500, 'First');
    console.log('Result 1:', result1);
    
    const result2 = yield delay(500, 'Second');
    console.log('Result 2:', result2);
    
    return 'All Done!';
});

test1().then(result => {
    console.log('Final result:', result);
});

console.log('\n=== 测试 2: 错误处理 ===');

const test2 = asyncToGenerator(function* () {
    try {
        const result = yield Promise.reject('Something went wrong');
        console.log('This should not be printed');
    } catch (error) {
        console.log('Caught error:', error);
        return 'Recovered from error';
    }
});

test2().then(result => {
    console.log('Final result:', result);
});

console.log('\n=== 测试 3: 串行执行 ===');

const test3 = asyncToGenerator(function* () {
    console.log('开始执行任务...');
    
    const task1 = yield delay(300, 'Task 1 完成');
    console.log(task1);
    
    const task2 = yield delay(300, 'Task 2 完成');
    console.log(task2);
    
    const task3 = yield delay(300, 'Task 3 完成');
    console.log(task3);
    
    return '所有任务完成';
});

test3().then(result => {
    console.log(result);
});

console.log('\n=== 测试 4: 并行执行 ===');

const test4 = asyncToGenerator(function* () {
    console.log('开始并行执行...');
    
    // 使用 Promise.all 实现并行
    const results = yield Promise.all([
        delay(300, 'Parallel 1'),
        delay(300, 'Parallel 2'),
        delay(300, 'Parallel 3')
    ]);
    
    console.log('并行结果:', results);
    return results;
});

test4().then(result => {
    console.log('Final:', result);
});

console.log('\n=== 测试 5: 真实场景 - 获取用户数据 ===');

// 延迟执行，避免和其他测试输出混在一起
setTimeout(() => {
    getUserData(1).then(data => {
        console.log('最终数据:', data);
    }).catch(error => {
        console.error('获取失败:', error);
    });
}, 2000);

/**
 * 对比原生 async/await
 */

console.log('\n=== 对比原生 async/await ===');

// 原生 async/await
async function nativeAsync() {
    const result1 = await delay(100, 'Native 1');
    const result2 = await delay(100, 'Native 2');
    return [result1, result2];
}

// 手写实现
const customAsync = asyncToGenerator(function* () {
    const result1 = yield delay(100, 'Custom 1');
    const result2 = yield delay(100, 'Custom 2');
    return [result1, result2];
});

Promise.all([
    nativeAsync(),
    customAsync()
]).then(([nativeResult, customResult]) => {
    console.log('原生结果:', nativeResult);
    console.log('手写结果:', customResult);
    console.log('结果一致:', JSON.stringify(nativeResult) === JSON.stringify(customResult));
});

/**
 * 高级用法：支持并发控制
 */

console.log('\n=== 测试 6: 并发控制 ===');

const asyncWithConcurrency = asyncToGenerator(function* () {
    const urls = [
        'url1', 'url2', 'url3', 'url4', 'url5'
    ];
    
    const results = [];
    
    // 并发限制为 2
    for (let i = 0; i < urls.length; i += 2) {
        const batch = urls.slice(i, i + 2);
        const batchResults = yield Promise.all(
            batch.map(url => delay(300, `Result: ${url}`))
        );
        results.push(...batchResults);
        console.log(`完成批次 ${i / 2 + 1}:`, batchResults);
    }
    
    return results;
});

setTimeout(() => {
    asyncWithConcurrency().then(results => {
        console.log('所有结果:', results);
    });
}, 4000);

/**
 * 工具函数：将普通异步函数转换为 Generator
 */
function toGenerator(asyncFunc) {
    return function* (...args) {
        return yield asyncFunc.apply(this, args);
    };
}

/**
 * 导出
 */
export {
    asyncToGenerator,
    simpleAsync,
    fullAsync,
    toGenerator
};

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        asyncToGenerator,
        simpleAsync,
        fullAsync,
        toGenerator
    };
}

