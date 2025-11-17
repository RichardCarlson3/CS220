import { Observable, Observer } from "../include/observable.js";

// Extra Credit Functions

export function classifyObservables(obsArr: Observable<number>[]): {
  negative: Observable<number>;
  odd: Observable<number>;
  rest: Observable<number>;
} {
  // TODO: Implement this function
  const negative = new Observable<number>();
  const odd = new Observable<number>();
  const rest = new Observable<number>();

  obsArr.forEach(obs => {
    obs.subscribe(x => {
      if (x < 0) negative.update(x);
      else if (x % 2 === 1) odd.update(x);
      else rest.update(x);
    });
  });
  return { negative, odd, rest };
}

export function obsStrCond(
  funcArr: ((arg1: string) => string)[],
  f: (arg1: string) => boolean,
  o: Observable<string>
): Observable<string> {
  // TODO: Implement this function
  const output = new Observable<string>();
  o.subscribe(str => {
    let transformed = str;
    for (const fn of funcArr) {
      transformed = fn(transformed);
    }

    if (!f(transformed)) output.update(str);
    else output.update(transformed);
  });

  return output;
}

export function statefulObserver(o: Observable<number>): Observable<number> {
  // TODO: Implement this function
  const output = new Observable<number>();
  let prev: number | null = null;
  o.subscribe(curr => {
    if (prev !== null && prev !== 0 && curr % prev === 0) {
      output.update(curr);
    }
    prev = curr;
  });

  return output;
}

// Optional Additional Practice

export function classifyTypeObservables(obsArr: (Observable<string> | Observable<number> | Observable<boolean>)[]): {
  string: Observable<string>;
  number: Observable<number>;
  boolean: Observable<boolean>;
} {
  const string = new Observable<string>();
  const number = new Observable<number>();
  const boolean = new Observable<boolean>();

  obsArr.forEach(obs => {
    obs.subscribe(x => {
      if (typeof x === "string") string.update(x);
      else if (typeof x === "number") number.update(x);
      else boolean.update(x);
    });
  });
  // TODO: Implement this function
  return { string, number, boolean };
}

export function mergeMax(o1: Observable<number>, o2: Observable<number>): Observable<{ obs: number; v: number }> {
  // TODO: Implement this function
  let largest = -Infinity;
  const output = new Observable<{ obs: number; v: number }>();
  const f = (id: number) => (v: number) => {
    if (v >= largest) {
      output.update({ obs: id, v });
      largest = v;
    }
  };
  o1.subscribe(f(1));
  o2.subscribe(f(2));
  return output;
}

export function merge(o1: Observable<string>, o2: Observable<string>): Observable<string> {
  // TODO: Implement this function
  const output = new Observable<string>();
  o1.subscribe(x => output.update(x));
  o2.subscribe(x => output.update(x));

  return output;
}

export class GreaterAvgObservable extends Observable<number> {
  constructor() {
    super();
  }

  greaterAvg(): Observable<number> {
    // TODO: Implement this method
    let prev1 = Infinity;
    let prev2 = Infinity;
    const output = new Observable<number>();
    this.subscribe(x => {
      if (((prev1 + prev2) * 3) / 4 <= x) output.update(x);
      prev1 = prev2;
      prev2 = x;
    });
    return output;
  }
}

export class SignChangeObservable extends Observable<number> {
  constructor() {
    super();
  }

  signChange(): Observable<number> {
    // TODO: Implement this method
    const output = new Observable<number>();
    let previous = 0;
    this.subscribe(x => {
      if (x !== 0 && previous * x <= 0) output.update(x);
      previous = x;
    });
    return output;
  }
}

/**
 * This function shows how the class you created above could be used.
 * @param numArr Array of numbers
 * @param f Observer function
 */
export function usingSignChange(numArr: number[], f: Observer<number>) {
  // TODO: Implement this function
  const obs = new SignChangeObservable();
  const scObs = obs.signChange();
  scObs.subscribe(f);
  numArr.forEach(x => obs.update(x));
}
