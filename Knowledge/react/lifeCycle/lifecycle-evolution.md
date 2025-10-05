# React 生命周期详解

## 1. 传统生命周期（React 16.3 之前）

### 1.1 挂载阶段
```javascript
class OldComponent extends React.Component {
  // 1. 构造函数
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log('1. constructor - 组件初始化');
  }

  // 2. 组件将要挂载
  componentWillMount() {
    console.log('2. componentWillMount - 组件将要挂载');
    // 这里的 setState 会和 constructor 中的 state 合并
  }

  // 3. 渲染
  render() {
    console.log('3. render - 组件渲染');
    return <div>{this.state.count}</div>;
  }

  // 4. 组件已挂载
  componentDidMount() {
    console.log('4. componentDidMount - 组件已挂载');
    // 适合进行异步操作，如 API 调用
  }
}
```

### 1.2 更新阶段
```javascript
class OldUpdateComponent extends React.Component {
  // 1. 组件将要接收新属性
  componentWillReceiveProps(nextProps) {
    console.log('1. componentWillReceiveProps - 接收新属性');
    // 可以根据 props 的变化设置 state
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  // 2. 是否应该更新
  shouldComponentUpdate(nextProps, nextState) {
    console.log('2. shouldComponentUpdate - 是否应该更新');
    // 返回 false 可以阻止更新
    return true;
  }

  // 3. 组件将要更新
  componentWillUpdate(nextProps, nextState) {
    console.log('3. componentWillUpdate - 组件将要更新');
    // 注意：这里不能调用 setState
  }

  // 4. 渲染
  render() {
    console.log('4. render - 重新渲染');
    return <div>{this.props.value}</div>;
  }

  // 5. 组件已更新
  componentDidUpdate(prevProps, prevState) {
    console.log('5. componentDidUpdate - 组件已更新');
    // 可以进行 DOM 操作或网络请求
  }
}
```

### 1.3 卸载阶段
```javascript
componentWillUnmount() {
  console.log('componentWillUnmount - 组件将要卸载');
  // 清理工作：取消订阅、清除定时器等
}
```

## 2. 废弃的生命周期方法

### 2.1 被废弃的方法
1. componentWillMount
2. componentWillReceiveProps
3. componentWillUpdate

### 2.2 废弃原因
1. **Fiber 架构的影响**：
   ```javascript
   // 在 Fiber 中，render 阶段的生命周期可能被多次调用
   componentWillMount() {
     // 这里的代码可能被调用多次
     this.setState({ data: 'example' });
     // 可能导致意外的副作用
   }
   ```

2. **异步渲染的问题**：
   ```javascript
   componentWillReceiveProps(nextProps) {
     // 在异步渲染中，props 的更新可能被打断或重新开始
     // 导致这里的逻辑多次执行
     this.setState({ value: nextProps.value });
   }
   ```

3. **不安全的操作**：
   ```javascript
   componentWillUpdate() {
     // 这里可能访问到还未更新的 DOM
     const currentWidth = this.div.getBoundingClientRect().width;
     // 基于过时数据做决策可能导致问题
   }
   ```

## 3. 新的生命周期方法（React 16.3+）

### 3.1 新增的方法

```javascript
class ModernComponent extends React.Component {
  // 1. 从 props 派生 state
  static getDerivedStateFromProps(props, state) {
    console.log('1. getDerivedStateFromProps');
    // 返回对象更新 state，返回 null 不更新
    if (props.value !== state.value) {
      return { value: props.value };
    }
    return null;
  }

  // 2. 获取更新前的快照
  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('2. getSnapshotBeforeUpdate');
    // 返回值会传递给 componentDidUpdate
    return { scrollPosition: this.listRef.scrollHeight };
  }

  // 3. 组件更新后，使用快照
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('3. componentDidUpdate with snapshot:', snapshot);
    // 使用快照值进行 DOM 操作
    if (snapshot !== null) {
      this.listRef.scrollTop = 
        this.listRef.scrollHeight - snapshot.scrollPosition;
    }
  }
}
```

### 3.2 新方法的优势

1. **getDerivedStateFromProps**：
   ```javascript
   // 旧方式：不安全且可能多次调用
   componentWillReceiveProps(nextProps) {
     if (nextProps.value !== this.props.value) {
       this.setState({ value: nextProps.value });
     }
   }

   // 新方式：纯函数，更可预测
   static getDerivedStateFromProps(props, state) {
     if (props.value !== state.value) {
       return { value: props.value };
     }
     return null;
   }
   ```

2. **getSnapshotBeforeUpdate**：
   ```javascript
   class ScrollingList extends React.Component {
     // 获取更新前的滚动位置
     getSnapshotBeforeUpdate(prevProps, prevState) {
       if (prevProps.list.length < this.props.list.length) {
         return this.listRef.scrollHeight;
       }
       return null;
     }

     componentDidUpdate(prevProps, prevState, snapshot) {
       // 使用快照保持滚动位置
       if (snapshot !== null) {
         this.listRef.scrollTop += 
           this.listRef.scrollHeight - snapshot;
       }
     }
   }
   ```

## 4. 完整的现代生命周期流程

### 4.1 挂载流程
```javascript
class ModernMountFlow extends React.Component {
  constructor(props) {
    super(props);
    console.log('1. Constructor');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps');
    return null;
  }

  render() {
    console.log('3. Render');
    return <div>Modern Component</div>;
  }

  componentDidMount() {
    console.log('4. ComponentDidMount');
  }
}
```

### 4.2 更新流程
```javascript
class ModernUpdateFlow extends React.Component {
  static getDerivedStateFromProps(props, state) {
    console.log('1. getDerivedStateFromProps');
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('2. shouldComponentUpdate');
    return true;
  }

  render() {
    console.log('3. render');
    return <div>Updated Component</div>;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('4. getSnapshotBeforeUpdate');
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('5. componentDidUpdate');
  }
}
```

## 5. 最佳实践

### 5.1 常见用例

```javascript
class BestPracticeComponent extends React.Component {
  constructor(props) {
    super(props);
    // 1. 初始化 state
    this.state = {
      data: [],
      loading: true
    };
  }

  static getDerivedStateFromProps(props, state) {
    // 2. 仅在极少数情况下使用
    if (props.selectedId !== state.selectedId) {
      return {
        selectedId: props.selectedId,
        data: null
      };
    }
    return null;
  }

  componentDidMount() {
    // 3. 发起网络请求
    this.fetchData();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 4. 保存更新前的重要信息
    if (prevProps.list.length < this.props.list.length) {
      return this.listRef.scrollHeight;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 5. 处理更新后的操作
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
    if (snapshot !== null) {
      // 处理滚动位置
    }
  }

  componentWillUnmount() {
    // 6. 清理工作
    this.clearSubscriptions();
  }
}
```

### 5.2 避免的模式

```javascript
// 🔴 避免这样做
class AntiPatternComponent extends React.Component {
  constructor(props) {
    super(props);
    // 避免在构造函数中发起请求
    this.fetchData(); // 错误
  }

  static getDerivedStateFromProps(props, state) {
    // 避免在这里发起副作用
    fetch(props.url); // 错误
    return null;
  }

  componentDidUpdate() {
    // 避免无条件更新
    this.setState({ updated: true }); // 错误：可能导致无限循环
  }
}

// ✅ 正确的做法
class CorrectPatternComponent extends React.Component {
  componentDidMount() {
    // 正确：在挂载后发起请求
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // 正确：有条件地更新
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }
}
```

## 6. 面试总结

### 6.1 核心要点
1. 生命周期的演变：
   - 16.3 之前：完整但有安全隐患
   - 16.3 之后：更安全、更可预测

2. 废弃原因：
   - Fiber 架构的需求
   - 异步渲染的支持
   - 更好的性能和可预测性

3. 新方法的优势：
   - 纯函数设计
   - 更好的可测试性
   - 更安全的更新流程

### 6.2 实践建议
1. 优先使用新的生命周期方法
2. 合理使用 getDerivedStateFromProps
3. 在正确的生命周期中处理副作用
4. 注意性能优化和内存泄漏
