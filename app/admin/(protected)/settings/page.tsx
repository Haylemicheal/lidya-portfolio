"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import type { ContactMethod, SiteContent } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

const emptyContent: SiteContent = {
  hero: { title: "", subtitle: "", backgroundImage: "" },
  about: { title: "", paragraphs: [""], portraitImage: "" },
  portfolio: { title: "", description: "" },
  contact: { title: "", description: "", methods: [] },
};

export default function AdminSettingsPage() {
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Failed to save");
      showMessage("Settings saved successfully");
    } catch {
      showMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateContactMethod = (index: number, field: keyof ContactMethod, value: string | boolean) => {
    const methods = [...content.contact.methods];
    methods[index] = { ...methods[index], [field]: value };
    setContent({ ...content, contact: { ...content.contact, methods } });
  };

  const addContactMethod = () => {
    setContent({
      ...content,
      contact: {
        ...content.contact,
        methods: [
          ...content.contact.methods,
          { label: "", value: "", href: "", type: "email" },
        ],
      },
    });
  };

  const removeContactMethod = (index: number) => {
    setContent({
      ...content,
      contact: {
        ...content.contact,
        methods: content.contact.methods.filter((_, i) => i !== index),
      },
    });
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading settings...</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold mb-1">Site Settings</h1>
          <p className="text-muted-foreground">Edit homepage content and images</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-lg bg-foreground text-background text-sm text-center">
          {message}
        </div>
      )}

      <div className="space-y-10">
        <section className="bg-background border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold">Hero Section</h2>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })
              }
            />
          </div>
          <ImageUpload
            label="Background Image"
            value={content.hero.backgroundImage}
            onChange={(url) =>
              setContent({ ...content, hero: { ...content.hero, backgroundImage: url } })
            }
          />
        </section>

        <section className="bg-background border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold">About Section</h2>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.about.title}
              onChange={(e) =>
                setContent({ ...content, about: { ...content.about, title: e.target.value } })
              }
            />
          </div>
          {content.about.paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <Label>Paragraph {index + 1}</Label>
              <Textarea
                value={paragraph}
                onChange={(e) => {
                  const paragraphs = [...content.about.paragraphs];
                  paragraphs[index] = e.target.value;
                  setContent({ ...content, about: { ...content.about, paragraphs } });
                }}
                rows={4}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setContent({
                ...content,
                about: {
                  ...content.about,
                  paragraphs: [...content.about.paragraphs, ""],
                },
              })
            }
          >
            <Plus size={16} />
            Add Paragraph
          </Button>
          <ImageUpload
            label="Portrait Image"
            value={content.about.portraitImage}
            onChange={(url) =>
              setContent({ ...content, about: { ...content.about, portraitImage: url } })
            }
          />
        </section>

        <section className="bg-background border border-border rounded-xl p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold">Portfolio Section</h2>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.portfolio.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  portfolio: { ...content.portfolio, title: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.portfolio.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  portfolio: { ...content.portfolio, description: e.target.value },
                })
              }
              rows={3}
            />
          </div>
        </section>

        <section className="bg-background border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Contact Section</h2>
            <Button variant="outline" size="sm" onClick={addContactMethod}>
              <Plus size={16} />
              Add Method
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.contact.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, title: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.contact.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, description: e.target.value },
                })
              }
              rows={2}
            />
          </div>
          {content.contact.methods.map((method, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Contact Method {index + 1}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeContactMethod(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={method.label}
                    onChange={(e) => updateContactMethod(index, "label", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    value={method.type}
                    onChange={(e) =>
                      updateContactMethod(
                        index,
                        "type",
                        e.target.value as ContactMethod["type"]
                      )
                    }
                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Display Value</Label>
                  <Input
                    value={method.value}
                    onChange={(e) => updateContactMethod(index, "value", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link (href)</Label>
                  <Input
                    value={method.href}
                    onChange={(e) => updateContactMethod(index, "href", e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={method.external ?? false}
                  onChange={(e) => updateContactMethod(index, "external", e.target.checked)}
                  className="rounded"
                />
                Open in new tab (external link)
              </label>
            </div>
          ))}
        </section>
      </div>

      <div className="mt-8 pb-8">
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
}
