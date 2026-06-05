import HomePage from "@/components/HomePage";
import { getArtworks, getSiteContent } from "@/lib/content";

export default async function Page() {
  const [content, artworks] = await Promise.all([
    getSiteContent(),
    getArtworks(),
  ]);

  return <HomePage content={content} artworks={artworks} />;
}
