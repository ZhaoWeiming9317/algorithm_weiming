/**
 * 3. 无重复字符的最长子串 (Longest Substring Without Repeating Characters)
 * 
 * 题目：给定一个字符串 s，请你找出其中不含有重复字符的最长子串的长度。
 * 
 * 示例：
 * 输入：s = "abcabcbb"
 * 输出：3
 * 解释：因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(min(m,n))，m为字符集大小
 */

// 滑动窗口解法
function lengthOfLongestSubstring(s) {
  if (!s) return 0;
  
  let left = 0;
  let right = 0;
  let maxLen = 0;
  const window = new Set();
  
  while (right < s.length) {
    // 扩大窗口
    const c = s[right];
    
    // 如果字符重复，收缩窗口
    while (window.has(c)) {
      window.delete(s[left]);
      left++;
    }
    
    window.add(c);
    maxLen = Math.max(maxLen, right - left + 1);
    right++;
  }
  
  return maxLen;
}

// 优化版本：使用 Map 存储字符位置
function lengthOfLongestSubstringOptimized(s) {
  if (!s) return 0;
  
  const charIndex = new Map();
  let left = 0;
  let maxLen = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    
    // 如果字符重复，更新左指针
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1;
    }
    
    charIndex.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}

// 返回最长子串本身
function longestSubstringWithoutRepeating(s) {
  if (!s) return "";
  
  let left = 0;
  let right = 0;
  let maxLen = 0;
  let start = 0;
  const window = new Set();
  
  while (right < s.length) {
    const c = s[right];
    
    while (window.has(c)) {
      window.delete(s[left]);
      left++;
    }
    
    window.add(c);
    
    if (right - left + 1 > maxLen) {
      maxLen = right - left + 1;
      start = left;
    }
    
    right++;
  }
  
  return s.substring(start, start + maxLen);
}

// 测试用例
console.log('=== 无重复字符的最长子串测试 ===');

const s1 = "abcabcbb";
console.log('输入:', s1);
console.log('长度:', lengthOfLongestSubstring(s1)); // 3
console.log('子串:', longestSubstringWithoutRepeating(s1)); // "abc"

const s2 = "bbbbb";
console.log('输入:', s2);
console.log('长度:', lengthOfLongestSubstring(s2)); // 1
console.log('子串:', longestSubstringWithoutRepeating(s2)); // "b"

const s3 = "pwwkew";
console.log('输入:', s3);
console.log('长度:', lengthOfLongestSubstring(s3)); // 3
console.log('子串:', longestSubstringWithoutRepeating(s3)); // "wke"

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空字符串:', lengthOfLongestSubstring("")); // 0
console.log('单字符:', lengthOfLongestSubstring("a")); // 1
console.log('优化版本:', lengthOfLongestSubstringOptimized("abcabcbb")); // 3

module.exports = { 
  lengthOfLongestSubstring, 
  lengthOfLongestSubstringOptimized,
  longestSubstringWithoutRepeating 
};
