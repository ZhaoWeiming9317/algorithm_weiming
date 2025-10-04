/**
 * 并发控制器
 * 用于限制同时执行的异步任务数量
 * 
 * 特点：
 * 1. 维护执行中的任务数量
 * 2. 任务队列管理
 * 3. 自动执行等待中的任务
 */
class Scheduler {
  /**
   * @param {number} limit 最大并发数
   */
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  /**
   * 添加任务到调度器
   * @param {Function} promiseCreator 返回 Promise 的函数
   * @returns {Promise} 任务执行的 Promise
   */
  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      const task = {
        creator: promiseCreator,
        resolve,
        reject
      };

      this.queue.push(task);
      this.run();
    });
  }

  /**
   * 执行任务的核心方法
   * 当有任务完成时，自动执行队列中等待的任务
   */
  run() {
    while (this.running < this.limit && this.queue.length) {
      const { creator, resolve, reject } = this.queue.shift();
      this.running++;

      Promise.resolve(creator())
        .then(resolve, reject)
        .finally(() => {
          this.running--;
          this.run();
        });
    }
  }
}

/**
 * 任务队列
 * 用于串行执行异步任务
 * 
 * 特点：
 * 1. 任务按顺序执行
 * 2. 一个任务完成后才执行下一个
 * 3. 支持动态添加任务
 */
class TaskQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  /**
   * 添加任务到队列
   * @param {Function} task 返回 Promise 的任务函数
   * @returns {Promise} 任务执行的 Promise
   */
  addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject
      });
      
      if (!this.running) {
        this.run();
      }
    });
  }

  /**
   * 执行队列中的任务
   * 一次执行一个，完成后自动执行下一个
   */
  async run() {
    this.running = true;
    while (this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      try {
        const result = await task();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    }
    this.running = false;
  }
}

/**
 * 异步任务串行执行器
 * @param {Function[]} tasks 异步任务数组
 * @returns {Promise<any[]>} 所有任务的执行结果
 */
const serialExecute = async (tasks) => {
  const results = [];
  for (const task of tasks) {
    try {
      results.push(await task());
    } catch (err) {
      results.push(err);
    }
  }
  return results;
};

/**
 * 异步任务并行执行器（带限制）
 * @param {Function[]} tasks 异步任务数组
 * @param {number} limit 并发限制
 * @returns {Promise<any[]>} 所有任务的执行结果
 */
const parallelExecute = async (tasks, limit) => {
  const scheduler = new Scheduler(limit);
  return Promise.all(tasks.map(task => scheduler.add(() => task())));