# React Hooks 手写实现

## useInterval

在 React 中正确使用 `setInterval` 的自定义 Hook。

### 核心问题

1. **闭包陷阱**：`setInterval` 的回调函数会捕获旧的 state/props
2. **清理问题**：组件卸载时需要清除定时器
3. **delay 变化**：delay 改变时需要重新设置定时器

### 解决方案

```javascript
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 保存最新的 callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置定时器
  useEffect(() => {
    if (delay === null) return;
    
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

### 关键点

- 使用 `useRef` 保存最新的 callback，避免闭包问题
- 通过 `delay === null` 实现暂停功能
- `useEffect` 自动处理清理和重启

### 使用示例

```javascript
// 基础用法
useInterval(() => {
  setCount(count + 1);
}, 1000);

// 暂停/恢复
useInterval(() => {
  setCount(c => c + 1);
}, isRunning ? 1000 : null);

// 立即执行
useIntervalAdvanced(() => {
  fetchData();
}, 5000, { immediate: true });
```

## useRequest

处理异步请求的自定义 Hook。

### 功能

- 自动管理 loading、error、data 状态
- 支持手动触发和自动触发
- 防抖和节流
- 请求取消

详见 `useRequest.js` 和 `useRequest.example.js`
