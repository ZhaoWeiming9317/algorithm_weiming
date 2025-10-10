# Flutter 高级特性

## 状态管理方案

### Provider

Provider 是 Flutter 官方推荐的状态管理方案。

```dart
// 安装
// dependencies:
//   provider: ^6.0.0

// 1. 创建 Model
class CounterModel extends ChangeNotifier {
  int _count = 0;
  
  int get count => _count;
  
  void increment() {
    _count++;
    notifyListeners();  // 通知监听者
  }
  
  void decrement() {
    _count--;
    notifyListeners();
  }
}

// 2. 提供 Model
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => CounterModel(),
      child: MyApp(),
    ),
  );
}

// 多个 Provider
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => CounterModel()),
    ChangeNotifierProvider(create: (_) => UserModel()),
  ],
  child: MyApp(),
)

// 3. 消费 Model
class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // 方式 1：Consumer
    return Consumer<CounterModel>(
      builder: (context, counter, child) {
        return Text('${counter.count}');
      },
    );
    
    // 方式 2：Provider.of
    final counter = Provider.of<CounterModel>(context);
    return Text('${counter.count}');
    
    // 方式 3：context.watch (推荐)
    final counter = context.watch<CounterModel>();
    return Text('${counter.count}');
    
    // 方式 4：context.read (不监听变化)
    final counter = context.read<CounterModel>();
    counter.increment();
  }
}

// 4. Selector - 精确控制重建
Selector<CounterModel, int>(
  selector: (context, counter) => counter.count,
  builder: (context, count, child) {
    return Text('$count');
  },
)
```

### Riverpod

Riverpod 是 Provider 的改进版本，提供更好的类型安全和测试性。

```dart
// 安装
// dependencies:
//   flutter_riverpod: ^2.0.0

// 1. 定义 Provider
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
  return CounterNotifier();
});

class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);
  
  void increment() => state++;
  void decrement() => state--;
}

// 2. 使用 ProviderScope
void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}

// 3. 消费 Provider
class CounterPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    
    return Column(
      children: [
        Text('$count'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).increment(),
          child: Text('Increment'),
        ),
      ],
    );
  }
}

// 使用 ConsumerStatefulWidget
class CounterPage extends ConsumerStatefulWidget {
  @override
  ConsumerState<CounterPage> createState() => _CounterPageState();
}

class _CounterPageState extends ConsumerState<CounterPage> {
  @override
  Widget build(BuildContext context) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}

// FutureProvider - 异步数据
final userProvider = FutureProvider<User>((ref) async {
  final response = await http.get(Uri.parse('https://api.example.com/user'));
  return User.fromJson(json.decode(response.body));
});

// StreamProvider - 流数据
final messagesProvider = StreamProvider<List<Message>>((ref) {
  return FirebaseFirestore.instance
      .collection('messages')
      .snapshots()
      .map((snapshot) => snapshot.docs.map((doc) => Message.fromDoc(doc)).toList());
});
```

### BLoC (Business Logic Component)

```dart
// 安装
// dependencies:
//   flutter_bloc: ^8.0.0

// 1. 定义 Event
abstract class CounterEvent {}

class IncrementEvent extends CounterEvent {}
class DecrementEvent extends CounterEvent {}

// 2. 定义 State
class CounterState {
  final int count;
  
  CounterState(this.count);
}

// 3. 创建 BLoC
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterState(0)) {
    on<IncrementEvent>((event, emit) {
      emit(CounterState(state.count + 1));
    });
    
    on<DecrementEvent>((event, emit) {
      emit(CounterState(state.count - 1));
    });
  }
}

// 4. 提供 BLoC
BlocProvider(
  create: (context) => CounterBloc(),
  child: MyApp(),
)

// 5. 使用 BLoC
class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CounterBloc, CounterState>(
      builder: (context, state) {
        return Column(
          children: [
            Text('${state.count}'),
            ElevatedButton(
              onPressed: () {
                context.read<CounterBloc>().add(IncrementEvent());
              },
              child: Text('Increment'),
            ),
          ],
        );
      },
    );
  }
}

// BlocListener - 监听状态变化
BlocListener<CounterBloc, CounterState>(
  listener: (context, state) {
    if (state.count == 10) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Count reached 10!')),
      );
    }
  },
  child: Container(),
)

// BlocConsumer - 同时监听和构建
BlocConsumer<CounterBloc, CounterState>(
  listener: (context, state) {
    // 副作用
  },
  builder: (context, state) {
    // UI
    return Text('${state.count}');
  },
)
```

### GetX

```dart
// 安装
// dependencies:
//   get: ^4.6.0

// 1. 创建 Controller
class CounterController extends GetxController {
  var count = 0.obs;  // 响应式变量
  
  void increment() => count++;
  void decrement() => count--;
}

// 2. 使用 Controller
class CounterPage extends StatelessWidget {
  final CounterController controller = Get.put(CounterController());
  
  @override
  Widget build(BuildContext context) {
    return Obx(() => Text('${controller.count}'));
  }
}

// 路由管理
Get.to(NextPage());
Get.back();
Get.off(NextPage());  // 替换当前页面
Get.offAll(HomePage());  // 清空路由栈

// 依赖注入
Get.put(ApiService());
Get.lazyPut(() => ApiService());
final api = Get.find<ApiService>();

// SnackBar
Get.snackbar('Title', 'Message');

// Dialog
Get.dialog(AlertDialog(title: Text('Alert')));

// BottomSheet
Get.bottomSheet(Container(child: Text('Bottom Sheet')));
```

## 动画

### 隐式动画

```dart
// AnimatedContainer
AnimatedContainer(
  duration: Duration(seconds: 1),
  curve: Curves.easeInOut,
  width: _isExpanded ? 200 : 100,
  height: _isExpanded ? 200 : 100,
  color: _isExpanded ? Colors.blue : Colors.red,
  child: Text('Animated'),
)

// AnimatedOpacity
AnimatedOpacity(
  opacity: _isVisible ? 1.0 : 0.0,
  duration: Duration(milliseconds: 500),
  child: Text('Fade'),
)

// AnimatedPositioned
Stack(
  children: [
    AnimatedPositioned(
      duration: Duration(seconds: 1),
      top: _isTop ? 0 : 100,
      left: _isLeft ? 0 : 100,
      child: Container(width: 50, height: 50, color: Colors.blue),
    ),
  ],
)

// AnimatedCrossFade
AnimatedCrossFade(
  firstChild: Text('First'),
  secondChild: Text('Second'),
  crossFadeState: _showFirst 
      ? CrossFadeState.showFirst 
      : CrossFadeState.showSecond,
  duration: Duration(milliseconds: 300),
)
```

### 显式动画

```dart
class AnimatedWidget extends StatefulWidget {
  @override
  _AnimatedWidgetState createState() => _AnimatedWidgetState();
}

class _AnimatedWidgetState extends State<AnimatedWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  
  @override
  void initState() {
    super.initState();
    
    // 创建控制器
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );
    
    // 创建动画
    _animation = Tween<double>(begin: 0, end: 300).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
    
    // 监听动画
    _animation.addListener(() {
      setState(() {});
    });
    
    // 监听状态
    _animation.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _controller.reverse();
      } else if (status == AnimationStatus.dismissed) {
        _controller.forward();
      }
    });
    
    // 启动动画
    _controller.forward();
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Container(
      width: _animation.value,
      height: _animation.value,
      color: Colors.blue,
    );
  }
}

// AnimatedBuilder - 优化性能
AnimatedBuilder(
  animation: _animation,
  builder: (context, child) {
    return Transform.scale(
      scale: _animation.value,
      child: child,
    );
  },
  child: Text('Static Child'),  // 不会重建
)

// TweenAnimationBuilder - 简化动画
TweenAnimationBuilder<double>(
  tween: Tween(begin: 0, end: 1),
  duration: Duration(seconds: 1),
  builder: (context, value, child) {
    return Opacity(
      opacity: value,
      child: child,
    );
  },
  child: Text('Fade In'),
)
```

### Hero 动画

```dart
// 第一个页面
Hero(
  tag: 'hero-image',
  child: Image.network('https://example.com/image.png'),
)

// 第二个页面
Hero(
  tag: 'hero-image',  // 相同的 tag
  child: Image.network('https://example.com/image.png'),
)
```

## 自定义绘制

### CustomPaint

```dart
class MyPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke;
    
    // 绘制圆形
    canvas.drawCircle(
      Offset(size.width / 2, size.height / 2),
      50,
      paint,
    );
    
    // 绘制矩形
    canvas.drawRect(
      Rect.fromLTWH(10, 10, 100, 100),
      paint,
    );
    
    // 绘制路径
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(100, 100)
      ..lineTo(200, 50)
      ..close();
    canvas.drawPath(path, paint);
    
    // 绘制文本
    final textPainter = TextPainter(
      text: TextSpan(
        text: 'Hello',
        style: TextStyle(color: Colors.black, fontSize: 24),
      ),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, Offset(50, 50));
  }
  
  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}

// 使用
CustomPaint(
  size: Size(300, 300),
  painter: MyPainter(),
)
```

## 性能优化

### 1. 使用 const 构造函数

```dart
// 好的做法
const Text('Hello');
const Icon(Icons.home);

// 避免
Text('Hello');
Icon(Icons.home);
```

### 2. 使用 ListView.builder

```dart
// 好的做法 - 懒加载
ListView.builder(
  itemCount: 1000,
  itemBuilder: (context, index) {
    return ListTile(title: Text('Item $index'));
  },
)

// 避免 - 一次性创建所有 Widget
ListView(
  children: List.generate(1000, (index) {
    return ListTile(title: Text('Item $index'));
  }),
)
```

### 3. 避免在 build 方法中创建对象

```dart
// 不好的做法
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final style = TextStyle(fontSize: 24);  // 每次 build 都创建
    return Text('Hello', style: style);
  }
}

// 好的做法
class MyWidget extends StatelessWidget {
  static const style = TextStyle(fontSize: 24);  // 只创建一次
  
  @override
  Widget build(BuildContext context) {
    return Text('Hello', style: style);
  }
}
```

### 4. 使用 RepaintBoundary

```dart
// 隔离重绘区域
RepaintBoundary(
  child: ExpensiveWidget(),
)
```

### 5. 使用 AutomaticKeepAliveClientMixin

```dart
// 保持页面状态
class MyPage extends StatefulWidget {
  @override
  _MyPageState createState() => _MyPageState();
}

class _MyPageState extends State<MyPage>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;
  
  @override
  Widget build(BuildContext context) {
    super.build(context);  // 必须调用
    return Container();
  }
}
```

### 6. 图片优化

```dart
// 使用缓存
CachedNetworkImage(
  imageUrl: 'https://example.com/image.png',
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)

// 指定尺寸
Image.network(
  'https://example.com/image.png',
  width: 100,
  height: 100,
  cacheWidth: 100,  // 缓存宽度
  cacheHeight: 100,  // 缓存高度
)
```

## 平台集成

### 方法通道（Method Channel）

```dart
// Flutter 端
class BatteryLevel {
  static const platform = MethodChannel('com.example.app/battery');
  
  Future<int> getBatteryLevel() async {
    try {
      final int result = await platform.invokeMethod('getBatteryLevel');
      return result;
    } on PlatformException catch (e) {
      print('Failed to get battery level: ${e.message}');
      return -1;
    }
  }
}

// Android 端 (MainActivity.kt)
class MainActivity: FlutterActivity() {
  private val CHANNEL = "com.example.app/battery"
  
  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    
    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
      .setMethodCallHandler { call, result ->
        if (call.method == "getBatteryLevel") {
          val batteryLevel = getBatteryLevel()
          if (batteryLevel != -1) {
            result.success(batteryLevel)
          } else {
            result.error("UNAVAILABLE", "Battery level not available.", null)
          }
        } else {
          result.notImplemented()
        }
      }
  }
  
  private fun getBatteryLevel(): Int {
    val batteryManager = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
    return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
  }
}

// iOS 端 (AppDelegate.swift)
@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller = window?.rootViewController as! FlutterViewController
    let batteryChannel = FlutterMethodChannel(
      name: "com.example.app/battery",
      binaryMessenger: controller.binaryMessenger
    )
    
    batteryChannel.setMethodCallHandler { [weak self] (call, result) in
      if call.method == "getBatteryLevel" {
        self?.receiveBatteryLevel(result: result)
      } else {
        result(FlutterMethodNotImplemented)
      }
    }
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  private func receiveBatteryLevel(result: FlutterResult) {
    UIDevice.current.isBatteryMonitoringEnabled = true
    let batteryLevel = Int(UIDevice.current.batteryLevel * 100)
    result(batteryLevel)
  }
}
```

### 事件通道（Event Channel）

```dart
// Flutter 端
class AccelerometerStream {
  static const stream = EventChannel('com.example.app/accelerometer');
  
  Stream<List<double>> get accelerometerEvents {
    return stream.receiveBroadcastStream().map((event) {
      return List<double>.from(event);
    });
  }
}

// 使用
StreamBuilder<List<double>>(
  stream: AccelerometerStream().accelerometerEvents,
  builder: (context, snapshot) {
    if (snapshot.hasData) {
      return Text('X: ${snapshot.data![0]}, Y: ${snapshot.data![1]}');
    }
    return CircularProgressIndicator();
  },
)
```

## 测试

### 单元测试

```dart
// test/counter_test.dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Counter increments', () {
    final counter = Counter();
    counter.increment();
    expect(counter.value, 1);
  });
  
  group('Counter', () {
    test('initial value is 0', () {
      expect(Counter().value, 0);
    });
    
    test('increment increases value', () {
      final counter = Counter();
      counter.increment();
      expect(counter.value, 1);
    });
  });
}
```

### Widget 测试

```dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // 构建 Widget
    await tester.pumpWidget(MyApp());
    
    // 验证初始状态
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);
    
    // 点击按钮
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();
    
    // 验证结果
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

### 集成测试

```dart
// integration_test/app_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  testWidgets('Full app test', (WidgetTester tester) async {
    await tester.pumpWidget(MyApp());
    
    // 等待页面加载
    await tester.pumpAndSettle();
    
    // 执行操作
    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();
    
    // 验证结果
    expect(find.text('Welcome'), findsOneWidget);
  });
}
```

## 最佳实践

1. **代码组织**：按功能模块组织，使用清晰的目录结构
2. **状态管理**：选择合适的状态管理方案
3. **性能优化**：使用 const、builder、RepaintBoundary
4. **错误处理**：使用 try-catch，提供友好的错误提示
5. **测试**：编写单元测试、Widget 测试、集成测试
6. **国际化**：使用 intl 包支持多语言
7. **主题**：使用 ThemeData 统一样式
8. **代码规范**：遵循 Dart 官方代码规范
