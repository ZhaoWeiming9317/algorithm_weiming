/**
 * Node.js 进程和集群
 * 考点：process、child_process、cluster
 */

console.log('=== process 对象 ===');

/**
 * 1. process 对象
 * 
 * process 是全局对象，提供当前 Node.js 进程的信息和控制
 */

// 进程信息
console.log('进程 ID:', process.pid);
console.log('父进程 ID:', process.ppid);
console.log('Node 版本:', process.version);
console.log('平台:', process.platform);
console.log('架构:', process.arch);
console.log('当前工作目录:', process.cwd());
console.log('执行路径:', process.execPath);

// 环境变量
console.log('\n环境变量示例:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// 命令行参数
console.log('\n命令行参数:');
console.log('process.argv:', process.argv);
// 运行：node script.js arg1 arg2
// process.argv[0]: node 路径
// process.argv[1]: 脚本路径
// process.argv[2]: arg1
// process.argv[3]: arg2

/**
 * 2. process 常用方法
 */

console.log('\n=== process 方法 ===');

// 退出进程
// process.exit(0); // 0 表示成功，非 0 表示失败

// 监听退出事件
process.on('exit', (code) => {
  console.log(`进程即将退出，退出码: ${code}`);
});

// 监听未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 记录日志后退出
  // process.exit(1);
});

// 监听未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});

// 监听信号
process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号（Ctrl+C）');
  process.exit(0);
});

/**
 * 3. child_process 子进程
 * 
 * Node.js 可以创建子进程来执行其他程序
 * 
 * 四种创建方式：
 * 1. spawn：启动子进程执行命令
 * 2. exec：启动子进程执行命令，有回调
 * 3. execFile：执行文件
 * 4. fork：创建 Node.js 子进程
 */

console.log('\n=== child_process 示例 ===');

const { spawn, exec, execFile, fork } = require('child_process');

// 1. spawn - 流式输出
// const ls = spawn('ls', ['-lh', '/usr']);
// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });
// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });
// ls.on('close', (code) => {
//   console.log(`子进程退出，退出码 ${code}`);
// });

// 2. exec - 缓冲输出
// exec('ls -lh /usr', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`执行错误: ${error}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });

// 3. fork - 创建 Node.js 子进程
// const child = fork('./child.js');
// child.on('message', (msg) => {
//   console.log('收到子进程消息:', msg);
// });
// child.send({ hello: 'world' });

/**
 * 4. cluster 集群
 * 
 * cluster 模块可以创建多个工作进程，充分利用多核 CPU
 * 
 * 工作原理：
 * - 主进程（master）负责管理工作进程
 * - 工作进程（worker）负责处理请求
 * - 主进程监听端口，将请求分发给工作进程
 */

console.log('\n=== cluster 示例 ===');

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  console.log(`CPU 核心数: ${numCPUs}`);
  
  // 创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // 监听工作进程退出
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    // 重启工作进程
    cluster.fork();
  });
  
  // 监听工作进程上线
  cluster.on('online', (worker) => {
    console.log(`工作进程 ${worker.process.pid} 已上线`);
  });
  
} else {
  // 工作进程创建 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`由进程 ${process.pid} 处理\n`);
  }).listen(8000);
  
  console.log(`工作进程 ${process.pid} 已启动`);
}

/**
 * 5. 进程间通信（IPC）
 * 
 * 父子进程可以通过消息传递进行通信
 */

console.log('\n=== IPC 示例 ===');

// 父进程代码
// const child = fork('./child.js');
// 
// child.on('message', (msg) => {
//   console.log('父进程收到消息:', msg);
// });
// 
// child.send({ type: 'greeting', data: 'Hello' });

// 子进程代码（child.js）
// process.on('message', (msg) => {
//   console.log('子进程收到消息:', msg);
//   process.send({ type: 'reply', data: 'Hi' });
// });

/**
 * 6. PM2 进程管理
 * 
 * PM2 是 Node.js 的进程管理工具
 * 
 * 主要功能：
 * - 进程守护（自动重启）
 * - 负载均衡（cluster 模式）
 * - 日志管理
 * - 监控
 * 
 * 常用命令：
 * pm2 start app.js -i max  // 启动最大进程数
 * pm2 list                 // 查看进程列表
 * pm2 restart app          // 重启应用
 * pm2 stop app             // 停止应用
 * pm2 delete app           // 删除应用
 * pm2 logs                 // 查看日志
 * pm2 monit                // 监控
 */

/**
 * 面试总结：
 * 
 * 1. process 对象
 *    - 全局对象，提供进程信息
 *    - process.env：环境变量
 *    - process.argv：命令行参数
 *    - process.exit()：退出进程
 * 
 * 2. child_process 四种方式
 *    - spawn：流式输出，适合大量数据
 *    - exec：缓冲输出，适合少量数据
 *    - execFile：执行文件
 *    - fork：创建 Node.js 子进程，支持 IPC
 * 
 * 3. cluster 集群
 *    - 充分利用多核 CPU
 *    - 主进程管理，工作进程处理请求
 *    - 自动负载均衡
 * 
 * 4. 进程间通信
 *    - 使用 send 和 message 事件
 *    - 只能传递 JSON 可序列化的数据
 * 
 * 5. 为什么需要多进程？
 *    - Node.js 是单线程
 *    - 充分利用多核 CPU
 *    - 提高并发处理能力
 *    - 进程隔离，提高稳定性
 * 
 * 6. cluster vs child_process
 *    - cluster：创建多个工作进程处理请求
 *    - child_process：执行其他程序或脚本
 */

console.log('\n=== Node.js 单线程 vs 多进程 ===');
console.log('单线程：');
console.log('- JavaScript 执行是单线程');
console.log('- 通过事件循环实现异步');
console.log('- 无法利用多核 CPU');
console.log('\n多进程：');
console.log('- 使用 cluster 创建多个进程');
console.log('- 充分利用多核 CPU');
console.log('- 提高并发处理能力');
console.log('- 进程间相互独立');
