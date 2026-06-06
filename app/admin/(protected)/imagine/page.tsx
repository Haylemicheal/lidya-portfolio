"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";
import type { ImagineItem } from "@/lib/types";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from "lucide-react";

const emptyForm = {
  title: "",
  image: "",
};

export default function AdminImaginePage() {
  const [items, setItems] = useState<ImagineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<ImagineItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/imagine-items");
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (item: ImagineItem) => {
    setForm({
      title: item.title ?? "",
      image: item.image,
    });
    setEditing(item);
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditing(null);
    setIsCreating(false);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.image.trim()) {
      showMessage("Image is required");
      return;
    }

    const payload = {
      title: form.title.trim() || undefined,
      image: form.image,
    };

    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch("/api/imagine-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create item");
        showMessage("Image added");
      } else if (editing) {
        const res = await fetch(`/api/imagine-items/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update item");
        showMessage("Image updated");
      }
      closeForm();
      await loadItems();
    } catch {
      showMessage("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title?: string) => {
    const label = title || "this image";
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/imagine-items/${id}`, { method: "DELETE" });
    if (res.ok) {
      showMessage("Image deleted");
      await loadItems();
    } else {
      showMessage("Failed to delete image");
    }
  };

  const moveItem = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const reordered = [...items];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    const withOrder = reordered.map((item, i) => ({ ...item, order: i }));

    setItems(withOrder);
    await fetch("/api/imagine-items", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: withOrder }),
    });
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading images...</p>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-1">Imagine it There</h1>
          <p className="text-muted-foreground">
            {items.length} room mockup{items.length !== 1 ? "s" : ""} in portfolio
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Add Image
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
                {isCreating ? "Add Room Mockup" : "Edit Room Mockup"}
              </h2>
              <button onClick={closeForm} className="p-1 hover:bg-muted rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Living room, gallery wall..."
                />
              </div>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
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
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-background border border-border rounded-xl p-4"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <Image
                src={item.image}
                alt={item.title || "Room mockup"}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">
                {item.title || "Untitled mockup"}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                Room mockup image
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                aria-label="Move up"
              >
                <ChevronUp size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveItem(index, "down")}
                disabled={index === items.length - 1}
                aria-label="Move down"
              >
                <ChevronDown size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(item)}
                aria-label="Edit"
              >
                <Pencil size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.id, item.title)}
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
