import { MergedIterator, mergedGenerator, chainGenerator } from "./lab.js";
import assert from "assert";

// needed since mergedIterator doesn't specify Iterable
function arrayFromIterator<T>(it: Iterator<T> | Generator<T>, expected_length: number): T[] {
  const values = [];
  let result = it.next();
  let i = 0;
  while (!result.done && i++ < expected_length) {
    values.push(result.value);
    result = it.next();
  }
  assert(result.done, "Iterator or Generator did not terminate after yielding the expected number of items.");
  return values;
}

function compareArrays(arr1: number[], arr2: number[]) {
  assert(arr1.length === arr2.length);
  for (let i = 0; i < arr1.length; i++) {
    assert(arr1[i] === arr2[i]);
  }
}

function mergedIteratorHelper(
  arr1: number[],
  arr2: number[],
  getOutput: (iter1: Iterator<number>, iter2: Iterator<number>, expected_length: number) => number[],
  expected: number[]
) {
  const iterator1 = arr1[Symbol.iterator]();
  const iterator2 = arr2[Symbol.iterator]();
  const output = getOutput(iterator1, iterator2, arr1.length + arr2.length);
  compareArrays(output, expected);
}

function mergeIterators(iterator1: Iterator<number>, iterator2: Iterator<number>, expected_length: number) {
  const merged_iterator = new MergedIterator(iterator1, iterator2);
  return arrayFromIterator(merged_iterator, expected_length);
}

function mergeIteratorsIntoGenerator(
  iterator1: Iterator<number>,
  iterator2: Iterator<number>,
  expected_length: number
) {
  const merged_generator = mergedGenerator(iterator1, iterator2);
  return arrayFromIterator(merged_generator, expected_length);
}

function makeIterable<T>(vals: T[]): Iterable<T> {
  return {
    [Symbol.iterator]: () => {
      let idx = 0;
      return {
        next: () => {
          if (idx < vals.length) {
            return { done: false, value: vals[idx++] };
          }
          return { done: true, value: undefined };
        },
      };
    },
  };
}

describe("mergedIterator", () => {
  it("correctly merges two iterators", () => {
    mergedIteratorHelper([1, 3, 5], [2, 4, 6], mergeIterators, [1, 2, 3, 4, 5, 6]);
  });

  it("correctly merges two iterators where one iterator is always less than the other", () => {
    mergedIteratorHelper([1, 2, 3], [5, 7, 8], mergeIterators, [1, 2, 3, 5, 7, 8]);
  });

  it("correctly merges two iterators where there are ties", () => {
    mergedIteratorHelper([1, 2, 2], [0, 2, 8], mergeIterators, [0, 1, 2, 2, 2, 8]);
  });

  it("correctly merges two empty iterators", () => {
    mergedIteratorHelper([] as number[], [] as number[], mergeIterators, [] as number[]);
  });

  it("correctly merges an empty and nonempty iterator", () => {
    mergedIteratorHelper([] as number[], [1, 4, 5], mergeIterators, [1, 4, 5]);
  });

  it("correctly merges two non-empty iterators with a different number of items", () => {
    mergedIteratorHelper([2], [1, 4, 5], mergeIterators, [1, 2, 4, 5]);
  });

  it("correctly terminates after both iterators have been exhausted", () => {
    const iterator1 = [2, 6][Symbol.iterator]();
    const iterator2 = [1, 4, 5][Symbol.iterator]();
    const merged_iterator = new MergedIterator(iterator1, iterator2);
    const output = arrayFromIterator(merged_iterator, 5);
    const expected = [1, 2, 4, 5, 6];
    expect(output).toEqual(expected);
    for (let i = 0; i < 6; i++) {
      expect(merged_iterator.next()).toEqual({ done: true, value: undefined });
    }
  });
});

describe("MergedGenerator", () => {
  it("correctly merges two iterators", () => {
    mergedIteratorHelper([1, 3, 5], [2, 4, 6], mergeIteratorsIntoGenerator, [1, 2, 3, 4, 5, 6]);
  });

  it("correctly merges two iterators where one iterator is always less than the other", () => {
    mergedIteratorHelper([1, 2, 3], [5, 7, 8], mergeIteratorsIntoGenerator, [1, 2, 3, 5, 7, 8]);
  });

  it("correctly merges two iterators where there are ties", () => {
    mergedIteratorHelper([1, 2, 2], [0, 2, 8], mergeIteratorsIntoGenerator, [0, 1, 2, 2, 2, 8]);
  });

  it("correctly merges two empty iterators", () => {
    mergedIteratorHelper([] as number[], [] as number[], mergeIteratorsIntoGenerator, [] as number[]);
  });

  it("correctly merges an empty and nonempty iterator", () => {
    mergedIteratorHelper([] as number[], [1, 4, 5], mergeIteratorsIntoGenerator, [1, 4, 5]);
  });

  it("correctly merges two non-empty iterators with a different number of items", () => {
    mergedIteratorHelper([2], [1, 4, 5], mergeIteratorsIntoGenerator, [1, 2, 4, 5]);
  });

  it("correctly terminates after both iterators have been exhausted", () => {
    const iterator1 = [2, 6][Symbol.iterator]();
    const iterator2 = [1, 4, 5][Symbol.iterator]();
    const merged_generator = mergedGenerator(iterator1, iterator2);
    const output = arrayFromIterator(merged_generator, 5);
    const expected = [1, 2, 4, 5, 6];
    expect(output).toEqual(expected);
    for (let i = 0; i < 6; i++) {
      expect(merged_generator.next()).toEqual({ done: true, value: undefined });
    }
  });
});

describe("chainGenerator", () => {
  it("returns the correct sequence for array of one iterable", () => {
    expect(Array.from(chainGenerator([[1, 2, 3]]))).toEqual([1, 2, 3]);
  });

  it("returns the correct sequence for array of more than one iterable", () => {
    expect(
      Array.from(
        chainGenerator([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ])
      )
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("returns the correct sequence for array with empty iterables at the start", () => {
    expect(Array.from(chainGenerator([[], ["a", "b", "c"]]))).toEqual(["a", "b", "c"]);
  });

  it("returns the correct sequence for array with empty iterables in the middle", () => {
    expect(Array.from(chainGenerator([["a", "b", "c"], [], ["d", "e"]]))).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("returns the correct sequence for array with empty iterables at the end", () => {
    expect(Array.from(chainGenerator([["a", "b"], [], ["c", "d"], []]))).toEqual(["a", "b", "c", "d"]);
  });

  it("returns the correct sequence for array with all empty iterables", () => {
    expect(Array.from(chainGenerator([[], [], []]))).toEqual([]);
  });

  it("returns the correct sequence for array with non-array iterables", () => {
    const iterables = [[1, 2], [], [3, 4, 5], [6], []].map(makeIterable);
    expect(Array.from(chainGenerator(iterables))).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("generator terminates correctly", () => {
    const iterables = [[1, 2], [3]];
    const generator = chainGenerator(iterables);
    expect(Array.from(generator)).toEqual([1, 2, 3]);
    for (let i = 6; i > 0; i--) {
      expect(generator.next()).toEqual({ done: true, value: undefined });
    }
  });
});
