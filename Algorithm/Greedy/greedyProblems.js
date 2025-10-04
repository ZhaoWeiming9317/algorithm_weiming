/**
 * 贪心算法经典问题实现
 */

// 1. 活动选择问题
function activitySelection(activities) {
    // 按结束时间排序
    activities.sort((a, b) => a.end - b.end);
    
    const selected = [activities[0]];
    let lastEndTime = activities[0].end;
    
    for (let i = 1; i < activities.length; i++) {
        if (activities[i].start >= lastEndTime) {
            selected.push(activities[i]);
            lastEndTime = activities[i].end;
        }
    }
    
    return selected;
}

// 2. 找零钱问题（贪心版本，不保证最优）
function coinChangeGreedy(coins, amount) {
    coins.sort((a, b) => b - a); // 降序排列
    const result = [];
    
    for (const coin of coins) {
        while (amount >= coin) {
            result.push(coin);
            amount -= coin;
        }
    }
    
    return amount === 0 ? result : null;
}

// 3. 区间调度问题
function eraseOverlapIntervals(intervals) {
    if (intervals.length === 0) return 0;
    
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 0;
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < end) {
            count++; // 移除重叠区间
        } else {
            end = intervals[i][1];
        }
    }
    
    return count;
}

// 4. 跳跃游戏
function canJump(nums) {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    
    return true;
}

// 5. 跳跃游戏II（最少跳跃次数）
function jump(nums) {
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }
    
    return jumps;
}

// 6. 加油站问题
function canCompleteCircuit(gas, cost) {
    let totalTank = 0;
    let currentTank = 0;
    let startStation = 0;
    
    for (let i = 0; i < gas.length; i++) {
        totalTank += gas[i] - cost[i];
        currentTank += gas[i] - cost[i];
        
        if (currentTank < 0) {
            startStation = i + 1;
            currentTank = 0;
        }
    }
    
    return totalTank >= 0 ? startStation : -1;
}

// 7. 分发饼干
function findContentChildren(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    
    let i = 0, j = 0;
    let count = 0;
    
    while (i < g.length && j < s.length) {
        if (s[j] >= g[i]) {
            count++;
            i++;
        }
        j++;
    }
    
    return count;
}

// 8. 无重叠区间
function eraseOverlapIntervals(intervals) {
    if (intervals.length === 0) return 0;
    
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 0;
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < end) {
            count++;
        } else {
            end = intervals[i][1];
        }
    }
    
    return count;
}

// 9. 用最少数量的箭引爆气球
function findMinArrowShots(points) {
    if (points.length === 0) return 0;
    
    // 按结束位置排序
    points.sort((a, b) => a[1] - b[1]);
    
    let arrows = 1;
    let end = points[0][1];
    
    for (let i = 1; i < points.length; i++) {
        if (points[i][0] > end) {
            arrows++;
            end = points[i][1];
        }
    }
    
    return arrows;
}

// 10. 买卖股票的最佳时机II
function maxProfit(prices) {
    let profit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i-1]) {
            profit += prices[i] - prices[i-1];
        }
    }
    
    return profit;
}

// 测试用例
function test() {
    // 活动选择
    const activities = [
        {start: 1, end: 3},
        {start: 2, end: 5},
        {start: 0, end: 6},
        {start: 5, end: 7},
        {start: 8, end: 9},
        {start: 5, end: 9}
    ];
    console.log('活动选择:', activitySelection(activities));
    
    // 找零钱
    console.log('找零钱:', coinChangeGreedy([1, 5, 10, 25], 67));
    
    // 区间调度
    console.log('移除重叠区间:', eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]));
    
    // 跳跃游戏
    console.log('跳跃游戏:', canJump([2,3,1,1,4]));
    console.log('最少跳跃:', jump([2,3,1,1,4]));
    
    // 加油站
    console.log('加油站:', canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]));
    
    // 分发饼干
    console.log('分发饼干:', findContentChildren([1,2,3], [1,1]));
    
    // 买卖股票
    console.log('买卖股票:', maxProfit([7,1,5,3,6,4]));
}

// test();
module.exports = {
    activitySelection,
    coinChangeGreedy,
    eraseOverlapIntervals,
    canJump,
    jump,
    canCompleteCircuit,
    findContentChildren,
    findMinArrowShots,
    maxProfit
};
