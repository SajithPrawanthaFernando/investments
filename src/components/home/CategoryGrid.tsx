"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

const categories = [
  {
    title: "LANDS",
    href: "/properties?type=land",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop",
  },
  {
    title: "APARTMENTS",
    href: "/properties?type=apartment",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop",
  },
  {
    title: "HOUSES",
    href: "/properties?type=house",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
  },
  {
    title: "COMMERCIAL",
    href: "/properties?type=commercial",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function CategoryGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    () => {
      // Create a matchMedia instance
      let mm = gsap.matchMedia();

      // 1. Title Reveal (Happens on all screen sizes)
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // 2. DESKTOP ONLY LOGIC (min-width: 1024px matches Tailwind's 'lg' breakpoint)
      mm.add("(min-width: 1024px)", () => {
        // Stagger fade-in all at once
        gsap.from(cardsRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        });

        // The Horizontal Scroll Effect
        const track = trackRef.current;
        const wrapper = wrapperRef.current;
        if (!track || !wrapper) return;

        const getScrollAmount = () => {
          const amount = track.scrollWidth - wrapper.offsetWidth;
          return amount > 0 ? amount : 0;
        };

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 5%",
            end: () => `+=${getScrollAmount() * 1.5}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      // 3. MOBILE & TABLET ONLY LOGIC
      mm.add("(max-width: 1023px)", () => {
        // Animate each card individually as the user scrolls down the page
        cardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // Triggers when the top of the card hits 85% down the viewport
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      // CRITICAL FIX: Changed h-screen to h-auto, but added lg:h-screen so it only pins on desktop
      className="w-full bg-background py-24 overflow-hidden h-auto lg:h-screen flex items-center"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTA */}
          <div
            ref={textRef}
            // Removed sticky on mobile, kept it on desktop
            className="lg:col-span-4 xl:col-span-3 relative lg:sticky z-10"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Expansive areas of expertise
            </h2>
            <p className="text-muted text-lg mb-10 max-w-md">
              We provide customized digital real estate solutions to help you
              capture lucrative investment opportunities across Sri Lanka.
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center justify-center hover:bg-white hover:text-navy bg-brand text-white px-8 py-3 text-sm font-semibold  transition-colors duration-300"
            >
              Browse all
            </Link>
          </div>

          {/* Right Column: The Wrapper */}
          <div
            ref={wrapperRef}
            className="lg:col-span-8 xl:col-span-9 overflow-hidden"
          >
            {/* The Track */}
            <div
              ref={trackRef}
              // CRITICAL FIX: Changed to flex-col on mobile, flex-row and w-max on desktop
              className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[600px] w-full lg:w-max mt-10 lg:mt-0"
            >
              {categories.map((category, index) => (
                <Link
                  key={category.title}
                  href={category.href}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  // CRITICAL FIX: Full width & specific height on mobile. Fixed width & full height on desktop.
                  className="w-full h-[400px] sm:h-[500px] lg:w-[280px] xl:w-[320px] lg:h-full shrink-0 group relative block overflow-hidden bg-surface"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out flex justify-between items-end">
                    <div>
                      <div className="w-10 h-1 bg-brand mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">
                        {category.title}
                      </h3>
                      <p className="text-sm font-medium text-white/60 uppercase tracking-widest">
                        Explore
                      </p>
                    </div>

                    <div className="w-10 h-10 bg-transparent border border-white/30 flex items-center justify-center text-white transition-colors duration-300 group-hover:bg-brand group-hover:border-brand">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}

              {/* The Invisible Spacer (Hidden on mobile) */}
              <div className="hidden lg:block w-12 lg:w-48 shrink-0 h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
