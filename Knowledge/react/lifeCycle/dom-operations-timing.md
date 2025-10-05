# DOM 操作时机选择指南

## 1. DOM 更新前操作（getSnapshotBeforeUpdate）

### 1.1 需要保存当前 DOM 状态的场景

```javascript
// 1. 滚动位置保存
class ScrollList extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.list.length < this.props.list.length) {
      // 在新内容添加前保存当前滚动位置
      return {
        scrollTop: this.listRef.current.scrollTop,
        scrollHeight: this.listRef.current.scrollHeight
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      // 恢复滚动位置
      const newScrollTop = this.listRef.current.scrollHeight -
        snapshot.scrollHeight + snapshot.scrollTop;
      this.listRef.current.scrollTop = newScrollTop;
    }
  }
}

// 2. 选中文本保存
class TextEditor extends React.Component {
  getSnapshotBeforeUpdate() {
    // 在内容更新前保存当前选中的文本范围
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      // 恢复文本选中状态
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(snapshot);
    }
  }
}
```

### 1.2 需要比较更新前后差异的场景

```javascript
// 1. 动画过渡效果
class AnimatedList extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      // 记录更新前每个元素的位置
      return Array.from(this.listRef.current.children).map(child => ({
        height: child.offsetHeight,
        top: child.offsetTop
      }));
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      // 计算位置差异并添加动画
      const newPositions = Array.from(this.listRef.current.children);
      snapshot.forEach((oldPos, index) => {
        const newPos = newPositions[index];
        const deltaY = oldPos.top - newPos.offsetTop;
        if (deltaY) {
          // 应用动画
          requestAnimationFrame(() => {
            newPos.style.transform = `translateY(${deltaY}px)`;
            newPos.style.transition = 'none';
            requestAnimationFrame(() => {
              newPos.style.transform = '';
              newPos.style.transition = 'transform 0.3s';
            });
          });
        }
      });
    }
  }
}

// 2. 尺寸变化检测
class ResizeTracker extends React.Component {
  getSnapshotBeforeUpdate() {
    // 保存更新前的尺寸
    return {
      width: this.containerRef.current.offsetWidth,
      height: this.containerRef.current.offsetHeight
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 比较尺寸变化
    const newWidth = this.containerRef.current.offsetWidth;
    const newHeight = this.containerRef.current.offsetHeight;
    if (newWidth !== snapshot.width || newHeight !== snapshot.height) {
      this.props.onResize(newWidth, newHeight);
    }
  }
}
```

## 2. DOM 更新后操作（useLayoutEffect）

### 2.1 需要立即测量新 DOM 的场景

```javascript
// 1. 工具提示定位
function Tooltip({ content, targetRef }) {
  const tooltipRef = useRef();

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return;

    // 获取目标元素位置
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // 计算并设置工具提示位置
    tooltipRef.current.style.top = `${targetRect.bottom + 10}px`;
    tooltipRef.current.style.left = `${
      targetRect.left + (targetRect.width - tooltipRect.width) / 2
    }px`;
  }, [content]); // 内容变化时重新计算

  return <div ref={tooltipRef}>{content}</div>;
}

// 2. 自适应高度
function AutoHeight({ content }) {
  const containerRef = useRef();

  useLayoutEffect(() => {
    // 测量内容高度并设置容器高度
    const height = containerRef.current.scrollHeight;
    containerRef.current.style.height = `${height}px`;
  }, [content]); // 内容变化时重新计算
}
```

### 2.2 需要防止闪烁的场景

```javascript
// 1. 模态框居中
function Modal({ isOpen }) {
  const modalRef = useRef();

  useLayoutEffect(() => {
    if (!isOpen || !modalRef.current) return;

    // 立即计算并设置位置，防止闪烁
    const { height } = modalRef.current.getBoundingClientRect();
    modalRef.current.style.top = `${(window.innerHeight - height) / 2}px`;
  }, [isOpen]);

  return isOpen ? <div ref={modalRef}>{/* 内容 */}</div> : null;
}

// 2. 动态列表高度
function DynamicList({ items }) {
  const listRef = useRef();

  useLayoutEffect(() => {
    // 在浏览器重绘前调整高度，防止闪烁
    const totalHeight = items.reduce((height, item) => {
      const element = document.getElementById(item.id);
      return height + (element ? element.offsetHeight : 0);
    }, 0);

    listRef.current.style.height = `${totalHeight}px`;
  }, [items]);
}
```

## 3. 选择指南

### 3.1 使用 getSnapshotBeforeUpdate 当：
1. 需要在 DOM 变化前捕获信息
2. 需要保存状态用于后续恢复
3. 需要比较更新前后的 DOM 状态
4. 处理滚动位置、选中状态等需要连续性的场景

### 3.2 使用 useLayoutEffect 当：
1. 需要立即读取新 DOM 布局
2. 需要同步更新 DOM 以防止闪烁
3. 需要在视觉更新前完成计算
4. 处理定位、尺寸调整等需要即时反馈的场景

## 4. 性能考虑

```javascript
// 1. getSnapshotBeforeUpdate 性能优化
class OptimizedComponent extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    // 只在必要时获取快照
    if (this.needsSnapshot(prevProps)) {
      return this.captureSnapshot();
    }
    return null;
  }
}

// 2. useLayoutEffect 性能优化
function OptimizedComponent({ data }) {
  useLayoutEffect(() => {
    // 使用 requestAnimationFrame 延迟非关键更新
    if (needsVisualUpdate) {
      // 关键视觉更新立即执行
      updateCriticalStyles();
      
      // 非关键更新推迟到下一帧
      requestAnimationFrame(() => {
        updateNonCriticalStyles();
      });
    }
  }, [data]);
}
```

记住：
- DOM 更新前操作（getSnapshotBeforeUpdate）适合需要保存和比较的场景
- DOM 更新后操作（useLayoutEffect）适合需要立即响应的视觉更新场景
- 优先使用 useEffect，除非遇到视觉闪烁问题
