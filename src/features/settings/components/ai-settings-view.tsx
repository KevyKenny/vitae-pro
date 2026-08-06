"use client";

import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { PreferenceCard, RadioCard } from "@/features/settings/components/preference-card";
import { ToggleSetting } from "@/features/settings/components/toggle-setting";
import { useSettingsSave } from "@/features/settings/hooks/use-settings-save";
import {
  assistanceLevelOptions,
  careerFocusOptions,
  mockSettingsAiPreferences,
  writingStyleOptions,
} from "@/mocks/settings";
import type {
  AiPreferences,
  AssistanceLevel,
  CareerFocusId,
  WritingStyle,
} from "@/features/settings/types";
import { EmptyState } from "@/components/shared/empty-state";
import { Sparkles } from "lucide-react";

export function AiSettingsView() {
  const [prefs, setPrefs] = useState<AiPreferences>(mockSettingsAiPreferences);
  const { saveStatus, scheduleSave, saveNow, retry } = useSettingsSave();

  const update = (patch: Partial<AiPreferences>) => {
    setPrefs((p) => ({ ...p, ...patch }));
    scheduleSave();
  };

  const toggleFocus = (id: CareerFocusId) => {
    setPrefs((p) => {
      const next = p.careerFocus.includes(id)
        ? p.careerFocus.filter((x) => x !== id)
        : [...p.careerFocus, id];
      return { ...p, careerFocus: next };
    });
    scheduleSave();
  };

  const noneConfigured =
    !prefs.autoSuggest &&
    !prefs.highlightWeak &&
    !prefs.recommendKeywords &&
    !prefs.improveGrammar &&
    !prefs.generateAchievements &&
    !prefs.suggestSkills;

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="AI Preferences"
        description="Tune how VitatePro coaches your writing — tone, depth, and focus."
        saveStatus={saveStatus}
        onRetry={retry}
        onSave={() => void saveNow()}
      />

      {noneConfigured ? (
        <EmptyState
          icon={Sparkles}
          title="No preferences configured"
          description="Enable default AI actions so the coach can help as you write."
          actionLabel="Enable balanced defaults"
          onAction={() =>
            update({
              autoSuggest: true,
              highlightWeak: true,
              recommendKeywords: true,
              improveGrammar: true,
              suggestSkills: true,
              assistanceLevel: "balanced",
            })
          }
          className="py-10"
        />
      ) : null}

      <SectionCard title="Writing style">
        <div className="grid gap-2 pb-4 sm:grid-cols-2">
          {writingStyleOptions.map((opt) => (
            <RadioCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={prefs.writingStyle === opt.id}
              onSelect={() => update({ writingStyle: opt.id as WritingStyle })}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="AI assistance level">
        <div className="grid gap-2 pb-4 md:grid-cols-3">
          {assistanceLevelOptions.map((opt) => (
            <RadioCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={prefs.assistanceLevel === opt.id}
              onSelect={() =>
                update({ assistanceLevel: opt.id as AssistanceLevel })
              }
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Default AI actions">
        <div className="space-y-2 pb-4">
          <ToggleSetting
            id="autoSuggest"
            title="Automatically suggest improvements"
            description="Surface inline coaching while you edit."
            checked={prefs.autoSuggest}
            onCheckedChange={(v) => update({ autoSuggest: v })}
          />
          <ToggleSetting
            id="highlightWeak"
            title="Highlight weak descriptions"
            description="Flag vague bullets without measurable impact."
            checked={prefs.highlightWeak}
            onCheckedChange={(v) => update({ highlightWeak: v })}
          />
          <ToggleSetting
            id="recommendKeywords"
            title="Recommend keywords"
            description="Match role and industry language."
            checked={prefs.recommendKeywords}
            onCheckedChange={(v) => update({ recommendKeywords: v })}
          />
          <ToggleSetting
            id="improveGrammar"
            title="Improve grammar"
            description="Light copy edits for clarity and tense."
            checked={prefs.improveGrammar}
            onCheckedChange={(v) => update({ improveGrammar: v })}
          />
          <ToggleSetting
            id="generateAchievements"
            title="Generate achievements"
            description="Draft metric-forward bullet alternatives."
            checked={prefs.generateAchievements}
            onCheckedChange={(v) => update({ generateAchievements: v })}
          />
          <ToggleSetting
            id="suggestSkills"
            title="Suggest missing skills"
            description="Recommend skills based on your experience and target roles."
            checked={prefs.suggestSkills}
            onCheckedChange={(v) => update({ suggestSkills: v })}
          />
        </div>
      </SectionCard>

      <SectionCard title="Career focus">
        <div className="grid gap-2 pb-4 sm:grid-cols-2">
          {careerFocusOptions.map((opt) => (
            <PreferenceCard
              key={opt.id}
              title={opt.label}
              description={opt.description}
              selected={prefs.careerFocus.includes(opt.id)}
              onClick={() => toggleFocus(opt.id)}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
