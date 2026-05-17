import { OrbitControls } from "@react-three/drei";
import { Letters } from "./Letters";
import { WindowWidth } from "../../models/WindowWidth";
import useIsWidth from "../../hooks/useIsWidth";
import Tabs from "./Tabs";

export const Experience = () => {
  const isWidth = useIsWidth(WindowWidth.md);

  return (
    <>
      <ambientLight intensity={2} />
      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 20}
        maxPolarAngle={Math.PI - Math.PI / 2}
      />
      <Letters
        position={isWidth ? [0, 0, 0] : [0, 0.5, 0]}
        scale={isWidth ? 0.7 : 0.45}
      />
      <Tabs />
    </>
  );
};
