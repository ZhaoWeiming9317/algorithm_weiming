# Node.js 面试题集

> 全面掌握 Node.js 核心知识点

## 📚 题目列表

### 01. Event Loop
- **01-event-loop.js** - Node.js 事件循环
  - 考点：事件循环、宏任务、微任务、process.nextTick
  - 难度：⭐⭐⭐
  - 重点：Node.js 与浏览器事件循环的区别

### 02. 模块系统
- **02-module-system.js** - 模块系统
  - 考点：CommonJS、ES Module、require、循环依赖
  - 难度：⭐⭐⭐⭐
  - 重点：模块加载机制和查找规则

### 03. Stream 和 Buffer
- **03-stream-buffer.js** - 流和缓冲区
  - 考点：Stream、Buffer、管道、背压
  - 难度：⭐⭐⭐⭐
  - 重点：流的类型和应用场景

### 04. 进程和集群
- **04-process-cluster.js** - 进程管理
  - 考点：process、child_process、cluster、IPC
  - 难度：⭐⭐⭐⭐⭐
  - 重点：多进程和进程间通信

### 05. 中间件机制
- **05-middleware-koa.js** - 中间件
  - 考点：Express、Koa、洋葱模型
  - 难度：⭐⭐⭐⭐⭐
  - 重点：洋葱模型的实现原理

---

## 🔥 核心知识点

### 1. Node.js Event Loop

**Node.js 事件循环的六个阶段**：
```
   ┌───────────────────────────┐
┌─>│           timers          │ ← setTimeout/setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │ ← I/O 回调
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │ ← 内部使用
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │ ← 检索新的 I/O 事件
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │ ← setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──│      close callbacks      │ ← socket.on('close')
   └───────────────────────────┘
```

**微任务优先级**：
1. `process.nextTick`（最高优先级）
2. `Promise.then/catch/finally`

**Node.js vs 浏览器**：
- Node.js：六个阶段，每个阶段有微任务队列
- 浏览器：宏任务 → 微任务 → 渲染

---

### 2. 模块系统

**CommonJS vs ES Module**：

| 特性 | CommonJS | ES Module |
|------|----------|-----------|
| 加载时机 | 运行时 | 编译时 |
| 加载方式 | 同步 | 异步 |
| 导出 | module.exports | export |
| 导入 | require() | import |
| 值类型 | 值拷贝 | 值引用 |
| 动态加载 | 支持 | import() |
| 循环依赖 | 可能有问题 | 更好的处理 |

**require 查找规则**：
1. 核心模块（如 `fs`、`path`）
2. 文件模块（`./`、`../`）
3. 第三方模块（`node_modules`）
4. 目录作为模块（`package.json` 的 `main` 字段）

**module.exports vs exports**：
```javascript
// ✅ 正确
module.exports = { name: 'test' };
exports.name = 'test';

// ❌ 错误
exports = { name: 'test' }; // 断开引用
```

---

### 3. Stream 流

**四种流类型**：
1. **Readable**：可读流（如 `fs.createReadStream`）
2. **Writable**：可写流（如 `fs.createWriteStream`）
3. **Duplex**：双工流（如 TCP socket）
4. **Transform**：转换流（如 `zlib.createGzip`）

**Stream 的优势**：
- 内存效率高：不需要一次性加载所有数据
- 时间效率高：可以边读边处理
- 组合性好：可以通过管道连接

**背压（Backpressure）**：
- 问题：写入速度 > 读取速度
- 解决：使用 `pipe()` 或监听 `drain` 事件

**应用场景**：
- 文件读写
- HTTP 请求/响应
- 数据压缩/解压
- 数据加密/解密

---

### 4. Buffer 缓冲区

**特点**：
- 用于处理二进制数据
- 固定大小的内存块
- 不受 V8 堆内存限制

**创建方式**：
```javascript
Buffer.from('Hello')      // 从字符串创建
Buffer.alloc(10)          // 分配 10 字节，填充 0
Buffer.allocUnsafe(10)    // 分配 10 字节，不初始化
```

---

### 5. 进程管理

**为什么需要多进程？**
- Node.js 是单线程
- 充分利用多核 CPU
- 提高并发处理能力
- 进程隔离，提高稳定性

**child_process 四种方式**：
1. `spawn`：流式输出，适合大量数据
2. `exec`：缓冲输出，适合少量数据
3. `execFile`：执行文件
4. `fork`：创建 Node.js 子进程，支持 IPC

**cluster 集群**：
- 主进程（master）：管理工作进程
- 工作进程（worker）：处理请求
- 自动负载均衡

**进程间通信（IPC）**：
```javascript
// 父进程
child.send({ data: 'hello' });
child.on('message', (msg) => {});

// 子进程
process.send({ data: 'hi' });
process.on('message', (msg) => {});
```

---

### 6. 中间件机制

**Express 线性模型**：
```
中间件1 → 中间件2 → 中间件3 → 响应
```

**Koa 洋葱模型**：
```
中间件1开始 → 中间件2开始 → 中间件3开始
           ↓
中间件3结束 ← 中间件2结束 ← 中间件1结束
```

**洋葱模型的优势**：
- 更好的异步流程控制
- 更清晰的错误处理
- 可以在响应前后执行代码

**实现原理**：
```javascript
function compose(middlewares) {
  return function(context) {
    function dispatch(index) {
      if (index >= middlewares.length) return Promise.resolve();
      const middleware = middlewares[index];
      return Promise.resolve(
        middleware(context, () => dispatch(index + 1))
      );
    }
    return dispatch(0);
  };
}
```

---

## 🎯 高频面试题

### Q1: Node.js 是单线程还是多线程？

**答案**：
- JavaScript 执行是单线程
- 但 Node.js 底层使用了多线程（libuv 线程池）
- I/O 操作、文件系统操作等在线程池中执行
- 可以通过 cluster 创建多进程

---

### Q2: Node.js 事件循环和浏览器的区别？

**答案**：
1. **阶段不同**：
   - Node.js：六个阶段
   - 浏览器：宏任务 → 微任务 → 渲染

2. **微任务执行时机**：
   - Node.js：每个阶段结束后执行微任务
   - 浏览器：每个宏任务后执行微任务

3. **独有 API**：
   - Node.js：`process.nextTick`、`setImmediate`
   - 浏览器：`requestAnimationFrame`、`requestIdleCallback`

---

### Q3: require 和 import 的区别？

**答案**：
1. **加载时机**：require 运行时，import 编译时
2. **加载方式**：require 同步，import 异步
3. **值类型**：require 值拷贝，import 值引用
4. **动态加载**：require 支持，import 需要 `import()`
5. **使用场景**：require 是 CommonJS，import 是 ES Module

---

### Q4: 什么是 Stream？为什么要用 Stream？

**答案**：
- Stream 是处理流式数据的抽象接口
- 优点：
  1. 内存效率高：不需要一次性加载所有数据
  2. 时间效率高：可以边读边处理
  3. 组合性好：可以通过管道连接
- 应用场景：大文件处理、实时数据处理

---

### Q5: 如何充分利用多核 CPU？

**答案**：
1. 使用 `cluster` 模块创建多个工作进程
2. 使用 `child_process` 创建子进程
3. 使用 PM2 等进程管理工具
4. 使用 Worker Threads（Node.js 10.5+）

---

### Q6: Koa 的洋葱模型是什么？

**答案**：
- 中间件按顺序执行，遇到 `await next()` 暂停
- 执行下一个中间件
- 所有中间件执行完后，按相反顺序返回
- 优势：更好的异步控制、可以在响应前后执行代码

---

### Q7: 什么是背压？如何处理？

**答案**：
- 背压：写入速度 > 读取速度，导致内存占用过高
- 解决方案：
  1. 使用 `pipe()`（自动处理背压）
  2. 监听 `drain` 事件手动处理
  3. 控制写入速度

---

### Q8: process.nextTick 和 setImmediate 的区别？

**答案**：
- `process.nextTick`：
  - 在当前阶段结束后立即执行
  - 优先级最高
  - 可能导致 I/O 饥饿

- `setImmediate`：
  - 在 check 阶段执行
  - 优先级低于 `process.nextTick`
  - 不会阻塞 I/O

---

## 💡 记忆口诀

**Node.js 事件循环六阶段**：
```
timers 定时器
pending 待处理
idle 空闲
poll 轮询
check 检查
close 关闭
```

**Stream 四兄弟**：
```
Readable 可读
Writable 可写
Duplex 双工
Transform 转换
```

**child_process 四剑客**：
```
spawn 启动子进程
exec 执行命令
execFile 执行文件
fork 创建 Node 子进程
```

---

## 📝 学习建议

1. **理解原理**：不要死记硬背，理解底层原理
2. **动手实践**：运行代码，观察输出
3. **对比学习**：Node.js vs 浏览器
4. **实战应用**：结合实际项目场景

---

## 🚀 进阶学习

- Event Loop 深入：libuv 源码
- Stream 实战：文件上传、视频流
- 性能优化：内存泄漏检测、CPU 分析
- 微服务：RPC、消息队列
- 安全：XSS、CSRF、SQL 注入

---
