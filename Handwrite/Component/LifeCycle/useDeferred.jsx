import React, { useState, useDeferredValue, useMemo, useEffect } from 'react';

/**
 * useDeferredValue 示例
 * 
 * useDeferredValue 用于延迟更新某个值，主要用于：
 * 1. 大型列表渲染
 * 2. 实时搜索
 * 3. 自动完成
 * 4. 实时预览
 */

// 模拟API调用
const searchAPI = async (query) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        text: `${query} result ${i}`
    }));
};

// 模拟耗时渲染组件
function SlowList({ text }) {
    const items = useMemo(() => {
        const result = [];
        for (let i = 0; i < 10000; i++) {
            result.push(<SlowItem key={i} text={`${text} ${i}`} />);
        }
        return result;
    }, [text]);

    return <div>{items}</div>;
}

// 单个慢速项
function SlowItem({ text }) {
    useEffect(() => {
        const start = performance.now();
        while (performance.now() - start < 0.1) {
            // 模拟耗时操作
        }
    }, []);

    return <div className="slow-item">{text}</div>;
}

// 1. 基本搜索示例
function SearchExample() {
    const [searchText, setSearchText] = useState('');
    const deferredText = useDeferredValue(searchText);
    const [results, setResults] = useState([]);

    // 使用deferredText进行搜索
    useEffect(() => {
        if (deferredText.trim() === '') {
            setResults([]);
            return;
        }

        searchAPI(deferredText).then(setResults);
    }, [deferredText]);

    return (
        <div className="search-example">
            <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Type to search..."
            />
            {searchText !== deferredText && (
                <div className="loading">Loading...</div>
            )}
            <ul>
                {results.map(item => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ul>
        </div>
    );
}

// 2. 实时预览示例
function MarkdownPreview() {
    const [text, setText] = useState('# Hello\n\nStart typing...');
    const deferredText = useDeferredValue(text);

    // 模拟耗时的markdown渲染
    const html = useMemo(() => {
        const start = performance.now();
        while (performance.now() - start < 100) {
            // 模拟耗时渲染
        }
        return deferredText.split('\n').map((line, i) => (
            <p key={i}>{line.startsWith('#') ? <h1>{line.slice(2)}</h1> : line}</p>
        ));
    }, [deferredText]);

    return (
        <div className="markdown-preview">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
            />
            <div className="preview">
                {text !== deferredText && <div className="loading">Updating preview...</div>}
                {html}
            </div>
        </div>
    );
}

// 3. 大型列表示例
function VirtualizedList() {
    const [filterText, setFilterText] = useState('');
    const deferredText = useDeferredValue(filterText);

    // 使用deferredText过滤和渲染列表
    const filteredList = useMemo(() => (
        <SlowList text={deferredText} />
    ), [deferredText]);

    return (
        <div className="virtualized-list">
            <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter items..."
            />
            {filterText !== deferredText && (
                <div className="loading">Updating list...</div>
            )}
            {filteredList}
        </div>
    );
}

// 4. 自动完成示例
function AutoComplete() {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);
    const [suggestions, setSuggestions] = useState([]);

    // 使用deferredQuery获取建议
    useEffect(() => {
        if (deferredQuery.trim() === '') {
            setSuggestions([]);
            return;
        }

        // 模拟API调用
        const items = Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            text: `${deferredQuery} suggestion ${i}`
        })).filter(item => 
            item.text.toLowerCase().includes(deferredQuery.toLowerCase())
        );

        setSuggestions(items.slice(0, 10));
    }, [deferredQuery]);

    return (
        <div className="auto-complete">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type for suggestions..."
            />
            {query !== deferredQuery && (
                <div className="loading">Loading suggestions...</div>
            )}
            <ul>
                {suggestions.map(item => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ul>
        </div>
    );
}

function App() {
    return (
        <div className="app">
            <h1>useDeferredValue Examples</h1>
            
            <section>
                <h2>1. Search Example</h2>
                <SearchExample />
            </section>

            <section>
                <h2>2. Markdown Preview</h2>
                <MarkdownPreview />
            </section>

            <section>
                <h2>3. Large List</h2>
                <VirtualizedList />
            </section>

            <section>
                <h2>4. Auto Complete</h2>
                <AutoComplete />
            </section>

            <style jsx>{`
                .app {
                    padding: 20px;
                }

                section {
                    margin-bottom: 30px;
                    padding: 20px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                }

                .loading {
                    color: #666;
                    font-style: italic;
                    margin: 10px 0;
                }

                input, textarea {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                }

                .markdown-preview {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .preview {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .slow-item {
                    padding: 5px;
                    border-bottom: 1px solid #eee;
                }

                ul {
                    list-style: none;
                    padding: 0;
                }

                li {
                    padding: 5px;
                    border-bottom: 1px solid #eee;
                }
            `}</style>
        </div>
    );
}

export default App;
