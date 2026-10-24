"use client";

import { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { AnimatedLogo } from "@/components/common";

function FooterSmoke({ targetRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const footer = targetRef.current;
    const canvas = canvasRef.current;

    if (!footer || !canvas) return;

    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );

    let cleanupEffect = () => {};

    function configure() {
      cleanupEffect();
      cleanupEffect = () => {};

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Keep touch/reduced-motion experience static.
      if (!media.matches) return;

      let disposed = false;
      let visible = false;
      let frame = 0;
      let lastFrameTime = 0;
      let lastEmitTime = 0;

      let width = 1;
      let height = 1;
      let dpr = 1;

      let pointer = null;

      const particles = [];
      const MAX_PARTICLES = 65;

      // Cached soft smoke texture: no image assets required.
      const sprite = document.createElement("canvas");
      sprite.width = 192;
      sprite.height = 192;

      const spriteCtx = sprite.getContext("2d");

      if (!spriteCtx) return;

      const clouds = [
        [96, 96, 83, 0.58],
        [68, 83, 56, 0.24],
        [120, 72, 47, 0.21],
        [115, 123, 54, 0.2],
      ];

      clouds.forEach(([x, y, radius, opacity]) => {
        const gradient = spriteCtx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius
        );

        gradient.addColorStop(
          0,
          `rgba(108, 134, 93, ${opacity})`
        );

        gradient.addColorStop(
          0.4,
          `rgba(129, 148, 120, ${opacity * 0.5})`
        );

        gradient.addColorStop(
          0.75,
          `rgba(129, 148, 120, ${opacity * 0.12})`
        );

        gradient.addColorStop(
          1,
          "rgba(129, 148, 120, 0)"
        );

        spriteCtx.fillStyle = gradient;

        spriteCtx.fillRect(
          x - radius,
          y - radius,
          radius * 2,
          radius * 2
        );
      });

      function resize() {
        if (disposed) return;

        width = Math.max(footer.clientWidth, 1);
        height = Math.max(footer.clientHeight, 1);

        dpr = Math.min(window.devicePixelRatio || 1, 1.25);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        wake();
      }

      function addSmoke(
        clientX,
        clientY,
        count = 3,
        velocityX = 0,
        velocityY = 0
      ) {
        if (disposed || !visible || document.hidden) return;

        const rect = footer.getBoundingClientRect();

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (
          x < 0 ||
          y < 0 ||
          x > rect.width ||
          y > rect.height
        ) {
          return;
        }

        for (let index = 0; index < count; index += 1) {
          particles.push({
            x: x + (Math.random() - 0.5) * 12,
            y: y + (Math.random() - 0.5) * 12,

            vx:
              velocityX * 0.25 +
              (Math.random() - 0.5) * 15,

            vy:
              velocityY * 0.15 -
              10 -
              Math.random() * 16,

            size: 35 + Math.random() * 30,
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.5,

            age: 0,
            life: 1.4 + Math.random() * 0.7,

            stretch: 0.8 + Math.random() * 0.4,
          });
        }

        if (particles.length > MAX_PARTICLES) {
          particles.splice(
            0,
            particles.length - MAX_PARTICLES
          );
        }

        wake();
      }

      function draw(now) {
        frame = 0;

        if (disposed || !visible || document.hidden) {
          lastFrameTime = 0;
          return;
        }

        const delta = lastFrameTime
          ? Math.min((now - lastFrameTime) / 1000, 0.04)
          : 1 / 60;

        lastFrameTime = now;

        ctx.clearRect(0, 0, width, height);

        for (
          let index = particles.length - 1;
          index >= 0;
          index -= 1
        ) {
          const particle = particles[index];

          particle.age += delta;

          if (particle.age >= particle.life) {
            particles.splice(index, 1);
            continue;
          }

          particle.x +=
            (particle.vx +
              Math.sin(particle.age * 2.1 + particle.rotation) *
                5) *
            delta;

          particle.y += particle.vy * delta;
          particle.rotation += particle.spin * delta;

          const progress = particle.age / particle.life;

          const fadeIn = Math.min(
            1,
            particle.age / 0.12
          );

          const fadeOut = Math.pow(1 - progress, 1.6);

          const size =
            particle.size * (1 + progress * 1.1);

          ctx.save();

          ctx.globalAlpha = fadeIn * fadeOut * 0.42;

          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);

          ctx.scale(
            1 + progress * 0.15,
            particle.stretch
          );

          ctx.drawImage(
            sprite,
            -size,
            -size,
            size * 2,
            size * 2
          );

          ctx.restore();
        }

        if (particles.length > 0) {
          frame = requestAnimationFrame(draw);
        } else {
          lastFrameTime = 0;
        }
      }

      function wake() {
        if (
          disposed ||
          !visible ||
          document.hidden ||
          frame
        ) {
          return;
        }

        frame = requestAnimationFrame(draw);
      }

      function onPointerMove(event) {
        if (event.pointerType === "touch") return;

        const now = performance.now();

        const previous = pointer;

        pointer = {
          x: event.clientX,
          y: event.clientY,
        };

        if (now - lastEmitTime < 20) return;

        lastEmitTime = now;

        const movementX = previous
          ? Math.max(
              -30,
              Math.min(30, event.clientX - previous.x)
            )
          : 0;

        const movementY = previous
          ? Math.max(
              -30,
              Math.min(30, event.clientY - previous.y)
            )
          : 0;

        addSmoke(
          event.clientX,
          event.clientY,
          3,
          movementX,
          movementY
        );
      }

      function onPointerLeave() {
        pointer = null;
      }

      function onScroll() {
        if (!visible || document.hidden) return;

        const now = performance.now();

        if (now - lastEmitTime < 45) return;

        const rect = footer.getBoundingClientRect();

        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(
          rect.bottom,
          window.innerHeight
        );

        if (visibleBottom <= visibleTop) return;

        // Use the pointer position when available.
        // Otherwise emit gently within the visible footer.
        const clientX =
          pointer?.x ?? window.innerWidth * 0.5;

        const clientY =
          pointer?.y ??
          (visibleTop + visibleBottom) / 2;

        lastEmitTime = now;

        addSmoke(clientX, clientY, 2);
      }

      function onVisibilityChange() {
        if (document.hidden) {
          if (frame) cancelAnimationFrame(frame);

          frame = 0;
          lastFrameTime = 0;
        } else {
          wake();
        }
      }

      const resizeObserver = new ResizeObserver(resize);

      resizeObserver.observe(footer);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;

          if (visible) {
            wake();
          } else {
            if (frame) cancelAnimationFrame(frame);

            frame = 0;
            lastFrameTime = 0;
            particles.length = 0;

            ctx.clearRect(0, 0, width, height);
          }
        },
        {
          threshold: 0,
        }
      );

      intersectionObserver.observe(footer);

      footer.addEventListener(
        "pointermove",
        onPointerMove,
        { passive: true }
      );

      footer.addEventListener(
        "pointerleave",
        onPointerLeave
      );

      window.addEventListener("scroll", onScroll, {
        passive: true,
      });

      document.addEventListener(
        "visibilitychange",
        onVisibilityChange
      );

      resize();

      cleanupEffect = () => {
        disposed = true;

        if (frame) cancelAnimationFrame(frame);

        resizeObserver.disconnect();
        intersectionObserver.disconnect();

        footer.removeEventListener(
          "pointermove",
          onPointerMove
        );

        footer.removeEventListener(
          "pointerleave",
          onPointerLeave
        );

        window.removeEventListener("scroll", onScroll);

        document.removeEventListener(
          "visibilitychange",
          onVisibilityChange
        );

        particles.length = 0;

        ctx.clearRect(0, 0, width, height);
      };
    }

    configure();

    media.addEventListener("change", configure);

    return () => {
      media.removeEventListener("change", configure);
      cleanupEffect();
    };
  }, [targetRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function Footer() {
  const footerRef = useRef(null);

  const footerLinks = {
    Product: [
      { label: "Sensory Discovery", href: "#features" },
      { label: "Quiet Meter", href: "#discovery-card" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Suitability Engine", href: "#features" },
    ],
    Telemetry: [
      { label: "Acoustic Sensors", href: "#" },
      { label: "Wi-Fi Speed Logs", href: "#" },
      { label: "Power Certainty", href: "#" },
      { label: "Daylight Index", href: "#" },
    ],
    Community: [
      { label: "Nomad Network", href: "#" },
      { label: "Submit a Spot", href: "#" },
      { label: "Acoustic Standards", href: "#" },
      { label: "Guidelines", href: "#" },
    ],
    Company: [
      { label: "About Spotwise", href: "#" },
      { label: "Manifesto", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Contact", href: "#" },
    ],
  };

  return (
    <footer
      ref={footerRef}
      aria-label="Footer"
      className="relative isolate w-full overflow-hidden border-t border-[#E8E0D2] bg-[#F5F3EC] px-4 pb-10 pt-12 text-[#20231F] sm:px-6 sm:pb-12 sm:pt-16 lg:px-8"
    >
      {/* Background smoke; never intercepts clicks. */}
      <FooterSmoke targetRef={footerRef} />

      {/* Subtle light atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(227,235,221,0.3), transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 border-b border-[#E8E0D2] pb-10 md:grid-cols-4 lg:grid-cols-6 lg:gap-10 lg:pb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <AnimatedLogo size="md" href="#" />

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#555D50]">
              Discover places that fit your work, study and focus.
              Explore the environment, compare your options and
              choose with more clarity.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="h-px w-8 bg-[#819478]/60" />

              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#7B886F]">
                The Quiet Place
              </span>
            </div>
          </div>

          {/* Navigation */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <nav
              key={title}
              aria-label={`${title} footer links`}
              className="min-w-0"
            >
              <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#263D31]">
                {title}
              </h2>

              <ul className="space-y-2.5 text-[13px] text-[#555D50]">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group relative inline-block py-0.5 transition-colors duration-200 hover:text-[#263D31] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#819478]"
                    >
                      {link.label}

                      <span
                        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#819478] transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-[10px] text-[#68725F] sm:flex-row sm:items-center sm:pt-8 sm:text-xs">
          <p>© 2026 Spotwise. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            <span>Crafted for focused minds</span>

            <Heart className="h-3.5 w-3.5 fill-[#819478] text-[#819478]" />
          </p>

          <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#87927C]">
            From chaos to clarity
          </span>
        </div>
      </div>
    </footer>
  );
}