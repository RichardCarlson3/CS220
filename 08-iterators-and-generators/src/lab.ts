// In Class Exercises

/**
 * EXERCISE 1
 *
 * Implement a class MergedIterator that merges two sorted number iterators into one.
 * Each input iterator yields numbers in non-decreasing order.
 * The next() method should return the smallest available value between the two iterators;
 * in case of a tie, return the value from the first iterator.
 * When one iterator is exhausted, continue returning values from the other until both are finished.
 * All values from both iterators must eventually be returned.
 *
 */

export class MergedIterator implements Iterator<number> {
  // TODO: Implement this class.
  private _iter1: Iterator<number>;
  private _iter2: Iterator<number>;
  private _curr1: IteratorResult<number>;
  private _curr2: IteratorResult<number>;

  constructor(iterator1: Iterator<number>, iterator2: Iterator<number>) {
    // TODO: IMplement this constructor.
    this._iter1 = iterator1;
    this._iter2 = iterator2;
    this._curr1 = this._iter1.next();
    this._curr2 = this._iter2.next();
  }

  next(): IteratorResult<number> {
    // TODO: Implement this method.
    if (this._curr1.done && this._curr2.done) {
      return { done: true, value: undefined };
    } else if (this._curr1.done) {
      const result = this._curr2;
      this._curr2 = this._iter2.next();
      return result;
    } else if (this._curr2.done) {
      const result = this._curr1;
      this._curr1 = this._iter1.next();
      return result;
    } else if (this._curr1.value <= this._curr2.value) {
      return this._take_from_first();
    } else {
      return this._take_from_second();
    }
  }
  private _take_from_first() {
    const result = this._curr1;
    this._curr1 = this._iter1.next();
    return result;
  }
  private _take_from_second() {
    const result = this._curr2;
    this._curr2 = this._iter2.next();
    return result;
  }
}

/**
 * EXERCISE 2
 *
 * Implement a generator for the MergedIterator exercise. It should return values the same way as the MergedIterator class.
 *
 */

export function* mergedGenerator(iterator1: Iterator<number>, iterator2: Iterator<number>): Generator<number> {
  // TODO: implement this generator.
  let curr1 = iterator1.next();
  let curr2 = iterator2.next();
  while (!curr1.done || !curr2.done) {
    if (curr1.done) {
      yield curr2.value;
      curr2 = iterator2.next();
    } else if (curr2.done) {
      yield curr1.value;
      curr1 = iterator1.next();
    } else if (curr1.value <= curr2.value) {
      yield curr1.value;
      curr1 = iterator1.next();
    } else {
      yield curr2.value;
      curr2 = iterator2.next();
    }
  }
}

/**
 * EXERCISE 3
 *
 * Implement a generator (chainGenerator) for the ChainIterator problem. It should behave the same way as ChainIterator from last week's lab.
 * This means chainGenerator should take in an array of iterables. It should then yield items from the first iterable until it runs out.
 * Then, it should yield items from the next iterable in the given array, repeating this process until reaching the end of the array of
 * iterables. You may assume the given array is not empty.
 *
 */

export function* chainGenerator<T>(iterables: Iterable<T>[]): Generator<T> {
  // TODO: Implement this generator.
  for (const iterable of iterables) {
    for (const item of iterable) {
      yield item;
    }
  }

  // This is an example ok, please replace this with your solution.
  // As a reminder, this is how you can obtain an iterator for the first iterable.
}
