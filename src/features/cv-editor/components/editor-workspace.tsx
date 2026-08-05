"use client";

import { PersonalInfoSection } from "@/features/cv-editor/components/sections/personal-info-section";
import { SummarySection } from "@/features/cv-editor/components/sections/summary-section";
import { ExperienceSection } from "@/features/cv-editor/components/sections/experience-section";
import { EducationSection } from "@/features/cv-editor/components/sections/education-section";
import { SkillsSection } from "@/features/cv-editor/components/sections/skills-section";
import { ProjectsSection } from "@/features/cv-editor/components/sections/projects-section";
import {
  AchievementsSection,
  CertificationsSection,
  CustomSection,
  LanguagesSection,
  ReferencesSection,
} from "@/features/cv-editor/components/sections/misc-sections";
import { AISuggestionCard } from "@/features/cv-editor/components/ai-suggestion-card";
import { useEditor } from "@/features/cv-editor/context/editor-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EditorWorkspace() {
  const { document, addCustomSection, aiSuggestion, aiOpen } = useEditor();

  return (
    <div
      id="editor-scroll"
      className="min-h-0 flex-1 overflow-y-auto border-r border-line bg-paper"
    >
      <div className="mx-auto max-w-[760px] space-y-4 px-4 py-7 pb-28 sm:px-8">
        {aiSuggestion && !aiOpen ? (
          <div className="lg:hidden">
            <AISuggestionCard />
          </div>
        ) : null}

        {document.sections
          .filter((s) => s.visible || s.type === "custom")
          .map((section) => {
            switch (section.type) {
              case "personal":
                return <PersonalInfoSection key={section.id} />;
              case "summary":
                return <SummarySection key={section.id} />;
              case "experience":
                return <ExperienceSection key={section.id} />;
              case "education":
                return <EducationSection key={section.id} />;
              case "skills":
                return <SkillsSection key={section.id} />;
              case "projects":
                return <ProjectsSection key={section.id} />;
              case "certifications":
                return <CertificationsSection key={section.id} />;
              case "languages":
                return <LanguagesSection key={section.id} />;
              case "achievements":
                return <AchievementsSection key={section.id} />;
              case "references":
                return <ReferencesSection key={section.id} />;
              case "custom":
                return (
                  <CustomSection
                    key={section.id}
                    sectionId={section.id}
                    label={section.label}
                  />
                );
              default:
                return null;
            }
          })}

        <Button
          type="button"
          variant="outline"
          shape="soft"
          className="w-full rounded-[14px] border-dashed py-6 text-ink-faint hover:text-emerald"
          onClick={addCustomSection}
        >
          <Plus className="size-4" /> Add section
        </Button>
      </div>
    </div>
  );
}
