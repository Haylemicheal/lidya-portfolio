import fs from "fs";
import path from "path";
import { normalizeArtwork } from "../lib/artwork-utils";

const file = path.join(process.cwd(), "data", "artworks.json");
const raw = JSON.parse(fs.readFileSync(file, "utf-8")) as {
  artworks: Record<string, unknown>[];
};

const artworks = raw.artworks.map((artwork, index) => {
  const normalized = normalizeArtwork(artwork, index);
  return {
    ...normalized,
    featured: index < 4,
  };
});

const seenSlugs = new Set<string>();
for (const artwork of artworks) {
  if (seenSlugs.has(artwork.slug)) {
    artwork.slug = `${artwork.slug}-${artwork.id.replace(/^art-/, "")}`;
  }
  seenSlugs.add(artwork.slug);
}

fs.writeFileSync(file, JSON.stringify({ artworks }, null, 2) + "\n");
console.log(`Migrated ${artworks.length} artworks`);
