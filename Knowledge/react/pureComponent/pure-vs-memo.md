# PureComponent vs React.memo 深度对比

## 1. 基本概念对比

### 1.1 使用方式

```javascript
// PureComponent - 类组件
class ProfileCard extends React.PureComponent {
  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>{this.props.bio}</p>
      </div>
    );
  }
}

// React.memo - 函数组件
const ProfileCard = React.memo(function(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.bio}</p>
    </div>
  );
});
```

### 1.2 比较范围

```javascript
// PureComponent 比较 props 和 state
class UserProfile extends React.PureComponent {
  state = { count: 0 };
  
  render() {
    // 会比较 this.props 和 this.state
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>Clicks: {this.state.count}</p>
      </div>
    );
  }
}

// React.memo 只比较 props
const UserProfile = React.memo(function(props) {
  const [count, setCount] = useState(0);
  // 只比较 props，不比较 count 状态
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Clicks: {count}</p>
    </div>
  );
});
```

## 2. 自定义比较逻辑

### 2.1 PureComponent - 需要继承

```javascript
class CustomPureComponent extends React.PureComponent {
  // 需要重写整个 shouldComponentUpdate
  shouldComponentUpdate(nextProps, nextState) {
    // 自定义比较逻辑
    return (
      this.props.id !== nextProps.id ||
      this.state.value !== nextState.value
    );
  }
}
```

### 2.2 React.memo - 更灵活

```javascript
const MemoComponent = React.memo(
  function Component(props) {
    return <div>{props.value}</div>;
  },
  // 自定义比较函数，返回 true 则不重新渲染
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
  }
);
```

## 3. 性能优化场景

### 3.1 PureComponent 最佳实践

```javascript
// 1. 有状态组件的优化
class DataTable extends React.PureComponent {
  state = {
    sortedData: [],
    filters: {}
  };
  
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.sortData();
    }
  }
  
  sortData() {
    // 处理数据排序
    this.setState({
      sortedData: [...this.props.data].sort()
    });
  }
  
  render() {
    return (
      <table>
        {this.state.sortedData.map(item => (
          <tr key={item.id}>{/* ... */}</tr>
        ))}
      </table>
    );
  }
}

// 2. 复杂生命周期的优化
class ComplexComponent extends React.PureComponent {
  componentDidMount() {
    this.initializeData();
  }
  
  componentWillUnmount() {
    this.cleanup();
  }
}
```

### 3.2 React.memo 最佳实践

```javascript
// 1. 简单展示组件
const DisplayCard = React.memo(function(props) {
  return <div>{props.text}</div>;
});

// 2. 带有 hooks 的组件
const DataList = React.memo(function(props) {
  const [filter, setFilter] = useState("");
  
  // useMemo 配合使用
  const filteredData = useMemo(() => {
    return props.items.filter(item => 
      item.name.includes(filter)
    );
  }, [props.items, filter]);
  
  return (
    <>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <ul>
        {filteredData.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  );
});

// 3. 事件处理优化
const ButtonWithCallback = React.memo(function(props) {
  // 使用 useCallback 优化事件处理函数
  const handleClick = useCallback(() => {
    props.onClick(props.id);
  }, [props.id, props.onClick]);
  
  return <button onClick={handleClick}>{props.text}</button>;
});
```

## 4. 关键区别总结

### 4.1 使用场景对比

| 特性 | PureComponent | React.memo |
|------|--------------|------------|
| 组件类型 | 类组件 | 函数组件 |
| 比较范围 | props 和 state | 只比较 props |
| 自定义比较 | 需要继承重写 | 直接传入比较函数 |
| Hooks支持 | 不支持 | 完全支持 |

### 4.2 选择建议

1. **使用 PureComponent 当：**
   - 需要使用类组件
   - 需要同时比较 props 和 state
   - 需要使用生命周期方法

2. **使用 React.memo 当：**
   - 使用函数组件
   - 只需要比较 props
   - 需要使用 Hooks
   - 需要自定义比较逻辑

## 5. 性能陷阱

### 5.1 共同的陷阱

```javascript
// 1. 每次渲染创建新对象/数组
const Bad = React.memo(function(props) {
  return <div style={{ color: 'red' }}>  // 不好
    {props.items.map(item => (/* ... */))}
  </div>;
});

const Good = React.memo(function(props) {
  const style = useMemo(() => ({ color: 'red' }), []);  // 好
  return <div style={style}>
    {props.items.map(item => (/* ... */))}
  </div>;
});

// 2. 内联函数
class BadPure extends React.PureComponent {
  render() {
    return <button onClick={() => this.props.onClick()}>  // 不好
      Click
    </button>;
  }
}

const GoodMemo = React.memo(function(props) {
  const handleClick = useCallback(props.onClick, [props.onClick]);  // 好
  return <button onClick={handleClick}>Click</button>;
});
```

### 5.2 特定陷阱

```javascript
// PureComponent 特有：state 更新问题
class BadCounter extends React.PureComponent {
  state = { count: 0 };
  
  increment() {
    // 直接修改 state，PureComponent 可能检测不到变化
    this.state.count++;
  }
}

class GoodCounter extends React.PureComponent {
  state = { count: 0 };
  
  increment() {
    // 正确的 state 更新方式
    this.setState(state => ({ count: state.count + 1 }));
  }
}

// React.memo 特有：hooks 依赖问题
const BadMemo = React.memo(function(props) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // 缺少依赖项，可能导致更新问题
    setCount(count + 1);
  }, []); // 警告：依赖项数组中缺少 'count'
});

const GoodMemo = React.memo(function(props) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // 正确的依赖项设置
    setCount(c => c + 1);
  }, []); // 正确：使用函数式更新，不需要依赖 count
});
```

## 6. 面试总结

一句话区别：
"PureComponent 是针对类组件的优化方案，会同时比较 props 和 state；而 React.memo 是针对函数组件的优化方案，只比较 props，并且支持自定义比较函数和 Hooks。"

核心优势：
1. PureComponent：完整的生命周期控制，state 和 props 的自动优化
2. React.memo：更灵活的比较控制，更好的 Hooks 集成，更简洁的API

使用建议：
1. 新项目优先使用 React.memo + Hooks
2. 维护老项目时 PureComponent 仍然有其价值
3. 根据组件的复杂度和需求选择合适的方案
