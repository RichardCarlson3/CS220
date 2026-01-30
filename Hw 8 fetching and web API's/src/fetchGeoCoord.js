export function fetchGeoCoord(query) {
  const url = new URL(`https://220.maxkuechen.com/geoCoord/search?q=${query}`);
  return fetch(url.toString())
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(`Response error: ${res.statusText}`))))
    .then(json =>
      Array.isArray(json) && json.length > 0
        ? Promise.resolve({
            lon: Number.parseFloat(json[0].lon),
            lat: Number.parseFloat(json[0].lat),
            importances: json[0].importances,
          })
        : Promise.reject(new Error("No results"))
    );
}

export function locationImportantEnough(place, importanceThreshold) {
  return fetchGeoCoord(place).then(obj => {
    let maxImport = 0;
    for (const value of obj.importances) {
      if (value > maxImport) {
        maxImport = value;
      }
    }
    return maxImport > importanceThreshold;
  });
}
