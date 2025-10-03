/**
 * 倒计时组件
 */
class Countdown {
    constructor(options = {}) {
        // 配置项
        this.time = options.time || 60; // 默认60秒
        this.onTick = options.onTick || (time => console.log(time));
        this.onComplete = options.onComplete || (() => console.log('完成'));
        this.format = options.format || 'ss'; // 默认只显示秒数
        
        // 内部状态
        this.remaining = this.time;
        this.timer = null;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = null;
    }

    /**
     * 开始倒计时
     */
    start() {
        if (this.timer) return;
        
        this.startTime = Date.now();
        this.tick();
    }

    /**
     * 暂停倒计时
     */
    pause() {
        if (!this.timer || this.isPaused) return;
        
        this.isPaused = true;
        this.pausedTime = Date.now();
        clearInterval(this.timer);
        this.timer = null;
    }

    /**
     * 继续倒计时
     */
    resume() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        // 调整开始时间，考虑暂停的时间
        const pauseDuration = Date.now() - this.pausedTime;
        this.startTime += pauseDuration;
        this.tick();
    }

    /**
     * 重置倒计时
     */
    reset() {
        clearInterval(this.timer);
        this.timer = null;
        this.remaining = this.time;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = null;
        this.onTick(this.formatTime(this.remaining));
    }

    /**
     * 停止倒计时
     */
    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    /**
     * 计时器核心逻辑
     */
    tick() {
        this.timer = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - this.startTime) / 1000);
            this.remaining = Math.max(0, this.time - elapsed);

            this.onTick(this.formatTime(this.remaining));

            if (this.remaining === 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }

    /**
     * 格式化时间
     * @param {number} seconds 剩余秒数
     * @returns {string} 格式化后的时间
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        switch (this.format) {
            case 'hh:mm:ss':
                return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
            case 'mm:ss':
                return `${this.pad(minutes)}:${this.pad(secs)}`;
            case 'ss':
                return `${this.pad(secs)}`;
            default:
                return seconds.toString();
        }
    }

    /**
     * 数字补零
     * @param {number} num 
     * @returns {string}
     */
    pad(num) {
        return num.toString().padStart(2, '0');
    }
}

// 测试用例
function test() {
    const countdown = new Countdown({
        time: 65, // 65秒
        format: 'mm:ss',
        onTick: (time) => console.log(`剩余时间: ${time}`),
        onComplete: () => console.log('倒计时结束！')
    });

    // 开始倒计时
    countdown.start();

    // 5秒后暂停
    setTimeout(() => {
        console.log('暂停');
        countdown.pause();
    }, 5000);

    // 8秒后继续
    setTimeout(() => {
        console.log('继续');
        countdown.resume();
    }, 8000);

    // 13秒后重置
    setTimeout(() => {
        console.log('重置');
        countdown.reset();
    }, 13000);

    // 15秒后重新开始
    setTimeout(() => {
        console.log('重新开始');
        countdown.start();
    }, 15000);
}

// test();
module.exports = Countdown;
