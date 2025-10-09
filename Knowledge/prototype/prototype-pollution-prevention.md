# 防止原型链被覆写和污染

> 保护你的对象，避免原型链污染攻击

## 目录
1. [什么是原型链污染？](#什么是原型链污染)
2. [防护方法](#防护方法)
3. [实际应用场景](#实际应用场景)
4. [最佳实践](#最佳实践)

---

## 什么是原型链污染？

### 原型链污染的危害

**简单理解**：
原型链污染就像在公共水源里投毒，所有喝水的人都会中毒。

```javascript
// 正常情况
const user1 = { name: '张三' };
const user2 = { name: '李四' };

console.log(user1.isAdmin); // undefined
console.log(user2.isAdmin); // undefined

// 原型链污染
Object.prototype.isAdmin = true;

console.log(user1.isAdmin); // true ❌ 所有对象都被污染了！
console.log(user2.isAdmin); // true ❌
console.log({}.isAdmin);    // true ❌
```

### 真实攻击场景

#### 场景 1：深度合并对象

```javascript
// 危险的深度合并函数
function merge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// 攻击
const malicious = JSON.parse('{"__proto__": {"isAdmin": true}}');
const user = {};

merge(user, malicious);

// 所有对象都被污染了！
console.log({}.isAdmin); // true ❌
console.log([].isAdmin); // true ❌
```

#### 场景 2：动态属性赋值

```javascript
// 危险的动态赋值
function setProperty(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
}

// 攻击
const obj = {};
setProperty(obj, '__proto__.isAdmin', true);

console.log({}.isAdmin); // true ❌
```

#### 场景 3：查询参数解析

```javascript
// Express.js 中的查询参数
// URL: /api/user?__proto__[isAdmin]=true

app.get('/api/user', (req, res) => {
  const user = {};
  
  // 危险：直接使用查询参数
  Object.assign(user, req.query);
  
  // 所有对象都被污染了！
  console.log({}.isAdmin); // true ❌
});
```

---

## 防护方法

### 方法 1：Object.create(null) - 创建无原型对象 ⭐⭐⭐⭐⭐

**核心思想**：创建一个没有原型链的对象，从根源上防止污染。

#### 基本用法

```javascript
// 普通对象（有原型链）
const normalObj = {};
console.log(normalObj.__proto__);           // Object.prototype ✅
console.log(normalObj.toString);            // function toString() ✅
console.log(normalObj.hasOwnProperty);      // function hasOwnProperty() ✅

// 无原型对象（推荐）
const safeObj = Object.create(null);
console.log(safeObj.__proto__);             // undefined ✅
console.log(safeObj.toString);              // undefined ✅
console.log(safeObj.hasOwnProperty);        // undefined ✅

// 无法被污染
Object.prototype.isAdmin = true;
console.log(normalObj.isAdmin);             // true ❌ 被污染
console.log(safeObj.isAdmin);               // undefined ✅ 安全
```

#### 实际应用

**1. 配置对象**

```javascript
// ❌ 不安全
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// ✅ 安全
const safeConfig = Object.create(null);
safeConfig.apiUrl = 'https://api.example.com';
safeConfig.timeout = 5000;

// 或者
const safeConfig2 = Object.assign(Object.create(null), {
  apiUrl: 'https://api.example.com',
  timeout: 5000
});
```

**2. 字典/映射**

```javascript
// ❌ 不安全：可能与原型链属性冲突
const userMap = {};
userMap['constructor'] = 'some value';  // 危险！
console.log(userMap.constructor);       // [Function: Object] ❌

// ✅ 安全
const safeUserMap = Object.create(null);
safeUserMap['constructor'] = 'some value';
console.log(safeUserMap.constructor);   // 'some value' ✅
```

**3. 缓存对象**

```javascript
// ✅ 安全的缓存
class Cache {
  constructor() {
    this.store = Object.create(null);
  }
  
  set(key, value) {
    this.store[key] = value;
  }
  
  get(key) {
    return this.store[key];
  }
  
  has(key) {
    // 不能用 hasOwnProperty，因为没有原型
    return key in this.store;
  }
}

const cache = new Cache();
cache.set('__proto__', 'malicious');
console.log(cache.get('__proto__'));  // 'malicious' ✅ 只是普通键
console.log({}.malicious);            // undefined ✅ 没有污染
```

**4. 安全的深度合并**

```javascript
// ✅ 方案 1：使用 for...in（基础版）
function safeMerge(target, source) {
  const result = Object.create(null);
  
  // 复制 target
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      result[key] = target[key];
    }
  }
  
  // 合并 source（过滤危险键）
  for (let key in source) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        result[key] = safeMerge(result[key] || Object.create(null), source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// ✅ 方案 2：使用 Reflect.ownKeys（推荐，更安全）
function safeMergeWithReflect(target, source) {
  const result = Object.create(null);
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  // 复制 target 的所有自有属性（包括 Symbol 和不可枚举属性）
  Reflect.ownKeys(target).forEach(key => {
    if (!dangerousKeys.includes(key)) {
      result[key] = target[key];
    }
  });
  
  // 合并 source
  Reflect.ownKeys(source).forEach(key => {
    // 过滤危险键
    if (dangerousKeys.includes(key)) {
      return;
    }
    
    const value = source[key];
    
    if (typeof value === 'object' && value !== null) {
      // 递归合并对象
      result[key] = safeMergeWithReflect(
        result[key] || Object.create(null), 
        value
      );
    } else {
      result[key] = value;
    }
  });
  
  return result;
}

// 测试
const obj1 = { a: 1, [Symbol('test')]: 'symbol' };
const obj2 = JSON.parse('{"__proto__": {"isAdmin": true}}');

const merged1 = safeMerge(obj1, obj2);
console.log(merged1.a);        // 1 ✅
console.log(merged1.isAdmin);  // undefined ✅

const merged2 = safeMergeWithReflect(obj1, obj2);
console.log(merged2.a);        // 1 ✅
console.log(merged2[Symbol('test')]);  // 'symbol' ✅ 支持 Symbol
console.log({}.isAdmin);       // undefined ✅ 没有污染
```

**为什么 Reflect.ownKeys 更好？**

```javascript
// 对比：for...in vs Object.keys vs Reflect.ownKeys

const obj = {
  normalProp: 1,              // 可枚举
  [Symbol('sym')]: 'symbol'   // Symbol 属性
};

Object.defineProperty(obj, 'hidden', {
  value: 'secret',
  enumerable: false           // 不可枚举
});

// 1. for...in：只遍历可枚举属性（包括继承的）
for (let key in obj) {
  console.log(key);  // 'normalProp'（没有 Symbol 和不可枚举）
}

// 2. Object.keys：只返回可枚举的字符串属性
console.log(Object.keys(obj));  // ['normalProp']

// 3. Reflect.ownKeys：返回所有自有属性（包括 Symbol 和不可枚举）
console.log(Reflect.ownKeys(obj));  
// ['normalProp', 'hidden', Symbol(sym)] ✅ 最完整
```

**Reflect.ownKeys 的优势**：
1. ✅ 包含 Symbol 属性
2. ✅ 包含不可枚举属性
3. ✅ 只获取自有属性，不遍历原型链
4. ✅ 不会触发 getter
5. ✅ 更安全，不依赖 `hasOwnProperty`

---

### 方法 2：Object.freeze() - 冻结对象 ⭐⭐⭐⭐

**核心思想**：冻结对象，使其不可修改。

#### 基本用法

```javascript
// 冻结对象
const obj = { name: '张三' };
Object.freeze(obj);

// 无法修改
obj.name = '李四';        // 静默失败（严格模式下报错）
console.log(obj.name);    // '张三' ✅

// 无法添加
obj.age = 25;
console.log(obj.age);     // undefined ✅

// 无法删除
delete obj.name;
console.log(obj.name);    // '张三' ✅
```

#### 冻结原型链

```javascript
// ✅ 防止原型链被修改
Object.freeze(Object.prototype);
Object.freeze(Array.prototype);
Object.freeze(Function.prototype);

// 攻击失败
Object.prototype.isAdmin = true;
console.log({}.isAdmin);  // undefined ✅

Array.prototype.isAdmin = true;
console.log([].isAdmin);  // undefined ✅
```

#### 深度冻结

```javascript
// 普通 freeze 只冻结第一层
const obj = {
  name: '张三',
  address: {
    city: '北京'
  }
};

Object.freeze(obj);

obj.name = '李四';              // 无法修改 ✅
obj.address.city = '上海';      // 可以修改 ❌

// ✅ 深度冻结
function deepFreeze(obj) {
  // 冻结自身
  Object.freeze(obj);
  
  // 递归冻结所有属性
  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (obj[prop] !== null 
        && (typeof obj[prop] === 'object' || typeof obj[prop] === 'function')
        && !Object.isFrozen(obj[prop])) {
      deepFreeze(obj[prop]);
    }
  });
  
  return obj;
}

const deepObj = {
  name: '张三',
  address: {
    city: '北京'
  }
};

deepFreeze(deepObj);

deepObj.name = '李四';              // 无法修改 ✅
deepObj.address.city = '上海';      // 无法修改 ✅
```

#### 实际应用

**1. 常量配置**

```javascript
// ✅ 冻结配置，防止意外修改
const CONFIG = Object.freeze({
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000,
  MAX_RETRIES: 3
});

// 无法修改
CONFIG.API_URL = 'https://evil.com';
console.log(CONFIG.API_URL);  // 'https://api.example.com' ✅
```

**2. 枚举**

```javascript
// ✅ 创建不可变枚举
const Status = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error'
});

// 无法修改
Status.PENDING = 'modified';
console.log(Status.PENDING);  // 'pending' ✅
```

**3. 不可变数据**

```javascript
// ✅ 创建不可变数据结构
class ImmutableUser {
  constructor(data) {
    Object.assign(this, data);
    Object.freeze(this);
  }
  
  // 返回新对象而不是修改
  updateName(newName) {
    return new ImmutableUser({
      ...this,
      name: newName
    });
  }
}

const user = new ImmutableUser({ name: '张三', age: 25 });
user.name = '李四';  // 无法修改
console.log(user.name);  // '张三' ✅

const updatedUser = user.updateName('李四');
console.log(updatedUser.name);  // '李四' ✅
console.log(user.name);         // '张三' ✅ 原对象不变
```

---

### 方法 3：Object.seal() - 密封对象 ⭐⭐⭐

**核心思想**：密封对象，不能添加/删除属性，但可以修改现有属性。

```javascript
const obj = { name: '张三' };
Object.seal(obj);

// ✅ 可以修改
obj.name = '李四';
console.log(obj.name);  // '李四'

// ❌ 不能添加
obj.age = 25;
console.log(obj.age);   // undefined

// ❌ 不能删除
delete obj.name;
console.log(obj.name);  // '李四'
```

**对比**：

| 方法 | 添加属性 | 删除属性 | 修改属性 | 修改属性描述符 |
|------|---------|---------|---------|--------------|
| Object.preventExtensions() | ❌ | ✅ | ✅ | ✅ |
| Object.seal() | ❌ | ❌ | ✅ | ❌ |
| Object.freeze() | ❌ | ❌ | ❌ | ❌ |

---

### 方法 4：使用 Map 代替普通对象 ⭐⭐⭐⭐

**核心思想**：Map 不会继承 Object.prototype，更安全。

```javascript
// ❌ 普通对象
const obj = {};
obj['__proto__'] = { isAdmin: true };
console.log({}.isAdmin);  // true ❌ 可能被污染

// ✅ 使用 Map
const map = new Map();
map.set('__proto__', { isAdmin: true });
console.log({}.isAdmin);  // undefined ✅ 不会污染

// Map 的优势
map.set('constructor', 'value');  // ✅ 安全
map.set('toString', 'value');     // ✅ 安全
map.set('hasOwnProperty', 'value'); // ✅ 安全

console.log(map.get('constructor'));  // 'value' ✅
```

**实际应用**：

```javascript
// ✅ 安全的用户数据存储
class UserStore {
  constructor() {
    this.users = new Map();
  }
  
  addUser(id, data) {
    this.users.set(id, data);
  }
  
  getUser(id) {
    return this.users.get(id);
  }
  
  hasUser(id) {
    return this.users.has(id);
  }
}

const store = new UserStore();
store.addUser('__proto__', { name: 'attacker' });
console.log(store.getUser('__proto__'));  // { name: 'attacker' } ✅
console.log({}.name);  // undefined ✅ 没有污染
```

---

### 方法 5：属性白名单验证 ⭐⭐⭐⭐

**核心思想**：只允许特定的属性名。

```javascript
// ✅ 白名单验证
function safeAssign(target, source, allowedKeys) {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (let key in source) {
    // 检查是否在白名单中
    if (!allowedKeys.includes(key)) {
      console.warn(`Rejected key: ${key}`);
      continue;
    }
    
    // 检查是否是危险键
    if (dangerousKeys.includes(key)) {
      console.warn(`Dangerous key: ${key}`);
      continue;
    }
    
    target[key] = source[key];
  }
  
  return target;
}

// 使用
const user = {};
const input = {
  name: '张三',
  age: 25,
  __proto__: { isAdmin: true },
  constructor: 'evil'
};

safeAssign(user, input, ['name', 'age', 'email']);
console.log(user);  // { name: '张三', age: 25 } ✅
console.log({}.isAdmin);  // undefined ✅
```

---

### 方法 6：使用 Object.defineProperty() ⭐⭐⭐

**核心思想**：使用属性描述符控制属性行为。

```javascript
// ✅ 创建不可配置的属性
const obj = {};

Object.defineProperty(obj, 'name', {
  value: '张三',
  writable: false,      // 不可修改
  enumerable: true,     // 可枚举
  configurable: false   // 不可删除/重新配置
});

obj.name = '李四';      // 无法修改
delete obj.name;        // 无法删除
console.log(obj.name);  // '张三' ✅

// ✅ 保护原型链
Object.defineProperty(Object.prototype, 'isAdmin', {
  value: undefined,
  writable: false,
  configurable: false
});

Object.prototype.isAdmin = true;  // 无法修改
console.log({}.isAdmin);          // undefined ✅
```

---

## 实际应用场景

### 场景 1：Express.js 安全处理

```javascript
const express = require('express');
const app = express();

// ❌ 不安全
app.post('/api/user', (req, res) => {
  const user = {};
  Object.assign(user, req.body);  // 危险！
  // 可能被污染：{"__proto__": {"isAdmin": true}}
});

// ✅ 安全方案 1：使用 Object.create(null)
app.post('/api/user', (req, res) => {
  const user = Object.create(null);
  
  // 白名单验证
  const allowedKeys = ['name', 'email', 'age'];
  for (let key of allowedKeys) {
    if (req.body[key] !== undefined) {
      user[key] = req.body[key];
    }
  }
  
  res.json(user);
});

// ✅ 安全方案 2：使用验证库
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(0).max(120)
});

app.post('/api/user', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details });
  }
  
  // value 是经过验证的安全对象
  res.json(value);
});
```

### 场景 2：JSON 解析安全

```javascript
// ❌ 不安全
const data = JSON.parse(userInput);
const config = {};
Object.assign(config, data);  // 危险！

// ✅ 安全方案
function safeJSONParse(jsonString) {
  const parsed = JSON.parse(jsonString);
  
  // 递归清理危险键
  function clean(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    const result = Object.create(null);
    
    for (let key in obj) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      
      if (obj.hasOwnProperty(key)) {
        result[key] = clean(obj[key]);
      }
    }
    
    return result;
  }
  
  return clean(parsed);
}

// 使用
const safeData = safeJSONParse('{"__proto__": {"isAdmin": true}}');
console.log(safeData.isAdmin);  // undefined ✅
console.log({}.isAdmin);        // undefined ✅
```

### 场景 3：配置文件加载

```javascript
// ✅ 安全的配置加载
class Config {
  constructor() {
    this.data = Object.create(null);
    Object.freeze(Object.prototype);  // 冻结原型链
  }
  
  load(configObject) {
    const allowedKeys = ['apiUrl', 'timeout', 'retries', 'debug'];
    
    for (let key of allowedKeys) {
      if (configObject[key] !== undefined) {
        this.data[key] = configObject[key];
      }
    }
    
    // 冻结配置
    Object.freeze(this.data);
  }
  
  get(key) {
    return this.data[key];
  }
}

// 使用
const config = new Config();
config.load({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  __proto__: { isAdmin: true }  // 被忽略
});

console.log(config.get('apiUrl'));  // 'https://api.example.com' ✅
console.log(config.get('isAdmin')); // undefined ✅
```

### 场景 4：缓存系统

```javascript
// ✅ 安全的缓存实现
class SafeCache {
  constructor() {
    // 使用 Map 而不是普通对象
    this.cache = new Map();
  }
  
  set(key, value, ttl = 0) {
    const item = {
      value,
      expireAt: ttl > 0 ? Date.now() + ttl : null
    };
    
    this.cache.set(key, item);
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return undefined;
    
    // 检查是否过期
    if (item.expireAt && Date.now() > item.expireAt) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// 使用
const cache = new SafeCache();
cache.set('__proto__', 'malicious');
console.log(cache.get('__proto__'));  // 'malicious' ✅ 只是普通键
console.log({}.malicious);            // undefined ✅ 没有污染
```

---

## 最佳实践

### 1. 选择合适的方法

| 场景 | 推荐方法 | 原因 |
|------|---------|------|
| 字典/映射 | `Object.create(null)` 或 `Map` | 无原型链，最安全 |
| 常量配置 | `Object.freeze()` | 不可修改 |
| 用户输入 | 白名单验证 | 只允许特定属性 |
| 缓存 | `Map` | 性能好，安全 |
| API 响应 | `Object.create(null)` + 验证 | 防止污染 |

### 2. 组合使用

```javascript
// ✅ 最佳实践：组合多种方法
function createSafeConfig(input) {
  // 1. 创建无原型对象
  const config = Object.create(null);
  
  // 2. 白名单验证
  const allowedKeys = ['apiUrl', 'timeout', 'retries'];
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (let key in input) {
    // 检查白名单
    if (!allowedKeys.includes(key)) continue;
    
    // 检查危险键
    if (dangerousKeys.includes(key)) continue;
    
    // 类型验证
    if (key === 'timeout' && typeof input[key] !== 'number') continue;
    if (key === 'apiUrl' && typeof input[key] !== 'string') continue;
    
    config[key] = input[key];
  }
  
  // 3. 冻结配置
  return Object.freeze(config);
}

// 使用
const config = createSafeConfig({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  __proto__: { isAdmin: true },  // 被过滤
  constructor: 'evil'             // 被过滤
});

console.log(config.apiUrl);   // 'https://api.example.com' ✅
console.log(config.isAdmin);  // undefined ✅
config.timeout = 10000;       // 无法修改 ✅
```

### 3. 防御性编程

```javascript
// ✅ 始终假设输入是不可信的
function processUserData(input) {
  // 1. 验证输入类型
  if (typeof input !== 'object' || input === null) {
    throw new Error('Invalid input');
  }
  
  // 2. 创建安全对象
  const safeData = Object.create(null);
  
  // 3. 白名单 + 类型检查
  const schema = {
    name: 'string',
    age: 'number',
    email: 'string'
  };
  
  for (let key in schema) {
    if (input[key] !== undefined && typeof input[key] === schema[key]) {
      safeData[key] = input[key];
    }
  }
  
  return safeData;
}
```

### 4. 库和框架

使用成熟的库来处理对象操作：

```javascript
// ✅ 使用 lodash 的安全方法
const _ = require('lodash');

// 安全的深度合并
const merged = _.merge({}, obj1, obj2);

// ✅ 使用 Joi 验证
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().min(0)
});

const { error, value } = schema.validate(input);

// ✅ 使用 class-validator
import { IsString, IsNumber, validate } from 'class-validator';

class User {
  @IsString()
  name: string;
  
  @IsNumber()
  age: number;
}
```

---

## 总结

### 防护方法对比

| 方法 | 安全性 | 性能 | 易用性 | 推荐场景 |
|------|-------|------|-------|---------|
| `Object.create(null)` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 字典、配置 |
| `Object.freeze()` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 常量、枚举 |
| `Map` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 缓存、映射 |
| 白名单验证 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 用户输入 |
| 验证库 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 复杂验证 |

### 快速记忆

**防止原型链污染的三个原则**：
1. **隔离**：使用 `Object.create(null)` 或 `Map`
2. **冻结**：使用 `Object.freeze()` 保护关键对象
3. **验证**：白名单 + 类型检查

**危险的三个键**：
- `__proto__`
- `constructor`
- `prototype`

**安全检查清单**：
- ✅ 使用 `Object.create(null)` 创建字典对象
- ✅ 冻结全局原型链（生产环境）
- ✅ 验证所有用户输入
- ✅ 使用白名单而不是黑名单
- ✅ 优先使用 `Map` 而不是普通对象
- ✅ 使用成熟的验证库

---

加油！掌握这些方法，你的代码就能抵御原型链污染攻击了！💪
