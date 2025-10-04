# 事件系统实现

## EventEmitter vs PubSub

### EventEmitter
- 直接的事件处理系统
- 通常用于同一个模块内的事件处理
- 支持链式调用
- 适合组件内部通信

### 发布订阅（PubSub）
- 完全解耦的消息传递系统
- 适合跨模块/组件通信
- 提供显式的取消订阅机制
- 更适合大型应用架构

## 实现要点

### EventEmitter

1. 核心功能：
   - on：订阅事件
   - emit：触发事件
   - once：一次性订阅
   - off：取消订阅

2. 关键实现点：
   - 事件存储结构设计
   - 回调函数的 this 绑定
   - 异常处理机制
   - 链式调用支持

3. 常见错误：
   - 没有处理回调执行异常
   - 在遍历回调时修改回调数组
   - 内存泄漏（忘记取消订阅）
   - this 指向错误

### PubSub

1. 核心功能：
   - subscribe：订阅主题
   - publish：发布消息
   - unsubscribe：取消订阅

2. 关键实现点：
   - 主题-订阅者映射管理
   - 取消订阅函数返回
   - 订阅者异常隔离

3. 常见错误：
   - 没有清理空主题
   - 忘记处理订阅者异常
   - 返回的取消函数绑定错误

## 性能优化

1. 事件存储
   - 使用 Map 代替普通对象
   - 及时清理空事件/主题
   - 控制单个事件的订阅者数量

2. 回调执行
   - 异步执行避免阻塞
   - 批量处理多个事件
   - 优化频繁触发的事件

## 进阶实现

1. 优先级支持
```javascript
// 添加优先级参数
on(event, callback, priority = 0)
```

2. 通配符支持
```javascript
// 支持事件通配符
on('user.*', callback)
```

3. 异步事件支持
```javascript
// 异步事件处理
async emit(event, ...args)
```

4. 事件命名空间
```javascript
// 支持命名空间
on('namespace:event', callback)
```

## 测试用例

```javascript
// EventEmitter 测试
const emitter = new EventEmitter();
emitter
  .on('test', data => console.log(data))
  .emit('test', 'hello')
  .once('once', () => console.log('once'));

// PubSub 测试
const pubsub = new PubSub();
const unsubscribe = pubsub.subscribe('topic', data => console.log(data));
pubsub.publish('topic', 'hello');
unsubscribe(); // 取消订阅
```

## 应用场景

1. 组件通信
   - 父子组件事件传递
   - 兄弟组件消息传递

2. 状态管理
   - 状态变更通知
   - 数据更新广播

3. 插件系统
   - 插件生命周期事件
   - 钩子函数系统

4. 异步流程控制
   - 异步操作完成通知
   - 任务队列管理
