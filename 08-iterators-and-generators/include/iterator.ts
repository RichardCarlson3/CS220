// The following definitions are built into TypeScript. They have been written here for your reference.
// _EXAMPLE was added to the interface names so as not to clash with the built-in definitions.
// The actual interface names of each would have _EXAMPLE removed. 

interface Iterator_EXAMPLE<ValueType> {
  // A method (a.k.a. "member function") that yields one element and advances the iterator to the next position.
  // The IteratorResult interface is defined below.
  next(): IteratorResult<ValueType>;
  // Note: In JS/TS, the iterator interface technically has two other optional methods,
  // but they are not very commonly used. You can read more in the documentation:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol
}

interface IteratorResult_EXAMPLE<ValueType> {
  // `done` is true when the iterator has reached the end, false otherwise.
  done: boolean;
  // The value of the current iteration.
  // The question mark (`?`) means that the type of `value` is `ValueType | undefined`.
  // In this context, `value` may be undefined when `done` is true.
  value?: ValueType;
}

interface Iterable_EXAMPLE<ValueType> {
  [Symbol.iterator](): Iterator<ValueType>;
}

interface IterableIterator_EXAMPLE<ValueType> {
  // An Iterator that is also an Iterable. Same as doing 'implements Iterable<ValueType>, Iterator<ValueType>'

  // Same as an Iterator
  next(): IteratorResult<ValueType>;

  // Same as an Iterable
  [Symbol.iterator](): Iterator<ValueType>;
}