import { jest } from "@jest/globals";
import { fetchUniversities, universityNameLengthOrderAscending } from "./fetchUniversities.js";
import fetchMock from "jest-fetch-mock";
import assert from "assert";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

describe("fetchUniversities", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("returns a array of university names when response is ok", () => {
    const mockjson = [{ name: "UMass Amherst" }, { name: "UMass Boston" }, { name: "UMass Dartmouth" }];
    fetchMock.mockResponseOnce(JSON.stringify(mockjson));
    return fetchUniversities("Massachusetts").then(result => {
      expect(result).toEqual(["UMass Amherst", "UMass Boston", "UMass Dartmouth"]);
      assert(result.length === 3);
    });
  });

  it("returns [] when backend returns empty data", () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    return fetchUniversities("Massachusetts").then(result => {
      assert(Array.isArray(result));
      assert(result.length === 0);
    });
  });

  it("returns [] when backend returns non-array data", () => {
    const mockJson = { name: "UMass Amherst" };
    fetchMock.mockResponseOnce(JSON.stringify(mockJson));
    return fetchUniversities("Massachusetts").then(result => {
      assert(Array.isArray(result));
      assert(result.length === 0);
    });
  });

  it("throws error when !response.ok", () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404, statusText: "Not Found" });
    return fetchUniversities("bad query")
      .then(() => {
        throw new Error("Expected fetchUniversities to throw an error");
      })
      .catch(error => {
        assert(error.message === "Not Found");
      });
  });

  it("follows type specification", () => {
    const mockjson = [{ name: "Umass Amherst" }, { name: "Curry College" }, { name: "Umass Boston" }];
    fetchMock.mockResponseOnce(JSON.stringify(mockjson));
    const prom = fetchUniversities("Amherst");
    return prom.then(result => {
      assert(Array.isArray(result));
      result.forEach(item => {
        assert(typeof item === "string");
      });
      assert(result.length === 3);
      assert(Object.keys(result).length === 3);
    });
  });
  it("handles missing names and returns valid names", () => {
    const mockjson = [{ name: "UMass Amherst" }, { noName: "Curry College" }];
    fetchMock.mockResponseOnce(JSON.stringify(mockjson));
    const prom = fetchUniversities("Mass");
    return prom.then(result => {
      expect(result).toEqual(["UMass Amherst"]);
    });
  });

  it("returns [] when backend returns null", () => {
    fetchMock.mockResponseOnce(JSON.stringify(null));
    const prom = fetchUniversities("Mass");
    return prom.then(result => {
      expect(result).toEqual([]);
    });
  });

  it("returns [] when backend returns a number", () => {
    fetchMock.mockResponseOnce(JSON.stringify("12345"));
    const prom = fetchUniversities("test");
    return prom.then(result => {
      expect(result).toEqual([]);
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("universityNameLengthOrderAscending", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("Properly returns true if names are ascending in length", () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "I" }, { name: "Like" }, { name: "Testing" }]));
    return universityNameLengthOrderAscending("test").then(result => {
      expect(result).toBe(true);
    });
  });
  it("Properly returns false if names are not ascending in length", () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "Testing" }, { name: "Like" }, { name: "I" }]));
    return universityNameLengthOrderAscending("test").then(result => {
      expect(result).toBe(false);
    });
  });
  it("Properly handles errors", () => {
    fetchMock.mockRejectOnce(new Error("fake error message"));
    return universityNameLengthOrderAscending("error test").catch(error => {
      expect(error).toBeInstanceOf(Error);
    });
  });

  it("follows type specifiation", () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([{ name: "MIT" }, { name: "UMass Amherst" }, { name: "Umass Dartmouth" }])
    );
    const prom = universityNameLengthOrderAscending("Hello World");
    return prom.then(result => {
      assert(typeof result === "boolean");
      assert(Object.keys({ value: result }).length === 1);
      const args = "Hello World";
      assert(typeof args === "string");
    });
  });

  it("returns false when there are names of equal length", () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "UMass" }, { name: "Curry" }, { name: "Boston" }]));
    return universityNameLengthOrderAscending("test").then(result => {
      expect(result).toBe(false);
    });
  });

  it("works correctly with one university name", () => {
    fetchMock.mockResponseOnce(JSON.stringify([{ name: "Harvard" }]));
    return universityNameLengthOrderAscending("Harvard").then(result => {
      expect(result).toBe(true);
    });
  });

  it("works correctly with no university names", () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    return universityNameLengthOrderAscending("NoNames").then(result => {
      expect(result).toBe(true);
    });
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
