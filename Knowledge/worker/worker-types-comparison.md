# Web Workers 类型对比

## 概述

Web Workers 允许在后台线程中运行 JavaScript，避免阻塞主线程。主要有三种类型：

- **Web Worker (Dedicated Worker)** - 专用工作线程
- **Shared Worker** - 共享工作线程
- **Service Worker** - 服务工作线程

---

## 1. Web Worker (Dedicated Worker)

### 特点
- 由单个页面创建和使用
- 与创建它的页面一对一绑定
- 页面关闭时自动终止
- 最常用的 Worker 类型

### 基本用法

**主线程 (main.js)**
```javascript
// 创建 Worker
const worker = new Worker('worker.js');

// 发送消息
worker.postMessage({ type: 'start', data: [1, 2, 3, 4, 5] });

// 接收消息
worker.onmessage = (event) => {
  console.log('收到结果:', event.data);
};

// 错误处理
worker.onerror = (error) => {
  console.error('Worker 错误:', error.message);
};

// 终止 Worker
worker.terminate();
```

**Worker 线程 (worker.js)**
```javascript
// 监听消息
self.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === 'start') {
    // 执行耗时计算
    const result = data.reduce((sum, num) => sum + num, 0);
    
    // 发送结果回主线程
    self.postMessage({ result });
  }
};

// 错误处理
self.onerror = (error) => {
  console.error('Worker 内部错误:', error);
};
```

### 使用场景
```javascript
// 1. 大数据处理
const worker = new Worker('data-processor.js');
worker.postMessage({ data: largeDataSet });

// 2. 图像处理
const imageWorker = new Worker('image-processor.js');
imageWorker.postMessage({ imageData, filter: 'blur' });

// 3. 复杂计算
const calcWorker = new Worker('calculator.js');
calcWorker.postMessage({ operation: 'fibonacci', n: 40 });

// 4. 文件解析
const parserWorker = new Worker('parser.js');
parserWorker.postMessage({ file: fileContent, type: 'csv' });
```

### 限制
- ❌ 无法访问 DOM
- ❌ 无法访问 window 对象
- ❌ 无法访问 document 对象
- ❌ 无法访问 parent 对象
- ✅ 可以使用 XMLHttpRequest / fetch
- ✅ 可以使用 WebSocket
- ✅ 可以使用 IndexedDB
- ✅ 可以使用定时器 (setTimeout, setInterval)

---

## 2. Shared Worker

### 特点
- 可被多个页面、iframe 或其他 Worker 共享
- 独立于创建它的页面运行
- 所有连接的页面都关闭后才终止
- 适合跨页面通信和共享状态

### 基本用法

**主线程 (page1.js / page2.js)**
```javascript
// 创建或连接到 Shared Worker
const sharedWorker = new SharedWorker('shared-worker.js');

// 通过 port 通信
sharedWorker.port.start();

// 发送消息
sharedWorker.port.postMessage({ type: 'getData' });

// 接收消息
sharedWorker.port.onmessage = (event) => {
  console.log('收到数据:', event.data);
};

// 错误处理
sharedWorker.port.onerror = (error) => {
  console.error('Shared Worker 错误:', error);
};
```

**Shared Worker 线程 (shared-worker.js)**
```javascript
// 存储所有连接的端口
const connections = [];

// 监听新连接
self.onconnect = (event) => {
  const port = event.ports[0];
  connections.push(port);
  
  console.log('新连接建立，当前连接数:', connections.length);
  
  // 监听该端口的消息
  port.onmessage = (e) => {
    const { type, data } = e.data;
    
    if (type === 'getData') {
      // 发送数据给请求的端口
      port.postMessage({ result: 'shared data' });
    } else if (type === 'broadcast') {
      // 广播给所有连接的端口
      connections.forEach(p => {
        p.postMessage({ broadcast: data });
      });
    }
  };
  
  port.start();
};
```

### 使用场景
```javascript
// 1. 跨标签页通信
// Tab 1
const worker = new SharedWorker('chat-worker.js');
worker.port.postMessage({ type: 'send', message: 'Hello from Tab 1' });

// Tab 2 会收到消息
worker.port.onmessage = (e) => {
  console.log('收到消息:', e.data.message);
};

// 2. 共享状态管理
const stateWorker = new SharedWorker('state-worker.js');
stateWorker.port.postMessage({ type: 'setState', key: 'user', value: userData });

// 3. 共享 WebSocket 连接
const wsWorker = new SharedWorker('websocket-worker.js');
wsWorker.port.postMessage({ type: 'subscribe', channel: 'updates' });

// 4. 共享缓存
const cacheWorker = new SharedWorker('cache-worker.js');
cacheWorker.port.postMessage({ type: 'get', key: 'config' });
```

### 限制
- ❌ 无法访问 DOM
- ❌ 浏览器支持较差（Safari 不支持）
- ❌ 调试相对困难
- ✅ 可以被多个页面共享
- ✅ 可以使用网络请求
- ✅ 可以使用 IndexedDB

---

## 3. Service Worker

### 特点
- 充当网络代理，拦截网络请求
- 独立于页面运行，页面关闭后仍可运行
- 必须在 HTTPS 环境下运行（localhost 除外）
- 用于离线缓存、推送通知、后台同步
- 有独立的生命周期

### 基本用法

**注册 Service Worker (main.js)**
```javascript
// 检查浏览器支持
if ('serviceWorker' in navigator) {
  // 注册 Service Worker
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker 注册成功:', registration.scope);
      
      // 检查更新
      registration.update();
    })
    .catch(error => {
      console.error('Service Worker 注册失败:', error);
    });
  
  // 监听 Service Worker 状态变化
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker 已更新');
  });
}

// 与 Service Worker 通信
navigator.serviceWorker.controller?.postMessage({
  type: 'CACHE_URLS',
  urls: ['/api/data', '/images/logo.png']
});

// 接收 Service Worker 消息
navigator.serviceWorker.addEventListener('message', (event) => {
  console.log('收到 SW 消息:', event.data);
});
```

**Service Worker (sw.js)**
```javascript
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
  
  // 强制跳过等待，立即激活
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 立即控制所有页面
  self.clients.claim();
});

// 拦截请求 - 缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存命中，返回缓存
        if (response) {
          return response;
        }
        
        // 缓存未命中，发起网络请求
        return fetch(event.request).then(response => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应并缓存
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
  );
});

// 推送通知
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/images/icon.png',
      badge: '/images/badge.png'
    })
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('https://example.com')
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // 执行后台同步逻辑
  const data = await getLocalData();
  await fetch('/api/sync', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 接收页面消息
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### 缓存策略

```javascript
// 1. Cache First (缓存优先)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// 2. Network First (网络优先)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

// 3. Stale While Revalidate (返回缓存，后台更新)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});

// 4. Network Only (仅网络)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// 5. Cache Only (仅缓存)
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request));
});
```

### 使用场景
```javascript
// 1. PWA 离线支持
// 缓存应用外壳，实现离线访问

// 2. 推送通知
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey
  });
});

// 3. 后台同步
navigator.serviceWorker.ready.then(registration => {
  registration.sync.register('sync-data');
});

// 4. 性能优化
// 预缓存关键资源，加快页面加载

// 5. API 请求缓存
// 缓存 API 响应，减少网络请求
```

### 生命周期
```javascript
// 安装 → 等待 → 激活 → 空闲 → 终止 → 获取/消息

// 状态检查
navigator.serviceWorker.ready.then(registration => {
  console.log('Service Worker 状态:', registration.active.state);
  // 'installing' | 'installed' | 'activating' | 'activated' | 'redundant'
});

// 更新 Service Worker
navigator.serviceWorker.register('/sw.js').then(registration => {
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // 新版本可用，提示用户刷新
        console.log('新版本可用，请刷新页面');
      }
    });
  });
});
```

---

## 4. 完整对比表

| 特性 | Web Worker | Shared Worker | Service Worker |
|------|-----------|---------------|----------------|
| **作用域** | 单个页面 | 多个页面/标签 | 整个域名 |
| **生命周期** | 与页面绑定 | 所有页面关闭后终止 | 独立生命周期 |
| **通信方式** | postMessage | port.postMessage | postMessage + 事件 |
| **主要用途** | 计算密集任务 | 跨页面通信 | 离线缓存、推送通知 |
| **网络拦截** | ❌ | ❌ | ✅ |
| **离线支持** | ❌ | ❌ | ✅ |
| **推送通知** | ❌ | ❌ | ✅ |
| **后台同步** | ❌ | ❌ | ✅ |
| **HTTPS 要求** | ❌ | ❌ | ✅ (localhost除外) |
| **浏览器支持** | ✅ 广泛支持 | ⚠️ Safari不支持 | ✅ 现代浏览器 |
| **调试难度** | 简单 | 中等 | 较难 |
| **访问 DOM** | ❌ | ❌ | ❌ |
| **访问 IndexedDB** | ✅ | ✅ | ✅ |
| **使用 fetch** | ✅ | ✅ | ✅ |
| **创建方式** | `new Worker()` | `new SharedWorker()` | `navigator.serviceWorker.register()` |

---

## 5. 实际应用案例

### Web Worker 案例：大数据排序
```javascript
// main.js
const worker = new Worker('sort-worker.js');
const largeArray = Array.from({ length: 1000000 }, () => Math.random());

console.time('排序耗时');
worker.postMessage(largeArray);

worker.onmessage = (e) => {
  console.timeEnd('排序耗时');
  console.log('排序完成，前10个元素:', e.data.slice(0, 10));
};

// sort-worker.js
self.onmessage = (e) => {
  const sorted = e.data.sort((a, b) => a - b);
  self.postMessage(sorted);
};
```

### Shared Worker 案例：跨标签页聊天
```javascript
// shared-chat-worker.js
const clients = new Set();

self.onconnect = (e) => {
  const port = e.ports[0];
  clients.add(port);
  
  port.onmessage = (event) => {
    const { type, message, username } = event.data;
    
    if (type === 'message') {
      // 广播给所有客户端
      clients.forEach(client => {
        if (client !== port) {
          client.postMessage({ username, message, timestamp: Date.now() });
        }
      });
    }
  };
  
  port.start();
};

// page.js
const chatWorker = new SharedWorker('shared-chat-worker.js');
chatWorker.port.start();

chatWorker.port.postMessage({
  type: 'message',
  username: 'User1',
  message: 'Hello everyone!'
});

chatWorker.port.onmessage = (e) => {
  displayMessage(e.data);
};
```

### Service Worker 案例：PWA 离线应用
```javascript
// app.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('PWA 已启用');
  });
}

// sw.js
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/app.css',
        '/scripts/app.js',
        OFFLINE_URL
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
```

---

## 6. 选择指南

### 使用 Web Worker 当你需要：
- ✅ 执行 CPU 密集型计算（加密、压缩、图像处理）
- ✅ 处理大量数据而不阻塞 UI
- ✅ 简单的后台任务
- ✅ 与单个页面交互

### 使用 Shared Worker 当你需要：
- ✅ 多个标签页之间共享数据
- ✅ 跨页面实时通信
- ✅ 共享 WebSocket 连接
- ✅ 减少资源占用（多个页面共享一个 Worker）

### 使用 Service Worker 当你需要：
- ✅ 构建 PWA（渐进式 Web 应用）
- ✅ 离线功能
- ✅ 推送通知
- ✅ 后台同步
- ✅ 网络请求拦截和缓存
- ✅ 性能优化（预缓存资源）

---

## 7. 最佳实践

### Web Worker 最佳实践
```javascript
// 1. 使用 Transferable Objects 提高性能
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage({ buffer }, [buffer]); // 转移所有权，而非复制

// 2. 错误处理
worker.onerror = (error) => {
  console.error('Worker 错误:', error.filename, error.lineno, error.message);
};

// 3. 及时终止不需要的 Worker
worker.terminate();

// 4. 使用 Worker Pool 管理多个 Worker
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workers = Array.from({ length: poolSize }, () => new Worker(workerScript));
    this.taskQueue = [];
    this.availableWorkers = [...this.workers];
  }
  
  async runTask(data) {
    if (this.availableWorkers.length === 0) {
      return new Promise(resolve => this.taskQueue.push({ data, resolve }));
    }
    
    const worker = this.availableWorkers.pop();
    return new Promise(resolve => {
      worker.onmessage = (e) => {
        resolve(e.data);
        this.availableWorkers.push(worker);
        this.processQueue();
      };
      worker.postMessage(data);
    });
  }
  
  processQueue() {
    if (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const { data, resolve } = this.taskQueue.shift();
      this.runTask(data).then(resolve);
    }
  }
}
```

### Service Worker 最佳实践
```javascript
// 1. 版本管理
const VERSION = 'v1.0.0';
const CACHE_NAME = `my-app-${VERSION}`;

// 2. 选择性缓存
const shouldCache = (request) => {
  const url = new URL(request.url);
  return url.origin === location.origin && 
         !url.pathname.startsWith('/api/');
};

// 3. 缓存大小限制
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

// 4. 更新提示
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
```

---

## 8. 调试技巧

### Chrome DevTools
```javascript
// Web Worker 调试
// 1. 打开 DevTools → Sources → Threads
// 2. 可以看到所有 Worker 线程
// 3. 设置断点调试

// Service Worker 调试
// 1. 打开 DevTools → Application → Service Workers
// 2. 可以查看状态、更新、注销
// 3. 勾选 "Update on reload" 方便开发

// Shared Worker 调试
// 1. 访问 chrome://inspect/#workers
// 2. 找到对应的 Shared Worker
// 3. 点击 inspect 打开调试窗口
```

### 常见问题排查
```javascript
// 1. Service Worker 不更新
// 解决：检查缓存策略，使用 skipWaiting()

// 2. Worker 无法加载
// 解决：检查路径、CORS 策略

// 3. 消息丢失
// 解决：确保在 onmessage 之前调用 port.start()

// 4. 内存泄漏
// 解决：及时 terminate() Worker，清理事件监听器
```

---

## 9. 浏览器兼容性

| Worker 类型 | Chrome | Firefox | Safari | Edge |
|------------|--------|---------|--------|------|
| Web Worker | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 12+ |
| Shared Worker | ✅ 4+ | ✅ 29+ | ❌ | ✅ 79+ |
| Service Worker | ✅ 40+ | ✅ 44+ | ✅ 11.1+ | ✅ 17+ |

### 特性检测
```javascript
// Web Worker
if (typeof Worker !== 'undefined') {
  // 支持 Web Worker
}

// Shared Worker
if (typeof SharedWorker !== 'undefined') {
  // 支持 Shared Worker
}

// Service Worker
if ('serviceWorker' in navigator) {
  // 支持 Service Worker
}
```

---

## 10. 总结

### 核心要点
1. **Web Worker** - 最常用，适合计算密集型任务
2. **Shared Worker** - 跨页面通信，但浏览器支持有限
3. **Service Worker** - PWA 核心，提供离线和缓存能力

### 选择建议
- 🎯 **单页面计算** → Web Worker
- 🎯 **跨页面通信** → Shared Worker (或考虑其他方案如 BroadcastChannel)
- 🎯 **离线应用/PWA** → Service Worker

### 注意事项
- 所有 Worker 都无法访问 DOM
- Service Worker 需要 HTTPS
- 合理使用缓存策略
- 注意浏览器兼容性
- 做好错误处理和降级方案
