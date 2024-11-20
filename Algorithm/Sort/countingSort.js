/**
 * 计数排序 (Counting Sort)
 * 时间复杂度：O(n+k)，k是数据范围
 * 空间复杂度：O(k)
 * 稳定性：稳定
 * 特点：适用于已知范围的整数排序、当数据范围不大时，性能非常好
 * 方法：
 * 找出待排序数组中的最大值和最小值
 * 统计每个值出现的次数，存入计数数组
 * 根据计数数组重构排序后的数组
 */
export const countingSort = (arr) => {
    if (arr.length < 2) return arr;

    const max = Math.max(...arr);
    const min = Math.min(...arr);

    const countingArr = new Array(max - min + 1).fill(0);
    for (let i = 0; i < arr.length; i++) {
        countingArr[arr[i] - min]++;
    }

    let sortedIndex = 0;
    for (let i = 0; i < countingArr.length; i++) {
        while (countingArr[i] > 0) {
            arr[sortedIndex] = i + min;
            sortedIndex++;
            countingArr[i]--;
        }
    }
    
    return arr;
}