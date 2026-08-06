"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { SupervisorReference } from "@/features/cv-editor/types";

export function SupervisorFields({
  supervisor,
  includeOnExport,
  onChange,
  onIncludeChange,
}: {
  supervisor: SupervisorReference;
  includeOnExport: boolean;
  onChange: (next: SupervisorReference) => void;
  onIncludeChange: (include: boolean) => void;
}) {
  return (
    <fieldset className="space-y-3 rounded-[12px] border border-line bg-surface p-4">
      <legend className="px-1 text-sm font-semibold text-ink">
        Supervisor reference (optional)
      </legend>
      <p className="text-[0.78rem] leading-relaxed text-ink-faint">
        References are optional. Leave blank if you prefer, and uncheck the
        export option to keep supervisor details off your downloaded CV.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            ["name", "Supervisor name"],
            ["position", "Position"],
            ["email", "Email"],
            ["phone", "Phone number"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-[0.76rem] uppercase text-ink-soft">
              {label}
            </Label>
            <Input
              value={supervisor[key]}
              onChange={(e) =>
                onChange({ ...supervisor, [key]: e.target.value })
              }
              className="bg-surface"
            />
          </div>
        ))}
      </div>
      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <Checkbox
          checked={includeOnExport}
          onCheckedChange={(v) => onIncludeChange(Boolean(v))}
          aria-label="Include supervisor on exported CV"
        />
        <span>Include supervisor details on exported CV</span>
      </label>
    </fieldset>
  );
}
