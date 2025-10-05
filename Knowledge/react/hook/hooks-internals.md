# React Hooks 底层原理详解

## 1. Hooks 的本质

### 1.1 数据结构
```javascript
// React 内部维护的数据结构
type Hook = {
  memoizedState: any,        // 当前状态值
  baseState: any,           // 基础状态值
  baseQueue: Update | null, // 更新队列
  queue: UpdateQueue | null,// 更新队列
  next: Hook | null,        // 指向下一个 Hook
};

// 组件实例的 Fiber 节点
type Fiber = {
  memoizedState: Hook | null, // Hook 链表的头节点
  updateQueue: UpdateQueue,   // 更新队列
  // ... 其他属性
};
```

### 1.2 Hook 链表
```javascript
// 函数组件的 Hook 链表结构
function MyComponent() {
  const [state1, setState1] = useState(0);     // Hook 1
  const [state2, setState2] = useState('');    // Hook 2
  const effect = useEffect(() => {}, []);      // Hook 3
  const memo = useMemo(() => {}, []);          // Hook 4
  
  // React 内部维护的链表：
  // Hook1 -> Hook2 -> Hook3 -> Hook4 -> null
}
```

## 2. useState 原理

### 2.1 初始化过程
```javascript
// React 内部实现（简化版）
function useState(initialState) {
  // 1. 获取当前 Fiber 节点
  const fiber = getCurrentFiber();
  
  // 2. 获取当前 Hook 节点
  const hook = getCurrentHook();
  
  // 3. 初始化 Hook
  if (!hook) {
    const newHook = {
      memoizedState: typeof initialState === 'function' 
        ? initialState() 
        : initialState,
      baseState: initialState,
      baseQueue: null,
      queue: null,
      next: null
    };
    
    // 4. 将 Hook 添加到链表
    if (fiber.memoizedState === null) {
      fiber.memoizedState = newHook;
    } else {
      // 添加到链表末尾
      let current = fiber.memoizedState;
      while (current.next) {
        current = current.next;
      }
      current.next = newHook;
    }
    
    return [newHook.memoizedState, dispatchAction];
  }
  
  // 5. 非首次渲染，返回已存在的状态
  return [hook.memoizedState, dispatchAction];
}
```

### 2.2 更新过程
```javascript
function dispatchAction(fiber, queue, action) {
  // 1. 创建更新对象
  const update = {
    action,           // 新的状态值或更新函数
    next: null,       // 指向下一个更新
    eagerReducer: null,
    eagerState: null,
  };
  
  // 2. 将更新添加到队列
  if (queue.last === null) {
    queue.first = update;
    queue.last = update;
  } else {
    queue.last.next = update;
    queue.last = update;
  }
  
  // 3. 调度更新
  scheduleUpdateOnFiber(fiber);
}
```

## 3. useEffect 原理

### 3.1 Effect 数据结构
```javascript
type Effect = {
  tag: number,              // 标记类型（Passive, Layout 等）
  create: () => void,       // 副作用函数
  destroy: (() => void) | null, // 清理函数
  deps: Array | null,       // 依赖数组
  next: Effect | null,      // 指向下一个 Effect
};

// 组件实例的 Effect 链表
type Fiber = {
  memoizedState: Hook | null,
  updateQueue: UpdateQueue,
  // Effect 相关
  flags: Flags,
  firstEffect: Effect | null,
  lastEffect: Effect | null,
};
```

### 3.2 Effect 执行流程
```javascript
function useEffect(create, deps) {
  const hook = getCurrentHook();
  
  // 1. 创建 Effect 对象
  const effect = {
    tag: HookPassive,  // 标记为 Passive Effect
    create,
    destroy: null,
    deps,
    next: null,
  };
  
  // 2. 添加到 Effect 链表
  if (hook.memoizedState === null) {
    hook.memoizedState = effect;
  } else {
    let current = hook.memoizedState;
    while (current.next) {
      current = current.next;
    }
    current.next = effect;
  }
  
  // 3. 标记需要执行 Effect
  fiber.flags |= PassiveEffect;
}
```

## 4. useMemo 和 useCallback 原理

### 4.1 useMemo 实现
```javascript
function useMemo(factory, deps) {
  const hook = getCurrentHook();
  
  if (hook.memoizedState !== null) {
    // 检查依赖是否变化
    const nextDeps = deps === undefined ? null : deps;
    const prevDeps = hook.memoizedState[1];
    
    if (areHookInputsEqual(nextDeps, prevDeps)) {
      // 依赖未变化，返回缓存值
      return hook.memoizedState[0];
    }
  }
  
  // 依赖变化或首次执行，重新计算
  const nextValue = factory();
  hook.memoizedState = [nextValue, deps];
  return nextValue;
}
```

### 4.2 useCallback 实现
```javascript
function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}
```

## 5. 自定义 Hook 原理

### 5.1 自定义 Hook 的本质
```javascript
// 自定义 Hook 本质上是一个函数
function useCustomHook() {
  const [state, setState] = useState(0);
  useEffect(() => {
    // 副作用逻辑
  }, []);
  
  return [state, setState];
}

// 使用自定义 Hook
function MyComponent() {
  const [count, setCount] = useCustomHook();
  // 这里的 count 和 setCount 实际上是通过 Hook 链表管理的
}
```

### 5.2 Hook 复用机制
```javascript
// 多个组件使用同一个自定义 Hook
function ComponentA() {
  const [state, setState] = useCustomHook(); // Hook 链表：Hook1
}

function ComponentB() {
  const [state, setState] = useCustomHook(); // Hook 链表：Hook1（不同的实例）
}

// React 内部为每个组件实例维护独立的 Hook 链表
```

## 6. Hook 规则的原因

### 6.1 为什么不能在条件语句中使用
```javascript
function BadComponent({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // ❌ 错误
  }
  
  // 问题：
  // 1. 首次渲染：Hook 链表：[useState]
  // 2. condition 为 false：Hook 链表：[]
  // 3. condition 为 true：Hook 链表：[useState]
  // 链表结构不一致，导致状态错乱
}
```

### 6.2 为什么必须在顶层调用
```javascript
function GoodComponent({ condition }) {
  const [state, setState] = useState(0); // ✅ 正确
  
  // 每次渲染的 Hook 链表结构都一致
  // 1. 首次渲染：[useState]
  // 2. 任何后续渲染：[useState]
  // 结构保持一致，状态正确管理
}
```

## 7. 性能优化原理

### 7.1 依赖数组的比较
```javascript
function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    return false;
  }
  
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

### 7.2 更新调度
```javascript
function scheduleUpdateOnFiber(fiber) {
  // 1. 标记需要更新的 Fiber 节点
  markUpdateLaneFromFiberToRoot(fiber);
  
  // 2. 调度更新
  ensureRootIsScheduled(root);
  
  // 3. 在下一个时间片执行更新
  scheduleCallback(ImmediatePriority, performSyncWorkOnRoot);
}
```

## 8. 面试总结

### 8.1 核心原理（一句话总结）
"Hooks 通过维护一个链表结构来管理函数组件的状态和副作用，每个 Hook 在链表中有固定的位置，通过闭包保存状态值，通过调度机制处理更新。"

### 8.2 详细回答要点

1. **数据结构**：
   - Hook 是一个链表节点
   - 每个组件实例有独立的 Hook 链表
   - 通过 memoizedState 保存状态值

2. **执行流程**：
   - 函数组件执行时遍历 Hook 链表
   - 根据 Hook 类型执行相应逻辑
   - 状态更新时调度重新渲染

3. **规则原因**：
   - 保证 Hook 链表的顺序一致性
   - 避免状态错乱和内存泄漏
   - 确保每次渲染都能正确访问状态

4. **性能优化**：
   - 依赖数组的浅比较
   - 更新批处理
   - 选择性重新渲染

### 8.3 面试加分点

1. **深入理解**：
   - 能解释 Hook 链表的作用
   - 理解状态更新的调度机制
   - 知道为什么有 Hook 规则

2. **实践经验**：
   - 能识别 Hook 使用中的问题
   - 知道如何优化 Hook 性能
   - 理解自定义 Hook 的实现原理

3. **技术视野**：
   - 了解 Hooks 的设计理念
   - 知道与类组件的区别
   - 理解 React 的演进方向
