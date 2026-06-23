"use client";

import { useRef } from "react";
import Link from "next/link";
import { TrendingUp, Shield, BarChart, ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

const pillars = [
  {
    title: "Data-Driven Acquisitions",
    description:
      "We don't rely on intuition. Every asset in our portfolio is vetted through rigorous market analytics, demographic trends, and yield forecasting.",
    icon: BarChart,
  },
  {
    title: "Exclusive Market Access",
    description:
      "Through decades of relationship-building, we provide our clients access to off-market lands and commercial spaces before they reach the public sector.",
    icon: Shield,
  },
  {
    title: "End-to-End Management",
    description:
      "From initial legal due diligence to post-purchase property management, our team handles the entire lifecycle of your investment.",
    icon: TrendingUp,
  },
];

const team = [
  {
    name: "Hasheen De Silva",
    role: "Head of Acquisitions",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
  },
  {
    name: "Nelaka Fernando",
    role: "Commercial Real Estate Lead",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Sanjuka Kumara",
    role: "Senior Portfolio Manager",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Pasindu Attale",
    role: "Legal & Compliance Director",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1974&auto=format&fit=crop",
  },
];

// Extracted stats data to separate numbers from text for the animation
const statsData = [
  { prefix: "LKR ", value: 12, suffix: "B+", label: "Assets Managed" },
  { prefix: "", value: 15, suffix: "+", label: "Years Experience" },
  { prefix: "", value: 300, suffix: "+", label: "Properties Acquired" },
  { prefix: "", value: 100, suffix: "%", label: "Client Discretion" },
];

export default function ExpertisePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Hero Text Stagger
      tl.from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Number Counting Animation
      statsRefs.current.forEach((el, index) => {
        if (!el) return;
        const targetValue = statsData[index].value;
        const counter = { val: 0 };

        gsap.to(counter, {
          val: targetValue,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%", // Triggers when the stat block is 85% down the screen
          },
          onUpdate: () => {
            // Use Math.ceil to ensure it ends on a whole number
            el.innerText = Math.ceil(counter.val).toString();
          },
        });
      });

      // Pillars Scroll Animation
      gsap.from(".pillar-card", {
        scrollTrigger: {
          trigger: ".pillars-section",
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });

      // Team Scroll Animation
      gsap.from(".team-card", {
        scrollTrigger: {
          trigger: ".team-section",
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="w-full bg-background min-h-screen md:pb-24"
    >
      {/* 1. Hero Section (Stats removed from here) */}
      <section className="md:pt-40 pt-36 pb-20 border-b border-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-6">
            <div>
              <h1 className="hero-text text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] ">
                Mastering the <br />{" "}
                <span className="text-brand">Sri Lankan market.</span>
              </h1>
            </div>
          </div>
          <div className="flex items-end">
            <p className="text-lg text-muted max-w-2xl md:mb-8 mb-4">
              We bridge the gap between high-net-worth capital and Sri Lanka's
              most lucrative real estate assets. Through rigorous data analysis
              and exclusive network access, we secure properties that guarantee
              elite yields.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Impact Stats Section (Matched to Reference Image) */}
      <section className="w-full bg-navy md:py-24 py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {statsData.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-5xl md:text-7xl lg:text-8xl font-black text-white/50 mb-4 tracking-tighter flex items-baseline">
                  {stat.prefix && (
                    <span className="text-4xl md:text-5xl mr-1">
                      {stat.prefix}
                    </span>
                  )}
                  <span
                    ref={(el) => {
                      statsRefs.current[i] = el;
                    }}
                  >
                    0
                  </span>
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                {/* Highly tracked uppercase font for the labels beneath */}
                <p className="text-xs md:text-sm font-bold text-white/60 uppercase tracking-[0.15em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Pillars Section */}
      <section className="pillars-section py-24 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              The investments.lk Edge
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="pillar-card bg-background  p-10 border border-white/5"
                >
                  <div className="w-14 h-14 bg-brand/10 text-brand flex items-center justify-center mb-8">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. The Team Section */}
      <section className="team-section py-24 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Our investment experts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="team-card group relative h-[450px] overflow-hidden bg-surface"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-white/80">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimalist CTA */}
      <section className="py-24 bg-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to secure your next asset?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Schedule a private consultation with our acquisitions team today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-brand text-white px-10 py-4 font-semibold hover:bg-white hover:text-navy transition-colors duration-300"
          >
            Contact us <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
