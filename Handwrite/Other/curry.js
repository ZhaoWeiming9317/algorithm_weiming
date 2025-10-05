/**
 * 函数柯里化 - 最简单的实现方式
 * 将多参数函数转换为单参数函数链
 */
function curry(func) {
  return function curried(...args) {
    // 如果传入的参数数量大于等于原函数的参数数量，直接执行
    if (args.length >= func.length) {
        // 这里为啥不用 func(args) 呢？
      return func.apply(this, args);
    }
    // 否则返回一个新函数，继续收集参数
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

/**
 * 更简洁的柯里化实现
 */
function simpleCurry(func) {
  return function curried(...args) {
    return args.length >= func.length 
      ? func(...args)
      : (...nextArgs) => curried(...args, ...nextArgs);
  };
}

function simpleCurry2(func) {
  return function curried(...args) {
    return args.length >= func.length 
      ? func.apply(this, args)
      : (...nextArgs) => curried(...args, ...nextArgs);
  }
}

function simpleCurry3(func) {
  return function curried(...args) {
    return func.length <= args.length ?
      func(...args)  // 修复：应该展开参数
      : (...nextArgs) => curried(...args, ...nextArgs);
  }
}

// 测试 func.apply vs func(...args) 的区别
function testThisBinding() {
  const obj = {
    name: 'test',
    greet: function(greeting, name) {
      return `${greeting}, ${name}! I'm ${this?.name || 'undefined'}`;
    }
  };
  
  console.log('\n=== 测试 this 绑定 ===');
  
  // 直接调用
  console.log('直接调用:', obj.greet('Hello', 'World')); // Hello, World! I'm test
  
  // 测试：在柯里化场景下，this 绑定都丢失了
  console.log('\n--- 柯里化测试 ---');
  
  try {
    // 使用 apply
    const curriedWithApply = simpleCurry2(obj.greet);
    console.log('使用 apply:', curriedWithApply('Hi')('Alice')); // this 丢失
  } catch (e) {
    console.log('使用 apply: this 丢失导致错误');
  }
  
  try {
    // 使用展开操作符
    const curriedWithSpread = simpleCurry(obj.greet);
    console.log('使用展开:', curriedWithSpread('Hey')('Bob')); // this 丢失
  } catch (e) {
    console.log('使用展开: this 丢失导致错误');
  }
  
  console.log('\n--- 结论 ---');
  console.log('在柯里化中，func.apply(this, args) 和 func(...args) 效果相同');
  console.log('因为柯里化会丢失原始的 this 绑定');
}
// 使用示例

// 1. 基本用法
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log('基本用法:');
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6

// 2. 实际应用场景
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);

// 创建专门的函数
const double = curriedMultiply(2);
const doubleAndTriple = double(3);

console.log('\n实际应用:');
console.log(double(5)(10)); // 2 * 5 * 10 = 100
console.log(doubleAndTriple(4)); // 2 * 3 * 4 = 24

// 3. 数组处理
const numbers = [1, 2, 3, 4, 5];

// 使用柯里化的 map
const map = curry((fn, arr) => arr.map(fn));
const mapDouble = map(x => x * 2);

console.log('\n数组处理:');
console.log(mapDouble(numbers)); // [2, 4, 6, 8, 10]

// 4. 事件处理
function handleEvent(eventType, element, callback) {
  element.addEventListener(eventType, callback);
}

// const curriedHandleEvent = curry(handleEvent);
// const onClick = curriedHandleEvent('click');
// const onClickButton = onClick(document.querySelector('button'));

// onClickButton(() => console.log('按钮被点击'));

// 运行测试
testThisBinding();

export { curry, simpleCurry, simpleCurry2, simpleCurry3 };