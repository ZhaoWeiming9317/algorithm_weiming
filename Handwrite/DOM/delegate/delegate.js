/**
 * 事件委托实现 - 面试背诵版本
 * 利用事件冒泡机制，在父元素上监听子元素的事件
 */

/**
 * 事件委托函数
 * @param {Element} element - 事件委托的容器元素（父元素）
 * @param {string} eventType - 事件类型
 * @param {string} selector - 要匹配的目标元素选择器
 * @param {Function} handler - 事件处理函数
 */
function delegate(element, eventType, selector, handler) {
  // 参数验证
  if (!element || !eventType || !selector || !handler) {
    throw new Error('Missing required parameters');
  }

  // 在容器元素上绑定事件监听器
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
}

/**
 * 移除事件委托
 * @param {Element} element - 容器元素
 * @param {string} eventType - 事件类型
 * @param {string} selector - 选择器
 * @param {Function} handler - 处理函数
 */
function undelegate(element, eventType, selector, handler) {
  // 注意：由于事件委托的特性，移除委托比较复杂
  // 通常建议给事件处理函数添加标识，或者在特定条件下不执行
  console.warn('undelegate is complex, consider using event delegation conditionally');
}

// 测试用例
function testDelegate() {
  console.log('=== 事件委托测试 ===');
  
  // 创建测试HTML
  const container = document.createElement('div');
  container.id = 'test-container';
  container.innerHTML = `
    <button class="btn">按钮1</button>
    <button class="btn">按钮2</button>
    <span class="btn">按钮3</span>
    <div class="nested">
      <button class="btn">嵌套按钮</button>
    </div>
  `;
  
  // 使用事件委托
  delegate(container, 'click', '.btn', function(event) {
    console.log('点击了:', this.textContent);
    console.log('事件目标:', event.target);
    console.log('this指向:', this);
  });
  
  // 动态添加元素测试
  setTimeout(() => {
    const newBtn = document.createElement('button');
    newBtn.className = 'btn';
    newBtn.textContent = '动态按钮';
    container.appendChild(newBtn);
    console.log('动态添加了按钮，点击测试');
  }, 2000);
  
  // 添加到页面进行测试
  document.body.appendChild(container);
}

// 导出函数
export { delegate, undelegate, testDelegate };

// 背诵要点：
// 1. 在父元素上绑定事件监听器
// 2. 利用事件冒泡机制
// 3. 向上遍历DOM树寻找匹配元素
// 4. 使用 handler.call(target, event) 绑定正确的this
// 5. 支持动态添加的元素
