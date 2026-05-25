import { useGameStore } from '../../store/useGameStore';

const ArchivePanel = () => {
  const isOpen = useGameStore((s) => s.isArchiveOpen);
  const fragments = useGameStore((s) => s.fragments);
  const toggleArchive = useGameStore((s) => s.toggleArchive);

  const collected = fragments.filter(f => f.collected);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-3xl h-[70vh] bg-slate-900/90 border border-cyan-500/40 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-black/40">
          <h2 className="text-xl font-mono text-cyan-300 tracking-widest uppercase">
            Data Archive
          </h2>
          <button 
            onClick={toggleArchive}
            className="text-cyan-400 hover:text-white font-mono text-sm border border-cyan-500/50 px-3 py-1 rounded hover:bg-cyan-500/20 transition"
          >
            Close [Tab]
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {collected.length === 0 ? (
            <div className="text-center text-cyan-500/50 font-mono mt-20">
              NO DATA FRAGMENTS RECOVERED YET.
            </div>
          ) : (
            collected.map((frag) => (
              <div key={frag.id} className="bg-black/50 border border-cyan-800/50 rounded-lg p-4 hover:border-cyan-500/50 transition">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                  <h3 className="text-orange-300 font-mono text-sm uppercase tracking-wide">
                    {frag.title}
                  </h3>
                </div>
                <p className="text-cyan-100/80 text-sm leading-relaxed font-light pl-4 border-l-2 border-orange-500/30">
                  {frag.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivePanel;