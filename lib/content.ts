import { promises as fs } from "fs";
import path from "path";
import type { Artwork, ArtworksData, SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const ARTWORKS_FILE = path.join(DATA_DIR, "artworks.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_FILE, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), "utf-8");
}

export async function getArtworks(): Promise<Artwork[]> {
  const raw = await fs.readFile(ARTWORKS_FILE, "utf-8");
  const data = JSON.parse(raw) as ArtworksData;
  return data.artworks.sort((a, b) => a.order - b.order);
}

export async function saveArtworks(artworks: Artwork[]): Promise<void> {
  await ensureDataDir();
  const data: ArtworksData = { artworks };
  await fs.writeFile(ARTWORKS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function getArtworkById(id: string): Promise<Artwork | undefined> {
  const artworks = await getArtworks();
  return artworks.find((a) => a.id === id);
}

export function generateId(): string {
  return `art-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function deleteUploadedImage(imagePath: string): Promise<void> {
  if (!imagePath.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", imagePath);
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be removed
  }
}
