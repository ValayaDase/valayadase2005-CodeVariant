"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveWaveTitle() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check if pointer is fine (mouse/trackpad, not touch)
    const isTouch = window.matchMedia("(hover: none)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = Math.min(280, Math.max(140, container.clientWidth * 0.19)));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Wind and light cursor trailing simulation
    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
      speed: 0,
    };

    let trail = [];
    const maxTrail = 16;

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = Math.min(280, Math.max(140, container.clientWidth * 0.19));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      if (isTouch) return;
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouse.targetX = currentX;
      mouse.targetY = currentY;
      mouse.active = true;

      // Add to trailing wind particles
      trail.push({
        x: currentX,
        y: currentY,
        radius: 35 + Math.random() * 25,
        opacity: 0.85,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      });

      if (trail.length > maxTrail) {
        trail.shift();
      }
    };

    const handleMouseEnter = () => {
      if (isTouch) return;
      mouse.active = true;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      setIsHovered(false);
    };

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let animationId;
    let time = 0;

    const render = () => {
      animationId = requestAnimationFrame(render);
      time += 0.02;

      // Smooth cursor interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Fade out trailing breeze
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity *= 0.92;
        p.radius += 0.8;
        if (p.opacity <= 0.02) {
          trail.splice(i, 1);
        }
      }

      // Compute editorial font size stretched across container
      const fontSize = Math.floor(width * 0.165);
      ctx.font = `italic 400 ${fontSize}px "Instrument Serif", "DM Serif Display", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "SPOTWISE";
      const centerX = width / 2;
      const centerY = height / 2 + fontSize * 0.04;

      // 1. Draw subtle ambient base text
      ctx.fillStyle = "rgba(244, 241, 232, 0.35)";
      ctx.fillText(text, centerX, centerY);

      // 2. Cursor Wind / Light sweep effect
      // When hovered, illuminate nearby letters with soft radial gradient and subtle horizontal breeze shift
      if (mouse.active || trail.length > 0) {
        const sliceCount = 36;
        const sliceHeight = height / sliceCount;

        for (let s = 0; s < sliceCount; s++) {
          const sy = s * sliceHeight;
          const dy = sy - mouse.y;
          const distY = Math.abs(dy);

          let breezeOffset = 0;
          let lightIntensity = 0;

          // Influence from current cursor position
          if (mouse.active && distY < 120) {
            const factor = Math.cos((distY / 120) * Math.PI * 0.5);
            breezeOffset += Math.sin(time * 3 + s * 0.25) * factor * 5;
            lightIntensity += factor * 0.65;
          }

          // Influence from trailing wind breeze
          for (let p of trail) {
            const pDistY = Math.abs(sy - p.y);
            if (pDistY < p.radius) {
              const pFactor = (1 - pDistY / p.radius) * p.opacity;
              breezeOffset += Math.sin(time * 2 + p.x * 0.05) * pFactor * 3;
              lightIntensity += pFactor * 0.25;
            }
          }

          if (lightIntensity > 0.02) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, sy, width, sliceHeight + 1);
            ctx.clip();

            // Luminous warm ivory / pale sage highlight
            const alpha = Math.min(0.98, 0.4 + lightIntensity);
            ctx.fillStyle = `rgba(244, 241, 232, ${alpha})`;
            ctx.fillText(text, centerX + breezeOffset, centerY);

            // Shimmer crest reflection
            if (lightIntensity > 0.3) {
              ctx.fillStyle = `rgba(227, 235, 221, ${lightIntensity * 0.5})`;
              ctx.fillText(text, centerX + breezeOffset + 0.8, centerY - 0.8);
            }

            ctx.restore();
          }
        }

        // Draw soft cursor atmospheric wind glow
        if (mouse.active) {
          const gradient = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            10,
            mouse.x,
            mouse.y,
            140
          );
          gradient.addColorStop(0, "rgba(227, 235, 221, 0.12)");
          gradient.addColorStop(0.5, "rgba(129, 148, 120, 0.06)");
          gradient.addColorStop(1, "rgba(38, 61, 49, 0)");

          ctx.save();
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none cursor-pointer py-4"
    >
      <span className="sr-only">SPOTWISE</span>
      <canvas
        ref={canvasRef}
        className="w-full block transition-all duration-500"
        style={{
          filter: isHovered
            ? "drop-shadow(0 0 35px rgba(227, 235, 221, 0.2))"
            : "none",
        }}
      />
      <div className="text-center mt-2">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#819478]/80 font-mono">
          Hover or move pointer across the wordmark to cast wind & illumination
        </p>
      </div>
    </div>
  );
}
