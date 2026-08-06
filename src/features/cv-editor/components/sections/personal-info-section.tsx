"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditorSectionCard } from "@/features/cv-editor/components/editor-section-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";

export function PersonalInfoSection() {
  const { document, updateDocument } = useEditor();
  const { personal } = document;
  const [draftLink, setDraftLink] = useState("");

  function patch<K extends keyof typeof personal>(
    key: K,
    value: (typeof personal)[K],
  ) {
    updateDocument((prev) => ({
      ...prev,
      personal: { ...prev.personal, [key]: value },
    }));
  }

  function addSocialLink() {
    const next = draftLink.trim();
    if (!next) return;
    if (personal.socialLinks.some((s) => s.toLowerCase() === next.toLowerCase())) {
      toast.message("Link already added");
      return;
    }
    patch("socialLinks", [...personal.socialLinks, next]);
    setDraftLink("");
  }

  const initials = personal.fullName
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <EditorSectionCard sectionId="sec_personal" title="Personal Information">
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-gold-wash font-serif text-xl font-semibold text-gold">
          {initials || "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">Profile photo</p>
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="mt-2 rounded-[8px]"
            onClick={() =>
              toast.message("Change photo", {
                description: "Upload is UI-only for now.",
              })
            }
          >
            Change photo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["fullName", "Full name"],
            ["title", "Professional title"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["linkedin", "LinkedIn"],
            ["portfolio", "Portfolio website"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[0.76rem] font-semibold tracking-[0.04em] text-ink-soft uppercase">
              {label}
            </Label>
            <Input
              value={personal[key]}
              onChange={(e) => patch(key, e.target.value)}
              className="bg-paper"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <Label className="text-[0.76rem] font-semibold tracking-[0.04em] text-ink-soft uppercase">
          Social links
        </Label>
        <div className="flex flex-wrap gap-2">
          {personal.socialLinks.map((link) => (
            <span
              key={link}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-paper-dim px-2.5 py-1 text-[0.78rem] text-ink-soft"
            >
              <span className="truncate">{link}</span>
              <button
                type="button"
                className="rounded-full p-0.5 hover:bg-line/60 hover:text-ink"
                aria-label={`Remove ${link}`}
                onClick={() =>
                  patch(
                    "socialLinks",
                    personal.socialLinks.filter((s) => s !== link),
                  )
                }
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            value={draftLink}
            onChange={(e) => setDraftLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSocialLink();
              }
            }}
            placeholder="Add a URL"
            className="max-w-xs bg-paper"
            aria-label="New social link"
          />
          <Button
            type="button"
            variant="outline"
            shape="soft"
            className="rounded-[8px]"
            onClick={addSocialLink}
          >
            <Plus className="size-4" /> Add social link
          </Button>
        </div>
      </div>
    </EditorSectionCard>
  );
}
