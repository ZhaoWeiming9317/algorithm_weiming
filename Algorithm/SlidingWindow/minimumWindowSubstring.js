/**
 * 76. 最小覆盖子串 (Minimum Window Substring)
 * 
 * 题目：给你一个字符串 s 和一个字符串 t，返回 s 中涵盖 t 所有字符的最小子串。
 * 如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 ""。
 * 
 * 示例：
 * 输入：s = "ADOBECODEBANC", t = "ABC"
 * 输出："BANC"
 * 
 * 时间复杂度：O(|s| + |t|)
 * 空间复杂度：O(|s| + |t|)
 */

// 滑动窗口解法
function minWindow(s, t) {
  if (!s || !t || s.length < t.length) return "";
  
  // 统计 t 中每个字符的出现次数
  const need = {};
  for (const char of t) {
    need[char] = (need[char] || 0) + 1;
  }
  
  let left = 0;
  let right = 0;
  let valid = 0; // 窗口中满足条件的字符种类数
  let start = 0;
  let len = Infinity;
  
  // 窗口中的字符计数
  const window = {};
  
  while (right < s.length) {
    // 扩大窗口
    const c = s[right];
    right++;
    
    // 如果当前字符在 t 中
    if (need[c]) {
      window[c] = (window[c] || 0) + 1;
      if (window[c] === need[c]) {
        valid++;
      }
    }
    
    // 收缩窗口
    while (valid === Object.keys(need).length) {
      // 更新最小覆盖子串
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      
      // 移除左边字符
      const d = s[left];
      left++;
      
      if (need[d]) {
        if (window[d] === need[d]) {
          valid--;
        }
        window[d]--;
      }
    }
  }
  
  return len === Infinity ? "" : s.substring(start, start + len);
}

// 优化版本：使用 Map
function minWindowOptimized(s, t) {
  if (!s || !t || s.length < t.length) return "";
  
  const need = new Map();
  for (const char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }
  
  let left = 0;
  let right = 0;
  let valid = 0;
  let start = 0;
  let len = Infinity;
  
  const window = new Map();
  
  while (right < s.length) {
    const c = s[right];
    right++;
    
    if (need.has(c)) {
      window.set(c, (window.get(c) || 0) + 1);
      if (window.get(c) === need.get(c)) {
        valid++;
      }
    }
    
    while (valid === need.size) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }
      
      const d = s[left];
      left++;
      
      if (need.has(d)) {
        if (window.get(d) === need.get(d)) {
          valid--;
        }
        window.set(d, window.get(d) - 1);
      }
    }
  }
  
  return len === Infinity ? "" : s.substring(start, start + len);
}

// 辅助函数：检查是否包含所有字符
function isValid(window, need) {
  for (const char in need) {
    if ((window[char] || 0) < need[char]) {
      return false;
    }
  }
  return true;
}

// 测试用例
console.log('=== 最小覆盖子串测试 ===');

const s1 = "ADOBECODEBANC";
const t1 = "ABC";
console.log('输入:', `s="${s1}", t="${t1}"`);
console.log('输出:', minWindow(s1, t1)); // "BANC"

const s2 = "a";
const t2 = "a";
console.log('输入:', `s="${s2}", t="${t2}"`);
console.log('输出:', minWindow(s2, t2)); // "a"

const s3 = "a";
const t3 = "aa";
console.log('输入:', `s="${s3}", t="${t3}"`);
console.log('输出:', minWindow(s3, t3)); // ""

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空字符串:', minWindow("", "abc")); // ""
console.log('无解情况:', minWindow("xyz", "abc")); // ""

module.exports = { minWindow, minWindowOptimized };
