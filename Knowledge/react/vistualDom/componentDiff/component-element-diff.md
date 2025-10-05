# Component Diff vs Element Diff 详解

## 1. 基本概念区分

### 1.1 Component Diff（组件差异）
处理的是 React 组件级别的比较，关注点是组件的类型和组件的生命周期。

```javascript
// 组件示例
class UserCard extends React.Component {
  render() {
    return (
      <div className="user-card">
        <img src={this.props.avatar} />
        <h2>{this.props.name}</h2>
      </div>
    );
  }
}

// 组件的使用和更新
// 旧
<UserCard name="John" avatar="old.jpg" />
// 新
<UserCard name="John" avatar="new.jpg" />
```

Component Diff 会：
1. 首先比较组件类型（是否都是 UserCard）
2. 如果类型相同：
   - 保留组件实例
   - 更新 props（avatar 从 old.jpg 变为 new.jpg）
   - 调用生命周期方法（componentWillReceiveProps 等）
3. 如果类型不同：
   - 卸载旧组件（调用 componentWillUnmount）
   - 创建新组件（调用 constructor、componentWillMount 等）

### 1.2 Element Diff（元素差异）
处理的是同层级的 DOM 元素列表的比较，主要依赖 key 来优化更新。

```javascript
// 元素列表示例
// 旧列表
<ul>
  <li key="1">First</li>
  <li key="2">Second</li>
  <li key="3">Third</li>
</ul>

// 新列表（第二项移到最后）
<ul>
  <li key="1">First</li>
  <li key="3">Third</li>
  <li key="2">Second</li>
</ul>
```

Element Diff 会：
1. 生成元素的 key-index 映射
2. 通过 key 找到可复用的节点
3. 计算最小的移动操作次数

## 2. 具体实现对比

### 2.1 Component Diff 的实现

```javascript
function diffComponent(oldComponent, newComponent, context) {
  if (oldComponent.constructor === newComponent.constructor) {
    // 同类型组件更新
    const instance = oldComponent._instance;
    
    // 更新 props
    const oldProps = oldComponent.props;
    const newProps = newComponent.props;
    
    // 生命周期调用
    if (instance.componentWillReceiveProps) {
      instance.componentWillReceiveProps(newProps);
    }
    
    // shouldComponentUpdate 判断
    if (instance.shouldComponentUpdate &&
        !instance.shouldComponentUpdate(newProps, instance.state)) {
      return;
    }
    
    // 更新组件
    instance.props = newProps;
    instance.forceUpdate();
    
  } else {
    // 不同类型组件替换
    unmountComponent(oldComponent);
    const newInstance = instantiateComponent(newComponent);
    return newInstance;
  }
}
```

### 2.2 Element Diff 的实现

```javascript
function diffElements(oldChildren, newChildren) {
  let lastIndex = 0; // 记录访问过的旧集合最大索引
  const moves = []; // 记录需要移动的节点
  
  // 构建 key-index 映射
  const oldKeyToIdx = {};
  oldChildren.forEach((child, idx) => {
    oldKeyToIdx[child.key] = idx;
  });
  
  newChildren.forEach((newChild, newIndex) => {
    const oldIndex = oldKeyToIdx[newChild.key];
    
    if (oldIndex === undefined) {
      // 新增节点
      moves.push({
        type: 'INSERT',
        index: newIndex,
        node: newChild
      });
    } else {
      // 移动节点
      if (oldIndex < lastIndex) {
        moves.push({
          type: 'MOVE',
          from: oldIndex,
          to: newIndex,
          node: newChild
        });
      }
      lastIndex = Math.max(lastIndex, oldIndex);
    }
  });
  
  // 删除旧节点
  oldChildren.forEach((child, idx) => {
    if (!newChildren.find(c => c.key === child.key)) {
      moves.push({
        type: 'REMOVE',
        index: idx
      });
    }
  });
  
  return moves;
}
```

## 3. 关键区别总结

1. **处理对象不同**：
   - Component Diff：处理组件实例
   - Element Diff：处理 DOM 元素列表

2. **比较方式不同**：
   - Component Diff：基于组件类型和生命周期
   - Element Diff：基于元素的 key 和位置

3. **优化重点不同**：
   - Component Diff：
     * 通过 shouldComponentUpdate 优化
     * 复用组件实例
     * 维护组件状态
   - Element Diff：
     * 通过 key 优化
     * 最小化 DOM 操作
     * 高效的列表更新

4. **使用场景不同**：
   - Component Diff：
     ```javascript
     // 组件更新场景
     class MyComponent extends React.Component {
       render() {
         return <div>{this.props.data}</div>;
       }
     }
     ```
   - Element Diff：
     ```javascript
     // 列表渲染场景
     function List({ items }) {
       return (
         <ul>
           {items.map(item => (
             <li key={item.id}>{item.text}</li>
           ))}
         </ul>
       );
     }
     ```

## 4. 最佳实践

1. **Component Diff 最佳实践**：
   - 合理使用 shouldComponentUpdate
   - 使用 PureComponent 或 React.memo
   - 保持组件的纯函数特性

2. **Element Diff 最佳实践**：
   - 使用稳定的 key（如 id）
   - 避免使用索引作为 key
   - 保持列表结构的稳定性

简单来说：
- Component Diff 就像是在处理"整个组件的更新和生命周期"
- Element Diff 就像是在处理"一组兄弟元素之间的顺序和存在性"
