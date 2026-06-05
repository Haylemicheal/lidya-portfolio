import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  deleteUploadedImage,
  generateId,
  getArtworks,
  saveArtworks,
} from "@/lib/content";
import type { Artwork } from "@/lib/types";

export async function GET() {
  try {
    const artworks = await getArtworks();
    return NextResponse.json({ artworks });
  } catch {
    return NextResponse.json({ error: "Failed to load artworks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = (await request.json()) as Omit<Artwork, "id" | "order"> & {
      order?: number;
    };

    if (!body.title?.trim() || !body.image?.trim()) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    const artworks = await getArtworks();
    const maxOrder = artworks.reduce((max, a) => Math.max(max, a.order), -1);

    const artwork: Artwork = {
      id: generateId(),
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      image: body.image.trim(),
      order: body.order ?? maxOrder + 1,
    };

    artworks.push(artwork);
    await saveArtworks(artworks);

    return NextResponse.json({ artwork }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = (await request.json()) as { artworks: Artwork[] };
    if (!Array.isArray(body.artworks)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await saveArtworks(body.artworks);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reorder artworks" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Artwork id required" }, { status: 400 });
    }

    const artworks = await getArtworks();
    const artwork = artworks.find((a) => a.id === id);
    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    await deleteUploadedImage(artwork.image);
    const filtered = artworks.filter((a) => a.id !== id);
    await saveArtworks(filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 });
  }
}
