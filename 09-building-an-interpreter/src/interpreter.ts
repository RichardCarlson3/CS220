import { BinaryOperatorExpression, Expression, IfStatement, Statement, WhileStatement } from "../include/parser.js";

type RuntimeValue = number | boolean;

export function interpProgram(program: Statement[]): State {
  const globalScope = new State();
  // Add your implementation
  for (const statement of program) {
    interpStatement(globalScope, statement);
  }

  return globalScope;
}

export function interpStatement(state: State, stmt: Statement): void {
  switch (stmt.kind) {
    case "let":
      const value = interpExpression(state, stmt.expression);
      state.declare(stmt.name, value);
      return;
    case "assignment":
      const assignedVal = interpExpression(state, stmt.expression);
      state.set(stmt.name, assignedVal);
      return;
    case "print":
      const printVal = interpExpression(state, stmt.expression);
      console.log(printVal);
      break;
    case "if":
      interpIfStatement(state, stmt);
      return;
    case "while":
      interpWhileStatement(state, stmt);
      return;
    default:
      throw new Error("Unknown statement");
  }
}

function interpIfStatement(state: State, stmt: IfStatement) {
  const condVal = interpExpression(state, stmt.test);
  if (typeof condVal !== "boolean") {
    throw new Error("If condition must be a boolean");
  }
  const inner = new State(state);
  if (condVal) {
    interpBlock(inner, stmt.truePart);
  } else interpBlock(inner, stmt.falsePart);
}

function interpWhileStatement(state: State, stmt: WhileStatement) {
  let conditionValue = interpExpression(state, stmt.test);
  if (typeof conditionValue !== "boolean") throw new Error("While condition must be a boolean");

  while (conditionValue) {
    const inner = new State(state);
    interpBlock(inner, stmt.body);
    conditionValue = interpExpression(state, stmt.test);
    if (typeof conditionValue !== "boolean") throw new Error("While condition must be a boolean");
  }
}

// A "block" is a list of statements.
// Consider:
// 1. How this differs from interpProgram, which also takes in a list of statements
// 2. How you can use this function to reduce duplication in other statement implementations.
function interpBlock(state: State, statements: Statement[]) {
  for (const statement of statements) {
    interpStatement(state, statement);
  }
}

export function interpExpression(state: State, expr: Expression): RuntimeValue {
  switch (expr.kind) {
    case "number":
      return expr.value;
    case "boolean":
      return expr.value;
    case "variable":
      return state.get(expr.name);
    case "operator":
      return interpBinaryOperatorExpression(state, expr);
  }
  throw new Error("unknown expression kind");
}

function interpBinaryOperatorExpression(state: State, expr: BinaryOperatorExpression): RuntimeValue {
  const operator = expr.operator;
  if (operator === "&&") {
    const left = interpExpression(state, expr.left);
    if (typeof left !== "boolean") {
      throw new Error("&& requires boolean operands");
    }
    if (!left) {
      return false;
    }
    const right = interpExpression(state, expr.right);
    if (typeof right !== "boolean") {
      throw new Error("&& requires boolean operands");
    }
    return right;
  }
  if (operator === "||") {
    const left = interpExpression(state, expr.left);
    if (typeof left !== "boolean") {
      throw new Error("|| requires boolean operands");
    }
    if (left) {
      return true;
    }
    const right = interpExpression(state, expr.right);
    if (typeof right !== "boolean") {
      throw new Error("|| requires boolean operands");
    }
    return right;
  }
  const left = interpExpression(state, expr.left);
  const right = interpExpression(state, expr.right);
  switch (operator) {
    case "+":
    case "-":
    case "*":
    case "/":
      if (typeof left !== "number" || typeof right !== "number") {
        throw new Error(`${operator} requires number operands`);
      }
      if (operator === "/" && right === 0) {
        throw new Error("can't divide by zero");
      }
      return operator === "+"
        ? left + right
        : operator === "-"
        ? left - right
        : operator === "*"
        ? left * right
        : left / right;
    case "<":
    case ">":
      if (typeof left !== "number" || typeof right !== "number") {
        throw new Error(`${operator} requires number operands`);
      }
      return operator === "<" ? left < right : left > right;
    case "===":
      return left === right;
    default:
      throw new Error("unknown operator");
  }
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
  private parent: State | undefined;
  // Add any other necessary private member variables here

  constructor(parent: State | undefined = undefined) {
    this.parent = parent;
  }

  // Declares a variable with the given name and binds
  // the given value to it in the local scope.
  // Throws an error if the name already exists in the innermost scope.
  declare(name: string, value: RuntimeValue) {
    if (this.vars.has(name)) {
      throw new Error("variable " + name + " already declared.");
    }
    this.vars.set(name, value);
  }

  // Returns the value bound to the given name in the current environment.
  // The "environment" is the current collection of nested scopes.
  // First searches the innermost scope, then checks each parent scope
  // sequentially until the name is found.
  // Throws an error if the name cannot be found.
  get(name: string): RuntimeValue {
    const value = this.vars.get(name);
    if (value !== undefined) {
      return value;
    }
    if (this.parent !== undefined) {
      return this.parent.get(name);
    }
    throw new Error("variable " + name + " not declared.");
  }

  // Updates the value bound to the given name in the current environment.
  // First searches the innermost scope, then checks each parent scope
  // sequentially until the name is found.
  // Throws an error if the name cannot be found.
  set(name: string, value: RuntimeValue) {
    if (this.vars.has(name)) {
      this.vars.set(name, value);
      return;
    }
    if (this.parent !== undefined) {
      this.parent.set(name, value);
      return;
    }
    throw new Error("variable " + name + " not declared.");
  }

  // DO NOT MODIFY.
  // This is present to help us test your code.
  // If you remove it, this may cause tests to fail on the autograder.
  // Returns an object containing the variable bindings of the innermost scope of this State.
  asObject() {
    return Object.fromEntries(this.vars.entries());
  }
}
