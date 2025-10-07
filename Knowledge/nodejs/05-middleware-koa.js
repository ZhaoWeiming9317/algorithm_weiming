/**
 * Node.js 中间件机制
 * 考点：Express/Koa 中间件、洋葱模型
 */

console.log('=== 中间件的概念 ===');

/**
 * 1. 什么是中间件？
 * 
 * 中间件是一个函数，可以访问请求对象（req）、响应对象（res）
 * 和应用程序请求-响应周期中的下一个中间件函数（next）
 * 
 * 作用：
 * - 执行任何代码
 * - 修改请求和响应对象
 * - 结束请求-响应周期
 * - 调用下一个中间件
 */

/**
 * 2. Express 中间件
 * 
 * Express 中间件是线性模型
 */

console.log('\n=== Express 中间件示例 ===');

// const express = require('express');
// const app = express();

// // 应用级中间件
// app.use((req, res, next) => {
//   console.log('中间件1');
//   next();
// });

// // 路由级中间件
// app.get('/user', (req, res, next) => {
//   console.log('路由中间件');
//   next();
// }, (req, res) => {
//   res.send('User');
// });

// // 错误处理中间件
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

/**
 * 3. Koa 中间件（洋葱模型）
 * 
 * Koa 中间件是洋葱模型，使用 async/await
 */

console.log('\n=== Koa 洋葱模型 ===');

// const Koa = require('koa');
// const app = new Koa();

// app.use(async (ctx, next) => {
//   console.log('1. 中间件1 开始');
//   await next();
//   console.log('6. 中间件1 结束');
// });

// app.use(async (ctx, next) => {
//   console.log('2. 中间件2 开始');
//   await next();
//   console.log('5. 中间件2 结束');
// });

// app.use(async (ctx, next) => {
//   console.log('3. 中间件3 开始');
//   await next();
//   console.log('4. 中间件3 结束');
// });

// 输出顺序：1 → 2 → 3 → 4 → 5 → 6

/**
 * 4. 手写 Koa 洋葱模型
 */

console.log('\n=== 手写洋葱模型 ===');

class Koa {
  constructor() {
    this.middlewares = [];
  }
  
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }
  
  compose(middlewares) {
    return function(context) {
      function dispatch(index) {
        if (index >= middlewares.length) {
          return Promise.resolve();
        }
        
        const middleware = middlewares[index];
        
        return Promise.resolve(
          middleware(context, () => dispatch(index + 1))
        );
      }
      
      return dispatch(0);
    };
  }
  
  handleRequest(context) {
    const fn = this.compose(this.middlewares);
    return fn(context);
  }
}

// 测试
const app = new Koa();

app.use(async (ctx, next) => {
  console.log('1. 中间件1 开始');
  await next();
  console.log('6. 中间件1 结束');
});

app.use(async (ctx, next) => {
  console.log('2. 中间件2 开始');
  await next();
  console.log('5. 中间件2 结束');
});

app.use(async (ctx, next) => {
  console.log('3. 中间件3 开始');
  ctx.body = 'Hello World';
  console.log('4. 中间件3 结束');
});

const context = {};
app.handleRequest(context).then(() => {
  console.log('请求处理完成');
  console.log('响应体:', context.body);
});

/**
 * 5. Express vs Koa
 */

console.log('\n=== Express vs Koa 对比 ===');

const comparison = {
  'Express': {
    '中间件模型': '线性模型',
    '异步处理': '回调函数',
    '错误处理': '错误处理中间件',
    '响应机制': 'res.send()',
    '内置功能': '路由、模板引擎等',
    '体积': '较大',
    '学习曲线': '较平缓'
  },
  'Koa': {
    '中间件模型': '洋葱模型',
    '异步处理': 'async/await',
    '错误处理': 'try/catch',
    '响应机制': 'ctx.body',
    '内置功能': '极简，需要中间件',
    '体积': '较小',
    '学习曲线': '较陡峭'
  }
};

console.table(comparison);

/**
 * 6. 常用中间件
 */

console.log('\n=== 常用中间件 ===');

console.log('Express 常用中间件：');
console.log('- body-parser：解析请求体');
console.log('- cookie-parser：解析 Cookie');
console.log('- express-session：会话管理');
console.log('- morgan：日志记录');
console.log('- cors：跨域处理');
console.log('- helmet：安全相关');

console.log('\nKoa 常用中间件：');
console.log('- koa-router：路由');
console.log('- koa-bodyparser：解析请求体');
console.log('- koa-static：静态文件服务');
console.log('- koa-session：会话管理');
console.log('- koa-logger：日志记录');
console.log('- koa-cors：跨域处理');

/**
 * 7. 中间件的执行顺序
 */

console.log('\n=== 中间件执行顺序 ===');

// Express 线性模型
console.log('Express（线性）：');
console.log('中间件1 → 中间件2 → 中间件3 → 响应');

// Koa 洋葱模型
console.log('\nKoa（洋葱）：');
console.log('中间件1开始 → 中间件2开始 → 中间件3开始');
console.log('中间件3结束 → 中间件2结束 → 中间件1结束');

/**
 * 面试总结：
 * 
 * 1. 中间件的作用
 *    - 处理请求和响应
 *    - 修改请求和响应对象
 *    - 结束请求-响应周期
 *    - 调用下一个中间件
 * 
 * 2. Express vs Koa
 *    - Express：线性模型，回调函数
 *    - Koa：洋葱模型，async/await
 * 
 * 3. 洋葱模型的优势
 *    - 更好的异步流程控制
 *    - 更清晰的错误处理
 *    - 可以在响应前后执行代码
 * 
 * 4. 洋葱模型的实现原理
 *    - 递归调用中间件
 *    - 使用 Promise 和 async/await
 *    - next() 调用下一个中间件
 * 
 * 5. 中间件的应用场景
 *    - 日志记录
 *    - 身份验证
 *    - 错误处理
 *    - 请求解析
 *    - 响应压缩
 *    - 跨域处理
 */

/**
 * 8. 手写简单的 Express 中间件系统
 */

console.log('\n=== 手写 Express 中间件 ===');

class Express {
  constructor() {
    this.middlewares = [];
  }
  
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }
  
  handleRequest(req, res) {
    let index = 0;
    
    const next = () => {
      if (index >= this.middlewares.length) {
        return;
      }
      
      const middleware = this.middlewares[index++];
      middleware(req, res, next);
    };
    
    next();
  }
}

// 测试
const expressApp = new Express();

expressApp.use((req, res, next) => {
  console.log('Express 中间件1');
  next();
});

expressApp.use((req, res, next) => {
  console.log('Express 中间件2');
  next();
});

expressApp.use((req, res, next) => {
  console.log('Express 中间件3');
  res.body = 'Response';
});

const req = {};
const res = {};
expressApp.handleRequest(req, res);
console.log('响应:', res.body);
