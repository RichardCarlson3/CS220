// Do not directly import these from your files. This allows the autograder to evaluate the functions in this
// file against the sample solution.
import { fetchCurrentTemperature, fetchGeoCoord, fetchUniversities } from "../include/exports.js";

export function fetchUniversityWeather(universityQuery, transformName) {
  return fetchUniversities(universityQuery).then(universities => {
    if (universities.length === 0) {
      return Promise.reject(new Error("No results found for query"));
    }
    const promises = universities.map(originalName => {
      const name = transformName ? transformName(originalName) : originalName;
      return fetchGeoCoord(name).then(coords =>
        fetchCurrentTemperature(coords).then(tempobj => {
          const temps = tempobj.temperature_2m;
          const avg = temps.reduce((total, temp) => (total += temp), 0) / temps.length;
          return { originalName, avg };
        })
      );
    });
    return Promise.all(promises).then(values => {
      const result = {};
      let total = 0;

      values.forEach(({ originalName, avg }) => {
        result[originalName] = avg;
        total += avg;
      });
      result.totalAverage = total / values.length;
      return result;
    });
  });
}

export function fetchUMassWeather() {
  return fetchUniversityWeather("University of Massachusetts", transformName);
}

export function fetchUMichWeather() {
  return fetchUniversityWeather("University of Michigan");
}

function transformName(name) {
  return name.replace(" at ", " ");
}
