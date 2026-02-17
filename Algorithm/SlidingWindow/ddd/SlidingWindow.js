/**
 * @template TState, TElement
 * 模板 1: 寻找最长/最大窗口 (Max Window)
 * 适用题目: 无重复字符的最长子串 (LC 3), 最大连续1的个数 (LC 1004)
 * 核心逻辑:
 *   1. 扩张 (Expand)
 *   2. 若窗口[不合法]，则持续缩减 (Shrink) 直到合法
 *   3. 此时窗口[合法]，更新结果 (Update)
 * 
 * @param {Array<TElement> | string} elements - 输入的数组或字符串
 * @param {Object} config - 配置对象
 * @param {TState} config.state - 窗口状态
 * @param {(state: TState, item: TElement) => void} config.add - 元素移入窗口时的逻辑
 * @param {(state: TState, item: TElement) => void} config.remove - 元素移出窗口时的逻辑
 * @param {(state: TState) => boolean} config.isInvalid - 判断窗口是否[不合法] (返回 true 则收缩)
 * @param {(state: TState, windowSize: number, left: number, right: number) => void} config.updateResult - 更新结果的逻辑 (仅在合法时触发)
 */
export function slidingWindowMax(elements, { state, add, remove, isInvalid, updateResult }) {
    let left = 0;
    for (let right = 0; right < elements.length; right++) {
        const incoming = elements[right];
        add(state, incoming);

        // 只要不合法，就一直缩减
        while (isInvalid(state)) {
            const outgoing = elements[left];
            remove(state, outgoing);
            left++;
        }

        // 此时窗口一定是合法的
        // updateResult 接收 (state, windowSize, left, right)
        updateResult(state, right - left + 1, left, right);
    }
}

/**
 * @template TState, TElement
 * 模板 2: 寻找最短/最小窗口 (Min Window)
 * 适用题目: 最小覆盖子串 (LC 76), 长度最小的子数组 (LC 209)
 * 核心逻辑:
 *   1. 扩张 (Expand)
 *   2. 只要窗口[合法]，就尝试更新结果 (Update) 并缩减 (Shrink) 以寻找更小解
 * 
 * @param {Array<TElement> | string} elements - 输入的数组或字符串
 * @param {Object} config - 配置对象
 * @param {TState} config.state - 窗口状态
 * @param {(state: TState, item: TElement) => void} config.add - 元素移入窗口时的逻辑
 * @param {(state: TState, item: TElement) => void} config.remove - 元素移出窗口时的逻辑
 * @param {(state: TState) => boolean} config.isValid - 判断窗口是否[合法] (返回 true 则记录结果并收缩)
 * @param {(state: TState, windowSize: number, left: number, right: number) => void} config.updateResult - 更新结果的逻辑 (在 shrink 前触发)
 */
export function slidingWindowMin(elements, { state, add, remove, isValid, updateResult }) {
    let left = 0;
    for (let right = 0; right < elements.length; right++) {
        const incoming = elements[right];
        add(state, incoming);

        // 只要合法，就记录并尝试缩减
        while (isValid(state)) {
            // 先记录当前可行解 (因为等会 shrink 后可能就不合法了)
            updateResult(state, right - left + 1, left, right);

            const outgoing = elements[left];
            remove(state, outgoing);
            left++;
        }
    }
}

/**
 * @template TState, TElement
 * 模板 3: 固定长度窗口 (Fixed Window)
 * 适用题目: 找到字符串中所有字母异位词 (LC 438), 字符串的排列 (LC 567)
 * 核心逻辑:
 *   1. 扩张 (Expand)
 *   2. 维护窗口大小 <= k (若超限则 Shrink)
 *   3. 若窗口大小 == k，触发业务检查 (Update)
 * 
 * @param {Array<TElement> | string} elements - 输入的数组或字符串
 * @param {Object} config - 配置对象
 * @param {number} config.k - 固定的窗口大小
 * @param {TState} config.state - 窗口状态
 * @param {(state: TState, item: TElement) => void} config.add - 元素移入窗口时的逻辑
 * @param {(state: TState, item: TElement) => void} config.remove - 元素移出窗口时的逻辑
 * @param {(state: TState, windowSize: number, left: number, right: number) => void} config.updateResult - 更新结果的逻辑 (仅当 windowSize === k 时触发)
 */
export function slidingWindowFixed(elements, { state, k, add, remove, updateResult }) {
    let left = 0;
    // 自动维护 size，无需用户手动维护

    for (let right = 0; right < elements.length; right++) {
        const incoming = elements[right];
        add(state, incoming);

        // 如果窗口超过了固定长度 k，移出左侧
        if (right - left + 1 > k) {
            const outgoing = elements[left];
            remove(state, outgoing);
            left++;
        }

        // 当窗口长度达到 k 时，触发结算
        // 用户在 updateResult 里只需要判断业务条件 (例如: matchCount === targetCount)
        if (right - left + 1 === k) {
            updateResult(state, k, left, right);
        }
    }
}
