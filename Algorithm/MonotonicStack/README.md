# 单调栈 (Monotonic Stack)

## 概念

单调栈是一种特殊的栈数据结构，栈中的元素按照某种单调性（递增或递减）排列。当新元素入栈时，会维护栈的单调性，通常需要弹出一些元素。

## 核心特点

- **单调递增栈**：栈底到栈顶元素单调递增
- **单调递减栈**：栈底到栈顶元素单调递减
- **维护单调性**：新元素入栈前，弹出破坏单调性的元素

## 基本模板

### 单调递增栈模板
```javascript
function monotonicIncreasingStack(arr) {
    const stack = [];
    const result = [];
    
    for (let i = 0; i < arr.length; i++) {
        // 维护单调递增：当前元素小于等于栈顶时，弹出栈顶
        while (stack.length > 0 && arr[i] <= arr[stack[stack.length - 1]]) {
            const index = stack.pop();
            // 在这里处理被弹出的元素
        }
        stack.push(i); // 存储索引而不是值
    }
    
    return result;
}
```

### 单调递减栈模板
```javascript
function monotonicDecreasingStack(arr) {
    const stack = [];
    const result = [];
    
    for (let i = 0; i < arr.length; i++) {
        // 维护单调递减：当前元素大于等于栈顶时，弹出栈顶
        while (stack.length > 0 && arr[i] >= arr[stack[stack.length - 1]]) {
            const index = stack.pop();
            // 在这里处理被弹出的元素
        }
        stack.push(i);
    }
    
    return result;
}
```

## 使用场景

### 1. 寻找下一个更大/更小元素
- **下一个更大元素**：使用单调递减栈
- **下一个更小元素**：使用单调递增栈
- **前一个更大元素**：使用单调递减栈
- **前一个更小元素**：使用单调递增栈

### 2. 矩形面积问题
- **最大矩形面积**：柱状图中的最大矩形
- **最大正方形**：二维矩阵中的最大正方形

### 3. 滑动窗口最值问题
- 结合双端队列实现滑动窗口最大值/最小值

### 4. 股票价格问题
- **股票价格跨度**：计算股票价格小于等于当前价格的连续天数

## 经典题目

### 1. 每日温度 (Daily Temperatures)
**问题**：给定每日温度列表，返回每一天需要等待多少天才能遇到更高的温度。

```javascript
function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack = []; // 存储索引
    
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

// 测试
console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); 
// 输出: [1,1,4,2,1,1,0,0]
```

### 2. 柱状图中最大的矩形 (Largest Rectangle in Histogram)
**问题**：给定柱状图的高度，找出其中最大的矩形面积。

```javascript
function largestRectangleArea(heights) {
    const stack = [];
    let maxArea = 0;
    
    for (let i = 0; i <= heights.length; i++) {
        const currentHeight = i === heights.length ? 0 : heights[i];
        
        while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        
        stack.push(i);
    }
    
    return maxArea;
}

// 测试
console.log(largestRectangleArea([2,1,5,6,2,3])); // 输出: 10
```

### 3. 下一个更大元素 I (Next Greater Element I)
**问题**：找到数组中每个元素的下一个更大元素。

```javascript
function nextGreaterElement(nums1, nums2) {
    const stack = [];
    const map = new Map();
    
    // 先处理nums2，找到每个元素的下一个更大元素
    for (let i = 0; i < nums2.length; i++) {
        while (stack.length > 0 && nums2[i] > stack[stack.length - 1]) {
            map.set(stack.pop(), nums2[i]);
        }
        stack.push(nums2[i]);
    }
    
    // 根据nums1查询结果
    return nums1.map(num => map.get(num) || -1);
}

// 测试
console.log(nextGreaterElement([4,1,2], [1,3,4,2])); // 输出: [-1,3,-1]
```

### 4. 股票价格跨度 (Stock Span Problem)
**问题**：计算股票价格小于等于当前价格的连续天数。

```javascript
class StockSpanner {
    constructor() {
        this.stack = []; // 存储 [price, span] 对
    }
    
    next(price) {
        let span = 1;
        
        // 累加所有小于等于当前价格的跨度
        while (this.stack.length > 0 && this.stack[this.stack.length - 1][0] <= price) {
            span += this.stack.pop()[1];
        }
        
        this.stack.push([price, span]);
        return span;
    }
}

// 测试
const stockSpanner = new StockSpanner();
console.log(stockSpanner.next(100)); // 1
console.log(stockSpanner.next(80));  // 1
console.log(stockSpanner.next(60));  // 1
console.log(stockSpanner.next(70));  // 2
console.log(stockSpanner.next(60));  // 1
console.log(stockSpanner.next(75));  // 4
console.log(stockSpanner.next(85));  // 6
```

## 解题思路

### 识别单调栈问题的关键词
1. **"下一个更大/更小"**
2. **"前一个更大/更小"**
3. **"最大矩形面积"**
4. **"连续的天数/长度"**
5. **"柱状图"**

### 选择栈的单调性
- 求**下一个更大元素**：使用**单调递减栈**
- 求**下一个更小元素**：使用**单调递增栈**
- 求**最大矩形**：通常使用**单调递增栈**

### 存储策略
- **存储索引**：当需要计算距离或位置时
- **存储值**：当只需要比较大小时
- **存储对象**：当需要多个信息时

## 时间复杂度分析

- **时间复杂度**：O(n) - 每个元素最多入栈和出栈一次
- **空间复杂度**：O(n) - 栈的空间

## 总结

单调栈是解决"寻找下一个/前一个更大/更小元素"类问题的利器。关键是：
1. 确定需要维护的单调性（递增还是递减）
2. 在弹出元素时处理逻辑
3. 选择合适的存储策略（索引vs值）

掌握了单调栈的模板和思路，就能快速解决这类问题！
