/**
 * 区间领域对象 (Rich Domain Model)
 * 核心价值：封装区间交互的所有逻辑
 */
class Interval {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    /**
     * 判断与另一个区间是否相交
     * 用于合并判定：this.end >= other.start 即为接触/相交
     */
    intersects(other) {
        return this.end >= other.start;
    }

    /**
     * 判断与另一个区间是否完全分离
     * 用于选择判定：start >= end 或 end <= start
     */
    isDisjoint(other) {
        return this.start >= other.end || this.end <= other.start;
    }

    /**
     * 吞噬/合并另一个区间 (副作用)
     */
    absorb(other) {
        if (this.intersects(other)) {
            this.start = Math.min(this.start, other.start);
            this.end = Math.max(this.end, other.end);
        }
    }

    /**
     * 静态工厂：统一输入格式
     */
    static from(raw) {
        if (Array.isArray(raw)) return new Interval(raw[0], raw[1]);
        if (raw instanceof Interval) return raw;
        return new Interval(raw.start, raw.end);
    }

    /**
     * 哨兵对象
     */
    static infiniteStart() {
        return new Interval(-Infinity, -Infinity);
    }
}

// --- Solvers (Pragmatic Style: Eager Sort + Simple Loop) ---

/**
 * 56. 合并区间
 * 策略：按 Start 排序 -> 贪心合并
 */
export function mergeIntervals(rawIntervals) {
    if (!rawIntervals || rawIntervals.length === 0) return [];

    // 1. 数据清洗与排序 (Eager evaluation)
    // 既然排序是必须的，就没必要强行 Stream 化
    const intervals = rawIntervals
        .map(Interval.from)
        .sort((a, b) => a.start - b.start);

    // 2. 核心业务逻辑
    const merged = [];
    let current = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
        const next = intervals[i];

        // 领域对象负责判断逻辑
        if (current.intersects(next)) {
            current.absorb(next);
        } else {
            merged.push(current);
            current = next;
        }
    }

    merged.push(current);
    return merged;
}

/**
 * 1. 活动选择 / 3. 无重叠区间
 * 策略：按 End 排序 -> 贪心选择互不冲突的
 */
export function activitySelection(rawIntervals) {
    if (!rawIntervals || rawIntervals.length === 0) return [];

    const intervals = rawIntervals
        .map(Interval.from)
        .sort((a, b) => a.end - b.end);

    const selected = [];
    let last = Interval.infiniteStart();

    for (const current of intervals) {
        // 领域对象负责判断逻辑
        if (current.isDisjoint(last)) {
            selected.push(current);
            last = current;
        }
    }

    return selected;
}

/**
 * 8. 无重叠区间
 * 复用活动选择逻辑
 */
export function eraseOverlapIntervals(rawIntervals) {
    if (!rawIntervals || rawIntervals.length === 0) return 0;
    const maxNonOverlapping = activitySelection(rawIntervals).length;
    return rawIntervals.length - maxNonOverlapping;
}

/**
 * 9. 用最少数量的箭引爆气球
 * 策略：按 End 排序 -> 贪心穿透
 */
export function findMinArrowShots(rawPoints) {
    if (!rawPoints || rawPoints.length === 0) return 0;

    const intervals = rawPoints
        .map(Interval.from)
        .sort((a, b) => a.end - b.end);

    let arrows = 0;
    let arrowLimit = Interval.infiniteStart();

    for (const current of intervals) {
        // 如果当前气球这支箭够不着（分离了），就需要新的一支
        if (current.isDisjoint(arrowLimit)) {
            arrows++;
            arrowLimit = current;
        }
    }

    return arrows;
}
