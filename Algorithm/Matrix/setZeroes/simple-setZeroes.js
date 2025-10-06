/**
 * 矩阵置零 - 面试背诵版本
 * 只保留最优解法：使用两个标记变量
 */

/**
 * 矩阵置零
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
 */
function copyMatrix(matrix) {
  return matrix.map(row => [...row]);
}

/**
 * 打印矩阵
 */
function printMatrix(matrix) {
  console.log('矩阵:');
  matrix.forEach(row => {
    console.log(row.join(' '));
  });
}

// ==================== 测试 ====================

function test() {
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
    }
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n测试用例 ${index + 1}:`);
    console.log('原矩阵:');
    printMatrix(testCase.input);
    
    const matrix = copyMatrix(testCase.input);
    setZeroes(matrix);
    console.log('结果:');
    printMatrix(matrix);
  });
}

// ==================== 背诵要点 ====================

/*
🧠 背诵要点：

1. 核心思想：
   - 使用第一行和第一列作为标记数组
   - 避免使用额外的空间
   - 注意处理第一行和第一列本身

2. 关键步骤：
   - 检查第一行和第一列是否有0
   - 使用第一行和第一列标记其他位置
   - 根据标记置零
   - 处理第一行和第一列

3. 代码结构：
   ```javascript
   function setZeroes(matrix) {
     // 1. 检查第一行和第一列是否有0
     // 2. 使用第一行和第一列标记其他位置
     // 3. 根据标记置零
     // 4. 处理第一行和第一列
   }
   ```

4. 关键技巧：
   - 使用两个标记变量：firstRowZero, firstColZero
   - 从第二行第二列开始遍历
   - 最后处理第一行和第一列

5. 时间复杂度：O(mn)
6. 空间复杂度：O(1)

🎯 面试技巧：
1. 先说明核心思想：使用第一行和第一列作为标记
2. 再写检查第一行和第一列的代码
3. 然后写标记其他位置的代码
4. 接着写根据标记置零的代码
5. 最后写处理第一行和第一列的代码
6. 记住关键公式和步骤
*/

// 运行测试
test();

// 导出
export {
  setZeroes,
  copyMatrix,
  printMatrix
};
