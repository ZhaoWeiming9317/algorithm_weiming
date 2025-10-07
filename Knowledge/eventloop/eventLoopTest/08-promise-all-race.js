/**
 * Event Loop 复杂题 - Level 8
 * 考点：Promise.all、Promise.race、错误处理
 */

console.log('start');

const promise1 = new Promise((resolve, reject) => {
  console.log('promise1 executor');
  setTimeout(() => {
    console.log('promise1 resolve');
    resolve('promise1 成功');
  }, 100);
});

const promise2 = new Promise((resolve, reject) => {
  console.log('promise2 executor');
  setTimeout(() => {
    console.log('promise2 reject');
    reject('promise2 失败');
  }, 50);
});

const promise3 = new Promise((resolve) => {
  console.log('promise3 executor');
  setTimeout(() => {
    console.log('promise3 resolve');
    resolve('promise3 成功');
  }, 150);
});

// Promise.all - 所有成功才成功，一个失败就失败
Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log('Promise.all 成功:', results);
  })
  .catch((error) => {
    console.log('Promise.all 失败:', error);
  });

// Promise.race - 第一个完成的决定结果
Promise.race([promise1, promise2, promise3])
  .then((result) => {
    console.log('Promise.race 成功:', result);
  })
  .catch((error) => {
    console.log('Promise.race 失败:', error);
  });

console.log('end');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * start
 * promise1 executor
 * promise2 executor
 * promise3 executor
 * end
 * promise2 reject
 * Promise.all 失败: promise2 失败
 * Promise.race 失败: promise2 失败
 * promise1 resolve
 * promise3 resolve
 * 
 * 解析：
 * 
 * 同步代码：
 * 1. start
 * 2. promise1 executor（注册 100ms 定时器）
 * 3. promise2 executor（注册 50ms 定时器）
 * 4. promise3 executor（注册 150ms 定时器）
 * 5. end
 * 
 * 宏任务队列（按时间顺序）：
 * 1. 50ms：promise2 reject
 *    - Promise.all 立即失败（一个失败就失败）
 *    - Promise.race 立即失败（第一个完成的是 reject）
 * 2. 100ms：promise1 resolve（但 Promise.all 和 race 已经结束）
 * 3. 150ms：promise3 resolve（但 Promise.all 和 race 已经结束）
 * 
 * 关键点：
 * - Promise.all：
 *   - 所有 Promise 都 resolve 才会 resolve
 *   - 任何一个 reject 就会立即 reject
 *   - 结果顺序与传入顺序一致
 * 
 * - Promise.race：
 *   - 第一个完成（resolve 或 reject）的 Promise 决定结果
 *   - 其他 Promise 仍会执行，但结果被忽略
 * 
 * - Promise 状态一旦改变就不可逆：
 *   - pending → fulfilled
 *   - pending → rejected
 *   - 不能从 fulfilled/rejected 再改变
 */
