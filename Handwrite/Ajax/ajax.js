/**
 * 手写 Ajax - 最简单版本（面试背诵版）
 */

// 方法1：最简单的 GET 请求
function simpleAjax(url, callback) {
  // 1. 创建 XMLHttpRequest 对象
  const xhr = new XMLHttpRequest();
  
  // 2. 监听状态变化
  xhr.onreadystatechange = function() {
    // readyState === 4 表示请求完成
    // status === 200 表示成功
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(null, xhr.responseText);
    }
  };
  
  // 3. 打开连接
  xhr.open('GET', url, true); // true 表示异步
  
  // 4. 发送请求
  xhr.send();
}

// 使用示例
simpleAjax('https://api.example.com/data', (err, data) => {
  if (err) {
    console.error('请求失败', err);
  } else {
    console.log('请求成功', data);
  }
});


/**
 * 方法2：支持 GET 和 POST 的版本
 */
function ajax(options) {
  const { url, method = 'GET', data = null, success, error } = options;
  
  // 1. 创建 XMLHttpRequest 对象
  const xhr = new XMLHttpRequest();
  
  // 2. 监听状态变化
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success && success(xhr.responseText);
      } else {
        error && error(xhr.status);
      }
    }
  };
  
  // 3. 打开连接
  xhr.open(method, url, true);
  
  // 4. 设置请求头（POST 需要）
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', 'application/json');
  }
  
  // 5. 发送请求
  xhr.send(data ? JSON.stringify(data) : null);
}

// 使用示例
// GET 请求
ajax({
  url: 'https://api.example.com/users',
  method: 'GET',
  success: (data) => {
    console.log('成功', data);
  },
  error: (status) => {
    console.error('失败', status);
  }
});

// POST 请求
ajax({
  url: 'https://api.example.com/users',
  method: 'POST',
  data: { name: '张三', age: 25 },
  success: (data) => {
    console.log('创建成功', data);
  },
  error: (status) => {
    console.error('创建失败', status);
  }
});


/**
 * 方法3：Promise 版本（推荐）
 */
function ajaxPromise(options) {
  const { url, method = 'GET', data = null, headers = {} } = options;
  
  return new Promise((resolve, reject) => {
    // 1. 创建 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    
    // 2. 监听状态变化
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`请求失败: ${xhr.status}`));
        }
      }
    };
    
    // 3. 监听错误
    xhr.onerror = function() {
      reject(new Error('网络错误'));
    };
    
    // 4. 监听超时
    xhr.ontimeout = function() {
      reject(new Error('请求超时'));
    };
    
    // 5. 打开连接
    xhr.open(method, url, true);
    
    // 6. 设置请求头
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
    
    // 7. 设置超时时间（可选）
    xhr.timeout = 5000; // 5秒
    
    // 8. 发送请求
    if (method === 'GET') {
      xhr.send();
    } else {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data ? JSON.stringify(data) : null);
    }
  });
}

// 使用示例
ajaxPromise({
  url: 'https://api.example.com/users',
  method: 'GET'
})
  .then(data => {
    console.log('成功', data);
  })
  .catch(err => {
    console.error('失败', err);
  });

// 使用 async/await
async function fetchData() {
  try {
    const data = await ajaxPromise({
      url: 'https://api.example.com/users',
      method: 'GET'
    });
    console.log('成功', data);
  } catch (err) {
    console.error('失败', err);
  }
}


/**
 * 方法4：完整版（支持所有功能）
 */
function ajaxComplete(options) {
  const defaults = {
    url: '',
    method: 'GET',
    data: null,
    headers: {},
    timeout: 0,
    responseType: 'json', // 'json' | 'text' | 'blob' | 'arraybuffer'
    withCredentials: false // 是否携带 cookie
  };
  
  const config = { ...defaults, ...options };
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // 监听状态变化
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response = xhr.responseText;
          
          // 根据 responseType 处理响应
          if (config.responseType === 'json') {
            try {
              response = JSON.parse(xhr.responseText);
            } catch (e) {
              reject(new Error('JSON 解析失败'));
              return;
            }
          }
          
          resolve(response);
        } else {
          reject(new Error(`请求失败: ${xhr.status}`));
        }
      }
    };
    
    // 监听错误
    xhr.onerror = () => reject(new Error('网络错误'));
    xhr.ontimeout = () => reject(new Error('请求超时'));
    
    // 处理 GET 请求的参数
    let requestUrl = config.url;
    if (config.method === 'GET' && config.data) {
      const params = new URLSearchParams(config.data).toString();
      requestUrl += (requestUrl.includes('?') ? '&' : '?') + params;
    }
    
    // 打开连接
    xhr.open(config.method, requestUrl, true);
    
    // 设置请求头
    Object.keys(config.headers).forEach(key => {
      xhr.setRequestHeader(key, config.headers[key]);
    });
    
    // 设置超时
    if (config.timeout) {
      xhr.timeout = config.timeout;
    }
    
    // 设置是否携带 cookie
    xhr.withCredentials = config.withCredentials;
    
    // 发送请求
    if (config.method === 'GET') {
      xhr.send();
    } else {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(config.data ? JSON.stringify(config.data) : null);
    }
  });
}

// 使用示例
ajaxComplete({
  url: 'https://api.example.com/users',
  method: 'POST',
  data: { name: '张三', age: 25 },
  headers: {
    'Authorization': 'Bearer token123'
  },
  timeout: 5000,
  responseType: 'json',
  withCredentials: true
})
  .then(data => {
    console.log('成功', data);
  })
  .catch(err => {
    console.error('失败', err);
  });


/**
 * XMLHttpRequest 的 readyState 状态值
 * 
 * 0 (UNSENT): 未初始化，尚未调用 open()
 * 1 (OPENED): 已打开，已调用 open()，但未调用 send()
 * 2 (HEADERS_RECEIVED): 已发送，已调用 send()，且接收到响应头
 * 3 (LOADING): 正在接收响应体
 * 4 (DONE): 请求完成，且响应已就绪
 */

/**
 * HTTP 状态码
 * 
 * 200: 成功
 * 201: 创建成功
 * 204: 无内容
 * 301: 永久重定向
 * 302: 临时重定向
 * 304: 未修改（缓存）
 * 400: 请求错误
 * 401: 未授权
 * 403: 禁止访问
 * 404: 未找到
 * 500: 服务器错误
 * 502: 网关错误
 * 503: 服务不可用
 */


// ============================================
// 面试背诵版（最简洁）
// ============================================

/**
 * 面试时手写 Ajax 的最简版本
 */
function myAjax(url) {
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

// 使用
myAjax('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error(err));


/**
 * 面试背诵要点：
 * 
 * 1. 创建 XMLHttpRequest 对象
 * 2. 监听 onreadystatechange 事件
 * 3. 判断 readyState === 4 && status === 200
 * 4. 调用 open(method, url, async)
 * 5. 调用 send(data)
 * 
 * 核心代码（5 步）：
 * const xhr = new XMLHttpRequest();
 * xhr.onreadystatechange = () => { if (xhr.readyState === 4 && xhr.status === 200) { ... } };
 * xhr.open('GET', url, true);
 * xhr.send();
 */
