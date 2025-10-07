# React Diff 算法深度解析

## 1. Diff 算法的三个层面

### 1.1 Tree Diff（树层面）

Tree Diff 的核心是对树进行分层比较，两棵树只会对同一层次的节点进行比较。

#### 算法实现
```javascript
function diffTree(oldTree, newTree) {
  let patches = {};
  let index = 0;
  // 记录树的遍历索引
  walkTree(oldTree, newTree, index, patches);
  return patches;
}

function walkTree(oldNode, newNode, index, patches) {
  // 当前节点的补丁对象
  let currentPatch = [];
  
  // 节点被删除
  if (newNode === null) {
    currentPatch.push({ type: 'REMOVE', index });
  }
  // 节点为文本节点且内容改变
  else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) {
      currentPatch.push({ type: 'TEXT', text: newNode });
    }
  }
  // 节点类型相同
  else if (oldNode.type === newNode.type) {
    // 比较属性差异
    let propsPatches = diffProps(oldNode.props, newNode.props);
    if (propsPatches) {
      currentPatch.push({ type: 'PROPS', props: propsPatches });
    }
    // 递归比较子节点
    diffChildren(
      oldNode.children,
      newNode.children,
      index,
      patches,
      currentPatch
    );
  }
  // 节点类型不同
  else {
    currentPatch.push({ type: 'REPLACE', node: newNode });
  }
  
  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
}
```

#### 优化策略
1. **分层比较**：只比较同一层级，不跨层级比较
2. **类型判断**：优先判断节点类型，不同类型直接替换
3. **子节点比较**：只有同类型节点才会继续比较子节点

### 1.2 Component Diff（组件层面）

Component Diff 处理组件级别的比较，主要关注组件类型和组件属性的变化。

#### 算法实现
```javascript
function diffComponent(oldComponent, newComponent) {
  if (oldComponent.type === newComponent.type) {
    // 同类型组件，更新组件属性
    const instance = oldComponent.instance;
    const oldProps = oldComponent.props;
    const newProps = newComponent.props;
    
    // 更新 props
    updateComponentProps(instance, oldProps, newProps);
    
    // 触发组件更新
    instance.componentWillReceiveProps(newProps);
    instance.shouldComponentUpdate(newProps, instance.state);
    instance.componentWillUpdate(newProps, instance.state);
    
    // 递归对比组件内部的虚拟 DOM
    return diffTree(instance.oldVNode, instance.render());
  } else {
    // 不同类型组件，直接替换
    return {
      type: 'REPLACE_COMPONENT',
      component: newComponent
    };
  }
}

function updateComponentProps(instance, oldProps, newProps) {
  // 移除旧属性
  for (let key in oldProps) {
    if (!(key in newProps)) {
      instance.props[key] = undefined;
    }
  }
  
  // 设置新属性
  for (let key in newProps) {
    instance.props[key] = newProps[key];
  }
}
```

#### 优化策略
1. **shouldComponentUpdate**：通过生命周期函数控制是否需要更新
2. **PureComponent**：自动实现浅比较的 shouldComponentUpdate
3. **memo**：函数组件的优化方案

### 1.3 Element Diff（元素层面）

Element Diff 处理同层级子节点的比较，通过 key 来优化对比过程。

#### 算法实现
```javascript
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
  let oldChildrenMap = makeKeyIndexAndFree(oldChildren);
  let newChildrenMap = makeKeyIndexAndFree(newChildren);
  
  let moves = [];
  let children = [];
  let i = 0;
  let item;
  let key;
  
  // 遍历旧的子节点列表
  while (i < oldChildren.length) {
    item = oldChildren[i];
    key = getItemKey(item, i);
    if (newChildrenMap.keyIndex.hasOwnProperty(key)) {
      // 新旧集合中都存在的节点
      children.push(newChildren[newChildrenMap.keyIndex[key]]);
    } else {
      // 旧集合中有，新集合中没有的节点
      children.push(null);
    }
    i++;
  }
  
  // 遍历新的子节点列表
  let j = 0;
  while (j < newChildren.length) {
    item = newChildren[j];
    key = getItemKey(item, j);
    
    let oldIndex = oldChildrenMap.keyIndex[key];
    if (oldIndex === undefined) {
      // 新集合中有，旧集合中没有的节点
      children.splice(j, 0, item);
      moves.push({type: 'INSERT', index: j, item});
    }
    j++;
  }
  
  // 记录删除和移动操作
  for (let k = 0; k < children.length; k++) {
    if (children[k] === null) {
      moves.push({type: 'REMOVE', index: k});
      children.splice(k, 1);
      k--;
    }
  }
  
  return {
    moves: moves,
    children: children
  };
}

function makeKeyIndexAndFree(list) {
  let keyIndex = {};
  let free = [];
  
  for (let i = 0; i < list.length; i++) {
    let item = list[i];
    let key = getItemKey(item, i);
    if (key) {
      keyIndex[key] = i;
    } else {
      free.push(item);
    }
  }
  
  return {
    keyIndex: keyIndex,
    free: free
  };
}
```

#### 优化策略
1. **key 的使用**：通过 key 快速识别节点
2. **最小操作**：计算最小的 DOM 操作次数
3. **批量更新**：收集所有更新后一次性执行

## 2. Diff 算法的整体流程

```javascript
function diff(oldVTree, newVTree) {
  // 初始化补丁对象
  let patches = {};
  
  // 1. 先进行树级别的 diff
  walkTree(oldVTree, newVTree, 0, patches);
  
  // 2. 对于组件节点，进行组件级别的 diff
  if (isComponent(oldVTree)) {
    patches = Object.assign(patches, diffComponent(oldVTree, newVTree));
  }
  
  // 3. 对于元素节点，进行元素级别的 diff
  if (hasChildren(oldVTree)) {
    patches = Object.assign(patches, 
      diffChildren(oldVTree.children, newVTree.children));
  }
  
  return patches;
}
```

## 3. 面试总结

### 核心要点（一句话总结）：
"React 的 Diff 算法通过三个层面的优化（树层面的分层比较、组件层面的类型判断、元素层面的 key 优化）实现了 O(n) 的时间复杂度，其中 Tree Diff 避免了跨层级比较，Component Diff 通过类型判断避免了不必要的深度比较，Element Diff 通过 key 优化实现了对同层级元素的最小化操作。"

### 面试回答思路：
1. 先说明 Diff 算法的目的：优化 Virtual DOM 的比较过程
2. 介绍三个层面的优化：
   - Tree Diff：只比较同层级，不跨层级比较
   - Component Diff：同类型组件继续比较，不同类型直接替换
   - Element Diff：通过 key 优化同层级节点的比较
3. 强调性能：将 O(n³) 的复杂度优化到了 O(n)
4. 补充实践建议：合理使用 key、避免跨层级移动、保持稳定的 DOM 结构