/**
 * create2DArray, 可以避免引用问题
 * @param {*} m 
 * @param {*} n 
 * @returns 
 */
function create2DArray(m, n) {
    return Array.from({ length: m }, () => Array.from({ length: n }, () => 0));
}
