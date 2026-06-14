"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

// Сдержанная палитра шаров (фото дают «радугу», UI — спокойный, спека §0).
const BALLOONS: { position: [number, number, number]; color: string; scale: number }[] = [
  { position: [-2.4, 0.6, 0], color: "#f7b6c2", scale: 1.1 },
  { position: [-0.8, -0.4, -1], color: "#a9d3ec", scale: 0.9 },
  { position: [0.9, 0.9, -0.5], color: "#e3c27e", scale: 1.0 },
  { position: [2.3, -0.2, 0], color: "#f5d6d0", scale: 1.2 },
  { position: [0.2, -1.1, 0.5], color: "#cfe3d4", scale: 0.8 },
];

function Balloon({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={1.1}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.05} />
      </mesh>
    </Float>
  );
}

/** R3F-сцена hero. Грузится только на клиенте (ssr:false), вне reduced-motion. */
export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1.1} />
      {BALLOONS.map((b, i) => (
        <Balloon key={i} {...b} />
      ))}
    </Canvas>
  );
}
