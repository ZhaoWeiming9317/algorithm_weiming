/**
 * Promise 高级实现和变形题
 */

// 1. Promise.retry - 失败重试
Promise.retry = function(promiseFn, times = 3) {
    return new Promise(async (resolve, reject) => {
        while (times--) {
            try {
                const result = await promiseFn();
                resolve(result);
                break;
            } catch (err) {
                if (times === 0) {
                    reject(err);
                }
            }
        }
    });
};

// 2. Promise.race 的超时中断版本
Promise.timeoutRace = function(promises, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeout);
    });
    return Promise.race([...promises, timeoutPromise]);
};

// 3. Promise.map - 带并发限制的 Promise.all
Promise.map = function(list, mapper, concurrency = Infinity) {
    return new Promise((resolve, reject) => {
        let currentIndex = 0;
        let resolvedCount = 0;
        const result = [];
        const activeCount = 0;

        function next() {
            const index = currentIndex++;
            if (index >= list.length) {
                if (resolvedCount === list.length) resolve(result);
                return;
            }

            Promise.resolve(mapper(list[index], index))
                .then(value => {
                    result[index] = value;
                    resolvedCount++;
                    if (activeCount < concurrency) next();
                })
                .catch(reject);
        }

        for (let i = 0; i < Math.min(concurrency, list.length); i++) {
            next();
        }
    });
};

// 4. Promise.sequence - 按顺序执行Promise
Promise.sequence = function(tasks) {
    return tasks.reduce((promise, task) => {
        return promise.then(results => 
            task().then(result => [...results, result])
        );
    }, Promise.resolve([]));
};

// 5. Promise.parallel - 带失败重试的并行执行
Promise.parallel = function(tasks, maxParallel = 2, maxRetries = 3) {
    const results = [];
    let currentIndex = 0;
    let resolvedCount = 0;

    return new Promise((resolve, reject) => {
        function runTask(task, index, retries = 0) {
            return task()
                .then(result => {
                    results[index] = result;
                    resolvedCount++;
                    if (resolvedCount === tasks.length) {
                        resolve(results);
                    } else if (currentIndex < tasks.length) {
                        runNextTask();
                    }
                })
                .catch(err => {
                    if (retries < maxRetries) {
                        return runTask(task, index, retries + 1);
                    }
                    reject(err);
                });
        }

        function runNextTask() {
            if (currentIndex < tasks.length) {
                runTask(tasks[currentIndex], currentIndex);
                currentIndex++;
            }
        }

        // 启动初始任务
        for (let i = 0; i < Math.min(maxParallel, tasks.length); i++) {
            runNextTask();
        }
    });
};

// 6. Promise.allSettled 的增强版（带重试）
Promise.allSettledWithRetry = function(promises, retries = 3) {
    return Promise.all(promises.map(promise => 
        new Promise(resolve => {
            let attempts = 0;
            
            function attempt() {
                attempts++;
                Promise.resolve(promise)
                    .then(value => resolve({ status: 'fulfilled', value }))
                    .catch(error => {
                        if (attempts < retries) {
                            attempt();
                        } else {
                            resolve({ status: 'rejected', reason: error });
                        }
                    });
            }
            
            attempt();
        })
    ));
};

// 7. Promise.buffer - 缓存Promise结果
Promise.buffer = function() {
    const cache = new Map();
    
    return function(key, promiseFn) {
        if (!cache.has(key)) {
            cache.set(key, promiseFn().catch(err => {
                cache.delete(key);
                throw err;
            }));
        }
        return cache.get(key);
    };
};

// 使用示例
async function example() {
    // 重试示例
    const fetchWithRetry = () => Promise.retry(() => fetch('api/data'), 3);
    
    // 超时示例
    const fetchWithTimeout = promises => Promise.timeoutRace(promises, 5000);
    
    // 并发限制示例
    const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
    const results = await Promise.map(urls, url => fetch(url), 2);
    
    // 顺序执行示例
    const tasks = [
        () => new Promise(resolve => setTimeout(() => resolve(1), 1000)),
        () => new Promise(resolve => setTimeout(() => resolve(2), 500)),
        () => new Promise(resolve => setTimeout(() => resolve(3), 300))
    ];
    const sequenceResults = await Promise.sequence(tasks);
    
    // 并行执行示例
    const parallelResults = await Promise.parallel(tasks, 2, 3);
    
    // 缓存示例
    const bufferedFetch = Promise.buffer();
    const data1 = await bufferedFetch('key1', () => fetch('api/data'));
    const data2 = await bufferedFetch('key1', () => fetch('api/data')); // 使用缓存
}
