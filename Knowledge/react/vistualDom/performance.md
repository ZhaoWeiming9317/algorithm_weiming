# React 性能优化深度指南

## 1. 渲染优化

### 1.1 避免不必要的渲染

```javascript
// 1. 使用 React.memo 优化函数组件
const MyComponent = React.memo(function MyComponent(props) {
  /* 渲染逻辑 */
});

// 2. 使用 shouldComponentUpdate 优化类组件
class MyComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.value !== nextProps.value;
  }
}

// 3. 使用 PureComponent
class MyComponent extends React.PureComponent {
  /* 组件逻辑 */
}
```

### 1.2 使用 useMemo 和 useCallback

```javascript
// 1. useMemo 缓存计算结果
const memoizedValue = useMemo(() => {
  return expensiveComputation(props.data);
}, [props.data]);

// 2. useCallback 缓存函数
const memoizedCallback = useCallback(() => {
  doSomething(props.data);
}, [props.data]);
```

## 2. 状态管理优化

### 2.1 状态设计原则

```javascript
// 1. 合理拆分状态
const [userInfo, setUserInfo] = useState({ name: '', age: 0 });
const [uiState, setUiState] = useState({ isLoading: false, error: null });

// 2. 避免冗余状态
const derivedValue = useMemo(() => {
  return expensiveComputation(props.value);
}, [props.value]);
```

### 2.2 Context 优化

```javascript
// 1. 拆分 Context
const ThemeContext = React.createContext();
const UserContext = React.createContext();

// 2. 使用 Provider 组件优化
function OptimizedProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## 3. 代码分割和懒加载

### 3.1 React.lazy 和 Suspense

```javascript
// 1. 组件懒加载
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}

// 2. 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: React.lazy(() => import('./Dashboard'))
  }
];
```

### 3.2 预加载策略

```javascript
// 1. 路由预加载
const DashboardComponent = React.lazy(() => import('./Dashboard'));

// 鼠标悬停时预加载
function onMouseEnter() {
  const component = import('./Dashboard');
}

// 2. 组件预加载
const preloadComponent = () => {
  const componentPromise = import('./HeavyComponent');
  return componentPromise;
};
```

## 4. 列表优化

### 4.1 虚拟列表

```javascript
// 使用 react-window 实现虚拟列表
import { FixedSizeList } from 'react-window';

function Row({ index, style }) {
  return <div style={style}>Row {index}</div>;
}

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      width={300}
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 4.2 分页加载

```javascript
function PaginatedList() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    loadItems(page);
  }, [page]);
  
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
      <button onClick={() => setPage(p => p + 1)}>
        Load More
      </button>
    </div>
  );
}
```

## 5. 网络优化

### 5.1 数据预取

```javascript
// 1. 使用 Suspense 和 数据预取
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <ProfileTimeline resource={resource} />
    </Suspense>
  );
}

// 2. 预取数据
const prefetchUser = (id) => {
  if (!cache.has(id)) {
    cache.set(id, fetchUser(id));
  }
  return cache.get(id);
};
```

### 5.2 缓存策略

```javascript
// 1. 实现简单的缓存
const cache = new Map();

function useCachedData(key) {
  const [data, setData] = useState(() => cache.get(key));
  
  useEffect(() => {
    if (!cache.has(key)) {
      fetchData(key).then(newData => {
        cache.set(key, newData);
        setData(newData);
      });
    }
  }, [key]);
  
  return data;
}
```

## 6. 工具和监控

### 6.1 性能分析工具

```javascript
// 1. 使用 React Profiler
import { Profiler } from 'react';

function onRenderCallback(
  id, // 发生提交的 Profiler 树的 "id"
  phase, // "mount" （首次挂载） 或者 "update" （重渲染）
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 在这里进行性能分析
}

function MyApp() {
  return (
    <Profiler id="MyApp" onRender={onRenderCallback}>
      <App />
    </Profiler>
  );
}
```

### 6.2 性能监控

```javascript
// 1. 监控组件渲染时间
class PerformanceMonitor extends React.Component {
  componentDidMount() {
    performance.mark('componentStart');
  }
  
  componentDidUpdate() {
    performance.mark('componentEnd');
    performance.measure(
      'componentRender',
      'componentStart',
      'componentEnd'
    );
  }
}

// 2. 使用 Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

function sendToAnalytics({ name, delta, id }) {
  // 发送性能指标到分析服务
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## 7. 最佳实践总结

1. 合理使用缓存机制（memo, useMemo, useCallback）
2. 避免过度优化，只在必要时进行性能优化
3. 使用开发工具进行性能分析
4. 实现合理的代码分割和懒加载策略
5. 优化网络请求和数据缓存
6. 使用虚拟列表处理大量数据
7. 监控关键性能指标
