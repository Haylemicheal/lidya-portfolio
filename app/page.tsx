import HomePage from "@/components/HomePage";
import JsonLd, { personJsonLd } from "@/components/JsonLd";
import { getArtworks, getSiteContent } from "@/lib/content";
import { resolveArtworksForDisplay, resolveContentForDisplay } from "@/lib/storage";

export const dynamic = "force-dynamic";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default async function Page() {
  const [content, artworks] = await Promise.all([
    getSiteContent(),
    getArtworks(),
  ]);

  const resolvedContent = resolveContentForDisplay(content);
  const resolvedArtworks = resolveArtworksForDisplay(artworks);

  return (
    <>
      <JsonLd data={personJsonLd(resolvedContent, getSiteUrl())} />
      <HomePage content={resolvedContent} artworks={resolvedArtworks} />
    </>
  );
}
