"use client";

import { Mail, Phone, Facebook, Instagram, LucideIcon } from "lucide-react";
import type { ContactMethod } from "@/lib/types";

const iconMap: Record<ContactMethod["type"], LucideIcon> = {
  phone: Phone,
  email: Mail,
  facebook: Facebook,
  instagram: Instagram,
};

interface ContactFormProps {
  methods: ContactMethod[];
}

export default function ContactForm({ methods }: ContactFormProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-center text-sm text-muted-foreground mb-6">
        Or reach out directly
      </p>
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {methods.map((method) => {
          const Icon = iconMap[method.type] ?? Mail;
          const linkProps = method.external
            ? { target: "_blank" as const, rel: "noopener noreferrer" }
            : {};

          return (
            <div key={method.label}>
              <a
                href={method.href}
                {...linkProps}
                className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-lg border border-border bg-card hover:border-accent/40 hover:shadow-md transition-all duration-300 group"
              >
                <div className="p-3 rounded-full bg-muted group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                  <Icon
                    size={24}
                    className="text-foreground group-hover:text-accent-foreground transition-colors"
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {method.label}
                </span>
                <span className="text-sm sm:text-base font-medium text-foreground text-center">
                  {method.value}
                </span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
