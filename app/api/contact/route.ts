import { NextRequest, NextResponse } from "next/server";
import { getInquiryRecipient, sendInquiryEmail, subjectLabels } from "@/lib/contact-utils";
import { getSiteContent } from "@/lib/content";
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

    const content = await getSiteContent();
    const recipient = getInquiryRecipient(content);
    const resendKey = process.env.RESEND_API_KEY?.trim();

    if (!recipient) {
      return NextResponse.json(
        { error: "No inquiry email configured for this site." },
        { status: 503 }
      );
    }

    if (!resendKey) {
      return NextResponse.json({
        fallback: true,
        recipient,
        subjectLabel: subjectLabels[body.subject],
      });
    }

    const result = await sendInquiryEmail(body, recipient);

    if (!result.success) {
      const message = result.error.toLowerCase().includes("only send testing emails")
        ? "Resend test mode only allows sending to your Resend account email. Verify a domain in Resend and set CONTACT_FROM to an address on that domain."
        : result.error;

      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
