# Webpack 核心概念详解

## 1. Entry（入口）

入口指示 webpack 应该使用哪个模块来作为构建其内部依赖图的开始。

```javascript
// 单入口
module.exports = {
  entry: './src/index.js'
}

// 多入口
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
}
```

## 2. Output（输出）

输出告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。

```javascript
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true, // 在生成文件之前清空 output 目录
    publicPath: '/' // 指定公共路径
  }
}
```

## 3. Loader（加载器）

loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块。

```javascript
module.exports = {
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      
      // SASS
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      
      // 图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  }
}
```

## 4. Plugins（插件）

插件用于执行范围更广的任务，从打包优化和压缩，到重新定义环境中的变量。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
```

## 5. Mode（模式）

通过选择 development, production 或 none 之中的一个来设置 mode 参数。

```javascript
module.exports = {
  mode: 'production' // 'development' | 'none'
}
```

## 6. 模块解析（Resolve）

配置模块如何解析，比如指定扩展名、模块别名等。

```javascript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components')
    },
    modules: ['node_modules']
  }
}
```

## 7. 优化（Optimization）

包含了一系列优化项目的配置。

```javascript
module.exports = {
  optimization: {
    // 代码分割
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    
    // 运行时代码抽离
    runtimeChunk: 'single',
    
    // 压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
}
```

## 8. 开发服务器（DevServer）

提供了开发服务器，用于快速开发应用程序。

```javascript
module.exports = {
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
```

## 9. 性能（Performance）

设置如何展示性能提示。

```javascript
module.exports = {
  performance: {
    hints: 'warning', // 'error' | false
    maxAssetSize: 250000, // 整数类型（以字节为单位）
    maxEntrypointSize: 250000
  }
}
```

## 10. 模块热替换（HMR）

允许在运行时更新所有类型的模块，而无需完全刷新。

```javascript
module.exports = {
  devServer: {
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

// 在应用程序中
if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    printMe();
  })
}
```

## 11. Source Maps

帮助我们调试代码，将编译后的代码映射回原始源代码。

```javascript
module.exports = {
  devtool: 'source-map' // development
  // devtool: 'hidden-source-map' // production
}
```

## 12. 环境变量

使用环境变量来区分开发和生产环境的构建。

```javascript
// webpack.config.js
module.exports = (env) => {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: env.production ? 'source-map' : 'eval-cheap-module-source-map',
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.production ? 'production' : 'development')
      })
    ]
  }
}

// package.json
{
  "scripts": {
    "build": "webpack --env production",
    "dev": "webpack serve --env development"
  }
}
```

## 13. 构建性能优化

```javascript
module.exports = {
  // 缓存
  cache: {
    type: 'filesystem'
  },
  
  // 多进程打包
  module: {
    rules: [
      {
        test: /\.js$/,
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
  },
  
  // 排除不需要解析的模块
  module: {
    noParse: /jquery|lodash/
  },
  
  // 限制搜索范围
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')]
  }
}
```
