import _assert from "assert";
import { Observable } from "../include/observable.js";
import {
  classifyObservables,
  obsStrCond,
  statefulObserver,
  classifyTypeObservables,
  mergeMax,
  merge,
  GreaterAvgObservable,
  SignChangeObservable,
  usingSignChange,
} from "./observables.js";

describe("classifyObservables", () => {
  // More tests go here.
  it("Correctly routes negative numbers", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o.update(-67);

    expect(negativeSpy).toHaveBeenCalledTimes(1);
    expect(negativeSpy).toHaveBeenCalledWith(-67);
    expect(oddSpy).not.toHaveBeenCalled();
    expect(restSpy).not.toHaveBeenCalled();
  });

  it("Correctly routes odd numbers", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o.update(21);

    expect(oddSpy).toHaveBeenCalledTimes(1);
    expect(oddSpy).toHaveBeenCalledWith(21);
    expect(negativeSpy).not.toHaveBeenCalled();
    expect(restSpy).not.toHaveBeenCalled();
  });

  it("Correctly routes rest numbers", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o.update(1738);

    expect(restSpy).toHaveBeenCalledTimes(1);
    expect(restSpy).toHaveBeenCalledWith(1738);
    expect(negativeSpy).not.toHaveBeenCalled();
    expect(oddSpy).not.toHaveBeenCalled();
  });
  it("Correctly routes decimals", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o.update(-3.14);
    o.update(2.72);

    expect(negativeSpy).toHaveBeenCalledTimes(1);
    expect(negativeSpy).toHaveBeenCalledWith(-3.14);
    expect(oddSpy).not.toHaveBeenCalled();
    expect(restSpy).toHaveBeenCalledTimes(1);
    expect(restSpy).toHaveBeenCalledWith(2.72);
  });
  it("Correctly routes multiple updates", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o.update(6);
    o.update(-1);
    o.update(67);
    o.update(21);
    o.update(1738);
    o.update(-67);

    expect(oddSpy).toHaveBeenCalledTimes(2);
    expect(oddSpy).toHaveBeenCalledWith(67);
    expect(oddSpy).toHaveBeenCalledWith(21);
    expect(negativeSpy).toHaveBeenCalledTimes(2);
    expect(negativeSpy).toHaveBeenCalledWith(-1);
    expect(negativeSpy).toHaveBeenCalledWith(-67);
    expect(restSpy).toHaveBeenCalledTimes(2);
    expect(restSpy).toHaveBeenCalledWith(6);
    expect(restSpy).toHaveBeenCalledWith(1738);
  });

  it("correctly does multiples oberables", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o1, o2]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o1.update(6);
    o2.update(-1);
    o1.update(67);
    o1.update(21);
    o2.update(1738);
    o2.update(-67);

    expect(oddSpy).toHaveBeenCalledTimes(2);
    expect(oddSpy).toHaveBeenCalledWith(67);
    expect(oddSpy).toHaveBeenCalledWith(21);
    expect(negativeSpy).toHaveBeenCalledTimes(2);
    expect(negativeSpy).toHaveBeenCalledWith(-1);
    expect(negativeSpy).toHaveBeenCalledWith(-67);
    expect(restSpy).toHaveBeenCalledTimes(2);
    expect(restSpy).toHaveBeenCalledWith(6);
    expect(restSpy).toHaveBeenCalledWith(1738);
  });
  it("Correctly handles no oberables", () => {
    const { negative, odd, rest } = classifyObservables([]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    expect(negativeSpy).not.toHaveBeenCalled();
    expect(oddSpy).not.toHaveBeenCalled();
    expect(restSpy).not.toHaveBeenCalled();
  });

  it("Correctly handles a empty obervable", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    expect(negativeSpy).not.toHaveBeenCalled();
    expect(oddSpy).not.toHaveBeenCalled();
    expect(restSpy).not.toHaveBeenCalled();
  });
  it("Correctly handles zero", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);

    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();
    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o.update(0);

    expect(restSpy).toHaveBeenCalledTimes(1);
    expect(restSpy).toHaveBeenCalledWith(0);
    expect(negativeSpy).not.toHaveBeenCalled();
    expect(oddSpy).not.toHaveBeenCalled();
  });

  it("Correctly handles types that change", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);
    o.update(-21);
    o.update(0);
    o.update(67);
    o.update(-67);
    o.update(1738);

    expect(negativeSpy).toHaveBeenCalledTimes(2);
    expect(negativeSpy).toHaveBeenCalledWith(-21);
    expect(negativeSpy).toHaveBeenCalledWith(-67);
    expect(oddSpy).toHaveBeenCalledTimes(1);
    expect(oddSpy).toHaveBeenCalledWith(67);
    expect(restSpy).toHaveBeenCalledTimes(2);
    expect(restSpy).toHaveBeenCalledWith(0);
    expect(restSpy).toHaveBeenCalledWith(1738);
  });
  it("Correctly handles updates with types that change and multiple obervables", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o1, o2]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o1.update(-5);
    o2.update(0);
    o1.update(67);
    o2.update(-67);
    o1.update(1738);

    expect(negativeSpy).toHaveBeenCalledTimes(2);
    expect(negativeSpy).toHaveBeenCalledWith(-5);
    expect(negativeSpy).toHaveBeenCalledWith(-67);
    expect(oddSpy).toHaveBeenCalledTimes(1);
    expect(oddSpy).toHaveBeenCalledWith(67);
    expect(restSpy).toHaveBeenCalledTimes(2);
    expect(restSpy).toHaveBeenCalledWith(0);
    expect(restSpy).toHaveBeenCalledWith(1738);
  });
  it("Correctly handles updates with types that change and multiple obervables and no subscribers", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<number>();
    classifyObservables([o1, o2]);

    o1.update(-5);
    o2.update(0);
    o1.update(67);
    o2.update(-67);
    o1.update(1738);

    expect(true).toBe(true);
  });
  it("Properly handles multiples zeros", () => {
    const o = new Observable<number>();
    const { negative, odd, rest } = classifyObservables([o]);
    const negativeSpy = jest.fn();
    const oddSpy = jest.fn();
    const restSpy = jest.fn();

    negative.subscribe(negativeSpy);
    odd.subscribe(oddSpy);
    rest.subscribe(restSpy);

    o.update(0);
    o.update(0);
    o.update(0);

    expect(restSpy).toHaveBeenCalledTimes(3);
    expect(restSpy).toHaveBeenCalledWith(0);
    expect(negativeSpy).not.toHaveBeenCalled();
    expect(oddSpy).not.toHaveBeenCalled();
  });
});

describe("obsStrCond", () => {
  // More tests go here.
  it("everything works when function is true", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello", s => s + "World"], s => s.endsWith("d"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("TestHelloWorld");
  });

  it("everything works when function is false", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello", s => s + "World"], s => s.endsWith("x"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Test");
  });
  it("works with multiple updates", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello", s => s + "World"], s => s.endsWith("d"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    o.update("Another");
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("TestHelloWorld");
    expect(spy).toHaveBeenCalledWith("AnotherHelloWorld");
  });
  it("works with multiple subscribers", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello", s => s + "World"], s => s.endsWith("d"), o);
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    output.subscribe(spy1);
    output.subscribe(spy2);

    o.update("Test");
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith("TestHelloWorld");
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith("TestHelloWorld");
  });
  it("Works with empty function array", () => {
    const o = new Observable<string>();
    const output = obsStrCond([], s => s.endsWith("d"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Test");
  });
  it("Works with function array with one function", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello"], s => s.endsWith("o"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("TestHello");
  });
  it("Works with no subscribers", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello", s => s + "World"], s => s.endsWith("d"), o);
    expect(output).toBeInstanceOf(Observable);
  });
  it("Works with alterating conditions", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello", s => s + "World"], s => s.length % 2 === 0, o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    o.update("Another");
    o.update("Last");
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith("TestHelloWorld");
    expect(spy).toHaveBeenCalledWith("Another");
    expect(spy).toHaveBeenCalledWith("LastHelloWorld");
  });
  it("Works with empty observable", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello", s => s + "World"], s => s.endsWith("d"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
  it("Works with empty function array and empty observable", () => {
    const o = new Observable<string>();
    const output = obsStrCond([], s => s.endsWith("d"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
  it("Works with empty function array and non-empty observable", () => {
    const o = new Observable<string>();
    const output = obsStrCond([], s => s.endsWith("d"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Test");
  });
  it("Works with function array with one function and empty observable", () => {
    const o = new Observable<string>();
    const output = obsStrCond([s => s + "Hello"], s => s.endsWith("o"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
  it("Throws if function in function array throws", () => {
    const o = new Observable<string>();
    const output = obsStrCond(
      [
        _s => {
          throw new Error("Test error");
        },
      ],
      s => s.endsWith("o"),
      o
    );
    const spy = jest.fn();
    output.subscribe(spy);

    expect(() => o.update("Test")).toThrow("Test error");
  });
  it("Updates unchanged if arrfuncs is empty and condition is false", () => {
    const o = new Observable<string>();
    const output = obsStrCond([], s => s.endsWith("d"), o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update("Test");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Test");
  });
});

describe("statefulObserver", () => {
  // More tests go here.
  it("Works with one update", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(1);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("Works with multiple updates", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(1);
    o.update(6);
    o.update(7);
    o.update(67);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(6);
  });
  it("Works with no updates", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
  it("Works with updates with zero", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(5);
    o.update(0);
    o.update(10);
    o.update(20);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(0);
    expect(spy).toHaveBeenCalledWith(20);
  });
  it("Works with updates with negative numbers", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(-21);
    o.update(-42);
    o.update(-67);
    o.update(-134);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(-42);
    expect(spy).toHaveBeenCalledWith(-134);
  });
  it("Works with updates with alternating multiples", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(2);
    o.update(4);
    o.update(8);
    o.update(3);
    o.update(6);
    o.update(12);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith(4);
    expect(spy).toHaveBeenCalledWith(8);
    expect(spy).toHaveBeenCalledWith(6);
    expect(spy).toHaveBeenCalledWith(12);
  });
  it("Works with updates with non-multiples", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(2);
    o.update(3);
    o.update(5);
    o.update(7);
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it("Works when first update is zero", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(0);
    o.update(5);
    o.update(10);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(10);
  });
  it("Works with updates with multiples of one", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(1);
    o.update(1);
    o.update(1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(1);
  });
  it("Works with updates with multiples of zero", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(0);
    o.update(0);
    o.update(0);
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it("Works with updates with multiples of negative one", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(-1);
    o.update(-1);
    o.update(-1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(-1);
    expect(spy).toHaveBeenCalledWith(-1);
  });
  it("Works with decimal multiples", () => {
    const o = new Observable<number>();
    const output = statefulObserver(o);
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(1.5);
    o.update(3.0);
    o.update(4.5);
    o.update(5.0);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(3.0);
  });
});

describe("classifyTypeObservables", () => {
  it("Classifies a number observable", () => {
    const o = new Observable<number>();

    const { number } = classifyTypeObservables([o]);
    const spy = jest.fn();
    number.subscribe(spy);

    o.update(1);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  // More tests go here.
  it("Correctly routes strings", () => {
    const o = new Observable<string>();
    const { string, number, boolean } = classifyTypeObservables([o]);
    const stringSpy = jest.fn();
    const numberSpy = jest.fn();
    const booleanSpy = jest.fn();

    string.subscribe(stringSpy);
    number.subscribe(numberSpy);
    boolean.subscribe(booleanSpy);

    o.update("hello");

    expect(stringSpy).toHaveBeenCalledTimes(1);
    expect(stringSpy).toHaveBeenCalledWith("hello");
    expect(numberSpy).not.toHaveBeenCalled();
    expect(booleanSpy).not.toHaveBeenCalled();
  });
  it("Correctly routes numbers", () => {
    const o = new Observable<number>();
    const { string, number, boolean } = classifyTypeObservables([o]);
    const stringSpy = jest.fn();
    const numberSpy = jest.fn();
    const booleanSpy = jest.fn();

    string.subscribe(stringSpy);
    number.subscribe(numberSpy);
    boolean.subscribe(booleanSpy);

    o.update(67);

    expect(numberSpy).toHaveBeenCalledTimes(1);
    expect(numberSpy).toHaveBeenCalledWith(67);
    expect(stringSpy).not.toHaveBeenCalled();
    expect(booleanSpy).not.toHaveBeenCalled();
  });
  it("Correctly routes booleans", () => {
    const o = new Observable<boolean>();
    const { string, number, boolean } = classifyTypeObservables([o]);
    const stringSpy = jest.fn();
    const numberSpy = jest.fn();
    const booleanSpy = jest.fn();

    string.subscribe(stringSpy);
    number.subscribe(numberSpy);
    boolean.subscribe(booleanSpy);

    o.update(true);
    o.update(false);

    expect(booleanSpy).toHaveBeenCalledTimes(2);
    expect(booleanSpy).toHaveBeenCalledWith(true);
    expect(booleanSpy).toHaveBeenCalledWith(false);
    expect(numberSpy).not.toHaveBeenCalled();
    expect(stringSpy).not.toHaveBeenCalled();
  });

  it("Correctly routes multiple updates", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<string>();
    const o3 = new Observable<boolean>();
    const { string, number, boolean } = classifyTypeObservables([o1, o2, o3]);
    const stringSpy = jest.fn();
    const numberSpy = jest.fn();
    const booleanSpy = jest.fn();

    string.subscribe(stringSpy);
    number.subscribe(numberSpy);
    boolean.subscribe(booleanSpy);

    o3.update(true);
    o1.update(67);
    o1.update(-67);
    o2.update("hello");
    o3.update(false);
    o2.update("world");

    expect(booleanSpy).toHaveBeenCalledTimes(2);
    expect(booleanSpy).toHaveBeenCalledWith(true);
    expect(booleanSpy).toHaveBeenCalledWith(false);
    expect(stringSpy).toHaveBeenCalledTimes(2);
    expect(stringSpy).toHaveBeenCalledWith("hello");
    expect(stringSpy).toHaveBeenCalledWith("world");
    expect(numberSpy).toHaveBeenCalledTimes(2);
    expect(numberSpy).toHaveBeenCalledWith(67);
    expect(numberSpy).toHaveBeenCalledWith(-67);
  });
  it("Works with no oberables", () => {
    const { string, number, boolean } = classifyTypeObservables([]);
    const stringSpy = jest.fn();
    const numberSpy = jest.fn();
    const booleanSpy = jest.fn();

    string.subscribe(stringSpy);
    number.subscribe(numberSpy);
    boolean.subscribe(booleanSpy);

    expect(stringSpy).not.toHaveBeenCalled();
    expect(numberSpy).not.toHaveBeenCalled();
    expect(booleanSpy).not.toHaveBeenCalled();
  });

  it("Works with empty obervables", () => {
    const o1 = new Observable<string>();
    const o2 = new Observable<number>();
    const o3 = new Observable<boolean>();
    const { string, number, boolean } = classifyTypeObservables([o1, o2, o3]);
    const stringSpy = jest.fn();
    const numberSpy = jest.fn();
    const booleanSpy = jest.fn();

    string.subscribe(stringSpy);
    number.subscribe(numberSpy);
    boolean.subscribe(booleanSpy);

    expect(stringSpy).not.toHaveBeenCalled();
    expect(numberSpy).not.toHaveBeenCalled();
    expect(booleanSpy).not.toHaveBeenCalled();
  });
});

describe("mergeMax", () => {
  // More tests go here.
  it("Works with two observables and outputs the max value", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<number>();
    const output = mergeMax(o1, o2);
    const spy = jest.fn();
    output.subscribe(spy);

    o1.update(1);
    o2.update(2);
    o1.update(6);
    o2.update(4);
    o1.update(1738);
    o2.update(67);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith({ obs: 1, v: 1 });
    expect(spy).toHaveBeenCalledWith({ obs: 2, v: 2 });
    expect(spy).toHaveBeenCalledWith({ obs: 1, v: 6 });
    expect(spy).toHaveBeenCalledWith({ obs: 1, v: 1738 });
  });
  it("Works with no updates", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<number>();
    const output = mergeMax(o1, o2);
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
  it("Works with updates with negative numbers", () => {
    const o1 = new Observable<number>();
    const o2 = new Observable<number>();
    const output = mergeMax(o1, o2);
    const spy = jest.fn();
    output.subscribe(spy);

    o1.update(-1738);
    o2.update(-67);
    o1.update(-3);
    o2.update(500);
    o1.update(-8);
    o2.update(-700);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith({ obs: 1, v: -1738 });
    expect(spy).toHaveBeenCalledWith({ obs: 2, v: -67 });
    expect(spy).toHaveBeenCalledWith({ obs: 1, v: -3 });
    expect(spy).toHaveBeenCalledWith({ obs: 2, v: 500 });
  });
});

describe("merge", () => {
  // More tests go here.
  it("Works with two observables and outputs all values", () => {
    const o1 = new Observable<string>();
    const o2 = new Observable<string>();
    const output = merge(o1, o2);
    const spy = jest.fn();
    output.subscribe(spy);

    o1.update("Hello");
    o2.update("World");
    o1.update("HelloWorld");
    o2.update("Justin Herbert");

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith("Hello");
    expect(spy).toHaveBeenCalledWith("World");
    expect(spy).toHaveBeenCalledWith("HelloWorld");
    expect(spy).toHaveBeenCalledWith("Justin Herbert");
  });
  it("Works with no updates", () => {
    const o1 = new Observable<string>();
    const o2 = new Observable<string>();
    const output = merge(o1, o2);
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
});

describe("GreaterAvgObservable", () => {
  // More tests go here.
  it("Works with positive numbers", () => {
    const o = new GreaterAvgObservable();
    const output = o.greaterAvg();
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(67);
    o.update(21);
    o.update(1738);
    o.update(1);
    o.update(2);
    o.update(5);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(1738);
    expect(spy).toHaveBeenCalledWith(5);
  });
  it("Works with no updates", () => {
    const o = new GreaterAvgObservable();
    const output = o.greaterAvg();
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
});

describe("SignChangeObservable", () => {
  // More tests go here.
  it("Works with values when the sign changes", () => {
    const o = new SignChangeObservable();
    const output = o.signChange();
    const spy = jest.fn();
    output.subscribe(spy);

    o.update(3);
    o.update(4);
    o.update(-1);
    o.update(67);
    o.update(0);
    o.update(-1738);

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith(3);
    expect(spy).toHaveBeenCalledWith(-1);
    expect(spy).toHaveBeenCalledWith(67);
    expect(spy).toHaveBeenCalledWith(-1738);
  });
  it("Works with no updates", () => {
    const o = new SignChangeObservable();
    const output = o.signChange();
    const spy = jest.fn();
    output.subscribe(spy);

    expect(spy).not.toHaveBeenCalled();
  });
});

describe("usingSignChange", () => {
  // More tests go here.
  it("Works with values when the sign changes", () => {
    const spy = jest.fn();
    usingSignChange([1, -1, 2, -2, -3, 4], spy);

    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(-1);
    expect(spy).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalledWith(-2);
    expect(spy).toHaveBeenCalledWith(4);
  });
  it("Works with no updates", () => {
    const spy = jest.fn();
    usingSignChange([], spy);

    expect(spy).not.toHaveBeenCalled();
  });
});
