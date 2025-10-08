# Ajax / Fetch / Axios 对比（面试必考）

## 1. 三者对比总览

| 特性        | Ajax (XMLHttpRequest) | Fetch | Axios |
|------------|----------------------|-------|-------|
| **类型**    | 浏览器原生 API | 浏览器原生 API | 第三方库 |
| **Promise**| 不支持（需手动封装） | 原生支持 | 原生支持 |
| **兼容性**  | IE5+ | IE 不支持 | IE 需要 polyfill |
| **请求取消** | 支持（xhr.abort()） | 支持（AbortController） | 支持（CancelToken） |
| **超时设置** | 支持（xhr.timeout） | 不支持（需手动实现） | 支持（timeout） |
| **拦截器**  | 不支持 | 不支持 | 支持 |
| **进度监控** | 支持（xhr.onprogress） | 不支持 | 支持 |
| **自动转换 JSON** | 不支持 | 不支持 | 支持 |
| **CSRF 防护**| 不支持 | 不支持 | 支持 |
| **错误处理** | 通过状态码判断 | 只有网络错误才 reject | 状态码错误会 reject |

-------

## 2. Ajax (XMLHttpRequest)

### 特点

- 浏览器最原始的 HTTP 请求方式
- 需要手动处理各种状态和错误
- 不支持 Promise（需要手动封装）
- 支持进度监控、请求取消

### 基本用法

```javascript
// 最简单的 GET 请求
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};

xhr.open('GET', 'https://api.example.com/data', true);
xhr.send();
```

### Promise 封装版

```javascript
function ajax(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(xhr.status));
        }
      }
    };
    
    xhr.open('GET', url, true);
    xhr.send();
  });
}
```

### 优点
- ✅ 浏览器原生支持，兼容性好（IE5+）
- ✅ 支持进度监控（上传/下载进度）
- ✅ 支持请求取消（xhr.abort()）
- ✅ 支持超时设置（xhr.timeout）

### 缺点
- ❌ API 设计不友好，代码冗长
- ❌ 不支持 Promise，需要手动封装
- ❌ 错误处理复杂
- ❌ 不支持拦截器

---

## 3. Fetch

### 特点

- 现代浏览器原生 API
- 基于 Promise 设计
- 语法简洁
- **注意：只有网络错误才会 reject，HTTP 错误（如 404、500）不会 reject**

### 基本用法

```javascript
// GET 请求
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('请求失败', error);
  });

// POST 请求
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: '张三', age: 25 })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### async/await 用法

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('请求失败', error);
  }
}
```

### 请求取消

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    }
  });

// 取消请求
controller.abort();
```

### 超时实现

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ]);
}

fetchWithTimeout('https://api.example.com/data', 3000)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 优点
- ✅ 语法简洁，基于 Promise
- ✅ 支持 async/await
- ✅ 支持请求取消（AbortController）
- ✅ 浏览器原生支持，无需引入库

### 缺点
- ❌ IE 不支持（需要 polyfill）
- ❌ 不支持超时设置（需要手动实现）
- ❌ 不支持进度监控
- ❌ 不支持拦截器
- ❌ **只有网络错误才 reject，HTTP 错误不会 reject**（需要手动判断 response.ok）
- ❌ 默认不携带 cookie（需要设置 credentials: 'include'）

---

## 4. Axios

### 特点

- 第三方库，基于 Promise
- 功能强大，API 友好
- 支持拦截器、自动转换 JSON、CSRF 防护
- 浏览器和 Node.js 都支持

### 基本用法

```javascript
// GET 请求
axios.get('https://api.example.com/data')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('请求失败', error);
  });

// POST 请求
axios.post('https://api.example.com/users', {
  name: '张三',
  age: 25
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('请求失败', error);
  });

// 完整配置
axios({
  url: 'https://api.example.com/data',
  method: 'GET',
  params: { id: 1 }, // GET 参数
  data: { name: '张三' }, // POST 数据
  headers: {
    'Authorization': 'Bearer token123'
  },
  timeout: 5000, // 超时时间
  responseType: 'json' // 响应类型
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

### 拦截器

```javascript
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    config.headers.Authorization = 'Bearer ' + getToken();
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data;
  },
  error => {
    // 对响应错误做点什么
    if (error.response.status === 401) {
      // 未授权，跳转登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 请求取消

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('https://api.example.com/data', {
  cancelToken: source.token
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log('请求被取消', error.message);
    }
  });

// 取消请求
source.cancel('操作被用户取消');
```

### 并发请求

```javascript
axios.all([
  axios.get('https://api.example.com/users'),
  axios.get('https://api.example.com/posts')
])
  .then(axios.spread((users, posts) => {
    console.log('用户', users.data);
    console.log('文章', posts.data);
  }));
```

### 优点
- ✅ 功能强大，API 友好
- ✅ 支持拦截器（请求/响应拦截）
- ✅ 自动转换 JSON
- ✅ 支持超时设置
- ✅ 支持请求取消
- ✅ 支持进度监控
- ✅ 支持 CSRF 防护
- ✅ **HTTP 错误会自动 reject**
- ✅ 浏览器和 Node.js 都支持

### 缺点
- ❌ 需要引入第三方库（增加包体积）
- ❌ IE 需要 polyfill

---

## 5. 常见面试题

### Q1: Ajax、Fetch、Axios 的区别？

**答案：**

| 对比项 | Ajax | Fetch | Axios |
|--------|------|-------|-------|
| **类型** | 原生 API | 原生 API | 第三方库 |
| **Promise** | 不支持 | 支持 | 支持 |
| **兼容性** | IE5+ | 不支持 IE | 需要 polyfill |
| **错误处理** | 手动判断状态码 | 只有网络错误才 reject | HTTP 错误自动 reject |
| **拦截器** | 不支持 | 不支持 | 支持 |
| **超时** | 支持 | 不支持 | 支持 |

**选择建议：**
- 需要兼容老浏览器 → **Ajax**
- 简单请求，不需要复杂功能 → **Fetch**
- 复杂项目，需要拦截器、超时等功能 → **Axios**

---

### Q2: Fetch 和 Axios 的主要区别？

**答案：**

**1. 错误处理不同**
```javascript
// Fetch：只有网络错误才 reject
fetch('/api/data')
  .then(response => {
    // 即使是 404、500，也会进入这里
    if (!response.ok) {
      throw new Error('HTTP error');
    }
    return response.json();
  });

// Axios：HTTP 错误会自动 reject
axios.get('/api/data')
  .then(response => {
    // 只有 2xx 状态码才会进入这里
    console.log(response.data);
  })
  .catch(error => {
    // 4xx、5xx 会自动进入这里
    console.error(error);
  });
```

**2. 数据转换**
```javascript
// Fetch：需要手动转换
fetch('/api/data')
  .then(response => response.json()) // 手动转换
  .then(data => console.log(data));

// Axios：自动转换
axios.get('/api/data')
  .then(response => console.log(response.data)); // 自动转换
```

**3. 拦截器**
```javascript
// Fetch：不支持拦截器

// Axios：支持拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer token';
  return config;
});
```

---

### Q3: 为什么 Fetch 只有网络错误才 reject？

**答案：**

Fetch 的设计理念是：**HTTP 响应本身不是错误，只有网络故障才是错误**。

- **网络错误**（reject）：无法连接服务器、DNS 解析失败、网络中断
- **HTTP 错误**（resolve）：404、500 等，服务器正常响应，只是返回了错误状态码

**解决方案：**
```javascript
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error('请求失败', error);
  });
```

---

### Q4: 如何用 Fetch 实现超时？

**答案：**

Fetch 不支持超时，需要使用 `Promise.race` 实现：

```javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ]);
}

fetchWithTimeout('/api/data', 3000)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

---

### Q5: 如何取消 Ajax/Fetch/Axios 请求？

**答案：**

**Ajax (XMLHttpRequest):**
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data');
xhr.send();

// 取消请求
xhr.abort();
```

**Fetch:**
```javascript
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
  .then(response => response.json())
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    }
  });

// 取消请求
controller.abort();
```

**Axios:**
```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/data', { cancelToken: source.token })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log('请求被取消');
    }
  });

// 取消请求
source.cancel('操作被用户取消');
```

---

### Q6: Axios 拦截器的应用场景？

**答案：**

**1. 统一添加 Token**
```javascript
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**2. 统一错误处理**
```javascript
axios.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response.status === 401) {
      // 未授权，跳转登录
      window.location.href = '/login';
    } else if (error.response.status === 500) {
      // 服务器错误，提示用户
      alert('服务器错误，请稍后重试');
    }
    return Promise.reject(error);
  }
);
```

**3. Loading 状态管理**
```javascript
let loadingCount = 0;

axios.interceptors.request.use(config => {
  loadingCount++;
  showLoading();
  return config;
});

axios.interceptors.response.use(
  response => {
    loadingCount--;
    if (loadingCount === 0) {
      hideLoading();
    }
    return response;
  },
  error => {
    loadingCount--;
    if (loadingCount === 0) {
      hideLoading();
    }
    return Promise.reject(error);
  }
);
```

---

### Q7: 如何监控上传/下载进度？

**答案：**

**Ajax (XMLHttpRequest):**
```javascript
const xhr = new XMLHttpRequest();

// 上传进度
xhr.upload.onprogress = function(event) {
  if (event.lengthComputable) {
    const percent = (event.loaded / event.total) * 100;
    console.log(`上传进度: ${percent}%`);
  }
};

// 下载进度
xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    const percent = (event.loaded / event.total) * 100;
    console.log(`下载进度: ${percent}%`);
  }
};

xhr.open('POST', '/api/upload');
xhr.send(formData);
```

**Axios:**
```javascript
axios.post('/api/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    console.log(`上传进度: ${percent}%`);
  },
  onDownloadProgress: (progressEvent) => {
    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    console.log(`下载进度: ${percent}%`);
  }
});
```

**Fetch:**
```javascript
// Fetch 不支持进度监控（需要使用 ReadableStream）
```

---

## 6. 总结

### 选择建议

| 场景 | 推荐方案 |
|------|----------|
| **简单的 GET 请求** | Fetch |
| **需要兼容 IE** | Ajax 或 Axios |
| **需要拦截器** | Axios |
| **需要进度监控** | Ajax 或 Axios |
| **需要超时控制** | Ajax 或 Axios |
| **Node.js 环境** | Axios |
| **现代浏览器 + 简单需求** | Fetch |
| **复杂项目** | Axios |

### 面试重点

1. **三者的核心区别**：Promise 支持、错误处理、功能特性
2. **Fetch 的坑**：只有网络错误才 reject、不支持超时、不支持进度
3. **Axios 的优势**：拦截器、自动转换 JSON、HTTP 错误自动 reject
4. **请求取消**：三种方式的实现
5. **实际应用**：根据项目需求选择合适的方案
