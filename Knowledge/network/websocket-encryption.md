# WebSocket 加密机制

## 1. WebSocket 协议概述

### 1.1 协议类型

- **WS (WebSocket)**：`ws://` - 明文传输，端口 80
- **WSS (WebSocket Secure)**：`wss://` - 加密传输，端口 443

```javascript
// 明文连接
const ws = new WebSocket('ws://example.com/socket');

// 加密连接
const wss = new WebSocket('wss://example.com/socket');
```

## 2. WSS 加密原理

### 2.1 基于 TLS/SSL 加密

WSS 本质上是 **WebSocket over TLS/SSL**，类似于 HTTPS 之于 HTTP。

```
HTTP  + TLS/SSL = HTTPS
WebSocket + TLS/SSL = WSS
```

### 2.2 加密流程

```
客户端                                服务器
  |                                    |
  |------- 1. TCP 三次握手 ----------->|
  |                                    |
  |------- 2. TLS 握手开始 ----------->|
  |       (ClientHello)                |
  |                                    |
  |<------ 3. 服务器证书 --------------|
  |       (ServerHello + Certificate)  |
  |                                    |
  |------- 4. 密钥交换 --------------->|
  |       (ClientKeyExchange)          |
  |                                    |
  |<------ 5. 握手完成 ----------------|
  |       (Finished)                   |
  |                                    |
  |------- 6. WebSocket 升级请求 ----->|
  |       (HTTP Upgrade)               |
  |                                    |
  |<------ 7. 升级确认 ----------------|
  |       (101 Switching Protocols)    |
  |                                    |
  |<====== 8. 加密的 WebSocket 通信 ===>|
```

### 2.3 TLS 握手详细步骤

#### 第一步：ClientHello

```
客户端发送：
- TLS 版本（如 TLS 1.3）
- 支持的加密套件列表
- 随机数（Client Random）
- 支持的压缩方法
```

#### 第二步：ServerHello

```
服务器返回：
- 选择的 TLS 版本
- 选择的加密套件
- 随机数（Server Random）
- 服务器证书（包含公钥）
```

#### 第三步：密钥交换

```
客户端：
1. 验证服务器证书
2. 生成预主密钥（Pre-Master Secret）
3. 用服务器公钥加密预主密钥
4. 发送给服务器

双方计算：
Session Key = PRF(
  Pre-Master Secret,
  Client Random,
  Server Random
)
```

#### 第四步：开始加密通信

```
使用 Session Key 进行对称加密通信
```

## 3. 加密算法

### 3.1 常用加密套件

```
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
│    │    │        │       │     │
│    │    │        │       │     └─ 消息认证码算法
│    │    │        │       └─────── 加密模式
│    │    │        └─────────────── 对称加密算法
│    │    └──────────────────────── 身份验证算法
│    └───────────────────────────── 密钥交换算法
└────────────────────────────────── 协议版本
```

### 3.2 加密层次

| 层次 | 算法 | 用途 |
|-----|------|-----|
| **非对称加密** | RSA/ECDHE | 密钥交换、身份验证 |
| **对称加密** | AES-128/256 | 数据加密（快速） |
| **哈希算法** | SHA-256/384 | 消息完整性验证 |
| **数字签名** | RSA/ECDSA | 证书签名 |

## 4. 实际应用

### 4.1 Node.js 服务端实现

```javascript
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');

// 读取 SSL 证书
const server = https.createServer({
  cert: fs.readFileSync('/path/to/cert.pem'),
  key: fs.readFileSync('/path/to/key.pem'),
  // 可选：客户端证书验证
  ca: fs.readFileSync('/path/to/ca.pem'),
  requestCert: true, // 要求客户端证书
  rejectUnauthorized: true // 拒绝未授权的连接
});

// 创建 WSS 服务器
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('安全连接已建立');
  
  // 获取客户端证书信息
  const cert = req.socket.getPeerCertificate();
  console.log('客户端证书:', cert);
  
  ws.on('message', (message) => {
    // 消息已经被 TLS 层自动解密
    console.log('收到消息:', message);
  });
  
  // 发送消息（会被 TLS 层自动加密）
  ws.send('Hello from secure server');
});

server.listen(443, () => {
  console.log('WSS 服务器运行在 443 端口');
});
```

### 4.2 浏览器客户端

```javascript
// 浏览器自动处理 TLS 加密
const socket = new WebSocket('wss://example.com/socket');

socket.onopen = () => {
  console.log('安全连接已建立');
  // 发送的数据会被浏览器自动加密
  socket.send('Hello from client');
};

socket.onmessage = (event) => {
  // 接收的数据已被浏览器自动解密
  console.log('收到消息:', event.data);
};

socket.onerror = (error) => {
  console.error('连接错误:', error);
  // 可能的错误：证书无效、证书过期、自签名证书等
};
```

### 4.3 额外的应用层加密

即使使用 WSS，有时还需要应用层加密：

```javascript
// 使用 AES 加密消息内容
const CryptoJS = require('crypto-js');

// 发送端
function sendEncrypted(socket, message, secretKey) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(message),
    secretKey
  ).toString();
  
  socket.send(encrypted);
}

// 接收端
function onMessageEncrypted(event, secretKey) {
  const decrypted = CryptoJS.AES.decrypt(
    event.data,
    secretKey
  );
  
  const message = JSON.parse(
    decrypted.toString(CryptoJS.enc.Utf8)
  );
  
  console.log('解密后的消息:', message);
}

// 使用
const SECRET_KEY = 'your-secret-key-here';
const socket = new WebSocket('wss://example.com/socket');

socket.onopen = () => {
  sendEncrypted(socket, { type: 'hello', data: 'world' }, SECRET_KEY);
};

socket.onmessage = (event) => {
  onMessageEncrypted(event, SECRET_KEY);
};
```

## 5. 安全最佳实践

### 5.1 证书配置

```javascript
// 1. 使用强加密套件
const server = https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
  
  // 指定加密套件
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-CHACHA20-POLY1305'
  ].join(':'),
  
  // 使用 TLS 1.2 或更高版本
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3',
  
  // 优先使用服务器的加密套件顺序
  honorCipherOrder: true
});
```

### 5.2 证书验证

```javascript
// 客户端验证服务器证书
const socket = new WebSocket('wss://example.com/socket');

socket.onerror = (error) => {
  // 证书验证失败会触发错误
  console.error('证书验证失败:', error);
};

// Node.js 客户端
const WebSocket = require('ws');

const ws = new WebSocket('wss://example.com/socket', {
  // 自定义证书验证
  rejectUnauthorized: true, // 拒绝未授权的证书
  
  // 使用自签名证书（仅开发环境）
  ca: fs.readFileSync('ca-cert.pem')
});
```

### 5.3 防止中间人攻击

```javascript
// 1. 证书固定（Certificate Pinning）
const expectedFingerprint = 'AA:BB:CC:DD:EE:FF:...';

const ws = new WebSocket('wss://example.com/socket', {
  checkServerIdentity: (host, cert) => {
    const fingerprint = cert.fingerprint256;
    if (fingerprint !== expectedFingerprint) {
      throw new Error('证书指纹不匹配');
    }
  }
});

// 2. 使用 HSTS（HTTP Strict Transport Security）
// 服务器响应头
response.setHeader(
  'Strict-Transport-Security',
  'max-age=31536000; includeSubDomains; preload'
);
```

## 6. WS vs WSS 对比

| 特性 | WS | WSS |
|-----|----|----|
| **协议** | ws:// | wss:// |
| **端口** | 80 | 443 |
| **加密** | 无 | TLS/SSL |
| **性能** | 快（无加密开销） | 稍慢（加密开销） |
| **安全性** | 低（明文传输） | 高（加密传输） |
| **证书** | 不需要 | 需要 SSL 证书 |
| **适用场景** | 内网、开发环境 | 生产环境、公网 |

## 7. 常见问题

### 7.1 自签名证书问题

```javascript
// 开发环境：忽略证书验证（不要在生产环境使用！）
const ws = new WebSocket('wss://localhost:443', {
  rejectUnauthorized: false // ⚠️ 仅用于开发
});
```

### 7.2 混合内容问题

```javascript
// ❌ 错误：HTTPS 页面使用 WS
// https://example.com 页面中
const ws = new WebSocket('ws://example.com'); // 浏览器会阻止

// ✅ 正确：HTTPS 页面使用 WSS
const wss = new WebSocket('wss://example.com');
```

### 7.3 性能优化

```javascript
// 1. 启用压缩
const wss = new WebSocket.Server({
  server,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    threshold: 1024 // 只压缩大于 1KB 的消息
  }
});

// 2. 连接复用
// TLS 会话恢复（Session Resumption）
const server = https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
  sessionTimeout: 300 // 5 分钟
});
```

## 8. 总结

### 8.1 加密层次

```
┌─────────────────────────────────────┐
│      应用层（可选额外加密）           │
├─────────────────────────────────────┤
│      WebSocket 协议层                │
├─────────────────────────────────────┤
│      TLS/SSL 加密层 ← WSS 的核心     │
├─────────────────────────────────────┤
│      TCP 传输层                      │
└─────────────────────────────────────┘
```

### 8.2 关键点

1. **WSS = WebSocket + TLS/SSL**，加密机制与 HTTPS 完全相同
2. **TLS 握手**建立加密通道，之后所有数据自动加密/解密
3. **对称加密**（AES）用于数据传输，**非对称加密**（RSA）用于密钥交换
4. **证书验证**防止中间人攻击
5. 生产环境**必须使用 WSS**，不要使用明文 WS

### 8.3 安全建议

- ✅ 使用有效的 SSL 证书（Let's Encrypt 免费）
- ✅ 启用 TLS 1.2 或更高版本
- ✅ 使用强加密套件
- ✅ 定期更新证书
- ✅ 实施证书固定（高安全场景）
- ❌ 不要在生产环境禁用证书验证
- ❌ 不要使用过期或自签名证书（生产环境）
