# Node.js 进程管理详解

> 深入理解 Node.js 的进程管理机制、多进程方案和最佳实践

## 目录

1. [为什么需要进程管理](#1-为什么需要进程管理)
2. [Node.js 进程基础](#2-nodejs-进程基础)
3. [child_process 模块详解](#3-child_process-模块详解)
4. [cluster 集群模式](#4-cluster-集群模式)
5. [Worker Threads 工作线程](#5-worker-threads-工作线程)
6. [进程间通信（IPC）](#6-进程间通信ipc)
7. [进程管理工具 PM2](#7-进程管理工具-pm2)
8. [最佳实践与性能优化](#8-最佳实践与性能优化)

---

## 1. 为什么需要进程管理

### 1.1 Node.js 单线程的局限性

**问题场景**：
```javascript
// 单线程服务器
const http = require('http');

http.createServer((req, res) => {
  // CPU 密集型任务会阻塞整个服务器
  if (req.url === '/heavy') {
    const result = fibonacci(40); // 计算需要几秒钟
    res.end(`Result: ${result}`);
  } else {
    res.end('Hello World');
  }
}).listen(3000);

// 问题：当有人访问 /heavy 时，所有其他请求都会被阻塞
```

**核心问题**：
- Node.js JavaScript 执行是**单线程**的
- 单线程只能利用**一个 CPU 核心**
- CPU 密集型任务会**阻塞事件循环**
- 无法充分利用**多核 CPU**

### 1.2 多进程的优势

| 优势 | 说明 | 示例 |
|------|------|------|
| **利用多核** | 每个 CPU 核心运行一个进程 | 8 核 CPU → 8 个进程 |
| **提高吞吐量** | 并行处理请求 | QPS 从 1000 提升到 7000+ |
| **故障隔离** | 一个进程崩溃不影响其他进程 | 进程 A 崩溃，进程 B 继续服务 |
| **负载均衡** | 自动分配请求到不同进程 | 轮询、最少连接等策略 |
| **零停机部署** | 逐个重启进程 | 滚动更新，用户无感知 |

### 1.3 进程 vs 线程对比

```javascript
// 进程（Process）
// - 独立内存空间
// - 隔离性强，崩溃不影响其他进程
// - 开销大（30MB+ per 进程）
// - 通信需要 IPC（序列化）
const { fork } = require('child_process');
const worker = fork('worker.js');

// 线程（Thread）
// - 共享内存空间
// - 轻量级（KB 级别）
// - 一个线程崩溃可能影响整个进程
// - 可以直接访问共享内存
const { Worker } = require('worker_threads');
const worker = new Worker('./worker.js');
```

**选择建议**：
- **I/O 密集型**（Web 服务器、API）→ 多进程（cluster）
- **CPU 密集型**（图像处理、加密）→ Worker Threads
- **需要隔离**（不同租户、沙箱）→ 多进程
- **需要共享数据**（缓存、状态）→ Worker Threads

---

## 2. Node.js 进程基础

### 2.1 process 对象

`process` 是一个全局对象，提供当前 Node.js 进程的信息和控制。

```javascript
// 进程信息
console.log('进程 ID:', process.pid);
console.log('父进程 ID:', process.ppid);
console.log('Node 版本:', process.version);
console.log('平台:', process.platform);
console.log('架构:', process.arch);
console.log('当前目录:', process.cwd());
console.log('内存使用:', process.memoryUsage());
console.log('CPU 使用:', process.cpuUsage());

// 环境变量
console.log('环境变量:', process.env.NODE_ENV);
process.env.MY_VAR = 'value'; // 设置环境变量

// 命令行参数
// 运行：node app.js --port 3000
console.log('参数:', process.argv);
// 输出：['node', '/path/to/app.js', '--port', '3000']

// 退出进程
process.exit(0); // 0 表示成功，非 0 表示错误
```

### 2.2 进程事件

```javascript
// 1. 未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 记录日志后优雅退出
  process.exit(1);
});

// 2. 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});

// 3. 进程退出前
process.on('beforeExit', (code) => {
  console.log('进程即将退出，退出码:', code);
  // 可以执行异步操作
});

// 4. 进程退出
process.on('exit', (code) => {
  console.log('进程退出，退出码:', code);
  // 只能执行同步操作
});

// 5. 接收信号
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，优雅关闭');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号（Ctrl+C）');
  process.exit(0);
});
```

### 2.3 进程通信基础

```javascript
// 标准输入/输出/错误
process.stdin.on('data', (data) => {
  console.log('收到输入:', data.toString());
});

process.stdout.write('输出到控制台\n');
process.stderr.write('输出错误信息\n');

// 发送信号
process.kill(pid, 'SIGTERM'); // 向指定进程发送信号
```

---

## 3. child_process 模块详解

`child_process` 是 Node.js 的核心模块，用于创建和管理子进程。

### 3.1 四种创建方式对比

| 方法 | 输出方式 | shell | 适用场景 | IPC | 数据量 | 性能 |
|------|---------|-------|----------|-----|--------|------|
| **spawn** | Stream | ❌ | 大数据、长时间运行 | ❌ | 大 | 最快 |
| **exec** | Buffer | ✅ | 小数据、shell 命令 | ❌ | 小 | 较慢 |
| **execFile** | Buffer | ❌ | 可执行文件 | ❌ | 小 | 较快 |
| **fork** | Stream | ❌ | Node.js 子进程 | ✅ | 大 | 慢 |

### 3.2 spawn - 流式处理

**适用场景**：
- 处理大量数据（日志分析、视频转码）
- 长时间运行的进程
- 需要实时获取输出

**基础用法**：
```javascript
const { spawn } = require('child_process');

// 创建子进程
const ls = spawn('ls', ['-lh', '/usr']);

// 监听标准输出（流式接收）
ls.stdout.on('data', (data) => {
  console.log(`输出: ${data}`);
});

// 监听标准错误
ls.stderr.on('data', (data) => {
  console.error(`错误: ${data}`);
});

// 监听进程退出
ls.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});

// 监听错误（如命令不存在）
ls.on('error', (err) => {
  console.error('启动子进程失败:', err);
});
```

**高级用法**：
```javascript
// 1. 管道连接
const grep = spawn('grep', ['error']);
const wc = spawn('wc', ['-l']);

// 将 grep 的输出传给 wc
grep.stdout.pipe(wc.stdin);

wc.stdout.on('data', (data) => {
  console.log(`错误行数: ${data}`);
});

// 2. 处理大文件
const ffmpeg = spawn('ffmpeg', [
  '-i', 'input.mp4',
  '-vcodec', 'h264',
  'output.mp4'
]);

ffmpeg.stderr.on('data', (data) => {
  // ffmpeg 的进度信息在 stderr
  const progress = parseProgress(data.toString());
  console.log(`转码进度: ${progress}%`);
});

// 3. 设置选项
const child = spawn('node', ['script.js'], {
  cwd: '/path/to/dir',           // 工作目录
  env: { ...process.env, NODE_ENV: 'production' }, // 环境变量
  detached: true,                 // 独立运行（父进程退出后继续）
  stdio: ['ignore', 'pipe', 'pipe'] // stdin, stdout, stderr
});

// 4. 杀死子进程
child.kill('SIGTERM'); // 发送信号
child.kill('SIGKILL'); // 强制杀死
```

**实际案例：日志分析**
```javascript
const { spawn } = require('child_process');
const fs = require('fs');

function analyzeLog(logFile) {
  return new Promise((resolve, reject) => {
    const grep = spawn('grep', ['ERROR', logFile]);
    const output = fs.createWriteStream('errors.txt');
    
    grep.stdout.pipe(output);
    
    grep.on('close', (code) => {
      if (code === 0) {
        resolve('分析完成');
      } else {
        reject(new Error(`进程退出码: ${code}`));
      }
    });
    
    grep.on('error', reject);
  });
}

analyzeLog('/var/log/app.log')
  .then(console.log)
  .catch(console.error);
```

### 3.3 exec - 缓冲输出

**适用场景**：
- 执行简单的 shell 命令
- 需要使用 shell 特性（管道、通配符、重定向）
- 输出数据量小（< 200KB）

**基础用法**：
```javascript
const { exec } = require('child_process');

exec('ls -lh /usr', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  console.log(`stdout: ${stdout}`);
});
```

**使用 shell 特性**：
```javascript
// 管道
exec('cat *.txt | grep "error" | wc -l', (error, stdout) => {
  console.log(`错误行数: ${stdout.trim()}`);
});

// 重定向
exec('ls -lh > files.txt', (error) => {
  console.log('文件列表已保存');
});

// 通配符
exec('rm -f *.tmp', (error) => {
  console.log('临时文件已删除');
});

// 环境变量
exec('echo $HOME', (error, stdout) => {
  console.log(`Home 目录: ${stdout.trim()}`);
});
```

**配置选项**：
```javascript
exec('long-running-command', {
  timeout: 5000,              // 超时时间（毫秒）
  maxBuffer: 1024 * 1024,     // 最大缓冲（字节）
  cwd: '/path/to/dir',        // 工作目录
  env: { ...process.env },    // 环境变量
  shell: '/bin/bash',         // 指定 shell
  encoding: 'utf8'            // 输出编码
}, (error, stdout, stderr) => {
  if (error) {
    if (error.killed) {
      console.error('进程被杀死（超时）');
    } else if (error.code) {
      console.error(`退出码: ${error.code}`);
    }
  }
});
```

**Promise 化**：
```javascript
const { promisify } = require('util');
const execPromise = promisify(exec);

async function getGitBranch() {
  try {
    const { stdout } = await execPromise('git branch --show-current');
    return stdout.trim();
  } catch (error) {
    console.error('Git 命令失败:', error);
    throw error;
  }
}

// 使用
getGitBranch()
  .then(branch => console.log(`当前分支: ${branch}`))
  .catch(console.error);

// 或者
async function deploy() {
  const branch = await getGitBranch();
  const { stdout } = await execPromise('git status --porcelain');
  
  if (stdout) {
    throw new Error('有未提交的更改');
  }
  
  await execPromise('npm run build');
  await execPromise('pm2 reload app');
}
```

**⚠️ 安全警告 - 命令注入**：
```javascript
// ❌ 危险：命令注入风险
const filename = req.query.file; // 用户输入："; rm -rf /"
exec(`cat ${filename}`, callback); // 可能执行恶意命令

// ✅ 安全方案 1：使用 spawn
const { spawn } = require('child_process');
spawn('cat', [filename]); // 参数不会被解释为命令

// ✅ 安全方案 2：验证输入
const path = require('path');
const safeFilename = path.basename(filename); // 只保留文件名
exec(`cat ${safeFilename}`, callback);

// ✅ 安全方案 3：使用白名单
const allowedFiles = ['file1.txt', 'file2.txt'];
if (allowedFiles.includes(filename)) {
  exec(`cat ${filename}`, callback);
}
```

### 3.4 execFile - 执行可执行文件

**适用场景**：
- 执行已知的可执行文件（更安全）
- 不需要 shell 特性
- 性能要求较高

**基础用法**：
```javascript
const { execFile } = require('child_process');

// 执行系统命令
execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error}`);
    return;
  }
  console.log(`Node 版本: ${stdout}`);
});

// 执行自定义脚本
execFile('/usr/local/bin/backup.sh', ['--full'], (error, stdout) => {
  console.log(`备份结果: ${stdout}`);
});
```

**执行不同语言的脚本**：
```javascript
// Python
execFile('python3', ['script.py', '--input', 'data.txt'], (error, stdout) => {
  console.log(`Python 输出: ${stdout}`);
});

// Ruby
execFile('ruby', ['script.rb'], (error, stdout) => {
  console.log(`Ruby 输出: ${stdout}`);
});

// Shell 脚本
execFile('/bin/bash', ['script.sh', 'arg1', 'arg2'], (error, stdout) => {
  console.log(`脚本输出: ${stdout}`);
});
```

**配置选项**：
```javascript
execFile('git', ['status'], {
  cwd: '/path/to/repo',       // 工作目录
  env: {
    ...process.env,
    GIT_AUTHOR_NAME: 'Bot',
    GIT_AUTHOR_EMAIL: 'bot@example.com'
  },
  timeout: 10000,             // 超时
  maxBuffer: 1024 * 1024,     // 最大缓冲
  windowsHide: true           // Windows 下隐藏窗口
}, (error, stdout, stderr) => {
  console.log(stdout);
});
```

**exec vs execFile 对比**：
```javascript
// exec：启动 shell，可以用管道、重定向
exec('ls -lh | grep ".txt"', callback);

// execFile：不启动 shell，不能用 shell 语法
execFile('ls', ['-lh'], callback); // ✅ 可以
execFile('ls -lh | grep ".txt"', [], callback); // ❌ 不行

// 性能对比
// exec:     启动 shell → 解析命令 → 执行
// execFile: 直接执行（更快）

// 安全性对比
// exec:     容易受命令注入攻击
// execFile: 参数不会被解释为命令（更安全）
```

### 3.5 fork - Node.js 子进程

**适用场景**：
- CPU 密集型任务（避免阻塞主进程）
- 需要进程间通信（IPC）
- 创建 Node.js 工作进程

**基础用法**：
```javascript
// parent.js（主进程）
const { fork } = require('child_process');

const child = fork('child.js');

// 发送消息给子进程
child.send({ type: 'task', data: [1, 2, 3, 4, 5] });

// 接收子进程消息
child.on('message', (msg) => {
  console.log('收到子进程结果:', msg);
});

// 监听子进程退出
child.on('exit', (code, signal) => {
  console.log(`子进程退出，退出码: ${code}, 信号: ${signal}`);
});

// child.js（子进程）
process.on('message', (msg) => {
  if (msg.type === 'task') {
    // 执行任务
    const result = msg.data.reduce((sum, num) => sum + num, 0);
    
    // 发送结果给父进程
    process.send({ type: 'result', data: result });
  }
});
```

**实际案例：CPU 密集型任务**
```javascript
// server.js
const express = require('express');
const { fork } = require('child_process');
const app = express();

app.post('/calculate', (req, res) => {
  const worker = fork('worker.js');
  
  worker.send({
    type: 'fibonacci',
    n: req.body.n
  });
  
  worker.on('message', (msg) => {
    res.json({ result: msg.result });
    worker.kill(); // 任务完成后杀死子进程
  });
  
  // 超时处理
  setTimeout(() => {
    worker.kill();
    res.status(408).json({ error: '计算超时' });
  }, 30000);
});

app.listen(3000);

// worker.js
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

process.on('message', (msg) => {
  if (msg.type === 'fibonacci') {
    const result = fibonacci(msg.n);
    process.send({ result });
  }
});
```

**高级用法：进程池**
```javascript
// worker-pool.js
const { fork } = require('child_process');
const os = require('os');

class WorkerPool {
  constructor(scriptPath, numWorkers = os.cpus().length) {
    this.workers = [];
    this.taskQueue = [];
    
    // 创建工作进程
    for (let i = 0; i < numWorkers; i++) {
      const worker = fork(scriptPath);
      worker.busy = false;
      
      worker.on('message', (msg) => {
        worker.busy = false;
        worker.callback(null, msg);
        this.processQueue(); // 处理队列中的任务
      });
      
      worker.on('error', (err) => {
        worker.callback(err);
      });
      
      this.workers.push(worker);
    }
  }
  
  // 执行任务
  exec(data) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({
        data,
        callback: (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      });
      this.processQueue();
    });
  }
  
  // 处理队列
  processQueue() {
    if (this.taskQueue.length === 0) return;
    
    // 找到空闲的 worker
    const worker = this.workers.find(w => !w.busy);
    if (!worker) return;
    
    const task = this.taskQueue.shift();
    worker.busy = true;
    worker.callback = task.callback;
    worker.send(task.data);
  }
  
  // 销毁进程池
  destroy() {
    this.workers.forEach(worker => worker.kill());
  }
}

// 使用
const pool = new WorkerPool('worker.js', 4);

async function handleRequest(req, res) {
  try {
    const result = await pool.exec({ type: 'task', data: req.body });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  pool.destroy();
  process.exit(0);
});
```

**配置选项**：
```javascript
const child = fork('child.js', ['arg1', 'arg2'], {
  cwd: '/path/to/dir',        // 工作目录
  env: { ...process.env },    // 环境变量
  execPath: '/usr/bin/node',  // Node.js 可执行文件路径
  execArgv: ['--max-old-space-size=4096'], // Node.js 参数
  silent: false,              // 是否继承 stdio（false 会继承）
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'], // stdio 配置
  detached: false,            // 是否独立运行
  windowsHide: true           // Windows 下隐藏窗口
});

// silent: true 时，需要手动处理 stdio
const child = fork('child.js', [], { silent: true });
child.stdout.on('data', (data) => {
  console.log(`子进程输出: ${data}`);
});
```

**fork vs spawn 对比**：
```javascript
// fork：专门用于 Node.js 子进程
const child = fork('script.js');
child.send({ data: 'hello' }); // 支持 IPC
child.on('message', callback);

// spawn：通用的子进程创建
const child = spawn('node', ['script.js']);
child.stdout.on('data', callback); // 只能通过 stdio 通信

// 内部实现：fork 本质上是 spawn 的特殊形式
// fork('script.js') ≈ spawn('node', ['script.js'], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })
```

---

## 4. cluster 集群模式

### 4.1 什么是 cluster

`cluster` 模块允许你轻松创建共享服务器端口的子进程。

**核心概念**：
- **Master 进程**：主进程，负责管理 worker 进程
- **Worker 进程**：工作进程，处理实际请求
- **负载均衡**：自动分配请求到不同 worker

### 4.2 基础用法

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  
  // 创建 worker 进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // 监听 worker 退出
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    // 自动重启
    cluster.fork();
  });
  
} else {
  // Worker 进程可以共享 TCP 连接
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`由进程 ${process.pid} 处理\n`);
  }).listen(8000);
  
  console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 4.3 负载均衡策略

```javascript
const cluster = require('cluster');

if (cluster.isMaster) {
  // 设置负载均衡策略
  cluster.schedulingPolicy = cluster.SCHED_RR; // 轮询（Round-Robin）
  // cluster.schedulingPolicy = cluster.SCHED_NONE; // 由操作系统决定
  
  // 默认策略：
  // - Linux/macOS: SCHED_RR（轮询）
  // - Windows: SCHED_NONE（操作系统负载均衡）
  
  for (let i = 0; i < 4; i++) {
    cluster.fork();
  }
}
```

**轮询（Round-Robin）工作原理**：
```
请求 1 → Worker 1
请求 2 → Worker 2
请求 3 → Worker 3
请求 4 → Worker 4
请求 5 → Worker 1（循环）
```

### 4.4 Master 与 Worker 通信

```javascript
const cluster = require('cluster');

if (cluster.isMaster) {
  const worker = cluster.fork();
  
  // Master 发送消息给 Worker
  worker.send({ type: 'config', data: { port: 3000 } });
  
  // Master 接收 Worker 消息
  worker.on('message', (msg) => {
    console.log('收到 worker 消息:', msg);
  });
  
  // 广播消息给所有 worker
  function broadcast(msg) {
    for (const id in cluster.workers) {
      cluster.workers[id].send(msg);
    }
  }
  
  broadcast({ type: 'reload', data: 'config updated' });
  
} else {
  // Worker 接收 Master 消息
  process.on('message', (msg) => {
    if (msg.type === 'config') {
      console.log('收到配置:', msg.data);
    }
  });
  
  // Worker 发送消息给 Master
  process.send({ type: 'ready', pid: process.pid });
}
```

### 4.5 优雅重启（零停机部署）

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  
  // 创建 workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // 优雅重启
  function gracefulRestart() {
    const workers = Object.values(cluster.workers);
    
    function restartWorker(index) {
      if (index >= workers.length) {
        console.log('所有 worker 已重启');
        return;
      }
      
      const worker = workers[index];
      
      // 创建新 worker
      const newWorker = cluster.fork();
      
      // 等待新 worker 准备好
      newWorker.on('listening', () => {
        // 断开旧 worker
        worker.disconnect();
        
        // 等待旧 worker 退出
        worker.on('exit', () => {
          console.log(`Worker ${worker.process.pid} 已退出`);
          // 重启下一个
          setTimeout(() => restartWorker(index + 1), 1000);
        });
      });
    }
    
    restartWorker(0);
  }
  
  // 监听 SIGUSR2 信号（零停机重启）
  process.on('SIGUSR2', () => {
    console.log('收到重启信号，开始优雅重启...');
    gracefulRestart();
  });
  
  // 监听 worker 退出
  cluster.on('exit', (worker, code, signal) => {
    if (!worker.exitedAfterDisconnect) {
      // 非正常退出，自动重启
      console.log(`Worker ${worker.process.pid} 崩溃，重启中...`);
      cluster.fork();
    }
  });
  
} else {
  // Worker 进程
  const server = http.createServer((req, res) => {
    res.end(`由进程 ${process.pid} 处理\n`);
  });
  
  server.listen(8000);
  
  // 优雅关闭
  process.on('disconnect', () => {
    console.log(`Worker ${process.pid} 正在关闭...`);
    
    // 停止接收新连接
    server.close(() => {
      console.log(`Worker ${process.pid} 已关闭`);
      process.exit(0);
    });
    
    // 超时强制退出
    setTimeout(() => {
      console.error(`Worker ${process.pid} 强制退出`);
      process.exit(1);
    }, 30000);
  });
  
  console.log(`Worker ${process.pid} 已启动`);
}

// 使用：
// kill -SIGUSR2 <master_pid>  # 触发零停机重启
```

### 4.6 实际案例：Express 集群

```javascript
// app.js
const cluster = require('cluster');
const express = require('express');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} 正在运行`);
  console.log(`启动 ${numCPUs} 个 workers`);
  
  // 统计信息
  const stats = {
    requests: {},
    startTime: Date.now()
  };
  
  // 创建 workers
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    stats.requests[worker.id] = 0;
    
    // 接收 worker 统计信息
    worker.on('message', (msg) => {
      if (msg.type === 'request') {
        stats.requests[worker.id]++;
      }
    });
  }
  
  // 定期打印统计信息
  setInterval(() => {
    console.log('请求分布:', stats.requests);
  }, 10000);
  
  // Worker 退出处理
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} 退出`);
    delete stats.requests[worker.id];
    
    // 重启
    const newWorker = cluster.fork();
    stats.requests[newWorker.id] = 0;
  });
  
} else {
  const app = express();
  
  // 中间件
  app.use((req, res, next) => {
    // 向 master 报告请求
    process.send({ type: 'request' });
    next();
  });
  
  // 路由
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World',
      pid: process.pid,
      uptime: process.uptime()
    });
  });
  
  app.get('/heavy', (req, res) => {
    // CPU 密集型任务
    const result = fibonacci(40);
    res.json({ result, pid: process.pid });
  });
  
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      pid: process.pid,
      memory: process.memoryUsage()
    });
  });
  
  const server = app.listen(3000, () => {
    console.log(`Worker ${process.pid} 监听端口 3000`);
  });
  
  // 优雅关闭
  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0);
    });
  });
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### 4.7 cluster vs PM2

| 对比项 | cluster 模块 | PM2 |
|--------|-------------|-----|
| **安装** | 内置模块 | 需要安装 |
| **配置** | 代码配置 | 配置文件 |
| **监控** | 需要自己实现 | 内置监控面板 |
| **日志** | 需要自己处理 | 自动管理日志 |
| **重启** | 需要自己实现 | 一条命令 |
| **部署** | 需要自己实现 | 内置部署功能 |
| **适用** | 简单场景、学习 | 生产环境 |

---

## 5. Worker Threads 工作线程

### 5.1 什么是 Worker Threads

Worker Threads 是 Node.js 提供的多线程解决方案（Node.js 10.5.0+）。

**进程 vs 线程**：
```javascript
// 进程（fork）
// - 独立内存空间（30MB+）
// - 完全隔离
// - 通信需要序列化
const { fork } = require('child_process');
const worker = fork('worker.js');

// 线程（Worker Threads）
// - 共享内存空间（KB 级别）
// - 可以共享数据
// - 通信更高效
const { Worker } = require('worker_threads');
const worker = new Worker('./worker.js');
```

### 5.2 基础用法

```javascript
// main.js
const { Worker } = require('worker_threads');

const worker = new Worker('./worker.js', {
  workerData: { num: 42 } // 传递初始数据
});

// 接收消息
worker.on('message', (msg) => {
  console.log('收到消息:', msg);
});

// 监听错误
worker.on('error', (err) => {
  console.error('Worker 错误:', err);
});

// 监听退出
worker.on('exit', (code) => {
  console.log(`Worker 退出，退出码: ${code}`);
});

// 发送消息
worker.postMessage({ type: 'task', data: [1, 2, 3] });

// worker.js
const { parentPort, workerData } = require('worker_threads');

console.log('初始数据:', workerData); // { num: 42 }

// 接收消息
parentPort.on('message', (msg) => {
  if (msg.type === 'task') {
    const result = msg.data.reduce((sum, num) => sum + num, 0);
    parentPort.postMessage({ result });
  }
});

// 发送消息
parentPort.postMessage({ status: 'ready' });
```

### 5.3 共享内存（SharedArrayBuffer）

```javascript
// main.js
const { Worker } = require('worker_threads');

// 创建共享内存
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

// 初始化数据
sharedArray[0] = 0;

// 创建多个 worker
for (let i = 0; i < 4; i++) {
  const worker = new Worker('./worker.js', {
    workerData: { sharedBuffer }
  });
}

// 定期读取共享内存
setInterval(() => {
  console.log('计数器:', sharedArray[0]);
}, 1000);

// worker.js
const { workerData } = require('worker_threads');

const sharedArray = new Int32Array(workerData.sharedBuffer);

// 原子操作（避免竞态条件）
setInterval(() => {
  Atomics.add(sharedArray, 0, 1); // 原子加 1
}, 100);
```

### 5.4 线程池实现

```javascript
// thread-pool.js
const { Worker } = require('worker_threads');
const os = require('os');

class ThreadPool {
  constructor(workerScript, numThreads = os.cpus().length) {
    this.workerScript = workerScript;
    this.workers = [];
    this.taskQueue = [];
    
    for (let i = 0; i < numThreads; i++) {
      this.addWorker();
    }
  }
  
  addWorker() {
    const worker = new Worker(this.workerScript);
    worker.busy = false;
    
    worker.on('message', (msg) => {
      worker.busy = false;
      worker.callback(null, msg);
      this.processQueue();
    });
    
    worker.on('error', (err) => {
      worker.callback(err);
      // 重新创建 worker
      this.workers = this.workers.filter(w => w !== worker);
      this.addWorker();
    });
    
    this.workers.push(worker);
  }
  
  exec(data) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({
        data,
        callback: (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      });
      this.processQueue();
    });
  }
  
  processQueue() {
    if (this.taskQueue.length === 0) return;
    
    const worker = this.workers.find(w => !w.busy);
    if (!worker) return;
    
    const task = this.taskQueue.shift();
    worker.busy = true;
    worker.callback = task.callback;
    worker.postMessage(task.data);
  }
  
  destroy() {
    this.workers.forEach(worker => worker.terminate());
  }
}

module.exports = ThreadPool;

// 使用
const ThreadPool = require('./thread-pool');
const pool = new ThreadPool('./worker.js', 4);

async function handleRequest(req, res) {
  try {
    const result = await pool.exec({ type: 'task', data: req.body });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 5.5 实际案例：图片处理

```javascript
// server.js
const express = require('express');
const { Worker } = require('worker_threads');
const multer = require('multer');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.post('/resize', upload.single('image'), async (req, res) => {
  try {
    const result = await resizeImage(req.file.path, {
      width: 800,
      height: 600
    });
    res.json({ success: true, path: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function resizeImage(imagePath, options) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./image-worker.js', {
      workerData: { imagePath, options }
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker 退出，退出码: ${code}`));
      }
    });
  });
}

app.listen(3000);

// image-worker.js
const { parentPort, workerData } = require('worker_threads');
const sharp = require('sharp');

const { imagePath, options } = workerData;

sharp(imagePath)
  .resize(options.width, options.height)
  .toFile(`${imagePath}-resized.jpg`)
  .then(() => {
    parentPort.postMessage(`${imagePath}-resized.jpg`);
  })
  .catch((err) => {
    throw err;
  });
```

### 5.6 Worker Threads vs child_process

| 对比项 | Worker Threads | child_process (fork) |
|--------|----------------|---------------------|
| **内存** | 共享内存 | 独立内存 |
| **开销** | 小（KB 级别） | 大（30MB+） |
| **启动速度** | 快 | 慢 |
| **隔离性** | 弱（共享内存） | 强（完全隔离） |
| **通信** | 高效（共享内存） | 需要序列化 |
| **崩溃影响** | 可能影响主进程 | 不影响其他进程 |
| **适用场景** | CPU 密集型计算 | I/O 密集型、隔离任务 |

**选择建议**：
```javascript
// CPU 密集型（图像处理、加密、压缩）→ Worker Threads
const { Worker } = require('worker_threads');
const worker = new Worker('./crypto-worker.js');

// I/O 密集型（Web 服务器、API）→ cluster
const cluster = require('cluster');
if (cluster.isMaster) {
  for (let i = 0; i < 4; i++) cluster.fork();
}

// 需要隔离（不同租户、沙箱）→ child_process
const { fork } = require('child_process');
const sandbox = fork('./sandbox.js', { detached: true });
```

---

## 6. 进程间通信（IPC）

### 6.1 IPC 通信方式

Node.js 提供多种进程间通信方式：

| 方式 | 说明 | 适用场景 |
|------|------|----------|
| **message 事件** | fork/Worker Threads | 父子进程通信 |
| **stdio** | spawn/exec | 标准输入输出 |
| **Socket** | net 模块 | 网络通信 |
| **文件** | fs 模块 | 简单数据共享 |
| **共享内存** | SharedArrayBuffer | 高性能数据共享 |
| **消息队列** | Redis/RabbitMQ | 分布式系统 |

### 6.2 message 事件（推荐）

```javascript
// parent.js
const { fork } = require('child_process');
const child = fork('child.js');

// 发送消息
child.send({ type: 'task', data: { id: 1, name: 'test' } });

// 接收消息
child.on('message', (msg) => {
  console.log('收到消息:', msg);
});

// child.js
process.on('message', (msg) => {
  console.log('收到任务:', msg);
  
  // 处理任务
  const result = processTask(msg.data);
  
  // 发送结果
  process.send({ type: 'result', data: result });
});
```

### 6.3 stdio 通信

```javascript
// parent.js
const { spawn } = require('child_process');
const child = spawn('node', ['child.js']);

// 发送数据到子进程的 stdin
child.stdin.write('Hello\n');
child.stdin.end();

// 接收子进程的 stdout
child.stdout.on('data', (data) => {
  console.log(`收到: ${data}`);
});

// child.js
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  console.log(`处理: ${input}`);
  
  // 输出到 stdout
  process.stdout.write(`结果: ${input.toUpperCase()}\n`);
});
```

### 6.4 Socket 通信

```javascript
// server.js（主进程）
const net = require('net');
const { fork } = require('child_process');

const server = net.createServer((socket) => {
  console.log('客户端连接');
  
  socket.on('data', (data) => {
    console.log('收到:', data.toString());
    socket.write('收到消息\n');
  });
});

server.listen(9000, () => {
  console.log('IPC 服务器启动');
  
  // 启动子进程
  fork('client.js');
});

// client.js（子进程）
const net = require('net');

const client = net.connect({ port: 9000 }, () => {
  console.log('连接到服务器');
  client.write('Hello from child\n');
});

client.on('data', (data) => {
  console.log('收到:', data.toString());
  client.end();
});
```

### 6.5 共享内存（Worker Threads）

```javascript
// main.js
const { Worker } = require('worker_threads');

// 创建共享内存
const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);

// 创建 worker
const worker = new Worker('./worker.js', {
  workerData: { sharedBuffer }
});

// 主线程写入
sharedArray[0] = 100;

setTimeout(() => {
  console.log('主线程读取:', sharedArray[0]); // 200
}, 1000);

// worker.js
const { workerData } = require('worker_threads');
const sharedArray = new Int32Array(workerData.sharedBuffer);

setTimeout(() => {
  // Worker 线程修改
  Atomics.store(sharedArray, 0, 200);
}, 500);
```

### 6.6 实际案例：主从架构

```javascript
// master.js
const { fork } = require('child_process');
const workers = [];

// 创建 4 个 worker
for (let i = 0; i < 4; i++) {
  const worker = fork('worker.js');
  worker.id = i;
  
  worker.on('message', (msg) => {
    if (msg.type === 'ready') {
      console.log(`Worker ${worker.id} 准备就绪`);
    } else if (msg.type === 'result') {
      console.log(`Worker ${worker.id} 完成任务:`, msg.data);
    }
  });
  
  workers.push(worker);
}

// 分配任务
let currentWorker = 0;
function assignTask(task) {
  workers[currentWorker].send({ type: 'task', data: task });
  currentWorker = (currentWorker + 1) % workers.length;
}

// 模拟任务
setInterval(() => {
  assignTask({ id: Date.now(), data: Math.random() });
}, 1000);

// worker.js
process.send({ type: 'ready' });

process.on('message', (msg) => {
  if (msg.type === 'task') {
    // 处理任务
    const result = processTask(msg.data);
    
    // 返回结果
    process.send({
      type: 'result',
      data: result
    });
  }
});

function processTask(task) {
  // 模拟处理
  return { ...task, processed: true };
}
```

---

## 7. 进程管理工具 PM2

### 7.1 什么是 PM2

PM2 是一个生产环境的进程管理器，提供负载均衡、监控、日志管理等功能。

**安装**：
```bash
npm install -g pm2
```

### 7.2 基础命令

```bash
# 启动应用
pm2 start app.js

# 启动并命名
pm2 start app.js --name "my-app"

# 启动多个实例（cluster 模式）
pm2 start app.js -i 4        # 启动 4 个实例
pm2 start app.js -i max      # 根据 CPU 核心数启动

# 查看状态
pm2 list                     # 列表
pm2 show my-app              # 详细信息
pm2 monit                    # 实时监控

# 日志
pm2 logs                     # 查看所有日志
pm2 logs my-app              # 查看指定应用日志
pm2 logs --lines 100         # 查看最近 100 行

# 重启
pm2 restart my-app           # 重启
pm2 reload my-app            # 零停机重启（cluster 模式）
pm2 stop my-app              # 停止
pm2 delete my-app            # 删除

# 其他
pm2 save                     # 保存当前进程列表
pm2 startup                  # 设置开机自启
pm2 resurrect                # 恢复之前保存的进程
```

### 7.3 配置文件

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api-server',
      script: './server.js',
      instances: 4,              // 实例数量（或 'max'）
      exec_mode: 'cluster',      // 模式：cluster 或 fork
      watch: false,              // 监听文件变化
      max_memory_restart: '1G',  // 内存超过 1G 重启
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    },
    {
      name: 'worker',
      script: './worker.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0 0 * * *', // 每天凌晨重启
      env: {
        WORKER_TYPE: 'background'
      }
    }
  ]
};

// 使用配置文件
// pm2 start ecosystem.config.js
// pm2 start ecosystem.config.js --env production
```

### 7.4 零停机部署

```bash
# 方式 1：reload（推荐）
pm2 reload my-app

# 方式 2：gracefulReload
pm2 gracefulReload my-app

# 部署脚本
#!/bin/bash
git pull origin main
npm install
npm run build
pm2 reload ecosystem.config.js --env production
```

**工作原理**：
```
1. 启动新的 worker 进程
2. 新 worker 准备就绪
3. 向旧 worker 发送 SIGINT 信号
4. 旧 worker 停止接收新请求
5. 旧 worker 处理完现有请求后退出
6. 重复上述步骤，直到所有 worker 都更新
```

### 7.5 监控与日志

```bash
# 实时监控
pm2 monit

# Web 监控面板
pm2 plus

# 日志管理
pm2 install pm2-logrotate    # 安装日志轮转
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# 自定义指标
// app.js
const pmx = require('@pm2/io');

// 自定义指标
const counter = pmx.counter({
  name: 'Request Count'
});

app.use((req, res, next) => {
  counter.inc();
  next();
});

// 自定义动作
pmx.action('clear cache', (reply) => {
  cache.clear();
  reply({ success: true });
});
```

### 7.6 实际案例：生产环境配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'web-server',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      
      // 环境变量
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
        DB_HOST: 'localhost',
        DB_PORT: 5432
      },
      
      // 日志
      error_file: '/var/log/app/error.log',
      out_file: '/var/log/app/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      
      // 重启策略
      autorestart: true,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // 其他
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true
    }
  ],
  
  deploy: {
    production: {
      user: 'deploy',
      host: 'server.example.com',
      ref: 'origin/main',
      repo: 'git@github.com:user/repo.git',
      path: '/var/www/app',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};

// 部署
// pm2 deploy production setup    # 初始化
// pm2 deploy production update   # 部署
```

---

## 8. 最佳实践与性能优化

### 8.1 进程数量选择

```javascript
const os = require('os');
const numCPUs = os.cpus().length;

// 推荐配置
const numWorkers = process.env.NODE_ENV === 'production'
  ? numCPUs              // 生产环境：使用所有核心
  : Math.max(2, numCPUs / 2); // 开发环境：使用一半核心

// 注意事项
// 1. 进程数 ≈ CPU 核心数（不要超过太多）
// 2. 每个进程约占用 30-50MB 内存
// 3. 考虑其他服务的资源占用
// 4. 留一些资源给系统和其他进程
```

### 8.2 优雅关闭

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(3000);

// 优雅关闭
function gracefulShutdown(signal) {
  console.log(`收到 ${signal} 信号，开始优雅关闭...`);
  
  // 1. 停止接收新连接
  server.close(() => {
    console.log('服务器已关闭');
    
    // 2. 关闭数据库连接
    db.close(() => {
      console.log('数据库连接已关闭');
      
      // 3. 退出进程
      process.exit(0);
    });
  });
  
  // 4. 超时强制退出
  setTimeout(() => {
    console.error('强制退出');
    process.exit(1);
  }, 30000); // 30 秒超时
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

### 8.3 错误处理

```javascript
// 1. 未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  
  // 记录日志
  logger.error(err);
  
  // 优雅关闭
  gracefulShutdown();
});

// 2. 未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
  logger.error(reason);
});

// 3. Worker 错误处理
if (cluster.isWorker) {
  process.on('uncaughtException', (err) => {
    console.error(`Worker ${process.pid} 异常:`, err);
    
    // 通知 master
    process.send({ type: 'error', error: err.message });
    
    // 退出让 master 重启
    process.exit(1);
  });
}

// 4. Master 错误处理
if (cluster.isMaster) {
  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.error(`Worker ${worker.process.pid} 崩溃，重启中...`);
      cluster.fork();
    }
  });
}
```

### 8.4 性能监控

```javascript
const cluster = require('cluster');

if (cluster.isMaster) {
  const workers = new Map();
  
  // 创建 workers
  for (let i = 0; i < 4; i++) {
    const worker = cluster.fork();
    workers.set(worker.id, {
      pid: worker.process.pid,
      requests: 0,
      errors: 0,
      startTime: Date.now()
    });
    
    // 接收统计信息
    worker.on('message', (msg) => {
      const stats = workers.get(worker.id);
      if (msg.type === 'request') {
        stats.requests++;
      } else if (msg.type === 'error') {
        stats.errors++;
      }
    });
  }
  
  // 定期打印统计信息
  setInterval(() => {
    console.log('\n===== 性能统计 =====');
    workers.forEach((stats, id) => {
      const uptime = (Date.now() - stats.startTime) / 1000;
      const qps = (stats.requests / uptime).toFixed(2);
      console.log(`Worker ${id}:`);
      console.log(`  请求数: ${stats.requests}`);
      console.log(`  错误数: ${stats.errors}`);
      console.log(`  QPS: ${qps}`);
      console.log(`  内存: ${JSON.stringify(process.memoryUsage())}`);
    });
  }, 10000);
  
} else {
  const app = require('./app');
  
  app.use((req, res, next) => {
    process.send({ type: 'request' });
    next();
  });
  
  app.use((err, req, res, next) => {
    process.send({ type: 'error' });
    next(err);
  });
}
```

### 8.5 内存管理

```javascript
// 1. 监控内存使用
setInterval(() => {
  const usage = process.memoryUsage();
  console.log({
    rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`,        // 总内存
    heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`, // 堆总大小
    heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,   // 堆使用
    external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`    // C++ 对象
  });
  
  // 内存超过阈值时重启
  if (usage.heapUsed > 900 * 1024 * 1024) { // 900MB
    console.warn('内存使用过高，准备重启');
    gracefulShutdown();
  }
}, 60000);

// 2. 手动触发 GC（需要 --expose-gc 参数）
if (global.gc) {
  setInterval(() => {
    global.gc();
    console.log('GC 完成');
  }, 300000); // 每 5 分钟
}

// 3. 使用 PM2 自动重启
// pm2 start app.js --max-memory-restart 1G
```

### 8.6 负载均衡策略

```javascript
const cluster = require('cluster');

if (cluster.isMaster) {
  // 自定义负载均衡
  const workers = [];
  const requests = new Map();
  
  for (let i = 0; i < 4; i++) {
    const worker = cluster.fork();
    workers.push(worker);
    requests.set(worker.id, 0);
  }
  
  // 最少连接策略
  function getLeastBusyWorker() {
    let minRequests = Infinity;
    let selectedWorker = null;
    
    requests.forEach((count, workerId) => {
      if (count < minRequests) {
        minRequests = count;
        selectedWorker = workers.find(w => w.id === workerId);
      }
    });
    
    return selectedWorker;
  }
  
  // 接收请求
  workers.forEach(worker => {
    worker.on('message', (msg) => {
      if (msg.type === 'request-start') {
        requests.set(worker.id, requests.get(worker.id) + 1);
      } else if (msg.type === 'request-end') {
        requests.set(worker.id, requests.get(worker.id) - 1);
      }
    });
  });
}
```

### 8.7 完整示例：生产级应用

```javascript
// app.js
const cluster = require('cluster');
const express = require('express');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} 启动`);
  
  // 创建 workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Worker 退出处理
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} 退出`);
    
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log('启动新 worker');
      cluster.fork();
    }
  });
  
  // 优雅重启
  process.on('SIGUSR2', () => {
    console.log('开始优雅重启...');
    
    const workers = Object.values(cluster.workers);
    
    function restartWorker(index) {
      if (index >= workers.length) return;
      
      const worker = workers[index];
      const newWorker = cluster.fork();
      
      newWorker.on('listening', () => {
        worker.disconnect();
        setTimeout(() => restartWorker(index + 1), 1000);
      });
    }
    
    restartWorker(0);
  });
  
} else {
  const app = express();
  
  // 中间件
  app.use(express.json());
  
  // 健康检查
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });
  
  // 业务路由
  app.get('/api/data', async (req, res) => {
    try {
      const data = await fetchData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // 错误处理
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
  const server = app.listen(3000, () => {
    console.log(`Worker ${process.pid} 监听端口 3000`);
  });
  
  // 优雅关闭
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} 收到 SIGTERM`);
    
    server.close(() => {
      console.log(`Worker ${process.pid} 已关闭`);
      process.exit(0);
    });
    
    setTimeout(() => {
      console.error(`Worker ${process.pid} 强制退出`);
      process.exit(1);
    }, 30000);
  });
}

async function fetchData() {
  // 模拟数据获取
  return { message: 'Hello World' };
}
```

---

## 总结

### 快速选择指南

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| Web 服务器 | cluster 或 PM2 | 充分利用多核，自动负载均衡 |
| CPU 密集型计算 | Worker Threads | 共享内存，开销小 |
| 后台任务 | child_process (fork) | 隔离性好，支持 IPC |
| 执行外部命令 | spawn/exec/execFile | 灵活，适合调用系统命令 |
| 生产环境部署 | PM2 | 监控、日志、零停机部署 |

### 核心要点

1. **进程 vs 线程**：进程隔离性强但开销大，线程轻量但需处理并发
2. **child_process**：提供 4 种方式创建子进程，各有适用场景
3. **cluster**：适合 Web 服务器，自动负载均衡
4. **Worker Threads**：适合 CPU 密集型，可共享内存
5. **PM2**：生产环境首选，功能完善
6. **优雅关闭**：确保请求处理完成、资源正确释放
7. **错误处理**：捕获异常、自动重启、记录日志
8. **性能监控**：监控内存、CPU、请求数等指标

### 最佳实践

✅ **推荐**：
- 进程数 ≈ CPU 核心数
- 使用 PM2 管理生产环境
- 实现优雅关闭
- 监控内存和性能
- 自动重启崩溃的进程

❌ **避免**：
- 进程数过多（浪费内存）
- 忽略错误处理
- 硬编码配置
- 忽略日志管理
- 不做性能监控

---

**相关资源**：
- [Node.js 官方文档 - child_process](https://nodejs.org/api/child_process.html)
- [Node.js 官方文档 - cluster](https://nodejs.org/api/cluster.html)
- [Node.js 官方文档 - worker_threads](https://nodejs.org/api/worker_threads.html)
- [PM2 官方文档](https://pm2.keymetrics.io/)
