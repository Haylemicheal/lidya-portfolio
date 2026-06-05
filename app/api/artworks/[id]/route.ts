import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/api-auth";
import { artworkSlug } from "@/lib/artwork-utils";
import {
  deleteUploadedImage,
  getArtworkById,
  getArtworks,
  saveArtworks,
} from "@/lib/content";
import { resolveArtworksForDisplay, isManagedUpload } from "@/lib/storage";
import type { Artwork } from "@/lib/types";

function revalidateArtworkPaths(slug?: string) {
  revalidatePath("/");
  if (slug) revalidatePath(`/work/${slug}`);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artwork = await getArtworkById(id);
    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }
    return NextResponse.json({ artwork: resolveArtworksForDisplay([artwork])[0] });
  } catch {
    return NextResponse.json({ error: "Failed to load artwork" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<Artwork>;
    const artworks = await getArtworks();
    const index = artworks.findIndex((a) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    const existing = artworks[index];
    const newImage = body.image?.trim() ?? existing.image;
    const newTitle = body.title?.trim() ?? existing.title;

    if (newImage !== existing.image && isManagedUpload(existing.image)) {
      await deleteUploadedImage(existing.image);
    }

    artworks[index] = {
      ...existing,
      slug: body.slug?.trim() || artworkSlug(newTitle, existing.id),
      title: newTitle,
      medium: body.medium?.trim() ?? existing.medium,
      dimensions: body.dimensions?.trim() ?? existing.dimensions,
      year: body.year ?? existing.year,
      themes: body.themes ?? existing.themes,
      description: body.description?.trim() ?? existing.description,
      image: newImage,
      order: body.order ?? existing.order,
      featured: body.featured ?? existing.featured,
    };

    await saveArtworks(artworks);
    revalidateArtworkPaths(artworks[index].slug);
    return NextResponse.json({ artwork: artworks[index] });
  } catch {
    return NextResponse.json({ error: "Failed to update artwork" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const artworks = await getArtworks();
    const artwork = artworks.find((a) => a.id === id);

    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    await deleteUploadedImage(artwork.image);
    await saveArtworks(artworks.filter((a) => a.id !== id));
    revalidateArtworkPaths(artwork.slug);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 });
  }
}
