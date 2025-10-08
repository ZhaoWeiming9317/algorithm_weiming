/**
 * 封装一个纯函数的catche，例如
fn是一个纯函数，
let fn2 = catche(fn)；
fn2(1)；
fn2(1)；// 第二次执行可以直接读取缓存
 */

// 方案1: 简单实现 - 使用JSON.stringify作为key
function cache(fn) {
  const cacheMap = new Map();
  
  return function(...args) {
    // 将参数序列化作为缓存的key
    const key = JSON.stringify(args);
    
    // 如果缓存中存在，直接返回
    if (cacheMap.has(key)) {
      console.log('从缓存读取');
      return cacheMap.get(key);
    }
    
    // 否则执行函数并缓存结果
    const result = fn.apply(this, args);
    cacheMap.set(key, result);
    return result;
  };
}

/**
 * 封装一个纯函数的cache，例如
fn是一个纯函数，
let fn2 = catche(fn)；
fn2(1)；
fn2(1)；// 第二次执行可以直接读取缓存
 */
function cacheFn(fn) {
  const cacheMap = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cacheMap.has(key)) {
      return cacheMap.get(key);
    }
    const result = fn.apply(this, args);
    cacheMap.set(key, result);
    return result;
  }
}

// 方案2: 优化版 - 支持单参数快速查找
function cacheOptimized(fn) {
  const cacheMap = new Map();
  
  return function(...args) {
    let key;
    
    // 单个参数且为原始类型，直接使用参数作为key
    if (args.length === 1 && (typeof args[0] !== 'object' || args[0] === null)) {
      key = args[0];
    } else {
      // 多个参数或对象参数，使用JSON.stringify
      key = JSON.stringify(args);
    }
    
    if (cacheMap.has(key)) {
      console.log('从缓存读取');
      return cacheMap.get(key);
    }
    
    const result = fn.apply(this, args);
    cacheMap.set(key, result);
    return result;
  };
}

// 方案3: 使用WeakMap支持对象参数（更高级）
function cacheAdvanced(fn) {
  const cache = new Map();
  
  return function(...args) {
    // 为多层参数构建缓存树
    let currentCache = cache;
    
    for (let i = 0; i < args.length - 1; i++) {
      if (!currentCache.has(args[i])) {
        currentCache.set(args[i], new Map());
      }
      currentCache = currentCache.get(args[i]);
    }
    
    const lastArg = args[args.length - 1] || undefined;
    
    if (currentCache.has(lastArg)) {
      console.log('从缓存读取');
      return currentCache.get(lastArg);
    }
    
    const result = fn.apply(this, args);
    currentCache.set(lastArg, result);
    return result;
  };
}

// 测试示例
console.log('=== 测试方案1 ===');
const add = (a, b) => {
  console.log('执行计算');
  return a + b;
};

const cachedAdd = cache(add);
console.log(cachedAdd(1, 2)); // 执行计算 -> 3
console.log(cachedAdd(1, 2)); // 从缓存读取 -> 3
console.log(cachedAdd(2, 3)); // 执行计算 -> 5

console.log('\n=== 测试方案2 ===');
const multiply = (a) => {
  console.log('执行乘法');
  return a * 2;
};

const cachedMultiply = cacheOptimized(multiply);
console.log(cachedMultiply(5)); // 执行乘法 -> 10
console.log(cachedMultiply(5)); // 从缓存读取 -> 10
console.log(cachedMultiply(3)); // 执行乘法 -> 6

console.log('\n=== 测试方案3 ===');
const complexFn = (a, b, c) => {
  console.log('执行复杂计算');
  return a + b + c;
};

const cachedComplexFn = cacheAdvanced(complexFn);
console.log(cachedComplexFn(1, 2, 3)); // 执行复杂计算 -> 6
console.log(cachedComplexFn(1, 2, 3)); // 从缓存读取 -> 6
console.log(cachedComplexFn(1, 2, 4)); // 执行复杂计算 -> 7