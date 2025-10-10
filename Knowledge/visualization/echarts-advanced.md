# ECharts 高级特性

## 数据集（Dataset）

Dataset 是 ECharts 4.0+ 引入的数据管理方式，支持数据与样式分离。

### 基本用法

```javascript
option = {
  dataset: {
    // 数据源
    source: [
      ['product', '2015', '2016', '2017'],
      ['Matcha Latte', 43.3, 85.8, 93.7],
      ['Milk Tea', 83.1, 73.4, 55.1],
      ['Cheese Cocoa', 86.4, 65.2, 82.5]
    ]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: [
    { type: 'bar' },
    { type: 'bar' },
    { type: 'bar' }
  ]
};
```

### 数据映射

```javascript
option = {
  dataset: {
    dimensions: ['product', '2015', '2016', '2017'],
    source: [/* 数据 */]
  },
  series: [
    {
      type: 'bar',
      encode: {
        x: 'product',  // 将 product 列映射到 x 轴
        y: '2015'      // 将 2015 列映射到 y 轴
      }
    }
  ]
};
```

### 数据转换

```javascript
option = {
  dataset: [
    {
      id: 'raw',
      source: [/* 原始数据 */]
    },
    {
      id: 'filtered',
      fromDatasetId: 'raw',
      transform: {
        type: 'filter',
        config: { dimension: 'Year', value: 2011 }
      }
    }
  ],
  series: {
    type: 'pie',
    datasetId: 'filtered'
  }
};
```

## 动画配置

### 初始动画

```javascript
series: [{
  type: 'bar',
  data: [10, 20, 30],
  
  // 初始动画配置
  animation: true,
  animationDuration: 1000,
  animationEasing: 'cubicOut',
  animationDelay: (idx) => idx * 100  // 延迟动画
}]
```

### 更新动画

```javascript
series: [{
  type: 'line',
  data: [10, 20, 30],
  
  // 更新动画配置
  animationDurationUpdate: 300,
  animationEasingUpdate: 'linear'
}]
```

### 自定义动画

```javascript
// 使用 graphic 组件创建自定义动画
graphic: {
  elements: [
    {
      type: 'circle',
      shape: { cx: 100, cy: 100, r: 50 },
      style: { fill: 'red' },
      
      // 关键帧动画
      keyframeAnimation: {
        duration: 3000,
        loop: true,
        keyframes: [
          { percent: 0.5, scaleX: 0.5, scaleY: 0.5 },
          { percent: 1, scaleX: 1, scaleY: 1 }
        ]
      }
    }
  ]
}
```

## 事件处理

### 鼠标事件

```javascript
// 点击事件
myChart.on('click', (params) => {
  console.log('点击了：', params.name);
  console.log('数据索引：', params.dataIndex);
  console.log('系列索引：', params.seriesIndex);
});

// 鼠标悬浮事件
myChart.on('mouseover', (params) => {
  console.log('鼠标悬浮：', params);
});

// 双击事件
myChart.on('dblclick', (params) => {
  console.log('双击：', params);
});
```

### 组件事件

```javascript
// 图例切换事件
myChart.on('legendselectchanged', (params) => {
  console.log('图例选择改变：', params.selected);
});

// 数据区域缩放事件
myChart.on('datazoom', (params) => {
  console.log('数据缩放：', params);
});

// 工具栏事件
myChart.on('restore', () => {
  console.log('还原图表');
});
```

### 事件解绑

```javascript
const handler = (params) => {
  console.log(params);
};

// 绑定事件
myChart.on('click', handler);

// 解绑事件
myChart.off('click', handler);
```

## 异步数据加载

### Loading 动画

```javascript
// 显示加载动画
myChart.showLoading();

// 异步加载数据
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    myChart.hideLoading();
    myChart.setOption({
      series: [{ data }]
    });
  });
```

### 增量更新

```javascript
// 首次设置
myChart.setOption(option);

// 增量更新（不会合并数组）
myChart.setOption({
  series: [{
    data: newData
  }]
});

// 完全替换
myChart.setOption(option, true);
```

## 自定义系列（Custom Series）

自定义系列允许完全控制图形的渲染。

```javascript
series: [{
  type: 'custom',
  renderItem: (params, api) => {
    // 获取数据值
    const value = api.value(0);
    const coord = api.coord([api.value(0), api.value(1)]);
    
    // 返回图形元素
    return {
      type: 'circle',
      shape: {
        cx: coord[0],
        cy: coord[1],
        r: 20
      },
      style: {
        fill: api.visual('color')
      }
    };
  },
  data: [[10, 20], [20, 30], [30, 40]]
}]
```

## GL 3D 可视化

### 3D 柱状图

```javascript
import 'echarts-gl';

option = {
  xAxis3D: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis3D: { type: 'category', data: ['X', 'Y', 'Z'] },
  zAxis3D: { type: 'value' },
  
  grid3D: {
    viewControl: {
      autoRotate: true  // 自动旋转
    }
  },
  
  series: [{
    type: 'bar3D',
    data: [
      [0, 0, 5], [0, 1, 1], [0, 2, 0],
      [1, 0, 4], [1, 1, 2], [1, 2, 1],
      [2, 0, 1], [2, 1, 4], [2, 2, 3]
    ],
    shading: 'lambert',
    
    label: {
      show: false
    },
    
    emphasis: {
      label: {
        show: true
      },
      itemStyle: {
        color: '#900'
      }
    }
  }]
};
```

### 3D 地球

```javascript
series: [{
  type: 'globe',
  
  globeRadius: 80,
  
  environment: 'auto',  // 环境贴图
  
  baseTexture: 'earth.jpg',  // 地球纹理
  
  heightTexture: 'bathymetry.jpg',  // 高度纹理
  
  shading: 'realistic',
  
  light: {
    ambient: {
      intensity: 0.1
    },
    main: {
      intensity: 1.5
    }
  },
  
  viewControl: {
    autoRotate: true,
    autoRotateSpeed: 10
  }
}]
```

## 地图可视化

### 基础地图

```javascript
import chinaMap from './china.json';

// 注册地图
echarts.registerMap('china', chinaMap);

option = {
  geo: {
    map: 'china',
    roam: true,  // 允许缩放和平移
    
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#444'
    },
    
    emphasis: {
      itemStyle: {
        areaColor: '#ffd700'
      }
    }
  },
  
  series: [
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      data: [
        { name: '北京', value: [116.4074, 39.9042, 100] },
        { name: '上海', value: [121.4737, 31.2304, 200] }
      ],
      symbolSize: (val) => val[2] / 10,
      
      label: {
        show: true,
        formatter: '{b}'
      }
    }
  ]
};
```

### 热力图

```javascript
series: [{
  type: 'heatmap',
  coordinateSystem: 'geo',
  data: [
    [116.4074, 39.9042, 100],
    [121.4737, 31.2304, 200]
  ],
  
  pointSize: 5,
  blurSize: 6
}],

visualMap: {
  min: 0,
  max: 200,
  calculable: true,
  inRange: {
    color: ['blue', 'green', 'yellow', 'red']
  }
}
```

## 主题定制

### 使用内置主题

```javascript
// 初始化时指定主题
const chart = echarts.init(dom, 'dark');
```

### 自定义主题

```javascript
// 定义主题
const myTheme = {
  color: ['#c23531', '#2f4554', '#61a0a8'],
  backgroundColor: '#f4f4f4',
  
  title: {
    textStyle: {
      color: '#333'
    }
  },
  
  legend: {
    textStyle: {
      color: '#666'
    }
  }
};

// 注册主题
echarts.registerTheme('myTheme', myTheme);

// 使用主题
const chart = echarts.init(dom, 'myTheme');
```

## 与框架集成

### React 集成

```jsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function EChartsComponent({ option }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  
  useEffect(() => {
    // 初始化
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }
    
    // 更新配置
    instanceRef.current.setOption(option);
    
    // 响应式
    const handleResize = () => {
      instanceRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    
    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [option]);
  
  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
}
```

### Vue 3 集成

```vue
<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  option: Object
});

const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  chartInstance = echarts.init(chartRef.value);
  chartInstance.setOption(props.option);
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

watch(() => props.option, (newOption) => {
  chartInstance?.setOption(newOption);
}, { deep: true });

const handleResize = () => {
  chartInstance?.resize();
};
</script>
```

## 性能优化技巧

### 1. 虚拟滚动

对于大量数据，使用 dataZoom 实现虚拟滚动：

```javascript
dataZoom: [{
  type: 'inside',
  start: 0,
  end: 10,  // 只显示 10% 的数据
  minValueSpan: 10  // 最小显示数据量
}]
```

### 2. 降低精度

```javascript
series: [{
  type: 'line',
  data: data.map(item => Math.round(item))  // 四舍五入
}]
```

### 3. 使用 Canvas 而非 SVG

```javascript
// Canvas 适合大数据量
const chart = echarts.init(dom, null, { renderer: 'canvas' });

// SVG 适合小数据量、需要高清打印
const chart = echarts.init(dom, null, { renderer: 'svg' });
```

### 4. 分批加载

```javascript
let dataIndex = 0;
const batchSize = 1000;

function loadBatch() {
  const batch = allData.slice(dataIndex, dataIndex + batchSize);
  
  myChart.appendData({
    seriesIndex: 0,
    data: batch
  });
  
  dataIndex += batchSize;
  
  if (dataIndex < allData.length) {
    setTimeout(loadBatch, 100);
  }
}

loadBatch();
```
