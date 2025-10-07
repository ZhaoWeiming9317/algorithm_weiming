/**
 * 同源策略和跨域解决方案详解
 * 包括同源策略的定义、跨域方法、Cookie 发送规则等
 */

// ==================== 同源策略基础概念 ====================

/**
 * 同源策略是什么？
 * 
 * 同源策略（Same-Origin Policy）是浏览器的一个安全机制
 * 它限制了一个源的文档或脚本如何与另一个源的资源进行交互
 * 
 * 同源的定义：
 * - 协议（Protocol）相同
 * - 域名（Domain）相同  
 * - 端口（Port）相同
 * 
 * 示例：
 * https://www.example.com:443/page1.html
 * https://www.example.com:443/page2.html  ✅ 同源
 * 
 * https://www.example.com:443/page1.html
 * http://www.example.com:443/page1.html   ❌ 不同源（协议不同）
 * 
 * https://www.example.com:443/page1.html
 * https://api.example.com:443/page1.html  ❌ 不同源（域名不同）
 * 
 * https://www.example.com:443/page1.html
 * https://www.example.com:8080/page1.html ❌ 不同源（端口不同）
 */

// ==================== 同源策略的限制 ====================

/**
 * 1. 限制的操作
 * 
 * 同源策略限制以下操作：
 * - 读取跨域页面的 DOM
 * - 读取跨域页面的 Cookie、LocalStorage
 * - 发送跨域 AJAX 请求
 * - 访问跨域页面的 JavaScript 对象
 */
function demonstrateSameOriginRestrictions() {
  console.log('=== 同源策略限制演示 ===');
  
  // 1. 读取跨域 DOM（被阻止）
  try {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com';
    iframe.onload = function() {
      // 这里会抛出安全错误
      // const content = iframe.contentDocument; // ❌ 被阻止
    };
  } catch (e) {
    console.log('跨域 DOM 访问被阻止:', e.message);
  }
  
  // 2. 发送跨域 AJAX（被阻止）
  fetch('https://api.github.com/users')
    .then(response => response.json())
    .then(data => console.log('跨域请求成功:', data))
    .catch(error => console.log('跨域请求被阻止:', error.message));
}

/**
 * 2. 允许的操作
 * 
 * 同源策略允许以下操作：
 * - 嵌入跨域资源（img、script、link、iframe）
 * - 表单提交到跨域地址
 * - 重定向到跨域地址
 */
function demonstrateAllowedOperations() {
  console.log('=== 允许的跨域操作 ===');
  
  // 1. 嵌入跨域图片（允许）
  const img = document.createElement('img');
  img.src = 'https://via.placeholder.com/150'; // ✅ 允许
  
  // 2. 嵌入跨域脚本（允许）
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'; // ✅ 允许
  
  // 3. 表单提交到跨域（允许）
  const form = document.createElement('form');
  form.action = 'https://httpbin.org/post';
  form.method = 'POST';
  form.innerHTML = '<input name="data" value="test">';
  // document.body.appendChild(form); // ✅ 允许
}

// ==================== 跨域解决方案 ====================

/**
 * 1. CORS（跨域资源共享）
 * 
 * CORS 是最常用的跨域解决方案
 * 服务器通过设置响应头来允许跨域请求
 */
function demonstrateCORS() {
  console.log('=== CORS 跨域解决方案 ===');
  
  // 客户端发送跨域请求
  fetch('https://httpbin.org/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log('CORS 请求成功:', data))
  .catch(error => console.log('CORS 请求失败:', error));
  
  // 服务器需要设置响应头：
  // Access-Control-Allow-Origin: *
  // Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  // Access-Control-Allow-Headers: Content-Type, Authorization
}

/**
 * 2. JSONP（JSON with Padding）
 * 
 * JSONP 利用 script 标签可以跨域的特性
 * 通过回调函数获取跨域数据
 */
function demonstrateJSONP() {
  console.log('=== JSONP 跨域解决方案 ===');
  
  // 创建回调函数
  window.jsonpCallback = function(data) {
    console.log('JSONP 数据:', data);
    // 清理
    document.body.removeChild(script);
    delete window.jsonpCallback;
  };
  
  // 创建 script 标签
  const script = document.createElement('script');
  script.src = 'https://httpbin.org/json?callback=jsonpCallback';
  document.body.appendChild(script);
}

/**
 * 3. 代理服务器
 * 
 * 通过同源服务器代理跨域请求
 */
function demonstrateProxy() {
  console.log('=== 代理服务器跨域解决方案 ===');
  
  // 前端请求同源服务器
  fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://api.github.com/users',
      method: 'GET'
    })
  })
  .then(response => response.json())
  .then(data => console.log('代理请求成功:', data));
  
  // 服务器端代理代码示例：
  /*
  app.post('/api/proxy', async (req, res) => {
    const { url, method } = req.body;
    try {
      const response = await fetch(url, { method });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  */
}

/**
 * 4. WebSocket
 * 
 * WebSocket 不受同源策略限制
 */
function demonstrateWebSocket() {
  console.log('=== WebSocket 跨域解决方案 ===');
  
  const ws = new WebSocket('wss://echo.websocket.org');
  
  ws.onopen = function() {
    console.log('WebSocket 连接成功');
    ws.send('Hello WebSocket!');
  };
  
  ws.onmessage = function(event) {
    console.log('WebSocket 消息:', event.data);
  };
  
  ws.onerror = function(error) {
    console.log('WebSocket 错误:', error);
  };
}

// ==================== Cookie 发送规则 ====================

/**
 * Cookie 发送规则详解
 * 
 * 你的理解基本正确，但需要更精确的说明：
 * 
 * 1. 读请求（GET、HEAD、OPTIONS）：
 *    - 同源：自动发送 Cookie
 *    - 跨域：根据 SameSite 属性决定
 * 
 * 2. 写请求（POST、PUT、DELETE、PATCH）：
 *    - 同源：自动发送 Cookie
 *    - 跨域：根据 SameSite 属性决定
 * 
 * 3. SameSite 属性影响：
 *    - Strict：只在同站请求中发送
 *    - Lax：同站发送，跨站导航请求发送
 *    - None：所有跨站请求都发送（需要 Secure）
 */
function demonstrateCookieSendingRules() {
  console.log('=== Cookie 发送规则演示 ===');
  
  // 设置不同 SameSite 的 Cookie
  document.cookie = "strictCookie=strict123; SameSite=Strict; Secure";
  document.cookie = "laxCookie=lax123; SameSite=Lax; Secure";
  document.cookie = "noneCookie=none123; SameSite=None; Secure";
  
  // 测试同源请求
  fetch('/api/same-origin', {
    method: 'GET',
    credentials: 'include' // 发送 Cookie
  }).then(response => {
    console.log('同源请求：所有 Cookie 都会发送');
  });
  
  // 测试跨域请求
  fetch('https://httpbin.org/cookies', {
    method: 'GET',
    credentials: 'include' // 尝试发送 Cookie
  }).then(response => response.json())
    .then(data => {
      console.log('跨域请求 Cookie 发送结果:', data);
      // 结果取决于 SameSite 属性
    });
}

/**
 * 详细说明 Cookie 发送规则
 */
function explainCookieSendingRules() {
  console.log('=== Cookie 发送规则详细说明 ===');
  
  console.log(`
  1. 同源请求：
     - 无论什么方法（GET、POST、PUT 等）
     - 无论 SameSite 属性
     - 都会自动发送 Cookie
  
  2. 跨源请求：
     - GET/HEAD/OPTIONS（读请求）：
       * SameSite=Strict：不发送
       * SameSite=Lax：不发送（除非是导航请求）
       * SameSite=None：发送（需要 Secure）
     
     - POST/PUT/DELETE/PATCH（写请求）：
       * SameSite=Strict：不发送
       * SameSite=Lax：不发送
       * SameSite=None：发送（需要 Secure）
     
     注意：跨域请求默认都不发送 Cookie，除非明确设置 SameSite=None, 现代浏览器默认 SameSite=Lax
  
  3. 导航请求（特殊）：
     - 链接跳转：<a href="...">
     - 表单提交：<form action="...">
     - 页面导航：window.location.href
     - SameSite=Lax 会发送 Cookie
  `);
}

// ==================== 实际应用示例 ====================

/**
 * 1. 电商网站跨域场景
 */
function ecommerceCrossOriginExample() {
  console.log('=== 电商网站跨域示例 ===');
  
  // 主站：https://shop.example.com
  // API：https://api.example.com
  
  // 设置用户会话 Cookie
  document.cookie = "sessionId=user123; SameSite=Lax; Secure; HttpOnly";
  
  // 跨域 API 请求
  fetch('https://api.example.com/products', {
    method: 'GET',
    credentials: 'include' // 尝试发送 Cookie
  }).then(response => {
    // 由于 SameSite=Lax，Cookie 不会发送
    // 需要其他方式传递用户身份
  });
}

/**
 * 2. 第三方登录场景
 */
function thirdPartyLoginExample() {
  console.log('=== 第三方登录示例 ===');
  
  // 设置第三方登录 Cookie
  document.cookie = "oauthToken=token123; SameSite=None; Secure";
  
  // 跨域登录请求
  fetch('https://oauth.provider.com/login', {
    method: 'POST',
    credentials: 'include', // 发送 Cookie
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'user',
      password: 'pass'
    })
  }).then(response => {
    // 由于 SameSite=None，Cookie 会发送
  });
}

/**
 * 3. 单点登录（SSO）场景
 */
function ssoExample() {
  console.log('=== 单点登录示例 ===');
  
  // 设置 SSO Cookie
  document.cookie = "ssoToken=sso123; SameSite=Lax; Secure; Domain=.example.com";
  
  // 同域下的不同子域名
  fetch('https://admin.example.com/api/user', {
    method: 'GET',
    credentials: 'include'
  }).then(response => {
    // 由于 Domain=.example.com，Cookie 会发送
  });
}

// ==================== 安全考虑 ====================

/**
 * 1. CSRF 攻击防护
 */
function csrfProtection() {
  console.log('=== CSRF 攻击防护 ===');
  
  // 设置安全的 Cookie
  document.cookie = "sessionId=user123; SameSite=Lax; Secure; HttpOnly";
  
  // 添加 CSRF Token
  const csrfToken = 'csrf-token-123';
  document.cookie = `csrfToken=${csrfToken}; SameSite=Lax; Secure`;
  
  // 发送请求时包含 CSRF Token
  fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
    body: JSON.stringify({
      to: 'recipient',
      amount: 1000
    })
  });
}

/**
 * 2. XSS 攻击防护
 */
function xssProtection() {
  console.log('=== XSS 攻击防护 ===');
  
  // 设置 HttpOnly Cookie
  document.cookie = "sessionId=user123; SameSite=Lax; Secure; HttpOnly";
  
  // 这样 JavaScript 无法访问 Cookie
  console.log('HttpOnly Cookie 无法通过 JavaScript 访问');
  
  // 只有服务器可以访问
  fetch('/api/user', {
    credentials: 'include'
  }).then(response => {
    // 服务器可以读取 HttpOnly Cookie
  });
}

// ==================== 最佳实践 ====================

/**
 * 1. Cookie 安全配置
 */
function cookieSecurityBestPractices() {
  console.log('=== Cookie 安全最佳实践 ===');
  
  // 推荐的安全配置
  const secureCookie = "sessionId=user123; SameSite=Lax; Secure; HttpOnly; Domain=.example.com; Path=/";
  
  console.log(`
  推荐配置：
  - SameSite=Lax：平衡安全和体验
  - Secure：只在 HTTPS 下发送
  - HttpOnly：防止 XSS 攻击
  - Domain：限制域名范围
  - Path：限制路径范围
  `);
}

/**
 * 2. 跨域请求最佳实践
 */
function crossOriginBestPractices() {
  console.log('=== 跨域请求最佳实践 ===');
  
  console.log(`
  1. 优先使用 CORS
  2. 设置合适的 SameSite 属性
  3. 使用 HTTPS 确保安全
  4. 避免使用 SameSite=None（除非必要）
  5. 实施 CSRF 防护
  6. 使用 HttpOnly Cookie
  `);
}

// ==================== 总结 ====================

/**
 * 同源策略和跨域总结：
 * 
 * 1. 同源策略：
 *    - 限制跨域资源访问
 *    - 保护用户安全
 *    - 允许嵌入跨域资源
 * 
 * 2. 跨域解决方案：
 *    - CORS：最常用
 *    - JSONP：简单但有限制
 *    - 代理：服务器端解决
 *    - WebSocket：实时通信
 * 
 * 3. Cookie 发送规则：
 *    - 同源：自动发送
 *    - 跨源：根据 SameSite 属性
 *    - 读/写请求都受 SameSite 影响
 * 
 * 4. 安全考虑：
 *    - 防止 CSRF 攻击
 *    - 防止 XSS 攻击
 *    - 使用安全配置
 */

// 运行演示
console.log('=== 同源策略和跨域解决方案 ===');
demonstrateSameOriginRestrictions();
demonstrateAllowedOperations();
demonstrateCORS();
demonstrateJSONP();
demonstrateProxy();
demonstrateWebSocket();
demonstrateCookieSendingRules();
explainCookieSendingRules();
ecommerceCrossOriginExample();
thirdPartyLoginExample();
ssoExample();
csrfProtection();
xssProtection();
cookieSecurityBestPractices();
crossOriginBestPractices();

module.exports = {
  demonstrateSameOriginRestrictions,
  demonstrateAllowedOperations,
  demonstrateCORS,
  demonstrateJSONP,
  demonstrateProxy,
  demonstrateWebSocket,
  demonstrateCookieSendingRules,
  explainCookieSendingRules,
  ecommerceCrossOriginExample,
  thirdPartyLoginExample,
  ssoExample,
  csrfProtection,
  xssProtection,
  cookieSecurityBestPractices,
  crossOriginBestPractices
};


