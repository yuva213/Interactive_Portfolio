"use client";

import Particles from "@/components/Particles";
import RemoteCursors from "@/components/realtime/remote-cursors";
import EasterEggs from "@/components/easter-eggs";
import ElasticCursor from "@/components/ui/ElasticCursor";
import RadialMenu from "@/components/radial-menu/index";
import { useEffect } from "react";
import { useSounds } from "@/components/realtime/hooks/use-sounds";

// function GlobalClickSounds() {
//   const { playPressSound } = useSounds();

//   useEffect(() => {
//     const handleClick = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
//         playPressSound();
//       }
//     };
    
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, [playPressSound]);

//   return null;
// }

export default function AppOverlays() {
  return (
    <>
      <Particles
        className="fixed inset-0 -z-10 animate-fade-in"
        quantity={100}
      />
      <RemoteCursors />
      <EasterEggs />
      <ElasticCursor />
      <RadialMenu />
      {/* <GlobalClickSounds /> */}
    </>
  );
}
