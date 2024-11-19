步骤1: 初始状态
prev = null, curr = 1
null    1 -> 2 -> 3 -> 4 -> null
↑       ↑
prev    curr

步骤2: 第一次迭代
1. next = curr.next (保存2)
2. curr.next = prev (1指向null)
3. prev = curr (prev移到1)
4. curr = next (curr移到2)

null <- 1    2 -> 3 -> 4 -> null
        ↑    ↑
        prev curr

步骤3: 第二次迭代
1. next = curr.next (保存3)
2. curr.next = prev (2指向1)
3. prev = curr (prev移到2)
4. curr = next (curr移到3)

null <- 1 <- 2    3 -> 4 -> null
             ↑    ↑
             prev curr

步骤4: 第三次迭代
1. next = curr.next (保存4)
2. curr.next = prev (3指向2)
3. prev = curr (prev移到3)
4. curr = next (curr移到4)

null <- 1 <- 2 <- 3    4 -> null
                  ↑    ↑
                  prev curr

步骤5: 最后一次迭代
1. next = curr.next (保存null)
2. curr.next = prev (4指向3)
3. prev = curr (prev移到4)
4. curr = next (curr移到null)

null <- 1 <- 2 <- 3 <- 4    null
                       ↑     ↑
                       prev  curr

最终结果:
4 -> 3 -> 2 -> 1 -> null
↑
prev (新的头节点)