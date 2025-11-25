"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import Image from "next/image";

export default function ResultPage() {
  const router = useRouter();

  const leftOuterRef = useRef<HTMLDivElement | null>(null);
  const leftMiddleRef = useRef<HTMLDivElement | null>(null);
  const leftInnerRef = useRef<HTMLDivElement | null>(null);

  const rightOuterRef = useRef<HTMLDivElement | null>(null);
  const rightMiddleRef = useRef<HTMLDivElement | null>(null);
  const rightInnerRef = useRef<HTMLDivElement | null>(null);

  const loadingOuterRef = useRef<HTMLDivElement | null>(null);
  const loadingMiddleRef = useRef<HTMLDivElement | null>(null);
  const loadingInnerRef = useRef<HTMLDivElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCameraDialog, setShowCameraDialog] = useState(false);

  useEffect(() => {
    const squares = [
      leftOuterRef.current,
      leftMiddleRef.current,
      leftInnerRef.current,
      rightOuterRef.current,
      rightMiddleRef.current,
      rightInnerRef.current,
    ].filter(Boolean) as HTMLDivElement[];

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

    return () => {
      squares.forEach((square) => gsap.killTweensOf(square));
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const squares = [
      loadingOuterRef.current,
      loadingMiddleRef.current,
      loadingInnerRef.current,
    ].filter(Boolean) as HTMLDivElement[];

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

    return () => {
      squares.forEach((square) => gsap.killTweensOf(square));
    };
  }, [isLoading]);

  function handleGalleryClick() {
    fileInputRef.current?.click();
  }

  function handleAllowCamera() {
    setShowCameraDialog(false);
    router.push("/camera");
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setHasUploaded(true);

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const result = reader.result as string;
        const base64 = result.split(",")[1] ?? "";

        setIsLoading(true);

        const response = await fetch(
          "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to analyze image");
        }

        await response.json();

        await new Promise((resolve) => setTimeout(resolve, 3500));

        alert("Image analyzed successfully!");
        router.push("/select");

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        alert("There was a problem analyzing your image. Please try again.");
      }
    };

    reader.readAsDataURL(file);
  }

  function handleCameraClick() {
    setShowCameraDialog(true);
  }

  return (
    <div
      className="relative w-full bg-white text-[#1A1B1C] overflow-hidden flex items-center justify-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className="absolute top-6 left-8 text-[12px] tracking-[0.10em] uppercase"
        style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
      >
        TO START ANALYSIS
      </div>

      <div className="absolute top-10 right-6 md:right-10 flex flex-col items-start gap-2 z-30">
        <span
          className="text-[10px] tracking-[0.16em] uppercase text-[#1A1B1C]"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
        >
          PREVIEW
        </span>
        <div className="h-[96px] w-[96px] md:h-[112px] md:w-[112px] border border-[#D4D4D4] overflow-hidden">
          {previewImage && (
            <Image
              src={previewImage}
              alt="Preview"
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {!hasUploaded && (
        <div className="flex w-full max-w-[1350px] items-center justify-between px-4 md:px-10 lg:px-32 mt-28 md:mt-32 lg:-mt-3 flex-col lg:flex-row gap-16 lg:gap-0">
          <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] flex flex-col items-center justify-center">
            <div
              ref={leftOuterRef}
              className="absolute top-1/2 left-1/2 h-[240px] w-[240px] md:h-[300px] md:w-[300px] lg:h-[380px] lg:w-[380px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#8F8F8F]"
              style={{ borderStyle: "dotted", opacity: 0.22 }}
            />
            <div
              ref={leftMiddleRef}
              className="absolute top-1/2 left-1/2 h-[210px] w-[210px] md:h-[270px] md:w-[270px] lg:h-[340px] lg:w-[340px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#6F6F6F]"
              style={{ borderStyle: "dotted", opacity: 0.34 }}
            />
            <div
              ref={leftInnerRef}
              className="absolute top-1/2 left-1/2 h-[180px] w-[180px] md:h-[240px] md:w-[240px] lg:h-[300px] lg:w-[300px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#555555]"
              style={{ borderStyle: "dotted", opacity: 0.44 }}
            />

            <div className="relative z-10 flex items-center justify-center">
              <button
                type="button"
                onClick={handleCameraClick}
                className="h-[140px] w-[140px] md:h-[160px] md:w-[160px] lg:h-[176px] lg:w-[176px] flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer"
              >
                <Image
                  src="/camera-icon.webp"
                  alt="Camera Icon"
                  width={136}
                  height={136}
                  className="w-[110px] h-[110px] md:w-[120px] md:h-[120px] lg:w-[136px] lg:h-[136px]"
                />
              </button>
            </div>

            <svg
              className="absolute inset-0 pointer-events-none hidden lg:block"
              viewBox="0 0 400 400"
            >
              <line
                x1="200"
                y1="200"
                x2="320"
                y2="165"
                stroke="#1A1B1C"
                strokeWidth="1"
              />
              <circle cx="320" cy="165" r="3" fill="#1A1B1C" />
            </svg>

            <div
              className="absolute hidden lg:block text-[10px] md:text-[11px] tracking-[0.16em] uppercase leading-[1.4] text-[#1A1B1C] whitespace-nowrap"
              style={{
                top: 140,
                left: 335,
                fontFamily: "Roobert TRIAL, sans-serif",
              }}
            >
              <div>ALLOW A.I.</div>
              <div>TO SCAN YOUR FACE</div>
            </div>

            <div
              className="mt-6 lg:hidden text-[10px] md:text-[11px] tracking-[0.16em] uppercase leading-[1.4] text-[#1A1B1C] text-center"
              style={{ fontFamily: "Roobert TRIAL, sans-serif" }}
            >
              <div>ALLOW A.I.</div>
              <div>TO SCAN YOUR FACE</div>
            </div>
          </div>

          <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] flex flex-col items-center justify-center">
            <div
              ref={rightOuterRef}
              className="absolute top-1/2 left-1/2 h=[240px] w-[240px] md:h-[300px] md:w-[300px] lg:h-[380px] lg:w-[380px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#8F8F8F]"
              style={{ borderStyle: "dotted", opacity: 0.22 }}
            />
            <div
              ref={rightMiddleRef}
              className="absolute top-1/2 left-1/2 h-[210px] w-[210px] md:h-[270px] md:w-[270px] lg:h-[340px] lg:w-[340px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#6F6F6F]"
              style={{ borderStyle: "dotted", opacity: 0.34 }}
            />
            <div
              ref={rightInnerRef}
              className="absolute top-1/2 left-1/2 h-[180px] w-[180px] md:h-[240px] md:w-[240px] lg:h-[300px] lg:w-[300px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#555555]"
              style={{ borderStyle: "dotted", opacity: 0.44 }}
            />

            <div className="relative z-10 flex items-center justify-center">
              <button
                type="button"
                onClick={handleGalleryClick}
                className="h-[140px] w-[140px] md:h-[160px] md:w-[160px] lg:h-[176px] lg:w-[176px] flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer"
              >
                <Image
                  src="/gallery-icon.webp"
                  alt="Gallery Icon"
                  width={136}
                  height={136}
                  className="w-[110px] h-[110px] md:w-[120px] md:h-[120px] lg:w-[136px] lg:h-[136px]"
                />
              </button>
            </div>

            <svg
              className="absolute inset-0 pointer-events-none hidden lg:block"
              viewBox="0 0 400 400"
            >
              <line
                x1="200"
                y1="200"
                x2="80"
                y2="240"
                stroke="#1A1B1C"
                strokeWidth="1"
              />
              <circle cx="80" cy="240" r="3" fill="#1A1B1C" />
            </svg>

            <div
              className="absolute hidden lg:block text-[10px] md:text-[11px] tracking-[0.16em] uppercase leading-[1.4] text-[#1A1B1C] whitespace-nowrap text-right"
              style={{
                top: 238,
                left: -75,
                fontFamily: "Roobert TRIAL, sans-serif",
              }}
            >
              <div>ALLOW A.I.</div>
              <div>TO ACCESS GALLERY</div>
            </div>

            <div
              className="mt-6 lg:hidden text-[10px] md:text-[11px] tracking-[0.16em] uppercase leading-[1.4] text-[#1A1B1C] text-center"
              style={{ fontFamily: "Roobert TRIAL, sans-serif" }}
            >
              <div>ALLOW A.I.</div>
              <div>TO ACCESS GALLERY</div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute left-6 md:left-12 bottom-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/testing")}
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

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
          <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">
            <div
              ref={loadingOuterRef}
              className="absolute top-1/2 left-1/2 h-[240px] w-[240px] md:h-[300px] md:w-[300px] lg:h-[380px] lg:w-[380px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#8F8F8F]"
              style={{ borderStyle: "dotted", opacity: 0.22 }}
            />
            <div
              ref={loadingMiddleRef}
              className="absolute top-1/2 left-1/2 h-[210px] w-[210px] md:h-[270px] md:w-[270px] lg:h-[340px] lg:w-[340px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#6F6F6F]"
              style={{ borderStyle: "dotted", opacity: 0.34 }}
            />
            <div
              ref={loadingInnerRef}
              className="absolute top-1/2 left-1/2 h-[180px] w-[180px] md:h-[240px] md:w-[240px] lg:h-[300px] lg:w-[300px] -translate-x-1/2 -translate-y-1/2 border-2 border-[#555555]"
              style={{ borderStyle: "dotted", opacity: 0.44 }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div
                className="text-[12px] tracking-[0.18em] uppercase"
                style={{
                  fontFamily: "Roobert TRIAL, sans-serif",
                  fontWeight: 700,
                }}
              >
                PREPARING YOUR ANALYSIS...
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#C4C4C4]" />
                <span className="h-2 w-2 rounded-full bg-[#C4C4C4]" />
                <span className="h-2 w-2 rounded-full bg-[#C4C4C4]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {showCameraDialog && (
        <div className="absolute inset-0 z-30 flex items-start justify-center pt-48">
          <div className="w-[360px] max-w-[90%] shadow-lg">
            <div
              className="bg-[#1A1B1C] text-white px-8 py-6 text-[12px] tracking-[0.16em] uppercase"
              style={{
                fontFamily: "Roobert TRIAL, sans-serif",
                fontWeight: 700,
              }}
            >
              ALLOW A.I. TO ACCESS YOUR CAMERA
            </div>
            <div
              className="bg-[#101216] text-[11px] text-white tracking-[0.16em] uppercase flex justify-between items-center px-8 py-4"
              style={{ fontFamily: "Roobert TRIAL, sans-serif" }}
            >
              <button
                type="button"
                className="cursor-pointer opacity-80 hover:opacity-100"
                onClick={() => setShowCameraDialog(false)}
              >
                DENY
              </button>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleAllowCamera}
              >
                ALLOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
