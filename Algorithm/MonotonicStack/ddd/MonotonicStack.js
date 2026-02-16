/**
 * 通用单调栈领域实体。
 * 
 * 封装了维护单调栈的核心逻辑。
 * 具体的出栈条件和出栈时的操作通过策略模式（strategies）在构造或调用时注入。
 */
export class MonotonicStack {
    /**
     * @param {Object} strategies - 策略对象
     * @param {function(peekItem, incomingItem): boolean} strategies.shouldPop - 断言函数，用于判断当前栈顶元素是否应该出栈。
     * @param {function(poppedItem, incomingItem): void} strategies.onPop - 回调函数，在元素出栈时执行。
     */
    constructor({ shouldPop, onPop }) {
        this.stack = [];
        this.shouldPop = shouldPop;
        this.onPop = onPop;
    }

    /**
     * 处理新元素，保持栈的单调性。
     * @param {any} item - 要推入栈的新元素。
     */
    push(item) {
        while (this.stack.length > 0 && this.shouldPop(this.peek(), item)) {
            const poppedItem = this.stack.pop();
            this.onPop(poppedItem, item);
        }
        this.stack.push(item);
    }

    /**
     * 批量处理元素
     * @param {Array} items - 要处理的元素数组
     */
    process(items) {
        items.forEach(item => this.push(item));
    }

    /**
     * 返回栈顶元素但不移除它。
     * @returns {any} 栈顶元素。
     */
    peek() {
        return this.stack[this.stack.length - 1];
    }

    /**
     * 返回当前栈的大小。
     * @returns {number}
     */
    size() {
        return this.stack.length;
    }

    /**
     * 检查栈是否为空。
     * @returns {boolean}
     */
    isEmpty() {
        return this.stack.length === 0;
    }
}
