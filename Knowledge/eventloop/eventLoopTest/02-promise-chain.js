/**
 * Event Loop 进阶题 - Level 2
 * 考点：Promise 链式调用、微任务队列
 */

console.log('start');

Promise.resolve()
  .then(() => {
    console.log('promise1');
  })
  .then(() => {
    console.log('promise2');
  });

Promise.resolve()
  .then(() => {
    console.log('promise3');
  })
  .then(() => {
    console.log('promise4');
  });

console.log('end');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：start end promise1 promise3 promise2 promise4
 * 
 * 解析：
 * 1. 同步代码：start, end
 * 2. 第一轮微任务：promise1, promise3（两个 Promise 的第一个 then）
 * 3. 第二轮微任务：promise2, promise4（链式调用的第二个 then）
 * 
 * 关键点：
 * - Promise.then 返回新的 Promise，后续的 then 要等前一个 then 执行完才会进入微任务队列
 * - 同一轮微任务中，多个独立的 Promise.then 按注册顺序执行
 */
