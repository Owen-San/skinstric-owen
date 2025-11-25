"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import Image from "next/image";

export default function CameraPage() {
  const router = useRouter();

  const outerRef = useRef<HTMLDivElement | null>(null);
  const middleRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const squares = [outerRef.current, middleRef.current, innerRef.current].filter(
      Boolean
    ) as HTMLDivElement[];

    squares.forEach((square, index) => {
      const i = index % 3;
      const baseRotation = i === 0 ? -45 : i === 1 ? 10 : 62;

      gsap.fromTo(
        square,
        { rotation: baseRotation },
        {
          rotation: baseRotation + 360,
          duration: 130,
          repeat: -1,
          ease: "none",
        }
      );
    });

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.06,
        opacity: 0.7,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    return () => {
      squares.forEach((square) => gsap.killTweensOf(square));
      if (iconRef.current) gsap.killTweensOf(iconRef.current);
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push("/camera/capture");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [router]);

  return (
    <div
      className="relative w-full bg-white text-[#1A1B1C] overflow-hidden flex flex-col items-center justify-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="relative flex items-center justify-center">
        <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] lg:w-[430px] lg:h-[430px] flex items-center justify-center">
          <div
            ref={outerRef}
            className="absolute top-1/2 left-1/2 h-[300px] w-[300px] md:h-[360px] md:w-[360px] lg:h-[410px] lg:w-[410px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#C9C9C9]"
            style={{ borderStyle: "dotted", opacity: 0.3 }}
          />
          <div
            ref={middleRef}
            className="absolute top-1/2 left-1/2 h-[260px] w-[260px] md:h-[320px] md:w-[320px] lg:h-[370px] lg:w-[370px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#B3B3B3]"
            style={{ borderStyle: "dotted", opacity: 0.4 }}
          />
          <div
            ref={innerRef}
            className="absolute top-1/2 left-1/2 h-[220px] w-[220px] md:h-[280px] md:w-[280px] lg:h-[330px] lg:w-[330px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#8F8F8F]"
            style={{ borderStyle: "dotted", opacity: 0.5 }}
          />

          <div
            ref={iconRef}
            className="relative z-10 flex flex-col items-center justify-center"
          >
            <Image
              src="/camera-icon.webp"
              alt="Camera Icon"
              width={136}
              height={136}
              className="w-[90px] h-[90px] md:w-[110px] md:h-[110px] lg:w-[126px] lg:h-[126px]"
            />
            <div
              className="mt-6 text-[11px] md:text-[12px] tracking-[0.18em] uppercase text-[#1A1B1C]"
              style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
            >
              SETTING UP CAMERA ...
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-20 flex flex-col items-center text-center">
        <div
          className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase mb-4 text-[#1A1B1C]"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
        >
          TO GET BETTER RESULTS MAKE SURE TO HAVE
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#1A1B1C]"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
        >
          <span>◇ NEUTRAL EXPRESSION</span>
          <span>◇ FRONTAL POSE</span>
          <span>◇ ADEQUATE LIGHTING</span>
        </div>
      </div>
    </div>
  );
}
