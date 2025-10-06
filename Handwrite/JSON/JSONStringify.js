/**
 * 简单版本的 JSON.stringify 实现
 * 支持基本数据类型：string, number, boolean, null, array, object
 */

function JSONStringify(value) {
  // 处理 null
  if (value === null) {
    return 'null';
  }
  
  // 处理 undefined
  if (value === undefined) {
    return undefined; // JSON.stringify 对 undefined 返回 undefined
  }
  
  // 处理基本数据类型
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  
  if (typeof value === 'number') {
    // 处理特殊数值
    if (isNaN(value)) return 'null';
    if (!isFinite(value)) return 'null';
    return String(value);
  }
  
  if (typeof value === 'boolean') {
    return String(value);
  }
  
  // 处理数组
  if (Array.isArray(value)) {
    const items = value.map(item => JSONStringify(item));
    return `[${items.join(',')}]`;
  }
  
  // 处理对象
  if (typeof value === 'object') {
    const pairs = [];
    
    // 为什么不用 Reflect.ownKeys？
    // 1. for...in 只遍历可枚举属性，符合 JSON.stringify 的行为
    // 2. Reflect.ownKeys 会包含 Symbol 和不可枚举属性，这些在 JSON 中会被忽略
    // 3. 简单实现优先考虑基本功能，不需要处理复杂情况

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        const val = value[key];
        // 跳过 undefined 和函数
        if (val !== undefined && typeof val !== 'function') {
          pairs.push(`"${key}":${JSONStringify(val)}`);
        }
      }
    }
    
    return `{${pairs.join(',')}}`;
  }
  
  // 其他类型返回 undefined
  return undefined;
}

// ==================== 测试用例 ====================

console.log('=== 基本数据类型测试 ===');
console.log('字符串:', JSONStringify('hello')); // "hello"
console.log('数字:', JSONStringify(123)); // 123
console.log('布尔值:', JSONStringify(true)); // true
console.log('null:', JSONStringify(null)); // null
console.log('undefined:', JSONStringify(undefined)); // undefined

console.log('\n=== 数组测试 ===');
console.log('简单数组:', JSONStringify([1, 2, 3])); // [1,2,3]
console.log('混合数组:', JSONStringify([1, 'hello', true, null])); // [1,"hello",true,null]
console.log('嵌套数组:', JSONStringify([1, [2, 3], 4])); // [1,[2,3],4]

console.log('\n=== 对象测试 ===');
console.log('简单对象:', JSONStringify({ name: 'Alice', age: 25 })); // {"name":"Alice","age":25}
console.log('嵌套对象:', JSONStringify({ 
  user: { name: 'Bob', age: 30 }, 
  active: true 
})); // {"user":{"name":"Bob","age":30},"active":true}

console.log('\n=== 特殊值测试 ===');
console.log('NaN:', JSONStringify(NaN)); // null
console.log('Infinity:', JSONStringify(Infinity)); // null
console.log('空对象:', JSONStringify({})); // {}
console.log('空数组:', JSONStringify([])); // []

console.log('\n=== 跳过测试 ===');
console.log('包含undefined:', JSONStringify({ a: 1, b: undefined, c: 3 })); // {"a":1,"c":3}
console.log('包含函数:', JSONStringify({ a: 1, b: function() {}, c: 3 })); // {"a":1,"c":3}

// ==================== 与原版对比测试 ====================

console.log('\n=== 与原版 JSON.stringify 对比 ===');

const testData = {
  name: 'Alice',
  age: 25,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Beijing',
    country: 'China'
  },
  active: true,
  score: null
};

console.log('原版:', JSON.stringify(testData));
console.log('自实现:', JSONStringify(testData));

// ==================== 边界情况测试 ====================

console.log('\n=== 边界情况测试 ===');
console.log('循环引用:', JSONStringify({ a: 1 })); // 简单版本不处理循环引用
console.log('Date对象:', JSONStringify(new Date())); // 简单版本不处理Date
console.log('RegExp对象:', JSONStringify(/test/)); // 简单版本不处理RegExp

// ==================== for...in vs Reflect.ownKeys 对比 ====================

console.log('\n=== for...in vs Reflect.ownKeys 对比 ===');

const testObj = {
  name: 'Alice',
  age: 25,
  [Symbol('id')]: 'symbol-value', // Symbol 属性
  get getName() { return this.name; }, // getter
  set setName(val) { this.name = val; } // setter
};

// 设置不可枚举属性
Object.defineProperty(testObj, 'hidden', {
  value: 'hidden-value',
  enumerable: false
});

console.log('测试对象:', testObj);

// for...in 遍历结果
console.log('\nfor...in 遍历结果:');
for (const key in testObj) {
  console.log(key, ':', testObj[key]);
}

// Reflect.ownKeys 遍历结果
console.log('\nReflect.ownKeys 遍历结果:');
Reflect.ownKeys(testObj).forEach(key => {
  console.log(key, ':', testObj[key]);
});

// JSON.stringify 的行为
console.log('\nJSON.stringify 结果:');
console.log(JSON.stringify(testObj)); // 只包含可枚举的字符串属性

// 我们的实现结果
console.log('\n我们的实现结果:');
console.log(JSONStringify(testObj)); // 与 JSON.stringify 一致

// ==================== 详细说明 ====================

console.log('\n=== 详细说明 ===');
console.log(`
为什么不用 Reflect.ownKeys？

1. JSON.stringify 的行为：
   - 只序列化可枚举的字符串属性
   - 忽略 Symbol 属性
   - 忽略不可枚举属性
   - 忽略 getter/setter

2. for...in 的特点：
   - 只遍历可枚举属性
   - 不包含 Symbol 属性
   - 不包含不可枚举属性
   - 符合 JSON.stringify 的行为

3. Reflect.ownKeys 的特点：
   - 包含所有自有属性（包括 Symbol）
   - 包含不可枚举属性
   - 包含 getter/setter
   - 不符合 JSON.stringify 的行为

4. 简单实现的原则：
   - 优先考虑基本功能
   - 不需要处理复杂情况
   - 保持与原生 JSON.stringify 一致的行为
`);

module.exports = JSONStringify;
