/**
 * 跳跃状态领域对象 (Rich Domain Model)
 * 封装了跳跃游戏的核心状态机：能够到达的当前边界、下一步的最远探索边界
 */
class JumpState {
    constructor() {
        this.currentEnd = 0; // 当前跳跃步数（当前这一跳）的有效覆盖边界
        this.farthest = 0;   // 探索到的最远位置（下一跳能到的最远点）
        this.jumps = 0;      // 已执行的跳跃次数
        this.reachable = true; // 是否仍处于可达状态
    }

    /**
     * 探索：站在当前位置，向前看能跳多远
     * Side Effect: 更新 farthest
     */
    explore(index, jumpLength) {
        // 领域规则：如果连当前位置都去不了，那后面的也别想了
        if (index > this.farthest) {
            this.reachable = false;
            return;
        }

        // 贪心策略：总是记录能探索到的最远位置
        this.farthest = Math.max(this.farthest, index + jumpLength);
    }

    /**
     * 决策：是否需要迈出新的一步？
     * 当我们遍历到了当前这一跳的边界时，必须进行下一跳（且只能是这种被迫跳跃时才增加次数）
     * Side Effect: 更新 jumps 和 currentEnd
     */
    shouldStep(index) {
        return index === this.currentEnd;
    }

    step() {
        this.jumps++;
        this.currentEnd = this.farthest;
    }
}

// --- Solvers (Pragmatic Style) ---

/**
 * 4. 跳跃游戏 (LeetCode 55)
 * 策略：贪心探索，看能否覆盖终点
 */
export function canJump(nums) {
    const state = new JumpState();

    for (let i = 0; i < nums.length; i++) {
        state.explore(i, nums[i]);

        // 剪枝：如果已经发现不可达，直接失败
        if (!state.reachable) return false;
    }

    return true;
}

/**
 * 5. 跳跃游戏 II (LeetCode 45)
 * 策略：贪心跳跃，计算最少步数
 */
export function jump(nums) {
    const state = new JumpState();

    // 注意：只遍历到倒数第二个元素
    // 因为题目保证可达，当我们在倒数第二个位置时，如果到了边界，跳一步肯定能过终点
    // 或者说，我们关注的是"在到达终点之前需要跳几次"
    const lastIndex = nums.length - 1;

    for (let i = 0; i < lastIndex; i++) {
        state.explore(i, nums[i]);

        // 领域决策：是否到了必须跳的时候？
        if (state.shouldStep(i)) {
            state.step();
        }
    }

    return state.jumps;
}
