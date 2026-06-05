import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  deleteUploadedImage,
  getArtworkById,
  getArtworks,
  saveArtworks,
} from "@/lib/content";
import type { Artwork } from "@/lib/types";

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
    return NextResponse.json({ artwork });
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

    if (newImage !== existing.image && existing.image.startsWith("/uploads/")) {
      await deleteUploadedImage(existing.image);
    }

    artworks[index] = {
      ...existing,
      title: body.title?.trim() ?? existing.title,
      description: body.description?.trim() ?? existing.description,
      image: newImage,
      order: body.order ?? existing.order,
    };

    await saveArtworks(artworks);
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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 });
  }
}
