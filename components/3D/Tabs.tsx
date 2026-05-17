import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRouter } from "next/navigation";
import * as THREE from "three";

type Tab = {
  name: string;
  position: [number, number, number];
  onClick: () => void;
};

function Tabs() {
  const router = useRouter();

  const tabs: Tab[] = [
    { name: "Blog", position: [0, 2.5, 0], onClick: () => router.push("/blog") },
    { name: "Tracker", position: [1, 2.5, 0], onClick: () => router.push("/weight") },
    { name: "Web3", position: [-1, 2.5, 0], onClick: () => router.push("/web3") },
  ];

  const refs = useRef<(THREE.Object3D | null)[]>([]);

  useFrame(state => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((ref, index) => {
      if (!ref) return;
      const base = tabs[index].position;
      ref.position.y = base[1] + Math.sin(t + index) * 0.1;
      ref.position.x = base[0] + Math.sin(t * 0.5 + index) * 0.1;
      ref.position.z = base[2] + Math.cos(t * 0.5 + index) * 0.1;
      (ref.rotation as THREE.Euler).y = Math.sin(t + index) * 0.2;
    });
  });

  return (
    <>
      {tabs.map((tab, idx) => (
        <Text
          key={idx}
          ref={el => { refs.current[idx] = el; }}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          onClick={tab.onClick}
          onPointerOver={e => e.object.scale.set(1.2, 1.2, 1.2)}
          onPointerOut={e => e.object.scale.set(1, 1, 1)}
        >
          {tab.name}
        </Text>
      ))}
    </>
  );
}

export default Tabs;
