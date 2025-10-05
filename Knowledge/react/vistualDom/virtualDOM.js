// 1. 创建虚拟DOM节点
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof child === "object" ? child : createTextElement(child)
            )
        }
    };
}

// 处理文本节点
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    };
}

// 2. 创建真实DOM
function createDom(vnode) {
    const dom = vnode.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(vnode.type);

    // 处理属性
    const isProperty = key => key !== "children";
    Object.keys(vnode.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = vnode.props[name];
        });

    // 递归处理子节点
    vnode.props.children.forEach(child => {
        render(child, dom);
    });

    return dom;
}

// 3. Diff算法实现
function updateDom(dom, prevProps, nextProps) {
    // 移除旧属性
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(key => !(key in nextProps))
        .forEach(name => {
            dom[name] = "";
        });

    // 设置新属性
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(key => prevProps[key] !== nextProps[key])
        .forEach(name => {
            dom[name] = nextProps[name];
        });

    // 处理事件监听器
    const isEvent = key => key.startsWith("on");
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(key => !(key in nextProps) || prevProps[key] !== nextProps[key])
        .forEach(name => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });

    Object.keys(nextProps)
        .filter(isEvent)
        .filter(key => prevProps[key] !== nextProps[key])
        .forEach(name => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
}

// 4. 协调过程（Reconciliation）
function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let prevSibling = null;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

    while (index < elements.length || oldFiber != null) {
        const element = elements[index];
        let newFiber = null;

        // 比较oldFiber和element
        const sameType = oldFiber && element && element.type === oldFiber.type;

        if (sameType) {
            // 更新节点
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE"
            };
        }
        if (element && !sameType) {
            // 添加节点
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT"
            };
        }
        if (oldFiber && !sameType) {
            // 删除节点
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}

// 5. 渲染函数
let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        },
        alternate: currentRoot
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
}

// 6. Fiber工作单元处理
function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

// 启动工作循环
requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);

    // 返回下一个工作单元
    if (fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}

// 7. 提交阶段
function commitRoot() {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
}

function commitWork(fiber) {
    if (!fiber) {
        return;
    }

    const domParent = fiber.parent.dom;

    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
        domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
        domParent.removeChild(fiber.dom);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

// 8. 使用示例
const MyReact = {
    createElement,
    render
};

/** @jsx MyReact.createElement */
const element = (
    <div style="background: salmon">
        <h1>Hello World</h1>
        <h2 style="text-align:right">from MyReact</h2>
    </div>
);

// 使用方法
// const container = document.getElementById("root");
// MyReact.render(element, container);
