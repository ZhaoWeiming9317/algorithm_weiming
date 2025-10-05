/**
 * 实现事件委托
 * 将事件监听器添加到父元素，通过事件冒泡处理子元素事件
 * 
 * @param {HTMLElement} element 父元素
 * @param {string} eventType 事件类型
 * @param {string} selector 子元素选择器
 * @param {Function} handler 事件处理函数
 */
const delegate = (element, eventType, selector, handler) => {
  if (!element || !eventType || !selector || !handler) {
    throw new Error('Missing required parameters');
  }

  element.addEventListener(eventType, event => {
    let target = event.target;

    while (target && target !== element) {
      if (target.matches(selector)) {
        // 将 this 绑定到匹配的元素，传递事件对象
        handler.call(target, event);
        return;
      }
      target = target.parentNode;
    }
  });
};

/**
 * DOM 深度优先遍历
 * 使用递归遍历 DOM 树
 * 
 * @param {Node} node 起始节点
 * @param {Function} callback 对每个节点执行的回调
 */
const traverseDOM = (node, callback) => {
  if (!node || !callback) {
    throw new Error('Missing required parameters');
  }

  // 处理当前节点
  callback(node);
  
  // 递归处理子节点
  node = node.firstChild;
  while (node) {
    traverseDOM(node, callback);
    node = node.nextSibling;
  }
};

/**
 * DOM 广度优先遍历
 * 使用队列实现层次遍历
 * 
 * @param {Node} node 起始节点
 * @param {Function} callback 对每个节点执行的回调
 */
const traverseDOMByLevel = (node, callback) => {
  if (!node || !callback) {
    throw new Error('Missing required parameters');
  }

  const queue = [node];
  while (queue.length) {
    const current = queue.shift();
    callback(current);
    
    // 将子元素加入队列
    if (current.children && current.children.length) {
      queue.push(...current.children);
    }
  }
};

/**
 * 获取元素的计算样式
 * 封装 getComputedStyle 的跨浏览器实现
 * 
 * @param {HTMLElement} element 目标元素
 * @returns {CSSStyleDeclaration} 计算后的样式对象
 */
const getStyles = element => {
  if (!element) {
    throw new Error('Element is required');
  }

  // 优先使用标准 API
  if (window.getComputedStyle) {
    return window.getComputedStyle(element);
  }
  // 兼容 IE
  return element.currentStyle;
};

/**
 * 查找最近的符合条件的祖先元素
 * 类似原生 closest 方法的实现
 * 
 * @param {HTMLElement} element 起始元素
 * @param {string} selector 选择器
 * @returns {HTMLElement|null} 找到的祖先元素或 null
 */
const closest = (element, selector) => {
  if (!element || !selector) {
    throw new Error('Missing required parameters');
  }

  // 使用原生 closest 如果可用
  if (element.closest) {
    return element.closest(selector);
  }

  // 手动实现向上查找
  while (element && !element.matches(selector)) {
    element = element.parentElement;
  }
  return element;
};

/**
 * 判断元素是否在视口中
 * 使用 getBoundingClientRect 检查元素位置
 * 
 * @param {HTMLElement} element 要检查的元素
 * @returns {boolean} 是否在视口中
 */
const isInViewport = element => {
  if (!element) {
    throw new Error('Element is required');
  }

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  );
};