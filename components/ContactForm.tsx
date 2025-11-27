"use client";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";

const ContactForm = () => {
  const contactMethods = [
    {
      icon: Phone,
      label: "Phone",
      value: "+251 947 610 363",
      href: "tel:+251947610363",
    },
    {
      icon: Mail,
      label: "Email",
      value: "lidyaalemayehu25@gmail.com",
      href: "mailto:lidyaalemayehu25@gmail.com",
    },
    {
      icon: Facebook,
      label: "Facebook",
      value: "Lidya Abrha",
      href: "https://www.facebook.com/lidya.abrha.39",
      external: true,
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@lidya_abrha",
      href: "https://www.instagram.com/lidya_abrha",
      external: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          const LinkComponent = method.external ? (
            <a
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-lg border border-border bg-card hover:border-foreground/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-3 rounded-full bg-muted group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                <Icon
                  size={24}
                  className="text-foreground group-hover:text-background transition-colors"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {method.label}
              </span>
              <span className="text-sm sm:text-base font-medium text-foreground text-center">
                {method.value}
              </span>
            </a>
          ) : (
            <a
              href={method.href}
              className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-lg border border-border bg-card hover:border-foreground/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-3 rounded-full bg-muted group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                <Icon
                  size={24}
                  className="text-foreground group-hover:text-background transition-colors"
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {method.label}
              </span>
              <span className="text-sm sm:text-base font-medium text-foreground text-center">
                {method.value}
              </span>
            </a>
          );

          return <div key={method.label}>{LinkComponent}</div>;
        })}
      </div>
    </div>
  );
};

export default ContactForm;
