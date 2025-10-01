/**
 * 课程表 (Course Schedule)
 * LeetCode 207
 * 
 * 题目描述：
 * 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
 * 在选修某些课程之前需要一些先修课程。先修课程按数组 prerequisites 给出，
 * 其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程 bi 。
 * 
 * 例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
 * 请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。
 * 
 * 示例：
 * 输入：numCourses = 2, prerequisites = [[1,0]]
 * 输出：true
 * 解释：总共有 2 门课程。学习课程 1 之前，你需要完成课程 0 。这是可能的。
 * 
 * 输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
 * 输出：false
 * 解释：总共有 2 门课程。学习课程 1 之前，你需要先完成课程 0 ；
 * 并且学习课程 0 之前，你还应先完成课程 1 。这是不可能的。
 */

/**
 * 方法1：BFS + 入度表（Kahn算法）
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V + E)
 */
export function canFinish(numCourses, prerequisites) {
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
    
    let processedCourses = 0;
    
    // BFS处理
    while (queue.length > 0) {
        const current = queue.shift();
        processedCourses++;
        
        // 处理当前课程的后续课程
        for (const nextCourse of graph[current]) {
            inDegree[nextCourse]--;
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }
    
    // 如果处理的课程数等于总课程数，说明没有环
    return processedCourses === numCourses;
}

/**
 * 方法2：DFS + 三色标记法
 * 时间复杂度：O(V + E)
 * 空间复杂度：O(V + E)
 */
export function canFinishDFS(numCourses, prerequisites) {
    // 构建邻接表
    const graph = Array.from({ length: numCourses }, () => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    // 0: 未访问, 1: 正在访问, 2: 已完成访问
    const colors = new Array(numCourses).fill(0);
    
    function dfs(node) {
        if (colors[node] === 1) {
            // 发现环
            return false;
        }
        if (colors[node] === 2) {
            // 已经访问过，无需重复访问
            return true;
        }
        
        // 标记为正在访问
        colors[node] = 1;
        
        // 访问所有邻居
        for (const neighbor of graph[node]) {
            if (!dfs(neighbor)) {
                return false;
            }
        }
        
        // 标记为已完成访问
        colors[node] = 2;
        return true;
    }
    
    // 对每个未访问的节点进行DFS
    for (let i = 0; i < numCourses; i++) {
        if (colors[i] === 0 && !dfs(i)) {
            return false;
        }
    }
    
    return true;
}

// 测试用例
const testCases = [
    {
        numCourses: 2,
        prerequisites: [[1, 0]],
        expected: true
    },
    {
        numCourses: 2,
        prerequisites: [[1, 0], [0, 1]],
        expected: false
    },
    {
        numCourses: 4,
        prerequisites: [[1, 0], [2, 1], [3, 2]],
        expected: true
    },
    {
        numCourses: 4,
        prerequisites: [[1, 0], [2, 1], [3, 2], [0, 3]],
        expected: false
    },
    {
        numCourses: 1,
        prerequisites: [],
        expected: true
    }
];

console.log('=== 课程表问题测试 ===');
testCases.forEach((testCase, index) => {
    const { numCourses, prerequisites, expected } = testCase;
    const result1 = canFinish(numCourses, prerequisites);
    const result2 = canFinishDFS(numCourses, prerequisites);
    
    console.log(`测试用例 ${index + 1}:`);
    console.log(`课程数: ${numCourses}`);
    console.log(`先修课程: ${JSON.stringify(prerequisites)}`);
    console.log(`BFS结果: ${result1} (期望: ${expected}) ${result1 === expected ? '✓' : '✗'}`);
    console.log(`DFS结果: ${result2} (期望: ${expected}) ${result2 === expected ? '✓' : '✗'}`);
    console.log('---');
});
