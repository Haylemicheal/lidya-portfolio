import { del, head, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export function isBlobUrl(url: string): boolean {
  return url.includes("blob.vercel-storage.com");
}

export function isManagedUpload(url: string): boolean {
  return url.startsWith("/uploads/") || isBlobUrl(url);
}

export async function readJsonFile<T>(localPath: string, blobPath: string): Promise<T> {
  if (USE_BLOB) {
    try {
      const info = await head(blobPath);
      const response = await fetch(info.url, { cache: "no-store" });
      if (response.ok) {
        return (await response.json()) as T;
      }
    } catch {
      // Fall back to bundled local file on first deploy
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

  if (USE_BLOB) {
    await put(blobPath, content, {
      access: "public",
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
  if (USE_BLOB) {
    const blob = await put(`uploads/${fileName}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

export async function deleteManagedImage(imagePath: string): Promise<void> {
  if (isBlobUrl(imagePath)) {
    try {
      await del(imagePath);
    } catch {
      // Already removed
    }
    return;
  }

  if (!imagePath.startsWith("/uploads/")) return;

  if (USE_BLOB) {
    try {
      await del(imagePath.replace(/^\//, ""));
    } catch {
      // Already removed
    }
    return;
  }

  const filePath = path.join(process.cwd(), "public", imagePath);
  try {
    await fs.unlink(filePath);
  } catch {
    // Already removed
  }
}
