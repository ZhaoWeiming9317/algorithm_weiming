/**
 *  归并排序 (Merge Sort)
 *  时间复杂度：O(nlogn)
 *  空间复杂度：O(n)
 *  稳定性：稳定
 *  特点：稳定的排序算法，适合大数据量
 */
export const mergeSort = (arr) => {
    const merge = (left, right) => {
        let l = 0;
        let r = 0;
        let result = [];
        while (l < left.length && r < right.length) {
            if (left[l] < right[r]) {
                result.push(left[l]);
                l++;
            } else {
                result.push(right[r]);
                r++;
            }

        }
        return [...result, ...left.slice(l), ...right.slice(r)];
    }

    const split = (arr) => {
        if (arr.length <= 1) {
            return arr;
        }

        const mid = Math.floor(arr.length / 2);
        const left = split(arr.slice(0, mid));
        const right = split(arr.slice(mid));

        return merge(left, right);
    }

    return split(arr);
}

// 和快排的区别是，快排：先处理（partition），再递归；归并：先递归，再处理（merge）

console.log(mergeSort([1,3,2,4,12,3,44]));