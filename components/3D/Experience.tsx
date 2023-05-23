import { OrbitControls } from "@react-three/drei";
import { Letters } from "./Letters";

export const Experience = () => {
  return (
    <>
      <ambientLight intensity={1} />
      <OrbitControls enableZoom={true} />
      <Letters />
    </>
  );
};
