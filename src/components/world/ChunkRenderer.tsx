import { useMemo } from 'react';
import { useChunkManager } from '../../store/useChunkManager';
import KelpForest from './KelpForest';
import DebrisField from './DebrisField';
import Cables from './Cables';
import Seabed from './Seabed';

const CHUNK_SIZE = 150;

const ChunkRenderer = () => {
  const activeChunks = useChunkManager((s) => s.activeChunks);

  // Memoize chunk IDs to prevent unnecessary re-renders
  const chunkList = useMemo(() => Array.from(activeChunks), [activeChunks]);

  return (
    <>
      {chunkList.map((key) => {
        const [cx, cz] = key.split(':').map(Number);
        const posX = cx * CHUNK_SIZE;
        const posZ = cz * CHUNK_SIZE;

        return (
          <group key={key} position={[posX, 0, posZ]}>
            <Seabed />
            <KelpForest />
            <DebrisField />
            <Cables />
          </group>
        );
      })}
    </>
  );
};

export default ChunkRenderer;