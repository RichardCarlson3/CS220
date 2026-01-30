import { List, node, empty } from "../include/lists.js";

export function insertOrdered(lst: List<number>, el: number): List<number> {
  if (lst.isEmpty()) return node(el, empty());
  else if (lst.head() >= el) return node(el, lst);
  else return node(lst.head(), insertOrdered(lst.tail(), el));
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  let curSize = 0;
  return lst.reduce((acc, e) => {
    curSize++;
    return curSize % n === 0 ? node(e, acc) : acc;
  }, empty());
}
function reverse<T>(lst: List<T>): List<T> {
  return lst.reduce((acc, e) => node(e, acc), empty());
}
export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  let curSize = 0;
  const newList = lst.filter(cond);
  return reverse(
    newList.reduce((acc, e) => {
      curSize++;
      if (curSize % n === 0 && cond(e)) {
        return node(e, acc);
      } else return acc;
    }, empty())
  );
}

export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  let newList: List<number> = empty();
  if (lst.isEmpty()) return newList;
  else if (lst.tail().isEmpty()) return newList;
  else if (lst.tail().tail().isEmpty()) return newList;
  let lprev = lst.head();
  let lnext = lst.tail().tail();
  let lcurrList = lst.tail();
  while (!lcurrList.tail().isEmpty()) {
    const lcurr = lcurrList.head();
    lnext = lcurrList.tail();
    if (allSatisfy(lprev, lcurr, lnext.head())) {
      newList = node(lcurr, newList);
    }
    lprev = lcurr;
    lcurrList = lcurrList.tail();
  }
  return reverse(newList);
}

export function keepLocalMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev < curr && curr > next);
}

export function keepLocalMinima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev > curr && curr < next);
}

export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => (prev > curr && curr < next) || (prev < curr && curr > next));
}
function products(lst: List<number>, func: (n: number) => boolean): List<number> {
  let counter = 1;
  return reverse(
    lst.reduce((acc, e) => {
      if (func(e)) {
        counter = counter * e;
        return node(counter, acc);
      } else {
        counter = 1;
        return acc;
      }
    }, empty())
  );
}
export function nonNegativeProducts(lst: List<number>): List<number> {
  return products(lst, n => n >= 0);
}

export function negativeProducts(lst: List<number>): List<number> {
  return products(lst, n => n < 0);
}
function deleteHelper<T>(lst: List<T>, el: T): List<T> {
  let deleted = false;
  return lst.reduce((acc, e) => {
    if (!deleted && el === e) {
      deleted = true;
      return acc;
    } else {
      return node(e, acc);
    }
  }, empty());
}
export function deleteFirst<T>(lst: List<T>, el: T): List<T> {
  return reverse(deleteHelper(lst, el));
}

export function deleteLast<T>(lst: List<T>, el: T): List<T> {
  const reversed: List<T> = reverse(lst);
  return deleteHelper(reversed, el);
}

export function squashList(lst: List<number | List<number>>): List<number> {
  return reverse(
    lst.reduce((acc, e) => {
      if (typeof e === "number") {
        return node(e, acc);
      } else {
        const sum = e.reduce((prev, value) => {
          return prev + value;
        }, 0);
        return node(sum, acc);
      }
    }, empty())
  );
}
