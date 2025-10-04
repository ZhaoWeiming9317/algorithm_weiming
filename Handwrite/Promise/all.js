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