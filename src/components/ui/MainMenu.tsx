import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { getSaveSlots, deleteSlot, type SaveSlot } from '../../utils/saveSystem';

interface MainMenuProps {
  onStartGame: (slotId: number | null) => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const gameState = useGameStore((s) => s.gameState);
  const [showSlots, setShowSlots] = useState(false);
  const [slots, setSlots] = useState<SaveSlot[]>(getSaveSlots());

  if (gameState !== 'menu') return null;

  const handleDelete = (id: number) => {
    deleteSlot(id);
    setSlots(getSaveSlots());
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#010d0c] flex flex-col items-center justify-center">
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-mono text-cyan-400 tracking-[0.3em] mb-2">SIGNAL DIVER</h1>
        <p className="text-cyan-600/70 font-mono tracking-widest">DEEP SEA DATA RECOVERY</p>
      </div>

      {!showSlots ? (
        <div className="flex flex-col gap-4 w-64">
          <button onClick={() => onStartGame(null)} className="py-3 border border-cyan-500 text-cyan-300 font-mono tracking-widest hover:bg-cyan-500/20 transition">
            NEW DIVE
          </button>
          <button onClick={() => setShowSlots(true)} className="py-3 border border-cyan-800 text-cyan-500 font-mono tracking-widest hover:bg-cyan-900/20 transition">
            LOAD DIVE
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-3">
          {slots.map(slot => (
            <div key={slot.id} className="flex items-center justify-between bg-black/40 border border-cyan-900 p-4 rounded">
              <div className="flex-1 cursor-pointer hover:bg-cyan-900/20 p-2" onClick={() => slot.data && onStartGame(slot.id)}>
                <div className="text-cyan-300 font-mono text-sm">SLOT {slot.id}</div>
                {slot.data ? (
                  <div className="text-xs text-cyan-600">
                    {new Date(slot.data.timestamp).toLocaleString()} • {slot.data.nodesRepaired.length} Nodes
                  </div>
                ) : (
                  <div className="text-xs text-gray-600">EMPTY</div>
                )}
              </div>
              {slot.data && (
                <button onClick={() => handleDelete(slot.id)} className="text-red-500 hover:text-red-400 text-xs font-mono ml-4">DEL</button>
              )}
            </div>
          ))}
          <button onClick={() => setShowSlots(false)} className="w-full py-2 mt-4 text-cyan-600 font-mono text-sm hover:text-cyan-400">
            BACK
          </button>
        </div>
      )}
    </div>
  );
};

export default MainMenu;