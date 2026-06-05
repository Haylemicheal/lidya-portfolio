export interface Artwork {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

export interface ContactMethod {
  label: string;
  value: string;
  href: string;
  type: "phone" | "email" | "facebook" | "instagram";
  external?: boolean;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    paragraphs: string[];
    portraitImage: string;
  };
  portfolio: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
    methods: ContactMethod[];
  };
}

export interface ArtworksData {
  artworks: Artwork[];
}
