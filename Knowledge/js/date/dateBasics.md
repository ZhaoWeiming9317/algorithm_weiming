# JavaScript Date 对象基础

## new Date() 返回值

`new Date()` 返回的是一个 Date 对象，而不是时间戳。要获取时间戳，需要进行转换。

### 1. 创建 Date 对象的方式

```javascript
// 1. 无参数 - 当前时间
const now = new Date();  // 返回 Date 对象，如：Date {Fri Oct 04 2025 14:30:00 GMT+0800}

// 2. 时间戳（毫秒）
const date1 = new Date(1633334400000);  // 从1970年1月1日起的毫秒数

// 3. 日期字符串
const date2 = new Date('2025-10-04');
const date3 = new Date('2025/10/04');
const date4 = new Date('2025-10-04T14:30:00');

// 4. 年、月、日、时、分、秒、毫秒
const date5 = new Date(2025, 9, 4, 14, 30, 0, 0);  // 注意：月份是0-11
```

### 2. 转换为时间戳的方法

```javascript
const date = new Date();

// 方法1：getTime() 方法
const timestamp1 = date.getTime();  // 返回毫秒时间戳

// 方法2：valueOf() 方法
const timestamp2 = date.valueOf();  // 返回毫秒时间戳

// 方法3：一元运算符 +
const timestamp3 = +date;  // 返回毫秒时间戳

// 方法4：Date.now() - 获取当前时间戳（不需要先创建 Date 对象）
const timestamp4 = Date.now();
```

## 常见陷阱和注意事项

### 1. 时间戳单位

```javascript
// JavaScript 时间戳是毫秒级
const jsTimestamp = Date.now();     // 13位数字：1633334400000

// 后端 API 可能使用秒级时间戳
const serverTimestamp = 1633334400; // 10位数字

// 转换
const toMilliseconds = seconds => seconds * 1000;
const toSeconds = milliseconds => Math.floor(milliseconds / 1000);
```

### 2. 日期比较

```javascript
const date1 = new Date('2025-10-04');
const date2 = new Date('2025-10-05');

// 不推荐：直接比较 Date 对象
if (date1 < date2) {} // 虽然可行，但不够明确

// 推荐：比较时间戳
if (date1.getTime() < date2.getTime()) {}
```

### 3. 日期运算

```javascript
const date = new Date();

// 不要直接对 Date 对象进行算术运算
const tomorrow = new Date(date + 86400000); // 错误！

// 正确方式：使用时间戳或 Date 方法
const tomorrow1 = new Date(date.getTime() + 86400000);
// 或者
const tomorrow2 = new Date(date.setDate(date.getDate() + 1));
```

### 4. 时区问题

```javascript
// 创建 UTC 时间
const utcDate = new Date(Date.UTC(2025, 9, 4));

// 获取时区偏移（分钟）
const offset = new Date().getTimezoneOffset();

// 本地时间转 UTC
const localToUTC = date => {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

// UTC 转本地时间
const utcToLocal = date => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};
```

## 性能考虑

```javascript
// 1. 缓存 Date.now()
const start = Date.now(); // 比重复创建 Date 对象性能更好

// 2. 缓存 Date 对象
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
// 而不是
const year2 = new Date().getFullYear();
const month2 = new Date().getMonth();
```

## 实际应用示例

```javascript
// 1. 计算程序执行时间
const start = Date.now();
// ... 执行代码
const executionTime = Date.now() - start;

// 2. 判断是否同一天
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// 3. 获取当天开始时间
const startOfDay = date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

// 4. 获取当天结束时间
const endOfDay = date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};
```
