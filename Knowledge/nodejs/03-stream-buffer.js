/**
 * Node.js Stream 和 Buffer
 * 考点：流、缓冲区、管道
 */

const fs = require('fs');
const { Readable, Writable, Transform } = require('stream');

console.log('=== Stream 流的概念 ===');

/**
 * 1. 什么是 Stream？
 * 
 * Stream 是处理流式数据的抽象接口
 * 
 * 优点：
 * - 内存效率高：不需要一次性加载所有数据
 * - 时间效率高：可以边读边处理
 * - 组合性好：可以通过管道连接多个流
 * 
 * 四种基本流类型：
 * 1. Readable：可读流（如 fs.createReadStream）
 * 2. Writable：可写流（如 fs.createWriteStream）
 * 3. Duplex：双工流（可读可写，如 TCP socket）
 * 4. Transform：转换流（读取数据、转换、输出，如 zlib.createGzip）
 */

/**
 * 2. Readable Stream 示例
 */
console.log('\n=== Readable Stream ===');

// 创建可读流
class MyReadable extends Readable {
  constructor(options) {
    super(options);
    this.index = 0;
  }
  
  _read() {
    if (this.index < 5) {
      this.push(`数据 ${this.index}\n`);
      this.index++;
    } else {
      this.push(null); // 结束流
    }
  }
}

const readable = new MyReadable();

// 方式1：监听 data 事件
readable.on('data', (chunk) => {
  console.log('接收到数据:', chunk.toString().trim());
});

readable.on('end', () => {
  console.log('读取完成');
});

/**
 * 3. Writable Stream 示例
 */
console.log('\n=== Writable Stream ===');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    console.log('写入数据:', chunk.toString().trim());
    callback();
  }
}

const writable = new MyWritable();
writable.write('Hello\n');
writable.write('World\n');
writable.end();

/**
 * 4. Transform Stream 示例
 */
console.log('\n=== Transform Stream ===');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

const transform = new UpperCaseTransform();

transform.on('data', (chunk) => {
  console.log('转换后:', chunk.toString().trim());
});

transform.write('hello\n');
transform.write('world\n');
transform.end();

/**
 * 5. 管道（Pipe）
 * 
 * pipe 方法可以将多个流连接起来
 * 
 * 优点：
 * - 自动处理背压（backpressure）
 * - 自动处理错误
 * - 代码简洁
 */

console.log('\n=== Pipe 示例 ===');

// 示例：复制文件
// fs.createReadStream('input.txt')
//   .pipe(fs.createWriteStream('output.txt'));

// 示例：压缩文件
// const zlib = require('zlib');
// fs.createReadStream('input.txt')
//   .pipe(zlib.createGzip())
//   .pipe(fs.createWriteStream('input.txt.gz'));

/**
 * 6. Buffer 缓冲区
 * 
 * Buffer 是用于处理二进制数据的类
 * 
 * 特点：
 * - 固定大小的内存块
 * - 类似数组，但存储的是字节
 * - 不受 V8 堆内存限制
 */

console.log('\n=== Buffer 示例 ===');

// 创建 Buffer
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.alloc(10); // 分配 10 字节，填充 0
const buf3 = Buffer.allocUnsafe(10); // 分配 10 字节，不初始化（更快但不安全）

console.log('buf1:', buf1);
console.log('buf1 转字符串:', buf1.toString());
console.log('buf2:', buf2);

// Buffer 操作
buf2.write('World');
console.log('buf2 写入后:', buf2.toString());

// Buffer 拼接
const buf4 = Buffer.concat([buf1, buf2]);
console.log('拼接后:', buf4.toString());

/**
 * 7. Stream 的背压问题
 * 
 * 背压（Backpressure）：
 * - 写入速度 > 读取速度
 * - 导致内存占用过高
 * 
 * 解决方案：
 * - 使用 pipe（自动处理背压）
 * - 手动处理：监听 drain 事件
 */

console.log('\n=== 背压处理示例 ===');

// 手动处理背压
function writeData(writer, data, encoding) {
  let ok = true;
  let i = 0;
  
  function write() {
    while (i < data.length && ok) {
      ok = writer.write(data[i], encoding);
      i++;
    }
    
    if (i < data.length) {
      // 缓冲区满了，等待 drain 事件
      writer.once('drain', write);
    }
  }
  
  write();
}

/**
 * 面试总结：
 * 
 * 1. Stream 的四种类型
 *    - Readable：可读流
 *    - Writable：可写流
 *    - Duplex：双工流
 *    - Transform：转换流
 * 
 * 2. Stream 的优点
 *    - 内存效率高
 *    - 时间效率高
 *    - 可组合
 * 
 * 3. pipe 的作用
 *    - 连接多个流
 *    - 自动处理背压
 *    - 自动处理错误
 * 
 * 4. Buffer 的特点
 *    - 处理二进制数据
 *    - 固定大小
 *    - 不受 V8 堆内存限制
 * 
 * 5. 背压问题
 *    - 写入速度 > 读取速度
 *    - 使用 pipe 或监听 drain 事件
 * 
 * 6. 常见应用场景
 *    - 文件读写
 *    - HTTP 请求/响应
 *    - 数据压缩/解压
 *    - 数据加密/解密
 */

console.log('\n=== Stream vs 一次性读取 ===');
console.log('一次性读取：');
console.log('- 简单直接');
console.log('- 内存占用高');
console.log('- 适合小文件');
console.log('\nStream 流式读取：');
console.log('- 内存占用低');
console.log('- 可以处理大文件');
console.log('- 代码稍复杂');
console.log('- 适合大文件和实时数据');
