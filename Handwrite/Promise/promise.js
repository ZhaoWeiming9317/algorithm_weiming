class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.callbacks = [];

        const resolve = value => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.callbacks.forEach(callback => callback.onFulfilled(value));
            }
        };

        const reject = reason => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.value = reason;
                this.callbacks.forEach(callback => callback.onRejected(reason));
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            const handle = () => {
                try {
                    if (this.state === 'fulfilled') {
                        resolve(onFulfilled ? onFulfilled(this.value) : this.value);
                    }
                    if (this.state === 'rejected') {
                        if (onRejected) {
                            resolve(onRejected(this.value));
                        } else {
                            reject(this.value);
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            };

            if (this.state === 'pending') {
                this.callbacks.push({
                    onFulfilled: () => handle(),
                    onRejected: () => handle()
                });
            } else {
                handle();
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    static resolve(value) {
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}

// 测试
const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success');
    }, 1000);
});

promise
    .then(value => {
        console.log(value); // 'success'
        return value + '!';
    })
    .then(value => {
        console.log(value); // 'success!'
    })
    .catch(error => {
        console.error(error);
    });
