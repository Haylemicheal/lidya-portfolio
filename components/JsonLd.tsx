import type { Artwork, SiteContent } from "@/lib/types";

export function personJsonLd(content: SiteContent, siteUrl: string) {
  const emailMethod = content.contact.methods.find((m) => m.type === "email");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.hero.title,
    jobTitle: content.hero.subtitle,
    email: emailMethod?.value,
    url: siteUrl,
    sameAs: content.contact.methods
      .filter((m) => m.external)
      .map((m) => m.href),
  };
}

export function artworkJsonLd(artwork: Artwork, content: SiteContent, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    artMedium: artwork.medium || undefined,
    width: artwork.dimensions || undefined,
    description: artwork.description || undefined,
    image: artwork.image.startsWith("http")
      ? artwork.image
      : `${siteUrl}${artwork.image}`,
    creator: {
      "@type": "Person",
      name: content.hero.title,
    },
    url: `${siteUrl}/work/${artwork.slug}`,
  };
}

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
