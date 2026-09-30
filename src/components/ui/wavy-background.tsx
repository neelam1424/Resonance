"use client";

import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

import { cn } from "@/lib/utils";

interface WavyBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveYOffset?: number;
}

const DEFAULT_WAVE_COLORS = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#e879f9",
  "#22d3ee",
];

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  waveYOffset = 250,
  ...props
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const noise = createNoise3D();

    const waveColors = colors ?? DEFAULT_WAVE_COLORS;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let noiseTime = 0;
    let animationId: number;

    const getSpeed = () => {
      switch (speed) {
        case "slow":
          return 0.001;

        case "fast":
          return 0.002;

        default:
          return 0.001;
      }
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = (numberOfWaves: number) => {
      noiseTime += getSpeed();

      for (let i = 0; i < numberOfWaves; i++) {
        ctx.beginPath();

        ctx.lineWidth = waveWidth ?? 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];

        for (let x = 0; x < width; x += 5) {
          const y = noise(
            x / 800,
            0.3 * i,
            noiseTime
          ) * 100;

          ctx.lineTo(
            x,
            y + waveYOffset
          );
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill ?? "black";
      ctx.globalAlpha = waveOpacity;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      drawWave(5);

      animationId = requestAnimationFrame(render);
    };

    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome") &&
      !navigator.userAgent.includes("Chromium");

    if (isSafari) {
      canvas.style.filter = `blur(${blur}px)`;
    }

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    render();

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, [
    backgroundFill,
    blur,
    colors,
    speed,
    waveOpacity,
    waveWidth,
    waveYOffset,
  ]);

  return (
    <div
      className={cn(
        "relative h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      <div
        className={cn(
          "relative z-10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};