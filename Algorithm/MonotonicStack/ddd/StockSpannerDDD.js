import { MonotonicStack } from './MonotonicStack.js';

class PriceSpan {
    constructor(price, span = 1) {
        this.price = price;
        this.span = span;
    }

    /**
     * 判断当前价格是否大于等于栈顶价格
     * 注意：StockSpanner 是找 <= 当前价格的，所以这里是 >=
     */
    isGreaterOrEqual(other) {
        return this.price >= other.price;
    }
}

export class StockSpanner {
    constructor() {
        this.stack = new MonotonicStack({
            // 出栈策略：当栈顶价格 <= 当前价格时，出栈
            // 也就是当前价格 >= 栈顶价格
            shouldPop: (top, current) => current.isGreaterOrEqual(top),

            // 出栈时的业务逻辑：累加跨度
            onPop: (popped, current) => {
                current.span += popped.span;
            }
        });
    }

    next(price) {
        const current = new PriceSpan(price);
        this.stack.push(current);
        return current.span;
    }
}
