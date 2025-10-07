/**
 * Event Loop 基础题 - Level 1
 * 考点：同步代码、setTimeout、Promise.then
 */

console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：1 4 3 2
 * 
 * 解析：
 * 1. 执行同步代码：console.log('1') 和 console.log('4')
 * 2. 执行微任务队列：Promise.then 输出 '3'
 * 3. 执行宏任务队列：setTimeout 输出 '2'
 * 
 * 记住：同步 → 微任务 → 宏任务
 */
