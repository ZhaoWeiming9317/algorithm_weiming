export const MyPromiseRace = <T>(promiseArr: Array<Promise<T> | T>): Promise<T> => {
    return new Promise((resolve, reject) => {
        if (promiseArr.length === 0) {
            return;
        }

        promiseArr.forEach(promise => {
            // 使用 Promise.resolve 处理非 Promise 值
            Promise.resolve(promise)
                .then(resolve)  // 任意一个完成就resolve
                .catch(reject); // 任意一个失败就reject
        });
    });
};


