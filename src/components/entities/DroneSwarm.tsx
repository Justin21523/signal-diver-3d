import RogueDrone from './RogueDrone';

const DRONE_SPAWNS: [number, number, number][] = [
  [40, -30, 40],
  [-50, -60, -30],
  [20, -90, -60],
  [-30, -20, 60],
];

const DroneSwarm = () => {
  return (
    <>
      {DRONE_SPAWNS.map((pos, i) => (
        <RogueDrone key={i} initialPos={pos} />
      ))}
    </>
  );
};

export default DroneSwarm;