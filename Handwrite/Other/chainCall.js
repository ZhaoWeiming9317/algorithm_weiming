/**
 * 实现链式调用的休眠功能
 * 要求：
 * 1. sleep 和 firstSleep 都是休眠功能
 * 2. work 直接打印
 * 3. 必须按照链式调用的顺序执行
 * 4. firstSleep 必须第一个执行
 * 
 * 示例：
 * man.work().sleep(1000).firstSleep(5000).work().sleep(1000)
 * 执行顺序：
 * 1. firstSleep(5000) - 休眠5秒
 * 2. sleep(1000) - 休眠1秒
 * 3. work() - 打印
 * 4. sleep(1000) - 休眠1秒
 */

class ChainCall {
    constructor() {
        // 存储调用队列
        this.queue = [];
        // 标记是否已经开始执行
        this.isRunning = false;
    }

    sleep(time) {
        // 将sleep任务加入队列, 相当于是 setTimeout(resolve, time) 然后过一段时间才能被执行呢
        this.queue.push(() => new Promise(resolve => setTimeout(resolve, time)));
        // 如果没有在执行，则开始执行
        this.run();
        return this;
    }

    firstSleep(time) {
        // 将firstSleep任务插入到队列最前面，
        this.queue.unshift(() => new Promise(resolve => setTimeout(resolve, time)));
        this.run();
        return this;
    }

    work() {
        // 将work任务加入队列
        this.queue.push(() => {
            console.log('work');
            return Promise.resolve();
        });
        this.run();
        return this;
    }

    async run() {
        // 如果已经在执行，直接返回
        if (this.isRunning) return;
        this.isRunning = true;

        // 依次执行队列中的任务
        while (this.queue.length) {
            const task = this.queue.shift();
            await task();
        }

        this.isRunning = false;
    }
}

// 创建实例
const man = new ChainCall();

// 测试用例
man.work().sleep(1000).firstSleep(5000).work().sleep(1000);

/**
 * 执行结果：
 * (等待5秒 - firstSleep(5000))
 * (等待1秒 - sleep(1000))
 * work
 * (等待1秒 - sleep(1000))
 */

module.exports = ChainCall;
