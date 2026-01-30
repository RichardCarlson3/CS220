import { jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { fetchCurrentTemperature, tempAvgAboveAtCoords } from "./fetchCurrentTemperature.js";
import assert from "assert";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

describe("fetchCurrentTemperature", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  it("returns the correct time + temperature arrays", () => {
    const mockJson = {
      hourly: {
        time: ["t1", "t2"],
        temperature_2m: [60, 65],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockJson));
    return fetchCurrentTemperature({ latitude: 40, longitude: 50 }).then(result => {
      assert(result.time[1] === "t2");
      assert(result.temperature_2m[1] === 65);
    });
  });
  it("follows type specification (arrays of strings / numbers)", () => {
    const mockJson = {
      hourly: {
        time: ["2:00", "3:00"],
        temperature_2m: [55.1, 56.2],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockJson));
    return fetchCurrentTemperature({ latitude: 10, longitude: 20 }).then(result => {
      assert(typeof result === "object");
      assert(typeof result.time[0] === "string");
      assert(typeof result.temperature_2m[0] === "number");
    });
  });
  it("throws an error when !response.ok", () => {
    fetchMock.mockResponseOnce("", { status: 400, statusText: "Bad Request" });
    return fetchCurrentTemperature({ latitude: 10, longitude: 20 })
      .then(() => {
        throw new Error("Should not resolve");
      })
      .catch(err => {
        assert(err.message === "Bad Request");
      });
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("tempAvgAboveAtCoords", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });
  it("returns true when average temperature is above the arg", () => {
    const mockJson = {
      hourly: {
        time: ["t1", "t2", "t3"],
        temperature_2m: [60, 70, 80],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockJson));
    return tempAvgAboveAtCoords({ latitude: 12, longitude: 13 }, 69.9).then(result => {
      assert(result);
    });
  });
  it("returns false when average temperature is below the arg", () => {
    const mockJson = {
      hourly: {
        time: ["t1", "t2", "t3"],
        temperature_2m: [40, 50, 60],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockJson));
    return tempAvgAboveAtCoords({ latitude: 12, longitude: 13 }, 50.1).then(result => {
      assert(!result);
    });
  });
  it("works whenthere is only 1 temp", () => {
    const mockJson = {
      hourly: {
        time: ["t1"],
        temperature_2m: [40],
      },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockJson));
    return tempAvgAboveAtCoords({ latitude: 12, longitude: 13 }, 50.1).then(result => {
      assert(!result);
    });
  });
  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
