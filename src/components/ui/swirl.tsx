"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface SwirlProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount: number;
  baseTTL?: number;
  rangeTTL?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseSize?: number;
  rangeSize?: number;
  baseHue?: number;
  rangeHue?: number;
  backgroundColor?: string;
}

const Swirl: React.FC<SwirlProps> = (props) => {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const particleCount = isMobile
    ? Math.floor(props.particleCount / 2)
    : props.particleCount ?? 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const baseTTL = props.baseTTL ?? 100;
  const rangeTTL = props.rangeTTL ?? 500;
  const baseSpeed = props.baseSpeed ?? 0.1;
  const rangeSpeed = props.rangeSpeed ?? 1;
  const baseSize = props.baseSize ?? 2;
  const rangeSize = props.rangeSize ?? 10;
  const baseHue = resolvedTheme === "light" ? 220 : props.baseHue ?? 10;
  const rangeHue = resolvedTheme === "light" ? 40 : props.rangeHue ?? 100;
  // const backgroundColor = props.backgroundColor ?? 'hsla(60,50%,3%,1)';
  // const backgroundColor = resolvedTheme === "light" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.5)';
  const backgroundColor = "transparent";
  let particleProps = new Float32Array(particlePropsLength);
  const center: [number, number] = [0, 0];

  const HALF_PI: number = 0.5 * Math.PI;
  const rand = (n: number): number => n * Math.random();
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number =>
    (1 - speed) * n1 + speed * n2;

  const angle = (x1: number, y1: number, x2: number, y2: number): number =>
    Math.atan2(y2 - y1, x2 - x1);

  const setup = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (canvas && container) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        resize(canvas);
        initParticles();
        draw(canvas, ctx);
      }
    }
  };

  const initParticles = () => {
    particleProps = new Float32Array(particlePropsLength);

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i);
    }
  };

  const initParticle = (i: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = rand(canvas.width);
    const y = rand(canvas.height);
    const theta = angle(x, y, center[0], center[1]);
    const vx = Math.cos(theta) * 6;
    const vy = Math.sin(theta) * 6;
    const life = 0;
    const ttl = baseTTL + rand(rangeTTL);
    const speed = baseSpeed + rand(rangeSpeed);
    const size = baseSize + rand(rangeSize);
    const hue = baseHue + rand(rangeHue);

    particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue], i);
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles(ctx);
    renderGlow(canvas, ctx);
    render(canvas, ctx);

    window.requestAnimationFrame(() => draw(canvas, ctx));
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;

    const x = particleProps[i];
    const y = particleProps[i2];
    const theta = angle(x!, y!, center[0], center[1]) + 0.75 * HALF_PI;
    const vx = lerp(particleProps[i3]!, 2 * Math.cos(theta), 0.05);
    const vy = lerp(particleProps[i4]!, 2 * Math.sin(theta), 0.05);
    let life = particleProps[i5] ?? 0;
    const ttl = particleProps[i6] ?? 0;
    const speed = particleProps[i7];
    const x2 = x! + vx * speed!;
    const y2 = y! + vy * speed!;
    const size = particleProps[i8];
    const hue = particleProps[i9];

    drawParticle(x!, y!, theta, life, ttl, size!, hue!, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    if (life > ttl) initParticle(i);
  };

  const drawParticle = (
    x: number,
    y: number,
    theta: number,
    life: number,
    ttl: number,
    size: number,
    hue: number,
    ctx: CanvasRenderingContext2D,
  ) => {
    const xRel = x - 0.5 * size;
    const yRel = y - 0.5 * size;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = 1;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.translate(xRel, yRel);
    ctx.rotate(theta);
    ctx.translate(-xRel, -yRel);
    ctx.strokeRect(xRel, yRel, size, size);
    ctx.closePath();
    ctx.restore();
  };

  const resize = (
    canvas: HTMLCanvasElement,
  ) => {
    const { innerWidth, innerHeight } = window;

    canvas.width = innerWidth / 2;
    canvas.height = innerHeight / 2;

    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
  };

  const renderGlow = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) => {
    ctx.save();
    ctx.filter = "blur(2px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(2px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const render = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        resize(canvas);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={containerRef}
      className={cn(
        "absolute inset-0 z-[-1] flex h-screen w-full items-center justify-center",
        props.className,
      )}
    >
      <canvas ref={canvasRef} className="z-[-1] size-full" />
      {props.children}
    </motion.div>
  );
};

export default Swirl;
