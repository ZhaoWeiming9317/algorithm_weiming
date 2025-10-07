/**
 * Event Loop 复杂题 - Level 6
 * 考点：宏任务、微任务混合，多层嵌套
 */

console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

new Promise((resolve) => {
  console.log('4');
  resolve();
}).then(() => {
  console.log('5');
  setTimeout(() => {
    console.log('6');
  }, 0);
});

setTimeout(() => {
  console.log('7');
  Promise.resolve().then(() => {
    console.log('8');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('9');
});

console.log('10');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：1 4 10 5 9 2 3 7 8 6
 * 
 * 解析：
 * 
 * 第一轮：执行同步代码
 * - 输出：1
 * - 注册宏任务：setTimeout(2)
 * - Promise 执行器（同步）：输出 4，resolve
 * - 注册微任务：then(5)
 * - 注册宏任务：setTimeout(7)
 * - 注册微任务：then(9)
 * - 输出：10
 * 
 * 第二轮：执行微任务队列
 * - 执行 then(5)：输出 5，注册宏任务 setTimeout(6)
 * - 执行 then(9)：输出 9
 * 
 * 第三轮：执行宏任务队列
 * - 执行 setTimeout(2)：输出 2，注册微任务 then(3)
 *   - 立即执行微任务：输出 3
 * - 执行 setTimeout(7)：输出 7，注册微任务 then(8)
 *   - 立即执行微任务：输出 8
 * - 执行 setTimeout(6)：输出 6
 * 
 * 关键点：
 * - 每执行完一个宏任务，都要清空微任务队列
 * - 宏任务按注册顺序执行
 * - 微任务在当前宏任务执行完后立即执行
 */
