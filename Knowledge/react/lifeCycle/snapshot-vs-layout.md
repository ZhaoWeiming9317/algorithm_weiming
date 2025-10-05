# getSnapshotBeforeUpdate vs useLayoutEffect

## 1. 执行时机对比

```
【类组件更新流程】
render() → getSnapshotBeforeUpdate() → DOM更新 → componentDidUpdate()

【函数组件更新流程】
render() → DOM更新 → useLayoutEffect() → useEffect()
```

## 2. 具体区别

### 2.1 getSnapshotBeforeUpdate

```javascript
class ScrollList extends React.Component {
  listRef = React.createRef();

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 1. 在 DOM 更新之前调用
    // 2. 可以获取更新前的 DOM 信息
    // 3. 返回值会传给 componentDidUpdate
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 使用 snapshot 恢复滚动位置
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>
        {this.props.list.map(item => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
    );
  }
}
```

### 2.2 useLayoutEffect

```javascript
function ScrollList({ list }) {
  const listRef = useRef();
  const prevListLength = useRef(list.length);

  useLayoutEffect(() => {
    // 1. 在 DOM 更新之后同步调用
    // 2. 可以获取更新后的 DOM 信息
    // 3. 在浏览器重绘之前执行
    if (prevListLength.current < list.length) {
      const list = listRef.current;
      const scrollHeight = list.scrollHeight;
      const scrollTop = list.scrollTop;
      
      // 直接修改 DOM
      list.scrollTop = scrollHeight - (scrollHeight - scrollTop);
    }
    prevListLength.current = list.length;
  }); // 注意：这里没有依赖数组，每次更新都执行

  return (
    <div ref={listRef}>
      {list.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
    </div>
  );
}
```

## 3. 关键差异

### 3.1 时机差异
```javascript
// getSnapshotBeforeUpdate：DOM 更新前
class SnapshotComponent extends React.Component {
  getSnapshotBeforeUpdate() {
    // 此时可以读取到更新前的 DOM
    return this.div.getBoundingClientRect();
  }
}

// useLayoutEffect：DOM 更新后，但在浏览器绘制前
function LayoutComponent() {
  useLayoutEffect(() => {
    // 此时 DOM 已更新，但用户还看不到变化
    // 适合在这里读取 DOM 布局并同步更新
  });
}
```

### 3.2 使用场景

```javascript
// 1. getSnapshotBeforeUpdate 适合：需要在更新前保存信息
class ChatThread extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    // 保存更新前的滚动位置
    if (prevProps.messages.length < this.props.messages.length) {
      return this.messageList.scrollHeight;
    }
    return null;
  }
}

// 2. useLayoutEffect 适合：需要在更新后立即测量或修改 DOM
function Tooltip() {
  const tooltipRef = useRef();
  
  useLayoutEffect(() => {
    // 测量并调整 tooltip 位置
    const { height, width } = tooltipRef.current.getBoundingClientRect();
    // 根据测量结果立即调整位置
    tooltipRef.current.style.top = `${calculateTop(height)}px`;
  });
}
```

### 3.3 性能影响

```javascript
// getSnapshotBeforeUpdate：不会导致额外的渲染
class EfficientUpdate extends React.Component {
  getSnapshotBeforeUpdate() {
    // 在提交阶段执行，不会触发重渲染
    return this.container.scrollHeight;
  }
}

// useLayoutEffect：可能导致额外的渲染
function InefficientUpdate() {
  useLayoutEffect(() => {
    // 如果在这里setState，会导致同步重渲染
    setPosition(calculatePosition());
  });
}
```

## 4. 最佳实践

### 4.1 选择指南

```javascript
// 1. 使用 getSnapshotBeforeUpdate 当：
class PreserveScroll extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    // - 需要在 DOM 更新前捕获信息
    // - 需要将信息传递给 componentDidUpdate
    // - 需要比较更新前后的值
    return this.root.scrollHeight;
  }
}

// 2. 使用 useLayoutEffect 当：
function UpdatePosition() {
  useLayoutEffect(() => {
    // - 需要在 DOM 更新后立即读取布局
    // - 需要同步更新 DOM 以防闪烁
    // - 需要在浏览器重绘前执行操作
  });
}
```

### 4.2 性能优化

```javascript
// 1. getSnapshotBeforeUpdate 优化
class OptimizedSnapshot extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    // 只在必要时返回值
    if (this.needsSnapshot(prevProps)) {
      return this.captureSnapshot();
    }
    return null;
  }
}

// 2. useLayoutEffect 优化
function OptimizedLayout() {
  useLayoutEffect(() => {
    // 使用依赖数组避免不必要的执行
    // 只在相关值变化时执行
  }, [dependency]);
}
```

## 5. 面试总结

1. **主要区别**：
   - getSnapshotBeforeUpdate：DOM 更新前获取信息
   - useLayoutEffect：DOM 更新后，浏览器绘制前执行

2. **使用场景**：
   - getSnapshotBeforeUpdate：需要更新前的 DOM 信息
   - useLayoutEffect：需要立即读取或修改更新后的 DOM

3. **优缺点**：
   - getSnapshotBeforeUpdate：不会导致额外渲染，但只能在类组件中使用
   - useLayoutEffect：更灵活，但可能影响性能

4. **选择建议**：
   - 如果只需要在 DOM 更新后执行操作，优先使用 useLayoutEffect
   - 如果需要更新前的信息，使用 getSnapshotBeforeUpdate
