/**
 * 回文串分割问题 (Palindrome Partitioning)
 * 
 * 题目描述：
 * 给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是回文串。
 * 返回 s 所有可能的分割方案。
 * 
 * 回文串是正着读和反着读都一样的字符串。
 * 
 * 示例：
 * 输入：s = "aab"
 * 输出：[["a","a","b"],["aa","b"]]
 */

/**
 * 回文串分割 - 基础版本
 * @param {string} s
 * @return {string[][]}
 */
export function partition(s) {
    const result = [];
    const path = [];
    
    // 判断字符串是否为回文串
    function isPalindrome(str, left, right) {
        while (left < right) {
            if (str[left] !== str[right]) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    function backtrack(start) {
        // 终止条件：已经处理完整个字符串
        if (start === s.length) {
            result.push([...path]);
            return;
        }
        
        // 尝试所有可能的分割点
        for (let end = start; end < s.length; end++) {
            // 如果当前子串是回文串
            if (isPalindrome(s, start, end)) {
                // 做选择
                path.push(s.substring(start, end + 1));
                
                // 递归处理剩余部分
                backtrack(end + 1);
                
                // 撤销选择
                path.pop();
            }
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * 回文串分割 - 优化版本（预处理回文串）
 * @param {string} s
 * @return {string[][]}
 */
export function partitionOptimized(s) {
    const n = s.length;
    const result = [];
    const path = [];
    
    // 预处理：使用动态规划判断所有子串是否为回文串
    const dp = Array(n).fill().map(() => Array(n).fill(false));
    
    // 填充dp表
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j]) {
                if (j - i <= 2 || dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                }
            }
        }
    }
    
    function backtrack(start) {
        if (start === n) {
            result.push([...path]);
            return;
        }
        
        for (let end = start; end < n; end++) {
            if (dp[start][end]) {
                path.push(s.substring(start, end + 1));
                backtrack(end + 1);
                path.pop();
            }
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * 回文串分割 II
 * 
 * 题目描述：
 * 给你一个字符串 s，请你将 s 分割成一些子串，使每个子串都是回文串。
 * 返回符合要求的最少分割次数。
 * 
 * 示例：
 * 输入：s = "aab"
 * 输出：1
 * 解释：进行一次分割就可将 s 分割成 ["aa","b"] 这样两个回文子串。
 */

/**
 * 回文串分割 II - 动态规划
 * @param {string} s
 * @return {number}
 */
export function minCut(s) {
    const n = s.length;
    
    // 预处理：判断所有子串是否为回文串
    const isPalin = Array(n).fill().map(() => Array(n).fill(false));
    
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j]) {
                if (j - i <= 2 || isPalin[i + 1][j - 1]) {
                    isPalin[i][j] = true;
                }
            }
        }
    }
    
    // dp[i] 表示 s[0...i] 的最少分割次数
    const dp = new Array(n).fill(Infinity);
    
    for (let i = 0; i < n; i++) {
        // 如果 s[0...i] 本身就是回文串
        if (isPalin[0][i]) {
            dp[i] = 0;
        } else {
            // 尝试所有可能的分割点
            for (let j = 0; j < i; j++) {
                if (isPalin[j + 1][i]) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
    }
    
    return dp[n - 1];
}

/**
 * 回文串分割 III
 * 
 * 题目描述：
 * 给你一个由小写字母组成的字符串 s，和一个整数 k。
 * 请你按下述要求分割字符串：
 * - 首先，你可以将 s 中的部分字符修改为其他的小写英文字母。
 * - 接着，你需要把 s 分割成 k 个非空且不相交的子串，并且每个子串都是回文串。
 * 
 * 请返回以这种方式分割字符串所需修改的最少字符数。
 */

/**
 * 回文串分割 III
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
export function palindromePartition(s, k) {
    const n = s.length;
    
    // cost[i][j] 表示将 s[i...j] 变成回文串需要修改的字符数
    const cost = Array(n).fill().map(() => Array(n).fill(0));
    
    // 预处理：计算每个子串变成回文串的代价
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            let left = i, right = j;
            while (left < right) {
                if (s[left] !== s[right]) {
                    cost[i][j]++;
                }
                left++;
                right--;
            }
        }
    }
    
    // dp[i][j] 表示将 s[0...i] 分割成 j 个回文串的最小代价
    const dp = Array(n).fill().map(() => Array(k + 1).fill(Infinity));
    
    // 初始化：将 s[0...i] 分割成 1 个回文串的代价
    for (let i = 0; i < n; i++) {
        dp[i][1] = cost[0][i];
    }
    
    // 填充dp表
    for (let i = 1; i < n; i++) {
        for (let j = 2; j <= Math.min(i + 1, k); j++) {
            for (let prev = j - 2; prev < i; prev++) {
                dp[i][j] = Math.min(dp[i][j], dp[prev][j - 1] + cost[prev + 1][i]);
            }
        }
    }
    
    return dp[n - 1][k];
}

/**
 * 分割回文串 IV
 * 
 * 题目描述：
 * 给你一个字符串 s ，如果可以将它分割成三个非空回文子字符串，则返回 true ，否则返回 false 。
 * 当一个字符串正着读和反着读是一模一样的，就称其为回文字符串。
 */

/**
 * 分割回文串 IV
 * @param {string} s
 * @return {boolean}
 */
export function checkPartitioning(s) {
    const n = s.length;
    
    // 预处理：判断所有子串是否为回文串
    const isPalin = Array(n).fill().map(() => Array(n).fill(false));
    
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            if (s[i] === s[j]) {
                if (j - i <= 2 || isPalin[i + 1][j - 1]) {
                    isPalin[i][j] = true;
                }
            }
        }
    }
    
    // 尝试所有可能的分割点
    for (let i = 0; i < n - 2; i++) {
        for (let j = i + 1; j < n - 1; j++) {
            if (isPalin[0][i] && isPalin[i + 1][j] && isPalin[j + 1][n - 1]) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * 最长回文子序列
 * 
 * 题目描述：
 * 给你一个字符串 s ，找出其中最长的回文子序列，并返回该序列的长度。
 * 子序列定义为：不改变剩余字符顺序的情况下，删除某些字符或者不删除任何字符形成的一个序列。
 */

/**
 * 最长回文子序列
 * @param {string} s
 * @return {number}
 */
export function longestPalindromeSubseq(s) {
    const n = s.length;
    // dp[i][j] 表示 s[i...j] 中最长回文子序列的长度
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    
    // 单个字符都是长度为1的回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    
    // 按长度递增的顺序填充
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[0][n - 1];
}

/**
 * 构造回文串的最少插入次数
 * 
 * 题目描述：
 * 给你一个字符串 s ，每一次操作你都可以在字符串的任意位置插入任意字符。
 * 请你返回让 s 成为回文串的最少操作次数。
 */

/**
 * 构造回文串的最少插入次数
 * @param {string} s
 * @return {number}
 */
export function minInsertions(s) {
    const n = s.length;
    // dp[i][j] 表示使 s[i...j] 成为回文串需要插入的最少字符数
    const dp = Array(n).fill().map(() => Array(n).fill(0));
    
    // 按长度递增的顺序填充
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1];
            } else {
                dp[i][j] = Math.min(dp[i + 1][j], dp[i][j - 1]) + 1;
            }
        }
    }
    
    return dp[0][n - 1];
}

// 测试用例
console.log('=== 回文串分割测试 ===');

console.log('回文串分割 "aab":');
console.log('基础版本:', partition("aab"));
console.log('优化版本:', partitionOptimized("aab"));

console.log('\n回文串分割 "raceacar":');
console.log('结果:', partition("raceacar"));

console.log('\n=== 回文串分割 II 测试 ===');
console.log('"aab" 最少分割次数:', minCut("aab")); // 1
console.log('"abcba" 最少分割次数:', minCut("abcba")); // 0

console.log('\n=== 回文串分割 III 测试 ===');
console.log('s="abc", k=2 最少修改次数:', palindromePartition("abc", 2)); // 1
console.log('s="aabbc", k=3 最少修改次数:', palindromePartition("aabbc", 3)); // 0

console.log('\n=== 分割回文串 IV 测试 ===');
console.log('"abcbdd" 能否分割成3个回文串:', checkPartitioning("abcbdd")); // true
console.log('"bcbddxy" 能否分割成3个回文串:', checkPartitioning("bcbddxy")); // false

console.log('\n=== 最长回文子序列测试 ===');
console.log('"bbbab" 最长回文子序列长度:', longestPalindromeSubseq("bbbab")); // 4
console.log('"cbbd" 最长回文子序列长度:', longestPalindromeSubseq("cbbd")); // 2

console.log('\n=== 构造回文串最少插入次数测试 ===');
console.log('"zzazz" 最少插入次数:', minInsertions("zzazz")); // 0
console.log('"mbadm" 最少插入次数:', minInsertions("mbadm")); // 2
