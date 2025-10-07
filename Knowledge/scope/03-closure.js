/**
 * 作用域进阶题 - Level 3
 * 考点：闭包、作用域链
 */

console.log('=== 题目1：经典闭包 ===');
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1
console.log(counter1()); // 3

console.log('\n=== 题目2：循环中的闭包 ===');
function createFunctions() {
  var result = [];
  for (var i = 0; i < 3; i++) {
    result[i] = function() {
      return i;
    };
  }
  return result;
}

const funcs = createFunctions();
console.log(funcs[0]()); // 3
console.log(funcs[1]()); // 3
console.log(funcs[2]()); // 3

console.log('\n=== 题目3：闭包解决方案 ===');
function createFunctionsFixed() {
  var result = [];
  for (var i = 0; i < 3; i++) {
    result[i] = (function(j) {
      return function() {
        return j;
      };
    })(i);
  }
  return result;
}

const funcsFixed = createFunctionsFixed();
console.log(funcsFixed[0]()); // 0
console.log(funcsFixed[1]()); // 1
console.log(funcsFixed[2]()); // 2

/**
 * 解析：
 * 
 * 题目1：经典闭包
 * - createCounter 返回的函数形成闭包
 * - 每次调用 createCounter 创建新的作用域
 * - counter1 和 counter2 有各自独立的 count 变量
 * - 闭包使得内部函数可以访问外部函数的变量
 * 
 * 题目2：循环中的闭包问题
 * - var i 是函数作用域，所有闭包共享同一个 i
 * - 循环结束后 i = 3
 * - 所有函数返回的都是同一个 i 的值
 * 
 * 题目3：使用 IIFE 解决
 * - 立即执行函数创建新的作用域
 * - 每次循环将 i 的值传递给 j
 * - j 在各自的作用域中被保存
 * - 也可以用 let 替代 var 解决
 * 
 * 关键点：
 * - 闭包 = 函数 + 函数能访问的外部变量
 * - 闭包可以保存私有变量
 * - 循环中的闭包问题：var 共享，let 独立
 * - IIFE 可以创建独立作用域
 */
