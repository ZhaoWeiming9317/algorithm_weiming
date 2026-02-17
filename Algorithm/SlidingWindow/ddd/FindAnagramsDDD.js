import { slidingWindowFixed } from './SlidingWindow.js';

/**
 * 找到字符串中所有字母异位词 (LC 438)
 * 使用模板: slidingWindowFixed
 */
export function findAnagrams(s, p) {
    const result = [];

    // 初始化 state
    const needs = new Map();
    for (const char of p) needs.set(char, (needs.get(char) || 0) + 1);

    const state = {
        needs: needs,
        matchCount: 0,
        targetDistinctChars: needs.size
    };

    slidingWindowFixed(s, {
        state: state,
        k: p.length, // 固定窗口长度

        // 扩张
        add: (st, char) => {
            if (st.needs.has(char)) {
                st.needs.set(char, st.needs.get(char) - 1);
                if (st.needs.get(char) === 0) st.matchCount++;
            }
        },

        // 缩减 (窗口满了自动触发)
        remove: (st, char) => {
            if (st.needs.has(char)) {
                if (st.needs.get(char) === 0) st.matchCount--;
                st.needs.set(char, st.needs.get(char) + 1);
            }
        },

        // 结算 (只有窗口大小达到 k 时触发)
        updateResult: (st, size, left) => {
            // 在这里只需检查业务条件是否满足
            if (st.matchCount === st.targetDistinctChars) {
                result.push(left);
            }
        }
    });

    return result;
}
