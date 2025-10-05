# React Hooks 深入解析

## 1. Hooks 的产生背景

### 1.1 类组件的问题

```javascript
// 1. 状态逻辑难以复用
class UserStatus extends React.Component {
  state = { isOnline: false };
  
  componentDidMount() {
    UserAPI.subscribe(this.handleStatusChange);
  }
  
  componentWillUnmount() {
    UserAPI.unsubscribe(this.handleStatusChange);
  }
  
  handleStatusChange = (status) => {
    this.setState({ isOnline: status });
  }
}

// 2. 复杂组件难以理解
class ComplexComponent extends React.Component {
  componentDidMount() {
    // 订阅数据
    // 设置定时器
    // 添加事件监听
  }
  
  componentWillUnmount() {
    // 取消订阅
    // 清除定时器
    // 移除事件监听
  }
}

// 3. this 绑定问题
class ButtonComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    // this 的指向需要手动绑定
  }
}
```

### 1.2 Hooks 的优势

```javascript
// 1. 状态逻辑复用
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    const handleStatusChange = (status) => setIsOnline(status);
    UserAPI.subscribe(handleStatusChange);
    return () => UserAPI.unsubscribe(handleStatusChange);
  }, []);
  
  return isOnline;
}

// 2. 关注点分离
function UserProfile() {
  // 状态管理
  const [user, setUser] = useState(null);
  // 订阅逻辑
  const isOnline = useOnlineStatus();
  // 数据获取
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);
  
  return <div>{/* 渲染逻辑 */}</div>;
}

// 3. 无需 this 绑定
function ButtonComponent() {
  const handleClick = () => {
    // 直接访问最新的 props 和 state
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

## 2. 核心 Hooks 详解

### 2.1 useState

```javascript
// 1. 基本用法
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  );
}

// 2. 函数式更新
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    // 会正确执行两次增加
  };
  
  return <button onClick={increment}>+2</button>;
}

// 3. 惰性初始化
function ExpensiveComponent() {
  const [data] = useState(() => {
    // 昂贵的计算只会执行一次
    return computeExpensiveValue();
  });
}
```

### 2.2 useEffect

```javascript
// 1. 基本用法
function UserComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 副作用代码
    const fetchUser = async () => {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();
      setUser(data);
    };
    
    fetchUser();
    
    // 清理函数
    return () => {
      // 在组件卸载或依赖项变化前执行
      setUser(null);
    };
  }, [userId]); // 依赖项数组
}

// 2. 多个 effect 的组织
function UserProfile() {
  // 数据获取
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // 订阅
  useEffect(() => {
    const subscription = subscribe();
    return () => subscription.unsubscribe();
  }, []);
  
  // DOM 操作
  useEffect(() => {
    const handler = () => {};
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
}

// 3. 条件执行
function SearchComponent({ query }) {
  useEffect(() => {
    if (query.length > 3) {
      performSearch(query);
    }
  }, [query]); // 只在 query 变化且长度大于 3 时执行
}
```

### 2.3 useContext

```javascript
// 1. 创建上下文
const ThemeContext = React.createContext('light');

// 2. 提供上下文
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}

// 3. 使用上下文
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

### 2.4 useReducer

```javascript
// 1. 定义 reducer
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 2. 使用 reducer
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}

// 3. 复杂状态管理
function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  
  const addTodo = (text) => {
    dispatch({ 
      type: 'ADD_TODO',
      payload: { text, id: Date.now() }
    });
  };
  
  return (
    <>
      <input onKeyPress={/* ... */} />
      <TodoList todos={todos} dispatch={dispatch} />
    </>
  );
}
```

## 3. 自定义 Hooks

### 3.1 创建自定义 Hook

```javascript
// 1. 表单处理 Hook
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  
  return {
    value,
    onChange: handleChange
  };
}

// 2. 网络请求 Hook
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}

// 3. 防抖 Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### 3.2 使用自定义 Hook

```javascript
function SearchComponent() {
  const searchInput = useFormInput('');
  const debouncedSearch = useDebounce(searchInput.value, 500);
  const { data, loading } = useApi(`/api/search?q=${debouncedSearch}`);
  
  return (
    <div>
      <input {...searchInput} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data?.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 4. Hooks 的规则

### 4.1 只在最顶层使用 Hooks

```javascript
// 🔴 错误示例
function BadComponent() {
  const [count, setCount] = useState(0);
  
  if (count > 0) {
    // 条件语句中使用 Hook
    const [data, setData] = useState(null);
  }
  
  for (let i = 0; i < count; i++) {
    // 循环中使用 Hook
    useEffect(() => {});
  }
}

// ✅ 正确示例
function GoodComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    if (count > 0) {
      // 在 effect 中使用条件逻辑
      fetchData().then(setData);
    }
  }, [count]);
}
```

### 4.2 只在 React 函数中使用 Hooks

```javascript
// 🔴 错误示例
class Component extends React.Component {
  render() {
    // 类组件中不能使用 Hooks
    const [count] = useState(0);
  }
}

function regularFunction() {
  // 普通函数中不能使用 Hooks
  const [data] = useState(null);
}

// ✅ 正确示例
function FunctionComponent() {
  // React 函数组件中使用 Hooks
  const [count] = useState(0);
  return <div>{count}</div>;
}

const MemoComponent = React.memo(() => {
  // React 函数组件中使用 Hooks
  const [data] = useState(null);
  return <div>{data}</div>;
});
```

## 5. 性能优化

### 5.1 useMemo 和 useCallback

```javascript
// 1. useMemo 用于缓存计算结果
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
}

// 2. useCallback 用于缓存函数
function ParentComponent() {
  const [items, setItems] = useState([]);
  
  const handleClick = useCallback(() => {
    setItems(prevItems => [...prevItems, 'New Item']);
  }, []); // 空依赖数组，函数永远不变
  
  return <ChildComponent onClick={handleClick} />;
}
```

### 5.2 避免重复渲染

```javascript
// 1. 使用 React.memo
const MemoizedComponent = React.memo(function({ value }) {
  return <div>{value}</div>;
});

// 2. 使用 useMemo 包装组件
function ParentComponent() {
  const memoizedChild = useMemo(() => {
    return <ExpensiveComponent />;
  }, [/* 依赖项 */]);
  
  return <div>{memoizedChild}</div>;
}

// 3. 状态下移
function OptimizedList() {
  const [items] = useState([/* ... */]);
  
  return (
    <ul>
      {items.map(item => (
        <MemoizedListItem
          key={item.id}
          item={item}
        />
      ))}
    </ul>
  );
}
```

## 6. 实际应用示例

### 6.1 完整的表单处理

```javascript
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);
  
  const validate = useCallback(() => {
    // 验证逻辑
  }, [values]);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate
  };
}

function RegistrationForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate
  } = useForm({
    username: '',
    email: '',
    password: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // 提交表单
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.username && errors.username && (
        <span>{errors.username}</span>
      )}
      {/* 其他表单字段 */}
    </form>
  );
}
```

### 6.2 数据获取和缓存

```javascript
function useDataFetching(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cache = useRef({});
  
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      // 检查缓存
      if (cache.current[url]) {
        setData(cache.current[url]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(url, options);
        const json = await response.json();
        
        if (mounted) {
          // 更新缓存
          cache.current[url] = json;
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [url, options.method, options.body]);
  
  return { data, loading, error };
}
```

## 7. 面试总结

### 7.1 核心要点

1. **Hooks 的优势**：
   - 更好的代码复用
   - 更清晰的关注点分离
   - 更简单的状态管理

2. **常见问题解决**：
   - 状态同步
   - 副作用处理
   - 性能优化

3. **最佳实践**：
   - 遵循 Hooks 规则
   - 合理使用依赖数组
   - 适当的性能优化

### 7.2 面试回答策略

1. **为什么使用 Hooks**：
   "Hooks 让我们能够在函数组件中使用状态和其他 React 特性，避免了类组件的问题，如 this 绑定、生命周期方法分散等，同时提供了更好的代码复用机制。"

2. **Hooks 规则**：
   "Hooks 必须在函数组件的顶层调用，不能在条件语句、循环或普通函数中使用。这是因为 React 依赖 Hooks 的调用顺序来维护状态。"

3. **性能优化**：
   "使用 useMemo 和 useCallback 来缓存计算结果和函数，避免不必要的重新渲染。同时，合理设置依赖数组，避免过度优化。"
