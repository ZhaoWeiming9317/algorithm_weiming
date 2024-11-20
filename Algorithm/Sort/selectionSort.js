/**
 * 选择排序 (Selection Sort)
 * 也可以叫做 选择最小值排序
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 * 稳定性：不稳定
 * 特点：交换次数少
 * 实现原理：
 * 每次从未排序区间找到最小的元素
 * 将其放到已排序区间的末尾
 * 重复这个过程直到所有元素都排序完成
 */
export const selectionSort = (arr) => {
    let length = arr.length;

    for (let i = 0; i < length; i++) {
        let minIdx = i;
        for (let j = i; j < length; j++) {
            if (arr[minIdx] > arr[j]) {
                minIdx = j;
            }
        }
        [arr[minIdx], arr[i]] = [arr[i], arr[minIdx]]
    }

    return arr;
}

console.log(selectionSort([1,3,2,4,12,3,44]));