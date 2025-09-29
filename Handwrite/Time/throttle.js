/**
 * 节流函数 - 最简单的实现方式
 * 限制函数在指定时间间隔内只能执行一次
 */
function throttle(func, delay) {
  let lastTime = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastTime >= delay) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// 使用示例
const handleScroll = throttle(() => {
  console.log('页面滚动');
}, 100);

window.addEventListener('scroll', handleScroll);

// 导出
module.exports = { throttle };