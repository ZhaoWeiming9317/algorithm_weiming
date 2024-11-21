export const getDigit = (num, pos) => {
    // 获取数字的位数
    const numDigits = Math.abs(num).toString().length;
    
    // 如果请求的位置超出了数字的位数，返回 null
    if (pos >= numDigits) {
        return null;
    }

    // 返回对应位置的数字
    /**
     *  Math.pow(10, i):
            i=0 时是 1
            i=1 时是 10
            i=2 时是 100
            依此类推
        num / Math.pow(10, i):
            除以对应的幂，将目标位移到个位位置
            789/1 = 789 （获取个位）
            789/10 = 78.9 （获取十位）
            789/100 = 7.89 （获取百位）
        Math.floor():
            去掉小数部分
            789 -> 789
            78.9 -> 78
            7.89 -> 7
        % 10:
            取余运算获取个位数
            789 % 10 = 9
            78 % 10 = 8
            7 % 10 = 7
     */
    return Math.floor(Math.abs(num) / Math.pow(10, pos)) % 10;
}

console.log(getDigit(789, 0));  // 9 (个位)
console.log(getDigit(789, 1));  // 8 (十位)
console.log(getDigit(789, 2));  // 7 (百位)
console.log(getDigit(789, 3));  // 7 (百位)

export const radixSort = (arr) => {
    const longest = arr.reduce((max, cur) => {
        return Math.max((cur + '').length, max);
    }, 0);

        // 对每一位进行计数排序
    for (let i = 0; i < longest; i++) {
        // 创建10个桶（0-9）
        const buckets = Array.from({ length: 10 }, () => []);
        
        // 将数字按照当前位的值放入对应的桶中
        for (const num of arr) {
            // 获取当前位的值，如果没有该位则为0
            const digit = getDigit(num, i);
            buckets[digit].push(num);
        }
        
        // 按顺序将数字从桶中取出，重新组成数组
        arr = buckets.reduce((acc, bucket) => [...acc, ...bucket], []);
    }
    
    return arr;
}

export const radixSortNegative = (arr) => {
    // 将数组分成正数和负数两部分
    const positives = arr.filter(num => num >= 0);
    const negatives = arr.filter(num => num < 0).map(num => Math.abs(num));
    
    // 获取最长的数字位数
    const maxLength = arr.reduce((max, cur) => {
        return Math.max((Math.abs(cur) + '').length, max);
    }, 0);

    // 基数排序辅助函数
    const radixSortHelper = (numbers) => {
        for (let i = 0; i < maxLength; i++) {
            const buckets = Array.from({ length: 10 }, () => []);
            
            for (const num of numbers) {
                const digit = getDigit(num, i);
                buckets[digit].push(num);
            }
            
            numbers = buckets.reduce((acc, bucket) => [...acc, ...bucket], []);
        }
        return numbers;
    }
    
    // 分别对正数和负数部分进行排序
    const sortedPositives = radixSortHelper(positives);
    const sortedNegatives = radixSortHelper(negatives);
    
    // 将负数转回负数，并反转顺序（因为我们排序的是它们的绝对值）
    const finalNegatives = sortedNegatives.map(num => -num).reverse();
    
    // 合并负数和正数部分
    return [...finalNegatives, ...sortedPositives];
}