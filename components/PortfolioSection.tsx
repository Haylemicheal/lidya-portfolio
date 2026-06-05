"use client";

import { useMemo, useState } from "react";
import ArtworkCard from "@/components/ArtworkCard";
import { ARTWORK_THEMES, type Artwork, type ArtworkTheme } from "@/lib/types";
import { themeLabel } from "@/lib/artwork-utils";

interface PortfolioSectionProps {
  title: string;
  description: string;
  artworks: Artwork[];
}

export default function PortfolioSection({
  title,
  description,
  artworks,
}: PortfolioSectionProps) {
  const availableThemes = useMemo(() => {
    const used = new Set<ArtworkTheme>();
    for (const artwork of artworks) {
      for (const theme of artwork.themes) {
        used.add(theme);
      }
    }
    return ARTWORK_THEMES.filter((theme) => used.has(theme));
  }, [artworks]);

  const [activeTheme, setActiveTheme] = useState<ArtworkTheme | "all">("all");

  const filteredArtworks =
    activeTheme === "all"
      ? artworks
      : artworks.filter((artwork) => artwork.themes.includes(activeTheme));

  return (
    <section id="portfolio" className="py-16 sm:py-24 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-6 text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {availableThemes.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTheme("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTheme === "all"
                  ? "bg-accent text-accent-foreground"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              All
            </button>
            {availableThemes.map((theme) => (
              <button
                key={theme}
                onClick={() => setActiveTheme(theme)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTheme === theme
                    ? "bg-accent text-accent-foreground"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {themeLabel(theme)}
              </button>
            ))}
          </div>
        )}

        <div className="masonry-grid max-w-7xl mx-auto">
          {filteredArtworks.map((artwork) => (
            <div key={artwork.id} className="masonry-item">
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <p className="text-center text-muted-foreground">
            No works found for this theme.
          </p>
        )}
      </div>
    </section>
  );
}
