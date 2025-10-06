# 节流和防抖详解

## 目录
1. [节流和防抖基础概念](#节流和防抖基础概念)
2. [防抖（Debounce）详解](#防抖debounce详解)
3. [节流（Throttle）详解](#节流throttle详解)
4. [实际应用场景](#实际应用场景)
5. [性能优化技巧](#性能优化技巧)
6. [面试题解析](#面试题解析)

---

## 节流和防抖基础概念

### 1. 什么是节流和防抖？

**防抖（Debounce）**：在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时
**节流（Throttle）**：规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效

```javascript
// 防抖示例
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 节流示例
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
```

### 2. 使用场景对比

| 场景 | 防抖 | 节流 |
|------|------|------|
| 搜索输入 | ✅ | ❌ |
| 按钮点击 | ✅ | ❌ |
| 窗口调整 | ❌ | ✅ |
| 滚动事件 | ❌ | ✅ |
| 鼠标移动 | ❌ | ✅ |

---

## 防抖（Debounce）详解

### 1. 基础防抖实现

```javascript
// 基础防抖
class Debounce {
    constructor() {
        this.timeouts = new Map();
    }
    
    // 简单防抖
    debounce(func, delay) {
        let timeoutId;
        
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
    
    // 带立即执行选项的防抖
    debounceImmediate(func, delay, immediate = false) {
        let timeoutId;
        
        return function(...args) {
            const callNow = immediate && !timeoutId;
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                timeoutId = null;
                if (!immediate) {
                    func.apply(this, args);
                }
            }, delay);
            
            if (callNow) {
                func.apply(this, args);
            }
        };
    }
    
    // 带取消功能的防抖
    debounceCancelable(func, delay) {
        let timeoutId;
        
        const debounced = function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
        
        debounced.cancel = () => {
            clearTimeout(timeoutId);
        };
        
        return debounced;
    }
}
```

### 2. 高级防抖实现

```javascript
// 高级防抖
class AdvancedDebounce {
    constructor() {
        this.pending = new Map();
    }
    
    // 带最大等待时间的防抖
    debounceMaxWait(func, delay, maxWait) {
        let timeoutId;
        let maxTimeoutId;
        let lastCallTime = 0;
        
        return function(...args) {
            const now = Date.now();
            const timeSinceLastCall = now - lastCallTime;
            
            clearTimeout(timeoutId);
            clearTimeout(maxTimeoutId);
            
            if (timeSinceLastCall >= maxWait) {
                func.apply(this, args);
                lastCallTime = now;
            } else {
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastCallTime = Date.now();
                }, delay);
                
                maxTimeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastCallTime = Date.now();
                }, maxWait);
            }
        };
    }
    
    // 带队列的防抖
    debounceQueue(func, delay) {
        let timeoutId;
        let queue = [];
        
        return function(...args) {
            queue.push(args);
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const allArgs = queue;
                queue = [];
                func.apply(this, allArgs);
            }, delay);
        };
    }
    
    // 带优先级的防抖
    debouncePriority(func, delay) {
        let timeoutId;
        let pendingArgs = null;
        let priority = 0;
        
        return function(...args) {
            const currentPriority = args[0]?.priority || 0;
            
            if (currentPriority > priority) {
                clearTimeout(timeoutId);
                pendingArgs = args;
                priority = currentPriority;
            }
            
            timeoutId = setTimeout(() => {
                if (pendingArgs) {
                    func.apply(this, pendingArgs);
                    pendingArgs = null;
                    priority = 0;
                }
            }, delay);
        };
    }
}
```

### 3. 防抖应用示例

```javascript
// 防抖应用示例
class DebounceApplications {
    constructor() {
        this.searchInput = document.getElementById('search');
        this.submitButton = document.getElementById('submit');
        this.resizeHandler = null;
    }
    
    // 搜索防抖
    setupSearchDebounce() {
        const debouncedSearch = this.debounce((query) => {
            this.performSearch(query);
        }, 300);
        
        this.searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }
    
    // 按钮防抖
    setupButtonDebounce() {
        const debouncedSubmit = this.debounce(() => {
            this.submitForm();
        }, 1000);
        
        this.submitButton.addEventListener('click', debouncedSubmit);
    }
    
    // 窗口调整防抖
    setupResizeDebounce() {
        const debouncedResize = this.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', debouncedResize);
    }
    
    // 表单验证防抖
    setupValidationDebounce() {
        const inputs = document.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            const debouncedValidation = this.debounce(() => {
                this.validateInput(input);
            }, 500);
            
            input.addEventListener('input', debouncedValidation);
        });
    }
    
    performSearch(query) {
        console.log('搜索:', query);
        // 执行搜索逻辑
    }
    
    submitForm() {
        console.log('提交表单');
        // 执行提交逻辑
    }
    
    handleResize() {
        console.log('窗口大小改变');
        // 执行调整逻辑
    }
    
    validateInput(input) {
        console.log('验证输入:', input.value);
        // 执行验证逻辑
    }
    
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
}
```

---

## 节流（Throttle）详解

### 1. 基础节流实现

```javascript
// 基础节流
class Throttle {
    constructor() {
        this.throttles = new Map();
    }
    
    // 时间戳节流
    throttleTimestamp(func, limit) {
        let lastExecTime = 0;
        
        return function(...args) {
            const now = Date.now();
            
            if (now - lastExecTime >= limit) {
                func.apply(this, args);
                lastExecTime = now;
            }
        };
    }
    
    // 定时器节流
    throttleTimer(func, limit) {
        let inThrottle;
        
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    // 混合节流（时间戳 + 定时器）
    throttleHybrid(func, limit) {
        let lastExecTime = 0;
        let timeoutId;
        
        return function(...args) {
            const now = Date.now();
            const timeSinceLastExec = now - lastExecTime;
            
            if (timeSinceLastExec >= limit) {
                func.apply(this, args);
                lastExecTime = now;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, limit - timeSinceLastExec);
            }
        };
    }
}
```

### 2. 高级节流实现

```javascript
// 高级节流
class AdvancedThrottle {
    constructor() {
        this.throttleStates = new Map();
    }
    
    // 带前缘和后缘的节流
    throttleLeadingTrailing(func, limit, options = {}) {
        const { leading = true, trailing = true } = options;
        let lastExecTime = 0;
        let timeoutId;
        
        return function(...args) {
            const now = Date.now();
            const timeSinceLastExec = now - lastExecTime;
            
            if (timeSinceLastExec >= limit) {
                if (leading) {
                    func.apply(this, args);
                }
                lastExecTime = now;
            } else {
                if (trailing) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        func.apply(this, args);
                        lastExecTime = Date.now();
                    }, limit - timeSinceLastExec);
                }
            }
        };
    }
    
    // 带队列的节流
    throttleQueue(func, limit) {
        let inThrottle = false;
        let queue = [];
        
        return function(...args) {
            queue.push(args);
            
            if (!inThrottle) {
                inThrottle = true;
                setTimeout(() => {
                    const allArgs = queue;
                    queue = [];
                    func.apply(this, allArgs);
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    // 自适应节流
    throttleAdaptive(func, initialLimit, options = {}) {
        const { minLimit = 16, maxLimit = 1000, step = 16 } = options;
        let currentLimit = initialLimit;
        let lastExecTime = 0;
        let timeoutId;
        
        return function(...args) {
            const now = Date.now();
            const timeSinceLastExec = now - lastExecTime;
            
            if (timeSinceLastExec >= currentLimit) {
                func.apply(this, args);
                lastExecTime = now;
                
                // 自适应调整
                if (timeSinceLastExec > currentLimit * 2) {
                    currentLimit = Math.min(currentLimit + step, maxLimit);
                } else if (timeSinceLastExec < currentLimit * 0.5) {
                    currentLimit = Math.max(currentLimit - step, minLimit);
                }
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, currentLimit - timeSinceLastExec);
            }
        };
    }
}
```

### 3. 节流应用示例

```javascript
// 节流应用示例
class ThrottleApplications {
    constructor() {
        this.scrollContainer = document.getElementById('scroll-container');
        this.mouseTracker = document.getElementById('mouse-tracker');
        this.resizeHandler = null;
    }
    
    // 滚动节流
    setupScrollThrottle() {
        const throttledScroll = this.throttle(() => {
            this.handleScroll();
        }, 16); // 60fps
        
        this.scrollContainer.addEventListener('scroll', throttledScroll);
    }
    
    // 鼠标移动节流
    setupMouseThrottle() {
        const throttledMouseMove = this.throttle((e) => {
            this.handleMouseMove(e);
        }, 16); // 60fps
        
        this.mouseTracker.addEventListener('mousemove', throttledMouseMove);
    }
    
    // 窗口调整节流
    setupResizeThrottle() {
        const throttledResize = this.throttle(() => {
            this.handleResize();
        }, 100);
        
        window.addEventListener('resize', throttledResize);
    }
    
    // 拖拽节流
    setupDragThrottle() {
        const draggable = document.getElementById('draggable');
        let isDragging = false;
        
        const throttledDrag = this.throttle((e) => {
            if (isDragging) {
                this.handleDrag(e);
            }
        }, 16);
        
        draggable.addEventListener('mousedown', (e) => {
            isDragging = true;
        });
        
        draggable.addEventListener('mousemove', throttledDrag);
        
        draggable.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    // 无限滚动节流
    setupInfiniteScrollThrottle() {
        const throttledScroll = this.throttle(() => {
            this.checkInfiniteScroll();
        }, 100);
        
        window.addEventListener('scroll', throttledScroll);
    }
    
    handleScroll() {
        console.log('处理滚动');
        // 执行滚动逻辑
    }
    
    handleMouseMove(e) {
        console.log('鼠标位置:', e.clientX, e.clientY);
        // 执行鼠标移动逻辑
    }
    
    handleResize() {
        console.log('窗口大小改变');
        // 执行调整逻辑
    }
    
    handleDrag(e) {
        console.log('拖拽位置:', e.clientX, e.clientY);
        // 执行拖拽逻辑
    }
    
    checkInfiniteScroll() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= documentHeight - 100) {
            this.loadMoreContent();
        }
    }
    
    loadMoreContent() {
        console.log('加载更多内容');
        // 执行加载逻辑
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
}
```

---

## 实际应用场景

### 1. 搜索功能

```javascript
// 搜索功能实现
class SearchFeature {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchHistory = [];
        this.currentSearch = null;
    }
    
    setupSearch() {
        // 防抖搜索
        const debouncedSearch = this.debounce((query) => {
            this.performSearch(query);
        }, 300);
        
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                debouncedSearch(query);
            } else {
                this.clearResults();
            }
        });
        
        // 节流搜索历史
        const throttledHistory = this.throttle(() => {
            this.updateSearchHistory();
        }, 1000);
        
        this.searchInput.addEventListener('input', throttledHistory);
    }
    
    async performSearch(query) {
        if (this.currentSearch) {
            this.currentSearch.abort();
        }
        
        this.currentSearch = new AbortController();
        
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                signal: this.currentSearch.signal
            });
            
            const results = await response.json();
            this.displayResults(results);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('搜索失败:', error);
            }
        }
    }
    
    displayResults(results) {
        this.searchResults.innerHTML = '';
        
        results.forEach(result => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.textContent = result.title;
            this.searchResults.appendChild(item);
        });
    }
    
    clearResults() {
        this.searchResults.innerHTML = '';
    }
    
    updateSearchHistory() {
        const query = this.searchInput.value.trim();
        if (query && !this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10);
        }
    }
    
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
}
```

### 2. 无限滚动

```javascript
// 无限滚动实现
class InfiniteScroll {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            threshold: 100,
            loadMore: () => {},
            ...options
        };
        
        this.isLoading = false;
        this.hasMore = true;
        this.page = 1;
        
        this.setupInfiniteScroll();
    }
    
    setupInfiniteScroll() {
        // 节流滚动事件
        const throttledScroll = this.throttle(() => {
            this.checkScrollPosition();
        }, 100);
        
        this.container.addEventListener('scroll', throttledScroll);
        
        // 防抖加载更多
        this.debouncedLoadMore = this.debounce(() => {
            this.loadMore();
        }, 200);
    }
    
    checkScrollPosition() {
        const { scrollTop, scrollHeight, clientHeight } = this.container;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        
        if (distanceFromBottom <= this.options.threshold && !this.isLoading && this.hasMore) {
            this.debouncedLoadMore();
        }
    }
    
    async loadMore() {
        if (this.isLoading || !this.hasMore) return;
        
        this.isLoading = true;
        this.showLoadingIndicator();
        
        try {
            const data = await this.options.loadMore(this.page);
            
            if (data.length === 0) {
                this.hasMore = false;
                this.showNoMoreIndicator();
            } else {
                this.appendItems(data);
                this.page++;
            }
        } catch (error) {
            console.error('加载更多失败:', error);
            this.showErrorIndicator();
        } finally {
            this.isLoading = false;
            this.hideLoadingIndicator();
        }
    }
    
    appendItems(items) {
        items.forEach(item => {
            const element = this.createItemElement(item);
            this.container.appendChild(element);
        });
    }
    
    createItemElement(item) {
        const element = document.createElement('div');
        element.className = 'infinite-scroll-item';
        element.textContent = item.content;
        return element;
    }
    
    showLoadingIndicator() {
        // 显示加载指示器
    }
    
    hideLoadingIndicator() {
        // 隐藏加载指示器
    }
    
    showNoMoreIndicator() {
        // 显示没有更多内容指示器
    }
    
    showErrorIndicator() {
        // 显示错误指示器
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
}
```

### 3. 拖拽功能

```javascript
// 拖拽功能实现
class DragFeature {
    constructor(element) {
        this.element = element;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        
        this.setupDrag();
    }
    
    setupDrag() {
        // 节流鼠标移动
        const throttledMouseMove = this.throttle((e) => {
            if (this.isDragging) {
                this.handleMouseMove(e);
            }
        }, 16); // 60fps
        
        // 防抖拖拽结束
        const debouncedDragEnd = this.debounce(() => {
            this.handleDragEnd();
        }, 100);
        
        this.element.addEventListener('mousedown', (e) => {
            this.handleMouseDown(e);
        });
        
        document.addEventListener('mousemove', throttledMouseMove);
        document.addEventListener('mouseup', debouncedDragEnd);
    }
    
    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX - this.element.offsetLeft;
        this.startY = e.clientY - this.element.offsetTop;
        
        this.element.style.cursor = 'grabbing';
        this.element.style.userSelect = 'none';
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.clientX - this.startX;
        this.currentY = e.clientY - this.startY;
        
        this.element.style.left = this.currentX + 'px';
        this.element.style.top = this.currentY + 'px';
    }
    
    handleDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.element.style.cursor = 'grab';
        this.element.style.userSelect = 'auto';
        
        // 触发拖拽结束事件
        this.element.dispatchEvent(new CustomEvent('dragend', {
            detail: {
                x: this.currentX,
                y: this.currentY
            }
        }));
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
}
```

---

## 性能优化技巧

### 1. 内存优化

```javascript
// 内存优化
class MemoryOptimizedThrottleDebounce {
    constructor() {
        this.activeThrottles = new Map();
        this.activeDebounces = new Map();
    }
    
    // 带清理的节流
    throttleWithCleanup(func, limit, key) {
        if (this.activeThrottles.has(key)) {
            return this.activeThrottles.get(key);
        }
        
        let inThrottle = false;
        const throttled = (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
        
        throttled.cleanup = () => {
            this.activeThrottles.delete(key);
        };
        
        this.activeThrottles.set(key, throttled);
        return throttled;
    }
    
    // 带清理的防抖
    debounceWithCleanup(func, delay, key) {
        if (this.activeDebounces.has(key)) {
            return this.activeDebounces.get(key);
        }
        
        let timeoutId;
        const debounced = (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
        
        debounced.cleanup = () => {
            clearTimeout(timeoutId);
            this.activeDebounces.delete(key);
        };
        
        this.activeDebounces.set(key, debounced);
        return debounced;
    }
    
    // 清理所有
    cleanupAll() {
        this.activeThrottles.forEach(throttle => {
            if (throttle.cleanup) {
                throttle.cleanup();
            }
        });
        
        this.activeDebounces.forEach(debounce => {
            if (debounce.cleanup) {
                debounce.cleanup();
            }
        });
        
        this.activeThrottles.clear();
        this.activeDebounces.clear();
    }
}
```

### 2. 性能监控

```javascript
// 性能监控
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            throttle: { count: 0, totalTime: 0 },
            debounce: { count: 0, totalTime: 0 }
        };
    }
    
    // 带性能监控的节流
    throttleWithMetrics(func, limit, name) {
        let inThrottle = false;
        
        return (...args) => {
            if (!inThrottle) {
                const start = performance.now();
                func.apply(this, args);
                const end = performance.now();
                
                this.metrics.throttle.count++;
                this.metrics.throttle.totalTime += (end - start);
                
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    
    // 带性能监控的防抖
    debounceWithMetrics(func, delay, name) {
        let timeoutId;
        
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const start = performance.now();
                func.apply(this, args);
                const end = performance.now();
                
                this.metrics.debounce.count++;
                this.metrics.debounce.totalTime += (end - start);
            }, delay);
        };
    }
    
    // 获取性能报告
    getPerformanceReport() {
        return {
            throttle: {
                count: this.metrics.throttle.count,
                averageTime: this.metrics.throttle.count > 0 
                    ? this.metrics.throttle.totalTime / this.metrics.throttle.count 
                    : 0
            },
            debounce: {
                count: this.metrics.debounce.count,
                averageTime: this.metrics.debounce.count > 0 
                    ? this.metrics.debounce.totalTime / this.metrics.debounce.count 
                    : 0
            }
        };
    }
}
```

---

## 面试题解析

### 1. 基础题

**Q: 什么是节流和防抖？它们有什么区别？**

**A:** 
- **防抖**：事件触发后延迟执行，如果在延迟期间再次触发则重新计时
- **节流**：在固定时间间隔内只执行一次，忽略期间的其他触发
- **区别**：防抖适合搜索、按钮点击等场景；节流适合滚动、鼠标移动等场景

### 2. 实现题

**Q: 如何实现一个防抖函数？**

**A:** 基础实现：
```javascript
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
```

### 3. 应用场景题

**Q: 在什么场景下使用节流，什么场景下使用防抖？**

**A:** 使用场景：
- **防抖**：搜索输入、按钮点击、表单验证
- **节流**：滚动事件、鼠标移动、窗口调整、拖拽

### 4. 性能优化题

**Q: 如何优化节流和防抖的性能？**

**A:** 优化策略：
1. **内存管理**：及时清理定时器，避免内存泄漏
2. **性能监控**：监控执行次数和耗时
3. **自适应调整**：根据实际使用情况调整参数
4. **批量处理**：合并多个操作减少执行次数

### 5. 实际应用题

**Q: 如何实现一个高性能的搜索功能？**

**A:** 实现方案：
1. **防抖搜索**：延迟执行搜索请求
2. **请求取消**：取消之前的请求避免竞态条件
3. **结果缓存**：缓存搜索结果提高响应速度
4. **加载状态**：显示加载状态提升用户体验

---

## 总结

1. **防抖**：延迟执行，适合搜索、按钮点击等场景
2. **节流**：限制频率，适合滚动、鼠标移动等场景
3. **实现**：使用定时器控制执行时机
4. **优化**：注意内存管理和性能监控
5. **应用**：根据具体场景选择合适的策略

记住：**节流和防抖是前端性能优化的重要技术，理解其原理和适用场景对编写高性能代码至关重要**。
