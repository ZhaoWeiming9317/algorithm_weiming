/**
 * 深拷贝实现
 * 处理环形引用、特殊类型、继承关系等情况
 */

function deepClone(target, map = new WeakMap()) {
    // 处理 null 和基本类型
    if (target === null || typeof target !== 'object') {
        return target;
    }

    // 处理日期对象
    if (target instanceof Date) {
        return new Date(target);
    }

    // 处理正则对象
    if (target instanceof RegExp) {
        return new RegExp(target.source, target.flags);
    }

    // 处理 Map
    if (target instanceof Map) {
        const result = new Map();
        map.set(target, result);
        target.forEach((value, key) => {
            result.set(deepClone(key, map), deepClone(value, map));
        });
        return result;
    }

    // 处理 Set
    if (target instanceof Set) {
        const result = new Set();
        map.set(target, result);
        target.forEach(value => {
            result.add(deepClone(value, map));
        });
        return result;
    }

    // 处理函数
    if (typeof target === 'function') {
        // 处理箭头函数和普通函数
        const bodyReg = /(?<={)(.|\n)+(?=})/m;
        const paramReg = /(?<=\().+(?=\)\s+{)/;
        const funcString = target.toString();
        
        // 箭头函数
        if (target.prototype === undefined) {
            const param = paramReg.exec(funcString);
            const body = bodyReg.exec(funcString);
            if (body) {
                if (param) {
                    return new Function(...param[0].split(','), body[0]);
                } else {
                    return new Function(body[0]);
                }
            } else {
                return null;
            }
        } else {
            // 普通函数
            return new Function('return ' + funcString)();
        }
    }

    // 检查循环引用
    if (map.has(target)) {
        return map.get(target);
    }

    // 获取对象的所有属性描述符
    const descriptors = Object.getOwnPropertyDescriptors(target);
    // 创建一个新对象，保留原型链
    const clone = Object.create(Object.getPrototypeOf(target), descriptors);
    
    // 存储已克隆的对象，用于处理循环引用
    map.set(target, clone);

    // 递归克隆所有属性值
    for (const key of Reflect.ownKeys(target)) {
        clone[key] = deepClone(target[key], map);
    }

    return clone;
}

// 测试用例
function test() {
    // 1. 基础类型测试
    console.log('1. 基础类型测试:');
    console.log(deepClone(42));
    console.log(deepClone('hello'));
    console.log(deepClone(true));
    console.log(deepClone(undefined));
    console.log(deepClone(null));

    // 2. 复杂对象测试
    console.log('\n2. 复杂对象测试:');
    const obj = {
        a: 1,
        b: {
            c: 2,
            d: {
                e: 3
            }
        }
    };
    console.log(deepClone(obj));

    // 3. 数组测试
    console.log('\n3. 数组测试:');
    const arr = [1, [2, 3], { a: 4 }];
    console.log(deepClone(arr));

    // 4. 循环引用测试
    console.log('\n4. 循环引用测试:');
    const circular = { a: 1 };
    circular.self = circular;
    console.log(deepClone(circular));

    // 5. 特殊对象测试
    console.log('\n5. 特殊对象测试:');
    const special = {
        date: new Date(),
        reg: /hello/g,
        map: new Map([['key', 'value']]),
        set: new Set([1, 2, 3]),
        func: function() { console.log('hello'); }
    };
    console.log(deepClone(special));

    // 6. 继承关系测试
    console.log('\n6. 继承关系测试:');
    class Parent {
        constructor() {
            this.name = 'parent';
        }
    }
    class Child extends Parent {
        constructor() {
            super();
            this.type = 'child';
        }
    }
    const child = new Child();
    console.log(deepClone(child));

    // 7. Symbol 测试
    console.log('\n7. Symbol 测试:');
    const sym = Symbol('test');
    const objWithSymbol = {
        [sym]: 'symbol value',
        normal: 'normal value'
    };
    console.log(deepClone(objWithSymbol));
}

// test();
module.exports = deepClone;
