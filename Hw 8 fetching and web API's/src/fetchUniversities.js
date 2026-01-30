export function fetchUniversities(query) {
  // TODO
  const url = new URL(`https://220.maxkuechen.com/universities/search?name=${query}`);
  return fetch(url.toString())
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
      } else return response.json();
    })
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) return [];
      else return data.map(x => x.name);
    });
}

export function universityNameLengthOrderAscending(queryName) {
  // TODO
  const prom = fetchUniversities(queryName);
  return prom.then(names => {
    return names.every((name, i) => i === 0 || name.length > names[i - 1].length);
  });
}
