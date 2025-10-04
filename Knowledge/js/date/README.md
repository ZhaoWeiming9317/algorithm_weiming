# JavaScript 日期操作指南

## 常见日期操作

### 1. 日期格式化
```javascript
// 基本格式化
DateUtils.format(new Date(), 'YYYY-MM-DD'); // '2025-10-04'
DateUtils.format(new Date(), 'YYYY-MM-DD HH:mm:ss'); // '2025-10-04 14:30:00'

// 支持时间戳
DateUtils.format(1633334400000, 'YYYY-MM-DD');

// 支持日期字符串
DateUtils.format('2025-10-04', 'MM/DD/YYYY');
```

### 2. 相对时间
```javascript
// 计算相对时间
DateUtils.fromNow(new Date('2025-10-03')); // '1天前'
DateUtils.fromNow(new Date('2025-09-04')); // '1个月前'
```

### 3. 日期范围
```javascript
// 获取今天的起止时间
const [start, end] = DateUtils.getDateRange('today');

// 获取本周范围
const [weekStart, weekEnd] = DateUtils.getDateRange('week');

// 获取本月范围
const [monthStart, monthEnd] = DateUtils.getDateRange('month');
```

### 4. 日期计算
```javascript
// 计算日期差值
DateUtils.diff('2025-10-01', '2025-10-04', 'days'); // 3
DateUtils.diff('2025-10-01 10:00', '2025-10-01 15:00', 'hours'); // 5

// 添加时间
DateUtils.add(new Date(), 7, 'days'); // 7天后
DateUtils.add(new Date(), -1, 'months'); // 1个月前
```

## 常见问题和解决方案

### 1. 时区问题
```javascript
// 本地时间转 UTC
const toUTC = date => {
  const now = new Date(date);
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
};

// UTC 转本地时间
const toLocal = date => {
  const now = new Date(date);
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
};
```

### 2. 月份边界问题
```javascript
// 获取月份最后一天
const lastDay = DateUtils.getDaysInMonth(2025, 2); // 28

// 处理月份溢出
const date = new Date(2025, 1, 31); // 自动调整到 3月3日
```

### 3. 闰年处理
```javascript
// 判断闰年
DateUtils.isLeapYear(2024); // true
DateUtils.isLeapYear(2025); // false
```

## 性能优化

1. 缓存 Date 对象
```javascript
// 不好的做法
function process() {
  const now = new Date();
  // 多次使用 new Date()
}

// 好的做法
function process() {
  const now = new Date();
  // 复用 now
}
```

2. 使用时间戳进行比较
```javascript
// 不好的做法
if (date1 > date2) {}

// 好的做法
if (date1.getTime() > date2.getTime()) {}
```

## 最佳实践

1. 输入验证
```javascript
// 总是验证输入的有效性
try {
  DateUtils.format('invalid date');
} catch (e) {
  console.error('Invalid date format');
}
```

2. 统一格式
```javascript
// 在项目中统一日期格式
const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
```

3. 考虑国际化
```javascript
// 使用 Intl API 进行本地化
const formatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
```

## 常见面试题

1. 实现日期格式化函数
```javascript
// 考察点：正则表达式、字符串处理
function formatDate(date, format) {
  // 实现见 DateUtils.format
}
```

2. 计算日期差值
```javascript
// 考察点：日期计算、单位转换
function dateDiff(date1, date2, unit) {
  // 实现见 DateUtils.diff
}
```

3. 判断工作日
```javascript
// 考察点：日期基础操作
function isWeekday(date) {
  // 实现见 DateUtils.isWeekday
}
```

## 注意事项

1. 月份索引
- JavaScript 中月份是从 0 开始的（0-11）
- 使用时注意进行转换

2. 日期解析
- 尽量使用明确的格式
- 避免依赖浏览器的默认解析

3. 时区处理
- 注意服务器和客户端的时区差异
- 考虑使用 UTC 时间进行存储

4. 边界情况
- 注意月份和年份的进位
- 处理无效日期输入
- 考虑闰年情况
