export const PLAYER_CONFIG = {
  baseSpeed: 8,
  boostMultiplier: 1.8,
  acceleration: 10,
  drag: 2.0,
  rotationSpeed: 1.8,
  maxSpeed: 10,
  bounds: { x: 160, y: 160, z: 160 }
} as const;

export const CAMERA_CONFIG = {
  offset: { x: 0, y: 3, z: 10 },
  lerpFactor: 0.08,
  lookAhead: 1.2,
} as const;

export const WORLD_CONFIG = {
  fogColor: '#021c18',
  fogNear: 8,
  fogFar: 90,
  backgroundColor: '#010d0c',
  ambientColor: '#133d35',
  lightColor: '#34d399',
} as const;

export const INTERACTION_CONFIG = {
  fragmentRadius: 4.5,
  nodeRadius: 6.0,
  scanRadius: 60,
  scanSpeed: 45,
} 

export const ZONE_THRESHOLDS = {
  mid: -20,
  deep: -50,
  abyss: -100,
} as const;