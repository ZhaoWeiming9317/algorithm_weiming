/**
 * 作用域综合题 - Level 7
 * 考点：所有作用域知识点综合
 */

var name = 'global';

function outer() {
  console.log(name); // undefined（变量提升）
  var name = 'outer';
  
  function inner() {
    console.log(name); // 'outer'（作用域链）
    
    var obj = {
      name: 'obj',
      method1: function() {
        console.log(this.name); // 'obj'
      },
      method2: () => {
        console.log(this.name); // undefined（箭头函数继承外层）
      }
    };
    
    obj.method1();
    obj.method2();
    
    setTimeout(function() {
      console.log(this.name); // undefined（setTimeout 中 this 指向全局）
    }, 100);
    
    setTimeout(() => {
      console.log(name); // 'outer'（闭包）
    }, 200);
  }
  
  inner();
}

outer();

console.log('\n=== 题目2：复杂闭包 ===');
function createModule() {
  var privateVar = 0;
  
  return {
    increment: function() {
      privateVar++;
      return privateVar;
    },
    decrement: function() {
      privateVar--;
      return privateVar;
    },
    getValue: function() {
      return privateVar;
    }
  };
}

const module1 = createModule();
const module2 = createModule();

console.log(module1.increment()); // 1
console.log(module1.increment()); // 2
console.log(module2.increment()); // 1
console.log(module1.getValue()); // 2
console.log(module2.getValue()); // 1

console.log('\n=== 题目3：立即执行函数 ===');
var result = [];

for (var i = 0; i < 3; i++) {
  (function(j) {
    result.push(function() {
      return j;
    });
  })(i);
}

console.log(result[0]()); // 0
console.log(result[1]()); // 1
console.log(result[2]()); // 2

console.log('\n=== 题目4：作用域链查找 ===');
var a = 1;

function foo() {
  var b = 2;
  
  function bar() {
    var c = 3;
    console.log(a, b, c); // 1 2 3
  }
  
  bar();
}

foo();

console.log('\n=== 题目5：块级作用域与闭包 ===');
{
  let x = 1;
  var y = 2;
  
  setTimeout(() => {
    console.log(x, y); // 1 2（闭包保存了 x 和 y）
  }, 300);
}

// console.log(x); // ReferenceError
console.log(y); // 2

/**
 * 解析：
 * 
 * 题目1：综合考察
 * - outer 中的 name 变量提升，初始值 undefined
 * - inner 通过作用域链访问 outer 的 name
 * - obj.method1 的 this 指向 obj
 * - obj.method2 是箭头函数，this 继承外层（全局）
 * - setTimeout 普通函数 this 指向全局
 * - setTimeout 箭头函数通过闭包访问 name
 * 
 * 题目2：模块模式（闭包应用）
 * - privateVar 是私有变量，外部无法直接访问
 * - 通过返回的方法访问和修改 privateVar
 * - 每次调用 createModule 创建独立的作用域
 * - module1 和 module2 有各自的 privateVar
 * 
 * 题目3：IIFE 解决循环闭包
 * - 立即执行函数创建新作用域
 * - 每次循环将 i 的值传递给 j
 * - j 在各自的作用域中被保存
 * 
 * 题目4：作用域链
 * - bar 可以访问：c（自己）、b（foo）、a（全局）
 * - 作用域链：bar → foo → global
 * 
 * 题目5：块级作用域与闭包结合
 * - let x 是块级作用域
 * - var y 提升到全局
 * - setTimeout 的箭头函数形成闭包，保存了 x 和 y
 * - 块外无法访问 x，但可以访问 y
 * 
 * 关键点总结：
 * 1. 作用域类型：全局、函数、块级
 * 2. 作用域链：从内到外查找变量
 * 3. 闭包：函数 + 外部变量引用
 * 4. this 绑定：普通函数看调用，箭头函数看定义
 * 5. 变量提升：var 和函数声明会提升
 * 6. 暂时性死区：let/const 声明前不可访问
 */
