/**
 * 438. 找到字符串中所有字母异位词 (Find All Anagrams in a String)
 * 
 * 题目：给定两个字符串 s 和 p，找到 s 中所有 p 的字母异位词的子串，
 * 返回这些子串的起始索引。不考虑答案输出的顺序。
 * 
 * 示例：
 * 输入：s = "cbaebabacd", p = "abc"
 * 输出：[0,6]
 * 解释：起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
 *      起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
 * 
 * 时间复杂度：O(|s| + |p|)
 * 空间复杂度：O(|s| + |p|)
 */

// 滑动窗口解法
function findAnagrams(s, p) {
  if (!s || !p || s.length < p.length) return [];
  
  const result = [];
  const need = {};
  const window = {};
  
  // 统计 p 中每个字符的出现次数
  for (const char of p) {
    need[char] = (need[char] || 0) + 1;
  }
  
  let left = 0;
  let right = 0;
  let valid = 0; // 窗口中满足条件的字符种类数
  
  while (right < s.length) {
    // 扩大窗口
    const c = s[right];
    right++;
    
    // 如果当前字符在 p 中
    if (need[c]) {
      window[c] = (window[c] || 0) + 1;
      if (window[c] === need[c]) {
        valid++;
      }
    }
    
    // 当窗口大小等于 p 的长度时，检查是否为异位词
    while (right - left >= p.length) {
      // 如果所有字符都满足条件，说明是异位词
      if (valid === Object.keys(need).length) {
        result.push(left);
      }
      
      // 收缩窗口
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
  
  return result;
}

// 优化版本：使用数组计数（适用于小写字母）
function findAnagramsOptimized(s, p) {
  if (!s || !p || s.length < p.length) return [];
  
  const result = [];
  const need = new Array(26).fill(0);
  const window = new Array(26).fill(0);
  
  // 统计 p 中每个字符的出现次数
  for (const char of p) {
    need[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
  }
  
  let left = 0;
  let right = 0;
  let valid = 0;
  
  while (right < s.length) {
    const c = s[right].charCodeAt(0) - 'a'.charCodeAt(0);
    right++;
    
    if (need[c] > 0) {
      window[c]++;
      if (window[c] === need[c]) {
        valid++;
      }
    }
    
    while (right - left >= p.length) {
      if (valid === p.length) {
        result.push(left);
      }
      
      const d = s[left].charCodeAt(0) - 'a'.charCodeAt(0);
      left++;
      
      if (need[d] > 0) {
        if (window[d] === need[d]) {
          valid--;
        }
        window[d]--;
      }
    }
  }
  
  return result;
}

// 检查两个字符串是否为异位词
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  const count = new Array(26).fill(0);
  
  for (let i = 0; i < s.length; i++) {
    count[s[i].charCodeAt(0) - 'a'.charCodeAt(0)]++;
    count[t[i].charCodeAt(0) - 'a'.charCodeAt(0)]--;
  }
  
  return count.every(c => c === 0);
}

// 测试用例
console.log('=== 找到字符串中所有字母异位词测试 ===');

const s1 = "cbaebabacd";
const p1 = "abc";
console.log('输入:', `s="${s1}", p="${p1}"`);
console.log('输出:', findAnagrams(s1, p1)); // [0, 6]

const s2 = "abab";
const p2 = "ab";
console.log('输入:', `s="${s2}", p="${p2}"`);
console.log('输出:', findAnagrams(s2, p2)); // [0, 1, 2]

const s3 = "baa";
const p3 = "aa";
console.log('输入:', `s="${s3}", p="${p3}"`);
console.log('输出:', findAnagrams(s3, p3)); // [1]

// 边界测试
console.log('\n=== 边界测试 ===');
console.log('空字符串:', findAnagrams("", "abc")); // []
console.log('s长度小于p:', findAnagrams("ab", "abc")); // []
console.log('优化版本:', findAnagramsOptimized(s1, p1)); // [0, 6]

// 异位词检查测试
console.log('\n=== 异位词检查测试 ===');
console.log('isAnagram("anagram", "nagaram"):', isAnagram("anagram", "nagaram")); // true
console.log('isAnagram("rat", "car"):', isAnagram("rat", "car")); // false

module.exports = { 
  findAnagrams, 
  findAnagramsOptimized,
  isAnagram 
};
