"use client";
import { useState } from "react";
import { X } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface ArtworkCardProps {
  image: string | StaticImageData;
  title: string;
  description: string;
}

const ArtworkCard = ({ image, title, description }: ArtworkCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="group cursor-pointer overflow-hidden rounded-lg bg-card border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white hover:text-white/70 transition-colors p-2 hover:bg-white/10 rounded-full"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div
            className="max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 bg-muted flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                <Image
                  src={image}
                  alt={title}
                  className="w-full h-full object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center overflow-y-auto">
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkCard;
