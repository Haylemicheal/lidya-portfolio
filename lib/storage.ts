import { del, head, put, type PutCommandOptions } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

/** True when Blob SDK can authenticate via token or connected store (OIDC on Vercel). */
export function canUseBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function isBlobUrl(url: string): boolean {
  return url.includes("blob.vercel-storage.com");
}

export function isManagedUpload(url: string): boolean {
  return url.startsWith("/uploads/") || isBlobUrl(url);
}

function getBlobOptions(): Pick<PutCommandOptions, "token" | "storeId"> {
  const options: Pick<PutCommandOptions, "token" | "storeId"> = {};
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    options.token = process.env.BLOB_READ_WRITE_TOKEN;
  }
  if (process.env.BLOB_STORE_ID) {
    options.storeId = process.env.BLOB_STORE_ID;
  }
  return options;
}

export async function readJsonFile<T>(localPath: string, blobPath: string): Promise<T> {
  if (canUseBlob()) {
    try {
      const info = await head(blobPath, getBlobOptions());
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

  if (canUseBlob()) {
    await put(blobPath, content, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobOptions(),
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
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
      ...getBlobOptions(),
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

export async function deleteManagedImage(imagePath: string): Promise<void> {
  const blobOptions = getBlobOptions();

  if (isBlobUrl(imagePath)) {
    try {
      await del(imagePath, blobOptions);
    } catch {
      // Already removed
    }
    return;
  }

  if (!imagePath.startsWith("/uploads/")) return;

  if (canUseBlob()) {
    try {
      await del(imagePath.replace(/^\//, ""), blobOptions);
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
