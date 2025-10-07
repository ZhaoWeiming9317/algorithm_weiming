/**
 * Event Loop 进阶题 - Level 4
 * 考点：Promise.all、并发执行
 */

console.log('start');

const promise1 = new Promise((resolve) => {
  console.log('promise1 executor');
  setTimeout(() => {
    console.log('promise1 setTimeout');
    resolve('promise1 resolved');
  }, 100);
});

const promise2 = new Promise((resolve) => {
  console.log('promise2 executor');
  setTimeout(() => {
    console.log('promise2 setTimeout');
    resolve('promise2 resolved');
  }, 50);
});

Promise.all([promise1, promise2]).then((results) => {
  console.log('Promise.all results:', results);
});

console.log('end');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * start
 * promise1 executor
 * promise2 executor
 * end
 * promise2 setTimeout
 * promise1 setTimeout
 * Promise.all results: ['promise1 resolved', 'promise2 resolved']
 * 
 * 解析：
 * 1. 同步代码：
 *    - start
 *    - promise1 executor（Promise 执行器同步执行）
 *    - 注册 promise1 的 setTimeout（100ms）
 *    - promise2 executor
 *    - 注册 promise2 的 setTimeout（50ms）
 *    - end
 * 
 * 2. 宏任务队列（按时间顺序）：
 *    - 50ms 后：promise2 setTimeout，promise2 resolve
 *    - 100ms 后：promise1 setTimeout，promise1 resolve
 * 
 * 3. 微任务队列：
 *    - Promise.all 等待所有 Promise 都 resolve 后才执行 then
 *    - 输出 Promise.all results
 * 
 * 关键点：
 * - Promise.all 并发执行所有 Promise
 * - 所有 Promise 都 resolve 后，Promise.all 才会 resolve
 * - Promise.all 的结果顺序与传入的 Promise 数组顺序一致，与 resolve 时间无关
 */
