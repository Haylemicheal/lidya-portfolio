import { NextRequest, NextResponse } from "next/server";
import type { ContactInquiry } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactInquiry;

    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const recipient =
      process.env.CONTACT_EMAIL ?? process.env.INQUIRY_EMAIL ?? "";
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey || !recipient) {
      return NextResponse.json(
        {
          error: "Email service not configured",
          fallback: true,
        },
        { status: 503 }
      );
    }

    const subjectLabels: Record<ContactInquiry["subject"], string> = {
      commission: "Commission",
      exhibition: "Exhibition",
      purchase: "Purchase inquiry",
      collaboration: "Collaboration",
      other: "Other",
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [recipient],
        reply_to: body.email.trim(),
        subject: `[Portfolio] ${subjectLabels[body.subject]} from ${body.name.trim()}`,
        text: [
          `Name: ${body.name.trim()}`,
          `Email: ${body.email.trim()}`,
          `Subject: ${subjectLabels[body.subject]}`,
          "",
          body.message.trim(),
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to send email", fallback: true },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
