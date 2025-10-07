/**
 * 作用域进阶题 - Level 2
 * 考点：块级作用域、let/const、暂时性死区
 */

console.log('=== 题目1：块级作用域 ===');
{
  let a = 1;
  const b = 2;
  var c = 3;
}

// console.log(a); // ReferenceError
// console.log(b); // ReferenceError
console.log(c); // 3

console.log('\n=== 题目2：暂时性死区 ===');
var x = 1;
{
  // console.log(x); // ReferenceError（暂时性死区）
  let x = 2;
  console.log(x); // 2
}

console.log('\n=== 题目3：for 循环作用域 ===');
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log('var i:', i);
  }, 100);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => {
    console.log('let j:', j);
  }, 200);
}

/**
 * 请问输出顺序是什么？
 * 
 * 答案：
 * === 题目1：块级作用域 ===
 * 3
 * 
 * === 题目2：暂时性死区 ===
 * 2
 * 
 * === 题目3：for 循环作用域 ===
 * var i: 3
 * var i: 3
 * var i: 3
 * let j: 0
 * let j: 1
 * let j: 2
 * 
 * 解析：
 * 
 * 题目1：
 * - let 和 const 是块级作用域，只在 {} 内有效
 * - var 是函数作用域，会提升到全局
 * - 所以只有 c 可以在块外访问
 * 
 * 题目2：
 * - 块内声明了 let x，形成块级作用域
 * - 在声明之前访问 x 会进入"暂时性死区"
 * - 即使外部有同名变量，也不能在声明前访问
 * 
 * 题目3：
 * - var i：循环结束后 i = 3，所有 setTimeout 共享同一个 i
 * - let j：每次循环创建新的块级作用域，j 的值被保存
 * - 这是 let 解决闭包问题的经典案例
 * 
 * 关键点：
 * - let/const 是块级作用域（{}）
 * - var 是函数作用域
 * - 暂时性死区：声明之前不可访问
 * - for 循环中 let 每次迭代创建新作用域
 */
