# import vs require 详解

## 📌 核心区别

| 特性 | require (CommonJS) | import (ES6 Module) |
|------|-------------------|-------------------|
| **标准** | Node.js 标准 | ES6 标准 |
| **加载时机** | 运行时加载 | 编译时加载（静态） |
| **值拷贝** | 值的拷贝 | 值的引用（动态绑定） |
| **导出方式** | `module.exports` / `exports` | `export` / `export default` |
| **缓存** | 有缓存 | 有缓存 |
| **this 指向** | 当前模块 | undefined |
| **动态导入** | 天然支持 | 需要 `import()` 函数 |
| **树摇优化** | 不支持 | 支持 Tree Shaking |

---

## 🔍 详细对比

### 1. 加载时机

#### CommonJS (require)
```javascript
// 运行时加载，可以写在任何地方
if (condition) {
  const module = require('./module'); // ✅ 可以
}

function loadModule() {
  return require('./module'); // ✅ 可以
}

// 可以动态拼接路径
const moduleName = 'module';
require(`./${moduleName}`); // ✅ 可以
```

#### ES6 Module (import)
```javascript
// 编译时加载，必须写在顶层
if (condition) {
  import module from './module'; // ❌ 报错！
}

function loadModule() {
  import module from './module'; // ❌ 报错！
}

// 不能使用变量
const moduleName = 'module';
import module from `./${moduleName}`; // ❌ 报错！

// 必须写在文件顶部
import module from './module'; // ✅ 正确
```

**ES6 动态导入**：
```javascript
// 使用 import() 函数（返回 Promise）
if (condition) {
  import('./module').then(module => {
    // 使用 module
  });
}

// 或者使用 async/await
async function loadModule() {
  const module = await import('./module');
  return module;
}
```

---

### 2. 值拷贝 vs 值引用

这是**最重要的区别**！

#### CommonJS：值的拷贝
```javascript
// counter.js
let count = 0;
function increment() {
  count++;
}
module.exports = { count, increment };

// main.js
const counter = require('./counter');
console.log(counter.count); // 0
counter.increment();
console.log(counter.count); // 0 ⚠️ 还是 0！

// 因为导出的是值的拷贝，不会随原模块变化
```

#### ES6 Module：值的引用（动态绑定）
```javascript
// counter.js
export let count = 0;
export function increment() {
  count++;
}

// main.js
import { count, increment } from './counter';
console.log(count); // 0
increment();
console.log(count); // 1 ✅ 变了！

// 因为导出的是值的引用，会随原模块变化
```

---

### 3. 导出方式

#### CommonJS
```javascript
// 方式1: module.exports（推荐）
module.exports = {
  name: 'zhangsan',
  age: 18
};

// 方式2: exports（是 module.exports 的引用）
exports.name = 'zhangsan';
exports.age = 18;

// ⚠️ 注意：不能直接赋值 exports
exports = { name: 'zhangsan' }; // ❌ 无效！
// 因为这样会切断 exports 和 module.exports 的引用关系

// 方式3: 单个导出
module.exports = function() {
  console.log('hello');
};
```

#### ES6 Module
```javascript
// 命名导出
export const name = 'zhangsan';
export const age = 18;
export function sayHi() { }

// 统一导出
const name = 'zhangsan';
const age = 18;
export { name, age };

// 默认导出（一个文件只能有一个）
export default {
  name: 'zhangsan',
  age: 18
};

// 混合导出
export const name = 'zhangsan';
export default function() { }
```

---

### 4. 导入方式

#### CommonJS
```javascript
// 整体导入
const module = require('./module');

// 解构导入（本质是对象解构）
const { name, age } = require('./module');

// 重命名
const { name: userName } = require('./module');
```

#### ES6 Module
```javascript
// 默认导入（名字随意）
import module from './module';
import anyName from './module'; // 名字可以不一样

// 命名导入（名字必须一致）
import { name, age } from './module';

// 重命名
import { name as userName } from './module';

// 混合导入
import module, { name, age } from './module';

// 整体导入
import * as module from './module';
```

---

### 5. 循环依赖

#### CommonJS
```javascript
// a.js
const b = require('./b');
console.log('a:', b.value);
exports.value = 'a';

// b.js
const a = require('./a');
console.log('b:', a.value); // undefined ⚠️
exports.value = 'b';

// main.js
require('./a');
// 输出：
// b: undefined
// a: b

// 原因：require 是同步的，第一次执行到 b.js 时，
// a.js 还没执行完，所以 a.value 是 undefined
```

#### ES6 Module
```javascript
// a.js
import { value as bValue } from './b';
console.log('a:', bValue);
export const value = 'a';

// b.js
import { value as aValue } from './a';
console.log('b:', aValue); // ⚠️ ReferenceError!
export const value = 'b';

// 原因：ES6 模块是静态解析，会提前建立依赖关系
// 但值还没初始化，所以会报错
```

---

### 6. Tree Shaking

#### CommonJS：不支持
```javascript
// utils.js
module.exports = {
  func1() { },
  func2() { },
  func3() { }
};

// main.js
const { func1 } = require('./utils');

// ❌ 打包时会把整个 utils.js 打包进来
// 即使只用了 func1，func2 和 func3 也会被打包
```

#### ES6 Module：支持 Tree Shaking
```javascript
// utils.js
export function func1() { }
export function func2() { }
export function func3() { }

// main.js
import { func1 } from './utils';

// ✅ 打包时只会打包 func1
// func2 和 func3 会被 Tree Shaking 移除
```

---

### 7. this 指向

#### CommonJS
```javascript
// module.js
console.log(this === module.exports); // true
console.log(this === exports); // true
```

#### ES6 Module
```javascript
// module.js
console.log(this); // undefined
```

---

### 8. Node.js 中的使用

#### 默认使用 CommonJS
```javascript
// package.json 中不设置 type，或设置为 commonjs
{
  "type": "commonjs" // 默认值
}

// 此时 .js 文件使用 CommonJS
const module = require('./module');
```

#### 使用 ES6 Module
```javascript
// 方式1: package.json 中设置 type
{
  "type": "module"
}
// 此时 .js 文件使用 ES6 Module
import module from './module.js'; // ⚠️ 必须加 .js 后缀

// 方式2: 使用 .mjs 扩展名
// module.mjs
export const name = 'zhangsan';

// main.mjs
import { name } from './module.mjs';
```

#### 混合使用
```javascript
// package.json
{
  "type": "module"
}

// 如果想在 ES6 Module 项目中使用 CommonJS
// 使用 .cjs 扩展名
// module.cjs
module.exports = { name: 'zhangsan' };

// main.js (ES6 Module)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const module = require('./module.cjs');
```

---

## 🎯 面试高频问题

### Q1: require 和 import 的本质区别是什么？

**答**：
1. **加载时机**：require 是运行时加载，import 是编译时加载
2. **值拷贝 vs 引用**：require 导出值的拷贝，import 导出值的引用
3. **Tree Shaking**：import 支持 Tree Shaking，require 不支持

### Q2: 为什么 ES6 Module 支持 Tree Shaking？

**答**：
因为 import 是静态的，在编译时就能确定模块依赖关系和导入导出的变量，所以打包工具可以分析出哪些代码没被使用，从而删除（Tree Shaking）。

而 require 是动态的，只有在运行时才知道导入什么，所以无法做静态分析。

### Q3: CommonJS 的 exports 和 module.exports 有什么区别？

**答**：
```javascript
// 初始时
exports === module.exports // true

// exports 是 module.exports 的引用
// 可以这样用：
exports.name = 'zhangsan'; // ✅
module.exports.name = 'zhangsan'; // ✅

// 不能直接赋值 exports
exports = { name: 'zhangsan' }; // ❌ 无效

// 因为这样会切断引用关系
// 最终导出的是 module.exports
```

### Q4: ES6 Module 中如何实现动态导入？

**答**：
```javascript
// 使用 import() 函数（返回 Promise）
const module = await import('./module.js');

// 或
import('./module.js').then(module => {
  // 使用 module
});

// 常用场景：路由懒加载
const Home = () => import('./views/Home.vue');
```

---

## 💡 最佳实践

### 1. 优先使用 ES6 Module

```javascript
// ✅ 推荐
import { func } from './utils';

// ❌ 不推荐（除非有特殊需求）
const { func } = require('./utils');
```

**原因**：
- 支持 Tree Shaking
- 是未来标准
- 静态分析，更容易优化

### 2. Node.js 项目设置

```json
// package.json
{
  "type": "module" // 使用 ES6 Module
}
```

### 3. 注意文件后缀

```javascript
// ES6 Module 必须加后缀
import module from './module.js'; // ✅
import module from './module';    // ❌

// CommonJS 可以省略
const module = require('./module'); // ✅
```

### 4. 避免循环依赖

```javascript
// ❌ 不好
// a.js
import { b } from './b';

// b.js
import { a } from './a';

// ✅ 好：重新设计模块结构
// utils.js（公共模块）
export const shared = {};

// a.js
import { shared } from './utils';

// b.js
import { shared } from './utils';
```

---

## 📊 快速记忆表

| 场景 | 使用 require | 使用 import |
|------|-------------|------------|
| Node.js 服务端 | ✅ 可以 | ✅ 推荐 |
| 浏览器（需打包） | ❌ 需转译 | ✅ 推荐 |
| 动态导入 | ✅ 天然支持 | ⚠️ 用 import() |
| Tree Shaking | ❌ 不支持 | ✅ 支持 |
| 条件导入 | ✅ 可以 | ⚠️ 用 import() |
| 老项目 | ✅ 兼容性好 | ⚠️ 需配置 |

---

## 🔑 面试必背

**三句话总结**：
1. **require 是运行时加载，import 是编译时加载**
2. **require 导出值的拷贝，import 导出值的引用**
3. **import 支持 Tree Shaking，require 不支持**

记住这三点，面试稳了！🚀

