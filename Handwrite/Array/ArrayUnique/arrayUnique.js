/**
 * 数组去重方法集合
 * 包含多种去重实现方式，适用于不同场景
 */

// ==================== 基础去重方法 ====================

/**
 * 方法1：使用 Set 去重（推荐⭐⭐⭐⭐⭐）
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 代码最简洁，一行搞定
 * - 性能最好，时间复杂度 O(n)
 * - ES6 原生支持，现代浏览器兼容性好
 * - 自动处理 NaN 去重
 * 
 * 劣势：
 * - 无法处理对象去重（对象引用不同）
 * - IE 不支持（需要 polyfill）
 * 
 * 为什么不能处理对象去重？
 * Set 使用严格相等（===）来判断元素是否相同
 * 对于对象，即使内容相同，但引用不同，Set 认为它们是不同的
 * 
 * 示例：
 * const obj1 = { id: 1, name: 'Alice' };
 * const obj2 = { id: 1, name: 'Alice' };
 * const obj3 = obj1;
 * 
 * console.log(obj1 === obj2);  // false - 不同引用
 * console.log(obj1 === obj3);  // true  - 相同引用
 * 
 * const arr = [obj1, obj2, obj3];
 * console.log([...new Set(arr)]);  // [obj1, obj2] - 只去掉了 obj3
 * 
 * 适用场景：基础类型数组去重（数字、字符串、布尔值）
 */
function uniqueBySet(arr) {
  return [...new Set(arr)];
}

/**
 * 方法2：使用 Map 去重（推荐⭐⭐⭐⭐）
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 性能好，时间复杂度 O(n)
 * - 可以处理对象去重
 * - 保持元素顺序
 * - 可以处理各种数据类型
 * 
 * 劣势：
 * - 代码稍复杂
 * - IE 不支持（需要 polyfill）
 * 
 * 适用场景：需要处理对象或混合类型数组
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
 * 方法3：使用对象属性去重（推荐⭐⭐⭐）
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 性能好，时间复杂度 O(n)
 * - 兼容性好，支持所有浏览器
 * - 代码相对简单
 * 
 * 劣势：
 * - 会将数字转为字符串作为 key
 * - 无法处理对象（会转为 [object Object]）
 * - 无法处理 undefined、null 等特殊值
 * 
 * 适用场景：纯数字或字符串数组，需要兼容老浏览器
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
 * 方法4：使用 filter + indexOf 去重（不推荐⭐⭐）
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 兼容性最好，支持所有浏览器
 * - 代码简洁易懂
 * - 不改变原数组
 * 
 * 劣势：
 * - 性能最差，时间复杂度 O(n²)
 * - 对于大数组会很慢
 * 
 * 适用场景：小数组，对性能要求不高，需要兼容老浏览器
 */
function uniqueByFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

/**
 * 方法5：使用 reduce 去重（不推荐⭐⭐）
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 函数式编程风格
 * - 不改变原数组
 * - 逻辑清晰
 * 
 * 劣势：
 * - 性能一般，时间复杂度 O(n²)
 * - 代码相对复杂
 * 
 * 适用场景：函数式编程爱好者，小数组
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
 * 方法6：使用 for 循环去重（不推荐⭐）
 * @param {Array} arr 要去重的数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 兼容性最好
 * - 逻辑最清晰
 * - 可以自定义去重逻辑
 * 
 * 劣势：
 * - 性能最差，时间复杂度 O(n²)
 * - 代码最长
 * 
 * 适用场景：需要自定义去重逻辑，教学演示
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

// ==================== 对象数组去重方法 ====================

/**
 * 方法7：对象数组按单个属性去重（推荐⭐⭐⭐⭐）
 * @param {Array} arr 要去重的对象数组
 * @param {string} key 去重的属性名
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 性能好，时间复杂度 O(n)
 * - 可以处理对象数组
 * - 保持元素顺序
 * 
 * 劣势：
 * - 只能根据单个属性去重
 * - 需要指定属性名
 * 
 * 适用场景：对象数组根据某个唯一标识去重
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
 * 方法8：对象数组按多个属性去重（推荐⭐⭐⭐）
 * @param {Array} arr 要去重的对象数组
 * @param {Array} keys 去重的属性名数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 可以根据多个属性组合去重
 * - 性能好，时间复杂度 O(n)
 * - 灵活性高
 * 
 * 劣势：
 * - 代码复杂
 * - 需要指定多个属性
 * 
 * 适用场景：需要根据多个属性组合判断唯一性
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

/**
 * 方法9：对象数组深度去重（推荐⭐⭐）
 * @param {Array} arr 要去重的对象数组
 * @returns {Array} 去重后的新数组
 * 
 * 优势：
 * - 可以处理复杂对象结构
 * - 支持嵌套对象去重
 * 
 * 劣势：
 * - 性能较差，时间复杂度 O(n²)
 * - 代码复杂
 * - 无法处理函数、Symbol 等特殊类型
 * 
 * 适用场景：复杂对象结构去重，对性能要求不高
 */
function uniqueByDeepEqual(arr) {
  return arr.filter((item, index) => {
    return arr.findIndex(other => JSON.stringify(item) === JSON.stringify(other)) === index;
  });
}

// ==================== 性能测试和对比 ====================

/**
 * 性能测试函数
 * @param {Function} fn 测试的函数
 * @param {Array} testData 测试数据
 * @param {string} name 函数名称
 */
function performanceTest(fn, testData, name) {
  const start = performance.now();
  const result = fn(testData);
  const end = performance.now();
  
  console.log(`${name}: ${(end - start).toFixed(2)}ms, 结果长度: ${result.length}`);
  return result;
}

/**
 * 运行所有去重方法的性能测试
 */
function runPerformanceTest() {
  // 生成测试数据
  const smallArray = [1, 2, 2, 3, 3, 3, 4, 5, 5];
  const largeArray = Array.from({ length: 10000 }, (_, i) => Math.floor(Math.random() * 1000));
  
  const objectArray = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 1, name: 'Alice', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
    { id: 2, name: 'Bob', age: 30 }
  ];
  
  console.log('=== 小数组性能测试 ===');
  performanceTest(uniqueBySet, smallArray, 'Set去重');
  performanceTest(uniqueByMap, smallArray, 'Map去重');
  performanceTest(uniqueByObject, smallArray, 'Object去重');
  performanceTest(uniqueByFilter, smallArray, 'Filter去重');
  performanceTest(uniqueByReduce, smallArray, 'Reduce去重');
  performanceTest(uniqueByForLoop, smallArray, 'ForLoop去重');
  
  console.log('\n=== 大数组性能测试 ===');
  performanceTest(uniqueBySet, largeArray, 'Set去重');
  performanceTest(uniqueByMap, largeArray, 'Map去重');
  performanceTest(uniqueByObject, largeArray, 'Object去重');
  performanceTest(uniqueByFilter, largeArray, 'Filter去重');
  
  console.log('\n=== 对象数组去重测试 ===');
  performanceTest(arr => uniqueByKey(arr, 'id'), objectArray, '按id去重');
  performanceTest(arr => uniqueByKeys(arr, ['id', 'name']), objectArray, '按多属性去重');
  performanceTest(uniqueByDeepEqual, objectArray, '深度去重');
}

// ==================== 使用示例和测试 ====================

// 基础类型数组测试
const testArray = [1, 2, 2, 3, 3, 3, 4, 5, 5, 'a', 'b', 'a', true, false, true];
console.log('原数组:', testArray);
console.log('Set去重:', uniqueBySet(testArray));
console.log('Map去重:', uniqueByMap(testArray));
console.log('Object去重:', uniqueByObject(testArray));

// 对象数组测试
const testObjectArray = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 1, name: 'Alice', age: 25 },
  { id: 3, name: 'Charlie', age: 35 },
  { id: 2, name: 'Bob', age: 30 }
];

console.log('\n对象数组去重:');
console.log('原数组:', testObjectArray);
console.log('按id去重:', uniqueByKey(testObjectArray, 'id'));
console.log('按多属性去重:', uniqueByKeys(testObjectArray, ['id', 'name']));

// 运行性能测试
console.log('\n=== 性能测试 ===');
runPerformanceTest();

// ==================== Set 对象去重问题演示 ====================

console.log('\n=== Set 对象去重问题演示 ===');

// 创建内容相同但引用不同的对象
const obj1 = { id: 1, name: 'Alice' };
const obj2 = { id: 1, name: 'Alice' };  // 内容相同，但引用不同
const obj3 = obj1;  // 引用相同

const objectArray = [obj1, obj2, obj3];

console.log('原对象数组:', objectArray);
console.log('obj1 === obj2:', obj1 === obj2);  // false
console.log('obj1 === obj3:', obj1 === obj3);  // true

// Set 去重结果
const setResult = uniqueBySet(objectArray);
console.log('Set去重结果:', setResult);
console.log('Set去重后长度:', setResult.length);  // 2，只去掉了 obj3

// Map 去重结果（可以处理对象）
const mapResult = uniqueByMap(objectArray);
console.log('Map去重结果:', mapResult);
console.log('Map去重后长度:', mapResult.length);  // 2，只去掉了 obj3

// 如果要按内容去重，需要使用其他方法
console.log('\n=== 按内容去重演示 ===');
const contentArray = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },  // 内容重复
  { id: 3, name: 'Charlie' }
];

console.log('按内容去重（按id）:', uniqueByKey(contentArray, 'id'));
console.log('按内容去重（按多属性）:', uniqueByKeys(contentArray, ['id', 'name']));

// ==================== 导出方法 ====================

module.exports = {
  // 基础去重方法
  uniqueBySet,        // 推荐：基础类型数组
  uniqueByMap,        // 推荐：混合类型数组
  uniqueByObject,     // 推荐：兼容性要求高
  uniqueByFilter,     // 不推荐：性能差
  uniqueByReduce,     // 不推荐：性能差
  uniqueByForLoop,    // 不推荐：性能差
  
  // 对象数组去重方法
  uniqueByKey,        // 推荐：按单个属性去重
  uniqueByKeys,       // 推荐：按多个属性去重
  uniqueByDeepEqual,  // 不推荐：性能差
  
  // 工具函数
  runPerformanceTest
};
