/**
 * 课程表 II (Course Schedule II)
 * LeetCode 210
 * 
 * 题目描述：
 * 现在你总共有 numCourses 门课需要选，记为 0 到 numCourses - 1。
 * 给你一个数组 prerequisites ，其中 prerequisites[i] = [ai, bi] ，
 * 表示在选修课程 ai 前 必须 先选修 bi 。
 * 
 * 例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示：[0,1] 。
 * 返回你为了学完所有课程所安排的学习顺序。可能会有多个正确的顺序，
 * 你只要返回 任意一种 就可以了。如果不可能完成所有课程，返回 一个空数组 。
 * 
 * 示例：
 * 输入：numCourses = 2, prerequisites = [[1,0]]
 * 输出：[0,1]
 * 解释：总共有 2 门课程。要学习课程 1，你需要先完成课程 0。因此，正确的课程顺序为 [0,1] 。
 * 
 * 输入：numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
 * 输出：[0,2,1,3]
 * 解释：总共有 4 门课程。要学习课程 3，你应该先完成课程 1 和课程 2。
 * 并且课程 1 和课程 2 都应该排在课程 0 之后。
 * 因此，一个正确的课程顺序是 [0,1,2,3] 。另一个正确的排序是 [0,2,1,3] 。
 */

/**
 * 方法1：BFS + 入度表（Kahn算法）
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V + E)
 */
export function findOrder(numCourses, prerequisites) {
    // 构建邻接表和入度表
    const graph = Array.from({ length: numCourses }, () => []);
    const inDegree = new Array(numCourses).fill(0);
    
    // 构建图
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    // 将所有入度为0的节点加入队列
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result = [];
    
    // BFS处理
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        
        // 处理当前课程的后续课程
        for (const nextCourse of graph[current]) {
            inDegree[nextCourse]--;
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    // 如果结果数组长度等于总课程数，说明没有环，返回结果；否则返回空数组
    return result.length === numCourses ? result : [];
}

/**
 * 方法2：DFS + 后序遍历
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V + E)
 */
export function findOrderDFS(numCourses, prerequisites) {
    // 构建邻接表
    const graph = Array.from({ length: numCourses }, () => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    // 0: 未访问, 1: 正在访问, 2: 已完成访问
    const colors = new Array(numCourses).fill(0);
    const result = [];
    let hasCycle = false;
    
    function dfs(node) {
        if (colors[node] === 1) {
            // 发现环
            hasCycle = true;
            return;
        }
        if (colors[node] === 2) {
            // 已经访问过，无需重复访问
            return;
        }
        
        // 标记为正在访问
        colors[node] = 1;
        
        // 访问所有邻居
        for (const neighbor of graph[node]) {
            if (hasCycle) return;
            dfs(neighbor);
        }
        
        // 标记为已完成访问
        colors[node] = 2;
        // 后序遍历：在完成所有依赖后，将当前节点加入结果
        result.push(node);
    }
    
    // 对每个未访问的节点进行DFS
    for (let i = 0; i < numCourses; i++) {
        if (colors[i] === 0) {
            dfs(i);
            if (hasCycle) {
                return [];
            }
        }
    }
    
    // 由于是后序遍历，需要反转结果
    return result.reverse();
}

/**
 * 方法3：优化的DFS（直接构建正确顺序）
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V + E)
 */
export function findOrderDFSOptimized(numCourses, prerequisites) {
    // 构建反向图（从依赖指向被依赖）
    const graph = Array.from({ length: numCourses }, () => []);
    for (const [course, prereq] of prerequisites) {
        graph[course].push(prereq);
    }
    
    // 0: 未访问, 1: 正在访问, 2: 已完成访问
    const colors = new Array(numCourses).fill(0);
    const result = [];
    let hasCycle = false;
    
    function dfs(node) {
        if (colors[node] === 1) {
            // 发现环
            hasCycle = true;
            return;
        }
        if (colors[node] === 2) {
            // 已经访问过，无需重复访问
            return;
        }
        
        // 标记为正在访问
        colors[node] = 1;
        
        // 先访问所有依赖
        for (const prereq of graph[node]) {
            if (hasCycle) return;
            dfs(prereq);
        }
        
        // 标记为已完成访问
        colors[node] = 2;
        // 在完成所有依赖后，将当前节点加入结果
        result.push(node);
    }
    
    // 对每个未访问的节点进行DFS
    for (let i = 0; i < numCourses; i++) {
        if (colors[i] === 0) {
            dfs(i);
            if (hasCycle) {
                return [];
            }
        }
    }
    
    return result;
}

// 测试用例
const testCases = [
    {
        numCourses: 2,
        prerequisites: [[1, 0]],
        description: "简单的线性依赖"
    },
    {
        numCourses: 4,
        prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]],
        description: "复杂依赖关系"
    },
    {
        numCourses: 2,
        prerequisites: [[1, 0], [0, 1]],
        description: "存在环的情况"
    },
    {
        numCourses: 1,
        prerequisites: [],
        description: "单个课程，无依赖"
    },
    {
        numCourses: 3,
        prerequisites: [[0, 1], [0, 2], [1, 2]],
        description: "多层依赖"
    }
];

console.log('=== 课程表 II 问题测试 ===');
testCases.forEach((testCase, index) => {
    const { numCourses, prerequisites, description } = testCase;
    
    console.log(`测试用例 ${index + 1}: ${description}`);
    console.log(`课程数: ${numCourses}`);
    console.log(`先修课程: ${JSON.stringify(prerequisites)}`);
    
    const result1 = findOrder(numCourses, prerequisites);
    const result2 = findOrderDFS(numCourses, prerequisites);
    const result3 = findOrderDFSOptimized(numCourses, prerequisites);
    
    console.log(`BFS结果: [${result1.join(',')}]`);
    console.log(`DFS结果: [${result2.join(',')}]`);
    console.log(`优化DFS: [${result3.join(',')}]`);
    
    // 验证结果的正确性
    const isValid = validateOrder(numCourses, prerequisites, result1);
    console.log(`结果验证: ${isValid ? '✓ 有效' : '✗ 无效'}`);
    console.log('---');
});

/**
 * 验证拓扑排序结果的正确性
 */
function validateOrder(numCourses, prerequisites, order) {
    if (order.length === 0) {
        // 如果返回空数组，检查是否真的存在环
        return prerequisites.length === 0 || hasCycleCheck(numCourses, prerequisites);
    }
    
    if (order.length !== numCourses) {
        return false;
    }
    
    // 创建课程在排序中的位置映射
    const position = new Map();
    for (let i = 0; i < order.length; i++) {
        position.set(order[i], i);
    }
    
    // 检查所有先修关系是否满足
    for (const [course, prereq] of prerequisites) {
        if (position.get(prereq) >= position.get(course)) {
            return false;
        }
    }
    
    return true;
}

function hasCycleCheck(numCourses, prerequisites) {
    const graph = Array.from({ length: numCourses }, () => []);
    const inDegree = new Array(numCourses).fill(0);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    let processed = 0;
    while (queue.length > 0) {
        const current = queue.shift();
        processed++;
        
        for (const next of graph[current]) {
            inDegree[next]--;
            if (inDegree[next] === 0) {
                queue.push(next);
            }
        }
    }
    
    return processed !== numCourses; // 如果处理的节点数不等于总数，说明有环
}
