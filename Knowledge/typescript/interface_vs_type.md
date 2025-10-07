# Interface vs Type 详解

## 核心区别总结

| 特性 | Interface | Type |
|------|-----------|------|
| **声明合并** | ✅ 支持 | ❌ 不支持 |
| **扩展方式** | extends | & (交叉类型) |
| **联合类型** | ❌ 不支持 | ✅ 支持 |
| **元组类型** | ⚠️ 可以但不推荐 | ✅ 推荐 |
| **映射类型** | ❌ 不支持 | ✅ 支持 |
| **条件类型** | ❌ 不支持 | ✅ 支持 |
| **基本类型别名** | ❌ 不支持 | ✅ 支持 |
| **this 类型** | ✅ 支持 | ✅ 支持 |
| **性能** | 稍快（缓存） | 稍慢 |
| **错误提示** | 更友好 | 有时复杂 |

---

## 1. 声明合并（Declaration Merging）

### 什么是声明合并？

**声明合并**是 TypeScript 的一个特性，允许你对同一个名称进行多次声明，编译器会将这些声明合并成一个定义。

简单理解：**同名的 interface 会自动合并，就像拼图一样，把多个声明拼成一个完整的类型。**

### Interface 支持声明合并

#### 基础示例

```typescript
// ✅ Interface 可以多次声明，会自动合并
interface User {
  name: string;
}

interface User {
  age: number;
}

interface User {
  email: string;
}

// 最终 User 类型：{ name: string; age: number; email: string; }
const user: User = {
  name: '张三',
  age: 25,
  email: 'test@example.com'
};

// 如果缺少任何一个属性，都会报错
const user2: User = {
  name: '李四',
  age: 30
  // ❌ 错误：缺少属性 "email"
};
```

#### 合并规则详解

**规则1：属性会累加**

```typescript
interface Person {
  name: string;
}

interface Person {
  age: number;
}

interface Person {
  address: string;
}

// 最终 Person = { name: string; age: number; address: string; }
```

**规则2：同名属性类型必须相同**

```typescript
interface Product {
  id: number;
  name: string;
}

interface Product {
  id: number;  // ✅ 类型相同，可以合并
  price: number;
}

interface Product {
  id: string;  // ❌ 错误：后续属性声明必须属于同一类型
  // 之前声明的 id 是 number，这里是 string，冲突！
}
```

**规则3：方法会重载**

```typescript
interface Calculator {
  add(a: number, b: number): number;
}

interface Calculator {
  add(a: string, b: string): string;  // ✅ 函数重载
}

interface Calculator {
  add(a: any[], b: any[]): any[];  // ✅ 再次重载
}

// 最终 Calculator 有 3 个 add 方法重载
const calc: Calculator = {
  add(a: any, b: any): any {
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      return a + b;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return [...a, ...b];
    }
  }
};

calc.add(1, 2);        // ✅ number
calc.add('a', 'b');    // ✅ string
calc.add([1], [2]);    // ✅ any[]
```

**规则4：后声明的重载优先级更高**

```typescript
interface API {
  request(url: string): Promise<any>;
}

interface API {
  request(url: string, options: object): Promise<any>;
}

// 调用时，TypeScript 会从后往前匹配重载
// 所以第二个声明的优先级更高
```

### Type 不支持声明合并

```typescript
// ❌ Type 不能重复声明
type User = {
  name: string;
};

type User = {  // ❌ 错误：标识符"User"重复
  age: number;
};

// 如果需要扩展，只能用交叉类型
type User = {
  name: string;
};

type ExtendedUser = User & {
  age: number;
};
```

### 为什么需要声明合并？

#### 场景1：扩展第三方库类型

```typescript
// 1. 扩展全局 Window 对象
// 假设你在项目中给 window 添加了自定义属性
window.myAppConfig = {
  apiUrl: 'https://api.example.com'
};

// 如果不声明合并，TypeScript 会报错
// ❌ 错误：类型"Window & typeof globalThis"上不存在属性"myAppConfig"

// ✅ 使用声明合并扩展 Window
interface Window {
  myAppConfig: {
    apiUrl: string;
  };
}

// 现在可以正常使用了
console.log(window.myAppConfig.apiUrl);  // ✅ 类型安全

// 2. 扩展 Express Request
// 在 Express 中间件中添加用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        role: string;
      };
    }
  }
}

// 现在在中间件中可以使用
app.use((req, res, next) => {
  req.user = {  // ✅ TypeScript 知道 user 属性
    id: '123',
    name: '张三',
    role: 'admin'
  };
  next();
});

// 3. 扩展第三方库
// 假设你使用 axios，想添加自定义配置
declare module 'axios' {
  export interface AxiosRequestConfig {
    customTimeout?: number;
    retryCount?: number;
  }
}

// 现在可以使用自定义配置
axios.get('/api/data', {
  customTimeout: 5000,
  retryCount: 3
});
```

#### 场景2：模块化开发

```typescript
// user.types.ts
interface User {
  id: number;
  name: string;
}

// user-profile.types.ts
interface User {
  avatar: string;
  bio: string;
}

// user-settings.types.ts
interface User {
  theme: 'light' | 'dark';
  language: string;
}

// 在任何地方使用 User 时，都包含所有属性
const user: User = {
  id: 1,
  name: '张三',
  avatar: 'avatar.jpg',
  bio: '这是简介',
  theme: 'dark',
  language: 'zh-CN'
};
```

#### 场景3：插件系统

```typescript
// 核心库定义基础接口
// core.ts
interface PluginAPI {
  version: string;
  register(name: string): void;
}

// 插件1 扩展 API
// plugin-logger.ts
interface PluginAPI {
  log(message: string): void;
  error(message: string): void;
}

// 插件2 扩展 API
// plugin-cache.ts
interface PluginAPI {
  cache: {
    get(key: string): any;
    set(key: string, value: any): void;
  };
}

// 使用时，PluginAPI 包含所有扩展
const api: PluginAPI = {
  version: '1.0.0',
  register(name) { console.log(`Registered: ${name}`); },
  log(message) { console.log(message); },
  error(message) { console.error(message); },
  cache: {
    get(key) { return localStorage.getItem(key); },
    set(key, value) { localStorage.setItem(key, value); }
  }
};
```

### 声明合并的执行顺序

```typescript
// 1. 同一个文件中，按照声明顺序合并
interface Config {
  name: string;
}

interface Config {
  version: number;
}

// Config = { name: string; version: number; }

// 2. 不同文件中，按照文件导入顺序合并
// file1.ts
interface GlobalConfig {
  apiUrl: string;
}

// file2.ts
interface GlobalConfig {
  timeout: number;
}

// main.ts
import './file1';
import './file2';

// GlobalConfig = { apiUrl: string; timeout: number; }
```

### 声明合并的注意事项

#### 注意1：避免循环依赖

```typescript
// ❌ 不好的做法
interface A {
  b: B;
}

interface B {
  a: A;
}

// 这会导致循环引用，虽然 TypeScript 可以处理，但不推荐
```

#### 注意2：保持声明的一致性

```typescript
// ❌ 不好的做法：分散的声明难以维护
// file1.ts
interface User {
  id: number;
}

// file2.ts
interface User {
  name: string;
}

// file3.ts
interface User {
  email: string;
}

// ✅ 好的做法：集中声明，需要扩展时再合并
// user.types.ts
interface User {
  id: number;
  name: string;
  email: string;
}

// 只在需要扩展第三方库时使用声明合并
```

#### 注意3：命名空间也支持合并

```typescript
namespace Animals {
  export class Dog {
    bark() { console.log('Woof!'); }
  }
}

namespace Animals {
  export class Cat {
    meow() { console.log('Meow!'); }
  }
}

// Animals 命名空间包含 Dog 和 Cat
const dog = new Animals.Dog();
const cat = new Animals.Cat();
```

### 实际项目示例

#### 示例1：扩展 Vue Router

```typescript
// router.d.ts
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    icon?: string;
  }
}

// 现在可以使用自定义的 meta 属性
const routes = [
  {
    path: '/admin',
    meta: {
      requiresAuth: true,  // ✅ 类型安全
      title: '管理后台',
      icon: 'admin-icon'
    }
  }
];
```

#### 示例2：扩展 Redux Store

```typescript
// store.d.ts
import 'redux';

declare module 'redux' {
  export interface Store {
    asyncReducers?: {
      [key: string]: Reducer;
    };
  }
}

// 现在可以动态添加 reducer
store.asyncReducers = {
  newFeature: newFeatureReducer
};
```

### 总结对比

```typescript
// ✅ Interface：支持声明合并
interface User {
  name: string;
}

interface User {
  age: number;
}

// User = { name: string; age: number; }

// ❌ Type：不支持声明合并
type User = {
  name: string;
};

type User = {  // ❌ 错误：重复标识符
  age: number;
};

// 如果需要扩展 type，使用交叉类型
type BaseUser = {
  name: string;
};

type ExtendedUser = BaseUser & {
  age: number;
};
```

### 关键理解

1. **声明合并是 Interface 的独有特性**
2. **主要用于扩展第三方库类型**
3. **同名属性类型必须一致**
4. **方法会形成重载**
5. **Type 不支持，需要用交叉类型替代**

---

## 2. 扩展方式

### Interface 使用 extends

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

const dog: Dog = {
  name: 'Buddy',
  bark() {
    console.log('Woof!');
  }
};

// 多重继承
interface Flyable {
  fly(): void;
}

interface Bird extends Animal, Flyable {
  wingspan: number;
}
```

### Type 使用交叉类型（&）

```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  bark(): void;
};

const dog: Dog = {
  name: 'Buddy',
  bark() {
    console.log('Woof!');
  }
};

// 多重交叉
type Flyable = {
  fly(): void;
};

type Bird = Animal & Flyable & {
  wingspan: number;
};
```

### Interface 也可以扩展 Type

```typescript
type Animal = {
  name: string;
};

interface Dog extends Animal {
  bark(): void;
}
```

### Type 也可以交叉 Interface

```typescript
interface Animal {
  name: string;
}

type Dog = Animal & {
  bark(): void;
};
```

---

## 3. 联合类型

### Type 支持联合类型

```typescript
// ✅ Type 可以定义联合类型
type Status = 'pending' | 'success' | 'error';

type ID = string | number;

type Result = 
  | { success: true; data: string }
  | { success: false; error: string };

function handleResult(result: Result) {
  if (result.success) {
    console.log(result.data);  // ✅ 类型收窄
  } else {
    console.log(result.error);  // ✅ 类型收窄
  }
}
```

### Interface 不支持联合类型

```typescript
// ❌ Interface 不能直接定义联合类型
interface Status = 'pending' | 'success' | 'error';  // ❌ 语法错误

// 只能通过 type 实现
type Status = 'pending' | 'success' | 'error';
```

---

## 4. 元组类型

### Type 更适合定义元组

```typescript
// ✅ Type 定义元组（推荐）
type Point = [number, number];
type RGB = [number, number, number];

const point: Point = [10, 20];
const color: RGB = [255, 0, 0];

// 带标签的元组
type NamedPoint = [x: number, y: number];
```

### Interface 也可以定义元组，但不推荐

```typescript
// ⚠️ Interface 可以定义元组，但不推荐
interface Point {
  0: number;
  1: number;
  length: 2;
}

const point: Point = [10, 20];  // 可以工作，但不优雅
```

---

## 5. 映射类型

### Type 支持映射类型

```typescript
// ✅ Type 可以使用映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 使用
interface User {
  id: number;
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
```

### Interface 不支持映射类型

```typescript
// ❌ Interface 不能使用映射类型
interface Readonly<T> {
  readonly [P in keyof T]: T[P];  // ❌ 语法错误
}
```

---

## 6. 条件类型

### Type 支持条件类型

```typescript
// ✅ Type 可以使用条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 复杂的条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

type Flatten<T> = T extends Array<infer U> ? U : T;

type FlattenedArray = Flatten<string[]>;  // string
type FlattenedString = Flatten<string>;   // string
```

### Interface 不支持条件类型

```typescript
// ❌ Interface 不能使用条件类型
interface IsString<T> = T extends string ? true : false;  // ❌ 语法错误
```

---

## 7. 基本类型别名

### Type 可以为基本类型创建别名

```typescript
// ✅ Type 可以为基本类型、联合类型、元组等创建别名
type Name = string;
type Age = number;
type IsActive = boolean;

type ID = string | number;
type Callback = () => void;
type Point = [number, number];

// 字面量类型
type Direction = 'up' | 'down' | 'left' | 'right';
```

### Interface 只能描述对象结构

```typescript
// ❌ Interface 不能为基本类型创建别名
interface Name = string;  // ❌ 语法错误

// ✅ Interface 只能描述对象
interface User {
  name: string;
  age: number;
}
```

---

## 8. 索引签名

### 两者都支持索引签名

```typescript
// Interface
interface StringMap {
  [key: string]: string;
}

// Type
type StringMap = {
  [key: string]: string;
};

// 使用
const map: StringMap = {
  name: '张三',
  city: '北京'
};
```

### Interface 的索引签名更严格

```typescript
// ❌ Interface 不允许已知属性与索引签名冲突
interface User {
  name: string;
  [key: string]: number;  // ❌ 错误：name 的类型不兼容
}

// ✅ Type 更灵活（但也可能导致问题）
type User = {
  name: string;
  [key: string]: string | number;  // ✅ 需要联合类型
};
```

---

## 9. 性能差异

### Interface 性能稍好

```typescript
// Interface 的性能优势：
// 1. TypeScript 编译器会缓存 interface 的结构
// 2. 声明合并时，编译器可以增量更新
// 3. 在大型项目中，interface 的类型检查稍快

// 但实际差异很小，通常可以忽略
```

---

## 10. 错误提示

### Interface 的错误提示更友好

```typescript
interface User {
  id: number;
  name: string;
  age: number;
}

const user: User = {
  id: 1,
  name: '张三'
  // ❌ 错误：类型 "{ id: number; name: string; }" 中缺少属性 "age"，但类型 "User" 中需要该属性
};
```

### Type 的错误提示有时较复杂

```typescript
type User = {
  id: number;
  name: string;
  age: number;
};

const user: User = {
  id: 1,
  name: '张三'
  // ❌ 错误信息类似，但在复杂类型时可能展开整个类型定义
};

// 复杂类型的错误提示
type ComplexType = Pick<User, 'id'> & Omit<User, 'age'>;
// 错误提示会展开所有类型，可读性较差
```

---

## 11. 实际应用场景

### 使用 Interface 的场景

```typescript
// 1. 定义对象结构（推荐）
interface User {
  id: number;
  name: string;
  email: string;
}

// 2. 类的实现
interface Drawable {
  draw(): void;
}

class Circle implements Drawable {
  draw() {
    console.log('Drawing circle');
  }
}

// 3. 需要声明合并的场景
interface Window {
  myCustomProperty: string;
}

// 4. 公共 API 定义（更好的错误提示）
export interface ApiResponse {
  code: number;
  message: string;
  data: any;
}

// 5. React 组件 Props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
```

### 使用 Type 的场景

```typescript
// 1. 联合类型
type Status = 'pending' | 'success' | 'error';
type ID = string | number;

// 2. 元组类型
type Point = [number, number];
type RGB = [number, number, number];

// 3. 函数类型
type Callback = (data: string) => void;
type Predicate<T> = (value: T) => boolean;

// 4. 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 5. 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 6. 工具类型
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 7. 复杂的类型操作
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 8. 字面量类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
```

---

## 12. 混合使用

### Interface 和 Type 可以互相配合

```typescript
// Type 定义联合类型
type Status = 'active' | 'inactive';

// Interface 使用 Type
interface User {
  id: number;
  name: string;
  status: Status;  // 使用 type 定义的联合类型
}

// Type 使用 Interface
interface BaseUser {
  id: number;
  name: string;
}

type AdminUser = BaseUser & {
  role: 'admin';
  permissions: string[];
};

// 实际项目中的混合使用
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

type UserData = {
  id: number;
  name: string;
};

type UserResponse = ApiResponse<UserData>;
```

---

## 13. 选择建议

### 🎯 推荐规则

```typescript
// ✅ 使用 Interface 的情况：
// 1. 定义对象结构
interface User {
  id: number;
  name: string;
}

// 2. 类的实现
interface Serializable {
  serialize(): string;
}

// 3. 需要声明合并
interface Window {
  myProperty: string;
}

// 4. 公共 API（更好的错误提示）
export interface PublicAPI {
  method(): void;
}

// ✅ 使用 Type 的情况：
// 1. 联合类型
type Status = 'pending' | 'success' | 'error';

// 2. 元组
type Point = [number, number];

// 3. 函数类型
type Callback = () => void;

// 4. 映射类型、条件类型、工具类型
type Readonly<T> = { readonly [P in keyof T]: T[P] };

// 5. 复杂的类型操作
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### 💡 团队规范建议

```typescript
// 方案1：优先使用 Interface（React 社区常见）
// - 对象结构用 interface
// - 其他情况用 type

interface Props {
  name: string;
}

type Status = 'active' | 'inactive';

// 方案2：优先使用 Type（Vue 社区常见）
// - 统一使用 type
// - 除非需要声明合并

type Props = {
  name: string;
};

type Status = 'active' | 'inactive';

// 方案3：混合使用（推荐）
// - 根据场景选择最合适的
// - interface 用于对象结构
// - type 用于联合、元组、工具类型
```

---

## 14. 常见误区

### 误区1：Type 不能扩展

```typescript
// ❌ 错误认知：type 不能扩展
// ✅ 正确：type 可以通过交叉类型扩展

type Animal = {
  name: string;
};

type Dog = Animal & {
  bark(): void;
};
```

### 误区2：Interface 性能更好，应该总是用 Interface

```typescript
// ❌ 错误认知：interface 性能更好，应该总是使用
// ✅ 正确：性能差异很小，应该根据场景选择

// 联合类型必须用 type
type Status = 'pending' | 'success' | 'error';

// 对象结构推荐用 interface
interface User {
  name: string;
}
```

### 误区3：Interface 和 Type 不能混用

```typescript
// ❌ 错误认知：interface 和 type 不能混用
// ✅ 正确：可以自由混用

interface User {
  id: number;
}

type Status = 'active' | 'inactive';

interface UserWithStatus extends User {
  status: Status;  // ✅ interface 使用 type
}

type AdminUser = User & {  // ✅ type 使用 interface
  role: 'admin';
};
```

---

## 15. 面试要点

### Q1: Interface 和 Type 的主要区别是什么？

**A:** 
1. **声明合并**：interface 支持，type 不支持
2. **联合类型**：type 支持，interface 不支持
3. **映射类型**：type 支持，interface 不支持
4. **扩展方式**：interface 用 extends，type 用 &

### Q2: 什么时候用 Interface，什么时候用 Type？

**A:**
- **Interface**：定义对象结构、类的实现、需要声明合并
- **Type**：联合类型、元组、函数类型、映射类型、条件类型

### Q3: Interface 和 Type 可以互相转换吗？

**A:** 
- 大部分情况可以互相转换
- 但某些特性是独有的（如 interface 的声明合并、type 的联合类型）

### Q4: 为什么 Interface 的错误提示更友好？

**A:**
- TypeScript 编译器会缓存 interface 的结构
- 错误提示时直接显示 interface 名称
- Type 的错误提示会展开整个类型定义

---

## 16. 总结

### 核心要点

1. **Interface 适合对象结构**
   - 声明合并
   - 类的实现
   - 更好的错误提示

2. **Type 更灵活强大**
   - 联合类型
   - 映射类型
   - 条件类型
   - 工具类型

3. **两者可以混用**
   - 根据场景选择
   - 发挥各自优势

### 记忆口诀

```
对象结构用 Interface，
联合元组用 Type，
需要合并 Interface，
复杂操作 Type 来帮忙。
```

### 最佳实践

- ✅ 优先使用 Interface 定义对象结构
- ✅ 使用 Type 定义联合类型、元组、工具类型
- ✅ 根据团队规范统一风格
- ✅ 不要过度纠结，选择最合适的即可
