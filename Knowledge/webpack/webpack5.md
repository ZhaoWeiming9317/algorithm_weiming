# Webpack 5 深度解析

## 1. Webpack 5 主要新特性

### 1.1 持久化缓存

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem', // 使用文件系统缓存
    buildDependencies: {
      config: [__filename] // 构建依赖
    },
    name: 'my-cache', // 缓存名称
    version: '1.0' // 缓存版本
  }
}
```

优势：
- 显著提升二次构建速度
- 支持多缓存版本
- 可以在 CI/CD 中共享缓存

### 1.2 资源模块（Asset Modules）

取代了 file-loader、url-loader 和 raw-loader：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource' // 替代 file-loader
      },
      {
        test: /\.svg/,
        type: 'asset/inline' // 替代 url-loader
      },
      {
        test: /\.txt/,
        type: 'asset/source' // 替代 raw-loader
      },
      {
        test: /\.jpg/,
        type: 'asset', // 自动选择
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        }
      }
    ]
  }
}
```

### 1.3 模块联邦（Module Federation）

允许多个独立的构建组成一个应用程序：

```javascript
// host/webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ]
};

// remote/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button'
      },
      shared: ['react', 'react-dom']
    })
  ]
};
```

### 1.4 Tree Shaking 优化

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}
```

新增特性：
- 支持对 CommonJS 的 Tree Shaking
- 支持嵌套的 Tree Shaking
- 支持对 unused exports 的删除

## 2. 核心概念优化

### 2.1 更好的 Code Splitting

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'all'
        }
      }
    }
  }
}
```

### 2.2 Node.js Polyfills 自动引入被移除

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/")
    }
  }
}
```

### 2.3 WebAssembly 支持改进

```javascript
module.exports = {
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
  }
}
```

## 3. 性能优化

### 3.1 构建性能优化

```javascript
module.exports = {
  // 持久化缓存
  cache: {
    type: 'filesystem'
  },
  
  // 并行处理
  parallelism: 4,
  
  // 优化模块解析
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  },
  
  // 优化 loader 配置
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 2
            }
          },
          'babel-loader'
        ]
      }
    ]
  }
}
```

### 3.2 输出包体积优化

```javascript
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CompressionPlugin()
  ]
}
```

## 4. 开发体验改进

### 4.1 改进的开发服务器

```javascript
module.exports = {
  devServer: {
    hot: true,
    liveReload: true,
    client: {
      overlay: true,
      progress: true
    },
    static: {
      directory: path.join(__dirname, 'public')
    },
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

### 4.2 更好的错误报告

- 更清晰的错误堆栈
- 改进的错误提示
- 模块追踪信息

## 5. 迁移指南

### 5.1 从 Webpack 4 迁移

1. **更新依赖**
```bash
npm install webpack@5 webpack-cli@4 --save-dev
```

2. **调整配置**
```javascript
// webpack.config.js
module.exports = {
  target: ['web', 'es5'],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true // 替代 CleanWebpackPlugin
  }
}
```

3. **移除废弃特性**
- 移除 Node.js polyfills
- 更新 loader 和 plugin 版本
- 使用新的资源模块类型

### 5.2 常见问题解决

1. **Node.js polyfills 问题**
```javascript
npm install buffer crypto-browserify stream-browserify
```

2. **资源模块迁移**
```javascript
// 旧配置
{
  test: /\.(png|jpg|gif)$/i,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
      },
    },
  ],
}

// 新配置
{
  test: /\.(png|jpg|gif)$/i,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8192
    }
  }
}
```

## 6. 最佳实践

### 6.1 优化配置

```javascript
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  cache: {
    type: 'filesystem'
  }
};
```

### 6.2 开发环境配置

```javascript
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: true
    }
  },
  cache: {
    type: 'memory'
  }
};
```
