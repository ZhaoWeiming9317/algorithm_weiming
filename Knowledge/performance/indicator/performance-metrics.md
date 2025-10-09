# 前端性能优化指标详解

## 📌 核心性能指标概览

### Web Vitals（核心指标）

Google 提出的三大核心指标（2020年5月）：

| 指标 | 英文 | 含义 | 标准值 | 测量内容 |
|------|------|------|--------|----------|
| **LCP** | Largest Contentful Paint | 最大内容绘制 | < 2.5s | 加载性能 |
| **FID** | First Input Delay | 首次输入延迟 | < 100ms | 交互性能 |
| **CLS** | Cumulative Layout Shift | 累积布局偏移 | < 0.1 | 视觉稳定性 |

**2024年新增指标**：
- **INP** (Interaction to Next Paint): 交互到下一次绘制，替代 FID

---

## 🎯 详细指标说明

### 1. LCP - Largest Contentful Paint (最大内容绘制)

**定义**：页面开始加载到最大文本块或图像元素在屏幕上完成渲染的时间。

**标准**：
- ✅ 优秀：< 2.5 秒
- ⚠️ 需要改进：2.5 - 4 秒
- ❌ 差：> 4 秒

**影响因素**：
- 服务器响应时间
- CSS 阻塞渲染
- 资源加载时间
- 客户端渲染

**优化方法**：
```javascript
// 1. 预加载关键资源
<link rel="preload" as="image" href="/hero.jpg">

// 2. 使用 CDN
<img src="https://cdn.example.com/image.jpg">

// 3. 图片优化
<img 
  src="image.jpg" 
  srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  sizes="(max-width: 640px) 100vw, 640px"
  loading="lazy"
>

// 4. 服务端渲染 (SSR)
// 减少客户端渲染时间
```

**测量方法**：
```javascript
// 使用 PerformanceObserver
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });

// 或使用 web-vitals 库
import { onLCP } from 'web-vitals';
onLCP(console.log);
```

---

### 2. FID - First Input Delay (首次输入延迟)

**定义**：用户首次与页面交互（点击链接、按钮等）到浏览器实际响应的时间。

**标准**：
- ✅ 优秀：< 100 毫秒
- ⚠️ 需要改进：100 - 300 毫秒
- ❌ 差：> 300 毫秒

**影响因素**：
- JavaScript 执行时间过长
- 主线程被阻塞
- 大型第三方脚本

**优化方法**：
```javascript
// 1. 代码分割
// React 路由懒加载
const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

// 2. 使用 Web Worker 处理耗时任务
const worker = new Worker('worker.js');
worker.postMessage({ data: largeData });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// 3. 延迟非关键 JavaScript
<script src="analytics.js" defer></script>

// 4. 减少 JavaScript 执行时间
// 使用 requestIdleCallback
requestIdleCallback(() => {
  // 执行非关键任务
  doNonCriticalWork();
});
```

**测量方法**：
```javascript
import { onFID } from 'web-vitals';
onFID(console.log);
```

---

### 3. INP - Interaction to Next Paint (交互到下一次绘制)

**定义**：从用户交互（点击、触摸、键盘）到下一帧绘制的时间（2024年替代FID）。

**标准**：
- ✅ 优秀：< 200 毫秒
- ⚠️ 需要改进：200 - 500 毫秒
- ❌ 差：> 500 毫秒

**优化方法**：
```javascript
// 1. 使用防抖/节流
const handleSearch = debounce((query) => {
  // 搜索逻辑
}, 300);

// 2. 优化事件处理器
button.addEventListener('click', () => {
  // 立即反馈
  button.classList.add('loading');
  
  // 异步处理耗时操作
  requestAnimationFrame(() => {
    doHeavyWork();
    button.classList.remove('loading');
  });
});

// 3. 使用 CSS 而非 JavaScript 动画
// ✅ 使用 transform (GPU 加速)
element.style.transform = 'translateX(100px)';

// ❌ 避免使用 left (触发重排)
element.style.left = '100px';
```

**测量方法**：
```javascript
import { onINP } from 'web-vitals';
onINP(console.log);
```

---

### 4. CLS - Cumulative Layout Shift (累积布局偏移)

**定义**：页面整个生命周期中，所有意外布局偏移的累积分数。

**标准**：
- ✅ 优秀：< 0.1
- ⚠️ 需要改进：0.1 - 0.25
- ❌ 差：> 0.25

**计算公式**：
```
CLS = 影响分数 × 距离分数
```

**影响因素**：
- 无尺寸的图片/视频
- 动态注入的内容
- 网页字体加载
- 动态广告

**优化方法**：
```html
<!-- 1. 为图片/视频设置宽高 -->
<img src="hero.jpg" width="800" height="600" alt="Hero">

<!-- 2. 使用 aspect-ratio -->
<style>
  .image-container {
    aspect-ratio: 16 / 9;
  }
</style>

<!-- 3. 预留广告位空间 -->
<div class="ad-placeholder" style="min-height: 250px;">
  <!-- 广告内容 -->
</div>

<!-- 4. 字体优化 -->
<link rel="preload" href="/fonts/font.woff2" as="font" crossorigin>
<style>
  @font-face {
    font-family: 'MyFont';
    src: url('/fonts/font.woff2') format('woff2');
    font-display: optional; /* 避免字体闪烁 */
  }
</style>

<!-- 5. 使用 transform 做动画 -->
<style>
  .animate {
    /* ✅ 不会触发布局偏移 */
    transform: translateY(100px);
    
    /* ❌ 会触发布局偏移 */
    /* top: 100px; */
  }
</style>
```

**测量方法**：
```javascript
let clsValue = 0;
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
      console.log('CLS:', clsValue);
    }
  }
});
observer.observe({ entryTypes: ['layout-shift'] });

// 或使用 web-vitals 库
import { onCLS } from 'web-vitals';
onCLS(console.log);
```

---

## 📊 其他重要性能指标

### 5. FCP - First Contentful Paint (首次内容绘制)

**定义**：从页面开始加载到首次内容（文本、图像、SVG等）渲染的时间。

**标准**：
- ✅ 优秀：< 1.8 秒
- ⚠️ 需要改进：1.8 - 3 秒
- ❌ 差：> 3 秒

**优化**：
```javascript
// 1. 内联关键 CSS
<style>
  /* 首屏关键样式 */
  .header { ... }
</style>

// 2. 移除阻塞渲染的资源
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">

// 3. 压缩资源
// 使用 gzip/brotli 压缩
```

---

### 6. TTI - Time to Interactive (可交互时间)

**定义**：页面从开始加载到完全可交互的时间。

**标准**：
- ✅ 优秀：< 3.8 秒
- ⚠️ 需要改进：3.8 - 7.3 秒
- ❌ 差：> 7.3 秒

**优化**：
```javascript
// 1. 减少主线程工作
// 使用 Code Splitting
import(/* webpackChunkName: "heavy" */ './heavy-module')
  .then(module => module.init());

// 2. 最小化第三方脚本
// 异步加载
<script async src="analytics.js"></script>

// 3. 使用 Service Worker 缓存
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

---

### 7. TBT - Total Blocking Time (总阻塞时间)

**定义**：FCP 和 TTI 之间，主线程被阻塞超过 50ms 的总时间。

**标准**：
- ✅ 优秀：< 200 毫秒
- ⚠️ 需要改进：200 - 600 毫秒
- ❌ 差：> 600 毫秒

**优化**：
```javascript
// 1. 拆分长任务
function processLargeArray(array) {
  const chunk = 100;
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + chunk, array.length);
    for (; index < end; index++) {
      // 处理数组项
      processItem(array[index]);
    }
    
    if (index < array.length) {
      // 让出主线程
      setTimeout(processChunk, 0);
    }
  }
  
  processChunk();
}

// 2. 使用 requestIdleCallback
function doWork(deadline) {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift();
    task();
  }
  
  if (tasks.length > 0) {
    requestIdleCallback(doWork);
  }
}
requestIdleCallback(doWork);
```

---

### 8. Speed Index (速度指数)

**定义**：页面内容可见填充的速度。

**标准**：
- ✅ 优秀：< 3.4 秒
- ⚠️ 需要改进：3.4 - 5.8 秒
- ❌ 差：> 5.8 秒

---

## 🛠️ 性能监控工具

### 1. Chrome DevTools

```javascript
// Performance 面板
// 1. 打开 DevTools
// 2. Performance 标签
// 3. 点击录制
// 4. 执行操作
// 5. 停止录制

// Lighthouse
// 1. DevTools > Lighthouse
// 2. 选择设备和类型
// 3. 生成报告
```

### 2. Web Vitals 库

```javascript
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
  
  // 发送到分析服务
  navigator.sendBeacon('/analytics', body);
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### 3. Performance API

```javascript
// 获取导航时间
const navigationTiming = performance.getEntriesByType('navigation')[0];
console.log('DNS 查询:', navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart);
console.log('TCP 连接:', navigationTiming.connectEnd - navigationTiming.connectStart);
console.log('请求响应:', navigationTiming.responseEnd - navigationTiming.requestStart);
console.log('DOM 解析:', navigationTiming.domComplete - navigationTiming.domInteractive);

// 获取资源加载时间
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(`${resource.name}: ${resource.duration}ms`);
});

// 自定义性能标记
performance.mark('task-start');
doTask();
performance.mark('task-end');
performance.measure('task-duration', 'task-start', 'task-end');

const measures = performance.getEntriesByName('task-duration');
console.log('任务耗时:', measures[0].duration);
```

---

## 📈 性能预算

**定义**：为页面设定性能目标，超过预算则报警。

### 设置性能预算

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 250000, // 单个资源 250KB
    maxEntrypointSize: 400000, // 入口文件 400KB
    hints: 'error' // 超出预算报错
  }
};

// lighthouse-ci 配置
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

---

## 🎯 不同场景的优化重点

### 1. 电商网站
- **重点**：LCP（首屏图片）、CLS（商品列表）
- **目标**：LCP < 2s, CLS < 0.05

### 2. 新闻网站
- **重点**：FCP（快速显示内容）、TBT（广告脚本）
- **目标**：FCP < 1.5s, TBT < 150ms

### 3. SPA 应用
- **重点**：TTI（可交互时间）、FID/INP（交互响应）
- **目标**：TTI < 3s, INP < 200ms

### 4. 移动端应用
- **重点**：全面优化（网络慢、设备性能低）
- **目标**：所有指标都要达标

---

## 🔑 面试必背

### Q1: Web Vitals 三大核心指标是什么？

**答**：
1. **LCP (最大内容绘制)**：< 2.5s，衡量加载性能
2. **FID/INP (首次输入延迟/交互响应)**：< 100ms/200ms，衡量交互性能
3. **CLS (累积布局偏移)**：< 0.1，衡量视觉稳定性

### Q2: 如何优化 LCP？

**答**：
1. 优化服务器响应时间（使用 CDN）
2. 预加载关键资源（`<link rel="preload">`）
3. 图片优化（压缩、响应式图片、WebP格式）
4. 移除阻塞渲染的资源（CSS/JS 优化）
5. 使用服务端渲染（SSR）

### Q3: 如何优化 CLS？

**答**：
1. 为图片/视频设置宽高或 aspect-ratio
2. 不在已有内容上方插入新内容
3. 预留广告位空间
4. 使用 `font-display: optional` 避免字体闪烁
5. 使用 `transform` 做动画，避免 `top/left`

### Q4: 如何优化 FID/INP？⭐⭐⭐

**答**：

**核心**：减少主线程阻塞，让交互快速响应。

#### 关键优化手段：

**1. 代码分割 + 懒加载**
```javascript
// React 懒加载
const Heavy = lazy(() => import('./Heavy'));

// 动态导入
const module = await import('./module');
```

**2. 使用 React 18 并发特性**
```javascript
// startTransition：标记非紧急更新
import { startTransition } from 'react';

setInputValue(value); // 紧急：立即更新输入框
startTransition(() => {
  setSearchResults(results); // 非紧急：可中断
});

// useDeferredValue：延迟更新
const deferredQuery = useDeferredValue(query);
```

**3. Web Worker 处理耗时任务**
```javascript
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.onmessage = (e) => handleResult(e.data);
```

**4. 防抖/节流**
```javascript
// 搜索防抖
const search = debounce((query) => fetchResults(query), 300);

// 滚动节流
const handleScroll = throttle(() => updateUI(), 100);
```

**5. 虚拟列表**
```javascript
// react-window
<FixedSizeList height={600} itemCount={1000} itemSize={50}>
  {({ index, style }) => <div style={style}>{items[index]}</div>}
</FixedSizeList>
```

**6. 延迟加载第三方脚本**
```html
<script src="analytics.js" defer></script>
```

**记忆口诀**：
- **拆**：代码分割
- **让**：React Fiber 可中断渲染
- **移**：Web Worker 移出主线程
- **缓**：防抖节流
- **虚**：虚拟列表

### Q5: 如何监控性能指标？

**答**：
```javascript
// 1. 使用 web-vitals 库
import { onCLS, onFID, onLCP } from 'web-vitals';
onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);

// 2. 使用 Performance API
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.log(entry);
  });
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });

// 3. 使用 Lighthouse CI 自动化监控
```

---

## 💡 快速记忆

**口诀**：
```
加载看 LCP，内容要快显
交互看 INP，响应要迅速  
稳定看 CLS，布局不能跳
三大指标记心中，性能优化没问题
```

**关键数字**：
- LCP: **2.5** 秒
- FID: **100** 毫秒
- INP: **200** 毫秒
- CLS: **0.1**

记住这些，面试稳了！🚀

