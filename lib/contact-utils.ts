import { Resend } from "resend";
import type { ContactInquiry, SiteContent } from "./types";

export function getInquiryRecipient(content?: SiteContent): string {
  const fromEnv =
    process.env.CONTACT_EMAIL?.trim() || process.env.INQUIRY_EMAIL?.trim() || "";

  if (fromEnv) return fromEnv;

  if (!content) return "";

  const fromContent = content.contact.inquiryEmail?.trim();
  if (fromContent) return fromContent;

  const emailMethod = content.contact.methods.find((method) => method.type === "email");
  if (!emailMethod) return "";

  return emailMethod.href.replace(/^mailto:/i, "").trim() || emailMethod.value.trim();
}

export function getContactFromAddress(): string {
  const configured = process.env.CONTACT_FROM?.trim();
  if (configured) return configured;

  return "Lidya Portfolio <onboarding@resend.dev>";
}

export function openMailtoInquiry(
  recipient: string,
  inquiry: { name: string; email: string; subject: string; message: string },
  subjectLabel: string
) {
  const subject = encodeURIComponent(`[Portfolio] ${subjectLabel} from ${inquiry.name}`);
  const body = encodeURIComponent(
    [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Subject: ${subjectLabel}`,
      "",
      inquiry.message,
    ].join("\n")
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}

const subjectLabels: Record<ContactInquiry["subject"], string> = {
  commission: "Commission",
  exhibition: "Exhibition",
  purchase: "Purchase inquiry",
  collaboration: "Collaboration",
  other: "Other",
};

export async function sendInquiryEmail(
  inquiry: ContactInquiry,
  recipient: string
): Promise<{ success: true } | { success: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { success: false, error: "Resend API key is not configured." };
  }

  const resend = new Resend(apiKey);
  const subjectLabel = subjectLabels[inquiry.subject];
  const subject = `[Portfolio] ${subjectLabel} from ${inquiry.name.trim()}`;
  const text = [
    `Name: ${inquiry.name.trim()}`,
    `Email: ${inquiry.email.trim()}`,
    `Subject: ${subjectLabel}`,
    "",
    inquiry.message.trim(),
  ].join("\n");

  const html = text
    .split("\n")
    .map((line) => (line ? `<p>${line.replace(/</g, "&lt;")}</p>` : "<br />"))
    .join("");

  const { error } = await resend.emails.send({
    from: getContactFromAddress(),
    to: [recipient],
    replyTo: inquiry.email.trim(),
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Resend send failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export { subjectLabels };
