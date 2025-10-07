/**
 * Node.js Event Loop 基础题
 * 考点：Node.js 事件循环、宏任务、微任务
 */

console.log('1. script start');

setTimeout(() => {
  console.log('2. setTimeout');
}, 0);

setImmediate(() => {
  console.log('3. setImmediate');
});

process.nextTick(() => {
  console.log('4. nextTick');
});

Promise.resolve().then(() => {
  console.log('5. Promise');
});

console.log('6. script end');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * 1. script start
 * 6. script end
 * 4. nextTick
 * 5. Promise
 * 2. setTimeout
 * 3. setImmediate
 * 
 * 解析：
 * 
 * Node.js 事件循环阶段：
 * 1. timers：执行 setTimeout/setInterval 回调
 * 2. pending callbacks：执行延迟到下一个循环的 I/O 回调
 * 3. idle, prepare：内部使用
 * 4. poll：检索新的 I/O 事件
 * 5. check：执行 setImmediate 回调
 * 6. close callbacks：执行关闭回调
 * 
 * 微任务优先级（在每个阶段之间执行）：
 * 1. process.nextTick（最高优先级）
 * 2. Promise.then/catch/finally
 * 
 * 执行顺序：
 * 1. 同步代码：script start, script end
 * 2. 微任务：
 *    - process.nextTick（优先级最高）
 *    - Promise.then
 * 3. 宏任务：
 *    - setTimeout（timers 阶段）
 *    - setImmediate（check 阶段）
 * 
 * 关键点：
 * - process.nextTick 优先级最高，在所有微任务之前
 * - Promise 是微任务，在宏任务之前
 * - setTimeout 和 setImmediate 的顺序取决于调用时机
 * - 在 I/O 回调中，setImmediate 总是先于 setTimeout
 */

console.log('\n=== Node.js vs 浏览器 ===');
console.log('Node.js 独有：');
console.log('- process.nextTick（优先级最高的微任务）');
console.log('- setImmediate（check 阶段的宏任务）');
console.log('\n浏览器独有：');
console.log('- requestAnimationFrame');
console.log('- requestIdleCallback');
