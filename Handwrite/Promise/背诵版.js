/**
 * Promise 面试题背诵版 - 核心代码
 * 按面试频率排序，只保留关键实现
 */

// ==================== 必背 TOP 5 ====================

// 1. Promise.all (必考)
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          if (++completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}

// 2. Promise.race (必考)
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject);
    });
  });
}

// 3. Promise.allSettled (高频)
function promiseAllSettled(promises) {
  return Promise.all(
    promises.map(promise => 
      Promise.resolve(promise)
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    )
  );
}

// 4. Promise.retry (高频)
function promiseRetry(fn, times = 3) {
  return new Promise((resolve, reject) => {
    function attempt() {
      fn().then(resolve).catch(err => {
        if (--times > 0) {
          setTimeout(attempt, 1000);
        } else {
          reject(err);
        }
      });
    }
    attempt();
  });
}

// 5. Promise 超时控制 (高频)
function promiseTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// ==================== 进阶题 ====================

// 6. 并发限制
function promiseLimit(tasks, limit) {
  return new Promise((resolve, reject) => {
    const results = [];
    let running = 0;
    let index = 0;
    
    function run() {
      while (running < limit && index < tasks.length) {
        const currentIndex = index++;
        running++;
        
        tasks[currentIndex]()
          .then(value => {
            results[currentIndex] = value;
            running--;
            if (index === tasks.length && running === 0) {
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

// 7. 顺序执行
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
  return (key, fn) => {
    if (cache.has(key)) return cache.get(key);
    const promise = fn().catch(err => {
      cache.delete(key);
      throw err;
    });
    cache.set(key, promise);
    return promise;
  };
}

// ==================== 背诵口诀 ====================
/*
1. Promise.all: 全部成功才成功，一个失败就失败
   - 遍历promises，用Promise.resolve包装
   - 成功时存储结果，失败时直接reject
   - 计数器判断是否全部完成

2. Promise.race: 第一个完成的决定结果
   - 遍历promises，谁先完成就resolve/reject谁

3. Promise.allSettled: 等待所有完成，包装结果
   - map + Promise.resolve + then/catch
   - 成功包装成{status:'fulfilled', value}
   - 失败包装成{status:'rejected', reason}

4. Promise.retry: 循环重试，达到最大次数后失败
   - 递归调用，计数器控制重试次数
   - setTimeout控制重试间隔

5. 超时控制: Promise.race + setTimeout
   - 原promise vs 超时promise

6. 并发限制: 控制同时运行的数量
   - while循环 + 计数器
   - 完成一个任务后继续下一个

7. 顺序执行: reduce + then 链式调用
   - reduce累积结果，then串行执行

8. 缓存: Map存储结果，避免重复请求
   - Map存储promise，失败时删除缓存
*/

export {
  promiseAll,
  promiseRace, 
  promiseAllSettled,
  promiseRetry,
  promiseTimeout,
  promiseLimit,
  promiseSequence,
  promiseCache
};
