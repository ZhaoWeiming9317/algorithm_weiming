/**
 * 常见设计模式手写实现
 */

// 1. 单例模式（支持懒加载）
class Singleton {
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }
}

// 2. 观察者模式（进阶版）
class Observer {
    constructor() {
        this.topics = new Map();
    }

    subscribe(topic, callback, options = {}) {
        if (!this.topics.has(topic)) {
            this.topics.set(topic, new Set());
        }
        const subscriber = {
            callback,
            options: {
                once: options.once || false,
                priority: options.priority || 0
            }
        };
        this.topics.get(topic).add(subscriber);
        
        return {
            unsubscribe: () => {
                this.topics.get(topic).delete(subscriber);
                if (this.topics.get(topic).size === 0) {
                    this.topics.delete(topic);
                }
            }
        };
    }

    publish(topic, data) {
        if (!this.topics.has(topic)) return;
        
        [...this.topics.get(topic)]
            .sort((a, b) => b.options.priority - a.options.priority)
            .forEach(subscriber => {
                subscriber.callback(data);
                if (subscriber.options.once) {
                    this.topics.get(topic).delete(subscriber);
                }
            });
    }
}

// 3. 装饰器模式（方法装饰器）
const methodDecorator = (target, key, descriptor) => {
    const original = descriptor.value;
    descriptor.value = function(...args) {
        console.log(`Calling ${key} with args:`, args);
        const result = original.apply(this, args);
        console.log(`Called ${key}, result:`, result);
        return result;
    };
    return descriptor;
};

// 4. 代理模式（带缓存的API代理）
class APIProxy {
    constructor(service) {
        this.service = service;
        this.cache = new Map();
    }

    request(method, url, data) {
        const key = `${method}:${url}:${JSON.stringify(data)}`;
        
        if (this.cache.has(key)) {
            return Promise.resolve(this.cache.get(key));
        }

        return this.service.request(method, url, data)
            .then(response => {
                this.cache.set(key, response);
                return response;
            });
    }

    clearCache() {
        this.cache.clear();
    }
}

// 5. 策略模式（表单验证）
const validationStrategies = {
    required: value => ({
        isValid: value.length > 0,
        message: 'This field is required'
    }),
    minLength: min => value => ({
        isValid: value.length >= min,
        message: `Minimum length is ${min}`
    }),
    maxLength: max => value => ({
        isValid: value.length <= max,
        message: `Maximum length is ${max}`
    }),
    pattern: regex => value => ({
        isValid: regex.test(value),
        message: 'Pattern does not match'
    })
};

class FormValidator {
    constructor(validations) {
        this.validations = validations;
    }

    validate(data) {
        const errors = {};
        
        Object.keys(this.validations).forEach(field => {
            const fieldValidations = this.validations[field];
            const value = data[field];

            for (const validation of fieldValidations) {
                const [strategyName, ...args] = validation.split(':');
                const strategy = validationStrategies[strategyName];
                const result = args.length > 0 
                    ? strategy(...args)(value)
                    : strategy(value);

                if (!result.isValid) {
                    if (!errors[field]) errors[field] = [];
                    errors[field].push(result.message);
                }
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// 使用示例
function example() {
    // 单例模式
    const instance1 = Singleton.getInstance();
    const instance2 = Singleton.getInstance();
    console.log(instance1 === instance2); // true

    // 观察者模式
    const observer = new Observer();
    const subscription = observer.subscribe('user:created', data => {
        console.log('User created:', data);
    }, { priority: 1 });
    observer.publish('user:created', { id: 1 });
    subscription.unsubscribe();

    // 表单验证
    const validator = new FormValidator({
        username: ['required', 'minLength:3', 'maxLength:20'],
        email: ['required', 'pattern:^\\S+@\\S+\\.\\S+$']
    });

    const result = validator.validate({
        username: 'john',
        email: 'invalid-email'
    });
    console.log(result.errors);
}
