/**
 * 单步维护单调性
 * 适用于在线算法 (Online Algorithm) 或需要手动控制栈的场景 (如 StockSpanner)
 * 
 * @template T
 * @param {Array<T>} stack - 当前的单调栈 (会被修改)
 * @param {T} incoming - 新进来的元素
 * @param {Object} config
 * @param {(peek: T, incoming: T) => boolean} config.shouldPop - 判断是否出栈
 * @param {(popped: T, peek: T | null, incoming: T) => void} config.onPop - 出栈回调
 */
export function maintainMonotonicity(stack, incoming, { shouldPop, onPop }) {
    while (stack.length > 0 && shouldPop(stack[stack.length - 1], incoming)) {
        const poppedItem = stack.pop();
        const peekItem = stack.length > 0 ? stack[stack.length - 1] : null;
        onPop(poppedItem, peekItem, incoming);
    }
    stack.push(incoming);
}

/**
 * 批处理单调栈 (Batch Procesing)
 * 适用于离线算法 (Offline Algorithm)，一次性处理所有元素
 * 
 * @template T
 * @param {Array<T> | Iterable<T>} elements - 输入元素流
 * @param {Object} config - 配置同 maintainMonotonicity
 */
export function processMonotonicStack(elements, config) {
    const stack = [];
    for (const item of elements) {
        maintainMonotonicity(stack, item, config);
    }
}

/**
 * 内置策略集合
 */
export const Strategies = {
    // 寻找右侧第一个更矮的元素 (Next Less Element, <=) -> 对应递增栈
    NextLessElement: (peek, incoming) => peek >= incoming,

    // 寻找右侧第一个严格更矮的元素 (Next Strictly Less Element, <)
    NextStrictlyLessElement: (peek, incoming) => peek > incoming,

    // 寻找右侧第一个更高的元素 (Next Greater Element, >=) -> 对应递减栈
    NextGreaterElement: (peek, incoming) => peek <= incoming,

    // 寻找右侧第一个严格更高的元素 (Next Strictly Greater Element, >)
    NextStrictlyGreaterElement: (peek, incoming) => peek < incoming,
};
