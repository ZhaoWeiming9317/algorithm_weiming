# Node.js 面试题速记版

> 简化版，方便快速背诵

## 1. Event Loop 事件循环

**六个阶段（按顺序）**：
1. timers - setTimeout/setInterval
2. pending callbacks - I/O 回调
3. idle, prepare - 内部使用
4. poll - 检索新的 I/O 事件
5. check - setImmediate
6. close callbacks - 关闭事件

**微任务优先级**：
- `process.nextTick` > `Promise`

**与浏览器区别**：
- Node.js：六阶段，每阶段结束后执行微任务
- 浏览器：宏任务 → 微任务 → 渲染

<details>
<summary><b>📖 详解</b></summary>

**为什么有六个阶段？**
- Node.js 基于 libuv 实现异步 I/O
- 不同类型的异步操作需要在不同阶段处理
- 这样设计可以更高效地管理各种异步任务

**执行流程**：
1. 进入 timers 阶段，执行到期的 setTimeout/setInterval 回调
2. 执行该阶段的所有微任务（nextTick → Promise）
3. 进入下一阶段，重复上述过程

**关键点**：
- `process.nextTick` 在每个阶段结束后立即执行，优先级最高
- 如果 nextTick 递归调用自己，会阻塞事件循环
- `setImmediate` 在 check 阶段执行，不会阻塞 I/O

**与浏览器的本质区别**：
- 浏览器：每执行完一个宏任务，就清空所有微任务
- Node.js：每个阶段执行完所有任务后，才清空微任务
- 这导致在某些情况下执行顺序不同

</details>

---

## 2. 模块系统

**CommonJS vs ES Module**：

| 对比 | CommonJS  | ES Module |
|------|----------|-----------|
| 加载时机 | 运行时  | 编译时     |
| 导出 | module.exports | export |
| 导入 | require() | import    |
| 值类型 | 值拷贝   | 值引用     |

**require 查找顺序**：
1. 核心模块（fs、path）
2. 文件模块（./、../）
3. node_modules

<details>
<summary><b>📖 详解</b></summary>

**为什么有两种模块系统？**
- CommonJS 是 Node.js 最初采用的模块系统
- ES Module 是 ECMAScript 标准，为了统一前后端
- 两者可以共存，但需要注意兼容性

**值拷贝 vs 值引用的区别**：
```javascript
// CommonJS - 值拷贝
// a.js
let count = 0;
module.exports = { count };
setTimeout(() => count++, 1000);

// b.js
const { count } = require('./a');
console.log(count); // 始终是 0，因为是拷贝

// ES Module - 值引用
// a.js
export let count = 0;
setTimeout(() => count++, 1000);

// b.js
import { count } from './a.js';
setTimeout(() => console.log(count), 2000); // 会是 1，因为是引用
```

**require 查找详细流程**：
1. 如果是核心模块（如 fs），直接返回
2. 如果以 `/`、`./`、`../` 开头，按路径查找
3. 否则，从当前目录的 node_modules 开始向上查找
4. 查找时会尝试添加 .js、.json、.node 扩展名
5. 如果是目录，查找 package.json 的 main 字段或 index.js

**循环依赖问题**：
- CommonJS：返回已执行部分的 exports，可能导致不完整
- ES Module：通过静态分析提前建立引用，处理更好

</details>

---

## 3. Stream 流

**四种类型**：
1. Readable - 可读流
2. Writable - 可写流
3. Duplex - 双工流
4. Transform - 转换流

**为什么用 Stream**：
- 内存效率高（不用一次性加载）
- 时间效率高（边读边处理）
- 可组合（pipe 管道）

**背压问题**：
- 写入 > 读取速度
- 解决：用 `pipe()` 或监听 `drain` 事件

<details>
<summary><b>📖 详解</b></summary>

**为什么需要 Stream？**
假设要读取一个 1GB 的文件：
- 不用 Stream：`fs.readFile()` 会一次性加载 1GB 到内存，可能导致内存溢出
- 用 Stream：`fs.createReadStream()` 每次只读取 64KB（默认），边读边处理

**四种流的应用场景**：
1. **Readable**：读取文件、HTTP 请求体
2. **Writable**：写入文件、HTTP 响应体
3. **Duplex**：TCP socket（既能读又能写）
4. **Transform**：压缩、加密（读取 → 转换 → 写入）

**背压（Backpressure）详解**：

**问题场景**：
```javascript
// ❌ 错误示例：可能导致内存溢出
const readable = fs.createReadStream('huge-file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  writable.write(chunk); // 如果写入速度慢，chunk 会堆积在内存
});
```

**解决方案 1：使用 pipe()（推荐）**
```javascript
// ✅ pipe 会自动处理背压
readable.pipe(writable);
// 原理：当写入缓冲区满时，pipe 会暂停读取，等待 drain 事件
```

**解决方案 2：手动处理 drain 事件**
```javascript
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause(); // 暂停读取
  }
});

writable.on('drain', () => {
  readable.resume(); // 恢复读取
});
```

**能用消息队列吗？**

可以，但这是**不同层面的解决方案**：

1. **Stream 背压**：解决**同一进程内**的内存问题
   - 场景：读取文件、处理 HTTP 请求
   - 目的：防止内存溢出
   - 实时性：毫秒级

2. **消息队列**：解决**分布式系统**的流量问题
   - 场景：微服务间通信、削峰填谷
   - 目的：解耦、异步处理、流量控制
   - 实时性：秒级或更长

**对比**：
```javascript
// Stream 背压：进程内，处理 I/O
fs.createReadStream('file.txt')
  .pipe(transform)
  .pipe(fs.createWriteStream('output.txt'));

// 消息队列：进程间/服务间，处理业务逻辑
app.post('/upload', async (req, res) => {
  await messageQueue.publish('file-processing', {
    fileId: req.body.fileId
  });
  res.json({ status: 'queued' });
});
```

**总结**：
- 如果是**单个 Node.js 进程内**处理流式数据 → 用 Stream 背压
- 如果是**多个服务间**异步处理任务 → 用消息队列
- 两者可以结合使用：消息队列传递任务，Stream 处理文件

</details>

---

## 4. Buffer 缓冲区

**特点**：
- 处理二进制数据
- 固定大小
- 不受 V8 堆内存限制

**创建方式**：
```javascript
Buffer.from('Hello')       // 从字符串
Buffer.alloc(10)           // 分配并填充 0
Buffer.allocUnsafe(10)     // 分配但不初始化
```

<details>
<summary><b>📖 详解</b></summary>

**为什么需要 Buffer？**
- JavaScript 最初设计用于处理文本（Unicode 字符串）
- 但 Node.js 需要处理二进制数据（文件、网络流、图片等）
- Buffer 就是用来存储二进制数据的

**不受 V8 堆内存限制是什么意思？**
- V8 堆内存有限制（64位系统约 1.4GB）
- Buffer 使用 C++ 层分配的内存，不占用 V8 堆
- 所以可以处理更大的数据

**alloc vs allocUnsafe 的区别**：
```javascript
// alloc：安全但慢，会用 0 填充
const buf1 = Buffer.alloc(10);
console.log(buf1); // <Buffer 00 00 00 00 00 00 00 00 00 00>

// allocUnsafe：快但不安全，可能包含旧数据
const buf2 = Buffer.allocUnsafe(10);
console.log(buf2); // <Buffer a1 3f 2c ... > 可能是随机值
// 使用前必须手动填充数据
```

**常见操作**：
```javascript
// 字符串 ↔ Buffer
const buf = Buffer.from('你好', 'utf8');
console.log(buf); // <Buffer e4 bd a0 e5 a5 bd>
console.log(buf.toString('utf8')); // 你好

// Buffer 拼接
const buf1 = Buffer.from('Hello ');
const buf2 = Buffer.from('World');
const result = Buffer.concat([buf1, buf2]);
console.log(result.toString()); // Hello World
```

**应用场景**：
- 文件读写（fs 模块）
- 网络传输（net、http 模块）
- 图片处理
- 加密解密

</details>

---

## 5. 进程管理

**为什么需要多进程**：
- Node.js 单线程
- 利用多核 CPU
- 提高并发能力

**child_process 四种方式**：
1. spawn - 流式输出，大数据
2. exec - 缓冲输出，小数据
3. execFile - 执行文件
4. fork - 创建 Node 子进程，支持 IPC

**cluster 集群**：
- master 主进程管理
- worker 工作进程处理请求
- 自动负载均衡

<details>
<summary><b>📖 详解</b></summary>

**为什么 Node.js 是单线程但需要多进程？**
- Node.js 的 JavaScript 执行是单线程的
- 单线程只能利用一个 CPU 核心
- 现代服务器通常有多个 CPU 核心（4核、8核等）
- 多进程可以让每个核心都运行一个 Node.js 实例

**child_process 四种方式详解**：

1. **spawn**：流式处理，适合大量数据
```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`输出：${data}`);
});
```

2. **exec**：缓冲输出，适合少量数据
```javascript
const { exec } = require('child_process');
exec('ls -lh /usr', (error, stdout, stderr) => {
  console.log(stdout); // 一次性返回所有输出
});
```

3. **execFile**：直接执行文件，不启动 shell，更安全
```javascript
const { execFile } = require('child_process');
execFile('node', ['--version'], (error, stdout) => {
  console.log(stdout);
});
```

4. **fork**：专门用于创建 Node.js 子进程，支持 IPC
```javascript
const { fork } = require('child_process');
const child = fork('child.js');

child.send({ hello: 'world' });
child.on('message', (msg) => {
  console.log('收到消息：', msg);
});
```

**cluster 工作原理**：
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  
  // 创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    cluster.fork(); // 重启
  });
} else {
  // 工作进程可以共享 TCP 连接
  http.createServer((req, res) => {
    res.end('Hello World');
  }).listen(8000);
  
  console.log(`工作进程 ${process.pid} 已启动`);
}
```

**负载均衡策略**：
- 默认使用轮询（Round-Robin）
- 主进程监听端口，将连接分发给工作进程
- 如果某个工作进程崩溃，主进程可以重启它

**Worker Threads vs 多进程**：
- Worker Threads：共享内存，轻量级，适合 CPU 密集型任务
- 多进程：隔离内存，更稳定，适合 I/O 密集型任务

</details>

---

## 6. 中间件机制

**Express vs Koa**：
- Express：线性模型（1 → 2 → 3）
- Koa：洋葱模型（1开始 → 2开始 → 3开始 → 3结束 → 2结束 → 1结束）

**洋葱模型优势**：
- 更好的异步控制
- 可在响应前后执行代码

<details>
<summary><b>📖 详解</b></summary>

**为什么叫洋葱模型？**
- 像剥洋葱一样，从外层进入，再从内层出来
- 每个中间件都有「进入」和「返回」两个阶段

**执行流程图**：
```
请求 →
  中间件1 开始
    中间件2 开始
      中间件3 开始
      中间件3 结束
    中间件2 结束
  中间件1 结束
← 响应
```

**实际例子**：
```javascript
const Koa = require('koa');
const app = new Koa();

// 中间件1：日志
app.use(async (ctx, next) => {
  console.log('1. 请求开始');
  const start = Date.now();
  await next(); // 执行下一个中间件
  const ms = Date.now() - start;
  console.log(`1. 请求结束，耗时 ${ms}ms`);
});

// 中间件2：权限验证
app.use(async (ctx, next) => {
  console.log('2. 验证权限');
  await next();
  console.log('2. 权限验证完成');
});

// 中间件3：业务逻辑
app.use(async (ctx) => {
  console.log('3. 处理业务');
  ctx.body = 'Hello World';
});

// 输出顺序：
// 1. 请求开始
// 2. 验证权限
// 3. 处理业务
// 2. 权限验证完成
// 1. 请求结束，耗时 5ms
```

**洋葱模型的实现原理**：
```javascript
function compose(middlewares) {
  return function(context) {
    function dispatch(index) {
      // 所有中间件执行完毕
      if (index >= middlewares.length) {
        return Promise.resolve();
      }
      
      const middleware = middlewares[index];
      
      // 执行当前中间件，传入 next 函数
      return Promise.resolve(
        middleware(context, () => dispatch(index + 1))
      );
    }
    
    return dispatch(0);
  };
}

// 使用
const fn = compose([middleware1, middleware2, middleware3]);
fn(ctx);
```

**为什么比 Express 好？**

1. **异步处理更优雅**：
```javascript
// Express：需要手动处理异步错误
app.use((req, res, next) => {
  someAsyncFunc()
    .then(data => {
      res.json(data);
    })
    .catch(next); // 必须手动 catch
});

// Koa：自动捕获异步错误
app.use(async (ctx, next) => {
  ctx.body = await someAsyncFunc(); // 错误会自动被捕获
});
```

2. **可以在响应后执行代码**：
```javascript
app.use(async (ctx, next) => {
  await next(); // 等待后续中间件执行完
  // 这里可以记录日志、清理资源等
  console.log('响应已发送，状态码：', ctx.status);
});
```

**应用场景**：
- 统计请求耗时
- 错误处理
- 权限验证
- 日志记录
- 响应压缩

</details>

---

## 高频面试题速答

### Q1: Node.js 单线程还是多线程？
- JS 执行单线程
- 底层 libuv 多线程（I/O 操作）
- 可用 cluster 创建多进程

<details>
<summary><b>📖 详解</b></summary>

**准确答案**："Node.js 的 JavaScript 执行是单线程的，但底层是多线程的"

**分层理解**：

1. **JavaScript 执行层**：单线程
   - 你写的 JS 代码在一个线程中执行
   - 同一时刻只能执行一段 JS 代码
   - 这就是为什么不用担心线程安全问题

2. **I/O 操作层**：多线程
   - 文件读写、网络请求等在 libuv 线程池中执行
   - 默认线程池大小为 4
   - 这些操作完成后，回调会放入事件队列

**实际例子**：
```javascript
console.log('1');

fs.readFile('file.txt', (err, data) => {
  // 这个回调在 JS 主线程执行
  // 但文件读取在 libuv 线程池执行
  console.log('2');
});

console.log('3');
// 输出：1 → 3 → 2
```

**为什么这样设计？**
- 单线程：简化编程模型，避免锁和竞态条件
- 多线程 I/O：充分利用系统资源，不阻塞主线程
- 最佳实践：适合 I/O 密集型应用，不适合 CPU 密集型

**如何验证？**
```javascript
// 查看线程池大小
process.env.UV_THREADPOOL_SIZE = 8; // 可以调整

// CPU 密集型任务会阻塞主线程
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('开始');
fibonacci(40); // 会阻塞几秒钟
console.log('结束'); // 必须等上面执行完
```

</details>

### Q2: process.nextTick vs setImmediate？
- `nextTick`：当前阶段结束后立即执行，优先级最高
- `setImmediate`：check 阶段执行，优先级低

<details>
<summary><b>📖 详解</b></summary>

**执行时机对比**：
```javascript
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));

// 输出顺序：
// nextTick
// Promise
// setImmediate
```

**为什么这个顺序？**

1. **process.nextTick**：
   - 在当前操作完成后立即执行
   - 在事件循环的任何阶段之前执行
   - 优先级：nextTick > 微任务 > 事件循环阶段

2. **Promise（微任务）**：
   - 在 nextTick 队列清空后执行
   - 在进入下一个事件循环阶段前执行

3. **setImmediate**：
   - 在事件循环的 check 阶段执行
   - 是宏任务的一种

**在 I/O 回调中的表现**：
```javascript
fs.readFile('file.txt', () => {
  setImmediate(() => console.log('setImmediate'));
  process.nextTick(() => console.log('nextTick'));
});
// 输出：nextTick → setImmediate
```

**在主模块中的表现**：
```javascript
// 在主模块中，顺序不确定
setImmediate(() => console.log('setImmediate'));
setTimeout(() => console.log('setTimeout'), 0);
// 可能是 setImmediate 先，也可能是 setTimeout 先
// 取决于进程性能和其他因素
```

**nextTick 的陷阱**：
```javascript
// ❌ 危险：会导致事件循环饥饿
function recursiveNextTick() {
  process.nextTick(recursiveNextTick);
}
recursiveNextTick();
// I/O 永远不会执行，因为 nextTick 一直在递归
```

**使用建议**：
- `nextTick`：需要在当前操作后立即执行（如错误处理、清理资源）
- `setImmediate`：需要在 I/O 事件后执行（推荐用于大部分场景）
- 避免递归调用 `nextTick`

</details>

### Q3: require vs import？
- require：运行时、同步、值拷贝、CommonJS
- import：编译时、异步、值引用、ES Module

<details>
<summary><b>📖 详解</b></summary>

**核心区别总结**：

| 特性 | require | import |
|------|---------|--------|
| 标准 | CommonJS | ES Module |
| 加载时机 | 运行时 | 编译时（静态） |
| 加载方式 | 同步 | 异步 |
| 输出 | 值拷贝 | 值引用（只读） |
| 动态加载 | 支持 | 需要 import() |
| this 指向 | 当前模块 | undefined |
| 顶层变量 | 不是全局 | 不是全局 |

**1. 加载时机的区别**：
```javascript
// require：运行时加载，可以动态
if (condition) {
  const module = require('./module'); // ✅ 可以
}

// import：编译时加载，必须在顶层
if (condition) {
  import module from './module'; // ❌ 报错
}

// 动态 import
if (condition) {
  import('./module').then(module => {}); // ✅ 可以
}
```

**2. 值拷贝 vs 值引用**：
```javascript
// CommonJS - 值拷贝
// counter.js
let count = 0;
function increment() { count++; }
module.exports = { count, increment };

// main.js
const counter = require('./counter');
console.log(counter.count); // 0
counter.increment();
console.log(counter.count); // 还是 0（拷贝的值不会变）

// ES Module - 值引用
// counter.js
export let count = 0;
export function increment() { count++; }

// main.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1（引用的值会变）
```

**3. 循环依赖的处理**：
```javascript
// CommonJS：可能出现不完整的 exports
// a.js
const b = require('./b');
console.log('a:', b.done);
exports.done = true;

// b.js
const a = require('./a');
console.log('b:', a.done); // undefined（a 还没执行完）
exports.done = true;

// ES Module：通过静态分析提前建立引用，处理更好
```

**4. 在 Node.js 中使用 ES Module**：
```javascript
// 方式1：文件扩展名改为 .mjs
// module.mjs
export const name = 'test';

// 方式2：package.json 中设置 "type": "module"
{
  "type": "module"
}

// 方式3：使用 .cjs 扩展名保留 CommonJS
```

**5. 互操作性**：
```javascript
// ES Module 中导入 CommonJS
import pkg from 'commonjs-package'; // ✅ 可以
import { method } from 'commonjs-package'; // ❌ 不行（默认导出）

// CommonJS 中导入 ES Module
const module = require('es-module'); // ❌ 不行
const module = await import('es-module'); // ✅ 需要异步
```

**面试加分项**：
- Tree Shaking：ES Module 支持，因为是静态的
- 性能：ES Module 可以提前分析依赖，优化加载
- 趋势：ES Module 是未来标准，逐渐替代 CommonJS

</details>

### Q4: 如何利用多核 CPU？
1. cluster 模块
2. child_process
3. PM2
4. Worker Threads

<details>
<summary><b>📖 详解</b></summary>

**为什么需要利用多核？**
- Node.js 单线程只能用一个 CPU 核心
- 现代服务器通常有 4-16 个核心
- 不利用多核 = 浪费 75%-94% 的计算资源

**四种方案对比**：

**1. cluster 模块（最常用）**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // 主进程：创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // 工作进程：处理请求
  http.createServer((req, res) => {
    res.end('Hello');
  }).listen(8000);
}
```
- 优点：自动负载均衡、进程管理
- 缺点：进程间通信复杂
- 适用：Web 服务器

**2. child_process（灵活）**
```javascript
const { fork } = require('child_process');

// 主进程
const worker = fork('worker.js');
worker.send({ task: 'heavy-computation' });
worker.on('message', (result) => {
  console.log('结果：', result);
});

// worker.js
process.on('message', (msg) => {
  const result = heavyComputation(msg.task);
  process.send(result);
});
```
- 优点：灵活，可以执行不同任务
- 缺点：需要手动管理
- 适用：后台任务、定时任务

**3. PM2（生产环境推荐）**
```bash
# 安装
npm install -g pm2

# 启动应用，自动使用所有 CPU 核心
pm2 start app.js -i max

# 查看状态
pm2 status

# 零停机重启
pm2 reload app
```
- 优点：自动重启、日志管理、监控
- 缺点：需要额外安装
- 适用：生产环境部署

**4. Worker Threads（CPU 密集型）**
```javascript
const { Worker } = require('worker_threads');

// 主线程
const worker = new Worker('./worker.js', {
  workerData: { num: 42 }
});

worker.on('message', (result) => {
  console.log('结果：', result);
});

// worker.js
const { parentPort, workerData } = require('worker_threads');
const result = fibonacci(workerData.num);
parentPort.postMessage(result);
```
- 优点：共享内存、轻量级
- 缺点：API 较新，兼容性
- 适用：CPU 密集型计算（加密、压缩）

**选择建议**：

| 场景 | 推荐方案 |
|------|----------|
| Web 服务器 | cluster 或 PM2 |
| 后台任务 | child_process |
| CPU 密集计算 | Worker Threads |
| 生产环境 | PM2 |

**性能对比**：
```javascript
// 单进程
// 4 核 CPU，QPS: 1000

// cluster（4 进程）
// 4 核 CPU，QPS: 3500-4000（接近线性扩展）

// Worker Threads（4 线程）
// 4 核 CPU，QPS: 3000-3500（共享内存有开销）
```

**注意事项**：
- 进程数 ≈ CPU 核心数（不要超过太多）
- 注意内存占用（每个进程都有独立内存）
- 做好进程间通信和错误处理

</details>

### Q5: 什么是背压？
- 写入速度 > 读取速度
- 用 `pipe()` 或监听 `drain` 事件解决
- 也可以用消息队列（不同场景）

<details>
<summary><b>📖 详解</b></summary>

**什么是背压？**
背压（Backpressure）是指数据生产速度 > 数据消费速度，导致数据堆积的现象。

**生活中的例子**：
- 水龙头（生产）开太大，水槽（消费）排水慢 → 水会溢出
- 工厂生产（生产）太快，仓库（消费）存不下 → 货物堆积

**Node.js 中的背压场景**：
```javascript
// 场景：读取大文件并写入
const readable = fs.createReadStream('1GB-file.txt');
const writable = fs.createWriteStream('output.txt');

readable.on('data', (chunk) => {
  writable.write(chunk);
  // 问题：如果磁盘写入慢，chunk 会堆积在内存中
  // 1GB 文件可能导致内存占用 1GB+
});
```

**解决方案详解**：

**方案 1：使用 pipe()（最简单）**
```javascript
readable.pipe(writable);

// pipe 内部实现了背压处理：
// 1. 监听 writable.write() 的返回值
// 2. 如果返回 false，暂停读取
// 3. 监听 drain 事件，恢复读取
```

**方案 2：手动处理 drain 事件**
```javascript
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  
  if (!canContinue) {
    console.log('缓冲区满，暂停读取');
    readable.pause();
  }
});

writable.on('drain', () => {
  console.log('缓冲区已清空，恢复读取');
  readable.resume();
});

readable.on('end', () => {
  writable.end();
});
```

**方案 3：使用消息队列（不同场景）**

消息队列解决的是**分布式系统**的背压问题：

```javascript
// 场景：大量用户上传文件
app.post('/upload', async (req, res) => {
  // 不直接处理，而是放入队列
  await messageQueue.publish('file-processing', {
    fileId: req.file.id,
    userId: req.user.id
  });
  
  res.json({ status: 'queued' });
});

// 消费者：慢慢处理队列中的任务
const consumer = messageQueue.subscribe('file-processing', async (msg) => {
  await processFile(msg.fileId);
});
```

**Stream 背压 vs 消息队列**：

| 对比 | Stream 背压 | 消息队列 |
|------|-------------|----------|
| 场景 | 单进程内 I/O | 分布式系统 |
| 目的 | 防止内存溢出 | 削峰填谷、解耦 |
| 实时性 | 毫秒级 | 秒级或更长 |
| 数据持久化 | 否 | 是 |
| 适用 | 文件处理、网络传输 | 异步任务、微服务 |

**实际应用场景**：

1. **文件上传**：
```javascript
// Stream 背压：处理上传流
app.post('/upload', (req, res) => {
  const writeStream = fs.createWriteStream('upload.txt');
  req.pipe(writeStream); // 自动处理背压
  
  writeStream.on('finish', () => {
    res.json({ success: true });
  });
});
```

2. **视频流转码**：
```javascript
// 结合使用：消息队列 + Stream
app.post('/transcode', async (req, res) => {
  // 1. 先放入队列（避免同时处理太多）
  await queue.publish('transcode', { videoId });
  res.json({ status: 'queued' });
});

// 2. 消费者用 Stream 处理（避免内存溢出）
queue.subscribe('transcode', async ({ videoId }) => {
  fs.createReadStream(`${videoId}.mp4`)
    .pipe(ffmpeg())
    .pipe(fs.createWriteStream(`${videoId}-transcoded.mp4`));
});
```

**总结**：
- **单进程内**处理流式数据 → 用 Stream 背压（pipe/drain）
- **多服务间**异步处理任务 → 用消息队列
- **两者结合**：消息队列控制任务数量，Stream 处理具体数据

</details>

---

## 记忆口诀

**事件循环六阶段**：
```
定时器 timers
待处理 pending
空闲时 idle
轮询中 poll
检查下 check
关闭了 close
```

**Stream 四兄弟**：
```
读 Readable
写 Writable
双 Duplex
转 Transform
```

**child_process 四剑客**：
```
spawn 启动
exec 执行
execFile 文件
fork 分叉
```

---

## 快速记忆要点

✅ **必记**：
- Event Loop 六阶段顺序
- nextTick 优先级最高
- require 值拷贝，import 值引用
- Stream 四种类型
- cluster 主从模式

✅ **常考**：
- Node.js vs 浏览器事件循环
- 洋葱模型原理
- 背压处理
- 多进程方案

---

加油！💪
