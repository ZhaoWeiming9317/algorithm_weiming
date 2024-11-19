/**
 * 冒泡排序 (Bubble Sort)
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 * 特点：简单但效率较低
 * 实现原理：
 * 相邻元素两两比较
 * 大的元素像泡泡一样"浮"到后面
 * 每一轮都会将当前最大的元素放到正确位置
 */
export const bubbleSort = (arr) => {
    const length = arr.length;

    for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }

    return arr;
}

console.log(bubbleSort([1,3,2,4,12,3,44]));