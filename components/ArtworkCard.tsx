"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { parseAspectRatio, themeLabel } from "@/lib/artwork-utils";
import type { Artwork } from "@/lib/types";

interface ArtworkCardProps {
  artwork: Artwork;
  initialOpen?: boolean;
}

export default function ArtworkCard({ artwork, initialOpen = false }: ArtworkCardProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isZoomed, setIsZoomed] = useState(false);
  const aspectRatio = parseAspectRatio(artwork.dimensions);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsZoomed(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <>
      <div
        className="group cursor-pointer overflow-hidden rounded-lg bg-card border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-lg"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <div
          className="relative overflow-hidden bg-muted w-full"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-1">
            {artwork.title}
          </h3>
          {(artwork.medium || artwork.dimensions) && (
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              {[artwork.dimensions, artwork.medium].filter(Boolean).join(" · ")}
            </p>
          )}
          {artwork.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {artwork.description}
            </p>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={closeModal}
        >
          <button
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white hover:text-white/70 transition-colors p-2 hover:bg-white/10 rounded-full z-10"
            onClick={closeModal}
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <div
            className="max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card rounded-lg overflow-hidden shadow-2xl">
              <div className="relative bg-muted">
                <div
                  className={`relative w-full min-h-[280px] sm:min-h-[420px] overflow-hidden cursor-zoom-in ${
                    isZoomed ? "cursor-zoom-out" : ""
                  }`}
                  style={{ aspectRatio: `${aspectRatio}` }}
                  onClick={() => setIsZoomed((z) => !z)}
                >
                  <Image
                    src={artwork.image}
                    alt={artwork.title}
                    fill
                    className={`object-contain p-4 transition-transform duration-300 ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsZoomed((z) => !z)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 text-white text-xs px-3 py-1.5 hover:bg-black/80 transition-colors"
                >
                  {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
                  {isZoomed ? "Zoom out" : "Zoom in"}
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                  {artwork.title}
                </h3>

                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-5 text-sm">
                  {artwork.medium && (
                    <>
                      <dt className="text-muted-foreground">Medium</dt>
                      <dd className="text-foreground">{artwork.medium}</dd>
                    </>
                  )}
                  {artwork.dimensions && (
                    <>
                      <dt className="text-muted-foreground">Dimensions</dt>
                      <dd className="text-foreground">{artwork.dimensions}</dd>
                    </>
                  )}
                  {artwork.year && (
                    <>
                      <dt className="text-muted-foreground">Year</dt>
                      <dd className="text-foreground">{artwork.year}</dd>
                    </>
                  )}
                </dl>

                {artwork.themes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {artwork.themes.map((theme) => (
                      <span
                        key={theme}
                        className="px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                      >
                        {themeLabel(theme)}
                      </span>
                    ))}
                  </div>
                )}

                {artwork.description && (
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base mb-6">
                    {artwork.description}
                  </p>
                )}

                <Link
                  href={`/work/${artwork.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-medium"
                >
                  View shareable page
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
