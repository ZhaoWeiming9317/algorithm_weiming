import { maintainMonotonicity, Strategies } from './MonotonicStack.js';

class PriceSpan {
    constructor(price, span = 1) {
        this.price = price;
        this.span = span;
    }
}

/**
 * 股票价格跨度 (LC 901)
 * 场景：在线流式处理 (Online Streaming)
 * 
 * 解决方案：
 * StockSpanner 类负责持有状态 (stack)。
 * 每次 next() 调用时，利用 maintainMonotonicity 辅助函数来执行单调栈逻辑。
 */
export class StockSpanner {
    constructor() {
        this.stack = [];
    }

    next(price) {
        // 1. 封装当前元素
        const current = new PriceSpan(price, 1);

        // 2. 委托给通用函数处理单调性
        maintainMonotonicity(this.stack, current, {
            // 策略：遇到 <= 当前价格的，都弹出 (NextGreaterElement涵盖了<=)
            shouldPop: (peek, incoming) => Strategies.NextGreaterElement(peek.price, incoming.price),

            // 业务逻辑：累加 span
            onPop: (popped, peek, incoming) => {
                incoming.span += popped.span;
            }
        });

        // 3. 返回计算好的 span
        return current.span;
    }
}
