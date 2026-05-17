import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
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
    {
      name: "Blog",
      position: [0, 2.5, 0],
      onClick: () => router.push("/blog"),
    },
    {
      name: "Tracker",
      position: [1, 2.5, 0],
      onClick: () => router.push("/weight"),
    },
    {
      name: "Web3",
      position: [-1, 2.5, 0],
      onClick: () => router.push("/web3"),
    },
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
        <group
          key={idx}
          ref={el => {
            refs.current[idx] = el;
          }}
          onClick={tab.onClick}
          onPointerOver={() => refs.current[idx]?.scale.set(1.2, 1.2, 1.2)}
          onPointerOut={() => refs.current[idx]?.scale.set(1, 1, 1)}
        >
          <Center>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={0.22}
              height={0.03}
              curveSegments={6}
            >
              {tab.name}
              <meshStandardMaterial color="white" />
            </Text3D>
          </Center>
        </group>
      ))}
    </>
  );
}

export default Tabs;
