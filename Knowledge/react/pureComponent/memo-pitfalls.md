# React.memo 和 PureComponent 的常见陷阱

## 1. 内联对象的问题

### 1.1 问题示例

```javascript
// 🔴 不好的写法
const BadComponent = React.memo(function(props) {
  return (
    <div style={{ color: 'red' }}>  // 每次渲染都创建新对象
      {props.text}
    </div>
  );
});

// ✅ 好的写法
const GoodComponent = React.memo(function(props) {
  const style = useMemo(() => ({ color: 'red' }), []); // 只创建一次
  // 或者直接在组件外定义
  return (
    <div style={style}>
      {props.text}
    </div>
  );
});
```

### 1.2 为什么这是个问题？

```javascript
// 假设父组件这样使用
function Parent() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      
      <BadComponent text="Hello" />  // 每次 Parent 重渲染，BadComponent 也会重渲染
    </>
  );
}
```

每次渲染时的比较过程：
```javascript
// 第一次渲染
{ style: { color: 'red' } } // 对象1

// 第二次渲染
{ style: { color: 'red' } } // 对象2

// 虽然内容相同，但是：
对象1 === 对象2  // false，因为是不同的对象引用
```

## 2. 性能影响演示

### 2.1 渲染次数比较

```javascript
// 🔴 问题代码
const InefficientList = React.memo(function({ items }) {
  console.log('InefficientList rendering');
  return (
    <div>
      {items.map(item => (
        <div 
          key={item.id}
          style={{ padding: '10px' }}  // 每个项都创建新对象
          onClick={() => console.log(item.id)}  // 每个项都创建新函数
        >
          {item.name}
        </div>
      ))}
    </div>
  );
});

// ✅ 优化代码
const EfficientList = React.memo(function({ items }) {
  console.log('EfficientList rendering');
  
  const itemStyle = useMemo(() => ({
    padding: '10px'
  }), []);
  
  const handleClick = useCallback((id) => {
    console.log(id);
  }, []);
  
  return (
    <div>
      {items.map(item => (
        <div 
          key={item.id}
          style={itemStyle}
          onClick={() => handleClick(item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

### 2.2 内存使用对比

```javascript
// 🔴 每次渲染都创建新的对象和数组
const BadDataGrid = React.memo(function({ data }) {
  return (
    <div>
      {data.map(row => ({...row}))  // 创建新对象
        .filter(row => row.active)   // 创建新数组
        .map(row => (
          <div key={row.id} style={{ margin: '5px' }}>  // 创建新样式对象
            {row.content}
          </div>
        ))}
    </div>
  );
});

// ✅ 优化后的版本
const GoodDataGrid = React.memo(function({ data }) {
  // 数据转换放在 useMemo 中
  const processedData = useMemo(() => 
    data
      .map(row => ({...row}))
      .filter(row => row.active),
    [data]  // 只在 data 变化时重新计算
  );
  
  // 样式对象提取出来
  const rowStyle = useMemo(() => ({
    margin: '5px'
  }), []);
  
  return (
    <div>
      {processedData.map(row => (
        <div key={row.id} style={rowStyle}>
          {row.content}
        </div>
      ))}
    </div>
  );
});
```

## 3. 最佳实践

### 3.1 对象和函数的处理

```javascript
const OptimizedComponent = React.memo(function({ onAction, data }) {
  // 1. 样式对象
  const styles = useMemo(() => ({
    container: { padding: '20px' },
    header: { fontSize: '18px' },
    content: { marginTop: '10px' }
  }), []);
  
  // 2. 事件处理函数
  const handleClick = useCallback(() => {
    onAction(data.id);
  }, [onAction, data.id]);
  
  // 3. 数据处理
  const processedData = useMemo(() => {
    return complexDataProcessing(data);
  }, [data]);
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={handleClick}>
          Process
        </button>
      </header>
      <div style={styles.content}>
        {processedData.map(item => (
          <span key={item.id}>{item.name}</span>
        ))}
      </div>
    </div>
  );
});
```

### 3.2 性能检测

```javascript
// 添加性能检测
const ProfilingComponent = React.memo(function(props) {
  // 开发环境下的渲染计数
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.count('Component rendered');
    }
  });
  
  // 使用 React Profiler
  return (
    <Profiler id="MyComponent" onRender={(id, phase, actualDuration) => {
      console.log(`Component ${id} took ${actualDuration}ms to render`);
    }}>
      {/* 组件内容 */}
    </Profiler>
  );
});
```

## 4. 面试总结

1. **为什么内联对象是问题**：
   - 每次渲染都创建新的引用
   - 破坏了 memo 的浅比较优化
   - 可能导致不必要的重渲染

2. **如何优化**：
   - 使用 useMemo 缓存对象
   - 使用 useCallback 缓存函数
   - 将静态对象移到组件外部

3. **性能影响**：
   - 内存使用增加（创建新对象）
   - 垃圾回收压力增大
   - 不必要的重渲染

4. **最佳实践**：
   - 提取静态值到组件外
   - 使用 hooks 缓存动态值
   - 适当使用性能检测工具
