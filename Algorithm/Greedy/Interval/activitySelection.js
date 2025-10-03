/**
 * 区间调度问题 (Activity Selection / Interval Scheduling)
 * 
 * 题目描述：
 * 给定一个包含开始时间和结束时间的活动数组，找出可以参加的最大活动数量。
 * 一个人在同一时间只能参加一个活动。
 * 
 * 示例：
 * 输入：activities = [{start: 1, end: 4}, {start: 3, end: 5}, {start: 0, end: 6}, {start: 5, end: 7}, {start: 8, end: 9}]
 * 输出：3
 * 解释：可以参加的活动是 [1,4], [5,7], [8,9]
 * 
 * 解题思路：
 * 1. 贪心策略
 *    - 按照结束时间排序（为什么？因为我们要尽可能给后面的活动留出时间）
 *    - 选择第一个活动（结束时间最早的）
 *    - 遍历剩余活动，如果开始时间大于等于当前选中活动的结束时间，则选择该活动
 * 
 * 2. 证明贪心策略的正确性
 *    - 假设存在更优解，该解中第一个活动的结束时间晚于我们的贪心选择
 *    - 那么我们可以用贪心选择的活动替换它，得到一个不差于原解的解
 *    - 因此贪心选择是最优的
 * 
 * 3. 时间复杂度：O(nlogn)，主要是排序的时间
 */

// 活动类
class Activity {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

// 方法1：返回最大活动数量
function maxActivities(activities) {
    if (!activities || activities.length === 0) return 0;
    
    // 按结束时间排序
    activities.sort((a, b) => a.end - b.end);
    
    let count = 1;  // 至少可以参加第一个活动
    let lastEnd = activities[0].end;
    
    for (let i = 1; i < activities.length; i++) {
        if (activities[i].start >= lastEnd) {
            count++;
            lastEnd = activities[i].end;
        }
    }
    
    return count;
}

// 方法2：返回可以参加的活动列表
function selectActivities(activities) {
    if (!activities || activities.length === 0) return [];
    
    // 按结束时间排序
    activities.sort((a, b) => a.end - b.end);
    
    const selected = [activities[0]];
    let lastEnd = activities[0].end;
    
    for (let i = 1; i < activities.length; i++) {
        if (activities[i].start >= lastEnd) {
            selected.push(activities[i]);
            lastEnd = activities[i].end;
        }
    }
    
    return selected;
}

// 方法3：处理有权重的活动选择
function weightedActivitySelection(activities) {
    if (!activities || activities.length === 0) return { maxWeight: 0, selected: [] };
    
    // 按结束时间排序
    activities.sort((a, b) => a.end - b.end);
    
    const n = activities.length;
    const dp = new Array(n).fill(0);  // dp[i]表示考虑前i个活动的最大权重和
    const selected = [];
    
    // 第一个活动
    dp[0] = activities[0].weight || 1;
    
    // 对于每个活动，可以选择或不选择
    for (let i = 1; i < n; i++) {
        // 找到最后一个不冲突的活动
        let lastNonConflict = -1;
        for (let j = i - 1; j >= 0; j--) {
            if (activities[j].end <= activities[i].start) {
                lastNonConflict = j;
                break;
            }
        }
        
        // 选择当前活动的收益
        const weightIfSelected = (activities[i].weight || 1) + 
            (lastNonConflict !== -1 ? dp[lastNonConflict] : 0);
        
        // 不选择当前活动的收益
        const weightIfNotSelected = dp[i - 1];
        
        dp[i] = Math.max(weightIfSelected, weightIfNotSelected);
    }
    
    // 回溯找出选择的活动
    let i = n - 1;
    while (i >= 0) {
        let lastNonConflict = -1;
        for (let j = i - 1; j >= 0; j--) {
            if (activities[j].end <= activities[i].start) {
                lastNonConflict = j;
                break;
            }
        }
        
        const weightIfSelected = (activities[i].weight || 1) + 
            (lastNonConflict !== -1 ? dp[lastNonConflict] : 0);
            
        if (i === 0 || weightIfSelected > dp[i - 1]) {
            selected.unshift(activities[i]);
            i = lastNonConflict;
        } else {
            i--;
        }
    }
    
    return {
        maxWeight: dp[n - 1],
        selected
    };
}

// 测试
function test() {
    // 测试用例1：基本场景
    const activities1 = [
        new Activity(1, 4),
        new Activity(3, 5),
        new Activity(0, 6),
        new Activity(5, 7),
        new Activity(8, 9),
        new Activity(5, 9)
    ];
    
    console.log("测试用例1 - 基本场景：");
    console.log("最大活动数量:", maxActivities(activities1));
    console.log("选中的活动:", selectActivities(activities1));
    
    // 测试用例2：所有活动都重叠
    const activities2 = [
        new Activity(1, 3),
        new Activity(2, 4),
        new Activity(3, 5),
        new Activity(1, 5)
    ];
    
    console.log("\n测试用例2 - 重叠活动：");
    console.log("最大活动数量:", maxActivities(activities2));
    console.log("选中的活动:", selectActivities(activities2));
    
    // 测试用例3：带权重的活动
    const activities3 = [
        { start: 1, end: 4, weight: 5 },
        { start: 3, end: 5, weight: 10 },
        { start: 0, end: 6, weight: 6 },
        { start: 5, end: 7, weight: 8 },
        { start: 8, end: 9, weight: 4 }
    ];
    
    console.log("\n测试用例3 - 带权重的活动：");
    const result = weightedActivitySelection(activities3);
    console.log("最大权重:", result.maxWeight);
    console.log("选中的活动:", result.selected);
}

module.exports = {
    Activity,
    maxActivities,
    selectActivities,
    weightedActivitySelection
};
