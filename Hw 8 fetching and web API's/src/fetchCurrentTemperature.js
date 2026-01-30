export function fetchCurrentTemperature(coords) {
  // TODO
  const lat = coords.lat;
  const lon = coords.lon;
  const url = new URL(
    `https://220.maxkuechen.com/currentTemperature/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&temperature_unit=fahrenheit`
  );
  return fetch(url.toString())
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
      } else {
        return response.json();
      }
    })
    .then(json => {
      return {
        time: json.hourly.time,
        temperature_2m: json.hourly.temperature_2m,
      };
    });
}

export function tempAvgAboveAtCoords(coords, temp) {
  // TODO
  return fetchCurrentTemperature(coords).then(timeAndTemp => {
    const temps = timeAndTemp.temperature_2m;
    const avg = temps.reduce((total, temp) => (total += temp), 0) / temps.length;
    return avg > temp;
  });
}
