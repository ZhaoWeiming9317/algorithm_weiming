import React, { useState } from 'react';
import useInterval, { useIntervalAdvanced } from './useInterval';

/**
 * 示例 1：基础计数器
 */
function Counter() {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(count + 1); // ✅ 正确：能获取到最新的 count
  }, 1000);

  return <h1>{count}</h1>;
}


/**
 * 示例 2：可暂停的计数器
 */
function PausableCounter() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(() => {
    setCount(c => c + 1); // 使用函数式更新更安全
  }, isRunning ? delay : null); // delay 为 null 时暂停

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '暂停' : '开始'}
      </button>
      <button onClick={() => setCount(0)}>重置</button>
      <div>
        <label>间隔时间：</label>
        <input
          type="number"
          value={delay}
          onChange={e => setDelay(Number(e.target.value))}
        />
        ms
      </div>
    </div>
  );
}


/**
 * 示例 3：轮询数据
 */
function DataPolling() {
  const [data, setData] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  useInterval(async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('轮询失败:', error);
    }
  }, isPolling ? 5000 : null); // 每 5 秒轮询一次

  return (
    <div>
      <button onClick={() => setIsPolling(!isPolling)}>
        {isPolling ? '停止轮询' : '开始轮询'}
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}


/**
 * 示例 4：倒计时
 */
function Countdown({ initialSeconds = 60 }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useInterval(() => {
    if (seconds > 0) {
      setSeconds(s => s - 1);
    } else {
      setIsActive(false); // 倒计时结束
    }
  }, isActive ? 1000 : null);

  const reset = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  return (
    <div>
      <h1>{seconds}s</h1>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? '暂停' : '开始'}
      </button>
      <button onClick={reset}>重置</button>
    </div>
  );
}


/**
 * 示例 5：使用进阶版本 - 立即执行
 */
function ImmediateCounter() {
  const [count, setCount] = useState(0);

  useIntervalAdvanced(
    () => {
      console.log('执行了');
      setCount(c => c + 1);
    },
    2000,
    { immediate: true } // 立即执行一次，然后每 2 秒执行
  );

  return <h1>{count}</h1>;
}


/**
 * 错误示例：展示闭包陷阱
 */
function BrokenCounter() {
  const [count, setCount] = useState(0);

  // ❌ 错误：直接使用 setInterval
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setCount(count + 1); // 永远是 0 + 1
  //   }, 1000);
  //   return () => clearInterval(id);
  // }, []); // count 不在依赖中，闭包捕获初始值 0

  // ✅ 正确方式 1：使用 useInterval
  useInterval(() => {
    setCount(count + 1);
  }, 1000);

  // ✅ 正确方式 2：使用函数式更新
  // useInterval(() => {
  //   setCount(c => c + 1);
  // }, 1000);

  return <h1>{count}</h1>;
}


export default function App() {
  return (
    <div>
      <h2>基础计数器</h2>
      <Counter />
      
      <h2>可暂停计数器</h2>
      <PausableCounter />
      
      <h2>倒计时</h2>
      <Countdown initialSeconds={10} />
      
      <h2>立即执行</h2>
      <ImmediateCounter />
    </div>
  );
}
