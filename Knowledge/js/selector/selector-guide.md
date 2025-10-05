# CSS 选择器详解

## 1. 基础选择器

### 1.1 标签选择器
```css
/* 选择所有 p 元素 */
p {
  color: blue;
}

/* 选择所有 div 元素 */
div {
  margin: 10px;
}
```

### 1.2 类选择器（.）
```css
/* 选择所有 class="primary" 的元素 */
.primary {
  background-color: blue;
}

/* 选择同时有 btn 和 primary 两个 class 的元素 */
.btn.primary {
  color: white;
}

/* 选择有 primary class 的 div 元素 */
div.primary {
  border: 1px solid blue;
}
```

### 1.3 ID 选择器（#）
```css
/* 选择 id="header" 的元素 */
#header {
  height: 60px;
}

/* 选择有 header id 的 div 元素 */
div#header {
  background: #333;
}
```

### 1.4 通配符选择器（*）
```css
/* 选择所有元素 */
* {
  box-sizing: border-box;
}

/* 选择所有 div 的子元素 */
div * {
  margin: 0;
}
```

## 2. 属性选择器

### 2.1 基础属性选择器
```css
/* 选择有 title 属性的元素 */
[title] {
  cursor: help;
}

/* 选择 title="example" 的元素 */
[title="example"] {
  border: 1px solid red;
}

/* 选择有 class 属性且值包含 "btn" 的元素 */
[class~="btn"] {
  padding: 10px;
}
```

### 2.2 属性值匹配
```css
/* 选择 href 以 "https://" 开头的 a 元素 */
a[href^="https://"] {
  color: green;
}

/* 选择 href 以 ".pdf" 结尾的 a 元素 */
a[href$=".pdf"] {
  color: red;
}

/* 选择 href 包含 "example" 的 a 元素 */
a[href*="example"] {
  text-decoration: underline;
}
```

## 3. 伪类选择器

### 3.1 链接伪类
```css
/* 未访问的链接 */
a:link {
  color: blue;
}

/* 已访问的链接 */
a:visited {
  color: purple;
}

/* 鼠标悬停 */
a:hover {
  color: red;
}

/* 被点击时 */
a:active {
  color: green;
}
```

### 3.2 结构伪类
```css
/* 第一个子元素 */
li:first-child {
  font-weight: bold;
}

/* 最后一个子元素 */
li:last-child {
  border-bottom: none;
}

/* 第 n 个子元素 */
li:nth-child(2n) {
  background-color: #f0f0f0;
}

/* 倒数第 n 个子元素 */
li:nth-last-child(2) {
  color: red;
}

/* 唯一的子元素 */
div:only-child {
  margin: 0 auto;
}
```

### 3.3 表单伪类
```css
/* 获得焦点的元素 */
input:focus {
  border-color: blue;
}

/* 被选中的复选框 */
input[type="checkbox"]:checked {
  background-color: green;
}

/* 禁用的元素 */
input:disabled {
  opacity: 0.5;
}

/* 必填字段 */
input:required {
  border-color: red;
}
```

## 4. 伪元素选择器

### 4.1 基础伪元素
```css
/* 在元素前插入内容 */
p::before {
  content: "→ ";
}

/* 在元素后插入内容 */
p::after {
  content: " ←";
}

/* 选择第一行 */
p::first-line {
  font-weight: bold;
}

/* 选择第一个字母 */
p::first-letter {
  font-size: 2em;
}
```

## 5. 组合选择器

### 5.1 后代选择器（空格）
```css
/* 选择 div 内的所有 p 元素 */
div p {
  margin: 10px;
}

/* 选择 .container 内的所有 .item */
.container .item {
  padding: 5px;
}
```

### 5.2 子选择器（>）
```css
/* 选择 div 的直接子元素 p */
div > p {
  color: red;
}

/* 选择 ul 的直接子元素 li */
ul > li {
  list-style: none;
}
```

### 5.3 相邻兄弟选择器（+）
```css
/* 选择紧跟在 h2 后的 p 元素 */
h2 + p {
  margin-top: 0;
}

/* 选择紧跟在 .btn 后的 .text */
.btn + .text {
  margin-left: 10px;
}
```

### 5.4 通用兄弟选择器（~）
```css
/* 选择 h2 后的所有 p 元素 */
h2 ~ p {
  color: gray;
}

/* 选择 .header 后的所有 .content */
.header ~ .content {
  margin-top: 20px;
}
```

## 6. 选择器优先级

### 6.1 优先级计算
```css
/* 内联样式：1000 */
<div style="color: red;">

/* ID 选择器：100 */
#header { color: blue; }

/* 类选择器、属性选择器、伪类：10 */
.header { color: green; }
[title] { color: yellow; }
:hover { color: orange; }

/* 标签选择器、伪元素：1 */
div { color: purple; }
::before { color: pink; }
```

### 6.2 优先级示例
```css
/* 优先级：1 */
div { color: red; }

/* 优先级：10 */
.container { color: blue; }

/* 优先级：100 */
#header { color: green; }

/* 优先级：1000 */
<div style="color: yellow;">

/* 最终颜色是黄色（内联样式） */
```

## 7. 实际应用示例

### 7.1 导航菜单
```css
/* 导航容器 */
.nav {
  display: flex;
  list-style: none;
}

/* 导航项 */
.nav li {
  margin: 0 10px;
}

/* 导航链接 */
.nav a {
  text-decoration: none;
  color: #333;
  padding: 10px;
}

/* 当前页面链接 */
.nav a.active {
  background-color: #007bff;
  color: white;
}

/* 悬停效果 */
.nav a:hover {
  background-color: #f8f9fa;
}
```

### 7.2 表单样式
```css
/* 表单组 */
.form-group {
  margin-bottom: 15px;
}

/* 标签 */
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

/* 输入框 */
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 必填字段 */
.form-group input:required {
  border-color: #dc3545;
}

/* 焦点状态 */
.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
```

## 8. 最佳实践

### 8.1 选择器性能
```css
/* 好的选择器：具体且高效 */
.button.primary { }

/* 避免：过于通用的选择器 */
* { }

/* 好的选择器：利用浏览器优化 */
#header .nav li a { }

/* 避免：过于复杂的选择器 */
div > ul > li > a:hover { }
```

### 8.2 可维护性
```css
/* 使用语义化的类名 */
.btn-primary { }
.btn-secondary { }
.btn-danger { }

/* 避免：基于位置的选择器 */
.first { }
.last { }
.middle { }
```
