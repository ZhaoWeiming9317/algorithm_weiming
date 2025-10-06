# ES6 展开运算符 (Spread Operator)

## 📖 基础概念

展开运算符 (`...`) 是 ES6 引入的一种语法，可以将可迭代对象（如数组、字符串、对象）展开为单独的元素。

## 🔍 数组展开

### 基本语法
```javascript
// 基本展开
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// 插入元素
const newArr = [0, ...arr1, 4];
console.log(newArr); // [0, 1, 2, 3, 4]
```

### 复制数组
```javascript
// 浅拷贝数组
const original = [1, 2, 3];
const copy = [...original];
console.log(copy); // [1, 2, 3]
console.log(copy === original); // false (不同引用)

// 修改拷贝不影响原数组
copy.push(4);
console.log(original); // [1, 2, 3]
console.log(copy); // [1, 2, 3, 4]
```

### 字符串展开
```javascript
// 字符串展开为字符数组
const str = 'hello';
const chars = [...str];
console.log(chars); // ['h', 'e', 'l', 'l', 'o']

// 字符串连接
const result = [...'abc', ...'def'];
console.log(result); // ['a', 'b', 'c', 'd', 'e', 'f']
```

## 🎯 对象展开

### 基本语法
```javascript
// 基本展开
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const combined = { ...obj1, ...obj2 };
console.log(combined); // { a: 1, b: 2, c: 3, d: 4 }

// 属性覆盖
const obj3 = { a: 10, e: 5 };
const result = { ...obj1, ...obj3 };
console.log(result); // { a: 10, b: 2, e: 5 }
```

### 复制对象
```javascript
// 浅拷贝对象
const original = { name: 'John', age: 30 };
const copy = { ...original };
console.log(copy); // { name: 'John', age: 30 }
console.log(copy === original); // false (不同引用)

// 修改拷贝不影响原对象
copy.age = 31;
console.log(original.age); // 30
console.log(copy.age); // 31
```

### 嵌套对象问题
```javascript
// 浅拷贝的局限性
const original = {
  name: 'John',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

const copy = { ...original };
copy.address.city = 'Los Angeles';

console.log(original.address.city); // 'Los Angeles' (被修改了!)
console.log(copy.address.city); // 'Los Angeles'
```

## 🎪 实际应用示例

### 1. 函数参数展开
```javascript
// 传统写法
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
const result = sum.apply(null, numbers); // 使用 apply

// 展开运算符写法
const result = sum(...numbers); // 更简洁

// 动态参数
function dynamicSum(...args) {
  return args.reduce((sum, num) => sum + num, 0);
}

console.log(dynamicSum(1, 2, 3, 4, 5)); // 15
```

### 2. 数组操作
```javascript
// 数组合并
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [7, 8, 9];

const combined = [...arr1, ...arr2, ...arr3];
console.log(combined); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 数组插入
const newArr = [0, ...arr1, 4, ...arr2, 7];
console.log(newArr); // [0, 1, 2, 3, 4, 4, 5, 6, 7]

// 数组去重
const duplicates = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(duplicates)];
console.log(unique); // [1, 2, 3, 4]
```

### 3. 对象操作
```javascript
// 对象合并
const user = { name: 'John', age: 30 };
const preferences = { theme: 'dark', language: 'en' };
const settings = { notifications: true };

const profile = { ...user, ...preferences, ...settings };
console.log(profile); // { name: 'John', age: 30, theme: 'dark', language: 'en', notifications: true }

// 对象更新
const updatedUser = { ...user, age: 31 };
console.log(updatedUser); // { name: 'John', age: 31 }

// 对象属性删除（结合解构）
const { age, ...userWithoutAge } = user;
console.log(userWithoutAge); // { name: 'John' }
```

### 4. React 组件
```javascript
// React 组件中的 props 传递
function Button({ children, ...otherProps }) {
  return (
    <button {...otherProps}>
      {children}
    </button>
  );
}

// 使用组件
<Button 
  className="primary" 
  onClick={handleClick}
  disabled={false}
>
  Click me
</Button>
```

### 5. 状态更新
```javascript
// React 状态更新
const [state, setState] = useState({
  name: '',
  email: '',
  age: 0
});

// 更新单个属性
setState(prevState => ({
  ...prevState,
  name: 'John'
}));

// 更新多个属性
setState(prevState => ({
  ...prevState,
  name: 'John',
  email: 'john@example.com'
}));
```

## ⚠️ 注意事项

### 1. 浅拷贝问题
```javascript
// 对象中的嵌套对象是浅拷贝
const original = {
  user: {
    name: 'John',
    age: 30
  }
};

const copy = { ...original };
copy.user.name = 'Jane';

console.log(original.user.name); // 'Jane' (被修改了!)
```

### 2. 性能考虑
```javascript
// 大数组展开可能影响性能
const largeArray = new Array(1000000).fill(0);
const newArray = [...largeArray]; // 可能很慢

// 考虑使用其他方法
const newArray = largeArray.slice(); // 可能更快
```

### 3. 只展开可迭代对象
```javascript
// 数字不能展开
// const numbers = ...123; // SyntaxError

// 对象在旧版本中不能展开
// const obj = { ...{ a: 1 } }; // 需要 ES2018 支持
```

## 🎯 最佳实践

### 1. 数组操作
```javascript
// ✅ 推荐：使用展开运算符合并数组
const combined = [...arr1, ...arr2, ...arr3];

// ✅ 推荐：使用展开运算符复制数组
const copy = [...original];

// ❌ 避免：使用 concat 方法
const combined = arr1.concat(arr2).concat(arr3);
```

### 2. 对象操作
```javascript
// ✅ 推荐：使用展开运算符合并对象
const merged = { ...obj1, ...obj2 };

// ✅ 推荐：使用展开运算符复制对象
const copy = { ...original };

// ❌ 避免：使用 Object.assign
const merged = Object.assign({}, obj1, obj2);
```

### 3. 函数参数
```javascript
// ✅ 推荐：使用展开运算符传递参数
const result = someFunction(...args);

// ✅ 推荐：使用剩余参数收集参数
function myFunction(...args) {
  // 处理参数
}
```

## 🚀 面试要点

### 1. 基本语法
```javascript
// 数组展开
const arr = [...array1, ...array2];

// 对象展开
const obj = { ...obj1, ...obj2 };

// 函数参数展开
someFunction(...args);
```

### 2. 浅拷贝
```javascript
// 数组浅拷贝
const copy = [...original];

// 对象浅拷贝
const copy = { ...original };
```

### 3. 合并操作
```javascript
// 数组合并
const combined = [...arr1, ...arr2];

// 对象合并
const merged = { ...obj1, ...obj2 };
```

### 4. 属性覆盖
```javascript
// 对象属性覆盖
const result = { ...obj1, ...obj2 }; // obj2 的属性会覆盖 obj1 的同名属性
```

## 📚 练习题

### 1. 数组展开
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const result = [...arr1, 0, ...arr2];
console.log(result); // ?
```

### 2. 对象展开
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const result = { ...obj1, ...obj2 };
console.log(result); // ?
```

### 3. 函数参数
```javascript
function multiply(a, b, c) {
  return a * b * c;
}

const numbers = [2, 3, 4];
const result = multiply(...numbers);
console.log(result); // ?
```

### 4. 嵌套对象
```javascript
const original = {
  user: {
    name: 'John',
    age: 30
  }
};

const copy = { ...original };
copy.user.name = 'Jane';
console.log(original.user.name); // ?
```

## 💡 总结

- **展开运算符提供简洁的语法**来展开数组和对象
- **支持数组和对象的合并**，代码更简洁
- **支持浅拷贝**，但要注意嵌套对象的引用问题
- **适合函数参数传递**，使函数调用更灵活
- **在 React 中广泛使用**，用于 props 传递和状态更新
- **注意性能影响**，大数组展开可能影响性能
