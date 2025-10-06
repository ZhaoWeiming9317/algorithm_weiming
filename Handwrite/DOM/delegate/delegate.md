# 事件委托 (Event Delegation) 详解

## 🎯 什么是事件委托？

事件委托是一种利用**事件冒泡**机制，将事件监听器绑定到父元素上，通过冒泡来处理子元素事件的技术。

## 📝 基本语法

```javascript
delegate(element, eventType, selector, handler)
```

### 参数说明
- **`element`**: 事件委托的容器元素（父元素）
- **`eventType`**: 事件类型（如 'click', 'mouseover' 等）
- **`selector`**: 要匹配的目标元素选择器（子元素）
- **`handler`**: 事件处理函数

## 🔍 核心实现

```javascript
const delegate = (element, eventType, selector, handler) => {
  if (!element || !eventType || !selector || !handler) {
    throw new Error('Missing required parameters');
  }

  element.addEventListener(eventType, function(event) {
    let target = event.target;
    
    // 向上遍历，包括容器本身
    while (target) {
      if (target.matches(selector)) {
        handler.call(target, event);
        return;
      }
      
      // 如果到达容器，就停止
      if (target === element) {
        break;
      }
      
      target = target.parentNode;
    }
  });
};
```

## 🎪 具体例子

### HTML 结构
```html
<div id="container">
  <button class="btn">按钮1</button>
  <button class="btn">按钮2</button>
  <span class="btn">按钮3</span>
</div>
```

### JavaScript 使用
```javascript
const container = document.getElementById('container');

// 使用事件委托
delegate(container, 'click', '.btn', function(event) {
  console.log('点击了:', this.textContent);
  console.log('事件目标:', event.target);
});
```

## 🔄 执行流程

1. **事件监听**: 在 `container` 上监听 `click` 事件
2. **事件冒泡**: 当点击 `.btn` 时，事件会冒泡到 `container`
3. **事件捕获**: `container` 的事件监听器被触发
4. **目标匹配**: 检查点击的目标是否是 `.btn`
5. **执行处理**: 如果是，就执行处理函数

## 🎯 事件冒泡机制

```javascript
// 点击按钮时的冒泡路径：
button → container → body → html → document

// 委托在 container 层"拦截"事件
```

## 💡 为什么叫"委托"？

```javascript
// 传统方式：每个按钮都要绑定事件
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handler);
});

// 委托方式：只在父容器绑定一个事件
container.addEventListener('click', event => {
  if (event.target.matches('.btn')) {
    handler.call(event.target, event);
  }
});
```

## ✅ 事件委托的优势

### 1. **性能优化**
- 只需要绑定一个事件监听器
- 减少内存占用

### 2. **动态元素支持**
```javascript
// 动态添加的元素也能响应事件
const list = document.getElementById('list');

delegate(list, 'click', 'li', function(event) {
  console.log('点击了列表项:', this.textContent);
});

// 动态添加元素
const newItem = document.createElement('li');
newItem.textContent = '新项目';
list.appendChild(newItem); // 这个新元素也能响应点击！
```

### 3. **代码简洁**
- 不需要为每个子元素单独绑定事件
- 统一的事件处理逻辑

## 🔧 实际应用场景

### 1. **列表操作**
```javascript
// 删除列表项
delegate(list, 'click', '.delete-btn', function(event) {
  this.parentElement.remove();
});
```

### 2. **表格操作**
```javascript
// 表格行点击
delegate(table, 'click', 'tr', function(event) {
  console.log('点击了行:', this.cells[0].textContent);
});
```

### 3. **表单处理**
```javascript
// 表单验证
delegate(form, 'blur', 'input[required]', function(event) {
  if (!this.value) {
    this.style.borderColor = 'red';
  }
});
```

## 🎯 关键理解点

- **`element`**: 事件监听器绑定的容器（父元素）
- **`selector`**: 要匹配的目标元素选择器（子元素）
- **事件冒泡**: 子元素的事件会冒泡到父元素
- **委托原理**: 在父元素上监听，通过冒泡机制处理子元素事件

## 📚 记忆要点

```javascript
// 记忆口诀：
// element = 事件监听的容器（父元素）
// selector = 要匹配的目标（子元素）
// 通过事件冒泡，在父元素上处理子元素的事件
```

## 🚀 面试要点

1. **理解事件冒泡机制**
2. **知道性能优势**
3. **掌握动态元素处理**
4. **能够手写基本实现**
5. **了解应用场景**

## 🔍 常见问题

### Q: 为什么要用 `handler.call(target, event)`？
A: 将 `this` 绑定到实际被点击的元素，而不是容器元素。

### Q: 为什么要向上遍历DOM树？
A: 因为事件可能冒泡到嵌套的元素，需要找到真正匹配选择器的元素。

### Q: 什么时候使用事件委托？
A: 当有大量相似元素需要绑定相同事件时，或者需要处理动态添加的元素时。
