/**
 * 串行执行器 - 最简版
 * 核心思路：依次 await 执行每个任务
 * 
 * @param {Function[]} tasks 异步任务数组
 * @returns {Promise<any[]>} 所有任务的执行结果
 */
const serialExecute = async (tasks) => {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
};

/**
 * 任务队列 - 类版本（可选）
 * 适合需要动态添加任务的场景
 */
class TaskQueue {
  constructor() {
    this.promise = Promise.resolve(); // 用一个 Promise 链串联所有任务
  }

  async add(task) {
    // 将新任务添加到 Promise 链的末尾
    return this.promise = this.promise.then(task);
  }
}

module.exports = {
  TaskQueue,
  serialExecute
};

