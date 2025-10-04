/**
 * 面试版本的深拷贝实现
 * 1. 处理循环引用
 * 2. 处理不可枚举属性
 * 3. 代码简单易记
 */
function deepClone(target, map = new WeakMap()) {
    // 1. 处理基础类型和null
    if (target === null || typeof target !== 'object') {
        return target;
    }

    // 2. 处理循环引用
    if (map.has(target)) {
        return map.get(target);
    }

    // 3. 处理数组
    if (Array.isArray(target)) {
        const clone = [];
        map.set(target, clone);
        target.forEach((item, index) => {
            clone[index] = deepClone(item, map);
        });
        return clone;
    }

    // 4. 处理对象
    const clone = {};
    map.set(target, clone);
    
    // 使用 Object.getOwnPropertyNames 处理所有属性（包括不可枚举）
    // Reflect.ownKeys(target）
    Reflect.ownKeys(target).forEach(key => {
        clone[key] = deepClone(target[key], map);
    });

    return clone;
}

function myDeepClone(target, map = new WeakMap()) {
    if (target === null || typeof target !== 'object') {
        return target;
    }

    if (map.has(target)) {
        return map.get(target);
    }

    if (Array.isArray(target)) {
        const clone = [];
        map.set(target, clone);
        target.forEach((item, idx) => {
            clone[idx] = myDeepClone(item, map);
        })
        return clone;
    }

    const clone = {};
    map.set(target, clone);
    Reflect.ownKeys(target).forEach((key) => {
        clone[key] = myDeepClone(target[key], map)
    })
    
    return clone;
}

// 测试用例
function test() {
    // 1. 基础测试
    const obj = {
        a: 1,
        b: { c: 2 },
        d: [1, 2, { e: 3 }]
    };
    console.log('基础测试:', deepClone(obj));

    // 2. 循环引用测试
    const circular = { a: 1 };
    circular.self = circular;
    console.log('循环引用测试:', deepClone(circular));

    // 3. 不可枚举属性测试
    const objWithNonEnum = {};
    Object.defineProperty(objWithNonEnum, 'hidden', {
        value: 'secret',
        enumerable: false
    });
    console.log('不可枚举属性测试:', 
        Object.getOwnPropertyNames(deepClone(objWithNonEnum))
    );
}

// test();
module.exports = deepClone;

/* 面试要点解释：

1. WeakMap处理循环引用：
   - map.set(target, clone) 记录已克隆对象
   - map.has(target) 检查是否已克隆
   - WeakMap不会造成内存泄露

2. Object.getOwnPropertyNames的好处：
   - 可以获取所有自身属性，包括不可枚举的
   - 比 Object.keys() 更全面
   - 比完整版简单，但功能够用

3. 核心逻辑：
   - 基础类型直接返回
   - 数组特殊处理
   - 对象递归克隆
   - 处理循环引用

4. 记忆技巧：
   - 基础类型 -> 直接返回
   - 循环引用 -> WeakMap
   - 数组特殊 -> Array.isArray
   - 对象属性 -> getOwnPropertyNames
*/
