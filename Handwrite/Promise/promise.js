/**
 * 超简化版 Promise - 面试背诵版本
 * 只保留核心功能，易于记忆和理解
 */
class MyPromise {
    constructor(executor) {
        // 三个核心属性
        this.state = 'pending';    // 状态：pending/fulfilled/rejected
        this.value = undefined;    // 存储结果值或错误原因
        this.callbacks = [];       // 存储待执行的回调函数

        // resolve 函数：将 Promise 状态改为成功
        const resolve = value => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';           // 状态不可逆，只能从 pending 改变
                this.value = value;                 // 保存成功的结果值
                this.callbacks.forEach(cb => cb.onFulfilled(value)); // 执行所有成功回调
            }
        };

        // reject 函数：将 Promise 状态改为失败
        const reject = reason => {
            if (this.state === 'pending') {
                this.state = 'rejected';            // 状态不可逆，只能从 pending 改变
                this.value = reason;                // 保存失败的错误原因
                this.callbacks.forEach(cb => cb.onRejected(reason)); // 执行所有失败回调
            }
        };

        // 立即执行 executor，捕获同步错误
        try {
            executor(resolve, reject);  // 为什么立即执行？因为 Promise 构造函数是同步的
        } catch (error) {
            reject(error);              // 为什么捕获错误？防止 executor 抛出异常导致 Promise 无法处理
        }
    }

    /**
     * then 方法：处理成功和失败的回调，返回新的 Promise 支持链式调用
     * 为什么返回新 Promise？因为链式调用的每个 then 都应该是独立的 Promise
     */
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            // 统一处理函数：根据当前状态决定执行成功还是失败回调
            const handle = () => {
                try {
                    if (this.state === 'fulfilled') {
                        // 成功状态：执行成功回调或透传值
                        const result = onFulfilled ? onFulfilled(this.value) : this.value;
                        resolve(result);  // 将结果传递给下一个 Promise
                    } else if (this.state === 'rejected') {
                        // 失败状态：执行失败回调或透传错误
                        const reason = onRejected ? onRejected(this.value) : this.value;
                        // 为什么用 resolve？因为错误被处理了
                        // 为什么用 reject？因为没有错误处理函数
                        onRejected ? resolve(onRejected(this.value)) : reject(this.value);
                    }
                } catch (error) {
                    reject(error);  // 为什么捕获错误？防止回调函数抛出异常
                }
            };

            if (this.state === 'pending') {
                // pending 状态：将处理函数加入回调队列，等待状态改变
                this.callbacks.push({ onFulfilled: handle, onRejected: handle });
            } else {
                // 非 pending 状态：立即执行处理函数
                handle();
            }
        });
    }

    /**
     * catch 方法：只处理失败回调
     * 为什么这样实现？因为 catch 就是 then 的语法糖，只传失败回调
     */
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    /**
     * 静态方法：快速创建已成功的 Promise
     * 为什么是静态方法？因为这是 Promise 类的方法，不是实例方法
     */
    static resolve(value) {
        return new MyPromise(resolve => resolve(value));
    }

    /**
     * 静态方法：快速创建已失败的 Promise
     * 为什么是静态方法？因为这是 Promise 类的方法，不是实例方法
     */
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}

// ==================== 背诵方法 ====================

/*
🧠 背诵要点（按重要性排序）：

1. 核心概念（必背）：
   - 三个状态：pending → fulfilled/rejected（不可逆）
   - 三个属性：state（状态）、value（值）、callbacks（回调队列）
   - 链式调用：then 返回新 Promise

2. constructor 背诵：
   - 初始化三个属性
   - 定义 resolve/reject 函数（改变状态 + 执行回调）
   - try-catch 执行 executor

3. then 方法背诵：
   - 返回新 Promise
   - 定义 handle 函数（处理成功/失败）
   - pending 时存回调，非 pending 时立即执行

4. catch 方法背诵：
   - 调用 then(null, onRejected)

5. 静态方法背诵：
   - resolve：new Promise(resolve => resolve(value))
   - reject：new Promise((_, reject) => reject(reason))

🎯 背诵技巧：
1. 先背概念，再背代码结构
2. 理解每个"为什么"，而不是死记硬背
3. 画状态转换图：pending → fulfilled/rejected
4. 理解链式调用：每个 then 都是新的 Promise
5. 理解异步处理：pending 时存回调，状态改变时执行

📝 面试答题步骤：
1. 先说 Promise 的三种状态和特性
2. 然后写 constructor（状态管理）
3. 再写 then 方法（链式调用）
4. 最后写 catch 和静态方法
5. 解释关键设计决策（为什么这样写）

💡 关键理解：
- Promise 是状态机：pending → fulfilled/rejected
- 异步处理：pending 时存回调，状态改变时执行
- 链式调用：每个 then 返回新 Promise
- 错误处理：catch 是 then 的语法糖
*/

class MyPromise2 {
    constructor(executor) {
        this.status = 'pending';
        this.callbacks = [];
        this.value = undefined;

        // resolve 和 reject 都要在构造函数里面定义好，因为对于用户来说这里面的操作是同步的
        resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                this.callbacks.forEach((cb) => cb.onFulfilled(value));
            }
        }

        reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.value = reason;
                this.callbacks.forEach((cb) => cb.onRejected(reason));
            }
        }

        try {
            executor(resolve, reject);
        } catch(e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, rejected) => {
            const handle = () => {
                try {
                    if (this.status === 'fulfilled') {
                        const result = onFulfilled ? onFulfilled(this.value) : this.value;
                        resolve(result);
                    } else if (this.status === 'rejected') {
                        const result = onRejected ? onRejected(this.value) : this.value;
                        onRejected ? resolve(result) : rejected(result);
                    }
                } catch(e) {
                    rejected(e);
                }
            }

            // 这里用一个 callbacks 表
            if (this.status === 'pending') {
                this.callbacks.push({
                    onFulfilled: handle,
                    onRejected: handle
                })
            } else {
                handle();
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    static resolve(fn) {
        return new MyPromise((resolve) => resolve(fn));
    }

    static rejected(fn) {
        return new MyPromise((_, rejected) => rejected(fn));
    }
}