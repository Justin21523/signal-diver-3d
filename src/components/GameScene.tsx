import { Suspense } from 'react';
import { Html } from '@react-three/drei';
import World from './world/World';
import PlayerController from './player/PlayerController';
import PostProcessing from './world/PostProcessing';

const LoadingScreen = () => (
  <Html center>
    <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
      INITIALIZING DEEP SEA LINK...
    </div>
  </Html>
);

const GameScene = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <World />
      <PlayerController />
      <PostProcessing />
    </Suspense>
  );
};

export default GameScene;