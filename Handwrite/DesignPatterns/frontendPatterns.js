/**
 * 前端常用设计模式实现
 * 包含实际项目中的使用场景
 */

// 1. 发布订阅模式（EventBus）
class EventBus {
    constructor() {
        this.events = new Map();
    }

    // 支持多个事件名和通配符
    on(eventNames, handler, options = {}) {
        const names = Array.isArray(eventNames) ? eventNames : [eventNames];
        
        names.forEach(eventName => {
            if (!this.events.has(eventName)) {
                this.events.set(eventName, new Set());
            }
            this.events.get(eventName).add({
                handler,
                once: options.once || false,
                context: options.context
            });
        });

        return () => this.off(eventNames, handler);
    }

    emit(eventName, data) {
        if (!this.events.has(eventName)) return;
        
        this.events.get(eventName).forEach(subscriber => {
            subscriber.handler.call(subscriber.context, data);
            if (subscriber.once) {
                this.off(eventName, subscriber.handler);
            }
        });

        // 触发通配符订阅
        if (eventName !== '*') {
            this.emit('*', { eventName, data });
        }
    }

    off(eventNames, handler) {
        const names = Array.isArray(eventNames) ? eventNames : [eventNames];
        
        names.forEach(eventName => {
            if (!this.events.has(eventName)) return;
            
            if (handler) {
                this.events.get(eventName).forEach(subscriber => {
                    if (subscriber.handler === handler) {
                        this.events.get(eventName).delete(subscriber);
                    }
                });
            } else {
                this.events.delete(eventName);
            }
        });
    }
}

// 2. 状态模式（适用于复杂表单）
class FormState {
    constructor(form) {
        this.form = form;
        this.states = {
            initial: new InitialState(this),
            filling: new FillingState(this),
            submitting: new SubmittingState(this),
            submitted: new SubmittedState(this),
            error: new ErrorState(this)
        };
        this.currentState = this.states.initial;
    }

    changeState(stateName) {
        this.currentState = this.states[stateName];
        this.currentState.enter();
    }

    submit() {
        this.currentState.submit();
    }

    cancel() {
        this.currentState.cancel();
    }
}

class FormStateBase {
    constructor(context) {
        this.context = context;
    }

    enter() { }
    submit() { }
    cancel() { }
}

class InitialState extends FormStateBase {
    enter() {
        this.context.form.reset();
        this.context.form.enable();
    }

    submit() {
        this.context.changeState('submitting');
    }
}

// 3. 适配器模式（处理不同数据源）
class DataAdapter {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }

    async getData() {
        const data = await this.dataSource.fetchData();
        return this.standardizeData(data);
    }

    standardizeData(data) {
        // 实现数据标准化
        throw new Error('Must implement standardizeData');
    }
}

class RestAdapter extends DataAdapter {
    standardizeData(data) {
        return {
            id: data.id,
            type: data.type,
            attributes: data.attributes
        };
    }
}

class GraphQLAdapter extends DataAdapter {
    standardizeData(data) {
        return {
            id: data.node.id,
            type: data.node.__typename,
            attributes: data.node
        };
    }
}

// 4. 组合模式（处理复杂组件树）
class Component {
    constructor(name) {
        this.name = name;
        this.parent = null;
        this.children = [];
    }

    add(component) {
        component.parent = this;
        this.children.push(component);
    }

    remove(component) {
        const index = this.children.indexOf(component);
        if (index > -1) {
            component.parent = null;
            this.children.splice(index, 1);
        }
    }

    getPath() {
        if (!this.parent) return this.name;
        return `${this.parent.getPath()}/${this.name}`;
    }

    traverse(callback) {
        callback(this);
        this.children.forEach(child => child.traverse(callback));
    }
}

// 5. 中介者模式（组件通信）
class Mediator {
    constructor() {
        this.components = new Map();
    }

    register(name, component) {
        this.components.set(name, component);
        component.mediator = this;
    }

    notify(sender, event, data) {
        this.components.forEach((component, name) => {
            if (component !== sender) {
                component.receive(event, data);
            }
        });
    }
}

// 6. 享元模式（优化大量小对象）
class IconFlyweight {
    constructor(name, svg) {
        this.name = name;
        this.svg = svg;
    }

    render(color, size) {
        return {
            svg: this.svg,
            style: { color, size }
        };
    }
}

class IconFactory {
    constructor() {
        this.icons = new Map();
    }

    getIcon(name, svg) {
        if (!this.icons.has(name)) {
            this.icons.set(name, new IconFlyweight(name, svg));
        }
        return this.icons.get(name);
    }
}

// 7. 命令模式（撤销重做）
class CommandHistory {
    constructor() {
        this.history = [];
        this.current = -1;
    }

    execute(command) {
        this.current++;
        if (this.current < this.history.length) {
            this.history.length = this.current;
        }
        this.history.push(command);
        return command.execute();
    }

    undo() {
        if (this.current >= 0) {
            const command = this.history[this.current];
            this.current--;
            return command.undo();
        }
    }

    redo() {
        if (this.current + 1 < this.history.length) {
            this.current++;
            const command = this.history[this.current];
            return command.execute();
        }
    }
}

// 使用示例
async function example() {
    // EventBus 示例
    const eventBus = new EventBus();
    const unsubscribe = eventBus.on('userUpdate', data => {
        console.log('User updated:', data);
    }, { once: true });

    // 状态模式示例
    const form = new FormState(document.querySelector('form'));
    form.submit(); // 会根据当前状态执行不同操作

    // 适配器模式示例
    const restApi = new RestAdapter(restDataSource);
    const graphqlApi = new GraphQLAdapter(graphqlDataSource);
    const data = await restApi.getData();

    // 组合模式示例
    const root = new Component('root');
    const child1 = new Component('child1');
    root.add(child1);
    console.log(child1.getPath()); // 'root/child1'

    // 命令模式示例
    const history = new CommandHistory();
    const addCommand = {
        execute: () => { /* 添加操作 */ },
        undo: () => { /* 撤销添加 */ }
    };
    history.execute(addCommand);
    history.undo();
}
