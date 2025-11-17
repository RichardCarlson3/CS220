// countSucc: (Promise<T>[]) => Promise<number>
function countSucc(promiseArr) {
  return Promise.allSettled(promiseArr).then(results =>
    results.reduce((acc, e) => {
      if (e.status == "fulfilled") return acc + 1;
      else return acc;
    }, 0)
  );
}

const promiseArr = [Promise.resolve(0), Promise.resolve(0), Promise.resolve(0), Promise.reject(0), Promise.reject(0)];

countSucc(promiseArr).then(numSucc => console.log(numSucc));
// should print 3
