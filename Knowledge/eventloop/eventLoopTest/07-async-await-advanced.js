/**
 * Event Loop 复杂题 - Level 7
 * 考点：async/await、Promise 链式调用、执行顺序
 */

async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
  return 'async1 return';
}

async function async2() {
  console.log('async2 start');
  return new Promise((resolve) => {
    console.log('async2 promise');
    resolve('async2 return');
  });
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1().then((res) => {
  console.log('async1 then:', res);
});

new Promise((resolve) => {
  console.log('promise1');
  resolve();
})
  .then(() => {
    console.log('promise2');
  })
  .then(() => {
    console.log('promise3');
  });

console.log('script end');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * script start
 * async1 start
 * async2 start
 * async2 promise
 * promise1
 * script end
 * promise2
 * async1 end
 * promise3
 * async1 then: async1 return
 * setTimeout
 * 
 * 解析：
 * 
 * 同步代码执行：
 * 1. script start
 * 2. 注册 setTimeout
 * 3. 执行 async1()：
 *    - async1 start
 *    - 执行 async2()：
 *      - async2 start
 *      - 创建 Promise，执行器同步执行：async2 promise
 *      - 返回 Promise
 *    - await 等待 async2 返回的 Promise resolve
 *    - async1 end 进入微任务队列（等待一轮）
 * 4. Promise 执行器：promise1
 * 5. script end
 * 
 * 第一轮微任务：
 * 1. promise2（第一个 then）
 * 2. async2 的 Promise resolve，触发 await 后续代码
 * 
 * 第二轮微任务：
 * 1. async1 end（await 后续代码）
 * 2. promise3（第二个 then）
 * 
 * 第三轮微任务：
 * 1. async1 then: async1 return（async1 函数返回值的 then）
 * 
 * 宏任务：
 * 1. setTimeout
 * 
 * 关键点：
 * - await 一个 Promise 时，需要等待该 Promise resolve
 * - async2 返回的是 Promise，所以 await 会等待这个 Promise
 * - await 后面的代码要等待额外一轮微任务
 * - async 函数返回的 Promise 的 then 也是微任务
 */
