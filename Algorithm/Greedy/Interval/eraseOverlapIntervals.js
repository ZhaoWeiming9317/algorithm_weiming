/**
 * 无重叠区间 (Non-overlapping Intervals)
 * 
 * 题目描述：
 * 给定一个区间的集合，找到需要移除区间的最小数量，使剩余区间互不重叠。
 * 
 * 示例：
 * 输入: intervals = [[1,2],[2,3],[3,4],[1,3]]
 * 输出: 1
 * 解释: 移除 [1,3] 后，剩余的区间没有重叠。
 * 
 * 解题思路：
 * 1. 贪心策略
 *    - 按区间结束时间排序（为什么？同活动选择问题，我们希望给后面的区间留出更多空间）
 *    - 统计重叠的区间数量
 *    - 重叠的判定：如果当前区间的开始时间小于前一个区间的结束时间，则重叠
 * 
 * 2. 为什么这是贪心算法？
 *    - 每次都选择结束时间最早的区间，这样可以为后面的区间留出更多的空间
 *    - 这个选择在当前看是最优的，也导致了全局最优
 * 
 * 3. 时间复杂度：O(nlogn)，主要是排序的时间
 */

// 方法1：计算需要移除的区间数量
function eraseOverlapIntervals(intervals) {
    if (intervals.length <= 1) return 0;
    
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 0;          // 需要移除的区间数量
    let lastEnd = intervals[0][1];  // 当前保留的最后一个区间的结束时间
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < lastEnd) {
            // 当前区间与上一个区间重叠，需要移除
            count++;
        } else {
            // 不重叠，更新lastEnd
            lastEnd = intervals[i][1];
        }
    }
    
    return count;
}

// 方法2：返回不重叠的区间
function getNonOverlappingIntervals(intervals) {
    if (intervals.length <= 1) return intervals;
    
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    const result = [intervals[0]];
    let lastEnd = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            result.push(intervals[i]);
            lastEnd = intervals[i][1];
        }
    }
    
    return result;
}

// 方法3：处理区间有权重的情况
function maxWeightNonOverlapping(intervals) {
    if (intervals.length <= 1) return {
        maxWeight: intervals.length ? intervals[0].weight || 0 : 0,
        selected: intervals
    };
    
    // 按结束时间排序
    intervals.sort((a, b) => a.end - b.end);
    
    const dp = new Array(intervals.length).fill(0);
    dp[0] = intervals[0].weight || 0;
    
    for (let i = 1; i < intervals.length; i++) {
        // 找到最后一个不重叠的区间
        let lastNonOverlap = -1;
        for (let j = i - 1; j >= 0; j--) {
            if (intervals[j].end <= intervals[i].start) {
                lastNonOverlap = j;
                break;
            }
        }
        
        // 选择当前区间的最大权重
        const weightWithCurrent = (intervals[i].weight || 0) + 
            (lastNonOverlap >= 0 ? dp[lastNonOverlap] : 0);
            
        // 不选择当前区间的最大权重
        dp[i] = Math.max(weightWithCurrent, dp[i - 1]);
    }
    
    // 回溯找出选择的区间
    const selected = [];
    let i = intervals.length - 1;
    
    while (i >= 0) {
        let lastNonOverlap = -1;
        for (let j = i - 1; j >= 0; j--) {
            if (intervals[j].end <= intervals[i].start) {
                lastNonOverlap = j;
                break;
            }
        }
        
        const weightWithCurrent = (intervals[i].weight || 0) + 
            (lastNonOverlap >= 0 ? dp[lastNonOverlap] : 0);
            
        if (i === 0 || weightWithCurrent > dp[i - 1]) {
            selected.unshift(intervals[i]);
            i = lastNonOverlap;
        } else {
            i--;
        }
    }
    
    return {
        maxWeight: dp[intervals.length - 1],
        selected
    };
}

// 测试
function test() {
    // 测试用例1：基本场景
    const intervals1 = [[1,2], [2,3], [3,4], [1,3]];
    console.log("测试用例1 - 基本场景：");
    console.log("需要移除的区间数量:", eraseOverlapIntervals(intervals1));
    console.log("不重叠的区间:", getNonOverlappingIntervals(intervals1));
    
    // 测试用例2：全部重叠
    const intervals2 = [[1,2], [1,2], [1,2]];
    console.log("\n测试用例2 - 全部重叠：");
    console.log("需要移除的区间数量:", eraseOverlapIntervals(intervals2));
    console.log("不重叠的区间:", getNonOverlappingIntervals(intervals2));
    
    // 测试用例3：带权重的区间
    const intervals3 = [
        { start: 1, end: 4, weight: 3 },
        { start: 2, end: 3, weight: 2 },
        { start: 3, end: 5, weight: 4 },
        { start: 4, end: 6, weight: 1 }
    ];
    console.log("\n测试用例3 - 带权重的区间：");
    const result = maxWeightNonOverlapping(intervals3);
    console.log("最大权重:", result.maxWeight);
    console.log("选中的区间:", result.selected);
}

module.exports = {
    eraseOverlapIntervals,
    getNonOverlappingIntervals,
    maxWeightNonOverlapping
};
