/**
 * 快速排序 (Quick Sort)
 * 时间复杂度：平均 O(nlogn)，最坏 O(n²)
 * 空间复杂度：O(logn)
 * 稳定性：不稳定
 * 特点：实际应用中最常用的排序算法之一
 */
export const quickSort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr[pivotIndex];

    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
        if (i === pivotIndex) continue; // 跳过基准值
        
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

// 原地版本
/**
 * [小于等于pivot的区域 | 大于pivot的区域 | 未处理区域]
     ↑                   ↑                ↑
   0...i              i+1...j-1          j...right-1
 */
export const quickSortInPlace = (arr, left = 0, right = arr.length - 1) => {
    if (left < right) {
        return arr;
    }

    const partition = (arr, left, right) => {
        const pivot = arr[right]; // 选择最右边的值作为基准值
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (arr[j] < pivot) {
                i++; // 扩展小于 pivot 的区域空间
                [arr[i], arr[j]] = [arr[j], arr[i]];  // 将当前元素交换到小于区域
            }
        }

        // 将基准值放到正确位置（i+1）
        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        return i + 1;  // 返回基准值的最终位置        
    }

    const pivotIndex = partition(arr, left, right);
    // 递归处理基准值左右两边的子数组
    quickSortInPlace(arr, left, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, right);
    
    return arr;
}