/**
 * Event Loop 进阶题 - Level 5
 * 考点：async/await 与 Promise.all 结合
 */

async function fetchData(name, delay) {
  console.log(`${name} 开始请求`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name} 请求完成`);
      resolve(`${name} 的数据`);
    }, delay);
  });
}

async function sequential() {
  console.log('=== 串行执行 ===');
  const data1 = await fetchData('API1', 100);
  console.log('收到:', data1);
  const data2 = await fetchData('API2', 50);
  console.log('收到:', data2);
  console.log('串行执行完成');
}

async function parallel() {
  console.log('=== 并行执行 ===');
  const results = await Promise.all([
    fetchData('API3', 100),
    fetchData('API4', 50)
  ]);
  console.log('收到:', results);
  console.log('并行执行完成');
}

console.log('开始');
sequential().then(() => {
  parallel();
});

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * 开始
 * === 串行执行 ===
 * API1 开始请求
 * API1 请求完成
 * 收到: API1 的数据
 * API2 开始请求
 * API2 请求完成
 * 收到: API2 的数据
 * 串行执行完成
 * === 并行执行 ===
 * API3 开始请求
 * API4 开始请求
 * API4 请求完成
 * API3 请求完成
 * 收到: ['API3 的数据', 'API4 的数据']
 * 并行执行完成
 * 
 * 解析：
 * 
 * 串行执行（sequential）：
 * 1. await 会等待 Promise resolve 后才继续执行
 * 2. API1 请求 100ms → 完成 → 收到数据
 * 3. 然后才开始 API2 请求 50ms → 完成 → 收到数据
 * 4. 总耗时：100ms + 50ms = 150ms
 * 
 * 并行执行（parallel）：
 * 1. Promise.all 同时发起所有请求
 * 2. API3 和 API4 同时开始
 * 3. API4 先完成（50ms），API3 后完成（100ms）
 * 4. 等待所有 Promise 都 resolve 后，await 才继续
 * 5. 总耗时：max(100ms, 50ms) = 100ms
 * 
 * 关键点：
 * - await 串行执行：一个接一个，总耗时是累加
 * - Promise.all 并行执行：同时进行，总耗时是最长的那个
 * - 实际开发中，独立的异步操作应该使用 Promise.all 提高性能
 */
