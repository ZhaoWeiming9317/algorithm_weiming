function promiseRetry(fn, maxAttempts = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        let attempts = 1;

        function attempt() {
            fn().then(resolve).catch(err => {
                if (attempts >= maxAttempts) {
                    reject(err);
                    return;
                }
                attempts++;
                setTimeout(attempt, delay);
            });
        }
        
        attempt();
    });
}