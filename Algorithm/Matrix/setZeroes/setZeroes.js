/**
 * 矩阵置零
 * 题目：给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0
 * 
 * 解法1：使用额外空间 - O(mn) 空间
 * 解法2：使用第一行和第一列标记 - O(1) 空间
 * 解法3：使用两个标记变量 - O(1) 空间（最优）
 */

// ==================== 解法1：使用额外空间 ====================

/**
 * 使用额外空间标记需要置零的行和列
 * 时间复杂度：O(mn)
 * 空间复杂度：O(m + n)
 * 
 * @param {number[][]} matrix - 矩阵
 * @returns {void} 原地修改矩阵
 */
function setZeroesExtraSpace(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  
  // 记录需要置零的行和列
  const zeroRows = new Set();
  const zeroCols = new Set();

  // 第一遍遍历：找到所有0的位置
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) {
        zeroRows.add(i);
        zeroCols.add(j);
      }
    }
  }
  
  // 第二遍遍历：置零
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (zeroRows.has(i) || zeroCols.has(j)) {
        matrix[i][j] = 0;
      }
    }
  }
}

// ==================== 解法2：使用第一行和第一列标记 ====================

/**
 * 使用第一行和第一列作为标记数组
 * 时间复杂度：O(mn)
 * 空间复杂度：O(1)
 * 
 * @param {number[][]} matrix - 矩阵
 * @returns {void} 原地修改矩阵
 */
function setZeroesFirstRowCol(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  
  // 标记第一行和第一列是否需要置零
  let firstRowZero = false;
  let firstColZero = false;
  
  // 检查第一行是否有0
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }
  
  // 检查第一列是否有0
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }
  
  // 使用第一行和第一列标记其他位置
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;  // 标记第i行
        matrix[0][j] = 0;  // 标记第j列
      }
    }
  }
  
  // 根据标记置零
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }
  
  // 处理第一行
  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }
  
  // 处理第一列
  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
}

// ==================== 解法3：使用两个标记变量（最优）====================

/**
 * 使用两个标记变量优化空间复杂度
 * 时间复杂度：O(mn)
 * 空间复杂度：O(1)
 * 
 * @param {number[][]} matrix - 矩阵
 * @returns {void} 原地修改矩阵
 */
function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  
  // 标记第一行和第一列是否需要置零
  let firstRowZero = false;
  let firstColZero = false;
  
  // 检查第一行是否有0
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }
  
  // 检查第一列是否有0
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }
  
  // 使用第一行和第一列标记其他位置
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;  // 标记第i行
        matrix[0][j] = 0;  // 标记第j列
      }
    }
  }
  
  // 根据标记置零（从第二行第二列开始）
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }
  
  // 处理第一行
  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }
  
  // 处理第一列
  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
}

// ==================== 工具函数 ====================

/**
 * 创建矩阵的深拷贝
 * @param {number[][]} matrix - 原矩阵
 * @returns {number[][]} 深拷贝的矩阵
 */
function copyMatrix(matrix) {
  return matrix.map(row => [...row]);
}

/**
 * 打印矩阵
 * @param {number[][]} matrix - 矩阵
 */
function printMatrix(matrix) {
  console.log('矩阵:');
  matrix.forEach(row => {
    console.log(row.join(' '));
  });
}

/**
 * 比较两个矩阵是否相等
 * @param {number[][]} matrix1 - 矩阵1
 * @param {number[][]} matrix2 - 矩阵2
 * @returns {boolean} 是否相等
 */
function matrixEqual(matrix1, matrix2) {
  if (matrix1.length !== matrix2.length) return false;
  
  for (let i = 0; i < matrix1.length; i++) {
    if (matrix1[i].length !== matrix2[i].length) return false;
    for (let j = 0; j < matrix1[i].length; j++) {
      if (matrix1[i][j] !== matrix2[i][j]) return false;
    }
  }
  
  return true;
}

// ==================== 测试用例 ====================

function testSetZeroes() {
  console.log('=== 矩阵置零测试 ===');
  
  const testCases = [
    {
      input: [[1, 1, 1], [1, 0, 1], [1, 1, 1]],
      expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
    },
    {
      input: [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]],
      expected: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
    },
    {
      input: [[1, 2, 3], [4, 0, 6], [7, 8, 9]],
      expected: [[1, 0, 3], [0, 0, 0], [7, 0, 9]]
    },
    {
      input: [[1, 0], [0, 1]],
      expected: [[0, 0], [0, 0]]
    },
    {
      input: [[1]],
      expected: [[1]]
    },
    {
      input: [[0]],
      expected: [[0]]
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n测试用例 ${index + 1}:`);
    console.log('原矩阵:');
    printMatrix(testCase.input);
    
    // 测试解法1：使用额外空间
    const matrix1 = copyMatrix(testCase.input);
    setZeroesExtraSpace(matrix1);
    console.log('解法1结果:');
    printMatrix(matrix1);
    console.log(`解法1正确: ${matrixEqual(matrix1, testCase.expected)}`);
    
    // 测试解法2：使用第一行和第一列标记
    const matrix2 = copyMatrix(testCase.input);
    setZeroesFirstRowCol(matrix2);
    console.log('解法2结果:');
    printMatrix(matrix2);
    console.log(`解法2正确: ${matrixEqual(matrix2, testCase.expected)}`);
    
    // 测试解法3：使用两个标记变量
    const matrix3 = copyMatrix(testCase.input);
    setZeroes(matrix3);
    console.log('解法3结果:');
    printMatrix(matrix3);
    console.log(`解法3正确: ${matrixEqual(matrix3, testCase.expected)}`);
  });
}

// ==================== 性能测试 ====================

function performanceTest() {
  console.log('\n=== 性能测试 ===');
  
  const sizes = [
    { m: 10, n: 10 },
    { m: 50, n: 50 },
    { m: 100, n: 100 }
  ];
  
  sizes.forEach(size => {
    const { m, n } = size;
    
    // 生成随机矩阵
    const matrix = Array.from({ length: m }, () => 
      Array.from({ length: n }, () => Math.floor(Math.random() * 10))
    );
    
    console.log(`\n矩阵大小: ${m} x ${n}`);
    
    // 测试解法1：使用额外空间
    const start1 = Date.now();
    const matrix1 = copyMatrix(matrix);
    setZeroesExtraSpace(matrix1);
    const time1 = Date.now() - start1;
    console.log(`解法1耗时: ${time1}ms`);
    
    // 测试解法2：使用第一行和第一列标记
    const start2 = Date.now();
    const matrix2 = copyMatrix(matrix);
    setZeroesFirstRowCol(matrix2);
    const time2 = Date.now() - start2;
    console.log(`解法2耗时: ${time2}ms`);
    
    // 测试解法3：使用两个标记变量
    const start3 = Date.now();
    const matrix3 = copyMatrix(matrix);
    setZeroes(matrix3);
    const time3 = Date.now() - start3;
    console.log(`解法3耗时: ${time3}ms`);
  });
}

// ==================== 复杂度分析 ====================

/*
时间复杂度分析：
1. 使用额外空间：O(mn)
   - 第一遍遍历：O(mn)
   - 第二遍遍历：O(mn)
   - 总时间复杂度：O(mn)

2. 使用第一行和第一列标记：O(mn)
   - 检查第一行和第一列：O(m + n)
   - 标记其他位置：O(mn)
   - 根据标记置零：O(mn)
   - 处理第一行和第一列：O(m + n)
   - 总时间复杂度：O(mn)

3. 使用两个标记变量：O(mn)
   - 与解法2相同的时间复杂度

空间复杂度分析：
1. 使用额外空间：O(m + n)
   - 需要额外的Set存储行和列

2. 使用第一行和第一列标记：O(1)
   - 只使用常数额外空间

3. 使用两个标记变量：O(1)
   - 只使用常数额外空间

选择建议：
- 面试推荐：解法3（使用两个标记变量）
- 实际应用：解法3（空间复杂度最优）
- 学习理解：解法1（逻辑最直观）
*/

// ==================== 面试要点 ====================

/*
🎯 面试要点：

1. 核心思想：
   - 使用第一行和第一列作为标记数组
   - 避免使用额外的空间
   - 注意处理第一行和第一列本身

2. 关键步骤：
   - 检查第一行和第一列是否有0
   - 使用第一行和第一列标记其他位置
   - 根据标记置零
   - 处理第一行和第一列

3. 边界处理：
   - 矩阵为空的情况
   - 只有一行或一列的情况
   - 第一行或第一列本身有0的情况

4. 优化技巧：
   - 使用两个标记变量
   - 避免重复遍历
   - 原地修改矩阵

💡 记忆要点：
- 使用第一行和第一列作为标记
- 先检查第一行和第一列是否有0
- 最后处理第一行和第一列
- 时间复杂度：O(mn)，空间复杂度：O(1)
*/

// 运行测试
testSetZeroes();
performanceTest();

// 导出函数
export {
  setZeroes,
  setZeroesExtraSpace,
  setZeroesFirstRowCol,
  copyMatrix,
  printMatrix,
  matrixEqual
};
