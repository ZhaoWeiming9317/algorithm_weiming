# 为什么 Hooks 没有对应的 getSnapshotBeforeUpdate

## 1. 技术原因

### 1.1 Hooks 的设计理念
```javascript
// Hooks 的设计基于函数式编程
function Component() {
  // 1. 每次渲染都是一个新的函数执行
  // 2. 没有实例的概念
  // 3. 执行是同步的，没有中间状态
}

// 类组件的设计
class Component extends React.Component {
  // 1. 有实例
  // 2. 有明确的生命周期
  // 3. 可以在不同阶段获取信息
  getSnapshotBeforeUpdate() {
    // 可以访问更新前的 DOM
  }
}
```

### 1.2 时机问题
```javascript
function Component() {
  // 在函数组件中，没有一个明确的时机可以：
  // 1. 确保 DOM 还没更新
  // 2. 能够访问到旧的 DOM 信息
  // 3. 将信息传递给更新后的阶段

  useEffect(() => {
    // 太晚：DOM 已经更新
  });

  useLayoutEffect(() => {
    // 太晚：DOM 已经更新
  });
}
```

## 2. 架构限制

### 2.1 Fiber 架构下的更新流程
```javascript
// 类组件的更新流程
render() → getSnapshotBeforeUpdate() → DOM更新 → componentDidUpdate()

// Hooks 的更新流程
render() → DOM更新 → useLayoutEffect() → useEffect()
```

### 2.2 为什么不能实现
```javascript
// 假设有这样一个 Hook（这是不可能的）
function useSnapshotBeforeUpdate(callback) {
  // ❌ 问题1：无法确保在 DOM 更新前调用
  // ❌ 问题2：无法保证同步执行
  // ❌ 问题3：无法保证获取到正确的 DOM 状态
}

// 当前可用的最接近方案
function Component() {
  const previousValues = useRef();
  
  // 保存前一次的值
  useEffect(() => {
    previousValues.current = {
      scrollHeight: someElement.scrollHeight,
      scrollTop: someElement.scrollTop
    };
  });
  
  useLayoutEffect(() => {
    // 但这时 DOM 已经更新了
  });
}
```

## 3. 替代方案

### 3.1 使用 ref 保存信息
```javascript
function ScrollList({ items }) {
  const listRef = useRef();
  const previousValues = useRef({
    scrollHeight: 0,
    scrollTop: 0
  });

  // 在每次渲染后保存当前值
  useEffect(() => {
    const list = listRef.current;
    previousValues.current = {
      scrollHeight: list.scrollHeight,
      scrollTop: list.scrollTop
    };
  });

  // 在 DOM 更新后立即处理
  useLayoutEffect(() => {
    // 但这已经不是真正的 "before update"
  }, [items]);
}
```

### 3.2 使用自定义 Hook 封装逻辑
```javascript
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function Component() {
  const [items, setItems] = useState([]);
  const previousItems = usePrevious(items);
  
  useLayoutEffect(() => {
    // 可以比较 previousItems 和 items
    // 但仍然无法在 DOM 更新前获取信息
  }, [items]);
}
```

## 4. 最佳实践

### 4.1 需要在 DOM 更新前获取信息时
```javascript
// 推荐：使用类组件
class SnapshotComponent extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    // 这里可以安全地获取 DOM 信息
    return {
      scrollInfo: this.root.getBoundingClientRect()
    };
  }
}

// 不推荐：强行用 Hooks 模拟
function HookComponent() {
  // 会比较复杂，且不能保证时机正确
}
```

### 4.2 其他情况的处理
```javascript
function ModernComponent() {
  // 1. 如果只需要比较 props/state 变化
  const prevCount = usePrevious(count);
  
  // 2. 如果需要在 DOM 更新后立即执行
  useLayoutEffect(() => {
    // 处理 DOM 更新后的逻辑
  });
  
  // 3. 如果时机不那么重要
  useEffect(() => {
    // 普通的副作用处理
  });
}
```

## 5. 总结

1. **为什么没有对应的 Hook**：
   - 函数组件的执行模型不同
   - 没有实例和明确的生命周期
   - 无法保证在 DOM 更新前的执行时机

2. **现有方案的局限**：
   - useLayoutEffect 总是在 DOM 更新后执行
   - useEffect 更晚执行
   - 无法真正模拟 getSnapshotBeforeUpdate

3. **实践建议**：
   - 如果确实需要 DOM 更新前的信息，使用类组件
   - 其他情况可以用 useLayoutEffect + ref 组合
   - 考虑是否真的需要更新前的 DOM 信息

这个限制也反映了 React 团队的设计理念：
- Hooks 主要解决状态复用问题
- 某些特殊场景仍然适合使用类组件
- 不是所有类组件的特性都需要在 Hooks 中复制
