function promiseRetry(fn, maxAttempts = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        let attempts = 1;

        function attempt() {
            Promise.resolve(fn())  // 确保fn返回的是Promise
                .then(resolve)
                .catch(err => {
                    if (attempts >= maxAttempts) {
                        reject(err);
                        return;
                    }
                    attempts++;
                    setTimeout(attempt, delay);
                });
        }
        
        attempt();
    });
}

function promiseRetry2(fn, maxAttempts = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        let attempts = 1;

        function attempt() {
            Promise.resolve(fn())
                .then(resolve)
                .catch(reason => {
                    if (attempts >= maxAttempts) {
                        reject(reason);
                        return;
                    }
                    attempts++;
                    setTimeout(attempt, delay);
                })
        }

        attempt();
    });
}

// 测试用例
function test() {
    // 测试返回Promise的函数
    const asyncFn = () => new Promise((resolve, reject) => {
        Math.random() > 0.5 ? resolve('success') : reject('failed');
    });

    // 测试返回普通值的函数
    const syncFn = () => 'sync value';

    promiseRetry(asyncFn, 3, 1000)
        .then(console.log)
        .catch(console.error);

    promiseRetry(syncFn, 3, 1000)
        .then(console.log)
        .catch(console.error);
}

// test();
module.exports = promiseRetry;
