import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { requireAuth } from "@/lib/api-auth";
import { canUseBlob, uploadImage } from "@/lib/storage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (process.env.VERCEL === "1" && !canUseBlob()) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not connected. In Vercel: Storage → Blob → Connect to this project, then redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name) || ".jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(safeName, buffer, file.type);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload failed:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
