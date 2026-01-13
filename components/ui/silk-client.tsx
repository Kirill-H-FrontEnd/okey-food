"use client";

import dynamic from "next/dynamic";

const Silk = dynamic(() => import("@/components/ui/Silk"), { ssr: false });

export const SilkClient = () => {
  return (
    <Silk
      speed={5}
      scale={1}
      color="#7B7481"
      noiseIntensity={1.5}
      rotation={0}
    />
  );
};
