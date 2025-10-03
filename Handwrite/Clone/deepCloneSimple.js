/**
 * 简单版深拷贝实现
 * 只处理基础类型、数组和普通对象
 * 优点：代码简单易懂，适合理解深拷贝基本原理
 * 缺点：不处理特殊类型和循环引用
 */
function deepCloneSimple(target) {
    // 处理基本类型和null
    if (target === null || typeof target !== 'object') {
        return target;
    }

    // 处理数组
    if (Array.isArray(target)) {
        return target.map(item => deepCloneSimple(item));
    }

    // 处理对象
    const clone = {};
    
    // 有以下几种方法可以遍历对象的自身属性：
    
    // 方法1：Object.keys() - 返回对象自身的可枚举属性键数组
    // - 最常用
    // - 性能好
    // - 只获取可枚举的自身属性
    Object.keys(target).forEach(key => {
        clone[key] = deepCloneSimple(target[key]);
    });
    
    // 方法2：Object.getOwnPropertyNames() - 返回对象自身的所有属性键数组（包括不可枚举属性）
    // Object.getOwnPropertyNames(target).forEach(key => {
    //     clone[key] = deepCloneSimple(target[key]);
    // });

    // 方法3：Reflect.ownKeys() - 返回对象自身的所有属性键数组（包括Symbol和不可枚举属性）
    // Reflect.ownKeys(target).forEach(key => {
    //     clone[key] = deepCloneSimple(target[key]);
    // });
    
    // 方法4：for...in + hasOwnProperty (不推荐)
    // - 需要额外的 hasOwnProperty 检查
    // - 性能较差
    // - 代码更复杂
    // for (const key in target) {
    //     if (target.hasOwnProperty(key)) {
    //         clone[key] = deepCloneSimple(target[key]);
    //     }
    // }

    return clone;
}

// 更简单的一行版本（不推荐使用，仅用于理解）
const deepCloneJSON = obj => JSON.parse(JSON.stringify(obj));

// 测试用例
function test() {
    // 0. 不同遍历方法的对比
    console.log('不同遍历方法的对比:');
    
    const obj = {
        a: 1,                    // 普通可枚举属性
        [Symbol('b')]: 2,       // Symbol属性
    };
    
    // 添加不可枚举属性
    Object.defineProperty(obj, 'c', {
        value: 3,
        enumerable: false
    });
    
    // 添加原型链属性
    obj.__proto__.d = 4;
    
    console.log('原始对象的不同属性:');
    console.log('可枚举自身属性 a:', obj.a);                    // 1
    console.log('Symbol属性 b:', obj[Symbol('b')]);            // 2
    console.log('不可枚举属性 c:', obj.c);                     // 3
    console.log('原型链上的属性 d:', obj.d);                   // 4
    
    console.log('\n各种遍历方法的结果:');
    console.log('1. Object.keys():', Object.keys(obj));                         // ['a']
    console.log('2. Object.getOwnPropertyNames():', Object.getOwnPropertyNames(obj));   // ['a', 'c']
    console.log('3. Reflect.ownKeys():', Reflect.ownKeys(obj));                // ['a', 'c', Symbol(b)]
    console.log('4. for...in:', Object.keys(obj).filter(key => obj.hasOwnProperty(key))); // ['a']
    
    // 0. hasOwnProperty 测试
    console.log('hasOwnProperty 测试:');
    
    // 创建一个构造函数
    function Person(name) {
        this.name = name;
    }
    // 在原型上添加属性
    Person.prototype.age = 18;
    
    // 创建实例
    const person = new Person('Alice');
    
    // 不使用 hasOwnProperty 的深拷贝
    function deepCloneWithoutHasOwn(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        const clone = {};
        for (const key in obj) {
            clone[key] = deepCloneWithoutHasOwn(obj[key]);
        }
        return clone;
    }
    
    // 使用 hasOwnProperty 的深拷贝（我们的实现）
    const cloneWithHasOwn = deepCloneSimple(person);
    const cloneWithoutHasOwn = deepCloneWithoutHasOwn(person);
    
    console.log('原始对象:', {
        name: person.name,           // 自身属性
        age: person.age,            // 原型链上的属性
        hasNameOwn: person.hasOwnProperty('name'),  // true
        hasAgeOwn: person.hasOwnProperty('age')     // false
    });
    
    console.log('使用 hasOwnProperty 的克隆:', {
        clone: cloneWithHasOwn,
        hasNameOwn: cloneWithHasOwn.hasOwnProperty('name'),  // true
        hasAgeOwn: cloneWithHasOwn.hasOwnProperty('age')     // false，正确！没有复制原型链上的属性
    });
    
    console.log('不使用 hasOwnProperty 的克隆:', {
        clone: cloneWithoutHasOwn,
        hasNameOwn: cloneWithoutHasOwn.hasOwnProperty('name'),  // true
        hasAgeOwn: cloneWithoutHasOwn.hasOwnProperty('age')     // true，错误！复制了原型链上的属性
    });

    // 1. 基础测试
    const obj1 = {
        a: 1,
        b: { c: 2 },
        d: [1, 2, { e: 3 }]
    };
    console.log('基础测试:', deepCloneSimple(obj1));

    // 2. 数组测试
    const arr = [1, [2, 3], { a: 4 }];
    console.log('数组测试:', deepCloneSimple(arr));

    // 3. 简单对象测试
    const obj2 = {
        name: 'test',
        info: {
            age: 18,
            address: {
                city: 'beijing'
            }
        }
    };
    console.log('嵌套对象测试:', deepCloneSimple(obj2));

    // 4. JSON方法的局限性演示
    const special = {
        func: function() { console.log('hello'); },
        date: new Date(),
        undef: undefined,
        reg: /test/g
    };
    console.log('JSON方法的局限性:');
    console.log('简单版深拷贝:', deepCloneSimple(special));
    console.log('JSON方法:', deepCloneJSON(special));
}

// test();

module.exports = {
    deepCloneSimple,
    deepCloneJSON
};
