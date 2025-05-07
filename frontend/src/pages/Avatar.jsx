import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "../components/Experience";
import { UI } from "../components/UI";
import FloatingHistoryPanel from "../components/FloatingHistoryPanel";
import ProfilePic from "../components/profilePic";

function App() {
  return (
    <>
      <Loader />
      <Leva hidden />
      <FloatingHistoryPanel />
      <ProfilePic />
      <UI />
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
