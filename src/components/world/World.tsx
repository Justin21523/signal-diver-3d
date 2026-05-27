import DeepSeaEnvironment from './DeepSeaEnvironment';
import Lighting from './Lighting';
import SignalNode from './SignalNode';
import DataFragment from './DataFragment';
import SonarWave from './SonarWave';
import ChunkRenderer from './ChunkRenderer';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import CausticsPlane from './CausticsPlane';
import VolumetricShafts from './VolumetricShafts';
import DroneSwarm from '../entities/DroneSwarm';
import AnomalyZone from './AnomalyZone';
import SourceNode from '../entities/SourceNode';

const World = () => {
  const nodes = useGameStore((s) => s.nodes);
  const fragments = useGameStore((s) => s.fragments);
  const isScanning = useGameStore((s) => s.isScanning);
  const playerPos = usePlayerStore((s) => s.position);

  const fogFar = useSettingsStore((s) => s.fogFar);
  const particleCount = useSettingsStore((s) => s.particleCount);

  return (
    <>
      <DeepSeaEnvironment particleCount={particleCount} fogFar={fogFar} />
      <Lighting />
      <VolumetricShafts />
      <ChunkRenderer />
      <CausticsPlane />
      
      {/* Entities */}
      <DroneSwarm />
      {
      /* Anomaly Zones */}
      <AnomalyZone position={[60, -40, -60]} radius={18} />
      <AnomalyZone position={[-70, -80, 40]} radius={22} />
      
      {/* The Source */}
      <SourceNode />
      
      {nodes.map((node) => (
        <SignalNode
          key={node.id}
          id={node.id}
          position={[node.position.x, node.position.y, node.position.z]}
        />
      ))}

      {fragments.map((frag) => (
        <DataFragment
          key={frag.id}
          id={frag.id}
          position={[frag.position.x, frag.position.y, frag.position.z]}
        />
      ))}

      {isScanning && (
        <SonarWave
          origin={[playerPos.x, playerPos.y, playerPos.z]}
          onComplete={() => useGameStore.getState().endScan()}
        />
      )}
    
    </>
  );
};

export default World;
