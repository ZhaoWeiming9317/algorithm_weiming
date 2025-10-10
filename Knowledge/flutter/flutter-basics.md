# Flutter 基础知识

## 什么是 Flutter？

Flutter 是 Google 开源的 UI 工具包，用于从单一代码库构建美观、原生编译的移动、Web 和桌面应用程序。

## 核心特性

### 1. 跨平台
- **一套代码，多端运行**：iOS、Android、Web、Windows、macOS、Linux
- **原生性能**：直接编译为原生代码，无需 JavaScript 桥接
- **统一体验**：在所有平台上保持一致的 UI 和行为

### 2. 快速开发
- **热重载（Hot Reload）**：毫秒级更新 UI，保持应用状态
- **丰富的 Widget**：Material Design 和 Cupertino（iOS 风格）组件
- **声明式 UI**：使用 Dart 语言描述 UI

### 3. 美观的 UI
- **高度可定制**：完全控制屏幕上的每个像素
- **流畅动画**：60fps/120fps 的流畅动画
- **Material Design 3**：最新的设计规范支持

## 环境搭建

### 安装 Flutter SDK

```bash
# macOS
brew install flutter

# 或手动下载
# https://flutter.dev/docs/get-started/install

# 检查环境
flutter doctor

# 配置环境变量
export PATH="$PATH:`pwd`/flutter/bin"
```

### 创建项目

```bash
# 创建新项目
flutter create my_app

# 进入项目目录
cd my_app

# 运行项目
flutter run

# 运行在特定设备
flutter run -d chrome  # Web
flutter run -d macos   # macOS
```

## Dart 语言基础

### 变量和类型

```dart
// 变量声明
var name = 'Flutter';
String name = 'Flutter';
final name = 'Flutter';  // 运行时常量
const name = 'Flutter';  // 编译时常量

// 类型
int age = 25;
double height = 1.75;
bool isActive = true;
String text = 'Hello';
List<int> numbers = [1, 2, 3];
Map<String, int> scores = {'math': 90, 'english': 85};

// 可空类型
String? nullableName;
int? nullableAge;

// 非空断言
String name = nullableName!;

// 空安全操作符
String displayName = nullableName ?? 'Guest';
int? length = nullableName?.length;
```

### 函数

```dart
// 基本函数
String greet(String name) {
  return 'Hello, $name';
}

// 箭头函数
String greet(String name) => 'Hello, $name';

// 可选参数
void printInfo(String name, [int? age]) {
  print('$name, $age');
}

// 命名参数
void printInfo({required String name, int? age}) {
  print('$name, $age');
}

// 默认参数
void printInfo(String name, {int age = 18}) {
  print('$name, $age');
}
```

### 类和对象

```dart
// 类定义
class Person {
  String name;
  int age;
  
  // 构造函数
  Person(this.name, this.age);
  
  // 命名构造函数
  Person.guest() : name = 'Guest', age = 0;
  
  // 方法
  void introduce() {
    print('I am $name, $age years old');
  }
  
  // Getter
  String get info => '$name ($age)';
  
  // Setter
  set info(String value) {
    var parts = value.split(' ');
    name = parts[0];
    age = int.parse(parts[1]);
  }
}

// 继承
class Student extends Person {
  String school;
  
  Student(String name, int age, this.school) : super(name, age);
  
  @override
  void introduce() {
    super.introduce();
    print('I study at $school');
  }
}

// 抽象类
abstract class Animal {
  void makeSound();
}

// 接口（Dart 中所有类都可以作为接口）
class Dog implements Animal {
  @override
  void makeSound() {
    print('Woof!');
  }
}

// Mixin
mixin Flyable {
  void fly() {
    print('Flying...');
  }
}

class Bird with Flyable {}
```

### 异步编程

```dart
// Future
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return 'Data loaded';
}

// 使用 async/await
void loadData() async {
  try {
    String data = await fetchData();
    print(data);
  } catch (e) {
    print('Error: $e');
  }
}

// Stream
Stream<int> countStream() async* {
  for (int i = 1; i <= 5; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

// 监听 Stream
void listenStream() {
  countStream().listen(
    (data) => print(data),
    onError: (error) => print('Error: $error'),
    onDone: () => print('Done'),
  );
}
```

## Widget 基础

### 一切皆 Widget

Flutter 中一切都是 Widget，包括：
- 结构元素（按钮、菜单）
- 样式元素（字体、颜色）
- 布局元素（padding、center）
- 导航元素（路由）

### StatelessWidget vs StatefulWidget

```dart
// 无状态 Widget
class MyText extends StatelessWidget {
  final String text;
  
  const MyText({Key? key, required this.text}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Text(text);
  }
}

// 有状态 Widget
class Counter extends StatefulWidget {
  const Counter({Key? key}) : super(key: key);
  
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;
  
  void _increment() {
    setState(() {
      _count++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: _increment,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

### 常用 Widget

```dart
// 文本
Text(
  'Hello Flutter',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
  ),
)

// 按钮
ElevatedButton(
  onPressed: () => print('Pressed'),
  child: Text('Click Me'),
)

TextButton(
  onPressed: () {},
  child: Text('Text Button'),
)

IconButton(
  icon: Icon(Icons.favorite),
  onPressed: () {},
)

// 图片
Image.network('https://example.com/image.png')
Image.asset('assets/logo.png')

// 容器
Container(
  width: 100,
  height: 100,
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(horizontal: 8),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: Colors.black26,
        blurRadius: 4,
        offset: Offset(2, 2),
      ),
    ],
  ),
  child: Text('Container'),
)

// 行和列
Row(
  mainAxisAlignment: MainAxisAlignment.spaceAround,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Text('Item 1'),
    Text('Item 2'),
    Text('Item 3'),
  ],
)

Column(
  children: [
    Text('Line 1'),
    Text('Line 2'),
    Text('Line 3'),
  ],
)

// 列表
ListView(
  children: [
    ListTile(title: Text('Item 1')),
    ListTile(title: Text('Item 2')),
    ListTile(title: Text('Item 3')),
  ],
)

ListView.builder(
  itemCount: 100,
  itemBuilder: (context, index) {
    return ListTile(title: Text('Item $index'));
  },
)

// 网格
GridView.count(
  crossAxisCount: 2,
  children: List.generate(10, (index) {
    return Card(
      child: Center(child: Text('Item $index')),
    );
  }),
)

// 堆叠
Stack(
  children: [
    Container(color: Colors.blue, width: 200, height: 200),
    Positioned(
      top: 20,
      left: 20,
      child: Text('Overlay'),
    ),
  ],
)
```

## 布局

### 单子 Widget

```dart
// Center - 居中
Center(child: Text('Centered'))

// Padding - 内边距
Padding(
  padding: EdgeInsets.all(16),
  child: Text('Padded'),
)

// Align - 对齐
Align(
  alignment: Alignment.topRight,
  child: Text('Aligned'),
)

// SizedBox - 固定尺寸
SizedBox(
  width: 100,
  height: 100,
  child: Text('Sized'),
)

// Expanded - 填充剩余空间
Row(
  children: [
    Text('Fixed'),
    Expanded(child: Text('Expanded')),
  ],
)

// Flexible - 灵活布局
Row(
  children: [
    Flexible(
      flex: 2,
      child: Container(color: Colors.red),
    ),
    Flexible(
      flex: 1,
      child: Container(color: Colors.blue),
    ),
  ],
)
```

### 多子 Widget

```dart
// Row - 水平布局
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [...],
)

// Column - 垂直布局
Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [...],
)

// Wrap - 自动换行
Wrap(
  spacing: 8,
  runSpacing: 8,
  children: [...],
)

// ListView - 可滚动列表
ListView(
  scrollDirection: Axis.vertical,
  children: [...],
)

// GridView - 网格
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2,
    crossAxisSpacing: 8,
    mainAxisSpacing: 8,
  ),
  itemBuilder: (context, index) => Card(),
)
```

## 导航和路由

### 基础导航

```dart
// 跳转到新页面
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondPage()),
);

// 返回上一页
Navigator.pop(context);

// 返回并传递数据
Navigator.pop(context, 'Result data');

// 接收返回数据
final result = await Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondPage()),
);
```

### 命名路由

```dart
// 定义路由
MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => HomePage(),
    '/second': (context) => SecondPage(),
    '/third': (context) => ThirdPage(),
  },
)

// 使用命名路由
Navigator.pushNamed(context, '/second');

// 传递参数
Navigator.pushNamed(
  context,
  '/second',
  arguments: {'id': 123, 'name': 'Flutter'},
);

// 接收参数
class SecondPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as Map;
    return Text('ID: ${args['id']}');
  }
}

// 替换当前路由
Navigator.pushReplacementNamed(context, '/second');

// 清空路由栈
Navigator.pushNamedAndRemoveUntil(
  context,
  '/home',
  (route) => false,
);
```

## 状态管理

### setState

```dart
class CounterPage extends StatefulWidget {
  @override
  _CounterPageState createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _counter = 0;
  
  void _increment() {
    setState(() {
      _counter++;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text('$_counter')),
      floatingActionButton: FloatingActionButton(
        onPressed: _increment,
        child: Icon(Icons.add),
      ),
    );
  }
}
```

### InheritedWidget

```dart
class CounterProvider extends InheritedWidget {
  final int counter;
  final Function() increment;
  
  const CounterProvider({
    Key? key,
    required this.counter,
    required this.increment,
    required Widget child,
  }) : super(key: key, child: child);
  
  static CounterProvider? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<CounterProvider>();
  }
  
  @override
  bool updateShouldNotify(CounterProvider oldWidget) {
    return counter != oldWidget.counter;
  }
}

// 使用
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = CounterProvider.of(context);
    return Text('${provider?.counter}');
  }
}
```

## 网络请求

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

// GET 请求
Future<Map<String, dynamic>> fetchData() async {
  final response = await http.get(
    Uri.parse('https://api.example.com/data'),
  );
  
  if (response.statusCode == 200) {
    return json.decode(response.body);
  } else {
    throw Exception('Failed to load data');
  }
}

// POST 请求
Future<void> postData(Map<String, dynamic> data) async {
  final response = await http.post(
    Uri.parse('https://api.example.com/data'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode(data),
  );
  
  if (response.statusCode != 200) {
    throw Exception('Failed to post data');
  }
}

// 使用 FutureBuilder
class DataWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, dynamic>>(
      future: fetchData(),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Text('${snapshot.data}');
        } else if (snapshot.hasError) {
          return Text('Error: ${snapshot.error}');
        }
        return CircularProgressIndicator();
      },
    );
  }
}
```

## 本地存储

```dart
import 'package:shared_preferences/shared_preferences.dart';

// 保存数据
Future<void> saveData() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('name', 'Flutter');
  await prefs.setInt('age', 5);
  await prefs.setBool('isActive', true);
}

// 读取数据
Future<String?> loadData() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('name');
}

// 删除数据
Future<void> removeData() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove('name');
}
```

## 最佳实践

1. **使用 const 构造函数**：提高性能，减少重建
2. **合理拆分 Widget**：保持代码清晰，提高复用性
3. **避免在 build 方法中创建对象**：防止不必要的重建
4. **使用 Keys**：帮助 Flutter 识别 Widget
5. **异步操作使用 async/await**：代码更清晰
6. **错误处理**：使用 try-catch 处理异常
7. **资源释放**：在 dispose 中释放资源
