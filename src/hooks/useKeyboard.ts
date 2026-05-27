import { useEffect, useRef, useCallback } from 'react';
import type { PlayerInput } from '../types';

const EMPTY_INPUT: PlayerInput = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false,
  boost: false,
  scan: false,      // E
  interact: false,   // F
  archive: false,    // Tab
  mute: false        // M
};

export const useKeyboard = () => {
  const keys = useRef<Set<string>>(new Set());
  const input = useRef<PlayerInput>({ ...EMPTY_INPUT });

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      // Prevent Space from scrolling the page while playing
      if (e.code === 'Space' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
        e.preventDefault();
      }
    };
    const handleUp = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
    };
    const handleBlur = () => {
      keys.current.clear();
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const getInput = useCallback((): PlayerInput => {
    const k = keys.current;
    input.current.forward = k.has('KeyW') || k.has('ArrowUp');
    input.current.backward = k.has('KeyS') || k.has('ArrowDown');
    input.current.left = k.has('KeyA') || k.has('ArrowLeft');
    input.current.right = k.has('KeyD') || k.has('ArrowRight');
    input.current.up = k.has('Space');
    input.current.down = k.has('ControlLeft') || k.has('ControlRight');
    input.current.boost = k.has('ShiftLeft') || k.has('ShiftRight');
    input.current.scan = k.has('KeyE');
    input.current.interact = k.has('KeyF');
    input.current.archive = k.has('Tab');
    input.current.mute = k.has('KeyM');
    return input.current;
  }, []);

  return { getInput };
};