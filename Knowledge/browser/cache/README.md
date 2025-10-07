# 浏览器缓存机制（面试题）

## 1. 什么是浏览器缓存？为什么需要缓存？

**浏览器缓存**是浏览器将请求过的资源（HTML、CSS、JS、图片等）存储在本地的机制。

**作用：**
- 减少网络请求，降低服务器压力
- 加快页面加载速度，提升用户体验
- 节省带宽流量

---

## 2. 浏览器缓存分类

浏览器缓存主要分为两大类：**强缓存** 和 **协商缓存**

### 缓存流程图

```
浏览器请求资源
    ↓
查找强缓存
    ↓
强缓存有效？
    ↙ 是          ↘ 否
直接使用缓存    向服务器发送请求（带缓存标识）
(200 from cache)      ↓
                  服务器检查协商缓存
                      ↓
                  资源是否修改？
                  ↙ 否          ↘ 是
            返回304        返回200 + 新资源
          使用本地缓存      更新缓存
```

---

## 3. 强缓存（Strong Cache）

### 定义
**强缓存不会向服务器发送请求**，直接从本地缓存读取资源。浏览器会判断缓存是否过期，如果未过期则直接使用。

### 相关HTTP头

#### (1) Expires（HTTP/1.0）

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**特点：**
- HTTP/1.0 的产物
- 指定一个**绝对过期时间**（GMT格式）
- 缺点：依赖客户端时间，如果客户端时间与服务器时间不一致，会导致缓存失效

**示例：**
```javascript
// 服务器设置
res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString()); // 1小时后过期
```

#### (2) Cache-Control（HTTP/1.1）⭐

```http
Cache-Control: max-age=3600
```

**特点：**
- HTTP/1.1 的产物，**优先级高于 Expires**
- 使用**相对时间**（秒），不受客户端时间影响
- 更灵活，功能更强大

**常用指令：**

| 指令 | 说明 |
|------|------|
| `max-age=<seconds>` | 缓存的最大有效时间（相对时间） |
| `no-cache` | 需要使用协商缓存验证 |
| `no-store` | 禁止缓存，每次都请求新资源 |
| `public` | 可以被任何缓存（浏览器、CDN）缓存 |
| `private` | 只能被浏览器缓存，不能被CDN等中间代理缓存 |
| `s-maxage=<seconds>` | 覆盖max-age，仅用于共享缓存（CDN） |
| `must-revalidate` | 缓存过期后必须向服务器验证 |

**示例：**
```javascript
// 强缓存1小时
res.setHeader('Cache-Control', 'max-age=3600');

// 不缓存
res.setHeader('Cache-Control', 'no-store');

// 需要协商缓存
res.setHeader('Cache-Control', 'no-cache');

// 公共资源，CDN可缓存1天
res.setHeader('Cache-Control', 'public, max-age=86400');
```

### 为什么HTTP/1.1要引入Cache-Control？

**核心原因：Expires的致命缺陷**

1. **时间同步问题**：Expires使用绝对时间，依赖客户端时间。如果用户修改本地时间，缓存会失效
2. **灵活性不足**：Expires只能设置过期时间，无法实现"不缓存"、"必须验证"等复杂策略
3. **相对时间更合理**：Cache-Control的max-age使用相对时间，从响应时间开始计算，不受客户端时间影响

**示例对比：**
```http
# HTTP/1.0 - 可能失效
Expires: Wed, 21 Oct 2025 07:28:00 GMT  
# 如果客户端时间是2026年，缓存立即失效

# HTTP/1.1 - 稳定可靠
Cache-Control: max-age=3600  
# 从收到响应开始，3600秒内有效，不受客户端时间影响
```

### Cache-Control 为什么不依赖客户端时间？差值如何计算？

**关键：浏览器使用 `Date` 响应头 + `max-age` 计算过期时间**

#### 计算公式

```
缓存过期时间 = Date响应头时间 + max-age秒数
当前是否过期 = (当前客户端时间 - Date响应头时间) > max-age
```

#### 详细流程

**1. 服务器返回响应时**

```http
HTTP/1.1 200 OK
Date: Mon, 07 Oct 2024 10:00:00 GMT    ← 服务器时间（响应生成时间）
Cache-Control: max-age=3600             ← 缓存3600秒
Content-Type: text/javascript

// 文件内容
```

**2. 浏览器接收响应后**

浏览器会记录两个关键信息：
- `Date` 头的值：`Mon, 07 Oct 2024 10:00:00 GMT`（服务器时间）
- `max-age` 的值：`3600`秒

然后计算：
```javascript
// 浏览器内部逻辑（伪代码）
const serverTime = new Date('Mon, 07 Oct 2024 10:00:00 GMT'); // Date响应头
const maxAge = 3600; // max-age值
const expirationTime = serverTime.getTime() + maxAge * 1000; // 过期时间戳

// 保存到缓存
cache.set('resource.js', {
  content: '...',
  serverTime: serverTime.getTime(),  // 1728295200000
  maxAge: 3600,
  expirationTime: expirationTime     // 1728298800000
});
```

**3. 再次请求该资源时**

```javascript
// 浏览器检查缓存（伪代码）
const cached = cache.get('resource.js');
const now = Date.now(); // 当前客户端时间戳

// 计算已经过去的时间（使用客户端时间差值）
const elapsedTime = (now - cached.serverTime) / 1000; // 秒

// 判断是否过期
if (elapsedTime < cached.maxAge) {
  // 未过期，使用缓存
  return cached.content;
} else {
  // 已过期，发送新请求
  fetch(url);
}
```

#### 为什么不依赖客户端时间？

**关键点：计算的是时间差，而不是绝对时间**

```javascript
// ❌ Expires的问题：依赖客户端绝对时间
const expires = new Date('Wed, 21 Oct 2025 07:28:00 GMT');
const clientNow = new Date(); // 如果客户端时间错误，这里就错了
if (clientNow < expires) {
  // 使用缓存
}

// ✅ Cache-Control的优势：使用时间差
const serverTime = responseHeaders.Date; // 服务器时间（固定不变）
const maxAge = 3600;
const elapsedTime = Date.now() - serverTime; // 计算差值
if (elapsedTime < maxAge * 1000) {
  // 使用缓存
}
```

#### 实际案例对比

**场景：服务器时间是 2024-10-07 10:00:00，客户端时间被改成了 2026-01-01 00:00:00**

**Expires（HTTP/1.0）：**
```http
Expires: Wed, 07 Oct 2024 11:00:00 GMT  # 服务器设置1小时后过期
```

```javascript
// 浏览器判断
const expires = new Date('Wed, 07 Oct 2024 11:00:00 GMT'); // 2024年
const clientNow = new Date(); // 2026年（客户端时间错误）

if (clientNow < expires) {
  // 2026 < 2024 ? false
  // ❌ 缓存失效！即使实际只过了1分钟
}
```

**Cache-Control（HTTP/1.1）：**
```http
Date: Mon, 07 Oct 2024 10:00:00 GMT
Cache-Control: max-age=3600
```

```javascript
// 浏览器判断
const serverTime = new Date('Mon, 07 Oct 2024 10:00:00 GMT').getTime();
const clientNow = Date.now(); // 2026年（客户端时间错误）

const elapsedTime = (clientNow - serverTime) / 1000;
// 计算差值：(2026时间戳 - 2024时间戳) / 1000 = 很大的数字

if (elapsedTime < 3600) {
  // ❌ 虽然客户端时间错了，但差值计算依然正确
  // 实际过了1分钟，差值就是60秒，小于3600，缓存有效 ✅
}
```

**等等，这里有个问题！**

如果客户端时间错误，`Date.now()` 也是错的，差值计算不也会错吗？

**答案：是的！但影响小得多**

关键在于：
1. **相对时间更稳定**：即使客户端时间错误，只要客户端时间**流逝速度正常**（1秒就是1秒），差值计算就是准确的
2. **Expires依赖绝对值**：客户端时间错误直接导致比较失败
3. **实际场景**：客户端时间通常不会相差太离谱，而且现代操作系统会自动同步时间

#### 更准确的说法

**Cache-Control 减少了对客户端时间准确性的依赖，但没有完全消除**

- 如果客户端时间**流逝速度正常**（即使绝对时间错误），Cache-Control 依然工作正常
- 如果客户端时间**完全静止或倒流**，Cache-Control 也会失效

**但这种情况极少发生，而 Expires 在客户端时间稍有偏差时就会失效**

#### 总结

| 对比项 | Expires | Cache-Control |
|--------|---------|---------------|
| 依赖项 | 客户端绝对时间 | 客户端时间差值 |
| 计算方式 | `客户端时间 < 过期时间` | `(当前时间 - 响应时间) < max-age` |
| 客户端时间错误影响 | 直接失效 | 影响较小 |
| 时间流逝速度异常 | 失效 | 也会失效 |
| 实际可靠性 | 低 | 高 |

### 浏览器表现

- Chrome DevTools: `200 (from disk cache)` 或 `200 (from memory cache)`
- 不会发送网络请求

---

## 4. 协商缓存（Negotiation Cache）

### 定义
**协商缓存会向服务器发送请求**，由服务器判断缓存是否可用。如果可用返回304，浏览器使用本地缓存；否则返回200和新资源。

### 相关HTTP头

#### (1) Last-Modified / If-Modified-Since（HTTP/1.0）

**工作流程：**

1. **首次请求**：服务器返回资源 + `Last-Modified` 头（资源最后修改时间）
   ```http
   Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
   ```

2. **再次请求**：浏览器带上 `If-Modified-Since` 头（值为上次的Last-Modified）
   ```http
   If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
   ```

3. **服务器判断**：
   - 如果资源未修改 → 返回 `304 Not Modified`（无body）
   - 如果资源已修改 → 返回 `200 OK` + 新资源 + 新的Last-Modified

**缺点：**
- 只能精确到**秒级**，1秒内多次修改无法识别
- 如果文件定期生成但内容未变，也会认为资源修改了
- 某些服务器无法精确获取文件修改时间

#### (2) ETag / If-None-Match（HTTP/1.1）⭐

**工作流程：**

1. **首次请求**：服务器返回资源 + `ETag` 头（资源的唯一标识，通常是hash值）
   ```http
   ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   ```

2. **再次请求**：浏览器带上 `If-None-Match` 头（值为上次的ETag）
   ```http
   If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
   ```

3. **服务器判断**：
   - 如果ETag匹配 → 返回 `304 Not Modified`
   - 如果ETag不匹配 → 返回 `200 OK` + 新资源 + 新的ETag

**优点：**
- 更精确，基于内容hash，不受时间影响
- 可以识别1秒内的多次修改
- 即使修改时间变了，只要内容不变，ETag不变

**ETag类型：**
- **强ETag**：`"33a64df551425fcc55e4d42a148795d9f25f89d4"` - 内容完全一致
- **弱ETag**：`W/"33a64df551425fcc55e4d42a148795d9f25f89d4"` - 语义一致即可

### 为什么HTTP/1.1要引入ETag？

**核心原因：Last-Modified的局限性**

1. **精度问题**：Last-Modified只能精确到秒，无法处理秒级修改
   ```javascript
   // 1秒内修改3次，Last-Modified无法区分
   fs.writeFileSync('file.js', 'v1'); // 2024-10-21 07:28:00
   fs.writeFileSync('file.js', 'v2'); // 2024-10-21 07:28:00
   fs.writeFileSync('file.js', 'v3'); // 2024-10-21 07:28:00
   ```

2. **内容未变但时间变了**：定期生成的文件，内容相同但修改时间不同
   ```bash
   # 每天自动构建，内容没变但时间变了
   # 导致缓存失效，浪费带宽
   ```

3. **基于内容更准确**：ETag基于文件内容hash，只要内容不变，缓存就有效

### 优先级

**ETag 优先级高于 Last-Modified**

如果同时存在，服务器会优先比较ETag。

---

## 5. 缓存优先级总结

```
强缓存 > 协商缓存
Cache-Control > Expires
ETag > Last-Modified
```

**完整判断流程：**

1. 检查 `Cache-Control` 的 `max-age` 是否过期
2. 如果没有 `Cache-Control`，检查 `Expires` 是否过期
3. 如果强缓存过期，发送请求，优先使用 `ETag`（If-None-Match）
4. 如果没有 `ETag`，使用 `Last-Modified`（If-Modified-Since）
5. 服务器返回 304 或 200

---

## 6. 实际应用场景

### 场景1：静态资源（CSS/JS/图片）

**策略：强缓存 + 文件指纹**

```http
# 文件名带hash: main.a3f5b2.js
Cache-Control: public, max-age=31536000  # 1年
```

**原理：**
- 文件内容变化 → hash变化 → 文件名变化 → 浏览器请求新文件
- 文件内容不变 → hash不变 → 使用强缓存

### 场景2：HTML文件

**策略：协商缓存**

```http
Cache-Control: no-cache
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**原理：**
- 每次都向服务器验证
- 如果未修改返回304，快速加载
- 如果修改了返回新HTML

### 场景3：API接口

**策略：不缓存或短时间缓存**

```http
# 不缓存
Cache-Control: no-store

# 短时间缓存
Cache-Control: max-age=60
```

### 场景4：用户信息等敏感数据

**策略：私有缓存 + 协商缓存**

```http
Cache-Control: private, no-cache
ETag: "abc123"
```

---

## 7. 常见面试题

### Q1: 强缓存和协商缓存的区别？

| 维度 | 强缓存 | 协商缓存 |
|------|--------|----------|
| 是否发送请求 | 否 | 是 |
| 状态码 | 200 (from cache) | 304 Not Modified |
| 性能 | 最快 | 较快 |
| 控制字段 | Cache-Control, Expires | ETag, Last-Modified |

### Q2: 为什么HTTP/1.1要引入新的缓存机制？

1. **Cache-Control vs Expires**：
   - Expires依赖客户端时间，不可靠
   - Cache-Control使用相对时间，更灵活

2. **ETag vs Last-Modified**：
   - Last-Modified只能精确到秒
   - ETag基于内容hash，更精确

### Q3: 如何强制刷新缓存？

1. **用户操作**：
   - `Ctrl + F5`（硬刷新）：跳过所有缓存
   - `F5`（普通刷新）：跳过强缓存，使用协商缓存

2. **代码层面**：
   - URL加时间戳：`script.js?t=1234567890`
   - 文件名加hash：`script.a3f5b2.js`

### Q4: 什么情况下缓存会失效？

1. 强缓存过期（超过max-age或Expires）
2. 用户手动清除缓存
3. 用户硬刷新（Ctrl + F5）
4. 设置了 `Cache-Control: no-store`

### Q5: 如何设置不同资源的缓存策略？

```javascript
// Node.js Express示例
app.use('/static', express.static('public', {
  maxAge: '1y', // 静态资源强缓存1年
  etag: true,
  lastModified: true
}));

app.get('/api/data', (req, res) => {
  res.setHeader('Cache-Control', 'no-store'); // API不缓存
  res.json({ data: 'xxx' });
});

app.get('/index.html', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache'); // HTML协商缓存
  res.setHeader('ETag', generateETag(content));
  res.send(content);
});
```

---

## 8. 最佳实践

### ✅ 推荐做法

1. **静态资源**：强缓存 + 文件指纹
   ```http
   Cache-Control: public, max-age=31536000, immutable
   ```

2. **HTML**：协商缓存
   ```http
   Cache-Control: no-cache
   ETag: "xxx"
   ```

3. **API**：根据业务决定
   ```http
   # 实时数据
   Cache-Control: no-store
   
   # 可缓存数据
   Cache-Control: max-age=300
   ```

### ❌ 避免做法

1. 不要对HTML使用长时间强缓存（会导致更新不及时）
2. 不要同时设置 `no-cache` 和 `max-age`（矛盾）
3. 不要忽略协商缓存（即使强缓存过期，协商缓存也能节省带宽）

---

## 9. 总结

- **强缓存**：不发请求，最快，用于静态资源
- **协商缓存**：发请求验证，用于需要更新检查的资源
- **HTTP/1.1改进**：Cache-Control解决时间同步问题，ETag提高精度
- **优先级**：Cache-Control > Expires，ETag > Last-Modified
- **实际应用**：根据资源类型选择合适的缓存策略
