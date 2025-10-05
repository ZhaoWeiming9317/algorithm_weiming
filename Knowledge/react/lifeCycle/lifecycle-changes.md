# React 生命周期方法变更详解

## 1. 被废弃的生命周期方法（React 16.3）

```javascript
// 1. componentWillMount
componentWillMount() {
  // 问题：在 Fiber 中可能被多次调用
  // 常见误用：在这里发起网络请求
  this.fetchData();  // 不推荐
}

// 2. componentWillReceiveProps
componentWillReceiveProps(nextProps) {
  // 问题：可能在一次更新中被多次调用
  if (nextProps.value !== this.props.value) {
    this.setState({ value: nextProps.value });
  }
}

// 3. componentWillUpdate
componentWillUpdate(nextProps, nextState) {
  // 问题：无法处理异步渲染
  // 常见误用：直接使用 props 更新 state
  if (nextProps.list !== this.props.list) {
    this.setState({ list: nextProps.list });  // 不推荐
  }
}
```

## 2. 新增的生命周期方法

### 2.1 getDerivedStateFromProps

```javascript
// 1. 静态方法，无法访问实例
static getDerivedStateFromProps(props, state) {
  // 用途：替代 componentWillReceiveProps
  // 特点：
  // - 是静态方法，无法访问 this
  // - 必须返回一个对象或 null
  // - 在每次渲染前都会调用
  
  if (props.value !== state.controlledValue) {
    return {
      controlledValue: props.value,
      lastProp: props.value
    };
  }
  return null;
}

// 之前的写法（被废弃）
componentWillReceiveProps(nextProps) {
  if (nextProps.value !== this.props.value) {
    this.setState({
      controlledValue: nextProps.value
    });
  }
}
```

### 2.2 getSnapshotBeforeUpdate

```javascript
// 用途：在 DOM 更新之前获取信息
getSnapshotBeforeUpdate(prevProps, prevState) {
  // 特点：
  // - 在 render 之后，DOM 更新之前调用
  // - 返回值会传递给 componentDidUpdate
  // - 常用于获取更新前的 DOM 状态
  
  if (prevProps.list.length < this.props.list.length) {
    const list = this.listRef.current;
    return list.scrollHeight - list.scrollTop;
  }
  return null;
}

componentDidUpdate(prevProps, prevState, snapshot) {
  // snapshot 是 getSnapshotBeforeUpdate 的返回值
  if (snapshot !== null) {
    const list = this.listRef.current;
    list.scrollTop = list.scrollHeight - snapshot;
  }
}

// 之前的写法（被废弃）
componentWillUpdate(nextProps, nextState) {
  if (this.props.list.length < nextProps.list.length) {
    // 在这里获取 DOM 信息不可靠
    const list = this.listRef.current;
    this.scrollHeight = list.scrollHeight;
  }
}
```

## 3. 变化的原因

### 3.1 Fiber 架构的影响

```javascript
// 在 Fiber 中，render 阶段的生命周期可能被多次调用
class ProblemComponent extends React.Component {
  componentWillMount() {
    // 可能被调用多次
    this.fetchData();
  }
  
  componentWillUpdate() {
    // 可能被调用多次
    this.updateDOM();
  }
}

// 新的方案
class SolutionComponent extends React.Component {
  componentDidMount() {
    // 只会调用一次
    this.fetchData();
  }
  
  componentDidUpdate() {
    // 在 commit 阶段调用，更可靠
    this.updateDOM();
  }
}
```

### 3.2 异步渲染的考虑

```javascript
// 老的方式可能导致问题
class OldComponent extends React.Component {
  componentWillMount() {
    // 在异步渲染中，这里的调用时机不可预测
    subscribeToData();
  }
  
  componentWillReceiveProps(nextProps) {
    // 可能被打断和重新执行
    if (nextProps.id !== this.props.id) {
      fetchData(nextProps.id);
    }
  }
}

// 新的方式更安全
class NewComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // 纯函数，更可预测
    if (props.id !== state.lastId) {
      return {
        lastId: props.id,
        data: null
      };
    }
    return null;
  }
  
  componentDidUpdate(prevProps) {
    // 在这里进行副作用操作更安全
    if (this.props.id !== prevProps.id) {
      this.fetchData(this.props.id);
    }
  }
}
```

## 4. 最佳实践对比

### 4.1 数据获取

```javascript
// 不推荐的方式
class BadExample extends React.Component {
  componentWillMount() {
    this.fetchData();  // 可能导致问题
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.fetchData();  // 可能被多次调用
    }
  }
}

// 推荐的方式
class GoodExample extends React.Component {
  componentDidMount() {
    this.fetchData();  // 更可靠
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.fetchData();  // 在正确的时机调用
    }
  }
}
```

### 4.2 DOM 操作

```javascript
// 不推荐的方式
class BadDOMExample extends React.Component {
  componentWillUpdate() {
    // 在这里获取 DOM 信息不可靠
    const height = this.root.getBoundingClientRect().height;
  }
}

// 推荐的方式
class GoodDOMExample extends React.Component {
  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 在这里获取 DOM 信息更可靠
    return this.root.getBoundingClientRect().height;
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    // 使用快照中的 DOM 信息
    if (snapshot !== null) {
      // 处理 DOM 更新
    }
  }
}
```

## 5. 面试总结

### 5.1 核心变化
1. 废弃了不安全的生命周期方法
2. 引入了更可预测的静态方法
3. 提供了更可靠的 DOM 操作时机

### 5.2 设计原则
1. 更好地支持异步渲染
2. 避免生命周期方法的重复调用
3. 推荐在"提交"阶段而不是"渲染"阶段进行副作用操作

### 5.3 迁移建议
1. 使用 componentDidMount 替代 componentWillMount
2. 使用 getDerivedStateFromProps 替代 componentWillReceiveProps
3. 使用 getSnapshotBeforeUpdate 获取更新前的 DOM 信息
4. 在 componentDidUpdate 中进行副作用操作
