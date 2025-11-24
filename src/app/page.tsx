"use client";

export default function Home() {
  return (
    <div className="relative flex-1 flex items-center justify-center bg-white overflow-hidden">
      <h1
        className="text-[128px] leading-[120px] tracking-[0.001em] text-center text-[#1A1B1C]"
        style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 100 }}
      >
        Sophisticated
        <br />
        skincare
      </h1>

      <div
        className="absolute border-2 border-dashed border-[#D4D4D4] w-[602px] h-[602px] rotate-45"
        style={{ top: 179, left: -301 }}
      />

      <div
        className="absolute border-2 border-dashed border-[#D4D4D4] w-[602px] h-[602px] rotate-45"
        style={{ top: 179, right: -301 }}
      />

      <div className="absolute left-24 top-1/2 -translate-y-1/2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => console.log("Clicked DISCOVER A.I.")}
          className="flex h-9 w-9 items-center justify-center border border-[#1A1B1C] rotate-45 transition-transform duration-200 hover:scale-110 cursor-pointer"
        >
          <span className="-rotate-45 text-[10px] text-[#1A1B1C]">◄</span>
        </button>

        <span className="text-[12px] tracking-[0.16em] uppercase text-[#1A1B1C]">
          Discover A.I.
        </span>
      </div>

      <div className="absolute right-24 top-1/2 -translate-y-1/2 flex items-center gap-3">
        <span className="text-[12px] tracking-[0.16em] uppercase text-[#1A1B1C]">
          Take test
        </span>

        <button
          type="button"
          onClick={() => console.log("Clicked TAKE TEST")}
          className="flex h-9 w-9 items-center justify-center border border-[#1A1B1C] rotate-45 transition-transform duration-200 hover:scale-110 cursor-pointer"
        >
          <span className="-rotate-45 text-[10px] text-[#1A1B1C]">►</span>
        </button>
      </div>
    </div>
  );
}
