import { useState, useEffect } from 'react';

/**
 * 简单的请求 Hook
 * @param {Function} requestFn - 请求函数
 * @param {Array} deps - 依赖数组，变化时重新请求
 * @returns {Object} 请求状态和操作方法
 */
function useRequest(requestFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await requestFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 依赖变化时自动执行
  useEffect(() => {
    run();
  }, deps);

  return {
    data,
    loading,
    error,
    run,        // 手动执行
    refresh: run // 重新执行
  };
}

export default useRequest;
