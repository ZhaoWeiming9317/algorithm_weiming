# 为什么 Hooks 不能在 if 内部调用？

## 🤔 核心问题

**React Hooks 有一个重要规则：只能在函数组件的顶层调用，不能在循环、条件语句或嵌套函数中调用。**

## 🔍 原因分析

### 1. Hooks 依赖调用顺序

React 内部使用**链表**来存储 Hooks 的状态，每个 Hook 都有一个固定的位置。

```javascript
// ❌ 错误示例
function MyComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState(''); // 第一个 Hook
  }
  const [age, setAge] = useState(0); // 第二个 Hook
}

// ✅ 正确示例
function MyComponent({ isLoggedIn }) {
  const [name, setName] = useState(''); // 第一个 Hook
  const [age, setAge] = useState(0); // 第二个 Hook
}
```

### 2. 调用顺序变化的问题

**问题场景**：
```javascript
// 第一次渲染：isLoggedIn = true
function MyComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState(''); // Hook 1
  }
  const [age, setAge] = useState(0); // Hook 2
}

// 第二次渲染：isLoggedIn = false
function MyComponent({ isLoggedIn }) {
  // if 条件不满足，useState('') 不执行
  const [age, setAge] = useState(0); // 现在变成了 Hook 1！
}
```

**结果**：React 内部状态混乱！

## 📊 内部机制详解

### React 内部如何存储 Hooks

```javascript
// React 内部简化实现
let currentHookIndex = 0;
let hooks = [];

function useState(initialValue) {
  const hookIndex = currentHookIndex++;
  
  if (hooks[hookIndex] === undefined) {
    hooks[hookIndex] = initialValue;
  }
  
  const setState = (newValue) => {
    hooks[hookIndex] = newValue;
    // 触发重新渲染
  };
  
  return [hooks[hookIndex], setState];
}
```

### 为什么使用链表而不是 Map + key？

#### 1. 性能考虑

**链表方式**：
```javascript
// 每次调用 Hook 只需要递增索引
let currentHookIndex = 0;
function useState() {
  const index = currentHookIndex++; // O(1) 操作
  return hooks[index];
}
```

**Map + key 方式**：
```javascript
// 需要生成和管理 key
let hookKey = 0;
function useState() {
  const key = `hook_${hookKey++}`; // 字符串生成 + Map 查找
  return hooksMap.get(key); // O(1) 但比数组索引慢
}
```

**性能对比**：
- **链表**：直接数组索引访问，最快
- **Map**：需要哈希计算和查找，相对较慢

#### 2. 内存效率

**链表方式**：
```javascript
// 紧凑的数组存储
const hooks = [state1, state2, state3]; // 连续内存
```

**Map + key 方式**：
```javascript
// 需要存储 key 和 value
const hooksMap = new Map([
  ['hook_0', state1],
  ['hook_1', state2], 
  ['hook_2', state3]
]); // 额外的 key 存储开销
```

#### 3. 实现复杂度

**链表方式**：
```javascript
// 简单直接
function useState(initialValue) {
  const index = currentHookIndex++;
  if (hooks[index] === undefined) {
    hooks[index] = initialValue;
  }
  return [hooks[index], setState];
}
```

**Map + key 方式**：
```javascript
// 需要管理 key 的生成和存储
function useState(initialValue) {
  const key = generateKey(); // 需要 key 生成逻辑
  if (!hooksMap.has(key)) {
    hooksMap.set(key, initialValue);
  }
  return [hooksMap.get(key), setState];
}
```

#### 4. 调试和开发体验

**链表方式**：
```javascript
// 调试时可以看到清晰的索引
console.log(hooks); // [state1, state2, state3]
console.log('Hook at index 1:', hooks[1]); // 直接访问
```

**Map + key 方式**：
```javascript
// 调试时需要查看 key
console.log(hooksMap); // Map { 'hook_0' => state1, 'hook_1' => state2 }
console.log('Hook with key hook_1:', hooksMap.get('hook_1')); // 需要记住 key
```

#### 5. 类型安全

**链表方式**：
```javascript
// TypeScript 友好
const hooks: any[] = [];
const state = hooks[0]; // 类型推断清晰
```

**Map + key 方式**：
```javascript
// 需要额外的类型定义
const hooksMap: Map<string, any> = new Map();
const state = hooksMap.get('hook_0'); // 可能返回 undefined
```

#### 6. 实际性能测试

```javascript
// 性能测试示例
const iterations = 1000000;

// 链表方式
console.time('Array Access');
for (let i = 0; i < iterations; i++) {
  const value = hooks[i % 1000];
}
console.timeEnd('Array Access');

// Map 方式
console.time('Map Access');
for (let i = 0; i < iterations; i++) {
  const value = hooksMap.get(`hook_${i % 1000}`);
}
console.timeEnd('Map Access');

// 结果：Array Access 通常比 Map Access 快 2-3 倍
```

#### 7. 为什么不用其他数据结构？

**为什么不直接用对象？**
```javascript
// 对象方式的问题
const hooks = {};
function useState() {
  const key = `hook_${hookKey++}`;
  return hooks[key]; // 需要动态 key，不如数组索引直接
}
```

**为什么不直接用 Set？**
```javascript
// Set 只能存储值，不能存储状态和 setter 的配对
const hooks = new Set(); // 无法存储 [state, setState] 配对
```

### 链表的优势总结

1. **性能最优**：数组索引访问是最快的
2. **内存紧凑**：连续内存存储，缓存友好
3. **实现简单**：不需要复杂的 key 管理
4. **调试友好**：索引清晰，易于调试
5. **类型安全**：TypeScript 支持良好
6. **扩展性好**：可以轻松添加新的 Hook 类型

### 为什么 React 选择链表？

**核心原因**：
- **性能优先**：Hooks 调用频率很高，需要最优性能
- **简单可靠**：链表方式实现简单，不容易出错
- **内存效率**：紧凑的数组存储，减少内存开销
- **开发体验**：调试和开发时更加直观

**权衡考虑**：
- 虽然链表方式有调用顺序的限制
- 但带来的性能提升和实现简单性更重要
- 通过 ESLint 规则可以很好地避免顺序问题

### 调用顺序变化的影响

```javascript
// 第一次渲染
function Component() {
  if (true) {
    useState('A'); // Hook 0
  }
  useState('B'); // Hook 1
}
// hooks = ['A', 'B']

// 第二次渲染
function Component() {
  if (false) {
    // useState('A') 不执行
  }
  useState('B'); // 现在变成了 Hook 0！
}
// hooks = ['B', undefined] - 状态错乱！
```

## 🚫 常见的错误用法

### 1. 条件调用
```javascript
// ❌ 错误
function MyComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null);
  }
  return <div>...</div>;
}

// ✅ 正确
function MyComponent({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  
  if (isLoggedIn) {
    // 在条件内部使用 Hook 的返回值
    return <div>Welcome {user.name}</div>;
  }
  return <div>Please login</div>;
}
```

### 2. 循环调用
```javascript
// ❌ 错误
function MyComponent({ items }) {
  const states = [];
  for (let i = 0; i < items.length; i++) {
    states.push(useState(items[i])); // 错误！
  }
  return <div>...</div>;
}

// ✅ 正确
function MyComponent({ items }) {
  const [states, setStates] = useState(items);
  return <div>...</div>;
}
```

### 3. 嵌套函数调用
```javascript
// ❌ 错误
function MyComponent() {
  const handleClick = () => {
    const [count, setCount] = useState(0); // 错误！
  };
  return <button onClick={handleClick}>Click</button>;
}

// ✅ 正确
function MyComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  return <button onClick={handleClick}>Click</button>;
}
```

## ✅ 正确的解决方案

### 1. 条件渲染
```javascript
function MyComponent({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 在条件内部使用 Hook 的返回值
  if (isLoggedIn) {
    return <div>Welcome {user?.name}</div>;
  }
  
  return <div>Please login</div>;
}
```

### 2. 条件逻辑
```javascript
function MyComponent({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 使用 useEffect 处理条件逻辑
  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      fetchUser().then(user => {
        setUser(user);
        setLoading(false);
      });
    }
  }, [isLoggedIn]);
  
  return <div>...</div>;
}
```

### 3. 动态 Hook 数量
```javascript
// ❌ 错误：动态数量的 Hooks
function MyComponent({ items }) {
  const states = items.map(() => useState(0)); // 错误！
  return <div>...</div>;
}

// ✅ 正确：使用数组状态
function MyComponent({ items }) {
  const [states, setStates] = useState(items.map(() => 0));
  
  const updateItem = (index, value) => {
    setStates(prev => prev.map((item, i) => i === index ? value : item));
  };
  
  return <div>...</div>;
}
```

## 🔧 ESLint 规则

React 提供了 ESLint 规则来检测这些错误：

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 🎯 实际应用示例

### 错误示例
```javascript
function UserProfile({ userId, showDetails }) {
  // ❌ 错误：条件调用 Hook
  if (showDetails) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
  }
  
  return <div>...</div>;
}
```

### 正确示例
```javascript
function UserProfile({ userId, showDetails }) {
  // ✅ 正确：在顶层调用所有 Hooks
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (showDetails) {
      setLoading(true);
      fetchUser(userId).then(user => {
        setUser(user);
        setLoading(false);
      });
    }
  }, [userId, showDetails]);
  
  if (!showDetails) {
    return <div>Click to show details</div>;
  }
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return <div>User: {user?.name}</div>;
}
```

## 📝 总结

### 为什么不能在 if 内部调用 Hooks？

1. **调用顺序依赖**：React 使用链表存储 Hooks，依赖固定的调用顺序
2. **状态错乱**：条件变化会导致 Hook 调用顺序改变，造成状态混乱
3. **内部机制**：React 通过 Hook 索引来管理状态，顺序变化会破坏这个机制

### 核心原则

1. **始终在顶层调用**：Hooks 必须在函数组件的顶层调用
2. **保持顺序一致**：每次渲染时 Hook 的调用顺序必须相同
3. **条件使用返回值**：可以在条件内部使用 Hook 的返回值，但不能条件调用 Hook

### 最佳实践

1. **使用 ESLint 规则**：启用 `react-hooks/rules-of-hooks` 规则
2. **条件渲染**：在条件内部使用 Hook 的返回值，而不是条件调用 Hook
3. **useEffect 处理副作用**：使用 useEffect 处理条件逻辑
4. **状态设计**：合理设计状态结构，避免动态 Hook 数量

**记住**：Hooks 的调用顺序必须保持一致，这是 React Hooks 的核心约束！
