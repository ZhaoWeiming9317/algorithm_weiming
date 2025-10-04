# WeakMap 详解

## 1. WeakMap vs Map

### 基本区别
```javascript
// Map：强引用
const map = new Map();
let obj = { name: 'test' };
map.set(obj, 'value');
obj = null;  // obj不会被回收，因为map中还有引用

// WeakMap：弱引用
const weakMap = new WeakMap();
let obj2 = { name: 'test' };
weakMap.set(obj2, 'value');
obj2 = null;  // obj2可以被回收，weakMap中的键值对也会被回收
```

### 特性对比
| 特性 | Map | WeakMap |
|------|-----|----------|
| 键类型 | 任意值 | 只能是对象 |
| 值类型 | 任意值 | 任意值 |
| 键引用 | 强引用 | 弱引用 |
| 可迭代 | 是 | 否 |
| 键可枚举 | 是 | 否 |
| 清除方式 | 手动clear | 自动GC |

## 2. 垃圾回收机制

### 回收时机
WeakMap 中的键值对在以下情况会被回收：

1. **键对象没有其他引用**：
```javascript
let obj = { name: 'test' };
const weakMap = new WeakMap();
weakMap.set(obj, 'data');

obj = null;  // 当obj没有其他引用时，这个键值对可以被回收
```

2. **作用域结束**：
```javascript
function someFunction() {
    const obj = { name: 'test' };
    const weakMap = new WeakMap();
    weakMap.set(obj, 'data');
}  // 函数结束后，obj和weakMap中的键值对都可以被回收
```

3. **对象被显式删除**：
```javascript
const obj = { name: 'test' };
const weakMap = new WeakMap();
weakMap.set(obj, 'data');

delete window.obj;  // 如果这是最后一个引用，键值对可以被回收
```

### 不会被回收的情况
```javascript
// 1. 对象还有其他引用
const obj = { name: 'test' };
const weakMap = new WeakMap();
weakMap.set(obj, 'data');
const anotherRef = obj;  // 还有另一个引用，不会被回收

// 2. 对象在闭包中
function createClosure() {
    const obj = { name: 'test' };
    const weakMap = new WeakMap();
    weakMap.set(obj, 'data');
    
    return function() {
        return obj;  // obj在闭包中被引用，不会被回收
    };
}
```

## 3. 实际应用场景

### 1. 缓存场景
```javascript
// 使用WeakMap做缓存，避免内存泄露
const cache = new WeakMap();

function processData(data) {
    if (cache.has(data)) {
        return cache.get(data);
    }
    
    const result = expensiveOperation(data);
    cache.set(data, result);
    return result;
}
```

### 2. 关联数据存储
```javascript
// DOM节点关联数据
const nodeData = new WeakMap();

function setNodeData(node, data) {
    nodeData.set(node, data);
}

// 当DOM节点被删除时，关联数据自动被回收
element.remove();  // 相关数据会被自动回收
```

### 3. 循环引用处理（深拷贝）
```javascript
function deepClone(target, map = new WeakMap()) {
    if (map.has(target)) {
        return map.get(target);
    }
    const clone = {};
    map.set(target, clone);
    // ... 递归克隆
    // 当原对象不再需要时，WeakMap中的数据会被自动回收
}
```

## 4. 注意事项

### 1. 无法直接观察回收
```javascript
// WeakMap的回收是不可预测的
const weakMap = new WeakMap();
let obj = { name: 'test' };
weakMap.set(obj, 'data');
obj = null;
// 无法确定具体什么时候被回收
// 取决于JavaScript引擎的GC实现
```

### 2. 不支持遍历
```javascript
const weakMap = new WeakMap();
// ❌ 以下操作都不支持
// weakMap.keys()
// weakMap.values()
// weakMap.entries()
// weakMap.forEach()
```

### 3. 键必须是对象
```javascript
const weakMap = new WeakMap();
// ❌ 以下都会报错
weakMap.set(1, 'value');
weakMap.set('key', 'value');
weakMap.set(true, 'value');
weakMap.set(Symbol(), 'value');

// ✅ 只能用对象作为键
weakMap.set({}, 'value');
weakMap.set([], 'value');
weakMap.set(function(){}, 'value');
```

## 5. 性能考虑

### 优势
1. 自动内存管理
2. 不会造成内存泄露
3. 垃圾回收更高效

### 限制
1. 只能用对象作为键
2. 不能遍历或获取大小
3. 无法手动触发回收

## 6. 最佳实践

1. **临时关联数据**：
```javascript
// 好的用法：临时数据关联
const weakMap = new WeakMap();
function processObject(obj) {
    weakMap.set(obj, someData);
    // 处理完后不需要手动清理
}
```

2. **缓存实现**：
```javascript
// 好的用法：自动清理的缓存
const cache = new WeakMap();
function memoize(fn) {
    return function(obj) {
        if (!cache.has(obj)) {
            cache.set(obj, fn(obj));
        }
        return cache.get(obj);
    };
}
```

3. **避免内存泄露**：
```javascript
// 好的用法：不会造成内存泄露的关联存储
const privateData = new WeakMap();
class MyClass {
    constructor() {
        privateData.set(this, {});
    }
}
```
