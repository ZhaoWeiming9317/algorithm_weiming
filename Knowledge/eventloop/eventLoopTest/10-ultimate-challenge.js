/**
 * Event Loop 终极挑战 - Level 10
 * 考点：所有知识点综合运用
 */

console.log('1');

async function async1() {
  console.log('2');
  await async2();
  console.log('3');
  await async3();
  console.log('4');
}

async function async2() {
  console.log('5');
  return Promise.resolve().then(() => {
    console.log('6');
  });
}

async function async3() {
  console.log('7');
}

setTimeout(() => {
  console.log('8');
  Promise.resolve().then(() => {
    console.log('9');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('10');
    return Promise.resolve();
  })
  .then(() => {
    console.log('11');
  });

async1();

new Promise((resolve) => {
  console.log('12');
  resolve();
})
  .then(() => {
    console.log('13');
    return new Promise((resolve) => {
      console.log('14');
      resolve();
    });
  })
  .then(() => {
    console.log('15');
  });

Promise.resolve()
  .then(() => {
    console.log('16');
  })
  .then(() => {
    console.log('17');
  })
  .then(() => {
    console.log('18');
  });

console.log('19');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：1 2 5 12 19 10 16 6 13 14 3 7 11 15 17 4 18 8 9
 * 
 * 详细解析：
 * 
 * === 同步代码执行 ===
 * 1. console.log('1')
 * 2. 注册 setTimeout
 * 3. 注册微任务：Promise.then(10)
 * 4. 执行 async1()：
 *    - console.log('2')
 *    - 执行 async2()：
 *      - console.log('5')
 *      - 返回 Promise.resolve().then(6)
 *      - 注册微任务：then(6)
 *    - await 等待 async2 返回的 Promise
 * 5. 创建 Promise，执行器：console.log('12')，resolve
 *    - 注册微任务：then(13)
 * 6. 注册微任务：Promise.then(16)
 * 7. console.log('19')
 * 
 * === 第一轮微任务 ===
 * 1. then(10)：console.log('10')，return Promise.resolve()
 *    - 返回新 Promise，需要额外一轮微任务
 * 2. then(16)：console.log('16')
 *    - 注册下一个 then(17)
 * 
 * === 第二轮微任务 ===
 * 1. then(6)：console.log('6')
 *    - async2 的 Promise 完成
 * 2. then(13)：console.log('13')
 *    - 创建新 Promise，执行器：console.log('14')
 *    - 返回新 Promise
 * 
 * === 第三轮微任务 ===
 * 1. async2 完成，await 后续代码：console.log('3')
 *    - 执行 async3()：console.log('7')
 *    - await async3()
 * 2. then(11)：console.log('11')（第一轮 then(10) 返回的 Promise 完成）
 * 3. then(15)：console.log('15')（then(13) 返回的 Promise 完成）
 * 4. then(17)：console.log('17')
 *    - 注册下一个 then(18)
 * 
 * === 第四轮微任务 ===
 * 1. async3 完成，await 后续代码：console.log('4')
 * 2. then(18)：console.log('18')
 * 
 * === 宏任务 ===
 * 1. setTimeout：console.log('8')
 *    - 注册微任务：then(9)
 * 2. 微任务：console.log('9')
 * 
 * 关键难点：
 * 
 * 1. await 返回 Promise 的情况：
 *    - async2 返回 Promise.resolve().then(...)
 *    - await 需要等待这个 Promise 完成
 *    - 完成后才执行 console.log('3')
 * 
 * 2. Promise.then 返回 Promise：
 *    - then(10) 返回 Promise.resolve()
 *    - 需要额外的微任务轮次才能触发下一个 then(11)
 * 
 * 3. then 中创建新 Promise：
 *    - then(13) 中 return new Promise
 *    - 执行器同步执行：console.log('14')
 *    - 返回的 Promise 完成后才触发 then(15)
 * 
 * 4. 多个 Promise 链的交错执行：
 *    - 三条 Promise 链同时进行
 *    - 按微任务队列顺序执行
 *    - 每个 then 完成后注册下一个 then
 * 
 * 记忆技巧：
 * - 同步代码一口气执行完
 * - 微任务按注册顺序执行，一轮清空
 * - Promise.then 返回 Promise 需要额外轮次
 * - await 等待 Promise 完成需要额外轮次
 * - 每执行完一个宏任务，清空所有微任务
 */

/**
 * 验证方法：
 * 在浏览器控制台或 Node.js 中运行此代码
 * 观察实际输出是否与预期一致
 */
