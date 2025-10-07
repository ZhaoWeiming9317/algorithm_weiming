function promiseAny(promises) {
    return new Promise((resolve, reject) => {
        const errors = [];
        let rejectedCount = 0;
        const promiseArray = Array.from(promises);
        
        if (promiseArray.length === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        
        promiseArray.forEach((promise, index) => {
            Promise.resolve(promise).then(
                resolve, // Resolve immediately on first success
                (error) => {
                    errors[index] = error;
                    rejectedCount++;

                    // Only reject when all promises have rejected
                    if (rejectedCount === promiseArray.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                }
            );
        });
    });
}