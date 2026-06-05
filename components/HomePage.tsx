"use client";

import Image from "next/image";
import Navigation from "@/components/Navigation";
import ArtworkCard from "@/components/ArtworkCard";
import ContactForm from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import type { Artwork, SiteContent } from "@/lib/types";

interface HomePageProps {
  content: SiteContent;
  artworks: Artwork[];
}

export default function HomePage({ content, artworks }: HomePageProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <section
        id="hero"
        className="relative h-screen flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${content.hero.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 text-balance">
            {content.hero.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 font-light">
            {content.hero.subtitle}
          </p>
          <Button
            onClick={() => scrollToSection("portfolio")}
            variant="secondary"
            size="lg"
            className="gap-2"
          >
            View Portfolio
            <ArrowDown size={20} />
          </Button>
        </div>
        <button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown size={24} />
        </button>
      </section>

      <section id="about" className="py-16 sm:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-foreground">
                {content.about.title}
              </h2>
              <div className="space-y-4 sm:space-y-5 text-muted-foreground leading-relaxed text-sm sm:text-base">
                {content.about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src={content.about.portraitImage}
                  alt={content.hero.title}
                  className="rounded-lg object-cover shadow-xl"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-16 sm:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-6 text-foreground">
              {content.portfolio.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {content.portfolio.description}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                image={artwork.image}
                title={artwork.title}
                description={artwork.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-6 text-foreground">
                {content.contact.title}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                {content.contact.description}
              </p>
            </div>
            <ContactForm methods={content.contact.methods} />
          </div>
        </div>
      </section>

      <footer className="py-8 sm:py-12 bg-foreground text-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base">
            © {new Date().getFullYear()} {content.hero.title}. All rights reserved.
          </p>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-xs text-white">
            Powered by{" "}
            <Link
              href="https://www.bilikolabs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
            >
              Biliko Labs
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
