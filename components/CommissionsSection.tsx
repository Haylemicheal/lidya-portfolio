import type { SiteContent } from "@/lib/types";

interface CommissionsSectionProps {
  commissions: SiteContent["commissions"];
}

export default function CommissionsSection({ commissions }: CommissionsSectionProps) {
  if (!commissions.items.length) return null;

  return (
    <section id="commissions" className="py-16 sm:py-24 bg-background border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-foreground">
            {commissions.title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {commissions.description}
          </p>
        </div>
        <ul className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {commissions.items.map((item, index) => (
            <li
              key={index}
              className="rounded-lg border border-border bg-card p-6 text-center text-sm sm:text-base text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
