// src/app/properties/[slug]/PropertyClient.tsx
"use client";

import { useState, useRef } from "react";
import { MapPin, ArrowRight, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Accept the property data as a prop from the Server Component
export default function PropertyClient({ property }: { property: any }) {
  // 1. Setup the gallery data and state
  const galleryImages = property.gallery || [
    property?.image,
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  ];

  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // 2. GSAP animation for the crossfade effect
  useGSAP(
    () => {
      gsap.fromTo(
        mainImageRef.current,
        { opacity: 0.6, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      );
    },
    { dependencies: [activeImage] },
  );

  return (
    <div className="w-full bg-background min-h-screen pt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Breadcrumb / Nav */}
        <Link
          href="/properties"
          className="text-sm text-muted hover:text-brand flex items-center gap-2 mb-10 transition-colors"
        >
          ← Back to Portfolio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* Left/Center Column: Content & Gallery */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6 leading-[1.1]">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-brand font-semibold text-lg">
                <MapPin size={20} />
                {property.location}
              </div>
            </div>

            {/* The Interactive Interactive Gallery */}
            <div className="mb-12">
              {/* Main Image Viewer */}
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-surface mb-4 border border-slate-100 dark:border-white/5">
                <div
                  ref={mainImageRef}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeImage})` }}
                />
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {galleryImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "relative shrink-0 w-24 h-24 md:w-32 md:h-32 snap-start overflow-hidden border-2 transition-all duration-300",
                      activeImage === img
                        ? "border-brand opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100",
                    )}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none text-muted">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Investment Overview
              </h3>
              <p>
                This exclusive property represents a premier opportunity in the{" "}
                {property.location} market. Designed with precision and situated
                in a high-growth corridor, it offers exceptional potential for
                both long-term capital appreciation and immediate yield.{" "}
                {property.features}
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Inquiry Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-surface p-8 border border-slate-100 dark:border-white/5">
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-widest text-muted mb-2">
                  Listing Price
                </p>
                <h2 className="text-4xl font-bold text-navy dark:text-white">
                  {property.price}
                </h2>
              </div>

              {/* Inquiry Action */}
              <div className="space-y-4">
                <Link
                  href="/contact"
                  className="w-full bg-brand text-white py-4 font-semibold flex items-center justify-center gap-2 hover:bg-navy transition-colors duration-300"
                >
                  Inquire Now <ArrowRight size={18} />
                </Link>

                <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                  <a
                    href="tel:+94112223344"
                    className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-white/20 py-3 text-sm font-medium hover:bg-surface transition-colors"
                  >
                    <Phone size={16} /> Call
                  </a>
                  <a
                    href="mailto:invest@investments.lk"
                    className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-white/20 py-3 text-sm font-medium hover:bg-surface transition-colors"
                  >
                    <Mail size={16} /> Email
                  </a>
                </div>
              </div>

              {/* Quick Spec Box */}
              <div className="mt-8 p-6 bg-white dark:bg-navy/50 border border-slate-100 dark:border-white/10">
                <h4 className="font-bold text-sm mb-4 uppercase">
                  Property Details
                </h4>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex justify-between">
                    <span>Type</span>{" "}
                    <span className="text-foreground font-medium capitalize">
                      {property.type}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Status</span>{" "}
                    <span className="text-foreground font-medium">
                      Available
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Reference</span>{" "}
                    <span className="text-foreground font-medium">
                      INV-{property.id}009
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
