import Link from "next/link";
import { getArtworks, getImagineItems, getSiteContent } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Frame, Image, Settings } from "lucide-react";

export default async function AdminDashboard() {
  const [content, artworks, imagineItems] = await Promise.all([
    getSiteContent(),
    getArtworks(),
    getImagineItems(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage your portfolio content and artworks
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-background border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Artworks</p>
          <p className="text-3xl font-semibold">{artworks.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Room Mockups</p>
          <p className="text-3xl font-semibold">{imagineItems.length}</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Contact Methods</p>
          <p className="text-3xl font-semibold">{content.contact.methods.length}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Button asChild size="lg" className="h-auto py-6 justify-start gap-4">
          <Link href="/admin/artworks">
            <Image size={24} />
            <div className="text-left">
              <p className="font-medium">Manage Artworks</p>
              <p className="text-xs font-normal opacity-80">
                Upload, edit, delete, and reorder paintings
              </p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-auto py-6 justify-start gap-4">
          <Link href="/admin/imagine">
            <Frame size={24} />
            <div className="text-left">
              <p className="font-medium">Imagine it There</p>
              <p className="text-xs font-normal opacity-80">
                Upload room mockups showing art in real spaces
              </p>
            </div>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-auto py-6 justify-start gap-4">
          <Link href="/admin/settings">
            <Settings size={24} />
            <div className="text-left">
              <p className="font-medium">Site Settings</p>
              <p className="text-xs font-normal opacity-80">
                Edit hero, about, portfolio, and contact sections
              </p>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
