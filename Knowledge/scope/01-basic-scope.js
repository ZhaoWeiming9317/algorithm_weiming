/**
 * 作用域基础题 - Level 1
 * 考点：全局作用域、函数作用域、变量提升
 */

var a = 1;

function foo() {
  console.log(a);
  var a = 2;
  console.log(a);
}

foo();
console.log(a);

/**
 * 请问输出顺序是什么？
 * 
 * 答案：undefined 2 1
 * 
 * 解析：
 * 1. foo() 执行时，函数内部的 var a 会变量提升
 * 2. 相当于：
 *    function foo() {
 *      var a;  // 提升到函数顶部，此时 a = undefined
 *      console.log(a);  // undefined
 *      a = 2;
 *      console.log(a);  // 2
 *    }
 * 3. 函数外的 console.log(a) 访问的是全局的 a，值为 1
 * 
 * 关键点：
 * - var 声明的变量会提升到函数作用域顶部
 * - 函数内部的变量不会影响外部同名变量
 * - 变量提升只提升声明，不提升赋值
 */
