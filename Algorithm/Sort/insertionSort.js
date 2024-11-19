/** 
 * 插入排序 (Insertion Sort)
 * 时间复杂度：O(n²)，最好情况 O(n)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 * 特点：对于小规模数据或基本有序的数据效率较高
 * 实现原理：
 * 将数组分为已排序和未排序两部分
 * 从未排序部分取出一个元素，插入到已排序部分的正确位置
 * 初始时已排序部分只有第一个元素
 */
export const insertionSort = (arr) => {
    const length = arr.length;

    for (let i = 1; i < length; i++) {
        const current = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > current) {
            // 往后移动一个
            arr[j + 1] = arr[j]
            j--;
        }

        arr[j + 1] = current;
    }

    return arr;
}

console.log(insertionSort([1,3,2,4,12,3,44]));