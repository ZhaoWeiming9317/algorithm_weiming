# Cookie 安全属性详解

## Q1: SameSite=None 时为什么必须带上 Secure？

**答案：防止在 HTTP 环境下泄露 Cookie**

### 原因：
1. **安全考虑**：HTTP 是明文传输，Cookie 容易被窃取
2. **浏览器强制要求**：现代浏览器要求 SameSite=None 必须配合 Secure
3. **防止中间人攻击**：确保 Cookie 只在安全连接中传输

### 示例：
```javascript
// ❌ 错误：SameSite=None 没有 Secure
document.cookie = "sessionId=abc123; SameSite=None";

// ✅ 正确：SameSite=None 配合 Secure
document.cookie = "sessionId=abc123; SameSite=None; Secure";
```

### 浏览器行为：
- Chrome 80+：SameSite=None 没有 Secure 会被忽略
- Firefox 69+：SameSite=None 没有 Secure 会被忽略
- Safari 13+：SameSite=None 没有 Secure 会被忽略

---

## Q2: Domain 属性是限制还是扩大范围？

**答案：扩大读取范围**

### Domain 的作用：
- **限制范围**：只能设置当前域名或其父域名
- **扩大范围**：让子域名也能访问这个 Cookie

### 示例：
```javascript
// 在 www.example.com 设置
document.cookie = "sessionId=abc123; Domain=.example.com";

// 结果：以下域名都能访问这个 Cookie
// - www.example.com ✅
// - api.example.com ✅
// - admin.example.com ✅
// - example.com ✅
```

### 限制规则：
```javascript
// 在 www.example.com 设置
document.cookie = "sessionId=abc123; Domain=.google.com"; // ❌ 错误，不能设置其他域名

// 在 www.example.com 设置
document.cookie = "sessionId=abc123; Domain=.com"; // ❌ 错误，不能设置顶级域名
```

---

## Q3: Path 属性是限制还是扩大范围？

**答案：限制读取范围**

### Path 的作用：
- **限制范围**：只有指定路径及其子路径能访问
- **默认值**：当前页面的路径

### 示例：
```javascript
// 在 https://example.com/admin/page 设置
document.cookie = "adminToken=token123; Path=/admin";

// 结果：
// - https://example.com/admin/page ✅ 能访问
// - https://example.com/admin/users ✅ 能访问
// - https://example.com/admin/settings ✅ 能访问
// - https://example.com/home ❌ 不能访问
// - https://example.com/ ❌ 不能访问
```

### 路径匹配规则：
```javascript
// 设置 Path=/api
document.cookie = "apiToken=token123; Path=/api";

// 匹配的路径：
// - /api ✅
// - /api/users ✅
// - /api/users/123 ✅
// - /apis ❌ (注意：不是 /api 的子路径)
```

---

## Q4: Cookie 前缀的作用

**答案：提供额外的安全保护**

### 主要前缀：

#### 1. `__Secure-` 前缀
```javascript
// 要求：
// - 必须设置 Secure 属性
// - 必须来自 HTTPS 页面
document.cookie = "__Secure-sessionId=abc123; Secure";
```

#### 2. `__Host-` 前缀
```javascript
// 要求：
// - 必须设置 Secure 属性
// - 必须来自 HTTPS 页面
// - 不能设置 Domain 属性
// - 不能设置 Path 属性（默认为 /）
document.cookie = "__Host-sessionId=abc123; Secure";
```

### 安全优势：
1. **防止意外配置**：前缀强制要求安全设置
2. **防止降级攻击**：确保 Cookie 只在安全环境下使用
3. **明确安全意图**：代码中明确标识安全 Cookie

### 示例对比：
```javascript
// 普通 Cookie（可能不安全）
document.cookie = "sessionId=abc123";

// 安全 Cookie（强制安全设置）
document.cookie = "__Secure-sessionId=abc123; Secure";
document.cookie = "__Host-sessionId=abc123; Secure";
```

### 浏览器行为：
- 如果前缀要求不满足，浏览器会忽略这个 Cookie
- 提供额外的安全保护层

---

## 总结

| 属性 | 作用 | 类型 |
|------|------|------|
| Secure | 只在 HTTPS 下发送 | 安全保护 |
| Domain | 扩大访问范围到子域名 | 范围控制 |
| Path | 限制访问路径范围 | 范围控制 |
| 前缀 | 强制安全设置 | 安全保护 |

### 最佳实践：
```javascript
// 推荐的安全配置
document.cookie = "__Host-sessionId=abc123; Secure; SameSite=Lax; HttpOnly";
```

这样配置确保了：
- 只在 HTTPS 下发送
- 不能设置 Domain 和 Path
- 防止 XSS 攻击
- 防止 CSRF 攻击
- 强制安全设置