import type { SiteContent } from "@/lib/types";

interface ExhibitionsSectionProps {
  exhibitions: SiteContent["exhibitions"];
}

export default function ExhibitionsSection({ exhibitions }: ExhibitionsSectionProps) {
  if (!exhibitions.items.length) return null;

  return (
    <section id="exhibitions" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-10 text-center text-foreground">
          {exhibitions.title}
        </h2>
        <ul className="space-y-4">
          {exhibitions.items.map((item, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 border-b border-border pb-4 last:border-0"
            >
              <span className="text-accent font-medium text-sm sm:w-16 shrink-0">
                {item.year}
              </span>
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.venue}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
