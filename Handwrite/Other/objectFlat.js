/**
 * 对象打平（Object Flatten）
 * 将嵌套对象转换为扁平对象，使用点号连接键名
 */

/**
 * 示例：
 * 输入：
 * {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: {
 *       e: 3
 *     }
 *   },
 *   f: [4, 5]
 * }
 * 
 * 输出：
 * {
 *   'a': 1,
 *   'b.c': 2,
 *   'b.d.e': 3,
 *   'f[0]': 4,
 *   'f[1]': 5
 * }
 */


// ============================================
// 方法1：递归实现（最常用）⭐⭐⭐
// ============================================

function flattenObject(obj, prefix = '', result = {}) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // 递归处理对象
        flattenObject(obj[key], newKey, result);
      } else {
        // 基本类型或数组，直接赋值
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

// 测试
const obj1 = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  },
  f: 4
};

console.log('方法1 - 基本对象：', flattenObject(obj1));
// { a: 1, 'b.c': 2, 'b.d.e': 3, f: 4 }


// ============================================
// 方法2：处理数组（使用 [index] 格式）⭐⭐⭐
// ============================================

function flattenObjectWithArray(obj, prefix = '', result = {}) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (Array.isArray(value)) {
        // 处理数组
        value.forEach((item, index) => {
          const arrayKey = `${newKey}[${index}]`;
          if (typeof item === 'object' && item !== null) {
            flattenObjectWithArray(item, arrayKey, result);
          } else {
            result[arrayKey] = item;
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        // 递归处理对象
        flattenObjectWithArray(value, newKey, result);
      } else {
        // 基本类型
        result[newKey] = value;
      }
    }
  }
  
  return result;
}

// 测试
const obj2 = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  },
  f: [4, 5, 6],
  g: {
    h: [7, 8]
  }
};

console.log('方法2 - 包含数组：', flattenObjectWithArray(obj2));
// {
//   a: 1,
//   'b.c': 2,
//   'b.d.e': 3,
//   'f[0]': 4,
//   'f[1]': 5,
//   'f[2]': 6,
//   'g.h[0]': 7,
//   'g.h[1]': 8
// }


// ============================================
// 方法3：面试背诵版（最简洁）⭐⭐⭐
// ============================================

function flatten(obj, prefix = '', res = {}) {
  for (let key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flatten(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  
  return res;
}

console.log('方法3 - 简洁版：', flatten(obj1));


// ============================================
// 方法4：使用栈实现（非递归）
// ============================================

function flattenObjectIterative(obj) {
  const result = {};
  const stack = [{ obj, prefix: '' }];
  
  while (stack.length > 0) {
    const { obj: current, prefix } = stack.pop();
    
    for (let key in current) {
      if (current.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = current[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // 将嵌套对象压入栈
          stack.push({ obj: value, prefix: newKey });
        } else {
          result[newKey] = value;
        }
      }
    }
  }
  
  return result;
}

console.log('方法4 - 非递归：', flattenObjectIterative(obj1));


// ============================================
// 方法5：使用 reduce 实现（函数式）
// ============================================

function flattenObjectReduce(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return { ...acc, ...flattenObjectReduce(value, newKey) };
    } else {
      return { ...acc, [newKey]: value };
    }
  }, {});
}

console.log('方法5 - reduce：', flattenObjectReduce(obj1));


// ============================================
// 方法6：自定义分隔符
// ============================================

function flattenWithSeparator(obj, separator = '.', prefix = '', result = {}) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}${separator}${key}` : key;
      const value = obj[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenWithSeparator(value, separator, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }
  
  return result;
}

console.log('方法6 - 自定义分隔符（_）：', flattenWithSeparator(obj1, '_'));
// { a: 1, 'b_c': 2, 'b_d_e': 3, f: 4 }


// ============================================
// 方法7：反向操作 - 对象还原（unflatten）⭐⭐
// ============================================

function unflattenObject(obj) {
  const result = {};
  
  for (let key in obj) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = obj[key];
  }
  
  return result;
}

const flatObj = {
  'a': 1,
  'b.c': 2,
  'b.d.e': 3,
  'f': 4
};

console.log('方法7 - 还原对象：', unflattenObject(flatObj));
// {
//   a: 1,
//   b: {
//     c: 2,
//     d: {
//       e: 3
//     }
//   },
//   f: 4
// }


// ============================================
// 方法8：处理数组的还原
// ============================================

function unflattenWithArray(obj) {
  const result = {};
  
  for (let key in obj) {
    const parts = key.split(/\.|\[|\]/).filter(Boolean);
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      
      // 判断下一个是数组索引还是对象键
      const isNextArray = /^\d+$/.test(nextPart);
      
      if (!current[part]) {
        current[part] = isNextArray ? [] : {};
      }
      
      current = current[part];
    }
    
    const lastKey = parts[parts.length - 1];
    current[lastKey] = obj[key];
  }
  
  return result;
}

const flatObjWithArray = {
  'a': 1,
  'b.c': 2,
  'f[0]': 4,
  'f[1]': 5,
  'g.h[0]': 7,
  'g.h[1]': 8
};

console.log('方法8 - 还原包含数组：', unflattenWithArray(flatObjWithArray));


// ============================================
// 方法9：处理特殊情况（null、undefined、Date 等）
// ============================================

function flattenObjectAdvanced(obj, prefix = '', result = {}) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      // 处理 null
      if (value === null) {
        result[newKey] = null;
      }
      // 处理 undefined
      else if (value === undefined) {
        result[newKey] = undefined;
      }
      // 处理 Date
      else if (value instanceof Date) {
        result[newKey] = value;
      }
      // 处理数组
      else if (Array.isArray(value)) {
        result[newKey] = value;
      }
      // 处理普通对象
      else if (typeof value === 'object') {
        flattenObjectAdvanced(value, newKey, result);
      }
      // 处理基本类型
      else {
        result[newKey] = value;
      }
    }
  }
  
  return result;
}

const obj3 = {
  a: 1,
  b: {
    c: null,
    d: undefined,
    e: new Date('2024-01-01')
  },
  f: [1, 2, 3]
};

console.log('方法9 - 处理特殊情况：', flattenObjectAdvanced(obj3));


// ============================================
// 方法10：限制深度
// ============================================

function flattenObjectWithDepth(obj, maxDepth = Infinity, currentDepth = 0, prefix = '', result = {}) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      
      if (
        currentDepth < maxDepth &&
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        flattenObjectWithDepth(value, maxDepth, currentDepth + 1, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }
  
  return result;
}

const deepObj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
      f: {
        g: 4
      }
    }
  }
};

console.log('方法10 - 限制深度为2：', flattenObjectWithDepth(deepObj, 2));
// {
//   a: 1,
//   'b.c': 2,
//   'b.d': { e: 3, f: { g: 4 } }
// }


// ============================================
// 实际应用场景
// ============================================

/**
 * 场景1：表单数据处理
 */
function flattenFormData(formData) {
  return flattenObject(formData);
}

const form = {
  user: {
    name: '张三',
    profile: {
      age: 25,
      address: {
        city: '北京',
        street: '朝阳区'
      }
    }
  }
};

console.log('表单数据打平：', flattenFormData(form));
// {
//   'user.name': '张三',
//   'user.profile.age': 25,
//   'user.profile.address.city': '北京',
//   'user.profile.address.street': '朝阳区'
// }


/**
 * 场景2：配置文件处理
 */
function flattenConfig(config) {
  return flattenObject(config);
}

const config = {
  database: {
    host: 'localhost',
    port: 3306,
    credentials: {
      username: 'admin',
      password: '123456'
    }
  },
  cache: {
    redis: {
      host: 'localhost',
      port: 6379
    }
  }
};

console.log('配置文件打平：', flattenConfig(config));


/**
 * 场景3：对象比较（打平后更容易比较）
 */
function compareObjects(obj1, obj2) {
  const flat1 = flattenObject(obj1);
  const flat2 = flattenObject(obj2);
  
  const keys1 = Object.keys(flat1);
  const keys2 = Object.keys(flat2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  return keys1.every(key => flat1[key] === flat2[key]);
}

const objA = { a: 1, b: { c: 2 } };
const objB = { a: 1, b: { c: 2 } };
const objC = { a: 1, b: { c: 3 } };

console.log('对象比较 A === B:', compareObjects(objA, objB)); // true
console.log('对象比较 A === C:', compareObjects(objA, objC)); // false


// ============================================
// 面试题
// ============================================

/**
 * 面试题1：实现一个对象打平函数
 * 要求：将嵌套对象转换为扁平对象，键名用点号连接
 */

// 答案：方法3（最简洁）
function flattenInterview(obj, prefix = '', res = {}) {
  for (let key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenInterview(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  
  return res;
}


/**
 * 面试题2：实现对象还原函数
 * 要求：将打平的对象还原为嵌套对象
 */

// 答案：
function unflattenInterview(obj) {
  const result = {};
  
  for (let key in obj) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = obj[key];
  }
  
  return result;
}


/**
 * 面试背诵要点：
 * 
 * 1. 核心思路：递归遍历对象
 * 2. 关键点：
 *    - 使用 prefix 记录当前路径
 *    - 判断是否为对象（typeof === 'object' && !== null && !Array.isArray）
 *    - 递归处理嵌套对象
 *    - 基本类型直接赋值
 * 3. 边界情况：
 *    - null 的处理（typeof null === 'object'）
 *    - 数组的处理
 *    - 空对象的处理
 * 
 * 4. 面试最简版（背诵）：
 */

function flattenSimple(obj, prefix = '', res = {}) {
  for (let key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenSimple(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  
  return res;
}


// ============================================
// 导出
// ============================================

module.exports = {
  flattenObject,
  flattenObjectWithArray,
  flatten,
  flattenObjectIterative,
  flattenObjectReduce,
  flattenWithSeparator,
  unflattenObject,
  unflattenWithArray,
  flattenObjectAdvanced,
  flattenObjectWithDepth
};
