# 字符串分割问题 (String Partition)

## 概述

字符串分割问题是回溯算法在字符串处理中的重要应用。这类问题通常涉及将字符串按照某种规则分割成若干子串，每个子串都需要满足特定的条件。

## 核心特点

- **分割点选择**：需要确定在哪些位置进行分割
- **子串验证**：每个分割出的子串都需要满足条件
- **全局优化**：寻找满足条件的分割方案或最优分割方案
- **动态规划结合**：常与动态规划结合进行优化

## 基本框架

```javascript
function partitionString(s, condition) {
    const result = [];
    const path = [];
    
    function isValid(substring) {
        // 检查子串是否满足条件
        return condition(substring);
    }
    
    function backtrack(start) {
        // 终止条件：处理完整个字符串
        if (start === s.length) {
            result.push([...path]);
            return;
        }
        
        // 尝试所有可能的分割点
        for (let end = start; end < s.length; end++) {
            const substring = s.substring(start, end + 1);
            
            if (isValid(substring)) {
                // 做选择
                path.push(substring);
                
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
```

## 问题分类

### 1. 回文串分割 (Palindrome Partitioning)

**问题描述**：将字符串分割成若干回文子串。

**解题要点**：
- 判断子串是否为回文
- 尝试所有可能的分割点
- 预处理优化回文判断

```javascript
function partition(s) {
    const result = [];
    const path = [];
    
    function isPalindrome(str, left, right) {
        while (left < right) {
            if (str[left] !== str[right]) return false;
            left++;
            right--;
        }
        return true;
    }
    
    function backtrack(start) {
        if (start === s.length) {
            result.push([...path]);
            return;
        }
        
        for (let end = start; end < s.length; end++) {
            if (isPalindrome(s, start, end)) {
                path.push(s.substring(start, end + 1));
                backtrack(end + 1);
                path.pop();
            }
        }
    }
    
    backtrack(0);
    return result;
}
```

### 2. 回文串分割 II (Palindrome Partitioning II)

**问题描述**：找到最少的分割次数，使得每个子串都是回文串。

**解题思路**：
- 动态规划预处理回文信息
- DP求解最少分割次数

```javascript
function minCut(s) {
    const n = s.length;
    
    // 预处理：判断所有子串是否为回文
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
        if (isPalin[0][i]) {
            dp[i] = 0;
        } else {
            for (let j = 0; j < i; j++) {
                if (isPalin[j + 1][i]) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                }
            }
        }
    }
    
    return dp[n - 1];
}
```

### 3. 复原IP地址 (Restore IP Addresses)

**问题描述**：将字符串分割成4个有效的IP地址段。

**解题要点**：
- 每段必须是0-255的数字
- 不能有前导零（除非是单独的0）
- 必须分割成恰好4段

```javascript
function restoreIpAddresses(s) {
    const result = [];
    const path = [];
    
    function isValidSegment(segment) {
        if (segment.length === 0 || segment.length > 3) return false;
        if (segment[0] === '0' && segment.length > 1) return false;
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }
    
    function backtrack(start, segments) {
        // 如果已经有4段且用完了所有字符
        if (segments === 4 && start === s.length) {
            result.push(path.join('.'));
            return;
        }
        
        // 如果段数超过4或字符用完但段数不足4
        if (segments >= 4 || start >= s.length) {
            return;
        }
        
        // 尝试1-3位数的段
        for (let len = 1; len <= 3 && start + len <= s.length; len++) {
            const segment = s.substring(start, start + len);
            
            if (isValidSegment(segment)) {
                path.push(segment);
                backtrack(start + len, segments + 1);
                path.pop();
            }
        }
    }
    
    backtrack(0, 0);
    return result;
}
```

### 4. 单词拆分 II (Word Break II)

**问题描述**：将字符串拆分成字典中的单词，返回所有可能的拆分方案。

**解题要点**：
- 检查子串是否在字典中
- 记忆化搜索优化
- 返回所有可能的句子

```javascript
function wordBreak(s, wordDict) {
    const wordSet = new Set(wordDict);
    const memo = new Map();
    
    function backtrack(start) {
        if (memo.has(start)) {
            return memo.get(start);
        }
        
        if (start === s.length) {
            return [[]];
        }
        
        const result = [];
        
        for (let end = start + 1; end <= s.length; end++) {
            const word = s.substring(start, end);
            
            if (wordSet.has(word)) {
                const suffixes = backtrack(end);
                for (let suffix of suffixes) {
                    result.push([word, ...suffix]);
                }
            }
        }
        
        memo.set(start, result);
        return result;
    }
    
    const sentences = backtrack(0);
    return sentences.map(words => words.join(' '));
}
```

## 优化策略

### 1. 预处理优化

```javascript
// 预处理回文信息
function preprocessPalindrome(s) {
    const n = s.length;
    const isPalin = Array(n).fill().map(() => Array(n).fill(false));
    
    // 单字符都是回文
    for (let i = 0; i < n; i++) {
        isPalin[i][i] = true;
    }
    
    // 两字符回文
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            isPalin[i][i + 1] = true;
        }
    }
    
    // 三字符及以上回文
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            if (s[i] === s[j] && isPalin[i + 1][j - 1]) {
                isPalin[i][j] = true;
            }
        }
    }
    
    return isPalin;
}
```

### 2. 记忆化搜索

```javascript
function wordBreakMemo(s, wordDict) {
    const wordSet = new Set(wordDict);
    const memo = new Map();
    
    function dfs(start) {
        if (memo.has(start)) return memo.get(start);
        
        if (start === s.length) return [[]];
        
        const result = [];
        for (let end = start + 1; end <= s.length; end++) {
            const word = s.substring(start, end);
            if (wordSet.has(word)) {
                const suffixes = dfs(end);
                for (let suffix of suffixes) {
                    result.push([word, ...suffix]);
                }
            }
        }
        
        memo.set(start, result);
        return result;
    }
    
    return dfs(0);
}
```

### 3. 剪枝优化

```javascript
// 提前判断剩余字符串是否可能形成有效分割
function canPartition(s, start, wordSet) {
    const dp = new Array(s.length - start + 1).fill(false);
    dp[0] = true;
    
    for (let i = 1; i <= s.length - start; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && wordSet.has(s.substring(start + j, start + i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.length - start];
}
```

## 问题列表

### 1. 回文串分割 (Palindrome Partitioning)
- **难度**：中等
- **特点**：基础分割问题

### 2. 回文串分割 II (Palindrome Partitioning II)
- **难度**：困难
- **特点**：最优化问题，DP优化

### 3. 回文串分割 III (Palindrome Partitioning III)
- **难度**：困难
- **特点**：允许修改字符

### 4. 复原IP地址 (Restore IP Addresses)
- **难度**：中等
- **特点**：固定分割数量

### 5. 单词拆分 II (Word Break II)
- **难度**：困难
- **特点**：字典匹配分割

## 时间复杂度

| 问题类型 | 时间复杂度 | 空间复杂度 | 优化后 |
|----------|------------|------------|--------|
| 回文分割 | O(2^n × n) | O(n) | O(n^2) 预处理 |
| 最少分割 | O(n^3) | O(n^2) | O(n^2) DP |
| IP地址 | O(3^4) | O(1) | 常数级 |
| 单词拆分 | O(2^n) | O(n) | 记忆化优化 |

## 应用场景

1. **文本处理**：
   - 句子分割
   - 词汇分析
   - 语法解析

2. **数据验证**：
   - 格式验证
   - 规则匹配
   - 输入校验

3. **编译器设计**：
   - 词法分析
   - 语法分析
   - 代码解析

4. **生物信息学**：
   - DNA序列分析
   - 蛋白质结构预测
   - 基因组注释

## 调试技巧

1. **分步验证**：逐步检查每个子串的有效性
2. **边界测试**：测试空串、单字符等边界情况
3. **性能分析**：统计递归调用次数和剪枝效果
4. **可视化**：打印分割过程和中间结果

掌握字符串分割问题的解法，能够处理各种文本处理和格式验证任务！
