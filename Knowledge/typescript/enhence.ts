/**
 * TypeScript 工具类型手写实现
 * 常见的内置工具类型的实现原理
 */

// ==================== 1. MyPick ====================
/**
 * Pick<T, K> - 从类型 T 中挑选部分属性 K
 * 
 * 原理：
 * 1. K extends keyof T 确保 K 是 T 的键
 * 2. 遍历 K 中的每个键 P
 * 3. 从 T 中取出对应的类型
 */
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 测试
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UserPreview = MyPick<User, 'id' | 'name'>;
// 结果：{ id: number; name: string; }

const user1: UserPreview = {
  id: 1,
  name: '张三'
};

// ==================== 2. MyOmit ====================
/**
 * Omit<T, K> - 从类型 T 中排除属性 K
 * 
 * 原理：
 * 1. Exclude<keyof T, K> 从 T 的所有键中排除 K
 * 2. 使用 Pick 挑选剩余的键
 */
type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;

// 或者直接实现
type MyOmit2<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P];
};

// 测试
type UserWithoutEmail = MyOmit<User, 'email'>;
// 结果：{ id: number; name: string; age: number; }

const user2: UserWithoutEmail = {
  id: 1,
  name: '张三',
  age: 25
};

// ==================== 3. MyPartial ====================
/**
 * Partial<T> - 将类型 T 的所有属性变为可选
 * 
 * 原理：
 * 1. 遍历 T 的所有键 P
 * 2. 在每个键后面加上 ?
 */
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// 测试
type PartialUser = MyPartial<User>;
// 结果：{ id?: number; name?: string; age?: number; email?: string; }

const user3: PartialUser = {
  name: '张三'  // 其他属性可选
};

// ==================== 4. MyRequired ====================
/**
 * Required<T> - 将类型 T 的所有属性变为必选
 * 
 * 原理：
 * 1. 遍历 T 的所有键 P
 * 2. 使用 -? 移除可选标记
 */
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

// 测试
interface PartialPerson {
  name?: string;
  age?: number;
}

type RequiredPerson = MyRequired<PartialPerson>;
// 结果：{ name: string; age: number; }

const person1: RequiredPerson = {
  name: '张三',
  age: 25  // 必须提供
};

// ==================== 5. MyReadonly ====================
/**
 * Readonly<T> - 将类型 T 的所有属性变为只读
 * 
 * 原理：
 * 1. 遍历 T 的所有键 P
 * 2. 在每个键前面加上 readonly
 */
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 测试
type ReadonlyUser = MyReadonly<User>;
// 结果：{ readonly id: number; readonly name: string; ... }

const user4: ReadonlyUser = {
  id: 1,
  name: '张三',
  age: 25,
  email: 'test@example.com'
};

// user4.name = '李四';  // ❌ 错误：无法分配到 "name" ，因为它是只读属性

// ==================== 6. MyRecord ====================
/**
 * Record<K, T> - 创建一个对象类型，键为 K，值为 T
 * 
 * 原理：
 * 1. K extends keyof any 确保 K 可以作为对象的键
 * 2. 遍历 K 中的每个键 P
 * 3. 将每个键的类型设置为 T
 */
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};

// 测试
type PageInfo = MyRecord<'home' | 'about' | 'contact', { title: string; url: string }>;
// 结果：{ home: { title: string; url: string }; about: ...; contact: ...; }

const pages: PageInfo = {
  home: { title: '首页', url: '/' },
  about: { title: '关于', url: '/about' },
  contact: { title: '联系', url: '/contact' }
};

// ==================== 7. MyExclude ====================
/**
 * Exclude<T, U> - 从类型 T 中排除可以赋值给 U 的类型
 * 
 * 原理：
 * 1. 使用条件类型
 * 2. T extends U 时返回 never（排除）
 * 3. 否则返回 T（保留）
 */
type MyExclude<T, U> = T extends U ? never : T;

// 测试
type T1 = MyExclude<'a' | 'b' | 'c', 'a'>;
// 结果：'b' | 'c'

type T2 = MyExclude<string | number | boolean, string>;
// 结果：number | boolean

// ==================== 8. MyExtract ====================
/**
 * Extract<T, U> - 从类型 T 中提取可以赋值给 U 的类型
 * 
 * 原理：
 * 1. 使用条件类型
 * 2. T extends U 时返回 T（提取）
 * 3. 否则返回 never（排除）
 */
type MyExtract<T, U> = T extends U ? T : never;

// 测试
type T3 = MyExtract<'a' | 'b' | 'c', 'a' | 'f'>;
// 结果：'a'

type T4 = MyExtract<string | number | boolean, string | number>;
// 结果：string | number

// ==================== 9. MyNonNullable ====================
/**
 * NonNullable<T> - 从类型 T 中排除 null 和 undefined
 * 
 * 原理：
 * 1. 使用 Exclude 排除 null 和 undefined
 */
type MyNonNullable<T> = Exclude<T, null | undefined>;

// 测试
type T5 = MyNonNullable<string | number | null | undefined>;
// 结果：string | number

// ==================== 10. MyReturnType ====================
/**
 * ReturnType<T> - 获取函数类型 T 的返回值类型
 * 
 * 原理：
 * 1. T extends (...args: any) => infer R 判断 T 是否是函数
 * 2. 使用 infer R 推断返回值类型
 * 3. 如果是函数，返回 R；否则返回 any
 */
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

// 测试
function getUser() {
  return { id: 1, name: '张三' };
}

type UserReturn = MyReturnType<typeof getUser>;
// 结果：{ id: number; name: string; }

// ==================== 11. MyParameters ====================
/**
 * Parameters<T> - 获取函数类型 T 的参数类型（元组）
 * 
 * 原理：
 * 1. T extends (...args: infer P) => any 判断 T 是否是函数
 * 2. 使用 infer P 推断参数类型
 * 3. 如果是函数，返回 P；否则返回 never
 */
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

// 测试
function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = MyParameters<typeof createUser>;
// 结果：[name: string, age: number, email: string]

// ==================== 12. MyAwaited ====================
/**
 * Awaited<T> - 获取 Promise 的返回值类型
 * 
 * 原理：
 * 1. 递归处理嵌套的 Promise
 * 2. 使用 infer 推断 Promise 的泛型参数
 */
type MyAwaited<T> = T extends Promise<infer U>
  ? U extends Promise<any>
    ? MyAwaited<U>  // 递归处理嵌套 Promise
    : U
  : T;

// 测试
type T6 = MyAwaited<Promise<string>>;
// 结果：string

type T7 = MyAwaited<Promise<Promise<number>>>;
// 结果：number

// ==================== 13. MyDeepReadonly ====================
/**
 * DeepReadonly<T> - 深度只读，递归将所有属性变为只读
 * 
 * 原理：
 * 1. 遍历 T 的所有键 K
 * 2. 如果 T[K] 是对象，递归调用 DeepReadonly
 * 3. 否则直接设置为只读
 */
type MyDeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? T[K] extends Function
      ? T[K]  // 函数不需要递归
      : MyDeepReadonly<T[K]>  // 递归处理对象
    : T[K];
};

// 测试
interface NestedObject {
  a: {
    b: {
      c: number;
    };
  };
}

type DeepReadonlyNested = MyDeepReadonly<NestedObject>;
// 结果：{ readonly a: { readonly b: { readonly c: number } } }

// ==================== 14. MyDeepPartial ====================
/**
 * DeepPartial<T> - 深度可选，递归将所有属性变为可选
 * 
 * 原理：
 * 1. 遍历 T 的所有键 K
 * 2. 如果 T[K] 是对象，递归调用 DeepPartial
 * 3. 否则直接设置为可选
 */
type MyDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : MyDeepPartial<T[K]>
    : T[K];
};

// 测试
type DeepPartialNested = MyDeepPartial<NestedObject>;
// 结果：{ a?: { b?: { c?: number } } }

// ==================== 15. MyCapitalize ====================
/**
 * Capitalize<S> - 将字符串首字母大写
 * 
 * 原理：
 * 1. 使用模板字面量类型
 * 2. infer F 推断第一个字符
 * 3. infer R 推断剩余字符
 * 4. Uppercase<F> 将第一个字符转大写
 */
type MyCapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

// 测试
type T8 = MyCapitalize<'hello'>;
// 结果：'Hello'

// ==================== 16. MyUncapitalize ====================
/**
 * Uncapitalize<S> - 将字符串首字母小写
 */
type MyUncapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${R}`
  : S;

// 测试
type T9 = MyUncapitalize<'Hello'>;
// 结果：'hello'

// ==================== 17. MyPromiseAll ====================
/**
 * PromiseAll - 实现 Promise.all 的类型
 * 
 * 原理：
 * 1. 遍历数组 T
 * 2. 使用 Awaited 获取每个 Promise 的返回值类型
 * 3. 返回一个新的数组类型
 */
type MyPromiseAll<T extends any[]> = Promise<{
  [K in keyof T]: Awaited<T[K]>;
}>;

// 测试
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve('hello');
const promise3 = Promise.resolve(true);

type PromiseAllResult = MyPromiseAll<[typeof promise1, typeof promise2, typeof promise3]>;
// 结果：Promise<[number, string, boolean]>

// ==================== 18. MyMutable ====================
/**
 * Mutable<T> - 移除所有 readonly 修饰符
 * 
 * 原理：
 * 1. 使用 -readonly 移除 readonly 修饰符
 */
type MyMutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// 测试
type ReadonlyPerson = {
  readonly name: string;
  readonly age: number;
};

type MutablePerson = MyMutable<ReadonlyPerson>;
// 结果：{ name: string; age: number; }

// ==================== 19. MyTupleToUnion ====================
/**
 * TupleToUnion - 将元组转换为联合类型
 * 
 * 原理：
 * 1. T[number] 获取元组所有元素的类型
 */
type MyTupleToUnion<T extends any[]> = T[number];

// 测试
type T10 = MyTupleToUnion<[string, number, boolean]>;
// 结果：string | number | boolean

// ==================== 20. MyUnionToIntersection ====================
/**
 * UnionToIntersection - 将联合类型转换为交叉类型
 * 
 * 原理：
 * 1. 利用函数参数的逆变性质
 * 2. 将联合类型转换为交叉类型
 */
type MyUnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

// 测试
type T11 = MyUnionToIntersection<{ a: string } | { b: number }>;
// 结果：{ a: string } & { b: number }

// ==================== 21. MyChainableOptions ====================
/**
 * Chainable - 实现链式调用类型
 */
type MyChainable<T = {}> = {
  option<K extends string, V>(key: K, value: V): MyChainable<T & { [P in K]: V }>;
  get(): T;
};

// 测试
declare const config: MyChainable;

const result = config
  .option('foo', 123)
  .option('bar', 'hello')
  .option('baz', true)
  .get();

// result 类型：{ foo: number; bar: string; baz: boolean; }

// ==================== 22. MyFlatten ====================
/**
 * Flatten - 展平数组类型（一层）
 * 
 * 原理：
 * 1. 递归处理嵌套数组
 * 2. 使用 infer 推断数组元素类型
 */
type MyFlatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...MyFlatten<First>, ...MyFlatten<Rest>]
    : [First, ...MyFlatten<Rest>]
  : [];

// 测试
type T12 = MyFlatten<[1, [2, 3], [4, [5, 6]]]>;
// 结果：[1, 2, 3, 4, [5, 6]]（只展平一层）

// ==================== 23. MyGetRequired ====================
/**
 * GetRequired - 获取所有必选属性
 */
type MyGetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

// 测试
interface MixedProps {
  required1: string;
  required2: number;
  optional1?: boolean;
  optional2?: string;
}

type RequiredProps = MyGetRequired<MixedProps>;
// 结果：{ required1: string; required2: number; }

// ==================== 24. MyGetOptional ====================
/**
 * GetOptional - 获取所有可选属性
 */
type MyGetOptional<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
};

// 测试
type OptionalProps = MyGetOptional<MixedProps>;
// 结果：{ optional1?: boolean; optional2?: string; }

// ==================== 25. MyAppendToObject ====================
/**
 * AppendToObject - 向对象类型添加新属性
 */
type MyAppendToObject<T, K extends string, V> = {
  [P in keyof T | K]: P extends keyof T ? T[P] : V;
};

// 测试
type AppendedUser = MyAppendToObject<User, 'role', string>;
// 结果：{ id: number; name: string; age: number; email: string; role: string; }

// ==================== 总结 ====================
/**
 * 🎯 核心技巧：
 * 
 * 1. 映射类型（Mapped Types）
 *    - [P in keyof T]: T[P]
 *    - 遍历对象的所有键
 * 
 * 2. 条件类型（Conditional Types）
 *    - T extends U ? X : Y
 *    - 根据条件选择类型
 * 
 * 3. infer 关键字
 *    - T extends (...args: infer P) => infer R
 *    - 推断类型参数
 * 
 * 4. 修饰符
 *    - ? 可选
 *    - -? 移除可选
 *    - readonly 只读
 *    - -readonly 移除只读
 * 
 * 5. 模板字面量类型
 *    - `${Uppercase<F>}${R}`
 *    - 字符串操作
 * 
 * 6. 递归类型
 *    - 类型可以递归调用自己
 *    - 处理嵌套结构
 * 
 * 7. as 重映射
 *    - [P in keyof T as NewKey]: T[P]
 *    - 改变键名
 */

// ==================== 面试常考 ====================
/**
 * 🔥 高频考点：
 * 
 * 1. Pick / Omit - 基础必考
 * 2. Partial / Required - 常用工具类型
 * 3. ReturnType / Parameters - 函数类型推断
 * 4. Exclude / Extract - 联合类型操作
 * 5. DeepReadonly / DeepPartial - 递归类型
 * 
 * 💡 记忆技巧：
 * - Pick：挑选（in K）
 * - Omit：排除（Exclude + Pick）
 * - Partial：可选（?）
 * - Required：必选（-?）
 * - Readonly：只读（readonly）
 * - Record：记录（[P in K]: T）
 * - Exclude：排除（extends ? never : T）
 * - Extract：提取（extends ? T : never）
 * - ReturnType：返回值（infer R）
 * - Parameters：参数（infer P）
 */

export {};
