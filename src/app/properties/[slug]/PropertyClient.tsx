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

// Utility to format raw database statuses into display text
const formatStatus = (status: string) => {
  if (!status) return "Available";
  switch (status) {
    case "under_offer":
      return "Under Offer";
    case "sold":
      return "Sold";
    case "rented":
      return "Rented";
    case "active":
      return "Available";
    default:
      return status;
  }
};

export default function PropertyClient({ property }: { property: any }) {
  // 1. Setup the gallery data using the new Supabase `images` array
  // We provide a fallback image just in case an admin uploads a property with zero images
  const galleryImages =
    property.images && property.images.length > 0
      ? property.images
      : [
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
    <div className="w-full bg-background min-h-screen pt-24 md:pb-24">
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

              {/* Clickable Location Link */}
              <div className="flex items-center gap-2 text-brand font-semibold text-lg">
                <MapPin size={20} />
                {property.locationUrl ? (
                  <a
                    href={property.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline underline-offset-4 transition-all duration-300"
                    title="View on Google Maps"
                  >
                    {property.location}
                  </a>
                ) : (
                  <span>{property.location}</span>
                )}
              </div>
            </div>

            {/* The Interactive Gallery */}
            <div className="mb-12">
              {/* Main Image Viewer */}
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-surface mb-4 border border-white/5">
                <div
                  ref={mainImageRef}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeImage})` }}
                />
              </div>

              {/* Thumbnail Strip (Only show if there are multiple images) */}
              {galleryImages.length > 1 && (
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
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none text-muted">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Investment Overview
              </h3>
              <p className="whitespace-pre-wrap">{property.description}</p>
            </div>
          </div>

          {/* Right Column: Sticky Inquiry Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-surface p-8 border border-white/5 shadow-xl shadow-black/20">
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-widest text-muted mb-2">
                  Listing Price
                </p>
                {/* LKR Format Wrapper - Strips out accidental $ signs from database */}
                <h2 className="text-4xl font-bold text-white flex items-baseline gap-2">
                  <span className="text-xl text-brand">LKR</span>
                  {property.price?.replace(/^\$/, "")}
                </h2>
              </div>

              {/* Inquiry Action */}
              <div className="space-y-4">
                <Link
                  href="/contact"
                  className="w-full hover:bg-white hover:text-navy bg-brand text-white py-4 font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  Inquire Now <ArrowRight size={18} />
                </Link>

                <div className="flex gap-4 pt-6 border-t border-white/10">
                  <a
                    href="tel:+94112345678"
                    className="flex-1 flex items-center justify-center gap-2 border border-white/20 py-3 text-sm font-medium hover:bg-surface transition-colors text-white"
                  >
                    <Phone size={16} /> Call
                  </a>
                  <a
                    href="mailto:invest@investments.lk"
                    className="flex-1 flex items-center justify-center gap-2 border border-white/20 py-3 text-sm font-medium hover:bg-surface transition-colors text-white"
                  >
                    <Mail size={16} /> Email
                  </a>
                </div>
              </div>

              {/* Quick Spec Box */}
              <div className="mt-8 p-6 bg-navy/50 border border-white/10">
                <h4 className="font-bold text-sm mb-4 uppercase text-white">
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
                    <span
                      className={cn(
                        "font-bold uppercase tracking-wider text-[10px] px-2 py-0.5",
                        property.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : property.status === "sold"
                            ? "bg-brand/20 text-brand"
                            : property.status === "rented"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-yellow-500/20 text-yellow-400",
                      )}
                    >
                      {formatStatus(property.status)}
                    </span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Reference</span>{" "}
                    <span className="text-foreground font-medium text-xs">
                      {property.id.split("-")[0].toUpperCase()}
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
