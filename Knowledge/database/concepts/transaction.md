# 数据库事务机制详解

## 目录
1. [事务基础](#事务基础)
2. [事务状态和生命周期](#事务状态和生命周期)
3. [并发控制机制](#并发控制机制)
4. [事务恢复机制](#事务恢复机制)
5. [分布式事务](#分布式事务)
6. [实际应用](#实际应用)

## 事务基础

### 定义
事务是数据库中的一个执行单位，它由一系列对数据库的读/写操作组成。

### 特性
```plaintext
事务的四个基本特性（ACID）：
1. 原子性（Atomicity）
2. 一致性（Consistency）
3. 隔离性（Isolation）
4. 持久性（Durability）
```

## 事务状态和生命周期

### 状态转换
```java
public enum TransactionState {
    ACTIVE,      // 活动状态
    PARTIALLY_COMMITTED,  // 部分提交
    COMMITTED,   // 已提交
    FAILED,      // 失败
    ABORTED      // 中止
}

public class Transaction {
    private TransactionState state;
    
    public void begin() {
        state = TransactionState.ACTIVE;
    }
    
    public void commit() {
        if (state == TransactionState.ACTIVE) {
            state = TransactionState.PARTIALLY_COMMITTED;
            if (writeToDatabase()) {
                state = TransactionState.COMMITTED;
            } else {
                abort();
            }
        }
    }
    
    public void abort() {
        state = TransactionState.FAILED;
        rollback();
        state = TransactionState.ABORTED;
    }
}
```

### 生命周期管理
```java
public class TransactionManager {
    private List<Transaction> activeTransactions;
    private TransactionLog log;
    
    public Transaction beginTransaction() {
        Transaction tx = new Transaction();
        tx.begin();
        activeTransactions.add(tx);
        log.recordBegin(tx);
        return tx;
    }
    
    public void commitTransaction(Transaction tx) {
        try {
            tx.commit();
            log.recordCommit(tx);
            activeTransactions.remove(tx);
        } catch (Exception e) {
            abortTransaction(tx);
        }
    }
}
```

## 并发控制机制

### 1. 锁机制
```java
public class LockManager {
    private Map<Resource, Lock> locks = new HashMap<>();
    
    // 两阶段锁协议（2PL）
    public void acquireLock(Transaction tx, Resource resource, LockType type) {
        Lock lock = locks.get(resource);
        if (lock == null) {
            lock = new Lock(resource);
            locks.put(resource, lock);
        }
        
        if (type == LockType.SHARED) {
            lock.acquireShared(tx);
        } else {
            lock.acquireExclusive(tx);
        }
    }
    
    public void releaseLock(Transaction tx, Resource resource) {
        Lock lock = locks.get(resource);
        if (lock != null) {
            lock.release(tx);
        }
    }
}
```

### 2. 时间戳排序
```java
public class TimestampOrderingManager {
    private AtomicLong timestamp = new AtomicLong(0);
    
    public long getTimestamp() {
        return timestamp.incrementAndGet();
    }
    
    public boolean validateTransaction(Transaction tx) {
        for (Operation op : tx.getOperations()) {
            if (!validateOperation(op)) {
                return false;
            }
        }
        return true;
    }
}
```

### 3. 多版本并发控制（MVCC）
```java
public class MVCCManager {
    private Map<String, List<Version>> versions = new HashMap<>();
    
    public void write(Transaction tx, String key, String value) {
        Version version = new Version(value, tx.getTimestamp());
        versions.computeIfAbsent(key, k -> new ArrayList<>()).add(version);
    }
    
    public String read(Transaction tx, String key) {
        List<Version> versionList = versions.get(key);
        if (versionList == null) return null;
        
        // 找到事务时间戳之前的最新版本
        return versionList.stream()
            .filter(v -> v.getTimestamp() <= tx.getTimestamp())
            .max(Comparator.comparing(Version::getTimestamp))
            .map(Version::getValue)
            .orElse(null);
    }
}
```

## 事务恢复机制

### 1. 日志管理
```java
public class LogManager {
    private List<LogRecord> log = new ArrayList<>();
    
    public void writeLog(LogRecord record) {
        log.add(record);
        if (record.getType() == LogType.COMMIT) {
            flushToDisk();
        }
    }
    
    public void recover() {
        List<Transaction> toUndo = new ArrayList<>();
        List<Transaction> toRedo = new ArrayList<>();
        
        // 分析阶段：确定需要重做和撤销的事务
        for (LogRecord record : log) {
            switch (record.getType()) {
                case BEGIN:
                    toUndo.add(record.getTransaction());
                    break;
                case COMMIT:
                    toUndo.remove(record.getTransaction());
                    toRedo.add(record.getTransaction());
                    break;
                case ABORT:
                    toUndo.remove(record.getTransaction());
                    break;
            }
        }
        
        // 重做阶段
        for (Transaction tx : toRedo) {
            redo(tx);
        }
        
        // 撤销阶段
        for (Transaction tx : toUndo) {
            undo(tx);
        }
    }
}
```

### 2. 检查点机制
```java
public class CheckpointManager {
    private volatile boolean checkpointInProgress = false;
    
    public void createCheckpoint() {
        checkpointInProgress = true;
        try {
            // 暂停新事务
            pauseNewTransactions();
            
            // 等待活动事务完成
            waitForActiveTransactions();
            
            // 将脏页写入磁盘
            flushDirtyPages();
            
            // 写入检查点记录
            writeCheckpointRecord();
        } finally {
            checkpointInProgress = false;
            resumeNewTransactions();
        }
    }
}
```

## 分布式事务

### 1. 两阶段提交（2PC）
```java
public class TwoPhaseCommitCoordinator {
    private List<Participant> participants;
    
    public boolean executeTransaction(Transaction tx) {
        // 阶段1：准备阶段
        boolean allPrepared = true;
        for (Participant p : participants) {
            if (!p.prepare(tx)) {
                allPrepared = false;
                break;
            }
        }
        
        // 阶段2：提交/回滚阶段
        if (allPrepared) {
            for (Participant p : participants) {
                p.commit(tx);
            }
            return true;
        } else {
            for (Participant p : participants) {
                p.rollback(tx);
            }
            return false;
        }
    }
}
```

### 2. 三阶段提交（3PC）
```java
public class ThreePhaseCommitCoordinator {
    private List<Participant> participants;
    
    public boolean executeTransaction(Transaction tx) {
        // 阶段1：CanCommit
        if (!canCommitPhase(tx)) {
            return false;
        }
        
        // 阶段2：PreCommit
        if (!preCommitPhase(tx)) {
            return false;
        }
        
        // 阶段3：DoCommit
        return doCommitPhase(tx);
    }
    
    private boolean canCommitPhase(Transaction tx) {
        return participants.stream()
            .allMatch(p -> p.canCommit(tx));
    }
    
    private boolean preCommitPhase(Transaction tx) {
        return participants.stream()
            .allMatch(p -> p.preCommit(tx));
    }
    
    private boolean doCommitPhase(Transaction tx) {
        return participants.stream()
            .allMatch(p -> p.doCommit(tx));
    }
}
```

### 3. SAGA模式
```java
public class SagaCoordinator {
    private List<SagaStep> steps;
    
    public void executeSaga(Transaction tx) {
        List<SagaStep> completedSteps = new ArrayList<>();
        
        try {
            // 执行每个步骤
            for (SagaStep step : steps) {
                step.execute();
                completedSteps.add(step);
            }
        } catch (Exception e) {
            // 补偿已完成的步骤
            for (int i = completedSteps.size() - 1; i >= 0; i--) {
                completedSteps.get(i).compensate();
            }
            throw e;
        }
    }
}
```

## 实际应用

### 1. 电商订单处理
```java
@Transactional
public class OrderService {
    public Order createOrder(OrderRequest request) {
        try {
            // 1. 检查库存
            inventoryService.checkStock(request.getItems());
            
            // 2. 创建订单
            Order order = orderRepository.save(new Order(request));
            
            // 3. 扣减库存
            inventoryService.deductStock(request.getItems());
            
            // 4. 处理支付
            paymentService.process(order);
            
            return order;
        } catch (Exception e) {
            // 自动回滚
            throw new OrderCreationException("Failed to create order", e);
        }
    }
}
```

### 2. 银行转账
```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public class TransferService {
    public void transfer(Account from, Account to, BigDecimal amount) {
        // 1. 检查余额
        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException();
        }
        
        // 2. 扣款
        from.debit(amount);
        accountRepository.save(from);
        
        // 3. 入账
        to.credit(amount);
        accountRepository.save(to);
        
        // 4. 记录交易
        transactionRepository.save(new Transaction(from, to, amount));
    }
}
```

### 3. 库存管理
```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public class InventoryService {
    public void processDelivery(Delivery delivery) {
        // 1. 验证送货单
        validateDelivery(delivery);
        
        // 2. 更新库存
        for (DeliveryItem item : delivery.getItems()) {
            Inventory inventory = inventoryRepository.findById(item.getProductId());
            inventory.addStock(item.getQuantity());
            inventoryRepository.save(inventory);
        }
        
        // 3. 更新送货状态
        delivery.setStatus(DeliveryStatus.COMPLETED);
        deliveryRepository.save(delivery);
    }
}
```

## 总结

事务机制是数据库系统的核心功能，它通过：

1. **并发控制**
   - 保证数据一致性
   - 提供隔离性
   - 处理并发访问

2. **恢复机制**
   - 保证原子性
   - 确保持久性
   - 处理系统故障

3. **分布式支持**
   - 处理分布式事务
   - 保证全局一致性
   - 提供可扩展性

在实际应用中，需要根据具体场景选择合适的事务机制和隔离级别，在一致性和性能之间找到平衡点。
