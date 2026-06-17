"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { skyline } from "@/asset";

// Array of images for the dynamic background slideshow
const bgImages = [
  skyline.src,
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop", // Luxury Apartment
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", // Commercial Building
];

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      // 1. Text & UI Reveal Animation (Runs once on load)
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        textRefs.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
        },
        "+=0.2", // Slight delay to let the page render
      );

      tl.fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.8",
      );

      // 2. Infinite Background Slideshow (Slower Ken Burns Effect)
      const bgTl = gsap.timeline({ repeat: -1 });

      // Ensure initial states are clean
      gsap.set(bgRefs.current, { opacity: 0, scale: 1, x: 0 });
      gsap.set(bgRefs.current[0], { opacity: 1 });

      // Timing variables (easy to tweak later)
      const slideDuration = 8; // Total time image moves (was 5)
      const fadeDuration = 2.5; // Time it takes to crossfade (was 1.5)

      bgRefs.current.forEach((bg, index) => {
        const nextIndex = (index + 1) % bgRefs.current.length;
        const nextBg = bgRefs.current[nextIndex];

        // Calculate timing to ensure seamless overlap
        const startTime = index === 0 ? 0 : bgTl.duration() - fadeDuration;

        // Current image: Slower scale and more subtle pan
        bgTl.to(
          bg,
          {
            scale: 1.1, // Reduced from 1.15 for a slower visual stretch
            x: index % 2 === 0 ? -15 : 15, // Reduced panning distance
            duration: slideDuration,
            ease: "none",
          },
          startTime,
        );

        // Next image: Slower crossfade in
        bgTl.to(
          nextBg,
          {
            opacity: 1,
            duration: fadeDuration,
            ease: "power2.inOut",
          },
          startTime + (slideDuration - fadeDuration),
        );

        // Reset the current image behind the scenes so it's ready for its next loop
        bgTl.set(bg, { opacity: 0, scale: 1, x: 0 }, startTime + slideDuration);
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* Dynamic Background Image Layers */}
      {bgImages.map((src, index) => (
        <div
          key={index}
          ref={(el) => {
            bgRefs.current[index] = el;
          }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${src})`,
            // Fallback opacity just in case GSAP hasn't kicked in yet
            opacity: index === 0 ? 1 : 0,
          }}
        />
      ))}

      {/* Dark Overlay - Ensures text is always crisp and readable */}
      <div className="absolute inset-0 bg-navy/60 z-[1]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-12 mt-16 pointer-events-none">
        {/* Line 1 */}
        <div className="overflow-hidden pb-2">
          <h1
            ref={(el) => {
              textRefs.current[0] = el;
            }}
            className="text-[40px] md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] "
          >
            SRI LANKA’S MOST
          </h1>
        </div>

        {/* Line 2 */}
        <div className="overflow-hidden pb-2">
          <h1
            ref={(el) => {
              textRefs.current[1] = el;
            }}
            className="text-[40px] md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] "
          >
            PROMISING REAL ESTATE
          </h1>
        </div>

        {/* Line 3 */}
        <div className="overflow-hidden pb-6">
          <h1
            ref={(el) => {
              textRefs.current[2] = el;
            }}
            className="text-[40px] md:text-6xl lg:text-7xl font-bold text-brand tracking-tight leading-[1.1] "
          >
            INVESTMENTS.
          </h1>
        </div>

        {/* Call to Action */}
        <div className="hero-cta mt-8 pointer-events-auto">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center bg-white text-navy px-10 py-4 text-sm font-semibold hover:bg-brand hover:text-white transition-colors duration-300"
          >
            Explore Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
