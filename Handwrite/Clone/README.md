# JavaScript 深浅拷贝详解

## 1. 浅拷贝 vs 深拷贝

### 浅拷贝
- 只复制一层对象的属性
- 对于嵌套对象，复制引用
- 性能好，但可能有副作用

### 深拷贝
- 递归复制所有层级的属性
- 创建全新的对象和属性
- 性能消耗大，但完全隔离

## 2. 浅拷贝实现方式

### 1. 展开运算符
```javascript
const clone = { ...original };
```

### 2. Object.assign
```javascript
const clone = Object.assign({}, original);
```

### 3. Array方法（数组）
```javascript
const clone1 = [...original];
const clone2 = original.slice();
const clone3 = Array.from(original);
```

## 3. 深拷贝实现要点

### 1. 基本功能
```javascript
function basicDeepClone(target) {
    if (target === null || typeof target !== 'object') {
        return target;
    }
    const clone = Array.isArray(target) ? [] : {};
    for (const key in target) {
        clone[key] = basicDeepClone(target[key]);
    }
    return clone;
}
```

### 2. 特殊类型处理
```javascript
// 日期对象
if (target instanceof Date) {
    return new Date(target);
}

// 正则对象
if (target instanceof RegExp) {
    return new RegExp(target.source, target.flags);
}

// Map对象
if (target instanceof Map) {
    const clone = new Map();
    target.forEach((value, key) => {
        clone.set(deepClone(key), deepClone(value));
    });
    return clone;
}
```

### 3. 循环引用处理
```javascript
function deepClone(target, map = new WeakMap()) {
    if (map.has(target)) {
        return map.get(target);
    }
    // ... 其他代码
    map.set(target, clone);
}
```

### 4. 继承关系处理
```javascript
const clone = Object.create(
    Object.getPrototypeOf(target),
    Object.getOwnPropertyDescriptors(target)
);
```

## 4. 常见问题和解决方案

### 1. 循环引用
```javascript
const obj = { name: 'test' };
obj.self = obj;  // 循环引用

// 解决：使用 WeakMap 记录已克隆对象
```

### 2. 特殊对象
```javascript
const special = {
    date: new Date(),
    regexp: /test/g,
    map: new Map(),
    set: new Set()
};

// 解决：分别处理每种特殊类型
```

### 3. 函数拷贝
```javascript
// 普通函数
function normalFunc() {}

// 箭头函数
const arrowFunc = () => {};

// 解决：根据函数类型分别处理
```

### 4. Symbol 属性
```javascript
const sym = Symbol('test');
const obj = {
    [sym]: 'value'
};

// 解决：使用 Reflect.ownKeys 获取所有属性
```

## 5. 性能优化建议

1. **按需克隆**：
   - 只克隆必要的属性
   - 使用浅拷贝代替深拷贝

2. **缓存优化**：
   - 使用 WeakMap 缓存已克隆对象
   - 避免重复克隆

3. **分批处理**：
   - 处理大对象时考虑分批克隆
   - 使用 requestAnimationFrame 避免阻塞

## 6. 实际应用场景

1. **状态管理**：
   ```javascript
   const newState = deepClone(currentState);
   ```

2. **表单处理**：
   ```javascript
   const formData = deepClone(defaultData);
   ```

3. **配置复制**：
   ```javascript
   const newConfig = deepClone(baseConfig);
   ```

## 7. 注意事项

1. **性能考虑**：
   - 深拷贝性能消耗大
   - 考虑使用 JSON 方法或浅拷贝

2. **特殊类型**：
   - 处理 Date、RegExp 等
   - 处理 Map、Set 等

3. **继承关系**：
   - 保持原型链
   - 处理属性描述符
