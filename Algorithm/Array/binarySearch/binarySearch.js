/**
 * 二分查找
 * 可以参考 知乎的文章 二分查找有几种写法？它们的区别是什么？ - Jason Li的回答 - 知乎
 * https://www.zhihu.com/question/36132386/answer/530313852
 * 
 * 分为了三种分别是 < value, >= value, > value
 * 其中 bisectLeft 找到 大于等于 value 的下界值
 * 作用，找到插入的位置，使得插入的元素位于所有相同元素的左侧
 * e.g: 假设要找的 value 为 3
 * [0, 1, 2, 3(bisectLeft), 3, 3, 4(bisectRight), 4, 5]
 * 
 * @param {Array} array - 要查找的有序数组
 * @param {number} first - 查找范围的起始索引
 * @param {number} last - 查找范围的结束索引
 * @param {number} value - 要查找的目标值
 * @returns {number} - 返回目标值的插入位置（即 >= value 的下界）
 */
export const bisectLeft = (array, first, last, value) => {
    // 这个条件确保在找到插入位置时退出循环。
    while (first < last) {
        const mid = first + Math.floor((last - first) / 2); // 防止整数溢出的安全写法
        if (array[mid] < value) {
            first = mid + 1;
        } else {
            last = mid;
        }
    }
    return first; // last 也行，因为 [first, last) 为空的时候，它们重合
}

/**
 * bisect right, 找到大于 value 的下界值
 * 作用，找到插入的位置，使得插入的元素位于所有相同元素的右侧
 * @param {*} array 
 * @param {*} first 
 * @param {*} last 
 * @param {*} value 
 * @returns 
 */
export const bisectRight = (array, first, last, value) => {
    while (first < last) {
        const mid = first + Math.floor((last - first) / 2)
        if (array[mid] <= value) {
            first = mid + 1;
        } else {
            last = mid;
        }
    }
    return first;
}

/**
 * 标准的二分查找
 * 作用，找到目标值在数组中的索引
 * @param {*} array 
 * @param {*} first 
 * @param {*} last 
 * @param {*} value 
 * @returns 
 */
export const binarySearch = (array, first, last, value) => {
    // 改为 <= 以确保所有元素都被检查
    while (first <= last) {
        const mid = first + Math.floor((last - first) / 2)
        if (array[mid] === value) {
            return mid;
        } else if (array[mid] < value) {
            first = mid + 1;
        } else {
            last = mid - 1;
        }
    }
}

/**
 * 演示：为什么要用 first + Math.floor((last - first) / 2) 而不是 Math.floor((first + last) / 2)
 */
console.log('=== 中点计算方式对比 ===');

function demonstrateMidCalculation() {
    console.log('\n问题：整数溢出');
    console.log('在某些编程语言中（如C++、Java），当first和last都很大时：');
    
    // 模拟大数情况
    const first = 2147483600;  // 接近 2^31 - 1
    const last = 2147483647;   // 2^31 - 1 (32位整数最大值)
    
    console.log(`first = ${first}`);
    console.log(`last = ${last}`);
    
    // 方法1：可能溢出的写法
    const sum = first + last;
    console.log(`\nfirst + last = ${sum}`);
    console.log('在32位整数系统中，这可能导致溢出！');
    
    const mid1 = Math.floor(sum / 2);
    console.log(`Math.floor((first + last) / 2) = ${mid1}`);
    
    // 方法2：安全的写法
    const diff = last - first;
    const mid2 = first + Math.floor(diff / 2);
    console.log(`\nfirst + Math.floor((last - first) / 2):`);
    console.log(`= ${first} + Math.floor(${diff} / 2)`);
    console.log(`= ${first} + ${Math.floor(diff / 2)}`);
    console.log(`= ${mid2}`);
    
    console.log(`\n结果对比：`);
    console.log(`方法1结果: ${mid1}`);
    console.log(`方法2结果: ${mid2}`);
    console.log(`结果相同: ${mid1 === mid2}`);
    
    console.log('\n在JavaScript中：');
    console.log('- JavaScript使用64位浮点数，不容易溢出');
    console.log('- 但使用安全写法是好习惯，代码更健壮');
    console.log('- 在其他语言中这个问题更严重');
}

function demonstrateOverflowInOtherLanguages() {
    console.log('\n=== 其他语言中的溢出问题 ===');
    console.log('在C++/Java中，如果使用32位int：');
    console.log('int first = 2000000000;');
    console.log('int last = 2000000000;');
    console.log('int mid = (first + last) / 2;  // 可能溢出！');
    console.log('// first + last = 4000000000 > 2^31-1 = 2147483647');
    console.log('// 导致整数溢出，结果错误');
    console.log('');
    console.log('安全写法：');
    console.log('int mid = first + (last - first) / 2;  // 永远不会溢出');
}

function demonstrateEdgeCases() {
    console.log('\n=== 边界情况测试 ===');
    
    const testCases = [
        { first: 0, last: 1 },
        { first: 0, last: 2 },
        { first: 1, last: 3 },
        { first: 5, last: 10 },
        { first: 100, last: 200 }
    ];
    
    console.log('first\tlast\t方法1\t方法2\t相同?');
    console.log('----------------------------------------');
    
    testCases.forEach(({ first, last }) => {
        const method1 = Math.floor((first + last) / 2);
        const method2 = first + Math.floor((last - first) / 2);
        const same = method1 === method2;
        
        console.log(`${first}\t${last}\t${method1}\t${method2}\t${same}`);
    });
}

demonstrateMidCalculation();
demonstrateOverflowInOtherLanguages();
demonstrateEdgeCases();

console.log('\n=== 总结 ===');
console.log('为什么使用 first + Math.floor((last - first) / 2)：');
console.log('1. 防止整数溢出（在C++、Java等语言中很重要）');
console.log('2. 代码更安全，适用于所有编程语言');
console.log('3. 是业界标准写法，Google、Microsoft都推荐');
console.log('4. 虽然JavaScript不容易溢出，但保持好习惯很重要');
console.log('5. 在面试中使用这种写法会加分！');