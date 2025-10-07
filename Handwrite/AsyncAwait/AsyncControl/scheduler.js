/**
 * 并发控制器 - 最简单版本（面试必背！）
 * 核心思路：满了就等，完成了就通知下一个
 */
class Scheduler {
  constructor(limit) {
    this.limit = limit;      // 并发限制
    this.count = 0;          // 当前正在执行的任务数
    this.queue = [];         // 等待队列（存储 resolve 函数）
  }

    add(task) {
        return new Promise(async (resolve, reject) => {
            this.queue.push(() => task().then(resolve, reject));
            this.run();
        });
    }

    run() {
        if (this.count >= this.limit) return;
        if (this.queue.length === 0) return;
        const task = this.queue.shift();
        this.count++;
        task().finally(() => {
            this.count--;
            this.run();
        });
    }
}

class Scheduler {
  constructor(limit) {
    this.limit = limit;
    this.count = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve, reject));
      this.run();
    });
  }

  run() {
    if (this.limit <= this.count) return;
    if (this.queue.length === 0) return;

    const task = this.queue.shift();
    this.count++;
    task.finally(() => {
      this.count--;
      this.run();
    });
  }
}
/**
 * 使用示例：控制并发执行多个任务
 */
const parallelExecute = async (tasks, limit) => {
  const scheduler = new Scheduler(limit);
  const promises = tasks.map(task => scheduler.add(task));
  return Promise.all(promises);
};


export {
  Scheduler,
  parallelExecute
};

