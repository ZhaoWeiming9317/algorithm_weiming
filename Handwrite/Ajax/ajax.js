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
  // xhr.open(method, url, async, user, password)
  // 第三个参数 async：
  //   - true（默认）：异步请求，不阻塞页面，推荐使用 ✅
  //   - false：同步请求，会阻塞页面，已被弃用 ❌
  xhr.open('GET', url, true);
  
  // 4. 发送请求
  // 异步请求：send() 后立即继续执行，不等待响应
  // 响应返回时，会触发 onreadystatechange 回调
  xhr.send();
}

function simpleAjax2(url, callback) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(null, xhr.responseText);
    }
  }
  
  xhr.open('GET', url, true);

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
 * ========================================
 * 同步 vs 异步详解（面试重点）
 * ========================================
 */

// ❌ 同步请求（不推荐，会卡死页面）
function syncAjax(url) {
  const xhr = new XMLHttpRequest();
  
  // 第三个参数 false = 同步请求
  xhr.open('GET', url, false);
  
  // send() 后会阻塞，等待响应返回
  xhr.send();
  
  // 这行代码要等请求完成才执行
  console.log('请求完成');
  
  if (xhr.status === 200) {
    return xhr.responseText;
  }
}

// 执行效果：
// console.log('1');
// const data = syncAjax('/api/data'); // ⏸️ 卡在这里，等待 3 秒
// console.log('2'); // 3 秒后才执行
// 输出：1 -> (等待) -> 请求完成 -> 2


// ✅ 异步请求（推荐，不阻塞页面）
function asyncAjax(url, callback) {
  const xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    }
  };
  
  // 第三个参数 true = 异步请求（默认值）
  xhr.open('GET', url, true);
  
  // send() 后立即返回，不等待
  xhr.send();
  
  // 这行代码立即执行
  console.log('请求已发送，继续执行');
}

// 执行效果：
// console.log('1');
// asyncAjax('/api/data', data => console.log('3', data));
// console.log('2'); // 立即执行
// 输出：1 -> 请求已发送，继续执行 -> 2 -> (3秒后) -> 3 data


/**
 * 关键区别总结：
 * 
 * 1. 执行顺序
 *    - 同步：发送 -> 等待 -> 返回 -> 继续
 *    - 异步：发送 -> 继续 -> ... -> 回调
 * 
 * 2. 页面响应
 *    - 同步：页面冻结，无法操作 ❌
 *    - 异步：页面正常，可以操作 ✅
 * 
 * 3. 性能
 *    - 同步：串行执行，耗时累加
 *    - 异步：并发执行，性能更好
 * 
 * 4. 使用建议
 *    - 同步：几乎不用，即将被浏览器移除
 *    - 异步：标准做法，所有场景都推荐
 */


/**
 * ========================================
 * 面试背诵要点（必背）
 * ========================================
 * 
 * 1. 创建 XMLHttpRequest 对象
 * 2. 监听 onreadystatechange 事件
 * 3. 判断 readyState === 4 && status === 200
 * 4. 调用 open(method, url, async)  ← async 默认 true
 * 5. 调用 send(data)
 * 
 * 核心代码（5 行）：
 * const xhr = new XMLHttpRequest();
 * xhr.onreadystatechange = () => { 
 *   if (xhr.readyState === 4 && xhr.status === 200) { 
 *     callback(xhr.responseText); 
 *   } 
 * };
 * xhr.open('GET', url, true);  // true = 异步
 * xhr.send();
 * 
 * 
 * 面试问答：
 * Q: xhr.open() 的第三个参数是什么？
 * A: async 参数，true 表示异步（推荐），false 表示同步（弃用）
 * 
 * Q: 为什么推荐异步？
 * A: 异步不阻塞页面，用户可以继续操作，性能更好，是标准做法
 * 
 * Q: 同步和异步的区别？
 * A: 同步会等待响应返回，页面冻结；异步立即返回，通过回调处理结果
 */
