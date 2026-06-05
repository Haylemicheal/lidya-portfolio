"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import type { ContactMethod, Exhibition, SiteContent } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

const emptyContent: SiteContent = {
  hero: { title: "", subtitle: "", backgroundImage: "", featuredImages: [] },
  about: { title: "", paragraphs: [""], pullQuote: "", portraitImage: "" },
  portfolio: { title: "", description: "" },
  commissions: { title: "Work With Me", description: "", items: [] },
  exhibitions: { title: "Selected Shows", items: [] },
  contact: { title: "", description: "", inquiryEmail: "", methods: [] },
};

export default function AdminSettingsPage() {
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data: SiteContent) => {
        setContent({
          ...emptyContent,
          ...data,
          hero: { ...emptyContent.hero, ...data.hero },
          about: { ...emptyContent.about, ...data.about },
          portfolio: { ...emptyContent.portfolio, ...data.portfolio },
          commissions: { ...emptyContent.commissions, ...data.commissions },
          exhibitions: { ...emptyContent.exhibitions, ...data.exhibitions },
          contact: { ...emptyContent.contact, ...data.contact },
        });
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

  const updateExhibition = (index: number, field: keyof Exhibition, value: string | number) => {
    const items = [...content.exhibitions.items];
    items[index] = { ...items[index], [field]: value };
    setContent({ ...content, exhibitions: { ...content.exhibitions, items } });
  };

  const addExhibition = () => {
    setContent({
      ...content,
      exhibitions: {
        ...content.exhibitions,
        items: [...content.exhibitions.items, { year: new Date().getFullYear(), title: "", venue: "" }],
      },
    });
  };

  const removeExhibition = (index: number) => {
    setContent({
      ...content,
      exhibitions: {
        ...content.exhibitions,
        items: content.exhibitions.items.filter((_, i) => i !== index),
      },
    });
  };

  const updateCommissionItem = (index: number, value: string) => {
    const items = [...content.commissions.items];
    items[index] = value;
    setContent({ ...content, commissions: { ...content.commissions, items } });
  };

  const addCommissionItem = () => {
    setContent({
      ...content,
      commissions: {
        ...content.commissions,
        items: [...content.commissions.items, ""],
      },
    });
  };

  const removeCommissionItem = (index: number) => {
    setContent({
      ...content,
      commissions: {
        ...content.commissions,
        items: content.commissions.items.filter((_, i) => i !== index),
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
          <div className="space-y-2">
            <Label>Featured hero images (one URL per line)</Label>
            <Textarea
              value={(content.hero.featuredImages ?? []).join("\n")}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: {
                    ...content.hero,
                    featuredImages: e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  },
                })
              }
              rows={4}
              placeholder="/media/art3.jpg"
            />
          </div>
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
          <div className="space-y-2">
            <Label>Pull Quote</Label>
            <Textarea
              value={content.about.pullQuote ?? ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, pullQuote: e.target.value },
                })
              }
              rows={3}
              placeholder="A highlighted quote for the about section"
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
            <h2 className="font-serif text-xl font-semibold">Commissions Section</h2>
            <Button variant="outline" size="sm" onClick={addCommissionItem}>
              <Plus size={16} />
              Add Item
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.commissions.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  commissions: { ...content.commissions, title: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.commissions.description}
              onChange={(e) =>
                setContent({
                  ...content,
                  commissions: { ...content.commissions, description: e.target.value },
                })
              }
              rows={2}
            />
          </div>
          {content.commissions.items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateCommissionItem(index, e.target.value)}
                placeholder="Commission or collaboration type"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCommissionItem(index)}
                className="text-destructive hover:text-destructive shrink-0"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </section>

        <section className="bg-background border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Exhibitions Section</h2>
            <Button variant="outline" size="sm" onClick={addExhibition}>
              <Plus size={16} />
              Add Show
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              value={content.exhibitions.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  exhibitions: { ...content.exhibitions, title: e.target.value },
                })
              }
            />
          </div>
          {content.exhibitions.items.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Show {index + 1}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExhibition(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={item.year}
                    onChange={(e) =>
                      updateExhibition(index, "year", parseInt(e.target.value, 10) || item.year)
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateExhibition(index, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-3">
                  <Label>Venue</Label>
                  <Input
                    value={item.venue}
                    onChange={(e) => updateExhibition(index, "venue", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
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
          <div className="space-y-2">
            <Label>Inquiry form recipient email</Label>
            <Input
              type="email"
              value={content.contact.inquiryEmail}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, inquiryEmail: e.target.value },
                })
              }
              placeholder="artist@example.com"
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
