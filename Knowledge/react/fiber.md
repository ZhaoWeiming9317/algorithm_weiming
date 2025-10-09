# React Fiber 架构详解

## 📌 什么是 Fiber？

**Fiber 是 React 16 引入的新的协调引擎（Reconciler），用于实现可中断的渲染。**

### 一句话总结
**Fiber = 可中断的虚拟 DOM**

---

## 🎯 为什么需要 Fiber？

### React 15 的问题

```javascript
// React 15：递归更新，不可中断
function updateComponent(component) {
  render(component);
  updateChildren(component.children); // 递归调用
}

// 问题：
// 1. 递归调用栈很深，无法中断
// 2. 大组件树更新时，主线程被长时间占用
// 3. 用户交互（点击、输入）无法响应，页面卡顿
```

**实际例子**：
```javascript
// 假设有 10000 个组件需要更新
<App>
  <List>
    {items.map(item => <Item key={item.id} />)}  // 10000 个
  </List>
</App>

// React 15：一次性递归更新完所有组件（可能需要 100ms）
// 这 100ms 内，用户点击按钮没有任何反应 → 卡顿 ❌
```

**类比理解**：
```
React 15 = 一口气跑完马拉松（累死，中途不能休息）
Fiber   = 分段跑马拉松（跑一段休息一下，随时可以停）
```

---

## 💡 Fiber 的解决方案

### 核心思想：时间切片（Time Slicing）

**把长任务拆分成小任务，每个小任务执行完后检查是否需要让出控制权。**

```javascript
// React 15：一口气做完
function updateAll() {
  for (let i = 0; i < 10000; i++) {
    updateComponent(components[i]); // 不可中断，阻塞主线程
  }
}

// React 16 Fiber：分片执行
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 处理一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  
  if (nextUnitOfWork) {
    // 还有工作没做完，下次继续
    requestIdleCallback(workLoop);
  }
}
```

**效果对比**：
```
React 15:
[========== 100ms 阻塞 ==========] 完成
用户点击 ❌ 无响应

Fiber:
[10ms][让出][10ms][让出][10ms][让出]... 完成
用户点击 ✅ 立即响应
```

---

## 🏗️ Fiber 的数据结构

### Fiber 节点

**Fiber 是一个 JavaScript 对象，代表一个工作单元。**

```javascript
// Fiber 节点的核心结构
const fiber = {
  // ========== 1. 节点信息 ==========
  type: 'div',              // 组件类型（'div'、函数组件、类组件）
  key: 'unique-key',        // key
  stateNode: domElement,    // 对应的 DOM 节点或组件实例
  
  // ========== 2. Fiber 树结构（链表）==========
  child: childFiber,        // 第一个子节点
  sibling: siblingFiber,    // 下一个兄弟节点
  return: parentFiber,      // 父节点
  
  // ========== 3. 工作相关 ==========
  pendingProps: newProps,   // 新的 props
  memoizedProps: oldProps,  // 旧的 props
  memoizedState: state,     // 旧的 state
  updateQueue: [],          // 更新队列
  
  // ========== 4. 副作用 ==========
  flags: Update | Placement, // 副作用标记（更新、插入、删除等）
  nextEffect: nextFiber,    // 下一个有副作用的 Fiber
  
  // ========== 5. 优先级 ==========
  lanes: 0b0001,            // 优先级（React 18）
  
  // ========== 6. 双缓存 ==========
  alternate: oldFiber       // 指向另一棵树的对应节点
};
```

### 为什么用链表而不是树？⭐⭐⭐

```javascript
// ❌ 树结构：需要递归遍历，无法中断
function traverseTree(node) {
  visit(node);
  node.children.forEach(child => {
    traverseTree(child); // 递归，无法中断
  });
}

// ✅ 链表结构：可以用循环遍历，随时中断
function traverseFiber(fiber) {
  let current = fiber;
  
  while (current) {
    visit(current);
    
    // 可以随时中断
    if (shouldYield()) {
      return current; // 保存当前位置，下次继续
    }
    
    current = getNextFiber(current);
  }
}
```

**关键区别**：
- **树 + 递归**：调用栈深，无法保存进度
- **链表 + 循环**：可以保存当前节点，随时恢复

---

## 🔄 Fiber 树的遍历

### 示例组件树

```javascript
<App>
  <Header>
    <Logo />
    <Nav />
  </Header>
  <Content>
    <Sidebar />
    <Main />
  </Content>
</App>
```

### 对应的 Fiber 树结构（链表）

```
        App
         |
      Header -----> Content
         |             |
      Logo -> Nav   Sidebar -> Main

说明：
| = child（子节点）
→ = sibling（兄弟节点）
```

### 遍历顺序（深度优先）

```
App → Header → Logo → Nav → Content → Sidebar → Main
```

### 遍历算法

```javascript
function getNextFiber(fiber) {
  // 规则1：如果有子节点，返回第一个子节点
  if (fiber.child) {
    return fiber.child;
  }
  
  // 规则2：如果没有子节点，找兄弟节点
  let current = fiber;
  while (current) {
    if (current.sibling) {
      return current.sibling;
    }
    
    // 规则3：如果没有兄弟节点，回到父节点继续找
    current = current.return;
  }
  
  return null; // 遍历完成
}

// 实际使用
function workLoop(deadline) {
  while (nextFiber && deadline.timeRemaining() > 1) {
    // 处理当前 Fiber
    performUnitOfWork(nextFiber);
    
    // 获取下一个 Fiber
    nextFiber = getNextFiber(nextFiber);
  }
  
  if (nextFiber) {
    requestIdleCallback(workLoop); // 继续处理
  }
}
```

**遍历过程详解**：
```javascript
// 从 App 开始
current = App
  → 有 child？✅ → 去 Header

current = Header
  → 有 child？✅ → 去 Logo

current = Logo
  → 有 child？❌
  → 有 sibling？✅ → 去 Nav

current = Nav
  → 有 child？❌
  → 有 sibling？❌
  → 回到 parent (Header)
  → Header 有 sibling？✅ → 去 Content

current = Content
  → 有 child？✅ → 去 Sidebar

current = Sidebar
  → 有 child？❌
  → 有 sibling？✅ → 去 Main

current = Main
  → 有 child？❌
  → 有 sibling？❌
  → 回到 parent (Content)
  → Content 有 sibling？❌
  → 回到 parent (App)
  → App 有 sibling？❌
  → 遍历完成
```

---

## 🎭 双缓存机制（Double Buffering）⭐⭐⭐

### 为什么需要双缓存？

```javascript
// ❌ 问题：如果直接在当前树上修改
function update() {
  updateNode1(); // ✅ 完成，用户看到新 UI
  updateNode2(); // ✅ 完成，用户看到新 UI
  updateNode3(); // ⏸️ 被中断
  // 用户看到：一半新 UI，一半旧 UI → 不一致 ❌
}

// ✅ 解决：在内存中构建新树，完成后一次性替换
function updateWithDoubleBuffer() {
  // 在 workInProgress 树上工作（用户看不到）
  buildNewTree();
  
  // 完成后，一次性切换（用户看到完整的新 UI）
  current = workInProgress;
}
```

### 双缓存实现

```javascript
// 两棵 Fiber 树
let currentRoot = null;        // 当前显示的树（屏幕上）
let workInProgressRoot = null; // 正在构建的树（内存中）

// 每个 Fiber 节点都有 alternate 指针
currentFiber.alternate = workInProgressFiber;
workInProgressFiber.alternate = currentFiber;

// 渲染流程
function render() {
  // 1. 基于 current 树创建 workInProgress 树
  workInProgressRoot = createWorkInProgress(currentRoot);
  
  // 2. 在 workInProgress 树上工作（可中断）
  workLoop();
  
  // 3. 完成后，切换指针
  currentRoot = workInProgressRoot;
  workInProgressRoot = null;
}
```

### 图解双缓存

```
初始状态：
current tree (屏幕上)        workInProgress tree (内存中)
     App                           App'
      |                             |
   Header                        Header'
      |                             |
    Logo                          Logo'
      ↕ alternate                   ↕
    Logo' ←----------------------→ Logo

更新过程：
1. 在 workInProgress 树上修改（用户看不到）
2. 修改完成后，切换指针
3. workInProgress 变成 current（用户看到新 UI）
4. 旧的 current 变成新的 workInProgress（下次更新用）
```

**类比理解**：
```
双缓存 = 画画的草稿纸
- current tree = 展示的画（墙上）
- workInProgress tree = 草稿纸（桌上）
- 在草稿纸上画好，再一次性挂到墙上
- 不会让观众看到画到一半的作品
```

---

## ⚙️ Fiber 的工作流程

### 两个阶段

**1. Render 阶段（可中断）⭐⭐⭐**

```javascript
// Render 阶段：构建 Fiber 树，标记副作用
function renderPhase() {
  // ✅ 可以被中断
  while (nextFiber && !shouldYield()) {
    nextFiber = performUnitOfWork(nextFiber);
  }
}

function performUnitOfWork(fiber) {
  // 1. beginWork：处理当前节点
  //    - 调用组件函数/类方法
  //    - 对比新旧 props（Diff）
  //    - 创建子 Fiber
  beginWork(fiber);
  
  // 2. completeWork：完成当前节点
  //    - 创建/更新 DOM 节点
  //    - 收集副作用
  completeWork(fiber);
  
  return getNextFiber(fiber);
}
```

**2. Commit 阶段（不可中断）⭐⭐⭐**

```javascript
// Commit 阶段：一次性提交所有更新到 DOM
function commitPhase(finishedWork) {
  // ❌ 必须同步执行，不能中断
  // 否则用户会看到不完整的 UI
  
  // 1. before mutation：执行 getSnapshotBeforeUpdate
  commitBeforeMutationEffects(finishedWork);
  
  // 2. mutation：更新 DOM
  commitMutationEffects(finishedWork);
  
  // 3. layout：执行 useLayoutEffect、componentDidMount
  commitLayoutEffects(finishedWork);
}
```

### 完整流程示例

```javascript
// 用户点击按钮，触发状态更新
function handleClick() {
  setState({ count: 1 });
}

// ========== 完整流程 ==========

// 1. 调度更新
scheduleUpdateOnFiber(fiber);

// 2. Render 阶段（可中断）
function workLoop(deadline) {
  while (nextFiber && deadline.timeRemaining() > 1) {
    // 处理 App Fiber
    nextFiber = performUnitOfWork(appFiber);
    
    // 处理 Button Fiber
    nextFiber = performUnitOfWork(buttonFiber);
    
    // 时间不够了，让出控制权
    if (deadline.timeRemaining() < 1) {
      requestIdleCallback(workLoop); // 下次继续
      return;
    }
  }
  
  // 3. Commit 阶段（不可中断）
  commitRoot(finishedWork);
}

// 4. 提交更新
function commitRoot(root) {
  // 一次性更新所有 DOM
  commitMutationEffects(root);
  
  // 切换 current 指针
  root.current = root.finishedWork;
}
```

**时间线**：
```
用户点击
  ↓
调度更新
  ↓
Render 阶段（可中断）
  ├─ 处理 Fiber 1 (5ms)
  ├─ 检查时间，还有剩余
  ├─ 处理 Fiber 2 (5ms)
  ├─ 检查时间，不够了
  ├─ 让出控制权，处理用户输入
  ├─ 继续处理 Fiber 3 (5ms)
  └─ 完成
  ↓
Commit 阶段（不可中断）
  ├─ 更新 DOM (10ms)
  └─ 完成
  ↓
用户看到新 UI
```

---

## 🚦 优先级调度

### 为什么需要优先级？

```javascript
// 场景：用户正在输入搜索，同时有大列表渲染
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleInput = (e) => {
    setQuery(e.target.value);      // 高优先级：用户输入
    setResults(search(e.target.value)); // 低优先级：搜索结果
  };
  
  return (
    <>
      <input value={query} onChange={handleInput} />
      <List items={results} /> {/* 10000 条数据 */}
    </>
  );
}

// 没有优先级：输入框卡顿（等待列表渲染完成）❌
// 有优先级：输入框立即响应，列表渲染可以被中断 ✅
```

### Fiber 的优先级系统（React 18）

```javascript
// React 18 的优先级（Lanes）
const SyncLane = 0b0001;              // 同步优先级（最高）
const InputContinuousLane = 0b0010;   // 连续输入
const DefaultLane = 0b0100;           // 默认优先级
const TransitionLane = 0b1000;        // Transition 优先级（最低）

// 调度更新时分配优先级
function scheduleUpdate(fiber, update) {
  const lane = requestUpdateLane(fiber);
  update.lane = lane;
  
  // 高优先级的更新可以打断低优先级的更新
  if (isHigherPriority(lane, currentLane)) {
    interruptCurrentWork();
    startNewWork(fiber, lane);
  }
}

// 示例
function handleClick() {
  // 用户点击：高优先级
  setState({ clicked: true }); // SyncLane
}

function handleScroll() {
  // 滚动：低优先级
  setState({ scrollY: window.scrollY }); // DefaultLane
}

// 如果滚动更新正在进行，点击事件会中断它
```

---

## 🎨 实际例子

### 例子1：大列表渲染

```javascript
// 没有 Fiber（React 15）
function BigList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// 渲染 10000 条数据
<BigList items={tenThousandItems} />

// React 15：
// - 一次性渲染完所有 10000 个 li（可能需要 100ms）
// - 这 100ms 内，页面完全卡死 ❌

// React 16 Fiber：
// - 渲染 100 个 li（5ms）
// - 检查是否需要让出控制权
// - 让出控制权，处理用户输入
// - 继续渲染下 100 个 li
// - 用户感觉：页面流畅，可以随时交互 ✅
```

### 例子2：动画 + 数据更新

```javascript
function AnimatedList() {
  const [items, setItems] = useState([]);
  const [animation, setAnimation] = useState(0);
  
  useEffect(() => {
    // 动画：每 16ms 更新一次（60fps）
    const timer = setInterval(() => {
      setAnimation(a => a + 1); // 高优先级
    }, 16);
    
    // 数据加载：低优先级
    fetchData().then(data => {
      setItems(data); // 低优先级
    });
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div style={{ transform: `translateX(${animation}px)` }}>
      {items.map(item => <Item key={item.id} data={item} />)}
    </div>
  );
}

// Fiber 的处理：
// 1. 动画更新（高优先级）立即执行
// 2. 数据渲染（低优先级）可以被动画更新中断
// 3. 结果：动画流畅（60fps），数据逐步渲染 ✅
```

---

## 🔑 面试高频问题

### Q1: Fiber 是什么？解决了什么问题？⭐⭐⭐

**答**：
Fiber 是 React 16 的新协调引擎，通过链表结构和时间切片实现可中断的渲染。

**解决的问题**：
- React 15 递归更新不可中断，大组件树更新时页面卡顿
- Fiber 把长任务拆分成小任务，每个任务执行完检查是否需要让出控制权
- 高优先级任务（用户输入）可以打断低优先级任务（列表渲染）

### Q2: Fiber 的数据结构是什么样的？⭐⭐⭐

**答**：
Fiber 是一个 JavaScript 对象，包含：
- **节点信息**：type、key、stateNode
- **链表结构**：child、sibling、return（用于遍历）
- **工作信息**：props、state、updateQueue
- **副作用**：flags、nextEffect
- **双缓存**：alternate（指向另一棵树的对应节点）

### Q3: Fiber 为什么用链表而不是树？⭐⭐⭐

**答**：
- 树结构需要递归遍历，无法中断
- 链表结构可以用循环遍历，随时保存当前位置并中断
- 中断后可以从保存的位置继续执行

### Q4: 什么是双缓存？为什么需要？⭐⭐⭐

**答**：
双缓存是指维护两棵 Fiber 树：
- **current 树**：当前显示在屏幕上的
- **workInProgress 树**：正在内存中构建的

**为什么需要**：
- 如果直接在 current 树上修改，中断时用户会看到不完整的 UI
- 在 workInProgress 树上工作，完成后一次性切换，保证 UI 一致性

**补充：React 15 有双缓存吗？**

**答：没有！这是 React 16 Fiber 引入的新机制。**

**React 15 的做法**：
```javascript
// React 15：直接在虚拟 DOM 树上递归更新
function updateComponent(component) {
  // 1. 调用 render 生成新的虚拟 DOM
  const newVNode = component.render();
  
  // 2. 直接对比新旧虚拟 DOM（Diff）
  const patches = diff(oldVNode, newVNode);
  
  // 3. 立即应用到真实 DOM
  patch(realDOM, patches);
}

// 问题：
// - 整个过程是同步的，不可中断
// - 没有"备用树"的概念
// - 一旦开始更新就必须完成
```

**React 16 Fiber 的改进**：
```javascript
// React 16：双缓存机制
let current = null;        // 当前树（屏幕上）
let workInProgress = null; // 工作树（内存中）

function updateComponent(component) {
  // 1. 基于 current 创建 workInProgress
  workInProgress = createWorkInProgress(current);
  
  // 2. 在 workInProgress 上工作（可中断）
  while (nextUnitOfWork && !shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  
  // 3. 完成后，切换指针
  if (workCompleted) {
    current = workInProgress;
    workInProgress = null;
  }
}

// 优势：
// - 可以随时中断，用户看不到中间状态
// - 完成后一次性切换，保证 UI 一致性
// - 支持优先级调度
```

**对比总结**：

| 特性 | React 15 | React 16 Fiber |
|------|----------|----------------|
| **虚拟 DOM 树** | 单棵树 | 双缓存（两棵树）|
| **更新方式** | 直接修改 | 在备用树上工作 |
| **可中断性** | ❌ 不可中断 | ✅ 可中断 |
| **中间状态** | 可能暴露给用户 | 用户看不到 |
| **切换时机** | 边更新边应用 | 完成后一次性切换 |

**为什么 React 15 不需要双缓存？**

因为 React 15 的更新是**同步且不可中断**的：
- 一旦开始更新，就会一口气完成
- 不存在"更新到一半被中断"的情况
- 所以不需要备用树来保护中间状态

**为什么 React 16 需要双缓存？**

因为 Fiber 的更新是**异步且可中断**的：
- 更新可能随时被高优先级任务中断
- 如果直接在 current 树上修改，用户会看到不完整的 UI
- 需要在 workInProgress 树上工作，完成后再切换

**类比理解**：
```
React 15 = 现场作画
- 直接在画布上画
- 观众看到整个绘画过程
- 不能中途停下

React 16 = 草稿纸作画
- 在草稿纸上画（workInProgress）
- 画完后再挂到墙上（切换 current）
- 可以随时停下，观众看不到中间过程
```

### Q5: Fiber 的工作流程是什么？⭐⭐⭐

**答**：
分为两个阶段：
1. **Render 阶段**（可中断）：
   - 构建 Fiber 树
   - 对比新旧节点（Diff）
   - 标记副作用
   
2. **Commit 阶段**（不可中断）：
   - 一次性提交所有更新到 DOM
   - 执行生命周期和副作用

### Q6: Fiber 如何实现时间切片？⭐⭐⭐

**答**：

**注意：React 实际上没有使用 `requestIdleCallback`，而是用 `MessageChannel` 实现的！**

**为什么不用 `requestIdleCallback`？**

1. **兼容性问题**：Safari 不支持
2. **执行频率不稳定**：浏览器可能很久才执行一次
3. **优先级无法控制**：只能在空闲时执行

**React 的实际实现（简化版）**：

```javascript
// React 使用 MessageChannel 实现时间切片
// port1 (接收端) ←→ port2 (发送端)
const channel = new MessageChannel();
const port = channel.port2;

// 调度任务
channel.port1.onmessage = () => {
  // 执行工作循环
  workLoop();
};

function scheduleCallback(callback) {
  // 通过 postMessage 触发宏任务
  port.postMessage(null);
}

function workLoop() {
  const startTime = performance.now();
  
  while (nextUnitOfWork) {
    // 执行一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    
    // 检查是否超时（默认 5ms）
    if (performance.now() - startTime > 5) {
      // 时间用完了，让出控制权
      scheduleCallback(workLoop);
      return;
    }
  }
  
  // 所有工作完成，进入 commit 阶段
  commitRoot();
}
```

**为什么用 `MessageChannel`？**

```javascript
// 1. MessageChannel 创建宏任务，优先级合适
const channel = new MessageChannel();
channel.port1.onmessage = () => {
  console.log('MessageChannel'); // 在下一个事件循环执行
};
channel.port2.postMessage(null);

// 2. 对比其他方案
setTimeout(() => {
  // 问题：最小延迟 4ms，太慢
}, 0);

requestAnimationFrame(() => {
  // 问题：只在浏览器重绘前执行，频率固定 60fps
});

requestIdleCallback(() => {
  // 问题：兼容性差，执行时机不可控
});

// MessageChannel：
// ✅ 没有延迟
// ✅ 兼容性好
// ✅ 可以控制执行时机
```

**完整的时间切片流程**：

```javascript
// React Scheduler 的简化实现
class Scheduler {
  constructor() {
    this.taskQueue = []; // 任务队列
    this.isPerformingWork = false;
    this.currentTask = null;
    
    // 创建 MessageChannel
    this.channel = new MessageChannel();
    this.port = this.channel.port2;
    this.channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
  }
  
  // 调度任务
  scheduleCallback(callback, priority) {
    const task = {
      callback,
      priority,
      startTime: performance.now()
    };
    
    this.taskQueue.push(task);
    this.taskQueue.sort((a, b) => a.priority - b.priority);
    
    if (!this.isPerformingWork) {
      this.port.postMessage(null);
    }
  }
  
  // 执行工作直到截止时间
  performWorkUntilDeadline() {
    if (this.taskQueue.length === 0) return;
    
    this.isPerformingWork = true;
    const startTime = performance.now();
    const timeSlice = 5; // 时间片：5ms
    
    try {
      while (this.taskQueue.length > 0) {
        this.currentTask = this.taskQueue[0];
        const callback = this.currentTask.callback;
        
        // 执行任务
        const continuationCallback = callback();
        
        // 检查是否超时
        if (performance.now() - startTime >= timeSlice) {
          // 时间用完了
          if (continuationCallback) {
            // 任务还没完成，更新回调
            this.currentTask.callback = continuationCallback;
          } else {
            // 任务完成，移除
            this.taskQueue.shift();
          }
          
          // 让出控制权，下次继续
          this.port.postMessage(null);
          break;
        } else {
          // 时间还够，继续下一个任务
          this.taskQueue.shift();
        }
      }
    } finally {
      this.isPerformingWork = false;
      this.currentTask = null;
    }
  }
}

// 使用示例
const scheduler = new Scheduler();

function workLoop() {
  let shouldYield = false;
  
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    
    // 检查是否需要让出
    shouldYield = shouldYieldToHost();
  }
  
  if (nextUnitOfWork) {
    // 还有工作，返回 continuation
    return workLoop;
  } else {
    // 工作完成
    return null;
  }
}

// 调度工作
scheduler.scheduleCallback(workLoop, NormalPriority);
```

**时间切片的关键点**：

1. **时间片大小**：默认 5ms
   ```javascript
   const frameYieldMs = 5; // React 的默认值
   ```

2. **如何判断是否超时**：
   ```javascript
   const startTime = performance.now();
   // ... 执行工作 ...
   const shouldYield = performance.now() - startTime >= frameYieldMs;
   ```

3. **如何让出控制权**：
   ```javascript
   if (shouldYield) {
     port.postMessage(null); // 触发下一个宏任务
     return;
   }
   ```

**为什么是 5ms？**

```javascript
// 浏览器的帧率通常是 60fps
// 每帧时间 = 1000ms / 60 ≈ 16.6ms

// 一帧的时间分配：
// - 用户输入事件：~1ms
// - JavaScript 执行：~5ms  ← React 的时间片
// - 样式计算：~2ms
// - 布局：~2ms
// - 绘制：~2ms
// - 合成：~2ms
// 总计：~14ms，留 2.6ms 余量

// 所以 React 选择 5ms 作为时间片大小
```

**总结对比**：

| 方案 | 优点 | 缺点 | React 是否使用 |
|------|------|------|----------------|
| `setTimeout` | 兼容性好 | 最小延迟 4ms | ❌ |
| `requestAnimationFrame` | 与浏览器渲染同步 | 频率固定，不灵活 | ❌ |
| `requestIdleCallback` | 在空闲时执行 | 兼容性差，不可控 | ❌ |
| `MessageChannel` | 无延迟，可控 | 需要手动实现调度 | ✅ |

**记忆要点**：
- React 用 `MessageChannel` 而不是 `requestIdleCallback`
- 时间片默认 5ms
- 通过 `performance.now()` 判断是否超时
- 超时就 `postMessage` 让出控制权

### Q7: Fiber 和虚拟 DOM 的关系？⭐⭐

**答**：
- **虚拟 DOM**：用 JavaScript 对象描述 UI 结构
- **Fiber**：虚拟 DOM 的一种实现方式
- React 15 的虚拟 DOM 是树结构，React 16 的 Fiber 是链表结构
- Fiber 是增强版的虚拟 DOM，支持可中断渲染和优先级调度

---

## 💡 记忆口诀

**Fiber 三大核心**：
1. **链表结构**：可中断遍历
2. **双缓存**：保证 UI 一致性
3. **时间切片**：不阻塞主线程

**工作流程**：
- Render 可中断，Commit 不可中断
- 高优先级打断低优先级
- 完成后一次性提交

**记住**：
- Fiber = 可中断的虚拟 DOM
- 链表 = 可以暂停的遍历
- 双缓存 = 完整的 UI 切换

🚀 **Fiber 让 React 从「同步阻塞」变成「异步可中断」！**
