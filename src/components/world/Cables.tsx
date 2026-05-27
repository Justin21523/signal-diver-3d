import { Vector3, CatmullRomCurve3 } from 'three';

const CABLES = Array.from({ length: 5 }, (_, i) => {
  const points: Vector3[] = [];
  let x = (Math.random() - 0.5) * 140;
  let z = (Math.random() - 0.5) * 140;
  let y = -115 + Math.random() * 25;
  for (let j = 0; j < 6; j++) {
    points.push(new Vector3(x, y, z));
    x += (Math.random() - 0.5) * 30;
    z += (Math.random() - 0.5) * 30;
    y += (Math.random() - 0.5) * 18;
  }
  return { curve: new CatmullRomCurve3(points), color: i % 3 === 0 ? '#2a4a5a' : '#3a2540' };
});

const Cables = () => (
  <>
    {CABLES.map((c, i) => (
      <mesh key={i}>
        <tubeGeometry args={[c.curve, 32, 0.09, 4, false]} />
        <meshStandardMaterial color={c.color} roughness={0.75} metalness={0.6} />
      </mesh>
    ))}
  </>
);

export default Cables;
