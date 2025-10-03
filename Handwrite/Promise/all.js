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