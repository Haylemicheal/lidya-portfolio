import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getSiteContent, saveSiteContent } from "@/lib/content";
import { resolveContentForDisplay } from "@/lib/storage";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(resolveContentForDisplay(content));
  } catch {
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = (await request.json()) as SiteContent;
    await saveSiteContent(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
