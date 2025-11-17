import _assert from "assert";
import { BusinessQuery, cycle, pairwise, SliceError } from "./iterators-generators";
import { Business } from "../include/data";
describe("pairwise", () => {
  // Write tests for pairwise here
  it("works for 2 element array", () => {
    const iterator = pairwise([1, 2]);
    expect(iterator.next().value).toEqual([1, 2]);
    expect(iterator.next().done).toEqual(true);
  });

  it("properly pairs array", () => {
    const iterator = pairwise([1, 2, 3, 4]);
    expect(iterator.next().value).toEqual([1, 2]);
    expect(iterator.next().value).toEqual([2, 3]);
    expect(iterator.next().value).toEqual([3, 4]);
    expect(iterator.next().done).toEqual(true);
  });

  it("yield nothing for empty array", () => {
    const iterator = pairwise([]);
    expect(iterator.next().done).toEqual(true);
    expect(iterator.next().value).toEqual(undefined);
  });

  it("yields nothing for Array with one element", () => {
    const iterator = pairwise([1]);
    expect(iterator.next().done).toEqual(true);
    expect(iterator.next().value).toEqual(undefined);
  });

  it("works for a set", () => {
    const iterator = pairwise(new Set([1, 2, 3]));
    const result = Array.from(iterator);
    expect(result).toEqual([
      [1, 2],
      [2, 3],
    ]);
  });

  it("works with strings", () => {
    const iterator = pairwise("help");
    expect(iterator.next().value).toEqual(["h", "e"]);
    expect(iterator.next().value).toEqual(["e", "l"]);
    expect(iterator.next().value).toEqual(["l", "p"]);
    expect(iterator.next().value).toEqual(undefined);
  });
});

describe("cycle", () => {
  // Write tests for cycle here
  it("properly cycles arrays", () => {
    const iterator = cycle([[1, 2], [2, 3, 4], [9], [6, 7]]);
    const result = Array.from(iterator);
    expect(result).toEqual([1, 2, 9, 6, 2, 3, 7, 4]);
  });

  it("properly cycles strings", () => {
    const iterator = cycle(["help", "me", "please"]);
    const result = Array.from(iterator);
    expect(result).toEqual(["h", "m", "p", "e", "e", "l", "l", "e", "p", "a", "s", "e"]);
  });

  it("works with one array", () => {
    const iterator = cycle([[1, 2, 3]]);
    const result = Array.from(iterator);
    expect(result).toEqual([1, 2, 3]);
  });

  it("cycles equal length array", () => {
    const iterator = cycle([
      [1, 2],
      [3, 4],
    ]);
    const result = Array.from(iterator);
    expect(result).toEqual([1, 3, 2, 4]);
  });

  it("works with empty arrays", () => {
    const iterator = cycle([[], [], []]);
    const result = Array.from(iterator);
    expect(result).toEqual([]);
  });

  it("cycles when one array is empty", () => {
    const iterator = cycle([[], [3, 4]]);
    const result = Array.from(iterator);
    expect(result).toEqual([3, 4]);
  });

  it("works with mix of empty and nonempty arrays", () => {
    const iterator = cycle([[], [3, 4], []]);
    const result = Array.from(iterator);
    expect(result).toEqual([3, 4]);
  });

  it("works when end array is empty", () => {
    const iterator = cycle([[3, 4], []]);
    const result = Array.from(iterator);
    expect(result).toEqual([3, 4]);
  });
});

describe("BusinessQuery.filter", () => {
  // Write tests for BusinessQuery.filter here
  it("filters the businesses based on star rating", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "31", name: "NoStar" },
      { business_id: "67", name: "BK", stars: 4 },
    ];
    const businessList = new BusinessQuery(businesses);
    const topRated = businessList.filter(business => (business.stars ?? 0) > 3);
    const result = Array.from(topRated);

    expect(result).toEqual([
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "67", name: "BK", stars: 4 },
    ]);
  });

  it("filters businesses based on the city", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", city: "Billerica" },
      { business_id: "30", name: "McDonalds", city: "Chelmford" },
      { business_id: "67", name: "BK" },
    ];
    const businessList = new BusinessQuery(businesses);
    const billericaBussinesses = businessList.filter(business => business.city === "Billerica");
    const result = Array.from(billericaBussinesses);

    expect(result).toEqual([{ business_id: "21", name: "Costco", city: "Billerica" }]);
  });

  it("returns nothing if nothing matches", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "31", name: "NoStar" },
      { business_id: "67", name: "BK", stars: 4 },
    ];
    const businessList = new BusinessQuery(businesses);
    const topRated = businessList.filter(business => (business.stars ?? 0) > 5);
    const result = Array.from(topRated);

    expect(result).toEqual([]);
  });

  it("returns nothing for include if for empty business query", () => {
    const businesses: Business[] = [];
    const businessList = new BusinessQuery(businesses);
    const rated = businessList.filter(_business => true);
    const result = Array.from(rated);

    expect(result).toEqual([]);
  });

  it("returns everything if everything matches", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "31", name: "NoStar", stars: 3 },
      { business_id: "67", name: "BK", stars: 4 },
    ];
    const businessList = new BusinessQuery(businesses);
    const topRated = businessList.filter(business => (business.stars ?? 0) > 0);
    const result = Array.from(topRated);

    expect(result).toEqual([
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "31", name: "NoStar", stars: 3 },
      { business_id: "67", name: "BK", stars: 4 },
    ]);
  });
});

describe("BusinessQuery.exclude", () => {
  // Write tests for BusinessQuery.exclude here
  it("returns nothing for exclude if for empty business query", () => {
    const businesses: Business[] = [];
    const businessList = new BusinessQuery(businesses);
    const rated = businessList.exclude(_business => false);
    const result = Array.from(rated);

    expect(result).toEqual([]);
  });

  it("exludes the businesses based on star rating", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "31", name: "NoStar" },
      { business_id: "67", name: "BK", stars: 4 },
    ];
    const businessList = new BusinessQuery(businesses);
    const topRated = businessList.exclude(business => (business.stars ?? 0) > 3);
    const result = Array.from(topRated);

    expect(result).toEqual([
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "31", name: "NoStar" },
    ]);
  });

  it("exlcudes businesses based on the city", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", city: "Billerica" },
      { business_id: "30", name: "McDonalds", city: "Chelmford" },
      { business_id: "67", name: "BK" },
    ];
    const businessList = new BusinessQuery(businesses);
    const billericaBussinesses = businessList.exclude(business => business.city === "Billerica");
    const result = Array.from(billericaBussinesses);

    expect(result).toEqual([
      { business_id: "30", name: "McDonalds", city: "Chelmford" },
      { business_id: "67", name: "BK" },
    ]);
  });

  it("excludes everything if nothing matches", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "67", name: "BK", stars: 4 },
    ];
    const businessList = new BusinessQuery(businesses);
    const Rated = businessList.exclude(business => (business.stars ?? 0) >= 1);
    const result = Array.from(Rated);

    expect(result).toEqual([]);
  });

  it("excludes nothing if nothing matches", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "67", name: "BK", stars: 4 },
    ];
    const businessList = new BusinessQuery(businesses);
    const rated = businessList.exclude(business => (business.stars ?? 0) < 0);
    const result = Array.from(rated);

    expect(result).toEqual([
      { business_id: "21", name: "Costco", stars: 5 },
      { business_id: "30", name: "McDonalds", stars: 1 },
      { business_id: "67", name: "BK", stars: 4 },
    ]);
  });

  it("excludes everything when field is undefind", () => {
    const businesses: Business[] = [
      { business_id: "21", name: "Costco" },
      { business_id: "30", name: "McDonalds" },
      { business_id: "67", name: "BK" },
    ];
    const businessList = new BusinessQuery(businesses);
    const topRated = businessList.exclude(business => (business.stars ?? 0) < -1);
    const result = Array.from(topRated);

    expect(result).toEqual([
      { business_id: "21", name: "Costco" },
      { business_id: "30", name: "McDonalds" },
      { business_id: "67", name: "BK" },
    ]);
  });

  describe("BusinessQuery.slice", () => {
    // Write tests for BusinessQuery.slice here
    const businessList: Business[] = [
      { business_id: "21", name: "Costco" },
      { business_id: "30", name: "McDonalds" },
      { business_id: "67", name: "BK" },
      { business_id: "123", name: "HelloWorld" },
    ];

    it("yields when start and end are in range", () => {
      const businesses = new BusinessQuery(businessList);
      const businessSlice = businesses.slice(0, 2);
      const result = Array.from(businessSlice);

      expect(result).toEqual([
        { business_id: "21", name: "Costco" },
        { business_id: "30", name: "McDonalds" },
      ]);
    });

    it("yields nothing for empty array", () => {
      const empty = new BusinessQuery([]);
      const businessSlice = empty.slice(0);
      const result = Array.from(businessSlice);

      expect(result).toEqual([]);
    });

    it("yields nothing when start and end = 0", () => {
      const businesses = new BusinessQuery(businessList);
      const businessSlice = businesses.slice(0, 0);
      const result = Array.from(businessSlice);

      expect(result).toEqual([]);
    });

    it("yields one business when there is only one business", () => {
      const costco = new BusinessQuery([{ business_id: "21", name: "Costco" }]);
      const businessSlice = costco.slice(0);
      const result = Array.from(businessSlice);

      expect(result).toEqual([{ business_id: "21", name: "Costco" }]);
    });

    it("yields all when no end", () => {
      const businesses = new BusinessQuery(businessList);
      const businessSlice = businesses.slice(0);
      const result = Array.from(businessSlice);

      expect(result).toEqual([
        { business_id: "21", name: "Costco" },
        { business_id: "30", name: "McDonalds" },
        { business_id: "67", name: "BK" },
        { business_id: "123", name: "HelloWorld" },
      ]);
    });

    it("yields nothing when start is greater than length", () => {
      const businesses = new BusinessQuery(businessList);
      const businessSlice = businesses.slice(5);
      const result = Array.from(businessSlice);

      expect(result).toEqual([]);
    });

    it("yields nothing when start is equals than length", () => {
      const businesses = new BusinessQuery(businessList);
      const businessSlice = businesses.slice(4);
      const result = Array.from(businessSlice);

      expect(result).toEqual([]);
    });

    it("yields nothing when start is equals than end", () => {
      const businesses = new BusinessQuery(businessList);
      const businessSlice = businesses.slice(1, 1);
      const result = Array.from(businessSlice);

      expect(result).toEqual([]);
    });

    it("throw a exception when start/end is not a integer", () => {
      const businesses = new BusinessQuery(businessList);
      expect(() => businesses.slice(1.5)).toThrow(SliceError);
      expect(() => businesses.slice(1.5, 3)).toThrow(SliceError);
      expect(() => businesses.slice(1, 3.5)).toThrow(SliceError);
    });

    it("throw a exception when start/end is negative", () => {
      const businesses = new BusinessQuery(businessList);
      expect(() => businesses.slice(-1)).toThrow(SliceError);
      expect(() => businesses.slice(-1, 3)).toThrow(SliceError);
      expect(() => businesses.slice(0, -3)).toThrow(SliceError);
    });

    it("throw a exception when start is greater than end", () => {
      const businesses = new BusinessQuery(businessList);
      expect(() => businesses.slice(3, 1)).toThrow(SliceError);
    });

    it("yields until end of array", () => {
      const businesses = new BusinessQuery(businessList);
      const businessSlice = businesses.slice(2, 7);
      const result = Array.from(businessSlice);

      expect(result).toEqual([
        { business_id: "67", name: "BK" },
        { business_id: "123", name: "HelloWorld" },
      ]);
    });
  });
});
