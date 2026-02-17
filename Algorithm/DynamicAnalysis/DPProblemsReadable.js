
/**
 * 动态规划 - 轻量级语义化实现 (Lightweight Semantic DP)
 * 
 * 核心理念：
 * 1. 放弃通用的 "Engine" 抽象，回归原生循环。
 * 2. 通过由内而外的 "语义变量" 和 "辅助函数"，将数学公式翻译成人话。
 * 3. 强调代码的 "可读性" 和 "自解释性"，而非简单的代码复用。
 */

/**
 * 4. 0-1背包问题 (Knapsack)
 * 语义化重点：将 dp[i-1][w] 等晦涩的数组访问，赋予 "skipItem", "takeItem" 等业务含义。
 */
export function knapsackReadable(weights, values, capacity) {
    const n = weights.length;
    // 使用 padding，dp[i][w] 对应前 i 个物品
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const itemWeight = weights[i - 1];
        const itemValue = values[i - 1];

        for (let currentCapacity = 1; currentCapacity <= capacity; currentCapacity++) {
            // 语义化变量：不选当前物品的最大价值 (继承上一行的结果)
            const valueIfSkip = dp[i - 1][currentCapacity];

            // 判断能否装下
            const canFit = itemWeight <= currentCapacity;

            if (canFit) {
                // 语义化变量：选当前物品的最大价值 = (容量减去当前物品重量时的最优解) + 当前物品价值
                const remainingCapacity = currentCapacity - itemWeight;
                const valueOfRemaining = dp[i - 1][remainingCapacity];
                const valueIfTake = valueOfRemaining + itemValue;

                // 决策：在“选”与“不选”中取最大
                dp[i][currentCapacity] = Math.max(valueIfSkip, valueIfTake);
            } else {
                // 装不下，只能不选
                dp[i][currentCapacity] = valueIfSkip;
            }
        }
    }

    return dp[n][capacity];
}

/**
 * 5. 最长公共子序列 (LCS)
 * 语义化重点：将字符比较和状态转移描述为 "Match" 和 "Inherit" 的过程。
 */
export function longestCommonSubsequenceReadable(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        // 为了方便理解，直接取当前字符 (注意 dp 索引是 i, 字符索引是 i-1)
        const char1 = text1[i - 1];

        for (let j = 1; j <= n; j++) {
            const char2 = text2[j - 1];

            const isMatch = char1 === char2;

            if (isMatch) {
                // 如果匹配：在去掉这两个字符的基础上 + 1 (即左上角的值 + 1)
                const lengthWithoutTheseTwo = dp[i - 1][j - 1];
                dp[i][j] = lengthWithoutTheseTwo + 1;
            } else {
                // 如果不匹配：继承“左边”或“上边”的最好结果
                // 意思是：我们要么忽略 text1 的当前字符，要么忽略 text2 的当前字符
                const lengthIfSkipChar1 = dp[i - 1][j];
                const lengthIfSkipChar2 = dp[i][j - 1];
                dp[i][j] = Math.max(lengthIfSkipChar1, lengthIfSkipChar2);
            }
        }
    }

    return dp[m][n];
}

/**
 * 6. 编辑距离 (Edit Distance)
 * 语义化重点：明确 Delete, Insert, Replace 三种操作的代价。
 */
export function minDistanceReadable(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // 初始化边界条件：空字符串转换的代价
    for (let i = 0; i <= m; i++) dp[i][0] = i; // 删除所有字符
    for (let j = 0; j <= n; j++) dp[0][j] = j; // 插入所有字符

    for (let i = 1; i <= m; i++) {
        const char1 = word1[i - 1];
        for (let j = 1; j <= n; j++) {
            const char2 = word2[j - 1];

            if (char1 === char2) {
                // 字符相同，无需操作，直接继承左上角状态
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // 字符不同，尝试三种操作，取最小值
                const operations = [
                    dp[i - 1][j] + 1,    // 删除 (Delete) char1
                    dp[i][j - 1] + 1,    // 插入 (Insert) char2
                    dp[i - 1][j - 1] + 1   // 替换 (Replace) char1 -> char2
                ];
                dp[i][j] = Math.min(...operations);
            }
        }
    }

    return dp[m][n];
}

/**
 * 3. 最长递增子序列 (LIS)
 * 语义化重点：将内部循环描述为“寻找可连接的前驱”。
 */
export function lengthOfLISReadable(nums) {
    if (nums.length === 0) return 0;

    const n = nums.length;
    // implicit semantics: min length for each element is 1 (self)
    const lengths = new Array(n).fill(1);

    for (let current = 1; current < n; current++) {
        const currentNum = nums[current];

        // 检查所有之前的位置
        for (let prev = 0; prev < current; prev++) {
            const prevNum = nums[prev];

            // 核心逻辑：只有当前数字比前面的大，才能接在后面
            const canExtend = prevNum < currentNum;

            if (canExtend) {
                // 如果能接在 prev 后面，尝试更新最大长度
                const potentialNewLength = lengths[prev] + 1;
                lengths[current] = Math.max(lengths[current], potentialNewLength);
            }
        }
    }

    return Math.max(...lengths);
}
