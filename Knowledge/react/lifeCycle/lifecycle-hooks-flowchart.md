# React 生命周期和 Hooks 流程图解

## 1. 类组件生命周期流程

```
【挂载阶段】
constructor()
     ↓
getDerivedStateFromProps()
     ↓
   render()
     ↓
componentDidMount()

【更新阶段】
getDerivedStateFromProps()
     ↓
shouldComponentUpdate()
     ↓
   render()
     ↓
getSnapshotBeforeUpdate()
     ↓
componentDidUpdate()

【卸载阶段】
componentWillUnmount()
```

## 2. 新旧生命周期对比

```
【React 16.3 之前】
        挂载             更新              卸载
         ↓               ↓                ↓
   constructor    componentWillReceiveProps
         ↓               ↓
componentWillMount  shouldComponentUpdate
         ↓               ↓
      render    componentWillUpdate
         ↓               ↓
componentDidMount      render     componentWillUnmount
                        ↓
                componentDidUpdate

【React 16.3 之后】
        挂载             更新              卸载
         ↓               ↓                ↓
   constructor    getDerivedStateFromProps
         ↓               ↓
getDerivedStateFromProps shouldComponentUpdate
         ↓               ↓
      render           render     componentWillUnmount
         ↓               ↓
componentDidMount getSnapshotBeforeUpdate
                        ↓
                componentDidUpdate
```

## 3. Hooks 执行流程

```
【函数组件渲染流程】

组件首次渲染
     ↓
useState (初始化)
     ↓
useEffect (依赖为空数组)
     ↓
渲染完成

组件更新时
     ↓
useState (返回新值)
     ↓
useEffect (检查依赖项)
     ↓
重新渲染

组件卸载时
     ↓
useEffect 清理函数
     ↓
组件卸载
```

## 4. 常用 Hooks 的触发时机

```
【useState】
首次渲染 → 初始化状态
     ↓
状态更新 → 触发重渲染
     ↓
组件重渲染 → 返回最新状态

【useEffect】
首次渲染后 → 执行 effect
     ↓
依赖项变化 → 清理旧 effect → 执行新 effect
     ↓
组件卸载前 → 执行清理函数

【useCallback】
首次渲染 → 创建函数
     ↓
依赖项变化 → 创建新函数
     ↓
依赖项不变 → 返回缓存的函数

【useMemo】
首次渲染 → 计算初始值
     ↓
依赖项变化 → 重新计算
     ↓
依赖项不变 → 返回缓存的值
```

## 5. 典型场景的执行顺序

### 5.1 组件挂载

```
【类组件】
1. constructor
2. getDerivedStateFromProps
3. render
4. React 更新 DOM
5. componentDidMount

【函数组件】
1. 函数组件执行
2. useState 初始化
3. 渲染
4. React 更新 DOM
5. useEffect 执行
```

### 5.2 组件更新

```
【类组件】
1. getDerivedStateFromProps
2. shouldComponentUpdate
3. render
4. getSnapshotBeforeUpdate
5. React 更新 DOM
6. componentDidUpdate

【函数组件】
1. 函数组件执行
2. useState 返回新值
3. 渲染
4. React 更新 DOM
5. useEffect 清理（如果依赖变化）
6. useEffect 执行（如果依赖变化）
```

## 6. 实际应用流程图

### 6.1 数据获取场景

```
【类组件】
componentDidMount
     ↓
发起请求
     ↓
setState 更新数据
     ↓
render 显示数据
     ↓
componentWillUnmount 清理

【Hooks】
useEffect(() => {
  发起请求
  return () => 清理
}, [])
     ↓
useState 更新数据
     ↓
重新渲染显示数据
```

### 6.2 订阅场景

```
【类组件】
componentDidMount
     ↓
添加订阅
     ↓
接收更新 → setState
     ↓
render 更新显示
     ↓
componentWillUnmount
     ↓
移除订阅

【Hooks】
useEffect(() => {
  添加订阅
  return () => 移除订阅
}, [])
     ↓
useState 更新数据
     ↓
重新渲染
```

## 7. 性能优化流程

```
【类组件】
shouldComponentUpdate
     ↓
是 → 继续更新流程
     ↓
否 → 停止更新

【Hooks】
useMemo/useCallback
     ↓
依赖项检查
     ↓
变化 → 重新计算/创建
     ↓
不变 → 使用缓存值
```

## 8. 错误处理流程

```
【类组件】
componentDidCatch
     ↓
getDerivedStateFromError
     ↓
显示错误 UI

【Hooks】
ErrorBoundary 组件（仍需使用类组件）
     ↓
try-catch 处理异步错误
```

这些流程图帮助我们理解：
1. 生命周期方法的执行顺序
2. Hooks 的调用时机
3. 不同阶段的数据流动
4. 优化和错误处理的时机

需要我详细解释某个具体的流程吗？
