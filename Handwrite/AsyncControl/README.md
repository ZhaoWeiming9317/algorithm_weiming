# 异步控制实现

## 实现模块

### 0. async/await 手写实现 ⭐

**实现文件**: `async-await.js`

**核心原理**:
- async/await 是 Generator + 自动执行器的语法糖
- async 函数返回一个 Promise
- await 暂停函数执行，等待 Promise 完成

**实现要点**:
1. **Generator 函数**
   - 使用 yield 实现暂停
   - 使用 next() 恢复执行
   - 通过 value 和 done 控制流程

2. **自动执行器**
   - 递归调用 next()
   - 处理 Promise 结果
   - 错误传递（throw）

3. **错误处理**
   - try/catch 捕获同步错误
   - Promise.catch 捕获异步错误
   - gen.throw() 将错误传回 Generator

**使用示例**:
```javascript
const asyncFunc = asyncToGenerator(function* () {
    const result1 = yield Promise.resolve('First');
    const result2 = yield Promise.resolve('Second');
    return [result1, result2];
});

asyncFunc().then(results => {
    console.log(results); // ['First', 'Second']
});
```

**详细文档**: 查看 `async-await.md`

---

### 1. 并发控制器（Scheduler）

核心功能：
- 限制同时执行的异步任务数量
- 任务队列管理
- 自动执行等待的任务

实现要点：
1. 任务计数管理
   - 追踪运行中的任务数量
   - 控制不超过限制
2. 队列管理
   - 存储等待的任务
   - FIFO 任务执行顺序
3. 异常处理
   - 任务执行错误隔离
   - Promise 链完整性

常见错误：
- 没有正确处理任务完成计数
- 任务队列管理混乱
- Promise 链断裂
- 内存泄漏（任务引用未释放）

### 2. 任务队列（TaskQueue）

核心功能：
- 串行执行异步任务
- 动态添加任务
- 任务执行状态管理

实现要点：
1. 队列状态管理
   - running 标志控制
   - 动态任务添加
2. 错误处理
   - 单个任务错误隔离
   - Promise 状态传递
3. 执行顺序保证
   - FIFO 执行顺序
   - 串行执行保证

常见错误：
- 任务执行顺序错误
- 状态管理混乱
- 没有处理任务异常
- 队列阻塞处理不当

### 3. 执行器（Executors）

#### 串行执行器
特点：
- 按顺序执行任务
- 等待前一个任务完成
- 收集所有结果

#### 并行执行器
特点：
- 控制并发数量
- 同时执行多个任务
- 等待所有任务完成

## 性能优化

1. 内存管理
   - 及时清理完成的任务
   - 避免闭包导致的内存泄漏
   - 控制队列大小

2. 执行优化
   - 使用 Promise.race 优化任务调度
   - 批量处理任务
   - 任务优先级支持

## 进阶实现

1. 任务优先级
```javascript
class PriorityScheduler {
  add(task, priority = 0) {
    // 实现优先级队列
  }
}
```

2. 任务超时控制
```javascript
class TimeoutScheduler {
  add(task, timeout) {
    // 实现超时控制
  }
}
```

3. 任务取消支持
```javascript
class CancellableScheduler {
  add(task) {
    // 返回取消函数
    return { promise, cancel };
  }
}
```

## 测试用例

```javascript
// 并发控制测试
const scheduler = new Scheduler(2);
const tasks = [
  () => new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  () => new Promise(resolve => setTimeout(() => resolve(2), 500)),
  () => new Promise(resolve => setTimeout(() => resolve(3), 300))
];
tasks.forEach(task => scheduler.add(task));

// 任务队列测试
const queue = new TaskQueue();
queue.addTask(async () => {
  await someAsyncOperation();
  return result;
});

// 执行器测试
const results = await parallelExecute(tasks, 2);
console.log(results); // [1, 2, 3]
```

## 应用场景

1. 接口请求控制
   - API 并发限制
   - 请求队列管理
   - 错误重试

2. 资源加载
   - 图片并发加载
   - 文件分片上传
   - 大文件下载

3. 任务调度
   - 后台任务处理
   - 数据同步
   - 批量操作

4. 性能优化
   - 减少并发请求
   - 控制资源占用
   - 优化用户体验
