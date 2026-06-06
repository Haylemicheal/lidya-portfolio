"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ImagineItem } from "@/lib/types";

interface ImagineGalleryProps {
  items: ImagineItem[];
}

export default function ImagineGallery({ items }: ImagineGalleryProps) {
  const [activeItem, setActiveItem] = useState<ImagineItem | null>(null);

  const closeModal = useCallback(() => {
    setActiveItem(null);
  }, []);

  useEffect(() => {
    if (!activeItem) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeItem, closeModal]);

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Room mockups coming soon.
      </p>
    );
  }

  return (
    <>
      <div className="masonry-grid max-w-7xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="masonry-item">
            <button
              type="button"
              onClick={() => setActiveItem(item)}
              className="group w-full cursor-pointer overflow-hidden rounded-lg bg-card border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-lg text-left"
            >
              <div className="relative overflow-hidden bg-muted w-full aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title || "Art in a room setting"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              {item.title && (
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                    {item.title}
                  </h3>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title || "Art in a room setting"}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <div
            className="relative w-full max-w-5xl max-h-[85vh] aspect-[4/3]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeItem.image}
              alt={activeItem.title || "Art in a room setting"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
          {activeItem.title && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm sm:text-base font-serif">
              {activeItem.title}
            </p>
          )}
        </div>
      )}
    </>
  );
}
