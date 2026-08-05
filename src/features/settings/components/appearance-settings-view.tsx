"use client";

import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { ToggleSetting } from "@/features/settings/components/toggle-setting";
import { useSettingsSave } from "@/features/settings/hooks/use-settings-save";
import { mockAppearancePreferences } from "@/mocks/settings";
import type { AppearancePreferences } from "@/features/settings/types";

export function AppearanceSettingsView() {
  const [prefs, setPrefs] = useState<AppearancePreferences>(
    mockAppearancePreferences,
  );
  const { saveStatus, scheduleSave, saveNow, retry } = useSettingsSave();

  const update = (patch: Partial<AppearancePreferences>) => {
    setPrefs((p) => ({ ...p, ...patch }));
    scheduleSave();
  };

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Appearance"
        description="Theme, accent, motion, and density for the VitatePro workspace."
        saveStatus={saveStatus}
        onRetry={retry}
        onSave={() => void saveNow()}
      />

      <SectionCard title="Look & feel">
        <div className="pb-4">
          <ThemeSelector
            theme={prefs.theme}
            accent={prefs.accent}
            onThemeChange={(theme) => update({ theme })}
            onAccentChange={(accent) => update({ accent })}
          />
        </div>
      </SectionCard>

      <SectionCard title="Behavior">
        <div className="space-y-2 pb-4">
          <ToggleSetting
            id="animations"
            title="Animations"
            description="Subtle motion for panels, saves, and card transitions."
            checked={prefs.animations}
            onCheckedChange={(v) => update({ animations: v })}
          />
          <ToggleSetting
            id="compact"
            title="Compact mode"
            description="Reduce padding in lists and dashboards for denser scanning."
            checked={prefs.compactMode}
            onCheckedChange={(v) => update({ compactMode: v })}
          />
        </div>
      </SectionCard>
    </div>
  );
}
