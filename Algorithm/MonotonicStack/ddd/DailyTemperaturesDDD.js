import { processMonotonicStack, Strategies } from './MonotonicStack.js';

class Temperature {
    constructor(dateIndex, value) {
        this.index = dateIndex;
        this.value = value;
    }
}

/**
 * 每日温度 (Daily Temperatures)
 */
export function solveDailyTemperaturesDDD(temperatures) {
    const result = new Array(temperatures.length).fill(0);
    const stream = temperatures.map((t, i) => new Temperature(i, t));

    processMonotonicStack(stream, {
        // 策略：寻找下一个严格更高的 (Strictly Greater)
        shouldPop: (top, current) => Strategies.NextStrictlyGreaterElement(top.value, current.value),

        // 业务逻辑：计算天数差
        onPop: (popped, previous, current) => {
            const daysWait = current.index - popped.index;
            result[popped.index] = daysWait;
        }
    });

    return result;
}
