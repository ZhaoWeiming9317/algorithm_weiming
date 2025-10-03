# Countdown 倒计时组件

## 功能特点
1. 支持设置倒计时时间
2. 支持暂停/继续
3. 支持重置
4. 支持自定义格式化
5. 支持倒计时结束回调

## 使用方式
```javascript
const countdown = new Countdown({
    time: 60, // 60秒
    onTick: (time) => console.log(time), // 每秒回调
    onComplete: () => console.log('完成'), // 完成回调
    format: 'mm:ss' // 格式化
});

countdown.start();  // 开始
countdown.pause();  // 暂停
countdown.resume(); // 继续
countdown.reset();  // 重置
```
