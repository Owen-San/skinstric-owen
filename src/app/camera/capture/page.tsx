"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CameraCapturePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setupCamera() {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert("Camera is not supported in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsReady(true);
      } catch (error) {
        console.error("Error starting camera:", error);
        if (!cancelled) {
          alert("Unable to access camera. Please check your browser permissions.");
          router.back();
        }
      }
    }

    setupCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [router]);

  useEffect(() => {
    if (capturedPhoto === null && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch(() => undefined);
    }
  }, [capturedPhoto]);

  function handleCapture() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedPhoto(dataUrl);

    video.pause();
  }

  function handleRetake() {
    setCapturedPhoto(null);
  }

  return (
    <div
      className="relative w-full bg-[#0B1220] text-white overflow-hidden flex items-center justify-center"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="absolute left-6 md:left-10 bottom-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/result")}
          className="flex h-11 w-11 items-center justify-center border border-white/70 rotate-45 cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          <span className="-rotate-45 text-[10px]">◄</span>
        </button>
        <span
          className="text-[10px] tracking-[0.16em] uppercase text-white/80"
          style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 400 }}
        >
          BACK
        </span>
      </div>

      <div className="flex flex-col items-center gap-10 w-full px-4">
        <div className="w-full max-w-4xl aspect-video bg-black/60 border border-white/10 rounded-[18px] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04)] flex items-center justify-center">
          {capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured selfie"
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          {capturedPhoto ? (
            <button
              type="button"
              onClick={handleRetake}
              className="h-16 w-40 md:h-16 md:w-48 flex items-center justify-center border border-white/80 bg-transparent uppercase tracking-[0.25em] text-[11px] md:text-[12px] hover:bg-white/10 transition-all hover:scale-105"
              style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
            >
              RETAKE
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCapture}
              disabled={!isReady}
              className="h-16 w-40 md:h-16 md:w-48 flex items-center justify-center border border-white/80 bg-transparent uppercase tracking-[0.25em] text-[11px] md:text-[12px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-all hover:scale-105"
              style={{ fontFamily: "Roobert TRIAL, sans-serif", fontWeight: 700 }}
            >
              CAPTURE
            </button>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
