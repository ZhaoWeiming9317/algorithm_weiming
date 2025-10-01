/**
 * 股票价格跨度 (Stock Span Problem)
 * 
 * 题目描述：
 * 编写一个 StockSpanner 类，它收集某些股票的每日报价，
 * 并返回该股票当日价格的跨度。
 * 
 * 跨度定义：从今天开始往前数，有多少个连续的天数，这些天的价格都 ≤ 今天的价格
 * 
 * 直观理解：
 * 价格序列: [100, 80, 60, 70, 60, 75, 85]
 * 跨度计算:
 * - 第1天(100): 只有今天 → 跨度=1
 * - 第2天(80):  80<100，只有今天 → 跨度=1  
 * - 第3天(60):  60<80，只有今天 → 跨度=1
 * - 第4天(70):  70≥60(昨天)，70<80(前天) → 跨度=2 (今天+昨天)
 * - 第5天(60):  60<70，只有今天 → 跨度=1
 * - 第6天(75):  75≥60,70,60，75<80 → 跨度=4 (今天+前3天)
 * - 第7天(85):  85≥75,60,70,60,80，85<100 → 跨度=6 (今天+前5天)
 * 
 * 核心思路：
 * 使用单调递减栈存储 [price, span] 对
 * 栈中只保留"有用"的价格（可能成为未来跨度计算终止点的价格）
 * 当新价格到来时，弹出所有 ≤ 当前价格的元素，并累加它们的跨度
 */

export class StockSpanner {
    constructor() {
        this.stack = []; // 存储 [price, span] 对，维持单调递减
    }
    
    /**
     * @param {number} price 今天的股票价格
     * @return {number} 今天的跨度
     */
    next(price) {
        let span = 1; // 至少包括今天
        
        // 关键步骤：弹出所有 ≤ 当前价格的元素
        // 为什么可以这样做？
        // 1. 如果栈顶价格 ≤ 当前价格，说明从栈顶那天到今天，价格都 ≤ 今天
        // 2. 栈顶元素的span已经包含了它能覆盖的所有天数
        // 3. 我们可以直接"继承"这些天数，不需要重复计算
        while (this.stack.length > 0 && this.stack[this.stack.length - 1][0] <= price) {
            const [prevPrice, prevSpan] = this.stack.pop();
            span += prevSpan; // 累加之前的跨度
            // 例如：栈顶是[60,1]，当前价格75，则75可以"吃掉"这1天
        }
        
        // 将当前价格和其跨度入栈
        // 栈中始终保持单调递减，这样栈顶就是"最近的更大元素"
        this.stack.push([price, span]);
        return span;
    }
}

/**
 * 另一种实现：使用索引的方式
 */
export class StockSpannerV2 {
    constructor() {
        this.prices = [];
        this.stack = []; // 存储索引，维持单调递减
    }
    
    next(price) {
        this.prices.push(price);
        const currentIndex = this.prices.length - 1;
        
        // 弹出所有小于等于当前价格的索引
        while (this.stack.length > 0 && this.prices[this.stack[this.stack.length - 1]] <= price) {
            this.stack.pop();
        }
        
        // 计算跨度：当前索引 - 栈顶索引（如果栈为空则为-1）
        const span = this.stack.length === 0 ? currentIndex + 1 : currentIndex - this.stack[this.stack.length - 1];
        
        this.stack.push(currentIndex);
        return span;
    }
}

/**
 * 一次性计算所有股票跨度的函数版本
 */
export function calculateStockSpans(prices) {
    const spans = [];
    const stack = []; // 存储索引
    
    for (let i = 0; i < prices.length; i++) {
        // 弹出所有小于等于当前价格的索引
        while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
            stack.pop();
        }
        
        // 计算跨度
        const span = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
        spans.push(span);
        
        stack.push(i);
    }
    
    return spans;
}

/**
 * 算法执行过程演示
 * 
 * 以价格序列 [100, 80, 60, 70, 60, 75, 85] 为例：
 * 
 * 第1天: price=100
 *   栈: [] → span=1 → 栈: [[100,1]]
 * 
 * 第2天: price=80  
 *   栈: [[100,1]] → 100>80，不弹出 → span=1 → 栈: [[100,1], [80,1]]
 * 
 * 第3天: price=60
 *   栈: [[100,1], [80,1]] → 80>60，不弹出 → span=1 → 栈: [[100,1], [80,1], [60,1]]
 * 
 * 第4天: price=70
 *   栈: [[100,1], [80,1], [60,1]] → 60≤70，弹出[60,1] → span=1+1=2
 *   → 80>70，不再弹出 → 栈: [[100,1], [80,1], [70,2]]
 * 
 * 第5天: price=60
 *   栈: [[100,1], [80,1], [70,2]] → 70>60，不弹出 → span=1 → 栈: [[100,1], [80,1], [70,2], [60,1]]
 * 
 * 第6天: price=75
 *   栈: [[100,1], [80,1], [70,2], [60,1]] 
 *   → 60≤75，弹出[60,1] → span=1+1=2
 *   → 70≤75，弹出[70,2] → span=2+2=4  
 *   → 80>75，不再弹出 → 栈: [[100,1], [80,1], [75,4]]
 * 
 * 第7天: price=85
 *   栈: [[100,1], [80,1], [75,4]]
 *   → 75≤85，弹出[75,4] → span=1+4=5
 *   → 80≤85，弹出[80,1] → span=5+1=6
 *   → 100>85，不再弹出 → 栈: [[100,1], [85,6]]
 */

// 测试用例
console.log('=== StockSpanner 类测试 ===');
const stockSpanner = new StockSpanner();
const prices1 = [100, 80, 60, 70, 60, 75, 85];
const results1 = [];

prices1.forEach((price, day) => {
    const span = stockSpanner.next(price);
    results1.push(span);
    console.log(`第${day + 1}天: 价格=${price}, 跨度=${span}`);
});

console.log(`输入价格: [${prices1.join(', ')}]`);
console.log(`输出跨度: [${results1.join(', ')}]`);
console.log('---');

console.log('=== StockSpannerV2 类测试 ===');
const stockSpanner2 = new StockSpannerV2();
const prices2 = [31, 41, 48, 59, 79];
const results2 = [];

prices2.forEach((price, day) => {
    const span = stockSpanner2.next(price);
    results2.push(span);
    console.log(`第${day + 1}天: 价格=${price}, 跨度=${span}`);
});

console.log(`输入价格: [${prices2.join(', ')}]`);
console.log(`输出跨度: [${results2.join(', ')}]`);
console.log('---');

console.log('=== 函数版本测试 ===');
const testCases = [
    [100, 80, 60, 70, 60, 75, 85],
    [31, 41, 48, 59, 79],
    [1, 1, 1, 1, 1],
    [5, 4, 3, 2, 1],
    [1, 2, 3, 4, 5]
];

testCases.forEach((prices, index) => {
    const spans = calculateStockSpans(prices);
    console.log(`测试用例 ${index + 1}:`);
    console.log(`价格: [${prices.join(', ')}]`);
    console.log(`跨度: [${spans.join(', ')}]`);
    console.log('---');
});
