# 异步控制工具集

## 📦 包含模块

### 1️⃣ scheduler.js - 并发控制器
控制同时执行的异步任务数量

### 2️⃣ taskQueue.js - 任务队列
按顺序串行执行异步任务

---

## 🚀 快速使用

### 并发控制（Scheduler）

**简单用法 - parallelExecute 函数**
```javascript
const { parallelExecute } = require('./scheduler');

// 8个任务，最多同时执行3个
const tasks = Array(8).fill(0).map((_, i) => 
  () => fetch(`/api/data/${i}`)
);

const results = await parallelExecute(tasks, 3);
```

**高级用法 - Scheduler 类**
```javascript
const { Scheduler } = require('./scheduler');

const scheduler = new Scheduler(2); // 最多2个并发

await Promise.all([
  scheduler.add(() => fetchData(1)),
  scheduler.add(() => fetchData(2)),
  scheduler.add(() => fetchData(3)), // 会等待前面的完成
]);
```

### 串行执行（TaskQueue）

**简单用法 - serialExecute 函数**
```javascript
const { serialExecute } = require('./taskQueue');

const tasks = [
  () => updateDB(1),
  () => updateDB(2),
  () => updateDB(3),
];

// 按顺序执行，一个完成再执行下一个
const results = await serialExecute(tasks);
```

**高级用法 - TaskQueue 类**
```javascript
const { TaskQueue } = require('./taskQueue');

const queue = new TaskQueue();

// 动态添加任务，自动串行执行
queue.add(() => step1());
queue.add(() => step2());
const result = await queue.add(() => step3());
```

---

## 🔑 核心原理

### 并发控制原理
```javascript
// 核心思路：用 Promise.race 等待最快完成的任务
const executing = [];
for (const task of tasks) {
  const p = task();
  if (executing.length >= limit) {
    await Promise.race(executing); // 等待任意一个完成
  }
  executing.push(p);
}
```

### 串行执行原理
```javascript
// 方法1：for-await 循环
for (const task of tasks) {
  await task(); // 依次等待
}

// 方法2：Promise 链
let promise = Promise.resolve();
promise = promise.then(task1).then(task2).then(task3);
```

---

## 💡 使用场景

### 并发控制适用于：
- ✅ 批量 API 请求（避免服务器压力）
- ✅ 大量文件上传/下载
- ✅ 并行数据处理（控制内存占用）

### 串行执行适用于：
- ✅ 数据库事务操作
- ✅ 有依赖关系的任务
- ✅ 需要保证执行顺序的场景

---

## 📝 面试要点

### Scheduler 实现要点
1. **控制并发数**：维护 `count` 记录当前执行数
2. **队列管理**：超过限制时，任务进入等待队列
3. **自动唤醒**：任务完成后，通知下一个任务执行

### TaskQueue 实现要点
1. **Promise 链**：用一个 Promise 链串联所有任务
2. **自动串行**：每个任务添加到链的末尾
3. **简洁实现**：只需一行核心代码

```javascript
// TaskQueue 核心代码
this.promise = this.promise.then(task);
```

---

## 🔄 对比

| 特性 | 并发控制 | 串行执行 |
|------|---------|---------|
| 执行方式 | 同时执行多个 | 依次执行 |
| 速度 | 快 | 慢 |
| 资源占用 | 高（可控） | 低 |
| 适用场景 | 独立任务 | 有依赖的任务 |


