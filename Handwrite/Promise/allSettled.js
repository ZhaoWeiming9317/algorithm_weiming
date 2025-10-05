function promiseAllSettled(promises) {
    return Promise.all(
        promises.map(promise => {
            // 每个 promise 都会被包装成一个新的 Promise
            return Promise.resolve(promise)
                .then(value => ({ status: 'fulfilled', value }))
                .catch(reason => ({ status: 'rejected', reason }));
        })
    );
}

// 更详细的解释版本
function promiseMyAllSettled(promises) {
    return Promise.all(
        promises.map(promise => {
            return Promise.resolve(promise)
                .then(value => ({ status: 'fulfilled', value }))
                .catch(reason => ({ status: 'rejected', reason }))
        })
    )
}

// 测试 - 演示你的困惑点
console.log('=== 演示 .then() 返回的是什么 ===');

const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
const p3 = Promise.resolve(3);

// 看看 map 返回的是什么
const mappedPromises = [p1, p2, p3].map(promise => 
    Promise.resolve(promise)
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
);

console.log('map 返回的结果类型:');
console.log(mappedPromises); // 这是 Promise 数组，不是值数组！
console.log('第一个元素的类型:', typeof mappedPromises[0]); // object (Promise)
console.log('第一个元素:', mappedPromises[0]);

// 这就是为什么需要 Promise.all - 等待所有 Promise 解析
console.log('\n=== Promise.all 的作用 ===');
Promise.all(mappedPromises).then(results => {
    console.log('Promise.all 解析后的结果:');
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 1 },
    //   { status: 'rejected', reason: 'error' },
    //   { status: 'fulfilled', value: 3 }
    // ]
});

// 测试完整的 promiseAllSettled
console.log('\n=== 完整测试 ===');
promiseAllSettled([p1, p2, p3]).then(results => {
    console.log('promiseAllSettled 结果:');
    console.log(results);
});
