import { slidingWindowMin } from './SlidingWindow.js';

/**
 * 最小覆盖子串 (LC 76)
 * 使用模板: slidingWindowMin
 */
export function minWindow(s, t) {
    // 1. 初始化 state
    const needs = new Map();
    for (const char of t) {
        needs.set(char, (needs.get(char) || 0) + 1);
    }

    // 结果记录
    let minLen = Infinity;
    let minStart = 0;

    const state = {
        needs: needs,
        missing: t.length
    };

    slidingWindowMin(s, {
        state: state,

        // 扩张：如果是有用的字符，missing--
        add: (st, char) => {
            if (st.needs.has(char)) {
                if (st.needs.get(char) > 0) st.missing--;
                st.needs.set(char, st.needs.get(char) - 1);
            }
        },

        // 缩减：如果是必要的字符，missing++
        remove: (st, char) => {
            if (st.needs.has(char)) {
                if (st.needs.get(char) >= 0) st.missing++;
                st.needs.set(char, st.needs.get(char) + 1);
            }
        },

        // 合法条件：missing == 0 (所有字符都覆盖了)
        isValid: (st) => st.missing === 0,

        // 结算：记录最小解
        updateResult: (st, size, left) => {
            if (size < minLen) {
                minLen = size;
                minStart = left;
            }
        }
    });

    return minLen === Infinity ? "" : s.substr(minStart, minLen);
}
