import { ARTWORK_THEMES, type Artwork, type ArtworkTheme } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function artworkSlug(title: string, id?: string): string {
  const base = slugify(title);
  return base || id || "artwork";
}

const THEME_KEYWORDS: Record<ArtworkTheme, string[]> = {
  women: ["sisterhood", "women", "ballerina", "female", "nymph", "sisters"],
  hope: ["hope", "light", "flicker", "freedom", "grace", "loved sinner"],
  community: ["community", "sisterhood", "clasp", "commitment", "union"],
  portraits: ["portrait", "gaze", "keeper", "guardian", "scream", "intensity"],
  culture: [
    "ethiopian",
    "coffee",
    "tradition",
    "customs",
    "piassa",
    "jebena",
    "priest",
    "buna",
  ],
  nature: ["nature", "cascade", "garden", "splendor", "nymph", "melody"],
  abstract: [
    "abstract",
    "expressionist",
    "homage",
    "munch",
    "gogh",
    "klimt",
    "symbolism",
    "impressionist",
  ],
};

export function inferThemes(title: string, description: string): ArtworkTheme[] {
  const text = `${title} ${description}`.toLowerCase();
  const matched = ARTWORK_THEMES.filter((theme) =>
    THEME_KEYWORDS[theme].some((keyword) => text.includes(keyword))
  );
  return matched.length > 0 ? matched : ["community"];
}

export function parseLegacyDescription(raw: string): {
  dimensions: string;
  medium: string;
  description: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { dimensions: "", medium: "", description: "" };
  }

  const dimensionOnly = trimmed.match(/^(\d+\s*[×x]\s*\d+(?:\s*cm|\s*m)?)$/i);
  if (dimensionOnly) {
    return {
      dimensions: normalizeDimensions(dimensionOnly[1]),
      medium: "",
      description: "",
    };
  }

  const fullMatch = trimmed.match(
    /^([\d.]+\s*[×x]\s*[\d.]+(?:cm|m)?)\s+(.+?)\.\s*([\s\S]*)$/i
  );
  if (fullMatch) {
    const mediumPart = fullMatch[2].trim();
    const rest = fullMatch[3].trim();
    return {
      dimensions: normalizeDimensions(fullMatch[1]),
      medium: capitalizeMedium(mediumPart),
      description: rest,
    };
  }

  const shortMatch = trimmed.match(/^([\d.]+\s*[×x]\s*[\d.]+(?:cm|m)?)\s+([\s\S]+)$/i);
  if (shortMatch) {
    const afterDims = shortMatch[2].trim();
    const looksLikeMedium =
      /^(oil|acrylic|watercolor|mixed media|charcoal|pastel)/i.test(afterDims) &&
      afterDims.length < 80;
    if (looksLikeMedium) {
      const dotIndex = afterDims.indexOf(". ");
      if (dotIndex > -1) {
        return {
          dimensions: normalizeDimensions(shortMatch[1]),
          medium: capitalizeMedium(afterDims.slice(0, dotIndex)),
          description: afterDims.slice(dotIndex + 2),
        };
      }
      return {
        dimensions: normalizeDimensions(shortMatch[1]),
        medium: capitalizeMedium(afterDims),
        description: "",
      };
    }
  }

  return { dimensions: "", medium: "", description: trimmed };
}

function normalizeDimensions(value: string): string {
  return value
    .replace(/\s*[×x]\s*/g, " × ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(\d)\s*cm$/i, "$1 cm")
    .replace(/(\d)\s*m$/i, "$1 m");
}

function capitalizeMedium(medium: string): string {
  const trimmed = medium.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function parseAspectRatio(dimensions: string): number {
  const match = dimensions.match(/([\d.]+)\s*[×x]\s*([\d.]+)/i);
  if (!match) return 1;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  if (!w || !h) return 1;
  return w / h;
}

export function normalizeArtwork(raw: Record<string, unknown>, index: number): Artwork {
  const id = String(raw.id ?? `art-${index}`);
  const title = String(raw.title ?? "Untitled");
  const legacyDescription = String(raw.description ?? "");
  const parsed = parseLegacyDescription(legacyDescription);

  const medium = String(raw.medium ?? parsed.medium);
  const dimensions = String(raw.dimensions ?? parsed.dimensions);
  const description = String(
    raw.description && raw.medium !== undefined && raw.dimensions !== undefined
      ? raw.description
      : parsed.description || (parsed.medium ? "" : legacyDescription)
  );

  const themesRaw = raw.themes as string[] | undefined;
  const themes: ArtworkTheme[] =
    themesRaw && themesRaw.length > 0
      ? themesRaw.filter((t): t is ArtworkTheme =>
          ARTWORK_THEMES.includes(t as ArtworkTheme)
        )
      : inferThemes(title, legacyDescription);

  return {
    id,
    slug: String(raw.slug ?? artworkSlug(title, id)),
    title,
    medium,
    dimensions,
    year: typeof raw.year === "number" ? raw.year : undefined,
    themes,
    description,
    image: String(raw.image ?? ""),
    order: typeof raw.order === "number" ? raw.order : index,
    featured: Boolean(raw.featured),
  };
}

export function themeLabel(theme: ArtworkTheme): string {
  return theme.charAt(0).toUpperCase() + theme.slice(1);
}
