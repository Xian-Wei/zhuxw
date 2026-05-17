import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRouter } from "next/navigation";

function Tabs() {
  const router = useRouter();

  type Tab = {
    name: string;
    position: [number, number, number];
    scale?: number;
    onClick: () => void;
  };

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

  return (
    <>
      {tabs.map((tab, idx) => (
        <FloatingText key={idx} tab={tab} index={idx} />
      ))}
    </>
  );
}

type FloatingTextProps = {
  tab: {
    name: string;
    position: [number, number, number];
    onClick: () => void;
  };
  index: number;
};

function FloatingText({ tab, index }: FloatingTextProps) {
  const ref = useRef<any>(null);

  useFrame(state => {
    if (ref.current) {
      const t = state.clock.elapsedTime;

      // bobbing effect
      ref.current.position.y = tab.position[1] + Math.sin(t + index) * 0.1;

      // slow rotation
      ref.current.rotation.y = Math.sin(t + index) * 0.2;

      // orbital sway (slight x/z movement)
      ref.current.position.x =
        tab.position[0] + Math.sin(t * 0.5 + index) * 0.1;
      ref.current.position.z =
        tab.position[2] + Math.cos(t * 0.5 + index) * 0.1;
    }
  });

  return (
    <Text
      ref={ref}
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
  );
}

export default Tabs;
