/**
 * 事件循环综合题
 * 涉及知识点：
 * 1. 宏任务（setTimeout, setImmediate）
 * 2. 微任务（Promise, process.nextTick）
 * 3. async/await
 * 4. Promise 链式调用
 * 5. 同步代码执行顺序
 */

console.log('1. 开始执行'); // 同步代码

setTimeout(() => {
    console.log('2. setTimeout1');
    Promise.resolve()
        .then(() => {
            console.log('3. setTimeout1 中的 Promise.then');
        });
}, 0);

new Promise((resolve) => {
    console.log('4. Promise 执行器');
    setTimeout(() => {
        console.log('5. Promise 中的 setTimeout');
        resolve('resolved');
    }, 0);
}).then(res => {
    console.log('6. Promise.then:', res);
    setTimeout(() => {
        console.log('7. Promise.then 中的 setTimeout');
    }, 0);
});

async function async1() {
    console.log('8. async1 开始');
    await async2();
    console.log('9. async1 结束');
}

async function async2() {
    console.log('10. async2');
}

async1();

new Promise(resolve => {
    console.log('11. Promise2 执行器');
    resolve();
}).then(() => {
    console.log('12. Promise2.then');
});

setTimeout(() => {
    console.log('13. setTimeout2');
}, 0);

console.log('14. 结束');

/**
 * 请问输出顺序是什么？为什么？
 * 
 * 分析过程：
 * 1. 首先执行同步代码
 *    - console.log('1. 开始执行')
 *    - 注册第一个 setTimeout 回调
 *    - 创建第一个 Promise，执行器是同步的：console.log('4. Promise 执行器')
 *    - 注册 Promise 中的 setTimeout
 *    - 执行 async1()：
 *      - console.log('8. async1 开始')
 *      - 执行 async2()：console.log('10. async2')
 *      - await 后面的代码进入微任务队列
 *    - 创建第二个 Promise，执行器同步执行：console.log('11. Promise2 执行器')
 *    - 注册最后一个 setTimeout
 *    - console.log('14. 结束')
 * 
 * 2. 同步代码执行完，检查微任务队列
 *    - async1 中 await 后面的代码：console.log('9. async1 结束')
 *    - Promise2.then：console.log('12. Promise2.then')
 * 
 * 3. 执行宏任务队列
 *    - 第一个 setTimeout：
 *      console.log('2. setTimeout1')
 *      生成微任务：console.log('3. setTimeout1 中的 Promise.then')
 *    - Promise 中的 setTimeout：
 *      console.log('5. Promise 中的 setTimeout')
 *      resolve 触发 then：console.log('6. Promise.then: resolved')
 *      注册新的 setTimeout
 *    - 最后的 setTimeout：console.log('13. setTimeout2')
 *    - Promise.then 中的 setTimeout：console.log('7. Promise.then 中的 setTimeout')
 * 
 * 最终输出顺序：
 * 1. 开始执行
 * 4. Promise 执行器
 * 8. async1 开始
 * 10. async2
 * 11. Promise2 执行器
 * 14. 结束
 * 9. async1 结束
 * 12. Promise2.then
 * 2. setTimeout1
 * 3. setTimeout1 中的 Promise.then
 * 5. Promise 中的 setTimeout
 * 6. Promise.then: resolved
 * 13. setTimeout2
 * 7. Promise.then 中的 setTimeout
 */
