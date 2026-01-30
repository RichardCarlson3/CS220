import { jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
jest.unstable_mockModule("../include/exports.js", () => ({
  fetchUniversities: jest.fn(),
  fetchGeoCoord: jest.fn(),
  fetchCurrentTemperature: jest.fn(),
}));
const { fetchUniversities, fetchGeoCoord, fetchCurrentTemperature } = await import("../include/exports.js");
const { fetchUMichWeather, fetchUMassWeather, fetchUniversityWeather } = await import("./universityWeather.js"); //Had to make sure imports were after the mock, otherwise func.mockResolvedValue would be the real function, not the mock.
const SECOND = 1000;
jest.setTimeout(40 * SECOND);
describe("fetchUniversityWeather", () => {
  // TODO
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  it("Rejects with empty query / input", () => {
    fetchUniversities.mockRejectedValue(new Error("No results found for query"));
    const res = fetchUniversityWeather("");
    return expect(res).rejects.toThrow("No results found for query");
  });
  it("Works for a real query with results", async () => {
    fetchUniversities.mockResolvedValue(["Fake University"]);
    fetchGeoCoord.mockResolvedValue({ lat: 10, lon: 20, importances: 0 });
    fetchCurrentTemperature.mockResolvedValue({
      time: [],
      temperature_2m: [50],
    });
    const res = await fetchUniversityWeather("test_url");
    expect(res).toEqual({
      totalAverage: 50,
      "Fake University": 50,
    });
  });

  it("Properly handles muliple universities and calculates averages correctly", async () => {
    fetchUniversities.mockResolvedValue(["UMass Amherst", "UMass Boston"]);
    fetchGeoCoord
      .mockResolvedValueOnce({ lat: 6, lon: 7, importance: 0 })
      .mockResolvedValueOnce({ lat: 6, lon: 8, importance: 0 });
    fetchCurrentTemperature
      .mockResolvedValueOnce({
        time: [7, 8, 9],
        temperature_2m: [40, 50, 60],
      })
      .mockResolvedValueOnce({
        time: [1, 2, 3],
        temperature_2m: [20, 80, 80],
      });
    const res = await fetchUniversityWeather("another_test_url");
    expect(res).toEqual({
      totalAverage: 55,
      "UMass Amherst": 50,
      "UMass Boston": 60,
    });
  });
  it("Properly handles transformName function", async () => {
    fetchUniversities.mockResolvedValue(["University of Massachusetts at Amherst"]);
    fetchGeoCoord.mockResolvedValueOnce({ lat: 42, lon: -72, importance: 0 });
    fetchCurrentTemperature.mockResolvedValueOnce({
      time: [67],
      temperature_2m: [30],
    });
    const transformName = name => name.replace(" at ", " ");
    const res = await fetchUniversityWeather("transform_test_url", transformName);
    expect(fetchGeoCoord).toHaveBeenCalledWith("University of Massachusetts Amherst");
    expect(res).toEqual({
      totalAverage: 30,
      "University of Massachusetts at Amherst": 30,
    });
  });
  it("handles empty temperature array", async () => {
    fetchUniversities.mockResolvedValue(["Random Uni"]);
    fetchGeoCoord.mockResolvedValueOnce({ lat: 0, lon: 0, importance: 0 });
    fetchCurrentTemperature.mockResolvedValueOnce({
      time: [],
      temperature_2m: [],
    });
    const res = await fetchUniversityWeather("empty_temp_test_url");
    expect(res).toEqual({
      totalAverage: NaN,
      "Random Uni": NaN,
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("fetchUMassWeather", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  it("Works correctly for UMass schools, and gets the average correct", async () => {
    fetchUniversities.mockResolvedValue(["University of Massachusetts Amherst", "University of Massachusetts Boston"]);
    fetchGeoCoord
      .mockResolvedValueOnce({ lat: 42, lon: -72, importance: 0 })
      .mockResolvedValueOnce({ lat: 42.3, lon: -71, importance: 0 });
    fetchCurrentTemperature
      .mockResolvedValueOnce({
        time: [],
        temperature_2m: [50],
      })
      .mockResolvedValueOnce({
        time: [],
        temperature_2m: [60],
      });
    const res = await fetchUMassWeather();
    expect(res).toEqual({
      totalAverage: 55,
      "University of Massachusetts Amherst": 50,
      "University of Massachusetts Boston": 60,
    });
  });
  it("handles a single UMass School", async () => {
    fetchUniversities.mockResolvedValue(["University of Massachusetts Dartmouth"]);
    fetchGeoCoord.mockResolvedValueOnce({ lat: 41.6, lon: -70.9, importance: 0 });
    fetchCurrentTemperature.mockResolvedValueOnce({
      time: [6, 7, 67],
      temperature_2m: [40, 50, 60],
    });
    const res = await fetchUMassWeather();
    expect(res).toEqual({
      totalAverage: 50,
      "University of Massachusetts Dartmouth": 50,
    });
  });
  it("Makes sure transform name transforms at correctly", async () => {
    fetchUniversities.mockResolvedValue(["University of Massachusetts at Amherst"]);
    fetchGeoCoord.mockResolvedValueOnce({ lat: 42, lon: -72, importance: 0 });
    fetchCurrentTemperature.mockResolvedValueOnce({
      time: [],
      temperature_2m: [67],
    });
    const res = await fetchUMassWeather();
    expect(fetchGeoCoord).toHaveBeenCalledWith("University of Massachusetts Amherst");
    expect(res).toEqual({
      totalAverage: 67,
      "University of Massachusetts at Amherst": 67,
    });
  });
});

describe("fetchUMichWeather", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
    jest.clearAllMocks();
  });
  it("Works correctly for UMich schools, and gets the average correct", async () => {
    fetchUniversities.mockResolvedValue(["University of Michigan Ann Arbor", "University of Michigan Flint"]);
    fetchGeoCoord
      .mockResolvedValueOnce({ lat: 42.2, lon: -83.7, importance: 0 })
      .mockResolvedValueOnce({ lat: 43, lon: -83.6, importance: 0 });
    fetchCurrentTemperature
      .mockResolvedValueOnce({
        time: [],
        temperature_2m: [40],
      })
      .mockResolvedValueOnce({
        time: [],
        temperature_2m: [30],
      });
    const res = await fetchUMichWeather();
    expect(res).toEqual({
      totalAverage: 35,
      "University of Michigan Ann Arbor": 40,
      "University of Michigan Flint": 30,
    });
  });

  it("handles a single UMich School", async () => {
    fetchUniversities.mockResolvedValue(["University of Michigan Dearborn"]);
    fetchGeoCoord.mockResolvedValueOnce({ lat: 42.2, lon: -83.7, importance: 0 });
    fetchCurrentTemperature.mockResolvedValueOnce({
      time: [6, 7, 67],
      temperature_2m: [30, 45, 60],
    });
    const res = await fetchUMichWeather();
    expect(res).toEqual({
      totalAverage: 45,
      "University of Michigan Dearborn": 45,
    });
  });
});
