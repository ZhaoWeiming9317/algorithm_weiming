/**
 * 回溯三大类型：快速对照表
 * 通过代码直接对比，理解它们的区别
 */

// ============================================
// 类型1：电话号码字母组合（纵向递进）
// ============================================
function letterCombinations(digits) {
    if (!digits) return [];
    
    const phoneMap = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    };
    
    const result = [];
    const path = [];
    
    // ✅ 参数：index（处理第几个数字）
    function backtrack(index) {
        // 终止：处理完所有数字
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }
        
        // 获取当前数字对应的字母
        const letters = phoneMap[digits[index]];
        
        for (let letter of letters) {
            path.push(letter);
            backtrack(index + 1);  // ✅ index+1：移动到下一个数字位置
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
}

// ============================================
// 类型2：组合（横向选择，start控制）
// ============================================

// 2.1 每个数只能用一次
function combine(n, k) {
    const result = [];
    const path = [];
    
    // ✅ 参数：start（从哪个数开始选）
    function backtrack(start) {
        // 终止：选够k个数
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        // ✅ 从start开始遍历
        for (let i = start; i <= n; i++) {
            path.push(i);
            backtrack(i + 1);  // ✅ i+1：下一层只能选更大的数
            path.pop();
        }
    }
    
    backtrack(1);
    return result;
}

// 2.2 每个数可以重复用
function combinationSum(candidates, target) {
    const result = [];
    const path = [];
    
    function backtrack(start, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        if (sum > target) return;
        
        // ✅ 从start开始遍历
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            backtrack(i, sum + candidates[i]);  // ✅ 传i：可以重复选当前数
            path.pop();
        }
    }
    
    backtrack(0, 0);
    return result;
}

// 2.3 有重复元素需要去重
function combinationSum2(candidates, target) {
    const result = [];
    const path = [];
    
    // ✅ 先排序，让相同元素相邻
    candidates.sort((a, b) => a - b);
    
    function backtrack(start, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        if (sum > target) return;
        
        for (let i = start; i < candidates.length; i++) {
            // ✅ 去重：同一层级跳过重复元素
            if (i > start && candidates[i] === candidates[i - 1]) {
                continue;
            }
            
            path.push(candidates[i]);
            backtrack(i + 1, sum + candidates[i]);
            path.pop();
        }
    }
    
    backtrack(0, 0);
    return result;
}

// ============================================
// 类型3：排列（横向选择，used控制）
// ============================================

// 3.1 无重复元素
function permute(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);  // ✅ 使用used数组
    
    // ❌ 没有start参数
    function backtrack() {
        // 终止：用完所有数
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        // ✅ 每次都从0开始遍历全部
        for (let i = 0; i < nums.length; i++) {
            // ✅ 跳过已使用的
            if (used[i]) continue;
            
            path.push(nums[i]);
            used[i] = true;
            backtrack();  // ✅ 不传参数，每次都全遍历
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

// 3.2 有重复元素需要去重
function permuteUnique(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);
    
    // ✅ 先排序
    nums.sort((a, b) => a - b);
    
    function backtrack() {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            // ✅ 去重：相同元素必须按顺序使用
            // 如果当前元素 = 前一个元素，且前一个未使用，跳过
            if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) {
                continue;
            }
            
            path.push(nums[i]);
            used[i] = true;
            backtrack();
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}

// ============================================
// 测试对比
// ============================================

console.log('====== 1. 电话号码字母组合 ======');
console.log('输入: "23"');
console.log('输出:', letterCombinations("23"));
console.log('解释: 纵向递进，处理每个数字位置\n');

console.log('====== 2. 组合 ======');
console.log('输入: n=4, k=2');
console.log('输出:', combine(4, 2));
console.log('解释: [1,2]和[2,1]是同一个组合，所以只有[1,2]\n');

console.log('====== 3. 组合（可重复） ======');
console.log('输入: [2,3,6,7], target=7');
console.log('输出:', combinationSum([2, 3, 6, 7], 7));
console.log('解释: 可以有[2,2,3]，因为2可以重复使用\n');

console.log('====== 4. 组合（去重） ======');
console.log('输入: [10,1,2,7,6,1,5], target=8');
console.log('输出:', combinationSum2([10, 1, 2, 7, 6, 1, 5], 8));
console.log('解释: 输入有两个1，但结果中相同的组合只出现一次\n');

console.log('====== 5. 排列 ======');
console.log('输入: [1,2,3]');
console.log('输出:', permute([1, 2, 3]));
console.log('解释: [1,2,3]和[1,3,2]是不同的排列\n');

console.log('====== 6. 排列（去重） ======');
console.log('输入: [1,1,2]');
console.log('输出:', permuteUnique([1, 1, 2]));
console.log('解释: 输入有两个1，但重复的排列只出现一次\n');

// ============================================
// 快速判断表
// ============================================

console.log(`
┌─────────────────────────────────────────────────────────────────┐
│                         快速判断表                               │
├─────────────────────────────────────────────────────────────────┤
│ 特征            组合              排列              电话号码     │
├─────────────────────────────────────────────────────────────────┤
│ 是否考虑顺序    ❌ 不考虑          ✅ 考虑          ✅ 考虑      │
│ 参数            start             无                index        │
│ 循环起点        i = start         i = 0            遍历字母      │
│ 递归调用        (i+1) 或 (i)      ()               (index+1)    │
│ 防重复机制      start参数          used[]           无需防重     │
│ 去重条件        i>start           !used[i-1]       无重复       │
│                                                                   │
│ 示例结果对比（从[1,2,3]选2个）：                                 │
│ 组合: [1,2], [1,3], [2,3]                           (3个)      │
│ 排列: [1,2], [1,3], [2,1], [2,3], [3,1], [3,2]     (6个)      │
└─────────────────────────────────────────────────────────────────┘
`);

