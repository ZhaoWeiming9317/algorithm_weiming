# Event Loop 练习题集

本目录包含从简单到复杂的 Event Loop 练习题，帮助你深入理解 JavaScript 异步执行机制。

## 📚 题目列表

### Level 1 - 基础入门
- **01-basic.js** - Event Loop 基础
  - 考点：同步代码、setTimeout、Promise.then
  - 难度：⭐
  - 适合：初学者理解事件循环基本概念

### Level 2 - 进阶理解
- **02-promise-chain.js** - Promise 链式调用
  - 考点：Promise 链、微任务队列
  - 难度：⭐⭐
  - 适合：理解 Promise.then 的执行顺序

### Level 3 - async/await
- **03-async-await.js** - async/await 基础
  - 考点：async/await、微任务执行时机
  - 难度：⭐⭐⭐
  - 适合：理解 await 的本质（Promise.then）

### Level 4 - Promise.all
- **04-promise-all.js** - Promise.all 并发
  - 考点：Promise.all、并发执行
  - 难度：⭐⭐⭐
  - 适合：理解并发与串行的区别

### Level 5 - 串行 vs 并行
- **05-async-await-promise-all.js** - 串行与并行对比
  - 考点：async/await 串行、Promise.all 并行
  - 难度：⭐⭐⭐⭐
  - 适合：实际应用场景，性能优化

### Level 6 - 混合任务
- **06-mixed-tasks.js** - 宏任务微任务混合
  - 考点：宏任务、微任务、多层嵌套
  - 难度：⭐⭐⭐⭐
  - 适合：理解任务队列的执行顺序

### Level 7 - 高级 async/await
- **07-async-await-advanced.js** - async/await 进阶
  - 考点：async 返回 Promise、await 等待时机
  - 难度：⭐⭐⭐⭐⭐
  - 适合：深入理解 async/await 机制

### Level 8 - Promise.all vs Promise.race
- **08-promise-all-race.js** - Promise 组合方法
  - 考点：Promise.all、Promise.race、错误处理
  - 难度：⭐⭐⭐⭐⭐
  - 适合：理解 Promise 组合方法的差异

### Level 9 - 综合应用
- **09-comprehensive.js** - 实际场景综合题
  - 考点：串行、并行、错误处理、实际应用
  - 难度：⭐⭐⭐⭐⭐
  - 适合：模拟真实开发场景

### Level 10 - 终极挑战
- **10-ultimate-challenge.js** - 终极挑战
  - 考点：所有知识点综合
  - 难度：⭐⭐⭐⭐⭐⭐
  - 适合：面试准备、全面测试理解程度

## 🎯 学习建议

### 1. 循序渐进
- 按照题目顺序从 Level 1 到 Level 10
- 每道题先自己分析，再看答案
- 理解原理比记住答案更重要

### 2. 动手验证
```bash
# 运行任意题目验证答案
node 01-basic.js
node 02-promise-chain.js
# ... 以此类推
```

### 3. 画图分析
- 画出调用栈（Call Stack）
- 画出微任务队列（Microtask Queue）
- 画出宏任务队列（Macrotask Queue）
- 标注执行顺序

### 4. 总结规律
- 同步代码 → 微任务 → 宏任务
- 每个宏任务执行完，清空所有微任务
- Promise.then 返回 Promise 需要额外轮次
- await 等待 Promise 需要额外轮次

## 📖 核心知识点

### 宏任务（Macrotask）
- setTimeout
- setInterval
- setImmediate（Node.js）
- I/O
- UI rendering

### 微任务（Microtask）
- Promise.then/catch/finally
- async/await（本质是 Promise）
- MutationObserver
- queueMicrotask
- process.nextTick（Node.js，优先级最高）

### 执行顺序
```
1. 执行同步代码
2. 执行所有微任务（清空微任务队列）
3. 渲染（如果需要）
4. 执行一个宏任务
5. 回到步骤 2
```

## 🔥 面试高频考点

1. **Event Loop 执行顺序**
   - 同步 → 微任务 → 宏任务

2. **async/await 的本质**
   - await 后面的代码相当于 Promise.then

3. **Promise.then 返回 Promise**
   - 需要额外的微任务轮次

4. **串行 vs 并行**
   - await 串行：总耗时累加
   - Promise.all 并行：总耗时取最大值

5. **Promise.all vs Promise.race**
   - all：所有成功才成功，一个失败就失败
   - race：第一个完成的决定结果

## 💡 常见误区

1. ❌ **认为 setTimeout(fn, 0) 会立即执行**
   - ✅ 会等到当前宏任务和所有微任务执行完

2. ❌ **认为 Promise 是异步的**
   - ✅ Promise 执行器（executor）是同步执行的
   - ✅ 只有 then/catch/finally 是异步（微任务）

3. ❌ **认为 await 会阻塞主线程**
   - ✅ await 只暂停当前 async 函数，不阻塞主线程

4. ❌ **认为多个 Promise.then 会同时执行**
   - ✅ 按注册顺序依次执行，但都在同一轮微任务中

## 🚀 进阶学习

- 浏览器进程和线程：`../browser/process-and-thread.md`
- Node.js Event Loop（与浏览器有差异）
- requestAnimationFrame（在渲染阶段执行）
- requestIdleCallback（在空闲时执行）

## 📝 练习方法

1. **看题目，先不看答案**
2. **在纸上写出预期输出**
3. **写出详细的执行过程**
4. **运行代码验证**
5. **对比答案，找出差异**
6. **理解错误原因**
7. **重复练习直到完全理解**

---

**最后更新时间：2025-10-07**
