import { MonotonicStack } from './MonotonicStack.js';

/**
 * 矩形值对象
 * 封装了面积计算逻辑
 */
class Rect {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    get area() {
        return this.height * this.width;
    }
}

/**
 * 柱状图聚合根 (Aggregate Root)
 * 封装了柱子的集合以及基于集合的计算逻辑（如计算两个柱子之间的宽度）
 */
class Histogram {
    constructor(heights) {
        this.heights = heights;
    }

    /**
     * 获取指定位置的柱子高度
     * @param {number} index 
     * @returns {number}
     */
    getHeight(index) {
        return this.heights[index];
    }

    /**
     * 核心领域逻辑：计算由 index 处的柱子作为高度，leftIndex 和 rightIndex 之间形成的矩形
     * 
     * @param {number} barIndex - 作为高度的柱子索引
     * @param {number} leftIndex - 左边第一个比它矮的柱子索引（开区间）
     * @param {number} rightIndex - 右边第一个比它矮的柱子索引（开区间）
     * @returns {Rect}
     */
    calculateRect(barIndex, leftIndex, rightIndex) {
        const height = this.getHeight(barIndex);

        // 领域逻辑：宽度的计算规则封装在这里，而不是散落在外部
        // 宽度 = (right - 1) - (left + 1) + 1 = right - left - 1
        const width = rightIndex - leftIndex - 1;

        return new Rect(height, width);
    }

    /**
     * 生成用于单调栈处理的元素流
     * 包含所有柱子 + 一个高度为0的哨兵
     */
    *elements() {
        for (let i = 0; i < this.heights.length; i++) {
            yield { height: this.heights[i], index: i };
        }
        // 哨兵
        yield { height: 0, index: this.heights.length };
    }
}

/**
 * 柱状图中最大的矩形 - 基于领域模型的实现
 */
export function largestRectangleArea(heights) {
    let maxArea = 0;
    const histogram = new Histogram(heights);

    const stack = new MonotonicStack({
        // 出栈策略：当当前高度 < 栈顶高度
        shouldPop: (top, current) => current.height < top.height,

        // 出栈时的业务逻辑
        onPop: (popped, current) => {
            // 左边界：栈顶元素的索引（如果栈为空，说明左边没有比它矮的，延伸到 -1）
            const leftIndex = stack.isEmpty() ? -1 : stack.peek().index;
            // 右边界：当前元素的索引
            const rightIndex = current.index;

            // 委托给 Histogram 聚合根计算矩形
            // 现在的语义是：“请求直方图计算由 popped 柱子支撑的最大矩形”
            const rect = histogram.calculateRect(popped.index, leftIndex, rightIndex);

            maxArea = Math.max(maxArea, rect.area);
        }
    });

    // 处理直方图生成的元素流
    // MonotonicStack 需要支持 Iterable
    // (由于我们之前只写的 process 支持数组，这里稍微变通一下或者修改 MonotonicStack)
    // 为了不修改 MonotonicStack 的 process 签名（它目前用 forEach），我们先转成数组
    // 或者我们在此处迭代调用 push

    // 这里我们直接迭代，因为 Histogram.elements 是个生成器
    for (const element of histogram.elements()) {
        stack.push(element);
    }

    return maxArea;
}
