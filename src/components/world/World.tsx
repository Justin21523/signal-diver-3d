import DeepSeaEnvironment from './DeepSeaEnvironment';
import Lighting from './Lighting';
import SignalNode from './SignalNode';
import DataFragment from './DataFragment';
import SonarWave from './SonarWave';
import Seabed from './Seabed';
import KelpForest from './KelpForest';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerStore } from '../../store/usePlayerStore';

const World = () => {
  const nodes = useGameStore((s) => s.nodes);
  const fragments = useGameStore((s) => s.fragments);
  const isScanning = useGameStore((s) => s.isScanning);
  const playerPos = usePlayerStore((s) => s.position);

  return (
    <>
      <DeepSeaEnvironment />
      <Lighting />
      <Seabed />
      <KelpForest />

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