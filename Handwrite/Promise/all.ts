export const MyPromiseAll = <T>(promiseAll: Array<Promise<T> | T>): Promise<T[]> => {
    if (promiseAll.length === 0) {
        return Promise.resolve([]);
    }

    const result: T[] = [];
    let count = 0;

    return new Promise((resolve, reject) => {
        promiseAll.forEach((promise, idx) => {
            Promise.resolve(promise)
                .then((res) => {
                    count++;
                    result[idx] = res;
                    if (count === promiseAll.length) {
                        resolve(result);
                    }
                })
                .catch(reject);
        })
    })
}
