import { OrbitControls } from "@react-three/drei";
import { Letters } from "./Letters";
import { WindowWidth } from "../../models/WindowWidth";
import useIsWidth from "../../hooks/useIsWidth";

export const Experience = () => {
  const isWidth = useIsWidth(WindowWidth.md);

  return (
    <>
      <ambientLight intensity={2} />
      <OrbitControls
        enableZoom={true}
        minDistance={0}
        maxDistance={9}
        minPolarAngle={Math.PI / 20}
        maxPolarAngle={Math.PI - Math.PI / 2}
      />
      <Letters
        position={isWidth ? [0, 0, 0] : [0, 0.5, 0]}
        scale={isWidth ? 0.7 : 0.25}
      />
    </>
  );
};
