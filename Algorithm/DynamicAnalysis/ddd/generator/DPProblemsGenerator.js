
import { runGeneratorDP } from './DPGeneratorRunner.js';

/**
 * 0-1 背包问题 (Generator 版)
 * 核心逻辑：yield [nextState] 就像是调用递归，但它在迭代中完成。
 */
export function knapsackGenerator(weights, values, capacity) {
    const n = weights.length;

    function* solve(idx, cap) {
        if (idx < 0 || cap <= 0) return 0;

        const weight = weights[idx];
        const value = values[idx];

        // 语义：我想知道“不选”的结果是多少？ (yield 挂起并去计算依赖)
        const valueIfSkip = yield [idx - 1, cap];

        let valueIfTake = -1;
        if (weight <= cap) {
            // 语义：我想知道“选了”的结果是多少？
            valueIfTake = (yield [idx - 1, cap - weight]) + value;
        }

        return Math.max(valueIfSkip, valueIfTake);
    }

    return runGeneratorDP(solve, [n - 1, capacity]);
}

/**
 * 最长公共子序列 (Generator 版)
 */
export function lcsGenerator(text1, text2) {
    function* solve(i, j) {
        if (i < 0 || j < 0) return 0;

        if (text1[i] === text2[j]) {
            // 匹配：跳到左上角
            return (yield [i - 1, j - 1]) + 1;
        } else {
            // 不匹配：探索路径
            const skipLeft = yield [i - 1, j];
            const skipRight = yield [i, j - 1];
            return Math.max(skipLeft, skipRight);
        }
    }

    return runGeneratorDP(solve, [text1.length - 1, text2.length - 1]);
}
