"use client";

import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  onViewPortfolio: () => void;
  onScrollDown: () => void;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  onViewPortfolio,
  onScrollDown,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
        <p className="text-accent text-sm sm:text-base uppercase tracking-[0.25em] mb-4 font-medium">
          {subtitle}
        </p>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 text-balance">
          {title}
        </h1>
        <Button
          onClick={onViewPortfolio}
          size="lg"
          className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground border-0"
        >
          View Portfolio
          <ArrowDown size={20} />
        </Button>
      </div>

      <button
        onClick={onScrollDown}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </button>
    </section>
  );
}
