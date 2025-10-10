# useReducer 能否替代 Redux？

## 快速回答

**简短答案：** 对于简单场景可以，但复杂场景不建议。

**关键区别：**
- `useReducer` 是 React Hook，用于组件级状态管理
- Redux 是独立的状态管理库，用于应用级状态管理

## useReducer 基础

### 什么是 useReducer？

`useReducer` 是 React 提供的 Hook，用于管理复杂的组件状态。

```javascript
import { useReducer } from 'react';

// 1. 定义 reducer
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

// 2. 使用 useReducer
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

### useReducer 的优势

```javascript
// ❌ 使用 useState 管理复杂状态
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // 状态更新逻辑分散，难以维护
}

// ✅ 使用 useReducer 管理复杂状态
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

function TodoList() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
    loading: false,
    error: null
  });
  
  // 状态更新逻辑集中，易于维护和测试
}
```

## useReducer + Context 模拟 Redux

### 基本实现

```javascript
// 1. 创建 Context
import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext();

// 2. 定义 reducer
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      };
    
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// 3. 创建 Provider
function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: []
  });
  
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

// 4. 创建自定义 Hook
function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}

// 5. 使用
function App() {
  return (
    <TodoProvider>
      <TodoList />
      <TodoStats />
    </TodoProvider>
  );
}

function TodoList() {
  const { state, dispatch } = useTodos();
  
  const addTodo = (text) => {
    dispatch({
      type: 'ADD_TODO',
      payload: { id: Date.now(), text, completed: false }
    });
  };
  
  return (
    <div>
      {state.todos.map(todo => (
        <div key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}>
            Toggle
          </button>
          <button onClick={() => dispatch({ type: 'REMOVE_TODO', payload: todo.id })}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function TodoStats() {
  const { state } = useTodos();
  const completedCount = state.todos.filter(t => t.completed).length;
  
  return <p>Completed: {completedCount} / {state.todos.length}</p>;
}
```

### 添加 Action Creators

```javascript
// actions.js
export const todoActions = {
  addTodo: (text) => ({
    type: 'ADD_TODO',
    payload: { id: Date.now(), text, completed: false }
  }),
  
  toggleTodo: (id) => ({
    type: 'TOGGLE_TODO',
    payload: id
  }),
  
  removeTodo: (id) => ({
    type: 'REMOVE_TODO',
    payload: id
  })
};

// 使用
import { todoActions } from './actions';

function TodoList() {
  const { state, dispatch } = useTodos();
  
  const handleAdd = (text) => {
    dispatch(todoActions.addTodo(text));
  };
  
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### 添加异步支持

```javascript
// 自定义 Hook 封装异步逻辑
function useTodoActions() {
  const { dispatch } = useTodos();
  
  const fetchTodos = async () => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: todos
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_ERROR',
        payload: error.message
      });
    }
  };
  
  const addTodo = async (text) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: { 'Content-Type': 'application/json' }
      });
      const todo = await response.json();
      
      dispatch({
        type: 'ADD_TODO',
        payload: todo
      });
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };
  
  return { fetchTodos, addTodo };
}

// 使用
function TodoList() {
  const { state } = useTodos();
  const { fetchTodos, addTodo } = useTodoActions();
  
  useEffect(() => {
    fetchTodos();
  }, []);
  
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## useReducer vs Redux 详细对比

### 1. 作用域

```javascript
// useReducer：组件级
function ComponentA() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // state 只在 ComponentA 及其子组件中可用（通过 Context）
}

function ComponentB() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // 这是完全独立的 state，与 ComponentA 无关
}

// Redux：应用级
import { createStore } from 'redux';
const store = createStore(reducer);
// 整个应用共享同一个 store
```

### 2. DevTools 支持

```javascript
// useReducer：无内置 DevTools
// 需要手动实现或使用第三方库

// Redux：强大的 DevTools
import { createStore } from 'redux';
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
// 时间旅行、状态快照、action 历史等
```

### 3. 中间件

```javascript
// useReducer：无中间件系统
// 需要手动实现

// Redux：丰富的中间件生态
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(
  reducer,
  applyMiddleware(thunk, logger)
);
```

### 4. 性能优化

```javascript
// useReducer + Context：可能导致不必要的重渲染
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // ❌ state 任何部分变化，所有使用 Context 的组件都会重渲染
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <ComponentA />  {/* 只需要 state.user */}
      <ComponentB />  {/* 只需要 state.todos */}
    </StateContext.Provider>
  );
}

// Redux：精确订阅
import { useSelector } from 'react-redux';

function ComponentA() {
  // ✅ 只订阅 user，只有 user 变化才重渲染
  const user = useSelector(state => state.user);
}

function ComponentB() {
  // ✅ 只订阅 todos，只有 todos 变化才重渲染
  const todos = useSelector(state => state.todos);
}
```

### 5. 代码组织

```javascript
// useReducer：代码可能分散
// TodoContext.js
// UserContext.js
// SettingsContext.js
// 每个功能都需要创建 Context、Provider、Hook

// Redux：统一管理
// store/
//   index.js          // 创建 store
//   rootReducer.js    // 合并 reducer
//   todos/
//     slice.js        // todos 的 reducer 和 actions
//   user/
//     slice.js        // user 的 reducer 和 actions
```

### 6. 异步处理

```javascript
// useReducer：需要手动实现
function useTodoActions() {
  const { dispatch } = useTodos();
  
  const fetchTodos = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetch('/api/todos').then(r => r.json());
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error });
    }
  };
  
  return { fetchTodos };
}

// Redux：成熟的解决方案
import { createAsyncThunk } from '@reduxjs/toolkit';

const fetchTodos = createAsyncThunk(
  'todos/fetch',
  async () => {
    const response = await fetch('/api/todos');
    return response.json();
  }
);

// 自动处理 pending、fulfilled、rejected 状态
```

## 对比表格

| 特性 | useReducer + Context | Redux |
|------|---------------------|-------|
| **学习曲线** | 低（React 内置） | 中等（需要学习新概念） |
| **代码量** | 少 | 多（但 RTK 简化了很多） |
| **作用域** | 组件级（需要 Context 共享） | 应用级 |
| **DevTools** | 无（需要自己实现） | 强大的 DevTools |
| **中间件** | 无（需要自己实现） | 丰富的中间件生态 |
| **性能优化** | 需要手动优化（useMemo、React.memo） | 内置优化（精确订阅） |
| **异步处理** | 需要手动实现 | 成熟方案（thunk、saga、RTK Query） |
| **时间旅行** | 不支持 | 支持 |
| **持久化** | 需要手动实现 | 有成熟方案（redux-persist） |
| **SSR 支持** | 需要手动实现 | 有成熟方案 |
| **类型安全** | 需要手动定义 | TypeScript 支持良好 |
| **测试** | 简单 | 简单（纯函数） |
| **适用场景** | 简单到中等复杂度 | 中等到高复杂度 |

## 何时使用 useReducer？

### ✅ 适合使用 useReducer 的场景

```javascript
// 1. 组件内部的复杂状态
function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  // 表单状态只在这个组件内使用
}

// 2. 简单的跨组件状态共享
function App() {
  const [theme, dispatch] = useReducer(themeReducer, 'light');
  
  return (
    <ThemeContext.Provider value={{ theme, dispatch }}>
      <Header />
      <Content />
    </ThemeContext.Provider>
  );
}

// 3. 状态更新逻辑复杂，但不需要全局共享
function Wizard() {
  const [state, dispatch] = useReducer(wizardReducer, {
    step: 1,
    data: {},
    errors: {}
  });
  
  // 多步骤表单，状态更新逻辑复杂
}

// 4. 小型应用
// 整个应用状态不复杂，不需要 Redux 的强大功能
```

## 何时使用 Redux？

### ✅ 适合使用 Redux 的场景

```javascript
// 1. 大量状态需要全局共享
const globalState = {
  user: { /* ... */ },
  todos: [ /* ... */ ],
  posts: [ /* ... */ ],
  comments: { /* ... */ },
  ui: { /* ... */ },
  cache: { /* ... */ }
};

// 2. 需要强大的调试工具
// 时间旅行、状态快照、action 历史

// 3. 需要中间件
// 日志、错误上报、API 调用、WebSocket

// 4. 复杂的异步逻辑
// 多个 API 调用、复杂的业务流程

// 5. 需要持久化
// 将状态保存到 localStorage、IndexedDB

// 6. 团队协作
// 统一的状态管理规范、代码组织

// 7. 需要性能优化
// 精确订阅、避免不必要的重渲染
```

## 混合使用

实际项目中，可以混合使用 useReducer 和 Redux：

```javascript
// 全局状态使用 Redux
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import todosSlice from './features/todos/todosSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    todos: todosSlice
  }
});

// 组件内部状态使用 useReducer
function ComplexForm() {
  // 表单状态只在这个组件内使用
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  
  // 全局用户状态使用 Redux
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  const handleSubmit = async () => {
    // 提交表单数据到 Redux
    await dispatch(submitForm(formState));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

## 实战建议

### 1. 从简单开始

```javascript
// 开始时使用 useState
const [count, setCount] = useState(0);

// 状态逻辑变复杂时，升级到 useReducer
const [state, dispatch] = useReducer(reducer, initialState);

// 需要全局共享时，升级到 Redux
import { useSelector, useDispatch } from 'react-redux';
```

### 2. 不要过度设计

```javascript
// ❌ 不要为了用 Redux 而用 Redux
// 简单的计数器不需要 Redux
const [count, setCount] = useState(0);

// ✅ 只在真正需要时使用 Redux
// 复杂的应用状态、需要全局共享
```

### 3. 考虑使用 Redux Toolkit

```javascript
// Redux Toolkit 大大简化了 Redux 的使用
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; },
    decrement: state => { state.value -= 1; }
  }
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer }
});
```

## 总结

**useReducer 能否替代 Redux？**

- **简单场景**：可以，useReducer + Context 足够
- **复杂场景**：不建议，Redux 提供更多功能和更好的开发体验

**选择建议：**

1. **小型项目、简单状态** → useState
2. **中型项目、复杂组件状态** → useReducer
3. **大型项目、全局状态管理** → Redux (RTK)
4. **需要强大调试、中间件、性能优化** → Redux

**最佳实践：**
- 不要过度设计，从简单开始
- 根据项目复杂度选择合适的方案
- 可以混合使用 useReducer 和 Redux
- 优先考虑 Redux Toolkit，而不是原生 Redux
