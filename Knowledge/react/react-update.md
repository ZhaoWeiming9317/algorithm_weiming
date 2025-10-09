# React 版本升级要点（面试版）

## React 16 ⭐⭐⭐

### 核心变化：Fiber 架构

**面试官问：React 16 最大的变化是什么？**

**答**：引入了 **Fiber 架构**，解决了 React 15 的性能瓶颈。

#### 1. Fiber 架构原理

**React 15 的问题**：
```javascript
// React 15：递归更新，不可中断
function updateComponent(component) {
  // 一旦开始就必须完成，长时间占用主线程
  render(component);
  updateChildren(component.children); // 递归
}
// 问题：大组件树更新时会卡顿，用户交互无响应
```

**React 16 的解决方案**：
```javascript
// Fiber：链表结构 + 时间切片，可中断
const fiber = {
  type: 'div',
  child: childFiber,      // 第一个子节点
  sibling: siblingFiber,  // 下一个兄弟节点
  return: parentFiber,    // 父节点
  alternate: oldFiber     // 上一次的 Fiber
};

// 可中断的更新
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop); // 有剩余工作，下次继续
  }
}
```

**关键特性**：
- ✅ **可中断**：高优先级任务可以打断低优先级任务
- ✅ **可恢复**：中断后可以继续执行
- ✅ **时间切片**：把长任务拆分成小任务

#### 2. 新增生命周期

**废弃的生命周期**（不安全）：
```javascript
// ❌ 这些在 Fiber 架构下可能被多次调用
componentWillMount
componentWillReceiveProps
componentWillUpdate
```

**新增的生命周期**：
```javascript
// ✅ 静态方法，无副作用
static getDerivedStateFromProps(props, state) {
  // 替代 componentWillReceiveProps
  if (props.value !== state.value) {
    return { value: props.value };
  }
  return null;
}

// ✅ 在 DOM 更新前捕获信息（如滚动位置）
getSnapshotBeforeUpdate(prevProps, prevState) {
  return element.scrollTop;
}

componentDidUpdate(prevProps, prevState, snapshot) {
  // 使用 snapshot
}
```

#### 3. 其他重要特性

**Fragments（片段）**：
```javascript
// 不需要额外的 DOM 节点
return (
  <>
    <Child1 />
    <Child2 />
  </>
);
```

**Error Boundaries（错误边界）**：
```javascript
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, info) {
    logError(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>出错了</h1>;
    }
    return this.props.children;
  }
}
```

**Portals（传送门）**：
```javascript
// 渲染到 DOM 树外的节点
ReactDOM.createPortal(
  <Modal />,
  document.getElementById('modal-root')
);
```

---

## React 17 ⭐⭐

### 核心变化：渐进式升级 + 事件系统改进

**面试官问：React 17 有什么特别的？**

**答**：React 17 是一个**过渡版本**，没有新功能，主要为 React 18 做准备。

#### 1. 渐进式升级

**支持多版本共存**：
```javascript
// 可以在同一个页面运行不同版本的 React
ReactDOM.render(<App />, rootNode);        // React 17
ReactDOM.render(<LegacyApp />, legacyNode); // React 16
```

#### 2. 事件委托改变

**React 16**：
```javascript
// 事件委托到 document
document.addEventListener('click', handleClick);
```

**React 17**：
```javascript
// 事件委托到根容器
const root = document.getElementById('root');
root.addEventListener('click', handleClick);
```

**为什么改？**
- 多个 React 版本共存时不会冲突
- 更容易与其他框架集成
- 更符合现代浏览器行为

#### 3. 事件系统优化

**去除事件池**：
```javascript
// React 16：事件对象会被复用（事件池）
function handleClick(e) {
  setTimeout(() => {
    console.log(e.type); // ❌ 报错：事件对象已被清空
  }, 100);
}

// React 17：事件对象不再复用
function handleClick(e) {
  setTimeout(() => {
    console.log(e.type); // ✅ 正常工作
  }, 100);
}
```

#### 4. useEffect 清理时机

**React 16**：
```javascript
// 同步执行清理函数（可能阻塞）
useEffect(() => {
  return () => cleanup(); // 同步
}, []);
```

**React 17**：
```javascript
// 异步执行清理函数（不阻塞）
useEffect(() => {
  return () => cleanup(); // 异步
}, []);
```

#### 5. 返回 undefined 不再警告

```javascript
// React 16：警告
function Component() {
  return undefined; // ⚠️ Warning
}

// React 17：不再警告
function Component() {
  return undefined; // ✅ OK
}
```


#### 补充问题解答

**问题1：document 和 root 的关系是啥？**

**答**：
```javascript
// HTML 结构
<body>
  <div id="root"></div>  <!-- 这是 root 容器 -->
</body>

// document 是整个文档对象
document === window.document  // 整个 HTML 文档

// root 是文档中的一个 DOM 元素
const root = document.getElementById('root')  // 获取 root 元素
```

**React 16 事件委托到 document**：
```javascript
// 所有 React 事件都绑定到 document 上
document.addEventListener('click', reactEventHandler)

// 问题：如果页面有多个 React 应用
<div id="app1"></div>  <!-- React 16 -->
<div id="app2"></div>  <!-- React 17 -->

// 两个版本都往 document 上绑定事件，会冲突！
```

**React 17 事件委托到 root**：
```javascript
// 每个 React 应用绑定到自己的根容器
const root1 = document.getElementById('app1')
root1.addEventListener('click', reactEventHandler)

const root2 = document.getElementById('app2')
root2.addEventListener('click', reactEventHandler)

// 互不干扰，可以共存
```

**问题2：可以在同一个页面运行不同版本的 React 是如何实现的？**

**答**：

**核心原因**：React 17 改变了事件委托的位置。

```javascript
// 实现方式
// app1.js (React 17)
import React17 from 'react-17'
import ReactDOM17 from 'react-dom-17'

ReactDOM17.render(<App1 />, document.getElementById('app1'))
// 事件绑定到 #app1

// app2.js (React 16)
import React16 from 'react-16'
import ReactDOM16 from 'react-dom-16'

ReactDOM16.render(<App2 />, document.getElementById('app2'))
// 事件绑定到 document
```

**为什么 React 16 不行？**
```javascript
// React 16：都绑定到 document
React16App1 -> document.addEventListener('click', handler1)
React16App2 -> document.addEventListener('click', handler2)
// 事件处理逻辑冲突，内部状态混乱
```

**React 17 如何解决？**
```javascript
// React 17：绑定到各自的 root
React17App1 -> root1.addEventListener('click', handler1)
React17App2 -> root2.addEventListener('click', handler2)
// 完全隔离，互不影响
```

**实际应用场景**：
- 微前端架构：主应用和子应用用不同 React 版本
- 渐进式升级：老页面用 React 16，新页面用 React 18
- 第三方组件：嵌入的组件库可能用不同版本


---

## React 18 ⭐⭐⭐⭐⭐

### 核心变化：并发渲染（Concurrent Rendering）

**面试官问：React 18 最重要的特性是什么？**

**答**：**并发渲染**，让 React 可以同时准备多个版本的 UI。

#### 1. 并发特性（Concurrent Features）

**核心概念**：
```javascript
// 传统渲染：一次只能做一件事
render A -> render B -> render C

// 并发渲染：可以中断、暂停、恢复
render A -> 高优先级任务 -> 继续 render A -> render B
```

#### 2. startTransition（标记非紧急更新）⭐⭐⭐

**问题场景**：
```javascript
// 输入框卡顿：每次输入都要更新大列表
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);              // 紧急：输入框要立即响应
    setResults(search(value));    // 不紧急：搜索结果可以慢点
  };
  
  return (
    <>
      <input value={query} onChange={handleChange} />
      <Results data={results} /> {/* 大列表，渲染慢 */}
    </>
  );
}
```

**解决方案**：
```javascript
import { startTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // 紧急更新：立即执行
    
    startTransition(() => {
      setResults(search(value)); // 非紧急更新：可中断
    });
  };
  
  return (
    <>
      <input value={query} onChange={handleChange} />
      <Results data={results} />
    </>
  );
}
```

**效果**：
- 输入框立即响应，不卡顿
- 搜索结果更新可以被中断
- 用户体验更流畅

#### 3. useDeferredValue（延迟更新）⭐⭐⭐

```javascript
function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // 延迟版本
  
  // query 立即更新，deferredQuery 延迟更新
  const results = useMemo(() => search(deferredQuery), [deferredQuery]);
  
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Results data={results} />
    </>
  );
}
```

**对比 startTransition**：
- `startTransition`：手动标记哪些更新不紧急
- `useDeferredValue`：自动延迟某个值的更新

#### 4. useTransition（带 loading 状态）⭐⭐

```javascript
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('home');
  
  const handleClick = (newTab) => {
    startTransition(() => {
      setTab(newTab); // 非紧急更新
    });
  };
  
  return (
    <>
      <button onClick={() => handleClick('home')}>首页</button>
      <button onClick={() => handleClick('profile')}>个人</button>
      
      {isPending && <Spinner />} {/* 显示加载状态 */}
      <TabContent tab={tab} />
    </>
  );
}
```

#### 5. Suspense 支持 SSR ⭐⭐⭐

**React 17**：
```javascript
// SSR 必须等所有组件准备好才能返回 HTML
<App>
  <Header />
  <Sidebar />
  <Content />  {/* 慢组件阻塞整个页面 */}
  <Footer />
</App>
```

**React 18**：
```javascript
// 流式 SSR：可以先返回部分 HTML
<App>
  <Header />
  <Sidebar />
  <Suspense fallback={<Spinner />}>
    <Content />  {/* 慢组件不阻塞其他部分 */}
  </Suspense>
  <Footer />
</App>
```

**三大改进**：
1. **Streaming HTML**：服务端流式返回 HTML
2. **Selective Hydration**：选择性注水，优先处理用户交互的部分
3. **Progressive Hydration**：渐进式注水，不阻塞页面

#### 6. 自动批处理（Automatic Batching）⭐⭐

**React 17**：
```javascript
// 只在事件处理器中批处理
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只触发一次重新渲染 ✅
}

// 异步回调中不批处理
setTimeout(() => {
  setCount(c => c + 1);  // 触发一次渲染
  setFlag(f => !f);      // 又触发一次渲染 ❌
}, 1000);
```

**React 18**：
```javascript
// 所有地方都自动批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只触发一次重新渲染 ✅
}, 1000);

fetch('/api').then(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只触发一次重新渲染 ✅
});
```

**退出批处理**：
```javascript
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(c => c + 1); // 立即渲染
});
setFlag(f => !f); // 再次渲染
```

#### 7. 新的 Root API ⭐⭐

**React 17**：
```javascript
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

**React 18**：
```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**为什么改？**
- 启用并发特性必须使用新 API
- 更好的类型提示
- 支持多次 render

#### 8. useId（生成唯一 ID）⭐

```javascript
function Form() {
  const id = useId(); // 生成唯一 ID，SSR 安全
  
  return (
    <>
      <label htmlFor={id}>用户名</label>
      <input id={id} />
    </>
  );
}
```

**解决的问题**：
- SSR 时客户端和服务端 ID 不一致
- 多个组件实例 ID 冲突

#### 9. useSyncExternalStore（订阅外部数据）⭐

```javascript
// 用于状态管理库（Redux、Zustand 等）
function useStore(store) {
  return useSyncExternalStore(
    store.subscribe,      // 订阅
    store.getSnapshot,    // 获取快照
    store.getServerSnapshot // SSR 快照
  );
}
```

#### 10. useInsertionEffect（CSS-in-JS）⭐

```javascript
// 在 DOM 变更前插入样式，避免闪烁
function useCSS(rule) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.textContent = rule;
    document.head.appendChild(style);
    return () => style.remove();
  }, [rule]);
}
```

---

## 🎯 面试高频问题

### Q1: React 16/17/18 的核心区别是什么？

**答**：
- **React 16**：Fiber 架构，可中断渲染
- **React 17**：过渡版本，改进事件系统
- **React 18**：并发渲染，startTransition、Suspense SSR

### Q2: 什么是 Fiber？

**答**：
Fiber 是 React 16 的新架构，把渲染任务拆分成小单元，通过链表结构实现可中断、可恢复的渲染，解决了大组件树更新时的卡顿问题。

### Q3: startTransition 和 useDeferredValue 有什么区别？

**答**：

**核心区别**：

| 特性 | startTransition | useDeferredValue |
|------|----------------|------------------|
| 使用场景 | 控制更新函数 | 控制值的更新 |
| 控制粒度 | 手动标记 | 自动延迟 |
| 适用情况 | 你能控制的代码 | 第三方库/props |

**详细对比**：

```javascript
// 1. startTransition：你能控制更新逻辑
function MyComponent() {
  const [input, setInput] = useState('')
  const [list, setList] = useState([])
  
  const handleChange = (e) => {
    setInput(e.target.value)  // 紧急：立即更新
    
    startTransition(() => {
      setList(filterList(e.target.value))  // 非紧急：可中断
    })
  }
}

// 2. useDeferredValue：无法控制第三方库的更新逻辑
function MyComponent({ thirdPartyData }) {
  // 假设 thirdPartyData 来自第三方库，你无法在库内部使用 startTransition
  const deferredData = useDeferredValue(thirdPartyData)
  
  return <ExpensiveComponent data={deferredData} />
}
```

**为什么第三方库要用 useDeferredValue？**

```javascript
// 场景：使用第三方状态管理库
import { useStore } from 'third-party-lib'

function SearchResults() {
  const results = useStore(state => state.searchResults)
  // 问题：你无法修改第三方库内部的 setState 逻辑
  // 无法在库内部加 startTransition
  
  // 解决：使用 useDeferredValue
  const deferredResults = useDeferredValue(results)
  
  return <List data={deferredResults} />
}
```

**选择建议**：
- ✅ **能控制更新逻辑** → 用 `startTransition`（更精确）
- ✅ **无法控制更新逻辑**（props、第三方库）→ 用 `useDeferredValue`

### Q4: React 18 的并发渲染是什么？

**答**：
并发渲染让 React 可以同时准备多个版本的 UI，高优先级任务可以中断低优先级任务，提升用户体验。核心 API 是 `startTransition` 和 `useDeferredValue`。

### Q5: React 18 的自动批处理有什么好处？

**答**：
React 18 在所有场景（事件、异步、Promise）都自动批处理多个状态更新，减少渲染次数，提升性能。React 17 只在事件处理器中批处理。

**补充：什么是事件处理器？**

```javascript
// 事件处理器（Event Handler）：处理用户交互的函数
function App() {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)
  
  // ✅ 这是事件处理器
  const handleClick = () => {
    setCount(c => c + 1)
    setFlag(f => !f)
  }
  
  // ✅ 这也是事件处理器
  const handleInput = (e) => {
    setValue(e.target.value)
  }
  
  return (
    <>
      <button onClick={handleClick}>点击</button>
      <input onChange={handleInput} />
    </>
  )
}
```

**React 17 的批处理限制**：

```javascript
// ✅ 事件处理器中：批处理
function handleClick() {
  setCount(c => c + 1)  // 不渲染
  setFlag(f => !f)      // 不渲染
  // 两次更新合并，只渲染一次 ✅
}

// ❌ 异步回调中：不批处理
function handleClick() {
  setTimeout(() => {
    setCount(c => c + 1)  // 渲染一次 ❌
    setFlag(f => !f)      // 又渲染一次 ❌
  }, 1000)
}

// ❌ Promise 中：不批处理
function handleClick() {
  fetch('/api').then(() => {
    setCount(c => c + 1)  // 渲染一次 ❌
    setFlag(f => !f)      // 又渲染一次 ❌
  })
}
```

**React 18 的自动批处理**：

```javascript
// ✅ 所有场景都批处理
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // 只渲染一次 ✅
}, 1000)

fetch('/api').then(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // 只渲染一次 ✅
})
```

### Q6: 既然 React 16 已经有 Fiber 了，为啥在 React 18 中才启用并发渲染？⭐⭐⭐

**答**：

**核心原因**：Fiber 只是基础架构，并发渲染需要更多配套机制。

#### 1. Fiber ≠ 并发渲染

```javascript
// Fiber 架构（React 16）
// 提供了「可中断」的能力，但默认不中断
function workLoop() {
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // React 16：虽然可以中断，但实际上不会主动中断
  }
}

// 并发渲染（React 18）
// 主动利用 Fiber 的中断能力，实现优先级调度
function workLoop(deadline) {
  while (nextUnitOfWork && shouldYield()) {  // 检查是否需要让出
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  // React 18：根据优先级主动中断和恢复
}
```

#### 2. React 16 → 18 需要解决的问题

**问题1：缺少优先级调度系统**
```javascript
// React 16：所有更新优先级相同
setState(newState)  // 没有优先级概念

// React 18：引入优先级
setState(newState)              // 默认优先级
startTransition(() => {         // 低优先级
  setState(newState)
})
```

**问题2：缺少并发安全的 API**
```javascript
// React 16 的问题：并发渲染可能导致不一致
function Component() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    // 如果渲染被中断，这里可能执行多次
    logAnalytics(count)
  })
}

// React 18：新增并发安全的 Hook
function Component() {
  const id = useId()  // 并发安全的 ID 生成
  const store = useSyncExternalStore(...)  // 并发安全的外部订阅
}
```

**问题3：需要新的渲染模式**
```javascript
// React 16：同步渲染模式
ReactDOM.render(<App />, root)  // 一旦开始就完成

// React 18：并发渲染模式
const root = createRoot(rootElement)  // 启用并发特性
root.render(<App />)
```

#### 3. React 16 → 18 的演进过程

**React 16（2017）**：
- ✅ 提供 Fiber 架构（基础设施）
- ❌ 没有优先级调度
- ❌ 没有并发 API

**React 17（2020）**：
- ✅ 改进事件系统（为并发做准备）
- ✅ 修复并发模式下的 bug
- ❌ 仍未开放并发特性

**补充：为什么事件系统改变支持并发？**

**核心问题**：并发渲染会导致事件处理的时序问题。

```javascript
// 并发渲染场景
function App() {
  const [count, setCount] = useState(0)
  
  const handleClick = (e) => {
    console.log('点击时的 count:', count)
    
    startTransition(() => {
      setCount(count + 1)  // 低优先级更新，可能被中断
    })
    
    // 问题：如果渲染被中断，事件对象 e 还有效吗？
    setTimeout(() => {
      console.log(e.type)  // React 16 会报错
    }, 100)
  }
  
  return <button onClick={handleClick}>点击</button>
}
```

**React 17 的三个关键改进**：

**1. 事件委托到 root（隔离并发上下文）**
```javascript
// React 16：所有事件在 document 层面处理
document.addEventListener('click', (e) => {
  // 问题：多个并发渲染任务共享同一个事件处理器
  // 无法区分事件属于哪个渲染任务
  handleReactEvent(e)
})

// React 17：每个 root 独立处理事件
const root1 = document.getElementById('root1')
root1.addEventListener('click', (e) => {
  // 每个 root 有独立的事件处理上下文
  // 并发渲染时互不干扰
  handleReactEvent(e, root1Context)
})
```

**为什么这样支持并发？**
```javascript
// 场景：页面有两个 React 应用，都在并发渲染
<div id="app1">  <!-- 正在进行低优先级渲染 -->
  <button>按钮1</button>
</div>
<div id="app2">  <!-- 正在进行高优先级渲染 -->
  <button>按钮2</button>
</div>

// React 16：事件在 document 层面
// 用户点击按钮2 → document 收到事件 → 不知道该中断哪个渲染任务

// React 17：事件在各自 root
// 用户点击按钮2 → app2 的 root 收到事件 → 只中断 app2 的渲染
// app1 的渲染不受影响
```

**2. 去除事件池（支持异步访问）**
```javascript
// React 16：事件池机制
function handleClick(e) {
  console.log(e.type)  // ✅ 同步访问 OK
  
  startTransition(() => {
    // 并发渲染：这个更新可能被延迟执行
    console.log(e.type)  // ❌ 事件对象已被回收
  })
  
  setTimeout(() => {
    console.log(e.type)  // ❌ 事件对象已被回收
  }, 0)
}

// 原因：React 16 为了性能，复用事件对象
const eventPool = []
function getEvent() {
  return eventPool.pop() || createEvent()
}
function releaseEvent(e) {
  e.type = null  // 清空属性
  eventPool.push(e)  // 放回池子
}

// React 17：不再复用事件对象
function handleClick(e) {
  console.log(e.type)  // ✅ 同步访问 OK
  
  startTransition(() => {
    console.log(e.type)  // ✅ 异步访问也 OK
  })
  
  setTimeout(() => {
    console.log(e.type)  // ✅ 任何时候都 OK
  }, 0)
}
```

**为什么这样支持并发？**
```javascript
// 并发渲染的特点：更新可能被延迟或中断
function SearchInput() {
  const [query, setQuery] = useState('')
  
  const handleInput = (e) => {
    const value = e.target.value
    
    // 紧急更新：立即执行
    setQuery(value)
    
    // 非紧急更新：可能被延迟到几百毫秒后执行
    startTransition(() => {
      // React 16：这里访问 e.target.value 会报错（事件已回收）
      // React 17：可以正常访问
      fetchResults(e.target.value)
    })
  }
  
  return <input onChange={handleInput} />
}
```

**3. 事件优先级系统**
```javascript
// React 17 为每个事件分配优先级
const eventPriorities = {
  click: 'discrete',      // 离散事件，高优先级
  input: 'continuous',    // 连续事件，中优先级
  scroll: 'default'       // 默认事件，低优先级
}

// 并发渲染时的调度
function handleEvent(e) {
  const priority = getEventPriority(e.type)
  
  if (priority === 'discrete') {
    // 高优先级：立即处理，中断当前渲染
    flushSync(() => {
      dispatchEvent(e)
    })
  } else if (priority === 'continuous') {
    // 中优先级：批处理
    batchedUpdates(() => {
      dispatchEvent(e)
    })
  } else {
    // 低优先级：可以被中断
    scheduleCallback(() => {
      dispatchEvent(e)
    })
  }
}
```

**实际例子**：
```javascript
function App() {
  const [text, setText] = useState('')
  const [list, setList] = useState([])
  
  const handleInput = (e) => {
    // React 17 知道 input 事件是连续事件
    setText(e.target.value)  // 高优先级
    
    startTransition(() => {
      // 低优先级更新
      setList(filterList(e.target.value))
    })
  }
  
  const handleClick = (e) => {
    // React 17 知道 click 事件是离散事件
    // 会中断正在进行的 transition 更新
    setText('')
    setList([])
  }
  
  return (
    <>
      <input value={text} onChange={handleInput} />
      <button onClick={handleClick}>清空</button>
      <List items={list} />
    </>
  )
}

// 用户操作：输入 "abc" → 点击清空
// React 16：可能出现状态不一致
// React 17：click 事件会立即中断 input 的 transition 更新
```

**总结**：
- **事件委托到 root** → 隔离并发上下文，每个应用独立调度
- **去除事件池** → 支持异步访问，配合 startTransition
- **事件优先级** → 不同事件有不同优先级，支持中断和恢复

这些改进让事件系统能够配合并发渲染的调度机制！

**React 18（2022）**：
- ✅ 完整的优先级调度系统（Scheduler）
- ✅ 并发安全的 API（startTransition、useDeferredValue）
- ✅ 新的渲染模式（createRoot）
- ✅ 自动批处理
- ✅ Suspense SSR

#### 4. 为什么要等这么久？

**原因1：生态兼容性**
```javascript
// 很多第三方库假设渲染是同步的
class ThirdPartyLib {
  componentDidMount() {
    // 假设 DOM 已经完全渲染
    this.measure()
  }
}
// 并发渲染可能打破这个假设，需要时间让生态适配
```

**原因2：API 设计**
```javascript
// 需要设计出简单易用的 API
// 经过多次迭代才有了 startTransition

// 早期方案（复杂）
React.unstable_createRoot(...)
React.unstable_scheduleCallback(...)

// 最终方案（简单）
startTransition(() => setState(...))
```

**原因3：性能优化**
```javascript
// 并发渲染本身也有开销
// 需要优化调度算法，确保性能提升
```

#### 5. 类比理解

```
Fiber 架构 = 高速公路（基础设施）
并发渲染 = 智能交通系统（调度算法）

React 16：修好了高速公路，但没有红绿灯和导航
React 17：安装了红绿灯，调试交通规则
React 18：完整的智能交通系统上线
```

**总结**：
- Fiber 是「能力」，并发渲染是「策略」
- React 16 有能力但不用，React 18 才真正用起来
- 中间需要解决优先级调度、API 设计、生态兼容等问题


---

## 💡 记忆口诀

**React 16**：Fiber 架构，可中断渲染  
**React 17**：过渡版本，事件改进  
**React 18**：并发渲染，性能飞升

**关键词**：
- 16 → **Fiber**
- 17 → **过渡**
- 18 → **并发**（startTransition、Suspense、批处理）