# 子串 vs 子序列：关键区别详解

## 1. 基本定义

### 子串 (Substring)
- **定义**：字符串中**连续**的字符序列
- **特点**：必须保持字符的原始顺序和连续性
- **例子**：字符串 "abcde" 的子串有 "abc", "bcd", "cde" 等

### 子序列 (Subsequence)  
- **定义**：字符串中**不一定连续**的字符序列
- **特点**：保持字符的原始顺序，但可以不连续
- **例子**：字符串 "abcde" 的子序列有 "ace", "bd", "abc" 等

## 2. 直观对比

```javascript
const str = "abcde";

// 子串（连续）
"abc", "bcd", "cde", "a", "ab", "abc", "abcd", "abcde"

// 子序列（不连续）
"ace", "bd", "ad", "be", "ac", "ae", "bc", "bd", "be", "cd", "ce", "de"
```

## 3. 算法应用对比

### 3.1 最长无重复子串（滑动窗口）
```javascript
// 问题：找最长无重复字符的连续子串
function lengthOfLongestSubstring(s) {
  // 使用滑动窗口，因为子串必须连续
  let left = 0, maxLen = 0;
  const window = new Set();
  
  for (let right = 0; right < s.length; right++) {
    while (window.has(s[right])) {
      window.delete(s[left++]); // 移除左边字符
    }
    window.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// 例子：s = "abcabcbb"
// 最长无重复子串："abc" (长度3)
// 滑动窗口：[a,b,c] → [b,c,a] → [c,a,b] → [a,b,c] → [b] → [b]
```

### 3.2 最长递增子序列（动态规划）
```javascript
// 问题：找最长递增的子序列
function lengthOfLIS(nums) {
  // 使用动态规划，因为子序列可以不连续
  const dp = new Array(nums.length).fill(1);
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}

// 例子：nums = [10,9,2,5,3,7,101,18]
// 最长递增子序列：[2,3,7,18] (长度4)
// 注意：2,5,3,7 不是连续的，但保持递增顺序
```

## 4. 关键区别总结

| 特性 | 子串 (Substring) | 子序列 (Subsequence) |
|------|------------------|----------------------|
| **连续性** | 必须连续 | 可以不连续 |
| **算法选择** | 滑动窗口 | 动态规划 |
| **时间复杂度** | O(n) | O(n²) 或 O(n log n) |
| **空间复杂度** | O(k) | O(n) |
| **状态维护** | 实时维护窗口 | 记录历史状态 |

## 5. 算法选择的原因

### 5.1 为什么子串用滑动窗口？
```javascript
// 子串的连续性特点
"abcabcbb" → 找最长无重复子串

// 滑动窗口的优势：
// 1. 利用连续性：窗口内的字符都是连续的
// 2. 实时维护：可以实时添加/删除字符
// 3. 高效查找：O(n) 时间复杂度
```

### 5.2 为什么子序列用动态规划？
```javascript
// 子序列的非连续性特点
[10,9,2,5,3,7,101,18] → 找最长递增子序列

// 动态规划的优势：
// 1. 处理非连续性：需要比较所有可能的前置状态
// 2. 最优子结构：dp[i] 依赖于 dp[0] 到 dp[i-1]
// 3. 状态转移：dp[i] = max(dp[j] + 1) for j < i
```

## 6. 实际例子对比

### 6.1 最长无重复子串
```javascript
const s = "pwwkew";
// 子串：p, w, w, k, e, w, pw, ww, wk, ke, ew, pww, wwk, wke, kew, ...
// 最长无重复子串："wke" 或 "kew" (长度3)

function longestSubstring(s) {
  // 滑动窗口解法
  let left = 0, maxLen = 0;
  const window = new Set();
  
  for (let right = 0; right < s.length; right++) {
    while (window.has(s[right])) {
      window.delete(s[left++]);
    }
    window.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

### 6.2 最长递增子序列
```javascript
const nums = [10,9,2,5,3,7,101,18];
// 子序列：10, 9, 2, 5, 3, 7, 101, 18, 10,9, 10,2, 2,5, 2,3, 2,7, ...
// 最长递增子序列：[2,3,7,18] (长度4)

function longestIncreasingSubsequence(nums) {
  // 动态规划解法
  const dp = new Array(nums.length).fill(1);
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  
  return Math.max(...dp);
}
```

## 7. 记忆技巧

### 7.1 关键词识别
```javascript
// 看到这些词 → 子串问题
"连续子串", "最长子串", "无重复子串"

// 看到这些词 → 子序列问题  
"最长子序列", "递增子序列", "公共子序列"
```

### 7.2 算法选择
```javascript
if (问题涉及连续字符/元素) {
  return "滑动窗口";
} else if (问题涉及非连续但保持顺序) {
  return "动态规划";
}
```

## 8. 面试要点

1. **明确概念**：子串连续，子序列不连续
2. **算法选择**：连续用滑动窗口，非连续用动态规划
3. **时间复杂度**：滑动窗口 O(n)，动态规划 O(n²)
4. **实际应用**：文本处理用子串，数据分析用子序列

**核心记忆：连续子串用滑动窗口，非连续子序列用动态规划！**
