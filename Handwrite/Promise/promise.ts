// Promise 的三种状态
enum PromiseState {
    PENDING = 'pending',     // 等待态
    FULLFILLED = 'fullfilled', // 成功态
    REJECTED = 'rejected',   // 失败态
}

class MyPromise {
    // 当前状态
    private state: PromiseState = PromiseState.PENDING;
    // 成功值
    private value: any = null;
    // 失败原因
    private reason: any = null;
    // 成功回调函数队列
    private onFulfilledCallbacks: Function[] = [];
    // 失败回调函数队列
    private onRejectedCallbacks: Function[] = [];

    constructor(executor: (resolve: (value: any) => void, reject: (reason: any) => void) => void) {
        try {
            // 立即执行executor，并传入resolve和reject
            executor(this.resolve, this.reject);
        } catch(e) {
            // 如果执行器抛出错误，直接reject
            this.reject(e);
        }
    }

    // 使用箭头函数确保this指向始终正确
    private resolve = (value: any): void => {
        // 只有pending状态才能转换为fulfilled
        if (this.state === PromiseState.PENDING) {
            this.state = PromiseState.FULLFILLED;
            this.value = value;
            // 执行所有成功回调
            this.onFulfilledCallbacks.forEach(fn => fn());
        }
    }

    private reject = (reason: any): void => {
        // 只有pending状态才能转换为rejected
        if (this.state === PromiseState.PENDING) {
            this.state = PromiseState.REJECTED;
            this.reason = reason;
            // 执行所有失败回调
            this.onRejectedCallbacks.forEach(fn => fn());
        }
    }

    then(onFulfilled?: ((value: any) => any) | null, onRejected?: ((reason: any) => any) | null): MyPromise {
        // 返回 promise 是为了支持链式调用
        return new MyPromise((resolve, reject) => {
            // 处理成功状态的回调
            const handleFullfilled = (value: any) => {
                try {
                    if (onFulfilled) {
                        // 有 onFulfilled 后就处理后返回
                        const result = onFulfilled(value);
                        resolve(result);
                    } else {
                        // 如果没有提供成功回调，直接传递值
                        resolve(value);
                    }
                } catch(error) {
                    reject(error);
                }
            }

            // 处理失败状态的回调
            const handleRejected = (reason: any) => {
                try {
                    if (onRejected) {
                        const result = onRejected(reason);
                        resolve(result);
                    } else {
                        // 如果没有提供失败回调，直接传递错误
                        reject(reason);
                    }
                } catch(error) {
                    reject(error);
                }
            }

            // 根据当前状态决定如何处理回调
            if (this.state === PromiseState.FULLFILLED) {
                // 如果是成功态，直接执行成功回调
                handleFullfilled(this.value);
            } else if (this.state === PromiseState.REJECTED) {
                // 如果是失败态，直接执行失败回调
                handleRejected(this.reason);
            } else {
                // 如果是等待态，将回调放入队列
                this.onFulfilledCallbacks.push(() => handleFullfilled(this.value));
                this.onRejectedCallbacks.push(() => handleRejected(this.reason));
            }
        });
    }
}

// 使用示例：

// 1. 基本使用
const promise1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve("成功");
        // 或者失败
        // reject(new Error("失败"));
    }, 1000);
});

// 2. 链式调用
const promise2 = new MyPromise((resolve) => {
    resolve(1);
}).then(
    value => value + 1,
    error => {
        console.error(error);
        return 0;
    }
).then(
    value => {
        console.log(value); // 2
        return value * 2;
    }
);

// 3. 错误处理
const promise3 = new MyPromise((resolve, reject) => {
    reject(new Error("出错了"));
}).then(
    value => {
        console.log("不会执行到这里");
        return value;
    },
    error => {
        console.error(error.message); // "出错了"
        return "错误已处理";
    }
);

// 4. 异步处理
const promise4 = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve(["a", "b"]);
    }, 1000);
}).then(
    arr => {
        console.log(arr); // ["a", "b"]
        return arr.join(",");
    }
).then(
    str => {
        console.log(str); // "a,b"
        return str.toUpperCase();
    }
);

// 5. 多次调用
const asyncPromise = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve("success");
    }, 1000);
});

// 多次调用then
asyncPromise.then(value => {
    console.log("callback1:", value);
});

asyncPromise.then(value => {
    console.log("callback2:", value);
});

asyncPromise.then(value => {
    console.log("callback3:", value);
});

// 1秒后依次打印：
// callback1: success
// callback2: success
// callback3: success