/**
 * 组合问题：可以取重复值 vs 不可以取重复值
 * 演示 backtrack(i) 和 backtrack(i + 1) 的区别
 */

console.log('='.repeat(70));
console.log('组合问题：可以取重复值 vs 不可以取重复值');
console.log('='.repeat(70));

// ==================== 情况1：不可以取重复值（i + 1）====================

console.log('\n【情况1】不可以取重复值 - 每个数字只能用一次\n');

function combineNoRepeat(n, k) {
    const result = [];
    let callCount = 0;
    
    function backtrack(start, path, depth = 0) {
        const indent = '  '.repeat(depth);
        callCount++;
        
        console.log(`${indent}第${callCount}次调用: start=${start}, path=[${path}]`);
        
        if (path.length === k) {
            result.push([...path]);
            console.log(`${indent}✅ 找到组合: [${path}]`);
            return;
        }
        
        console.log(`${indent}开始遍历 i=${start} 到 ${n}`);
        
        for (let i = start; i <= n; i++) {
            console.log(`${indent}  → 选择 ${i}`);
            path.push(i);
            
            // ⭐ 关键：i + 1，意味着下次不能再用当前数字
            console.log(`${indent}  递归调用 backtrack(${i + 1}, [${path}])`);
            backtrack(i + 1, path, depth + 1);
            
            path.pop();
            console.log(`${indent}  ← 撤销 ${i}`);
        }
    }
    
    backtrack(1, []);
    return result;
}

console.log('输入: n=4, k=2 (从1到4中选2个数)\n');
const result1 = combineNoRepeat(4, 2);
console.log(`\n最终结果 (共${result1.length}个):`);
result1.forEach((combo, i) => {
    console.log(`  ${i + 1}. [${combo}]`);
});

console.log('\n注意：结果中没有 [1,1]、[2,2] 等重复数字的组合！');

// ==================== 情况2：可以取重复值（i）====================

console.log('\n' + '='.repeat(70));
console.log('\n【情况2】可以取重复值 - 每个数字可以无限次使用\n');

function combinationSumRepeat(candidates, target) {
    const result = [];
    let callCount = 0;
    
    function backtrack(start, path, sum, depth = 0) {
        const indent = '  '.repeat(depth);
        callCount++;
        
        console.log(`${indent}第${callCount}次调用: start=${start}, path=[${path}], sum=${sum}`);
        
        if (sum === target) {
            result.push([...path]);
            console.log(`${indent}✅ 找到组合: [${path}], sum=${sum}`);
            return;
        }
        
        if (sum > target) {
            console.log(`${indent}❌ 剪枝: sum=${sum} > target=${target}`);
            return;
        }
        
        console.log(`${indent}开始遍历 i=${start} 到 ${candidates.length - 1}`);
        
        for (let i = start; i < candidates.length; i++) {
            console.log(`${indent}  → 选择 candidates[${i}]=${candidates[i]}`);
            path.push(candidates[i]);
            
            // ⭐ 关键：i，意味着下次还可以继续用当前数字
            console.log(`${indent}  递归调用 backtrack(${i}, [${path}], ${sum + candidates[i]})`);
            backtrack(i, path, sum + candidates[i], depth + 1);
            
            path.pop();
            console.log(`${indent}  ← 撤销 ${candidates[i]}`);
        }
    }
    
    backtrack(0, [], 0);
    return result;
}

console.log('输入: candidates=[2,3,6,7], target=7\n');
const result2 = combinationSumRepeat([2, 3, 6, 7], 7);
console.log(`\n最终结果 (共${result2.length}个):`);
result2.forEach((combo, i) => {
    const sum = combo.reduce((a, b) => a + b, 0);
    console.log(`  ${i + 1}. [${combo}], sum=${sum}`);
});

console.log('\n注意：结果中有 [2,2,3]，因为数字可以重复使用！');

// ==================== 对比决策树 ====================

console.log('\n' + '='.repeat(70));
console.log('\n【决策树对比】\n');

console.log('情况1：不可重复（i + 1）- candidates=[2,3], k=2');
console.log(`
                    []                    start=0
                ┌────┴────┐
            选2(start=1) 选3(start=2)
                ↓         ↓
           path=[2]    path=[3]
                ↓         
            选3(start=2)  
                ↓         
             [2,3]✓       
             
注意：选了2后，start变成1，只能选3，不能再选2
所以不会出现 [2,2] 的组合
`);

console.log('情况2：可以重复（i）- candidates=[2,3], target=6');
console.log(`
                      []                    start=0, sum=0
                  ┌────┴────┐
            选2(start=0)  选3(start=1)
                  ↓           ↓
            path=[2]      path=[3]
              sum=2         sum=3
            ┌──┴──┐          ↓
      选2(0) 选3(1)      选3(1)
         ↓      ↓           ↓
    path=[2,2] [2,3]    path=[3,3]
      sum=4    sum=5      sum=6✓
      ↓        (>6剪枝)
  选2(0)
      ↓
  [2,2,2]
   sum=6✓
   
注意：选了2后，start还是0，可以继续选2
所以会出现 [2,2,2]、[3,3] 的组合
`);

// ==================== 错误示例演示 ====================

console.log('\n' + '='.repeat(70));
console.log('\n【常见错误演示】\n');

// 错误1：应该可以重复，但用了 i + 1
function combinationSumWrong(candidates, target) {
    const result = [];
    
    function backtrack(start, path, sum) {
        if (sum === target) {
            result.push([...path]);
            return;
        }
        if (sum > target) return;
        
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            // ❌ 错误：用了 i + 1
            backtrack(i + 1, path, sum + candidates[i]);
            path.pop();
        }
    }
    
    backtrack(0, [], 0);
    return result;
}

console.log('❌ 错误示例1：应该可以重复，但用了 i + 1');
console.log('输入: [2,3,6,7], target=7');
const wrongResult1 = combinationSumWrong([2, 3, 6, 7], 7);
console.log(`结果: [${wrongResult1.map(r => `[${r}]`)}]`);
console.log('问题：漏掉了 [2,2,3]，因为选了2后不能再选2\n');

// 错误2：应该不可以重复，但用了 i
function combineWrong(n, k) {
    const result = [];
    
    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        // 限制一下递归深度，避免无限递归
        if (path.length > k) return;
        
        for (let i = start; i <= n; i++) {
            path.push(i);
            // ❌ 错误：用了 i
            backtrack(i, path);
            path.pop();
        }
    }
    
    backtrack(1, []);
    return result;
}

console.log('❌ 错误示例2：应该不可以重复，但用了 i');
console.log('输入: n=3, k=2');
const wrongResult2 = combineWrong(3, 2);
console.log(`结果: [${wrongResult2.map(r => `[${r}]`)}]`);
console.log('问题：出现了 [1,1]、[2,2]、[3,3]，但这些不应该出现\n');

// ==================== 总结表格 ====================

console.log('='.repeat(70));
console.log('\n【总结对比表】\n');

console.log('┌──────────────┬────────────────┬────────────────┐');
console.log('│    特性      │   不可重复     │   可以重复     │');
console.log('├──────────────┼────────────────┼────────────────┤');
console.log('│  递归参数    │ backtrack(i+1) │ backtrack(i)   │');
console.log('├──────────────┼────────────────┼────────────────┤');
console.log('│  含义        │ 下次从i+1开始  │ 下次从i开始    │');
console.log('├──────────────┼────────────────┼────────────────┤');
console.log('│  典型题目    │ 组合、子集     │ 组合总和       │');
console.log('├──────────────┼────────────────┼────────────────┤');
console.log('│  LeetCode    │ 77, 78, 90     │ 39, 216        │');
console.log('├──────────────┼────────────────┼────────────────┤');
console.log('│  示例结果    │ [1,2], [1,3]   │ [2,2,3]        │');
console.log('├──────────────┼────────────────┼────────────────┤');
console.log('│  是否有重复  │ 否             │ 是             │');
console.log('└──────────────┴────────────────┴────────────────┘');

console.log('\n【判断方法】');
console.log(`
1. 看题目关键字：
   - "每个数字只能用一次" → 用 i + 1
   - "可以无限次使用" → 用 i
   - "可以重复选取" → 用 i

2. 看示例输出：
   - 有 [2,2,3] 这样的重复 → 用 i
   - 没有重复数字 → 用 i + 1

3. 记忆口诀：
   - i + 1：此数用完，下次从下一个开始
   - i    ：此数还能用，下次还从我开始
`);

// ==================== 实际题目示例 ====================

console.log('='.repeat(70));
console.log('\n【实际题目示例】\n');

console.log('1. LeetCode 77 - 组合（不可重复）');
console.log('   题目：给定两个整数 n 和 k，返回 1...n 中所有可能的 k 个数的组合');
console.log('   关键：每个数字只能用一次');
console.log('   代码：backtrack(i + 1, [...path, i])');
console.log('   示例：n=4, k=2 → [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]');

console.log('\n2. LeetCode 39 - 组合总和（可以重复）');
console.log('   题目：给定一个无重复元素的数组和一个目标数');
console.log('   关键：同一个数字可以无限制重复被选取');
console.log('   代码：backtrack(i, [...path, candidates[i]], sum)');
console.log('   示例：[2,3,6,7], target=7 → [[2,2,3],[7]]');

console.log('\n3. LeetCode 40 - 组合总和 II（不可重复，但数组有重复）');
console.log('   题目：给定一个可能有重复元素的数组和一个目标数');
console.log('   关键：每个数字在每个组合中只能使用一次');
console.log('   代码：backtrack(i + 1, [...path, candidates[i]], sum)');
console.log('   示例：[10,1,2,7,6,1,5], target=8 → [[1,1,6],[1,2,5],[1,7],[2,6]]');

console.log('\n' + '='.repeat(70));
console.log('\n✨ 记住：i 还是 i+1，取决于题目要求能否重复使用！');
console.log('='.repeat(70));

