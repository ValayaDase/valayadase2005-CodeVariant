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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = Math.min(260, Math.max(130, container.clientWidth * 0.18)));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Ripple wave simulation points
    let ripples = [];
    let mouse = { x: width / 2, y: height / 2, active: false, speed: 0 };
    let lastMouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = Math.min(260, Math.max(130, container.clientWidth * 0.18));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dist = Math.hypot(currentX - lastMouse.x, currentY - lastMouse.y);
      mouse.speed = dist;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;

      // Add ripple on mouse movement
      if (dist > 4 && ripples.length < 18) {
        ripples.push({
          x: currentX,
          y: currentY,
          radius: 4,
          maxRadius: Math.min(180, width * 0.25),
          strength: Math.min(1.0, dist * 0.04 + 0.3),
          life: 1.0,
        });
      }

      lastMouse.x = currentX;
      lastMouse.y = currentY;
    };

    const handleMouseEnter = () => {
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
      time += 0.025;

      ctx.clearRect(0, 0, width, height);

      // Auto ambient ripple when not interacted with
      if (!mouse.active && Math.random() < 0.02 && ripples.length < 5) {
        ripples.push({
          x: (0.2 + Math.random() * 0.6) * width,
          y: (0.3 + Math.random() * 0.4) * height,
          radius: 2,
          maxRadius: 140,
          strength: 0.5,
          life: 1.0,
        });
      }

      // Update existing ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.2;
        r.life -= 0.016;
        if (r.life <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Compute font size to stretch beautifully across container
      const fontSize = Math.floor(width * 0.17);
      ctx.font = `italic 400 ${fontSize}px "Instrument Serif", "DM Serif Display", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "SPOTWISE";
      const centerX = width / 2;
      const centerY = height / 2 + fontSize * 0.05;

      // Draw horizontal slices with wave distortion
      const sliceCount = 38;
      const sliceHeight = height / sliceCount;

      for (let s = 0; s < sliceCount; s++) {
        const sy = s * sliceHeight;
        let waveOffsetX = 0;
        let waveOffsetY = 0;
        let brightnessBoost = 0;

        // Calculate wave effect from active ripples
        for (let r of ripples) {
          const dy = sy - r.y;
          const dist = Math.abs(dy);
          if (dist < r.radius) {
            const factor = Math.cos((dist / r.radius) * Math.PI * 0.5);
            const rippleWave = Math.sin(r.radius * 0.15 - dist * 0.1) * r.strength * r.life * 14;
            waveOffsetX += rippleWave * factor;
            brightnessBoost += factor * r.life * 0.35;
          }
        }

        // Ambient fluid sway
        const ambientWave = Math.sin(time + s * 0.2) * 2.5;
        waveOffsetX += ambientWave;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, sy, width, sliceHeight + 1);
        ctx.clip();

        // Base text in warm ivory with alpha
        const alpha = Math.min(0.95, 0.45 + brightnessBoost);
        ctx.fillStyle = `rgba(244, 241, 232, ${alpha})`;
        ctx.fillText(text, centerX + waveOffsetX, centerY + waveOffsetY);

        // Highlight sheen on wave peaks (shimmering glass/water reflection)
        if (brightnessBoost > 0.08) {
          ctx.fillStyle = `rgba(227, 235, 221, ${brightnessBoost * 0.7})`;
          ctx.fillText(text, centerX + waveOffsetX + 1, centerY + waveOffsetY - 1);
        }

        ctx.restore();
      }

      // Draw subtle luminous wave contour lines over the text when hovered
      if (ripples.length > 0) {
        ctx.save();
        for (let r of ripples) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(227, 235, 221, ${r.life * 0.2})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();
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
        className="w-full block transition-opacity duration-500"
        style={{
          filter: isHovered
            ? "drop-shadow(0 0 25px rgba(129, 148, 120, 0.25))"
            : "none",
        }}
      />
      <div className="text-center mt-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#819478]/80 font-mono">
          Hover or drag across to displace soundwave ripples
        </p>
      </div>
    </div>
  );
}
