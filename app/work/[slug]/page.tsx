import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import JsonLd, { artworkJsonLd } from "@/components/JsonLd";
import { getArtworkBySlug, getArtworks, getSiteContent } from "@/lib/content";
import { themeLabel } from "@/lib/artwork-utils";
import { resolveArtworksForDisplay, resolveContentForDisplay } from "@/lib/storage";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function generateStaticParams() {
  const artworks = await getArtworks();
  return artworks.map((artwork) => ({ slug: artwork.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  const content = resolveContentForDisplay(await getSiteContent());

  if (!artwork) {
    return { title: "Work Not Found" };
  }

  const resolved = resolveArtworksForDisplay([artwork])[0];
  const siteUrl = getSiteUrl();
  const description =
    resolved.description.slice(0, 160) ||
    `${resolved.title} by ${content.hero.title}`;

  return {
    title: `${resolved.title} | ${content.hero.title}`,
    description,
    openGraph: {
      title: resolved.title,
      description,
      type: "website",
      images: [
        {
          url: resolved.image.startsWith("http")
            ? resolved.image
            : `${siteUrl}${resolved.image}`,
          alt: resolved.title,
        },
      ],
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const [rawArtwork, content] = await Promise.all([
    getArtworkBySlug(slug),
    getSiteContent(),
  ]);

  if (!rawArtwork) notFound();

  const artwork = resolveArtworksForDisplay([rawArtwork])[0];
  const resolvedContent = resolveContentForDisplay(content);
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={artworkJsonLd(artwork, resolvedContent, siteUrl)} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Back to portfolio
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              <p className="text-accent text-sm uppercase tracking-wider mb-2">
                {resolvedContent.hero.subtitle}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-6">
                {artwork.title}
              </h1>

              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 mb-6 text-sm">
                {artwork.medium && (
                  <>
                    <dt className="text-muted-foreground">Medium</dt>
                    <dd>{artwork.medium}</dd>
                  </>
                )}
                {artwork.dimensions && (
                  <>
                    <dt className="text-muted-foreground">Dimensions</dt>
                    <dd>{artwork.dimensions}</dd>
                  </>
                )}
                {artwork.year && (
                  <>
                    <dt className="text-muted-foreground">Year</dt>
                    <dd>{artwork.year}</dd>
                  </>
                )}
                <dt className="text-muted-foreground">Artist</dt>
                <dd>{resolvedContent.hero.title}</dd>
              </dl>

              {artwork.themes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
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
                <p className="text-muted-foreground leading-relaxed">{artwork.description}</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
