function promiseAllSettled(promises) {
    return Promise.all(
        promises.map(promise => 
            Promise.resolve(promise)
                .then(value => ({
                    status: 'fulfilled',
                    value
                }))
                .catch(reason => ({
                    status: 'rejected',
                    reason
                }))
        )
    );
}

function promiseMyAllSettled(promises) {
    return Promise.all(
        promises.map(promise => 
            Promise.resolve(promise)
                .then(value => ({
                    status: 'fulfilled',
                    value,
                }))
                .catch(reason => ({
                    status: 'rejected',
                    reason,
                }))
        )
    )
}
// 测试
const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
const p3 = Promise.resolve(3);

promiseAllSettled([p1, p2, p3]).then(results => {
    console.log(results);
    // [
    //   { status: 'fulfilled', value: 1 },
    //   { status: 'rejected', reason: 'error' },
    //   { status: 'fulfilled', value: 3 }
    // ]
});
