"use client";

import { UserRound } from "lucide-react";
import type { CvDocument } from "@/features/cv-editor/types";
import type { TemplateRenderContext } from "@/lib/templates/definitions/types";
import {
  buildContactIconItems,
  DocGroupedSkills,
  DocSectionHeading,
} from "@/components/document/templates/primitives";
import { groupedSkills } from "@/features/cv-editor/constants/skills";
import {
  createBlockBuilder,
  nextId,
  pushBlock,
  softSkillItems,
  type BlockBuilderState,
} from "@/components/document/templates/block-builder-utils";
import { cn } from "@/lib/utils";

export type SidebarBlockOptions = {
  /** Show the coloured name band above the sidebar content on page one. */
  withHeaderBand?: boolean;
  withIcons?: boolean;
  personalLabel?: string;
  skillsLabel?: string;
  qualitiesLabel?: string;
  groupSkills?: boolean;
  /** Override a skill-category heading, e.g. technical → Programming Languages. */
  skillGroupLabel?: (group: { id: string; label: string }) => string;
};

export function SidebarHeaderBand({
  document,
  className,
}: {
  document: CvDocument;
  className?: string;
}) {
  const { personal } = document;
  return (
    <header className={cn("tpl-header-band", className)}>
      <p className="tpl-header-name">{personal.fullName}</p>
      {personal.useAsHeadline && personal.title ? (
        <p className="tpl-header-title">{personal.title}</p>
      ) : null}
    </header>
  );
}

function SidebarContactItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) {
  return (
    <div className="tpl-sidebar-contact-item">
      <span className="tpl-sidebar-contact-icon">{icon}</span>
      {href ? (
        <a
          href={href}
          target={
            href.startsWith("http://") || href.startsWith("https://")
              ? "_blank"
              : undefined
          }
          rel={
            href.startsWith("http://") || href.startsWith("https://")
              ? "noopener noreferrer"
              : undefined
          }
        >
          {label}
        </a>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
}

/**
 * Sidebar content as measurable blocks so a long rail (contacts, skills,
 * qualities) flows onto later pages instead of being clipped.
 */
export function appendSidebarBlocks(
  state: BlockBuilderState,
  document: CvDocument,
  options: SidebarBlockOptions = {},
) {
  const {
    withHeaderBand = true,
    withIcons = true,
    personalLabel = "Personal details",
    skillsLabel = "Skills",
    qualitiesLabel = "Qualities",
    groupSkills = true,
  } = options;

  if (withHeaderBand) {
    pushBlock(state, {
      id: nextId(state, "sidebar-band"),
      kind: "header",
      region: "sidebar",
      render: () => <SidebarHeaderBand document={document} />,
    });
  }

  const contactItems = buildContactIconItems(document.personal);
  if (document.personal.fullName || contactItems.length > 0) {
    pushBlock(state, {
      id: nextId(state, "sidebar-personal-title"),
      kind: "section-title",
      region: "sidebar",
      orphanGuard: true,
      keepWithNext: true,
      render: () => <DocSectionHeading title={personalLabel} variant="sidebar" />,
    });

    if (document.personal.fullName) {
      pushBlock(state, {
        id: nextId(state, "sidebar-contact-name"),
        kind: "paragraph",
        region: "sidebar",
        render: () => (
          <SidebarContactItem
            icon={
              withIcons ? (
                <UserRound className="tpl-sidebar-icon" aria-hidden />
              ) : null
            }
            label={document.personal.fullName}
          />
        ),
      });
    }

    contactItems.forEach((item, index) => {
      pushBlock(state, {
        id: nextId(state, `sidebar-contact-${index}`),
        kind: "paragraph",
        region: "sidebar",
        render: () => (
          <SidebarContactItem
            icon={withIcons ? item.icon : null}
            label={item.label}
            href={item.href}
          />
        ),
      });
    });
  }

  const skillGroups = groupedSkills(document).filter(
    (group) => !group.label.toLowerCase().includes("soft"),
  );

  if (skillGroups.length > 0) {
    pushBlock(state, {
      id: nextId(state, "sidebar-skills-title"),
      kind: "section-title",
      region: "sidebar",
      orphanGuard: true,
      keepWithNext: true,
      render: () => <DocSectionHeading title={skillsLabel} variant="sidebar" />,
    });

    for (const group of skillGroups) {
      pushBlock(state, {
        id: nextId(state, `sidebar-skill-${group.id}`),
        kind: "skills-group",
        region: "sidebar",
        render: () =>
          groupSkills ? (
            <DocGroupedSkills
              groups={[
                {
                  label: (
                    options.skillGroupLabel?.(group) ?? group.label
                  ).toUpperCase(),
                  skills: group.skills.map((s) => s.name),
                },
              ]}
            />
          ) : (
            <p className="tpl-skill-group-items">
              {group.skills.map((s) => s.name).join(", ")}
            </p>
          ),
      });
    }
  }

  const qualities = softSkillItems(document);
  if (qualities.length > 0) {
    pushBlock(state, {
      id: nextId(state, "sidebar-qualities-title"),
      kind: "section-title",
      region: "sidebar",
      orphanGuard: true,
      keepWithNext: true,
      render: () => <DocSectionHeading title={qualitiesLabel} variant="sidebar" />,
    });

    qualities.forEach((quality, index) => {
      pushBlock(state, {
        id: nextId(state, `sidebar-quality-${index}`),
        kind: "paragraph",
        region: "sidebar",
        render: () => <p className="tpl-quality-item">{quality}</p>,
      });
    });
  }
}

export function buildSidebarBlocks(
  document: CvDocument,
  options: SidebarBlockOptions = {},
) {
  const state = createBlockBuilder();
  appendSidebarBlocks(state, document, options);
  return state.blocks;
}

/** Static sidebar rail for templates that do not paginate their sidebar. */
export function SidebarPanel({
  document,
  ctx,
  variant = "blue",
  withIcons = true,
}: {
  document: CvDocument;
  ctx: TemplateRenderContext;
  variant?: "blue" | "red" | "plain";
  withIcons?: boolean;
}) {
  void ctx;
  const contactItems = buildContactIconItems(document.personal);
  const skillGroups = groupedSkills(document).filter(
    (group) => !group.label.toLowerCase().includes("soft"),
  );
  const qualities = softSkillItems(document);

  return (
    <aside className={sidebarPanelClass(variant)}>
      <DocSectionHeading title="Personal details" variant="sidebar" />
      {document.personal.fullName ? (
        <SidebarContactItem
          icon={withIcons ? <UserRound className="tpl-sidebar-icon" aria-hidden /> : null}
          label={document.personal.fullName}
        />
      ) : null}
      {contactItems.map((item, index) => (
        <SidebarContactItem
          key={`${item.label}-${index}`}
          icon={withIcons ? item.icon : null}
          label={item.label}
          href={item.href}
        />
      ))}
      {skillGroups.length > 0 ? (
        <>
          <DocSectionHeading title="Skills" variant="sidebar" />
          <DocGroupedSkills
            groups={skillGroups.map((group) => ({
              label: group.label.toUpperCase(),
              skills: group.skills.map((s) => s.name),
            }))}
          />
        </>
      ) : null}
      {qualities.length > 0 ? (
        <>
          <DocSectionHeading title="Qualities" variant="sidebar" />
          {qualities.map((quality) => (
            <p key={quality} className="tpl-quality-item">
              {quality}
            </p>
          ))}
        </>
      ) : null}
    </aside>
  );
}

export function sidebarPanelClass(variant: "blue" | "red" | "plain") {
  return cn(
    "tpl-sidebar-panel",
    variant === "blue" && "tpl-sidebar-panel--blue",
    variant === "red" && "tpl-sidebar-panel--red",
    variant === "plain" && "tpl-sidebar-panel--plain",
  );
}
