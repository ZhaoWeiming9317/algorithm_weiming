# TypeScript 动态 Key 类型实现

## 1. 基础：索引签名（Index Signature）

### 1.1 基本用法

```typescript
// 基础索引签名
interface StringMap {
  [key: string]: string;
}

const map: StringMap = {
  name: 'Alice',
  city: 'Beijing',
  country: 'China'
};

// 数字索引签名
interface NumberArray {
  [index: number]: string;
}

const arr: NumberArray = ['a', 'b', 'c'];
```

### 1.2 混合使用

```typescript
interface MixedMap {
  [key: string]: string | number;
  name: string;  // 必须符合索引签名类型
  age: number;   // 必须符合索引签名类型
}

const person: MixedMap = {
  name: 'Alice',
  age: 25,
  city: 'Beijing',
  score: 100
};
```

---

## 2. Record 类型（推荐 ⭐⭐⭐⭐⭐）

### 2.1 基本用法

```typescript
// Record<Keys, Type>
// Keys: 键的类型
// Type: 值的类型

// 示例1：字符串键，字符串值
type StringRecord = Record<string, string>;

const config: StringRecord = {
  apiUrl: 'https://api.example.com',
  apiKey: 'abc123',
  timeout: '5000'  // ✅ 可以
  // timeout: 5000  // ❌ 错误：必须是 string
};

// 示例2：联合类型键
type Status = 'pending' | 'success' | 'error';
type StatusMessages = Record<Status, string>;

const messages: StatusMessages = {
  pending: '处理中...',
  success: '成功！',
  error: '失败！'
  // 必须包含所有 Status 的键
};

// 示例3：数字键
type ScoreMap = Record<number, string>;

const scores: ScoreMap = {
  90: 'A',
  80: 'B',
  70: 'C'
};
```

### 2.2 实际应用

```typescript
// API 响应映射
type ApiEndpoint = 'users' | 'posts' | 'comments';
type ApiUrls = Record<ApiEndpoint, string>;

const apiUrls: ApiUrls = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments'
};

// 表单字段
type FormFields = 'username' | 'email' | 'password';
type FormValues = Record<FormFields, string>;

const formData: FormValues = {
  username: 'alice',
  email: 'alice@example.com',
  password: '123456'
};

// 多语言配置
type Language = 'en' | 'zh' | 'ja';
type Translations = Record<Language, Record<string, string>>;

const i18n: Translations = {
  en: {
    hello: 'Hello',
    goodbye: 'Goodbye'
  },
  zh: {
    hello: '你好',
    goodbye: '再见'
  },
  ja: {
    hello: 'こんにちは',
    goodbye: 'さようなら'
  }
};
```

---

## 3. 映射类型（Mapped Types）

### 3.1 基本映射

```typescript
// 将对象的所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 将对象的所有属性变为必需
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 将对象的所有属性变为只读
type Readonly<T> = {
  [P in keyof T]: readonly T[P];
};

// 使用示例
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

type RequiredUser = Required<PartialUser>;
// { id: number; name: string; email: string; }

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email: string; }
```

### 3.2 自定义映射类型

```typescript
// 将所有属性类型改为 string
type Stringify<T> = {
  [P in keyof T]: string;
};

interface Person {
  name: string;
  age: number;
  active: boolean;
}

type StringifiedPerson = Stringify<Person>;
// { name: string; age: string; active: string; }

// 将所有属性变为 Promise
type Promisify<T> = {
  [P in keyof T]: Promise<T[P]>;
};

type AsyncPerson = Promisify<Person>;
// { name: Promise<string>; age: Promise<number>; active: Promise<boolean>; }

// 为所有属性添加 getter
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; getActive: () => boolean; }
```

---

## 4. 动态键名（Key Remapping）

### 4.1 使用 as 重新映射键

```typescript
// 基本重映射
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }

// 过滤键
type RemoveId<T> = {
  [P in keyof T as P extends 'id' ? never : P]: T[P];
};

interface Product {
  id: number;
  name: string;
  price: number;
}

type ProductWithoutId = RemoveId<Product>;
// { name: string; price: number; }

// 条件重映射
type OnlyStrings<T> = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  city: string;
  active: boolean;
}

type StringProps = OnlyStrings<Mixed>;
// { name: string; city: string; }
```

### 4.2 实际应用：API 类型生成

```typescript
// 从接口生成 API 方法类型
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
}

type ApiMethods<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => Promise<T[P]>;
} & {
  [P in keyof T as `set${Capitalize<string & P>}`]: (value: T[P]) => Promise<void>;
};

type UserApi = ApiMethods<User>;
/*
{
  getId: () => Promise<number>;
  getName: () => Promise<string>;
  getEmail: () => Promise<string>;
  setId: (value: number) => Promise<void>;
  setName: (value: string) => Promise<void>;
  setEmail: (value: string) => Promise<void>;
}
*/

// 使用
const userApi: UserApi = {
  getId: async () => 1,
  getName: async () => 'Alice',
  getEmail: async () => 'alice@example.com',
  setId: async (value) => { /* ... */ },
  setName: async (value) => { /* ... */ },
  setEmail: async (value) => { /* ... */ }
};
```

---

## 5. 模板字面量类型（Template Literal Types）

### 5.1 基本用法

```typescript
// 字符串拼接
type EventName = 'click' | 'scroll' | 'mousemove';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onScroll' | 'onMousemove'

// 多个模板组合
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = 'users' | 'posts';
type ApiRoute = `/${Lowercase<HTTPMethod>}/${Endpoint}`;
// '/get/users' | '/get/posts' | '/post/users' | '/post/posts' | ...

// 嵌套模板
type CSSProperty = 'color' | 'background' | 'border';
type CSSValue = 'red' | 'blue' | 'green';
type CSSRule = `${CSSProperty}: ${CSSValue}`;
// 'color: red' | 'color: blue' | ... | 'border: green'
```

### 5.2 实际应用：事件处理

```typescript
// 生成事件处理器类型
type EventMap = {
  click: MouseEvent;
  scroll: Event;
  keydown: KeyboardEvent;
};

type EventHandlers = {
  [K in keyof EventMap as `on${Capitalize<K>}`]: (event: EventMap[K]) => void;
};

/*
{
  onClick: (event: MouseEvent) => void;
  onScroll: (event: Event) => void;
  onKeydown: (event: KeyboardEvent) => void;
}
*/

// 使用
const handlers: EventHandlers = {
  onClick: (e) => console.log(e.clientX),
  onScroll: (e) => console.log(e.target),
  onKeydown: (e) => console.log(e.key)
};
```

### 5.3 实际应用：CSS-in-JS

```typescript
// 生成 CSS 属性类型
type CSSProperties = {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  padding?: number;
};

type ResponsiveProperties<T> = {
  [K in keyof T as K | `${string & K}Sm` | `${string & K}Md` | `${string & K}Lg`]?: T[K];
};

type ResponsiveCSS = ResponsiveProperties<CSSProperties>;
/*
{
  color?: string;
  colorSm?: string;
  colorMd?: string;
  colorLg?: string;
  backgroundColor?: string;
  backgroundColorSm?: string;
  // ... 等等
}
*/

// 使用
const styles: ResponsiveCSS = {
  color: 'red',
  colorSm: 'blue',
  fontSize: 16,
  fontSizeMd: 18,
  fontSizeLg: 20
};
```

---

## 6. 高级应用：完全动态的类型

### 6.1 动态嵌套对象

```typescript
// 支持任意深度的嵌套对象
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  api: {
    timeout: number;
    retries: number;
  };
}

type PartialConfig = DeepPartial<Config>;
/*
{
  database?: {
    host?: string;
    port?: number;
    credentials?: {
      username?: string;
      password?: string;
    };
  };
  api?: {
    timeout?: number;
    retries?: number;
  };
}
*/

// 使用
const config: PartialConfig = {
  database: {
    host: 'localhost'
    // port 和 credentials 可选
  }
  // api 可选
};
```

### 6.2 路径类型（Path Type）

```typescript
// 生成对象所有可能的路径
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

interface User {
  name: string;
  address: {
    city: string;
    country: {
      name: string;
      code: string;
    };
  };
  hobbies: string[];
}

type UserPaths = Paths<User>;
// 'name' | 'address' | 'address.city' | 'address.country' | 
// 'address.country.name' | 'address.country.code' | 'hobbies'

// 根据路径获取值类型
type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : never;

type CityType = PathValue<User, 'address.city'>; // string
type CountryNameType = PathValue<User, 'address.country.name'>; // string
```

### 6.3 实际应用：类型安全的 get/set

```typescript
// 类型安全的对象访问
function get<T, P extends Paths<T>>(obj: T, path: P): PathValue<T, P> {
  const keys = (path as string).split('.');
  let result: any = obj;
  
  for (const key of keys) {
    result = result[key];
  }
  
  return result;
}

// 使用
const user: User = {
  name: 'Alice',
  address: {
    city: 'Beijing',
    country: {
      name: 'China',
      code: 'CN'
    }
  },
  hobbies: ['reading', 'coding']
};

const city = get(user, 'address.city'); // 类型: string
const countryName = get(user, 'address.country.name'); // 类型: string
// const invalid = get(user, 'address.invalid'); // ❌ 编译错误
```

---

## 7. 实用工具类型

### 7.1 Pick 和 Omit

```typescript
// Pick: 选择部分属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }

// Omit: 排除部分属性
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type UserWithoutPassword = Omit<User, 'password'>;
// { id: number; name: string; email: string; }
```

### 7.2 动态 Pick

```typescript
// 根据条件选择属性
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  active: boolean;
  city: string;
  score: number;
}

type StringProps = PickByType<Mixed, string>;
// { name: string; city: string; }

type NumberProps = PickByType<Mixed, number>;
// { age: number; score: number; }
```

### 7.3 键值对转换

```typescript
// 将对象转换为键值对数组类型
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];

interface Config {
  host: string;
  port: number;
  ssl: boolean;
}

type ConfigEntries = Entries<Config>;
// ['host', string] | ['port', number] | ['ssl', boolean]

// 从键值对数组创建对象类型
type FromEntries<T extends readonly [PropertyKey, any][]> = {
  [K in T[number][0]]: Extract<T[number], [K, any]>[1];
};

type MyEntries = [['name', string], ['age', number]];
type MyObject = FromEntries<MyEntries>;
// { name: string; age: number; }
```

---

## 8. 实战案例

### 8.1 表单验证器类型

```typescript
// 定义表单字段
interface FormFields {
  username: string;
  email: string;
  age: number;
  password: string;
}

// 验证规则类型
type ValidationRule<T> = {
  required?: boolean;
  min?: T extends string ? number : T extends number ? number : never;
  max?: T extends string ? number : T extends number ? number : never;
  pattern?: T extends string ? RegExp : never;
  custom?: (value: T) => boolean | string;
};

// 为每个字段生成验证规则
type FormValidation<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

// 使用
const validation: FormValidation<FormFields> = {
  username: {
    required: true,
    min: 3,
    max: 20
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  age: {
    required: true,
    min: 18,
    max: 100
  },
  password: {
    required: true,
    min: 6,
    custom: (value) => value.length >= 6 || '密码至少6位'
  }
};
```

### 8.2 API 客户端类型

```typescript
// API 端点定义
interface ApiEndpoints {
  'GET /users': { response: User[] };
  'GET /users/:id': { params: { id: number }; response: User };
  'POST /users': { body: Omit<User, 'id'>; response: User };
  'PUT /users/:id': { params: { id: number }; body: Partial<User>; response: User };
  'DELETE /users/:id': { params: { id: number }; response: void };
}

// 提取方法和路径
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ExtractMethod<T extends string> = T extends `${infer M} ${string}` ? M : never;
type ExtractPath<T extends string> = T extends `${string} ${infer P}` ? P : never;

// API 客户端类型
type ApiClient = {
  [K in keyof ApiEndpoints]: (
    ...args: ApiEndpoints[K] extends { params: infer P }
      ? ApiEndpoints[K] extends { body: infer B }
        ? [params: P, body: B]
        : [params: P]
      : ApiEndpoints[K] extends { body: infer B }
      ? [body: B]
      : []
  ) => Promise<ApiEndpoints[K] extends { response: infer R } ? R : void>;
};

// 使用
const api: ApiClient = {
  'GET /users': async () => {
    return [{ id: 1, name: 'Alice', email: 'alice@example.com', password: '***' }];
  },
  'GET /users/:id': async (params) => {
    return { id: params.id, name: 'Alice', email: 'alice@example.com', password: '***' };
  },
  'POST /users': async (body) => {
    return { id: 1, ...body };
  },
  'PUT /users/:id': async (params, body) => {
    return { id: params.id, name: 'Alice', email: 'alice@example.com', password: '***', ...body };
  },
  'DELETE /users/:id': async (params) => {
    // void
  }
};

// 调用
const users = await api['GET /users']();
const user = await api['GET /users/:id']({ id: 1 });
const newUser = await api['POST /users']({ name: 'Bob', email: 'bob@example.com', password: '123' });
```

### 8.3 状态管理类型

```typescript
// 状态定义
interface AppState {
  user: {
    id: number;
    name: string;
    isLoggedIn: boolean;
  };
  todos: {
    items: Array<{ id: number; text: string; completed: boolean }>;
    filter: 'all' | 'active' | 'completed';
  };
  ui: {
    loading: boolean;
    error: string | null;
  };
}

// 生成 Action 类型
type Actions<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? Actions<T[K], `${Prefix}${Capitalize<string & K>}/`>
    : {
        type: `${Prefix}set${Capitalize<string & K>}`;
        payload: T[K];
      };
}[keyof T];

type AppActions = Actions<AppState>;
/*
{
  type: 'setUser';
  payload: { id: number; name: string; isLoggedIn: boolean };
} | {
  type: 'User/setId';
  payload: number;
} | ...
*/

// Reducer 类型
type Reducer<S, A> = (state: S, action: A) => S;

const reducer: Reducer<AppState, AppActions> = (state, action) => {
  // 类型安全的 reducer
  return state;
};
```

---

## 9. 总结

### 核心工具

| 工具 | 用途 | 示例 |
|-----|------|------|
| **Record** | 创建键值对类型 | `Record<string, number>` |
| **Mapped Types** | 转换对象类型 | `{ [K in keyof T]: T[K] }` |
| **Template Literals** | 字符串类型拼接 | `` `on${Capitalize<K>}` `` |
| **Key Remapping** | 重新映射键名 | `[K in keyof T as NewK]: T[K]` |
| **Conditional Types** | 条件类型判断 | `T extends U ? X : Y` |

### 最佳实践

1. **优先使用 Record**：简单的键值对类型
2. **使用映射类型**：需要转换现有类型时
3. **模板字面量**：生成动态字符串类型
4. **类型推导**：让 TypeScript 自动推导，减少手动标注
5. **泛型约束**：使用 `extends` 约束泛型参数

### 常见模式

```typescript
// 1. 动态键名
type DynamicKeys<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

// 2. 条件过滤
type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// 3. 深度操作
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// 4. 路径访问
type PathValue<T, P extends string> = 
  P extends `${infer K}.${infer R}`
    ? K extends keyof T ? PathValue<T[K], R> : never
    : P extends keyof T ? T[P] : never;
```
