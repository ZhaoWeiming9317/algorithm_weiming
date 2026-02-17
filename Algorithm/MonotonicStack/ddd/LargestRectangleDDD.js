import { processMonotonicStack, Strategies } from './MonotonicStack.js';

class Histogram {
    constructor(index, height) {
        this.index = index;
        this.height = height;
    }
}

/**
 * 柱状图中最大的矩形 (Largest Rectangle in Histogram)
 */
export function largestRectangleArea(heights) {
    let maxArea = 0;

    // 哨兵技巧：在最后加一个高度为0的柱子，强制弹出栈中所有元素
    const histogramStream = heights.map((h, i) => new Histogram(i, h));
    histogramStream.push(new Histogram(heights.length, 0));

    processMonotonicStack(histogramStream, {
        // 策略：单调递增栈，遇到更矮的就弹 (Strictly Less)
        shouldPop: (top, current) => Strategies.NextStrictlyLessElement(top.height, current.height),

        onPop: (popped, previous, current) => {
            const leftIndex = previous ? previous.index : -1;
            const rightIndex = current.index;
            const width = rightIndex - leftIndex - 1;
            const area = width * popped.height;
            maxArea = Math.max(maxArea, area);
        }
    });

    return maxArea;
}
