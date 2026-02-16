/**
 * 温度实体/值对象
 * 封装了温度数据和比对逻辑
 */
class Temperature {
    constructor(value, index) {
        this.value = value;
        this.index = index;
    }

    // 核心领域逻辑：判断当前温度是否比另一个温度高
    isWarmerThan(other) {
        return this.value > other.value;
    }
}

import { MonotonicStack } from './MonotonicStack.js';

/**
 * 每日温度问题解决函数 - 函数式实现
 * 
 * 现在的实现：
 * 1. 不再使用 Solver 类，而是直接使用 clean function。
 * 2. 依然保持良好的封装和 DDD 风格（Temperature 实体 + MonotonicStack）。
 */
export function dailyTemperatures(rawTemperatures) {
    const n = rawTemperatures.length;
    const result = new Array(n).fill(0);

    const stack = new MonotonicStack({
        // 出栈策略：当遇到更暖和的温度时
        shouldPop: (top, current) => current.isWarmerThan(top),

        // 出栈时的业务逻辑：计算天数差并记录结果
        onPop: (popped, current) => {
            result[popped.index] = current.index - popped.index;
        }
    });

    const temperatureObjects = rawTemperatures.map((temp, index) => new Temperature(temp, index));
    stack.process(temperatureObjects);

    return result;
}

// 为了保持现有测试脚本兼容，导出别名
export const solveDailyTemperaturesDDD = dailyTemperatures;
