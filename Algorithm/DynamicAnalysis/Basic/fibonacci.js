/**
 * 斐波那契数列 (Fibonacci Number)
 * 
 * 题目描述：
 * 斐波那契数列由0和1开始，后面的每一项数字都是前面两项数字的和。
 * F(0) = 0, F(1) = 1
 * F(n) = F(n-1) + F(n-2), 其中 n > 1
 * 给你n，请计算F(n)。
 * 
 * 示例：
 * 输入：n = 4
 * 输出：3
 * 解释：F(4) = F(3) + F(2) = 2 + 1 = 3
 * 
 * 解题思路：
 * 1. 递归（自顶向下）
 *    - 直接按照定义实现
 *    - 存在大量重复计算
 *    - 时间复杂度：O(2^n)
 * 
 * 2. 记忆化递归
 *    - 使用数组记录已经计算过的值
 *    - 避免重复计算
 *    - 时间复杂度：O(n)
 * 
 * 3. 动态规划（自底向上）
 *    - 从小到大计算每个值
 *    - 只需要保存前两个值
 *    - 时间复杂度：O(n)，空间复杂度：O(1)
 * 
 * 4. 矩阵快速幂
 *    - 利用矩阵乘法的性质
 *    - 时间复杂度：O(logn)
 */

// 方法1：递归
function fibRecursive(n) {
    if (n <= 1) return n;
    return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// 方法2：记忆化递归
function fibMemo(n) {
    const memo = new Array(n + 1).fill(-1);
    
    function fib(n) {
        if (n <= 1) return n;
        if (memo[n] !== -1) return memo[n];
        
        memo[n] = fib(n - 1) + fib(n - 2);
        return memo[n];
    }
    
    return fib(n);
}

// 方法3：动态规划
function fibDP(n) {
    if (n <= 1) return n;
    
    let prev2 = 0;  // f(n-2)
    let prev1 = 1;  // f(n-1)
    let curr = 1;   // f(n)
    
    for (let i = 2; i <= n; i++) {
        curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return curr;
}

// 方法4：矩阵快速幂
function fibMatrix(n) {
    if (n <= 1) return n;
    
    // 矩阵乘法
    function multiply(a, b) {
        return [
            [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
            [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]
        ];
    }
    
    // 矩阵快速幂
    function matrixPower(matrix, n) {
        if (n === 1) return matrix;
        if (n % 2 === 0) {
            const half = matrixPower(matrix, n / 2);
            return multiply(half, half);
        }
        return multiply(matrix, matrixPower(matrix, n - 1));
    }
    
    const base = [[1, 1], [1, 0]];
    const result = matrixPower(base, n - 1);
    return result[0][0];
}

// 方法5：生成斐波那契数列
function generateFibSequence(n) {
    const sequence = [0, 1];
    
    for (let i = 2; i <= n; i++) {
        sequence.push(sequence[i-1] + sequence[i-2]);
    }
    
    return sequence;
}

// 方法6：带缓存的斐波那契生成器
function* fibGenerator() {
    let prev2 = 0;
    let prev1 = 1;
    
    yield prev2;  // F(0)
    yield prev1;  // F(1)
    
    while (true) {
        const curr = prev1 + prev2;
        yield curr;
        prev2 = prev1;
        prev1 = curr;
    }
}

// 方法7：黄金分割比计算斐波那契数
function fibGoldenRatio(n) {
    const phi = (1 + Math.sqrt(5)) / 2;  // 黄金分割比
    return Math.round(Math.pow(phi, n) / Math.sqrt(5));
}

// 测试
function test() {
    // 测试用例1：基本场景
    const n1 = 10;
    console.log("测试用例1 - 基本场景 (n=10)：");
    console.log("递归:", fibRecursive(n1));
    console.log("记忆化递归:", fibMemo(n1));
    console.log("动态规划:", fibDP(n1));
    console.log("矩阵快速幂:", fibMatrix(n1));
    console.log("黄金分割比:", fibGoldenRatio(n1));
    
    // 测试用例2：生成数列
    const n2 = 5;
    console.log("\n测试用例2 - 生成数列 (n=5)：");
    console.log("完整数列:", generateFibSequence(n2));
    
    // 测试用例3：生成器
    console.log("\n测试用例3 - 生成器：");
    const gen = fibGenerator();
    const firstFive = Array.from({ length: 5 }, () => gen.next().value);
    console.log("前5个数:", firstFive);
    
    // 测试用例4：性能对比
    const n4 = 40;
    console.log("\n测试用例4 - 性能对比 (n=40)：");
    
    console.time("动态规划");
    const dp = fibDP(n4);
    console.timeEnd("动态规划");
    
    console.time("矩阵快速幂");
    const matrix = fibMatrix(n4);
    console.timeEnd("矩阵快速幂");
    
    console.time("黄金分割比");
    const golden = fibGoldenRatio(n4);
    console.timeEnd("黄金分割比");
    
    console.log("结果对比:", { dp, matrix, golden });
}

module.exports = {
    fibRecursive,
    fibMemo,
    fibDP,
    fibMatrix,
    generateFibSequence,
    fibGenerator,
    fibGoldenRatio
};
