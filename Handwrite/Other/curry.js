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

function myCurry(func) {
  return function curried(...args) {
    return args.length >= func.length
      ? func(...args)
      : (...nextArgs) => curried(...args, ...nextArgs);
  }
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

const curriedHandleEvent = curry(handleEvent);
const onClick = curriedHandleEvent('click');
const onClickButton = onClick(document.querySelector('button'));

// onClickButton(() => console.log('按钮被点击'));

module.exports = { curry, simpleCurry };