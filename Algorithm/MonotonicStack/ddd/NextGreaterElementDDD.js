import { MonotonicStack } from './MonotonicStack.js';

/**
 * 普通序列生成器
 * @yields {{value: number, index: number}}
 */
function* sequence(nums) {
    for (let i = 0; i < nums.length; i++) {
        yield { value: nums[i], index: i };
    }
}

/**
 * 循环序列生成器 (Domain Service / Factory)
 * 封装了"环形数组"的遍历逻辑
 * @yields {{value: number, index: number, needsResult: boolean}}
 */
function* circularSequence(nums) {
    const n = nums.length;
    // 第一遍：需要记录结果
    for (let i = 0; i < n; i++) {
        yield { value: nums[i], index: i, needsResult: true };
    }
    // 第二遍：仅作为辅助寻找更大的值
    for (let i = 0; i < n; i++) {
        yield { value: nums[i], index: i + n, needsResult: false };
    }
}

/**
 * 下一个更大元素 I
 * 使用 Map 作为存储介质，对象字面量作为元素，保持只读性和简洁性
 */
export function nextGreaterElement(nums1, nums2) {
    const map = new Map();

    const stack = new MonotonicStack({
        shouldPop: (top, current) => current.value > top.value,
        onPop: (popped, current) => map.set(popped.value, current.value)
    });

    // 使用生成器驱动流式处理
    for (const item of sequence(nums2)) {
        stack.push(item);
    }

    return nums1.map(num => map.has(num) ? map.get(num) : -1);
}

/**
 * 下一个更大元素 II (循环数组)
 * 使用 Generator 封装复杂的遍历逻辑
 */
export function nextGreaterElements(nums) {
    const result = new Array(nums.length).fill(-1);

    const stack = new MonotonicStack({
        shouldPop: (top, current) => current.value > top.value,
        onPop: (popped, current) => {
            // 逻辑内聚在数据属性中
            if (popped.needsResult) {
                result[popped.index] = current.value;
            }
        }
    });

    // 使用生成器驱动
    for (const element of circularSequence(nums)) {
        stack.push(element);
    }

    return result;
}
