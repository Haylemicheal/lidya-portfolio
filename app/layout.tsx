import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import { resolveContentForDisplay } from "@/lib/storage";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function generateMetadata(): Promise<Metadata> {
  const content = resolveContentForDisplay(await getSiteContent());
  const siteUrl = getSiteUrl();
  const ogImage = content.hero.backgroundImage.startsWith("http")
    ? content.hero.backgroundImage
    : `${siteUrl}${content.hero.backgroundImage}`;

  return {
    title: `${content.hero.title} | ${content.hero.subtitle}`,
    description: content.portfolio.description,
    openGraph: {
      title: `${content.hero.title} | ${content.hero.subtitle}`,
      description: content.portfolio.description,
      type: "website",
      url: siteUrl,
      images: [{ url: ogImage, alt: content.hero.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.hero.title} | ${content.hero.subtitle}`,
      description: content.portfolio.description,
      images: [ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
