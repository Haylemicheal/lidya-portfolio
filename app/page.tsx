import HomePage from "@/components/HomePage";
import { getArtworks, getSiteContent } from "@/lib/content";
import { resolveArtworksForDisplay, resolveContentForDisplay } from "@/lib/storage";

export default async function Page() {
  const [content, artworks] = await Promise.all([
    getSiteContent(),
    getArtworks(),
  ]);

  return (
    <HomePage
      content={resolveContentForDisplay(content)}
      artworks={resolveArtworksForDisplay(artworks)}
    />
  );
}
