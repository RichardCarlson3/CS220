export type Coordinate = { x: number; y: number };

export interface MouseObserver {
  readonly screen: number;

  // update observer with new mouse click coordinate
  update_coordinate(coord: Coordinate): void;

  // update observer with new mouse drag event
  update_drag(start: Coordinate, end: Coordinate): void;
}

export interface Observable {
  // adds an Observer to the set of subscribers
  subscribe(subscriber: MouseObserver): void;

  // removes an Observer from the set of subscribers
  unsubscribe(subscriber: MouseObserver): void;
}

// Exercise 1

export class MouseEvents implements Observable {
  private _num_screens: number;
  private _subscribers: Set<MouseObserver>[];

  private _is_valid_screen(screen: number): boolean {
    return screen >= 0 && screen < this._num_screens;
  }

  constructor(num_screens: number) {
    this._num_screens = num_screens;
    this._subscribers = [];
    for (let i = 0; i < num_screens; i++) {
      const new_set = new Set<MouseObserver>();
      this._subscribers.push(new_set);
    }
  }

  subscribe(subscriber: MouseObserver): void {
    if (this._is_valid_screen(subscriber.screen)) {
      this._subscribers[subscriber.screen].add(subscriber);
    }
    // TODO: Implement this method
  }

  unsubscribe(subscriber: MouseObserver): void {
    if (this._is_valid_screen(subscriber.screen)) {
      this._subscribers[subscriber.screen].delete(subscriber);
    }
    // TODO: Implement this method
  }

  mouse_click(screen: number, coord: Coordinate): void {
    // TODO: Implement this method
    if (this._is_valid_screen(screen)) {
      for (const subscriber of this._subscribers[screen]) {
        subscriber.update_coordinate(coord);
      }
    }
  }
  mouse_drag(screen: number, start: Coordinate, end: Coordinate): void {
    // TODO: Implement this method
    if (this._is_valid_screen(screen)) {
      for (const subscriber of this._subscribers[screen]) {
        subscriber.update_drag(start, end);
      }
    }
  }
}
// Exercise 2

// Should print out all coordinate and mouse drag updates for a specific screen
export class MouseEventLogger implements MouseObserver {
  readonly screen: number;

  constructor(screen: number) {
    this.screen = screen;
  }

  update_coordinate(coord: Coordinate): void {
    console.log(`Click: (${coord.x}, ${coord.y})`);
    // TODO: Implement this method
  }

  update_drag(start: Coordinate, end: Coordinate): void {
    console.log(`Drag: (${start.x}, ${start.y}) to (${end.x}, ${end.y})`);
    // TODO: Implement this method
  }
}

// Should print out area of bounding box around all mouse clicks, and area of bounding box for mouse drags
export class MouseEventArea implements MouseObserver {
  readonly screen: number;
  private _min_vals: Coordinate;
  private _max_vals: Coordinate;

  private calculate_area(corner1: Coordinate, corner2: Coordinate): number {
    return Math.abs((corner1.x - corner2.x) * (corner1.y - corner2.y));
  }
  constructor(screen: number) {
    this.screen = screen;
    this._min_vals = { x: Infinity, y: Infinity };
    this._max_vals = { x: -1, y: -1 };
  }

  update_coordinate(coord: Coordinate): void {
    this._min_vals.x = Math.min(this._min_vals.x, coord.x);
    this._min_vals.y = Math.min(this._min_vals.y, coord.y);
    this._max_vals.x = Math.max(this._max_vals.x, coord.x);
    this._max_vals.y = Math.max(this._max_vals.y, coord.y);
    const area = this.calculate_area(this._min_vals, this._max_vals);
    console.log(`Coordinate area: ${area}`);
  }

  update_drag(start: Coordinate, end: Coordinate): void {
    // TODO: Implement this method
    const area = this.calculate_area(start, end);
    console.log(`Dragged area: ${area}`);
  }
}
