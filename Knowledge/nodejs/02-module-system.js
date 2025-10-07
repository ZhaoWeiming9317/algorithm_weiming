/**
 * Node.js 模块系统
 * 考点：CommonJS、ES Module、require、import
 */

console.log('=== CommonJS 模块系统 ===');

// CommonJS 导出方式
// module.exports = { ... }
// exports.name = ...

// CommonJS 导入方式
// const module = require('./module')

/**
 * 1. module.exports vs exports 的区别
 * 
 * - module.exports 是真正的导出对象
 * - exports 是 module.exports 的引用
 * - exports = ... 会断开引用，导致导出失败
 * - module.exports = ... 可以正常导出
 * 
 * 示例：
 */

// ✅ 正确的导出方式
// module.exports = {
//   name: 'test',
//   age: 18
// };

// ✅ 正确的导出方式
// exports.name = 'test';
// exports.age = 18;

// ❌ 错误的导出方式
// exports = {
//   name: 'test',
//   age: 18
// };
// 这样会断开 exports 和 module.exports 的引用

/**
 * 2. require 的特点
 * 
 * - 同步加载
 * - 运行时加载
 * - 值拷贝（导出的是值的拷贝）
 * - 缓存机制（第一次加载后会缓存）
 * - 可以动态加载（可以在条件语句中使用）
 */

// 示例：require 缓存
// const module1 = require('./module');
// const module2 = require('./module'); // 使用缓存，不会重新执行
// console.log(module1 === module2); // true

/**
 * 3. CommonJS vs ES Module
 */

console.log('\n=== CommonJS vs ES Module ===');

const comparison = {
  'CommonJS': {
    '加载方式': '同步加载',
    '加载时机': '运行时加载',
    '导出': 'module.exports / exports',
    '导入': 'require()',
    '值类型': '值拷贝',
    '动态加载': '支持',
    '循环依赖': '可能出现问题',
    '使用场景': 'Node.js 服务端'
  },
  'ES Module': {
    '加载方式': '异步加载',
    '加载时机': '编译时加载',
    '导出': 'export / export default',
    '导入': 'import',
    '值类型': '值引用（动态绑定）',
    '动态加载': 'import() 支持',
    '循环依赖': '更好的处理',
    '使用场景': '浏览器、现代 Node.js'
  }
};

console.table(comparison);

/**
 * 4. 循环依赖问题
 * 
 * CommonJS 循环依赖：
 * - a.js require b.js
 * - b.js require a.js
 * - 可能导致部分导出为 undefined
 * 
 * 解决方案：
 * - 重构代码，避免循环依赖
 * - 延迟 require（在函数内部 require）
 * - 使用 ES Module（更好的循环依赖处理）
 */

/**
 * 5. require 查找规则
 * 
 * 1. 核心模块（如 fs, path, http）
 *    - 直接返回，优先级最高
 * 
 * 2. 文件模块
 *    - 以 ./ 或 ../ 开头
 *    - 按扩展名查找：.js → .json → .node
 * 
 * 3. 第三方模块
 *    - 从当前目录的 node_modules 查找
 *    - 逐级向上查找父目录的 node_modules
 *    - 直到根目录
 * 
 * 4. 目录作为模块
 *    - 查找 package.json 的 main 字段
 *    - 查找 index.js
 *    - 查找 index.json
 *    - 查找 index.node
 */

console.log('\n=== require 查找示例 ===');
console.log("require('fs')        // 核心模块");
console.log("require('./module')  // 文件模块");
console.log("require('express')   // 第三方模块");
console.log("require('./utils')   // 目录作为模块");

/**
 * 6. ES Module 在 Node.js 中的使用
 * 
 * 启用方式：
 * 1. 文件扩展名为 .mjs
 * 2. package.json 中设置 "type": "module"
 * 3. 使用 --input-type=module 标志
 * 
 * 注意事项：
 * - 不能使用 require
 * - 不能使用 __dirname 和 __filename
 * - 需要使用 import.meta.url
 */

/**
 * 面试总结：
 * 
 * 1. module.exports vs exports
 *    - module.exports 是真正的导出
 *    - exports 是引用，不能重新赋值
 * 
 * 2. require 特点
 *    - 同步、运行时、值拷贝、有缓存
 * 
 * 3. CommonJS vs ES Module
 *    - 加载时机：运行时 vs 编译时
 *    - 值类型：拷贝 vs 引用
 *    - 动态加载：支持 vs import()
 * 
 * 4. require 查找顺序
 *    - 核心模块 → 文件模块 → 第三方模块
 * 
 * 5. 循环依赖
 *    - CommonJS 可能出现问题
 *    - ES Module 处理更好
 */
