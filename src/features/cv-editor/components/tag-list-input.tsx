"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TagListInput({
  value,
  onChange,
  label,
  placeholder = "Add item",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  label: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const next = draft.trim();
    if (!next) return;
    if (value.some((item) => item.toLowerCase() === next.toLowerCase())) return;
    onChange([...value, next]);
    setDraft("");
  }

  function remove(item: string) {
    onChange(value.filter((entry) => entry !== item));
  }

  return (
    <div className="space-y-2">
      <Label className="text-[0.76rem] uppercase text-ink-soft">{label}</Label>
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5"
            >
              <span className="text-sm font-medium text-ink">{item}</span>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remove ${item}`}
                className="text-ink-faint hover:text-ink"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="bg-surface"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" shape="soft" onClick={add}>
          <Plus className="size-4" /> Add
        </Button>
      </div>
    </div>
  );
}
