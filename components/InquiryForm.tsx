"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactInquiry } from "@/lib/types";

interface InquiryFormProps {
  inquiryEmail: string;
}

const subjectOptions: { value: ContactInquiry["subject"]; label: string }[] = [
  { value: "commission", label: "Commission" },
  { value: "exhibition", label: "Exhibition" },
  { value: "purchase", label: "Purchase inquiry" },
  { value: "collaboration", label: "Collaboration" },
  { value: "other", label: "Other" },
];

export default function InquiryForm({ inquiryEmail }: InquiryFormProps) {
  const [form, setForm] = useState<ContactInquiry>({
    name: "",
    email: "",
    subject: "commission",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "commission", message: "" });
        return;
      }

      const data = (await res.json()) as { error?: string; fallback?: boolean };
      if (data.fallback && inquiryEmail) {
        const subject = encodeURIComponent(
          `[Portfolio] ${subjectOptions.find((o) => o.value === form.subject)?.label ?? "Inquiry"}`
        );
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`
        );
        window.location.href = `mailto:${inquiryEmail}?subject=${subject}&body=${body}`;
        setStatus("sent");
        return;
      }

      setErrorMessage(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      if (inquiryEmail) {
        const subject = encodeURIComponent(`[Portfolio] Inquiry from ${form.name}`);
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`
        );
        window.location.href = `mailto:${inquiryEmail}?subject=${subject}&body=${body}`;
        setStatus("sent");
      } else {
        setErrorMessage("Unable to send message. Please use the contact links below.");
        setStatus("error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-xl p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="inquiry-name">Name</Label>
          <Input
            id="inquiry-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiry-email">Email</Label>
          <Input
            id="inquiry-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiry-subject">I'm interested in</Label>
        <select
          id="inquiry-subject"
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value as ContactInquiry["subject"] })
          }
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {subjectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiry-message">Message</Label>
        <Textarea
          id="inquiry-message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell me about your project or inquiry..."
        />
      </div>

      {status === "sent" && (
        <p className="text-sm text-accent font-medium">
          Thank you — your message has been sent.
        </p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
