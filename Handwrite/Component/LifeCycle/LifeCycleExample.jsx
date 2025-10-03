import React from 'react';

/**
 * React生命周期完整示例
 * 
 * React 16.3之前的生命周期：
 * 挂载：constructor -> componentWillMount -> render -> componentDidMount
 * 更新：componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
 * 卸载：componentWillUnmount
 * 
 * React 16.3之后的生命周期：
 * 挂载：constructor -> getDerivedStateFromProps -> render -> componentDidMount
 * 更新：getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> componentDidUpdate
 * 卸载：componentWillUnmount
 */
class LifeCycleExample extends React.Component {
    /**
     * 1. 构造函数
     * 时机：组件创建时最先调用
     * 用途：
     * - 初始化state
     * - 绑定方法的this指向
     * 注意：
     * - 不要在这里调用setState
     * - 不要在这里发起副作用（如请求）
     */
    constructor(props) {
        super(props);
        this.state = { 
            count: 0,
            windowWidth: window.innerWidth 
        };
        
        // 方法绑定
        this.handleResize = this.handleResize.bind(this);
        console.log('1. constructor - 组件初始化');
    }

    /**
     * 2. getDerivedStateFromProps（新）
     * 时机：每次渲染前都会调用，包括首次渲染和更新
     * 用途：根据props更新state
     * 为什么使用static：
     * - 强调这是一个纯函数
     * - 不能访问this
     * - 不能执行副作用
     * 替代：componentWillMount和componentWillReceiveProps
     * 原因：避免副作用在异步渲染中可能被多次调用
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        console.log('2. getDerivedStateFromProps - props变化时更新state');
        // 返回null表示不更新state
        return null;
    }

    /**
     * 3. render
     * 时机：每次渲染时调用
     * 特点：
     * - 必须是纯函数
     * - 不能调用setState
     * - 不能直接与浏览器交互
     */
    render() {
        console.log('3. render - 渲染组件');
        const { count, windowWidth } = this.state;
        
        return (
            <div>
                <h2>生命周期示例</h2>
                <p>计数: {count}</p>
                <p>窗口宽度: {windowWidth}</p>
                <button onClick={() => this.setState({ count: count + 1 })}>
                    增加计数
                </button>
            </div>
        );
    }

    /**
     * 4. componentDidMount
     * 时机：首次渲染完成后调用
     * 用途：
     * - 发起网络请求
     * - 添加订阅
     * - 操作DOM
     * 特点：
     * - 可以调用setState，会触发重新渲染
     * - 服务端渲染不会调用此方法
     */
    componentDidMount() {
        console.log('4. componentDidMount - 组件挂载完成');
        
        // 添加事件监听
        window.addEventListener('resize', this.handleResize);
        
        // 发起网络请求示例
        fetch('https://api.example.com/data')
            .then(response => response.json())
            .then(data => this.setState({ /* ... */ }));
        
        // 设置定时器示例
        this.timer = setInterval(() => {
            console.log('定时器执行中...');
        }, 1000);
    }

    /**
     * 5. shouldComponentUpdate
     * 时机：接收到新的props或state时，渲染前调用
     * 用途：性能优化，控制组件是否重新渲染
     * 特点：
     * - 必须返回布尔值
     * - 首次渲染和forceUpdate不会调用
     * - 返回false不会阻止子组件重新渲染
     */
    shouldComponentUpdate(nextProps, nextState) {
        console.log('5. shouldComponentUpdate - 是否需要重新渲染');
        // 示例：只有count变化超过1才重新渲染
        return Math.abs(nextState.count - this.state.count) > 1;
    }

    /**
     * 6. getSnapshotBeforeUpdate（新）
     * 时机：render之后，更新DOM和refs之前
     * 用途：获取更新前的DOM信息
     * 特点：
     * - 返回值会作为componentDidUpdate的第三个参数
     * - 必须与componentDidUpdate一起使用
     * 替代：componentWillUpdate
     * 场景：
     * - 保存滚动位置
     * - 保存DOM状态
     */
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log('6. getSnapshotBeforeUpdate - 获取更新前的DOM信息');
        // 示例：保存当前滚动位置
        if (prevState.count !== this.state.count) {
            const list = document.querySelector('#list');
            return list ? list.scrollHeight : null;
        }
        return null;
    }

    /**
     * 7. componentDidUpdate
     * 时机：更新完成后调用
     * 用途：
     * - 对DOM进行操作
     * - 网络请求
     * - 根据props变化做相应处理
     * 注意：
     * - 如果shouldComponentUpdate返回false，则不会调用
     * - 首次渲染不会调用
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('7. componentDidUpdate - 组件更新完成', { snapshot });
        
        // 示例：根据props变化发起请求
        if (this.props.userID !== prevProps.userID) {
            this.fetchData(this.props.userID);
        }
        
        // 示例：恢复滚动位置
        if (snapshot !== null) {
            const list = document.querySelector('#list');
            if (list) {
                list.scrollTop = list.scrollHeight - snapshot;
            }
        }
    }

    /**
     * 8. componentWillUnmount
     * 时机：组件卸载前调用
     * 用途：清理工作
     * - 取消定时器
     * - 取消订阅
     * - 取消请求
     * 注意：
     * - 不要在这里调用setState
     */
    componentWillUnmount() {
        console.log('8. componentWillUnmount - 组件即将卸载');
        
        // 清理定时器
        clearInterval(this.timer);
        
        // 移除事件监听
        window.removeEventListener('resize', this.handleResize);
    }

    // ======= 已废弃的生命周期方法 =======
    
    /**
     * UNSAFE_componentWillMount（已废弃）
     * 废弃原因：
     * 1. 在异步渲染中可能被多次调用
     * 2. 服务端渲染会导致它在服务端和客户端都执行
     * 3. 通常在这里做的事情都可以在constructor或componentDidMount中做
     */
    UNSAFE_componentWillMount() {
        console.log('UNSAFE_componentWillMount - 即将废弃');
    }

    /**
     * UNSAFE_componentWillReceiveProps（已废弃）
     * 废弃原因：
     * 1. 命名具有误导性，即使props没有变化也会调用
     * 2. 在异步渲染中可能被多次调用
     * 替代方案：使用getDerivedStateFromProps
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log('UNSAFE_componentWillReceiveProps - 即将废弃');
    }

    /**
     * UNSAFE_componentWillUpdate（已废弃）
     * 废弃原因：
     * 1. 在异步渲染中可能被多次调用
     * 2. 很容易误用，导致问题
     * 替代方案：使用getSnapshotBeforeUpdate
     */
    UNSAFE_componentWillUpdate(nextProps, nextState) {
        console.log('UNSAFE_componentWillUpdate - 即将废弃');
    }

    // 事件处理方法
    handleResize() {
        this.setState({ windowWidth: window.innerWidth });
    }

    // 示例的网络请求方法
    fetchData(userID) {
        fetch(`https://api.example.com/user/${userID}`)
            .then(response => response.json())
            .then(data => this.setState({ /* ... */ }));
    }
}

/**
 * Hooks版本的生命周期
 * 使用Hooks可以让函数组件也能使用生命周期特性
 */
function HooksLifeCycle() {
    // 状态声明
    const [count, setCount] = React.useState(0);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    /**
     * useEffect 替代了多个生命周期
     * 1. 没有依赖数组：每次渲染后都执行
     * 2. 空依赖数组[]：仅在挂载时执行
     * 3. 有依赖数组[dep]：在依赖变化时执行
     * 4. 返回的函数：相当于componentWillUnmount
     */
    
    // 相当于 componentDidMount + componentDidUpdate
    React.useEffect(() => {
        console.log('组件挂载或更新');
        
        // 相当于 componentWillUnmount
        return () => {
            console.log('组件卸载或更新前清理');
        };
    });

    // 相当于 componentDidMount
    React.useEffect(() => {
        console.log('组件挂载');
        
        // 添加事件监听
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        // 相当于 componentWillUnmount
        return () => {
            console.log('组件卸载');
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 空依赖数组

    // 相当于 componentDidUpdate - 仅count变化时执行
    React.useEffect(() => {
        console.log('count改变:', count);
        
        // 示例：count变化时发起请求
        fetch(`https://api.example.com/data/${count}`)
            .then(response => response.json())
            .then(data => console.log(data));
    }, [count]); // 依赖count

    return (
        <div>
            <h2>Hooks生命周期示例</h2>
            <p>计数: {count}</p>
            <p>窗口宽度: {windowWidth}</p>
            <button onClick={() => setCount(count + 1)}>
                增加计数
            </button>
        </div>
    );
}

export { LifeCycleExample, HooksLifeCycle };