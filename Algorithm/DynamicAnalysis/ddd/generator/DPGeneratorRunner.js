
/**
 * Stack Safe Recursion Runner (基于生成器的栈安全递归)
 * 
 * 为什么这个函数这么复杂？
 * 因为它在模拟没有任何限制的“函数调用栈”。
 * 
 * 1.当你 call 一个函数 -> 我们 push 一个任务到 taskStack
 * 2.当你 return 一个值 -> 我们 pop 一个任务，并把值传给上一层
 */
export function runGeneratorDP(generatorFunction, initialArgs) {
    const cache = new Map();

    // 任务栈：模拟操作系统的调用栈
    // 每个任务包含：
    // - args: 当前函数的参数（用于缓存查重）
    // - iterator: 当前函数的执行进度（生成器对象）
    // - lastResult: 子函数返回的结果（如果有）
    const stack = [{
        args: initialArgs,
        iterator: generatorFunction(...initialArgs),
        lastResult: undefined
    }];

    while (stack.length > 0) {
        const frame = stack[stack.length - 1]; // 获取栈顶（当前正在执行的函数）
        const cacheKey = frame.args.join(',');

        // 1. 检查缓存 (Memoization)
        if (cache.has(cacheKey)) {
            stack.pop(); // 当前函数不用跑了，直接弹栈
            if (stack.length > 0) {
                // 把缓存结果传给“父函数”
                stack[stack.length - 1].lastResult = cache.get(cacheKey);
            }
            continue;
        }

        // 2. 继续执行当前函数 (Resume)
        // frame.lastResult 里装着上一个 yield 返回的值
        const { value, done } = frame.iterator.next(frame.lastResult);

        if (done) {
            // Case A: 函数执行完毕 (return)
            cache.set(cacheKey, value); // 记录结果
            stack.pop(); // 弹栈

            // 如果还有父函数，把结果传给它
            if (stack.length > 0) {
                stack[stack.length - 1].lastResult = value;
            }
        } else {
            // Case B: 请求调用子函数 (yield [args])
            // value 就是子函数的参数
            const childArgs = value;
            const childKey = childArgs.join(',');

            if (cache.has(childKey)) {
                // 如果子函数算过了，直接把结果给当前函数 (将在下一次循环的 .next() 中传入)
                frame.lastResult = cache.get(childKey);
            } else {
                // 如果子函数没算过，入栈 (Push Stack)
                // 注意：这里没有 .next()，而是创建新的 iterator
                stack.push({
                    args: childArgs,
                    iterator: generatorFunction(...childArgs),
                    lastResult: undefined
                });
            }
        }
    }

    return cache.get(initialArgs.join(','));
}
