/**
 * 可视化 path 数组的变化过程
 * 演示为什么 path.pop() 保证了不会混乱
 */

function generateParenthesisWithPathVisualization(n) {
    const result = [];
    const path = [];
    let step = 0;
    
    function backtrack(left, right, depth) {
        step++;
        const indent = '  '.repeat(depth);
        const currentStep = step;
        
        console.log(`${indent}[步骤${currentStep}] 调用 backtrack(${left}, ${right})`);
        console.log(`${indent}         path = [${path.map(x => `'${x}'`).join(', ')}]`);
        
        // 终止条件
        if (left === n && right === n) {
            console.log(`${indent}         ✅ 收集结果: "${path.join('')}"`);
            result.push(path.join(''));
            return;
        }
        
        // 剪枝
        if (right > left) {
            console.log(`${indent}         ❌ 剪枝 (right > left)`);
            return;
        }
        
        // 选择1：添加左括号
        if (left < n) {
            console.log(`${indent}         → 尝试添加 '('`);
            path.push('(');
            console.log(`${indent}           做选择后: path = [${path.map(x => `'${x}'`).join(', ')}]`);
            
            backtrack(left + 1, right, depth + 1);
            
            path.pop();
            console.log(`${indent}         ← 撤销 '('`);
            console.log(`${indent}           撤销后: path = [${path.map(x => `'${x}'`).join(', ')}]`);
        }
        
        // 选择2：添加右括号
        if (right < left) {
            console.log(`${indent}         → 尝试添加 ')'`);
            path.push(')');
            console.log(`${indent}           做选择后: path = [${path.map(x => `'${x}'`).join(', ')}]`);
            
            backtrack(left, right + 1, depth + 1);
            
            path.pop();
            console.log(`${indent}         ← 撤销 ')'`);
            console.log(`${indent}           撤销后: path = [${path.map(x => `'${x}'`).join(', ')}]`);
        }
        
        console.log(`${indent}[步骤${currentStep}] 结束 backtrack(${left}, ${right})`);
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`生成 ${n} 对括号的详细过程（观察 path 数组的变化）`);
    console.log(`${'='.repeat(60)}\n`);
    
    backtrack(0, 0, 0);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`最终结果: [${result.map(x => `"${x}"`).join(', ')}]`);
    console.log(`${'='.repeat(60)}\n`);
    
    return result;
}

// 运行演示
generateParenthesisWithPathVisualization(2);

// ============================================================
// 对比：如果没有 pop() 会怎样
// ============================================================

console.log('\n\n');
console.log('*'.repeat(60));
console.log('❌ 对比：如果没有 path.pop() 会发生什么？');
console.log('*'.repeat(60));

function generateParenthesisWithoutPop(n) {
    const result = [];
    const path = [];
    let step = 0;
    
    function backtrack(left, right, depth) {
        step++;
        const indent = '  '.repeat(depth);
        
        console.log(`${indent}[步骤${step}] backtrack(${left}, ${right})`);
        console.log(`${indent}        path = [${path.map(x => `'${x}'`).join(', ')}]`);
        
        if (left === n && right === n) {
            console.log(`${indent}        ✅ 收集: "${path.join('')}"`);
            result.push(path.join(''));
            return;
        }
        
        if (right > left) {
            console.log(`${indent}        ❌ 剪枝`);
            return;
        }
        
        if (left < n) {
            console.log(`${indent}        → 添加 '('`);
            path.push('(');
            console.log(`${indent}          path = [${path.map(x => `'${x}'`).join(', ')}]`);
            backtrack(left + 1, right, depth + 1);
            // ❌ 没有 path.pop()
        }
        
        if (right < left) {
            console.log(`${indent}        → 添加 ')'`);
            path.push(')');
            console.log(`${indent}          path = [${path.map(x => `'${x}'`).join(', ')}]`);
            backtrack(left, right + 1, depth + 1);
            // ❌ 没有 path.pop()
        }
        
        console.log(`${indent}[步骤${step}] 结束 (path 没有恢复！)`);
    }
    
    backtrack(0, 0, 0);
    
    console.log(`\n❌ 最终结果: [${result.map(x => `"${x}"`).join(', ')}]`);
    console.log(`⚠️  注意：path 数组从未恢复，所以只能生成一条路径！\n`);
    
    return result;
}

generateParenthesisWithoutPop(2);

// ============================================================
// 总结
// ============================================================

console.log('\n' + '='.repeat(60));
console.log('📚 总结');
console.log('='.repeat(60));
console.log(`
✅ 有 path.pop()：
   - path 在每次递归后都会恢复
   - 可以探索所有可能的路径
   - 结果：["(())", "()()"]

❌ 没有 path.pop()：
   - path 一直在增长，从不恢复
   - 只能探索一条路径（第一条）
   - 结果：["(())"] （少了 "()()"）

🎯 关键：path.pop() 就像"后悔药"，让你可以回到过去重新选择！
`);

