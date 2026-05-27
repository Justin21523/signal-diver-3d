import { useMissionStore } from '../../store/useMissionStore';

const NotificationFeed = () => {
  const notifications = useMissionStore((s) => s.notifications);

  return (
    <div className="absolute top-24 right-6 flex flex-col gap-2 items-end pointer-events-none">
      {notifications.map((n) => (
        <div key={n.id} className={`bg-black/75 backdrop-blur border-l-4 px-4 py-2 rounded max-w-xs animate-in fade-in slide-in-from-right-4 duration-300 ${
          n.type === 'success' ? 'border-green-400 text-green-200' :
          n.type === 'warning' ? 'border-yellow-400 text-yellow-200' :
          n.type === 'error' ? 'border-red-400 text-red-200' : 'border-cyan-400 text-cyan-200'
        }`}>
          <div className="text-xs font-mono leading-tight">{n.message}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationFeed;