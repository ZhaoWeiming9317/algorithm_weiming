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

// ==================== 数组去重方法 ====================

/**
 * 方法1：使用 Set 去重（最简单）
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优点：代码简洁，性能好
 * 缺点：无法处理对象去重
 */
function uniqueBySet(arr) {
  return [...new Set(arr)];
}

/**
 * 方法2：使用 filter + indexOf 去重
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优点：兼容性好
 * 缺点：性能较差，时间复杂度 O(n²)
 */
function uniqueByFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

/**
 * 方法3：使用 reduce 去重
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优点：函数式编程风格
 * 缺点：性能一般
 */
function uniqueByReduce(arr) {
  return arr.reduce((acc, current) => {
    if (!acc.includes(current)) {
      acc.push(current);
    }
    return acc;
  }, []);
}

/**
 * 方法4：使用 Map 去重
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优点：性能好，可以处理对象
 * 缺点：代码稍复杂
 */
function uniqueByMap(arr) {
  const map = new Map();
  return arr.filter(item => {
    if (map.has(item)) {
      return false;
    }
    map.set(item, true);
    return true;
  });
}

/**
 * 方法5：使用对象属性去重
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优点：性能好
 * 缺点：会将数字转为字符串
 */
function uniqueByObject(arr) {
  const obj = {};
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!obj[item]) {
      obj[item] = true;
      result.push(item);
    }
  }
  
  return result;
}

/**
 * 方法6：使用 for 循环去重
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优点：性能好，逻辑清晰
 * 缺点：代码较长
 */
function uniqueByForLoop(arr) {
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    let isDuplicate = false;
    
    for (let j = 0; j < result.length; j++) {
      if (arr[i] === result[j]) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      result.push(arr[i]);
    }
  }
  
  return result;
}

/**
 * 方法7：对象数组去重（根据某个属性）
 * @param {Array} arr 要去重的对象数组
 * @param {string} key 去重的属性名
 * @returns {Array} 去重后的新数组
 * 
 * 优点：可以处理对象数组
 * 缺点：只能根据单个属性去重
 */
function uniqueByKey(arr, key) {
  const map = new Map();
  return arr.filter(item => {
    const value = item[key];
    if (map.has(value)) {
      return false;
    }
    map.set(value, true);
    return true;
  });
}

/**
 * 方法8：对象数组去重（根据多个属性）
 * @param {Array} arr 要去重的对象数组
 * @param {Array} keys 去重的属性名数组
 * @returns {Array} 去重后的新数组
 * 
 * 优点：可以根据多个属性去重
 * 缺点：代码复杂
 */
function uniqueByKeys(arr, keys) {
  const map = new Map();
  return arr.filter(item => {
    const keyStr = keys.map(key => item[key]).join('|');
    if (map.has(keyStr)) {
      return false;
    }
    map.set(keyStr, true);
    return true;
  });
}

// 测试用例
const testArray = [1, 2, 2, 3, 3, 3, 4, 5, 5];
const testObjectArray = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },
  { id: 3, name: 'Charlie' }
];

console.log('原数组:', testArray);
console.log('Set去重:', uniqueBySet(testArray));
console.log('Filter去重:', uniqueByFilter(testArray));
console.log('Reduce去重:', uniqueByReduce(testArray));
console.log('Map去重:', uniqueByMap(testArray));
console.log('Object去重:', uniqueByObject(testArray));
console.log('ForLoop去重:', uniqueByForLoop(testArray));

console.log('\n对象数组去重:');
console.log('原数组:', testObjectArray);
console.log('按id去重:', uniqueByKey(testObjectArray, 'id'));
console.log('按多个属性去重:', uniqueByKeys(testObjectArray, ['id', 'name']));