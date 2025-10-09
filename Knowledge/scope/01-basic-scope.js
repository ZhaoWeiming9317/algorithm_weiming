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

// 问题1: 为啥第一个 a 拿不到外面的 a 的值？
// 
// 答：因为 JavaScript 的「作用域遮蔽」（Scope Shadowing）机制
//
// 详细解析：
//
// 1️⃣ JavaScript 引擎在执行函数前，会先进行「编译阶段」
//    编译阶段会扫描整个函数，收集所有变量声明
//
//    function foo() {
//      console.log(a);  // 第 1 行
//      var a = 2;       // 第 2 行：发现了 var a 声明！
//      console.log(a);  // 第 3 行
//    }
//
//    编译器发现：「这个函数内部声明了一个局部变量 a」
//    于是在函数作用域中创建了一个 a 的位置（slot）
//
// 2️⃣ 执行阶段的查找规则：
//    当执行 console.log(a) 时，JavaScript 引擎会按以下顺序查找：
//    
//    Step 1: 先在当前作用域（foo 函数作用域）查找变量 a
//            → 找到了！（虽然还没赋值，但位置已经存在）
//            → 此时 a = undefined（变量提升）
//    
//    Step 2: 如果当前作用域没找到，才会去外层作用域查找
//            → 但因为 Step 1 已经找到了，所以不会继续往外找
//
// 3️⃣ 关键点：「遮蔽」发生的时机
//
//    var a = 1;  // 全局作用域的 a
//
//    function foo() {
//      // 编译阶段：发现 var a，在函数作用域创建 a
//      // 此时函数作用域的 a 就「遮蔽」了全局的 a
//      
//      console.log(a);  // 访问的是函数作用域的 a（此时 undefined）
//                       // 不会访问全局的 a（值为 1）
//      
//      var a = 2;  // 给函数作用域的 a 赋值
//      console.log(a);  // 访问的还是函数作用域的 a（值为 2）
//    }
//
// 4️⃣ 类比理解：
//
//    想象你在找一本书：
//    - 全局作用域 = 图书馆
//    - 函数作用域 = 你的书包
//    
//    如果你的书包里有这本书（即使还没放进去，但有这个位置）
//    你就不会去图书馆找了
//    
//    var a = 1;  // 图书馆有一本书 a
//    
//    function foo() {
//      console.log(a);  // 先看书包，发现有 a 的位置（但书还没放）
//                       // 所以拿到的是 undefined，不会去图书馆找
//      
//      var a = 2;  // 把书 a 放进书包
//      console.log(a);  // 从书包拿到书 a
//    }
//
// 5️⃣ 对比：如果没有 var a 声明
//
//    var a = 1;
//    
//    function bar() {
//      console.log(a);  // 当前作用域没有 a
//                       // 去外层作用域找，找到全局的 a = 1
//                       // 输出：1
//      
//      a = 2;  // 没有 var，修改的是全局的 a
//      console.log(a);  // 输出：2
//    }
//    
//    bar();
//    console.log(a);  // 全局的 a 被修改了，输出：2
//
// 6️⃣ 总结：
//    - JavaScript 在编译阶段就确定了变量属于哪个作用域
//    - 只要函数内部有 var a 声明，整个函数内的 a 都指向局部变量
//    - 即使 var a 在后面，前面访问也是访问局部的 a（只是值为 undefined）
//    - 这就是「变量提升 + 作用域遮蔽」的组合效果
//
// 🎯 记忆口诀：
//    「先看自己家，再看邻居家」
//    「自己家有位置（即使是空的），就不去邻居家找了」

// Q2: 为啥 let 不会遮蔽全局变量？

// 答：这个问题有误解！let 也会遮蔽全局变量，但有「暂时性死区」（TDZ）的限制
//
// 详细解析：
//
// 1️⃣ let 同样会遮蔽全局变量
//
//    var a = 1;
//    
//    function foo() {
//      console.log(a);  // ❌ ReferenceError: Cannot access 'a' before initialization
//      let a = 2;       // let 声明的 a 遮蔽了全局的 a
//      console.log(a);  // 2
//    }
//    
//    foo();
//
//    // 为什么报错？
//    // - let 在编译阶段也会创建变量 a 的位置（遮蔽全局 a）
//    // - 但 let 有「暂时性死区」（TDZ），在声明之前不能访问
//    // - var 的变量提升会初始化为 undefined，let 不会
//
// 2️⃣ var vs let 的区别
//
//    // var：变量提升 + 初始化为 undefined
//    function test1() {
//      console.log(a);  // undefined（可以访问，但值是 undefined）
//      var a = 2;
//    }
//    
//    // let：变量提升 + 暂时性死区（TDZ）
//    function test2() {
//      console.log(a);  // ❌ ReferenceError（不能访问）
//      let a = 2;
//    }
//    
//    // 两者都会遮蔽全局变量，区别在于：
//    // - var 允许在声明前访问（值为 undefined）
//    // - let 不允许在声明前访问（抛出错误）
//
// 3️⃣ 暂时性死区（TDZ）详解
//
//    let a = 1;  // 全局 a
//    
//    function foo() {
//      // ⚠️ TDZ 开始：从函数开始到 let a 声明之间
//      
//      console.log(a);  // ❌ 在 TDZ 中访问 a，报错
//      
//      if (true) {
//        console.log(a);  // ❌ 还在 TDZ 中，报错
//      }
//      
//      let a = 2;  // ✅ TDZ 结束，a 被初始化
//      
//      console.log(a);  // ✅ 可以访问了，输出 2
//    }
//    
//    // TDZ 的本质：
//    // - let/const 声明的变量在作用域开始就存在（遮蔽外层）
//    // - 但在声明语句之前，这个变量处于「未初始化」状态
//    // - 访问未初始化的变量会报错
//
// 4️⃣ 实际例子对比
//
//    // 例子1：var 的遮蔽
//    var x = 'global';
//    
//    function test1() {
//      console.log(x);  // undefined（遮蔽了，但可以访问）
//      var x = 'local';
//      console.log(x);  // 'local'
//    }
//    
//    // 例子2：let 的遮蔽
//    let y = 'global';
//    
//    function test2() {
//      console.log(y);  // ❌ ReferenceError（遮蔽了，但不能访问）
//      let y = 'local';
//      console.log(y);  // 'local'
//    }
//    
//    // 例子3：没有遮蔽
//    let z = 'global';
//    
//    function test3() {
//      console.log(z);  // 'global'（没有声明，访问外层）
//      z = 'modified';
//      console.log(z);  // 'modified'
//    }
//
// 5️⃣ 为什么 let 要有 TDZ？
//
//    // 原因1：避免变量提升的混乱
//    console.log(a);  // var: undefined（容易出 bug）
//    var a = 1;
//    
//    console.log(b);  // let: 报错（强制先声明后使用）
//    let b = 1;
//    
//    // 原因2：const 的一致性
//    console.log(c);  // 如果能访问，c 应该是什么值？
//    const c = 1;     // const 必须在声明时初始化
//    
//    // 原因3：更容易发现错误
//    function calculate() {
//      let result = value * 2;  // ❌ 立即报错，发现 value 未定义
//      let value = 10;
//    }
//
// 6️⃣ 块级作用域的遮蔽
//
//    let a = 1;
//    
//    {
//      console.log(a);  // ❌ ReferenceError
//      let a = 2;       // 块级作用域的 a 遮蔽外层的 a
//      console.log(a);  // 2
//    }
//    
//    console.log(a);  // 1（外层的 a 不受影响）
//    
//    // var 没有块级作用域
//    var b = 1;
//    
//    {
//      console.log(b);  // 1（访问的是外层的 b）
//      var b = 2;       // 实际上修改的是外层的 b
//      console.log(b);  // 2
//    }
//    
//    console.log(b);  // 2（外层的 b 被修改了）
//
// 7️⃣ 经典面试题
//
//    // 题目：输出什么？
//    let x = 10;
//    
//    function foo() {
//      console.log(x);
//      let x = 20;
//    }
//    
//    foo();
//    
//    // 答案：ReferenceError: Cannot access 'x' before initialization
//    // 原因：函数内的 let x 遮蔽了全局的 x，但访问时还在 TDZ 中
//
// 8️⃣ 总结对比
//
//    | 特性 | var | let/const |
//    |------|-----|-----------|
//    | 作用域遮蔽 | ✅ 会遮蔽 | ✅ 会遮蔽 |
//    | 变量提升 | ✅ 提升并初始化为 undefined | ✅ 提升但不初始化 |
//    | 声明前访问 | ✅ 可以（值为 undefined） | ❌ 报错（TDZ） |
//    | 块级作用域 | ❌ 没有 | ✅ 有 |
//    | 重复声明 | ✅ 允许 | ❌ 报错 |
//
// 9️⃣ 最佳实践
//
//    // ✅ 推荐：先声明，后使用
//    function good() {
//      let a = 1;
//      console.log(a);  // 清晰明了
//    }
//    
//    // ❌ 避免：依赖变量提升
//    function bad() {
//      console.log(a);  // 混乱
//      var a = 1;
//    }
//    
//    // ✅ 推荐：使用 let/const 而不是 var
//    // - 块级作用域更清晰
//    // - TDZ 帮助发现错误
//    // - 避免意外的全局变量
//
// 🎯 记忆口诀：
//    「let 也会遮蔽，但有死区限制」
//    「var 能先用后声明，let 必须先声明后用」
//    「遮蔽是作用域规则，TDZ 是访问限制」