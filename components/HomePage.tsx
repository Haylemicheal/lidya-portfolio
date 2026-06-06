"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import CommissionsSection from "@/components/CommissionsSection";
import ExhibitionsSection from "@/components/ExhibitionsSection";
import ContactForm from "@/components/ContactForm";
import InquiryForm from "@/components/InquiryForm";
import type { Artwork, ImagineItem, SiteContent } from "@/lib/types";

interface HomePageProps {
  content: SiteContent;
  artworks: Artwork[];
  imagineItems: ImagineItem[];
}

export default function HomePage({ content, artworks, imagineItems }: HomePageProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation siteName={content.hero.title} />

      <HeroSection
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        backgroundImage={content.hero.backgroundImage}
        onViewPortfolio={() => scrollToSection("portfolio")}
        onScrollDown={() => scrollToSection("about")}
      />

      <section id="about" className="py-16 sm:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 sm:mb-8 text-foreground">
                {content.about.title}
              </h2>
              {content.about.pullQuote && (
                <blockquote className="border-l-4 border-accent pl-5 mb-8 text-lg sm:text-xl font-serif text-foreground/90 leading-relaxed italic">
                  {content.about.pullQuote}
                </blockquote>
              )}
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

      <PortfolioSection
        title={content.portfolio.title}
        description={content.portfolio.description}
        imagineTitle={content.portfolio.imagineItThere?.title ?? "Imagine it There"}
        imagineDescription={
          content.portfolio.imagineItThere?.description ??
          "See how the work looks in real spaces — on walls, in rooms, and in the places you might hang it."
        }
        artworks={artworks}
        imagineItems={imagineItems}
      />

      <CommissionsSection commissions={content.commissions} />
      <ExhibitionsSection exhibitions={content.exhibitions} />

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

            <div className="mb-12">
              <InquiryForm inquiryEmail={content.contact.inquiryEmail} />
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
        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <p className="text-xs text-background/70">
            Powered by{" "}
            <Link
              href="https://www.bilikolabs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium text-background"
            >
              Biliko Labs
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
