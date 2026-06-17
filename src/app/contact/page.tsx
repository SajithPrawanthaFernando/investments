"use client";

import { useRef } from "react";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Animate the left column (Headings and Contact Details)
      tl.from(leftColumnRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      });

      // 2. Animate the right column (Form Inputs)
      tl.from(
        formRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.4", // Start slightly before the left column finishes
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="w-full bg-background min-h-screen pt-32 pb-24"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Direct Contact Details */}
          <div ref={leftColumnRef} className="flex flex-col justify-center">
            <span className="inline-block text-brand font-bold tracking-widest uppercase text-sm mb-6">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-8">
              Let's discuss your next investment.
            </h1>
            <p className="text-lg text-muted mb-12 max-w-md">
              Whether you are looking to acquire a high-yield asset or list a
              premium property, our acquisitions team is ready to assist you.
            </p>

            <div className="space-y-8 border-t border-surface pt-12">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface flex items-center justify-center text-brand shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    Corporate Office
                  </h4>
                  <p className="text-foreground font-medium text-lg">
                    Level 12, West Tower,
                    <br />
                    World Trade Center,
                    <br />
                    Colombo 01, Sri Lanka
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface flex items-center justify-center text-brand shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    Direct Line
                  </h4>
                  <a
                    href="tel:+94112345678"
                    className="text-foreground font-medium text-lg hover:text-brand transition-colors"
                  >
                    +94 11 234 5678
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface flex items-center justify-center text-brand shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-1">
                    General Inquiries
                  </h4>
                  <a
                    href="mailto:invest@investments.lk"
                    className="text-foreground font-medium text-lg hover:text-brand transition-colors"
                  >
                    invest@investments.lk
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Inquiry Form */}
          <div className="bg-surface p-8 md:p-12 lg:p-16">
            <form
              ref={formRef}
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-bold uppercase tracking-wider text-foreground"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="w-full bg-background border border-slate-200 dark:border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50"
                  required
                />
              </div>

              {/* Grid for Email and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-bold uppercase tracking-wider text-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full bg-background border border-slate-200 dark:border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-bold uppercase tracking-wider text-foreground"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+94 77 123 4567"
                    className="w-full bg-background border border-slate-200 dark:border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50"
                  />
                </div>
              </div>

              {/* Asset Class Interest */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="interest"
                  className="text-sm font-bold uppercase tracking-wider text-foreground"
                >
                  Primary Interest
                </label>
                <div className="relative">
                  <select
                    id="interest"
                    className="w-full bg-background border border-slate-200 dark:border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 appearance-none rounded-none"
                    required
                  >
                    <option value="" disabled selected>
                      Select an asset class...
                    </option>
                    <option value="lands">Exclusive Lands</option>
                    <option value="apartments">Luxury Apartments</option>
                    <option value="houses">Residential Houses</option>
                    <option value="commercial">Commercial Buildings</option>
                    <option value="list">I want to list a property</option>
                  </select>
                  {/* Custom Arrow for Select to maintain boxy design */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-muted">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-bold uppercase tracking-wider text-foreground"
                >
                  Additional Details
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your investment criteria or property specifications..."
                  className="w-full bg-background border border-slate-200 dark:border-white/10 px-5 py-4 text-foreground outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all duration-300 placeholder:text-muted/50 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group mt-4 w-full bg-brand text-white py-5 font-bold tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-navy transition-colors duration-300"
              >
                Submit Inquiry
                <ArrowRight
                  size={20}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
