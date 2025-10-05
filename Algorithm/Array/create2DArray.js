/**
 * create2DArray, 可以避免引用问题
 * @param {*} m 行
 * @param {*} n 列
 * @returns 
 */
// 方法1：Array.from（当前方法）
function create2DArray(m, n) {
    return Array.from({ length: m }, () => Array.from({ length: n }, () => 0));
}

// 方法2：Array.fill + map（更简洁）
function create2DArraySimple(m, n) {
    return Array(m).fill().map(() => Array(n).fill(0));
}

// 方法3：双重循环（最直观）
function create2DArrayLoop(m, n) {
    const arr = [];
    for (let i = 0; i < m; i++) {
        arr[i] = [];
        for (let j = 0; j < n; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

// 方法4：使用 repeat 和 split（一行代码）
function create2DArrayOneLine(m, n) {
    return Array(m).fill(0).map(() => Array(n).fill(0));
}

// 方法5：带初始值的通用函数
function create2DArrayWithValue(m, n, value = 0) {
    return Array(m).fill().map(() => Array(n).fill(value));
}

// 测试用例
console.log('=== 2D数组创建测试 ===');

const m = 3, n = 4;

console.log('方法1 - Array.from:', create2DArray(m, n));
console.log('方法2 - fill + map:', create2DArraySimple(m, n));
console.log('方法3 - 双重循环:', create2DArrayLoop(m, n));
console.log('方法4 - 一行代码:', create2DArrayOneLine(m, n));
console.log('方法5 - 带初始值:', create2DArrayWithValue(m, n, 5));

// 性能对比
console.log('\n=== 性能对比 ===');
const testSize = 1000;

console.time('Array.from');
create2DArray(testSize, testSize);
console.timeEnd('Array.from');

console.time('fill + map');
create2DArraySimple(testSize, testSize);
console.timeEnd('fill + map');

console.time('双重循环');
create2DArrayLoop(testSize, testSize);
console.timeEnd('双重循环');

module.exports = { 
    create2DArray,
    create2DArraySimple,
    create2DArrayLoop,
    create2DArrayOneLine,
    create2DArrayWithValue
};
