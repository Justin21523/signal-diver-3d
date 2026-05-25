export interface WorldBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface WorldConfig {
  bounds: WorldBounds;
  fogNear: number;
  fogFar: number;
  fogColor: string;
  backgroundColor: string;
}