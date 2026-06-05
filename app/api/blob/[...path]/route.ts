import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getBlobCommandOptions } from "@/lib/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const pathname = pathSegments.join("/");

  if (!pathname || pathname.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const result = await get(pathname, getBlobCommandOptions());
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Blob proxy failed:", pathname, error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
