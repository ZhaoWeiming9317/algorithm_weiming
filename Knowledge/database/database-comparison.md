# 数据库对比：NoSQL vs MySQL vs PostgreSQL

> 快速理解不同数据库的特点和选择

## 快速对比表

| 特性 | MySQL | PostgreSQL | NoSQL (MongoDB) |
|------|-------|------------|-----------------|
| 类型 | 关系型 | 关系型 | 文档型 |
| 数据模型 | 表格 | 表格 | JSON 文档 |
| ACID | 支持 | 完全支持 | 部分支持 |
| 事务 | 支持 | 强大 | 有限 |
| 扩展性 | 垂直 | 垂直 | 水平 |
| Schema | 固定 | 固定 | 灵活 |
| 性能 | 读快 | 复杂查询快 | 写快 |
| 学习曲线 | 简单 | 中等 | 简单 |
| 适用场景 | Web 应用 | 复杂业务 | 大数据、实时 |

---

## 1. MySQL

**特点**：
- 最流行的开源关系型数据库
- 读操作性能优秀
- 简单易用，生态成熟

**优势**：
- 速度快，适合读多写少
- 社区庞大，资料丰富
- 主从复制简单
- 适合 Web 应用

**劣势**：
- 复杂查询性能一般
- 对 SQL 标准支持不完整
- 存储过程功能较弱

**适用场景**：
- 电商网站
- 内容管理系统（CMS）
- 博客、论坛
- 中小型 Web 应用

<details>
<summary><b>📖 详解</b></summary>

**存储引擎**：
- InnoDB：支持事务，行级锁，默认引擎
- MyISAM：不支持事务，表级锁，读快

**性能优化**：
```sql
-- 索引优化
CREATE INDEX idx_user_email ON users(email);

-- 查询缓存（MySQL 8.0 已移除）
SET GLOBAL query_cache_size = 1048576;

-- 慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

**主从复制**：
```
Master (主库) → 写操作
    ↓
Slave1, Slave2 (从库) → 读操作
```

**使用示例**：
```sql
-- 创建表
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 查询
SELECT * FROM users WHERE email = 'test@example.com';
```

</details>

---

## 2. PostgreSQL

**特点**：
- 最先进的开源关系型数据库
- 完全符合 SQL 标准
- 功能强大，扩展性好

**优势**：
- 复杂查询性能强
- 支持 JSON、数组等复杂类型
- 强大的存储过程和触发器
- 完整的 ACID 支持
- 支持全文搜索、地理信息

**劣势**：
- 配置复杂
- 内存占用较大
- 学习曲线陡峭

**适用场景**：
- 金融系统
- 数据分析
- 地理信息系统（GIS）
- 复杂业务逻辑

<details>
<summary><b>📖 详解</b></summary>

**高级特性**：

**1. JSON 支持**：
```sql
-- 存储 JSON
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  data JSONB
);

INSERT INTO products (data) VALUES 
  ('{"name": "iPhone", "price": 999, "tags": ["phone", "apple"]}');

-- 查询 JSON
SELECT data->>'name' as name FROM products;
SELECT * FROM products WHERE data @> '{"tags": ["phone"]}';
```

**2. 数组类型**：
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  tags TEXT[]
);

INSERT INTO posts (tags) VALUES (ARRAY['nodejs', 'javascript']);
SELECT * FROM posts WHERE 'nodejs' = ANY(tags);
```

**3. 全文搜索**：
```sql
-- 创建全文搜索索引
CREATE INDEX idx_content_search ON articles 
  USING gin(to_tsvector('english', content));

-- 全文搜索
SELECT * FROM articles 
WHERE to_tsvector('english', content) @@ to_tsquery('nodejs & database');
```

**4. 窗口函数**：
```sql
-- 排名
SELECT 
  name,
  salary,
  RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;
```

**性能优化**：
```sql
-- 分析查询
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- 真空清理
VACUUM ANALYZE;

-- 索引
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
```

</details>

---

## 3. NoSQL (MongoDB)

**特点**：
- 文档型数据库
- Schema 灵活
- 水平扩展容易

**优势**：
- 无需预定义 Schema
- 水平扩展（分片）
- 高性能写入
- 适合非结构化数据
- 开发速度快

**劣势**：
- 不支持复杂事务
- 不支持 JOIN
- 数据一致性较弱
- 占用存储空间大

**适用场景**：
- 实时分析
- 日志系统
- 社交网络
- 物联网（IoT）
- 内容管理

<details>
<summary><b>📖 详解</b></summary>

**数据模型**：
```javascript
// MongoDB 文档示例
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "张三",
  email: "zhangsan@example.com",
  age: 25,
  address: {
    city: "北京",
    street: "朝阳区"
  },
  hobbies: ["读书", "旅游"],
  createdAt: ISODate("2024-01-01T00:00:00Z")
}
```

**CRUD 操作**：
```javascript
// 插入
db.users.insertOne({
  name: "张三",
  email: "zhangsan@example.com",
  age: 25
});

// 查询
db.users.find({ age: { $gte: 18 } });

// 更新
db.users.updateOne(
  { email: "zhangsan@example.com" },
  { $set: { age: 26 } }
);

// 删除
db.users.deleteOne({ email: "zhangsan@example.com" });
```

**聚合查询**：
```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { 
      _id: "$userId", 
      total: { $sum: "$amount" } 
  }},
  { $sort: { total: -1 } },
  { $limit: 10 }
]);
```

**索引**：
```javascript
// 创建索引
db.users.createIndex({ email: 1 });

// 复合索引
db.users.createIndex({ name: 1, age: -1 });

// 全文索引
db.articles.createIndex({ content: "text" });
db.articles.find({ $text: { $search: "nodejs" } });
```

**分片（Sharding）**：
```
应用 → mongos (路由)
         ↓
    ┌────┴────┐
  Shard1   Shard2   Shard3
  (数据1)  (数据2)  (数据3)
```

**副本集（Replica Set）**：
```
Primary (主节点) ← 写操作
    ↓ 复制
Secondary1, Secondary2 (从节点) ← 读操作
```

</details>

---

## 详细对比

### 1. 数据模型

**MySQL/PostgreSQL（关系型）**：
```sql
-- 用户表
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);

-- 订单表
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 查询需要 JOIN
SELECT u.name, o.amount 
FROM users u 
JOIN orders o ON u.id = o.user_id;
```

**MongoDB（文档型）**：
```javascript
// 嵌入式文档
{
  _id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  orders: [
    { id: 101, amount: 100 },
    { id: 102, amount: 200 }
  ]
}

// 查询无需 JOIN
db.users.find({ _id: 1 });
```

### 2. 事务支持

**MySQL**：
```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

**PostgreSQL**：
```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

**MongoDB（4.0+ 支持多文档事务）**：
```javascript
const session = client.startSession();
session.startTransaction();
try {
  await accounts.updateOne(
    { _id: 1 },
    { $inc: { balance: -100 } },
    { session }
  );
  await accounts.updateOne(
    { _id: 2 },
    { $inc: { balance: 100 } },
    { session }
  );
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

### 3. 扩展性

**MySQL/PostgreSQL（垂直扩展）**：
```
单机 → 升级 CPU、内存、磁盘
主从复制 → 读写分离
分库分表 → 复杂，需要中间件
```

**MongoDB（水平扩展）**：
```
分片集群 → 自动分布数据
添加节点 → 自动负载均衡
```

### 4. 查询性能

**简单查询**：
- MySQL：⭐⭐⭐⭐⭐（最快）
- PostgreSQL：⭐⭐⭐⭐
- MongoDB：⭐⭐⭐⭐

**复杂查询（JOIN、子查询）**：
- MySQL：⭐⭐⭐
- PostgreSQL：⭐⭐⭐⭐⭐（最强）
- MongoDB：⭐⭐（不支持 JOIN）

**大数据写入**：
- MySQL：⭐⭐⭐
- PostgreSQL：⭐⭐⭐
- MongoDB：⭐⭐⭐⭐⭐（最快）

---

## 选择建议

### 选择 MySQL 如果：
- ✅ 构建传统 Web 应用
- ✅ 需要简单易用的数据库
- ✅ 读操作远多于写操作
- ✅ 团队熟悉 MySQL
- ✅ 预算有限（社区版免费）

**典型案例**：WordPress、Drupal、电商网站

### 选择 PostgreSQL 如果：
- ✅ 需要复杂查询和分析
- ✅ 数据完整性要求高
- ✅ 需要高级功能（JSON、全文搜索、GIS）
- ✅ 金融、医疗等严格行业
- ✅ 需要强大的扩展性

**典型案例**：金融系统、数据分析平台、企业应用

### 选择 NoSQL (MongoDB) 如果：
- ✅ 数据结构经常变化
- ✅ 需要快速开发迭代
- ✅ 海量数据需要水平扩展
- ✅ 非结构化或半结构化数据
- ✅ 高并发写入场景

**典型案例**：社交网络、实时分析、日志系统、IoT

---

## 混合使用

实际项目中可以结合使用：

```
MySQL/PostgreSQL (关系型)
  ↓ 存储核心业务数据
  - 用户信息
  - 订单数据
  - 财务数据

MongoDB (NoSQL)
  ↓ 存储灵活数据
  - 日志
  - 用户行为
  - 实时数据

Redis (缓存)
  ↓ 加速访问
  - 会话
  - 热点数据
```

---

## 快速记忆

**MySQL**：
- 关键词：简单、快速、Web
- 口诀：读多写少选 MySQL

**PostgreSQL**：
- 关键词：强大、标准、复杂
- 口诀：复杂业务选 PostgreSQL

**MongoDB**：
- 关键词：灵活、扩展、文档
- 口诀：灵活扩展选 MongoDB

---

## 面试高频问题

### Q1: 为什么 NoSQL 比关系型数据库快？

**答案**：
- 无需 JOIN：数据嵌入，减少查询次数
- 无 Schema 验证：写入更快
- 水平扩展：分布式架构
- 但：牺牲了一致性和事务支持

### Q2: 什么时候不应该用 NoSQL？

**答案**：
- 需要复杂事务（如转账）
- 需要复杂关联查询
- 数据关系复杂
- 强一致性要求
- 数据结构固定且规范

### Q3: MySQL 和 PostgreSQL 主要区别？

**答案**：
- **性能**：MySQL 读快，PostgreSQL 复杂查询快
- **功能**：PostgreSQL 功能更强大（JSON、数组、全文搜索）
- **标准**：PostgreSQL 更符合 SQL 标准
- **生态**：MySQL 生态更大，资料更多
- **场景**：MySQL 适合 Web，PostgreSQL 适合企业

---

加油！💪
