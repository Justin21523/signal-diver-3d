export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  position: Vector3;
  velocity: Vector3;
  rotation: Vector3;
  speed: number;
  depth: number;
  isBoosting: boolean;
}

export interface PlayerInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  boost: boolean;
  scan: boolean;      // E
  interact: boolean;   // F
  archive: boolean;    // Tab
}