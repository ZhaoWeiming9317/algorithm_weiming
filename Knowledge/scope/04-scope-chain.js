/**
 * 作用域进阶题 - Level 4
 * 考点：作用域链、变量查找
 */

var a = 1;

function outer() {
  var b = 2;
  
  function inner() {
    var c = 3;
    console.log('inner:', a, b, c);
  }
  
  inner();
  console.log('outer:', a, b);
  // console.log(c); // ReferenceError
}

outer();
console.log('global:', a);
// console.log(b); // ReferenceError

console.log('\n=== 题目2：作用域链查找 ===');
var x = 10;

function foo() {
  console.log(x);
}

function bar() {
  var x = 20;
  foo();
}

bar();

console.log('\n=== 题目3：复杂作用域链 ===');
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar();

var value = 3;

function baz() {
  console.log(value);
}

baz();

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * inner: 1 2 3
 * outer: 1 2
 * global: 1
 * 
 * === 题目2：作用域链查找 ===
 * 10
 * 
 * === 题目3：复杂作用域链 ===
 * 1
 * 3
 * 
 * 解析：
 * 
 * 题目1：作用域链
 * - inner 可以访问：c（自己）、b（outer）、a（全局）
 * - outer 可以访问：b（自己）、a（全局）
 * - 全局只能访问：a（自己）
 * - 作用域链：inner → outer → global
 * 
 * 题目2：词法作用域
 * - foo 函数在定义时，外层作用域是全局
 * - 即使在 bar 中调用 foo，foo 的作用域链不变
 * - foo 访问的 x 是全局的 x = 10
 * - JavaScript 使用词法作用域（静态作用域）
 * 
 * 题目3：函数定义时确定作用域
 * - foo 定义时，全局 value = 1
 * - bar 调用 foo，foo 访问的是全局 value = 1
 * - baz 定义时，全局 value = 3
 * - baz 访问的是全局 value = 3
 * 
 * 关键点：
 * - 作用域链：从内到外查找变量
 * - 词法作用域：函数定义时确定作用域，不是调用时
 * - 变量查找：先找自己，再找外层，直到全局
 * - 找不到变量会报 ReferenceError
 */
