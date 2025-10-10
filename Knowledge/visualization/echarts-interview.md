# ECharts 面试题

## 基础问题

### 1. ECharts 的核心概念有哪些？

**答案：**

- **实例（Instance）**：通过 `echarts.init()` 创建的图表实例
- **配置项（Option）**：描述图表内容和样式的 JavaScript 对象
- **组件（Component）**：图表的各个组成部分，如 title、legend、tooltip 等
- **系列（Series）**：一组数值以及它们映射成的图，如折线图、柱状图等
- **坐标系（Coordinate System）**：如直角坐标系、极坐标系、地理坐标系等

### 2. ECharts 中 setOption 的合并模式是什么？

**答案：**

`setOption` 有两种模式：

```javascript
// 1. 合并模式（默认）
chart.setOption(newOption);
// 新配置会与旧配置合并，但数组不会合并，会直接替换

// 2. 替换模式
chart.setOption(newOption, true);
// 完全替换旧配置，不保留任何旧配置

// 3. 不合并模式（notMerge）
chart.setOption(newOption, { notMerge: true });

// 4. 延迟更新模式（lazyUpdate）
chart.setOption(newOption, { lazyUpdate: true });
// 在下一帧才更新视图，适合批量更新
```

**注意事项：**
- 数组类型的配置项（如 series）不会合并，会直接替换
- 对象类型的配置项会深度合并
- 使用 `replaceMerge` 可以指定某些组件使用替换合并

### 3. 如何实现 ECharts 的响应式？

**答案：**

```javascript
// 方法 1：监听 window resize 事件
window.addEventListener('resize', () => {
  myChart.resize();
});

// 方法 2：使用 ResizeObserver
const resizeObserver = new ResizeObserver(() => {
  myChart.resize();
});
resizeObserver.observe(chartContainer);

// 方法 3：媒体查询
option = {
  baseOption: {
    // 基础配置
  },
  media: [
    {
      query: { maxWidth: 500 },
      option: {
        series: [{ radius: '40%' }]
      }
    },
    {
      query: { minWidth: 500 },
      option: {
        series: [{ radius: '50%' }]
      }
    }
  ]
};

// 清理
window.removeEventListener('resize', resizeHandler);
resizeObserver.disconnect();
myChart.dispose();
```

### 4. ECharts 如何处理大数据量？

**答案：**

**优化策略：**

1. **数据采样**
```javascript
series: [{
  type: 'line',
  sampling: 'lttb',  // Largest-Triangle-Three-Buckets 采样
  data: largeData
}]
```

2. **渐进式渲染**
```javascript
series: [{
  type: 'scatter',
  large: true,           // 开启大数据量优化
  largeThreshold: 2000,  // 超过 2000 个点启用优化
  data: largeData
}]
```

3. **数据区域缩放**
```javascript
dataZoom: [{
  type: 'inside',
  start: 0,
  end: 20  // 只显示 20% 的数据
}]
```

4. **按需加载**
```javascript
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, CanvasRenderer]);
```

5. **分批加载**
```javascript
myChart.appendData({
  seriesIndex: 0,
  data: batchData
});
```

6. **降低精度**
```javascript
// 减少小数位数
data: data.map(v => Math.round(v * 100) / 100)
```

## 进阶问题

### 5. ECharts 的渲染器有哪些？各有什么特点？

**答案：**

**Canvas 渲染器：**
- 适合大数据量场景
- 性能更好
- 内存占用相对较小
- 不支持单个图形元素的事件监听

**SVG 渲染器：**
- 适合小数据量、图形较少的场景
- 支持单个图形元素的事件监听
- 放大不会失真，适合高清打印
- 内存占用较大
- 性能相对较差

```javascript
// 使用 Canvas
const chart = echarts.init(dom, null, { renderer: 'canvas' });

// 使用 SVG
const chart = echarts.init(dom, null, { renderer: 'svg' });
```

**选择建议：**
- 数据量大（>1000）：使用 Canvas
- 需要高清打印、导出：使用 SVG
- 需要监听单个图形事件：使用 SVG
- 移动端、性能敏感：使用 Canvas

### 6. 如何实现 ECharts 的动态数据更新？

**答案：**

```javascript
// 方法 1：直接更新 option
setInterval(() => {
  const newData = generateData();
  myChart.setOption({
    series: [{
      data: newData
    }]
  });
}, 1000);

// 方法 2：使用 appendData（适合流式数据）
setInterval(() => {
  const newPoint = generatePoint();
  myChart.appendData({
    seriesIndex: 0,
    data: [[newPoint]]
  });
}, 1000);

// 方法 3：数据驱动（推荐）
let data = [];

function updateChart() {
  data.push(generatePoint());
  
  // 保持固定长度
  if (data.length > 100) {
    data.shift();
  }
  
  myChart.setOption({
    series: [{
      data: data
    }]
  });
}

setInterval(updateChart, 1000);

// 方法 4：使用 dataset
myChart.setOption({
  dataset: {
    source: newDataSource
  }
});
```

### 7. ECharts 的事件系统是如何工作的？

**答案：**

**事件类型：**

1. **鼠标事件**
```javascript
myChart.on('click', (params) => {
  console.log(params.componentType);  // 组件类型
  console.log(params.seriesType);     // 系列类型
  console.log(params.seriesIndex);    // 系列索引
  console.log(params.dataIndex);      // 数据索引
  console.log(params.name);           // 数据名称
  console.log(params.value);          // 数据值
});

// 其他鼠标事件
myChart.on('dblclick', handler);
myChart.on('mousedown', handler);
myChart.on('mousemove', handler);
myChart.on('mouseup', handler);
myChart.on('mouseover', handler);
myChart.on('mouseout', handler);
myChart.on('contextmenu', handler);
```

2. **组件交互事件**
```javascript
// 图例切换
myChart.on('legendselectchanged', (params) => {
  console.log(params.selected);
});

// 数据区域缩放
myChart.on('datazoom', (params) => {
  console.log(params.start, params.end);
});

// 数据范围选择
myChart.on('datarangeselected', (params) => {
  console.log(params.selected);
});
```

3. **事件过滤**
```javascript
// 只监听特定系列
myChart.on('click', { seriesIndex: 0 }, (params) => {
  console.log('点击了第一个系列');
});

// 只监听特定名称
myChart.on('click', { name: 'Category A' }, (params) => {
  console.log('点击了 Category A');
});
```

4. **事件解绑**
```javascript
const handler = (params) => console.log(params);

myChart.on('click', handler);
myChart.off('click', handler);  // 解绑特定处理器
myChart.off('click');           // 解绑所有 click 处理器
```

5. **触发事件**
```javascript
myChart.dispatchAction({
  type: 'highlight',
  seriesIndex: 0,
  dataIndex: 1
});

myChart.dispatchAction({
  type: 'showTip',
  seriesIndex: 0,
  dataIndex: 1
});
```

### 8. 如何在 ECharts 中实现自定义图表？

**答案：**

使用 Custom Series：

```javascript
series: [{
  type: 'custom',
  
  renderItem: function (params, api) {
    // 获取数据
    const categoryIndex = api.value(0);
    const start = api.coord([api.value(1), categoryIndex]);
    const end = api.coord([api.value(2), categoryIndex]);
    const height = api.size([0, 1])[1] * 0.6;
    
    // 返回图形元素
    return {
      type: 'rect',
      shape: {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
      },
      style: api.style({
        fill: api.visual('color')
      })
    };
  },
  
  encode: {
    x: [1, 2],
    y: 0
  },
  
  data: [
    [0, 10, 20],
    [1, 15, 30],
    [2, 5, 25]
  ]
}]
```

**关键 API：**
- `api.value(dimIndex)`：获取数据值
- `api.coord(dataItem)`：将数据值转换为坐标
- `api.size(dataItem)`：获取尺寸
- `api.style()`：获取样式
- `api.visual(visualType)`：获取视觉映射值

### 9. ECharts 的内存泄漏问题如何避免？

**答案：**

**常见原因：**
1. 未销毁实例
2. 未移除事件监听
3. 定时器未清理
4. 闭包引用

**解决方案：**

```javascript
// React 示例
function ChartComponent() {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  
  useEffect(() => {
    // 创建实例
    instanceRef.current = echarts.init(chartRef.current);
    instanceRef.current.setOption(option);
    
    // 事件处理
    const handleClick = (params) => {
      console.log(params);
    };
    instanceRef.current.on('click', handleClick);
    
    // 响应式
    const handleResize = () => {
      instanceRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    
    // 定时更新
    const timer = setInterval(() => {
      updateChart();
    }, 1000);
    
    // 清理函数
    return () => {
      // 移除事件监听
      instanceRef.current?.off('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
      // 清理定时器
      clearInterval(timer);
      
      // 销毁实例
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);
  
  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
}

// Vue 3 示例
onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
  clearInterval(timer);
});
```

### 10. ECharts 如何实现主题切换？

**答案：**

```javascript
// 方法 1：初始化时指定主题
const chart = echarts.init(dom, 'dark');

// 方法 2：注册自定义主题
const myTheme = {
  color: ['#c23531', '#2f4554'],
  backgroundColor: '#f4f4f4',
  textStyle: {
    color: '#333'
  }
};
echarts.registerTheme('myTheme', myTheme);
const chart = echarts.init(dom, 'myTheme');

// 方法 3：动态切换主题
function switchTheme(themeName) {
  // 保存当前配置
  const currentOption = chart.getOption();
  
  // 销毁实例
  chart.dispose();
  
  // 重新创建实例
  chart = echarts.init(dom, themeName);
  
  // 恢复配置
  chart.setOption(currentOption);
}

// 方法 4：通过 option 切换（推荐）
function switchTheme(isDark) {
  chart.setOption({
    backgroundColor: isDark ? '#000' : '#fff',
    textStyle: {
      color: isDark ? '#fff' : '#000'
    },
    // 其他配置...
  });
}
```

## 实战问题

### 11. 如何实现 ECharts 图表的导出功能？

**答案：**

```javascript
// 方法 1：使用工具栏
option = {
  toolbox: {
    feature: {
      saveAsImage: {
        type: 'png',
        name: 'chart',
        backgroundColor: '#fff',
        pixelRatio: 2  // 高清图片
      }
    }
  }
};

// 方法 2：编程方式导出
function exportChart() {
  // 导出为 base64
  const base64 = myChart.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  });
  
  // 下载图片
  const link = document.createElement('a');
  link.download = 'chart.png';
  link.href = base64;
  link.click();
}

// 方法 3：导出为 SVG
const chart = echarts.init(dom, null, { renderer: 'svg' });
const svgStr = chart.renderToSVGString();

// 方法 4：导出数据
function exportData() {
  const option = myChart.getOption();
  const data = option.series[0].data;
  
  // 转换为 CSV
  const csv = data.map(row => row.join(',')).join('\n');
  
  // 下载 CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'data.csv';
  link.href = url;
  link.click();
}
```

### 12. 如何实现 ECharts 的服务端渲染（SSR）？

**答案：**

使用 `echarts-server-side-render` 或 `node-canvas`：

```javascript
// 安装依赖
// npm install echarts canvas

const { createCanvas } = require('canvas');
const echarts = require('echarts');

function renderChart(option, width = 800, height = 600) {
  // 创建 canvas
  const canvas = createCanvas(width, height);
  
  // 初始化 ECharts
  const chart = echarts.init(canvas);
  
  // 设置配置
  chart.setOption(option);
  
  // 获取 buffer
  const buffer = canvas.toBuffer('image/png');
  
  // 或获取 base64
  const base64 = canvas.toDataURL();
  
  // 清理
  chart.dispose();
  
  return buffer;
}

// Express 示例
app.get('/chart.png', (req, res) => {
  const option = {
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30] }]
  };
  
  const buffer = renderChart(option);
  
  res.type('png');
  res.send(buffer);
});
```

### 13. 如何优化 ECharts 在移动端的性能？

**答案：**

```javascript
// 1. 使用 Canvas 渲染器
const chart = echarts.init(dom, null, { renderer: 'canvas' });

// 2. 简化配置
option = {
  animation: false,  // 关闭动画
  
  series: [{
    type: 'line',
    symbol: 'none',  // 不显示数据点
    sampling: 'lttb',  // 数据采样
    data: data
  }]
};

// 3. 限制数据量
const maxDataPoints = 100;
if (data.length > maxDataPoints) {
  data = data.slice(-maxDataPoints);
}

// 4. 使用 passive 事件监听
chart.getZr().on('touchstart', handler, { passive: true });

// 5. 防抖处理
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    chart.resize();
  }, 300);
});

// 6. 懒加载
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    initChart();
    observer.disconnect();
  }
});
observer.observe(chartContainer);

// 7. 使用 Web Worker
// worker.js
self.addEventListener('message', (e) => {
  const processedData = processData(e.data);
  self.postMessage(processedData);
});

// main.js
const worker = new Worker('worker.js');
worker.postMessage(rawData);
worker.addEventListener('message', (e) => {
  chart.setOption({
    series: [{ data: e.data }]
  });
});
```

## 总结

ECharts 面试重点：
1. **核心概念**：实例、配置项、组件、系列
2. **性能优化**：大数据处理、按需加载、渲染器选择
3. **响应式**：resize、媒体查询
4. **事件系统**：事件监听、触发、解绑
5. **数据更新**：setOption 合并模式、动态更新
6. **内存管理**：实例销毁、事件清理
7. **框架集成**：React、Vue 生命周期管理
8. **高级特性**：自定义系列、主题、动画
