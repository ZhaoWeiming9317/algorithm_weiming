interface PromiseSettledResult<T> {
    status: 'fulfilled' | 'rejected';
    value?: T;
    reason?: any;
}


export const MyAllSettled = <T>(promiseArr: Array<Promise<T> | T>): Promise<PromiseSettledResult<T>[]> => {
    if (!promiseArr.length) {
        return Promise.resolve([]);
    }
    return new Promise((resolve) => {
        const result: PromiseSettledResult<T>[] = [];
        let count = 0;

        promiseArr.forEach((promise, idx) => {
            Promise.resolve(promise).then((res) => {
                result[idx] = {
                    status: 'fulfilled',
                    value: res,
                }
            }).catch((err) => {
                result[idx] = {
                    status: 'rejected',
                    reason: err,
                }
            }).finally(() => {
                count++;
                if (count === promiseArr.length) {
                    resolve(result);
                }
            })
        });
    });
}