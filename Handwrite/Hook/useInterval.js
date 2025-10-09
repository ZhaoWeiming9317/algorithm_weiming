import { useEffect, useRef } from 'react';

/**
 * useInterval Hook
 * 在 React 中使用 setInterval 的正确方式
 * 
 * 核心问题：
 * 1. 闭包陷阱：setInterval 的回调函数会捕获旧的 state/props
 * 2. 清理问题：组件卸载时需要清除定时器
 * 3. delay 变化：delay 改变时需要重新设置定时器
 * 
 * 解决方案：
 * 1. 使用 useRef 保存最新的 callback，避免闭包问题
 * 2. 使用 useEffect 管理定时器的创建和清理
 * 3. delay 变化时自动重启定时器
 */

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 保存最新的 callback
  // 每次 callback 变化时更新 ref，这样定时器总是调用最新的函数
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置定时器
  useEffect(() => {
    // 如果 delay 为 null，则不启动定时器（可以用来暂停）
    if (delay === null) {
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);

    // 清理函数：组件卸载或 delay 变化时清除定时器
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;


/**
 * 进阶版本：支持立即执行和暂停/恢复
 */
export function useIntervalAdvanced(callback, delay, options = {}) {
  const { immediate = false } = options;
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const tick = () => {
      savedCallback.current();
    };

    // 立即执行一次
    if (immediate) {
      tick();
    }

    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay, immediate]);
}


/**
 * 更简单的版本（不推荐，有闭包问题）
 * 这个版本会捕获旧的 state，导致 bug
 */
export function useIntervalBad(callback, delay) {
  useEffect(() => {
    if (delay === null) {
      return;
    }

    // ❌ 问题：callback 被闭包捕获，永远使用旧的 state
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [delay]); // ⚠️ 缺少 callback 依赖，或者加了会导致频繁重启
}
