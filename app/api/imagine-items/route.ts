import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/api-auth";
import {
  deleteUploadedImage,
  generateImagineId,
  getImagineItems,
  saveImagineItems,
} from "@/lib/content";
import { resolveImagineItemsForDisplay } from "@/lib/storage";
import type { ImagineItem } from "@/lib/types";

function revalidateImaginePaths() {
  revalidatePath("/");
}

export async function GET() {
  try {
    const items = await getImagineItems();
    return NextResponse.json({ items: resolveImagineItemsForDisplay(items) });
  } catch {
    return NextResponse.json({ error: "Failed to load items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = (await request.json()) as Omit<ImagineItem, "id" | "order"> & {
      order?: number;
    };

    if (!body.image?.trim()) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const items = await getImagineItems();
    const maxOrder = items.reduce((max, item) => Math.max(max, item.order), -1);
    const id = generateImagineId();

    const item: ImagineItem = {
      id,
      title: body.title?.trim() || undefined,
      image: body.image.trim(),
      order: body.order ?? maxOrder + 1,
    };

    items.push(item);
    await saveImagineItems(items);
    revalidateImaginePaths();

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = (await request.json()) as { items: ImagineItem[] };
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await saveImagineItems(body.items);
    revalidateImaginePaths();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reorder items" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Item id required" }, { status: 400 });
    }

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
