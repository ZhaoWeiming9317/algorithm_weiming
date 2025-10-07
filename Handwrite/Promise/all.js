function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let count = 0;
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(result => {
                    results[index] = result;
                    count++;
                    if (count === promises.length) resolve(results);
                })
                .catch(reject);
        });
    });
}

function promiseAll2(promises) {
    return new Promise((resolve, reject) => {
        const result = [];
        let count = 0;
        
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then((val) => {
                result[index] = val;
                count++;
                if (count === promises.length) {
                    resolve(result)
                }
            })
        }).catch(reject);
    });
}
    
function promiseAll3(promises) {
    return new Promise((resolve, reject) => {
        const result = [];
        const count = 0;

        promises.forEach((promise, idx) => {
            Promise.resolve(promise).then((res) => {
                result[idx] = res;
                count++;
                if (count === promise.length) {
                    resolve(result);
                }
            }).catch(reject);
        });
    });
}

function promiseAll4(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        const result = [];
        promises.forEach((promise) => {
            Promise.resolve(promise).then((res) => {
                result[idx] = res;
                count++;
                if (count === promises.length) {
                    resolve(result);
                }
            }).catch(reject);
        })
    });
}