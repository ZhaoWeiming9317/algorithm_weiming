# React 组件 Diff 更新流程详解

## 1. 组件类型比较

### 1.1 相同类型组件更新流程

```javascript
// 示例组件
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { updated: false };
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('1. 接收新的props');
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    console.log('2. 判断是否需要更新');
    return true;
  }
  
  componentWillUpdate(nextProps, nextState) {
    console.log('3. 即将更新');
  }
  
  render() {
    console.log('4. 渲染');
    return <div>{this.props.name}</div>;
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log('5. 更新完成');
  }
}

// 使用场景
<UserProfile name="John" />  // 首次渲染
<UserProfile name="Mike" />  // props 更新
```

更新流程详解：

```javascript
function updateComponent(prevComponent, nextComponent) {
  const instance = prevComponent.instance;
  const prevProps = prevComponent.props;
  const nextProps = nextComponent.props;
  
  // 1. 接收新的 props
  if (instance.componentWillReceiveProps) {
    instance.componentWillReceiveProps(nextProps);
    // 这里可以根据新的 props 更新 state
    // this.setState({ updated: true });
  }
  
  // 2. 判断是否需要更新
  let shouldUpdate = true;
  if (instance.shouldComponentUpdate) {
    shouldUpdate = instance.shouldComponentUpdate(
      nextProps,
      instance.state
    );
  }
  
  if (!shouldUpdate) {
    // 性能优化点：如果不需要更新，直接返回
    instance.props = nextProps;
    return;
  }
  
  // 3. 即将更新
  if (instance.componentWillUpdate) {
    instance.componentWillUpdate(nextProps, instance.state);
  }
  
  // 4. 更新 props
  instance.props = nextProps;
  
  // 5. 重新渲染
  const nextRendered = instance.render();
  
  // 6. 对比并更新 DOM
  updateDOMChildren(
    prevComponent.rendered,
    nextRendered,
    instance
  );
  
  // 7. 更新完成
  if (instance.componentDidUpdate) {
    instance.componentDidUpdate(prevProps, prevState);
  }
}
```

### 1.2 不同类型组件替换流程

```javascript
function replaceComponent(prevComponent, nextComponent) {
  const prevInstance = prevComponent.instance;
  const parentNode = prevComponent.node.parentNode;
  
  // 1. 卸载旧组件
  unmountComponent(prevComponent);
  
  // 2. 创建新组件
  const nextInstance = createComponent(nextComponent);
  
  // 3. 挂载新组件
  mountComponent(nextInstance, parentNode);
}

function unmountComponent(component) {
  const instance = component.instance;
  
  // 1. 调用卸载前钩子
  if (instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }
  
  // 2. 递归卸载子组件
  if (component.rendered) {
    unmountChildren(component.rendered);
  }
  
  // 3. 移除 DOM 节点
  if (component.node) {
    component.node.parentNode.removeChild(component.node);
  }
}

function createComponent(element) {
  // 1. 创建实例
  const instance = new element.type(element.props);
  
  // 2. 调用构造函数
  instance.constructor(instance.props);
  
  // 3. 即将挂载
  if (instance.componentWillMount) {
    instance.componentWillMount();
  }
  
  // 4. 渲染
  const rendered = instance.render();
  
  // 5. 创建 DOM
  const node = createNode(rendered);
  
  // 6. 挂载完成
  if (instance.componentDidMount) {
    instance.componentDidMount();
  }
  
  return {
    instance,
    node,
    rendered
  };
}
```

## 2. 生命周期调用顺序

### 2.1 同类型组件更新
```
Props 更新 ──→ componentWillReceiveProps
                         ↓
              shouldComponentUpdate
                         ↓
               componentWillUpdate
                         ↓
                     render
                         ↓
               componentDidUpdate
```

### 2.2 不同类型组件替换
```
旧组件 ──→ componentWillUnmount
             ↓
新组件 ──→ constructor
             ↓
        componentWillMount
             ↓
           render
             ↓
        componentDidMount
```

## 3. 性能优化点

### 3.1 shouldComponentUpdate 优化

```javascript
class OptimizedComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // 1. 简单比较
    return this.props.id !== nextProps.id;
    
    // 2. 浅比较（类似 PureComponent）
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState);
    
    // 3. 深比较（谨慎使用）
    return !deepEqual(this.props, nextProps);
  }
}
```

### 3.2 React.memo 优化（函数组件）

```javascript
const MemoComponent = React.memo(function(props) {
  return <div>{props.value}</div>;
}, (prevProps, nextProps) => {
  // 返回 true 则不更新
  return prevProps.value === nextProps.value;
});
```

## 4. 实际应用示例

### 4.1 优化列表渲染

```javascript
class UserList extends React.Component {
  shouldComponentUpdate(nextProps) {
    // 只有当列表数据真正变化时才更新
    return !shallowEqual(this.props.users, nextProps.users);
  }
  
  render() {
    return (
      <ul>
        {this.props.users.map(user => (
          <UserItem
            key={user.id}
            user={user}
            onUpdate={this.props.onUpdate}
          />
        ))}
      </ul>
    );
  }
}

// 子组件使用 memo 优化
const UserItem = React.memo(({ user, onUpdate }) => (
  <li onClick={() => onUpdate(user.id)}>
    {user.name}
  </li>
));
```

### 4.2 异步组件更新

```javascript
class AsyncComponent extends React.Component {
  state = { data: null };
  
  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      // 属性变化时加载新数据
      this.loadData(nextProps.id);
    }
  }
  
  loadData = async (id) => {
    const data = await fetchData(id);
    this.setState({ data });
  }
  
  render() {
    if (!this.state.data) return <Loading />;
    return <div>{this.state.data}</div>;
  }
}
```

## 5. 面试要点总结

1. **组件更新流程**：
   - 相同类型：复用实例，更新属性，触发生命周期
   - 不同类型：卸载旧组件，创建新组件，完整生命周期

2. **性能优化关键点**：
   - shouldComponentUpdate 是否需要更新
   - React.memo 函数组件优化
   - 合理的组件拆分

3. **实践建议**：
   - 优先使用 PureComponent 或 React.memo
   - 合理设计 props 结构
   - 避免不必要的重渲染
