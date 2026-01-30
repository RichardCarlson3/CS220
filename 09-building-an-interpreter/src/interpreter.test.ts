import _assert from "assert";
import { parseExpression, parseProgram } from "../include/parser.js";
import { State, interpExpression, interpProgram, interpStatement } from "./interpreter.js";

type RuntimeValue = number | boolean;

function expectStateToBe(program: string, state: { [key: string]: RuntimeValue }) {
  expect(interpProgram(parseProgram(program)).asObject()).toEqual(state);
}

describe("interpExpression", () => {
  // Tests for interpExpression go here
  it("evaluates multiplication with a variable", () => {
    // create State with no parent State (global State)
    const state = new State();
    state.declare("x", 10);
    const r = interpExpression(state, parseExpression("x * 2"));

    expect(r).toBe(20);
  });
  it("evaluates and works with addition, subtraction, and division", () => {
    const state = new State();
    state.declare("x", 67);
    state.declare("y", 420);
    state.declare("z", 24);
    const r1 = interpExpression(state, parseExpression("x + y"));
    const r2 = interpExpression(state, parseExpression("x - y"));
    const r3 = interpExpression(state, parseExpression("z / 4"));
    expect(r1).toBe(487);
    expect(r2).toBe(-353);
    expect(r3).toBe(6);
  });
  it("evaluates hard expressions", () => {
    const state = new State();
    state.declare("x", 16);
    state.declare("y", 2);
    const z = interpExpression(state, parseExpression("x * (y + 8) - 20 / (1 + 3)"));
    expect(z).toBe(155);
  });
  it("properly evaluates boolean expressions", () => {
    const state = new State();
    state.declare("x", 10);
    state.declare("y", 21);
    const z1 = interpExpression(state, parseExpression("x < y"));
    const z2 = interpExpression(state, parseExpression("x > y"));
    const z3 = interpExpression(state, parseExpression("x === 10"));
    expect(z1).toBe(true);
    expect(z2).toBe(false);
    expect(z3).toBe(true);
  });
  it("evaluates nested boolean expressions", () => {
    const state = new State();
    state.declare("a", 1);
    state.declare("b", 2);
    state.declare("c", 3);
    const r = interpExpression(state, parseExpression("(a < b) === (b < c)"));
    expect(r).toBe(true);
  });
  it("evaluates && and || operators", () => {
    const state = new State();
    state.declare("x", 21);
    state.declare("y", 67);
    const r1 = interpExpression(state, parseExpression("(x < y) && (y === 67)"));
    const r2 = interpExpression(state, parseExpression("(x > y) || (y === 1738)"));
    const r3 = interpExpression(state, parseExpression("(y === 21) || (x > y)"));

    expect(r3).toBe(false);
    expect(r1).toBe(true);
    expect(r2).toBe(false);
  });
  it("throws error for division by zero", () => {
    const state = new State();
    state.declare("x", 10);
    expect(() => {
      interpExpression(state, parseExpression("x / 0"));
    }).toThrow("can't divide by zero");
  });
  it("throws error for a undefined variable", () => {
    const state = new State();
    expect(() => {
      interpExpression(state, parseExpression("y + 67"));
    }).toThrow("variable y not declared.");
  });
  it("throws error for type mismatches", () => {
    const state = new State();
    state.declare("x", 21);
    state.declare("y", true);
    expect(() => {
      interpExpression(state, parseExpression("x + y"));
    }).toThrow("+ requires number operands");
    expect(() => {
      interpExpression(state, parseExpression("x && y"));
    }).toThrow("&& requires boolean operands");
  });
});

describe("interpStatement", () => {
  // Tests for interpStatement go here.
  it("throws error if assigning undeclared variable", () => {
    const state = new State();
    expect(() => {
      interpStatement(state, parseProgram("y=5;")[0]);
    }).toThrow("variable y not declared.");
  });
  it("throws error for duplicate variable declaration", () => {
    const state = new State();
    interpStatement(state, parseProgram("let x=5;")[0]);

    expect(() => interpStatement(state, parseProgram("let x=10;")[0])).toThrow("variable x already declared.");
  });

  it("evaluates if-else with true condition (scoped)", () => {
    const state = new State();
    interpStatement(state, parseProgram("if (true) { let x=1; } else { let x=0; }")[0]);

    expect(state.asObject()).toEqual({});
  });

  it("throws error if if-test is not boolean", () => {
    const state = new State();

    expect(() => interpStatement(state, parseProgram("if (1) {print(1);} else {print(2);}")[0])).toThrow(
      "If condition must be a boolean"
    );
  });

  it("executes print statement", () => {
    const state = new State();
    state.declare("x", 1);

    const logSpy = jest.spyOn(console, "log");

    interpStatement(state, parseProgram("print(x);")[0]);

    expect(logSpy.mock.calls).toEqual([[1]]);
    logSpy.mockRestore();
  });

  it("throws error for invalid variable in print", () => {
    const state = new State();

    expect(() => interpStatement(state, parseProgram("print(x);")[0])).toThrow("variable x not declared.");
  });

  it("else branch updates outer variable", () => {
    const state = new State();
    state.declare("x", 1);

    interpStatement(state, parseProgram("if (false) {} else { x=99; }")[0]);

    expect(state.asObject()).toEqual({ x: 99 });
  });
});

describe("interpProgram", () => {
  // Tests for interpProgram go here

  it("handles declarations and reassignment", () => {
    const state = interpProgram(parseProgram(`let x = 67; x = 21;`));
    expect(state.get("x")).toBe(21);
  });
  it("handles arithmetic and variable usage", () => {
    const state = `let a = 4; let b = a + 5; let c=b * 3;`;
    expectStateToBe(state, { a: 4, b: 9, c: 27 });
  });

  it("handles a while loop", () => {
    const state = `let x = 0; while (x < 3) {x = x + 1;}`;
    expectStateToBe(state, { x: 3 });
  });

  it("executes a block with multiple statements", () => {
    const state = `
    let x = 67;    
    if (true) {
        x = x + 2;
        x = x * 2;
      } else {
      }`;
    expectStateToBe(state, { x: 138 });
  });

  it("inner block does not effevt x", () => {
    const state = `
      let x = 67;
      if (true) {
        let x = 2;
      } else {
      }`;
    expectStateToBe(state, { x: 67 });
  });

  it("inner loop changes y not x", () => {
    const state = `
      let x = 1;
      let y = 21;
      if (true) {
        let x = 2;
        y = x;
      } else {
      }`;
    expectStateToBe(state, { x: 1, y: 2 });
  });
});
