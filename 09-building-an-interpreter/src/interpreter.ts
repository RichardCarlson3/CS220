import { BinaryOperatorExpression, Expression, IfStatement, Statement, WhileStatement } from "../include/parser.js";

type RuntimeValue = number | boolean;

export function interpProgram(program: Statement[]): State {
  const globalScope = new State();
  // Add your implementation
  return globalScope;
}

export function interpStatement(state: State, stmt: Statement): void {
}

function interpIfStatement(state: State, stmt: IfStatement) {
}

function interpWhileStatement(state: State, stmt: WhileStatement) {
}

// A "block" is a list of statements. 
// Consider:
// 1. How this differs from interpProgram, which also takes in a list of statements
// 2. How you can use this function to reduce duplication in other statement implementations.
function interpBlock(state: State, statements: Statement[]) {
}

export function interpExpression(state: State, expr: Expression): RuntimeValue {
}

// Add helper functions for binary operations here.
// Consider:
// - Which operators share identical steps?
//   These are excellent candidates for a Map of operators to functions.
// - Which operators have very similar but not fully identical steps?
//   With these, you must consider the nuanced line between when something
//   is truly duplicated code and when it just happens to have similarities.


export class State {
  // Use this Map to store variable bindings.
  private vars = new Map<string, RuntimeValue>();
  // Add any other necessary private member variables here

  constructor(parent: State | undefined = undefined) {
  }

  // Declares a variable with the given name and binds
  // the given value to it in the local scope.
  // Throws an error if the name already exists in the innermost scope.
  declare(name: string, value: RuntimeValue) {
  }

  // Returns the value bound to the given name in the current environment.
  // The "environment" is the current collection of nested scopes.
  // First searches the innermost scope, then checks each parent scope
  // sequentially until the name is found.
  // Throws an error if the name cannot be found.
  get(name: string): RuntimeValue {
  }

  // Updates the value bound to the given name in the current environment.
  // First searches the innermost scope, then checks each parent scope
  // sequentially until the name is found.
  // Throws an error if the name cannot be found.
  set(name: string, value: RuntimeValue) {
  }

  // DO NOT MODIFY.
  // This is present to help us test your code. 
  // If you remove it, this may cause tests to fail on the autograder.
  // Returns an object containing the variable bindings of the innermost scope of this State.
  asObject() {
    return Object.fromEntries(this.vars.entries());
  }
}
