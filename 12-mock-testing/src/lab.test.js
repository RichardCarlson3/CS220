import assert from "assert";
import fetchMock from "jest-fetch-mock";
import { arrayIsShort, getObjsWithName } from "./lab.js";
import { jest } from "@jest/globals";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);

// example from lab slides
describe("arrayIsShort", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("returns yes if promise fulfills with short array", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([1]));
    const res = await arrayIsShort("test_url");
    expect(res).toEqual("yes");
  });

  it("returns no if promise fulfills with long array", async () => {
    fetchMock.mockImplementation(url => {
      const arr = JSON.stringify([1, 2, 3, 4, 5]);
      return Promise.resolve(new Response(arr));
    });
    const res = await arrayIsShort("test_url");
    expect(res).toEqual("no");
  });

  it("returns uh oh if promise from fetch rejects", async () => {
    fetchMock.mockReject(new Error("Test"));
    const res = await arrayIsShort("test_url");
    expect(res).toEqual("Test");
  });

  it("returns uh oh if fetch produces not ok response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 404 });
    const res = await arrayIsShort("test_url");
    expect(res).toEqual("Response error");
  });

  it("returns uh oh if fetch doesnt produce an array", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }));
    const res = await arrayIsShort("test_url");
    expect(res).toEqual("Not an array");
  });
});

// Exercise 2 and 3: write tests for getObjsWithName
describe("getObjsWithName", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  // TODO: write your tests here
  it("returns empty array if all promisses reject", async () => {
    fetchMock.mockReject(new Error("Test"));
    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);
    expect(res).toEqual([]);
  });
  it("works if all promises fulfill with an array of objects w/ name property", async () => {
    const objs = {
      a: [{ name: "a1" }, { name: "a2" }],
      b: [{ name: "b1" }, { name: "b2" }],
      c: [{ name: "c1" }, { name: "c2" }],
    };
    fetchMock.mockImplementation(url => {
      const obj = JSON.stringify(objs[url]);
      return Promise.resolve(new Response(obj));
    });
    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);
    expect(res.every(obj => "name" in obj)).toBe(true);
    expect(res.map(obj => obj.name)).toEqual(["a1", "a2", "b1", "b2", "c1", "c2"]);
  });
  it("works if all promises fulfill but not all objects have name property", async () => {
    const objs = {
      a: [{ name: "a1" }, { name: "a2" }, { name: "a3" }],
      b: [{ name: "b1" }],
      c: [{ name: "c1" }, { name: "c2" }, { name: "c3" }, { notname: "c4" }],
    };
    fetchMock.mockImplementation(url => {
      const obj = JSON.stringify(objs[url]);
      return Promise.resolve(new Response(obj));
    });
    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);
    expect(res.every(obj => "name" in obj)).toBe(true);
    expect(res.map(obj => obj.name)).toEqual(["a1", "a2", "a3", "b1", "c1", "c2", "c3"]);
  });
  it("returns [] if all promises fulfill but objects have no name field", async () => {
    const objs = {
      a: [{ x: 1 }, { x: 2 }, { x: 3 }],
      b: [{ y: 5 }, { y: 6 }, { y: 8 }],
      c: [{ z: 12 }, { z: 10 }, { z: 9 }],
    };
    fetchMock.mockImplementation(url => {
      const obj = JSON.stringify(objs[url]);
      return Promise.resolve(new Response(obj));
    });
    const urls = ["a", "b", "c"];
    const res = await getObjsWithName(urls);
    expect(res).toEqual([]);
  });
  it("works if mix of promises fulfilling and rejecting", async () => {
    const objs = {
      a: [{ name: "a1" }, { name: "a2" }],
      c: [{ name: "c1" }, { name: "c2" }],
    };
    fetchMock.mockImplementation(url => {
      if (["b", "d"].includes(url)) {
        return Promise.reject(new Error("Test rejecting promise"));
      }
      const obj = JSON.stringify(objs[url]);
      return Promise.resolve(new Response(obj));
    });
    const urls = ["a", "b", "c", "d"];
    const res = await getObjsWithName(urls);
    expect(res.every(obj => "name" in obj)).toBe(true);
    expect(res.map(obj => obj.name)).toEqual(["a1", "a2", "c1", "c2"]);
  });
});
