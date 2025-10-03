# React 生命周期详解

## 1. 生命周期图解

```
类组件生命周期流程图：

创建阶段 (Mounting)
─────────────────────────────────────────────────
│                                               │
│  constructor                                  │
│       ↓                                       │
│  getDerivedStateFromProps                     │
│       ↓                                       │
│    render                                     │
│       ↓                                       │
│  componentDidMount                            │
│                                               │
─────────────────────────────────────────────────

更新阶段 (Updating)  
─────────────────────────────────────────────────
│                                               │
│           props/state/forceUpdate             │
│                    ↓                          │
│        getDerivedStateFromProps               │
│                    ↓                          │
│         shouldComponentUpdate                 │
│                    ↓                          │
│              render                           │
│                    ↓                          │
│        getSnapshotBeforeUpdate               │
│                    ↓                          │
│          componentDidUpdate                   │
│                                               │
─────────────────────────────────────────────────

卸载阶段 (Unmounting)
─────────────────────────────────────────────────
│                                               │
│           componentWillUnmount                │
│                                               │
─────────────────────────────────────────────────
```

## 2. 各阶段详解

### 2.1 创建阶段 (Mounting)

#### constructor
- **时机**：组件创建时最先调用
- **用途**：初始化state、绑定方法
- **注意**：
  - 不要调用setState
  - 不要执行副作用（如请求）
```javascript
constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
}
```

#### getDerivedStateFromProps
- **时机**：每次渲染前调用
- **用途**：根据props更新state
- **特点**：
  - 静态方法，不能访问this
  - 必须返回null或state对象
```javascript
static getDerivedStateFromProps(props, state) {
    if (props.count !== state.count) {
        return { count: props.count };
    }
    return null;
}
```

#### render
- **时机**：每次渲染时调用
- **特点**：
  - 必须是纯函数
  - 不能修改state
  - 不能直接与浏览器交互

#### componentDidMount
- **时机**：首次渲染完成后
- **用途**：
  - 发起网络请求
  - 添加订阅
  - DOM操作
```javascript
componentDidMount() {
    fetch('/api/data');
    window.addEventListener('resize', this.handleResize);
}
```

### 2.2 更新阶段 (Updating)

#### shouldComponentUpdate
- **时机**：接收新的props或state时
- **用途**：性能优化，控制是否重新渲染
```javascript
shouldComponentUpdate(nextProps, nextState) {
    return this.state.count !== nextState.count;
}
```

#### getSnapshotBeforeUpdate
- **时机**：render之后，更新DOM前
- **用途**：获取更新前的DOM信息
```javascript
getSnapshotBeforeUpdate(prevProps, prevState) {
    return document.querySelector('#scroll').scrollHeight;
}
```

#### componentDidUpdate
- **时机**：更新完成后
- **用途**：
  - DOM操作
  - 网络请求
  - 状态更新
```javascript
componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.userID !== prevProps.userID) {
        this.fetchData(this.props.userID);
    }
}
```

### 2.3 卸载阶段 (Unmounting)

#### componentWillUnmount
- **时机**：组件卸载前
- **用途**：清理工作
```javascript
componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    clearInterval(this.timer);
}
```

## 3. 已废弃的生命周期方法

### 为什么要废弃？
1. **异步渲染问题**：
   - 这些方法可能被多次调用
   - 导致副作用重复执行
   
2. **可预测性**：
   - 使代码更容易预测和维护
   - 避免常见的错误模式

### 废弃的方法：
- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

## 4. Hooks 生命周期

### 4.1 基础 Hooks

#### useState
```javascript
const [state, setState] = useState(initialState);
```

#### useEffect
```javascript
// 组件挂载和更新时
useEffect(() => {
    // 执行副作用
    return () => {
        // 清理函数
    };
});

// 仅在挂载时
useEffect(() => {
    // ...
}, []);

// 依赖更新时
useEffect(() => {
    // ...
}, [dependency]);
```

#### useLayoutEffect
- 同步执行，在DOM更新后立即调用
- 用于需要同步测量DOM的场景

### 4.2 性能优化 Hooks

#### useMemo
```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

#### useCallback
```javascript
const memoizedCallback = useCallback(
    () => {
        doSomething(a, b);
    },
    [a, b],
);
```

### 4.3 新特性 Hooks (React 18)

#### useTransition
用于标记非紧急更新，提高用户交互体验
```javascript
const [isPending, startTransition] = useTransition();

function handleChange(e) {
    startTransition(() => {
        setSearchQuery(e.target.value);
    });
}
```

特点：
- 可中断的更新
- 不阻塞UI
- 用于大规模状态更新

#### useDeferredValue
延迟更新某个值，类似于防抖效果
```javascript
const deferredValue = useDeferredValue(value);
```

使用场景：
1. **搜索建议**：
```javascript
function SearchResults({ query }) {
    const deferredQuery = useDeferredValue(query);
    return <ExpensiveSearchList query={deferredQuery} />;
}
```

2. **大列表渲染**：
```javascript
function SlowList({ text }) {
    const deferredText = useDeferredValue(text);
    return (
        <ul>
            {deferredText.split('').map((item, i) => (
                <SlowItem key={i} text={item} />
            ))}
        </ul>
    );
}
```

useTransition vs useDeferredValue：
- useTransition：主动控制更新优先级
- useDeferredValue：被动接收值的延迟版本

## 5. 最佳实践

### 5.1 选择正确的生命周期
- 数据获取 → componentDidMount
- 事件监听 → componentDidMount + componentWillUnmount
- DOM操作 → componentDidMount/componentDidUpdate

### 5.2 避免常见错误
- 不要在render中调用setState
- 注意清理副作用
- 正确使用getDerivedStateFromProps

### 5.3 性能优化
- 使用shouldComponentUpdate
- 合理使用useMemo和useCallback
- 适当使用useTransition和useDeferredValue