/**
 * Promise 面试题集合 - 背诵版本
 * 按难度和频率排序
 */

// ==================== 基础必背 ====================

// 1. Promise.all 手写
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      resolve([]);
      return;
    }
    
    const results = [];
    let completed = 0;
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// 2. Promise.race 手写
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise)
        .then(resolve)
        .catch(reject);
    });
  });
}

// 3. Promise.allSettled 手写
function promiseAllSettled(promises) {
  return Promise.all(
    promises.map(promise => 
      Promise.resolve(promise)
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    )
  );
}

// ==================== 进阶变形题 ====================

// 4. Promise.retry - 失败重试
function promiseRetry(fn, maxAttempts = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attempt() {
      attempts++;
      Promise.resolve(fn())
        .then(resolve)
        .catch(err => {
          if (attempts >= maxAttempts) {
            reject(err);
          } else {
            setTimeout(attempt, delay);
          }
        });
    }
    
    attempt();
  });
}

// 5. Promise 超时控制
function promiseTimeout(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// 6. Promise 并发限制
function promiseLimit(promises, limit) {
  return new Promise((resolve, reject) => {
    const results = [];
    let running = 0;
    let index = 0;
    
    function run() {
      while (running < limit && index < promises.length) {
        const currentIndex = index++;
        running++;
        
        Promise.resolve(promises[currentIndex])
          .then(value => {
            results[currentIndex] = value;
            running--;
            if (index === promises.length && running === 0) {
              resolve(results);
            } else {
              run();
            }
          })
          .catch(reject);
      }
    }
    
    run();
  });
}

// 7. Promise 顺序执行
function promiseSequence(tasks) {
  return tasks.reduce((promise, task) => {
    return promise.then(results => 
      task().then(result => [...results, result])
    );
  }, Promise.resolve([]));
}

// 8. Promise 缓存
function promiseCache() {
  const cache = new Map();
  
  return function(key, promiseFn) {
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const promise = promiseFn().catch(err => {
      cache.delete(key);
      throw err;
    });
    
    cache.set(key, promise);
    return promise;
  };
}

// 9. Promise 取消机制
function cancellablePromise(promise) {
  let cancelled = false;
  
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      value => cancelled ? reject(new Error('Cancelled')) : resolve(value),
      err => cancelled ? reject(new Error('Cancelled')) : reject(err)
    );
  });
  
  wrappedPromise.cancel = () => {
    cancelled = true;
  };
  
  return wrappedPromise;
}

// 10. Promise 防抖
function promiseDebounce(fn, delay) {
  let timeoutId;
  let lastPromise;
  
  return function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    lastPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        fn(...args).then(resolve).catch(reject);
      }, delay);
    });
    
    return lastPromise;
  };
}

// ==================== 测试用例 ====================

async function testExamples() {
  console.log('=== Promise 面试题测试 ===');
  
  // 测试 Promise.all
  const promises1 = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ];
  console.log('Promise.all:', await promiseAll(promises1));
  
  // 测试 Promise.race
  const promises2 = [
    new Promise(resolve => setTimeout(() => resolve('fast'), 100)),
    new Promise(resolve => setTimeout(() => resolve('slow'), 500))
  ];
  console.log('Promise.race:', await promiseRace(promises2));
  
  // 测试 Promise.retry
  let attempts = 0;
  const failingFn = () => {
    attempts++;
    if (attempts < 3) {
      return Promise.reject('失败');
    }
    return Promise.resolve('成功');
  };
  console.log('Promise.retry:', await promiseRetry(failingFn, 3, 100));
  
  // 测试超时控制
  const slowPromise = new Promise(resolve => 
    setTimeout(() => resolve('慢请求'), 2000)
  );
  try {
    await promiseTimeout(slowPromise, 1000);
  } catch (err) {
    console.log('超时测试:', err.message);
  }
  
  // 测试并发限制
  const tasks = Array.from({ length: 10 }, (_, i) => 
    () => new Promise(resolve => 
      setTimeout(() => resolve(i), Math.random() * 1000)
    )
  );
  console.log('并发限制测试:', await promiseLimit(tasks, 3));
}

// 导出所有函数
export {
  promiseAll,
  promiseRace,
  promiseAllSettled,
  promiseRetry,
  promiseTimeout,
  promiseLimit,
  promiseSequence,
  promiseCache,
  cancellablePromise,
  promiseDebounce
};

// 背诵要点：
// 1. Promise.all: 全部成功才成功，一个失败就失败
// 2. Promise.race: 第一个完成的决定结果
// 3. Promise.allSettled: 等待所有完成，包装结果
// 4. Promise.retry: 循环重试，达到最大次数后失败
// 5. 超时控制: Promise.race + setTimeout
// 6. 并发限制: 控制同时运行的数量
// 7. 顺序执行: reduce + then 链式调用
// 8. 缓存: Map 存储结果，避免重复请求
// 9. 取消机制: 标志位控制
// 10. 防抖: 延迟执行，清除之前的定时器
