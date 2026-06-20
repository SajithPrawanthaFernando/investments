"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export default function DualCtaBlock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLAnchorElement>(null);
  const card2Ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      // Staggered slide-up animation for the two massive blocks
      gsap.from([card1Ref.current, card2Ref.current], {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // Triggers when the section is 20% visible
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="w-full bg-background pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Sharp, boxy grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[500px]">
          {/* Left Block (The Dark "Navy" Card) */}
          <Link
            href="/contact"
            ref={card1Ref}
            className="group relative flex flex-col justify-between bg-navy text-white p-10 md:p-16 overflow-hidden min-h-[400px] md:min-h-full"
          >
            {/* Subtle background overlay to add depth on hover */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />

            <div>
              <span className="inline-block border border-white/30 px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-8">
                Do you own a property we should list and feature here?
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] md:max-w-md">
                Get your property featured!
              </h2>
            </div>

            <div className="flex items-end justify-between mt-12 md:mt-0">
              <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
                Contact us!
              </p>
            </div>
          </Link>

          {/* Right Block (The Vibrant "Brand" Card) */}
          <Link
            href="/contact"
            ref={card2Ref}
            className="group relative flex flex-col justify-between bg-brand text-white p-10 md:p-16 overflow-hidden min-h-[400px] md:min-h-full"
          >
            {/* Optional: You can add an abstract wave/mesh background image here to perfectly 
              match the 3rd reference image, setting the opacity to 10% 
            */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop")',
              }}
            />

            <div className="relative z-10">
              <span className="inline-block bg-navy px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-8">
                Get in touch
              </span>
              <p className="text-lg text-white/90 mb-4">
                Explore investment options aligned with your budget and risk
                comfort.
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-md">
                Speak to our experts.
              </h2>
            </div>

            {/* The circular arrow button from your reference */}
            <div className="relative z-10 flex justify-end mt-12 md:mt-0">
              <div className="w-16 h-16 bg-white text-brand rounded-full flex items-center justify-center transform group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform duration-500 ease-out">
                <ArrowUpRight size={28} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
