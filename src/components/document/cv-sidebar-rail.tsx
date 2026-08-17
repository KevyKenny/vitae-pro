import type { CvDocument } from "@/features/cv-editor/types";
import { DocContactLine } from "@/components/document/document-links";
import type { DocumentStyleVars } from "@/components/document/types";
import { groupedSkills } from "@/features/cv-editor/constants/skills";
import {
  formatPersonalContactLine,
  visibleOptionalPersonalDetails,
} from "@/lib/cvs/personal-info";

function DocSection({
  title,
  spacing,
  children,
}: {
  title: string;
  spacing: number;
  children: React.ReactNode;
}) {
  return (
    <section className="doc-section" style={{ marginTop: spacing }}>
      <h2 className="doc-section-title">{title}</h2>
      {children}
    </section>
  );
}

export function CvSidebarRail({
  document,
  resolved,
}: {
  document: CvDocument;
  resolved: DocumentStyleVars;
}) {
  const { personal } = document;
  const contactItems = [
    {
      label: personal.email,
      href: personal.email ? `mailto:${personal.email}` : undefined,
    },
    {
      label: personal.phone,
      href: personal.phone ? `tel:${personal.phone}` : undefined,
    },
    ...formatPersonalContactLine(personal).map((line) => ({ label: line })),
    ...visibleOptionalPersonalDetails(personal).map((item) => ({
      label: `${item.label}: ${item.value}`,
    })),
  ];

  return (
    <aside className="doc-sidebar">
      <p className="font-semibold">{personal.fullName.split(" ")[0]}</p>
      <DocContactLine items={contactItems} className="doc-cl-meta mt-2" />
      {groupedSkills(document).map((group) => (
        <DocSection
          key={group.id}
          title={group.label}
          spacing={resolved.sectionSpacing}
        >
          <p className="doc-body">{group.skills.map((s) => s.name).join(" · ")}</p>
        </DocSection>
      ))}
    </aside>
  );
}
