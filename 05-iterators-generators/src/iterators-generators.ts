import type { Business } from "../include/data";

export function* pairwise<T>(iterable: Iterable<T>): Generator<[T, T]> {
  const iterator = iterable[Symbol.iterator]();
  let r1 = iterator.next();
  if (r1.done) return;
  let r2 = iterator.next();

  while (!r2.done) {
    yield [r1.value, r2.value];
    r1 = r2;
    r2 = iterator.next();
  }
}

export function* cycle<T>(iterables: Iterable<T>[]): Generator<T> {
  const queue = iterables.map(x => x[Symbol.iterator]());
  while (queue.length > 0) {
    const iterator = queue.shift(); //removes iterator from queue
    if (!iterator) {
      throw new Error("queue is empty");
    }
    const next = iterator.next();
    if (!next.done) {
      //if done length--
      yield next.value;
      queue.push(iterator); //moves iterators to end of array
    }
  }
}

type FilterFunc = (business: Business) => boolean;

// Declare the BusinessQuery class here.
// Start the declaration with "export class" so that
// it can be imported from other modules.
export class BusinessQuery implements Iterable<Business> {
  constructor(private businesses: Iterable<Business>) {
    this.businesses = businesses;
  }

  [Symbol.iterator](): Iterator<Business> {
    return this.businesses[Symbol.iterator]();
  }
  private *filterGenerator(func: FilterFunc): Generator<Business> {
    //generator that filters businesses that satisfy func
    const iterator = this.businesses[Symbol.iterator]();
    let nextBusiness = iterator.next();
    while (!nextBusiness.done) {
      if (func(nextBusiness.value)) {
        yield nextBusiness.value;
      }
      nextBusiness = iterator.next();
    }
  }
  filter(func: FilterFunc): BusinessQuery {
    //returns a filtered businessquery of businesses where func is true
    return new BusinessQuery(this.filterGenerator(func));
  }
  exclude(func: FilterFunc): BusinessQuery {
    //returns a filtered businessquery of businesses where func is false
    return new BusinessQuery(this.filterGenerator(business => !func(business)));
  }
  private *sliceGenerator(start: number, end?: number): Generator<Business> {
    let index = 0;
    const iterator = this.businesses[Symbol.iterator]();
    let nextBusiness = iterator.next();
    while (!nextBusiness.done) {
      if (index >= start && (end === undefined || end > index)) {
        yield nextBusiness.value;
      }
      if (end !== undefined && index >= end - 1) {
        break;
      }
      index++;
      nextBusiness = iterator.next();
    }
  }
  slice(start: number, end?: number): BusinessQuery {
    if (!Number.isInteger(start) || (end !== undefined && !Number.isInteger(end))) {
      throw new SliceError("slice: start and end must be integers");
    }
    if (start < 0 || (end !== undefined && end < 0)) {
      throw new SliceError("slice: start and end must be non-negative");
    }
    if (end !== undefined && start > end) {
      throw new SliceError("slice: start must not be greater than end");
    }
    return new BusinessQuery(this.sliceGenerator(start, end));
  }
}

export class SliceError extends Error {}
