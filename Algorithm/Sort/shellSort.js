/**
 * 希尔排序
 * 插入排序的不稳定版本
 * 时间复杂度：平均 O(nlogn)，最坏 O(n²)
 * 空间复杂度：O(1)
 * 稳定性：不稳定
 * 特点：插入排序的改进版本
 */
export const shellSort = (arr) => {
    const length = arr.length;
    const gap = Math.floor(length / 2);

    while (gap > 0) {
        for (let i = gap; i < length; i++) {
            const current = arr[i];
            let j = i - gap;

            while (j >= 0 && arr[j] > temp) {
                arr[j + gap] = arr[j];
                j -= gap;
            }
            
            arr[j + gap] = current;
        }
        gap = Math.floor(gap / 2);
    }
    return arr;
}

// shell 排序其实就是特殊的插入排序，然后利用 gap 来插入排序。
// 先将整个待排序序列分割成若干子序列分别进行插入排序，待整个序列"基本有序"时，再对全体记录进行一次直接插入排序。
const insertionSort = (arr, gap = 1) => {
    const length = arr.length;

    for (let i = gap; i < length; i++) {
        // 此时的基准点
        const current = arr[i];
        // 开始判断前面的值
        let j = i - gap;

        // 直到判断到第一个值
        while (j >= 0 && arr[j] > current) {
            // 往后移动一个
            arr[j + gap] = arr[j]
            j--;
        }

        arr[j + gap] = current;
    }

    return arr;
}