import assert from "assert";
import { parseExpression, parseProgram } from "../include/parser.js";
import { State, interpExpression, interpProgram, interpStatement } from "./interpreter.js";

type RuntimeValue = number | boolean;

function expectStateToBe(program: string, state: {[key: string]: RuntimeValue}) {
  expect(interpProgram(parseProgram(program)).asObject()).toEqual(state);
}

describe("interpExpression", () => {
  // Tests for interpExpression go here
});

describe("interpStatement", () => {
  // Tests for interpStatement go here.
});

describe("interpProgram", () => {
  // Tests for interpProgram go here
});
