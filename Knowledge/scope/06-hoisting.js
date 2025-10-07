/**
 * 作用域复杂题 - Level 6
 * 考点：变量提升、函数提升、执行上下文
 */

console.log('=== 题目1：变量提升 ===');
console.log(a); // undefined
var a = 1;
console.log(a); // 1

console.log('\n=== 题目2：函数提升 ===');
foo(); // 'function declaration'

function foo() {
  console.log('function declaration');
}

var foo = function() {
  console.log('function expression');
};

foo(); // 'function expression'

console.log('\n=== 题目3：函数提升优先级 ===');
console.log(typeof bar); // 'function'

var bar = 1;
function bar() {
  return 2;
}

console.log(typeof bar); // 'number'

console.log('\n=== 题目4：复杂提升 ===');
var x = 1;

function test() {
  console.log(x); // undefined
  var x = 2;
  console.log(x); // 2
  
  function inner() {
    console.log(x); // 2
    var x = 3;
    console.log(x); // 3
  }
  
  inner();
  console.log(x); // 2
}

test();
console.log(x); // 1

/**
 * 解析：
 * 
 * 题目1：变量提升基础
 * - var 声明会提升到作用域顶部
 * - 相当于：
 *   var a;
 *   console.log(a); // undefined
 *   a = 1;
 *   console.log(a); // 1
 * 
 * 题目2：函数提升
 * - 函数声明会整体提升
 * - 函数表达式只提升变量名
 * - 相当于：
 *   function foo() { ... } // 整个函数提升
 *   var foo; // 变量声明提升
 *   foo(); // 调用函数声明
 *   foo = function() { ... }; // 赋值
 *   foo(); // 调用函数表达式
 * 
 * 题目3：函数提升优先级高于变量提升
 * - 函数声明优先级 > 变量声明
 * - 相当于：
 *   function bar() { ... } // 函数提升
 *   var bar; // 变量提升，但不会覆盖函数
 *   console.log(typeof bar); // 'function'
 *   bar = 1; // 赋值覆盖
 *   console.log(typeof bar); // 'number'
 * 
 * 题目4：多层作用域提升
 * - 每个函数都有自己的作用域
 * - 变量提升只在当前作用域
 * - test 中的 x 提升到 test 顶部
 * - inner 中的 x 提升到 inner 顶部
 * 
 * 关键点：
 * - var 变量提升：只提升声明，不提升赋值
 * - 函数提升：整个函数提升
 * - 函数声明优先级 > 变量声明
 * - let/const 不会提升（有暂时性死区）
 */

console.log('\n=== 题目5：let/const 不提升 ===');
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 1;

// console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 2;

console.log('\n=== 题目6：函数表达式 vs 函数声明 ===');
// 函数声明
function add1(a, b) {
  return a + b;
}

// 函数表达式
var add2 = function(a, b) {
  return a + b;
};

// 箭头函数（也是函数表达式）
var add3 = (a, b) => a + b;

console.log(typeof add1); // 'function'
console.log(typeof add2); // 'function'
console.log(typeof add3); // 'function'
