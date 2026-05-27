import { Canvas } from '@react-three/fiber';
import GameScene from './components/GameScene';
import HUD from './components/ui/HUD';
import DebugPanel from './components/ui/DebugPanel';
import PhaserOverlay from './components/phaser/PhaserOverlay';
import ArchivePanel from './components/ui/ArchivePanel'; 
import GameInitializer from './components/GameInitializer';
import SettingsPanel from './components/ui/SettingsPanel';
import NotificationFeed from './components/ui/NotificationFeed';
import { useSettingsStore } from './store/useSettingsStore';
import { useEffect } from 'react';
import { useTelemetryStore } from './store/useTelemetryStore';

const App = () => {
  const showSettings = useSettingsStore((s) => s.showPerformanceOverlay);
  const initListeners = useTelemetryStore((s) => s.initListeners);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        const current = useSettingsStore.getState().showPerformanceOverlay;
        useSettingsStore.getState().updateSetting('showPerformanceOverlay', !current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    initListeners();
  }, [initListeners]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black relative select-none">
      <GameInitializer />
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
      <NotificationFeed />
      {showSettings && <SettingsPanel />}
    </div>
  );
};

export default App;