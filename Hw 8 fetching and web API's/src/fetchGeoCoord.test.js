import { jest } from "@jest/globals";
import { fetchGeoCoord, locationImportantEnough } from "./fetchGeoCoord.js";
import fetchMock from "jest-fetch-mock";
import assert from "assert";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

describe("fetchGeoCoord", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  it("returns error when ok is false", () => {
    fetchMock.mockResponseOnce("", { status: 300, statusText: "Error Text" });
    return fetchGeoCoord("umass")
      .then(() => {
        throw new Error("should not resolve");
      })
      .catch(err => {
        assert(err.message === "Response error: Error Text");
      });
  });
  it("returns correct lat, lon, and importances", () => {
    const test = [
      {
        lat: "42",
        lon: "-72",
        importances: [0.1, 0.12, 0.2, 0.3, 0.05],
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(test));
    return fetchGeoCoord("umass").then(res => {
      assert(res.lat === 42);
      assert(res.lon === -72);
      assert(JSON.stringify(res.importances) === JSON.stringify([0.1, 0.12, 0.2, 0.3, 0.05]));
    });
  });
  it("follows type specification", () => {
    const test = [
      {
        lat: "42",
        lon: "-72",
        importances: [0.1, 0.12, 0.2, 0.3, 0.05],
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(test));
    return fetchGeoCoord("umass").then(res => {
      assert(typeof res.lat === "number");
      assert(typeof res.lon === "number");
      assert(Array.isArray(res.importances));
      assert(res.importances.length > 0);
    });
  });
});

describe("locationImportantEnough", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  it("returns true when max importance is greater than threshold", () => {
    const test = [
      {
        lat: "42",
        lon: "-72",
        importances: [0.1, 0.12, 0.2, 0.3, 0.05],
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(test));
    return expect(locationImportantEnough("umass", 0.25)).resolves.toBe(true);
  });
  it("returns false when max importance is smaller than threshold", () => {
    const test = [
      {
        lat: "42",
        lon: "-72",
        importances: [0.1, 0.12, 0.2, 0.3, 0.05],
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(test));
    return expect(locationImportantEnough("umass", 0.35)).resolves.toBe(false);
  });
  it("returns false when max importance is equal to threshold", () => {
    const test = [
      {
        lat: "42",
        lon: "-72",
        importances: [0.1, 0.12, 0.2, 0.3, 0.05],
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(test));
    return expect(locationImportantEnough("umass", 0.3)).resolves.toBe(false);
  });
});
