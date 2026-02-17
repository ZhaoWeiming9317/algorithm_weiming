import { processMonotonicStack, Strategies } from './MonotonicStack.js';

/**
 * 柱子值对象
 */
class Bar {
    constructor(index, height) {
        this.index = index;
        this.height = height;
    }
}

/**
 * 接雨水 (Trapping Rain Water)
 */
export function trap(heights) {
    let totalWater = 0;
    const barStream = heights.map((h, i) => new Bar(i, h));

    processMonotonicStack(barStream, {
        // 策略：使用 NextGreaterElement (>=)
        // 只要当前高度 >= 栈顶高度，就意味着可能形成凹槽
        shouldPop: (top, current) => Strategies.NextGreaterElement(top.height, current.height),

        onPop: (popped, leftWall, rightWall) => {
            // 如果没有左边界，无法形成凹槽，直接忽略
            if (!leftWall) {
                return;
            }

            // 计算宽度: 左右边界之间的距离
            const width = rightWall.index - leftWall.index - 1;

            // 计算高度: 木桶效应，取决于左右边界中较矮的那个，减去坑底高度
            const boundedHeight = Math.min(leftWall.height, rightWall.height) - popped.height;

            // 只有当 boundedHeight > 0 时才能接水
            if (boundedHeight > 0) {
                totalWater += width * boundedHeight;
            }
        }
    });

    return totalWater;
}
