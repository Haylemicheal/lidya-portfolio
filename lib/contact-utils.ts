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

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

function decodeEnvValue(value: string): string {
  return value
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ");
}

export function extractEmail(value: string): string | null {
  const decoded = decodeEnvValue(value);
  if (!decoded) return null;

  const namedMatch = decoded.match(/<([^>]+)>/);
  if (namedMatch && EMAIL_PATTERN.test(namedMatch[1].trim())) {
    return namedMatch[1].trim();
  }

  if (EMAIL_PATTERN.test(decoded)) {
    return decoded;
  }

  const embeddedMatch = decoded.match(/([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)/);
  if (embeddedMatch && EMAIL_PATTERN.test(embeddedMatch[1])) {
    return embeddedMatch[1];
  }

  return null;
}

function sanitizeDisplayName(name: string): string {
  return name.replace(/[<>]/g, "").trim();
}

export function normalizeFromAddress(raw: string): string | null {
  const decoded = decodeEnvValue(raw);
  if (!decoded) return null;

  const email = extractEmail(decoded);
  if (!email) return null;

  const namedMatch = decoded.match(/^(.+?)\s*<[^>]+>$/);
  if (namedMatch) {
    const name = sanitizeDisplayName(namedMatch[1]);
    if (name) return `${name} <${email}>`;
  }

  const looseMatch = decoded.match(/^(.+?)\s+[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/);
  if (looseMatch) {
    const name = sanitizeDisplayName(looseMatch[1]);
    if (name) return `${name} <${email}>`;
  }

  return email;
}

export function getContactFromAddress(): string {
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  if (fromEmail) {
    const email = extractEmail(fromEmail);
    if (email) {
      const name = sanitizeDisplayName(process.env.CONTACT_FROM_NAME?.trim() || "");
      return name ? `${name} <${email}>` : email;
    }
  }

  const configured = process.env.CONTACT_FROM?.trim();
  if (configured) {
    const normalized = normalizeFromAddress(configured);
    if (normalized) return normalized;
    console.warn("Ignoring invalid CONTACT_FROM value; falling back to default sender.");
  }

  return DEFAULT_FROM_EMAIL;
}

export function validateFromAddress(from: string): string | null {
  return normalizeFromAddress(from) ?? extractEmail(from);
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

  const fromAddress = validateFromAddress(getContactFromAddress());
  if (!fromAddress) {
    return {
      success: false,
      error:
        "Invalid sender configuration. Set CONTACT_FROM_EMAIL=onboarding@resend.dev on Vercel.",
    };
  }

  console.info("Sending inquiry email via Resend", { from: fromAddress, to: recipient });

  const { error } = await resend.emails.send({
    from: fromAddress,
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
