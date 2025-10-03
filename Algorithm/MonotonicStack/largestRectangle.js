/**
 * 柱状图中最大的矩形 (Largest Rectangle in Histogram)
 * 
 * 题目描述：
 * 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。
 * 每个柱子彼此相邻，且宽度为 1 。
 * 求在该柱状图中，能够勾勒出来的矩形的最大面积。
 * 
 * 示例：
 * 输入：heights = [2,1,5,6,2,3]
 * 输出：10
 * 解释：最大的矩形为图中红色区域，面积为 10
 * 
 * 解题思路：
 * 使用单调递增栈，当遇到更小的高度时，计算以栈顶高度为矩形高度的最大面积
 */

export function largestRectangleArea(heights) {
    const stack = []; // 单调递增栈，存储索引
    let maxArea = 0;
    
    // 在末尾添加一个0，确保所有元素都能被处理
    for (let i = 0; i <= heights.length; i++) {
        const currentHeight = i === heights.length ? 0 : heights[i];
        
        // 当前高度小于栈顶高度时，计算矩形面积
        while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()]; // 矩形的高度
            // 单调递增栈，弹出的元素找到了“下一个更小”值的高度。
            // 矩形的宽度：右边界是当前位置，左边界是新的栈顶的下一个位置
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }

        stack.push(i);
    }
    
    return maxArea;
}

// 优化版本：处理边界情况更清晰
export function largestRectangleAreaV2(heights) {
    // 在数组两端添加哨兵，简化边界处理
    const newHeights = [0, ...heights, 0];
    const stack = [0]; // 栈中先放入第一个哨兵的索引
    let maxArea = 0;
    
    for (let i = 1; i < newHeights.length; i++) {
        while (newHeights[i] < newHeights[stack[stack.length - 1]]) {
            const height = newHeights[stack.pop()];
            const width = i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    
    return maxArea;
}

// 测试用例
const testCases = [
    [2,1,5,6,2,3],  // 期望输出: 10
    [2,4],          // 期望输出: 4
    [1,1],          // 期望输出: 2
    [0],            // 期望输出: 0
    [1],            // 期望输出: 1
    [5,4,3,2,1],    // 期望输出: 9
    [1,2,3,4,5]     // 期望输出: 9
];

console.log('=== 柱状图中最大的矩形测试 ===');
testCases.forEach((heights, index) => {
    const result1 = largestRectangleArea(heights);
    const result2 = largestRectangleAreaV2(heights);
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: [${heights.join(',')}]`);
    console.log(`方法1输出: ${result1}`);
    console.log(`方法2输出: ${result2}`);
    console.log('---');
});
