"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const bottomLineRef = useRef<HTMLHeadingElement | null>(null);
  const leftCtaRef = useRef<HTMLDivElement | null>(null);
  const rightCtaRef = useRef<HTMLDivElement | null>(null);
  const leftDiamondRef = useRef<HTMLDivElement | null>(null);
  const rightDiamondRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  function handleHover(side: "left" | "right") {
    const heroX = side === "right" ? -300 : 300;
    const bottomX = side === "right" ? -140 : 140;

    const fadingContainer =
      side === "right" ? leftCtaRef.current : rightCtaRef.current;
    const fadingButton = fadingContainer?.querySelector("button");
    const fadingDiamond =
      side === "right" ? leftDiamondRef.current : rightDiamondRef.current;

    const keepContainer =
      side === "right" ? rightCtaRef.current : leftCtaRef.current;
    const keepButton = keepContainer?.querySelector("button");
    const keepDiamond =
      side === "right" ? rightDiamondRef.current : leftDiamondRef.current;

    gsap.killTweensOf([
      heroRef.current,
      bottomLineRef.current,
      leftCtaRef.current,
      rightCtaRef.current,
      leftDiamondRef.current,
      rightDiamondRef.current,
      leftCtaRef.current?.querySelector("button"),
      rightCtaRef.current?.querySelector("button"),
    ]);

    gsap.to(heroRef.current, {
      x: heroX,
      duration: 1,
      ease: "power3.inOut",
    });

    gsap.to(bottomLineRef.current, {
      x: bottomX,
      duration: 1,
      ease: "power3.inOut",
    });

    gsap.to([keepContainer, keepButton, keepDiamond], {
      opacity: 1,
      duration: 0.2,
      ease: "power1.inOut",
    });

    gsap.to([fadingContainer, fadingButton, fadingDiamond], {
      opacity: 0,
      duration: 0.2,
      ease: "power1.inOut",
    });
  }

  function handleLeave() {
    gsap.killTweensOf([
      heroRef.current,
      bottomLineRef.current,
      leftCtaRef.current,
      rightCtaRef.current,
      leftDiamondRef.current,
      rightDiamondRef.current,
      leftCtaRef.current?.querySelector("button"),
      rightCtaRef.current?.querySelector("button"),
    ]);

    gsap.to(heroRef.current, {
      x: 0,
      duration: 1,
      ease: "power3.inOut",
    });

    gsap.to(bottomLineRef.current, {
      x: 0,
      duration: 1,
      ease: "power3.inOut",
    });

    gsap.to(
      [
        leftCtaRef.current,
        rightCtaRef.current,
        leftCtaRef.current?.querySelector("button"),
        rightCtaRef.current?.querySelector("button"),
        leftDiamondRef.current,
        rightDiamondRef.current,
      ],
      {
        opacity: 1,
        duration: 0.2,
        delay: 0.3,
        ease: "power1.inOut",
      }
    );
  }

  return (
    <div className="relative flex-1 bg-white overflow-hidden">
      {/* mobile: 768px */}
      <div className="flex md:hidden items-center justify-center min-h-[calc(100vh-80px)] pt-10 pb-16">
        <div className="relative w-[300px] h-[300px] xs:w-[340px] xs:h-[340px]">
          <div className="absolute inset-0 border border-[#D4D4D4] rotate-45" />
          <div className="absolute inset-8 border border-[#D4D4D4] rotate-45" />
          <div className="absolute inset-14 bg-white rotate-45 flex items-center justify-center">
            <div
              className="-rotate-45 text-center px-6 text-[#1A1B1C]"
              style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 100 }}
            >
              <h1 className="text-[30px] leading-[34px] tracking-[0.001em]">
                Sophisticated
              </h1>
              <h1 className="text-[30px] leading-[34px] tracking-[0.001em]">
                skincare
              </h1>
              <p className="mt-4 text-[10px] leading-[16px] tracking-[0.06em] uppercase">
                Skinstric developed an A.I. that creates a highly-personalized
                routine tailored to what your skin needs.
              </p>
              <button
                type="button"
                onClick={() => router.push("/testing")}
                className="mt-6 inline-flex items-center justify-center gap-2 text-[10px] tracking-[0.14em] uppercase text-[#1A1B1C] transition-transform duration-200 hover:scale-110 cursor-pointer"
              >
                <span>Enter experience</span>
                <span className="inline-flex h-5 w-5 items-center justify-center border border-[#1A1B1C] rotate-45">
                  <span className="-rotate-45 text-[10px]">►</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* md: 768px–1023px */}
      <div className="hidden md:flex lg:hidden items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="relative w-[520px] h-[520px]">
          <div className="absolute inset-0 border border-[#D4D4D4] rotate-45" />
          <div className="absolute inset-10 border border-[#D4D4D4] rotate-45" />
          <div className="absolute inset-20 bg-white rotate-45 flex items-center justify-center">
            <div
              className="-rotate-45 text-center px-12 text-[#1A1B1C]"
              style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 100 }}
            >
              <h1 className="text-[40px] leading-[44px] tracking-[0.001em]">
                Sophisticated
              </h1>
              <h1 className="text-[40px] leading-[44px] tracking-[0.001em]">
                skincare
              </h1>
              <p className="mt-6 text-[12px] leading-[18px] tracking-[0.06em] uppercase">
                Skinstric developed an A.I. that creates a highly-personalized
                routine tailored to what your skin needs.
              </p>
              <button
                type="button"
                onClick={() => router.push("/testing")}
                className="mt-7 inline-flex items-center justify-center gap-2 text-[10px] tracking-[0.14em] uppercase text-[#1A1B1C] transition-transform duration-200 hover:scale-110 cursor-pointer"
              >
                <span>Enter experience</span>
                <span className="inline-flex h-5 w-5 items-center justify-center border border-[#1A1B1C] rotate-45">
                  <span className="-rotate-45 text-[10px]">►</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* lg+: ≥1024px*/}
      <div className="hidden lg:flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div
          ref={heroRef}
          className="text-center text-[#1A1B1C]"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 100 }}
        >
          <h1 className="text-[128px] leading-[120px] tracking-[0.001em]">
            Sophisticated
          </h1>
          <h1
            ref={bottomLineRef}
            className="text-[128px] leading-[120px] tracking-[0.001em]"
          >
            skincare
          </h1>
        </div>

        <div
          ref={leftDiamondRef}
          className="absolute border-2 border-dashed border-[#D4D4D4] w-[602px] h-[602px] rotate-45"
          style={{ top: 179, left: -301 }}
        />

        <div
          ref={rightDiamondRef}
          className="absolute border-2 border-dashed border-[#D4D4D4] w-[602px] h-[602px] rotate-45"
          style={{ top: 179, right: -301 }}
        />

        <div
          ref={leftCtaRef}
          className="absolute left-24 top-1/2 -translate-y-1/2 flex items-center gap-3"
        >
          <button
            type="button"
            onMouseEnter={() => handleHover("left")}
            onMouseLeave={handleLeave}
            className="flex h-9 w-9 items-center justify-center border border-[#1A1B1C] rotate-45 transition-transform duration-200 hover:scale-110 cursor-pointer"
          >
            <span className="-rotate-45 text-[10px] text-[#1A1B1C]">◄</span>
          </button>

          <span className="text-[12px] tracking-[0.16em] uppercase text-[#1A1B1C]">
            Discover A.I.
          </span>
        </div>

        <div
          ref={rightCtaRef}
          className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center gap-3"
        >
          <span className="text-[12px] tracking-[0.16em] uppercase text-[#1A1B1C]">
            Take test
          </span>

          <button
            type="button"
            onMouseEnter={() => handleHover("right")}
            onMouseLeave={handleLeave}
            onClick={() => router.push("/testing")}
            className="flex h-9 w-9 items-center justify-center border border-[#1A1B1C] rotate-45 transition-transform duration-200 hover:scale-110 cursor-pointer"
          >
            <span className="-rotate-45 text-[10px] text-[#1A1B1C]">►</span>
          </button>
        </div>

        <div className="absolute left-24 bottom-10 max-w-xs text-[10px] leading-[16px] tracking-[0.12em] uppercase text-[#1A1B1C]">
          <p>SKINSTRIC DEVELOPED AN A.I. THAT CREATES</p>
          <p>A HIGHLY-PERSONALISED ROUTINE TAILORED TO</p>
          <p>WHAT YOUR SKIN NEEDS.</p>
        </div>
      </div>
    </div>
  );
}
