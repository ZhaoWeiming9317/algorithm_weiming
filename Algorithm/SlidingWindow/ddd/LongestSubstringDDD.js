import { slidingWindowMax } from './SlidingWindow.js';

/**
 * 无重复字符的最长子串 (LC 3)
 * 使用模板: slidingWindowMax
 */
export function lengthOfLongestSubstring(s) {
    let maxLen = 0;

    slidingWindowMax(s, {
        state: new Map(), // 字符 -> 次数

        // 扩张：次数 +1
        add: (map, char) => map.set(char, (map.get(char) || 0) + 1),

        // 缩减：次数 -1
        remove: (map, char) => map.set(char, map.get(char) - 1),

        // 不合法条件：存在重复字符 (任意 count > 1)
        // 实际上只有当前扩张的字符可能造成 > 1
        isInvalid: (map) => Array.from(map.values()).some(count => count > 1),

        // 结算：更新最大长度
        updateResult: (map, size) => {
            maxLen = Math.max(maxLen, size);
        }
    });

    return maxLen;
}
