# Phaser Overlay

This folder hosts the Phaser 3 integration used for 2D mini-game puzzles.

## Planned puzzles (Phase 2+)

- **Frequency Sync** — align waveforms to match a target signal.
- **Node Routing** — connect signal paths on a grid to restore a Signal Node.
- **Noise Filter** — eliminate interference patterns to decode a data fragment.

## Architecture

- `PhaserOverlay.tsx` — React wrapper that mounts/unmounts the Phaser game
  instance and bridges Zustand state with Phaser scenes.
- `scenes/` — Phaser scene classes (Boot, FrequencySync, NodeRouting, ...).
- `config.ts` — Phaser game configuration (resolution, physics, plugins).
- `bridge.ts` — helpers to read/write Zustand stores from inside Phaser.

## Rules

- Phaser is used **only** for 2D puzzle overlays.
- The 3D world is always rendered by React Three Fiber.
- When a puzzle starts, `useGameStore.gameState` becomes `'puzzle'` and the
  overlay mounts. When the puzzle resolves, the overlay unmounts and control
  returns to the 3D scene.