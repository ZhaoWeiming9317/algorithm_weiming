/**
 * 外星人字典 (Alien Dictionary)
 * LeetCode 269 (Premium)
 * 
 * 题目描述：
 * 现有一种使用英语字母的外星文字，这种文字的字母顺序与英语顺序不同。
 * 给你一个字符串列表 words ，作为这种外星文字的字典，words 中的字符串已经按这门语言的字母顺序进行了排序。
 * 请你根据该词典归纳出这门语言中字母的顺序，并以字符串形式返回。
 * 
 * 如果不存在合法字母顺序，返回 "" 。
 * 如果存在多种可能的合法字母顺序，返回其中任意一种顺序即可。
 * 
 * 示例：
 * 输入：words = ["wrt","wrf","er","ett","rftt"]
 * 输出："wertf"
 * 解释：从给定的单词可以推断出字母的顺序。
 * 
 * 输入：words = ["z","x"]
 * 输出："zx"
 * 
 * 输入：words = ["z","x","z"]
 * 输出：""
 * 解释：不存在合法顺序，因为 'z' > 'x'，但第三个单词又表明 'z' < 'x'。
 */

/**
 * 方法1：BFS + 拓扑排序
 * 时间复杂度：O(C) 其中 C 是所有单词中字符的总数
 * 空间复杂度：O(1) 最多26个字母
 */
export function alienOrder(words) {
    // 边界情况检查
    if (!words || words.length === 0) return "";
    if (words.length === 1) return words[0].split('').filter((char, index, arr) => arr.indexOf(char) === index).join('');
    
    // 构建图和入度表
    const graph = new Map();
    const inDegree = new Map();
    
    // 初始化：收集所有出现的字符
    for (const word of words) {
        for (const char of word) {
            if (!graph.has(char)) {
                graph.set(char, new Set());
                inDegree.set(char, 0);
            }
        }
    }
    
    // 构建有向图：比较相邻的单词
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        // 检查是否存在无效情况：较长的单词是较短单词的前缀
        if (word1.length > word2.length && word1.startsWith(word2)) {
            return ""; // 无效顺序
        }
        
        // 找到第一个不同的字符
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            const char1 = word1[j];
            const char2 = word2[j];
            
            if (char1 !== char2) {
                // char1 应该在 char2 之前
                if (!graph.get(char1).has(char2)) {
                    graph.get(char1).add(char2);
                    inDegree.set(char2, inDegree.get(char2) + 1);
                }
                break; // 只需要第一个不同的字符
            }
        }
    }
    
    // 拓扑排序 - BFS
    const queue = [];
    for (const [char, degree] of inDegree) {
        if (degree === 0) {
            queue.push(char);
        }
    }
    
    const result = [];
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);
        
        // 处理当前字符的后续字符
        for (const nextChar of graph.get(current)) {
            inDegree.set(nextChar, inDegree.get(nextChar) - 1);
            if (inDegree.get(nextChar) === 0) {
                queue.push(nextChar);
            }
        }
    }
    
    // 检查是否存在环（即是否所有字符都被处理了）
    return result.length === inDegree.size ? result.join('') : "";
}

/**
 * 方法2：DFS + 拓扑排序
 * 时间复杂度：O(C)
 * 空间复杂度：O(1)
 */
export function alienOrderDFS(words) {
    if (!words || words.length === 0) return "";
    if (words.length === 1) return words[0].split('').filter((char, index, arr) => arr.indexOf(char) === index).join('');
    
    // 构建图
    const graph = new Map();
    const colors = new Map(); // 0: 未访问, 1: 正在访问, 2: 已完成
    
    // 初始化
    for (const word of words) {
        for (const char of word) {
            if (!graph.has(char)) {
                graph.set(char, new Set());
                colors.set(char, 0);
            }
        }
    }
    
    // 构建有向图
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        // 检查无效情况
        if (word1.length > word2.length && word1.startsWith(word2)) {
            return "";
        }
        
        // 找到第一个不同的字符
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            const char1 = word1[j];
            const char2 = word2[j];
            
            if (char1 !== char2) {
                graph.get(char1).add(char2);
                break;
            }
        }
    }
    
    const result = [];
    let hasCycle = false;
    
    function dfs(node) {
        if (colors.get(node) === 1) {
            hasCycle = true;
            return;
        }
        if (colors.get(node) === 2) {
            return;
        }
        
        colors.set(node, 1); // 标记为正在访问
        
        for (const neighbor of graph.get(node)) {
            if (hasCycle) return;
            dfs(neighbor);
        }
        
        colors.set(node, 2); // 标记为已完成
        result.push(node); // 后序遍历
    }
    
    // 对所有未访问的节点进行DFS
    for (const char of colors.keys()) {
        if (colors.get(char) === 0) {
            dfs(char);
            if (hasCycle) {
                return "";
            }
        }
    }
    
    return result.reverse().join('');
}

/**
 * 辅助函数：验证字典顺序是否正确
 */
function validateAlienDictionary(words, order) {
    const charOrder = new Map();
    for (let i = 0; i < order.length; i++) {
        charOrder.set(order[i], i);
    }
    
    function compare(word1, word2) {
        const minLen = Math.min(word1.length, word2.length);
        for (let i = 0; i < minLen; i++) {
            const order1 = charOrder.get(word1[i]);
            const order2 = charOrder.get(word2[i]);
            if (order1 < order2) return -1;
            if (order1 > order2) return 1;
        }
        return word1.length - word2.length;
    }
    
    for (let i = 0; i < words.length - 1; i++) {
        if (compare(words[i], words[i + 1]) > 0) {
            return false;
        }
    }
    return true;
}

// 测试用例
const testCases = [
    {
        words: ["wrt", "wrf", "er", "ett", "rftt"],
        description: "标准外星字典",
        expectedPattern: /^[wertf]+$/
    },
    {
        words: ["z", "x"],
        description: "简单两字符顺序",
        expectedPattern: /^zx$/
    },
    {
        words: ["z", "x", "z"],
        description: "矛盾的顺序（应返回空字符串）",
        expectedPattern: /^$/
    },
    {
        words: ["abc", "ab"],
        description: "无效顺序：长单词是短单词前缀",
        expectedPattern: /^$/
    },
    {
        words: ["a", "b", "ca", "cc"],
        description: "复杂依赖关系",
        expectedPattern: /^[abc]+$/
    },
    {
        words: ["zy", "zx"],
        description: "相同前缀的比较",
        expectedPattern: /^z[yx]$/
    },
    {
        words: ["ac", "ab", "zc", "zb"],
        description: "多个独立的比较",
        expectedPattern: /^[acbz]+$/
    }
];

console.log('=== 外星人字典问题测试 ===');
testCases.forEach((testCase, index) => {
    const { words, description, expectedPattern } = testCase;
    
    console.log(`测试用例 ${index + 1}: ${description}`);
    console.log(`输入单词: [${words.map(w => `"${w}"`).join(', ')}]`);
    
    const result1 = alienOrder(words);
    const result2 = alienOrderDFS(words);
    
    console.log(`BFS结果: "${result1}"`);
    console.log(`DFS结果: "${result2}"`);
    
    // 验证结果
    const isValid1 = expectedPattern.test(result1) && (result1 === "" || validateAlienDictionary(words, result1));
    const isValid2 = expectedPattern.test(result2) && (result2 === "" || validateAlienDictionary(words, result2));
    
    console.log(`BFS验证: ${isValid1 ? '✓' : '✗'}`);
    console.log(`DFS验证: ${isValid2 ? '✓' : '✗'}`);
    console.log('---');
});
