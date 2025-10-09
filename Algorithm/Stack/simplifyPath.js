/**
 * 71. 简化路径
 * 难度：中等
 * 
 * 题目描述：
 * 给你一个字符串 path，表示指向某一文件或目录的 Unix 风格 绝对路径（以 '/' 开头），
 * 请你将其转化为更加简洁的规范路径。
 * 
 * Unix 风格的路径规则：
 * - 一个点 '.' 表示当前目录本身
 * - 两个点 '..' 表示将目录切换到上一级（指向父目录）
 * - 任意多个连续的斜杠（即 '//' 或 '///'）都被视为单个斜杠 '/'
 * - 任何其他格式的点（例如 '...' 或 '....'）均被视为有效的文件/目录名称
 * 
 * 规范路径应该符合以下格式：
 * - 始终以斜杠 '/' 开头
 * - 两个目录名之间必须只有一个斜杠 '/'
 * - 最后一个目录名（如果存在）不能以 '/' 结尾
 * - 规范路径不包含 '.' 或 '..' 目录
 * 
 * 示例：
 * 输入：path = "/home/"
 * 输出："/home"
 * 
 * 输入：path = "/home//foo/"
 * 输出："/home/foo"
 * 
 * 输入：path = "/home/user/Documents/../Pictures"
 * 输出："/home/user/Pictures"
 * 
 * 输入：path = "/../"
 * 输出："/"
 * 
 * 输入：path = "/.../a/../b/c/../d/./"
 * 输出："/.../b/d"
 */

/**
 * 方法：栈
 * 
 * 思路：
 * 1. 将路径按 '/' 分割成多个部分
 * 2. 遍历每个部分：
 *    - 如果是 '..' 且栈不为空，弹出栈顶（返回上级目录）
 *    - 如果是 '.' 或空字符串，跳过（当前目录或连续斜杠）
 *    - 其他情况，入栈（有效的目录名）
 * 3. 将栈中的元素用 '/' 连接，前面加上 '/'
 * 
 * 时间复杂度：O(n)，n 是路径长度
 * 空间复杂度：O(n)，栈的空间
 */
function simplifyPath(path) {
  const stack = [];
  
  // 按 '/' 分割路径
  const parts = path.split('/');
  
  for (const part of parts) {
    // 情况1：'..' 返回上级目录
    if (part === '..') {
      if (stack.length > 0) {
        stack.pop();
      }
    }
    // 情况2：'.' 或空字符串，跳过
    else if (part === '.' || part === '') {
      continue;
    }
    // 情况3：有效的目录名，入栈
    else {
      stack.push(part);
    }
  }
  
  // 拼接结果
  return '/' + stack.join('/');
}

/**
 * 方法2：一次遍历（优化版）
 * 
 * 思路：直接遍历字符串，手动处理每个部分
 */
function simplifyPath2(path) {
  const stack = [];
  let i = 0;
  const n = path.length;
  
  while (i < n) {
    // 跳过连续的 '/'
    while (i < n && path[i] === '/') {
      i++;
    }
    
    // 提取目录名
    let start = i;
    while (i < n && path[i] !== '/') {
      i++;
    }
    
    const part = path.slice(start, i);
    
    if (part === '..') {
      // 返回上级目录
      if (stack.length > 0) {
        stack.pop();
      }
    } else if (part && part !== '.') {
      // 有效的目录名
      stack.push(part);
    }
  }
  
  return '/' + stack.join('/');
}

// ==================== 测试用例 ====================

console.log('=== 测试用例 ===\n');

// 测试1：基本情况
console.log('测试1：基本情况');
console.log('输入："/home/"');
console.log('输出：', simplifyPath('/home/'));
console.log('期望："/home"\n');

// 测试2：连续斜杠
console.log('测试2：连续斜杠');
console.log('输入："/home//foo/"');
console.log('输出：', simplifyPath('/home//foo/'));
console.log('期望："/home/foo"\n');

// 测试3：返回上级目录
console.log('测试3：返回上级目录');
console.log('输入："/home/user/Documents/../Pictures"');
console.log('输出：', simplifyPath('/home/user/Documents/../Pictures'));
console.log('期望："/home/user/Pictures"\n');

// 测试4：根目录的上级
console.log('测试4：根目录的上级');
console.log('输入："/../"');
console.log('输出：', simplifyPath('/../'));
console.log('期望："/"\n');

// 测试5：复杂情况
console.log('测试5：复杂情况');
console.log('输入："/.../a/../b/c/../d/./"');
console.log('输出：', simplifyPath('/.../a/../b/c/../d/./'));
console.log('期望："/.../b/d"\n');

// 测试6：多个 '..'
console.log('测试6：多个 ".."');
console.log('输入："/a/b/c/../../.."');
console.log('输出：', simplifyPath('/a/b/c/../../..'));
console.log('期望："/"\n');

// 测试7：只有 '/'
console.log('测试7：只有 "/"');
console.log('输入："/"');
console.log('输出：', simplifyPath('/'));
console.log('期望："/"\n');

// 测试8：'...' 是有效目录名
console.log('测试8："..." 是有效目录名');
console.log('输入："/a/./b/../../c/"');
console.log('输出：', simplifyPath('/a/./b/../../c/'));
console.log('期望："/c"\n');

// 测试9：复杂路径
console.log('测试9：复杂路径');
console.log('输入："/a//b////c/d//././/.."');
console.log('输出：', simplifyPath('/a//b////c/d//././/..'));
console.log('期望："/a/b/c"\n');

// ==================== 详细解析 ====================

console.log('\n=== 详细解析 ===\n');

/**
 * 示例：path = "/a/./b/../../c/"
 * 
 * 步骤1：分割路径
 * parts = ['', 'a', '.', 'b', '..', '..', 'c', '']
 * 
 * 步骤2：遍历处理
 * 
 * i=0: part='' (空)     → 跳过          stack=[]
 * i=1: part='a'         → 入栈          stack=['a']
 * i=2: part='.'         → 跳过          stack=['a']
 * i=3: part='b'         → 入栈          stack=['a', 'b']
 * i=4: part='..'        → 弹出 'b'      stack=['a']
 * i=5: part='..'        → 弹出 'a'      stack=[]
 * i=6: part='c'         → 入栈          stack=['c']
 * i=7: part='' (空)     → 跳过          stack=['c']
 * 
 * 步骤3：拼接结果
 * result = '/' + ['c'].join('/') = '/c'
 */

function simplifyPathWithLog(path) {
  console.log(`处理路径: "${path}"\n`);
  
  const stack = [];
  const parts = path.split('/');
  
  console.log('分割后的部分:', parts, '\n');
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (part === '..') {
      const popped = stack.pop();
      console.log(`i=${i}: part='${part}' (返回上级) → 弹出 '${popped || '无'}' → stack=[${stack.join(', ')}]`);
    } else if (part === '.' || part === '') {
      console.log(`i=${i}: part='${part}' (${part === '.' ? '当前目录' : '空'}) → 跳过 → stack=[${stack.join(', ')}]`);
    } else {
      stack.push(part);
      console.log(`i=${i}: part='${part}' (目录名) → 入栈 → stack=[${stack.join(', ')}]`);
    }
  }
  
  const result = '/' + stack.join('/');
  console.log(`\n最终结果: "${result}"\n`);
  
  return result;
}

console.log('示例演示：');
simplifyPathWithLog('/a/./b/../../c/');

// ==================== 边界情况 ====================

console.log('\n=== 边界情况 ===\n');

const edgeCases = [
  { input: '/', expected: '/', desc: '只有根目录' },
  { input: '/..', expected: '/', desc: '根目录的上级' },
  { input: '/.', expected: '/', desc: '根目录的当前目录' },
  { input: '/...', expected: '/...', desc: '三个点是有效目录名' },
  { input: '/////', expected: '/', desc: '多个连续斜杠' },
  { input: '/a/b/../..', expected: '/', desc: '返回到根目录' },
  { input: '/a/b/../../..', expected: '/', desc: '超出根目录' },
];

edgeCases.forEach(({ input, expected, desc }) => {
  const result = simplifyPath(input);
  const pass = result === expected ? '✅' : '❌';
  console.log(`${pass} ${desc}`);
  console.log(`   输入: "${input}"`);
  console.log(`   输出: "${result}"`);
  console.log(`   期望: "${expected}"\n`);
});

// ==================== 复杂度分析 ====================

console.log('\n=== 复杂度分析 ===\n');

console.log('时间复杂度：O(n)');
console.log('- n 是路径的长度');
console.log('- 需要遍历路径中的每个字符一次');
console.log('- split 操作：O(n)');
console.log('- 遍历 parts：O(n)');
console.log('- join 操作：O(n)');
console.log('- 总计：O(n)\n');

console.log('空间复杂度：O(n)');
console.log('- parts 数组：O(n)');
console.log('- stack 数组：最坏情况 O(n)（所有都是有效目录名）');
console.log('- 总计：O(n)\n');

// ==================== 相关题目 ====================

console.log('\n=== 相关题目 ===\n');

console.log('1. LeetCode 20 - 有效的括号');
console.log('   使用栈匹配括号\n');

console.log('2. LeetCode 150 - 逆波兰表达式求值');
console.log('   使用栈计算后缀表达式\n');

console.log('3. LeetCode 388 - 文件的最长绝对路径');
console.log('   使用栈处理文件路径\n');

console.log('4. LeetCode 856 - 括号的分数');
console.log('   使用栈计算括号分数\n');

// ==================== 总结 ====================

console.log('\n=== 总结 ===\n');

console.log('核心思路：');
console.log('1. 使用栈来模拟目录的进入和退出');
console.log('2. 遇到 ".." 就弹出栈顶（返回上级）');
console.log('3. 遇到 "." 或空字符串就跳过');
console.log('4. 其他情况就入栈（进入目录）\n');

console.log('注意事项：');
console.log('1. 根目录没有上级，".." 在根目录无效');
console.log('2. 连续的 "/" 视为一个 "/"');
console.log('3. "..." 或更多点是有效的目录名');
console.log('4. 最终路径以 "/" 开头，不以 "/" 结尾（除非是根目录）\n');

module.exports = {
  simplifyPath,
  simplifyPath2,
  simplifyPathWithLog
};
