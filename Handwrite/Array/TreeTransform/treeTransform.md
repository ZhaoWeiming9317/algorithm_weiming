# 树形结构转换算法

## 问题描述

将扁平的数组结构转换为树形结构，这是一个常见的前端数据处理需求。

### 输入格式
```javascript
const flatArray = [
    { parentId: -1, id: 1, name: 'node1' },
    { parentId: 1, id: 2, name: 'node2' },
    { parentId: 1, id: 3, name: 'node3' },
    { parentId: 2, id: 4, name: 'node4' }
];
```

### 输出格式
```javascript
[
    {
        "parentId": -1,
        "id": 1,
        "name": "node1",
        "children": [
            {
                "parentId": 1,
                "id": 2,
                "name": "node2",
                "children": [
                    {
                        "parentId": 2,
                        "id": 4,
                        "name": "node4",
                        "children": []
                    }
                ]
            },
            {
                "parentId": 1,
                "id": 3,
                "name": "node3",
                "children": []
            }
        ]
    }
]
```

## 实现方法

### 方法一：递归实现
- **时间复杂度**: O(n²)
- **空间复杂度**: O(n)
- **特点**: 思路简单，但效率较低，适合理解算法逻辑

```javascript
function arrayToTreeRecursive(flatArray, parentId = -1) {
    const result = [];
    for (const item of flatArray) {
        if (item.parentId === parentId) {
            const children = arrayToTreeRecursive(flatArray, item.id);
            result.push({
                ...item,
                children
            });
        }
    }
    return result;
}
```

### 方法二：Map优化实现 ⭐推荐
- **时间复杂度**: O(n)
- **空间复杂度**: O(n)
- **特点**: 性能最优，推荐在生产环境使用

```javascript
function arrayToTreeOptimized(flatArray, rootParentId = -1) {
    const nodeMap = new Map();
    
    // 初始化所有节点
    flatArray.forEach(item => {
        nodeMap.set(item.id, {
            ...item,
            children: []
        });
    });
    
    const result = [];
    
    // 构建父子关系
    flatArray.forEach(item => {
        const node = nodeMap.get(item.id);
        if (item.parentId === rootParentId) {
            result.push(node);
        } else {
            const parent = nodeMap.get(item.parentId);
            if (parent) {
                parent.children.push(node);
            }
        }
    });
    
    return result;
}
```

### 方法三：一次遍历实现
- **时间复杂度**: O(n)
- **空间复杂度**: O(n)
- **特点**: 只需要一次遍历，但需要数据按特定顺序排列

### 方法四：灵活实现
- **特点**: 支持多种根节点标识方式（null、undefined等）

## 使用示例

```javascript
import { arrayToTreeOptimized } from './treeTransform.js';

const flatArray = [
    { parentId: -1, id: 1, name: 'node1' },
    { parentId: 1, id: 2, name: 'node2' },
    { parentId: 1, id: 3, name: 'node3' },
    { parentId: 2, id: 4, name: 'node4' }
];

const tree = arrayToTreeOptimized(flatArray);
console.log(JSON.stringify(tree, null, 2));
```

## 边界情况处理

1. **空数组**: 返回空数组
2. **无根节点**: 返回空数组
3. **孤立节点**: 会显示警告，但不会中断执行
4. **循环引用**: 需要额外的检测机制

## 性能对比

| 方法 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|------------|------------|----------|
| 递归实现 | O(n²) | O(n) | 学习理解 |
| Map优化 | O(n) | O(n) | 生产环境 |
| 一次遍历 | O(n) | O(n) | 数据有序 |
| 灵活实现 | O(n) | O(n) | 特殊需求 |

## 面试要点

1. **算法复杂度分析**: 能够分析时间和空间复杂度
2. **多种实现方式**: 展示对不同解法的理解
3. **边界情况处理**: 考虑各种异常情况
4. **代码优化**: 从递归到迭代的优化思路
5. **实际应用**: 在前端开发中的使用场景

## 扩展功能

- 支持自定义字段名（不仅仅是parentId和id）
- 添加节点排序功能
- 支持树的扁平化（逆向操作）
- 添加节点过滤功能
- 支持多根节点的处理
