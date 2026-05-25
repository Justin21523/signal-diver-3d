import { Canvas } from '@react-three/fiber';
import GameScene from './components/GameScene';
import HUD from './components/ui/HUD';
import DebugPanel from './components/ui/DebugPanel';
import PhaserOverlay from './components/phaser/PhaserOverlay';
import ArchivePanel from './components/ui/ArchivePanel'; 

const App = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative select-none">
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 3, 10] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <GameScene />
      </Canvas>

      {/* 2D UI layers on top of the 3D canvas */}
      <HUD />
      <DebugPanel />
      <ArchivePanel />
      <PhaserOverlay />
    </div>
  );
};

export default App;