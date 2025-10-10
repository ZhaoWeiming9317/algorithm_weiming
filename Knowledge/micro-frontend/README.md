# 微前端（Micro Frontend）

## 1. 什么是微前端？

**微前端**是一种将前端应用分解为多个独立、可独立开发、测试、部署的小型应用的架构风格，这些小型应用最终组合成一个完整的应用。

### 核心思想

借鉴后端微服务的理念，将前端应用拆分为多个独立的子应用：

```
传统单体应用：
┌─────────────────────────────────┐
│     Monolithic Frontend App     │
│  (React/Vue/Angular 全家桶)      │
└─────────────────────────────────┘

微前端架构：
┌─────────────────────────────────┐
│        主应用 (Shell)            │
├──────────┬──────────┬───────────┤
│ 子应用A   │ 子应用B   │ 子应用C    │
│ (React)  │ (Vue)    │ (Angular) │
└──────────┴──────────┴───────────┘
```

---

## 2. 为什么需要微前端？

### 痛点场景

#### 场景1：大型单体应用的问题

```javascript
// 单体应用：所有功能耦合在一起
src/
├── modules/
│   ├── user/          // 用户模块
│   ├── order/         // 订单模块
│   ├── product/       // 商品模块
│   ├── analytics/     // 数据分析模块
│   └── admin/         // 管理后台模块
└── App.jsx            // 所有模块都在一个应用里

// 问题：
// 1. 代码库庞大，编译慢（10分钟+）
// 2. 一个模块出错，整个应用崩溃
// 3. 技术栈统一，无法使用新技术
// 4. 多团队协作困难，代码冲突频繁
```

#### 场景2：多团队协作

```
电商平台：
- 团队A：负责商品模块（React）
- 团队B：负责订单模块（Vue）
- 团队C：负责用户中心（Angular）

传统方案：统一技术栈 → 学习成本高，团队不满
微前端方案：各团队独立开发 → 技术栈自由，独立部署
```

### 微前端的优势

| 优势 | 说明 |
|------|------|
| **技术栈无关** | 不同子应用可以使用不同框架（React、Vue、Angular） |
| **独立开发部署** | 子应用独立开发、测试、部署，互不影响 |
| **增量升级** | 可以逐步迁移老项目，不需要一次性重写 |
| **团队自治** | 不同团队负责不同子应用，减少协作成本 |
| **代码隔离** | 子应用之间代码、样式、状态隔离 |

---

## 3. 微前端实现方案

### 方案对比

| 方案                  | 优点         | 缺点                  | 适用场景         |
|----------------------|--------------|----------------------|-----------------|
| **iframe**           | 完全隔离、简单 | 性能差、体验差、通信复杂  | 简单集成第三方应用 |
| **Module Federation**| Webpack 5 原生、共享依赖| 需要 Webpack 5| 现代应用        |

---

## 4. 主流实现方案详解

### 方案1：iframe（最简单）

#### 实现

```html
<!-- 主应用 -->
<!DOCTYPE html>
<html>
<head>
  <title>主应用</title>
</head>
<body>
  <nav>
    <a href="#/app1">应用1</a>
    <a href="#/app2">应用2</a>
  </nav>
  
  <div id="container">
    <iframe id="micro-app" src=""></iframe>
  </div>
  
  <script>
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1);
      const iframe = document.getElementById('micro-app');
      
      if (hash === '/app1') {
        iframe.src = 'http://localhost:3001';
      } else if (hash === '/app2') {
        iframe.src = 'http://localhost:3002';
      }
    });
  </script>
</body>
</html>
```

#### 优点
- ✅ 完全隔离（CSS、JS、全局变量）
- ✅ 实现简单，无需改造子应用
- ✅ 浏览器原生支持

#### 缺点
- ❌ 性能差（每次加载都是新页面）
- ❌ URL 不同步（iframe 内部路由变化不会反映到主应用）
- ❌ 弹窗、遮罩层无法覆盖全屏
- ❌ 通信复杂（postMessage）
- ❌ 刷新会丢失状态

#### 通信方式

```javascript
// 主应用 → 子应用
const iframe = document.getElementById('micro-app');
iframe.contentWindow.postMessage({ type: 'UPDATE_USER', data: user }, '*');

// 子应用 → 主应用
window.parent.postMessage({ type: 'ROUTE_CHANGE', path: '/detail' }, '*');

// 监听消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'UPDATE_USER') {
    console.log('收到用户信息', event.data.data);
  }
});
```

---

### 方案2：Webpack Module Federation ⭐⭐⭐

Webpack 5 原生支持，可以在运行时动态加载其他应用的模块。

#### 概念

```
应用A（Host）                应用B（Remote）
┌──────────────┐            ┌──────────────┐
│  import()    │  ────────→ │  Button 组件  │
│  Button      │            │  Header 组件  │
└──────────────┘            └──────────────┘
     运行时加载                  暴露模块
```

#### 配置示例

```javascript
// app1/webpack.config.js (Host - 消费者)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      remotes: {
        // 远程应用
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        // 共享依赖
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

```javascript
// app2/webpack.config.js (Remote - 提供者)
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app2',
      filename: 'remoteEntry.js',
      exposes: {
        // 暴露的模块
        './Button': './src/components/Button',
        './Header': './src/components/Header'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

#### 使用远程模块

```jsx
// app1/src/App.jsx
import React, { lazy, Suspense } from 'react';

// 动态导入远程模块
const RemoteButton = lazy(() => import('app2/Button'));
const RemoteHeader = lazy(() => import('app2/Header'));

function App() {
  return (
    <div>
      <h1>App1 - Host Application</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <RemoteHeader />
        <RemoteButton onClick={() => alert('Clicked!')}>
          来自 App2 的按钮
        </RemoteButton>
      </Suspense>
    </div>
  );
}

export default App;
```

#### 优点
- ✅ Webpack 5 原生支持
- ✅ 共享依赖，减少重复加载
- ✅ 运行时加载，灵活性高
- ✅ TypeScript 支持好

#### 缺点
- ❌ 需要 Webpack 5
- ❌ 配置相对复杂
- ❌ 调试困难

---

## 5. 微前端核心问题及解决方案

### 问题1：样式隔离

#### 问题
```css
/* 子应用A */
.button { color: red; }

/* 子应用B */
.button { color: blue; } /* 样式冲突！ */
```

#### 解决方案

**方案1：CSS Modules**
```jsx
import styles from './Button.module.css';

<button className={styles.button}>按钮</button>
// 编译后：<button class="Button_button__abc123">
```

**方案2：CSS-in-JS**
```jsx
import styled from 'styled-components';

const Button = styled.button`
  color: red;
`;
```

**方案3：Shadow DOM**
```javascript
// 使用 Shadow DOM 实现完全隔离
const shadow = element.attachShadow({ mode: 'open' });
shadow.innerHTML = '<style>.button { color: red; }</style><button class="button">按钮</button>';
```

**方案4：动态添加前缀（BEM 命名）**
```css
/* 为每个应用添加命名空间 */
.app1-button { color: red; }
.app2-button { color: blue; }
```

---

### 问题2：JS 隔离

#### 问题
```javascript
// 子应用A
window.myVar = 'A';

// 子应用B
console.log(window.myVar); // 'A' - 全局变量污染！
```

#### 解决方案

**方案1：快照沙箱（Snapshot Sandbox）**
```javascript
class SnapshotSandbox {
  constructor() {
    this.windowSnapshot = {};
    this.modifyPropsMap = {};
  }
  
  active() {
    // 保存快照
    for (const prop in window) {
      this.windowSnapshot[prop] = window[prop];
    }
    
    // 恢复上次的修改
    Object.keys(this.modifyPropsMap).forEach(prop => {
      window[prop] = this.modifyPropsMap[prop];
    });
  }
  
  inactive() {
    // 记录修改
    for (const prop in window) {
      if (window[prop] !== this.windowSnapshot[prop]) {
        this.modifyPropsMap[prop] = window[prop];
        window[prop] = this.windowSnapshot[prop]; // 还原
      }
    }
  }
}
```

**方案2：Proxy 沙箱（推荐）**
```javascript
class ProxySandbox {
  constructor() {
    this.fakeWindow = {};
    this.proxy = new Proxy(this.fakeWindow, {
      get(target, key) {
        // 优先从 fakeWindow 取，否则从真实 window 取
        return target[key] || window[key];
      },
      set(target, key, value) {
        // 所有修改都记录在 fakeWindow
        target[key] = value;
        return true;
      }
    });
  }

  active() {
    // 激活沙箱
  }

  inactive() {
    // 失活沙箱
  }
}

// 使用
const sandbox = new ProxySandbox();
with(sandbox.proxy) {
  window.myVar = 'value'; // 不会污染真实 window
}
```

---

### 问题3：应用通信

#### 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **Props** | 简单直接 | 单向传递 | 主应用 → 子应用 |
| **CustomEvent** | 解耦、灵活 | 需要约定事件名 | 任意应用间通信 |
| **全局状态管理** | 统一管理 | 耦合度高 | 共享状态 |
| **LocalStorage** | 持久化 | 同步问题 | 跨标签页通信 |

#### 实现示例

**方案1：CustomEvent**
```javascript
// 子应用A：发送事件
window.dispatchEvent(new CustomEvent('app-message', {
  detail: { type: 'USER_LOGIN', data: { id: 1, name: '张三' } }
}));

// 子应用B：监听事件
window.addEventListener('app-message', (event) => {
  console.log('收到消息', event.detail);
});
```

**方案2：发布订阅模式**
```javascript
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// 全局事件总线
window.eventBus = new EventBus();

// 子应用A
window.eventBus.emit('userLogin', { id: 1, name: '张三' });

// 子应用B
window.eventBus.on('userLogin', (user) => {
  console.log('用户登录', user);
});
```

**方案3：全局状态管理（Redux/Zustand）**
```javascript
// 主应用创建全局 store
import { createStore } from 'redux';

const store = createStore(reducer);
window.__GLOBAL_STORE__ = store;

// 子应用使用
const store = window.__GLOBAL_STORE__;
store.subscribe(() => {
  console.log('状态变化', store.getState());
});
store.dispatch({ type: 'USER_LOGIN', payload: { id: 1 } });
```

---

### 问题4：路由同步

#### 问题
子应用路由变化，主应用 URL 不同步。

#### 解决方案

**手动实现路由同步**
```javascript
// 子应用：监听路由变化
window.addEventListener('popstate', () => {
  // 通知主应用
  window.parent.postMessage({
    type: 'ROUTE_CHANGE',
    path: location.pathname
  }, '*');
});

// 主应用：同步路由
window.addEventListener('message', (event) => {
  if (event.data.type === 'ROUTE_CHANGE') {
    history.pushState(null, '', `/app1${event.data.path}`);
  }
});
```

---

### 问题5：公共依赖

#### 问题
每个子应用都打包 React，导致重复加载。

#### 解决方案

**方案1：externals + CDN**
```javascript
// webpack.config.js
module.exports = {
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
};
```

```html
<!-- 主应用引入 CDN -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
```

**方案2：Module Federation shared**
```javascript
new ModuleFederationPlugin({
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true }
  }
})
```

---

## 6. 常见面试题 ⭐⭐⭐

### Q1: 什么是微前端？为什么需要微前端？

**答案：**

微前端是一种将前端应用拆分为多个独立子应用的架构模式，类似后端微服务。

**需要微前端的场景：**
1. **大型单体应用**：代码库庞大，编译慢，维护困难
2. **多团队协作**：不同团队使用不同技术栈
3. **增量升级**：老项目逐步迁移到新技术
4. **独立部署**：不同模块独立发布，互不影响

**优势：**
- 技术栈无关
- 独立开发部署
- 团队自治
- 增量升级

---

### Q2: 微前端有哪些实现方案？各有什么优缺点？

**答案：**

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **iframe** | 完全隔离、简单 | 性能差、体验差 | 简单集成 |
| **Module Federation** | 共享依赖、灵活 | 需要 Webpack 5 | 现代应用 |

**推荐：**
- 现代应用：**Module Federation**
- 简单集成：**iframe**

---

### Q3: 微前端如何实现 JS 隔离？

**答案：**

**方案1：快照沙箱（Snapshot Sandbox）**
- 激活时保存 window 快照
- 失活时恢复快照
- 缺点：只能单实例

**方案2：Proxy 沙箱（推荐）**
```javascript
class ProxySandbox {
  constructor() {
    this.fakeWindow = {};
    this.proxy = new Proxy(this.fakeWindow, {
      get(target, key) {
        return target[key] || window[key];
      },
      set(target, key, value) {
        target[key] = value; // 修改记录在 fakeWindow
        return true;
      }
    });
  }
}
```

**优点：**
- 支持多实例
- 不污染全局
- 性能好

---

### Q4: 微前端如何实现样式隔离？

**答案：**

**方案1：Shadow DOM**
```javascript
// 使用 Shadow DOM 实现完全隔离
const shadow = element.attachShadow({ mode: 'open' });
shadow.innerHTML = '<style>.button { color: red; }</style>';
```

**方案2：CSS Modules**
```jsx
import styles from './Button.module.css';
<button className={styles.button}>按钮</button>
// 编译后：<button class="Button_button__abc123">
```

**方案3：CSS-in-JS**
```jsx
import styled from 'styled-components';
const Button = styled.button`color: red;`;
```

**方案4：BEM 命名规范**
```css
.app1-button { color: red; }
.app2-button { color: blue; }
```

---

### Q5: 微前端应用之间如何通信？

**答案：**

**方案1：CustomEvent（任意应用间）**
```javascript
// 发送
window.dispatchEvent(new CustomEvent('app-message', { detail: data }));

// 接收
window.addEventListener('app-message', (e) => console.log(e.detail));
```

**方案2：发布订阅模式**
```javascript
class EventBus {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  emit(event, data) {
    this.events[event]?.forEach(cb => cb(data));
  }
}

window.eventBus = new EventBus();
```

**方案3：全局状态管理**
```javascript
// 主应用创建全局 store
window.__GLOBAL_STORE__ = createStore(reducer);

// 子应用使用
window.__GLOBAL_STORE__.dispatch({ type: 'USER_LOGIN' });
```

**方案4：iframe postMessage**
```javascript
// 主应用 → 子应用
iframe.contentWindow.postMessage({ type: 'UPDATE' }, '*');

// 子应用 → 主应用
window.parent.postMessage({ type: 'CHANGE' }, '*');
```

---

### Q6: Module Federation 的核心概念是什么？

**答案：**

**核心概念：**

1. **Host（宿主应用）**：消费远程模块的应用
2. **Remote（远程应用）**：提供模块的应用
3. **Shared（共享依赖）**：多个应用共享的依赖（如 React）
4. **Exposes（暴露模块）**：远程应用暴露的模块
5. **Remotes（远程引用）**：宿主应用引用的远程应用

**优势：**
- 运行时动态加载
- 共享依赖，避免重复加载
- 支持版本控制
- TypeScript 支持好

---

### Q7: 微前端有哪些缺点？

**答案：**

**1. 复杂度增加**
- 需要处理隔离、通信、路由同步
- 调试困难
- 学习成本高

**2. 性能问题**
- 多个应用同时加载，资源增多
- 公共依赖可能重复加载

**3. 维护成本**
- 需要维护主应用和多个子应用
- 版本管理复杂

**4. 用户体验**
- 应用切换可能有白屏
- 需要处理加载状态

**建议：**
- 不是所有项目都需要微前端
- 中小型项目用 Monorepo 可能更合适
- 大型项目、多团队协作才考虑微前端

---

### Q8: 如何优化微前端性能？

**答案：**

**1. 共享依赖（Module Federation）**
```javascript
shared: {
  react: { singleton: true, eager: true },
  'react-dom': { singleton: true, eager: true }
}
```

**2. 预加载子应用**
```javascript
// 在空闲时预加载
const link = document.createElement('link');
link.rel = 'prefetch';
link.href = 'http://localhost:3001/remoteEntry.js';
document.head.appendChild(link);
```

**3. 按需加载**
```javascript
// 使用 React.lazy 动态加载
const RemoteApp = React.lazy(() => import('app2/Component'));
```

**4. 资源缓存**
```javascript
// 设置长期缓存
Cache-Control: max-age=31536000, immutable
```

**5. CDN 加速**
```javascript
// 公共依赖使用 CDN
externals: {
  react: 'React',
  'react-dom': 'ReactDOM'
}
```

**6. 代码分割**
```javascript
// Webpack 代码分割
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

---

### Q9: 微前端和 Monorepo 的区别？

**答案：**

| 对比项 | 微前端 | Monorepo |
|--------|--------|----------|
| **代码组织** | 多个独立仓库 | 单个仓库多个包 |
| **部署** | 独立部署 | 统一部署 |
| **技术栈** | 可以不同 | 通常统一 |
| **隔离** | 运行时隔离 | 编译时隔离 |
| **适用场景** | 大型应用、多团队 | 中小型应用、单团队 |

**选择建议：**
- 中小型项目、单团队 → **Monorepo**
- 大型项目、多团队、不同技术栈 → **微前端**

---

## 7. 最佳实践

### ✅ 推荐做法

1. **合理拆分子应用**
   - 按业务模块拆分（用户、订单、商品）
   - 不要拆分过细（增加复杂度）

2. **统一基础设施**
   - 统一登录认证
   - 统一权限管理
   - 统一监控日志

3. **约定通信协议**
   ```javascript
   // 统一事件格式
   {
     type: 'USER_LOGIN',
     data: { id: 1, name: '张三' },
     timestamp: Date.now()
   }
   ```

4. **做好错误隔离**
   ```javascript
   // 子应用错误不影响主应用
   window.addEventListener('error', (event) => {
     if (event.filename.includes('子应用')) {
       event.preventDefault();
       console.error('子应用错误', event);
     }
   });
   ```

### ❌ 避免做法

1. **不要过度拆分**
   - 拆分过细会增加复杂度
   - 中小型项目不需要微前端

2. **不要忽略性能**
   - 做好预加载、缓存
   - 共享公共依赖

3. **不要忽略用户体验**
   - 处理加载状态
   - 避免白屏

---

## 8. 总结

- **微前端**：将前端应用拆分为多个独立子应用
- **主流方案**：Module Federation、iframe
- **核心问题**：JS 隔离、样式隔离、应用通信、路由同步
- **适用场景**：大型应用、多团队协作、技术栈多样
- **不适用场景**：中小型项目、单团队、统一技术栈

**面试重点：**
1. 微前端概念和优势
2. iframe vs Module Federation 对比
3. JS/CSS 隔离原理（Proxy 沙箱、Shadow DOM）
4. 应用通信方式（CustomEvent、EventBus、全局状态）
5. Module Federation 核心概念和配置
