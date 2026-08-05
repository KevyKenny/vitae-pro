"use client";

import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { SelectSetting } from "@/features/settings/components/select-setting";
import { RadioCard } from "@/features/settings/components/preference-card";
import { useSettingsSave } from "@/features/settings/hooks/use-settings-save";
import { mockCvPreferences } from "@/mocks/settings";
import { galleryTemplates, templateFonts, colorPalettes } from "@/mocks/templates-gallery";
import { mockLanguages } from "@/mocks/onboarding";
import type { CvPreferences, CvStylePref } from "@/features/settings/types";

const CV_STYLES: { id: CvStylePref; label: string; description: string }[] = [
  {
    id: "ats",
    label: "ATS Optimized",
    description: "Single-column, standard headings, maximum parse safety.",
  },
  {
    id: "modern",
    label: "Modern",
    description: "Clean product-era layout with balanced whitespace.",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Editorial accents for design and brand roles.",
  },
  {
    id: "executive",
    label: "Executive",
    description: "Bold hierarchy for senior leadership resumes.",
  },
];

export function CvSettingsView() {
  const [prefs, setPrefs] = useState<CvPreferences>(mockCvPreferences);
  const { saveStatus, scheduleSave, saveNow, retry } = useSettingsSave();

  const update = (patch: Partial<CvPreferences>) => {
    setPrefs((p) => ({ ...p, ...patch }));
    scheduleSave();
  };

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="CV Preferences"
        description="Defaults applied when you create a new CV or open the customizer."
        saveStatus={saveStatus}
        onRetry={retry}
        onSave={() => void saveNow()}
      />

      <SectionCard title="Document defaults">
        <div className="grid gap-4 pb-4 sm:grid-cols-2">
          <SelectSetting
            id="defaultTemplate"
            label="Default CV template"
            value={prefs.defaultTemplateId}
            onChange={(v) => update({ defaultTemplateId: v })}
            options={galleryTemplates.map((t) => ({
              value: t.id,
              label: t.name,
            }))}
          />
          <SelectSetting
            id="defaultFont"
            label="Default font"
            value={prefs.defaultFont}
            onChange={(v) => update({ defaultFont: v })}
            options={templateFonts.map((f) => ({
              value: f.id,
              label: f.label,
            }))}
          />
          <SelectSetting
            id="colorTheme"
            label="Default color theme"
            value={prefs.defaultColorTheme}
            onChange={(v) => update({ defaultColorTheme: v })}
            options={colorPalettes.map((p) => ({
              value: p.id,
              label: p.name,
            }))}
          />
          <SelectSetting
            id="language"
            label="Default language"
            value={prefs.defaultLanguage}
            onChange={(v) => update({ defaultLanguage: v })}
            options={mockLanguages.map((l) => ({
              value: l.code,
              label: l.name,
            }))}
          />
          <SelectSetting
            id="dateFormat"
            label="Date format"
            value={prefs.dateFormat}
            onChange={(v) =>
              update({ dateFormat: v as CvPreferences["dateFormat"] })
            }
            options={[
              { value: "dmy", label: "DD/MM/YYYY" },
              { value: "mdy", label: "MM/DD/YYYY" },
              { value: "ymd", label: "YYYY-MM-DD" },
            ]}
          />
          <SelectSetting
            id="pageSize"
            label="Page size"
            value={prefs.pageSize}
            onChange={(v) =>
              update({ pageSize: v as CvPreferences["pageSize"] })
            }
            options={[
              { value: "a4", label: "A4" },
              { value: "letter", label: "US Letter" },
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard title="CV style">
        <div className="grid gap-2 pb-4 sm:grid-cols-2">
          {CV_STYLES.map((s) => (
            <RadioCard
              key={s.id}
              title={s.label}
              description={s.description}
              selected={prefs.cvStyle === s.id}
              onSelect={() => update({ cvStyle: s.id })}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
