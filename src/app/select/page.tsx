"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectPage() {
  const router = useRouter();
  const [isHoveringTile, setIsHoveringTile] = useState(false);

  return (
    <div
      className="relative w-full bg-white text-[#1A1B1C] overflow-hidden flex items-center justify-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="absolute left-8 top-8">
        <h2
          className="text-[12px] tracking-[0.18em] uppercase mb-2"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
        >
          A.I. ANALYSIS
        </h2>
        <p
          className="text-[14px] leading-[1.6]"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 500 }}
        >
          A.I. HAS ESTIMATED THE FOLLOWING.
          <br />
          FIX ESTIMATED INFORMATION IF NEEDED.
        </p>
      </div>

      <div className="relative flex items-center justify-center -mt-16 md:-mt-20 lg:-mt-24">
        <div className="relative w-[420px] h-[420px] md:w-[470px] md:h-[470px] lg:w-[520px] lg:h-[520px] flex items-center justify-center">
          <div
            className={`absolute inset-0 rotate-45 origin-center pointer-events-none border-2 border-dotted border-[#8E929C] transition-all duration-500 ease-in-out ${
              isHoveringTile ? "opacity-80 scale-100" : "opacity-0 scale-90"
            }`}
          />

          <div
            className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] lg:w-[360px] lg:h-[360px] rotate-45 flex flex-wrap"
            onMouseEnter={() => setIsHoveringTile(true)}
            onMouseLeave={() => setIsHoveringTile(false)}
          >
            <button
              type="button"
              className="w-1/2 h-1/2 bg-[#ECEFF5] border border-white flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#D4DBE8]"
            >
              <span
                className="-rotate-45 text-[12px] md:text-[13px] tracking-[0.16em] uppercase text-[#1A1B1C]"
                style={{
                  fontFamily: "Roobert TRIAL, sans-serif",
                  fontWeight: 700,
                }}
              >
                DEMOGRAPHICS
              </span>
            </button>

            <button
              type="button"
              className="w-1/2 h-1/2 bg-[#ECEFF5] border border-white flex items-center justify-center cursor-not-allowed transition-colors duration-200 hover:bg-[#D4DBE8]"
            >
              <span
                className="-rotate-45 text-[12px] md:text-[13px] tracking-[0.16em] uppercase text-[#1A1B1C]"
                style={{
                  fontFamily: "Roobert TRIAL, sans-serif",
                  fontWeight: 700,
                }}
              >
                SKIN TYPE DETAILS
              </span>
            </button>

            <button
              type="button"
              className="w-1/2 h-1/2 bg-[#ECEFF5] border border-white flex items-center justify-center cursor-not-allowed transition-colors duration-200 hover:bg-[#D4DBE8]"
            >
              <span
                className="-rotate-45 text-[12px] md:text-[13px] tracking-[0.16em] uppercase text-[#1A1B1C] text-center"
                style={{
                  fontFamily: "Roobert TRIAL, sans-serif",
                  fontWeight: 700,
                }}
              >
                COSMETIC
                <br />
                CONCERNS
              </span>
            </button>

            <button
              type="button"
              className="w-1/2 h-1/2 bg-[#ECEFF5] border border-white flex items-center justify-center cursor-not-allowed transition-colors duration-200 hover:bg-[#D4DBE8]"
            >
              <span
                className="-rotate-45 text-[12px] md:text-[13px] tracking-[0.16em] uppercase text-[#1A1B1C]"
                style={{
                  fontFamily: "Roobert TRIAL, sans-serif",
                  fontWeight: 700,
                }}
              >
                WEATHER
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute left-6 md:left-12 bottom-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/result")}
          className="flex h-11 w-11 items-center justify-center border border-[#1A1B1C] rotate-45 cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          <span className="-rotate-45 text-[10px] text-[#1A1B1C]">◄</span>
        </button>
        <span
          className="text-[10px] tracking-[0.16em] uppercase"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
        >
          BACK
        </span>
      </div>

      <div className="absolute right-6 md:right-12 bottom-10 flex items-center gap-4">
        <span
          className="text-[10px] tracking-[0.16em] uppercase"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
        >
          GET SUMMARY
        </span>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center border border-[#1A1B1C] rotate-45 cursor-not-allowed transition-transform duration-200 hover:scale-110"
        >
          <span className="-rotate-45 text-[10px] text-[#1A1B1C]">►</span>
        </button>
      </div>
    </div>
  );
}
