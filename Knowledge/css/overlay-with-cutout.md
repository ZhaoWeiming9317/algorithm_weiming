# CSS 实现蒙层镂空效果

## 1. 问题描述

实现一个**半透明蒙层**，但在**中间某个区域镂空**，可以看到下面的内容。常用于：
- 新手引导（高亮某个元素）
- 图片预览（聚焦某个区域）
- 弹窗提示（突出显示某个按钮）

## 2. 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|-----|------|------|---------|
| **box-shadow** | 简单，性能好 | 只能矩形镂空 | 简单的矩形高亮 |
| **outline** | 最简单 | 只能矩形，兼容性问题 | 快速原型 |
| **clip-path** | 支持任意形状 | 兼容性一般 | 复杂形状镂空 |
| **SVG mask** | 最灵活 | 复杂，性能稍差 | 复杂动画效果 |
| **多个 div** | 兼容性好 | 代码多，难维护 | 需要兼容老浏览器 |
| **canvas** | 完全控制 | 需要 JS，复杂 | 复杂交互场景 |

## 3. 方案一：box-shadow（推荐 ⭐⭐⭐⭐⭐）

### 3.1 原理

使用超大的 `box-shadow` 扩散值，创建一个覆盖整个屏幕的阴影。

```css
.highlight {
  position: relative;
  z-index: 1000;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
}
```

### 3.2 完整示例

```html
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    padding: 50px;
    font-family: Arial, sans-serif;
  }

  .container {
    position: relative;
    padding: 20px;
  }

  .target {
    position: relative;
    z-index: 1001;
    padding: 20px;
    background: white;
    border-radius: 8px;
    
    /* 核心：超大阴影创建蒙层 */
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
  }

  .content {
    position: relative;
    z-index: 1;
    padding: 20px;
    background: #f0f0f0;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h1>这是背景内容</h1>
      <p>这部分会被蒙层覆盖</p>
    </div>
    
    <div class="target">
      <h2>这是高亮区域</h2>
      <p>这部分不会被遮挡</p>
      <button>点击我</button>
    </div>
    
    <div class="content">
      <p>这部分也会被蒙层覆盖</p>
    </div>
  </div>
</body>
</html>
```

### 3.3 动态高亮（JavaScript）

```javascript
// 高亮任意元素
function highlightElement(selector) {
  // 移除之前的高亮
  document.querySelectorAll('.highlight').forEach(el => {
    el.classList.remove('highlight');
  });
  
  // 添加新的高亮
  const element = document.querySelector(selector);
  if (element) {
    element.classList.add('highlight');
  }
}

// CSS
const style = document.createElement('style');
style.textContent = `
  .highlight {
    position: relative;
    z-index: 9999;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
    border-radius: 4px;
  }
`;
document.head.appendChild(style);

// 使用
highlightElement('.target-button');
```

### 3.4 优化：防止遮挡滚动条

```css
.highlight {
  position: relative;
  z-index: 1000;
  box-shadow: 0 0 0 max(100vh, 100vw) rgba(0, 0, 0, 0.5);
}

/* 或者使用 clip-path 限制范围 */
body {
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  pointer-events: none;
}

.highlight {
  position: relative;
  z-index: 1000;
}
```

## 4. 方案二：outline（最简单）

### 4.1 基本用法

```css
.highlight {
  position: relative;
  z-index: 1000;
  outline: 9999px solid rgba(0, 0, 0, 0.6);
}
```

### 4.2 完整示例

```html
<style>
  .highlight {
    position: relative;
    z-index: 1000;
    outline: 9999px solid rgba(0, 0, 0, 0.6);
    outline-offset: 0;
  }
  
  /* 添加动画 */
  .highlight {
    animation: highlight-pulse 2s infinite;
  }
  
  @keyframes highlight-pulse {
    0%, 100% {
      outline-color: rgba(0, 0, 0, 0.6);
    }
    50% {
      outline-color: rgba(0, 0, 0, 0.8);
    }
  }
</style>

<div class="highlight">
  <h2>高亮内容</h2>
  <button>操作按钮</button>
</div>
```

### 4.3 注意事项

```css
/* ❌ 问题：outline 不支持圆角 */
.highlight {
  border-radius: 8px;
  outline: 9999px solid rgba(0, 0, 0, 0.6);
  /* outline 不会跟随 border-radius */
}

/* ✅ 解决：使用 box-shadow 代替 */
.highlight {
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
}
```

## 5. 方案三：clip-path（支持任意形状 ⭐⭐⭐⭐）

### 5.1 原理

使用 `clip-path` 在蒙层上裁剪出镂空区域。

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  
  /* 镂空一个矩形区域 */
  clip-path: polygon(
    0% 0%,           /* 左上 */
    0% 100%,         /* 左下 */
    30% 100%,        /* 镂空区域左下 */
    30% 30%,         /* 镂空区域左上 */
    70% 30%,         /* 镂空区域右上 */
    70% 70%,         /* 镂空区域右下 */
    30% 70%,         /* 镂空区域左下 */
    30% 100%,        /* 回到左下 */
    100% 100%,       /* 右下 */
    100% 0%          /* 右上 */
  );
}
```

### 5.2 动态计算镂空区域

```javascript
function createOverlayWithCutout(targetElement) {
  // 创建蒙层
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  // 获取目标元素位置
  const rect = targetElement.getBoundingClientRect();
  const padding = 10; // 镂空区域的内边距
  
  // 计算镂空区域的坐标（百分比）
  const left = ((rect.left - padding) / window.innerWidth * 100).toFixed(2);
  const top = ((rect.top - padding) / window.innerHeight * 100).toFixed(2);
  const right = ((rect.right + padding) / window.innerWidth * 100).toFixed(2);
  const bottom = ((rect.bottom + padding) / window.innerHeight * 100).toFixed(2);
  
  // 创建 clip-path（镂空矩形）
  const clipPath = `polygon(
    0% 0%,
    0% 100%,
    ${left}% 100%,
    ${left}% ${top}%,
    ${right}% ${top}%,
    ${right}% ${bottom}%,
    ${left}% ${bottom}%,
    ${left}% 100%,
    100% 100%,
    100% 0%
  )`;
  
  overlay.style.clipPath = clipPath;
}

// CSS
const style = `
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    pointer-events: none;
  }
`;

// 使用
const targetButton = document.querySelector('.target-button');
createOverlayWithCutout(targetButton);
```

### 5.3 圆形镂空

```javascript
function createCircularCutout(targetElement) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  const rect = targetElement.getBoundingClientRect();
  
  // 计算圆心和半径
  const centerX = (rect.left + rect.width / 2) / window.innerWidth * 100;
  const centerY = (rect.top + rect.height / 2) / window.innerHeight * 100;
  const radius = Math.max(rect.width, rect.height) / 2 / window.innerWidth * 100 + 2;
  
  // 使用 radial-gradient 创建圆形镂空
  overlay.style.background = `
    radial-gradient(
      circle at ${centerX}% ${centerY}%,
      transparent ${radius}%,
      rgba(0, 0, 0, 0.7) ${radius}%
    )
  `;
}
```

### 5.4 圆角矩形镂空

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  
  /* 使用 CSS 变量动态设置 */
  --cutout-x: 30%;
  --cutout-y: 30%;
  --cutout-width: 40%;
  --cutout-height: 40%;
  --cutout-radius: 10px;
  
  /* 圆角矩形镂空（需要复杂的 clip-path） */
  clip-path: url(#rounded-cutout);
}
```

```html
<svg width="0" height="0">
  <defs>
    <clipPath id="rounded-cutout" clipPathUnits="objectBoundingBox">
      <!-- 外部矩形 -->
      <path d="M 0,0 L 1,0 L 1,1 L 0,1 Z 
               M 0.3,0.3 L 0.7,0.3 L 0.7,0.7 L 0.3,0.7 Z" 
            fill-rule="evenodd"/>
    </clipPath>
  </defs>
</svg>
```

## 6. 方案四：SVG Mask（最灵活 ⭐⭐⭐⭐⭐）

### 6.1 基本用法

```html
<svg width="100%" height="100%" style="position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;">
  <defs>
    <mask id="cutout-mask">
      <!-- 白色部分显示，黑色部分隐藏 -->
      <rect width="100%" height="100%" fill="white"/>
      <!-- 镂空区域（黑色矩形） -->
      <rect x="30%" y="30%" width="40%" height="40%" rx="10" fill="black"/>
    </mask>
  </defs>
  
  <!-- 应用 mask 的蒙层 -->
  <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#cutout-mask)"/>
</svg>
```

### 6.2 动态创建 SVG 蒙层

```javascript
function createSVGOverlay(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  const padding = 10;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;';
  
  // 创建 mask
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
  mask.setAttribute('id', 'cutout-mask');
  
  // 整个屏幕（白色 = 显示）
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', '100%');
  bgRect.setAttribute('height', '100%');
  bgRect.setAttribute('fill', 'white');
  
  // 镂空区域（黑色 = 隐藏）
  const cutoutRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  cutoutRect.setAttribute('x', rect.left - padding);
  cutoutRect.setAttribute('y', rect.top - padding);
  cutoutRect.setAttribute('width', rect.width + padding * 2);
  cutoutRect.setAttribute('height', rect.height + padding * 2);
  cutoutRect.setAttribute('rx', 8); // 圆角
  cutoutRect.setAttribute('fill', 'black');
  
  mask.appendChild(bgRect);
  mask.appendChild(cutoutRect);
  defs.appendChild(mask);
  svg.appendChild(defs);
  
  // 蒙层矩形
  const overlayRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  overlayRect.setAttribute('width', '100%');
  overlayRect.setAttribute('height', '100%');
  overlayRect.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
  overlayRect.setAttribute('mask', 'url(#cutout-mask)');
  
  svg.appendChild(overlayRect);
  document.body.appendChild(svg);
  
  return svg;
}

// 使用
const target = document.querySelector('.target');
const overlay = createSVGOverlay(target);

// 移除
// overlay.remove();
```

### 6.3 圆形镂空

```javascript
function createCircularSVGOverlay(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none;';
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
  mask.setAttribute('id', 'circular-mask');
  
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', '100%');
  bgRect.setAttribute('height', '100%');
  bgRect.setAttribute('fill', 'white');
  
  // 圆形镂空
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', rect.left + rect.width / 2);
  circle.setAttribute('cy', rect.top + rect.height / 2);
  circle.setAttribute('r', Math.max(rect.width, rect.height) / 2 + 20);
  circle.setAttribute('fill', 'black');
  
  mask.appendChild(bgRect);
  mask.appendChild(circle);
  defs.appendChild(mask);
  svg.appendChild(defs);
  
  const overlayRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  overlayRect.setAttribute('width', '100%');
  overlayRect.setAttribute('height', '100%');
  overlayRect.setAttribute('fill', 'rgba(0, 0, 0, 0.7)');
  overlayRect.setAttribute('mask', 'url(#circular-mask)');
  
  svg.appendChild(overlayRect);
  document.body.appendChild(svg);
  
  return svg;
}
```

### 6.4 动画效果

```html
<svg width="100%" height="100%" style="position: fixed; top: 0; left: 0; z-index: 9999;">
  <defs>
    <mask id="animated-mask">
      <rect width="100%" height="100%" fill="white"/>
      <rect id="cutout" x="30%" y="30%" width="40%" height="40%" rx="10" fill="black">
        <!-- 脉冲动画 -->
        <animate attributeName="opacity" 
                 values="1;0.5;1" 
                 dur="2s" 
                 repeatCount="indefinite"/>
      </rect>
    </mask>
  </defs>
  
  <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#animated-mask)"/>
</svg>
```

## 7. 方案五：多个 div（兼容性最好）

### 7.1 原理

使用 4 个 div 分别覆盖上、下、左、右四个区域。

```html
<style>
  .overlay-top,
  .overlay-bottom,
  .overlay-left,
  .overlay-right {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
  }
  
  .overlay-top {
    top: 0;
    left: 0;
    right: 0;
    height: var(--cutout-top);
  }
  
  .overlay-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(100vh - var(--cutout-bottom));
  }
  
  .overlay-left {
    top: var(--cutout-top);
    left: 0;
    width: var(--cutout-left);
    height: calc(var(--cutout-bottom) - var(--cutout-top));
  }
  
  .overlay-right {
    top: var(--cutout-top);
    right: 0;
    width: calc(100vw - var(--cutout-right));
    height: calc(var(--cutout-bottom) - var(--cutout-top));
  }
</style>

<div class="overlay-top"></div>
<div class="overlay-bottom"></div>
<div class="overlay-left"></div>
<div class="overlay-right"></div>
```

### 7.2 JavaScript 实现

```javascript
function createFourPanelOverlay(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  const padding = 10;
  
  // 创建 4 个面板
  const panels = ['top', 'bottom', 'left', 'right'].map(position => {
    const panel = document.createElement('div');
    panel.className = `overlay-panel overlay-${position}`;
    panel.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9999;
      pointer-events: none;
    `;
    return panel;
  });
  
  const [top, bottom, left, right] = panels;
  
  // 上面板
  top.style.cssText += `
    top: 0;
    left: 0;
    right: 0;
    height: ${rect.top - padding}px;
  `;
  
  // 下面板
  bottom.style.cssText += `
    top: ${rect.bottom + padding}px;
    left: 0;
    right: 0;
    bottom: 0;
  `;
  
  // 左面板
  left.style.cssText += `
    top: ${rect.top - padding}px;
    left: 0;
    width: ${rect.left - padding}px;
    height: ${rect.height + padding * 2}px;
  `;
  
  // 右面板
  right.style.cssText += `
    top: ${rect.top - padding}px;
    left: ${rect.right + padding}px;
    right: 0;
    height: ${rect.height + padding * 2}px;
  `;
  
  panels.forEach(panel => document.body.appendChild(panel));
  
  return {
    remove: () => panels.forEach(panel => panel.remove())
  };
}

// 使用
const target = document.querySelector('.target');
const overlay = createFourPanelOverlay(target);

// 移除
// overlay.remove();
```

## 8. 完整的新手引导组件

### 8.1 React 组件

```jsx
import React, { useEffect, useRef, useState } from 'react';

function Spotlight({ targetSelector, onClose, message }) {
  const [position, setPosition] = useState(null);
  
  useEffect(() => {
    const updatePosition = () => {
      const target = document.querySelector(targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();
        setPosition({
          left: rect.left - 10,
          top: rect.top - 10,
          width: rect.width + 20,
          height: rect.height + 20
        });
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetSelector]);
  
  if (!position) return null;
  
  return (
    <>
      {/* 蒙层 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
          clipPath: `polygon(
            0% 0%,
            0% 100%,
            ${position.left}px 100%,
            ${position.left}px ${position.top}px,
            ${position.left + position.width}px ${position.top}px,
            ${position.left + position.width}px ${position.top + position.height}px,
            ${position.left}px ${position.top + position.height}px,
            ${position.left}px 100%,
            100% 100%,
            100% 0%
          )`
        }}
        onClick={onClose}
      />
      
      {/* 高亮边框 */}
      <div
        style={{
          position: 'fixed',
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
          border: '2px solid #1890ff',
          borderRadius: '4px',
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: '0 0 0 4px rgba(24, 144, 255, 0.2)'
        }}
      />
      
      {/* 提示信息 */}
      {message && (
        <div
          style={{
            position: 'fixed',
            left: position.left,
            top: position.top + position.height + 20,
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 10000,
            maxWidth: '300px'
          }}
        >
          <div>{message}</div>
          <button
            onClick={onClose}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            知道了
          </button>
        </div>
      )}
    </>
  );
}

// 使用
function App() {
  const [showGuide, setShowGuide] = useState(true);
  
  return (
    <div>
      <button className="target-button">重要按钮</button>
      
      {showGuide && (
        <Spotlight
          targetSelector=".target-button"
          message="点击这个按钮开始操作"
          onClose={() => setShowGuide(false)}
        />
      )}
    </div>
  );
}
```

### 8.2 Vue 组件

```vue
<template>
  <div v-if="position">
    <!-- 蒙层 -->
    <div
      class="overlay"
      :style="overlayStyle"
      @click="$emit('close')"
    />
    
    <!-- 高亮边框 -->
    <div class="highlight-border" :style="borderStyle" />
    
    <!-- 提示信息 -->
    <div v-if="message" class="tooltip" :style="tooltipStyle">
      <div>{{ message }}</div>
      <button @click="$emit('close')">知道了</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    targetSelector: String,
    message: String
  },
  
  data() {
    return {
      position: null
    };
  },
  
  computed: {
    overlayStyle() {
      const { left, top, width, height } = this.position;
      return {
        clipPath: `polygon(
          0% 0%, 0% 100%,
          ${left}px 100%, ${left}px ${top}px,
          ${left + width}px ${top}px,
          ${left + width}px ${top + height}px,
          ${left}px ${top + height}px,
          ${left}px 100%,
          100% 100%, 100% 0%
        )`
      };
    },
    
    borderStyle() {
      return {
        left: `${this.position.left}px`,
        top: `${this.position.top}px`,
        width: `${this.position.width}px`,
        height: `${this.position.height}px`
      };
    },
    
    tooltipStyle() {
      return {
        left: `${this.position.left}px`,
        top: `${this.position.top + this.position.height + 20}px`
      };
    }
  },
  
  mounted() {
    this.updatePosition();
    window.addEventListener('resize', this.updatePosition);
    window.addEventListener('scroll', this.updatePosition);
  },
  
  beforeUnmount() {
    window.removeEventListener('resize', this.updatePosition);
    window.removeEventListener('scroll', this.updatePosition);
  },
  
  methods: {
    updatePosition() {
      const target = document.querySelector(this.targetSelector);
      if (target) {
        const rect = target.getBoundingClientRect();
        this.position = {
          left: rect.left - 10,
          top: rect.top - 10,
          width: rect.width + 20,
          height: rect.height + 20
        };
      }
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9998;
}

.highlight-border {
  position: fixed;
  border: 2px solid #1890ff;
  border-radius: 4px;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2);
}

.tooltip {
  position: fixed;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-width: 300px;
}
</style>
```

## 9. 性能优化

### 9.1 使用 will-change

```css
.overlay {
  will-change: clip-path;
}

.highlight {
  will-change: box-shadow;
}
```

### 9.2 使用 transform 代替 position

```css
/* ❌ 性能较差 */
.tooltip {
  left: 100px;
  top: 100px;
}

/* ✅ 性能更好 */
.tooltip {
  transform: translate(100px, 100px);
}
```

### 9.3 防抖滚动和 resize 事件

```javascript
import { debounce } from 'lodash';

const updatePosition = debounce(() => {
  // 更新位置
}, 100);

window.addEventListener('scroll', updatePosition);
window.addEventListener('resize', updatePosition);
```

## 10. 总结

### 10.1 方案选择建议

| 场景 | 推荐方案 |
|-----|---------|
| **简单矩形高亮** | box-shadow |
| **需要圆角** | box-shadow 或 SVG |
| **复杂形状** | clip-path 或 SVG |
| **需要动画** | SVG mask |
| **兼容老浏览器** | 多个 div |
| **高性能要求** | box-shadow |

### 10.2 关键要点

1. **box-shadow** 最简单高效，适合大多数场景
2. **clip-path** 支持复杂形状，但兼容性稍差
3. **SVG mask** 最灵活，支持复杂动画
4. 注意 **z-index** 层级关系
5. 监听 **scroll** 和 **resize** 事件更新位置
6. 使用 **pointer-events: none** 让蒙层不阻挡交互
7. 添加 **过渡动画** 提升用户体验
