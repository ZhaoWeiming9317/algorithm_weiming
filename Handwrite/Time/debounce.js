/**
 * 防抖函数 - 最简单的实现方式
 * 延迟执行函数，在连续触发时重置计时器
 */
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay)
  }
}

/**
 * 防抖函数，加上 leading 指标
 * @param {*} func 
 * @param {*} delay 
 * @returns 
 */
function debounceLeading(func, delay) {
  let timer;
  let hasExecuted = false;
  
  return function(...args) {
    if (!hasExecuted) {
      // 第一次立即执行
      func(...args);
      hasExecuted = true;
    }
    
    clearTimeout(timer);
    timer = setTimeout(() => {
      hasExecuted = false; // 重置标志
    }, delay);
  }
}

// 使用示例
const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword);
}, 300);

// 模拟输入搜索
// input.addEventListener('input', (e) => {
//   handleSearch(e.target.value);
// });

// 导出
module.exports = { debounce };