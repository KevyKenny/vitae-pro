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

function ActiveSectionView({ sectionId }: { sectionId: string }) {
  const { document } = useEditor();
  const section = document.sections.find((s) => s.id === sectionId);

  if (!section) return null;

  switch (section.type) {
    case "personal":
      return <PersonalInfoSection />;
    case "summary":
      return <SummarySection />;
    case "experience":
      return <ExperienceSection />;
    case "education":
      return <EducationSection />;
    case "skills":
      return <SkillsSection />;
    case "projects":
      return <ProjectsSection />;
    case "certifications":
      return <CertificationsSection />;
    case "languages":
      return <LanguagesSection />;
    case "achievements":
      return <AchievementsSection />;
    case "references":
      return <ReferencesSection />;
    case "custom":
      return <CustomSection sectionId={section.id} label={section.label} />;
    default:
      return null;
  }
}

/** Left input pane — shows the active section only (matches desktop mock). */
export function EditorWorkspace() {
  const { document, activeSectionId, aiSuggestion, aiOpen } = useEditor();
  const activeId =
    document.sections.find((s) => s.id === activeSectionId)?.id ??
    document.sections[0]?.id;

  return (
    <div
      id="editor-scroll"
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-surface"
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex h-full w-full max-w-none flex-col">
          {aiSuggestion && !aiOpen ? (
            <div className="px-4 pt-4 lg:hidden sm:px-6">
              <AISuggestionCard />
            </div>
          ) : null}

          <div className="min-h-0 flex-1">
            {activeId ? <ActiveSectionView sectionId={activeId} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
