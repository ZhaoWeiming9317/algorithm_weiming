# Tree Shaking 详解

## 1. 什么是 Tree Shaking

Tree Shaking 是一种通过**静态分析**消除 JavaScript 中未使用代码（Dead Code）的优化技术。

### 1.1 基本概念

```javascript
// utils.js - 导出多个函数
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

// main.js - 只使用一个函数
import { add } from './utils.js';

console.log(add(1, 2));

// 打包后（Tree Shaking 生效）
// 只包含 add 函数，subtract 和 multiply 被移除
```

### 1.2 名称由来

- **Tree**：模块依赖关系形成的树状结构
- **Shaking**：摇晃树，让枯叶（未使用的代码）掉落

## 2. Tree Shaking 原理

### 2.1 依赖 ES6 模块

Tree Shaking 依赖 ES6 模块的**静态结构**特性：

```javascript
// ✅ ES6 模块 - 静态导入（可以 Tree Shaking）
import { add } from './utils';

// ❌ CommonJS - 动态导入（无法 Tree Shaking）
const utils = require('./utils');
const add = utils.add;

// ❌ 动态导入（无法静态分析）
if (condition) {
  import('./utils');
}
```

### 2.2 静态分析

Webpack 在编译时分析模块依赖：

```javascript
// 1. 标记导出
export function used() { }      // ← 被使用
export function unused() { }    // ← 未被使用

// 2. 标记导入
import { used } from './module';  // ← 只导入 used

// 3. 移除未使用的导出
// 最终打包结果只包含 used 函数
```

### 2.3 DCE (Dead Code Elimination)

Tree Shaking 分两步：

1. **标记**：Webpack 标记未使用的导出
2. **删除**：Terser/UglifyJS 删除标记的代码

```javascript
// Webpack 标记后的代码
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "used": () => (/* binding */ used),
/* harmony export */   "unused": () => (/* binding */ unused)  // ← 标记为未使用
/* harmony export */ });

// Terser 压缩后
// unused 函数被完全删除
```

## 3. Webpack 配置

### 3.1 基础配置

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // 自动启用 Tree Shaking
  
  optimization: {
    usedExports: true,        // 标记未使用的导出
    minimize: true,           // 启用代码压缩
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            dead_code: true,  // 移除死代码
            unused: true      // 移除未使用的变量
          }
        }
      })
    ],
    
    // 副作用配置
    sideEffects: true  // 读取 package.json 的 sideEffects 字段
  }
};
```

### 3.2 package.json 配置

```json
{
  "name": "my-library",
  "sideEffects": false  // 所有模块都没有副作用，可以安全删除
}

// 或者指定有副作用的文件
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}
```

## 4. Tree Shaking 的弊端和限制

### 4.1 副作用（Side Effects）问题

#### 问题 1：CSS 导入被删除

```javascript
// index.js
import './styles.css';  // ← 可能被删除！

// 解决方案：在 package.json 中标记
{
  "sideEffects": ["*.css", "*.scss"]
}
```

#### 问题 2：Polyfill 被删除

```javascript
// polyfills.js
Array.prototype.includes = function() { /* ... */ };

// main.js
import './polyfills';  // ← 可能被删除！

// 解决方案
{
  "sideEffects": ["./src/polyfills.js"]
}
```

#### 问题 3：全局副作用

```javascript
// analytics.js
window.analytics = {
  track(event) {
    console.log(event);
  }
};

// 即使没有显式使用，也不应该被删除
export const init = () => {
  console.log('Analytics initialized');
};
```

### 4.2 动态导入无法优化

```javascript
// ❌ 无法 Tree Shaking
const moduleName = condition ? 'moduleA' : 'moduleB';
import(moduleName).then(module => {
  // 两个模块都会被打包
});

// ❌ 条件导入
if (process.env.NODE_ENV === 'development') {
  import('./devTools');  // 生产环境仍会打包
}
```

### 4.3 CommonJS 模块无法优化

```javascript
// ❌ CommonJS - 无法 Tree Shaking
const utils = require('./utils');
console.log(utils.add(1, 2));

// ✅ ES6 模块 - 可以 Tree Shaking
import { add } from './utils';
console.log(add(1, 2));
```

### 4.4 类的方法无法完全优化

```javascript
// utils.js
export class Utils {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
  multiply(a, b) { return a * b; }
}

// main.js
import { Utils } from './utils';
const utils = new Utils();
console.log(utils.add(1, 2));

// ❌ 问题：整个类都会被打包，包括未使用的方法
// 原因：无法静态分析类的方法调用

// ✅ 解决方案：导出独立函数
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
```

### 4.5 第三方库的问题

#### 问题 1：库未使用 ES6 模块

```javascript
// ❌ Lodash 的 CommonJS 版本
import _ from 'lodash';
_.add(1, 2);  // 整个 lodash 都会被打包（~70KB）

// ✅ 使用 ES6 模块版本
import add from 'lodash-es/add';
add(1, 2);  // 只打包 add 函数
```

#### 问题 2：库没有标记副作用

```javascript
// 某些库的 package.json 没有 sideEffects 字段
// Webpack 会保守地保留所有代码

// 解决方案：在项目的 webpack.config.js 中配置
module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      include: /node_modules\/some-library/,
      sideEffects: false
    }]
  }
};
```

### 4.6 Babel 转换导致失效

```javascript
// 源代码（ES6）
export function add(a, b) {
  return a + b;
}

// Babel 转换后（CommonJS）
exports.add = function add(a, b) {
  return a + b;
};

// ❌ 转换为 CommonJS 后无法 Tree Shaking

// 解决方案：配置 Babel 保留 ES6 模块
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false  // 不转换模块语法
    }]
  ]
}
```

### 4.7 对象解构导致失效

```javascript
// utils.js
export const utils = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

// main.js
import { utils } from './utils';
const { add } = utils;
console.log(add(1, 2));

// ❌ 问题：整个 utils 对象都会被打包
// 原因：对象属性的访问是动态的

// ✅ 解决方案：导出独立的命名导出
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

### 4.8 重新导出（Re-export）的问题

```javascript
// utils/index.js
export * from './math';    // 重新导出所有
export * from './string';

// main.js
import { add } from './utils';

// ❌ 问题：可能导致过度打包
// 某些打包工具无法正确分析 export *

// ✅ 解决方案：显式导出
export { add, subtract } from './math';
export { trim, capitalize } from './string';
```

## 5. 最佳实践

### 5.1 编写可 Tree Shaking 的代码

```javascript
// ✅ 使用命名导出
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// ❌ 避免默认导出对象
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// ✅ 避免副作用
// bad
let count = 0;
export function increment() {
  return ++count;
}

// good
export function increment(count) {
  return count + 1;
}
```

### 5.2 正确配置 sideEffects

```json
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "*.less",
    "./src/polyfills.js",
    "./src/global-setup.js"
  ]
}
```

### 5.3 使用支持 Tree Shaking 的库

```javascript
// ❌ 不推荐
import _ from 'lodash';

// ✅ 推荐
import debounce from 'lodash-es/debounce';

// ✅ 或使用 babel-plugin-lodash
import { debounce } from 'lodash';
// 自动转换为：import debounce from 'lodash/debounce';
```

### 5.4 避免 Babel 破坏 Tree Shaking

```javascript
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false,  // 保留 ES6 模块语法
      "targets": {
        "esmodules": true  // 针对支持 ES6 模块的浏览器
      }
    }]
  ]
}
```

### 5.5 检查打包结果

```bash
# 使用 webpack-bundle-analyzer 分析
npm install --save-dev webpack-bundle-analyzer

# webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};

# 或使用命令行工具
npx webpack-bundle-analyzer dist/stats.json
```

## 6. 调试 Tree Shaking

### 6.1 查看 Webpack 标记

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    minimize: false  // 暂时禁用压缩，查看标记结果
  }
};

// 打包后查看输出
// 会看到类似注释：
/* unused harmony export subtract */
```

### 6.2 使用 webpack-stats

```bash
# 生成统计文件
webpack --profile --json > stats.json

# 上传到 https://webpack.github.io/analyse/
# 查看模块依赖关系
```

### 6.3 检查 package.json

```javascript
// 检查依赖库是否支持 Tree Shaking
const pkg = require('some-library/package.json');
console.log(pkg.sideEffects);  // 应该是 false 或数组
console.log(pkg.module);       // 应该指向 ES6 模块入口
```

## 7. 实际案例

### 7.1 优化前后对比

```javascript
// 优化前
import _ from 'lodash';
_.debounce(fn, 100);
// 打包大小：70KB

// 优化后
import debounce from 'lodash-es/debounce';
debounce(fn, 100);
// 打包大小：2KB
```

### 7.2 React 项目优化

```javascript
// ❌ 不推荐
import * as antd from 'antd';
const { Button } = antd;

// ✅ 推荐
import { Button } from 'antd';

// 配合 babel-plugin-import
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "style": true  // 自动导入样式
    }]
  ]
}

// 自动转换为：
import Button from 'antd/es/button';
import 'antd/es/button/style';
```

## 8. 总结

### 8.1 Tree Shaking 的优势

- ✅ 减小打包体积
- ✅ 提升加载性能
- ✅ 自动化优化

### 8.2 Tree Shaking 的弊端

| 弊端 | 说明 | 解决方案 |
|-----|------|---------|
| **副作用难以识别** | CSS、Polyfill 可能被误删 | 配置 `sideEffects` |
| **CommonJS 不支持** | 无法静态分析 | 使用 ES6 模块 |
| **类方法无法优化** | 整个类都会被打包 | 使用独立函数 |
| **第三方库兼容性** | 部分库不支持 | 选择支持的库 |
| **Babel 转换问题** | 转换为 CommonJS 后失效 | 配置 `modules: false` |
| **动态导入失效** | 无法静态分析 | 避免动态导入 |
| **配置复杂** | 需要正确配置多个选项 | 使用 `mode: 'production'` |
| **调试困难** | 不清楚为什么没生效 | 使用分析工具 |

### 8.3 关键要点

1. **依赖 ES6 模块**：必须使用 `import/export`
2. **静态分析**：导入导出必须是静态的
3. **副作用标记**：正确配置 `sideEffects`
4. **生产模式**：`mode: 'production'` 自动启用
5. **代码压缩**：需要配合 Terser 等工具
6. **库的支持**：选择支持 Tree Shaking 的库

### 8.4 检查清单

```javascript
// 1. 使用 ES6 模块
import { add } from './utils';  // ✅

// 2. 配置 Babel
{
  "presets": [["@babel/preset-env", { "modules": false }]]
}

// 3. 配置 package.json
{
  "sideEffects": false
}

// 4. 配置 Webpack
{
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true
  }
}

// 5. 使用支持的库
import debounce from 'lodash-es/debounce';  // ✅
```

### 8.5 何时不使用 Tree Shaking

- 开发环境（影响调试）
- 代码有大量副作用
- 使用大量 CommonJS 模块
- 动态导入为主的应用

Tree Shaking 是强大的优化工具，但需要理解其原理和限制，才能正确使用并避免踩坑。
