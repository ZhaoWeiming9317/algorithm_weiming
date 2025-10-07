/**
 * Event Loop 综合题 - Level 9
 * 考点：async/await、Promise.all、宏任务、微任务、错误处理
 */

async function fetchUser() {
  console.log('fetchUser 开始');
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('fetchUser 完成');
      resolve({ id: 1, name: 'Alice' });
    }, 100);
  });
}

async function fetchPosts(userId) {
  console.log('fetchPosts 开始');
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('fetchPosts 完成');
      resolve([
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' }
      ]);
    }, 50);
  });
}

async function fetchComments(postId) {
  console.log(`fetchComments ${postId} 开始`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`fetchComments ${postId} 完成`);
      resolve([`Comment 1 for post ${postId}`, `Comment 2 for post ${postId}`]);
    }, 30);
  });
}

async function loadData() {
  console.log('=== 开始加载数据 ===');
  
  // 串行：先获取用户
  const user = await fetchUser();
  console.log('用户信息:', user.name);
  
  // 串行：再获取文章
  const posts = await fetchPosts(user.id);
  console.log('文章数量:', posts.length);
  
  // 并行：同时获取所有文章的评论
  const commentsPromises = posts.map(post => fetchComments(post.id));
  const allComments = await Promise.all(commentsPromises);
  console.log('评论总数:', allComments.flat().length);
  
  console.log('=== 数据加载完成 ===');
}

console.log('程序开始');

setTimeout(() => {
  console.log('setTimeout 1');
}, 0);

loadData().then(() => {
  console.log('loadData 完成');
  Promise.resolve().then(() => {
    console.log('最后的微任务');
  });
});

Promise.resolve().then(() => {
  console.log('独立的 Promise');
});

setTimeout(() => {
  console.log('setTimeout 2');
}, 0);

console.log('程序结束');

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * 程序开始
 * === 开始加载数据 ===
 * fetchUser 开始
 * 程序结束
 * 独立的 Promise
 * setTimeout 1
 * setTimeout 2
 * fetchUser 完成
 * 用户信息: Alice
 * fetchPosts 开始
 * fetchPosts 完成
 * 文章数量: 2
 * fetchComments 1 开始
 * fetchComments 2 开始
 * fetchComments 1 完成
 * fetchComments 2 完成
 * 评论总数: 4
 * === 数据加载完成 ===
 * loadData 完成
 * 最后的微任务
 * 
 * 解析：
 * 
 * 1. 同步代码执行：
 *    - 程序开始
 *    - 注册 setTimeout 1
 *    - 执行 loadData()：
 *      - === 开始加载数据 ===
 *      - fetchUser 开始（注册 100ms 定时器）
 *      - await 暂停，等待 Promise
 *    - 注册微任务：独立的 Promise
 *    - 注册 setTimeout 2
 *    - 程序结束
 * 
 * 2. 第一轮微任务：
 *    - 独立的 Promise
 * 
 * 3. 宏任务队列：
 *    - setTimeout 1
 *    - setTimeout 2
 *    - 100ms 后：fetchUser 完成
 *      - 继续执行 loadData：用户信息: Alice
 *      - fetchPosts 开始（注册 50ms 定时器）
 *    - 50ms 后：fetchPosts 完成
 *      - 文章数量: 2
 *      - 并行发起 fetchComments（两个 30ms 定时器）
 *    - 30ms 后：两个 fetchComments 完成
 *      - 评论总数: 4
 *      - === 数据加载完成 ===
 *      - loadData 的 then：loadData 完成
 *      - 微任务：最后的微任务
 * 
 * 关键点：
 * - async 函数中的 await 会暂停函数执行，但不阻塞主线程
 * - 串行 await：fetchUser → fetchPosts，总耗时累加
 * - 并行 Promise.all：两个 fetchComments 同时执行，耗时取最大值
 * - 实际总耗时：100ms + 50ms + 30ms = 180ms
 * - 如果全部串行：100ms + 50ms + 30ms + 30ms = 210ms
 */
