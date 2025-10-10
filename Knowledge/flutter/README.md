# Flutter 知识体系

Flutter 是 Google 开源的跨平台 UI 框架，用于构建高性能、美观的移动、Web 和桌面应用。

## 目录结构

- **[flutter-basics.md](./flutter-basics.md)** - Flutter 基础知识
  - Flutter 简介和特性
  - Dart 语言基础
  - Widget 基础
  - 布局系统
  - 导航和路由
  - 状态管理基础
  - 网络请求和本地存储

- **[flutter-advanced.md](./flutter-advanced.md)** - Flutter 高级特性
  - 状态管理方案（Provider、Riverpod、BLoC、GetX）
  - 动画系统
  - 自定义绘制
  - 性能优化
  - 平台集成（Method Channel、Event Channel）
  - 测试（单元测试、Widget 测试、集成测试）

- **[flutter-interview.md](./flutter-interview.md)** - Flutter 面试题
  - 基础问题
  - 进阶问题
  - 实战问题

## 学习路径

### 1. 入门阶段
- 学习 Dart 语言基础
- 理解 Widget 概念
- 掌握常用 Widget
- 学习布局系统
- 实现简单的页面

### 2. 进阶阶段
- 掌握状态管理
- 学习导航和路由
- 理解生命周期
- 网络请求和数据处理
- 本地存储

### 3. 高级阶段
- 深入理解渲染机制
- 性能优化
- 自定义 Widget
- 动画实现
- 平台集成

### 4. 实战阶段
- 完整项目开发
- 架构设计
- 代码规范
- 测试
- 发布上线

## 核心概念

### Widget
- 一切皆 Widget
- StatelessWidget vs StatefulWidget
- Widget 树、Element 树、RenderObject 树

### 状态管理
- setState
- InheritedWidget
- Provider
- Riverpod
- BLoC
- GetX

### 渲染机制
- Build 阶段
- Layout 阶段
- Paint 阶段
- 三棵树的关系

### 性能优化
- const 构造函数
- ListView.builder
- RepaintBoundary
- 避免不必要的重建

## 常用包

### UI 组件
- `flutter_screenutil` - 屏幕适配
- `cached_network_image` - 图片缓存
- `flutter_svg` - SVG 支持
- `lottie` - Lottie 动画

### 状态管理
- `provider` - 官方推荐
- `riverpod` - Provider 改进版
- `flutter_bloc` - BLoC 模式
- `get` - GetX 框架

### 网络请求
- `dio` - HTTP 客户端
- `http` - 官方 HTTP 包

### 本地存储
- `shared_preferences` - 键值对存储
- `sqflite` - SQLite 数据库
- `hive` - 轻量级 NoSQL 数据库

### 工具
- `flutter_launcher_icons` - 应用图标
- `flutter_native_splash` - 启动屏幕
- `path_provider` - 文件路径
- `permission_handler` - 权限管理

## 开发工具

- **Flutter SDK** - Flutter 开发工具包
- **Dart SDK** - Dart 语言工具包
- **Android Studio** - Android 开发 IDE
- **VS Code** - 轻量级编辑器
- **Flutter DevTools** - 性能分析工具

## 学习资源

### 官方文档
- [Flutter 官网](https://flutter.dev)
- [Dart 官网](https://dart.dev)
- [Flutter 中文网](https://flutter.cn)

### 社区
- [Flutter GitHub](https://github.com/flutter/flutter)
- [Pub.dev](https://pub.dev) - Dart 包管理
- [Flutter 社区](https://flutter.cn/community)

### 教程
- Flutter 官方教程
- Flutter 实战
- Flutter Cookbook

## 最佳实践

1. **代码组织**
   - 按功能模块组织
   - 使用清晰的目录结构
   - 分离业务逻辑和 UI

2. **状态管理**
   - 选择合适的状态管理方案
   - 避免过度使用 setState
   - 合理划分状态范围

3. **性能优化**
   - 使用 const 构造函数
   - 使用 builder 模式
   - 避免在 build 中创建对象
   - 使用 RepaintBoundary

4. **代码规范**
   - 遵循 Dart 官方代码规范
   - 使用 `flutter analyze` 检查代码
   - 使用 `flutter format` 格式化代码

5. **测试**
   - 编写单元测试
   - 编写 Widget 测试
   - 编写集成测试

6. **国际化**
   - 使用 intl 包
   - 支持多语言
   - 适配不同地区

7. **主题**
   - 使用 ThemeData 统一样式
   - 支持深色模式
   - 自定义主题

## 常见问题

### 1. 如何选择状态管理方案？
- 小型项目：setState、InheritedWidget
- 中型项目：Provider、Riverpod
- 大型项目：BLoC、Redux

### 2. 如何优化性能？
- 使用 const 构造函数
- 使用 builder 模式
- 避免不必要的重建
- 使用 RepaintBoundary
- 图片优化

### 3. 如何调试？
- 使用 print 输出日志
- 使用 debugPrint
- 使用 Flutter DevTools
- 使用断点调试

### 4. 如何处理异步操作？
- 使用 async/await
- 使用 FutureBuilder
- 使用 StreamBuilder
- 使用 Isolate 处理耗时操作

### 5. 如何适配不同屏幕？
- 使用 MediaQuery
- 使用 LayoutBuilder
- 使用 flutter_screenutil
- 使用响应式布局

## 项目结构示例

```
lib/
├── main.dart
├── app.dart
├── config/
│   ├── routes.dart
│   ├── theme.dart
│   └── constants.dart
├── models/
│   ├── user.dart
│   └── product.dart
├── providers/
│   ├── auth_provider.dart
│   └── cart_provider.dart
├── services/
│   ├── api_service.dart
│   └── storage_service.dart
├── screens/
│   ├── home/
│   │   ├── home_screen.dart
│   │   └── widgets/
│   ├── profile/
│   │   └── profile_screen.dart
│   └── login/
│       └── login_screen.dart
├── widgets/
│   ├── custom_button.dart
│   └── custom_input.dart
└── utils/
    ├── validators.dart
    └── helpers.dart
```

## 总结

Flutter 是一个强大的跨平台开发框架，具有高性能、美观的 UI 和丰富的生态系统。通过系统学习和实践，可以快速掌握 Flutter 开发，构建出色的应用。
