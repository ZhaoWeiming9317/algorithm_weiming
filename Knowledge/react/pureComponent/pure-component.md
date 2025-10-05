# React PureComponent 深入解析

## 1. PureComponent 基本概念

PureComponent 是 React 提供的一个优化类组件，它自动实现了 shouldComponentUpdate 方法，通过浅比较（shallow comparison）props 和 state 来决定是否需要重新渲染。

```javascript
// 普通 Component
class RegularComponent extends React.Component {
  render() {
    return <div>{this.props.value}</div>;
  }
}

// PureComponent
class OptimizedComponent extends React.PureComponent {
  render() {
    return <div>{this.props.value}</div>;
  }
}
```

## 2. 浅比较机制

### 2.1 浅比较的实现

```javascript
// React 内部的浅比较实现（简化版）
function shallowEqual(objA, objB) {
  // 1. 判断引用是否相同
  if (objA === objB) {
    return true;
  }
  
  // 2. 判断是否为对象
  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }
  
  // 3. 获取所有键
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  // 4. 比较键的数量
  if (keysA.length !== keysB.length) {
    return false;
  }
  
  // 5. 比较每个键对应的值
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
      return false;
    }
  }
  
  return true;
}
```

### 2.2 浅比较示例

```javascript
// 示例1：基本类型比较
const props1 = { value: 1, text: 'hello' };
const props2 = { value: 1, text: 'hello' };
// shallowEqual(props1, props2) === true

// 示例2：嵌套对象比较
const props3 = { user: { name: 'John' } };
const props4 = { user: { name: 'John' } };
// shallowEqual(props3, props4) === false，因为是不同的对象引用

// 示例3：数组比较
const props5 = { list: [1, 2, 3] };
const props6 = { list: [1, 2, 3] };
// shallowEqual(props5, props6) === false，因为是不同的数组引用
```

## 3. 使用场景

### 3.1 适合使用 PureComponent 的场景

```javascript
// 1. 展示组件，props 较为简单
class UserCard extends React.PureComponent {
  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>{this.props.email}</p>
      </div>
    );
  }
}

// 2. 列表项组件
class ListItem extends React.PureComponent {
  render() {
    return (
      <li>
        <span>{this.props.text}</span>
        <button onClick={this.props.onDelete}>删除</button>
      </li>
    );
  }
}
```

### 3.2 不适合使用 PureComponent 的场景

```javascript
// 1. props 包含复杂的嵌套对象
class ComplexComponent extends React.Component {  // 不用 PureComponent
  render() {
    return (
      <div>
        {this.props.data.nested.deepNested.value}
      </div>
    );
  }
}

// 2. props 包含函数
class BadPureComponent extends React.PureComponent {  // 不推荐
  render() {
    return (
      <div onClick={() => this.props.onClick()}>
        {this.props.text}
      </div>
    );
  }
}
```

## 4. 性能优化实践

### 4.1 正确的数据结构

```javascript
// 不好的实践
class BadExample extends React.PureComponent {
  updateUser() {
    const users = this.props.users;
    users.push(newUser);  // 直接修改 props
    this.setState({ users });  // PureComponent 无法检测到变化
  }
}

// 好的实践
class GoodExample extends React.PureComponent {
  updateUser() {
    const users = [...this.props.users, newUser];  // 创建新数组
    this.setState({ users });  // PureComponent 可以检测到变化
  }
}
```

### 4.2 避免不必要的对象创建

```javascript
// 不好的写法
class BadPractice extends React.PureComponent {
  render() {
    return (
      <div style={{ margin: '10px' }}>  // 每次渲染都创建新对象
        {this.props.text}
      </div>
    );
  }
}

// 好的写法
class GoodPractice extends React.PureComponent {
  styles = { margin: '10px' };  // 对象在实例上只创建一次
  
  render() {
    return (
      <div style={this.styles}>
        {this.props.text}
      </div>
    );
  }
}
```

## 5. 与 React.memo 的对比

```javascript
// PureComponent（类组件）
class PureProfileCard extends React.PureComponent {
  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>{this.props.bio}</p>
      </div>
    );
  }
}

// React.memo（函数组件）
const MemoProfileCard = React.memo(function ProfileCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.bio}</p>
    </div>
  );
});

// 自定义比较函数的 memo
const CustomMemoCard = React.memo(
  function ProfileCard(props) {
    return <div>{props.data}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id;
  }
);
```

## 6. 面试要点

1. **一句话解释 PureComponent**：
   "PureComponent 通过自动实现 shouldComponentUpdate 并对 props 和 state 进行浅比较来避免不必要的渲染，从而提升性能。"

2. **核心优势**：
   - 自动优化渲染性能
   - 减少不必要的渲染
   - 代码更简洁

3. **使用建议**：
   - 当组件的 props 和 state 结构简单时使用
   - 避免在 props 中传递复杂对象或频繁变化的函数
   - 配合不可变数据使用效果最好

4. **常见陷阱**：
   - 浅比较可能漏过深层对象的变化
   - 每次传入新的对象或函数会破坏性能优化
   - 过度使用可能导致 bug 难以排查
