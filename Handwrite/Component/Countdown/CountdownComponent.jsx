import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Countdown 倒计时组件
 * @param {Object} props
 * @param {number} props.time - 倒计时时间（秒）
 * @param {string} props.format - 时间格式 'hh:mm:ss' | 'mm:ss' | 'ss'
 * @param {function} props.onComplete - 倒计时结束回调
 * @param {boolean} props.autoStart - 是否自动开始
 */
const Countdown = ({ 
    time = 60,
    format = 'ss',
    onComplete,
    autoStart = true
}) => {
    // 状态管理
    const [remaining, setRemaining] = useState(time);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [startTime, setStartTime] = useState(null);
    const [pausedTime, setPausedTime] = useState(null);

    // 格式化时间
    const formatTime = useCallback((seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const pad = (num) => num.toString().padStart(2, '0');

        switch (format) {
            case 'hh:mm:ss':
                return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
            case 'mm:ss':
                return `${pad(minutes)}:${pad(secs)}`;
            case 'ss':
                return `${pad(secs)}`;
            default:
                return seconds.toString();
        }
    }, [format]);

    // 倒计时逻辑
    useEffect(() => {
        let timer = null;

        if (isRunning && remaining > 0) {
            const start = startTime || Date.now();
            setStartTime(start);

            timer = setInterval(() => {
                const now = Date.now();
                const elapsed = Math.floor((now - start) / 1000);
                const newRemaining = Math.max(0, time - elapsed);
                
                setRemaining(newRemaining);

                if (newRemaining === 0) {
                    setIsRunning(false);
                    onComplete?.();
                }
            }, 1000);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isRunning, remaining, time, startTime, onComplete]);

    // 控制方法
    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            setStartTime(Date.now() - ((time - remaining) * 1000));
        }
    }, [isRunning, time, remaining]);

    const pause = useCallback(() => {
        if (isRunning) {
            setIsRunning(false);
            setPausedTime(Date.now());
        }
    }, [isRunning]);

    const resume = useCallback(() => {
        if (!isRunning && pausedTime) {
            const pauseDuration = Date.now() - pausedTime;
            setStartTime(prev => prev + pauseDuration);
            setIsRunning(true);
            setPausedTime(null);
        }
    }, [isRunning, pausedTime]);

    const reset = useCallback(() => {
        setIsRunning(false);
        setRemaining(time);
        setStartTime(null);
        setPausedTime(null);
    }, [time]);

    // 记忆化格式化后的时间
    const formattedTime = useMemo(() => formatTime(remaining), [formatTime, remaining]);

    return (
        <div className="countdown">
            <div className="countdown-display">{formattedTime}</div>
            <div className="countdown-controls">
                {!isRunning && remaining === time && (
                    <button onClick={start}>开始</button>
                )}
                {isRunning && (
                    <button onClick={pause}>暂停</button>
                )}
                {!isRunning && remaining < time && remaining > 0 && (
                    <button onClick={resume}>继续</button>
                )}
                {remaining !== time && (
                    <button onClick={reset}>重置</button>
                )}
            </div>
        </div>
    );
};

export default Countdown;

// 使用示例：
/*
import Countdown from './CountdownComponent';

function App() {
    return (
        <Countdown
            time={60}
            format="mm:ss"
            onComplete={() => console.log('倒计时结束！')}
            autoStart={false}
        />
    );
}
*/
