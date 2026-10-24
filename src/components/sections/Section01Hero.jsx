"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function HL({ children }) {
  return (
    <span
      className="hl-text relative inline-block"
      style={{
        color: "transparent",
        backgroundImage:
          "linear-gradient(#718665, #718665), linear-gradient(#FCFBF7, #FCFBF7)",
        backgroundSize: "0% 100%, 100% 100%",
        backgroundPosition: "0% 50%, 0% 50%",
        backgroundRepeat: "no-repeat",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextStroke: "0.2px rgba(227,235,221,0.2)",
      }}
    >
      {children}
    </span>
  );
}

function RevealWord({ children }) {
  return (
    <span className="inline-block overflow-hidden align-bottom py-[0.14em] -my-[0.14em]">
      <span className="hero-word inline-block">{children}</span>
    </span>
  );
}

function HeroButton({ href, children, secondary = false }) {
  const Icon = secondary ? ArrowDown : ArrowUpRight;

  return (
    <div className="hero-action-btn">
      <div className="btn-magnet inline-flex">
        <a
          href={href}
          data-direction={secondary ? "down" : "diagonal"}
          className={`hero-interactive-btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-[#FCFBF7] sm:px-6 sm:py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E3EBDD] ${secondary
            ? "border-white/30 bg-black/25 font-medium shadow-md backdrop-blur-md"
            : "border-[#819478]/50 bg-[#263D31] font-semibold shadow-lg"
            }`}
        >
          <span
            aria-hidden="true"
            className="btn-fill pointer-events-none absolute inset-0 bg-[#819478]"
            style={{ transform: "translateY(105%)" }}
          />

          <span
            aria-hidden="true"
            className="btn-sheen pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              transform: "translateX(-220%) skewX(-20deg)",
            }}
          />

          <span className="relative z-10">{children}</span>

          <span className="relative z-10 inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden">
            <span className="btn-arrow inline-flex">
              <Icon className="h-3.5 w-3.5" />
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}

export default function Section01Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const introOverlayRef = useRef(null);
  const introLogoRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "The Problem", href: "#problem" },
    { label: "Discovery Map", href: "#discovery" },
    { label: "Quiet When", href: "#quiet-when" },
    { label: "Focus Fit", href: "#focus-fit" },
    { label: "Compare", href: "#compare" },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
          finePointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { reduceMotion, finePointer } = context.conditions;
          const removeListeners = [];

          const overlay = introOverlayRef.current;
          const logo = introLogoRef.current;
          const select = gsap.utils.selector(heroRef);

          if (reduceMotion) {
            gsap.set(overlay, {
              autoAlpha: 0,
              display: "none",
            });

            gsap.set(select(".hl-text"), {
              backgroundSize: "100% 100%, 100% 100%",
            });

            return;
          }

          const addContentEntrance = (timeline, start) => {
            timeline
              .fromTo(
                select(".hero-navbar-polygon"),
                { y: -24, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                },
                start
              )
              .fromTo(
                select(".hero-word"),
                {
                  yPercent: 115,
                  opacity: 0,
                  rotation: 2,
                },
                {
                  yPercent: 0,
                  opacity: 1,
                  rotation: 0,
                  stagger: 0.055,
                  duration: 0.95,
                  ease: "power4.out",
                  clearProps: "transform,opacity",
                },
                start + 0.1
              )
              .fromTo(
                select(".hero-support-copy"),
                { y: 22, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                },
                start + 0.4
              )
              .fromTo(
                select(".hero-action-btn"),
                {
                  y: 34,
                  opacity: 0,
                  scale: 0.94,
                },
                {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  stagger: 0.14,
                  duration: 0.9,
                  ease: "back.out(1.25)",
                  clearProps: "transform,opacity",
                },
                start + 0.48
              );
          };

          if (window.__spotwiseIntroPlayed) {
            gsap.set(overlay, {
              autoAlpha: 0,
              display: "none",
            });

            const entrance = gsap.timeline();

            entrance.fromTo(
              bgRef.current,
              { scale: 1.035, opacity: 0.85 },
              {
                scale: 1,
                opacity: 1,
                duration: 1.3,
                ease: "power2.out",
              },
              0
            );

            addContentEntrance(entrance, 0.05);
          } else {
            gsap.set(overlay, {
              autoAlpha: 1,
              display: "flex",
            });

            gsap.set(select(".intro-panel"), { scaleX: 1 });

            gsap.set(bgRef.current, {
              scale: 1.08,
              opacity: 0.8,
            });

            const intro = gsap.timeline({
              onComplete: () => {
                window.__spotwiseIntroPlayed = true;
              },
            });

            intro
              .fromTo(
                logo,
                { autoAlpha: 0, y: 14, scale: 0.94 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.55,
                  ease: "power3.out",
                },
                0.08
              )
              .to(
                logo,
                {
                  autoAlpha: 0,
                  y: -10,
                  scale: 1.03,
                  duration: 0.32,
                  ease: "power2.in",
                },
                0.66
              );

            select(".intro-panel").forEach((panel, index) => {
              intro.to(
                panel,
                {
                  scaleX: 0,
                  transformOrigin:
                    index % 2 === 0 ? "left center" : "right center",
                  duration: 0.78,
                  ease: "power3.inOut",
                },
                0.72 + index * 0.055
              );
            });

            intro
              .to(
                bgRef.current,
                {
                  scale: 1,
                  opacity: 1,
                  duration: 1.4,
                  ease: "power2.out",
                },
                0.72
              )
              .set(
                overlay,
                {
                  autoAlpha: 0,
                  display: "none",
                },
                1.74
              );

            addContentEntrance(intro, 1.03);
          }

          // Gentle background depth while scrolling.
          gsap.to(bgRef.current, {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          // Subtle receding depth on hero frame as Section 2 cards slide up over it
          gsap.to(select(".hero-frame"), {
            scale: 0.96,
            opacity: 0.82,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          // Once Section 2 completely covers Hero, hide Hero so it never bleeds through later sections
          ScrollTrigger.create({
            trigger: heroRef.current,
            start: "bottom top",
            onEnter: () => {
              if (heroRef.current) heroRef.current.style.visibility = "hidden";
            },
            onLeaveBack: () => {
              if (heroRef.current) heroRef.current.style.visibility = "visible";
            },
          });

          // Color fill remains inside the word shapes.
          gsap.to(select(".hl-text"), {
            backgroundSize: "100% 100%, 100% 100%",
            duration: 1,
            stagger: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "45% top",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });

          select(".hero-interactive-btn").forEach((button) => {
            const magnet = button.parentElement;
            const fill = button.querySelector(".btn-fill");
            const arrow = button.querySelector(".btn-arrow");
            const sheen = button.querySelector(".btn-sheen");
            const down = button.dataset.direction === "down";

            let hovered = false;
            let focused = false;
            let active = false;

            const hover = gsap.timeline({
              paused: true,
              defaults: {
                duration: 0.4,
                ease: "power3.out",
              },
            });

            hover
              .to(
                button,
                {
                  y: -4,
                  scale: 1.025,
                  color: "#1B2A21",
                  borderColor: "#819478",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
                },
                0
              )
              .fromTo(
                fill,
                { yPercent: 105 },
                {
                  yPercent: 0,
                  duration: 0.45,
                  immediateRender: false,
                },
                0
              );

            const arrowMotion = gsap.timeline({ paused: true });

            arrowMotion
              .to(arrow, {
                x: down ? 0 : 17,
                y: down ? 17 : -17,
                duration: 0.18,
                ease: "power2.in",
              })
              .set(arrow, {
                x: down ? 0 : -17,
                y: down ? -17 : 17,
              })
              .to(arrow, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power3.out",
              });

            const shine = gsap.fromTo(
              sheen,
              { xPercent: -220, skewX: -20 },
              {
                xPercent: 320,
                skewX: -20,
                duration: 0.75,
                ease: "power2.inOut",
                paused: true,
                immediateRender: false,
              }
            );

            const xTo = finePointer
              ? gsap.quickTo(magnet, "x", {
                duration: 0.45,
                ease: "power3.out",
              })
              : null;

            const yTo = finePointer
              ? gsap.quickTo(magnet, "y", {
                duration: 0.45,
                ease: "power3.out",
              })
              : null;

            const update = () => {
              const nextActive = hovered || focused;

              if (nextActive === active) return;

              active = nextActive;

              if (active) {
                hover.timeScale(1).play();
                arrowMotion.restart();
                shine.restart();
              } else {
                hover.timeScale(1.2).reverse();
              }
            };

            const onEnter = (event) => {
              if (!finePointer || event.pointerType === "touch") return;

              hovered = true;
              update();
            };

            const onMove = (event) => {
              if (!finePointer || event.pointerType === "touch") return;

              const rect = button.getBoundingClientRect();

              const x =
                (event.clientX - rect.left - rect.width / 2) * 0.07;

              const y =
                (event.clientY - rect.top - rect.height / 2) * 0.12;

              xTo(gsap.utils.clamp(-6, 6, x));
              yTo(gsap.utils.clamp(-4, 4, y));
            };

            const onLeave = () => {
              hovered = false;
              xTo?.(0);
              yTo?.(0);
              update();
            };

            const onFocus = () => {
              focused = true;
              update();
            };

            const onBlur = () => {
              focused = false;
              update();
            };

            const events = [
              ["pointerenter", onEnter],
              ["pointermove", onMove],
              ["pointerleave", onLeave],
              ["focus", onFocus],
              ["blur", onBlur],
            ];

            events.forEach(([name, handler]) => {
              button.addEventListener(name, handler);
            });

            removeListeners.push(() => {
              events.forEach(([name, handler]) => {
                button.removeEventListener(name, handler);
              });
            });
          });

          return () => {
            removeListeners.forEach((remove) => remove());
          };
        }
      );
    }, heroRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="sticky top-0 z-10 w-full min-h-[100svh] h-[100svh] bg-[#263D31] p-[10px] sm:p-[12px] flex flex-col justify-between overflow-hidden"
    >
      {/* Intro: transparent container with solid shutter panels */}
      <div
        ref={introOverlayRef}
        className="fixed inset-0 z-[60] flex overflow-hidden"
        aria-hidden="true"
      >
        <div
          ref={introLogoRef}
          className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none select-none"
          style={{ opacity: 0 }}
        >
          <div className="relative w-64 sm:w-80 md:w-96 lg:w-[440px] aspect-[2172/724] drop-shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
            <Image
              src="/images/logo/b97527af-f745-457c-a0fb-ddb6d9649e8d.png"
              alt="Spotwise — The Quiet Place"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 440px"
            />
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
          {["#263D31", "#1E3227", "#263D31", "#1B2D23", "#263D31"].map(
            (color, index) => (
              <div
                key={index}
                className="intro-panel flex-1 w-full"
                style={{
                  backgroundColor: color,
                  transformOrigin:
                    index % 2 === 0 ? "left center" : "right center",
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Hero frame */}
      <div className="hero-frame relative w-full min-h-[calc(100svh-10px)] rounded-[18px] sm:rounded-[24px] border-2 border-[#819478]/0 overflow-hidden flex flex-col justify-between bg-[#263D31] origin-top will-change-transform">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            ref={bgRef}
            className="relative w-full h-[112%] -top-[6%] left-0"
          >
            <Image
              src="/images/hero/heroimage.png"
              alt="Serene Lakeside Café at Golden Hour overlooking peaceful waters"
              fill
              priority
              quality={90}
              className="object-cover object-[62%_35%] md:object-center select-none"
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#14231A]/85 via-[#1B3024]/40 via-45% to-transparent" />
        </div>

        {/* Navbar */}
        <div className="hero-navbar-polygon relative z-30 w-full flex items-start">
          <a
            href="#hero"
            className="flex items-center group shrink-0 h-[56px] md:h-[64px] pl-5 sm:pl-8 lg:pl-12 w-[160px] sm:w-[180px] md:w-[240px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] focus-visible:outline-none"
            aria-label="Spotwise Home"
          >
            <div className="relative h-7 sm:h-8 md:h-9 aspect-[2172/724] transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/logo/b97527af-f745-457c-a0fb-ddb6d9649e8d.png"
                alt="Spotwise"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
              />
            </div>
          </a>

          <div
            className="flex-1 h-[56px] md:h-[64px] bg-[#263D31] text-[#F4F1E8] flex items-center justify-between pl-8 sm:pl-10 md:pl-14 pr-3 sm:pr-8 lg:pr-12"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 30px 100%)",
            }}
          >
            <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 lg:space-x-9">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.16em] text-[#E3EBDD]/85 hover:text-white transition-colors font-mono font-medium relative group py-1"
                >
                  {link.label}

                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E3EBDD] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-3.5 ml-auto md:ml-0 shrink-0">
              <Link
                href="/sign-in"
                className="hidden lg:inline-block text-[11px] font-mono uppercase tracking-wider text-[#E3EBDD]/80 hover:text-white px-2 py-1 transition-colors"
              >
                Sign In
              </Link>

              <Link
                href="/discover"
                className="inline-flex items-center justify-center whitespace-nowrap px-3.5 sm:px-5 h-[34px] sm:h-[38px] rounded-full bg-[#FCFBF7] text-[#263D31] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-[#E3EBDD] hover:shadow-md transition-all duration-200 shrink-0 shadow-sm gap-1.5 group"
              >
                <span>Launch App</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="md:hidden p-1.5 rounded-lg text-[#FCFBF7] hover:bg-[#819478]/30 shrink-0 flex items-center justify-center transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="hero-mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-20 w-full px-5 sm:px-8 lg:px-10 flex-1 flex flex-col justify-between pt-6 sm:pt-10 pb-8 sm:pb-12">
          <div className="max-w-2xl text-left my-auto">
            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] leading-[1.18] text-[#FCFBF7] tracking-tight drop-shadow-sm">
              <span className="block font-normal">
                <RevealWord>You</RevealWord>{" "}
                <RevealWord>found</RevealWord>{" "}
                <RevealWord>a</RevealWord>{" "}
                <RevealWord>
                  <HL>place.</HL>
                </RevealWord>
              </span>

              <span className="block text-[#E3EBDD] italic mt-1 sm:mt-1.5">
                <RevealWord>But</RevealWord>{" "}
                <RevealWord>can</RevealWord>{" "}
                <RevealWord>you</RevealWord>{" "}
                <RevealWord>
                  <HL>find</HL>
                </RevealWord>{" "}
                <RevealWord>your</RevealWord>{" "}
                <RevealWord>
                  <HL>focus?</HL>
                </RevealWord>
              </span>
            </h1>
          </div>

          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pt-5">
            <div className="hero-support-copy max-w-md">
              <p className="text-xs sm:text-sm lg:text-base text-[#FCFBF7]/90 leading-relaxed font-sans drop-shadow-sm">
                Too noisy. Too crowded. Uncertain Wi-Fi. Finding the right
                place to work shouldn’t be a gamble.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:justify-end md:ml-auto">
              <HeroButton href="#discovery">
                Find your quiet place
              </HeroButton>

              <HeroButton href="#problem" secondary>
                Discover the story
              </HeroButton>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          id="hero-mobile-menu"
          className="fixed inset-0 z-50 bg-[#263D31]/95 backdrop-blur-md text-[#F4F1E8] flex flex-col pt-20 px-8 pb-10 md:hidden"
        >
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="self-end p-2 text-[#FCFBF7] mb-6"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col space-y-4 flex-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#819478] font-mono font-bold">
              Navigation Chapters
            </p>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-editorial text-2xl text-[#FCFBF7] hover:text-[#819478] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-[#819478]/30 flex flex-col gap-2.5">
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-mono uppercase text-[#E3EBDD] hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 w-full text-center py-3 rounded-full bg-[#FCFBF7] text-[#263D31] text-xs font-mono uppercase font-bold tracking-wider hover:bg-[#E3EBDD] transition-colors"
            >
              <span>Launch App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex justify-center pt-1">
              <div className="relative h-6 aspect-[2172/724] opacity-85">
                <Image
                  src="/images/logo/b97527af-f745-457c-a0fb-ddb6d9649e8d.png"
                  alt="Spotwise — The Quiet Place"
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}