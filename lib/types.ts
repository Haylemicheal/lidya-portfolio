export const ARTWORK_THEMES = [
  "women",
  "hope",
  "community",
  "portraits",
  "culture",
  "nature",
  "abstract",
] as const;

export type ArtworkTheme = (typeof ARTWORK_THEMES)[number];

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  medium: string;
  dimensions: string;
  year?: number;
  themes: ArtworkTheme[];
  description: string;
  image: string;
  order: number;
  featured?: boolean;
}

export interface ContactMethod {
  label: string;
  value: string;
  href: string;
  type: "phone" | "email" | "facebook" | "instagram";
  external?: boolean;
}

export interface Exhibition {
  year: number;
  title: string;
  venue: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    featuredImages?: string[];
  };
  about: {
    title: string;
    paragraphs: string[];
    pullQuote?: string;
    portraitImage: string;
  };
  portfolio: {
    title: string;
    description: string;
    imagineItThere?: {
      title: string;
      description: string;
    };
  };
  commissions: {
    title: string;
    description: string;
    items: string[];
  };
  exhibitions: {
    title: string;
    items: Exhibition[];
  };
  contact: {
    title: string;
    description: string;
    inquiryEmail: string;
    methods: ContactMethod[];
  };
}

export interface ArtworksData {
  artworks: Artwork[];
}

export interface ImagineItem {
  id: string;
  title?: string;
  image: string;
  order: number;
}

export interface ImagineItemsData {
  items: ImagineItem[];
}

export interface ContactInquiry {
  name: string;
  email: string;
  subject: "commission" | "exhibition" | "purchase" | "collaboration" | "other";
  message: string;
}
