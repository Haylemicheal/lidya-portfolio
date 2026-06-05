import { del, get, head, put, type PutCommandOptions } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import type { Artwork, SiteContent } from "./types";

export function getBlobAccess(): "public" | "private" {
  const env = process.env.BLOB_ACCESS?.toLowerCase();
  if (env === "public" || env === "private") return env;
  return "private";
}

/** True when Blob SDK can authenticate via token or connected store (OIDC on Vercel). */
export function canUseBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function getBlobCommandOptions(): PutCommandOptions {
  const options: PutCommandOptions = { access: getBlobAccess() };
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    options.token = process.env.BLOB_READ_WRITE_TOKEN;
  }
  if (process.env.BLOB_STORE_ID) {
    options.storeId = process.env.BLOB_STORE_ID;
  }
  return options;
}

export function isBlobUrl(url: string): boolean {
  return url.includes("blob.vercel-storage.com");
}

export function isManagedUpload(url: string): boolean {
  return url.startsWith("/uploads/") || url.startsWith("/api/blob/") || isBlobUrl(url);
}

export function blobPathnameFromReference(url: string): string | null {
  if (url.startsWith("/api/blob/")) {
    return url.slice("/api/blob/".length);
  }
  if (url.startsWith("uploads/")) {
    return url;
  }
  if (!isBlobUrl(url)) return null;
  try {
    return new URL(url).pathname.slice(1);
  } catch {
    return null;
  }
}

/** Public URL for displaying a blob-backed image (proxy when store is private). */
export function resolveDisplayImageUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("/api/blob/") || url.startsWith("/media/") || url.startsWith("/uploads/")) {
    return url;
  }
  if (getBlobAccess() === "public" && isBlobUrl(url)) {
    return url;
  }
  const pathname = blobPathnameFromReference(url);
  if (pathname) {
    return `/api/blob/${pathname}`;
  }
  return url;
}

export function resolveArtworksForDisplay(artworks: Artwork[]): Artwork[] {
  return artworks.map((artwork) => ({
    ...artwork,
    image: resolveDisplayImageUrl(artwork.image),
  }));
}

export function resolveContentForDisplay(content: SiteContent): SiteContent {
  return {
    ...content,
    hero: {
      ...content.hero,
      backgroundImage: resolveDisplayImageUrl(content.hero.backgroundImage),
    },
    about: {
      ...content.about,
      portraitImage: resolveDisplayImageUrl(content.about.portraitImage),
    },
  };
}

export async function readJsonFile<T>(localPath: string, blobPath: string): Promise<T> {
  if (canUseBlob()) {
    try {
      const result = await get(blobPath, getBlobCommandOptions());
      if (result) {
        const raw = await new Response(result.stream).text();
        return JSON.parse(raw) as T;
      }
    } catch {
      try {
        const info = await head(blobPath, getBlobCommandOptions());
        const response = await fetch(info.url, { cache: "no-store" });
        if (response.ok) {
          return (await response.json()) as T;
        }
      } catch {
        // Fall back to bundled local file on first deploy
      }
    }
  }

  const raw = await fs.readFile(localPath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJsonFile(
  localPath: string,
  blobPath: string,
  data: unknown
): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  if (canUseBlob()) {
    await put(blobPath, content, {
      ...getBlobCommandOptions(),
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, content, "utf-8");
}

export async function uploadImage(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (canUseBlob()) {
    const blob = await put(`uploads/${fileName}`, buffer, {
      ...getBlobCommandOptions(),
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    if (getBlobAccess() === "private") {
      return `/api/blob/${blob.pathname}`;
    }
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

export async function deleteManagedImage(imagePath: string): Promise<void> {
  const blobOptions = getBlobCommandOptions();
  const pathname = blobPathnameFromReference(imagePath);

  if (pathname && canUseBlob()) {
    try {
      await del(pathname, blobOptions);
    } catch {
      // Already removed
    }
    return;
  }

  if (isBlobUrl(imagePath)) {
    try {
      await del(imagePath, blobOptions);
    } catch {
      // Already removed
    }
    return;
  }

  if (!imagePath.startsWith("/uploads/")) return;

  const filePath = path.join(process.cwd(), "public", imagePath);
  try {
    await fs.unlink(filePath);
  } catch {
    // Already removed
  }
}
