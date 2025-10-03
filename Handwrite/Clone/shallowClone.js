/**
 * 浅拷贝实现
 * 只复制一层对象的属性
 */

function shallowClone(target) {
    // 处理 null 和基本类型
    if (target === null || typeof target !== 'object') {
        return target;
    }

    // 处理数组
    if (Array.isArray(target)) {
        return [...target];
    }

    // 处理对象
    return { ...target };
}

// 其他浅拷贝方法
const otherWays = {
    // 1. Object.assign
    useAssign: (obj) => Object.assign({}, obj),

    // 2. 展开运算符
    useSpread: (obj) => ({ ...obj }),

    // 3. Array.from (用于数组)
    useArrayFrom: (arr) => Array.from(arr),

    // 4. slice (用于数组)
    useSlice: (arr) => arr.slice(),

    // 5. concat (用于数组)
    useConcat: (arr) => [].concat(arr)
};

// 测试用例
function test() {
    // 1. 基础对象测试
    console.log('1. 基础对象测试:');
    const obj = { a: 1, b: 2, c: { d: 3 } };
    const clonedObj = shallowClone(obj);
    obj.a = 10;
    obj.c.d = 30;
    console.log('原始对象:', obj);
    console.log('克隆对象:', clonedObj);
    // c.d 会跟着改变，因为是浅拷贝

    // 2. 数组测试
    console.log('\n2. 数组测试:');
    const arr = [1, 2, { x: 3 }];
    const clonedArr = shallowClone(arr);
    arr[0] = 10;
    arr[2].x = 30;
    console.log('原始数组:', arr);
    console.log('克隆数组:', clonedArr);
    // 对象元素会跟着改变

    // 3. 其他方法对比
    console.log('\n3. 其他方法对比:');
    const testObj = { a: 1, b: { c: 2 } };
    console.log('Object.assign:', otherWays.useAssign(testObj));
    console.log('展开运算符:', otherWays.useSpread(testObj));

    const testArr = [1, 2, [3, 4]];
    console.log('Array.from:', otherWays.useArrayFrom(testArr));
    console.log('slice:', otherWays.useSlice(testArr));
    console.log('concat:', otherWays.useConcat(testArr));
}

// test();
module.exports = {
    shallowClone,
    otherWays
};
