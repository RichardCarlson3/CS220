import assert from "assert";
import { MouseObserver, MouseEvents, MouseEventLogger, MouseEventArea, Coordinate } from "./lab.js";

function equal_coordinates(coord1: Coordinate, coord2: Coordinate): boolean {
  return coord1.x === coord2.x && coord1.y === coord2.y;
}

class SpySubscriber implements MouseObserver {
  private _coordinate_count = 0;
  private _drag_count = 0;
  private _coordinates: Coordinate[] = [];
  private _mouse_drags: [Coordinate, Coordinate][] = [];

  constructor(public screen: number) {}

  update_coordinate(coord: Coordinate): void {
    this._coordinate_count += 1;
    this._coordinates.push(coord);
  }

  update_drag(start: Coordinate, end: Coordinate): void {
    this._drag_count += 1;
    this._mouse_drags.push([start, end]);
  }

  compare_coordinates(expected_count: number, expected_coords: Coordinate[]): void {
    assert(this._coordinate_count === expected_count, "update_coordinate should be called expected number of times");
    assert(expected_coords.length === this._coordinates.length, "should have same number of coordinates received");
    for (let i = 0; i < expected_coords.length; i++) {
      assert(equal_coordinates(this._coordinates[i], expected_coords[i]), "should have received same coordinates");
    }
  }

  compare_mouse_drags(expected_count: number, expected_drags: [Coordinate, Coordinate][]): void {
    assert(this._drag_count === expected_count, "update_drag should be called expected number of times");
    assert(expected_drags.length === this._mouse_drags.length, "should have same number of mouse drags received");
    for (let i = 0; i < expected_drags.length; i++) {
      assert(
        equal_coordinates(this._mouse_drags[i][0], expected_drags[i][0]),
        "should have received same mouse drags (same starts)"
      );
      assert(
        equal_coordinates(this._mouse_drags[i][1], expected_drags[i][1]),
        "should have received same mouse drags (same ends)"
      );
    }
  }
}

describe("MouseEvents", () => {
  it("broadcasts mouse clicks to subscribers in specific screen", () => {
    const mouse_events = new MouseEvents(1);
    const spy1 = new SpySubscriber(0);
    const spy2 = new SpySubscriber(0);
    mouse_events.subscribe(spy1);
    mouse_events.mouse_click(0, { x: 5, y: 10 });
    spy1.compare_coordinates(1, [{ x: 5, y: 10 }]);
    mouse_events.subscribe(spy2);
    mouse_events.mouse_click(0, { x: 2, y: 3 });
    spy1.compare_coordinates(2, [
      { x: 5, y: 10 },
      { x: 2, y: 3 },
    ]);
    spy2.compare_coordinates(1, [{ x: 2, y: 3 }]);
    spy1.compare_mouse_drags(0, []);
    spy2.compare_mouse_drags(0, []);
  });

  it("broadcasts mouse drags to subscribers in specific screen", () => {
    const mouse_events = new MouseEvents(1);
    const spy1 = new SpySubscriber(0);
    const spy2 = new SpySubscriber(0);
    mouse_events.subscribe(spy1);
    mouse_events.mouse_drag(0, { x: 5, y: 10 }, { x: 2, y: 3 });
    spy1.compare_mouse_drags(1, [
      [
        { x: 5, y: 10 },
        { x: 2, y: 3 },
      ],
    ]);
    mouse_events.subscribe(spy2);
    mouse_events.mouse_drag(0, { x: 1, y: 1 }, { x: 10, y: 9 });
    spy1.compare_mouse_drags(2, [
      [
        { x: 5, y: 10 },
        { x: 2, y: 3 },
      ],
      [
        { x: 1, y: 1 },
        { x: 10, y: 9 },
      ],
    ]);
    spy2.compare_mouse_drags(1, [
      [
        { x: 1, y: 1 },
        { x: 10, y: 9 },
      ],
    ]);
    spy1.compare_coordinates(0, []);
    spy2.compare_coordinates(0, []);
  });

  it("only broadcasts mouse events to subscribers of the same screen", () => {
    const mouse_events = new MouseEvents(2);
    const spy1 = new SpySubscriber(1);
    const spy2 = new SpySubscriber(0);
    mouse_events.subscribe(spy1);
    mouse_events.subscribe(spy2);
    mouse_events.mouse_drag(1, { x: 5, y: 10 }, { x: 2, y: 3 });
    mouse_events.mouse_click(0, { x: 3, y: 4 });
    spy1.compare_coordinates(0, []);
    spy1.compare_mouse_drags(1, [
      [
        { x: 5, y: 10 },
        { x: 2, y: 3 },
      ],
    ]);
    spy2.compare_coordinates(1, [{ x: 3, y: 4 }]);
    spy2.compare_mouse_drags(0, []);
  });

  it("does not broadcast mouse events to subscribers with invalid screens", () => {
    const mouse_events = new MouseEvents(2);
    const spy1 = new SpySubscriber(-1);
    const spy2 = new SpySubscriber(2);
    mouse_events.subscribe(spy1);
    mouse_events.subscribe(spy2);
    mouse_events.mouse_drag(1, { x: 5, y: 10 }, { x: 2, y: 3 });
    mouse_events.mouse_click(0, { x: 3, y: 4 });
    spy1.compare_coordinates(0, []);
    spy1.compare_mouse_drags(0, []);
    spy2.compare_coordinates(0, []);
    spy2.compare_mouse_drags(0, []);
  });

  it("stops broadcasting to subscribers who unsubscribed", () => {
    const mouse_events = new MouseEvents(1);
    const spy1 = new SpySubscriber(0);
    const spy2 = new SpySubscriber(0);
    mouse_events.subscribe(spy1);
    mouse_events.subscribe(spy2);
    mouse_events.mouse_click(0, { x: 3, y: 4 });
    spy1.compare_coordinates(1, [{ x: 3, y: 4 }]);
    spy2.compare_coordinates(1, [{ x: 3, y: 4 }]);
    mouse_events.unsubscribe(spy1);
    mouse_events.mouse_click(0, { x: 4, y: 5 });
    spy1.compare_coordinates(1, [{ x: 3, y: 4 }]);
    spy2.compare_coordinates(2, [
      { x: 3, y: 4 },
      { x: 4, y: 5 },
    ]);
  });

  it("correctly handles redundant subscribing or unsubscribing", () => {
    const mouse_events = new MouseEvents(1);
    const spy1 = new SpySubscriber(0);
    const spy2 = new SpySubscriber(0);
    mouse_events.subscribe(spy1);
    mouse_events.subscribe(spy1);
    mouse_events.mouse_click(0, { x: 3, y: 4 });
    spy1.compare_coordinates(1, [{ x: 3, y: 4 }]);
    spy2.compare_coordinates(0, []);
    mouse_events.unsubscribe(spy2);
    mouse_events.mouse_click(0, { x: 4, y: 5 });
    spy1.compare_coordinates(2, [
      { x: 3, y: 4 },
      { x: 4, y: 5 },
    ]);
    spy2.compare_coordinates(0, []);
  });
});

describe("MouseEventLogger", () => {
  it("Logs correct string when update_coordinate is called", () => {
    const log_spy = jest.spyOn(console, "log");
    const logger = new MouseEventLogger(0);
    logger.update_coordinate({ x: 5, y: 10 });
    expect(log_spy).toHaveBeenCalledWith("Click: (5, 10)");
    log_spy.mockRestore();
  });

  it("Logs correct string when update_drag is called", () => {
    const log_spy = jest.spyOn(console, "log");
    const logger = new MouseEventLogger(0);
    logger.update_drag({ x: 5, y: 10 }, { x: 2, y: 4 });
    expect(log_spy).toHaveBeenCalledWith("Drag: (5, 10) to (2, 4)");
    log_spy.mockRestore();
  });
});

describe("MouseEventArea", () => {
  it("Logs correct string when update_coordinate is called once", () => {
    const log_spy = jest.spyOn(console, "log");
    const logger = new MouseEventArea(0);
    logger.update_coordinate({ x: 5, y: 10 });
    expect(log_spy).toHaveBeenCalledWith("Coordinate area: 0");
    log_spy.mockRestore();
  });

  it("Logs correct string when update_coordinate is called multiple times", () => {
    const log_spy = jest.spyOn(console, "log");
    const logger = new MouseEventArea(0);
    logger.update_coordinate({ x: 8, y: 10 });
    expect(log_spy).toHaveBeenCalledWith("Coordinate area: 0");
    logger.update_coordinate({ x: 2, y: 8 });
    expect(log_spy).toHaveBeenCalledWith("Coordinate area: 12");
    logger.update_coordinate({ x: 4, y: 9 });
    expect(log_spy).toHaveBeenCalledWith("Coordinate area: 12");
    logger.update_coordinate({ x: 3, y: 3 });
    expect(log_spy).toHaveBeenCalledWith("Coordinate area: 42");
    log_spy.mockRestore();
  });

  it("Logs correct string when update_drag is called with same start and end", () => {
    const log_spy = jest.spyOn(console, "log");
    const logger = new MouseEventArea(0);
    logger.update_drag({ x: 5, y: 10 }, { x: 5, y: 10 });
    expect(log_spy).toHaveBeenCalledWith("Dragged area: 0");
    log_spy.mockRestore();
  });

  it("Logs correct string when update_drag is called", () => {
    const log_spy = jest.spyOn(console, "log");
    const logger = new MouseEventArea(0);
    logger.update_drag({ x: 5, y: 10 }, { x: 1, y: 1 });
    expect(log_spy).toHaveBeenCalledWith("Dragged area: 36");
    log_spy.mockRestore();
  });
});
