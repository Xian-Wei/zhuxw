import { OrbitControls } from "@react-three/drei";
import { Letters } from "./Letters";

export const Experience = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <OrbitControls
        enableZoom={true}
        minDistance={0}
        maxDistance={5}
        minPolarAngle={Math.PI / 20}
        maxPolarAngle={Math.PI - Math.PI / 2}
      />
      <Letters position={[0, 0, -1]} />
    </>
  );
};
