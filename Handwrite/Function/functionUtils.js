/**
 * 函数工具类实现
 * 包含函数式编程常用工具
 */

// 1. compose - 函数组合（从右到左执行）
const compose = (...fns) => {
    if (fns.length === 0) return arg => arg;
    if (fns.length === 1) return fns[0];
    return fns.reduce((a, b) => (...args) => a(b(...args)));
};

// 2. pipe - 函数管道（从左到右执行）
const pipe = (...fns) => {
    if (fns.length === 0) return arg => arg;
    if (fns.length === 1) return fns[0];
    return fns.reduce((a, b) => (...args) => b(a(...args)));
};

// 3. partial - 偏函数应用
const partial = (fn, ...args) => {
    return (...moreArgs) => fn(...args, ...moreArgs);
};

// 4. memoize - 带过期时间的记忆函数
const memoize = (fn, { maxAge = Infinity, maxSize = Infinity } = {}) => {
    const cache = new Map();
    const timestamps = new Map();
    
    return (...args) => {
        const key = JSON.stringify(args);
        const now = Date.now();
        
        // 检查缓存是否过期
        if (timestamps.has(key) && now - timestamps.get(key) > maxAge) {
            cache.delete(key);
            timestamps.delete(key);
        }
        
        // 检查缓存大小
        if (cache.size >= maxSize) {
            const oldestKey = timestamps.keys().next().value;
            cache.delete(oldestKey);
            timestamps.delete(oldestKey);
        }
        
        if (!cache.has(key)) {
            const result = fn(...args);
            cache.set(key, result);
            timestamps.set(key, now);
        }
        
        return cache.get(key);
    };
};

// 5. once - 只执行一次的函数
const once = (fn) => {
    let called = false;
    let result;
    
    return (...args) => {
        if (!called) {
            called = true;
            result = fn(...args);
        }
        return result;
    };
};

// 6. throttleWithOptions - 增强版节流
const throttleWithOptions = (fn, wait, options = {}) => {
    let timeout = null;
    let previous = 0;
    
    return function(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            fn.apply(this, args);
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(() => {
                previous = options.leading === false ? 0 : Date.now();
                timeout = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
};

// 7. debounceWithOptions - 增强版防抖
const debounceWithOptions = (fn, wait, options = {}) => {
    let timeout = null;
    let lastArgs = null;
    let lastThis = null;
    let result;
    
    const later = () => {
        timeout = null;
        if (lastArgs) {
            result = fn.apply(lastThis, lastArgs);
            lastArgs = lastThis = null;
        }
    };
    
    const debounced = function(...args) {
        lastArgs = args;
        lastThis = this;
        
        if (timeout) {
            clearTimeout(timeout);
        }
        
        if (options.immediate) {
            const callNow = !timeout;
            timeout = setTimeout(later, wait);
            if (callNow) {
                result = fn.apply(this, args);
            }
        } else {
            timeout = setTimeout(later, wait);
        }
        
        return result;
    };
    
    debounced.cancel = () => {
        clearTimeout(timeout);
        timeout = lastArgs = lastThis = null;
    };
    
    return debounced;
};

// 8. curry - 高级柯里化（支持占位符）
const curry = (fn, arity = fn.length) => {
    const placeholder = curry.placeholder;
    
    return function curried(...args) {
        const realArgs = args.map(arg => 
            arg === placeholder ? undefined : arg
        );
        
        const filledArgs = realArgs.slice(0, arity);
        const hasPlaceholder = filledArgs.some(arg => arg === undefined);
        
        if (!hasPlaceholder && filledArgs.length >= arity) {
            return fn.apply(this, filledArgs);
        }
        
        return curry((...moreArgs) => {
            const newArgs = filledArgs.map(arg => 
                arg === undefined ? moreArgs.shift() : arg
            ).concat(moreArgs);
            
            return fn.apply(this, newArgs);
        }, arity - filledArgs.filter(arg => arg !== undefined).length);
    };
};

curry.placeholder = Symbol('placeholder');

// 使用示例
function example() {
    // compose 示例
    const addOne = x => x + 1;
    const double = x => x * 2;
    const addOneThenDouble = compose(double, addOne);
    console.log(addOneThenDouble(2)); // 6

    // memoize 示例
    const expensiveOperation = memoize(
        n => {
            console.log('calculating');
            return n * 2;
        },
        { maxAge: 1000, maxSize: 100 }
    );

    // curry 示例
    const _ = curry.placeholder;
    const add = curry((a, b, c) => a + b + c);
    console.log(add(1)(2)(3)); // 6
    console.log(add(1, 2)(3)); // 6
    console.log(add(_, 2)(1)(3)); // 6
}
