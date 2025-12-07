import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// adjust path if needed
const MODEL_PATH = "delivery-boy.glb";

// 🔑 CHANGE 1: Define props for the model to accept dynamic scale
interface DeliveryModelProps {
  scale: number;
}

// 🔑 CHANGE 2: Use the dynamic scale prop in the model component
const DeliveryModel: React.FC<DeliveryModelProps> = ({ scale }) => {
  const { scene } = useGLTF(MODEL_PATH);
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.004;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      // Use the responsive scale
      scale={scale} 
      position={[0, -0.4, 0]}
      rotation={[0, Math.PI / 6, 0]}
    />
  );
};

useGLTF.preload(MODEL_PATH);

const DeliveryBuddy3D: React.FC = () => {
  const MOBILE_BREAKPOINT = 600;
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  // Camera FOV
  const cameraFov = isMobile ? 35 : 27;

  // Sizing and Positioning Constants
  const desktopSize = "20rem";
  const desktopScale = 2;
  
  const mobileSize = "45vw"; 
  const mobileScale = 3.5;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0px",
        
        // 🔑 CHANGE 3: Conditional Positioning
        // Mobile: right: "0px", left: undefined (Bottom Right)
        // Desktop: left: "0px", right: undefined (Bottom Left - maintaining your last code's behavior)
        left: isMobile ? undefined : "0px",
        right: isMobile ? "0px" : undefined, 
        
        // Sizing logic
        width: isMobile ? mobileSize : desktopSize,
        height: isMobile ? mobileSize : desktopSize,
        
        zIndex: 100,
        pointerEvents: "auto",
        background: "transparent",
      }}
    >
      <Canvas
        camera={{ position: [2, 3, 3.2], fov: cameraFov }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 8, 6]} intensity={1.2} />

        {/* 🔑 CHANGE 4: Pass the correct scale to the model */}
        <DeliveryModel 
          scale={isMobile ? mobileScale : desktopScale}
        />

        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default DeliveryBuddy3D;