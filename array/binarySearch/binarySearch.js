/**
 * 二分查找
 * 可以参考 知乎的文章 二分查找有几种写法？它们的区别是什么？ - Jason Li的回答 - 知乎
 * https://www.zhihu.com/question/36132386/answer/530313852
 * 
 * 分为了三种分别是 < value, >= value, > value
 * 其中 bisectLeft 找到 大于等于 value 的下界值
 * e.g: 假设要找的 value 为 3
 * [0, 1, 2, 3(bisectLeft), 3, 3, 4(bisectRight), 4, 5]
 * 
 * @param {Array} array - 要查找的有序数组
 * @param {number} first - 查找范围的起始索引
 * @param {number} last - 查找范围的结束索引
 * @param {number} value - 要查找的目标值
 * @returns {number} - 返回目标值的插入位置（即 >= value 的下界）
 */
export const bisectLeft = (array, first, last, value) => {
    while (first < last) {
        const mid = first + Math.floor((last - first) / 2); // 修正 mid 的计算方式
        if (array[mid] < value) {
            first = mid + 1;
        } else {
            last = mid;
        }
    }
    return first; // last 也行，因为 [first, last) 为空的时候，它们重合
}

/**
 * bisect right, 找到大于 value 的下界值
 * @param {*} array 
 * @param {*} first 
 * @param {*} last 
 * @param {*} value 
 * @returns 
 */
export const bisectRight = (array, first, last, value) => {
    while (first < last) {
        const mid = first + Math.floor((last - first) / 2)
        if (array[mid] <= value) {
            first = mid + 1;
        } else {
            last = mid;
        }
    }
    return first;
}