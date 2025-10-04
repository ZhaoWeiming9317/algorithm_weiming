/**
 * 手写实现数组的 map 方法
 * @param {Function} callback 映射函数，参数为(currentValue, index, array)
 * @returns {Array} 返回新的数组
 * 
 * 注意点：
 * 1. this 指向：需要处理 map 函数的 this 指向
 * 2. 稀疏数组：map 会跳过空位但会保留
 * 3. 不会改变原数组
 */
Array.prototype.myMap = function(callback) {
  // 处理 this 为 null 或 undefined 的情况
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  // 处理 callback 不是函数的情况
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const result = [];
  for (let i = 0; i < this.length; i++) {
    // 检查索引是否存在于数组中（处理稀疏数组）
    if (i in this) {
      result[i] = callback(this[i], i, this);
    }
  }
  return result;
};

/**
 * 手写实现数组的 filter 方法
 * @param {Function} callback 过滤函数，参数为(currentValue, index, array)
 * @returns {Array} 返回过滤后的新数组
 * 
 * 注意点：
 * 1. 空值处理：需要处理 null 和 undefined
 * 2. 稀疏数组：filter 会跳过空位
 * 3. 真值判断：callback 返回真值才会保留
 */
Array.prototype.myFilter = function(callback) {
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

/**
 * 手写实现数组的 reduce 方法
 * @param {Function} callback 归并函数，参数为(accumulator, currentValue, index, array)
 * @param {*} initialValue 初始值
 * @returns {*} 返回最终的累积值
 * 
 * 注意点：
 * 1. 初始值处理：需要区分有无初始值的情况
 * 2. 空数组处理：需要处理空数组且无初始值的错误情况
 * 3. 稀疏数组：reduce 会跳过空位
 */
Array.prototype.myReduce = function(callback, initialValue) {
  if (this == null) {
    throw new TypeError('this is null or not defined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  const length = this.length;
  let accumulator = initialValue;
  let startIndex = 0;

  // 处理没有初始值的情况
  if (initialValue === undefined) {
    // 找到第一个非空位的值作为初始值
    while (startIndex < length && !(startIndex in this)) {
      startIndex++;
    }
    if (startIndex >= length) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = this[startIndex++];
  }

  for (let i = startIndex; i < length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }
  return accumulator;
};

/**
 * 手写实现数组的 flat 方法
 * @param {number} depth 扁平化深度，默认为1
 * @returns {Array} 返回扁平化后的新数组
 * 
 * 注意点：
 * 1. 深度控制：需要准确控制扁平化深度
 * 2. 类型判断：需要判断元素是否为数组
 * 3. 空值处理：需要处理 null 和 undefined
 */
Array.prototype.myFlat = function(depth = 1) {
  if (depth < 0) return this;
  
  const result = [];
  const stack = [...this.map(item => ([item, depth]))];
  
  while (stack.length > 0) {
    const [item, currentDepth] = stack.pop();
    
    if (Array.isArray(item) && currentDepth > 0) {
      stack.push(...item.map(subItem => ([subItem, currentDepth - 1])));
    } else {
      result.unshift(item);
    }
  }
  
  return result;
};