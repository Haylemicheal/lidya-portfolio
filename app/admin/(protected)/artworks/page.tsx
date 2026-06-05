"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import { ARTWORK_THEMES, type Artwork, type ArtworkTheme } from "@/lib/types";
import { themeLabel } from "@/lib/artwork-utils";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from "lucide-react";

const emptyForm = {
  title: "",
  slug: "",
  medium: "",
  dimensions: "",
  year: "",
  themes: [] as ArtworkTheme[],
  description: "",
  image: "",
  featured: false,
};

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadArtworks = useCallback(async () => {
    const res = await fetch("/api/artworks");
    const data = await res.json();
    setArtworks(data.artworks ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (artwork: Artwork) => {
    setForm({
      title: artwork.title,
      slug: artwork.slug,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      year: artwork.year?.toString() ?? "",
      themes: artwork.themes,
      description: artwork.description,
      image: artwork.image,
      featured: artwork.featured ?? false,
    });
    setEditing(artwork);
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditing(null);
    setIsCreating(false);
    setForm(emptyForm);
  };

  const toggleTheme = (theme: ArtworkTheme) => {
    setForm((current) => ({
      ...current,
      themes: current.themes.includes(theme)
        ? current.themes.filter((t) => t !== theme)
        : [...current.themes, theme],
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.image.trim()) {
      showMessage("Title and image are required");
      return;
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      medium: form.medium,
      dimensions: form.dimensions,
      year: form.year ? parseInt(form.year, 10) : undefined,
      themes: form.themes,
      description: form.description,
      image: form.image,
      featured: form.featured,
    };

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch("/api/artworks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create artwork");
        showMessage("Artwork created");
      } else if (editing) {
        const res = await fetch(`/api/artworks/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update artwork");
        showMessage("Artwork updated");
      }
      closeForm();
      await loadArtworks();
    } catch {
      showMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/artworks/${id}`, { method: "DELETE" });
    if (res.ok) {
      showMessage("Artwork deleted");
      await loadArtworks();
    } else {
      showMessage("Failed to delete artwork");
    }
  };

  const moveArtwork = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= artworks.length) return;

    const reordered = [...artworks];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const withOrder = reordered.map((a, i) => ({ ...a, order: i }));

    setArtworks(withOrder);
    await fetch("/api/artworks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artworks: withOrder }),
    });
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading artworks...</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-1">Artworks</h1>
          <p className="text-muted-foreground">
            {artworks.length} painting{artworks.length !== 1 ? "s" : ""} in portfolio
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Add Artwork
        </Button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-foreground text-background text-sm text-center">
          {message}
        </div>
      )}

      {(isCreating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold">
                {isCreating ? "Add Artwork" : "Edit Artwork"}
              </h2>
              <button onClick={closeForm} className="p-1 hover:bg-muted rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Artwork title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="the-guardian"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medium">Medium</Label>
                  <Input
                    id="medium"
                    value={form.medium}
                    onChange={(e) => setForm({ ...form, medium: e.target.value })}
                    placeholder="Oil on canvas"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    placeholder="40 × 50 cm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year (optional)</Label>
                <Input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Themes</Label>
                <div className="flex flex-wrap gap-2">
                  {ARTWORK_THEMES.map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => toggleTheme(theme)}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                        form.themes.includes(theme)
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      {themeLabel(theme)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Artist statement about this piece..."
                  rows={5}
                />
              </div>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded"
                />
                Feature in hero rotation
              </label>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? "Saving..." : isCreating ? "Create" : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className="flex items-center gap-4 bg-background border border-border rounded-xl p-4"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{artwork.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {[artwork.dimensions, artwork.medium].filter(Boolean).join(" · ") ||
                  "No details"}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveArtwork(index, "up")}
                disabled={index === 0}
                aria-label="Move up"
              >
                <ChevronUp size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveArtwork(index, "down")}
                disabled={index === artworks.length - 1}
                aria-label="Move down"
              >
                <ChevronDown size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(artwork)}
                aria-label="Edit"
              >
                <Pencil size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(artwork.id, artwork.title)}
                aria-label="Delete"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
