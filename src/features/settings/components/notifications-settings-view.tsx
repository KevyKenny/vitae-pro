"use client";

import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { NotificationSetting } from "@/features/settings/components/toggle-setting";
import { useSettingsSave } from "@/features/settings/hooks/use-settings-save";
import { mockNotificationPreferences } from "@/mocks/settings";
import type { NotificationPreferences } from "@/features/settings/types";

const ITEMS: {
  key: keyof NotificationPreferences;
  title: string;
  description: string;
}[] = [
  {
    key: "email",
    title: "Email notifications",
    description: "Account and security messages to your inbox.",
  },
  {
    key: "productUpdates",
    title: "Product updates",
    description: "New features and important product news.",
  },
  {
    key: "aiSuggestions",
    title: "AI suggestions",
    description: "Weekly digest of coaching opportunities on your CVs.",
  },
  {
    key: "cvReminders",
    title: "CV improvement reminders",
    description: "Nudges when a draft hasn’t been touched in a while.",
  },
  {
    key: "templateReleases",
    title: "Template releases",
    description: "New layouts and customization packs.",
  },
  {
    key: "tips",
    title: "Tips and recommendations",
    description: "Career tips tailored to your goals.",
  },
];

export function NotificationsSettingsView() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(
    mockNotificationPreferences,
  );
  const { saveStatus, scheduleSave, saveNow, retry } = useSettingsSave();

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Notifications"
        description="Choose what VitatePro emails and nudges you about."
        saveStatus={saveStatus}
        onRetry={retry}
        onSave={() => void saveNow()}
      />

      <SectionCard title="Preferences">
        <div className="space-y-2 pb-4">
          {ITEMS.map((item) => (
            <NotificationSetting
              key={item.key}
              id={item.key}
              title={item.title}
              description={item.description}
              checked={prefs[item.key]}
              onCheckedChange={(checked) => {
                setPrefs((p) => ({ ...p, [item.key]: checked }));
                scheduleSave();
              }}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
