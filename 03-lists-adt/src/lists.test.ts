import assert from "assert";
import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
// listToArray and arrayToList are provided for your testing convenience only.
import {
  insertOrdered,
  everyNRev,
  everyNCond,
  keepTrendMiddles,
  keepLocalMaxima,
  keepLocalMinima,
  keepLocalMinimaAndMaxima,
  nonNegativeProducts,
  negativeProducts,
  deleteFirst,
  deleteLast,
  squashList,
} from "./lists.js";

describe("insertOrdered", () => {
  // Tests for insertOrdered go here
  it("insertOrdered at start of list", () => {
    const list = node(2, node(3, node(4, node(5, empty()))));
    const newlist = insertOrdered(list, 1);
    assert(newlist.head() === 1);
    assert(newlist.tail().head() === 2);
    assert(newlist.tail().tail().head() === 3);
    assert(newlist.tail().tail().tail().head() === 4);
    assert(newlist.tail().tail().tail().tail().head() === 5);
    assert(newlist.tail().tail().tail().tail().tail().isEmpty);
  });
  it("insertOrdered should insert element equal to first element at start of list", () => {
    const list = node(2, node(3, node(4, node(5, empty()))));
    const newlist = insertOrdered(list, 2);
    assert(newlist.head() === 2);
    assert(newlist.tail().head() === 2);
    assert(newlist.tail().tail().head() === 3);
    assert(newlist.tail().tail().tail().head() === 4);
    assert(newlist.tail().tail().tail().tail().head() === 5);
    assert(newlist.tail().tail().tail().tail().tail().isEmpty);
  });
  it("insertOrdered at end of list", () => {
    const list = node(1, node(2, node(3, node(4, empty()))));
    const newlist = insertOrdered(list, 5);
    assert(newlist.head() === 1);
    assert(newlist.tail().head() === 2);
    assert(newlist.tail().tail().head() === 3);
    assert(newlist.tail().tail().tail().head() === 4);
    assert(newlist.tail().tail().tail().tail().head() === 5);
    assert(newlist.tail().tail().tail().tail().tail().isEmpty);
  });
  it("insertOrdered at middle of list", () => {
    const list = node(1, node(2, node(4, node(5, empty()))));
    const newlist = insertOrdered(list, 3);
    assert(newlist.head() === 1);
    assert(newlist.tail().head() === 2);
    assert(newlist.tail().tail().head() === 3);
    assert(newlist.tail().tail().tail().head() === 4);
    assert(newlist.tail().tail().tail().tail().head() === 5);
    assert(newlist.tail().tail().tail().tail().tail().isEmpty);
  });
  it("insertOrdered with decimals", () => {
    const list = node(1.5, node(2.5, node(4.5, node(5.5, empty()))));
    const newlist = insertOrdered(list, 3.5);
    assert(newlist.head() === 1.5);
    assert(newlist.tail().head() === 2.5);
    assert(newlist.tail().tail().head() === 3.5);
    assert(newlist.tail().tail().tail().head() === 4.5);
    assert(newlist.tail().tail().tail().tail().head() === 5.5);
    assert(newlist.tail().tail().tail().tail().tail().isEmpty);
  });
  it("insertOrdered with negative decimals", () => {
    const list = node(-5.5, node(-4.5, node(-2.5, node(-1.5, empty()))));
    const newlist = insertOrdered(list, -3.5);
    assert(newlist.head() === -5.5);
    assert(newlist.tail().head() === -4.5);
    assert(newlist.tail().tail().head() === -3.5);
    assert(newlist.tail().tail().tail().head() === -2.5);
    assert(newlist.tail().tail().tail().tail().head() === -1.5);
    assert(newlist.tail().tail().tail().tail().tail().isEmpty);
  });
  it("insertOrdered with negative", () => {
    const list = node(-5.5, node(-4.5, node(-2.5, node(-1.5, empty()))));
    const newlist = insertOrdered(list, -3);
    assert(newlist.head() === -5.5);
    assert(newlist.tail().head() === -4.5);
    assert(newlist.tail().tail().head() === -3);
    assert(newlist.tail().tail().tail().head() === -2.5);
    assert(newlist.tail().tail().tail().tail().head() === -1.5);
    assert(newlist.tail().tail().tail().tail().tail().isEmpty);
  });
  it("insertOrdered is empty list", () => {
    const list: List<number> = empty();
    const newlist = insertOrdered(list, 5);
    assert(newlist.head() === 5);
    assert(newlist.tail().isEmpty);
  });
  it("insertOrdered is single element at start", () => {
    const list: List<number> = node(1, empty());
    const newlist = insertOrdered(list, 0);
    assert(newlist.head() === 0);
    assert(newlist.tail().head() === 1);
  });
  it("insertOrdered is single element if equal", () => {
    const list: List<number> = node(1, empty());
    const newlist = insertOrdered(list, 1);
    assert(newlist.head() === 1);
    assert(newlist.tail().head() === 1);
  });
  it("insertOrdered is negative to positive list", () => {
    const list: List<number> = node(1, node(3, node(5, empty())));
    const newlist = insertOrdered(list, -1);
    assert(newlist.head() === -1);
    assert(newlist.tail().head() === 1);
  });
  it("insertOrdered duplicates", () => {
    const list = arrayToList([1, 1, 6, 6, 9, 9]);
    const newList = insertOrdered(list, 6);
    const result = listToArray(newList);
    assert.deepEqual(result, [1, 1, 6, 6, 6, 9, 9]);
  });
});

describe("everyNRev", () => {
  // Tests for everyNRev go here
  it("checks reverseal for every number", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = everyNRev(list, 1);
    assert(newList.head() === 5);
    assert(newList.tail().head() === 4);
    assert(newList.tail().tail().head() === 3);
    assert(newList.tail().tail().tail().head() === 2);
    assert(newList.tail().tail().tail().tail().head() === 1);
    assert(newList.tail().tail().tail().tail().tail().isEmpty);
  });
  it("checks reverseal for every string", () => {
    const list = node("hi", node("hello", node("bye", node("help", node("see", empty())))));
    const newList = everyNRev(list, 1);
    assert(newList.head() === "see");
    assert(newList.tail().head() === "help");
    assert(newList.tail().tail().head() === "bye");
    assert(newList.tail().tail().tail().head() === "hello");
    assert(newList.tail().tail().tail().tail().head() === "hi");
    assert(newList.tail().tail().tail().tail().tail().isEmpty);
  });
  it("checks reverseal for even", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = everyNRev(list, 2);
    assert(newList.head() === 4);
    assert(newList.tail().head() === 2);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks reverseal for none", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = everyNRev(list, 6);
    assert(newList.isEmpty);
  });
  it("everyNRev works for empty list", () => {
    const list: List<number> = empty();
    const newlist = everyNRev(list, 5);
    assert(newlist.isEmpty);
  });
});

describe("everyNCond", () => {
  // Tests for everyNCond go here
  it("checks always even and true condition", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = everyNCond(list, 2, _cond => true);
    assert.deepEqual(newList.head(), 2);
    assert.deepEqual(newList.tail().head(), 4);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks condition with strings", () => {
    const list = node("hi", node("hello", node("bye", node("help", node("see", empty())))));
    const newList = everyNCond(list, 2, _cond => true);
    assert.deepEqual(newList.head(), "hello");
    assert.deepEqual(newList.tail().head(), "help");
    assert(newList.tail().tail().isEmpty);
  });
  it("checks always false condition", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = everyNCond(list, 2, _cond => false);
    assert(newList.isEmpty());
  });
  it("everyNCond works for empty list", () => {
    const list: List<number> = empty();
    const newlist = everyNCond(list, 5, _e => true);
    assert(newlist.isEmpty);
  });
});

describe("keepTrendMiddles", () => {
  // Tests for keepTrendMiddles go here
  it("checks keepTrendMiddles for always true", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = keepTrendMiddles(list, () => true);
    assert.deepEqual(newList.head(), 2);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 4);
    assert(newList.tail().tail().tail().isEmpty());
  });
  it("checks keepTrendMiddles for always false", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = keepTrendMiddles(list, () => false);
    assert(newList.isEmpty());
  });
  it("checks keepTrendMiddles for middle case", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = keepTrendMiddles(list, (_prev, curr, _next) => curr === 3);
    assert.deepEqual(newList.head(), 3);
    assert(newList.tail().isEmpty);
  });
  it("checks keepTrendMiddles for middle cases", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = keepTrendMiddles(list, (_prev, curr, _next) => curr !== 3);
    assert.deepEqual(newList.head(), 2);
    assert.deepEqual(newList.tail().head(), 4);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks keepTrendMiddles for decimals", () => {
    const list = node(1.5, node(2.5, node(3.5, node(4.5, node(5.5, empty())))));
    const newList = keepTrendMiddles(list, (_prev, curr, _next) => curr !== 3.5);
    assert.deepEqual(newList.head(), 2.5);
    assert.deepEqual(newList.tail().head(), 4.5);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks keepTrendMiddles for negative decimals", () => {
    const list = node(-1.5, node(-2.5, node(-3.5, node(-4.5, node(-5.5, empty())))));
    const newList = keepTrendMiddles(list, (_prev, curr, _next) => curr !== -3.5);
    assert.deepEqual(newList.head(), -2.5);
    assert.deepEqual(newList.tail().head(), -4.5);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks keepTrendMiddles for empty list", () => {
    const list: List<number> = empty();
    const newList = keepTrendMiddles(list, () => true);
    assert(newList.isEmpty());
  });
  it("checks keepTrendMiddles for one element list", () => {
    const list = node(1, empty());
    const newList = keepTrendMiddles(list, () => true);
    assert(newList.isEmpty());
  });
  it("checks keepTrendMiddles for two element list", () => {
    const list = node(1, node(2, empty()));
    const newList = keepTrendMiddles(list, () => true);
    assert(newList.isEmpty());
  });
});

describe("keepLocalMaxima", () => {
  // Tests for keepLocalMaxima go here
  it("checks keepLocalMaxima for first case maxima", () => {
    const list = node(0, node(4, node(3, node(2, node(1, empty())))));
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), 4);
    assert(newList.tail().isEmpty());
  });
  it("checks keepLocalMaxima for middle case maxima", () => {
    const list = node(0, node(2, node(3, node(2, node(1, empty())))));
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), 3);
    assert(newList.tail().isEmpty());
  });
  it("checks keepLocalMaxima for last case maxima", () => {
    const list = node(0, node(1, node(1, node(3, node(1, empty())))));
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), 3);
    assert(newList.tail().isEmpty());
  });
  it("checks keepLocalMaxima for prev always larger", () => {
    const list = node(5, node(4, node(3, node(2, node(1, empty())))));
    const newList = keepLocalMaxima(list);
    assert(newList.isEmpty);
  });
  it("checks keepLocalMaxima for next always larger", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = keepLocalMaxima(list);
    assert(newList.isEmpty);
  });
  it("checks keepLocalMaxima for empty list", () => {
    const list: List<number> = empty();
    const newList = keepLocalMaxima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMaxima for one element list", () => {
    const list = node(1, empty());
    const newList = keepLocalMaxima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMaxima for two element list", () => {
    const list = node(1, node(2, empty()));
    const newList = keepLocalMaxima(list);
    assert(newList.isEmpty());
  });
  it("keepLocalMaxima works for big numbers", () => {
    const list = node(9000, node(100, node(717171717171, node(10000, node(9000, empty())))));
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), 717171717171);
    assert(newList.tail().isEmpty);
  });
  it("keepLocalMaxima works for decimals", () => {
    const list = node(3, node(3.14, node(3.141592653589, node(3.14159, node(3.14, empty())))));
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), 3.141592653589);
    assert(newList.tail().isEmpty);
  });
  it("keepLocalMaxima works for negatives", () => {
    const list = node(-5, node(-4, node(-3, node(-4, node(-5, empty())))));
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), -3);
    assert(newList.tail().isEmpty);
  });
  it("keepLocalMaxima works for negative decimals", () => {
    const list = node(-3.141592653589, node(-3.1415, node(-3.14, node(-3.14159, node(-3.14, empty())))));
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), -3.14);
    assert(newList.tail().isEmpty);
  });
  it("keepLocalMaxima works for negative large numbers", () => {
    const list = node(
      -3141592653589,
      node(-3141592653000, node(-31400000, node(-314159265350, node(-3140000000000, empty()))))
    );
    const newList = keepLocalMaxima(list);
    assert.deepEqual(newList.head(), -31400000);
    assert(newList.tail().isEmpty);
  });
});

describe("keepLocalMinima", () => {
  // Tests for keepLocalMinima go here
  it("checks keepLocalMinima for first case minima", () => {
    const list = node(10000, node(4, node(900, node(2, node(0, empty())))));
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), 4);
    assert(newList.tail().isEmpty());
  });
  it("checks keepLocalMinima for middle case minima", () => {
    const list = node(0, node(102, node(3, node(73, node(1, empty())))));
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), 3);
    assert(newList.tail().isEmpty());
  });
  it("checks keepLocalMinima for last case minima", () => {
    const list = node(0, node(17, node(5, node(3, node(8, empty())))));
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), 3);
    assert(newList.tail().isEmpty());
  });
  it("checks keepLocalMinima for next always smaller", () => {
    const list = node(5, node(4, node(3, node(2, node(1, empty())))));
    const newList = keepLocalMinima(list);
    assert(newList.isEmpty);
  });
  it("checks keepLocalMinima for prev always smaller", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = keepLocalMinima(list);
    assert(newList.isEmpty);
  });
  it("checks keepLocalMinima for empty list", () => {
    const list: List<number> = empty();
    const newList = keepLocalMinima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMinima for one element list", () => {
    const list = node(1, empty());
    const newList = keepLocalMinima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMinima for two element list", () => {
    const list = node(1, node(2, empty()));
    const newList = keepLocalMinima(list);
    assert(newList.isEmpty());
  });
  it("keepLocalMinima works for decimals numbers", () => {
    const list = node(3.141592653589, node(3.1415, node(3.14, node(3.14159, node(3.14, empty())))));
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), 3.14);
  });
  it("keepLocalMinima works for big numbers", () => {
    const list = node(9000000000, node(10000000000, node(717171717, node(1000000000000, node(9000, empty())))));
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), 717171717);
    assert(newList.tail().isEmpty);
  });
  it("keepLocalMinima works for negatives", () => {
    const list = node(-5, node(-4, node(-5, node(-4, node(-5, empty())))));
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), -5);
    assert(newList.tail().isEmpty);
  });
  it("keepLocalMaxima works for negative decimals", () => {
    const list = node(0, node(-3.14159, node(-3.141592653589, node(-3.14159, node(-3.14, empty())))));
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), -3.141592653589);
    assert(newList.tail().isEmpty);
  });
  it("keepLocalMaxima works for negative large numbers", () => {
    const list = node(
      -3141592653589,
      node(-3141592653000, node(-3141592653589, node(-314159265350, node(-3140000000000, empty()))))
    );
    const newList = keepLocalMinima(list);
    assert.deepEqual(newList.head(), -3141592653589);
    assert(newList.tail().isEmpty);
  });
});

describe("keepLocalMinimaAndMaxima", () => {
  // Tests for keepLocalMinimaAndMaxima go here
  it("checks keepLocalMinimaAndMaxima maxima", () => {
    const list = node(0, node(4, node(3, node(2, node(1, empty())))));
    const newList = keepLocalMinimaAndMaxima(list);
    assert.deepEqual(newList.head(), 4);
    assert(newList.tail().isEmpty());
  });
  it("checks keepLocalMinimaAndMaxima minima", () => {
    const list = node(10000, node(4, node(900, node(2, node(0, empty())))));
    const newList = keepLocalMinimaAndMaxima(list);
    assert.deepEqual(newList.head(), 4);
    assert.deepEqual(newList.tail().head(), 900);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks keepLocalMinimaAndMaxima for prev always smaller and next always larger", () => {
    const list = node(1, node(2, node(3, node(4, node(5, empty())))));
    const newList = keepLocalMinimaAndMaxima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMinimaAndMaxima for prev always larger and next always smaller", () => {
    const list = node(5, node(4, node(3, node(2, node(1, empty())))));
    const newList = keepLocalMinimaAndMaxima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMinimaAndMaxima for decimals", () => {
    const list = node(1.5, node(3.141592653589, node(3.14, node(3.1415, empty()))));
    const newList = keepLocalMinimaAndMaxima(list);
    assert.deepEqual(newList.head(), 3.141592653589);
    assert.deepEqual(newList.tail().head(), 3.14);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks keepLocalMinimaAndMaxima for negative decimals", () => {
    const list = node(-1.5, node(-3.141592653589, node(-3.14, node(-3.1415, empty()))));
    const newList = keepLocalMinimaAndMaxima(list);
    assert.deepEqual(newList.head(), -3.141592653589);
    assert.deepEqual(newList.tail().head(), -3.14);
    assert(newList.tail().tail().isEmpty);
  });
  it("checks keepLocalMinimaAndMaxima for negative large numbers", () => {
    const list = node(-15, node(-3141592653589, node(-314, node(-31415, empty()))));
    const newList = keepLocalMinimaAndMaxima(list);
    assert.deepEqual(newList.head(), -3141592653589);
    assert.deepEqual(newList.tail().head(), -314);
    assert(newList.tail().tail().isEmpty);
  });

  it("checks keepLocalMinimaAndMaxima for empty list", () => {
    const list: List<number> = empty();
    const newList = keepLocalMinimaAndMaxima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMinimaAndMaxima for one element list", () => {
    const list = node(1, empty());
    const newList = keepLocalMinimaAndMaxima(list);
    assert(newList.isEmpty());
  });
  it("checks keepLocalMinimaAndMaxima for two element list", () => {
    const list = node(1, node(2, empty()));
    const newList = keepLocalMinimaAndMaxima(list);
    assert(newList.isEmpty());
  });
});

describe("nonNegativeProducts", () => {
  // Tests for nonNegativeProducts go here
  it("nonNegativeProducts empty list", () => {
    const list: List<number> = empty();
    const newList = nonNegativeProducts(list);
    assert(newList.isEmpty);
  });
  it("nonNegativeProducts only one positive begining", () => {
    const list = node(5, node(-4, node(-3, node(-2, node(-1, empty())))));
    const newList = nonNegativeProducts(list);
    assert(newList.head() === 5);
  });
  it("nonNegativeProducts only one positive end", () => {
    const list = node(-5, node(-4, node(-3, node(-2, node(1, empty())))));
    const newList = nonNegativeProducts(list);
    assert(newList.head() === 1);
  });
  it("nonNegativeProducts only negative list", () => {
    const list = node(-5, node(-4, node(-3, node(-2, node(-1, empty())))));
    const newList = nonNegativeProducts(list);
    assert(newList.isEmpty);
  });
  it("nonNegativeProducts only positive list", () => {
    const list = node(5, node(4, node(3, node(2, node(1, empty())))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 20);
    assert.deepEqual(newList.tail().tail().head(), 60);
    assert.deepEqual(newList.tail().tail().tail().head(), 120);
    assert.deepEqual(newList.tail().tail().tail().tail().head(), 120);
    assert(newList.tail().tail().tail().tail().tail().isEmpty);
  });
  it("nonNegativeProducts with negative middle with decimals", () => {
    const list = node(5, node(4.5, node(-3, node(2, empty()))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 22.5);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });
  it("nonNegativeProducts with negative end with decimals", () => {
    const list = node(5, node(4.5, node(3, node(-2, empty()))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 22.5);
    assert.deepEqual(newList.tail().tail().head(), 67.5);
    assert(newList.tail().tail().tail().isEmpty);
  });
  it("nonNegativeProducts with negative start with decimals", () => {
    const list = node(-5, node(4.5, node(3, node(2, empty()))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 4.5);
    assert.deepEqual(newList.tail().head(), 13.5);
    assert.deepEqual(newList.tail().tail().head(), 27);
    assert(newList.tail().tail().tail().isEmpty);
  });
});

describe("negativeProducts", () => {
  // Tests for nonNegativeProducts go here
  it("NegativeProducts empty list", () => {
    const list: List<number> = empty();
    const newList = negativeProducts(list);
    assert(newList.isEmpty);
  });
  it("negativeProducts only one positive begining", () => {
    const list = node(5, node(-4, node(-3, node(-2, node(-1, empty())))));
    const newList = negativeProducts(list);
    assert(newList.head() === -4);
    assert(newList.tail().head() === 12);
    assert(newList.tail().tail().head() === -24);
    assert(newList.tail().tail().tail().head() === 24);
    assert(newList.tail().tail().tail().tail().isEmpty);
  });
  it("negativeProducts only one negative end", () => {
    const list = node(5, node(4, node(3, node(2, node(-1, empty())))));
    const newList = negativeProducts(list);
    assert(newList.head() === -1);
    assert(newList.tail().isEmpty);
  });
  it("nonNegativeProducts only one negative begining", () => {
    const list = node(-5, node(4, node(3, node(2, node(1, empty())))));
    const newList = negativeProducts(list);
    assert(newList.head() === -5);
    assert(newList.tail().isEmpty);
  });
  it("negativeProducts only one positive end", () => {
    const list = node(-5, node(-4, node(-3, node(-2, node(1, empty())))));
    const newList = negativeProducts(list);
    assert(newList.head() === -5);
    assert(newList.tail().head() === 20);
    assert(newList.tail().tail().head() === -60);
    assert(newList.tail().tail().tail().head() === 120);
    assert(newList.tail().tail().tail().tail().isEmpty);
  });
  it("nonNegativeProducts only negative list", () => {
    const list = node(-5, node(-4, node(-3, node(-2, node(-1, empty())))));
    const newList = nonNegativeProducts(list);
    assert(newList.isEmpty);
  });
  it("nonNegativeProducts only positive list", () => {
    const list = node(5, node(4, node(3, node(2, node(1, empty())))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 20);
    assert.deepEqual(newList.tail().tail().head(), 60);
    assert.deepEqual(newList.tail().tail().tail().head(), 120);
    assert.deepEqual(newList.tail().tail().tail().tail().head(), 120);
    assert(newList.tail().tail().tail().tail().tail().isEmpty);
  });
  it("nonNegativeProducts with negative middle with decimals", () => {
    const list = node(5, node(4.5, node(-3, node(2, empty()))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 22.5);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });
  it("nonNegativeProducts with negative end with decimals", () => {
    const list = node(5, node(4.5, node(3, node(-2, empty()))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 22.5);
    assert.deepEqual(newList.tail().tail().head(), 67.5);
    assert(newList.tail().tail().tail().isEmpty);
  });
  it("nonNegativeProducts with negative start with decimals", () => {
    const list = node(-5, node(4.5, node(3, node(2, empty()))));
    const newList = nonNegativeProducts(list);
    assert.deepEqual(newList.head(), 4.5);
    assert.deepEqual(newList.tail().head(), 13.5);
    assert.deepEqual(newList.tail().tail().head(), 27);
    assert(newList.tail().tail().tail().isEmpty);
  });
});

describe("deleteFirst", () => {
  // Tests for deleteFirst go here
  it("deleteFirst deletes the first 2", () => {
    const list = node(5, node(2, node(3, node(2, empty()))));
    const newList = deleteFirst(list, 2);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteFirst deletes first element", () => {
    const list = node(2, node(5, node(3, node(2, empty()))));
    const newList = deleteFirst(list, 2);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteFirst deletes last element", () => {
    const list = node(3, node(5, node(3, node(2, empty()))));
    const newList = deleteFirst(list, 2);
    assert.deepEqual(newList.head(), 3);
    assert.deepEqual(newList.tail().head(), 5);
    assert.deepEqual(newList.tail().tail().head(), 3);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteFirst deletes decimals", () => {
    const list = node(2, node(5.5, node(3, node(2, empty()))));
    const newList = deleteFirst(list, 5.5);
    assert.deepEqual(newList.head(), 2);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteFirst deletes negative decimals", () => {
    const list = node(2, node(-5.5, node(3, node(2, empty()))));
    const newList = deleteFirst(list, -5.5);
    assert.deepEqual(newList.head(), 2);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });
  it("checks if deleteFirst works for empty list", () => {
    const list: List<number> = empty();
    const newList = deleteFirst(list, -5.5);
    assert(newList.isEmpty);
  });

  it("checks if deleteFirst works for one element list", () => {
    const list = node(1, empty());
    const newList = deleteFirst(list, 1);
    assert(newList.isEmpty());
  });

  it("checks if deleteFirst works if value isn't in list", () => {
    const list = node(1, empty());
    const newList = deleteFirst(list, 5);
    assert(newList.head() === 1);
    assert(newList.tail());
  });
  it("checks if deleteFirst works if value is a string", () => {
    const list = node("hello", node("bye", empty()));
    const newList = deleteFirst(list, "hello");
    assert(newList.head() === "bye");
    assert(newList.tail().isEmpty);
  });
});

describe("deleteLast", () => {
  // Tests for deleteLast go here
  it("deleteLast deletes the first 2", () => {
    const list = node(5, node(2, node(3, node(2, empty()))));
    const newList = deleteLast(list, 2);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 2);
    assert.deepEqual(newList.tail().tail().head(), 3);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteLast deletes first element", () => {
    const list = node(2, node(5, node(3, node(1, empty()))));
    const newList = deleteLast(list, 2);
    assert.deepEqual(newList.head(), 5);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 1);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteLast deletes last element", () => {
    const list = node(3, node(5, node(3, node(2, empty()))));
    const newList = deleteLast(list, 2);
    assert.deepEqual(newList.head(), 3);
    assert.deepEqual(newList.tail().head(), 5);
    assert.deepEqual(newList.tail().tail().head(), 3);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteLast deletes decimals", () => {
    const list = node(2, node(5.5, node(3, node(2, empty()))));
    const newList = deleteLast(list, 5.5);
    assert.deepEqual(newList.head(), 2);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteLast deletes negative decimals", () => {
    const list = node(2, node(-5.5, node(3, node(2, empty()))));
    const newList = deleteLast(list, -5.5);
    assert.deepEqual(newList.head(), 2);
    assert.deepEqual(newList.tail().head(), 3);
    assert.deepEqual(newList.tail().tail().head(), 2);
    assert(newList.tail().tail().tail().isEmpty);
  });

  it("checks if deleteLast works for empty list", () => {
    const list: List<number> = empty();
    const newList = deleteLast(list, -5.5);
    assert(newList.isEmpty);
  });

  it("checks if deleteLast works for one element list", () => {
    const list = node(1, empty());
    const newList = deleteLast(list, 1);
    assert(newList.isEmpty());
  });

  it("checks if deleteLast works if value isn't in list", () => {
    const list = node(1, empty());
    const newList = deleteLast(list, 5);
    assert(newList.head() === 1);
    assert(newList.tail());
  });

  it("checks if deleteLast works if value is a string", () => {
    const list = node("hello", node("bye", empty()));
    const newList = deleteLast(list, "hello");
    assert(newList.head() === "bye");
    assert(newList.tail().isEmpty);
  });
});

describe("squashList", () => {
  // Tests for squashList go here
  it("checks if squashList works with empty list", () => {
    const list: List<number> = empty();
    const newList = squashList(list);
    assert(newList.isEmpty);
  });
  it("checks if squashList works with list in list", () => {
    const list = arrayToList([1, 2, 3, arrayToList([6, 7]), 10]);
    const newList = squashList(list);
    const result = listToArray(newList);
    assert.deepEqual(result, [1, 2, 3, 13, 10]);
  });
  it("checks if squashList works with just number list", () => {
    const list = arrayToList([1, 2, 3, 10]);
    const newList = squashList(list);
    const result = listToArray(newList);
    assert.deepEqual(result, [1, 2, 3, 10]);
  });
  it("checks if squashList works with negative numbers and decimals", () => {
    const list = arrayToList([
      -5.5,
      arrayToList([1000000000, 10]),
      arrayToList([1, 7]),
      arrayToList([18, -4, -7.555]),
      arrayToList([0.5, 7]),
    ]);
    const newList = squashList(list);
    const result = listToArray(newList);
    assert.deepEqual(result, [-5.5, 1000000010, 8, 6.445, 7.5]);
  });
  it("checks if squashList works with just lists in lists", () => {
    const list = arrayToList([arrayToList([5, 10]), arrayToList([1, 7]), arrayToList([18, 4, 7]), arrayToList([5, 7])]);
    const newList = squashList(list);
    const result = listToArray(newList);
    assert.deepEqual(result, [15, 8, 29, 12]);
  });
});
