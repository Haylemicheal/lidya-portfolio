import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/api-auth";
import {
  deleteUploadedImage,
  getImagineItemById,
  getImagineItems,
  saveImagineItems,
} from "@/lib/content";
import { isManagedUpload, resolveImagineItemsForDisplay } from "@/lib/storage";
import type { ImagineItem } from "@/lib/types";

function revalidateImaginePaths() {
  revalidatePath("/");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await getImagineItemById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ item: resolveImagineItemsForDisplay([item])[0] });
  } catch {
    return NextResponse.json({ error: "Failed to load item" }, { status: 500 });
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
    const body = (await request.json()) as Partial<ImagineItem>;
    const items = await getImagineItems();
    const index = items.findIndex((entry) => entry.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const existing = items[index];
    const newImage = body.image?.trim() ?? existing.image;

    if (newImage !== existing.image && isManagedUpload(existing.image)) {
      await deleteUploadedImage(existing.image);
    }

    items[index] = {
      ...existing,
      title: body.title?.trim() || undefined,
      image: newImage,
      order: body.order ?? existing.order,
    };

    await saveImagineItems(items);
    revalidateImaginePaths();
    return NextResponse.json({ item: items[index] });
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
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
    const items = await getImagineItems();
    const item = items.find((entry) => entry.id === id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await deleteUploadedImage(item.image);
    await saveImagineItems(items.filter((entry) => entry.id !== id));
    revalidateImaginePaths();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
