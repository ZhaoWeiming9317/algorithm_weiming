/**
 * Cookie SameSite 属性详解
 * 用于防止 CSRF 攻击和提升安全性
 */

// ==================== SameSite 基础概念 ====================

/**
 * SameSite 是什么？
 * 
 * SameSite 是 Cookie 的一个属性，用于控制 Cookie 在跨站请求中的发送行为
 * 它是防止 CSRF（跨站请求伪造）攻击的重要安全机制
 * 
 * 语法：Set-Cookie: name=value; SameSite=Strict|Lax|None
 */

// ==================== SameSite 的三个值 ====================

/**
 * 1. SameSite=Strict（最严格）
 * 
 * 特点：
 * - 只有在同站请求中才会发送 Cookie
 * - 跨站请求绝对不会发送 Cookie
 * - 安全性最高
 * 
 * 问题：
 * - 用户体验差，第三方网站无法使用 Cookie
 * - 从外部链接跳转到网站时，用户需要重新登录
 * 
 * 适用场景：
 * - 银行、支付等对安全性要求极高的网站
 * - 内部管理系统
 */
function setStrictCookie() {
  // 设置 Strict Cookie
  document.cookie = "sessionId=abc123; SameSite=Strict; Secure";
  
  // 示例：用户从邮件链接跳转到银行网站
  // 结果：需要重新登录，因为 Cookie 不会发送
}

/**
 * 2. SameSite=Lax（默认值，推荐）
 * 
 * 特点：
 * - 同站请求：发送 Cookie
 * - 跨站请求：大部分不发送，但导航请求会发送
 * - 平衡了安全性和用户体验
 * 
 * 会发送 Cookie 的跨站请求：
 * - 链接跳转：<a href="https://example.com">
 * - 表单提交：<form action="https://example.com">
 * - 页面导航：window.location.href
 * 
 * 不会发送 Cookie 的跨站请求：
 * - AJAX 请求
 * - 图片请求：<img src="https://example.com/image">
 * - iframe 请求
 * 
 * 适用场景：
 * - 大多数网站的首选
 * - 既保证安全又提供良好用户体验
 */
function setLaxCookie() {
  // 设置 Lax Cookie（现代浏览器默认值）
  document.cookie = "sessionId=abc123; SameSite=Lax; Secure";
  
  // 示例：用户从 Google 搜索结果点击链接
  // 结果：Cookie 会发送，用户保持登录状态
}

/**
 * 3. SameSite=None（最宽松）
 * 
 * 特点：
 * - 所有跨站请求都会发送 Cookie
 * - 必须配合 Secure 属性使用
 * - 安全性最低
 * 
 * 问题：
 * - 容易受到 CSRF 攻击
 * - 需要 HTTPS 环境
 * 
 * 适用场景：
 * - 第三方嵌入（iframe）
 * - 跨域 API 调用
 * - 需要保持登录状态的第三方服务
 */
function setNoneCookie() {
  // 设置 None Cookie（必须配合 Secure）
  document.cookie = "sessionId=abc123; SameSite=None; Secure";
  
  // 示例：在第三方网站嵌入的 iframe
  // 结果：Cookie 会发送，保持登录状态
}

// ==================== 为什么需要 SameSite？ ====================

/**
 * 1. 防止 CSRF 攻击
 * 
 * CSRF 攻击原理：
 * 1. 用户登录了银行网站 A，Cookie 保存在浏览器中
 * 2. 用户访问了恶意网站 B
 * 3. 网站 B 向银行网站 A 发送请求（携带用户的 Cookie）
 * 4. 银行网站 A 认为这是用户的合法请求
 * 5. 执行转账等危险操作
 * 
 * SameSite 如何防护：
 * - Strict：恶意网站无法获取到 Cookie
 * - Lax：大部分跨站请求无法获取到 Cookie
 * - None：无法防护（不推荐）
 */
function demonstrateCSRFProtection() {
  console.log('=== CSRF 攻击演示 ===');
  
  // 模拟用户登录银行网站
  document.cookie = "bankSession=user123; SameSite=Lax; Secure";
  
  // 恶意网站尝试发送请求
  fetch('https://bank.com/transfer', {
    method: 'POST',
    credentials: 'include', // 尝试发送 Cookie
    body: JSON.stringify({
      to: 'attacker',
      amount: 10000
    })
  }).then(response => {
    console.log('请求结果:', response.status);
    // 如果 SameSite=Lax，这个请求不会携带 Cookie
    // 银行网站会拒绝请求
  });
}

/**
 * 2. 提升隐私保护
 * 
 * 问题：
 * - 第三方网站可以追踪用户行为
 * - 广告商可以跨站跟踪用户
 * - 用户隐私泄露
 * 
 * SameSite 如何保护：
 * - 限制第三方 Cookie 的使用
 * - 减少跨站追踪
 * - 提升用户隐私
 */
function demonstratePrivacyProtection() {
  console.log('=== 隐私保护演示 ===');
  
  // 用户访问网站 A
  document.cookie = "userPreference=darkMode; SameSite=Lax";
  
  // 网站 A 嵌入的广告 iframe 尝试获取用户信息
  const iframe = document.createElement('iframe');
  iframe.src = 'https://advertiser.com/track';
  // 由于 SameSite=Lax，广告商无法获取到 Cookie
}

// ==================== 浏览器兼容性 ====================

/**
 * 浏览器支持情况：
 * 
 * Chrome 51+：支持
 * Firefox 60+：支持
 * Safari 12+：支持
 * Edge 79+：支持
 * 
 * 默认行为变化：
 * - Chrome 80+：默认 SameSite=Lax
 * - Firefox 69+：默认 SameSite=Lax
 * - Safari 13+：默认 SameSite=Lax
 */
function checkBrowserSupport() {
  console.log('=== 浏览器支持检查 ===');
  
  // 检查是否支持 SameSite
  const supportsSameSite = (() => {
    try {
      document.cookie = "test=1; SameSite=Strict";
      return document.cookie.includes('test=1');
    } catch (e) {
      return false;
    }
  })();
  
  console.log('支持 SameSite:', supportsSameSite);
  
  // 检查当前浏览器的默认行为
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) {
    console.log('Chrome 浏览器：默认 SameSite=Lax');
  } else if (userAgent.includes('Firefox')) {
    console.log('Firefox 浏览器：默认 SameSite=Lax');
  } else if (userAgent.includes('Safari')) {
    console.log('Safari 浏览器：默认 SameSite=Lax');
  }
}

// ==================== 实际应用示例 ====================

/**
 * 1. 电商网站 Cookie 设置
 */
function setEcommerceCookies() {
  // 用户会话 Cookie（需要跨站保护）
  document.cookie = "sessionId=user123; SameSite=Lax; Secure; HttpOnly";
  
  // 购物车 Cookie（需要跨站保护）
  document.cookie = "cartId=cart456; SameSite=Lax; Secure";
  
  // 第三方支付 Cookie（需要跨站发送）
  document.cookie = "paymentToken=pay789; SameSite=None; Secure";
}

/**
 * 2. 社交媒体网站 Cookie 设置
 */
function setSocialMediaCookies() {
  // 用户登录状态（需要跨站保护）
  document.cookie = "authToken=token123; SameSite=Lax; Secure; HttpOnly";
  
  // 第三方分享按钮（需要跨站发送）
  document.cookie = "shareSession=share456; SameSite=None; Secure";
}

/**
 * 3. 第三方服务 Cookie 设置
 */
function setThirdPartyCookies() {
  // 分析服务（需要跨站发送）
  document.cookie = "analyticsId=analytics123; SameSite=None; Secure";
  
  // 广告服务（需要跨站发送）
  document.cookie = "adId=ad456; SameSite=None; Secure";
}

// ==================== 最佳实践 ====================

/**
 * 1. 默认使用 Lax
 * - 大多数情况下，Lax 是最佳选择
 * - 平衡了安全性和用户体验
 */
function bestPracticeLax() {
  // 推荐：用户会话 Cookie
  document.cookie = "sessionId=abc123; SameSite=Lax; Secure; HttpOnly";
}

/**
 * 2. 敏感操作使用 Strict
 * - 银行、支付等敏感操作
 * - 内部管理系统
 */
function bestPracticeStrict() {
  // 推荐：敏感操作 Cookie
  document.cookie = "adminToken=admin123; SameSite=Strict; Secure; HttpOnly";
}

/**
 * 3. 第三方服务使用 None
 * - 必须配合 Secure 属性
 * - 确保在 HTTPS 环境下使用
 */
function bestPracticeNone() {
  // 推荐：第三方服务 Cookie
  document.cookie = "thirdPartyId=third123; SameSite=None; Secure";
}

/**
 * 4. 配合其他安全属性
 * - Secure：只在 HTTPS 下发送
 * - HttpOnly：防止 XSS 攻击
 * - Domain：限制域名范围
 */
function bestPracticeCombined() {
  // 推荐：完整的安全配置
  document.cookie = "sessionId=abc123; SameSite=Lax; Secure; HttpOnly; Domain=.example.com; Path=/";
}

// ==================== 常见问题 ====================

/**
 * 1. 为什么需要配合 Secure 属性？
 * 
 * 原因：
 * - SameSite=None 必须配合 Secure 使用
 * - 防止在 HTTP 环境下泄露 Cookie
 * - 确保 Cookie 只在安全连接中传输
 */
function whySecureRequired() {
  console.log('=== 为什么需要 Secure 属性 ===');
  
  // ❌ 错误：SameSite=None 没有 Secure
  // document.cookie = "sessionId=abc123; SameSite=None";
  
  // ✅ 正确：SameSite=None 配合 Secure
  document.cookie = "sessionId=abc123; SameSite=None; Secure";
}

/**
 * 2. 如何处理第三方登录？
 * 
 * 解决方案：
 * - 使用 SameSite=None + Secure
 * - 确保在 HTTPS 环境下
 * - 考虑使用 OAuth 2.0 等现代认证方式
 */
function handleThirdPartyLogin() {
  console.log('=== 第三方登录处理 ===');
  
  // 第三方登录 Cookie
  document.cookie = "oauthToken=oauth123; SameSite=None; Secure";
  
  // 或者使用现代方式：OAuth 2.0 + PKCE
  console.log('推荐使用 OAuth 2.0 + PKCE 进行第三方登录');
}

// ==================== 测试和调试 ====================

/**
 * 测试 SameSite 行为
 */
function testSameSiteBehavior() {
  console.log('=== SameSite 行为测试 ===');
  
  // 设置测试 Cookie
  document.cookie = "testCookie=test123; SameSite=Lax; Secure";
  
  // 检查 Cookie 是否设置成功
  console.log('当前 Cookie:', document.cookie);
  
  // 模拟跨站请求
  fetch('https://httpbin.org/cookies', {
    method: 'GET',
    credentials: 'include'
  }).then(response => response.json())
    .then(data => {
      console.log('跨站请求结果:', data);
      // 如果 SameSite=Lax，testCookie 不会发送
    });
}

// ==================== 总结 ====================

/**
 * SameSite 总结：
 * 
 * 1. 作用：防止 CSRF 攻击，提升安全性
 * 2. 三个值：
 *    - Strict：最严格，只同站发送
 *    - Lax：默认值，平衡安全和体验
 *    - None：最宽松，需要配合 Secure
 * 
 * 3. 推荐使用：
 *    - 大多数情况：SameSite=Lax
 *    - 敏感操作：SameSite=Strict
 *    - 第三方服务：SameSite=None + Secure
 * 
 * 4. 注意事项：
 *    - 现代浏览器默认 SameSite=Lax
 *    - SameSite=None 必须配合 Secure
 *    - 确保在 HTTPS 环境下使用
 */

// 运行测试
console.log('=== SameSite 属性详解 ===');
checkBrowserSupport();
testSameSiteBehavior();

module.exports = {
  setStrictCookie,
  setLaxCookie,
  setNoneCookie,
  demonstrateCSRFProtection,
  demonstratePrivacyProtection,
  checkBrowserSupport,
  setEcommerceCookies,
  setSocialMediaCookies,
  setThirdPartyCookies,
  bestPracticeLax,
  bestPracticeStrict,
  bestPracticeNone,
  bestPracticeCombined,
  whySecureRequired,
  handleThirdPartyLogin,
  testSameSiteBehavior
};
