# Redux 面试题详解

## 目录
1. [Redux 核心概念](#1-redux-核心概念)
2. [Redux 三大原则](#2-redux-三大原则)
3. [Redux 数据流](#3-redux-数据流)
4. [Redux vs Context API](#4-redux-vs-context-api)
5. [Middleware 中间件](#5-middleware-中间件)
6. [异步处理](#6-异步处理)
7. [Redux Toolkit (RTK)](#7-redux-toolkit-rtk)
8. [性能优化](#8-性能优化)
9. [手写实现](#9-手写实现)
10. [最佳实践](#10-最佳实践)

---

## 1. Redux 核心概念

### Q1: Redux 是什么？解决了什么问题？

**A:** Redux 是一个可预测的状态管理库，主要解决以下问题：

**解决的问题：**
1. **状态共享困难**：多个组件需要共享状态时，需要层层传递 props
2. **状态难以追踪**：状态分散在各个组件中，难以调试
3. **状态更新不可预测**：没有统一的状态更新规范

**核心思想：**
```javascript
// 单一数据源 + 纯函数更新 + 单向数据流
State → View → Action → Reducer → New State → View
```

**基本示例：**
```javascript
// 1. 定义 Action Types
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// 2. 定义 Action Creators
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// 3. 定义 Reducer
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// 4. 创建 Store
import { createStore } from 'redux';
const store = createStore(counterReducer);

// 5. 使用
store.subscribe(() => console.log(store.getState()));
store.dispatch(increment()); // { count: 1 }
store.dispatch(increment()); // { count: 2 }
store.dispatch(decrement()); // { count: 1 }
```

---

### Q2: Redux 的核心 API 有哪些？

**A:** Redux 的核心 API 包括：

```javascript
// 1. createStore - 创建 store
import { createStore } from 'redux';
const store = createStore(
  reducer,           // 必需：根 reducer
  preloadedState,    // 可选：初始状态
  enhancer          // 可选：store 增强器（如 applyMiddleware）
);

// 2. store.getState() - 获取当前状态
const currentState = store.getState();

// 3. store.dispatch(action) - 派发 action
store.dispatch({ type: 'INCREMENT' });

// 4. store.subscribe(listener) - 订阅状态变化
const unsubscribe = store.subscribe(() => {
  console.log('State changed:', store.getState());
});
unsubscribe(); // 取消订阅

// 5. combineReducers - 合并多个 reducer
import { combineReducers } from 'redux';
const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  todos: todosReducer
});

// 6. applyMiddleware - 应用中间件
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
);

// 7. bindActionCreators - 绑定 action creators
import { bindActionCreators } from 'redux';
const boundActions = bindActionCreators(
  { increment, decrement },
  store.dispatch
);
boundActions.increment(); // 等同于 store.dispatch(increment())

// 8. compose - 组合多个函数
import { compose } from 'redux';
const enhancer = compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

---

### Q3: Action、Reducer、Store 分别是什么？

**A:**

#### **Action - 动作**
描述"发生了什么"的普通 JavaScript 对象

```javascript
// Action 的结构
{
  type: 'ADD_TODO',      // 必需：action 类型
  payload: {             // 可选：携带的数据
    id: 1,
    text: '学习 Redux'
  }
}

// Action Creator - 创建 action 的函数
const addTodo = (text) => ({
  type: 'ADD_TODO',
  payload: {
    id: Date.now(),
    text
  }
});

// 使用
store.dispatch(addTodo('学习 Redux'));
```

#### **Reducer - 纯函数**
描述"如何更新状态"的纯函数

```javascript
// Reducer 的签名：(state, action) => newState
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      // ✅ 返回新对象，不修改原状态
      return [...state, action.payload];
    
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.payload.id);
    
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    
    default:
      // ✅ 默认返回原状态
      return state;
  }
};

// Reducer 必须是纯函数：
// 1. 相同输入 → 相同输出
// 2. 不能修改参数
// 3. 不能有副作用（API 调用、路由跳转等）
```

#### **Store - 状态容器**
存储应用的完整状态树

```javascript
// Store 的职责
const store = createStore(rootReducer);

// 1. 持有应用状态
store.getState(); // { todos: [], user: null, ... }

// 2. 允许通过 dispatch 更新状态
store.dispatch(addTodo('学习 Redux'));

// 3. 允许通过 subscribe 注册监听器
const unsubscribe = store.subscribe(() => {
  console.log('State updated:', store.getState());
});

// 4. 通过 unsubscribe 取消监听
unsubscribe();
```

**三者关系：**
```
Component → dispatch(Action) → Reducer → New State → Store → Component
```

---

## 2. Redux 三大原则

### Q4: Redux 的三大原则是什么？为什么要遵循这些原则？

**A:**

#### **原则1：单一数据源（Single Source of Truth）**

整个应用的状态存储在一个对象树中，这个对象树只存在于唯一的 store 中。

```javascript
// ✅ 正确：单一 store
const store = createStore(rootReducer);

// ❌ 错误：多个 store
const userStore = createStore(userReducer);
const todoStore = createStore(todoReducer);

// 好处：
// 1. 便于调试：所有状态在一个地方
// 2. 便于持久化：只需序列化一个对象
// 3. 便于服务端渲染：状态可以从服务器传到客户端
// 4. 便于实现撤销/重做功能
```

#### **原则2：State 是只读的（State is Read-Only）**

唯一改变 state 的方法是触发 action。

```javascript
// ❌ 错误：直接修改 state
const state = store.getState();
state.count = 10; // 不会触发更新，且破坏了可预测性

// ✅ 正确：通过 dispatch action
store.dispatch({ type: 'SET_COUNT', payload: 10 });

// 好处：
// 1. 确保视图和网络请求都不能直接修改 state
// 2. 所有修改都是集中化的，按照严格的顺序执行
// 3. 便于追踪每一个变化
// 4. 便于实现时间旅行调试
```

#### **原则3：使用纯函数进行修改（Changes are Made with Pure Functions）**

Reducer 必须是纯函数。

```javascript
// ✅ 正确：纯函数 reducer
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1; // 返回新值
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

// ❌ 错误：不纯的 reducer
const impureReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      state.count++; // 直接修改 state
      return state;
    
    case 'ADD_RANDOM':
      return { count: Math.random() }; // 不确定的输出
    
    case 'FETCH_DATA':
      fetch('/api/data'); // 副作用
      return state;
    
    default:
      return state;
  }
};

// 纯函数的特点：
// 1. 相同输入 → 相同输出
// 2. 不修改参数
// 3. 不依赖外部状态
// 4. 不产生副作用（API 调用、修改全局变量等）

// 好处：
// 1. 可预测：相同的 action 总是产生相同的结果
// 2. 可测试：不需要 mock，直接测试输入输出
// 3. 可重放：可以记录和重放 action
// 4. 时间旅行：可以回到任意历史状态
```

---

## 3. Redux 数据流

### Q5: Redux 的数据流是怎样的？

**A:** Redux 是严格的单向数据流。

```javascript
// 完整的数据流示例
import { createStore } from 'redux';

// 1. 定义初始状态
const initialState = {
  todos: [],
  filter: 'all'
};

// 2. 定义 Reducer
const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    
    default:
      return state;
  }
};

// 3. 创建 Store
const store = createStore(todoReducer);

// 4. 订阅状态变化
store.subscribe(() => {
  console.log('State changed:', store.getState());
  // 在 React 中，这里会触发组件重新渲染
});

// 5. 派发 Action
store.dispatch({
  type: 'ADD_TODO',
  payload: { id: 1, text: '学习 Redux', completed: false }
});

// 数据流：
// ┌─────────────┐
// │   View      │ 用户点击按钮
// └──────┬──────┘
//        │ dispatch(action)
//        ▼
// ┌─────────────┐
// │   Action    │ { type: 'ADD_TODO', payload: {...} }
// └──────┬──────┘
//        │
//        ▼
// ┌─────────────┐
// │   Reducer   │ (state, action) => newState
// └──────┬──────┘
//        │
//        ▼
// ┌─────────────┐
// │   Store     │ 更新状态
// └──────┬──────┘
//        │ subscribe
//        ▼
// ┌─────────────┐
// │   View      │ 重新渲染
// └─────────────┘
```

**在 React 中的完整示例：**

```javascript
import React from 'react';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Reducer
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// Store
const store = createStore(counterReducer);

// Component
function Counter() {
  // 1. 从 store 读取状态
  const count = useSelector(state => state.count);
  
  // 2. 获取 dispatch 函数
  const dispatch = useDispatch();
  
  return (
    <div>
      <h1>{count}</h1>
      {/* 3. 用户交互触发 dispatch */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}

// App
function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

---

## 4. Redux vs Context API

### Q6: Redux 和 Context API 的区别？什么时候用 Redux？

**A:**

#### **Context API**

```javascript
// Context API 示例
import React, { createContext, useContext, useState } from 'react';

const CountContext = createContext();

function CountProvider({ children }) {
  const [count, setCount] = useState(0);
  
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
}

function Counter() {
  const { count, setCount } = useContext(CountContext);
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

#### **Redux**

```javascript
// Redux 示例
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

const store = createStore((state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
});

function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
    </div>
  );
}
```

#### **对比表**

| 特性 | Context API | Redux |
|------|-------------|-------|
| **学习曲线** | 简单，React 内置 | 较陡，需要学习新概念 |
| **代码量** | 少 | 多（但 RTK 简化了很多） |
| **性能** | 可能导致不必要的重渲染 | 优化良好，精确更新 |
| **调试** | 较难追踪状态变化 | DevTools 强大 |
| **中间件** | 无 | 丰富的中间件生态 |
| **时间旅行** | 不支持 | 支持 |
| **异步处理** | 需要自己实现 | 有成熟方案（thunk、saga） |
| **状态结构** | 灵活，可能混乱 | 强制规范化 |
| **适用场景** | 简单的状态共享 | 复杂的状态管理 |

#### **什么时候用 Redux？**

**✅ 使用 Redux 的场景：**
```javascript
// 1. 应用状态复杂，有很多状态需要管理
const complexState = {
  user: { /* ... */ },
  todos: [ /* ... */ ],
  filters: { /* ... */ },
  ui: { /* ... */ },
  cache: { /* ... */ }
};

// 2. 需要在多个组件间共享状态
// Component A, B, C, D 都需要访问和修改 user 状态

// 3. 需要追踪状态变化历史
// 实现撤销/重做功能

// 4. 需要处理复杂的异步逻辑
// 多个 API 调用、复杂的业务逻辑

// 5. 团队协作，需要统一的状态管理规范
// 大型项目，多人协作
```

**✅ 使用 Context API 的场景：**
```javascript
// 1. 简单的状态共享
// 主题、语言、用户认证状态

// 2. 不需要频繁更新的状态
const ThemeContext = createContext();

// 3. 小型应用
// 状态简单，组件层级不深

// 4. 不需要中间件和调试工具
```

#### **性能对比**

```javascript
// Context API 的性能问题
function App() {
  const [user, setUser] = useState({ name: 'John', age: 25 });
  const [theme, setTheme] = useState('light');
  
  // ❌ 问题：user 或 theme 变化时，所有使用 Context 的组件都会重渲染
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      <Header />  {/* 只需要 theme，但 user 变化也会重渲染 */}
      <Profile /> {/* 只需要 user，但 theme 变化也会重渲染 */}
    </AppContext.Provider>
  );
}

// Redux 的性能优化
function Header() {
  // ✅ 只订阅 theme，theme 变化才重渲染
  const theme = useSelector(state => state.theme);
  return <header className={theme}>...</header>;
}

function Profile() {
  // ✅ 只订阅 user，user 变化才重渲染
  const user = useSelector(state => state.user);
  return <div>{user.name}</div>;
}
```

---

## 5. Middleware 中间件

### Q7: Redux 中间件是什么？如何工作的？

**A:** 中间件是 Redux 的扩展机制，在 action 被发起之后、到达 reducer 之前的扩展点。

#### **中间件的执行流程**

```javascript
// 没有中间件
dispatch(action) → reducer → new state

// 有中间件
dispatch(action) → middleware1 → middleware2 → middleware3 → reducer → new state
```

#### **中间件的结构**

```javascript
// 中间件的签名
const middleware = store => next => action => {
  // store: { getState, dispatch }
  // next: 下一个中间件或 reducer
  // action: 当前的 action
  
  // 在 action 到达 reducer 之前做一些事情
  console.log('dispatching', action);
  
  // 调用下一个中间件
  const result = next(action);
  
  // 在 action 到达 reducer 之后做一些事情
  console.log('next state', store.getState());
  
  return result;
};
```

#### **常见中间件示例**

```javascript
// 1. Logger 中间件 - 记录日志
const logger = store => next => action => {
  console.group(action.type);
  console.log('prev state:', store.getState());
  console.log('action:', action);
  
  const result = next(action);
  
  console.log('next state:', store.getState());
  console.groupEnd();
  
  return result;
};

// 2. Crash Reporter 中间件 - 错误上报
const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    // 上报错误到服务器
    reportError(err, {
      action,
      state: store.getState()
    });
    throw err;
  }
};

// 3. Thunk 中间件 - 处理异步 action
const thunk = store => next => action => {
  // 如果 action 是函数，执行它
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  
  // 否则，传递给下一个中间件
  return next(action);
};

// 4. Promise 中间件 - 处理 Promise
const promiseMiddleware = store => next => action => {
  if (action.payload instanceof Promise) {
    action.payload
      .then(result => {
        store.dispatch({ ...action, payload: result });
      })
      .catch(error => {
        store.dispatch({ ...action, payload: error, error: true });
      });
    
    return;
  }
  
  return next(action);
};

// 5. 时间戳中间件 - 添加时间戳
const timestamp = store => next => action => {
  return next({
    ...action,
    meta: {
      ...action.meta,
      timestamp: Date.now()
    }
  });
};
```

#### **应用中间件**

```javascript
import { createStore, applyMiddleware } from 'redux';

// 单个中间件
const store = createStore(
  reducer,
  applyMiddleware(logger)
);

// 多个中间件（从左到右执行）
const store = createStore(
  reducer,
  applyMiddleware(logger, thunk, crashReporter)
);

// 执行顺序：
// dispatch(action)
//   → logger (before)
//   → thunk (before)
//   → crashReporter (before)
//   → reducer
//   → crashReporter (after)
//   → thunk (after)
//   → logger (after)
```

#### **中间件的实际应用**

```javascript
// 使用 thunk 中间件处理异步
const fetchUser = (userId) => {
  return async (dispatch, getState) => {
    // 开始加载
    dispatch({ type: 'FETCH_USER_START' });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      
      // 成功
      dispatch({
        type: 'FETCH_USER_SUCCESS',
        payload: user
      });
    } catch (error) {
      // 失败
      dispatch({
        type: 'FETCH_USER_FAILURE',
        payload: error.message
      });
    }
  };
};

// 使用
store.dispatch(fetchUser(123));
```

---

### Q8: 手写一个简单的 Redux 中间件

**A:**

```javascript
// 1. 手写 Logger 中间件
const myLogger = store => next => action => {
  console.log('🚀 dispatching:', action);
  const result = next(action);
  console.log('📦 next state:', store.getState());
  return result;
};

// 2. 手写 Thunk 中间件
const myThunk = store => next => action => {
  // 如果 action 是函数，调用它并传入 dispatch 和 getState
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  
  // 否则，正常处理
  return next(action);
};

// 3. 手写 API 中间件
const apiMiddleware = store => next => action => {
  // 只处理带有 api 字段的 action
  if (!action.api) {
    return next(action);
  }
  
  const { url, method = 'GET', data, onSuccess, onError } = action.api;
  
  // 发起请求前
  store.dispatch({ type: `${action.type}_START` });
  
  // 发起请求
  fetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(result => {
      // 成功
      store.dispatch({
        type: `${action.type}_SUCCESS`,
        payload: result
      });
      onSuccess && onSuccess(result);
    })
    .catch(error => {
      // 失败
      store.dispatch({
        type: `${action.type}_FAILURE`,
        payload: error.message
      });
      onError && onError(error);
    });
};

// 使用 API 中间件
store.dispatch({
  type: 'FETCH_USER',
  api: {
    url: '/api/users/123',
    method: 'GET',
    onSuccess: (user) => console.log('User loaded:', user),
    onError: (error) => console.error('Error:', error)
  }
});

// 4. 手写延迟中间件
const delayMiddleware = store => next => action => {
  if (action.meta && action.meta.delay) {
    setTimeout(() => {
      next(action);
    }, action.meta.delay);
    return;
  }
  
  return next(action);
};

// 使用
store.dispatch({
  type: 'SHOW_NOTIFICATION',
  payload: 'Hello',
  meta: { delay: 1000 } // 延迟 1 秒
});
```

---

## 6. 异步处理

### Q9: Redux 如何处理异步操作？Redux-Thunk vs Redux-Saga

**A:**

#### **1. Redux-Thunk**

最简单的异步解决方案，允许 action creator 返回函数而不是对象。

```javascript
// 安装
// npm install redux-thunk

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(reducer, applyMiddleware(thunk));

// 基本用法
const fetchUser = (userId) => {
  // 返回一个函数，而不是 action 对象
  return async (dispatch, getState) => {
    dispatch({ type: 'FETCH_USER_START' });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      
      dispatch({
        type: 'FETCH_USER_SUCCESS',
        payload: user
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_USER_FAILURE',
        payload: error.message
      });
    }
  };
};

// 使用
store.dispatch(fetchUser(123));

// 高级用法：条件派发
const fetchUserIfNeeded = (userId) => {
  return (dispatch, getState) => {
    const { users } = getState();
    
    // 如果已经有数据，不重复请求
    if (users[userId]) {
      return Promise.resolve();
    }
    
    return dispatch(fetchUser(userId));
  };
};

// 链式调用
const fetchUserAndPosts = (userId) => {
  return async (dispatch) => {
    // 先获取用户
    await dispatch(fetchUser(userId));
    
    // 再获取用户的帖子
    await dispatch(fetchPosts(userId));
  };
};
```

#### **2. Redux-Saga**

使用 Generator 函数处理副作用，功能更强大但学习曲线更陡。

```javascript
// 安装
// npm install redux-saga

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery, takeLatest, all, select } from 'redux-saga/effects';

// 创建 saga 中间件
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// 定义 saga
function* fetchUserSaga(action) {
  try {
    // put: 派发 action
    yield put({ type: 'FETCH_USER_START' });
    
    // call: 调用异步函数
    const response = yield call(fetch, `/api/users/${action.payload.userId}`);
    const user = yield call([response, 'json']);
    
    yield put({
      type: 'FETCH_USER_SUCCESS',
      payload: user
    });
  } catch (error) {
    yield put({
      type: 'FETCH_USER_FAILURE',
      payload: error.message
    });
  }
}

// 监听 action
function* watchFetchUser() {
  // takeEvery: 监听每一个 action
  yield takeEvery('FETCH_USER_REQUEST', fetchUserSaga);
  
  // takeLatest: 只处理最新的 action（自动取消之前的）
  // yield takeLatest('FETCH_USER_REQUEST', fetchUserSaga);
}

// 根 saga
function* rootSaga() {
  yield all([
    watchFetchUser(),
    watchFetchPosts(),
    // ... 其他 saga
  ]);
}

// 运行 saga
sagaMiddleware.run(rootSaga);

// 使用
store.dispatch({
  type: 'FETCH_USER_REQUEST',
  payload: { userId: 123 }
});
```

#### **Saga 高级用法**

```javascript
// 1. 并发请求
function* fetchUserAndPosts(action) {
  const { userId } = action.payload;
  
  // 并发执行
  const [user, posts] = yield all([
    call(fetchUser, userId),
    call(fetchPosts, userId)
  ]);
  
  yield put({
    type: 'FETCH_SUCCESS',
    payload: { user, posts }
  });
}

// 2. 竞态处理
function* fetchLatestData() {
  // race: 哪个先完成用哪个
  const { data, timeout } = yield race({
    data: call(fetchData),
    timeout: delay(5000)
  });
  
  if (data) {
    yield put({ type: 'FETCH_SUCCESS', payload: data });
  } else {
    yield put({ type: 'FETCH_TIMEOUT' });
  }
}

// 3. 轮询
function* pollData() {
  while (true) {
    try {
      const data = yield call(fetchData);
      yield put({ type: 'FETCH_SUCCESS', payload: data });
      
      // 等待 5 秒
      yield delay(5000);
    } catch (error) {
      yield put({ type: 'FETCH_FAILURE', payload: error });
    }
  }
}

// 4. 取消任务
function* watchFetchData() {
  while (true) {
    yield take('FETCH_START');
    
    // fork: 创建一个可以被取消的任务
    const task = yield fork(fetchDataSaga);
    
    // 等待取消 action
    yield take('FETCH_CANCEL');
    
    // 取消任务
    yield cancel(task);
  }
}

// 5. 访问 state
function* incrementIfOdd() {
  // select: 获取 state
  const count = yield select(state => state.counter.count);
  
  if (count % 2 === 1) {
    yield put({ type: 'INCREMENT' });
  }
}
```

#### **Thunk vs Saga 对比**

| 特性 | Redux-Thunk | Redux-Saga |
|------|-------------|------------|
| **学习曲线** | 简单 | 陡峭（需要学习 Generator） |
| **代码量** | 少 | 多 |
| **测试** | 需要 mock | 易于测试（纯函数） |
| **取消请求** | 需要手动实现 | 内置支持 |
| **并发控制** | 需要手动实现 | 内置支持（all、race） |
| **轮询** | 需要手动实现 | 简单实现 |
| **适用场景** | 简单异步逻辑 | 复杂异步流程 |

**选择建议：**
- 简单项目、简单异步 → **Redux-Thunk**
- 复杂异步流程、需要精细控制 → **Redux-Saga**
- 现代项目 → **Redux Toolkit (RTK Query)**

---

## 7. Redux Toolkit (RTK)

### Q10: Redux Toolkit 是什么？解决了什么问题？

**A:** Redux Toolkit (RTK) 是 Redux 官方推荐的工具集，简化了 Redux 的使用。

#### **传统 Redux 的问题**

```javascript
// ❌ 传统 Redux：代码冗长
// 1. Action Types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const REMOVE_TODO = 'REMOVE_TODO';

// 2. Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
});

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id
});

// 3. Reducer
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload];
    
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.payload);
    
    default:
      return state;
  }
};

// 4. Store
import { createStore } from 'redux';
const store = createStore(todosReducer);
```

#### **Redux Toolkit 的解决方案**

```javascript
// ✅ Redux Toolkit：简洁明了
import { createSlice, configureStore } from '@reduxjs/toolkit';

// 1. 创建 Slice（包含 reducer 和 actions）
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // 自动生成 action creator 和 action type
    addTodo: (state, action) => {
      // ✅ 可以直接"修改" state（内部使用 Immer）
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
    },
    
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    removeTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload);
    }
  }
});

// 2. 导出 actions 和 reducer
export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;

// 3. 创建 Store（自动配置 DevTools、Thunk 等）
const store = configureStore({
  reducer: {
    todos: todosSlice.reducer
  }
});

// 4. 使用
store.dispatch(addTodo('学习 RTK'));
store.dispatch(toggleTodo(1));
```

#### **RTK 的核心 API**

```javascript
// 1. configureStore - 创建 store
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer
  },
  // 自动包含：
  // - Redux DevTools Extension
  // - redux-thunk 中间件
  // - 开发环境的不可变性检查
  // - 开发环境的序列化检查
});

// 2. createSlice - 创建 reducer 和 actions
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});

// 3. createAsyncThunk - 处理异步逻辑
import { createAsyncThunk } from '@reduxjs/toolkit';

const fetchUser = createAsyncThunk(
  'user/fetch',
  async (userId, thunkAPI) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// 使用
dispatch(fetchUser(123));

// 4. createEntityAdapter - 管理规范化数据
import { createEntityAdapter } from '@reduxjs/toolkit';

const todosAdapter = createEntityAdapter({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => a.text.localeCompare(b.text)
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosAdapter.getInitialState(),
  reducers: {
    todoAdded: todosAdapter.addOne,
    todosReceived: todosAdapter.setAll,
    todoUpdated: todosAdapter.updateOne,
    todoRemoved: todosAdapter.removeOne
  }
});

// 生成的 selectors
const todosSelectors = todosAdapter.getSelectors(state => state.todos);
todosSelectors.selectAll(state);    // 所有 todos
todosSelectors.selectById(state, id); // 根据 id 查找
todosSelectors.selectIds(state);    // 所有 ids
```

#### **RTK Query - 数据获取和缓存**

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 定义 API
const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // 查询
    getUser: builder.query({
      query: (userId) => `/users/${userId}`
    }),
    
    // 列表
    getTodos: builder.query({
      query: () => '/todos'
    }),
    
    // 创建
    addTodo: builder.mutation({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo
      })
    }),
    
    // 更新
    updateTodo: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body: patch
      })
    })
  })
});

// 自动生成的 hooks
export const {
  useGetUserQuery,
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation
} = api;

// 在组件中使用
function UserProfile({ userId }) {
  const { data, error, isLoading } = useGetUserQuery(userId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}

function TodoList() {
  const { data: todos } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  
  const handleAdd = async () => {
    await addTodo({ text: '新任务' });
  };
  
  return (
    <div>
      {todos?.map(todo => <div key={todo.id}>{todo.text}</div>)}
      <button onClick={handleAdd}>添加</button>
    </div>
  );
}
```

---

## 8. 性能优化

### Q11: Redux 性能优化的方法有哪些？

**A:**

#### **1. 使用 Reselect 创建记忆化 Selector**

```javascript
import { createSelector } from 'reselect';

// ❌ 问题：每次都重新计算
const mapStateToProps = (state) => ({
  completedTodos: state.todos.filter(todo => todo.completed)
});

// ✅ 解决：使用 reselect
const selectTodos = state => state.todos;

const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => {
    console.log('计算 completed todos');
    return todos.filter(todo => todo.completed);
  }
);

// 只有 todos 变化时才重新计算
const mapStateToProps = (state) => ({
  completedTodos: selectCompletedTodos(state)
});

// 复杂的 selector
const selectVisibleTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'completed':
        return todos.filter(t => t.completed);
      case 'active':
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  }
);
```

#### **2. 规范化 State 结构**

```javascript
// ❌ 嵌套结构：难以更新，容易导致不必要的渲染
const state = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      author: { id: 1, name: 'John' },
      comments: [
        { id: 1, text: 'Comment 1', author: { id: 2, name: 'Jane' } }
      ]
    }
  ]
};

// ✅ 规范化结构：扁平化，易于更新
const state = {
  posts: {
    byId: {
      1: { id: 1, title: 'Post 1', authorId: 1, commentIds: [1] }
    },
    allIds: [1]
  },
  users: {
    byId: {
      1: { id: 1, name: 'John' },
      2: { id: 2, name: 'Jane' }
    },
    allIds: [1, 2]
  },
  comments: {
    byId: {
      1: { id: 1, text: 'Comment 1', authorId: 2 }
    },
    allIds: [1]
  }
};

// 使用 normalizr 库
import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users');
const comment = new schema.Entity('comments', { author: user });
const post = new schema.Entity('posts', {
  author: user,
  comments: [comment]
});

const normalizedData = normalize(originalData, [post]);
```

#### **3. 使用 React.memo 和 useMemo**

```javascript
import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';

// ❌ 每次父组件渲染都会重新渲染
function TodoItem({ todo }) {
  console.log('TodoItem render');
  return <div>{todo.text}</div>;
}

// ✅ 使用 memo，props 不变不重新渲染
const TodoItem = memo(({ todo }) => {
  console.log('TodoItem render');
  return <div>{todo.text}</div>;
});

// ✅ 使用 useMemo 缓存计算结果
function TodoList() {
  const todos = useSelector(state => state.todos);
  
  const completedCount = useMemo(() => {
    console.log('计算 completed count');
    return todos.filter(t => t.completed).length;
  }, [todos]);
  
  return <div>Completed: {completedCount}</div>;
}
```

#### **4. 精确订阅 State**

```javascript
// ❌ 订阅整个 state
const mapStateToProps = (state) => ({
  state: state  // 任何变化都会导致重新渲染
});

// ✅ 只订阅需要的部分
const mapStateToProps = (state) => ({
  user: state.user,
  todos: state.todos
});

// ✅ 使用 useSelector 精确订阅
function UserProfile() {
  // 只订阅 user.name
  const userName = useSelector(state => state.user.name);
  
  return <div>{userName}</div>;
}

// ✅ 使用 shallowEqual 比较
import { shallowEqual, useSelector } from 'react-redux';

function TodoList() {
  const todos = useSelector(
    state => state.todos,
    shallowEqual  // 浅比较，避免不必要的渲染
  );
  
  return <div>{todos.length}</div>;
}
```

#### **5. 批量更新**

```javascript
import { batch } from 'react-redux';

// ❌ 多次 dispatch 导致多次渲染
function handleClick() {
  dispatch(action1());
  dispatch(action2());
  dispatch(action3());
  // 触发 3 次渲染
}

// ✅ 使用 batch 批量更新
function handleClick() {
  batch(() => {
    dispatch(action1());
    dispatch(action2());
    dispatch(action3());
  });
  // 只触发 1 次渲染
}
```

#### **6. 使用 Immer 简化不可变更新**

```javascript
// ❌ 手动保持不可变性：容易出错
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_TODO':
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updates }
          : todo
      );
    
    case 'ADD_COMMENT':
      return state.map(todo =>
        todo.id === action.payload.todoId
          ? {
              ...todo,
              comments: [...todo.comments, action.payload.comment]
            }
          : todo
      );
    
    default:
      return state;
  }
};

// ✅ 使用 Immer（RTK 内置）
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    updateTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload.id);
      if (todo) {
        Object.assign(todo, action.payload.updates);
      }
    },
    
    addComment: (state, action) => {
      const todo = state.find(t => t.id === action.payload.todoId);
      if (todo) {
        todo.comments.push(action.payload.comment);
      }
    }
  }
});
```

#### **7. 代码分割和懒加载 Reducer**

```javascript
// store.js
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // 静态 reducer
    user: userReducer
  }
});

// 动态注入 reducer
export function injectReducer(key, reducer) {
  store.replaceReducer({
    ...store.getState(),
    [key]: reducer
  });
}

// 在组件中动态加载
function TodosPage() {
  useEffect(() => {
    import('./todosSlice').then(module => {
      injectReducer('todos', module.default);
    });
  }, []);
  
  return <div>Todos</div>;
}
```

---

## 9. 手写实现

### Q12: 手写一个简易版 Redux

**A:**

```javascript
// 1. createStore
function createStore(reducer, preloadedState, enhancer) {
  // 如果有 enhancer，使用 enhancer
  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, preloadedState);
  }
  
  let currentState = preloadedState;
  let currentReducer = reducer;
  let listeners = [];
  let isDispatching = false;
  
  // 获取当前状态
  function getState() {
    if (isDispatching) {
      throw new Error('不能在 reducer 执行时调用 getState');
    }
    return currentState;
  }
  
  // 订阅状态变化
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener 必须是函数');
    }
    
    if (isDispatching) {
      throw new Error('不能在 reducer 执行时调用 subscribe');
    }
    
    listeners.push(listener);
    
    // 返回取消订阅函数
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }
  
  // 派发 action
  function dispatch(action) {
    if (typeof action.type === 'undefined') {
      throw new Error('action 必须有 type 属性');
    }
    
    if (isDispatching) {
      throw new Error('不能在 reducer 执行时调用 dispatch');
    }
    
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    
    // 通知所有监听器
    listeners.forEach(listener => listener());
    
    return action;
  }
  
  // 替换 reducer
  function replaceReducer(nextReducer) {
    currentReducer = nextReducer;
    dispatch({ type: '@@REPLACE' });
  }
  
  // 初始化 state
  dispatch({ type: '@@INIT' });
  
  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer
  };
}

// 2. combineReducers
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  
  return function combination(state = {}, action) {
    const nextState = {};
    let hasChanged = false;
    
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    
    return hasChanged ? nextState : state;
  };
}

// 3. applyMiddleware
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState);
    
    let dispatch = () => {
      throw new Error('不能在构建中间件时 dispatch');
    };
    
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };
    
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    
    return {
      ...store,
      dispatch
    };
  };
}

// 4. compose
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  
  if (funcs.length === 1) {
    return funcs[0];
  }
  
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

// 5. bindActionCreators
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return (...args) => dispatch(actionCreators(...args));
  }
  
  const boundActionCreators = {};
  
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = (...args) => dispatch(actionCreator(...args));
    }
  }
  
  return boundActionCreators;
}

// 测试
const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const store = createStore(reducer);

store.subscribe(() => {
  console.log('State:', store.getState());
});

store.dispatch({ type: 'INCREMENT' }); // State: { count: 1 }
store.dispatch({ type: 'INCREMENT' }); // State: { count: 2 }
store.dispatch({ type: 'DECREMENT' }); // State: { count: 1 }
```

---

### Q13: 手写 React-Redux 的 connect 和 Provider

**A:**

```javascript
import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. 创建 Context
const ReactReduxContext = createContext(null);

// 2. Provider 组件
export function Provider({ store, children }) {
  return (
    <ReactReduxContext.Provider value={store}>
      {children}
    </ReactReduxContext.Provider>
  );
}

// 3. connect 高阶组件
export function connect(mapStateToProps, mapDispatchToProps) {
  return function wrapWithConnect(WrappedComponent) {
    return function ConnectedComponent(props) {
      const store = useContext(ReactReduxContext);
      
      if (!store) {
        throw new Error('必须在 Provider 中使用 connect');
      }
      
      // 计算 state props
      const stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), props)
        : {};
      
      // 计算 dispatch props
      let dispatchProps = {};
      if (typeof mapDispatchToProps === 'function') {
        dispatchProps = mapDispatchToProps(store.dispatch, props);
      } else if (typeof mapDispatchToProps === 'object') {
        dispatchProps = {};
        for (const key in mapDispatchToProps) {
          const actionCreator = mapDispatchToProps[key];
          dispatchProps[key] = (...args) => store.dispatch(actionCreator(...args));
        }
      } else {
        dispatchProps = { dispatch: store.dispatch };
      }
      
      // 合并 props
      const mergedProps = {
        ...props,
        ...stateProps,
        ...dispatchProps
      };
      
      // 订阅 store 变化
      const [, forceUpdate] = useState({});
      
      useEffect(() => {
        const unsubscribe = store.subscribe(() => {
          forceUpdate({});
        });
        
        return unsubscribe;
      }, [store]);
      
      return <WrappedComponent {...mergedProps} />;
    };
  };
}

// 4. useSelector hook
export function useSelector(selector, equalityFn = Object.is) {
  const store = useContext(ReactReduxContext);
  
  if (!store) {
    throw new Error('必须在 Provider 中使用 useSelector');
  }
  
  const [selectedState, setSelectedState] = useState(() =>
    selector(store.getState())
  );
  
  useEffect(() => {
    const checkForUpdates = () => {
      const newSelectedState = selector(store.getState());
      
      if (!equalityFn(selectedState, newSelectedState)) {
        setSelectedState(newSelectedState);
      }
    };
    
    const unsubscribe = store.subscribe(checkForUpdates);
    
    // 立即检查一次
    checkForUpdates();
    
    return unsubscribe;
  }, [store, selector, equalityFn]);
  
  return selectedState;
}

// 5. useDispatch hook
export function useDispatch() {
  const store = useContext(ReactReduxContext);
  
  if (!store) {
    throw new Error('必须在 Provider 中使用 useDispatch');
  }
  
  return store.dispatch;
}

// 使用示例
import { createStore } from 'redux';

const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
};

const store = createStore(reducer);

// 使用 connect
const Counter = connect(
  (state) => ({ count: state.count }),
  (dispatch) => ({
    increment: () => dispatch({ type: 'INCREMENT' })
  })
)(({ count, increment }) => (
  <div>
    <h1>{count}</h1>
    <button onClick={increment}>+</button>
  </div>
));

// 使用 hooks
function CounterHooks() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
    </div>
  );
}

// App
function App() {
  return (
    <Provider store={store}>
      <Counter />
      <CounterHooks />
    </Provider>
  );
}
```

---

## 10. 最佳实践

### Q14: Redux 的最佳实践有哪些？

**A:**

#### **1. 文件结构**

```javascript
// ✅ 推荐：按功能组织（Ducks 模式）
src/
  features/
    todos/
      todosSlice.js      // reducer + actions
      TodoList.js        // 组件
      todosAPI.js        // API 调用
    user/
      userSlice.js
      UserProfile.js
  app/
    store.js             // store 配置
    rootReducer.js       // 根 reducer

// todosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    }
  }
});

export const { addTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

#### **2. State 设计**

```javascript
// ✅ 好的 state 设计
const state = {
  // 按领域组织
  todos: {
    byId: {},
    allIds: [],
    filter: 'all'
  },
  
  // UI 状态分离
  ui: {
    loading: false,
    error: null
  },
  
  // 规范化数据
  entities: {
    users: {},
    posts: {},
    comments: {}
  }
};

// ❌ 避免的设计
const badState = {
  // 嵌套太深
  user: {
    profile: {
      settings: {
        notifications: {
          email: true
        }
      }
    }
  },
  
  // 冗余数据
  todos: [...],
  completedTodos: [...],  // 可以从 todos 计算得出
  
  // 派生数据
  todosCount: 10  // 可以从 todos.length 得出
};
```

#### **3. Action 命名**

```javascript
// ✅ 好的命名：描述性强
const actions = {
  // 过去时态，描述发生了什么
  TODO_ADDED: 'todos/todoAdded',
  TODO_TOGGLED: 'todos/todoToggled',
  USER_LOGGED_IN: 'user/loggedIn',
  
  // 异步 action 的三个阶段
  FETCH_TODOS_PENDING: 'todos/fetchPending',
  FETCH_TODOS_FULFILLED: 'todos/fetchFulfilled',
  FETCH_TODOS_REJECTED: 'todos/fetchRejected'
};

// ❌ 避免的命名
const badActions = {
  ADD: 'ADD',  // 太模糊
  TODO: 'TODO',  // 不知道做什么
  GET_DATA: 'GET_DATA'  // 不知道获取什么数据
};
```

#### **4. Reducer 规则**

```javascript
// ✅ 好的 reducer
const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      // 1. 返回新对象
      return [...state, action.payload];
    
    case 'UPDATE_TODO':
      // 2. 不修改原 state
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updates }
          : todo
      );
    
    case 'REMOVE_TODO':
      // 3. 默认返回原 state
      return state.filter(todo => todo.id !== action.payload);
    
    default:
      return state;
  }
};

// ❌ 错误的 reducer
const badReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      // ❌ 直接修改 state
      state.push(action.payload);
      return state;
    
    case 'FETCH_TODO':
      // ❌ 副作用
      fetch('/api/todos');
      return state;
    
    case 'RANDOM':
      // ❌ 不确定的输出
      return [...state, { id: Math.random() }];
  }
};
```

#### **5. 使用 TypeScript**

```typescript
// 定义 State 类型
interface TodosState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 定义 Action 类型
type TodosAction =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'REMOVE_TODO'; payload: number };

// Reducer
const todosReducer = (
  state: TodosState = initialState,
  action: TodosAction
): TodosState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    
    default:
      return state;
  }
};

// 使用 RTK 的类型推导
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [] as Todo[],
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.push(action.payload);
    }
  }
});
```

#### **6. 测试**

```javascript
// 测试 Reducer
describe('todosReducer', () => {
  it('should handle ADD_TODO', () => {
    const initialState = [];
    const action = {
      type: 'ADD_TODO',
      payload: { id: 1, text: 'Test', completed: false }
    };
    
    const newState = todosReducer(initialState, action);
    
    expect(newState).toEqual([
      { id: 1, text: 'Test', completed: false }
    ]);
  });
});

// 测试 Action Creator
describe('addTodo', () => {
  it('should create an action to add a todo', () => {
    const text = 'Test';
    const expectedAction = {
      type: 'ADD_TODO',
      payload: { text }
    };
    
    expect(addTodo(text)).toEqual(expectedAction);
  });
});

// 测试异步 Action
describe('fetchTodos', () => {
  it('should fetch todos', async () => {
    const mockTodos = [{ id: 1, text: 'Test' }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTodos)
      })
    );
    
    const dispatch = jest.fn();
    const getState = jest.fn();
    
    await fetchTodos()(dispatch, getState);
    
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_TODOS_SUCCESS',
      payload: mockTodos
    });
  });
});
```

---

### Q15: Redux 常见错误和陷阱

**A:**

#### **1. 直接修改 State**

```javascript
// ❌ 错误
const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      state.count++;  // 直接修改
      return state;
  }
};

// ✅ 正确
const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
  }
};
```

#### **2. Reducer 中有副作用**

```javascript
// ❌ 错误
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      fetch('/api/data');  // 副作用
      return state;
    
    case 'LOG':
      console.log(state);  // 副作用
      return state;
  }
};

// ✅ 正确：副作用放在 action creator 或中间件中
const fetchData = () => {
  return async (dispatch) => {
    const data = await fetch('/api/data');
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  };
};
```

#### **3. 在 mapStateToProps 中创建新对象**

```javascript
// ❌ 错误：每次都创建新对象，导致不必要的渲染
const mapStateToProps = (state) => ({
  todos: state.todos.filter(t => t.completed)  // 每次都是新数组
});

// ✅ 正确：使用 reselect
import { createSelector } from 'reselect';

const selectCompletedTodos = createSelector(
  [state => state.todos],
  (todos) => todos.filter(t => t.completed)
);

const mapStateToProps = (state) => ({
  todos: selectCompletedTodos(state)
});
```

#### **4. 忘记处理默认情况**

```javascript
// ❌ 错误
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    // 忘记 default，未知 action 会导致 undefined
  }
};

// ✅ 正确
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
};
```

---

## 总结

### Redux 核心要点

1. **三大原则**：单一数据源、State 只读、纯函数更新
2. **数据流**：View → Action → Reducer → State → View
3. **核心概念**：Store、Action、Reducer
4. **中间件**：扩展 Redux 功能的机制
5. **异步处理**：Thunk、Saga、RTK Query
6. **性能优化**：Reselect、规范化、精确订阅
7. **现代方案**：Redux Toolkit 简化开发

### 学习建议

1. 从基础 Redux 开始，理解核心概念
2. 学习 Redux Toolkit，掌握现代最佳实践
3. 理解中间件机制，学会处理异步
4. 关注性能优化，避免常见陷阱
5. 实践项目，积累经验
