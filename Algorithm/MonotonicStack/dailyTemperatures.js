/**
 * 每日温度 (Daily Temperatures)
 * 
 * 题目描述：
 * 给定一个整数数组 temperatures ，表示每天的温度，
 * 返回一个数组 answer ，其中 answer[i] 是指在第 i 天之后，
 * 才会有更高的温度。如果气温在这之后都不会升高，请在该位置用 0 来代替。
 * 
 * 示例：
 * 输入: temperatures = [73,74,75,71,69,72,76,73]
 * 输出: [1,1,4,2,1,1,0,0]
 * 
 * 解题思路：
 * 使用单调递减栈，栈中存储温度的索引
 * 当遇到更高温度时，弹出栈中所有小于当前温度的元素
 */

export function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack = []; // 单调递减栈，存储索引
    
    for (let i = 0; i < n; i++) {
        // 当前温度大于栈顶温度时，找到了栈顶的下一个更高温度
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            result[prevIndex] = i - prevIndex; // 计算天数差
        }
        stack.push(i);
    }
    
    return result;
}

// 测试用例
const testCases = [
    [73,74,75,71,69,72,76,73],
    [30,40,50,60],
    [30,60,90]
];

testCases.forEach((temperatures, index) => {
    console.log(`测试用例 ${index + 1}:`);
    console.log(`输入: [${temperatures.join(',')}]`);
    console.log(`输出: [${dailyTemperatures(temperatures).join(',')}]`);
    console.log('---');
});
