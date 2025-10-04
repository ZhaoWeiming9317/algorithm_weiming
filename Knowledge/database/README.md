# 数据库知识体系

## 目录结构

```
database/
├── README.md                    # 总体介绍和目录
├── types/                       # 数据库类型
│   ├── rdbms.md                # 关系型数据库详解
│   ├── document_db.md          # 文档数据库详解
│   ├── key_value_db.md         # 键值数据库详解
│   ├── column_db.md            # 列式数据库详解
│   ├── graph_db.md             # 图数据库详解
│   ├── time_series_db.md       # 时序数据库详解
│   └── search_engine_db.md     # 搜索引擎数据库详解
├── concepts/                    # 核心概念
│   ├── acid.md                 # ACID特性详解
│   ├── cap.md                  # CAP定理详解
│   ├── consistency.md          # 一致性模型详解
│   ├── transaction.md          # 事务机制详解
│   └── isolation.md            # 隔离级别详解
├── architecture/               # 架构设计
│   ├── distributed.md          # 分布式数据库架构
│   ├── sharding.md             # 分片策略详解
│   ├── replication.md          # 复制机制详解
│   └── high_availability.md    # 高可用设计
├── optimization/               # 性能优化
│   ├── indexing.md             # 索引设计与优化
│   ├── query_optimization.md   # 查询优化
│   ├── caching.md              # 缓存策略
│   └── performance_tuning.md   # 性能调优
└── patterns/                   # 设计模式
    ├── microservices.md        # 微服务数据库模式
    ├── cqrs.md                 # CQRS模式详解
    ├── event_sourcing.md       # 事件溯源模式
    └── polyglot_persistence.md # 多模型持久化
```

## 文档组织原则

1. 每个文档专注于一个主题
2. 从基础概念到实际应用
3. 包含代码示例和最佳实践
4. 提供真实案例分析

## 阅读建议

1. 先了解基础概念（concepts目录）
2. 再学习具体数据库类型（types目录）
3. 然后是架构设计（architecture目录）
4. 最后是优化和模式（optimization和patterns目录）

## 更新计划

- 每周更新一个主要主题
- 优先更新基础概念和主流数据库类型
- 持续补充实际案例和最佳实践

## 贡献指南

1. 遵循统一的文档格式
2. 提供可验证的代码示例
3. 包含参考资料和延伸阅读
4. 保持与实际应用的关联性