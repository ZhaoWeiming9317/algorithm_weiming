/**
 * 二进制数组加法 (Binary Array Addition)
 * 
 * 题目描述：
 * 给定两个位数组（二进制序列）：
 * - A：长度为M，包含一个二进制序列
 * - B：长度为N，包含一个二进制序列
 * 
 * 要求写一个函数返回两个二进制数组相加的结果（最短的位序列）
  * 
 * 修正后的示例：
 * 输入：A = [1,0,1,1,0,0,1,0,1,0,1,0] (2906)
 *      B = [0,1,1,0,1,1,1,0,0,0] (440) 
 * 输出：[1,1,0,1,0,0,1,0,1,1,1,0] (3346)
 * 
 * 解题思路：
 * 1. 从最低位开始逐位相加
 * 2. 处理进位
 * 3. 处理不同长度的数组
 * 4. 去除前导零
 */

/**
 * 方法1：模拟二进制加法
 * @param {number[]} A - 第一个二进制数组
 * @param {number[]} B - 第二个二进制数组
 * @return {number[]} - 相加结果的二进制数组
 */
export function addBinary(A, B) {
    const result = [];
    let carry = 0;
    let i = A.length - 1; // A的最后一位（最低位）
    let j = B.length - 1; // B的最后一位（最低位）
    
    // 从最低位开始相加
    while (i >= 0 || j >= 0 || carry > 0) {
        const bitA = i >= 0 ? A[i] : 0;
        const bitB = j >= 0 ? B[j] : 0;
        
        const sum = bitA + bitB + carry;
        result.unshift(sum % 2); // 当前位的结果
        carry = Math.floor(sum / 2); // 进位
        
        // 你的理解是对的！也可以写成：
        // if (sum >= 2) {
        //     carry = 1;
        //     result.unshift(sum - 2);
        // } else {
        //     carry = 0;
        //     result.unshift(sum);
        // }
        
        i--;
        j--;
    }
    
    // 去除前导零
    while (result.length > 1 && result[0] === 0) {
        result.shift();
    }
    
    return result;
}

/**
 * 方法2：使用你建议的 sum >= 2 判断方式
 * @param {number[]} A 
 * @param {number[]} B 
 * @return {number[]}
 */
export function addBinaryV2(A, B) {
    const result = [];
    let carry = 0;
    let i = A.length - 1;
    let j = B.length - 1;
    
    while (i >= 0 || j >= 0 || carry > 0) {
        const bitA = i >= 0 ? A[i] : 0;
        const bitB = j >= 0 ? B[j] : 0;
        
        const sum = bitA + bitB + carry;
        
        // 你建议的方法：直接判断 sum >= 2
        if (sum >= 2) {
            carry = 1;
            result.unshift(sum - 2); // 当前位是 sum - 2
        } else {
            carry = 0;
            result.unshift(sum); // 当前位就是 sum
        }
        
        i--;
        j--;
    }
    
    // 去除前导零
    while (result.length > 1 && result[0] === 0) {
        result.shift();
    }
    
    return result;
}

/**
 * 方法2.5：转换为数字计算（适用于较小的数）
 * @param {number[]} A 
 * @param {number[]} B 
 * @return {number[]}
 */
export function addBinaryV2_5(A, B) {
    // 将二进制数组转换为数字
    const numA = parseInt(A.join(''), 2);
    const numB = parseInt(B.join(''), 2);
    
    // 相加
    const sum = numA + numB;
    
    // 转换回二进制数组
    return sum.toString(2).split('').map(Number);
}

/**
 * 方法3：使用字符串处理（JavaScript特有的大数处理）
 * @param {number[]} A 
 * @param {number[]} B 
 * @return {number[]}
 */
export function addBinaryV3(A, B) {
    const strA = A.join('');
    const strB = B.join('');
    
    // 使用BigInt处理大数
    const numA = BigInt('0b' + strA);
    const numB = BigInt('0b' + strB);
    
    const sum = numA + numB;
    
    // 转换回二进制数组
    return sum.toString(2).split('').map(Number);
}

/**
 * 辅助函数：将二进制数组转换为十进制数字（用于验证）
 */
export function binaryArrayToDecimal(binaryArray) {
    return parseInt(binaryArray.join(''), 2);
}

/**
 * 辅助函数：将十进制数字转换为二进制数组
 */
export function decimalToBinaryArray(decimal) {
    if (decimal === 0) return [0];
    return decimal.toString(2).split('').map(Number);
}

/**
 * 辅助函数：打印二进制数组及其十进制值
 */
export function printBinaryArray(arr, label = '') {
    const decimal = binaryArrayToDecimal(arr);
    console.log(`${label}[${arr.join('')}] = ${decimal}`);
}

/**
 * 辅助函数：计算补码表示的值
 * @param {number[]} binaryArray - 二进制数组
 * @param {number} bitWidth - 位宽（用于确定符号位）
 * @return {number} - 补码表示的十进制值
 */
export function twosComplementToDecimal(binaryArray, bitWidth = binaryArray.length) {
    if (binaryArray.length === 0) return 0;
    
    // 如果最高位是1，表示负数
    if (binaryArray[0] === 1) {
        // 计算补码：先按位取反，然后加1
        const inverted = binaryArray.map(bit => 1 - bit);
        const invertedDecimal = parseInt(inverted.join(''), 2);
        return -(invertedDecimal + 1);
    } else {
        // 最高位是0，表示正数
        return parseInt(binaryArray.join(''), 2);
    }
}

/**
 * 辅助函数：将十进制数转换为指定位宽的补码
 * @param {number} decimal - 十进制数
 * @param {number} bitWidth - 位宽
 * @return {number[]} - 补码表示的二进制数组
 */
export function decimalToTwosComplement(decimal, bitWidth) {
    if (decimal >= 0) {
        // 正数直接转换
        const binary = decimal.toString(2).padStart(bitWidth, '0');
        return binary.split('').map(Number);
    } else {
        // 负数：先取绝对值，转二进制，取反，加1
        const abs = Math.abs(decimal);
        const binary = abs.toString(2).padStart(bitWidth, '0');
        const inverted = binary.split('').map(bit => 1 - parseInt(bit));
        
        // 加1（二进制加法）
        let carry = 1;
        for (let i = inverted.length - 1; i >= 0 && carry; i--) {
            const sum = inverted[i] + carry;
            inverted[i] = sum % 2;
            carry = Math.floor(sum / 2);
        }
        
        return inverted;
    }
}

// 测试用例
console.log('=== 二进制数组加法测试 ===');

// 首先展示原题的问题
console.log('\n=== 原题数据分析 ===');
const originalA = [0,1,1,0,0,1,0,1,1,1,0,1,0,1,1];
const originalB = [0,0,1,0,0,1,1,1,1,1,0,1];

console.log('原题声称：');
console.log('A = [011001011101011] (5730)');
console.log('B = [001001111101] (-2396)');
console.log('结果应该是 3334');

console.log('\n实际计算：');
printBinaryArray(originalA, 'A实际 = ');
printBinaryArray(originalB, 'B实际 = ');
const originalResult = addBinary(originalA, originalB);
printBinaryArray(originalResult, '实际结果 = ');

console.log('\n问题分析：');
console.log('1. A的实际值是13035，不是5730');
console.log('2. B的实际值是637，不是-2396');
console.log('3. B开头是0，如果是负数补码，开头应该是1');
console.log('4. 实际结果是13672，不是3334');

// 现在创建一个正确的示例
console.log('\n=== 修正后的正确示例 ===');

// 示例1：简单的正数加法
console.log('\n示例1：正数加法');
const correctA1 = decimalToBinaryArray(5730);
const correctB1 = decimalToBinaryArray(2396);
printBinaryArray(correctA1, 'A = ');
printBinaryArray(correctB1, 'B = ');
const correctResult1 = addBinary(correctA1, correctB1);
printBinaryArray(correctResult1, '结果 = ');
console.log(`验证：5730 + 2396 = ${binaryArrayToDecimal(correctResult1)}`);

// 示例2：如果真的要演示负数（使用补码）
console.log('\n示例2：有符号数加法（补码表示）');
const signedA = decimalToBinaryArray(5730);
const signedB_negative = decimalToTwosComplement(-2396, 16); // 16位补码
console.log('正数A:');
printBinaryArray(signedA, 'A = ');
console.log('负数B（16位补码）:');
printBinaryArray(signedB_negative, 'B = ');
console.log(`B的补码值: ${twosComplementToDecimal(signedB_negative, 16)}`);

// 补码加法需要特殊处理，这里简化为十进制计算后转换
const signedSum = 5730 + (-2396);
const signedResult = decimalToBinaryArray(signedSum);
printBinaryArray(signedResult, '结果 = ');
console.log(`验证：5730 + (-2396) = ${signedSum}`);

// 示例3：展示正确的二进制加法应该是什么样的
console.log('\n示例3：题目可能想要的效果');
console.log('如果题目想要 A + B = 3334，那么：');
const targetA = 5730;
const targetSum = 3334;
const targetB = targetSum - targetA;
console.log(`A = ${targetA}, B应该 = ${targetB}, 结果 = ${targetSum}`);

const correctA3 = decimalToBinaryArray(targetA);
const correctB3 = targetB >= 0 ? decimalToBinaryArray(targetB) : decimalToTwosComplement(targetB, 16);
printBinaryArray(correctA3, 'A = ');
printBinaryArray(correctB3, 'B = ');
const correctResult3 = addBinary(correctA3, correctB3);
printBinaryArray(correctResult3, '结果 = ');
console.log(`验证：${targetA} + ${targetB} = ${binaryArrayToDecimal(correctResult3)}`);

console.log('\n=== 总结：你的观察完全正确！ ===');
console.log('问题分析：');
console.log('1. 题目说B是-2396，但B=[001001111101]开头是0，不是1');
console.log('2. 在补码表示中，负数的最高位（符号位）必须是1');
console.log('3. 如果-2396用补码表示，应该是1开头的数组');
console.log('4. 题目的数据和标注完全不匹配');
console.log('');
console.log('正确的理解：');
console.log('- 这就是一个简单的二进制加法题');
console.log('- 不涉及负数和补码');
console.log('- 题目的标注有严重错误');
console.log('- 你的质疑非常有道理！');

console.log('\n=== 进位机制详解 ===');
console.log('你的理解完全正确！让我们对比两种写法：');
console.log('');

// 演示进位的不同写法
function demonstrateCarryMethods() {
    console.log('二进制加法中可能的sum值和对应的处理：');
    
    const cases = [
        {bits: '0+0+0', sum: 0, desc: '无进位'},
        {bits: '0+0+1', sum: 1, desc: '无进位'}, 
        {bits: '0+1+0', sum: 1, desc: '无进位'},
        {bits: '1+0+0', sum: 1, desc: '无进位'},
        {bits: '0+1+1', sum: 2, desc: '需要进位'},
        {bits: '1+0+1', sum: 2, desc: '需要进位'},
        {bits: '1+1+0', sum: 2, desc: '需要进位'},
        {bits: '1+1+1', sum: 3, desc: '需要进位'}
    ];
    
    console.log('情况\t\tsum\t当前位\t进位');
    console.log('--------------------------------');
    
    cases.forEach(({bits, sum, desc}) => {
        const currentBit_method1 = sum % 2;
        const carry_method1 = Math.floor(sum / 2);
        
        const currentBit_method2 = sum >= 2 ? sum - 2 : sum;
        const carry_method2 = sum >= 2 ? 1 : 0;
        
        console.log(`${bits}\t\t${sum}\t${currentBit_method1}\t${carry_method1}\t(${desc})`);
        
        // 验证两种方法结果相同
        if (currentBit_method1 !== currentBit_method2 || carry_method1 !== carry_method2) {
            console.log('❌ 两种方法结果不同！');
        }
    });
    
    console.log('');
    console.log('结论：');
    console.log('方法1: carry = Math.floor(sum / 2), currentBit = sum % 2');
    console.log('方法2: carry = sum >= 2 ? 1 : 0, currentBit = sum >= 2 ? sum - 2 : sum');
    console.log('两种方法完全等价！');
    console.log('');
    console.log('为什么用方法1？');
    console.log('1. 更简洁，一行代码搞定');
    console.log('2. 数学上更优雅（除法和取模的关系）');
    console.log('3. 容易扩展到其他进制（比如十进制就是 sum / 10 和 sum % 10）');
}

demonstrateCarryMethods();

console.log('\n=== 其他测试用例 ===');

// 测试用例2：简单加法
console.log('\n测试用例2：简单加法');
const A2 = [1, 0, 1]; // 5
const B2 = [1, 1]; // 3
printBinaryArray(A2, 'A = ');
printBinaryArray(B2, 'B = ');

const result2 = addBinary(A2, B2);
printBinaryArray(result2, '结果 = ');
console.log(`验证：${binaryArrayToDecimal(A2)} + ${binaryArrayToDecimal(B2)} = ${binaryArrayToDecimal(result2)}`);

// 测试用例3：有进位的加法
console.log('\n测试用例3：有进位的加法');
const A3 = [1, 1, 1]; // 7
const B3 = [1]; // 1
printBinaryArray(A3, 'A = ');
printBinaryArray(B3, 'B = ');

const result3 = addBinary(A3, B3);
printBinaryArray(result3, '结果 = ');
console.log(`验证：${binaryArrayToDecimal(A3)} + ${binaryArrayToDecimal(B3)} = ${binaryArrayToDecimal(result3)}`);

// 测试用例4：零的处理
console.log('\n测试用例4：零的处理');
const A4 = [0]; // 0
const B4 = [1, 0, 1, 0]; // 10
printBinaryArray(A4, 'A = ');
printBinaryArray(B4, 'B = ');

const result4 = addBinary(A4, B4);
printBinaryArray(result4, '结果 = ');
console.log(`验证：${binaryArrayToDecimal(A4)} + ${binaryArrayToDecimal(B4)} = ${binaryArrayToDecimal(result4)}`);

// 测试用例5：比较三种方法
console.log('\n测试用例5：比较三种方法');
const A5 = [1, 1, 0, 1, 0, 1]; // 53
const B5 = [1, 0, 1, 1]; // 11

console.log('输入：');
printBinaryArray(A5, 'A = ');
printBinaryArray(B5, 'B = ');

const result5_v1 = addBinary(A5, B5);
const result5_v2 = addBinaryV2(A5, B5);
const result5_v3 = addBinaryV3(A5, B5);

console.log('\n三种方法的结果：');
printBinaryArray(result5_v1, '方法1(除法取模) = ');
printBinaryArray(result5_v2, '方法2(sum>=2判断) = ');
printBinaryArray(result5_v3, '方法3(BigInt) = ');

console.log(`\n验证：${binaryArrayToDecimal(A5)} + ${binaryArrayToDecimal(B5)} = ${binaryArrayToDecimal(result5_v1)}`);

// 性能测试
console.log('\n=== 性能对比 ===');
const largeA = new Array(20).fill(0).map(() => Math.round(Math.random()));
const largeB = new Array(15).fill(0).map(() => Math.round(Math.random()));

console.time('方法1（逐位计算）');
for (let i = 0; i < 10000; i++) {
    addBinary(largeA, largeB);
}
console.timeEnd('方法1（逐位计算）');

console.time('方法2（转数字）');
for (let i = 0; i < 10000; i++) {
    addBinaryV2(largeA, largeB);
}
console.timeEnd('方法2（转数字）');

console.time('方法3（BigInt）');
for (let i = 0; i < 10000; i++) {
    addBinaryV3(largeA, largeB);
}
console.timeEnd('方法3（BigInt）');
