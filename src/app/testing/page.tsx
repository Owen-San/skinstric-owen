"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

type Step = 1 | 2;
type Phase = "input" | "loading" | "success";

export default function TestingPage() {
  const router = useRouter();
  const squareOuterRef = useRef<HTMLDivElement | null>(null);
  const squareMiddleRef = useRef<HTMLDivElement | null>(null);
  const squareInnerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState("");
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const squares = [
      squareOuterRef.current,
      squareMiddleRef.current,
      squareInnerRef.current,
    ].filter(Boolean) as HTMLDivElement[];

    squares.forEach((square, index) => {
      const baseRotation = index === 0 ? -45 : index === 1 ? 10 : 62;
      const duration = 130;

      gsap.fromTo(
        square,
        { rotation: baseRotation },
        {
          rotation: baseRotation + 360,
          duration,
          repeat: -1,
          ease: "none",
        }
      );
    });

    return () => {
      squares.forEach((square) => gsap.killTweensOf(square));
    };
  }, []);

  useEffect(() => {
    if (phase === "input") {
      inputRef.current?.focus();
    }
  }, [step, phase]);

  async function submitToApi(fullName: string, city: string) {
    try {
      setIsSubmitting(true);
      setPhase("loading");
      const start = Date.now();

      const res = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            location: city,
          }),
        }
      );

      const elapsed = Date.now() - start;
      const minDuration = 2500;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      if (!res.ok) {
        console.error("API error status:", res.status);
        setPhase("input");
        return;
      }

      const data = await res.json();
      console.log("API response:", data);
      setPhase("success");
    } catch (error) {
      console.error("Error submitting to API", error);
      setPhase("input");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !value.trim() || isSubmitting || phase !== "input")
      return;

    if (step === 1) {
      setName(value.trim());
      setValue("");
      setStep(2);
    } else {
      const city = value.trim();
      setValue("");
      await submitToApi(name, city);
    }
  }

  return (
    <div
      className="relative w-full bg-white text-[#1A1B1C] overflow-hidden flex items-center justify-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
        className="absolute top-6 left-8 text-[12px] tracking-[0.10em] uppercase"
        style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
      >
        TO START ANALYSIS
      </div>

      <div className="relative w-full max-w-4xl h-[520px] flex items-center justify-center">
        <div
          ref={squareOuterRef}
          className="absolute top-1/2 left-1/2 h-[580px] w-[580px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#8F8F8F]"
          style={{ borderStyle: "dotted", opacity: 0.45 }}
        />
        <div
          ref={squareMiddleRef}
          className="absolute top-1/2 left-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#6F6F6F]"
          style={{ borderStyle: "dotted", opacity: 0.62 }}
        />
        <div
          ref={squareInnerRef}
          className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#555555]"
          style={{ borderStyle: "dotted", opacity: 0.78 }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {phase === "loading" && (
            <>
              <span
                className="mb-6 text-[16px] tracking-[0.08em] text-[#6D768A]"
                style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
              >
                Processing submission
              </span>
              <div className="flex gap-3">
                <span
                  className="h-2 w-2 rounded-full bg-[#C4C4C4] animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="h-2 w-2 rounded-full bg-[#C4C4C4] animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="h-2 w-2 rounded-full bg-[#C4C4C4] animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </>
          )}

          {phase === "success" && (
            <>
              <h2
                className="mb-2 text-[28px] text-[#1A1B1C]"
                style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
              >
                Thank you!
              </h2>
              <p
                className="text-[14px] text-[#6D768A]"
                style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
              >
                Proceed for the next step
              </p>
            </>
          )}

          {phase === "input" && (
            <>
              <span
                className="mb-3 text-[10px] tracking-[0.16em] uppercase text-[#9EAAC7]"
                style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
              >
                {step === 1 ? "CLICK TO TYPE" : "YOUR CITY NAME"}
              </span>

              <div className="border-b border-[#A7A7A7] pb-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={step === 1 ? "Introduce Yourself" : "Your city name"}
                  disabled={isSubmitting}
                  className="bg-transparent outline-none text-center text-[#7C7C7C] text-[40px] md:text-[56px] leading-none w-[320px] md:w-[520px]"
                  style={{
                    fontFamily: "Roobert TRIAL, sans-serif",
                    fontWeight: 300,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="absolute left-12 bottom-12 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex h-11 w-11 items-center justify-center border border-[#1A1B1C] rotate-45 cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          <span className="-rotate-45 text-[10px] text-[#1A1B1C]">◄</span>
        </button>
        <span
          className="text-[12px] tracking-[0.10em] uppercase"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
        >
          BACK
        </span>
      </div>

      {phase === "success" && (
        <div className="absolute right-12 bottom-12 flex items-center gap-4">
          <span
            className="text-[12px] tracking-[0.10em] uppercase"
            style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
          >
            PROCEED
          </span>
          <button
            type="button"
            onClick={() => router.push("/result")}
            className="flex h-11 w-11 items-center justify-center border border-[#1A1B1C] rotate-45 cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            <span className="-rotate-45 text-[10px] text-[#1A1B1C]">▶</span>
          </button>
        </div>
      )}
    </div>
  );
}