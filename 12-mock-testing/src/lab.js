// example from lab slides
export function arrayIsShort(url) {
  return fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(new Error("Response error"))))
    .then(res => (Array.isArray(res) ? res : Promise.reject(new Error("Not an array"))))
    .then(output => (output.length <= 3 ? "yes" : "no"))
    .catch(error => error.message);
}

// Exercise 1: implement getObjsWithName

export function getObjsWithName(urls) {
  // TODO: Implement this function
  return Promise.allSettled(
    urls.map(url =>
      fetch(url).then(res => {
        if (!res.ok) return Promise.reject(new Error("Response error"));
        return res.json();
      })
    )
  ).then(resarr =>
    resarr
      .filter(res => res.status === "fulfilled")
      .filter(val => Array.isArray(val.value))
      .map(res => res.value)
      .map(objarr => objarr.filter(obj => "name" in obj))
      .flat()
  );
}

// Exercise 2: write tests for getObjsWithName

// 1. write your tests in lab.test.js
// 2. you can then run your tests on your solution above
// 3. or comment out your solution above and uncomment the flawed solutions below
//    one by one to see if your tests catch these mistakes
// (select the lines you want to comment or uncomment and press "ctrl" and "/", "cmd" and "/" if on macOS )

// Flawed solution 1:
// export function getObjsWithName(urls) {
//   return Promise.allSettled(
//     urls.map(url =>
//       fetch(url)
//         .then(res => res.json())
//     )
//   ).then(resarr =>
//     resarr
//       .filter(res => res.status === "fulfilled")
//       .map(res => res.value)
//       .map(objarr => objarr.filter(obj => "name" in obj))
//   );
// }

// Flawed solution 2:
// export function getObjsWithName(urls) {
//   return Promise.allSettled(
//     urls.map(url =>
//       fetch(url)
//         .then(out => out.json())
//     )
//   ).then(_ => []);
// }

// Flawed solution 3:
// export function getObjsWithName(urls) {
//   return Promise.all(
//     urls.map(url =>
//       fetch(url)
//         .then(res => res.json())
//     )
//   ).then(resarr =>
//     resarr
//       .map(objarr => objarr.filter(obj => "name" in obj))
//       .flat()
//   );
// }

// Exercise 3: update your implementation of getObjsWithName and add new tests for this function
// try out your tests on the below flawed solutions

// Flawed solution 4:
// export function getObjsWithName(urls) {
//   return Promise.allSettled(
//     urls.map(url =>
//       fetch(url)
//         .then(res => res.json())
//         .then(res => (Array.isArray(res) ? res : []))
//     )
//   ).then(resarr =>
//     resarr
//       .filter(resarr => resarr.status === "fulfilled")
//       .map(resarr => resarr["value"])
//       .map(objarr => objarr.filter(obj => "name" in obj))
//       .flat()
//   );
// }

// Flawed solution 5:
// export function getObjsWithName(urls) {
//   return Promise.allSettled(
//     urls.map(url =>
//       fetch(url)
//         .then(res => res.ok ? res.json() : Promise.reject())
//     )
//   ).then(resarr =>
//     resarr
//       .filter(resarr => resarr.status === "fulfilled")
//       .map(resarr => resarr["value"])
//       .map(objarr => objarr.filter(obj => "name" in obj))
//       .flat()
//   );
// }

// You can also try using your functions with real URLs!
// Uncomment the code below and run it with npm run start

// const urls = [
//   "https://api.github.com/users/umass-compsci-220/repos",
//   "https://api.github.com/users/umass-cs-230/repos",
// ];

// getObjsWithName(urls)
//   .then(obs => obs.map(obj => obj["name"]))
//   .then(console.log)
//   .catch(console.log);
