/**
 * Event Loop 进阶题 - Level 3
 * 考点：async/await、微任务执行时机
 */

async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise(resolve => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * script start
 * async1 start
 * async2
 * promise1
 * script end
 * async1 end
 * promise2
 * setTimeout
 * 
 * 解析：
 * 1. 同步代码执行：
 *    - script start
 *    - 注册 setTimeout
 *    - 执行 async1()：
 *      - async1 start
 *      - 执行 async2()：async2
 *      - await 后面的代码（async1 end）进入微任务队列
 *    - Promise 执行器（同步）：promise1
 *    - script end
 * 
 * 2. 微任务队列：
 *    - async1 end（await 后面的代码相当于 Promise.then）
 *    - promise2
 * 
 * 3. 宏任务队列：
 *    - setTimeout
 * 
 * 关键点：
 * - await 后面的代码会被包装成 Promise.then，进入微任务队列
 * - async 函数返回的是 Promise
 * - Promise 的执行器（executor）是同步执行的
 */
