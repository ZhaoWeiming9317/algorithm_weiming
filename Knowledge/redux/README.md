# Redux 知识体系

Redux 是一个可预测的 JavaScript 状态管理库，广泛应用于 React 应用中。

## 目录结构

- **[redux-interview-questions.md](./redux-interview-questions.md)** - Redux 面试题详解
  - Redux 核心概念
  - Redux 三大原则
  - Redux 数据流
  - Redux vs Context API
  - Middleware 中间件
  - 异步处理（Thunk vs Saga）
  - Redux Toolkit (RTK)
  - 性能优化
  - 手写实现
  - 最佳实践

- **[useReducer-vs-redux.md](./useReducer-vs-redux.md)** - useReducer 能否替代 Redux？
  - useReducer 基础
  - useReducer + Context 模拟 Redux
  - useReducer vs Redux 详细对比
  - 何时使用 useReducer
  - 何时使用 Redux
  - 混合使用策略
  - 实战建议

## 核心概念

### Redux 三大原则

1. **单一数据源（Single Source of Truth）**
   - 整个应用的状态存储在一个 store 中

2. **State 是只读的（State is Read-Only）**
   - 唯一改变 state 的方法是触发 action

3. **使用纯函数进行修改（Changes are Made with Pure Functions）**
   - Reducer 必须是纯函数

### Redux 数据流

```
View → dispatch(Action) → Reducer → New State → Store → View
```

### 核心 API

- `createStore()` - 创建 store
- `store.getState()` - 获取当前状态
- `store.dispatch(action)` - 派发 action
- `store.subscribe(listener)` - 订阅状态变化
- `combineReducers()` - 合并多个 reducer
- `applyMiddleware()` - 应用中间件

## Redux vs useReducer

### 快速对比

| 特性 | useReducer + Context | Redux |
|------|---------------------|-------|
| **学习曲线** | 低（React 内置） | 中等 |
| **代码量** | 少 | 多（RTK 简化了很多） |
| **作用域** | 组件级 | 应用级 |
| **DevTools** | 无 | 强大的 DevTools |
| **中间件** | 无 | 丰富的中间件生态 |
| **性能优化** | 需要手动优化 | 内置优化 |
| **异步处理** | 需要手动实现 | 成熟方案 |
| **适用场景** | 简单到中等复杂度 | 中等到高复杂度 |

### 选择建议

- **小型项目、简单状态** → useState
- **中型项目、复杂组件状态** → useReducer
- **大型项目、全局状态管理** → Redux (RTK)
- **需要强大调试、中间件、性能优化** → Redux

详细对比请查看 [useReducer-vs-redux.md](./useReducer-vs-redux.md)

## Redux Toolkit (RTK)

Redux Toolkit 是 Redux 官方推荐的工具集，大大简化了 Redux 的使用。

### 核心 API

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

// 创建 Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; },
    decrement: state => { state.value -= 1; }
  }
});

// 创建 Store
const store = configureStore({
  reducer: { counter: counterSlice.reducer }
});
```

### RTK 的优势

1. **简化代码**：自动生成 action creators
2. **内置 Immer**：可以"直接修改" state
3. **自动配置**：DevTools、Thunk 等自动配置
4. **TypeScript 支持**：优秀的类型推导

## 中间件

### 常用中间件

- **redux-thunk**：处理异步 action
- **redux-saga**：使用 Generator 处理复杂异步流程
- **redux-logger**：记录 action 和 state 变化
- **redux-persist**：持久化 state

### 中间件示例

```javascript
// Logger 中间件
const logger = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

// Thunk 中间件
const thunk = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
```

## 异步处理

### Redux-Thunk

```javascript
const fetchUser = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_USER_START' });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_FAILURE', payload: error });
    }
  };
};
```

### Redux-Saga

```javascript
function* fetchUserSaga(action) {
  try {
    yield put({ type: 'FETCH_USER_START' });
    const user = yield call(fetchUser, action.payload.userId);
    yield put({ type: 'FETCH_USER_SUCCESS', payload: user });
  } catch (error) {
    yield put({ type: 'FETCH_USER_FAILURE', payload: error });
  }
}
```

### RTK Query

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (id) => `users/${id}`,
    }),
  }),
});
```

## 性能优化

### 1. 使用 Reselect

```javascript
import { createSelector } from 'reselect';

const getTodos = state => state.todos;
const getFilter = state => state.filter;

const getVisibleTodos = createSelector(
  [getTodos, getFilter],
  (todos, filter) => {
    // 只有 todos 或 filter 变化时才重新计算
    return todos.filter(todo => /* ... */);
  }
);
```

### 2. 规范化 State

```javascript
// ❌ 嵌套结构
{
  posts: [
    { id: 1, author: { id: 1, name: 'John' } },
    { id: 2, author: { id: 1, name: 'John' } }
  ]
}

// ✅ 规范化结构
{
  posts: {
    byId: {
      1: { id: 1, authorId: 1 },
      2: { id: 2, authorId: 1 }
    },
    allIds: [1, 2]
  },
  authors: {
    byId: {
      1: { id: 1, name: 'John' }
    }
  }
}
```

### 3. 精确订阅

```javascript
// ❌ 订阅整个 state
const state = useSelector(state => state);

// ✅ 只订阅需要的部分
const user = useSelector(state => state.user);
const todos = useSelector(state => state.todos);
```

## 最佳实践

1. **使用 Redux Toolkit**
   - 简化代码，减少样板代码
   - 自动配置 DevTools 和中间件

2. **规范化 State 结构**
   - 避免深层嵌套
   - 使用 normalizr 库

3. **使用 Reselect 缓存计算**
   - 避免不必要的重新计算
   - 提高性能

4. **精确订阅**
   - 只订阅需要的 state
   - 避免不必要的重渲染

5. **合理拆分 Reducer**
   - 按功能模块拆分
   - 使用 combineReducers

6. **使用 TypeScript**
   - 类型安全
   - 更好的开发体验

7. **测试**
   - Reducer 是纯函数，易于测试
   - 测试 action creators
   - 测试异步逻辑

## 学习资源

### 官方文档
- [Redux 官网](https://redux.js.org)
- [Redux Toolkit 官网](https://redux-toolkit.js.org)
- [React-Redux 官网](https://react-redux.js.org)

### 社区资源
- [Redux GitHub](https://github.com/reduxjs/redux)
- [Awesome Redux](https://github.com/xgrommx/awesome-redux)

## 常见问题

### 1. Redux 和 Context API 的区别？
- Redux 有强大的 DevTools、中间件生态
- Context API 更简单，但功能有限
- 详见 [redux-interview-questions.md](./redux-interview-questions.md)

### 2. 何时使用 Redux？
- 应用状态复杂
- 需要在多个组件间共享状态
- 需要追踪状态变化历史
- 需要处理复杂的异步逻辑

### 3. useReducer 能替代 Redux 吗？
- 简单场景可以
- 复杂场景不建议
- 详见 [useReducer-vs-redux.md](./useReducer-vs-redux.md)

### 4. Redux 性能如何优化？
- 使用 Reselect 缓存计算
- 规范化 State 结构
- 精确订阅
- 使用 React.memo、useMemo

### 5. 如何处理异步操作？
- Redux-Thunk：简单异步
- Redux-Saga：复杂异步流程
- RTK Query：API 调用

## 总结

Redux 是一个强大的状态管理库，适合中大型应用。虽然学习曲线较陡，但提供了可预测的状态管理、强大的调试工具和丰富的生态系统。

**选择建议：**
- 小型项目 → useState / useReducer
- 中型项目 → useReducer + Context / Redux Toolkit
- 大型项目 → Redux Toolkit + RTK Query

**学习路径：**
1. 理解 Redux 核心概念
2. 学习 Redux Toolkit
3. 掌握异步处理（Thunk/Saga）
4. 学习性能优化
5. 实战项目应用
