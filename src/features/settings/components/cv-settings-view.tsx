"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SectionCard } from "@/components/shared/section-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { SelectSetting } from "@/features/settings/components/select-setting";
import { RadioCard } from "@/features/settings/components/preference-card";
import { useSettingsSave } from "@/features/settings/hooks/use-settings-save";
import { mockCvPreferences } from "@/mocks/settings";
import {
  galleryTemplates,
  templateFonts,
  colorPalettes,
} from "@/mocks/templates-gallery";
import { mockLanguages } from "@/mocks/onboarding";
import type { CvPreferences, CvStylePref } from "@/features/settings/types";
import type { GalleryTemplate } from "@/features/templates/types";
import {
  getTemplateBySlugOrId,
  getTemplateDbIdBySlug,
  getUserDefaultTemplateId,
  listActiveTemplates,
  setUserDefaultTemplate,
  templateErrorMessage,
} from "@/lib/templates";

const CV_STYLES: { id: CvStylePref; label: string; description: string }[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Single-column layout with clear section headings.",
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
  const [templates, setTemplates] = useState<GalleryTemplate[]>(galleryTemplates);
  const [loading, setLoading] = useState(true);
  const prefsRef = useRef(prefs);
  const { saveStatus, scheduleSave, saveNow, retry } = useSettingsSave();

  prefsRef.current = prefs;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [active, defaultTemplateUuid] = await Promise.all([
          listActiveTemplates(),
          getUserDefaultTemplateId(),
        ]);
        if (cancelled) return;

        const resolvedTemplates =
          active.length > 0 ? active : galleryTemplates;
        setTemplates(resolvedTemplates);

        let defaultTemplateSlug = mockCvPreferences.defaultTemplateId;
        if (defaultTemplateUuid) {
          const match = await getTemplateBySlugOrId(defaultTemplateUuid);
          if (match) {
            defaultTemplateSlug = match.id;
          }
        }

        setPrefs((current) => ({
          ...current,
          defaultTemplateId: defaultTemplateSlug,
        }));
      } catch (error) {
        if (cancelled) return;
        toast.error(templateErrorMessage(error));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistDefaultTemplate = async (slug: string) => {
    const uuid = await getTemplateDbIdBySlug(slug);
    if (!uuid) {
      throw new Error("We couldn't find that template.");
    }
    await setUserDefaultTemplate(uuid);
  };

  const update = (patch: Partial<CvPreferences>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      if (patch.defaultTemplateId !== undefined) {
        scheduleSave(async () => {
          await persistDefaultTemplate(next.defaultTemplateId);
        });
      } else {
        scheduleSave();
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="settings" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="CV Preferences"
        description="Defaults applied when you create a new CV or open the customizer."
        saveStatus={saveStatus}
        onRetry={retry}
        onSave={() =>
          void saveNow(async () => {
            await persistDefaultTemplate(prefsRef.current.defaultTemplateId);
          })
        }
      />

      <SectionCard title="Document defaults">
        <div className="grid gap-4 pb-4 sm:grid-cols-2">
          <SelectSetting
            id="defaultTemplate"
            label="Default CV template"
            value={prefs.defaultTemplateId}
            onChange={(v) => update({ defaultTemplateId: v })}
            options={templates.map((t) => ({
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
          <p className="text-[0.78rem] text-ink-soft">
            PDF export uses <span className="font-semibold text-ink">A4</span>{" "}
            page size.
          </p>
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
