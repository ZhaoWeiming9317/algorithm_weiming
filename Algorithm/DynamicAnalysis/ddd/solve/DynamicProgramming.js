/**
 * 通用动态规划引擎 (Dynamic Programming Engine)
 * 核心思想：将状态转移 (State Transition) 与 状态存储 (Table Management) 分离
 */

/**
 * 1D DP 求解器
 * @param {number} length - DP 表的大小
 * @param {Object} config - 配置对象
 * @param {(table: Array<any>) => void} config.init - 初始化函数
 * @param {(i: number, table: Array<any>) => any} config.transition - 状态转移函数
 * @returns {Array<any>} - 填充好的 DP 表
 */
export function solveDP1D(length, { init, transition }) {
    const table = new Array(length).fill(null);

    // 初始化阶段
    if (init) {
        init(table);
    }

    // 填充阶段
    for (let i = 0; i < length; i++) {
        // 如果尚未初始化，则计算
        if (table[i] === null || table[i] === undefined) {
            table[i] = transition(i, table);
        }
    }

    return table;
}

/**
 * 2D DP 求解器
 * @param {number} rows - 行数
 * @param {number} cols - 列数
 * @param {Object} config - 配置对象
 * @param {(table: Array<Array<any>>) => void} config.init - 初始化函数
 * @param {(i: number, j: number, table: Array<Array<any>>) => any} config.transition - 状态转移函数
 * @returns {Array<Array<any>>} - 填充好的 DP 表
 */
export function solveDP2D(rows, cols, { init, transition }) {
    // 创建二维数组
    const table = Array(rows).fill(null).map(() => Array(cols).fill(null));

    // 初始化阶段
    if (init) {
        init(table);
    }

    // 填充阶段
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // 如果尚未初始化，则计算
            if (table[i][j] === null || table[i][j] === undefined) {
                table[i][j] = transition(i, j, table);
            }
        }
    }

    return table;
}

/**
 * 状态压缩 DP 求解器 (Rolling Array / Optimization)
 * 适用于只依赖前一状态的情况，将空间复杂度降为 O(1) 或 O(N)
 * @param {any} initialState - 初始状态
 * @param {number} steps - 迭代步数
 * @param {(currentState: any, stepIndex: number) => any} nextStateFn - 计算下一个状态的函数
 * @returns {any} - 最终状态
 */
export function solveDPStateCompressed(initialState, steps, nextStateFn) {
    let currentState = initialState;

    for (let i = 0; i < steps; i++) {
        currentState = nextStateFn(currentState, i);
    }

    return currentState;
}
