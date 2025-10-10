# ECharts 基础知识

## 什么是 ECharts？

ECharts（Enterprise Charts）是百度开源的一个基于 JavaScript 的数据可视化图表库，提供直观、生动、可交互、可高度个性化定制的数据可视化图表。

## 核心特性

### 1. 丰富的图表类型
- **基础图表**：折线图、柱状图、饼图、散点图
- **高级图表**：K线图、雷达图、热力图、树图、旭日图
- **地理可视化**：地图、GEO 坐标系
- **3D 可视化**：3D 柱状图、3D 散点图、3D 曲面

### 2. 强大的交互能力
- 数据区域缩放
- 图例开关
- 数据视图
- 动态类型切换
- 数据区域选择

### 3. 多维数据支持
- 支持多系列数据
- 支持数据过滤、映射
- 支持数据动态更新

## 基本使用

### 安装

```bash
# npm
npm install echarts

# yarn
yarn add echarts

# pnpm
pnpm add echarts
```

### 基础示例

```javascript
import * as echarts from 'echarts';

// 初始化 echarts 实例
const myChart = echarts.init(document.getElementById('main'));

// 配置项
const option = {
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
};

// 使用配置项显示图表
myChart.setOption(option);
```

## 核心概念

### 1. 实例（Instance）

```javascript
// 创建实例
const chart = echarts.init(dom, theme, opts);

// 常用方法
chart.setOption(option);  // 设置配置项
chart.resize();           // 调整大小
chart.dispose();          // 销毁实例
chart.clear();            // 清空当前实例
```

### 2. 配置项（Option）

ECharts 的核心是配置项对象，主要包含：

```javascript
const option = {
  // 标题
  title: {
    text: '主标题',
    subtext: '副标题'
  },
  
  // 提示框
  tooltip: {
    trigger: 'axis',  // 触发类型：'item' | 'axis' | 'none'
    formatter: '{b}: {c}'
  },
  
  // 图例
  legend: {
    data: ['销量', '利润']
  },
  
  // 工具栏
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  
  // 网格
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  
  // X 轴
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  
  // Y 轴
  yAxis: {
    type: 'value'
  },
  
  // 系列
  series: [
    {
      name: '销量',
      type: 'line',
      data: [120, 200, 150, 80, 70, 110, 130]
    }
  ]
};
```

### 3. 组件（Component）

- **坐标系组件**：grid（直角坐标系）、polar（极坐标系）、geo（地理坐标系）
- **数据组件**：dataset（数据集）
- **交互组件**：tooltip、legend、dataZoom、visualMap
- **视觉组件**：title、toolbox、markPoint、markLine

### 4. 系列（Series）

系列是图表的核心，定义了数据如何映射成图形：

```javascript
series: [
  {
    name: '系列名称',
    type: 'line',  // 图表类型
    data: [/* 数据 */],
    
    // 样式配置
    itemStyle: {
      color: '#5470c6'
    },
    
    // 标签配置
    label: {
      show: true,
      position: 'top'
    },
    
    // 高亮样式
    emphasis: {
      focus: 'series'
    }
  }
]
```

## 响应式设计

### 监听窗口大小变化

```javascript
window.addEventListener('resize', () => {
  myChart.resize();
});
```

### 媒体查询

```javascript
option = {
  baseOption: {
    // 基础配置
  },
  media: [
    {
      query: { maxWidth: 500 },
      option: {
        // 小屏幕配置
      }
    },
    {
      query: { minWidth: 500, maxWidth: 1000 },
      option: {
        // 中等屏幕配置
      }
    }
  ]
};
```

## 性能优化

### 1. 按需引入

```javascript
// 引入核心模块
import * as echarts from 'echarts/core';
// 引入需要的图表
import { BarChart } from 'echarts/charts';
// 引入需要的组件
import { GridComponent, TooltipComponent } from 'echarts/components';
// 引入渲染器
import { CanvasRenderer } from 'echarts/renderers';

// 注册
echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);
```

### 2. 数据采样

```javascript
series: [{
  type: 'line',
  sampling: 'lttb',  // 采样策略
  data: largeData
}]
```

### 3. 渐进式渲染

```javascript
series: [{
  type: 'scatter',
  large: true,           // 开启大数据量优化
  largeThreshold: 2000,  // 阈值
  data: largeData
}]
```

### 4. 使用 DataZoom

```javascript
dataZoom: [
  {
    type: 'inside',  // 内置型数据区域缩放
    start: 0,
    end: 20
  },
  {
    type: 'slider',  // 滑动条型数据区域缩放
    start: 0,
    end: 20
  }
]
```

## 常见问题

### 1. 图表不显示
- 确保容器有宽高
- 确保在 DOM 加载完成后初始化
- 检查数据格式是否正确

### 2. 响应式问题
- 监听 window.resize 事件
- 调用 chart.resize() 方法

### 3. 内存泄漏
- 组件销毁时调用 chart.dispose()
- 移除事件监听器

```javascript
// React 示例
useEffect(() => {
  const chart = echarts.init(chartRef.current);
  chart.setOption(option);
  
  const handleResize = () => chart.resize();
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    chart.dispose();
  };
}, []);
```

## 最佳实践

1. **合理使用配置项**：避免过度配置，使用默认值
2. **数据处理**：在传入 ECharts 前处理好数据格式
3. **主题定制**：使用主题统一样式
4. **按需加载**：减小打包体积
5. **性能监控**：大数据量时注意性能优化
