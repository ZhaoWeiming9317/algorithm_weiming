import { processMonotonicStack, Strategies } from './MonotonicStack.js';

class Element {
    constructor(value, index, needsResult = true) {
        this.value = value;
        this.index = index;
        this.needsResult = needsResult;
    }
}

/**
 * 下一个更大元素 I
 */
export function nextGreaterElement(nums1, nums2) {
    const map = new Map();
    const stream = nums2.map((val, idx) => new Element(val, idx));

    processMonotonicStack(stream, {
        shouldPop: (top, current) => Strategies.NextStrictlyGreaterElement(top.value, current.value),
        onPop: (popped, previous, current) => map.set(popped.value, current.value)
    });

    return nums1.map(num => map.has(num) ? map.get(num) : -1);
}

/**
 * 下一个更大元素 II (循环数组)
 */
export function nextGreaterElements(nums) {
    const result = new Array(nums.length).fill(-1);
    const n = nums.length;

    // 构造循环流：原数组 + 原数组 (标记 needsResult 为 false)
    const stream = [
        ...nums.map((val, idx) => new Element(val, idx, true)),
        ...nums.map((val, idx) => new Element(val, idx + n, false))
    ];

    processMonotonicStack(stream, {
        shouldPop: (top, current) => Strategies.NextStrictlyGreaterElement(top.value, current.value),

        onPop: (popped, previous, current) => {
            if (popped.needsResult) {
                result[popped.index] = current.value;
            }
        }
    });

    return result;
}
