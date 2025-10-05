# Tree Diff 详细解析

## 1. Tree Diff vs Component Diff 的本质区别

### 1.1 Tree Diff（DOM 树层面）
Tree Diff 是最顶层的比较，它处理的是整个 DOM 树的结构变化。主要关注：

```javascript
// 示例1：节点位置变化
// 旧树
<div>                     
  <header>                
    <h1>Title</h1>
  </header>
  <main>
    <p>Content</p>
  </main>
</div>

// 新树
<div>                     
  <main>
    <p>Content</p>
  </main>
  <header>                
    <h1>Title</h1>
  </header>
</div>
```

在这个例子中，header 和 main 的位置发生了变化。Tree Diff 会：
1. 按层级遍历，先比较第一层的 div（相同，继续）
2. 比较第二层：发现顺序变化（header 变成了 main）
3. **重要**：不会尝试判断 header 是否移动到了其他位置，而是直接按新的结构重新创建

### 1.2 Component Diff（组件内部比较）
Component Diff 是组件级别的比较，主要处理组件的复用和更新。关注：

```javascript
// 示例2：组件属性变化
class Header extends React.Component {
  render() {
    return (
      <header className={this.props.theme}>
        <h1>{this.props.title}</h1>
      </header>
    );
  }
}

// 旧版本
<Header theme="dark" title="Old Title" />

// 新版本
<Header theme="light" title="New Title" />
```

Component Diff 会：
1. 比较组件类型（都是 Header，所以复用）
2. 更新组件的 props（theme 和 title）
3. 触发组件的生命周期方法

## 2. 为什么只做同层级比较？

### 2.1 性能考虑

```javascript
// 示例3：跨层级移动
// 旧结构
<div>
  <section>
    <header>
      <h1>Title</h1>
    </header>
  </section>
  <footer>
    <p>Footer</p>
  </footer>
</div>

// 新结构：header 移动到了 footer 内部
<div>
  <section>
  </section>
  <footer>
    <header>
      <h1>Title</h1>
    </header>
    <p>Footer</p>
  </footer>
</div>
```

如果要处理跨层级移动：
1. 需要遍历整个树找到移动的节点
2. 需要计算所有可能的移动方案
3. 时间复杂度会从 O(n) 变成 O(n³)

### 2.2 React 的解决方案

React 选择的方案是：
1. 在 section 中删除 header
2. 在 footer 中创建新的 header

```javascript
// React 的处理步骤
patches = [
  {
    type: 'REMOVE',
    path: ['div', 'section', 'header']
  },
  {
    type: 'CREATE',
    path: ['div', 'footer'],
    node: <header><h1>Title</h1></header>
  }
]
```

### 2.3 实际例子说明

```javascript
// 示例4：实际开发中的情况
// 旧结构
<div className="page">
  <Sidebar>
    <UserProfile />
    <Navigation />
  </Sidebar>
  <MainContent>
    <ArticleList />
  </MainContent>
</div>

// 新结构：想要移动 UserProfile 到 MainContent
<div className="page">
  <Sidebar>
    <Navigation />
  </Sidebar>
  <MainContent>
    <UserProfile />
    <ArticleList />
  </MainContent>
</div>

// 正确的做法是：使用状态管理
function Page() {
  const [showProfileInMain, setShowProfileInMain] = useState(false);
  
  return (
    <div className="page">
      <Sidebar>
        {!showProfileInMain && <UserProfile />}
        <Navigation />
      </Sidebar>
      <MainContent>
        {showProfileInMain && <UserProfile />}
        <ArticleList />
      </MainContent>
    </div>
  );
}
```

## 3. 总结

1. **Tree Diff**：
   - 处理整体 DOM 树的结构变化
   - 只关注节点的层级关系
   - 不处理跨层级移动
   - 采用重建而不是移动的策略

2. **Component Diff**：
   - 处理组件的内部更新
   - 关注组件的类型和属性
   - 负责组件的复用和生命周期
   - 优化组件的更新过程

3. **实践建议**：
   - 避免跨层级的 DOM 移动
   - 使用状态管理来控制组件的显示位置
   - 保持稳定的 DOM 结构
   - 如果需要经常移动，考虑使用 Portal 或状态管理
