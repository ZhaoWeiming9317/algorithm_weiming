/**
 * create2DArray, 可以避免引用问题
 * @param {*} m 行
 * @param {*} n 列
 * @returns 
 */
function create2DArray(m, n) {
    return Array.from({ length: m }, () => Array.from({ length: n }, () => 0));
}

function createArray(m) {
    return Array.from({ length: m }, () => 0);
}
