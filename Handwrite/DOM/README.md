# DOM 操作工具实现

## 核心功能

### 1. 事件委托（delegate）

实现要点：
- 利用事件冒泡机制
- 匹配目标元素
- 正确的 this 绑定
- 性能优化

常见错误：
- 忘记检查目标元素
- this 绑定错误
- 事件对象处理不当
- 选择器匹配问题

### 2. DOM 遍历

#### 深度优先遍历
特点：
- 递归实现
- 先子后兄
- 完整的节点访问

#### 广度优先遍历
特点：
- 队列实现
- 按层次访问
- 兄弟节点优先

常见错误：
- 递归栈溢出
- 节点类型判断
- 遍历顺序错误
- 内存管理问题

### 3. 样式操作

实现要点：
- 浏览器兼容性
- 计算样式获取
- 样式值标准化
- 性能考虑

常见错误：
- 未处理兼容性
- 样式值单位问题
- 未考虑性能
- 缓存策略缺失

### 4. 元素位置和关系

实现要点：
- 视口判断
- 祖先元素查找
- 位置计算
- 滚动处理

常见错误：
- 坐标计算错误
- 滚动位置未考虑
- 性能优化不足
- 边界情况处理

## 性能优化

1. 事件委托
   - 减少事件监听器数量
   - 利用事件冒泡
   - 避免频繁绑定/解绑

2. DOM 遍历
   - 缓存 DOM 查询结果
   - 使用文档片段
   - 批量操作 DOM

3. 样式操作
   - 缓存计算样式
   - 避免强制重排
   - 使用 CSS 类替代内联样式

4. 位置计算
   - 缓存位置信息
   - 使用 requestAnimationFrame
   - 节流/防抖处理

## 进阶实现

1. 虚拟列表
```javascript
class VirtualList {
  constructor(container, items, itemHeight) {
    // 实现虚拟滚动列表
  }
}
```

2. 元素拖拽
```javascript
const makeDraggable = element => {
  // 实现元素拖拽功能
};
```

3. 无限滚动
```javascript
const infiniteScroll = (container, loadMore) => {
  // 实现无限滚动
};
```

## 测试用例

```javascript
// 事件委托测试
delegate(document.body, 'click', '.button', e => {
  console.log('Button clicked:', e.target);
});

// DOM 遍历测试
traverseDOM(document.body, node => {
  console.log(node.nodeName);
});

// 视口检查测试
const element = document.querySelector('.target');
console.log('Is in viewport:', isInViewport(element));
```

## 应用场景

1. 列表优化
   - 长列表渲染
   - 表格性能优化
   - 树形结构展示

2. 页面交互
   - 拖拽功能
   - 滚动加载
   - 弹窗定位

3. 性能优化
   - 事件处理优化
   - DOM 操作优化
   - 渲染性能提升

4. 布局处理
   - 响应式布局
   - 动态尺寸计算
   - 位置调整

## 浏览器兼容性

1. 事件处理
   - addEventListener vs attachEvent
   - event.target vs event.srcElement
   - matches 方法兼容

2. 样式操作
   - getComputedStyle vs currentStyle
   - 前缀处理
   - 单位转换

3. DOM 操作
   - children vs childNodes
   - classList 兼容
   - dataset 支持

4. 位置计算
   - getBoundingClientRect 兼容
   - pageOffset vs scrollLeft
   - viewport 尺寸获取
