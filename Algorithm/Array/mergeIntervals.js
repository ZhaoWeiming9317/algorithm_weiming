/**
 * 56. 合并区间 (Merge Intervals)
 * 
 * 题目：以数组 intervals 表示若干个区间的集合，
 * 其中单个区间为 intervals[i] = [starti, endi]。
 * 请你合并所有重叠的区间，并返回一个不重叠的区间数组。
 * 
 * 示例：
 * 输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
 * 输出：[[1,6],[8,10],[15,18]]
 * 
 * 时间复杂度：O(n log n)
 * 空间复杂度：O(1)
 */

function merge(intervals) {
  if (intervals.length === 0) return [];
  
  // 1. 按起始位置排序
  intervals.sort((a, b) => a[0] - b[0]);
  
  const result = [intervals[0]];
  
  // 2. 遍历区间，合并重叠的区间
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];
    
    // 如果当前区间的起始位置 <= 上一个区间的结束位置，则重叠
    if (current[0] <= last[1]) {
      // 合并：更新上一个区间的结束位置
      last[1] = Math.max(last[1], current[1]);
    } else {
      // 不重叠，直接添加
      result.push(current);
    }
  }
  
  return result;
}

// 扩展：插入新区间
function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  
  // 1. 添加所有在新区间之前的区间
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }
  
  // 2. 合并重叠的区间
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  
  // 3. 添加剩余的区间
  while (i < intervals.length) {
    result.push(intervals[i]);
    i++;
  }
  
  return result;
}

// 测试用例
console.log('=== 合并区间测试 ===');
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]])); // [[1,6],[8,10],[15,18]]
console.log(merge([[1, 4], [4, 5]]));                    // [[1,5]]
console.log(merge([[1, 4], [2, 3]]));                    // [[1,4]]

console.log('=== 插入区间测试 ===');
console.log(insert([[1, 3], [6, 9]], [2, 5]));          // [[1,5],[6,9]]
console.log(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8])); // [[1,2],[3,10],[12,16]]

module.exports = { merge, insert };
