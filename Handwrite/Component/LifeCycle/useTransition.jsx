import React, { useState, useTransition, useEffect } from 'react';

/**
 * useTransition 示例
 * 
 * useTransition 用于标记非紧急更新，主要用于：
 * 1. 大量数据渲染
 * 2. 复杂计算
 * 3. 需要延迟更新的UI
 */

// 模拟大量数据
const generateItems = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        text: `Item ${i}`
    }));
};

// 模拟耗时计算
const slowCalculation = (text) => {
    const startTime = performance.now();
    while (performance.now() - startTime < 1) {
        // 模拟耗时操作
    }
    return text.split('').reverse().join('');
};

function TransitionExample() {
    // 状态定义
    const [isPending, startTransition] = useTransition();
    const [searchText, setSearchText] = useState('');
    const [items, setItems] = useState(generateItems(100));
    const [selectedTab, setSelectedTab] = useState('all');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // 1. 基本搜索示例
    const handleSearch = (e) => {
        const text = e.target.value;
        
        // 立即更新输入框
        setSearchText(text);
        
        // 将耗时的过滤操作标记为非紧急更新
        startTransition(() => {
            const filtered = generateItems(10000).filter(item => 
                item.text.includes(text)
            );
            setItems(filtered);
        });
    };

    // 2. Tab切换示例
    const handleTabChange = (tab) => {
        // Tab切换立即响应
        setSelectedTab(tab);
        
        // 内容更新可以延迟
        startTransition(() => {
            switch (tab) {
                case 'all':
                    setItems(generateItems(100));
                    break;
                case 'favorites':
                    setItems(generateItems(50).filter(item => item.id % 2 === 0));
                    break;
                case 'recent':
                    setItems(generateItems(30).slice(0, 10));
                    break;
            }
        });
    };

    // 3. 复杂UI更新示例
    const toggleAdvancedFeatures = () => {
        // 开关状态立即更新
        setShowAdvanced(!showAdvanced);
        
        // 复杂UI更新可以延迟
        startTransition(() => {
            if (!showAdvanced) {
                // 模拟加载复杂功能
                const newItems = items.map(item => ({
                    ...item,
                    advanced: {
                        details: slowCalculation(item.text),
                        stats: Math.random() * 100
                    }
                }));
                setItems(newItems);
            }
        });
    };

    return (
        <div className="transition-example">
            <div className="search-section">
                <input
                    type="text"
                    value={searchText}
                    onChange={handleSearch}
                    placeholder="Search items..."
                />
                {isPending && <span>Updating list...</span>}
            </div>

            <div className="tabs-section">
                <button 
                    onClick={() => handleTabChange('all')}
                    className={selectedTab === 'all' ? 'active' : ''}
                >
                    All
                </button>
                <button 
                    onClick={() => handleTabChange('favorites')}
                    className={selectedTab === 'favorites' ? 'active' : ''}
                >
                    Favorites
                </button>
                <button 
                    onClick={() => handleTabChange('recent')}
                    className={selectedTab === 'recent' ? 'active' : ''}
                >
                    Recent
                </button>
            </div>

            <div className="advanced-section">
                <button onClick={toggleAdvancedFeatures}>
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Features
                </button>
            </div>

            <div className="items-list">
                {isPending ? (
                    <div className="loading-overlay">Loading...</div>
                ) : (
                    <ul>
                        {items.map(item => (
                            <li key={item.id}>
                                {item.text}
                                {showAdvanced && item.advanced && (
                                    <div className="advanced-info">
                                        <small>
                                            Details: {item.advanced.details}
                                            <br />
                                            Stats: {item.advanced.stats.toFixed(2)}
                                        </small>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <style jsx>{`
                .transition-example {
                    padding: 20px;
                }

                .search-section {
                    margin-bottom: 20px;
                }

                .search-section input {
                    padding: 8px;
                    width: 300px;
                }

                .tabs-section {
                    margin-bottom: 20px;
                }

                .tabs-section button {
                    margin-right: 10px;
                    padding: 8px 16px;
                }

                .tabs-section button.active {
                    background-color: #007bff;
                    color: white;
                }

                .items-list {
                    position: relative;
                    min-height: 200px;
                }

                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .advanced-info {
                    margin-top: 5px;
                    padding-left: 10px;
                    border-left: 2px solid #eee;
                }
            `}</style>
        </div>
    );
}

// 用法示例
function App() {
    return (
        <div>
            <h1>useTransition Examples</h1>
            <TransitionExample />
        </div>
    );
}

export default App;
