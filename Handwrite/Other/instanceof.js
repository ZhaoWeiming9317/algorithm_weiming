/**
 * 实现 instanceof 操作符
 * instanceof 的原理是检查右边构造函数的 prototype 是否在左边对象的原型链上
 * 
 * @param {Object} obj - 要检查的对象
 * @param {Function} constructor - 构造函数
 * @returns {boolean} - 如果对象是构造函数的实例则返回true，否则返回false
 */
function myInstanceof(obj, constructor) {
    // 处理基本类型和 null
    if (obj === null || typeof obj !== 'object') {
        return false;
    }

    // 获取对象的原型
    let proto = Object.getPrototypeOf(obj);
    // 获取构造函数的原型
    const prototype = constructor.prototype;

    // 沿着原型链查找
    while (proto !== null) {
        if (proto === prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }

    return false;
}

function myInstanceof2(obj, constructor) {
    if (obj === null || typeof obj !== 'object') {
        return false;
    }

    let proto = obj.getPrototypeOf();
    let prototype = constructor.prototype;

    while (proto !== null) {
        if (proto === prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }

    return false;
}

// 测试用例
function test() {
    // 1. 基本测试
    class Animal {}
    class Dog extends Animal {}
    const dog = new Dog();

    console.log('基本测试:');
    console.log(myInstanceof(dog, Dog));        // true
    console.log(myInstanceof(dog, Animal));     // true
    console.log(myInstanceof(dog, Object));     // true
    console.log(myInstanceof(dog, Array));      // false

    // 2. 处理基本类型
    console.log('\n基本类型测试:');
    console.log(myInstanceof(42, Number));      // false
    console.log(myInstanceof('str', String));   // false
    console.log(myInstanceof(true, Boolean));   // false

    // 3. 处理 null 和 undefined
    console.log('\nnull和undefined测试:');
    console.log(myInstanceof(null, Object));    // false
    console.log(myInstanceof(undefined, Object)); // false

    // 4. 内置对象测试
    console.log('\n内置对象测试:');
    console.log(myInstanceof([], Array));       // true
    console.log(myInstanceof([], Object));      // true
    console.log(myInstanceof(/abc/, RegExp));   // true
    console.log(myInstanceof(new Date(), Date)); // true

    // 5. 复杂继承测试
    console.log('\n复杂继承测试:');
    class A {}
    class B extends A {}
    class C extends B {}
    const c = new C();
    
    console.log(myInstanceof(c, C));           // true
    console.log(myInstanceof(c, B));           // true
    console.log(myInstanceof(c, A));           // true
    console.log(myInstanceof(c, Object));      // true
}

// test();

// 对比原生 instanceof
function compareWithNative() {
    class Animal {}
    class Dog extends Animal {}
    const dog = new Dog();

    console.log('自定义实现 vs 原生 instanceof:');
    console.log(myInstanceof(dog, Dog) === (dog instanceof Dog));           // true
    console.log(myInstanceof(dog, Animal) === (dog instanceof Animal));     // true
    console.log(myInstanceof(dog, Object) === (dog instanceof Object));     // true
    console.log(myInstanceof(dog, Array) === (dog instanceof Array));       // true
    console.log(myInstanceof(null, Object) === (null instanceof Object));   // true
}

// compareWithNative();

module.exports = myInstanceof;
