# 数据可视化知识体系

数据可视化是将数据转换为图形或图像的过程，帮助人们更好地理解和分析数据。

## 目录结构

- **[echarts-basics.md](./echarts-basics.md)** - ECharts 基础知识
  - ECharts 简介和特性
  - 基本使用
  - 核心概念（实例、配置项、组件、系列）
  - 响应式设计
  - 性能优化
  - 常见问题

- **[echarts-advanced.md](./echarts-advanced.md)** - ECharts 高级特性
  - 数据集（Dataset）
  - 动画配置
  - 事件处理
  - 异步数据加载
  - 自定义系列
  - GL 3D 可视化
  - 地图可视化
  - 主题定制
  - 与框架集成

- **[echarts-interview.md](./echarts-interview.md)** - ECharts 面试题
  - 基础问题
  - 进阶问题
  - 实战问题

## ECharts 简介

ECharts（Enterprise Charts）是百度开源的一个基于 JavaScript 的数据可视化图表库，提供直观、生动、可交互、可高度个性化定制的数据可视化图表。

### 核心特性

1. **丰富的图表类型**
   - 折线图、柱状图、饼图、散点图
   - K线图、雷达图、热力图、树图
   - 地图、3D 可视化

2. **强大的交互能力**
   - 数据区域缩放
   - 图例开关
   - 数据视图
   - 动态类型切换

3. **多维数据支持**
   - 支持多系列数据
   - 支持数据过滤、映射
   - 支持数据动态更新

4. **高性能**
   - Canvas 渲染
   - 数据采样
   - 渐进式渲染
   - 按需加载

## 学习路径

### 1. 入门阶段
- 了解 ECharts 基本概念
- 学习基础图表类型
- 掌握配置项结构
- 实现简单的图表

### 2. 进阶阶段
- 学习数据集（Dataset）
- 掌握事件处理
- 理解动画系统
- 实现交互功能

### 3. 高级阶段
- 自定义系列
- 3D 可视化
- 地图可视化
- 性能优化

### 4. 实战阶段
- 与框架集成
- 大数据可视化
- 实时数据更新
- 复杂交互实现

## 常用图表类型

### 基础图表
- **折线图（Line）**：展示数据趋势
- **柱状图（Bar）**：比较数据大小
- **饼图（Pie）**：展示数据占比
- **散点图（Scatter）**：展示数据分布

### 高级图表
- **K线图（Candlestick）**：股票数据
- **雷达图（Radar）**：多维数据对比
- **热力图（Heatmap）**：数据密度
- **树图（Tree）**：层级数据
- **旭日图（Sunburst）**：层级占比

### 地理可视化
- **地图（Map）**：地理数据
- **散点图（Scatter on Geo）**：地理位置
- **热力图（Heatmap on Geo）**：地理密度

### 3D 可视化
- **3D 柱状图（Bar3D）**
- **3D 散点图（Scatter3D）**
- **3D 曲面（Surface）**
- **3D 地球（Globe）**

## 核心 API

### 实例方法
```javascript
// 创建实例
const chart = echarts.init(dom, theme, opts);

// 设置配置
chart.setOption(option);

// 调整大小
chart.resize();

// 销毁实例
chart.dispose();

// 清空当前实例
chart.clear();

// 获取配置
const option = chart.getOption();

// 显示/隐藏加载动画
chart.showLoading();
chart.hideLoading();

// 导出图片
const url = chart.getDataURL();

// 事件处理
chart.on('click', handler);
chart.off('click', handler);

// 触发事件
chart.dispatchAction({ type: 'highlight' });
```

### 配置项结构
```javascript
option = {
  title: {},        // 标题
  tooltip: {},      // 提示框
  legend: {},       // 图例
  toolbox: {},      // 工具栏
  grid: {},         // 网格
  xAxis: {},        // X 轴
  yAxis: {},        // Y 轴
  dataZoom: [],     // 数据区域缩放
  visualMap: {},    // 视觉映射
  series: []        // 系列
};
```

## 性能优化技巧

1. **按需引入**
   - 只引入需要的图表和组件
   - 减小打包体积

2. **数据采样**
   - 使用 sampling 配置
   - 减少渲染的数据点

3. **渐进式渲染**
   - 使用 large 和 largeThreshold
   - 适合大数据量场景

4. **使用 DataZoom**
   - 只渲染可见区域的数据
   - 提高交互性能

5. **使用 Canvas 渲染器**
   - 适合大数据量
   - 性能更好

6. **避免频繁更新**
   - 使用防抖/节流
   - 批量更新数据

## 与框架集成

### React
```jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function EChartsComponent({ option }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  
  useEffect(() => {
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }
    instanceRef.current.setOption(option);
    
    return () => {
      instanceRef.current?.dispose();
    };
  }, [option]);
  
  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
}
```

### Vue 3
```vue
<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({ option: Object });
const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(props.option);
});

onUnmounted(() => {
  chartInstance?.dispose();
});

watch(() => props.option, (newOption) => {
  chartInstance?.setOption(newOption);
}, { deep: true });
</script>
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

### 4. 性能问题
- 使用数据采样
- 使用渐进式渲染
- 使用 DataZoom
- 按需加载

## 学习资源

### 官方资源
- [ECharts 官网](https://echarts.apache.org)
- [ECharts 示例](https://echarts.apache.org/examples)
- [ECharts 配置项手册](https://echarts.apache.org/option.html)
- [ECharts API 文档](https://echarts.apache.org/api.html)

### 社区资源
- [ECharts GitHub](https://github.com/apache/echarts)
- [ECharts 社区](https://github.com/ecomfe/awesome-echarts)

## 其他可视化库

### D3.js
- 最强大的可视化库
- 完全自定义
- 学习曲线陡峭

### Chart.js
- 简单易用
- 8 种基础图表
- 适合简单场景

### Highcharts
- 商业图表库
- 功能丰富
- 需要付费

### AntV
- 蚂蚁金服开源
- G2、G6、F2、L7
- 适合企业级应用

### Plotly
- 科学计算可视化
- 支持 Python、R、JavaScript
- 适合数据分析

## 最佳实践

1. **合理使用配置项**
   - 避免过度配置
   - 使用默认值

2. **数据处理**
   - 在传入 ECharts 前处理好数据格式
   - 使用 dataset 管理数据

3. **主题定制**
   - 使用主题统一样式
   - 避免重复配置

4. **按需加载**
   - 减小打包体积
   - 提高加载速度

5. **性能监控**
   - 大数据量时注意性能优化
   - 使用 DevTools 分析性能

6. **响应式设计**
   - 监听窗口大小变化
   - 使用媒体查询

7. **错误处理**
   - 处理数据加载失败
   - 提供友好的错误提示

## 总结

ECharts 是一个功能强大、易于使用的数据可视化库，适合各种场景的图表需求。通过系统学习和实践，可以快速掌握 ECharts，创建出色的数据可视化应用。
