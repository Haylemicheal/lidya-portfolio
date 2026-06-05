import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { normalizeArtwork } from "./artwork-utils";
import type { Artwork, ArtworksData, SiteContent } from "./types";
import {
  deleteManagedImage,
  readJsonFile,
  writeJsonFile,
} from "./storage";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");
const CONTENT_BLOB_PATH = "data/content.json";
const ARTWORKS_BLOB_PATH = "data/artworks.json";

export async function getSiteContent(): Promise<SiteContent> {
  noStore();
  return readJsonFile<SiteContent>(CONTENT_FILE, CONTENT_BLOB_PATH);
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await writeJsonFile(CONTENT_FILE, CONTENT_BLOB_PATH, content);
}

export async function getArtworks(): Promise<Artwork[]> {
  noStore();
  const data = await readJsonFile<ArtworksData>(ARTWORKS_FILE, ARTWORKS_BLOB_PATH);
  return data.artworks
    .map((artwork, index) => normalizeArtwork(artwork as unknown as Record<string, unknown>, index))
    .sort((a, b) => a.order - b.order);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | undefined> {
  const artworks = await getArtworks();
  return artworks.find((a) => a.slug === slug);
}

export async function saveArtworks(artworks: Artwork[]): Promise<void> {
  const data: ArtworksData = { artworks };
  await writeJsonFile(ARTWORKS_FILE, ARTWORKS_BLOB_PATH, data);
}

export async function getArtworkById(id: string): Promise<Artwork | undefined> {
  const artworks = await getArtworks();
  return artworks.find((a) => a.id === id);
}

export function generateId(): string {
  return `art-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function deleteUploadedImage(imagePath: string): Promise<void> {
  await deleteManagedImage(imagePath);
}
